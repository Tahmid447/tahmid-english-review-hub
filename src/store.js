const LEGACY_SETTINGS_KEY = "te-review-hub:settings:v1";
const LEGACY_PROGRESS_KEY = "te-review-hub:lesson-progress:v1";
const SETTINGS_KEY_PREFIX = "te-review-hub:settings:v2";
const PROGRESS_KEY_PREFIX = "te-review-hub:lesson-progress:v2";
const THEME_BOOT_KEY = "te-review-hub:theme:v1";
let activeStorageScope = "anonymous";

export const DEFAULT_SETTINGS = Object.freeze({
  languageMode: "bilingual",
  showJapanese: true,
  showChoiceTranslations: false,
  sound: true,
  voice: "us",
  playbackRate: 1,
  autoPronounceChoices: true,
  checkMode: "manual",
  shuffleChoices: true,
  hintMode: "auto",
  theme: "light",
  weeklyGoal: 3,
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
  const savedSettings = saved && typeof saved === "object" ? { ...saved } : {};
  // Retired settings remain harmless in old local/remote JSON, but are never
  // returned or written again.
  delete savedSettings.vibration;
  const languageMode = ["en", "bilingual", "ja"].includes(saved?.languageMode)
    ? saved.languageMode
    : (saved?.showJapanese === false ? "en" : "bilingual");
  const playbackRate = [0.5, 1, 1.5].includes(Number(saved?.playbackRate))
    ? Number(saved.playbackRate)
    : 1;
  const theme = ["system", "light", "dark"].includes(saved?.theme)
    ? saved.theme
    : "light";
  const weeklyGoal = [2, 3, 5, 7].includes(Number(saved?.weeklyGoal))
    ? Number(saved.weeklyGoal)
    : 3;
  return {
    ...DEFAULT_SETTINGS,
    ...savedSettings,
    voice: saved?.voice === "gb" ? "gb" : "us",
    languageMode,
    playbackRate,
    // New and migrated accounts default to one English pronunciation after a
    // choice is selected. Only an explicit saved false value disables it.
    autoPronounceChoices: saved?.autoPronounceChoices !== false,
    checkMode: saved?.checkMode === "instant" ? "instant" : "manual",
    showJapanese: languageMode !== "en",
    showChoiceTranslations: saved?.showChoiceTranslations === true,
    sound: saved?.sound !== false,
    // Choices are always shuffled for a new practice run. Keep this field for
    // backward-compatible remote settings without allowing an old unchecked
    // preference to disable the learning safeguard.
    shuffleChoices: true,
    hintMode: saved?.hintMode === "manual" ? "manual" : "auto",
    theme,
    weeklyGoal,
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
  next.autoPronounceChoices = next.autoPronounceChoices !== false;
  next.checkMode = next.checkMode === "instant" ? "instant" : "manual";
  next.sound = next.sound !== false;
  next.shuffleChoices = true;
  next.showChoiceTranslations = Boolean(next.showChoiceTranslations);
  next.hintMode = next.hintMode === "manual" ? "manual" : "auto";
  next.theme = ["system", "light", "dark"].includes(next.theme) ? next.theme : "light";
  next.weeklyGoal = [2, 3, 5, 7].includes(Number(next.weeklyGoal))
    ? Number(next.weeklyGoal)
    : 3;
  delete next.vibration;
  writeJSON(scopedKey(SETTINGS_KEY_PREFIX), next);
  writeJSON(THEME_BOOT_KEY, next.theme);
  notify("te-review:settings", next);
  return next;
}

export function resolvedTheme(preference = "light", darkSystemPreference) {
  if (preference === "light" || preference === "dark") return preference;
  const prefersDark = typeof darkSystemPreference === "boolean"
    ? darkSystemPreference
    : Boolean(globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches);
  return prefersDark ? "dark" : "light";
}

export function applyThemePreference(preference = getSettings().theme) {
  const cleanPreference = ["system", "light", "dark"].includes(preference)
    ? preference
    : "light";
  const theme = resolvedTheme(cleanPreference);
  if (typeof document !== "undefined") {
    document.documentElement.dataset.themePreference = cleanPreference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }
  return theme;
}

export function watchSystemTheme(callback) {
  if (typeof globalThis.matchMedia !== "function") return () => {};
  const query = globalThis.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    if (getSettings().theme !== "system") return;
    const theme = applyThemePreference("system");
    if (typeof callback === "function") callback(theme);
  };
  query.addEventListener?.("change", listener);
  return () => query.removeEventListener?.("change", listener);
}

export function safeLocalReturnPath(value, fallback = "/", origin) {
  if (!value) return fallback;
  try {
    const base = origin
      || (typeof window !== "undefined" ? window.location.origin : "https://local.invalid");
    const url = new URL(String(value), base);
    if (url.origin !== new URL(base).origin || !url.pathname.startsWith("/")) return fallback;
    const allowedPath = [
      /^\/$/,
      /^\/index\.html$/,
      /^\/phrases(?:\.html)?\/?$/,
      /^\/lesson\.html$/,
      /^\/lesson\/[^/]+\/?$/,
      /^\/pricing\.html$/,
      /^\/plans\/?$/,
    ].some((pattern) => pattern.test(url.pathname));
    if (!allowedPath) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
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
