export async function processOwnerEvents(env, send, fetcher = fetch) {
  if (env.ALERTS_ENABLED !== 'true') return { disabled: true };
  if (!env.QUEUE_TOKEN || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.OWNER_EMAIL) throw new Error('ALERT_CONFIGURATION');
  const rpc = async (name, data) => {
    const response = await fetcher(`${env.SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: 'POST', headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_token: env.QUEUE_TOKEN, ...data }), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`QUEUE_HTTP_${response.status}`);
    return response.json();
  };
  const events = await rpc('review_claim_owner_email_events', {});
  if (!events.length) return { processed: 0 };
  const clean = value => String(value).replace(/[\r\n\x00-\x1f\x7f]/g, ' ').slice(0,320);
  const text = [
    'Tahmid English Hub - private owner activity notice', '',
    'These are account events, not delivery receipts. A reset request does not mean that a password has changed.',
    'No password, verification code, or sign-in link is included.', '',
    ...events.map(event => `${event.kind === 'signup' ? 'New signup' : 'Password reset requested'}\nAccount: ${clean(event.email)}\nTime (UTC): ${clean(event.created_at)}\nEvent: ${clean(event.id)}\n`),
    'Open your existing teacher dashboard to review an account. No action is needed for a normal reset request.',
  ].join('\n');
  let accepted = false, errorCode;
  try {
    await send({ user: env.SMTP_USER, password: env.SMTP_PASSWORD, to: env.OWNER_EMAIL,
      subject: `English Hub owner activity - ${events.length} event${events.length === 1 ? '' : 's'}`, text });
    accepted = true;
  } catch (error) { errorCode = /^SMTP_[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'DELIVERY_FAILED'; }
  await rpc('review_finish_owner_email_events', { p_lease: events[0].lease_id, p_accepted: accepted, p_error: errorCode || null });
  if (!accepted) throw new Error(errorCode);
  return { processed: events.length, accepted: true };
}
