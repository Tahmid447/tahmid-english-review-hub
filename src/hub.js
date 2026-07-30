import {
  getAllLessonProgress,
  getLessonProgress,
  getSettings,
  onSettingsChange,
  setStorageUser,
  updateSettings,
} from "./store.js";
import { loadPublishedLessons } from "./data.js";
import {
  getStudentClient,
  getStudentSession,
  loadUserSettings,
  onStudentAuthChange,
  saveUserSettings,
  signInStudent,
  signOutStudent,
} from "./supabase.js";
import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js";
import { installPlayfulInteractions } from "./effects.js";

const page = document.body.dataset.page || "general";

let publishedLessons = [];
let visibleLessons = [];
let activeFilter = "all";
let authSession = null;
let remoteAttempts = [];
let remoteAssignments = [];
let remotePersonalLessons = [];
let personalLoadMessage = "";
let activeStorageUserId = null;
let settingsScopeGeneration = 0;
let pendingSettingsLoad = null;
let pendingSettingsUserId;

function element(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (String(options.className || "").split(/\s+/).includes("jp")) {
    node.setAttribute("lang", "ja");
  }
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      if (value !== undefined && value !== null) node.setAttribute(name, String(value));
    });
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child) node.append(child);
  }
  return node;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function normaliseSession(value) {
  if (!value) return null;
  if (value.session) return value.session;
  if (value.data?.session) return value.data.session;
  if (value.user) return value;
  return null;
}

async function activateStorageScope(session) {
  const userId = session?.user?.id ? String(session.user.id) : null;
  if (pendingSettingsLoad && pendingSettingsUserId === userId) {
    return pendingSettingsLoad;
  }
  const generation = ++settingsScopeGeneration;
  const scopeChanged = userId !== activeStorageUserId;
  activeStorageUserId = userId;
  setStorageUser(userId);

  if (scopeChanged) {
    remoteAttempts = [];
    remoteAssignments = [];
    remotePersonalLessons = [];
    personalLoadMessage = "";
    if (page === "takiwaki") {
      visibleLessons = [];
      ["#privateHero", "#privateDashboard", "#assigned", "#history"].forEach((selector) => {
        const section = document.querySelector(selector);
        if (section) section.hidden = true;
      });
    }
  }
  if (page === "general" && publishedLessons.length) renderLessonGrid();

  const load = (async () => {
    if (!userId) return true;
    const remote = await loadUserSettings(userId);
    if (
      generation !== settingsScopeGeneration
      || String(authSession?.user?.id || "") !== userId
    ) {
      return false;
    }
    if (remote.loaded && remote.settings) {
      updateSettings(remote.settings);
    } else if (remote.reason === "not-found") {
      await saveUserSettings(getSettings(), { expectedUserId: userId });
    }
    return (
      generation === settingsScopeGeneration
      && String(authSession?.user?.id || "") === userId
    );
  })();
  pendingSettingsLoad = load;
  pendingSettingsUserId = userId;
  try {
    return await load;
  } finally {
    if (pendingSettingsLoad === load) {
      pendingSettingsLoad = null;
      pendingSettingsUserId = undefined;
    }
  }
}

function updateAndSyncSettings(patch) {
  const settings = updateSettings(patch);
  const expectedUserId = authSession?.user?.id ? String(authSession.user.id) : null;
  if (expectedUserId) {
    saveUserSettings(settings, { expectedUserId }).catch(() => {});
  }
  return settings;
}

function settingsLanguage(settings) {
  return languageModeFromSettings(settings);
}
function currentLanguage() {
  return settingsLanguage(getSettings());
}
function t(english, japanese) {
  return uiText(english, japanese, currentLanguage());
}

function settingsSound(settings) {
  if (typeof settings.sound === "boolean") return settings.sound;
  if (typeof settings.soundEnabled === "boolean") return settings.soundEnabled;
  return true;
}

function applySettings(settings = getSettings()) {
  const language = settingsLanguage(settings);
  const sound = settingsSound(settings);
  applyLanguageMode(language);

  const languageToggle = document.querySelector("#languageToggle");
  const soundToggle = document.querySelector("#soundToggle");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");
  if (languageToggle) languageToggle.value = language;
  if (soundToggle) {
    soundToggle.textContent = sound
      ? uiText("Sound On", "音声オン", language)
      : uiText("Sound Off", "音声オフ", language);
    soundToggle.setAttribute("aria-pressed", String(sound));
  }
  if (voiceSelect) voiceSelect.value = settings.voice || "us";
  if (playbackRate) playbackRate.value = String(settings.playbackRate || 1);
}

function bindSettings() {
  const languageToggle = document.querySelector("#languageToggle");
  const soundToggle = document.querySelector("#soundToggle");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");

  languageToggle?.addEventListener("change", () => {
    const next = ["en", "bilingual", "ja"].includes(languageToggle.value)
      ? languageToggle.value
      : "bilingual";
    updateAndSyncSettings({
      showJapanese: next !== "en",
      languageMode: next,
    });
  });
  soundToggle?.addEventListener("click", () => {
    const next = !settingsSound(getSettings());
    updateAndSyncSettings({ sound: next });
  });
  voiceSelect?.addEventListener("change", () => {
    updateAndSyncSettings({ voice: voiceSelect.value === "gb" ? "gb" : "us" });
  });
  playbackRate?.addEventListener("change", () => {
    updateAndSyncSettings({ playbackRate: Number(playbackRate.value) });
  });
  onSettingsChange((settings) => {
    applySettings(settings);
    if (visibleLessons.length) renderLessonGrid();
    if (page === "takiwaki" && authSession) {
      updatePersonalMetrics();
      renderHistory();
    }
  });
  applySettings();
}

installPlayfulInteractions();

function formatDate(value, includeYear = true) {
  if (!value) return t("Date not recorded", "日付未登録");
  const parsed = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat(currentLanguage() === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(parsed);
}

function progressSummary(lesson) {
  const progress = getLessonProgress(lesson.id) || {};
  const answers = progress.answers && typeof progress.answers === "object"
    ? Object.keys(progress.answers).length
    : 0;
  const answered = Number(
    progress.answeredCount ?? progress.completedCount ?? progress.currentQuestion ?? answers,
  );
  const total = Math.max(1, Number(progress.totalQuestions || lesson.questions?.length || 0));
  const completed = Boolean(progress.completed || progress.completedAt);
  const percent = completed ? 100 : Math.max(0, Math.min(100, Math.round((answered / total) * 100)));
  const wrongIds = progress.wrongQuestionIds || progress.incorrectQuestionIds || progress.wrongIds || [];
  return {
    ...progress,
    answered,
    total,
    completed,
    percent,
    needsReview: Array.isArray(wrongIds) && wrongIds.length > 0,
    updatedAt: progress.updatedAt || progress.lastStudy || progress.completedAt || null,
  };
}

function lessonGroups(lesson) {
  const questions = Array.isArray(lesson.questions) ? lesson.questions : [];
  const formats = new Set(
    questions.map((question) => String(question.format || question.type || "").toLowerCase()),
  );
  const text = [
    lesson.title,
    lesson.titleJa,
    lesson.summary,
    lesson.summaryJa,
    ...(lesson.themes || []),
    ...questions.flatMap((question) => [
      question.topic,
      question.section,
      question.prompt?.en,
      question.prompt?.jp,
    ]),
  ].join(" ").toLowerCase();
  const groups = new Set();
  if (
    formats.has("speaking")
    || formats.has("dialogue")
    || formats.has("situation")
  ) {
    groups.add("conversation");
  }
  if (formats.has("listenchoice") || formats.has("listentype")) {
    groups.add("listening");
  }
  if (
    /grammar|tense|perfect|verb|modal|preposition|comparison|either|neither|both|would rather|文法|時制/.test(text)
  ) {
    groups.add("grammar");
  }
  return groups.size ? [...groups] : ["conversation"];
}

function lessonHref(lesson) {
  const query = new URLSearchParams({ id: lesson.id });
  if (lesson.assigned) query.set("assigned", "1");
  return `/lesson.html?${query.toString()}`;
}

function createLessonCard(lesson, options = {}) {
  const progress = progressSummary(lesson);
  const count = Number(lesson.questions?.length || lesson.questionCount || 0);
  const groups = lessonGroups(lesson);
  const statusText = options.assigned
    ? t("Assigned", "割り当て済み")
    : progress.completed
      ? t("Completed", "完了")
      : progress.percent
        ? t(`${progress.percent}% complete`, `${progress.percent}% 完了`)
        : t("Ready", "開始できます");

  const top = element("div", { className: "lesson-card-top" }, [
    element("span", { className: "lesson-date", text: formatDate(lesson.lessonDate, false) }),
    element("span", { className: "lesson-status", text: statusText }),
  ]);
  const title = element("h3", { text: lesson.title || "English Review" });
  const titleJa = element("p", { className: "jp", text: lesson.titleJa || lesson.takiTitle || "" });
  const summary = element("p", {
    className: "en",
    text: lesson.summary || "Understand the language, hear it clearly, and use it in conversation.",
  });
  const summaryJa = lesson.summaryJa
    ? element("p", { className: "jp", text: lesson.summaryJa })
    : null;
  const meta = element("div", { className: "lesson-meta" }, [
    element("span", { text: t(`${count} activities`, `${count}問`) }),
    ...groups.map((group) => element("span", {
      text: ({
        conversation: t("Conversation", "会話"),
        grammar: t("Grammar", "文法"),
        listening: t("Listening", "リスニング"),
      })[group] || group,
    })),
  ]);
  const progressBar = element("div", {
    className: "lesson-progress",
    attrs: {
      role: "progressbar",
      "aria-label": `${lesson.title || "Lesson"} progress`,
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": String(progress.percent),
    },
  }, element("span"));
  progressBar.firstElementChild.style.width = `${progress.percent}%`;
  const action = element("a", {
    className: "lesson-action",
    attrs: { href: lessonHref({ ...lesson, assigned: options.assigned }) },
  }, [
    element("span", {
      text: progress.percent && !progress.completed
        ? t("Continue lesson", "続きから")
        : t("Start practice", "練習を始める"),
    }),
    element("span", { text: "→", attrs: { "aria-hidden": "true" } }),
  ]);

  return element("article", {
    className: "lesson-card",
    attrs: { "data-groups": groups.join(" "), "data-lesson-id": lesson.id },
  }, [top, title, titleJa, summary, summaryJa, meta, progressBar, action]);
}

function renderLessonGrid() {
  const grid = document.querySelector("#lessonGrid");
  if (!grid) return;
  const filtered = activeFilter === "all"
    ? visibleLessons
    : visibleLessons.filter((lesson) => {
      if (activeFilter === "continue") {
        const progress = progressSummary(lesson);
        return progress.percent > 0 && !progress.completed;
      }
      if (activeFilter === "weak") return progressSummary(lesson).needsReview;
      return lessonGroups(lesson).includes(activeFilter);
    });

  grid.replaceChildren();
  if (!filtered.length) {
    const message = page === "takiwaki" && activeFilter !== "all"
      ? t("Nothing is waiting in this group. Keep up the steady work.", "このグループに待っている復習はありません。この調子です。")
      : t("No lessons match this filter yet.", "この条件に合うレッスンはまだありません。");
    grid.append(element("article", { className: "lesson-card" }, [
      element("h3", { text: message }),
      element("p", { className: "jp", text: "この条件に合うレッスンはまだありません。" }),
    ]));
    return;
  }
  filtered.forEach((lesson) => grid.append(createLessonCard(lesson, {
    assigned: Boolean(lesson.assigned),
  })));
}

function bindFilters() {
  document.querySelectorAll(".filter-chip[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      document.querySelectorAll(".filter-chip[data-filter]").forEach((candidate) => {
        candidate.classList.toggle("active", candidate === button);
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      renderLessonGrid();
    });
  });
}

function setLoginStatus(message, isError = false) {
  const status = document.querySelector("#studentLoginStatus");
  if (!status) return;
  status.textContent = message;
  status.style.color = isError ? "" : "var(--green)";
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector("#studentLogin")?.value.trim() || "";
  const password = form.querySelector("#studentPassword")?.value || "";
  const submit = form.querySelector('button[type="submit"]');
  if (!email || !password) return;
  if (submit) submit.disabled = true;
  setLoginStatus(t("Signing in…", "ログイン中…"));
  try {
    const result = await signInStudent(email, password);
    if (result?.error) throw result.error;
    authSession = normaliseSession(result) || normaliseSession(await getStudentSession());
    if (!authSession) throw new Error("The account could not be opened.");
    const scopeReady = await activateStorageScope(authSession);
    if (!scopeReady) return;
    form.reset();
    setLoginStatus(t("Signed in successfully.", "ログインしました。"));
    showToast(
      page === "takiwaki"
        ? t("Signed in securely.", "安全にログインしました。")
        : t("Welcome back. Your saved learning is ready.", "おかえりなさい。保存済みの学習を再開できます。"),
    );
    await refreshAuthView();
  } catch (error) {
    setLoginStatus(error?.message || t("Sign-in failed.", "ログインできませんでした。"), true);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function handleLogout() {
  const result = await signOutStudent();
  if (result?.error) {
    showToast(result.error.message || t("Sign-out failed.", "ログアウトできませんでした。"));
    return;
  }
  authSession = null;
  const scopeReady = await activateStorageScope(null);
  if (!scopeReady) return;
  remoteAttempts = [];
  remoteAssignments = [];
  remotePersonalLessons = [];
  personalLoadMessage = "";
  setLoginStatus(t("Signed out.", "ログアウトしました。"));
  showToast(t("Signed out safely.", "安全にログアウトしました。"));
  await refreshAuthView();
}

function bindAuth() {
  document.querySelector("#studentLoginForm")?.addEventListener("submit", handleLogin);
  document.querySelector("#logoutButton")?.addEventListener("click", handleLogout);

  const dialog = document.querySelector("#accountDialog");
  const accountButton = document.querySelector("#accountButton");
  const signInGateButton = document.querySelector("#openLoginButton");
  const openDialog = () => {
    if (dialog?.showModal) dialog.showModal();
  };
  accountButton?.addEventListener("click", openDialog);
  signInGateButton?.addEventListener("click", openDialog);

  onStudentAuthChange(async (...args) => {
    authSession = normaliseSession(args[1]) || normaliseSession(args[0]);
    const scopeReady = await activateStorageScope(authSession);
    if (!scopeReady) return;
    await refreshAuthView();
  });
}

function ensureGeneralLogoutButton() {
  const form = document.querySelector("#studentLoginForm");
  if (!form) return;
  let logout = form.querySelector("[data-general-logout]");
  if (authSession) {
    form.querySelectorAll("label, button[type='submit']").forEach((node) => {
      node.hidden = true;
    });
    if (!logout) {
      logout = element("button", {
        className: "secondary-btn",
        text: t("Sign out", "ログアウト"),
        attrs: { type: "button", "data-general-logout": "true" },
      });
      logout.addEventListener("click", handleLogout);
      form.append(logout);
    }
    logout.hidden = false;
    setLoginStatus(t(
      `Signed in as ${authSession.user?.email || "student"}.`,
      `${authSession.user?.email || "学習者"}でログイン中です。`,
    ));
  } else {
    form.querySelectorAll("label, button[type='submit']").forEach((node) => {
      node.hidden = false;
    });
    if (logout) logout.hidden = true;
  }
}

async function fetchPersonalRecords() {
  remoteAttempts = [];
  remoteAssignments = [];
  remotePersonalLessons = [];
  personalLoadMessage = "";
  const client = getStudentClient();
  if (!client || !authSession) return;

  try {
    const [attemptResult, assignmentResult, lessonResult] = await Promise.all([
      client
        .from("review_attempts")
        .select("*, lesson:review_lessons(slug,title_en,title_ja,lesson_date)")
        .order("started_at", { ascending: false })
        .limit(200),
      client
        .from("review_assignments")
        .select("*, lesson:review_lessons(*)")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("review_lessons")
        .select("slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,content")
        .eq("status", "published")
        .order("lesson_date", { ascending: false })
        .limit(100),
    ]);

    if (attemptResult.error) throw attemptResult.error;
    remoteAttempts = Array.isArray(attemptResult.data) ? attemptResult.data : [];

    if (!assignmentResult.error) {
      remoteAssignments = Array.isArray(assignmentResult.data) ? assignmentResult.data : [];
    } else {
      const fallback = await client
        .from("review_assignments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (fallback.error) throw fallback.error;
      remoteAssignments = Array.isArray(fallback.data) ? fallback.data : [];
    }
    if (lessonResult.error) throw lessonResult.error;
    remotePersonalLessons = Array.isArray(lessonResult.data) ? lessonResult.data : [];
  } catch {
    personalLoadMessage = t(
      "Online history is temporarily unavailable. Your progress on this device is still shown.",
      "オンライン履歴を一時的に取得できません。この端末の学習状況は表示されています。",
    );
  }
}

function lessonFromDatabase(record) {
  if (!record?.slug) return null;
  const content = record.content && typeof record.content === "object" ? record.content : {};
  return {
    id: record.slug,
    lessonDate: record.lesson_date,
    title: record.title_en || "English Review",
    titleJa: record.title_ja || "",
    summary: record.summary_en || "A reviewed lesson ready for practice.",
    summaryJa: record.summary_ja || "",
    status: record.status,
    audience: record.audience,
    questionCount: Number(content.question_count || content.draft_questions || 0),
    questions: [],
    themes: Array.isArray(content.themes) ? content.themes : [],
  };
}

function lessonFromAssignment(assignment) {
  const embedded = assignment.lesson || assignment.review_lessons || null;
  const lessonId = embedded?.slug
    || assignment.lesson_slug
    || assignment.lessonSlug
    || assignment.lesson_id
    || embedded?.id;
  if (!lessonId) return null;
  const local = publishedLessons.find((lesson) => lesson.id === lessonId);
  if (local) return { ...local, assigned: true, assignment };
  if (!embedded) return null;
  return {
    id: lessonId,
    lessonDate: embedded.lesson_date || embedded.lessonDate || assignment.created_at,
    title: embedded.title_en || embedded.title || "Assigned English Review",
    titleJa: embedded.title_ja || embedded.titleJa || "",
    summary: embedded.summary_en || embedded.summary || "A lesson selected for your next review.",
    summaryJa: embedded.summary_ja || embedded.summaryJa || "",
    status: embedded.status,
    audience: embedded.audience,
    questionCount: embedded.question_count || 0,
    questions: [],
    themes: embedded.themes || [],
    assigned: true,
    assignment,
  };
}

function attemptTimestamp(attempt) {
  return attempt.completed_at || attempt.completedAt || attempt.started_at || attempt.startedAt || null;
}

function lessonFromAttempt(attempt) {
  const embedded = attempt?.lesson || attempt?.review_lessons || null;
  const slug = embedded?.slug || attempt?.lessonSlug || attempt?.lesson_slug;
  if (slug) {
    return visibleLessons.find((item) => item.id === slug) || {
      id: slug,
      lessonDate: embedded?.lesson_date,
      title: embedded?.title_en || "English Review",
      titleJa: embedded?.title_ja || "",
      summary: "Review this lesson again to make the language easier to use.",
      questions: [],
    };
  }
  const assignment = remoteAssignments.find((item) => (
    item.lesson_id === (attempt?.lesson_id || attempt?.lessonId)
  ));
  const assignedLesson = lessonFromAssignment(assignment || {});
  return assignedLesson
    ? visibleLessons.find((item) => item.id === assignedLesson.id) || assignedLesson
    : null;
}

function attemptScore(attempt) {
  const correct = Number(
    attempt.first_score
      ?? attempt.first_try_correct
      ?? attempt.firstTryCorrect
      ?? attempt.correct_count
      ?? 0,
  );
  const total = Number(
    attempt.max_score
      ?? attempt.first_try_total
      ?? attempt.firstTryTotal
      ?? attempt.question_count
      ?? 0,
  );
  return { correct, total };
}

function allLocalProgress() {
  const stored = getAllLessonProgress();
  if (Array.isArray(stored)) return stored;
  if (stored && typeof stored === "object") {
    return Object.entries(stored).map(([lessonId, progress]) => ({ lessonId, ...progress }));
  }
  return [];
}

function updatePersonalMetrics() {
  const local = allLocalProgress();
  const dates = [
    ...local.map((item) => item.updatedAt || item.lastStudy || item.completedAt),
    ...remoteAttempts.map(attemptTimestamp),
  ].filter(Boolean).sort((a, b) => new Date(b) - new Date(a));
  const scored = remoteAttempts
    .map(attemptScore)
    .filter(({ total }) => total > 0);
  const localScored = local
    .map((item) => ({
      correct: Number(item.firstScore ?? item.firstTryCorrect ?? 0),
      total: Number(item.maxScore ?? item.firstTryTotal ?? 0),
    }))
    .filter(({ total }) => total > 0);
  const combined = [...scored, ...localScored];
  const correct = combined.reduce((sum, item) => sum + item.correct, 0);
  const total = combined.reduce((sum, item) => sum + item.total, 0);
  const weakLessons = visibleLessons.filter((lesson) => progressSummary(lesson).needsReview).length;

  const lastStudy = document.querySelector("#lastStudy");
  const averageScore = document.querySelector("#averageScore");
  const sessionCount = document.querySelector("#sessionCount");
  const weakCount = document.querySelector("#weakCount");
  if (lastStudy) lastStudy.textContent = dates[0] ? formatDate(dates[0]) : t("Not yet", "まだありません");
  if (averageScore) averageScore.textContent = total ? `${Math.round((correct / total) * 100)}%` : t("Not yet", "まだありません");
  if (sessionCount) sessionCount.textContent = String(remoteAttempts.length + local.length);
  if (weakCount) weakCount.textContent = String(weakLessons);

  updateContinueCard(local, dates[0]);
}

function updateContinueCard(local, latestDate) {
  const cardTitle = document.querySelector("#continueTitle");
  const cardMeta = document.querySelector("#continueMeta");
  const cardLink = document.querySelector("#continueLink");
  if (!cardTitle || !cardMeta || !cardLink) return;
  const latestProgress = [...local]
    .filter((item) => item.updatedAt || item.lastStudy || item.completedAt)
    .sort((a, b) => new Date(
      b.updatedAt || b.lastStudy || b.completedAt,
    ) - new Date(a.updatedAt || a.lastStudy || a.completedAt))[0];
  const remoteLatest = [...remoteAttempts].sort(
    (a, b) => new Date(attemptTimestamp(b) || 0) - new Date(attemptTimestamp(a) || 0),
  )[0];
  const lessonId = latestProgress?.lessonId
    || latestProgress?.id
    || lessonFromAttempt(remoteLatest)?.id
    || remoteLatest?.lessonId;
  const lesson = visibleLessons.find((item) => item.id === lessonId) || visibleLessons[0];
  if (!lesson) {
    cardTitle.textContent = t("No lesson assigned yet", "割り当てレッスンはまだありません");
    cardMeta.textContent = t("A new lesson will appear here when it is ready.", "新しいレッスンの準備ができると、ここに表示されます。");
    cardLink.href = "#assigned";
    cardLink.textContent = t("Check lessons", "レッスンを見る");
    return;
  }
  cardTitle.textContent = lesson.title;
  cardMeta.textContent = latestDate
    ? t(`Last studied ${formatDate(latestDate)}. Continue from your saved place.`, `最終学習：${formatDate(latestDate)}。保存した位置から続けられます。`)
    : t("Start when you are ready. Your place will be saved.", "準備ができたら始めましょう。続きの位置は保存されます。");
  cardLink.href = lessonHref(lesson);
  cardLink.textContent = latestDate ? t("Continue lesson", "続きから") : t("Start lesson", "レッスンを始める");
}

function renderHistory() {
  const list = document.querySelector("#historyList");
  const status = document.querySelector("#personalDataStatus");
  if (status) status.textContent = personalLoadMessage;
  if (!list) return;
  list.replaceChildren();
  if (!remoteAttempts.length) {
    list.append(element("article", { className: "lesson-card" }, [
      element("span", { className: "lesson-date", text: t("Your first result", "最初の結果") }),
      element("h3", { text: t("No online practice history yet", "オンライン練習履歴はまだありません") }),
      element("p", {
        text: t("Finish a lesson while signed in and the result will appear here.", "ログイン中にレッスンを完了すると、結果がここに表示されます。"),
      }),
      element("p", {
        className: "jp",
        text: "ログイン中にレッスンを完了すると、ここに履歴が表示されます。",
      }),
    ]));
    return;
  }
  remoteAttempts.slice(0, 6).forEach((attempt) => {
    const lesson = lessonFromAttempt(attempt);
    const { correct, total } = attemptScore(attempt);
    list.append(element("article", { className: "lesson-card" }, [
      element("div", { className: "lesson-card-top" }, [
        element("span", {
          className: "lesson-date",
          text: formatDate(attemptTimestamp(attempt)),
        }),
        element("span", {
          className: "lesson-status",
          text: total ? t(`${correct} / ${total} first try`, `初回答 ${correct} / ${total}`) : t("Completed", "完了"),
        }),
      ]),
      element("h3", { text: lesson?.title || "English Review" }),
      element("p", {
        text: t("This record keeps your official first answer separate from later practice.", "初回答は、その後の練習とは別に記録されます。"),
      }),
      element("a", {
        className: "lesson-action",
        attrs: { href: lesson ? lessonHref(lesson) : "#assigned" },
      }, [
        element("span", { text: t("Review again", "もう一度復習") }),
        element("span", { text: "→", attrs: { "aria-hidden": "true" } }),
      ]),
    ]));
  });
}

async function renderPrivateView() {
  const gate = document.querySelector("#signInGate");
  const accessDenied = document.querySelector("#privateAccessDenied");
  const hero = document.querySelector("#privateHero");
  const dashboard = document.querySelector("#privateDashboard");
  const lessonsSection = document.querySelector("#assigned");
  const historySection = document.querySelector("#history");
  const learnerName = document.querySelector("#privateLearnerName");
  const accountButton = document.querySelector("#accountButton");
  const logoutButton = document.querySelector("#logoutButton");
  const loginForm = document.querySelector("#studentLoginForm");

  const isSignedIn = Boolean(authSession?.user);
  if (gate) gate.hidden = isSignedIn;
  if (accessDenied) accessDenied.hidden = true;
  if (hero) hero.hidden = true;
  if (dashboard) dashboard.hidden = true;
  if (lessonsSection) lessonsSection.hidden = true;
  if (historySection) historySection.hidden = true;
  if (accountButton) accountButton.textContent = isSignedIn
    ? t("Account", "アカウント")
    : t("Sign in", "ログイン");
  if (logoutButton) logoutButton.hidden = !isSignedIn;
  if (loginForm) loginForm.hidden = isSignedIn;
  if (!isSignedIn) {
    visibleLessons = [];
    renderLessonGrid();
    return;
  }

  const userId = authSession.user.id;
  const client = getStudentClient();
  let hasPrivateAccess = false;
  let privateDisplayName = "";
  if (client) {
    const { data, error } = await client
      .from("review_profiles")
      .select("access_scope, display_name")
      .eq("user_id", userId)
      .maybeSingle();
    hasPrivateAccess = !error && data?.access_scope === "takiwaki";
    privateDisplayName = hasPrivateAccess ? String(data?.display_name || "").trim() : "";
  }
  if (authSession?.user?.id !== userId) return;
  if (!hasPrivateAccess) {
    remoteAttempts = [];
    remoteAssignments = [];
    remotePersonalLessons = [];
    visibleLessons = [];
    if (accessDenied) accessDenied.hidden = false;
    renderLessonGrid();
    return;
  }

  if (hero) hero.hidden = false;
  if (dashboard) dashboard.hidden = false;
  if (lessonsSection) lessonsSection.hidden = false;
  if (historySection) historySection.hidden = false;
  if (learnerName) {
    learnerName.textContent = `${privateDisplayName || "Learner"}.`;
  }
  await fetchPersonalRecords();
  const assigned = remoteAssignments.map(lessonFromAssignment).filter(Boolean);
  const merged = new Map(publishedLessons.map((lesson) => [lesson.id, lesson]));
  remotePersonalLessons
    .map(lessonFromDatabase)
    .filter(Boolean)
    .forEach((lesson) => {
      const bundled = merged.get(lesson.id);
      merged.set(lesson.id, {
        ...(bundled || {}),
        ...lesson,
        questions: bundled?.questions?.length ? bundled.questions : lesson.questions,
        questionCount: bundled?.questions?.length
          ? bundled.questions.length
          : lesson.questionCount,
      });
    });
  assigned.forEach((lesson) => merged.set(lesson.id, {
    ...(merged.get(lesson.id) || {}),
    ...lesson,
    assigned: true,
  }));
  visibleLessons = [...merged.values()].sort(
    (a, b) => new Date(b.lessonDate || 0) - new Date(a.lessonDate || 0),
  );
  renderLessonGrid();
  updatePersonalMetrics();
  renderHistory();
}

async function refreshAuthView() {
  if (page === "general") {
    ensureGeneralLogoutButton();
  } else if (page === "takiwaki") {
    await renderPrivateView();
  }
}

async function initialise() {
  authSession = normaliseSession(await getStudentSession());
  await activateStorageScope(authSession);
  bindSettings();
  bindFilters();
  bindAuth();

  publishedLessons = (await loadPublishedLessons({
    audience: page === "takiwaki" ? "takiwaki" : "general",
  }))
    .filter((lesson) => lesson.status === "published");
  visibleLessons = page === "general" ? publishedLessons : [];

  if (page === "general") {
    const publishedCount = document.querySelector("#publishedCount");
    const questionCount = document.querySelector("#questionCount");
    const totalQuestions = publishedLessons.reduce(
      (sum, lesson) => sum + Number(lesson.questions?.length || 0),
      0,
    );
    if (publishedCount) publishedCount.textContent = String(publishedLessons.length);
    if (questionCount) questionCount.textContent = String(totalQuestions);
    renderLessonGrid();
  }

  await refreshAuthView();
}

initialise().catch((error) => {
  console.error(error);
  const grid = document.querySelector("#lessonGrid");
  if (grid) {
    grid.replaceChildren(element("article", { className: "lesson-card" }, [
      element("h3", { text: "The lesson library could not be loaded." }),
      element("p", { text: "Please refresh the page and try again." }),
      element("p", { className: "jp", text: "ページを更新して、もう一度お試しください。" }),
    ]));
  }
  showToast("The lesson library is temporarily unavailable.");
});
