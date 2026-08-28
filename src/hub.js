import {
  applyThemePreference,
  getAllLessonProgress,
  getLessonProgress,
  getSettings,
  onSettingsChange,
  safeLocalReturnPath,
  setStorageUser,
  updateSettings,
  watchSystemTheme,
} from "./store.js?v=20260828-release3";
import { loadPublishedLessons } from "./data.js?v=20260828-release3";
import {
  getStudentClient,
  getStudentMembership,
  getStudentProfile,
  getStudentSession,
  googleStudentAuthAvailable,
  ensureStudentProfile,
  loadUserSettings,
  onStudentAuthChange,
  redeemStudentAccessCode,
  saveUserSettings,
  signInStudent,
  signInStudentWithGoogle,
  signUpStudent,
  signOutStudent,
} from "./supabase.js?v=20260828-release3";
import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js?v=20260828-release3";
import { installPlayfulInteractions } from "./effects.js?v=20260828-release3";
import { planFor } from "./plans.js?v=20260828-release3";
import { setAmbientPlayback, stopAudio, syncAmbientFromSettings } from "./audio.js?v=20260828-release3";

let publishedLessons = [];
let visibleLessons = [];
const supportedFilters = new Set(["all", "conversation", "grammar", "listening", "continue", "weak"]);
const requestedFilter = new URLSearchParams(window.location.search).get("filter") || "all";
let activeFilter = supportedFilters.has(requestedFilter) ? requestedFilter : "all";

const LANGUAGE_CODES = Object.freeze([
  "af","sq","am","ar","hy","as","ay","az","bm","eu","be","bn","bho","bs","bg","ca","ceb","zh","co","hr","cs","da","dv","doi","nl","en","eo","et","ee","fil","fi","fr","fy","gl","ka","de","el","gn","gu","ht","ha","haw","he","hi","hmn","hu","is","ig","ilo","id","ga","it","ja","jv","kn","kk","km","rw","gom","ko","kri","ku","ckb","ky","lo","la","lv","ln","lt","lg","lb","mk","mai","mg","ms","ml","mt","mi","mr","mni","lus","mn","my","ne","no","ny","or","om","ps","fa","pl","pt","pa","qu","ro","ru","sm","sa","gd","nso","sr","st","sn","sd","si","sk","sl","so","es","su","sw","sv","tg","ta","tt","te","th","ti","ts","tr","tk","ak","uk","ur","ug","uz","vi","cy","xh","yi","yo","zu"
]);

function populateNativeLanguages() {
  const names = typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames([document.documentElement.lang || "en", "en"], { type: "language" })
    : null;
  const choices = LANGUAGE_CODES.map((code) => ({
    code,
    name: names?.of(code) || code.toUpperCase(),
  })).sort((left, right) => left.name.localeCompare(right.name));
  document.querySelectorAll(".native-language-select").forEach((select) => {
    if (select.options.length > 1) return;
    choices.forEach(({ code, name }) => select.append(element("option", {
      text: `${name} (${code})`,
      attrs: { value: name },
    })));
  });
}

async function configureGoogleButton() {
  const button = document.querySelector("#googleSignIn");
  if (!button) return;
  const available = await googleStudentAuthAvailable();
  if (available) return;
  button.disabled = true;
  button.title = "Google signup requires the site owner’s Google OAuth credentials.";
  const label = button.querySelector("span:last-child");
  if (label) {
    label.dataset.uiEn = "Google signup · setup pending";
    label.dataset.uiJa = "Google登録・設定準備中";
    label.textContent = uiText(label.dataset.uiEn, label.dataset.uiJa, languageModeFromSettings(getSettings()));
  }
}
let authSession = null;
let remoteAttempts = [];
let remoteAssignments = [];
let remotePersonalLessons = [];
let personalLoadMessage = "";
let activeStorageUserId = null;
let settingsScopeGeneration = 0;
let pendingSettingsLoad = null;
let pendingSettingsUserId;
let currentMembership = null;
let currentProfile = null;

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

function isGoogleSession(session) {
  if (!session?.user) return false;
  if (String(session.user.app_metadata?.provider || "").toLowerCase() === "google") return true;
  return (session.user.identities || []).some(
    (identity) => String(identity?.provider || "").toLowerCase() === "google",
  );
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
  }
  if (publishedLessons.length) renderLessonGrid();

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
  if (typeof settings.voiceEnabled === "boolean") return settings.voiceEnabled;
  if (typeof settings.sound === "boolean") return settings.sound;
  if (typeof settings.soundEnabled === "boolean") return settings.soundEnabled;
  return true;
}

function applySettings(settings = getSettings()) {
  const language = settingsLanguage(settings);
  const sound = settingsSound(settings);
  applyLanguageMode(language);

  const languageToggle = document.querySelector("#languageToggle");
  const voiceToggle = document.querySelector("#voiceToggle");
  const sfxToggle = document.querySelector("#sfxToggle");
  const ambientToggle = document.querySelector("#ambientToggle");
  const ambientTrack = document.querySelector("#ambientTrack");
  const ambientVolume = document.querySelector("#ambientVolume");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");
  const themeToggle = document.querySelector("#themeToggle");
  const weeklyGoal = document.querySelector("#weeklyGoalSelect");
  if (languageToggle) languageToggle.value = language;
  if (voiceToggle) {
    voiceToggle.textContent = sound
      ? uiText("Voice On", "ボイス オン", language)
      : uiText("Voice Off", "ボイス オフ", language);
    voiceToggle.setAttribute("aria-pressed", String(sound));
  }
  if (sfxToggle) {
    sfxToggle.textContent = settings.sfxEnabled
      ? uiText("SFX On", "効果音 オン", language)
      : uiText("SFX Off", "効果音 オフ", language);
    sfxToggle.setAttribute("aria-pressed", String(settings.sfxEnabled));
  }
  if (ambientToggle) {
    ambientToggle.textContent = settings.ambientEnabled
      ? uiText("Ambient On", "環境音 オン", language)
      : uiText("Ambient Off", "環境音 オフ", language);
    ambientToggle.setAttribute("aria-pressed", String(settings.ambientEnabled));
  }
  if (ambientTrack) ambientTrack.value = settings.ambientTrack || "calm_focus";
  if (ambientVolume) ambientVolume.value = String(Math.round((settings.ambientVolume ?? 0.18) * 100));
  if (voiceSelect) voiceSelect.value = settings.voice || "us";
  if (playbackRate) playbackRate.value = String(settings.playbackRate || 1);
  if (themeToggle) themeToggle.value = settings.theme || "light";
  if (weeklyGoal) weeklyGoal.value = String(settings.weeklyGoal || 3);
  applyThemePreference(settings.theme);
}

function bindSettings() {
  const languageToggle = document.querySelector("#languageToggle");
  const voiceToggle = document.querySelector("#voiceToggle");
  const sfxToggle = document.querySelector("#sfxToggle");
  const ambientToggle = document.querySelector("#ambientToggle");
  const ambientTrack = document.querySelector("#ambientTrack");
  const ambientVolume = document.querySelector("#ambientVolume");
  const voiceSelect = document.querySelector("#voiceSelect");
  const playbackRate = document.querySelector("#playbackRate");
  const themeToggle = document.querySelector("#themeToggle");
  const weeklyGoal = document.querySelector("#weeklyGoalSelect");
  const mobileSettingsToggle = document.querySelector("#mobileSettingsToggle");
  const settingsControls = document.querySelector("#siteSettingsControls");

  const closeSettings = ({ restoreFocus = false } = {}) => {
    if (mobileSettingsToggle?.getAttribute("aria-expanded") !== "true") return;
    mobileSettingsToggle.setAttribute("aria-expanded", "false");
    settingsControls?.classList.remove("mobile-open");
    if (restoreFocus) mobileSettingsToggle.focus();
  };

  mobileSettingsToggle?.addEventListener("click", () => {
    const expanded = mobileSettingsToggle.getAttribute("aria-expanded") === "true";
    mobileSettingsToggle.setAttribute("aria-expanded", String(!expanded));
    settingsControls?.classList.toggle("mobile-open", !expanded);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSettings({ restoreFocus: true });
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest?.(".site-header")) return;
    closeSettings();
  });

  languageToggle?.addEventListener("change", () => {
    const next = ["en", "bilingual", "ja"].includes(languageToggle.value)
      ? languageToggle.value
      : "bilingual";
    updateAndSyncSettings({
      showJapanese: next !== "en",
      languageMode: next,
    });
  });
  voiceToggle?.addEventListener("click", () => {
    const next = !settingsSound(getSettings());
    if (!next) stopAudio();
    updateAndSyncSettings({ voiceEnabled: next });
  });
  sfxToggle?.addEventListener("click", () => {
    updateAndSyncSettings({ sfxEnabled: !getSettings().sfxEnabled });
  });
  ambientToggle?.addEventListener("click", async () => {
    const next = !getSettings().ambientEnabled;
    const settings = updateAndSyncSettings({ ambientEnabled: next });
    await setAmbientPlayback(next, { ...settings, userGesture: true });
  });
  ambientTrack?.addEventListener("change", async () => {
    const settings = updateAndSyncSettings({ ambientTrack: ambientTrack.value });
    if (settings.ambientEnabled) await setAmbientPlayback(true, { ...settings, userGesture: true });
  });
  ambientVolume?.addEventListener("input", async () => {
    const settings = updateAndSyncSettings({ ambientVolume: Number(ambientVolume.value) / 100 });
    if (settings.ambientEnabled) await setAmbientPlayback(true, { ...settings, userGesture: true });
  });
  voiceSelect?.addEventListener("change", () => {
    updateAndSyncSettings({ voice: voiceSelect.value === "gb" ? "gb" : "us" });
  });
  playbackRate?.addEventListener("change", () => {
    updateAndSyncSettings({ playbackRate: Number(playbackRate.value) });
  });
  themeToggle?.addEventListener("change", () => {
    updateAndSyncSettings({ theme: themeToggle.value });
  });
  weeklyGoal?.addEventListener("change", () => {
    updateAndSyncSettings({ weeklyGoal: Number(weeklyGoal.value) });
    updatePersonalMetrics();
  });
  onSettingsChange((settings) => {
    applySettings(settings);
    if (visibleLessons.length) renderLessonGrid();
    if (authSession) {
      updatePersonalMetrics();
      renderHistory();
    }
  });
  applySettings();
  void syncAmbientFromSettings();
  watchSystemTheme(() => applyThemePreference(getSettings().theme));
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

function currentReturnPath() {
  return safeLocalReturnPath(window.location.href, "/");
}

function lessonHref(lesson, practice = "") {
  const query = new URLSearchParams({ id: lesson.id });
  if (lesson.assigned) query.set("assigned", "1");
  if (["quick", "full"].includes(practice)) query.set("practice", practice);
  query.set("return", currentReturnPath());
  return `/lesson.html?${query.toString()}`;
}

function syncNavigationContext() {
  const returnPath = currentReturnPath();
  document.querySelectorAll(".phrase-library-link").forEach((link) => {
    link.href = `/phrases?return=${encodeURIComponent(returnPath)}`;
  });
}

function createLessonCard(lesson, options = {}) {
  const progress = progressSummary(lesson);
  const count = Number(lesson.questions?.length || lesson.questionCount || 0);
  const groups = lessonGroups(lesson);
  const locked = lesson.locked === true;
  const statusText = locked
    ? t("Membership", "会員限定")
    : lesson.isPreview
      ? t("Free preview", "無料サンプル")
      : options.assigned
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
  const action = locked
    ? element("a", {
      className: "lesson-action locked",
      attrs: { href: "#account" },
    }, [
      element("span", { text: t("Unlock full lesson", "全レッスンを開放") }),
      element("span", { text: "→", attrs: { "aria-hidden": "true" } }),
    ])
    : element("div", {
      className: "lesson-mode-actions",
      attrs: { "aria-label": t("Choose practice length", "練習時間を選ぶ") },
    }, [
      element("a", {
        className: "lesson-mode-action quick",
        attrs: { href: lessonHref({ ...lesson, assigned: options.assigned }, "quick") },
      }, [
        element("span", { className: "lesson-mode-icon", text: "⚡", attrs: { "aria-hidden": "true" } }),
        element("span", { className: "lesson-mode-copy" }, [
          element("strong", { text: t("Quick Practice", "ショート練習") }),
          element("small", { text: t("5–10 min · 8 questions", "5〜10分・8問") }),
        ]),
        element("span", { className: "lesson-mode-arrow", text: "→", attrs: { "aria-hidden": "true" } }),
      ]),
      element("a", {
        className: "lesson-mode-action full",
        attrs: { href: lessonHref({ ...lesson, assigned: options.assigned }, "full") },
      }, [
        element("span", { className: "lesson-mode-icon", text: "◎", attrs: { "aria-hidden": "true" } }),
        element("span", { className: "lesson-mode-copy" }, [
          element("strong", {
            text: progress.percent && !progress.completed
              ? t("Continue Full Lesson", "フルレッスンを続ける")
              : t("Full Lesson", "フルレッスン"),
          }),
          element("small", { text: t(`${count} questions · complete practice`, `${count}問・すべて練習`) }),
        ]),
        element("span", { className: "lesson-mode-arrow", text: "→", attrs: { "aria-hidden": "true" } }),
      ]),
    ]);

  const card = element("article", {
    className: `lesson-card${locked ? " lesson-card-locked" : ""}`,
    attrs: {
      "data-groups": groups.join(" "),
      "data-lesson-id": lesson.id,
    },
  }, [top, title, titleJa, summary, summaryJa, meta, progressBar, action]);
  card.addEventListener("click", (event) => {
    if (event.target.closest("a,button,input,select,textarea")) return;
    if (locked) {
      document.querySelector("#account")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    card.querySelector(".lesson-mode-action.quick")?.focus();
  });
  return card;
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
    const message = t("No lessons match this filter yet.", "この条件に合うレッスンはまだありません。");
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
    const active = button.dataset.filter === activeFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".filter-chip[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      document.querySelectorAll(".filter-chip[data-filter]").forEach((candidate) => {
        candidate.classList.toggle("active", candidate === button);
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      const url = new URL(window.location.href);
      if (activeFilter === "all") url.searchParams.delete("filter");
      else url.searchParams.set("filter", activeFilter);
      window.history.replaceState({}, "", `${url.pathname}${url.search}#library`);
      syncNavigationContext();
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

function setProfileCompletionStatus(message, isError = false) {
  let status = document.querySelector("#profileCompletionStatus");
  if (!status) {
    const form = document.querySelector("#profileCompletionForm");
    const submit = form?.querySelector('button[type="submit"]');
    if (!form || !submit) return;
    status = document.createElement("p");
    status.id = "profileCompletionStatus";
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.insertBefore(status, submit);
  }
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
    await ensureStudentProfile(authSession);
    const scopeReady = await activateStorageScope(authSession);
    if (!scopeReady) return;
    form.reset();
    setLoginStatus(t("Signed in successfully.", "ログインしました。"));
    showToast(t(
      "Welcome back. Your saved learning is ready.",
      "おかえりなさい。保存済みの学習を再開できます。",
    ));
    await refreshAuthView();
  } catch (error) {
    setLoginStatus(error?.message || t("Sign-in failed.", "ログインできませんでした。"), true);
  } finally {
    if (submit) submit.disabled = false;
  }
}

function signupValues(form) {
  return {
    firstName: form.querySelector("#signupFirstName")?.value.trim() || "",
    lastName: form.querySelector("#signupLastName")?.value.trim() || "",
    email: form.querySelector("#signupEmail")?.value.trim() || "",
    password: form.querySelector("#signupPassword")?.value || "",
    ageGroup: form.querySelector("#signupAgeGroup")?.value || "",
    nativeLanguage: form.querySelector("#signupNativeLanguage")?.value.trim() || "",
    englishLevel: form.querySelector("#signupEnglishLevel")?.value || "",
    learningGoal: form.querySelector("#signupLearningGoal")?.value.trim() || "",
  };
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const values = signupValues(form);
  const passwordIsValid = values.password.length >= 8
    && /[A-Za-z]/.test(values.password)
    && /[0-9]/.test(values.password);
  if (!form.reportValidity() || !values.firstName || !values.lastName || !values.email
    || !values.ageGroup || !values.nativeLanguage || !values.englishLevel || !passwordIsValid) {
    setLoginStatus(t(
      "Please complete every required field. Use at least 8 password characters with a letter and a number.",
      "必須項目をすべて入力してください。パスワードは英字と数字を含む8文字以上にしてください。",
    ), true);
    return;
  }
  if (submit) submit.disabled = true;
  setLoginStatus(t("Creating your account…", "アカウントを作成中…"));
  try {
    const result = await signUpStudent(values);
    if (result?.error) throw result.error;
    authSession = normaliseSession(result) || normaliseSession(await getStudentSession());
    if (authSession) {
      await ensureStudentProfile(authSession, values);
      await activateStorageScope(authSession);
      setLoginStatus(t(
        "Account created. Membership is waiting for teacher approval.",
        "アカウントを作成しました。先生の承認をお待ちください。",
      ));
      await refreshAuthView();
    } else {
      setLoginStatus(t(
        "Check your email to confirm the account, then sign in.",
        "確認メールを開いて登録を完了し、その後ログインしてください。",
      ));
    }
    form.reset();
  } catch (error) {
    setLoginStatus(error?.message || t("Account creation failed.", "アカウントを作成できませんでした。"), true);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function handleGoogleSignIn() {
  setLoginStatus(t("Opening Google sign-in…", "Googleログインを開いています…"));
  const result = await signInStudentWithGoogle();
  if (result?.error) {
    setLoginStatus(t(
      "Google sign-in is not configured yet. Please use email for now.",
      "Googleログインは現在設定中です。今はメールアドレスをご利用ください。",
    ), true);
    return;
  }
  const destination = result?.data?.url;
  if (destination) window.location.assign(destination);
  else setLoginStatus(t(
    "Google sign-in is not available yet. Please use email for now.",
    "Googleログインは現在準備中です。今はメールアドレスをご利用ください。",
  ), true);
}

async function handleAccessCode(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.querySelector("#accessCodeInput");
  const code = input?.value.trim() || "";
  if (!code) return;
  const submit = form.querySelector('button[type="submit"]');
  const originalLabel = submit?.textContent || "Unlock";
  if (submit) {
    submit.disabled = true;
    submit.textContent = t("Checking…", "確認中…");
  }
  setLoginStatus(t("Checking the code…", "コードを確認中…"));
  try {
    const result = await redeemStudentAccessCode(code);
    if (result?.error) throw result.error;
    if (input) input.value = "";
    const plan = planFor(result?.data?.membershipPlan || "standard").name;
    const scope = result?.data?.membershipScope || "general";
    const expires = result?.data?.membershipExpiresAt ? formatDate(result.data.membershipExpiresAt) : "—";
    const success = t(
      `${plan} membership unlocked (${scope}) until ${expires}.`,
      `${plan}会員（${scope}）を開放しました。有効期限：${expires}。`,
    );
    showToast(success);
    setLoginStatus(success);
    await refreshAuthView();
    await reloadLessons();
  } catch (error) {
    const rawMessage = String(error?.message || "");
    const safeMessage = /digest\(|gen_random_bytes|pgcrypto|function .* does not exist/i.test(rawMessage)
      ? t(
          "The secure code service is being updated. Please contact the teacher.",
          "アクセスコード機能を更新中です。担当講師へご連絡ください。",
        )
      : /not found/i.test(rawMessage)
        ? t("This access code was not found. Check every character.", "アクセスコードが見つかりません。すべての文字を確認してください。")
        : /disabled/i.test(rawMessage)
          ? t("This access code was disabled by the teacher.", "このアクセスコードは先生によって無効化されています。")
          : /has expired/i.test(rawMessage)
            ? t("This access code has expired. Ask the teacher for a new code.", "アクセスコードの有効期限が切れています。先生に新しいコードをご確認ください。")
            : /already.*used|already reached|use limit/i.test(rawMessage)
        ? t(
            "This access code has already been used by this account or reached its use limit.",
            "このアカウントですでに使用済み、またはコードの利用上限に達しています。",
          )
        : /full code in the format/i.test(rawMessage)
          ? t(
              "Enter the complete code beginning with TEC-. The four characters in the teacher’s history are only a masked reference.",
              "TEC-から始まる完全なコードを入力してください。先生画面の履歴にある4文字は、安全のため末尾だけを表示したものです。",
            )
          : /took too long/i.test(rawMessage)
            ? t(
                "The result could not be confirmed. Refresh and check your membership before trying the code again.",
                "結果を確認できませんでした。再度コードを使う前に、ページを更新して会員状態をご確認ください。",
              )
            : rawMessage || t("The code could not be used.", "コードを利用できませんでした。");
    setLoginStatus(safeMessage, true);
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  }
}

async function handleProfileCompletion(event) {
  event.preventDefault();
  if (!authSession) return;
  const form = event.currentTarget;
  const values = {
    firstName: form.querySelector("#profileFirstName")?.value.trim() || "",
    lastName: form.querySelector("#profileLastName")?.value.trim() || "",
    ageGroup: form.querySelector("#profileAgeGroup")?.value || "",
    nativeLanguage: form.querySelector("#profileNativeLanguage")?.value || "",
    englishLevel: form.querySelector("#profileEnglishLevel")?.value || "",
    learningGoal: form.querySelector("#profileLearningGoal")?.value.trim() || "",
  };
  if (!form.reportValidity() || Object.entries(values).some(([key, value]) => key !== "learningGoal" && !value)) {
    const message = t("Please complete every required profile field.", "必須プロフィール項目をすべて入力してください。");
    setLoginStatus(message, true);
    setProfileCompletionStatus(message, true);
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  if (submit) submit.disabled = true;
  setProfileCompletionStatus(t("Saving your profile…", "プロフィールを保存中…"));
  try {
    const result = await ensureStudentProfile(authSession, values);
    if (result?.error) throw result.error;
    currentProfile = result.profile;
    const success = t("Your learning profile is ready.", "学習プロフィールを保存しました。");
    setLoginStatus(success);
    setProfileCompletionStatus(success);
    showToast(success);
    await refreshProfileCompletion();
  } catch (error) {
    const message = error?.message || t("The profile could not be saved.", "プロフィールを保存できませんでした。");
    setLoginStatus(message, true);
    setProfileCompletionStatus(message, true);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function handleLogout() {
  const result = await signOutStudent();
  // Always rebuild the page/client from cleared local storage. This also
  // removes protected state from view when the SDK request times out.
  const status = result?.error ? "local" : "complete";
  window.location.replace(`/?signedOut=${status}`);
}

function finishSignOutTransition() {
  const url = new URL(window.location.href);
  const status = url.searchParams.get("signedOut");
  if (!['complete', 'local'].includes(status)) return;
  const message = status === "local"
    ? t(
      "Signed out on this device. The server response could not be confirmed.",
      "この端末からログアウトしました。サーバーの応答は確認できませんでした。",
    )
    : t("Signed out safely.", "安全にログアウトしました。");
  setLoginStatus(message, status === "local");
  showToast(message);
  url.searchParams.delete("signedOut");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function bindAuth() {
  document.querySelector("#studentLoginForm")?.addEventListener("submit", handleLogin);
  document.querySelector("#studentSignupForm")?.addEventListener("submit", handleSignup);
  document.querySelector("#googleSignIn")?.addEventListener("click", handleGoogleSignIn);
  document.querySelector("#accessCodeForm")?.addEventListener("submit", handleAccessCode);
  document.querySelector("#profileCompletionForm")?.addEventListener("submit", handleProfileCompletion);
  document.querySelector("#logoutButton")?.addEventListener("click", handleLogout);
  document.querySelector("#studentLogout")?.addEventListener("click", handleLogout);
  document.querySelector("#profileGateLogout")?.addEventListener("click", handleLogout);
  document.querySelector("#profileGateDialog")?.addEventListener("cancel", (event) => {
    if (isGoogleSession(authSession)) event.preventDefault();
  });

  document.querySelectorAll("[data-auth-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.authView;
      document.querySelectorAll("[data-auth-view]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-selected", String(active));
        candidate.tabIndex = active ? 0 : -1;
      });
      document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.authPanel !== view;
      });
    });
  });
  document.querySelector(".auth-tabs[role='tablist']")?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...event.currentTarget.querySelectorAll("[role='tab']")];
    const currentIndex = Math.max(0, tabs.indexOf(document.activeElement));
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[nextIndex]?.click();
    tabs[nextIndex]?.focus();
  });

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
    if (authSession) await ensureStudentProfile(authSession);
    const scopeReady = await activateStorageScope(authSession);
    if (!scopeReady) return;
    await reloadLessons();
    await refreshAuthView();
  });
}

function ensureGeneralLogoutButton() {
  const membershipPanel = document.querySelector("#membershipPanel");
  const loginForm = document.querySelector("#studentLoginForm");
  const signupForm = document.querySelector("#studentSignupForm");
  const google = document.querySelector("#googleSignIn");
  const divider = document.querySelector(".auth-divider");
  const tabs = document.querySelector(".auth-tabs");
  if (membershipPanel) membershipPanel.hidden = !authSession;
  if (loginForm) loginForm.hidden = Boolean(authSession);
  if (signupForm) signupForm.hidden = true;
  if (google) google.hidden = Boolean(authSession);
  if (divider) divider.hidden = Boolean(authSession);
  if (tabs) tabs.hidden = Boolean(authSession);
}

async function refreshMembershipPanel() {
  const panel = document.querySelector("#membershipPanel");
  const status = document.querySelector("#membershipStatus");
  const codeForm = document.querySelector("#accessCodeForm");
  if (!panel || !authSession) {
    currentMembership = null;
    if (panel) panel.hidden = true;
    return;
  }
  const result = await getStudentMembership();
  currentMembership = result.membership;
  panel.hidden = false;
  const expires = currentMembership?.expires_at
    ? formatDate(currentMembership.expires_at, true)
    : "—";
  if (status) {
    const activePlan = planFor(currentMembership?.plan_tier || "free").name;
    status.textContent = result.active
      ? t(`${activePlan} active until ${expires}.`, `${activePlan}は${expires}まで利用できます。`)
      : t(
        `Signed in as ${authSession.user?.email || "learner"}. Approval is pending, or enter an access code below.`,
        `${authSession.user?.email || "学習者"}でログイン中です。承認を待つか、アクセスコードを入力してください。`,
      );
  }
  if (codeForm) {
    codeForm.hidden = result.active;
    codeForm.setAttribute("aria-hidden", String(result.active));
  }
}

async function refreshProfileCompletion() {
  const panel = document.querySelector("#profileCompletionPanel");
  const form = document.querySelector("#profileCompletionForm");
  const home = document.querySelector("#profileCompletionHome");
  const gate = document.querySelector("#profileGateDialog");
  const gateMount = document.querySelector("#profileGateMount");
  if (!panel || !form || !authSession) {
    if (panel) panel.hidden = true;
    if (gate?.open) gate.close();
    if (panel && home?.parentNode && panel.parentNode !== home.parentNode) home.after(panel);
    currentProfile = null;
    return;
  }
  const result = await getStudentProfile();
  currentProfile = result.profile;
  const required = ["first_name", "last_name", "age_group", "native_language", "english_level"];
  const incomplete = required.some((key) => !String(currentProfile?.[key] || "").trim());
  const requiresGoogleGate = incomplete && isGoogleSession(authSession);
  panel.hidden = !incomplete;
  if (requiresGoogleGate && gateMount && panel.parentNode !== gateMount) gateMount.append(panel);
  if (!requiresGoogleGate && home?.parentNode && panel.parentNode !== home.parentNode) home.after(panel);
  if (requiresGoogleGate && gate && !gate.open && typeof gate.showModal === "function") gate.showModal();
  if (!requiresGoogleGate && gate?.open) gate.close();
  if (!incomplete) return;
  const metadata = authSession.user?.user_metadata || {};
  const fields = {
    profileVerifiedEmail: authSession.user?.email || "",
    profileFirstName: currentProfile?.first_name || metadata.given_name || metadata.first_name || "",
    profileLastName: currentProfile?.last_name || metadata.family_name || metadata.last_name || "",
    profileAgeGroup: currentProfile?.age_group || "",
    profileNativeLanguage: currentProfile?.native_language || "",
    profileEnglishLevel: currentProfile?.english_level || "",
    profileLearningGoal: currentProfile?.learning_goal || "",
  };
  Object.entries(fields).forEach(([id, value]) => {
    const control = form.querySelector(`#${id}`);
    // Always replace the read-only identity field when auth accounts change;
    // never leave a previous learner's address in the detached gate form.
    if (control && (id === "profileVerifiedEmail" || !control.value)) control.value = value;
  });
  if (requiresGoogleGate) form.querySelector("input, select, textarea")?.focus();
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

function attemptIdentity(attempt, fallback = "") {
  return String(
    attempt?.client_attempt_id
    || attempt?.clientAttemptId
    || attempt?.runAttemptId
    || attempt?.id
    || fallback,
  );
}

function tokyoDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftDateKey(key, days) {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function studyStreak(dateKeys) {
  const dates = new Set(dateKeys.filter(Boolean));
  const today = tokyoDateKey(new Date());
  let cursor = dates.has(today) ? today : shiftDateKey(today, -1);
  let count = 0;
  while (dates.has(cursor)) {
    count += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return count;
}

function weekDateKeys(dateKeys) {
  const today = tokyoDateKey(new Date());
  const day = new Date(`${today}T00:00:00Z`).getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = shiftDateKey(today, mondayOffset);
  const sunday = shiftDateKey(monday, 6);
  return new Set(dateKeys.filter((key) => key >= monday && key <= sunday));
}

function retryImprovementFromAttempt(attempt) {
  let payload = attempt?.answers;
  if (typeof payload === "string") {
    try { payload = JSON.parse(payload); } catch { payload = {}; }
  }
  const first = payload?.firstResults || payload?.officialResults || {};
  const final = payload?.results || {};
  return Object.keys(first).reduce((totals, questionId) => {
    const firstResult = first[questionId];
    const finalResult = final[questionId];
    const maximum = Number(firstResult?.max || finalResult?.max || 1);
    if (!firstResult || Number(firstResult.score || 0) >= maximum) return totals;
    totals.opportunities += 1;
    if (finalResult && Number(finalResult.score || 0) > Number(firstResult.score || 0)) {
      totals.improved += 1;
    }
    return totals;
  }, { improved: 0, opportunities: 0 });
}

function retryImprovementFromLocal(progress) {
  const official = progress?.official && typeof progress.official === "object" ? progress.official : {};
  const retries = progress?.retryAttempts && typeof progress.retryAttempts === "object"
    ? progress.retryAttempts
    : {};
  return Object.keys(official).reduce((totals, questionId) => {
    const firstResult = official[questionId];
    const maximum = Number(firstResult?.max || 1);
    if (!firstResult || Number(firstResult.score || 0) >= maximum) return totals;
    totals.opportunities += 1;
    if ((retries[questionId] || []).some(
      (retry) => Number(retry?.score || 0) > Number(firstResult.score || 0),
    )) {
      totals.improved += 1;
    }
    return totals;
  }, { improved: 0, opportunities: 0 });
}

function updatePersonalMetrics() {
  const local = allLocalProgress();
  const remoteKeys = new Set(remoteAttempts.map((attempt, index) => (
    attemptIdentity(attempt, `remote-${index}`)
  )));
  const localWithoutRemoteDuplicate = local.filter((item, index) => {
    const key = attemptIdentity(item, `local-${item.lessonId || index}`);
    return !remoteKeys.has(key);
  });
  const dates = [
    ...localWithoutRemoteDuplicate.map((item) => item.updatedAt || item.lastStudy || item.completedAt),
    ...remoteAttempts.map(attemptTimestamp),
  ].filter(Boolean).sort((a, b) => new Date(b) - new Date(a));
  const scored = remoteAttempts.map(attemptScore).filter(({ total }) => total > 0);
  const localScored = localWithoutRemoteDuplicate
    .filter((item) => item.completed || item.completedAt)
    .map((item) => ({
      correct: Number(item.firstScore ?? item.firstTryCorrect ?? 0),
      total: Number(item.maxScore ?? item.firstTryTotal ?? 0),
    }))
    .filter(({ total }) => total > 0);
  const combined = [...scored, ...localScored];
  const correct = combined.reduce((sum, item) => sum + item.correct, 0);
  const total = combined.reduce((sum, item) => sum + item.total, 0);
  const weakLessons = visibleLessons.filter((lesson) => progressSummary(lesson).needsReview).length;
  const dateKeys = dates.map(tokyoDateKey).filter(Boolean);
  const streak = studyStreak(dateKeys);
  const weeklyDays = weekDateKeys(dateKeys).size;
  const weeklyGoal = Number(getSettings().weeklyGoal || 3);
  const completedLessonIds = new Set([
    ...local.filter((item) => item.completed || item.completedAt).map((item) => String(item.lessonId || item.id || "")),
    ...remoteAttempts.map((attempt) => String(
      lessonFromAttempt(attempt)?.id || attempt.lesson_id || attempt.lessonId || "",
    )),
  ].filter(Boolean));
  const remoteRetry = remoteAttempts.reduce((sum, attempt) => {
    const value = retryImprovementFromAttempt(attempt);
    sum.improved += value.improved;
    sum.opportunities += value.opportunities;
    return sum;
  }, { improved: 0, opportunities: 0 });
  const localRetry = localWithoutRemoteDuplicate.reduce((sum, progress) => {
    const value = retryImprovementFromLocal(progress);
    sum.improved += value.improved;
    sum.opportunities += value.opportunities;
    return sum;
  }, { improved: 0, opportunities: 0 });
  const retryTotals = {
    improved: remoteRetry.improved + localRetry.improved,
    opportunities: remoteRetry.opportunities + localRetry.opportunities,
  };

  const lastStudy = document.querySelector("#lastStudy");
  const averageScore = document.querySelector("#averageScore");
  const sessionCount = document.querySelector("#sessionCount");
  const weakCount = document.querySelector("#weakCount");
  const streakCount = document.querySelector("#streakCount");
  const weeklyGoalProgress = document.querySelector("#weeklyGoalProgress");
  const completedCount = document.querySelector("#completedCount");
  const retryImprovement = document.querySelector("#retryImprovement");
  if (lastStudy) lastStudy.textContent = dates[0] ? formatDate(dates[0]) : t("Not yet", "まだありません");
  if (averageScore) averageScore.textContent = total ? `${Math.round((correct / total) * 100)}%` : t("Not yet", "まだありません");
  if (sessionCount) sessionCount.textContent = String(
    remoteAttempts.length + localWithoutRemoteDuplicate.filter((item) => item.completed || item.completedAt).length,
  );
  if (weakCount) weakCount.textContent = String(weakLessons);
  if (streakCount) streakCount.textContent = t(
    `${streak} day${streak === 1 ? "" : "s"}`,
    `${streak}日`,
  );
  if (weeklyGoalProgress) weeklyGoalProgress.textContent = t(
    `${weeklyDays} / ${weeklyGoal} days`,
    `${weeklyDays} / ${weeklyGoal}日`,
  );
  if (completedCount) completedCount.textContent = String(completedLessonIds.size);
  if (retryImprovement) retryImprovement.textContent = retryTotals.opportunities
    ? t(
        `${retryTotals.improved} / ${retryTotals.opportunities} improved`,
        `${retryTotals.opportunities}問中${retryTotals.improved}問が上達`,
      )
    : t("No retries yet", "再挑戦はまだありません");

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
    cardLink.href = "#library";
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
        attrs: { href: lesson ? lessonHref(lesson) : "#library" },
      }, [
        element("span", { text: t("Review again", "もう一度復習") }),
        element("span", { text: "→", attrs: { "aria-hidden": "true" } }),
      ]),
    ]));
  });
}

async function renderLearnerProgress() {
  const section = document.querySelector("#learningProgress");
  if (!authSession?.user) {
    if (section) section.hidden = true;
    remoteAttempts = [];
    remoteAssignments = [];
    remotePersonalLessons = [];
    renderHistory();
    return;
  }
  const userId = String(authSession.user.id);
  if (section) section.hidden = false;
  await fetchPersonalRecords();
  if (String(authSession?.user?.id || "") !== userId) return;
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
  ensureGeneralLogoutButton();
  await refreshMembershipPanel();
  await refreshProfileCompletion();
  await renderLearnerProgress();
}

async function reloadLessons() {
  publishedLessons = (await loadPublishedLessons({
    audience: "all",
  })).filter((lesson) => lesson.status === "published");
  visibleLessons = publishedLessons;
  const publishedCount = document.querySelector("#publishedCount");
  const questionCount = document.querySelector("#questionCount");
  const totalQuestions = publishedLessons.reduce(
    (sum, lesson) => sum + Number(lesson.questions?.length || lesson.questionCount || 0),
    0,
  );
  if (publishedCount) publishedCount.textContent = String(publishedLessons.length);
  if (questionCount) questionCount.textContent = String(totalQuestions);
  renderLessonGrid();
}

function finishLegacyRouteTransition() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("legacy") !== "takiwaki") return;
  const target = authSession ? document.querySelector("#learningProgress") : document.querySelector("#account");
  target?.scrollIntoView({ block: "start" });
  url.searchParams.delete("legacy");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${target ? `#${target.id}` : ""}`);
}

async function initialise() {
  // Bind visible controls before any session or network lookup so an expired
  // browser session can never leave the page looking ready but unresponsive.
  populateNativeLanguages();
  bindSettings();
  bindFilters();
  bindAuth();
  syncNavigationContext();

  authSession = normaliseSession(await getStudentSession());
  if (authSession) await ensureStudentProfile(authSession);
  await activateStorageScope(authSession);
  finishSignOutTransition();
  // Authentication and lesson controls should never wait on the provider
  // settings endpoint. The availability check updates the button separately.
  void configureGoogleButton();

  await reloadLessons();
  await refreshAuthView();
  finishLegacyRouteTransition();
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
