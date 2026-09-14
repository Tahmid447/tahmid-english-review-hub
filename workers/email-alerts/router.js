const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });
export async function authorized(request, env) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32) return false;
  const encoder = new TextEncoder();
  const hashes = await Promise.all([request.headers.get('authorization') || '', `Bearer ${env.ADMIN_TOKEN}`]
    .map(value => crypto.subtle.digest('SHA-256', encoder.encode(value))));
  const [left, right] = hashes.map(hash => new Uint8Array(hash));
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}
export function createHandler(send) {
  return async (request, env) => {
    const path = new URL(request.url).pathname;
    if (path === '/health' && request.method === 'GET') return reply(200, { service: 'email-alerts', version: 2 });
    if (path !== '/test' || request.method !== 'POST') return reply(404, { error: 'Not found' });
    if (!await authorized(request, env)) return reply(401, { error: 'Unauthorized' });
    if (env.SEND_ENABLED !== 'true') return reply(409, { error: 'Diagnostic sending is disabled' });
    if (!env.OWNER_EMAIL || !env.SMTP_USER || !env.SMTP_PASSWORD) return reply(503, { error: 'Not configured' });
    try {
      const result = await send({ user: env.SMTP_USER, password: env.SMTP_PASSWORD, to: env.OWNER_EMAIL,
        subject: 'English Hub owner notification - Gmail transport check',
        text: 'This is the requested owner-only delivery check from the English Hub Cloudflare Worker through Gmail SMTP. No student password, verification code or sign-in link is included.' });
      return reply(200, result);
    } catch (error) {
      return reply(502, { error: 'Owner notification failed', code: /^SMTP_[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'DELIVERY_FAILED' });
    }
  };
}
