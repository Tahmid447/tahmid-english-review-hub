import { EdgeTTS } from "edge-tts-universal";
import { VOICE_PROFILES, SPEECH_PROFILE_VERSION, createSpeechRequest } from "../../src/speech-contract.js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Review-Voice, X-Review-Voice-Id, X-Review-Speech-Profile, X-Review-Rate, X-Review-Pitch, X-Review-Volume",
  "Cache-Control": "private, no-store",
};

// Speech text is never put in a URL, log or shared CDN cache. No account token
// is needed or forwarded to Microsoft. Fixed voices prevent arbitrary SSML.
export default async function handler(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 5000) return new Response("Request too large", { status: 413, headers });
    body = JSON.parse(raw);
    if (!body || !["us", "gb", "ja"].includes(body.accent)) throw new Error("Unsupported accent");
    createSpeechRequest(body.text, body.accent);
  } catch { return new Response("Invalid speech request", { status: 400, headers }); }
  const version = body.profile === "natural-v2" ? "natural-v2" : SPEECH_PROFILE_VERSION;
  const profile = body.accent === "us" && version === "natural-v2"
    ? { ...VOICE_PROFILES.us, voiceId: "en-US-AvaMultilingualNeural" }
    : VOICE_PROFILES[body.accent];
  if ((body.profile && body.profile !== version) || (body.voice && body.voice !== profile.voiceId)) {
    return new Response("Natural voice profile mismatch", { status: 409, headers });
  }
  let timer;
  try {
    const result = await Promise.race([
      new EdgeTTS(body.text.normalize("NFC").trim(), profile.voiceId, {
        rate: profile.rate, pitch: profile.pitch, volume: profile.volume,
      }).synthesize(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), 10000); }),
    ]);
    const audio = await result.audio.arrayBuffer();
    if (audio.byteLength < 128) throw new Error("empty audio");
    return new Response(audio, { headers: {
      ...headers, "Content-Type": "audio/mpeg",
      "X-Review-Voice": body.accent,
      "X-Review-Voice-Id": profile.voiceId,
      "X-Review-Speech-Profile": version,
      "X-Review-Rate": profile.rate,
      "X-Review-Pitch": profile.pitch,
      "X-Review-Volume": profile.volume,
    } });
  } catch {
    return new Response("Speech generation temporarily unavailable", { status: 502, headers });
  } finally { clearTimeout(timer); }
}

export const config = {
  rateLimit: { action: "rate_limit", aggregateBy: ["ip"], windowSize: 60, windowLimit: 120 },
};
