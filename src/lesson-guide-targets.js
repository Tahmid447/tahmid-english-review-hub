const ENGLISH_KEYS = Object.freeze([
  "en",
  "english",
  "text",
  "label",
  "sentence",
  "phrase",
  "target",
  "value",
  "audioText",
  "speakText",
]);

const JAPANESE_KEYS = Object.freeze([
  "jp",
  "ja",
  "japanese",
  "textJa",
  "labelJa",
  "meaning",
  "translation",
]);

const INVALID_RENDERED_TEXT = /\[object\s+(?:Object|Array)\]|^(?:undefined|null|nan)$/i;
const READABLE_CHARACTER = /[\p{L}\p{N}]/u;
const LATIN_TEXT = /[A-Za-z]/;
const JAPANESE_TEXT = /[\u3040-\u30ff\u3400-\u9fff]/;
const JAPANESE_MODEL_PREFIX = /^(?:語順を並べましょう|文を組み立てましょう|英語にしましょう|英語にしてください|英文を作りましょう)\s*[：:]\s*(.+)$/;

const isRecord = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

/**
 * Read a learner-facing string without ever relying on JavaScript's implicit
 * object-to-string conversion. Database and Teacher Studio payloads may use a
 * plain string or a bilingual object for the same field.
 */
export function readHumanText(value, language = "en") {
  const preferredKeys = language === "jp"
    ? [...JAPANESE_KEYS, ...ENGLISH_KEYS]
    : [...ENGLISH_KEYS, ...JAPANESE_KEYS];
  const seen = new Set();

  const read = (candidate) => {
    if (typeof candidate === "string") return candidate.replace(/\s+/g, " ").trim();
    if (typeof candidate === "number" && Number.isFinite(candidate)) return String(candidate);
    if (!candidate || typeof candidate !== "object" || seen.has(candidate)) return "";
    seen.add(candidate);

    if (Array.isArray(candidate)) {
      return candidate.map(read).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    }
    for (const key of preferredKeys) {
      if (!Object.hasOwn(candidate, key)) continue;
      const text = read(candidate[key]);
      if (text) return text;
    }
    return "";
  };

  return read(value);
}

export function isHumanReadableModelTarget(value) {
  return typeof value === "string"
    && READABLE_CHARACTER.test(value)
    && !INVALID_RENDERED_TEXT.test(value.trim())
    && !INVALID_RENDERED_TEXT.test(value);
}

const localizedText = (primaryValue, japaneseValue = "") => {
  const en = readHumanText(primaryValue, "en");
  const nestedJapanese = isRecord(primaryValue) ? readHumanText(primaryValue, "jp") : "";
  const jp = readHumanText(japaneseValue, "jp") || nestedJapanese;
  return { en, jp };
};

const correctChoiceFor = (question) => (question.choices || [])
  .find((choice) => String(choice?.id) === String(question.correct));

const orderTargetFor = (question) => {
  if (Array.isArray(question.correctWords) && question.correctWords.length) {
    return question.correctWords.map((word) => readHumanText(word, "en")).filter(Boolean).join(" ");
  }
  if (Array.isArray(question.correctOrder) && Array.isArray(question.words)) {
    return question.correctOrder
      .map((wordIndex) => readHumanText(question.words[wordIndex], "en"))
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

const quotedSegments = (value) => {
  const text = readHumanText(value, "en");
  return [
    ...[...text.matchAll(/[“"]([^”"]+)[”"]/g)].map((match) => match[1]),
    ...[...text.matchAll(/「([^」]+)」/g)].map((match) => match[1]),
  ].map((segment) => segment.trim()).filter(Boolean);
};

const quotedEnglishFor = (value) => quotedSegments(value).find((segment) => LATIN_TEXT.test(segment)) || "";
const quotedJapaneseFor = (value) => quotedSegments(value).find((segment) => JAPANESE_TEXT.test(segment)) || "";
const correctedEnglishFor = (value) => quotedSegments(value).find((segment) => (
  (segment.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length >= 2
)) || readHumanText(value, "en");

const target = (question, enValue, jpValue = "") => {
  const text = localizedText(enValue, jpValue);
  if (!isHumanReadableModelTarget(text.en)) return null;
  const prefixedJapanese = text.jp.match(JAPANESE_MODEL_PREFIX);
  const jp = prefixedJapanese?.[1]?.trim() || text.jp;
  return {
    en: text.en,
    jp: isHumanReadableModelTarget(jp) && jp !== text.en ? jp : "",
    section: readHumanText(question.section || question.format || question.type || "Practice", "en"),
    questionId: readHumanText(question.id || "", "en"),
  };
};

/**
 * Return the model English represented by one activity. Matching and sorting
 * activities intentionally contribute each of their useful phrases.
 */
export function practiceMapTargetsForQuestion(question = {}) {
  const format = readHumanText(question.format || question.type || "", "en");

  if (format === "matching") {
    return (question.pairs || []).flatMap((pair) => {
      const englishValue = pair?.en ?? pair?.english ?? pair?.left ?? pair?.text;
      const japaneseValue = pair?.jp ?? pair?.ja ?? pair?.japanese ?? pair?.right;
      const item = target(question, englishValue, japaneseValue);
      return item ? [item] : [];
    });
  }

  if (format === "sorting") {
    const items = Array.isArray(question.sortingItems) && question.sortingItems.length
      ? question.sortingItems
      : (question.items || []);
    return items.flatMap((item) => {
      const englishValue = Array.isArray(item)
        ? item[0]
        : (item?.text ?? item?.en ?? item?.english ?? item?.label);
      const japaneseValue = Array.isArray(item) ? "" : (item?.jp ?? item?.ja ?? item?.japanese ?? item?.textJa);
      const model = target(question, englishValue, japaneseValue);
      return model ? [model] : [];
    });
  }

  const choice = correctChoiceFor(question);
  const choiceEnglish = readHumanText(choice?.en ?? choice?.english ?? choice?.text ?? "", "en");
  const choiceIsBooleanLabel = /^(?:true|false)$/i.test(choiceEnglish);
  const choiceIsEnglish = LATIN_TEXT.test(choiceEnglish) && !choiceIsBooleanLabel;
  const statementIsFalse = question.correct === false || /^false$/i.test(choiceEnglish);
  const promptEnglish = readHumanText(question.prompt, "en");
  const promptJapanese = isRecord(question.prompt)
    ? readHumanText(question.prompt, "jp")
    : readHumanText(question.promptJa || question.promptJP || "", "jp");
  const explanationEnglish = readHumanText(question.explanation, "en");
  const explanationJapanese = isRecord(question.explanation)
    ? readHumanText(question.explanation, "jp")
    : readHumanText(question.explanationJa || "", "jp");
  const correctedEnglish = statementIsFalse ? correctedEnglishFor(explanationEnglish) : "";
  const correctedJapanese = statementIsFalse
    ? (quotedJapaneseFor(explanationJapanese) || explanationJapanese)
    : "";
  const accepted = Array.isArray(question.accepted) ? question.accepted[0] : "";
  const ordered = orderTargetFor(question);
  const englishValue = question.speakText
    || question.audioText
    || accepted
    || ordered
    || correctedEnglish
    || (choiceIsEnglish ? (choice?.en || choice?.english || choice?.text) : "")
    || quotedEnglishFor(promptEnglish)
    || question.prompt
    || choiceEnglish
    || (format === "grid" ? String(question.correctCell || "").replace(/-/g, " ") : "");
  const japaneseValue = question.speakJa
    || correctedJapanese
    || (JAPANESE_TEXT.test(choiceEnglish) ? choiceEnglish : "")
    || choice?.jp
    || choice?.ja
    || choice?.japanese
    || quotedJapaneseFor(promptJapanese)
    || (isRecord(question.prompt) ? question.prompt : (question.promptJa || question.promptJP || ""));
  const model = target(question, englishValue, japaneseValue);
  return model ? [model] : [];
}

export function buildPracticeMapTargets(questions = []) {
  const targets = [];
  const seen = new Map();
  questions.flatMap(practiceMapTargetsForQuestion).forEach((item) => {
    const key = item.en.toLocaleLowerCase("en-US").replace(/\s+/g, " ").trim();
    if (!key) return;
    if (seen.has(key)) {
      const existing = targets[seen.get(key)];
      if (!existing.jp && item.jp) existing.jp = item.jp;
      return;
    }
    seen.set(key, targets.length);
    targets.push({ ...item });
  });
  return targets;
}
