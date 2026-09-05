export const DEMO_PERSONA_STORAGE_KEY = "te-review-hub:local-demo:persona:v1";
export const DEMO_PROGRESS_STORAGE_KEY = "te-review-hub:local-demo:progress:v1";
export const DEMO_FAVORITES_STORAGE_KEY = "te-review-hub:local-demo:favorites:v1";
export const DEMO_PERSONA_OVERRIDES_STORAGE_KEY = "te-review-hub:local-demo:persona-overrides:v1";

export const DEMO_BOOLEAN_SETTING_KEYS = Object.freeze([
  "account_enabled",
  "show_dashboard",
  "show_words",
  "show_phrases",
  "show_phonics",
  "show_review_lessons",
  "show_homework",
  "show_progress",
  "show_pricing",
  "show_contact_teacher",
  "show_trial_cta",
  "show_payment_plan",
  "show_announcements",
]);

const commonSettings = Object.freeze({
  account_enabled: true,
  show_dashboard: true,
  show_words: true,
  show_phrases: true,
  show_phonics: true,
  show_review_lessons: true,
  show_homework: true,
  show_progress: true,
  show_pricing: false,
  show_contact_teacher: false,
  show_trial_cta: false,
  show_payment_plan: false,
  show_announcements: true,
  allowed_level_min: 1,
  allowed_level_max: 32,
  allowed_levels: Object.freeze([]),
});

export const DEMO_PERSONAS = Object.freeze({
  full: Object.freeze({
    key: "full",
    label: "Full curriculum · 全教材",
    description: "Teacher has opened all 32 levels and all 480 learning items.",
    descriptionJa: "先生が全32レベル・480教材を公開している表示です。",
    settings: commonSettings,
    blockedItemIds: Object.freeze([]),
    allowedItemIds: Object.freeze([]),
  }),
  starter: Object.freeze({
    key: "starter",
    label: "New learner · はじめての生徒",
    description: "A new learner sees Levels 1–4, pricing guidance and the trial/contact pathway.",
    descriptionJa: "新規生徒向けにレベル1〜4、料金・体験・お問い合わせを表示する設定です。",
    settings: Object.freeze({
      ...commonSettings,
      show_review_lessons: false,
      show_homework: false,
      show_pricing: true,
      show_contact_teacher: true,
      show_trial_cta: true,
      show_payment_plan: true,
      allowed_level_max: 4,
    }),
    blockedItemIds: Object.freeze([]),
    allowedItemIds: Object.freeze([]),
  }),
  personal: Object.freeze({
    key: "personal",
    label: "Private student · 個人レッスン生",
    description: "A private learner has selected milestone levels, homework and review, without sales links.",
    descriptionJa: "個人レッスン生向けに指定レベル、宿題、復習だけを公開した設定です。",
    settings: Object.freeze({
      ...commonSettings,
      allowed_level_max: 12,
      allowed_levels: Object.freeze([1, 2, 3, 5, 8, 12]),
    }),
    blockedItemIds: Object.freeze(["word-l01-pen"]),
    allowedItemIds: Object.freeze(["phrase-l16-01"]),
  }),
  words: Object.freeze({
    key: "words",
    label: "Words only · 単語限定",
    description: "Only Words Levels 1–8 are visible; Phrases and Phonics are hidden by the teacher.",
    descriptionJa: "先生が単語レベル1〜8だけを公開し、フレーズとフォニックスを非表示にした設定です。",
    settings: Object.freeze({
      ...commonSettings,
      show_phrases: false,
      show_phonics: false,
      show_review_lessons: false,
      show_pricing: false,
      show_contact_teacher: true,
      allowed_level_max: 8,
    }),
    blockedItemIds: Object.freeze([]),
    allowedItemIds: Object.freeze([]),
  }),
  phonics: Object.freeze({
    key: "phonics",
    label: "Phonics focus · 発音集中",
    description: "Words and Phrases are hidden; only teacher-selected Phonics milestones are open.",
    descriptionJa: "単語・フレーズを非表示にし、先生が選んだ発音レベルだけを公開した設定です。",
    settings: Object.freeze({
      ...commonSettings,
      show_words: false,
      show_phrases: false,
      show_phonics: true,
      show_review_lessons: false,
      show_pricing: false,
      show_contact_teacher: true,
      allowed_levels: Object.freeze([1, 2, 4, 8, 16, 24, 32]),
    }),
    blockedItemIds: Object.freeze([]),
    allowedItemIds: Object.freeze([]),
  }),
  disabled: Object.freeze({
    key: "disabled",
    label: "Paused account · 利用停止",
    description: "The teacher has paused this learner account, so no learning content can be opened.",
    descriptionJa: "先生がアカウントを一時停止し、教材を開けない状態です。",
    settings: Object.freeze({
      ...commonSettings,
      account_enabled: false,
    }),
    blockedItemIds: Object.freeze([]),
    allowedItemIds: Object.freeze([]),
  }),
});

export function assertLocalDemoRuntime() {
  const hostname = String(globalThis.location?.hostname || "").toLowerCase();
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)) {
    throw new Error("The curriculum demo is available only on this computer via localhost.");
  }
  return true;
}

export function getDemoPersonaKey() {
  assertLocalDemoRuntime();
  const queryKey = new URL(globalThis.location.href).searchParams.get("persona");
  const storedKey = globalThis.localStorage?.getItem(DEMO_PERSONA_STORAGE_KEY);
  const key = String(queryKey || storedKey || "full").toLowerCase();
  return Object.hasOwn(DEMO_PERSONAS, key) ? key : "full";
}

export function getDemoPersona() {
  const base = DEMO_PERSONAS[getDemoPersonaKey()];
  const overrides = readPersonaOverrides()[base.key];
  return overrides
    ? { ...base, settings: { ...base.settings, ...overrides, allowed_levels: [...overrides.allowed_levels] } }
    : base;
}

export function setDemoPersonaKey(key) {
  assertLocalDemoRuntime();
  const safeKey = Object.hasOwn(DEMO_PERSONAS, key) ? key : "full";
  globalThis.localStorage?.setItem(DEMO_PERSONA_STORAGE_KEY, safeKey);
  return safeKey;
}

export function resetDemoLearningData() {
  assertLocalDemoRuntime();
  globalThis.localStorage?.removeItem(DEMO_PROGRESS_STORAGE_KEY);
  globalThis.localStorage?.removeItem(DEMO_FAVORITES_STORAGE_KEY);
}

function readPersonaOverrides() {
  try {
    const parsed = JSON.parse(globalThis.localStorage?.getItem(DEMO_PERSONA_OVERRIDES_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

const validLevel = (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 32;

export function saveDemoPersonaSettings(key, settings) {
  assertLocalDemoRuntime();
  if (!Object.hasOwn(DEMO_PERSONAS, key)) throw new Error("Choose a valid demo learner.");
  const normalized = {};
  DEMO_BOOLEAN_SETTING_KEYS.forEach((settingKey) => {
    if (typeof settings?.[settingKey] === "boolean") normalized[settingKey] = settings[settingKey];
  });
  const minimum = Number(settings?.allowed_level_min);
  const maximum = Number(settings?.allowed_level_max);
  if (!validLevel(minimum) || !validLevel(maximum) || minimum > maximum) {
    throw new Error("Choose a valid level range from 1 to 32.");
  }
  const levels = [...new Set((Array.isArray(settings?.allowed_levels) ? settings.allowed_levels : [])
    .map(Number))].sort((left, right) => left - right);
  if (levels.some((level) => !validLevel(level))) throw new Error("Exact levels must be between 1 and 32.");
  normalized.allowed_level_min = minimum;
  normalized.allowed_level_max = maximum;
  normalized.allowed_levels = levels;
  const overrides = readPersonaOverrides();
  overrides[key] = normalized;
  globalThis.localStorage?.setItem(DEMO_PERSONA_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  return normalized;
}

export function resetDemoPersonaSettings(key) {
  assertLocalDemoRuntime();
  const overrides = readPersonaOverrides();
  delete overrides[key];
  globalThis.localStorage?.setItem(DEMO_PERSONA_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  return DEMO_PERSONAS[key] || DEMO_PERSONAS.full;
}
