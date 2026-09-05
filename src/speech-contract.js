// Bump when the synthesis voice or prosody changes. A cache entry is valid only
// for this complete contract, never just the accent or a case-folded sentence.
export const SPEECH_PROFILE_VERSION = "natural-v2";
export const VOICE_PROFILES = Object.freeze({
  us: Object.freeze({ name: "Ava", voiceId: "en-US-AvaMultilingualNeural", language: "en-US", rate: "-4%", pitch: "+0Hz", volume: "+0%" }),
  gb: Object.freeze({ name: "Libby", voiceId: "en-GB-LibbyNeural", language: "en-GB", rate: "-4%", pitch: "+0Hz", volume: "+0%" }),
  ja: Object.freeze({ name: "Nanami", voiceId: "ja-JP-NanamiNeural", language: "ja-JP", rate: "-2%", pitch: "+0Hz", volume: "+0%" }),
});

export function createSpeechRequest(text, accent = "us") {
  const profile = VOICE_PROFILES[accent];
  if (!profile) throw new Error("Unsupported natural voice.");
  const cleanText = String(text ?? "").normalize("NFC").trim();
  if (!cleanText || cleanText.length > 500 || /[\p{Cc}\p{Cs}]/u.test(cleanText)) {
    throw new Error("The speech sample must contain 1–500 printable characters.");
  }
  return { text: cleanText, accent, voice: profile.voiceId, profile: SPEECH_PROFILE_VERSION };
}

export function speechCacheKey(text, accent, endpoint = "") {
  const request = createSpeechRequest(text, accent);
  const profile = VOICE_PROFILES[accent];
  return JSON.stringify([endpoint, request.profile, request.voice, profile.rate, profile.pitch, profile.volume, request.text]);
}

// The Edge response must confirm the full voice identity before an audio blob
// can enter the cache. A missing/incorrect header is an error, not a fallback.
export function validateSpeechResponse(response, accent) {
  const profile = VOICE_PROFILES[accent];
  if (!response.ok) throw new Error(`Natural speech request failed (${response.status}).`);
  const expected = {
    "x-review-voice": accent,
    "x-review-voice-id": profile?.voiceId,
    "x-review-speech-profile": SPEECH_PROFILE_VERSION,
    "x-review-rate": profile?.rate,
    "x-review-pitch": profile?.pitch,
    "x-review-volume": profile?.volume,
  };
  if (!(response.headers?.get("content-type") || "").toLowerCase().startsWith("audio/mpeg")) {
    throw new Error("Natural speech returned an unexpected content type.");
  }
  for (const [header, value] of Object.entries(expected)) {
    if (!value || response.headers?.get(header) !== value) {
      throw new Error(`Natural voice verification failed (${header}).`);
    }
  }
  return profile;
}
