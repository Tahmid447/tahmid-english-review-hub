import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { UniversalEdgeTTS } from "npm:edge-tts-universal@^1.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const voices = {
  us: "en-US-AvaMultilingualNeural",
  gb: "en-GB-LibbyNeural",
  ja: "ja-JP-NanamiNeural",
} as const;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const text = String(body?.text || "").trim();
    const accent = body?.accent === "ja" ? "ja" : body?.accent === "gb" ? "gb" : "us";
    const safeCharacters = /^[\p{L}\p{N}\p{M}\p{Zs}.,?!'’"“”()、。！？・：；ー〜～…%-]+$/u;
    if (!text || text.length > 220 || !safeCharacters.test(text)) {
      return new Response("Invalid speech text", { status: 400, headers: corsHeaders });
    }

    const tts = new UniversalEdgeTTS(text, voices[accent], {
      rate: accent === "ja" ? "-2%" : "-4%",
      volume: "+0%",
      pitch: "+0Hz",
    });
    const result = await tts.synthesize();
    const audio = await result.audio.arrayBuffer();
    return new Response(audio, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, immutable",
        "X-Review-Voice": accent,
      },
    });
  } catch {
    return new Response("Speech generation failed", { status: 502, headers: corsHeaders });
  }
});
