// Pure payload builders are used by the learning UI and the voice QA runner.
// Phonics symbols, letter-name instructions and Japanese hints are never speech
// targets: learners hear the target inside real words and natural sentences.
const contentOf = (item) => {
  if (item?.content && typeof item.content === "object" && !Array.isArray(item.content)) return item.content;
  if (typeof item?.content === "string") {
    try { return JSON.parse(item.content) || {}; } catch { return {}; }
  }
  return item || {};
};
const clean = (value) => String(value || "").replaceAll("_", " ").replace(/\s+/gu, " ").trim();
const utterance = (values) => values.map(clean).filter(Boolean).map((value) => /[.!?]$/.test(value) ? value : `${value}.`).join(" ");
const words = (value) => (Array.isArray(value) ? value : [value]).map(clean).filter(Boolean);
const dialogue = (value) => clean(value).replace(/(?:^|\s)[A-Z]:\s*/g, " ").trim();

export function curriculumAudioSamples(category, item) {
  const content = contentOf(item);
  if (category === "words") return [
    { value: "primary", labelEn: "Word", labelJa: "単語", text: clean(content.word || item.title_en) },
    { value: "example", labelEn: "Example sentence", labelJa: "例文", text: clean(content.exampleSentence) },
  ].filter((sample) => sample.text);
  if (category === "phrases") return [
    { value: "primary", labelEn: "Phrase", labelJa: "フレーズ", text: clean(content.phrase || item.title_en) },
    { value: "dialogue", labelEn: "Mini dialogue", labelJa: "ミニ会話", text: dialogue(content.exampleDialogue) },
  ].filter((sample) => sample.text);
  if (category !== "phonics") return [];

  const examples = words(content.audioExamples || content.examples);
  const practiceWords = words(content.audioPracticeWords || content.practiceWords);
  const pairs = (content.contrastPairs || []).map((pair) => utterance(words(pair)));
  const sentence = clean(content.practiceSentence);
  // A short guided route is the default; separate controls retain focused
  // repetition. No synthetic isolated-IPA sounds are claimed or fabricated.
  const guided = utterance([
    clean(content.audioFocus) || "Listen to the sounds in these words",
    ...examples.slice(0, 4),
    ...(pairs.length ? ["Listen and compare", ...pairs.slice(0, 2)] : []),
    "Now try the sentence",
    sentence,
  ]);
  return [
    { value: "guided", labelEn: "Guided sound practice", labelJa: "音から文へ・ガイド練習", text: guided },
    { value: "examples", labelEn: "Sound examples", labelJa: "音の例", text: utterance(examples) },
    { value: "contrast", labelEn: "Listen and compare", labelJa: "音の違いを聞く", text: utterance(pairs) },
    { value: "words", labelEn: "Practice words", labelJa: "練習語", text: utterance(practiceWords) },
    { value: "sentence", labelEn: "Practice sentence", labelJa: "練習文", text: sentence },
  ].filter((sample) => sample.text);
}

export function curriculumPrimaryAudio(category, item) {
  return curriculumAudioSamples(category, item)[0]?.text || "";
}
