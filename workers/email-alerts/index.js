const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });

async function authorized(request, env) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32) return false;
  const supplied = request.headers.get("authorization") || "";
  const encoder = new TextEncoder();
  const hashes = await Promise.all([supplied, `Bearer ${env.ADMIN_TOKEN}`].map(value =>
    crypto.subtle.digest("SHA-256", encoder.encode(value))));
  const [left, right] = hashes.map(hash => new Uint8Array(hash));
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/health" && request.method === "GET") return reply(200, { service: "email-alerts", version: 1 });
    if (path !== "/test" || request.method !== "POST") return reply(404, { error: "Not found" });
    if (!await authorized(request, env)) return reply(401, { error: "Unauthorized" });
    if (env.SEND_ENABLED !== "true") return reply(409, { error: "Diagnostic sending is disabled" });
    if (!env.OWNER_EMAIL || !env.NOTIFY_OWNER) return reply(503, { error: "Not configured" });
    try {
      const result = await env.NOTIFY_OWNER.send({
        from: { email: env.SENDER_EMAIL, name: "Tahmid English Hub" },
        to: env.OWNER_EMAIL,
        subject: "English Hub owner notification check - 14 September",
        text: "This is your requested owner-notification check. It is sent directly through Cloudflare to your verified private inbox. No student password or sign-in link is included. Please keep this message as the delivery receipt.",
      });
      return reply(200, { accepted: true, id: result?.messageId || null });
    } catch (error) {
      return reply(502, { error: "Owner notification failed", code: error.code || "UNKNOWN", detail: String(error.message).slice(0,300) });
    }
  },
};
