import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { UniversalEdgeTTS } from "npm:edge-tts-universal@1.4.0";

// Kept in agreement with src/speech-contract.js by npm run verify:voices.
const speechProfileVersion = "natural-v2";
const voiceProfiles = {
  us: { name: "Ava", voiceId: "en-US-AvaMultilingualNeural", language: "en-US", rate: "-4%", pitch: "+0Hz", volume: "+0%" },
  gb: { name: "Libby", voiceId: "en-GB-LibbyNeural", language: "en-GB", rate: "-4%", pitch: "+0Hz", volume: "+0%" },
  ja: { name: "Nanami", voiceId: "ja-JP-NanamiNeural", language: "ja-JP", rate: "-2%", pitch: "+0Hz", volume: "+0%" },
} as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Review-Voice, X-Review-Voice-Id, X-Review-Speech-Profile, X-Review-Rate, X-Review-Pitch, X-Review-Volume",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.normalize("NFC").trim() : "";
    if (!["us", "gb", "ja"].includes(body?.accent)) {
      return new Response("Unsupported natural voice", { status: 400, headers: corsHeaders });
    }
    const accent = body.accent as keyof typeof voiceProfiles;
    const profile = voiceProfiles[accent];
    // Older clients provide only an accent. New clients additionally require
    // the complete contract. Arbitrary voice/prosody overrides are not accepted.
    if ((body.voice && body.voice !== profile.voiceId)
      || (body.profile && body.profile !== speechProfileVersion)) {
      return new Response("Natural voice profile mismatch", { status: 409, headers: corsHeaders });
    }
    // Natural lesson copy legitimately contains punctuation such as colons,
    // slashes and dashes. Reject control/surrogate characters instead of
    // maintaining a brittle punctuation allow-list.
    const safeCharacters = /^[^\p{Cc}\p{Cs}]+$/u;
    if (!text || text.length > 500 || !safeCharacters.test(text)) {
      return new Response("Invalid speech text", { status: 400, headers: corsHeaders });
    }

    const tts = new UniversalEdgeTTS(text, profile.voiceId, {
      rate: profile.rate,
      volume: profile.volume,
      pitch: profile.pitch,
    });
    const result = await tts.synthesize();
    const audio = await result.audio.arrayBuffer();
    return new Response(audio, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        // Text may come from a private personal lesson. Browser memory is the
        // only audio cache; intermediary caches must never retain POST audio.
        "Cache-Control": "private, no-store",
        "X-Review-Voice": accent,
        "X-Review-Voice-Id": profile.voiceId,
        "X-Review-Speech-Profile": speechProfileVersion,
        "X-Review-Rate": profile.rate,
        "X-Review-Pitch": profile.pitch,
        "X-Review-Volume": profile.volume,
      },
    });
  } catch {
    return new Response("Speech generation failed", { status: 502, headers: corsHeaders });
  }
});
