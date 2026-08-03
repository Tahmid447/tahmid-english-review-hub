const LEGACY_SETTINGS_KEY = "te-review-hub:settings:v1";
const LEGACY_PROGRESS_KEY = "te-review-hub:lesson-progress:v1";
const SETTINGS_KEY_PREFIX = "te-review-hub:settings:v2";
const PROGRESS_KEY_PREFIX = "te-review-hub:lesson-progress:v2";
let activeStorageScope = "anonymous";

export const DEFAULT_SETTINGS = Object.freeze({
  languageMode: "bilingual",
  showJapanese: true,
  showChoiceTranslations: false,
  sound: true,
  vibration: true,
  voice: "us",
  playbackRate: 1,
  checkMode: "manual",
  shuffleChoices: true,
  hintMode: "auto",
});

const canUseStorage = () => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const scopedKey = (prefix) => `${prefix}:${activeStorageScope}`;

const readScopedJSON = (prefix, legacyKey, fallback) => {
  if (!canUseStorage()) return fallback;
  try {
    const scopedValue = window.localStorage.getItem(scopedKey(prefix));
    if (scopedValue !== null) return JSON.parse(scopedValue);
    if (activeStorageScope === "anonymous") {
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (legacyValue !== null) return JSON.parse(legacyValue);
    }
    return fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const notify = (name, detail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export function setStorageUser(userId) {
  const nextScope = userId
    ? `user:${encodeURIComponent(String(userId))}`
    : "anonymous";
  if (nextScope === activeStorageScope) return activeStorageScope;
  activeStorageScope = nextScope;
  notify("te-review:settings", getSettings());
  notify("te-review:progress", { scopeChanged: true });
  return activeStorageScope;
}

export function getStorageScope() {
  return activeStorageScope;
}

export function getSettings() {
  const saved = readScopedJSON(SETTINGS_KEY_PREFIX, LEGACY_SETTINGS_KEY, {});
  const languageMode = ["en", "bilingual", "ja"].includes(saved?.languageMode)
    ? saved.languageMode
    : (saved?.showJapanese === false ? "en" : "bilingual");
  const playbackRate = [0.5, 1, 1.5].includes(Number(saved?.playbackRate))
    ? Number(saved.playbackRate)
    : 1;
  return {
    ...DEFAULT_SETTINGS,
    ...(saved && typeof saved === "object" ? saved : {}),
    voice: saved?.voice === "gb" ? "gb" : "us",
    languageMode,
    playbackRate,
    checkMode: saved?.checkMode === "instant" ? "instant" : "manual",
    showJapanese: languageMode !== "en",
    showChoiceTranslations: saved?.showChoiceTranslations === true,
    sound: saved?.sound !== false,
    vibration: saved?.vibration !== false,
    // Choices are always shuffled for a new practice run. Keep this field for
    // backward-compatible remote settings without allowing an old unchecked
    // preference to disable the learning safeguard.
    shuffleChoices: true,
    hintMode: saved?.hintMode === "manual" ? "manual" : "auto",
  };
}

export function updateSettings(patch = {}) {
  const next = { ...getSettings(), ...patch };
  next.languageMode = ["en", "bilingual", "ja"].includes(next.languageMode)
    ? next.languageMode
    : (next.showJapanese === false ? "en" : "bilingual");
  next.showJapanese = next.languageMode !== "en";
  next.voice = next.voice === "gb" ? "gb" : "us";
  next.playbackRate = [0.5, 1, 1.5].includes(Number(next.playbackRate))
    ? Number(next.playbackRate)
    : 1;
  next.checkMode = next.checkMode === "instant" ? "instant" : "manual";
  next.sound = next.sound !== false;
  next.vibration = next.vibration !== false;
  next.shuffleChoices = true;
  next.showChoiceTranslations = Boolean(next.showChoiceTranslations);
  next.hintMode = next.hintMode === "manual" ? "manual" : "auto";
  writeJSON(scopedKey(SETTINGS_KEY_PREFIX), next);
  notify("te-review:settings", next);
  return next;
}

export function onSettingsChange(callback) {
  if (typeof window === "undefined" || typeof callback !== "function") {
    return () => {};
  }
  const listener = (event) => callback(event.detail || getSettings());
  window.addEventListener("te-review:settings", listener);
  return () => window.removeEventListener("te-review:settings", listener);
}

export function getAllLessonProgress() {
  const saved = readScopedJSON(PROGRESS_KEY_PREFIX, LEGACY_PROGRESS_KEY, {});
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
}

export function getLessonProgress(lessonId) {
  if (!lessonId) return null;
  const progress = getAllLessonProgress()[lessonId];
  return progress && typeof progress === "object" ? progress : null;
}

export function saveLessonProgress(lessonId, patch = {}) {
  if (!lessonId) return null;
  const all = getAllLessonProgress();
  const current = all[lessonId] && typeof all[lessonId] === "object"
    ? all[lessonId]
    : {};
  const next = {
    ...current,
    ...patch,
    lessonId,
    updatedAt: new Date().toISOString(),
  };
  all[lessonId] = next;
  writeJSON(scopedKey(PROGRESS_KEY_PREFIX), all);
  notify("te-review:progress", { lessonId, progress: next });
  return next;
}

export function clearLessonProgress(lessonId) {
  if (!lessonId) return;
  const all = getAllLessonProgress();
  delete all[lessonId];
  writeJSON(scopedKey(PROGRESS_KEY_PREFIX), all);
  notify("te-review:progress", { lessonId, progress: null });
}

export function normalizeAnswerText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, "\"")
    .replace(/\b(can't|cannot)\b/g, "can not")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bdoesn't\b/g, "does not")
    .replace(/\bdon't\b/g, "do not")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bisn't\b/g, "is not")
    .replace(/\baren't\b/g, "are not")
    .replace(/\bwasn't\b/g, "was not")
    .replace(/\bweren't\b/g, "were not")
    .replace(/\bhaven't\b/g, "have not")
    .replace(/\bhasn't\b/g, "has not")
    .replace(/\bhadn't\b/g, "had not")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function shuffleArray(values, random = Math.random) {
  const copy = Array.isArray(values) ? [...values] : [];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
}

export function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
