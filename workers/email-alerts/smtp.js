// Gmail SMTPS transport. The caller fixes both authenticated sender and recipient.
const encoder = new TextEncoder();
const safeAddress = value => typeof value === 'string' && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
const fail = code => Object.assign(new Error(code), { code });
const base64 = value => btoa(Array.from(encoder.encode(value), byte => String.fromCharCode(byte)).join(''));

export async function sendGoogleMail(connect, mail, timeoutMs = 15000) {
  if (!safeAddress(mail.user) || !mail.user.endsWith('@gmail.com') || !safeAddress(mail.to)
    || !mail.password || !/^[\x20-\x7e]{1,120}$/.test(mail.subject)) throw fail('INVALID_CONFIGURATION');
  const id = crypto.randomUUID();
  const socket = connect({ hostname: 'smtp.gmail.com', port: 465 }, { secureTransport: 'on' });
  socket.closed.catch(() => {});
  const reader = socket.readable.getReader(), writer = socket.writable.getWriter();
  const decoder = new TextDecoder();
  let buffer = '', timedOut = false;
  const timer = setTimeout(() => { timedOut = true; socket.close().catch(() => {}); }, timeoutMs);
  async function line() {
    while (!buffer.includes('\n')) {
      const chunk = await reader.read();
      if (chunk.done) throw fail('SMTP_CLOSED');
      buffer += decoder.decode(chunk.value, { stream: true });
      if (buffer.length > 65536) throw fail('SMTP_RESPONSE_LIMIT');
    }
    const end = buffer.indexOf('\n'), value = buffer.slice(0, end).replace(/\r$/, '');
    buffer = buffer.slice(end + 1);
    return value;
  }
  async function response(expected) {
    for (let i = 0; i < 100; i++) {
      const match = /^(\d{3})([ -])/.exec(await line());
      if (!match) throw fail('SMTP_PROTOCOL');
      if (Number(match[1]) !== expected) throw fail(`SMTP_${match[1]}`);
      if (match[2] === ' ') return;
    }
    throw fail('SMTP_RESPONSE_LIMIT');
  }
  async function command(value, expected) { await writer.write(encoder.encode(value + '\r\n')); await response(expected); }
  try {
    await socket.opened;
    await response(220);
    await command('EHLO tahmid-email-alerts.workers.dev', 250);
    await command('AUTH LOGIN', 334);
    await command(base64(mail.user), 334);
    await command(base64(mail.password), 235);
    await command(`MAIL FROM:<${mail.user}>`, 250);
    await command(`RCPT TO:<${mail.to}>`, 250);
    await command('DATA', 354);
    const message = [
      `From: Tahmid English Hub <${mail.user}>`, `To: <${mail.to}>`,
      `Subject: ${mail.subject}`, `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${id}@gmail.com>`, 'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '',
      base64(mail.text).match(/.{1,76}/g)?.join('\r\n') || '', '.',
    ].join('\r\n');
    await command(message, 250);
    // Once DATA is accepted, a dropped QUIT must not cause duplicate retries.
    try { await command('QUIT', 221); } catch {}
    return { messageId: id, accepted: true };
  } catch (error) {
    throw fail(timedOut ? 'SMTP_TIMEOUT' : /^SMTP_[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'SMTP_CONNECTION_FAILED');
  } finally {
    clearTimeout(timer);
    try { reader.releaseLock(); writer.releaseLock(); await socket.close(); } catch {}
  }
}
