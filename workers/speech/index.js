import { VOICE_PROFILES, SPEECH_PROFILE_VERSION, createSpeechRequest } from "../../src/speech-contract.js";
import { synthesize } from "./synthesize.js";
const origins = new Set(["https://tahmidenglishhub.dpdns.org", "https://tahmid-english-hub.pages.dev"]);
const expose = "X-Review-Voice, X-Review-Voice-Id, X-Review-Speech-Profile, X-Review-Rate, X-Review-Pitch, X-Review-Volume, X-Review-Speech-Hosting";
export async function handleSpeech(request, env, generate = synthesize) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const allowed = !origin || origins.has(origin) || /^https:\/\/[a-z0-9-]+\.tahmid-english-hub\.pages\.dev$/.test(origin);
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Vary": "Origin", "X-Review-Speech-Hosting": "cloudflare-workers" };
  if (env.SPEECH_VERSION?.id) headers["X-Review-Speech-Version"] = env.SPEECH_VERSION.id;
  if (origin && allowed) headers["Access-Control-Allow-Origin"] = origin;
  const reply = (text, status, extra = {}) => new Response(text, { status, headers: { ...headers, ...extra } });
  if (url.pathname !== "/api/natural-speech") return reply("Not found", 404);
  if (!allowed) return reply("Origin not allowed", 403);
  if (url.search) return reply("Query strings are not supported", 400);
  if (request.method === "OPTIONS") return reply(null, 204, { "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "600" });
  if (request.method !== "POST") return reply("Method not allowed", 405, { Allow: "POST, OPTIONS" });
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return reply("JSON required", 415);
  if (Number(request.headers.get("Content-Length")) > 5000) return reply("Request too large", 413);
  // Enforce before reading/synthesis. Native binding retains no speech text.
  try {
    if (!env.SPEECH_LIMITER) return reply("Speech temporarily unavailable", 503);
    const { success } = await env.SPEECH_LIMITER.limit({ key: `speech:${request.headers.get("CF-Connecting-IP") || "unknown"}` });
    if (!success) return reply("Too many speech requests", 429, { "Retry-After": "60" });
  } catch { return reply("Speech temporarily unavailable", 503); }
  let body, clean;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply("Invalid speech request", 400);
    const parts = []; let size = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 5000) { await reader.cancel(); return reply("Request too large", 413); } parts.push(value); }
    body = JSON.parse(await new Blob(parts).text());
    if (!body || typeof body.text !== "string" || !Object.hasOwn(VOICE_PROFILES, body.accent)) return reply("Invalid speech request", 400);
    clean = createSpeechRequest(body.text, body.accent);
  } catch { return reply("Invalid speech request", 400); }
  const version = body.profile === "natural-v2" ? "natural-v2" : SPEECH_PROFILE_VERSION;
  const profile = body.accent === "us" && version === "natural-v2" ? { ...VOICE_PROFILES.us, voiceId: "en-US-AvaMultilingualNeural" } : VOICE_PROFILES[body.accent];
  if ((body.profile && body.profile !== version) || (body.voice && body.voice !== profile.voiceId)) return reply("Natural voice profile mismatch", 409);
  try {
    const audio = await generate(clean.text, profile);
    return reply(audio, 200, { "Content-Type": "audio/mpeg", "Access-Control-Expose-Headers": expose, "X-Review-Voice": body.accent, "X-Review-Voice-Id": profile.voiceId, "X-Review-Speech-Profile": version, "X-Review-Rate": profile.rate, "X-Review-Pitch": profile.pitch, "X-Review-Volume": profile.volume });
  } catch { return reply("Speech generation temporarily unavailable", 502); }
}
export default { fetch(request, env) { return handleSpeech(request, env); } };
