import {
  DEMO_FAVORITES_STORAGE_KEY,
  DEMO_PROGRESS_STORAGE_KEY,
  assertLocalDemoRuntime,
  getDemoPersona,
} from "./personas.js";

const CATEGORY_FEATURES = Object.freeze({
  words: "show_words",
  phrases: "show_phrases",
  phonics: "show_phonics",
});
const PROGRESS_VALUES = new Set(["not_started", "learning", "reviewed", "mastered"]);
const RATING_VALUES = new Set(["hard", "good", "easy"]);
let curriculumPromise;

const success = (data) => ({ data, reason: "local-demo", error: null });
const failure = (data, reason, error) => ({ data, reason, error });

const readStorage = (key, fallback) => {
  try {
    const parsed = JSON.parse(globalThis.localStorage?.getItem(key) || "null");
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  globalThis.localStorage?.setItem(key, JSON.stringify(value));
};

const isoFromNow = (days) => new Date(Date.now() + days * 86400000).toISOString();

const initialProgress = () => ({
  "word-l01-pen": {
    student_id: "local-demo",
    item_id: "word-l01-pen",
    status: "mastered",
    self_rating: "easy",
    review_count: 2,
    last_reviewed_at: isoFromNow(-2),
    next_review_at: isoFromNow(5),
    metadata: { local_demo: true, sample: true },
    created_at: isoFromNow(-8),
    updated_at: isoFromNow(-2),
  },
  "word-l01-chair": {
    student_id: "local-demo",
    item_id: "word-l01-chair",
    status: "learning",
    self_rating: "hard",
    review_count: 1,
    last_reviewed_at: isoFromNow(-3),
    next_review_at: isoFromNow(-2),
    metadata: { local_demo: true, sample: true },
    created_at: isoFromNow(-3),
    updated_at: isoFromNow(-3),
  },
  "phrase-l01-02": {
    student_id: "local-demo",
    item_id: "phrase-l01-02",
    status: "reviewed",
    self_rating: "good",
    review_count: 1,
    last_reviewed_at: isoFromNow(-1),
    next_review_at: isoFromNow(2),
    metadata: { local_demo: true, sample: true },
    created_at: isoFromNow(-1),
    updated_at: isoFromNow(-1),
  },
});

function ensureDemoLearningState() {
  if (globalThis.localStorage?.getItem(DEMO_PROGRESS_STORAGE_KEY) == null) {
    writeStorage(DEMO_PROGRESS_STORAGE_KEY, initialProgress());
  }
  if (globalThis.localStorage?.getItem(DEMO_FAVORITES_STORAGE_KEY) == null) {
    writeStorage(DEMO_FAVORITES_STORAGE_KEY, ["word-l01-pen", "phrase-l01-02"]);
  }
}

const levelInTeacherScope = (level, settings) => {
  const numericLevel = Number(level);
  if (!Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > 32) return false;
  if (numericLevel < Number(settings.allowed_level_min) || numericLevel > Number(settings.allowed_level_max)) return false;
  const exact = Array.isArray(settings.allowed_levels) ? settings.allowed_levels.map(Number) : [];
  return !exact.length || exact.includes(numericLevel);
};

const categoryEnabled = (category, settings) => (
  settings.account_enabled !== false && settings[CATEGORY_FEATURES[category]] !== false
);

const itemAllowed = (item, persona) => {
  const id = String(item.id);
  if (!categoryEnabled(item.category, persona.settings)) return false;
  if (persona.blockedItemIds.includes(id)) return false;
  if (persona.allowedItemIds.includes(id)) return true;
  return levelInTeacherScope(item.level, persona.settings);
};

async function loadCurriculum() {
  assertLocalDemoRuntime();
  if (!curriculumPromise) {
    curriculumPromise = fetch("/demo-data/curriculum.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Demo curriculum request failed (${response.status}).`);
        const payload = await response.json();
        if (!Array.isArray(payload?.levels) || payload.levels.length !== 96) {
          throw new Error("The local demo needs exactly 96 category-level records.");
        }
        if (!Array.isArray(payload?.items) || payload.items.length !== 480) {
          throw new Error("The local demo needs exactly 480 curriculum items.");
        }
        return payload;
      });
  }
  return curriculumPromise;
}

export async function fetchStudentHubContext() {
  const persona = getDemoPersona();
  return success({
    userId: `local-demo-${persona.key}`,
    settings: { ...persona.settings, allowed_levels: [...persona.settings.allowed_levels] },
    migrationReady: true,
    demo: true,
  });
}

export async function fetchCurriculumItems({ category, level } = {}) {
  try {
    const data = await loadCurriculum();
    const persona = getDemoPersona();
    return success(data.items.filter((item) => (
      (!category || item.category === category)
      && (level == null || Number(item.level) === Number(level))
      && itemAllowed(item, persona)
    )));
  } catch (error) {
    return failure([], "local-demo-curriculum-failed", error);
  }
}

export async function fetchCurriculumLevels(category) {
  try {
    const data = await loadCurriculum();
    const persona = getDemoPersona();
    const itemLevels = new Set(data.items.filter((item) => itemAllowed(item, persona))
      .map((item) => `${item.category}:${item.level}`));
    return success(data.levels.filter((entry) => (
      (!category || entry.category === category)
      && categoryEnabled(entry.category, persona.settings)
      && (
        levelInTeacherScope(entry.level, persona.settings)
        || itemLevels.has(`${entry.category}:${entry.level}`)
      )
    )));
  } catch (error) {
    return failure([], "local-demo-curriculum-failed", error);
  }
}

export async function fetchCurriculumProgress() {
  assertLocalDemoRuntime();
  ensureDemoLearningState();
  const progress = Object.values(readStorage(DEMO_PROGRESS_STORAGE_KEY, {}));
  const favorites = readStorage(DEMO_FAVORITES_STORAGE_KEY, [])
    .map((itemId) => ({ student_id: "local-demo", item_id: String(itemId), created_at: null }));
  return success({ progress, favorites });
}

export async function saveCurriculumProgress(itemId, { status, selfRating = null } = {}) {
  assertLocalDemoRuntime();
  ensureDemoLearningState();
  const safeItemId = String(itemId || "").trim();
  const safeStatus = String(status || "").trim();
  const safeRating = selfRating == null ? null : String(selfRating).trim();
  if (!safeItemId || !PROGRESS_VALUES.has(safeStatus) || (safeRating && !RATING_VALUES.has(safeRating))) {
    return failure(null, "invalid-demo-progress", new Error("The local progress value is invalid."));
  }
  const records = readStorage(DEMO_PROGRESS_STORAGE_KEY, {});
  const previous = records[safeItemId] || {};
  const now = new Date();
  const dueDays = { hard: 1, good: 3, easy: 7 }[safeRating] || null;
  const nextReview = dueDays == null ? null : new Date(now.getTime() + dueDays * 86400000).toISOString();
  const saved = {
    ...previous,
    student_id: "local-demo",
    item_id: safeItemId,
    status: safeStatus,
    self_rating: safeRating,
    review_count: safeStatus === "not_started" ? Number(previous.review_count || 0) : Number(previous.review_count || 0) + 1,
    last_reviewed_at: safeStatus === "not_started" ? null : now.toISOString(),
    next_review_at: nextReview,
    metadata: { local_demo: true },
    created_at: previous.created_at || now.toISOString(),
    updated_at: now.toISOString(),
  };
  records[safeItemId] = saved;
  writeStorage(DEMO_PROGRESS_STORAGE_KEY, records);
  return success(saved);
}

export async function toggleCurriculumFavorite(itemId, favorite) {
  assertLocalDemoRuntime();
  ensureDemoLearningState();
  const safeItemId = String(itemId || "").trim();
  if (!safeItemId) return failure(null, "invalid-demo-favorite", new Error("Choose a curriculum item."));
  const favorites = new Set(readStorage(DEMO_FAVORITES_STORAGE_KEY, []).map(String));
  if (favorite === true) favorites.add(safeItemId);
  else favorites.delete(safeItemId);
  writeStorage(DEMO_FAVORITES_STORAGE_KEY, [...favorites]);
  return success(favorite === true);
}
