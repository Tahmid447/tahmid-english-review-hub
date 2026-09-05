import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { curriculumAudioSamples, curriculumPrimaryAudio } from "../src/curriculum-audio.js";
import { SPEECH_PROFILE_VERSION, VOICE_PROFILES, createSpeechRequest, speechCacheKey, validateSpeechResponse } from "../src/speech-contract.js";
import { NATURAL_SPEECH_URL, SUPABASE_ANON_KEY } from "../src/config.js";

const root = new URL("../", import.meta.url);
const categories = ["words", "phrases", "phonics"];
const accents = ["us", "gb"];
const canonicalText = "Hello. Let's practise English together. Please listen, then try it yourself.";
const live = process.argv.includes("--live");
const outputArgument = process.argv.find((arg) => arg.startsWith("--output-dir="));
const outputDirectory = outputArgument ? resolve(outputArgument.split("=").slice(1).join("=")) : "";
const sources = Object.fromEntries(await Promise.all(categories.map(async (category) => [category,
  JSON.parse(await readFile(new URL(`curriculum/${category}.json`, root), "utf8")),
])));
const [audioSource, edgeSource, learnSource] = await Promise.all([
  "src/audio.js", "supabase/functions/natural-speech/index.ts", "src/learn.js",
].map((file) => readFile(new URL(file, root), "utf8")));
assert.equal(new URL(NATURAL_SPEECH_URL).pathname, "/functions/v1/natural-speech");
assert.doesNotMatch(audioSource, /speechSynthesis|SpeechSynthesisUtterance/, "No browser TTS fallback is allowed.");
assert.match(audioSource, /validateSpeechResponse\(response, voiceCode\)/, "Playback verifies the response before caching it.");
assert.match(learnSource, /curriculumAudioSamples\(state.category, item\)/, "The UI uses the audited sample builder.");
assert.match(learnSource, /curriculumPrimaryAudio\(state.category, item\)/, "Review uses the audited primary builder.");
assert.match(edgeSource, /edge-tts-universal@1\.4\.0"/, "The speech provider dependency is pinned.");
assert.notEqual(speechCacheKey("US", "us"), speechCacheKey("us", "us"), "Cache must preserve pronunciation-sensitive case.");
assert.notEqual(speechCacheKey("Hello", "us"), speechCacheKey("Hello", "gb"));
assert.notEqual(speechCacheKey("Hello", "us", "old"), speechCacheKey("Hello", "us", "new"));
assert.throws(() => createSpeechRequest("Hello", "unexpected"));

let itemCount = 0;
let payloadCount = 0;
const phonicsRows = [];
for (const category of categories) {
  assert.equal(sources[category].levels.length, 32);
  for (const level of sources[category].levels) {
    for (const item of level.items) {
      itemCount += 1;
      assert.equal(item.audioUSVoice, "Ava", `${item.id}: US voice metadata`);
      assert.equal(item.audioUKVoice, "Libby", `${item.id}: UK voice metadata`);
      const samples = curriculumAudioSamples(category, item);
      assert.deepEqual(curriculumAudioSamples(category, { id: item.id, content: item }), samples, "Database content wrappers preserve exact speech samples.");
      assert.deepEqual(curriculumAudioSamples(category, { id: item.id, content: JSON.stringify(item) }), samples, "Serialized database content preserves exact speech samples.");
      assert(samples.length >= 2, `${item.id}: focused practice samples are required`);
      if (category === "phonics") {
        assert(item.audioFocus && item.contrastPairs?.length, `${item.id}: designed focus and contrast are required`);
        assert.deepEqual(samples.map((sample) => sample.value), ["guided", "examples", "contrast", "words", "sentence"]);
        phonicsRows.push({ level: level.level, id: item.id, text: samples[0].text, sampleCount: samples.length });
      }
      for (const sample of samples) {
        assert(!/[\u0250-\u02ff\u3040-\u30ff\u3400-\u9fff/_]/u.test(sample.text), `${item.id}/${sample.value}: speech must be spoken English, without IPA, Japanese, or notation`);
        for (const accent of accents) {
          const request = createSpeechRequest(sample.text, accent);
          assert.equal(request.voice, VOICE_PROFILES[accent].voiceId);
          assert.equal(request.profile, SPEECH_PROFILE_VERSION);
          payloadCount += 1;
        }
      }
    }
  }
}
assert.equal(itemCount, 480);
assert.equal(phonicsRows.length, 32);
for (const accent of accents) {
  const canonicalRequests = categories.map(() => createSpeechRequest(canonicalText, accent));
  assert(canonicalRequests.every((request) => JSON.stringify(request) === JSON.stringify(canonicalRequests[0])), "Category cannot change the canonical voice request.");
}

// Execute the actual Edge handler against an instrumented provider, including
// malformed requests. This catches response/contract drift without TTS costs.
let handler;
let synthesis;
const mp3Fixture = new Uint8Array(512);
mp3Fixture.set([0x49, 0x44, 0x33]);
class FakeTTS {
  constructor(text, voice, options) { synthesis = { text, voice, options }; }
  async synthesize() { return { audio: new Blob([mp3Fixture], { type: "audio/mpeg" }) }; }
}
vm.runInNewContext(edgeSource.replace(/^import .*;\n/gm, "")
  .replaceAll(" as const", "").replaceAll(" as keyof typeof voiceProfiles", ""), {
  Deno: { serve: (callback) => { handler = callback; } }, UniversalEdgeTTS: FakeTTS,
  Request, Response, Blob, Uint8Array,
});
const requestToEdge = (body) => handler(new Request("https://example.invalid/functions/v1/natural-speech", {
  method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" },
}));
for (const accent of [...accents, "ja"]) {
  const response = await requestToEdge(createSpeechRequest(accent === "ja" ? "こんにちは。" : canonicalText, accent));
  validateSpeechResponse(response, accent);
  assert.equal(synthesis.voice, VOICE_PROFILES[accent].voiceId);
  assert.deepEqual(JSON.parse(JSON.stringify(synthesis.options)), {
    rate: VOICE_PROFILES[accent].rate, volume: VOICE_PROFILES[accent].volume, pitch: VOICE_PROFILES[accent].pitch,
  });
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  for (const header of ["X-Review-Voice-Id", "X-Review-Speech-Profile", "X-Review-Rate", "X-Review-Pitch", "X-Review-Volume"]) {
    assert(response.headers.get("access-control-expose-headers").includes(header));
  }
  const wrongVoice = new Response(mp3Fixture, { headers: new Headers(response.headers) });
  wrongVoice.headers.set("x-review-voice-id", "another-voice");
  assert.throws(() => validateSpeechResponse(wrongVoice, accent));
  wrongVoice.headers.delete("x-review-voice-id");
  assert.throws(() => validateSpeechResponse(wrongVoice, accent));
}
assert.equal((await requestToEdge({ text: "Hello", accent: "unexpected" })).status, 400);
assert.equal((await requestToEdge({ text: "Hello", accent: "us", voice: VOICE_PROFILES.gb.voiceId })).status, 409);
assert.equal((await requestToEdge({ text: "Hello", accent: "us", profile: "old" })).status, 409);
assert.equal((await requestToEdge({ text: "a".repeat(501), accent: "us" })).status, 400);
assert.equal((await requestToEdge({ text: "bad\ntext", accent: "us" })).status, 400);
assert.equal((await handler(new Request("https://example.invalid", { method: "GET" }))).status, 405);
assert.equal((await handler(new Request("https://example.invalid", { method: "OPTIONS" }))).status, 200);

console.log(`Voice consistency passed: ${itemCount} items, ${payloadCount} exact UI payloads, all 32 phonics levels, strict Edge identity/prosody and negative checks.`);

if (!live) {
  console.log("Live playback was not tested. Run npm run verify:voices -- --live --output-dir=/tmp/tahmid-voice-qa for MP3 evidence and a listening checklist.");
  process.exit(0);
}
if (!SUPABASE_ANON_KEY) throw new Error("Public natural-speech configuration is missing.");
const rejectionChecks = [];
for (const [name, body, expectedStatus] of [
  ["unsupported-accent", { text: "Hello", accent: "unexpected" }, 400],
  ["mismatched-voice", { text: "Hello", accent: "us", voice: VOICE_PROFILES.gb.voiceId }, 409],
  ["mismatched-profile", { text: "Hello", accent: "us", profile: "old" }, 409],
  ["empty-text", { text: "", accent: "us" }, 400],
]) {
  const response = await fetch(NATURAL_SPEECH_URL, {
    method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, expectedStatus, `Live Edge must reject ${name}.`);
  rejectionChecks.push({ name, expectedStatus, actualStatus: response.status });
}
if (outputDirectory) await mkdir(outputDirectory, { recursive: true });
// Fixed seed makes additional random samples reproducible in regression runs.
let seed = 20260905;
const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 2 ** 32; };
const selected = categories.flatMap((category) => {
  const required = [1, 8, 16, 24, 32];
  const extras = [];
  while (extras.length < 3) {
    const candidate = 1 + Math.floor(random() * 32);
    if (!required.includes(candidate) && !extras.includes(candidate)) extras.push(candidate);
  }
  return [...required, ...extras].map((levelNumber) => {
    const level = sources[category].levels.find((value) => value.level === levelNumber);
    const item = required.includes(levelNumber) ? level.items[0] : level.items[Math.floor(random() * level.items.length)];
    return { category, level: levelNumber, id: item.id, sample: required.includes(levelNumber) ? "required" : "random", text: curriculumPrimaryAudio(category, item) };
  });
});
const jobs = [
  ...selected,
  ...categories.map((category) => ({ category, level: 0, id: `canonical-${category}`, sample: "canonical", text: canonicalText })),
].flatMap((entry) => accents.map((accent) => ({ ...entry, accent })));
const rows = [];
for (const job of jobs) {
  const response = await fetch(NATURAL_SPEECH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    body: JSON.stringify(createSpeechRequest(job.text, job.accent)),
    cache: "no-store", signal: AbortSignal.timeout(30000),
  });
  validateSpeechResponse(response, job.accent);
  assert.equal(response.headers.get("cache-control"), "private, no-store", "Private speech must not enter an intermediary cache.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert(bytes.length > 256 && ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)), `${job.id}: invalid MP3`);
  const filename = `${job.id}-${job.accent}.mp3`;
  if (outputDirectory) await writeFile(resolve(outputDirectory, filename), bytes);
  const row = { ...job, filename, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), voiceId: response.headers.get("x-review-voice-id"), profile: SPEECH_PROFILE_VERSION, playbackStatus: "requires browser listening" };
  rows.push(row);
  console.log(`PASS ${job.id} ${job.accent}: ${row.voiceId}, ${row.bytes} bytes`);
}
const report = {
  checkedAt: new Date().toISOString(), endpoint: NATURAL_SPEECH_URL, profile: SPEECH_PROFILE_VERSION,
  static: { itemCount, payloadCount, phonicsLevels: 32 },
  live: { responses: rows.length, rejectionChecks, listeningCompleted: false, note: "API headers and MP3 bytes validate voice selection and delivery. They do not establish perceptual voice quality or browser playback." },
  phonicsPayloads: phonicsRows, rows,
};
await writeFile(new URL("docs/voice-consistency-report.json", root), `${JSON.stringify(report, null, 2)}\n`);
if (outputDirectory) {
  await writeFile(resolve(outputDirectory, "manifest.json"), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(resolve(outputDirectory, "voice-listening-player.js"), await readFile(new URL("scripts/voice-listening-player.js", root), "utf8"));
  const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  await writeFile(resolve(outputDirectory, "index.html"), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Tahmid voice listening QA</title><style>body{font:16px system-ui;max-width:900px;margin:auto;padding:24px;background:#f5f4ef;color:#163d37}article{padding:18px;margin:18px 0;background:white;border-radius:16px}audio{width:100%}label{display:block;padding:8px}small{overflow-wrap:anywhere}</style><h1>Ava / Libby listening QA</h1><p>Exact learning-card samples. Listen for identity, natural English, audible contrasts, clear rhythm and clipping at 1×. API pass does not mean listening pass.</p>${rows.map((row) => `<article><h2>${escape(row.id)} · ${row.accent === "us" ? "Ava US" : "Libby UK"}</h2><small>${escape(row.voiceId)} · ${row.profile}</small><p>${escape(row.text)}</p><audio controls preload="none" src="${row.filename}"></audio><label><input type="checkbox"> Heard: identity / pronunciation / rhythm / clean beginning and ending</label></article>`).join("")}<script type="module" src="voice-listening-player.js"></script></html>`);
}
console.log(`Live voice contract passed: ${rows.length} MP3 responses. Listening remains separate; evidence: docs/voice-consistency-report.json${outputDirectory ? ` and ${outputDirectory}/index.html` : ""}.`);
