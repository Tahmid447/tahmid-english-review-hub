import { readFile, writeFile } from "node:fs/promises";
import { NATURAL_SPEECH_URL, SUPABASE_ANON_KEY } from "../src/config.js";

const root = new URL("../", import.meta.url);
const readJSON = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const [legacy, additions, drafts] = await Promise.all([
  readJSON("src/data/legacy-lessons.json"),
  readJSON("src/data/legacy-additions.json"),
  readJSON("src/data/notion-drafts.json"),
]);
const lessons = [
  ...legacy.map((lesson) => ({ ...lesson, questions: [...(lesson.questions || []), ...(additions[lesson.id] || [])] })),
  ...drafts,
].sort((left, right) => String(left.lessonDate).localeCompare(String(right.lessonDate)));

if (lessons.length !== 17) throw new Error(`Expected 17 lessons, found ${lessons.length}.`);
if (!NATURAL_SPEECH_URL || !SUPABASE_ANON_KEY) throw new Error("Public natural-speech configuration is missing.");

const bilingualPart = (value, language) => {
  if (value && typeof value === "object") return String(value[language] || value[language === "jp" ? "ja" : "english"] || "");
  return language === "en" ? String(value || "") : "";
};
const questionPart = (question, field, language) => {
  const embedded = bilingualPart(question?.[field], language);
  if (embedded || language === "en") return embedded;
  return String(question?.[`${field}Ja`] || question?.[`${field}JP`] || "");
};
const testSpeech = async (text, accent) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(NATURAL_SPEECH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text, accent }),
      signal: controller.signal,
    });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.startsWith("audio/") || bytes.length < 128) {
      throw new Error(`HTTP ${response.status}, ${contentType || "no content type"}, ${bytes.length} bytes`);
    }
    return { status: response.status, contentType, bytes: bytes.length };
  } finally {
    clearTimeout(timeout);
  }
};

const rows = [];
for (const lesson of lessons) {
  const questions = lesson.questions || [];
  const listening = questions.filter((question) => ["listenChoice", "listenType"].includes(question.format || question.type));
  const speaking = questions.filter((question) => (question.format || question.type) === "speaking");
  const missingListening = listening.filter((question) => !String(question.audioText || "").trim());
  const missingSpeaking = speaking.filter((question) => !String(question.speakText || "").trim());
  if (missingListening.length || missingSpeaking.length) {
    throw new Error(`${lesson.id}: missing ${missingListening.length} listening and ${missingSpeaking.length} speaking audio targets.`);
  }
  const representative = listening.find((question) => String(question.audioText || "").trim())?.audioText
    || speaking.find((question) => String(question.speakText || "").trim())?.speakText
    || questionPart(questions[0], "prompt", "en");
  if (!representative) throw new Error(`${lesson.id}: no representative audio text found.`);
  const live = await testSpeech(String(representative).slice(0, 350), "us");
  rows.push({
    id: lesson.id,
    date: lesson.lessonDate,
    title: lesson.title,
    listening: listening.length,
    speaking: speaking.length,
    englishExplanations: questions.filter((question) => questionPart(question, "explanation", "en").trim()).length,
    japaneseExplanations: questions.filter((question) => questionPart(question, "explanation", "jp").trim()).length,
    live,
  });
}

const japaneseLive = await testSpeech("注文するときは、この表現が丁寧で自然です。", "ja");
const britishLive = await testSpeech("I’d like pasta, please.", "gb");
const report = [
  "# Live audio audit",
  "",
  `Checked: ${new Date().toISOString()}`,
  "",
  "Every lesson passed a structural check for all listening and speaking audio targets. One representative natural-English request per lesson was then sent to the live speech service and validated as a non-empty audio response. Japanese Nanami and British Libby requests were also validated. Browser playback speed and mixed-language sequencing are covered separately by the learning-experience browser/unit tests.",
  "",
  "| Lesson | Listening targets | Speaking targets | EN explanations | JA explanations | Live request |",
  "|---|---:|---:|---:|---:|---|",
  ...rows.map((row) => `| ${row.date} · ${row.title} (${row.id}) | ${row.listening} | ${row.speaking} | ${row.englishExplanations} | ${row.japaneseExplanations} | PASS · ${row.live.contentType} · ${row.live.bytes} bytes |`),
  "",
  `Japanese voice: PASS · ${japaneseLive.contentType} · ${japaneseLive.bytes} bytes`,
  "",
  `British English voice: PASS · ${britishLive.contentType} · ${britishLive.bytes} bytes`,
  "",
].join("\n");
await writeFile(new URL("docs/audio-live-audit.md", root), report);
console.log(`Live audio audit passed: ${rows.length} lesson requests plus Japanese and British voice checks.`);
