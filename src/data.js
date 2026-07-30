import { normalizeAnswerText } from "./store.js";
import { fetchDatabaseLesson, fetchDatabaseLessons } from "./supabase.js";

const DATA_PATHS = Object.freeze({
  lessons: "/src/data/legacy-lessons.json",
  additions: "/src/data/legacy-additions.json",
  drafts: "/src/data/notion-drafts.json",
});

let publishedPromise;
let draftPromise;

const asBilingual = (value, japaneseFallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      en: String(value.en ?? value.english ?? ""),
      jp: String(value.jp ?? value.ja ?? value.japanese ?? japaneseFallback),
    };
  }
  return { en: String(value ?? ""), jp: String(japaneseFallback ?? "") };
};

const normalizeChoices = (choices = []) => choices.map((choice, index) => {
  if (choice && typeof choice === "object" && !Array.isArray(choice)) {
    return {
      ...choice,
      id: String(choice.id ?? index),
      en: String(choice.en ?? choice.text ?? choice.label ?? ""),
      jp: String(choice.jp ?? choice.ja ?? choice.textJa ?? ""),
    };
  }
  return { id: String(index), en: String(choice ?? ""), jp: "" };
});

export function normalizeQuestion(question, lessonId = "", index = 0) {
  const source = question && typeof question === "object" ? question : {};
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
  const choices = normalizeChoices(source.choices);
  const correctWords = Array.isArray(source.correctWords)
    ? [...source.correctWords]
    : Array.isArray(source.correctOrder)
      ? source.correctOrder.map((wordIndex) => source.words?.[wordIndex]).filter((word) => word != null)
      : [];
  const pairs = Array.isArray(source.pairs)
    ? source.pairs.map((pair, pairIndex) => ({
        ...pair,
        id: String(pair.id ?? `${lessonId}-${index}-pair-${pairIndex}`),
        en: String(pair.en ?? pair.left ?? ""),
        jp: String(pair.jp ?? pair.ja ?? pair.right ?? ""),
      }))
    : [];
  const sortingItems = Array.isArray(source.items)
    ? source.items.map((item, itemIndex) => Array.isArray(item)
      ? { id: `${lessonId}-${index}-sort-${itemIndex}`, text: String(item[0] ?? ""), category: String(item[1] ?? "") }
      : {
          id: String(item?.id ?? `${lessonId}-${index}-sort-${itemIndex}`),
          text: String(item?.text ?? item?.en ?? ""),
          category: String(item?.category ?? item?.correct ?? ""),
        })
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
    id: String(source.id ?? `${lessonId}-q${index + 1}`),
    lessonId,
    format,
    type: format,
    prompt,
    hint,
    explanation,
    choices,
    accepted: Array.isArray(source.accepted) ? source.accepted.map(String) : [],
    words: Array.isArray(source.words) ? source.words.map(String) : [],
    correctWords,
    pairs,
    categories: Array.isArray(source.categories) ? source.categories.map(String) : [],
    sortingItems,
    context: asBilingual(source.context || "", source.contextJa || ""),
    situation: asBilingual(source.situationQuote || "", source.situationQuote?.jp || ""),
    audioText: String(source.audioText ?? ""),
    speakText: String(source.speakText ?? ""),
    speakJa: String(source.speakJa ?? ""),
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
    originalQuestionCount,
    extraQuestionCount: Math.max(0, questions.length - originalQuestionCount),
    questionCount: questions.length,
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
        .sort((left, right) => left.lessonDate.localeCompare(right.lessonDate));
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
  return lessons.filter((lesson) => audienceAllows(lesson.audience, audience));
}

export async function loadAllPublishedLessons() {
  return loadPublishedLessons({ audience: "all" });
}

export async function getLessonById(id, { preview = false } = {}) {
  const lessons = await loadPublishedSource();
  const localLesson = lessons.find((lesson) => lesson.id === id) || null;
  if (!preview && localLesson) return localLesson;

  const remote = await fetchDatabaseLesson(id, { preview });
  if (remote.lesson) return normalizeLesson(remote.lesson, []);
  if (localLesson) return localLesson;
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
          .sort((left, right) => left.lessonDate.localeCompare(right.lessonDate));
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

const asksForAnError = (question) => {
  const promptText = `${question.prompt?.en || ""} ${question.prompt?.jp || ""}`;
  return /\b(?:not natural|incorrect|wrong|mistake|error)\b|不自然|間違|誤り/i.test(promptText);
};

const isUsefulPhrase = ({ en = "", jp = "" }) => {
  const english = String(en).trim();
  const japanese = String(jp).trim();
  if (!english || /^(?:true|false)$/i.test(english)) return false;
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
    lesson.questions.forEach((question) => {
      collectQuestionPhrases(question).forEach((phrase, phraseIndex) => {
        const en = String(phrase.en || "").trim();
        const jp = String(phrase.jp || "").trim();
        if (!isUsefulPhrase({ en, jp }) || en.length > 180) return;
        const uniqueKey = normalizeAnswerText(en);
        if (seen.has(uniqueKey)) return;
        seen.add(uniqueKey);
        phrases.push({
          id: `${question.id}-phrase-${phraseIndex}`,
          en,
          jp,
          topic: String(question.topic || question.cat || question.section || "Everyday English"),
          note: question.explanation.jp || question.explanation.en || "",
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonDate: lesson.lessonDate,
          status: lesson.status,
          audience: lesson.audience,
        });
      });
    });
  });

  return phrases.sort((left, right) => (
    right.lessonDate.localeCompare(left.lessonDate) || left.en.localeCompare(right.en)
  ));
}
