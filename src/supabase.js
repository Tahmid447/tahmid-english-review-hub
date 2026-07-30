import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.js";

let studentClient;
let teacherClient;
const userSettingsWriteQueues = new Map();

const createBrowserClient = (storageKey) => {
  if (
    typeof window === "undefined"
    || !window.supabase?.createClient
    || !SUPABASE_URL
    || !SUPABASE_ANON_KEY
  ) {
    return null;
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storageKey,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

export function getStudentClient() {
  if (!studentClient) studentClient = createBrowserClient("te-review-hub-student-auth");
  return studentClient;
}

export function getTeacherClient() {
  if (!teacherClient) teacherClient = createBrowserClient("te-review-hub-teacher-auth");
  return teacherClient;
}

export async function getStudentSession() {
  const client = getStudentClient();
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) return null;
  return data.session || null;
}

export async function getTeacherSession() {
  const client = getTeacherClient();
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) return null;
  return data.session || null;
}

export function onStudentAuthChange(callback) {
  const client = getStudentClient();
  if (!client || typeof callback !== "function") return () => {};
  const { data } = client.auth.onAuthStateChange((event, session) => callback(session, event));
  return () => data.subscription.unsubscribe();
}

export function onTeacherAuthChange(callback) {
  const client = getTeacherClient();
  if (!client || typeof callback !== "function") return () => {};
  const { data } = client.auth.onAuthStateChange((event, session) => callback(session, event));
  return () => data.subscription.unsubscribe();
}

export async function signInStudent(email, password) {
  const client = getStudentClient();
  if (!client) return { data: null, error: new Error("Sign-in is not available right now.") };
  return client.auth.signInWithPassword({ email: String(email || "").trim(), password: String(password || "") });
}

export async function signInTeacher(email, password) {
  const client = getTeacherClient();
  if (!client) return { data: null, error: new Error("Teacher sign-in is not available right now.") };
  return client.auth.signInWithPassword({ email: String(email || "").trim(), password: String(password || "") });
}

export async function signOutStudent() {
  const client = getStudentClient();
  return client ? client.auth.signOut() : { error: null };
}

export async function signOutTeacher() {
  const client = getTeacherClient();
  return client ? client.auth.signOut() : { error: null };
}

const resolveLessonRecord = async (client, lessonSlug) => {
  const { data, error } = await client
    .from("review_lessons")
    .select("id")
    .eq("slug", lessonSlug)
    .maybeSingle();
  if (error) return { id: null, error };
  return { id: data?.id || null, error: null };
};

const databaseQuestion = (row = {}) => {
  const payload = row.payload && typeof row.payload === "object" && !Array.isArray(row.payload)
    ? row.payload
    : {};
  return {
    ...payload,
    id: String(row.stable_key || payload.id || row.id || ""),
    databaseQuestionId: row.id || null,
    format: row.format || payload.format || payload.type || "mcq",
    type: row.format || payload.type || payload.format || "mcq",
    section: row.section ?? payload.section ?? "",
    isOriginal: row.is_original !== false,
    maxPoints: Number(row.points || payload.maxPoints || 1),
  };
};

export async function fetchDatabaseLesson(lessonSlug, { preview = false } = {}) {
  const slug = String(lessonSlug || "").trim();
  if (!slug) return { lesson: null, reason: "missing-lesson" };

  const client = preview ? getTeacherClient() : getStudentClient();
  if (!client) return { lesson: null, reason: "client-unavailable" };
  let authenticated = false;
  if (preview) {
    const session = await getTeacherSession();
    if (!session?.user) return { lesson: null, reason: "teacher-sign-in-required" };
    authenticated = true;
  } else {
    authenticated = Boolean((await getStudentSession())?.user);
  }

  const lessonTable = authenticated ? "review_lessons" : "review_public_lessons";
  const questionTable = authenticated ? "review_questions" : "review_public_questions";
  const lessonColumns = authenticated
    ? "id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,source_type,content_version,content"
    : "id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,content_version,content";
  const { data: lesson, error: lessonError } = await client
    .from(lessonTable)
    .select(lessonColumns)
    .eq("slug", slug)
    .maybeSingle();
  if (lessonError) {
    return { lesson: null, reason: "lesson-query-failed", error: lessonError };
  }
  if (!lesson) return { lesson: null, reason: "lesson-not-readable" };

  let questionQuery = client
    .from(questionTable)
    .select("id,stable_key,position,section,format,payload,is_original,points")
    .eq("lesson_id", lesson.id);
  if (authenticated) questionQuery = questionQuery.eq("active", true);
  questionQuery = questionQuery.order("position", { ascending: true });
  const { data: questions, error: questionError } = await questionQuery;
  if (questionError) {
    return { lesson: null, reason: "question-query-failed", error: questionError };
  }

  const content = lesson.content && typeof lesson.content === "object" && !Array.isArray(lesson.content)
    ? lesson.content
    : {};
  return {
    lesson: {
      id: lesson.slug,
      databaseLessonId: lesson.id,
      lessonDate: lesson.lesson_date,
      title: lesson.title_en,
      titleJa: lesson.title_ja || "",
      summary: lesson.summary_en || "",
      summaryJa: lesson.summary_ja || "",
      status: lesson.status,
      audience: lesson.audience,
      sourceType: lesson.source_type || "database",
      contentVersion: lesson.content_version,
      themes: Array.isArray(content.themes) ? content.themes : [],
      phrases: Array.isArray(content.phrases) ? content.phrases : [],
      categoryLabels: content.categoryLabels && typeof content.categoryLabels === "object"
        ? content.categoryLabels
        : {},
      questions: Array.isArray(questions) ? questions.map(databaseQuestion) : [],
    },
    reason: null,
  };
}

const feedbackBandFor = (result = {}) => {
  const speechBand = result?.answer?.band;
  if (speechBand === "excellent") return "great";
  if (speechBand === "good") return "good";
  if (speechBand === "keep-going") return "keep_practising";
  if (speechBand === "self-practice" || speechBand === "unavailable") return "not_scored";
  const score = Number(result?.score || 0);
  const max = Number(result?.max || 1);
  if (score >= max) return "great";
  if (score > 0) return "almost";
  return "keep_practising";
};

const saveAnswerRecords = async ({
  client,
  session,
  attemptId,
  lessonId,
  snapshot,
}) => {
  const latestResults = snapshot?.results && typeof snapshot.results === "object"
    ? snapshot.results
    : {};
  const firstResults = snapshot?.firstResults && typeof snapshot.firstResults === "object"
    ? snapshot.firstResults
    : latestResults;
  const answerCounts = snapshot?.answerCounts && typeof snapshot.answerCounts === "object"
    ? snapshot.answerCounts
    : {};
  const stableKeys = Object.keys(latestResults).filter((key) => latestResults[key]);
  if (!stableKeys.length || !attemptId) {
    return { saved: false, reason: "no-answer-records" };
  }

  const { data: questions, error: questionError } = await client
    .from("review_questions")
    .select("id,stable_key")
    .eq("lesson_id", lessonId)
    .in("stable_key", stableKeys);
  if (questionError) {
    return { saved: false, reason: "question-query-failed", error: questionError };
  }
  const questionIds = new Map(
    (questions || []).map((question) => [String(question.stable_key), question.id]),
  );
  const records = stableKeys.flatMap((stableKey) => {
    const questionId = questionIds.get(stableKey);
    const latest = latestResults[stableKey];
    const first = firstResults[stableKey] || latest;
    if (!questionId || !latest) return [];
    return [{
      attempt_id: attemptId,
      question_id: questionId,
      user_id: session.user.id,
      lesson_id: lessonId,
      answer: {
        first: first?.answer ?? null,
        latest: latest?.answer ?? null,
      },
      first_is_correct: Boolean(first?.correct),
      first_points: Number(first?.score || 0),
      latest_is_correct: Boolean(latest?.correct),
      latest_points: Number(latest?.score || 0),
      answer_count: Math.max(1, Number(answerCounts[stableKey] || 1)),
      feedback_band: feedbackBandFor(latest),
      first_answered_at: first?.checkedAt || new Date().toISOString(),
      last_answered_at: latest?.checkedAt || new Date().toISOString(),
    }];
  });
  if (!records.length) return { saved: false, reason: "questions-not-synced" };

  const { error } = await client
    .from("review_answers")
    .upsert(records, { onConflict: "attempt_id,question_id" });
  return error
    ? { saved: false, reason: "answer-upsert-failed", error }
    : { saved: true, count: records.length };
};

export async function saveAttempt(payload = {}) {
  const client = getStudentClient();
  if (!client) return { saved: false, reason: "client-unavailable" };
  const session = await getStudentSession();
  if (!session?.user) return { saved: false, reason: "not-signed-in" };

  const lessonSlug = String(payload.lessonId || "").trim();
  if (!lessonSlug) return { saved: false, reason: "missing-lesson" };
  const lessonRecord = await resolveLessonRecord(client, lessonSlug);
  if (lessonRecord.error) return { saved: false, reason: "lesson-query-failed", error: lessonRecord.error };
  if (!lessonRecord.id) return { saved: false, reason: "lesson-not-synced" };

  const clientAttemptId = String(
    payload.clientAttemptId
    || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${lessonSlug}`),
  );
  const record = {
    client_attempt_key: clientAttemptId,
    user_id: session.user.id,
    lesson_id: lessonRecord.id,
    practice_mode: payload.practiceMode === "instant" ? "instant" : "manual",
    first_score: Number(payload.firstScore || 0),
    max_score: Number(payload.maxScore || 0),
    answered_count: Number(payload.answeredCount || 0),
    question_count: Number(payload.questionCount || 0),
    wrong_count: Number(payload.wrongCount || 0),
    duration_seconds: Math.max(0, Number(payload.durationSeconds || 0)),
    answer_snapshot: payload.answers && typeof payload.answers === "object" ? payload.answers : {},
    started_at: payload.startedAt || null,
    completed_at: payload.completedAt || new Date().toISOString(),
  };
  const { data: existing } = await client
    .from("review_attempts")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("client_attempt_key", clientAttemptId)
    .maybeSingle();
  let data;
  let error;
  if (existing?.id) {
    ({ data, error } = await client
      .from("review_attempts")
      .update(record)
      .eq("id", existing.id)
      .select("id")
      .maybeSingle());
  } else {
    ({ data, error } = await client
      .from("review_attempts")
      .insert(record)
      .select("id")
      .maybeSingle());
    if (error?.code === "23505") {
      const retry = await client
        .from("review_attempts")
        .update(record)
        .eq("user_id", session.user.id)
        .eq("client_attempt_key", clientAttemptId)
        .select("id")
        .maybeSingle();
      data = retry.data;
      error = retry.error;
    }
  }
  if (error) return { saved: false, reason: "insert-failed", error };
  const attemptId = data?.id || existing?.id || null;
  const answerSync = await saveAnswerRecords({
    client,
    session,
    attemptId,
    lessonId: lessonRecord.id,
    snapshot: record.answer_snapshot,
  });
  return {
    saved: true,
    id: attemptId,
    clientAttemptId,
    answerSync,
  };
}

export async function saveSpeakingActivity(payload = {}) {
  const client = getStudentClient();
  if (!client) return { saved: false, reason: "client-unavailable" };
  const session = await getStudentSession();
  if (!session?.user) return { saved: false, reason: "not-signed-in" };

  const targetText = String(payload.targetText || "").trim();
  if (!targetText) return { saved: false, reason: "missing-target" };
  const lessonRecord = await resolveLessonRecord(client, String(payload.lessonId || "").trim());
  if (lessonRecord.error) {
    return { saved: false, reason: "lesson-query-failed", error: lessonRecord.error };
  }
  if (!lessonRecord.id) return { saved: false, reason: "lesson-not-synced" };

  let questionId = null;
  const stableKey = String(payload.questionId || "").trim();
  if (stableKey) {
    const { data, error } = await client
      .from("review_questions")
      .select("id")
      .eq("lesson_id", lessonRecord.id)
      .eq("stable_key", stableKey)
      .eq("active", true)
      .maybeSingle();
    if (!error) questionId = data?.id || null;
  }

  const band = {
    excellent: "great",
    good: "good",
    "keep-going": "keep_practising",
    "self-practice": "not_scored",
    unavailable: "not_scored",
  }[payload.feedbackBand] || "not_scored";
  const { error } = await client.from("review_speaking_activity").insert({
    user_id: session.user.id,
    lesson_id: lessonRecord.id,
    question_id: questionId,
    target_text: targetText,
    transcript: String(payload.transcript || "").trim() || null,
    feedback_band: band,
    recognition_available: Boolean(payload.recognitionAvailable),
    practiced_at: payload.practicedAt || new Date().toISOString(),
  });
  return error
    ? { saved: false, reason: "speaking-insert-failed", error }
    : { saved: true };
}

export async function loadUserSettings(expectedUserId = null) {
  const client = getStudentClient();
  if (!client) return { loaded: false, reason: "client-unavailable", settings: null };
  const session = await getStudentSession();
  if (!session?.user) return { loaded: false, reason: "not-signed-in", settings: null };
  const userId = String(session.user.id);
  if (expectedUserId && String(expectedUserId) !== userId) {
    return { loaded: false, reason: "auth-changed", settings: null };
  }
  const { data, error } = await client
    .from("review_user_settings")
    .select("settings,updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return { loaded: false, reason: "query-failed", error, settings: null };
  const settings = data?.settings && typeof data.settings === "object" && !Array.isArray(data.settings)
    ? data.settings
    : null;
  return settings
    ? {
      loaded: true,
      settings,
      userId,
      updatedAt: data.updated_at || null,
    }
    : { loaded: false, reason: "not-found", settings: null, userId };
}

const saveUserSettingsNow = async (settings = {}, expectedUserId = null) => {
  const client = getStudentClient();
  if (!client) return { saved: false, reason: "client-unavailable" };
  const session = await getStudentSession();
  if (!session?.user) return { saved: false, reason: "not-signed-in" };
  const userId = String(session.user.id);
  if (expectedUserId && String(expectedUserId) !== userId) {
    return { saved: false, reason: "auth-changed" };
  }
  const { error } = await client.from("review_user_settings").upsert({
    user_id: userId,
    settings: settings && typeof settings === "object" && !Array.isArray(settings)
      ? settings
      : {},
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  return error ? { saved: false, reason: "upsert-failed", error } : { saved: true };
};

export function saveUserSettings(settings = {}, { expectedUserId = null } = {}) {
  const queueKey = expectedUserId ? String(expectedUserId) : "current-session";
  const snapshot = settings && typeof settings === "object" && !Array.isArray(settings)
    ? { ...settings }
    : {};
  const previous = userSettingsWriteQueues.get(queueKey) || Promise.resolve();
  const task = previous
    .catch(() => {})
    .then(() => saveUserSettingsNow(snapshot, expectedUserId));
  userSettingsWriteQueues.set(queueKey, task);
  task.finally(() => {
    if (userSettingsWriteQueues.get(queueKey) === task) {
      userSettingsWriteQueues.delete(queueKey);
    }
  });
  return task;
}
