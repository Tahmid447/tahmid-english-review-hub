import { normalizeAnswerText } from "./store.js?v=20260906-studio1";
import { fetchDatabaseLesson, fetchDatabaseLessons } from "./supabase.js?v=20260906-studio1";
import { readHumanText } from "./lesson-guide-targets.js?v=20260906-studio1";
import {
  compareLessonSourceOrder,
  sourceSegmentFromLesson,
  sourceSegmentPartIndex,
} from "./lesson-source.js?v=20260906-studio1";

const DATA_PATHS = Object.freeze({
  lessons: "/src/data/legacy-lessons.json",
  additions: "/src/data/legacy-additions.json",
  drafts: "/src/data/notion-drafts.json",
});
const OFFLINE_PREVIEW_LESSONS = new Set(["june-28", "june-29"]);

let publishedPromise;
let draftPromise;

const asBilingual = (value, japaneseFallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const en = readHumanText(value, "en");
    const localizedJapanese = readHumanText(value, "jp");
    return {
      en,
      jp: localizedJapanese && localizedJapanese !== en
        ? localizedJapanese
        : readHumanText(japaneseFallback, "jp"),
    };
  }
  return {
    en: readHumanText(value, "en"),
    jp: readHumanText(japaneseFallback, "jp"),
  };
};

const normalizeChoices = (choices = []) => choices.map((choice, index) => {
  if (choice && typeof choice === "object" && !Array.isArray(choice)) {
    const localized = asBilingual(
      choice.en ?? choice.english ?? choice.text ?? choice.label ?? "",
      choice.jp ?? choice.ja ?? choice.textJa ?? "",
    );
    return {
      ...choice,
      id: String(choice.id ?? index),
      en: localized.en,
      jp: localized.jp,
    };
  }
  return { id: String(index), en: readHumanText(choice, "en"), jp: "" };
});

const stableChoiceOrder = (choices, questionId) => {
  if (choices.length < 2) return choices;
  const score = (value) => [...String(value)]
    .reduce((total, character) => ((total * 33) ^ character.charCodeAt(0)) >>> 0, 5381);
  return [...choices].sort((left, right) => {
    const difference = score(`${questionId}:${left.id}`) - score(`${questionId}:${right.id}`);
    return difference || String(left.id).localeCompare(String(right.id));
  });
};

export function normalizeQuestion(question, lessonId = "", index = 0) {
  const source = question && typeof question === "object" ? question : {};
  const questionId = String(source.id ?? `${lessonId}-q${index + 1}`);
  const format = source.format || source.type || "mcq";
  const prompt = source.prompt && typeof source.prompt === "object"
    ? asBilingual(source.prompt)
    : asBilingual(
        source.prompt || (format === "typing" ? "Type this sentence in English." : ""),
        source.promptJa || source.promptJP || "",
      );
  const hint = source.hint && typeof source.hint === "object"
    ? asBilingual(source.hint)
    : asBilingual(source.hint || "", source.hintJa || "");
  const explanation = source.explanation && typeof source.explanation === "object"
    ? asBilingual(source.explanation)
    : asBilingual(source.explanation || "", source.explanationJa || "");
  // Preserve stable answer IDs while varying their visual order. Generated and
  // legacy content often stores the correct answer as id "a"; showing it first
  // every time teaches a position pattern instead of English.
  const choices = stableChoiceOrder(normalizeChoices(source.choices), questionId);
  const correctWords = Array.isArray(source.correctWords)
    ? source.correctWords.map((word) => readHumanText(word, "en"))
    : Array.isArray(source.correctOrder)
      ? source.correctOrder.map((wordIndex) => readHumanText(source.words?.[wordIndex], "en")).filter(Boolean)
      : [];
  const pairs = Array.isArray(source.pairs)
    ? source.pairs.map((pair, pairIndex) => {
        const localized = asBilingual(
          pair?.en ?? pair?.english ?? pair?.left ?? pair?.text ?? "",
          pair?.jp ?? pair?.ja ?? pair?.japanese ?? pair?.right ?? "",
        );
        return {
          ...pair,
          id: String(pair?.id ?? `${lessonId}-${index}-pair-${pairIndex}`),
          en: localized.en,
          jp: localized.jp,
        };
      })
    : [];
  const sortingItems = Array.isArray(source.items)
    ? source.items.map((item, itemIndex) => Array.isArray(item)
      ? {
          id: `${lessonId}-${index}-sort-${itemIndex}`,
          text: readHumanText(item[0], "en"),
          jp: item[0] && typeof item[0] === "object" ? readHumanText(item[0], "jp") : "",
          category: readHumanText(item[1], "en"),
        }
      : (() => {
          const localized = asBilingual(
            item?.text ?? item?.en ?? item?.english ?? item?.label ?? "",
            item?.jp ?? item?.ja ?? item?.japanese ?? item?.textJa ?? "",
          );
          return {
            id: String(item?.id ?? `${lessonId}-${index}-sort-${itemIndex}`),
            text: localized.en,
            jp: localized.jp,
            category: readHumanText(item?.category ?? item?.correct ?? "", "en"),
          };
        })())
    : [];
  const suppliedMaxPoints = Number(source.maxPoints ?? source.points);
  const maxPoints = Number.isFinite(suppliedMaxPoints) && suppliedMaxPoints > 0
    ? suppliedMaxPoints
    : format === "matching"
      ? Math.max(1, pairs.length)
      : format === "sorting"
        ? Math.max(1, sortingItems.length)
        : 1;

  return {
    ...source,
    id: questionId,
    lessonId,
    format,
    type: format,
    prompt,
    hint,
    explanation,
    choices,
    accepted: Array.isArray(source.accepted) ? source.accepted.map((answer) => readHumanText(answer, "en")) : [],
    words: Array.isArray(source.words) ? source.words.map((word) => readHumanText(word, "en")) : [],
    correctWords,
    pairs,
    categories: Array.isArray(source.categories) ? source.categories.map((category) => readHumanText(category, "en")) : [],
    sortingItems,
    context: asBilingual(source.context || "", source.contextJa || ""),
    situation: asBilingual(source.situationQuote || "", source.situationQuote?.jp || ""),
    audioText: readHumanText(source.audioText, "en"),
    speakText: readHumanText(source.speakText, "en"),
    speakJa: readHumanText(source.speakJa, "jp"),
    isOriginal: source.isOriginal !== false,
    section: String(source.section || (source.isOriginal === false ? "Extra Practice" : "Original Review")),
    maxPoints,
    sourceIndex: index,
  };
}

const normalizeLesson = (lesson, additions = []) => {
  const originalQuestions = Array.isArray(lesson.questions) ? lesson.questions : [];
  const merged = [...originalQuestions, ...(Array.isArray(additions) ? additions : [])];
  const questions = merged.map((question, index) => normalizeQuestion(question, lesson.id, index));
  const originalQuestionCount = questions.filter((question) => question.isOriginal).length;
  const sourceSegment = sourceSegmentFromLesson(lesson);
  return {
    ...lesson,
    id: String(lesson.id),
    lessonDate: String(lesson.lessonDate || ""),
    title: String(lesson.title || "English Review"),
    titleJa: String(lesson.titleJa || lesson.takiTitle || ""),
    summary: String(lesson.summary || ""),
    summaryJa: String(lesson.summaryJa || ""),
    status: String(lesson.status || "published"),
    audience: String(lesson.audience || "both"),
    sourceType: String(lesson.sourceType || lesson.source_type || "manual"),
    sourceNotionPageId: String(lesson.sourceNotionPageId || lesson.source_notion_page_id || ""),
    sourceNotionUrl: String(lesson.sourceNotionUrl || lesson.source_notion_url || ""),
    sourceSegment,
    partIndex: sourceSegmentPartIndex(sourceSegment),
    originalQuestionCount,
    extraQuestionCount: Math.max(0, questions.length - originalQuestionCount),
    questionCount: Math.max(questions.length, Number(lesson.questionCount || 0)),
    maxPoints: questions.reduce((sum, question) => sum + question.maxPoints, 0),
    questions,
  };
};

async function fetchJSON(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}

async function loadPublishedSource() {
  if (!publishedPromise) {
    publishedPromise = Promise.all([
      fetchJSON(DATA_PATHS.lessons),
      fetchJSON(DATA_PATHS.additions),
    ]).then(([lessons, additions]) => {
      if (!Array.isArray(lessons)) throw new Error("Lesson data has an unexpected format.");
      return lessons
        .map((lesson) => normalizeLesson(lesson, additions?.[lesson.id] || []))
        .filter((lesson) => lesson.status === "published")
        .sort((left, right) => (
          left.lessonDate.localeCompare(right.lessonDate)
          || compareLessonSourceOrder(left, right)
        ));
    }).catch((error) => {
      publishedPromise = undefined;
      throw error;
    });
  }
  return publishedPromise;
}

const audienceAllows = (lessonAudience, requestedAudience) => {
  if (!requestedAudience || requestedAudience === "all") return true;
  if (lessonAudience === "both") return true;
  if (requestedAudience === "general") return lessonAudience === "general";
  if (requestedAudience === "takiwaki") return lessonAudience === "takiwaki";
  return lessonAudience === requestedAudience;
};

export async function loadPublishedLessons({ audience = "general" } = {}) {
  try {
    const remote = await fetchDatabaseLessons({ audience });
    if (Array.isArray(remote.lessons) && remote.lessons.length) {
      return remote.lessons
        .map((lesson) => normalizeLesson(lesson, []))
        .filter((lesson) => audienceAllows(lesson.audience, audience));
    }
  } catch {
    // The bundled library is the offline-safe fallback.
  }
  const lessons = await loadPublishedSource();
  return lessons
    .filter((lesson) => audienceAllows(lesson.audience, audience))
    .map((lesson) => ({
      ...lesson,
      isPreview: OFFLINE_PREVIEW_LESSONS.has(lesson.id),
      locked: !OFFLINE_PREVIEW_LESSONS.has(lesson.id),
      questions: OFFLINE_PREVIEW_LESSONS.has(lesson.id) ? lesson.questions : [],
    }));
}

export async function loadAllPublishedLessons() {
  return loadPublishedLessons({ audience: "all" });
}

export async function getLessonById(id, { preview = false, allowOfflinePreview = true } = {}) {
  const lessons = await loadPublishedSource();
  const localLesson = lessons.find((lesson) => lesson.id === id) || null;
  const remote = await fetchDatabaseLesson(id, { preview });
  if (remote.lesson) return normalizeLesson(remote.lesson, []);
  if (
    !preview
    && allowOfflinePreview
    && remote.reason !== "lesson-access-denied"
    && localLesson
    && OFFLINE_PREVIEW_LESSONS.has(localLesson.id)
  ) {
    return { ...localLesson, isPreview: true, locked: false };
  }
  if (preview && remote.reason === "teacher-sign-in-required") {
    throw new Error("Sign in to Teacher Studio before opening a private preview.");
  }
  if (preview && remote.error) {
    throw new Error("The private lesson preview could not be loaded.");
  }
  return null;
}

export async function loadDraftLessons() {
  if (!draftPromise) {
    draftPromise = fetchJSON(DATA_PATHS.drafts)
      .then((drafts) => {
        if (!Array.isArray(drafts)) throw new Error("Draft lesson data has an unexpected format.");
        return drafts
          .map((draft) => normalizeLesson(draft, []))
          .sort((left, right) => (
            left.lessonDate.localeCompare(right.lessonDate)
            || compareLessonSourceOrder(left, right)
          ));
      })
      .catch((error) => {
        draftPromise = undefined;
        throw error;
      });
  }
  return draftPromise;
}

const phraseFromCorrectChoice = (question) => {
  const correct = question.choices.find((choice) => String(choice.id) === String(question.correct));
  return correct?.en ? { en: correct.en, jp: correct.jp } : null;
};

const JAPANESE_INSTRUCTION_ONLY = /^(?:聞こえた英文をそのまま入力してください|音声を聞いて[^。]*|英語で入力してください|正しい英文を入力してください)[。.]?$/;
const JAPANESE_MEANING_PREFIX = /^(?:語順を並べましょう|文を組み立てましょう|英語にしましょう|英文を作りましょう)\s*[：:]\s*(.+)$/;
const JAPANESE_SCRIPT = /[\u3040-\u30ff\u3400-\u9fff]/;

export const normalizeJapaneseMeaning = (value = "") => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || JAPANESE_INSTRUCTION_ONLY.test(text)) return "";
  const prefixed = text.match(JAPANESE_MEANING_PREFIX);
  if (prefixed?.[1]) return prefixed[1].trim();
  const quotedTarget = text.match(/^「(.+?)」(?:に合う英文|を英語|という意味)/);
  if (quotedTarget?.[1]) return quotedTarget[1].trim();
  return text;
};

export const normalizeCatalogLanguages = ({ en = "", jp = "" } = {}) => {
  const english = String(en || "").replace(/\s+/g, " ").trim();
  const japanese = String(jp || "").replace(/\s+/g, " ").trim();
  if (JAPANESE_SCRIPT.test(english) && /[A-Za-z]/.test(japanese) && !JAPANESE_SCRIPT.test(japanese)) {
    return { en: japanese, jp: english, swapped: true };
  }
  return { en: english, jp: japanese, swapped: false };
};

export const classifyLibraryEntry = (value = "") => {
  const english = String(value || "").replace(/\s+/g, " ").trim();
  const words = english.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || [];
  if (words.length <= 1 && !/\s/.test(english)) return "word";
  const sentencePattern = [
    /\b(?:have been|went|will go|visit(?:ed)?)\s+to\s+[A-Z][a-z]+/,
    /\b(?:last|next)\s+(?:week|month|year)\b/i,
    /^I\s+(?:hope I can|wish I were|would like to|used to|am supposed to)\b/i,
    /^There\s+(?:is|are|was|were)\b/i,
    /^Who\s+will\s+win\b/i,
    /^Yes,?\s+I\s+do[.!]\s+I\s+like\b/i,
    /^[A-Z][a-z]+\s+is\s+(?:an?|the)\b/,
  ].some((rule) => rule.test(english));
  return sentencePattern ? "pattern" : "phrase";
};

export const sentencePatternFor = (value = "") => {
  const english = String(value || "").replace(/\s+/g, " ").trim();
  const templates = [
    [/^I have been to .+?[.!]?$/i, "I have been to [place]."],
    [/^I went to .+? last (?:week|month|year)[.!]?$/i, "I went to [place] [past time]."],
    [/^I hope I can .+? next (?:week|month|year)[.!]?$/i, "I hope I can [verb phrase] [future time]."],
    [/^I wish I were .+? now[.!]?$/i, "I wish I were [place or situation] now."],
    [/^I would like to .+?[.!]?$/i, "I would like to [verb phrase]."],
    [/^I used to .+?[.!]?$/i, "I used to [verb phrase]."],
    [/^I am supposed to .+?[.!]?$/i, "I am supposed to [verb phrase]."],
    [/^There are .+?[.!]?$/i, "There are [people or things] [place or action]."],
    [/^There is .+?[.!]?$/i, "There is [person or thing] [place or action]."],
    [/^Who will win,? .+? or .+?[?]?$/i, "Who will win, [team A] or [team B]?"],
    [/^Yes,? I do[.!] I like .+?[.!]?$/i, "Yes, I do. I like [thing]."],
    [/^[A-Z][a-z]+ is (?:an?|the) .+?[.!]?$/, "[person or thing] is a [description]."],
  ];
  return templates.find(([rule]) => rule.test(english))?.[1] || english;
};

const lessonTranslationMap = (lesson) => {
  const translations = new Map();
  const add = (english, japanese) => {
    const en = String(english || "").trim();
    const jp = normalizeJapaneseMeaning(japanese);
    if (!en || !jp) return;
    const key = normalizeAnswerText(en);
    if (key && !translations.has(key)) translations.set(key, jp);
  };

  (lesson.phrases || []).forEach((phrase) => add(phrase?.en || phrase?.english, phrase?.jp || phrase?.ja));
  (lesson.questions || []).forEach((question) => {
    question.choices?.forEach((choice) => add(choice.en, choice.jp));
    question.pairs?.forEach((pair) => add(pair.en, pair.jp));
    add(question.speakText, question.speakJa);
    if (question.correctWords?.length) add(question.correctWords.join(" "), question.prompt?.jp);
    if (question.explanation?.en) add(question.explanation.en, question.explanation.jp);
  });
  return translations;
};

const asksForAnError = (question) => {
  const promptText = `${question.prompt?.en || ""} ${question.prompt?.jp || ""}`;
  return /\b(?:not natural|incorrect|wrong|mistake|error)\b|不自然|間違|誤り/i.test(promptText);
};

const isUsefulPhrase = ({ en = "", jp = "" }) => {
  const english = String(en).trim();
  const japanese = String(jp).trim();
  if (!english || JAPANESE_SCRIPT.test(english) || /^(?:true|false)$/i.test(english)) return false;
  if (/不自然|間違|誤り|文法的に.+必要/.test(japanese)) return false;
  return true;
};

const collectQuestionPhrases = (question) => {
  if (question.format === "matching") {
    return question.pairs.map((pair) => ({ en: pair.en, jp: pair.jp }));
  }
  if (question.format === "speaking" && question.speakText) {
    return [{ en: question.speakText, jp: question.speakJa }];
  }
  if (question.format === "listenChoice") {
    const correct = phraseFromCorrectChoice(question);
    return correct ? [correct] : [{ en: question.audioText, jp: "" }];
  }
  if (["mcq", "situation", "dialogue"].includes(question.format)) {
    if (asksForAnError(question)) return [];
    const correct = phraseFromCorrectChoice(question);
    return correct ? [correct] : [];
  }
  if (["typing", "translation", "listenType", "mistake"].includes(question.format) && question.accepted[0]) {
    return [{
      en: question.accepted[0],
      jp: question.prompt.jp || question.speakJa || "",
    }];
  }
  if (question.format === "order" && question.correctWords.length) {
    return [{ en: question.correctWords.join(" "), jp: question.prompt.jp }];
  }
  return [];
};

export async function buildPhraseCatalog({ audience = "all", includeDrafts = false } = {}) {
  const published = await loadPublishedLessons({ audience });
  const lessons = includeDrafts ? [...published, ...(await loadDraftLessons())] : published;
  const phrases = [];
  const seen = new Set();

  lessons.forEach((lesson) => {
    const translations = lessonTranslationMap(lesson);
    const addPhrase = (phrase, id, topic = "Everyday English", note = "") => {
      const normalized = normalizeCatalogLanguages(phrase);
      const en = normalized.en;
      const jp = translations.get(normalizeAnswerText(en))
        || normalizeJapaneseMeaning(normalized.jp);
      if (!isUsefulPhrase({ en, jp }) || en.length > 180) return;
      const uniqueKey = normalizeAnswerText(en);
      if (seen.has(uniqueKey)) return;
      seen.add(uniqueKey);
      const libraryKind = classifyLibraryEntry(en);
      phrases.push({
        id,
        en,
        jp,
        topic: String(topic || "Everyday English"),
        note: String(note || ""),
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        lessonDate: lesson.lessonDate,
        status: lesson.status,
        audience: lesson.audience,
        libraryKind,
        pattern: libraryKind === "pattern" ? sentencePatternFor(en) : "",
      });
    };
    (lesson.phrases || []).forEach((phrase, phraseIndex) => {
      addPhrase(
        { en: phrase?.en || phrase?.english, jp: phrase?.jp || phrase?.ja },
        `${lesson.id}-curated-phrase-${phraseIndex}`,
        phrase?.topic || lesson.themes?.[0] || "Everyday English",
        phrase?.note || "",
      );
    });
    lesson.questions.forEach((question) => {
      collectQuestionPhrases(question).forEach((phrase, phraseIndex) => {
        addPhrase(
          phrase,
          `${question.id}-phrase-${phraseIndex}`,
          question.topic || question.cat || question.section,
          question.explanation.jp || question.explanation.en || "",
        );
      });
    });
  });

  return phrases.sort((left, right) => (
    right.lessonDate.localeCompare(left.lessonDate) || left.en.localeCompare(right.en)
  ));
}
