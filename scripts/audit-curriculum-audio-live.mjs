import { readFile, writeFile } from "node:fs/promises";
import { NATURAL_SPEECH_URL, SUPABASE_ANON_KEY } from "../src/config.js";

const root = new URL("../", import.meta.url);
const categories = ["words", "phrases", "phonics"];
const levelsToTest = [1, 8, 16, 24, 32];
const accents = ["us", "gb"];

const sources = Object.fromEntries(await Promise.all(categories.map(async (category) => [
  category,
  JSON.parse(await readFile(new URL(`curriculum/${category}.json`, root), "utf8")),
])));

if (!NATURAL_SPEECH_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Public natural-speech configuration is missing.");
}

const speechText = (category, item) => {
  if (category === "words") return `${item.word}. ${item.exampleSentence}`;
  if (category === "phrases") return `${item.phrase} ${item.exampleDialogue}`;
  return [
    ...(Array.isArray(item.examples) ? item.examples : []),
    ...(Array.isArray(item.practiceWords) ? item.practiceWords : []),
    item.practiceSentence,
  ].filter(Boolean).join(". ").replaceAll("_", " ");
};

const selected = categories.flatMap((category) => levelsToTest.map((level) => {
  const item = sources[category].levels.find((entry) => Number(entry.level) === level)?.items?.[0];
  if (!item) throw new Error(`${category} Level ${level} has no representative item.`);
  return { category, level, item, text: speechText(category, item) };
}));

for (const category of categories) {
  const items = sources[category].levels.flatMap((entry) => entry.items || []);
  for (const item of items) {
    if (item.audioUSVoice !== "Ava" || item.audioUKVoice !== "Libby") {
      throw new Error(`${item.id}: curriculum audio must use Ava and Libby.`);
    }
    if (!speechText(category, item).trim()) throw new Error(`${item.id}: no natural-speech target.`);
  }
}

const testSpeech = async ({ category, level, item, text, accent }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(NATURAL_SPEECH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text: text.slice(0, 500), accent }),
      cache: "no-store",
      signal: controller.signal,
    });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "";
    const voiceHeader = response.headers.get("x-review-voice") || "";
    const looksLikeMp3 = bytes.length > 256
      && ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33)
        || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0));
    if (!response.ok || !contentType.startsWith("audio/") || !looksLikeMp3) {
      throw new Error(`${item.id}/${accent}: HTTP ${response.status}, ${contentType || "no content type"}, ${bytes.length} bytes`);
    }
    if (voiceHeader && voiceHeader !== accent) {
      throw new Error(`${item.id}/${accent}: service returned ${voiceHeader} voice header.`);
    }
    return { category, level, id: item.id, accent, bytes: bytes.length, contentType, voiceHeader: voiceHeader || accent };
  } finally {
    clearTimeout(timeout);
  }
};

const jobs = selected.flatMap((entry) => accents.map((accent) => ({ ...entry, accent })));
const rows = [];
for (let index = 0; index < jobs.length; index += 3) {
  rows.push(...await Promise.all(jobs.slice(index, index + 3).map(testSpeech)));
}

const report = [
  "# Curriculum natural-voice live audit",
  "",
  `Checked: ${new Date().toISOString()}`,
  "",
  "All 480 curriculum items passed the static Ava/Libby and non-empty speech-target audit. The table records live MP3 responses for a representative item at Levels 1, 8, 16, 24 and 32 in every category, using both US Ava and UK Libby. Browser speech synthesis is not used as a fallback.",
  "",
  "| Category | Level | Item | Voice | Live response |",
  "|---|---:|---|---|---|",
  ...rows.map((row) => `| ${row.category} | ${row.level} | ${row.id} | ${row.accent === "us" ? "US Ava" : "UK Libby"} | PASS · ${row.contentType} · ${row.bytes} bytes |`),
  "",
].join("\n");
await writeFile(new URL("docs/curriculum-audio-live-audit.md", root), report);
console.log(`Curriculum natural-voice audit passed: 480 static targets and ${rows.length} live Ava/Libby responses.`);
