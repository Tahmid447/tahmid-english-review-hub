import {
  getStudentClient,
  getStudentSession,
  getTeacherClient,
  getTeacherSession,
} from "./supabase.js?v=20260905-release5";

const CATEGORY_VALUES = new Set(["words", "phrases", "phonics"]);
const PROGRESS_VALUES = new Set(["not_started", "learning", "reviewed", "mastered"]);
const RATING_VALUES = new Set(["hard", "good", "easy"]);
const ACCESS_VALUES = new Set(["allow", "block", "inherit"]);
const BOOLEAN_SETTING_KEYS = Object.freeze([
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
const SETTING_KEYS = new Set([
  ...BOOLEAN_SETTING_KEYS,
  "allowed_level_min",
  "allowed_level_max",
  "allowed_levels",
]);

export const DEFAULT_HUB_SETTINGS = Object.freeze({
  account_enabled: true,
  show_dashboard: true,
  show_words: true,
  show_phrases: true,
  show_phonics: true,
  show_review_lessons: true,
  show_homework: true,
  show_progress: true,
  show_pricing: true,
  show_contact_teacher: true,
  show_trial_cta: true,
  show_payment_plan: true,
  show_announcements: true,
  allowed_level_min: 1,
  allowed_level_max: 4,
  allowed_levels: Object.freeze([]),
});

const success = (data) => ({ data, reason: null, error: null });
const unavailable = (data) => ({
  data,
  reason: "migration-unavailable",
  // The rollout fallback is expected and should not trip fail-closed UI paths.
  error: null,
});
const failure = (data, reason, error = null) => ({ data, reason, error });

const settingsDefaults = () => ({
  ...DEFAULT_HUB_SETTINGS,
  allowed_levels: [],
});

const normalizeSettings = (settings) => ({
  ...settingsDefaults(),
  ...(settings && typeof settings === "object" ? settings : {}),
  allowed_levels: Array.isArray(settings?.allowed_levels)
    ? settings.allowed_levels.map(Number).filter(Number.isInteger)
    : [],
});

const migrationUnavailable = (error) => {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toLowerCase();
  return ["42P01", "42703", "42883", "PGRST202", "PGRST204", "PGRST205"].includes(code)
    || message.includes("schema cache")
    || message.includes("does not exist")
    || message.includes("could not find the table")
    || message.includes("could not find the function");
};

const validCategory = (value) => CATEGORY_VALUES.has(String(value || "").toLowerCase());
const normalizedCategory = (value) => String(value || "").trim().toLowerCase();
const validLevel = (value) => Number.isInteger(Number(value))
  && Number(value) >= 1
  && Number(value) <= 32;

const normalizeRpcRow = (data) => (Array.isArray(data) ? data[0] || null : data || null);

async function studentAuth() {
  const client = getStudentClient();
  if (!client) return { client: null, session: null, reason: "client-unavailable" };
  const session = await getStudentSession();
  if (!session?.user) return { client, session: null, reason: "not-signed-in" };
  return { client, session, reason: null };
}

async function teacherAuth() {
  const client = getTeacherClient();
  if (!client) return { client: null, session: null, reason: "client-unavailable" };
  const session = await getTeacherSession();
  if (!session?.user) return { client, session: null, reason: "not-signed-in" };
  return { client, session, reason: null };
}

export async function fetchStudentHubContext() {
  const auth = await studentAuth();
  const fallback = {
    userId: auth.session?.user?.id || null,
    settings: settingsDefaults(),
    migrationReady: false,
  };
  if (auth.reason) return failure(fallback, auth.reason);

  const { data, error } = await auth.client
    .from("review_student_hub_settings")
    .select([
      "student_id",
      ...BOOLEAN_SETTING_KEYS,
      "allowed_level_min",
      "allowed_level_max",
      "allowed_levels",
      "updated_at",
    ].join(","))
    .eq("student_id", auth.session.user.id)
    .maybeSingle();

  if (migrationUnavailable(error)) return unavailable(fallback);
  if (error) return failure(fallback, "hub-settings-query-failed", error);
  if (!data) {
    return failure({
      userId: auth.session.user.id,
      settings: normalizeSettings({ account_enabled: false }),
      migrationReady: true,
    }, "hub-settings-missing", new Error(
      "The signed-in learner has no authoritative Review Hub settings row.",
    ));
  }
  return success({
    userId: auth.session.user.id,
    settings: normalizeSettings(data),
    migrationReady: true,
  });
}

export async function fetchCurriculumItems({ category, level } = {}) {
  const client = getStudentClient();
  if (!client) return failure([], "client-unavailable");
  const safeCategory = category == null ? null : normalizedCategory(category);
  if (safeCategory && !validCategory(safeCategory)) {
    return failure([], "invalid-category", new Error("Category must be words, phrases or phonics."));
  }
  if (level != null && !validLevel(level)) {
    return failure([], "invalid-level", new Error("Level must be an integer from 1 to 32."));
  }

  let query = client
    .from("review_curriculum_items")
    .select("id,category,level,title_en,title_ja,content,icon,tags,required_plan,active,is_preview,position,updated_at")
    .order("category", { ascending: true })
    .order("level", { ascending: true })
    .order("position", { ascending: true })
    .order("id", { ascending: true });
  if (safeCategory) query = query.eq("category", safeCategory);
  if (level != null) query = query.eq("level", Number(level));
  const { data, error } = await query;

  if (migrationUnavailable(error)) return unavailable([]);
  if (error) return failure([], "curriculum-items-query-failed", error);
  return success(data || []);
}

export async function fetchCurriculumLevels(category) {
  const client = getStudentClient();
  if (!client) return failure([], "client-unavailable");
  const safeCategory = category == null ? null : normalizedCategory(category);
  if (safeCategory && !validCategory(safeCategory)) {
    return failure([], "invalid-category", new Error("Category must be words, phrases or phonics."));
  }

  let query = client
    .from("review_curriculum_levels")
    .select("category,level,title_en,title_ja,description_en,description_ja,icon,active,is_preview,position,updated_at")
    .order("category", { ascending: true })
    .order("position", { ascending: true })
    .order("level", { ascending: true });
  if (safeCategory) query = query.eq("category", safeCategory);
  const { data, error } = await query;

  if (migrationUnavailable(error)) return unavailable([]);
  if (error) return failure([], "curriculum-levels-query-failed", error);
  return success(data || []);
}

export async function fetchCurriculumProgress() {
  const auth = await studentAuth();
  const fallback = { progress: [], favorites: [] };
  if (auth.reason) return failure(fallback, auth.reason);

  const [progressResult, favoritesResult] = await Promise.all([
    auth.client
      .from("review_curriculum_progress")
      .select("student_id,item_id,status,self_rating,review_count,last_reviewed_at,next_review_at,metadata,created_at,updated_at")
      .eq("student_id", auth.session.user.id)
      .order("updated_at", { ascending: false }),
    auth.client
      .from("review_curriculum_favorites")
      .select("student_id,item_id,created_at")
      .eq("student_id", auth.session.user.id)
      .order("created_at", { ascending: false }),
  ]);
  const error = progressResult.error || favoritesResult.error;
  if (migrationUnavailable(error)) return unavailable(fallback);
  if (error) return failure(fallback, "curriculum-progress-query-failed", error);
  return success({
    progress: progressResult.data || [],
    favorites: favoritesResult.data || [],
  });
}

export async function saveCurriculumProgress(itemId, { status, selfRating = null } = {}) {
  const auth = await studentAuth();
  if (auth.reason) return failure(null, auth.reason);
  const safeItemId = String(itemId || "").trim();
  const safeStatus = String(status || "").trim();
  const safeRating = selfRating == null || selfRating === ""
    ? null
    : String(selfRating).trim();
  if (!safeItemId) return failure(null, "invalid-item", new Error("Choose a curriculum item."));
  if (!PROGRESS_VALUES.has(safeStatus)) {
    return failure(null, "invalid-status", new Error("The progress status is invalid."));
  }
  if (safeRating && !RATING_VALUES.has(safeRating)) {
    return failure(null, "invalid-self-rating", new Error("The self-rating is invalid."));
  }

  const { data, error } = await auth.client.rpc("review_save_curriculum_progress", {
    target_item: safeItemId,
    next_status: safeStatus,
    next_self_rating: safeRating,
  });
  if (migrationUnavailable(error)) return unavailable(null);
  if (error) return failure(null, "curriculum-progress-save-failed", error);
  return success(normalizeRpcRow(data));
}

export async function toggleCurriculumFavorite(itemId, favorite) {
  const auth = await studentAuth();
  if (auth.reason) return failure(null, auth.reason);
  const safeItemId = String(itemId || "").trim();
  if (!safeItemId) return failure(null, "invalid-item", new Error("Choose a curriculum item."));

  const { data, error } = await auth.client.rpc("review_set_curriculum_favorite", {
    target_item: safeItemId,
    favorite: favorite === true,
  });
  if (migrationUnavailable(error)) return unavailable(null);
  if (error) return failure(null, "curriculum-favorite-save-failed", error);
  return success(Boolean(data));
}

export async function fetchStudentAnnouncements() {
  const auth = await studentAuth();
  if (auth.reason) return failure([], auth.reason);
  const { data, error } = await auth.client
    .from("review_announcements")
    .select("id,teacher_id,audience,title_en,title_ja,body_en,body_ja,starts_at,ends_at,created_at,updated_at")
    .order("starts_at", { ascending: false });
  if (migrationUnavailable(error)) return unavailable([]);
  if (error) return failure([], "announcements-query-failed", error);
  return success(data || []);
}

export async function fetchTeacherHubSettings() {
  const auth = await teacherAuth();
  if (auth.reason) return failure([], auth.reason);
  const { data, error } = await auth.client
    .from("review_student_hub_settings")
    .select("*")
    .order("created_at", { ascending: true });
  if (migrationUnavailable(error)) return unavailable([]);
  if (error) return failure([], "teacher-hub-settings-query-failed", error);
  return success((data || []).map((row) => ({
    ...row,
    ...normalizeSettings(row),
  })));
}

const normalizeSettingsPatch = (patch) => {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    throw new TypeError("Settings changes must be an object.");
  }
  const normalized = {};
  for (const [key, value] of Object.entries(patch)) {
    if (!SETTING_KEYS.has(key)) continue;
    if (BOOLEAN_SETTING_KEYS.includes(key)) {
      if (typeof value !== "boolean") throw new TypeError(`${key} must be true or false.`);
      normalized[key] = value;
      continue;
    }
    if (key === "allowed_levels") {
      if (!Array.isArray(value)) throw new TypeError("allowed_levels must be an array.");
      const levels = [...new Set(value.map(Number))].sort((left, right) => left - right);
      if (levels.some((entry) => !validLevel(entry))) {
        throw new RangeError("allowed_levels may contain only levels 1 to 32.");
      }
      normalized[key] = levels;
      continue;
    }
    if (!validLevel(value)) throw new RangeError(`${key} must be a level from 1 to 32.`);
    normalized[key] = Number(value);
  }
  const minimum = normalized.allowed_level_min;
  const maximum = normalized.allowed_level_max;
  if (minimum != null && maximum != null && minimum > maximum) {
    throw new RangeError("allowed_level_min cannot exceed allowed_level_max.");
  }
  return normalized;
};

export async function saveTeacherHubSettings(studentId, patch) {
  const auth = await teacherAuth();
  if (auth.reason) return failure(null, auth.reason);
  const safeStudentId = String(studentId || "").trim();
  if (!safeStudentId) return failure(null, "invalid-student", new Error("Choose a learner."));

  let changes;
  try {
    changes = normalizeSettingsPatch(patch);
  } catch (error) {
    return failure(null, "invalid-settings", error);
  }
  if (!Object.keys(changes).length) {
    return failure(null, "empty-settings-patch", new Error("No supported setting was provided."));
  }

  const payload = { ...changes, updated_by: auth.session.user.id };
  let result = await auth.client
    .from("review_student_hub_settings")
    .update(payload)
    .eq("student_id", safeStudentId)
    .select("*")
    .maybeSingle();
  if (!result.error && !result.data) {
    result = await auth.client
      .from("review_student_hub_settings")
      .insert({ student_id: safeStudentId, ...payload })
      .select("*")
      .single();
  }
  if (migrationUnavailable(result.error)) return unavailable(null);
  if (result.error) return failure(null, "teacher-hub-settings-save-failed", result.error);
  return success(normalizeSettings(result.data));
}

export async function saveTeacherCurriculumAccess(studentId, itemId, mode) {
  const auth = await teacherAuth();
  if (auth.reason) return failure(null, auth.reason);
  const safeStudentId = String(studentId || "").trim();
  const safeItemId = String(itemId || "").trim();
  const safeMode = String(mode || "inherit").trim().toLowerCase();
  if (!safeStudentId) return failure(null, "invalid-student", new Error("Choose a learner."));
  if (!safeItemId) return failure(null, "invalid-item", new Error("Choose a curriculum item."));
  if (!ACCESS_VALUES.has(safeMode)) {
    return failure(null, "invalid-access-mode", new Error("Mode must be allow, block or inherit."));
  }

  if (safeMode === "inherit") {
    const { error } = await auth.client
      .from("review_student_curriculum_access")
      .delete()
      .eq("student_id", safeStudentId)
      .eq("item_id", safeItemId);
    if (migrationUnavailable(error)) return unavailable(null);
    if (error) return failure(null, "teacher-curriculum-access-save-failed", error);
    return success({ student_id: safeStudentId, item_id: safeItemId, access_mode: "inherit" });
  }

  const { data, error } = await auth.client
    .from("review_student_curriculum_access")
    .upsert({
      student_id: safeStudentId,
      item_id: safeItemId,
      access_mode: safeMode,
      updated_by: auth.session.user.id,
    }, { onConflict: "student_id,item_id" })
    .select("student_id,item_id,access_mode,note,created_at,updated_at")
    .single();
  if (migrationUnavailable(error)) return unavailable(null);
  if (error) return failure(null, "teacher-curriculum-access-save-failed", error);
  return success(data);
}
