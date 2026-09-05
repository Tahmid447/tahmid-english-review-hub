import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.js?v=20260905-release5";
import { normalizePlanKey, planFor, planMeetsRequirement } from "./plans.js?v=20260905-release5";
import {
  compareLessonSourceOrder,
  sourceSegmentFromLesson,
  sourceSegmentPartIndex,
} from "./lesson-source.js?v=20260905-release5";

let studentClient;
let teacherClient;
const userSettingsWriteQueues = new Map();
const AUTH_OPERATION_TIMEOUT_MS = 15000;
const STUDENT_AUTH_STORAGE_KEY = "te-review-hub-student-auth";
const TEACHER_AUTH_STORAGE_KEY = "te-review-hub-teacher-auth";
const TEACHER_PREVIEW_PLANS = new Set(["free", "standard", "premium", "premium_plus"]);
const REVIEW_PROFILE_REQUIRED_FIELDS = Object.freeze([
  "first_name",
  "last_name",
  "age_group",
  "native_language",
  "english_level",
]);
const PREMIUM_RECORDING_EXTENSIONS = new Set(["webm", "m4a", "ogg", "mp3"]);
const UUID_SEGMENT_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OBJECT_ID_PATTERN = /^[A-Za-z0-9-]+$/;
const teacherPreviewTasksByLesson = new Map();
let teacherPreviewMutationObserver;

export const reviewProfileIsComplete = (profile) => (
  Boolean(profile)
  && REVIEW_PROFILE_REQUIRED_FIELDS.every((field) => String(profile[field] || "").trim())
);

export function premiumRecordingObjectPath({ userId, taskId, objectId, extension }) {
  const safeUserId = String(userId || "").trim();
  const safeTaskId = String(taskId || "").trim();
  const safeObjectId = String(objectId || "").trim();
  const safeExtension = String(extension || "").trim().toLowerCase();
  if (!UUID_SEGMENT_PATTERN.test(safeUserId) || !UUID_SEGMENT_PATTERN.test(safeTaskId)) {
    throw new Error("A valid learner and speaking task are required for this recording.");
  }
  if (!OBJECT_ID_PATTERN.test(safeObjectId)) {
    throw new Error("The recording object identifier is invalid.");
  }
  if (!PREMIUM_RECORDING_EXTENSIONS.has(safeExtension)) {
    throw new Error("The recording file type is not supported.");
  }
  return `${safeUserId}/${safeTaskId}/${safeObjectId}.${safeExtension}`;
}

const teacherPreviewPlanFromLocation = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") !== "1") return null;
  const requested = String(params.get("previewPlan") || "premium_plus").toLowerCase();
  return TEACHER_PREVIEW_PLANS.has(requested) ? requested : "premium_plus";
};

const installTeacherPlanPreviewBanner = (planKey, publicationStatus = "published") => {
  if (typeof document === "undefined") return;
  const existing = document.querySelector("#teacherPlanPreviewBanner");
  if (existing) existing.remove();
  const banner = document.createElement("aside");
  banner.id = "teacherPlanPreviewBanner";
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  banner.style.cssText = [
    "position:relative",
    "z-index:20",
    "max-width:1120px",
    "margin:18px auto",
    "padding:14px 18px",
    "border:2px solid #7c3aed",
    "border-radius:16px",
    "background:#f3e8ff",
    "color:#35105f",
    "box-shadow:0 10px 28px rgba(76,29,149,.16)",
    "font:700 15px/1.45 system-ui,sans-serif",
  ].join(";");
  const label = planFor(planKey).name;
  const statusNote = publicationStatus === "published"
    ? ""
    : ` · ${String(publicationStatus).toUpperCase()} CONTENT`;
  banner.append(document.createTextNode(`Teacher preview: ${label} learner${statusNote} · 教師プレビュー（${label}） — `));
  const note = document.createElement("span");
  note.style.fontWeight = "500";
  note.textContent = "This view does not grant or change learner access, progress or submissions. Interactive submission controls are disabled. ";
  banner.append(note);
  const back = document.createElement("a");
  back.href = "/teacher.html";
  back.textContent = "Return to Teacher Studio";
  back.style.cssText = "color:inherit;text-decoration:underline;font-weight:800";
  banner.append(back);
  const target = document.querySelector(".lesson-banner, #quizMain, main");
  if (target?.parentNode) target.parentNode.insertBefore(banner, target);
  else document.body.prepend(banner);

  const disableSubmissionControls = () => {
    document.querySelectorAll(
      "#premiumTasksPanel textarea, #premiumTasksPanel .premium-task-actions button, #premiumTasksPanel .premium-recorder button",
    ).forEach((control) => {
      control.disabled = true;
      control.setAttribute("aria-disabled", "true");
      control.title = "Disabled in teacher plan preview";
    });
  };
  teacherPreviewMutationObserver?.disconnect();
  disableSubmissionControls();
  teacherPreviewMutationObserver = new MutationObserver(disableSubmissionControls);
  teacherPreviewMutationObserver.observe(document.body, { childList: true, subtree: true });
};

const withOperationTimeout = async (
  operation,
  message = "The request took too long. Please check your connection and try again.",
  timeoutMs = AUTH_OPERATION_TIMEOUT_MS,
) => {
  let timeout;
  try {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise((_, reject) => {
        timeout = globalThis.setTimeout(() => reject(new Error(message)), timeoutMs);
      }),
    ]);
  } finally {
    globalThis.clearTimeout(timeout);
  }
};

const dispatchAuthChange = (callback, session, event) => {
  // Supabase fires this callback while its auth client still owns an internal
  // lock. Starting another Supabase request before the callback returns can
  // deadlock signInWithPassword and leave the UI on “Signing in…” forever.
  // Release the auth callback immediately, then do application work next tick.
  globalThis.setTimeout(() => {
    try {
      Promise.resolve(callback(session, event)).catch((error) => {
        console.error("Authentication state refresh failed.", error);
      });
    } catch (error) {
      console.error("Authentication state refresh failed.", error);
    }
  }, 0);
};

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
  if (!studentClient) studentClient = createBrowserClient(STUDENT_AUTH_STORAGE_KEY);
  return studentClient;
}

export function getTeacherClient() {
  if (!teacherClient) teacherClient = createBrowserClient(TEACHER_AUTH_STORAGE_KEY);
  return teacherClient;
}

const getBoundedSession = async (client) => {
  let timeout;
  try {
    return await Promise.race([
      client.auth.getSession(),
      new Promise((resolve) => {
        timeout = globalThis.setTimeout(
          () => resolve({ data: { session: null }, error: null, timedOut: true }),
          5000,
        );
      }),
    ]);
  } finally {
    globalThis.clearTimeout(timeout);
  }
};

export async function getStudentSession() {
  const client = getStudentClient();
  if (!client) return null;
  const { data, error } = await getBoundedSession(client);
  if (error) return null;
  return data.session || null;
}

export async function getTeacherSession() {
  const client = getTeacherClient();
  if (!client) return null;
  const { data, error } = await getBoundedSession(client);
  if (error) return null;
  return data.session || null;
}

export function onStudentAuthChange(callback) {
  const client = getStudentClient();
  if (!client || typeof callback !== "function") return () => {};
  const { data } = client.auth.onAuthStateChange((event, session) => {
    dispatchAuthChange(callback, session, event);
  });
  return () => data.subscription.unsubscribe();
}

export function onTeacherAuthChange(callback) {
  const client = getTeacherClient();
  if (!client || typeof callback !== "function") return () => {};
  const { data } = client.auth.onAuthStateChange((event, session) => {
    dispatchAuthChange(callback, session, event);
  });
  return () => data.subscription.unsubscribe();
}

export async function signInStudent(email, password) {
  const client = getStudentClient();
  if (!client) return { data: null, error: new Error("Sign-in is not available right now.") };
  try {
    return await withOperationTimeout(
      client.auth.signInWithPassword({
        email: String(email || "").trim(),
        password: String(password || ""),
      }),
      "Sign-in took too long. Nothing was changed. Please check your connection and try again.",
    );
  } catch (error) {
    return { data: null, error };
  }
}

export async function signUpStudent(profile = {}) {
  const client = getStudentClient();
  if (!client) return { data: null, error: new Error("Account creation is not available right now.") };
  const firstName = String(profile.firstName || "").trim();
  const lastName = String(profile.lastName || "").trim();
  try {
    return await withOperationTimeout(
      client.auth.signUp({
        email: String(profile.email || "").trim(),
        password: String(profile.password || ""),
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}?account=confirmed`,
          data: {
            app: "review_hub",
            display_name: [firstName, lastName].filter(Boolean).join(" "),
            first_name: firstName,
            last_name: lastName,
            age_group: String(profile.ageGroup || "").trim(),
            native_language: String(profile.nativeLanguage || "").trim(),
            english_level: String(profile.englishLevel || "").trim(),
            learning_goal: String(profile.learningGoal || "").trim(),
          },
        },
      }),
      "Account creation took too long. Please check your connection and try again.",
    );
  } catch (error) {
    return { data: null, error };
  }
}

export async function googleStudentAuthAvailable() {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      cache: "no-store",
      signal: controller.signal,
    });
    const settings = response.ok ? await response.json() : null;
    return settings?.external?.google === true;
  } catch {
    return false;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function signInStudentWithGoogle() {
  const client = getStudentClient();
  if (!client) return { data: null, error: new Error("Google sign-in is not available right now.") };
  if (!await googleStudentAuthAvailable()) {
    return { data: null, error: new Error("Google sign-in is not configured yet.") };
  }
  try {
    return await withOperationTimeout(client.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}${window.location.pathname}?account=google`,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    }), "Google sign-in took too long. Please try again.");
  } catch (error) {
    return { data: null, error };
  }
}

async function updateStudentProfileRow(client, userId, payload) {
  // `user_id` is intentionally insert-only. Learners have column-level UPDATE
  // grants for their editable profile fields, but never for the ownership key.
  // Sending `user_id` through an UPSERT makes PostgreSQL require UPDATE on that
  // protected column even when its value is unchanged.
  const { user_id: _ownerId, ...updates } = payload;
  return client
    .from("review_profiles")
    .update(updates)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
}

function selectStudentProfileRow(client, userId) {
  return client
    .from("review_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}

export async function persistStudentProfileRow(client, userId, payload, exists, allowUpdate = true) {
  if (exists) {
    return allowUpdate
      ? updateStudentProfileRow(client, userId, payload)
      : selectStudentProfileRow(client, userId);
  }

  const inserted = await client
    .from("review_profiles")
    .insert(payload)
    .select("*")
    .maybeSingle();

  // Initial session delivery and the auth-state callback may race on a brand
  // new account. An explicit form save may safely update the now-owned row;
  // an automatic ensure only re-reads it so stale metadata cannot win later.
  if (inserted.error?.code === "23505") {
    return allowUpdate
      ? updateStudentProfileRow(client, userId, payload)
      : selectStudentProfileRow(client, userId);
  }
  return inserted;
}

export async function ensureStudentProfile(session, values = {}) {
  const client = getStudentClient();
  const user = session?.user;
  if (!client || !user) return { profile: null, error: null };
  const { data: existingProfile, error: profileReadError } = await selectStudentProfileRow(client, user.id);
  if (profileReadError) return { profile: null, error: profileReadError };
  const hasExplicitValues = Object.keys(values).length > 0;
  // Session initialisation only needs to ensure that a row exists. Once it
  // does, never rewrite it from a possibly stale automatic auth callback.
  if (existingProfile && !hasExplicitValues) {
    return { profile: existingProfile, error: null };
  }
  const metadata = user.user_metadata || {};
  const fullName = String(metadata.full_name || metadata.name || "").trim();
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = String(values.firstName || existingProfile?.first_name || metadata.first_name || nameParts[0] || "").trim();
  const lastName = String(values.lastName || existingProfile?.last_name || metadata.last_name || nameParts.slice(1).join(" ") || "").trim();
  const payload = {
    user_id: user.id,
    display_name: [firstName, lastName].filter(Boolean).join(" ") || fullName || null,
    avatar_url: existingProfile?.avatar_url || metadata.avatar_url || metadata.picture || null,
    contact_email: user.email || null,
    first_name: firstName || null,
    last_name: lastName || null,
    age_group: values.ageGroup || existingProfile?.age_group || metadata.age_group || null,
    native_language: values.nativeLanguage || existingProfile?.native_language || metadata.native_language || null,
    english_level: values.englishLevel || existingProfile?.english_level || metadata.english_level || null,
    learning_goal: values.learningGoal || existingProfile?.learning_goal || metadata.learning_goal || null,
    locale: existingProfile?.locale || "ja",
  };
  const { data, error } = await persistStudentProfileRow(
    client,
    user.id,
    payload,
    Boolean(existingProfile),
    hasExplicitValues,
  );
  return { profile: data || null, error };
}

export async function getStudentProfile() {
  const client = getStudentClient();
  const session = await getStudentSession();
  if (!client || !session?.user) return { profile: null, signedIn: false, error: null };
  const { data, error } = await client
    .from("review_profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();
  return { profile: data || null, signedIn: true, error };
}

export async function getStudentMembership() {
  const client = getStudentClient();
  const session = await getStudentSession();
  if (!client || !session?.user) return { membership: null, active: false, signedIn: false };
  const { data, error } = await client
    .from("review_memberships")
    .select("user_id,status,access_scope,plan_tier,plan_label,starts_at,expires_at,approval_source")
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (error) return { membership: null, active: false, signedIn: true, error };
  const active = data?.status === "active"
    && new Date(data?.starts_at || 0).getTime() <= Date.now()
    && new Date(data?.expires_at || 0).getTime() > Date.now();
  return { membership: data || null, active, signedIn: true, error: null };
}

export async function hasStudentAccess(scope = "general") {
  const client = getStudentClient();
  if (!client) return false;
  const { data, error } = await client.rpc("review_has_active_membership", {
    requested_scope: scope,
  });
  return !error && data === true;
}

export async function fetchPremiumLessonTasks(databaseLessonId) {
  const previewPlan = teacherPreviewPlanFromLocation();
  if (previewPlan) {
    const session = await getTeacherSession();
    const cached = teacherPreviewTasksByLesson.get(String(databaseLessonId || "")) || [];
    let previewTasks = cached;
    if (session?.user && planMeetsRequirement(previewPlan, "premium") && databaseLessonId) {
      const teacherClient = getTeacherClient();
      const { data } = await teacherClient
        .from("review_premium_tasks")
        .select("id,lesson_id,stable_key,task_type,title_en,title_ja,prompt_en,prompt_ja,instructions_en,instructions_ja,required_phrases,required_vocabulary,topics,target_seconds,min_word_count,max_word_count,max_attempts,active")
        .eq("lesson_id", databaseLessonId)
        .eq("active", true)
        .order("task_type", { ascending: true });
      if (Array.isArray(data)) previewTasks = data;
    }
    return {
      plan: previewPlan,
      // The preview RPC already removed task payloads below Premium. Premium
      // previews may render cards, but mutating controls remain disabled by the
      // preview-aware learner component.
      tasks: planMeetsRequirement(previewPlan, "premium") ? previewTasks : [],
      submissions: [],
      feedback: [],
      signedIn: Boolean(session?.user),
      teacherPreview: true,
      error: session?.user ? null : new Error("Teacher sign-in is required for plan preview."),
    };
  }
  const client = getStudentClient();
  const session = await getStudentSession();
  if (!client || !session?.user || !databaseLessonId) {
    return { plan: "free", tasks: [], submissions: [], feedback: [], signedIn: Boolean(session?.user), error: null };
  }
  const { data: planData, error: planError } = await client.rpc("review_effective_plan");
  if (planError) return { plan: "free", tasks: [], submissions: [], feedback: [], signedIn: true, error: planError };
  const plan = normalizePlanKey(planData);
  if (!planMeetsRequirement(plan, "premium")) return { plan, tasks: [], submissions: [], feedback: [], signedIn: true, error: null };
  const { data: tasks, error: taskError } = await client
    .from("review_premium_tasks")
    .select("id,lesson_id,stable_key,task_type,title_en,title_ja,prompt_en,prompt_ja,instructions_en,instructions_ja,required_phrases,required_vocabulary,topics,target_seconds,min_word_count,max_word_count,max_attempts,active")
    .eq("lesson_id", databaseLessonId)
    .eq("active", true)
    .order("task_type", { ascending: true });
  if (taskError) return { plan, tasks: [], submissions: [], feedback: [], signedIn: true, error: taskError };
  const taskIds = (tasks || []).map((task) => task.id);
  if (!taskIds.length) return { plan, tasks: [], submissions: [], feedback: [], signedIn: true, error: null };
  const { data: submissions, error: submissionError } = await client
    .from("review_task_submissions")
    .select("id,task_id,user_id,attempt_number,status,selected_topic_key,text_response,audio_object_path,transcript,duration_seconds,submitted_at,reviewed_at,created_at,updated_at")
    .in("task_id", taskIds)
    .eq("user_id", session.user.id)
    .order("attempt_number", { ascending: false });
  if (submissionError) return { plan, tasks: tasks || [], submissions: [], feedback: [], signedIn: true, error: submissionError };
  const submissionIds = (submissions || []).map((submission) => submission.id);
  let feedback = [];
  if (submissionIds.length) {
    const { data, error } = await client
      .from("review_submission_feedback")
      .select("id,submission_id,score,rubric,feedback_en,feedback_ja,ai_assisted,published_at,created_at,updated_at")
      .in("submission_id", submissionIds);
    if (error) return { plan, tasks: tasks || [], submissions: submissions || [], feedback: [], signedIn: true, error };
    feedback = data || [];
  }
  return { plan, tasks: tasks || [], submissions: submissions || [], feedback, signedIn: true, error: null };
}

const nextPremiumAttempt = (submissions, taskId) => (
  Math.max(0, ...submissions.filter((item) => item.task_id === taskId).map((item) => Number(item.attempt_number || 0))) + 1
);

export async function savePremiumTextSubmission({ taskId, topicKey, textResponse, submit = false, knownSubmissions = [] }) {
  if (teacherPreviewPlanFromLocation()) {
    return { data: null, error: new Error("Submissions are disabled in teacher plan preview.") };
  }
  const client = getStudentClient();
  const session = await getStudentSession();
  if (!client || !session?.user) return { data: null, error: new Error("Sign in before saving a Premium submission.") };
  const editable = knownSubmissions.find((item) => item.task_id === taskId && ["draft", "returned"].includes(item.status));
  const payload = {
    selected_topic_key: String(topicKey || "").trim() || null,
    text_response: String(textResponse || ""),
    status: submit ? "submitted" : "draft",
    submitted_at: submit ? new Date().toISOString() : null,
  };
  if (editable) {
    return client.from("review_task_submissions").update(payload).eq("id", editable.id).select("*").single();
  }
  return client.from("review_task_submissions").insert({
    ...payload,
    task_id: taskId,
    user_id: session.user.id,
    attempt_number: nextPremiumAttempt(knownSubmissions, taskId),
    client_submission_key: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  }).select("*").single();
}

export async function submitPremiumRecording({ taskId, topicKey, recording, durationSeconds, knownSubmissions = [] }) {
  if (teacherPreviewPlanFromLocation()) {
    return { data: null, error: new Error("Recordings are disabled in teacher plan preview.") };
  }
  const client = getStudentClient();
  const session = await getStudentSession();
  if (!client || !session?.user) return { data: null, error: new Error("Sign in before submitting a recording.") };
  if (!(recording instanceof Blob) || !recording.size) return { data: null, error: new Error("Record your answer before submitting it.") };
  const editable = knownSubmissions.find((item) => item.task_id === taskId && ["draft", "returned"].includes(item.status));
  const attemptNumber = editable?.attempt_number || nextPremiumAttempt(knownSubmissions, taskId);
  const requestedType = String(recording.type || "audio/webm").split(";", 1)[0].toLowerCase();
  const contentType = ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg"].includes(requestedType)
    ? requestedType
    : "audio/webm";
  const extension = {
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
  }[contentType] || "webm";
  let objectName;
  try {
    objectName = premiumRecordingObjectPath({
      userId: session.user.id,
      taskId,
      objectId: globalThis.crypto?.randomUUID?.() || Date.now(),
      extension,
    });
  } catch (error) {
    return { data: null, error };
  }
  const { error: uploadError } = await client.storage.from("review-premium-recordings").upload(objectName, recording, {
    cacheControl: "3600",
    contentType,
    upsert: false,
  });
  if (uploadError) return { data: null, error: uploadError };
  const payload = {
    selected_topic_key: String(topicKey || "").trim() || null,
    audio_object_path: objectName,
    duration_seconds: Math.max(1, Math.round(Number(durationSeconds || 1))),
    status: "submitted",
    submitted_at: new Date().toISOString(),
  };
  const result = editable
    ? await client.from("review_task_submissions").update(payload).eq("id", editable.id).select("*").single()
    : await client.from("review_task_submissions").insert({
        ...payload,
        task_id: taskId,
        user_id: session.user.id,
        attempt_number: attemptNumber,
        client_submission_key: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      }).select("*").single();
  if (result.error) {
    await client.storage.from("review-premium-recordings").remove([objectName]);
  } else if (editable?.audio_object_path && editable.audio_object_path !== objectName) {
    // A returned recording may be replaced. Remove the superseded private
    // object only after the database points at the new upload, preventing
    // orphaned recordings and unnecessary storage costs.
    await client.storage.from("review-premium-recordings").remove([editable.audio_object_path]);
  }
  return result;
}

export async function getPremiumRecordingUrl(objectPath, expiresIn = 900) {
  const client = getStudentClient();
  if (!client || !objectPath) return { data: null, error: new Error("Recording is unavailable.") };
  return client.storage
    .from("review-premium-recordings")
    .createSignedUrl(String(objectPath), Math.max(60, Math.min(3600, Number(expiresIn || 900))));
}

const invokeMembershipAccess = async (client, body) => {
  if (!client) return { data: null, error: new Error("The membership service is unavailable.") };
  const { data: sessionData } = await client.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) return { data: null, error: new Error("Please sign in first.") };
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/membership-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.error) {
      return { data: null, error: new Error(payload?.error || "The membership request could not be completed.") };
    }
    return { data: payload, error: null };
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "The membership request took too long, so its result could not be confirmed. Refresh and check the current membership or code list before trying again."
      : "The membership service could not be reached. Please check your connection and try again.";
    return { data: null, error: new Error(message) };
  } finally {
    window.clearTimeout(timeout);
  }
};

export async function redeemStudentAccessCode(code) {
  const client = getStudentClient();
  if (!client) return { data: null, error: new Error("Code redemption is not available right now.") };
  const normalised = String(code || "").trim().toUpperCase();
  if (!/^TEC-[A-F0-9]{12}$/.test(normalised)) {
    return {
      data: null,
      error: new Error("Enter the full code in the format TEC-XXXXXXXXXXXX. The four characters shown in Teacher Studio history are not the full code."),
    };
  }
  return invokeMembershipAccess(client, {
    action: "redeem",
    code: normalised,
  });
}

export async function createTeacherAccessCode({ label, durationDays, accessScope, planTier = "standard", maxUses, validUntil = null }) {
  const client = getTeacherClient();
  if (!client) return { data: null, error: new Error("Code generation is not available right now.") };
  return invokeMembershipAccess(client, {
    action: "create",
    label,
    durationDays,
    accessScope,
    planTier,
    maxUses,
    validUntil,
  });
}

export async function updateTeacherAccessCode({
  codeId,
  label,
  durationDays,
  accessScope,
  planTier = "standard",
  maxUses,
  validUntil = null,
  enabled = true,
}) {
  return invokeMembershipAccess(getTeacherClient(), {
    action: "update",
    codeId,
    label,
    durationDays,
    accessScope,
    planTier,
    maxUses,
    validUntil,
    enabled,
  });
}

export async function deleteTeacherAccessCode(codeId) {
  return invokeMembershipAccess(getTeacherClient(), { action: "delete", codeId });
}

export async function reissueTeacherAccessCode(codeId) {
  return invokeMembershipAccess(getTeacherClient(), { action: "reissue", codeId });
}

export async function getTeacherLearnerAuthStatus(learnerId) {
  return invokeMembershipAccess(getTeacherClient(), { action: "learner-auth-status", learnerId });
}

export async function saveTeacherSubmissionReview({
  submissionId,
  action,
  score = null,
  feedbackEn = null,
  feedbackJa = null,
}) {
  const client = getTeacherClient();
  const session = await getTeacherSession();
  if (!client || !session?.user) {
    return { data: null, error: new Error("Teacher sign-in is required to review a submission.") };
  }
  return client.rpc("review_save_submission_review", {
    target_submission: String(submissionId || ""),
    review_action: String(action || ""),
    review_score: score === "" || score === null || score === undefined ? null : Number(score),
    review_feedback_en: String(feedbackEn || "").trim() || null,
    review_feedback_ja: String(feedbackJa || "").trim() || null,
    // Compatibility parameter for the existing database signature. New
    // Teacher Studio reviews never create AI-assisted feedback.
    review_ai_assisted: false,
  });
}

export async function signInTeacher(email, password) {
  const client = getTeacherClient();
  if (!client) return { data: null, error: new Error("Teacher sign-in is not available right now.") };
  try {
    return await withOperationTimeout(
      client.auth.signInWithPassword({
        email: String(email || "").trim(),
        password: String(password || ""),
      }),
      "Teacher sign-in took too long. Nothing was changed. Please check your connection and try again.",
    );
  } catch (error) {
    return { data: null, error };
  }
}

export async function signInTeacherWithGoogle() {
  const client = getTeacherClient();
  if (!client) return { data: null, error: new Error("Teacher Google sign-in is not available right now.") };
  if (!await googleStudentAuthAvailable()) {
    return { data: null, error: new Error("Google sign-in is not configured yet.") };
  }
  try {
    return await withOperationTimeout(client.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/teacher.html?account=google`,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    }), "Google sign-in took too long. Please try again.");
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOutStudent() {
  const client = getStudentClient();
  if (!client) return { error: null };
  let result;
  try {
    result = await withOperationTimeout(
      client.auth.signOut({ scope: "local" }),
      "Student sign-out took too long. The local session was cleared; refresh before signing in again.",
    );
  } catch (error) {
    result = { error };
  }
  // A stale or expired server session must not leave the browser looking
  // signed in. Supabase keeps this session in the named student storage key.
  try {
    window.localStorage.removeItem(STUDENT_AUTH_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in strict privacy mode.
  }
  // The hub performs a hard navigation after this cleanup. Dropping the
  // reference prevents a timed-out SDK request from leaving an authenticated
  // in-memory client attached to the visible signed-out page.
  studentClient = undefined;
  if (result?.error && /session.*missing|auth session/i.test(String(result.error.message || ""))) {
    return { error: null };
  }
  return result;
}

export async function signOutTeacher() {
  const client = getTeacherClient();
  if (!client) return { error: null };
  let result;
  try {
    result = await withOperationTimeout(
      client.auth.signOut({ scope: "local" }),
      "Teacher sign-out took too long. The local session was cleared; refresh before signing in again.",
    );
  } catch (error) {
    result = { error };
  }
  try {
    window.localStorage.removeItem(TEACHER_AUTH_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in strict privacy mode.
  }
  // Discard this module's client reference too. The Teacher Studio caller
  // performs a hard navigation after cleanup so a timed-out SDK call cannot
  // leave an authenticated in-memory client attached to the visible login UI.
  teacherClient = undefined;
  if (result?.error && /session.*missing|auth session/i.test(String(result.error.message || ""))) {
    return { error: null };
  }
  return result;
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
    requiredPlan: row.required_plan || "free",
    lockedDisplay: row.locked_display || "blur",
  };
};

const QUERY_PAGE_SIZE = 1000;

const fetchAllQueryRows = async (createQuery) => {
  const rows = [];
  for (let offset = 0; ; offset += QUERY_PAGE_SIZE) {
    const result = await createQuery().range(
      offset,
      offset + QUERY_PAGE_SIZE - 1,
    );
    if (result.error) return { data: null, error: result.error };
    const page = Array.isArray(result.data) ? result.data : [];
    rows.push(...page);
    if (page.length < QUERY_PAGE_SIZE) return { data: rows, error: null };
  }
};

export async function fetchDatabaseLessons({ audience = "general" } = {}) {
  const client = getStudentClient();
  if (!client) return { lessons: null, reason: "client-unavailable" };
  const authenticated = Boolean((await getStudentSession())?.user);
  let publicRows = [];
  let publicQuestions = [];
  if (audience !== "takiwaki") {
    const { data, error } = await client
      .from("review_public_lessons")
      .select("id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,content_version,content,is_preview,question_count,source_segment")
      .eq("status", "published")
      .order("lesson_date", { ascending: true })
      .order("slug", { ascending: true });
    if (error) return { lessons: null, reason: "lesson-query-failed", error };
    publicRows = data || [];
    if (publicRows.length) {
      const result = await fetchAllQueryRows(() => client
        .from("review_public_questions")
        .select("id,lesson_id,stable_key,position,section,format,payload,is_original,points,required_plan,locked_display")
        .in("lesson_id", publicRows.map((lesson) => lesson.id))
        .order("lesson_id", { ascending: true })
        .order("position", { ascending: true })
        .order("id", { ascending: true }));
      if (result.error) return { lessons: null, reason: "question-query-failed", error: result.error };
      publicQuestions = result.data || [];
    }
  }

  let privateRows = [];
  let privateQuestions = [];
  if (authenticated) {
    let query = client
      .from("review_lessons")
      .select("id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,source_type,source_notion_page_id,source_notion_url,source_segment,content_version,content,is_preview")
      .eq("status", "published")
      .order("lesson_date", { ascending: true })
      .order("slug", { ascending: true });
    if (audience === "takiwaki") query = query.in("audience", ["takiwaki", "both"]);
    if (audience === "general") query = query.in("audience", ["general", "both"]);
    const result = await query;
    if (!result.error) privateRows = result.data || [];
    if (privateRows.length) {
      const questionResult = await fetchAllQueryRows(() => client
        .from("review_questions")
        .select("id,lesson_id,stable_key,position,section,format,payload,is_original,points,required_plan,locked_display")
        .in("lesson_id", privateRows.map((lesson) => lesson.id))
        .eq("active", true)
        .order("lesson_id", { ascending: true })
        .order("position", { ascending: true })
        .order("id", { ascending: true }));
      if (questionResult.error) return { lessons: null, reason: "question-query-failed", error: questionResult.error };
      privateQuestions = questionResult.data || [];
    }
  }

  const privateById = new Map(privateRows.map((lesson) => [lesson.id, lesson]));
  const lessonRows = audience === "takiwaki"
    ? privateRows
    : [...publicRows, ...privateRows.filter((lesson) => !publicRows.some((item) => item.id === lesson.id))];
  if (!lessonRows.length) return { lessons: [], reason: null };
  const questionsByLesson = new Map();
  [...publicQuestions, ...privateQuestions].forEach((question) => {
    if (privateQuestions.some((item) => item.lesson_id === question.lesson_id) && !privateQuestions.includes(question)) return;
    const current = questionsByLesson.get(question.lesson_id) || [];
    current.push(databaseQuestion(question));
    questionsByLesson.set(question.lesson_id, current);
  });

  const lessons = lessonRows.map((lesson) => {
    const accessible = privateById.get(lesson.id) || null;
    const source = accessible || lesson;
    const content = source.content && typeof source.content === "object" && !Array.isArray(source.content)
      ? source.content
      : {};
    const sourceSegment = sourceSegmentFromLesson(source);
    return {
      id: source.slug,
      databaseLessonId: source.id,
      lessonDate: source.lesson_date,
      title: source.title_en,
      titleJa: source.title_ja || "",
      summary: source.summary_en || "",
      summaryJa: source.summary_ja || "",
      status: source.status,
      audience: source.audience,
      sourceType: source.source_type || "database",
      sourceNotionPageId: source.source_notion_page_id || "",
      sourceNotionUrl: source.source_notion_url || "",
      sourceSegment,
      partIndex: sourceSegmentPartIndex(sourceSegment),
      contentVersion: source.content_version,
      themes: Array.isArray(content.themes) ? content.themes : [],
      phrases: Array.isArray(content.phrases) ? content.phrases : [],
      notes: content.notes && typeof content.notes === "object" ? content.notes : {},
      questions: questionsByLesson.get(source.id) || [],
      isPreview: source.is_preview === true,
      locked: !accessible && source.is_preview !== true,
      questionCount: Number(lesson.question_count || questionsByLesson.get(source.id)?.length || 0),
    };
  }).sort((left, right) => (
    left.lessonDate.localeCompare(right.lessonDate)
    || compareLessonSourceOrder(left, right)
  ));
  return {
    lessons,
    reason: null,
  };
}

export async function fetchDatabaseLesson(lessonSlug, { preview = false } = {}) {
  const slug = String(lessonSlug || "").trim();
  if (!slug) return { lesson: null, reason: "missing-lesson" };

  const client = preview ? getTeacherClient() : getStudentClient();
  if (!client) return { lesson: null, reason: "client-unavailable" };
  let authenticated = false;
  let profileIncomplete = false;
  if (preview) {
    const session = await getTeacherSession();
    if (!session?.user) return { lesson: null, reason: "teacher-sign-in-required" };
    authenticated = true;

    const previewPlan = teacherPreviewPlanFromLocation() || "premium_plus";
    const { data: previewData, error: previewError } = await client.rpc(
      "review_teacher_preview_lesson",
      { lesson_slug: slug, preview_plan: previewPlan },
    );
    if (previewError) {
      return { lesson: null, reason: "teacher-preview-query-failed", error: previewError };
    }
    const previewLesson = previewData?.lesson;
    if (!previewLesson?.id) return { lesson: null, reason: "lesson-not-readable" };
    const content = previewLesson.content
      && typeof previewLesson.content === "object"
      && !Array.isArray(previewLesson.content)
      ? previewLesson.content
      : {};
    const sourceSegment = sourceSegmentFromLesson(previewLesson);
    teacherPreviewTasksByLesson.set(
      String(previewLesson.id),
      Array.isArray(previewData?.premium_tasks) ? previewData.premium_tasks : [],
    );
    installTeacherPlanPreviewBanner(previewPlan, previewData?.publication_status);
    return {
      lesson: {
        id: previewLesson.slug,
        databaseLessonId: previewLesson.id,
        lessonDate: previewLesson.lesson_date,
        title: previewLesson.title_en,
        titleJa: previewLesson.title_ja || "",
        summary: previewLesson.summary_en || "",
        summaryJa: previewLesson.summary_ja || "",
        status: previewLesson.status,
        audience: previewLesson.audience,
        sourceType: previewLesson.source_type || "database",
        sourceNotionPageId: previewLesson.source_notion_page_id || "",
        sourceNotionUrl: previewLesson.source_notion_url || "",
        sourceSegment,
        partIndex: sourceSegmentPartIndex(sourceSegment),
        contentVersion: previewLesson.content_version,
        themes: Array.isArray(content.themes) ? content.themes : [],
        phrases: Array.isArray(content.phrases) ? content.phrases : [],
        categoryLabels: content.categoryLabels && typeof content.categoryLabels === "object"
          ? content.categoryLabels
          : {},
        questions: Array.isArray(previewData?.questions)
          ? previewData.questions.map(databaseQuestion)
          : [],
        lockedQuestions: Array.isArray(previewData?.locked_questions)
          ? previewData.locked_questions.map((question) => ({
            id: String(question.id || ""),
            position: Number(question.position || 0),
            section: String(question.section || ""),
            format: String(question.format || "mcq"),
            requiredPlan: String(question.required_plan || "standard"),
          }))
          : [],
        isPreview: previewLesson.is_preview === true,
        locked: previewData?.lesson_accessible === false,
        teacherPreview: true,
        previewPlan,
      },
      reason: null,
    };
  } else {
    authenticated = Boolean((await getStudentSession())?.user);
    if (authenticated) {
      const { data: complete, error: profileGateError } = await client.rpc(
        "review_profile_is_complete",
      );
      profileIncomplete = !profileGateError && complete === false;
    }
  }

  let hasAccess = false;
  let lesson = null;
  if (preview || authenticated) {
    const { data, error } = await client
      .from("review_lessons")
      .select("id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,source_type,source_notion_page_id,source_notion_url,source_segment,content_version,content,is_preview")
      .eq("slug", slug)
      .maybeSingle();
    if (error && preview) return { lesson: null, reason: "lesson-query-failed", error };
    if (!error && data) {
      lesson = data;
      hasAccess = true;
    }
  }
  if (!lesson && !preview) {
    const { data, error } = await client
      .from("review_public_lessons")
      .select("id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,content_version,content,is_preview,source_segment")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return { lesson: null, reason: "lesson-query-failed", error };
    if (authenticated && data) {
      const accessMode = await client.rpc("review_lesson_access_mode", {
        check_lesson: data.id,
      });
      if (accessMode.error) {
        return { lesson: null, reason: "lesson-access-check-failed", error: accessMode.error };
      }
      if (accessMode.data === "block") {
        return { lesson: null, reason: "lesson-access-denied" };
      }

      const featureAccess = await client.rpc("review_student_hub_feature_enabled", {
        requested_feature: "review_lessons",
      });
      const featureCode = String(featureAccess.error?.code || "").toUpperCase();
      const featureMessage = String(featureAccess.error?.message || "").toLowerCase();
      const featureMigrationPending = ["42883", "PGRST202", "PGRST204"].includes(featureCode)
        || featureMessage.includes("schema cache")
        || featureMessage.includes("could not find the function")
        || featureMessage.includes("does not exist");
      if (featureAccess.error && !featureMigrationPending) {
        return { lesson: null, reason: "lesson-access-check-failed", error: featureAccess.error };
      }
      if (!featureAccess.error && featureAccess.data !== true) {
        return { lesson: null, reason: "lesson-access-denied" };
      }
    }
    lesson = data;
  }
  if (!lesson) return { lesson: null, reason: "lesson-not-readable" };

  const questionTable = hasAccess ? "review_questions" : "review_public_questions";
  let questionQuery = client
    .from(questionTable)
    .select("id,stable_key,position,section,format,payload,is_original,points,required_plan,locked_display")
    .eq("lesson_id", lesson.id);
  if (questionTable === "review_questions") questionQuery = questionQuery.eq("active", true);
  questionQuery = questionQuery.order("position", { ascending: true });
  const { data: questions, error: questionError } = await questionQuery;
  if (questionError) {
    return { lesson: null, reason: "question-query-failed", error: questionError };
  }

  const { data: lockedQuestions, error: teaserError } = await client
    .from("review_question_teasers")
    .select("id,position,section,format,required_plan")
    .eq("lesson_id", lesson.id)
    .order("position", { ascending: true });
  if (teaserError) {
    return { lesson: null, reason: "question-teaser-query-failed", error: teaserError };
  }

  const content = lesson.content && typeof lesson.content === "object" && !Array.isArray(lesson.content)
    ? lesson.content
    : {};
  const sourceSegment = sourceSegmentFromLesson(lesson);
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
      sourceNotionPageId: lesson.source_notion_page_id || "",
      sourceNotionUrl: lesson.source_notion_url || "",
      sourceSegment,
      partIndex: sourceSegmentPartIndex(sourceSegment),
      contentVersion: lesson.content_version,
      themes: Array.isArray(content.themes) ? content.themes : [],
      phrases: Array.isArray(content.phrases) ? content.phrases : [],
      categoryLabels: content.categoryLabels && typeof content.categoryLabels === "object"
        ? content.categoryLabels
        : {},
      questions: Array.isArray(questions) ? questions.map(databaseQuestion) : [],
      lockedQuestions: Array.isArray(lockedQuestions) ? lockedQuestions.map((question) => ({
        id: String(question.id || ""),
        position: Number(question.position || 0),
        section: String(question.section || ""),
        format: String(question.format || "mcq"),
        requiredPlan: String(question.required_plan || "standard"),
      })) : [],
      isPreview: lesson.is_preview === true,
      locked: !hasAccess && lesson.is_preview !== true,
      lockReason: hasAccess
        ? null
        : (profileIncomplete ? "profile-required" : "membership-required"),
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
