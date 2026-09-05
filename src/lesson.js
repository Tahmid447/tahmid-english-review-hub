import { buildPhraseCatalog, getLessonById, normalizeJapaneseMeaning } from "./data.js?v=20260905-release5";
import {
  applyThemePreference,
  escapeHTML,
  getLessonProgress,
  getSettings,
  saveLessonProgress,
  safeLocalReturnPath,
  setStorageUser,
  shuffleArray,
  updateSettings,
  watchSystemTheme,
} from "./store.js?v=20260905-release5";
import {
  answerCoachingFeedback,
  playAnswerFeedback,
  playCompletionSound,
  setAmbientPlayback,
  speakText,
  speechRecognitionSupported,
  startSpeechPractice,
  stopAudio,
  stopSpeechPractice,
  syncAmbientFromSettings,
} from "./audio.js?v=20260905-natural1";
import {
  getStudentSession,
  loadUserSettings,
  onStudentAuthChange,
  saveAttempt,
  saveSpeakingActivity,
  saveUserSettings,
} from "./supabase.js?v=20260905-release5";
import { applyLanguageMode, languageModeFromSettings, learningText, uiText } from "./i18n.js?v=20260905-release5";
import { DEEP_LESSON_GUIDES } from "./lesson-guides.js?v=20260905-release5";
import { buildPracticeMapTargets } from "./lesson-guide-targets.js?v=20260905-release5";
import { animateAnswerFeedback, installPlayfulInteractions } from "./effects.js?v=20260905-release5";
import { renderPremiumLessonTasks } from "./premium-tasks.js?v=20260905-release5";
import { planFor } from "./plans.js?v=20260905-release5";
import {
  applyStudentFeatureVisibility,
  featureAllowed,
  loadStudentAccess,
  renderStudentAccessBoundary,
} from "./student-visibility.js?v=20260905-hub1";
import {
  answerExists as answerValueExists,
  calculateOfficialTotals,
  gradeQuestionAnswer,
  gridCellDisplay,
  isAnswerGradeable,
  preserveFirstResult,
  selectQuickPracticeIds,
  storyboardPanelLayout,
} from "./lesson-grading.js?v=20260905-release5";

const $ = (selector) => document.querySelector(selector);

const elements = {
  hubBackLink: $("#hubBackLink"),
  openLessonSettings: $("#openLessonSettings"),
  openPracticeSettings: $("#openPracticeSettings"),
  practiceSettingsSummary: $("#practiceSettingsSummary"),
  lessonSettingsDialog: $("#lessonSettingsDialog"),
  lessonSettingsHeading: $("#lessonSettingsHeading"),
  settingsIntro: $(".lesson-settings-dialog .settings-intro"),
  languageToggle: $("#languageToggle"),
  themeToggle: $("#themeToggle"),
  voiceToggle: $("#voiceToggle"),
  voiceVolume: $("#voiceVolume"),
  sfxToggle: $("#sfxToggle"),
  sfxVolume: $("#sfxVolume"),
  ambientToggle: $("#ambientToggle"),
  ambientTrack: $("#ambientTrack"),
  ambientVolume: $("#ambientVolume"),
  voiceSelect: $("#voiceSelect"),
  playbackRate: $("#playbackRate"),
  autoPronounceChoices: $("#autoPronounceChoices"),
  lessonDate: $("#lessonDate"),
  lessonTitle: $("#lessonTitle"),
  lessonSummary: $("#lessonSummary"),
  lessonSummaryJa: $("#lessonSummaryJa"),
  practiceEntryNote: $("#practiceEntryNote"),
  lessonGuideContent: $("#lessonGuideContent"),
  practiceMode: $("#practiceMode"),
  questionTypeFilter: $("#questionTypeFilter"),
  shuffleQuestions: $("#shuffleQuestions"),
  checkModeButtons: [...document.querySelectorAll("[data-check]")],
  hintModeButtons: [...document.querySelectorAll("[data-hint-mode]")],
  showChoiceTranslations: $("#showChoiceTranslations"),
  checkAnswered: $("#checkAnswered"),
  scorePill: $("#scorePill"),
  questionNav: $("#questionNav"),
  questionType: $("#questionType"),
  questionCounter: $("#questionCounter"),
  questionCard: $("#questionCard"),
  hintBox: $("#hintBox"),
  hintCountdown: $("#hintCountdown"),
  hintContent: $("#hintContent"),
  feedbackCard: $("#feedbackCard"),
  previousQuestion: $("#previousQuestion"),
  checkQuestion: $("#checkQuestion"),
  nextQuestion: $("#nextQuestion"),
  resultPanel: $("#resultPanel"),
  resultHeading: $("#resultHeading"),
  resultSummary: $("#resultSummary"),
  lockedQuestionTeasers: $("#lockedQuestionTeasers"),
  premiumTasksPanel: $("#premiumTasksPanel"),
  retryButtons: [...document.querySelectorAll("[data-retry]")],
  toast: $("#toast"),
};

const params = new URLSearchParams(window.location.search);
const lessonPathMatch = window.location.pathname.match(/^\/lesson\/([^/]+)\/?$/);
const lessonId = params.get("id") || decodeURIComponent(lessonPathMatch?.[1] || "");
const isTeacherPreview = params.get("preview") === "1";
const requestedPractice = ["quick", "full"].includes(params.get("practice"))
  ? params.get("practice")
  : "";
const legacyReturn = params.get("from") === "takiwaki" ? "/#account" : "/";
const returnTo = isTeacherPreview
  ? "/teacher.html"
  : safeLocalReturnPath(params.get("return"), legacyReturn);
const uuid = () => (
  globalThis.crypto?.randomUUID?.()
  || `${Date.now()}-${Math.random().toString(36).slice(2)}`
);

const state = {
  lesson: null,
  masterQuestions: [],
  visibleQuestions: [],
  currentIndex: 0,
  practiceMode: "all",
  quickQuestionIds: [],
  questionTypeFilter: "all",
  settings: getSettings(),
  startedAt: new Date().toISOString(),
  runAttemptId: uuid(),
  runStartedAt: new Date().toISOString(),
  questionOrder: [],
  answers: {},
  official: {},
  retryAttempts: {},
  retryEditing: new Set(),
  choiceOrders: {},
  feedback: {},
  runChecked: new Set(),
  runResults: {},
  runFirstResults: {},
  runAnswerCounts: {},
  requireRunChecks: false,
  hasPersistedRunState: false,
  savedRuns: {},
  savingRuns: new Set(),
  coachingTurns: { correct: 0, retry: 0 },
  toastTimer: null,
};

let hintCloseTimeout = null;
let hintCountdownInterval = null;
let hintDeadline = 0;
let hintQuestionId = "";
let activeStudentUserId = null;
let lessonScopeReady = false;
let authScopeLocked = false;
let feedbackSpeechGeneration = 0;

const textFor = (bilingual, language = "en") => {
  if (bilingual && typeof bilingual === "object") return String(bilingual[language] || "");
  return language === "en" ? String(bilingual || "") : "";
};
const currentLanguage = () => languageModeFromSettings(state.settings);
const t = (english, japanese) => uiText(english, japanese, currentLanguage());

const showToast = (message) => {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
};

const queueFeedbackSpeech = (items = []) => {
  const speechItems = items.filter((item) => String(item?.text || "").trim());
  if (!speechItems.length) return;
  const generation = ++feedbackSpeechGeneration;
  stopAudio();
  void (async () => {
    for (const item of speechItems) {
      if (generation !== feedbackSpeechGeneration) return;
      await speakText(item.text, {
        voice: state.settings.voice,
        language: item.language || "en",
        rate: state.settings.playbackRate,
      });
    }
  })();
};

const nextAnswerCoaching = (correct) => {
  const tone = correct ? "correct" : "retry";
  const coaching = answerCoachingFeedback(correct, state.coachingTurns[tone]);
  state.coachingTurns[tone] += 1;
  return coaching;
};

const provideAnswerFeedback = (result, { speakCoach = true } = {}) => {
  void playAnswerFeedback(Boolean(result?.correct));
  const question = state.visibleQuestions[state.currentIndex];
  animateAnswerFeedback(elements.feedbackCard, {
    correct: Boolean(result?.correct),
    speaking: question?.format === "speaking",
  });
  if (speakCoach && result?.coaching?.messageEn) {
    queueFeedbackSpeech([{ text: result.coaching.messageEn, language: "en" }]);
  }
};

const clearHintTimer = ({ keepDeadline = false } = {}) => {
  clearTimeout(hintCloseTimeout);
  clearInterval(hintCountdownInterval);
  hintCloseTimeout = null;
  hintCountdownInterval = null;
  if (!keepDeadline) hintDeadline = 0;
  if (elements.hintCountdown) elements.hintCountdown.textContent = "";
};

const syncHintTimer = ({ restart = false } = {}) => {
  clearHintTimer({ keepDeadline: !restart });
  if (
    !elements.hintBox?.open
    || elements.hintBox.hidden
    || state.settings.hintMode !== "auto"
  ) {
    hintDeadline = 0;
    return;
  }
  if (restart || !hintDeadline) hintDeadline = Date.now() + 5000;

  const updateCountdown = () => {
    const seconds = Math.max(0, Math.ceil((hintDeadline - Date.now()) / 1000));
    if (elements.hintCountdown) {
      elements.hintCountdown.textContent = seconds
        ? t(`Closes in ${seconds}s`, `${seconds}秒後に閉じます`)
        : t("Closing…", "閉じています…");
    }
  };
  updateCountdown();
  hintCountdownInterval = setInterval(updateCountdown, 250);
  hintCloseTimeout = setTimeout(() => {
    clearHintTimer();
    elements.hintBox.open = false;
  }, Math.max(0, hintDeadline - Date.now()));
};

const formatDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const answerExists = (question, answer = state.answers[question.id]) => {
  return answerValueExists(question, answer);
};

const answerReadyForCheck = (question, answer = state.answers[question.id]) => (
  isAnswerGradeable(question, answer)
);

const safeProgress = (value, fallback) => (
  value && typeof value === "object" && !Array.isArray(value) ? value : fallback
);

const beginNewRun = () => {
  state.runAttemptId = uuid();
  state.runStartedAt = new Date().toISOString();
  state.runChecked = new Set();
  state.runResults = {};
  state.runFirstResults = {};
  state.runAnswerCounts = {};
  state.questionOrder = shuffleArray(state.questionOrder);
  state.choiceOrders = {};
  state.hasPersistedRunState = true;
};

const restoreProgress = () => {
  if (isTeacherPreview) return;
  const saved = getLessonProgress(lessonId);
  if (!saved) return;
  state.startedAt = saved.startedAt || state.startedAt;
  const hasPersistedRunState = Boolean(
    saved.runAttemptId
    || Array.isArray(saved.runChecked)
    || Object.prototype.hasOwnProperty.call(saved, "requireRunChecks"),
  );
  if (hasPersistedRunState) {
    state.runAttemptId = saved.runAttemptId || state.runAttemptId;
    state.runStartedAt = saved.runStartedAt || state.runStartedAt;
  }
  state.questionOrder = Array.isArray(saved.questionOrder) ? saved.questionOrder.map(String) : [];
  state.answers = safeProgress(saved.answers, {});
  state.official = safeProgress(saved.official, {});
  state.retryAttempts = safeProgress(saved.retryAttempts, {});
  state.choiceOrders = safeProgress(saved.choiceOrders, {});
  state.runChecked = new Set(
    Array.isArray(saved.runChecked) ? saved.runChecked.map(String) : [],
  );
  state.runResults = safeProgress(saved.runResults, {});
  state.runFirstResults = safeProgress(saved.runFirstResults, {});
  state.runAnswerCounts = safeProgress(saved.runAnswerCounts, {});
  state.requireRunChecks = saved.requireRunChecks === true;
  state.hasPersistedRunState = hasPersistedRunState;
  state.savedRuns = safeProgress(saved.savedRuns, {});
  state.practiceMode = ["quick", "all", "original", "extra", "wrong", "unanswered"].includes(saved.practiceMode)
    ? saved.practiceMode
    : "all";
  state.quickQuestionIds = Array.isArray(saved.quickQuestionIds)
    ? [...new Set(saved.quickQuestionIds.map(String))]
    : [];
  state.questionTypeFilter = typeof saved.questionTypeFilter === "string"
    ? saved.questionTypeFilter
    : "all";
};

const officialTotals = (questions = state.masterQuestions) => (
  calculateOfficialTotals(questions, state.official)
);

const saveLocalState = () => {
  if (!state.lesson || isTeacherPreview || authScopeLocked) return;
  const totals = officialTotals();
  const answeredCount = state.masterQuestions.reduce(
    (count, question) => count + (answerExists(question) ? 1 : 0),
    0,
  );
  saveLessonProgress(state.lesson.id, {
    startedAt: state.startedAt,
    runAttemptId: state.runAttemptId,
    runStartedAt: state.runStartedAt,
    practiceMode: state.practiceMode,
    quickQuestionIds: state.quickQuestionIds,
    questionTypeFilter: state.questionTypeFilter,
    questionOrder: state.questionOrder,
    answers: state.answers,
    official: state.official,
    retryAttempts: state.retryAttempts,
    choiceOrders: state.choiceOrders,
    runChecked: [...state.runChecked],
    runResults: state.runResults,
    runFirstResults: state.runFirstResults,
    runAnswerCounts: state.runAnswerCounts,
    requireRunChecks: state.requireRunChecks,
    savedRuns: state.savedRuns,
    lastQuestionId: state.visibleQuestions[state.currentIndex]?.id || null,
    firstScore: totals.score,
    maxScore: totals.max,
    answeredCount,
    checkedCount: totals.checked,
    wrongCount: totals.wrong,
    questionCount: state.masterQuestions.length,
    totalQuestions: state.masterQuestions.length,
    wrongQuestionIds: state.masterQuestions
      .filter((question) => {
        const result = state.official[question.id];
        return result && Number(result.score) < Number(question.maxPoints || 1);
      })
      .map((question) => question.id),
    completionPercent: state.masterQuestions.length
      ? Math.round((totals.checked / state.masterQuestions.length) * 100)
      : 0,
    completed: totals.checked === state.masterQuestions.length,
  });
};

const persistSettings = (patch) => {
  if (authScopeLocked) return;
  state.settings = updateSettings(patch);
  if (activeStudentUserId) {
    saveUserSettings(state.settings, { expectedUserId: activeStudentUserId }).catch(() => {});
  }
  renderSettings();
};

const loadScopedSettings = async () => {
  for (let pass = 0; pass < 2; pass += 1) {
    const session = await getStudentSession();
    const userId = session?.user?.id ? String(session.user.id) : null;
    activeStudentUserId = userId;
    setStorageUser(userId);
    if (!userId) {
      state.settings = getSettings();
      return;
    }

    const remote = await loadUserSettings(userId);
    const latestSession = await getStudentSession();
    const latestUserId = latestSession?.user?.id ? String(latestSession.user.id) : null;
    if (latestUserId !== userId) continue;
    if (remote.loaded && remote.settings) {
      updateSettings(remote.settings);
    } else if (remote.reason === "not-found") {
      await saveUserSettings(getSettings(), { expectedUserId: userId });
    }
    const confirmedSession = await getStudentSession();
    const confirmedUserId = confirmedSession?.user?.id ? String(confirmedSession.user.id) : null;
    if (confirmedUserId !== userId) continue;
    state.settings = getSettings();
    return;
  }

  const finalSession = await getStudentSession();
  activeStudentUserId = finalSession?.user?.id ? String(finalSession.user.id) : null;
  setStorageUser(activeStudentUserId);
  state.settings = getSettings();
};

const renderSettings = () => {
  const language = languageModeFromSettings(state.settings);
  applyLanguageMode(language);
  applyThemePreference(state.settings.theme);
  const practiceScope = elements.lessonSettingsDialog?.dataset.settingsScope === "practice";
  if (elements.lessonSettingsHeading) {
    elements.lessonSettingsHeading.textContent = practiceScope
      ? uiText("Practice settings", "問題設定", language)
      : uiText("All lesson settings", "すべてのレッスン設定", language);
  }
  if (elements.settingsIntro) {
    elements.settingsIntro.textContent = practiceScope
      ? uiText(
        "Only the controls you may need while answering are shown here. All sound, music, display and theme controls remain in the top Settings panel.",
        "解答中によく使う項目だけを表示しています。効果音・学習BGM・表示言語・テーマなどは、画面上部の「設定」で変更できます。",
        language,
      )
      : uiText(
        "These preferences apply to every lesson and stay with your signed-in account.",
        "この設定はすべてのレッスンに適用され、ログイン中のアカウントに保存されます。",
        language,
      );
  }
  elements.languageToggle.value = language;
  if (elements.themeToggle) elements.themeToggle.value = state.settings.theme || "light";
  elements.voiceToggle.textContent = state.settings.voiceEnabled
    ? uiText("Voice On", "ボイス オン", language)
    : uiText("Voice Off", "ボイス オフ", language);
  elements.voiceToggle.setAttribute("aria-pressed", String(state.settings.voiceEnabled));
  elements.sfxToggle.textContent = state.settings.sfxEnabled
    ? uiText("SFX On", "効果音 オン", language)
    : uiText("SFX Off", "効果音 オフ", language);
  elements.sfxToggle.setAttribute("aria-pressed", String(state.settings.sfxEnabled));
  elements.ambientToggle.textContent = state.settings.ambientEnabled
    ? uiText("Ambient On", "環境音 オン", language)
    : uiText("Ambient Off", "環境音 オフ", language);
  elements.ambientToggle.setAttribute("aria-pressed", String(state.settings.ambientEnabled));
  elements.voiceSelect.value = state.settings.voice;
  elements.playbackRate.value = String(state.settings.playbackRate || 1);
  elements.voiceVolume.value = String(Math.round((state.settings.voiceVolume ?? 1) * 100));
  elements.sfxVolume.value = String(Math.round((state.settings.sfxVolume ?? 0.34) * 100));
  elements.ambientTrack.value = state.settings.ambientTrack || "calm_focus";
  elements.ambientVolume.value = String(Math.round((state.settings.ambientVolume ?? 0.18) * 100));
  if (elements.autoPronounceChoices) {
    elements.autoPronounceChoices.checked = state.settings.autoPronounceChoices !== false;
  }
  if (elements.showChoiceTranslations) {
    elements.showChoiceTranslations.checked = state.settings.showChoiceTranslations;
  }
  elements.checkModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.check === state.settings.checkMode);
  });
  elements.hintModeButtons.forEach((button) => {
    const active = button.dataset.hintMode === state.settings.hintMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (elements.practiceSettingsSummary) {
    elements.practiceSettingsSummary.textContent = [
      state.settings.voice === "gb" ? "UK" : "US",
      state.settings.checkMode === "instant" ? uiText("Instant", "すぐ採点", language) : uiText("Manual", "手動採点", language),
      state.settings.hintMode === "manual" ? uiText("Hints open", "ヒント固定", language) : uiText("Hints auto-close", "ヒント自動閉じ", language),
    ].join(" · ");
  }
  updateCheckAnsweredButton();
};

const questionTypeLabel = (format) => {
  const labels = {
    mcq: ["Choose", "選択問題"],
    situation: ["Real-life choice", "場面別問題"],
    dialogue: ["Conversation", "会話"],
    truefalse: ["True or False", "正誤問題"],
    typing: ["Type it", "入力問題"],
    translation: ["Translation", "英作文"],
    listenType: ["Dictation", "ディクテーション"],
    listenChoice: ["Listening", "リスニング"],
    speaking: ["Speaking", "スピーキング"],
    mistake: ["Mistake detective", "間違い探し"],
    order: ["Sentence builder", "語順問題"],
    matching: ["Matching", "組み合わせ"],
    sorting: ["Sorting", "分類"],
    grid: ["Position", "位置"],
  };
  const [english, japanese] = labels[format] || ["Question", "問題"];
  return t(english, japanese);
};

const orderFor = (key, values, alwaysShuffle = false) => {
  const ids = values.map(String);
  const saved = state.choiceOrders[key];
  const valid = Array.isArray(saved)
    && saved.length === ids.length
    && ids.every((id) => saved.includes(id));
  if (valid) return saved;
  const next = alwaysShuffle || state.settings.shuffleChoices ? shuffleArray(ids) : ids;
  state.choiceOrders[key] = next;
  saveLocalState();
  return next;
};

const choiceOrder = (question) => {
  const ids = question.choices.map((choice) => choice.id);
  const order = orderFor(`${question.id}:choices`, ids, true);
  return order.map((id) => question.choices.find((choice) => choice.id === id)).filter(Boolean);
};

const selectQuestionSet = (mode, { questionType = state.questionTypeFilter } = {}) => {
  const byOrder = state.questionOrder
    .map((id) => state.masterQuestions.find((question) => question.id === id))
    .filter(Boolean);
  let selected = byOrder;
  if (mode === "quick") {
    const quickIds = new Set(state.quickQuestionIds);
    selected = byOrder.filter((question) => quickIds.has(String(question.id)));
  }
  if (mode === "original") selected = byOrder.filter((question) => question.isOriginal);
  if (mode === "extra") selected = byOrder.filter((question) => !question.isOriginal);
  if (mode === "wrong") {
    selected = byOrder.filter((question) => {
      const result = state.official[question.id];
      return result && Number(result.score) < Number(question.maxPoints || 1);
    });
  }
  if (mode === "unanswered") selected = byOrder.filter((question) => !state.official[question.id]);
  if (questionType !== "all") {
    selected = selected.filter((question) => String(question.format || question.type || "unknown") === questionType);
  }
  return selected;
};

const updateQuestionTypeOptions = () => {
  if (!elements.questionTypeFilter) return;
  const counts = state.masterQuestions.reduce((result, question) => {
    const format = String(question.format || question.type || "unknown");
    result.set(format, (result.get(format) || 0) + 1);
    return result;
  }, new Map());
  const validTypes = new Set(counts.keys());
  if (state.questionTypeFilter !== "all" && !validTypes.has(state.questionTypeFilter)) {
    state.questionTypeFilter = "all";
  }
  elements.questionTypeFilter.replaceChildren();
  const all = document.createElement("option");
  all.value = "all";
  all.textContent = t(`All types (${state.masterQuestions.length})`, `全タイプ (${state.masterQuestions.length})`);
  elements.questionTypeFilter.append(all);
  [...counts.entries()]
    .sort(([left], [right]) => questionTypeLabel(left).localeCompare(questionTypeLabel(right)))
    .forEach(([format, count]) => {
      const option = document.createElement("option");
      option.value = format;
      option.textContent = `${questionTypeLabel(format)} (${count})`;
      elements.questionTypeFilter.append(option);
    });
  elements.questionTypeFilter.value = state.questionTypeFilter;
};

const updatePracticeModeLabels = () => {
  const allCount = selectQuestionSet("all").length;
  const quick = selectQuestionSet("quick").length;
  const originals = selectQuestionSet("original").length;
  const extras = selectQuestionSet("extra").length;
  const wrong = selectQuestionSet("wrong").length;
  const unanswered = selectQuestionSet("unanswered").length;
  const labels = {
    quick: t(`Quick Practice (${quick})`, `ショート練習 (${quick}問)`),
    all: t(`All questions (${allCount})`, `全問題 (${allCount})`),
    original: t(`Original Review (${originals})`, `元の復習 (${originals})`),
    extra: t(`Listen & Speak (${extras})`, `聞く・話す (${extras})`),
    wrong: t(`Mistakes only (${wrong})`, `間違いだけ (${wrong})`),
    unanswered: t(`Unanswered only (${unanswered})`, `未回答だけ (${unanswered})`),
  };
  [...elements.practiceMode.options].forEach((option) => {
    option.textContent = labels[option.value] || option.textContent;
  });
  if (elements.practiceEntryNote) {
    const focusedCount = selectQuestionSet(state.practiceMode).length;
    elements.practiceEntryNote.textContent = state.practiceMode === "quick"
      ? t(`QUICK PRACTICE · ${quick} QUESTIONS · ABOUT 5–10 MIN`, `ショート練習・${quick}問・約5〜10分`)
      : state.practiceMode === "all"
        ? t(`FULL LESSON · ${allCount} QUESTIONS`, `フルレッスン・全${allCount}問`)
        : t(`FOCUSED PRACTICE · ${focusedCount} QUESTIONS`, `集中練習・${focusedCount}問`);
    elements.practiceEntryNote.classList.toggle("quick", state.practiceMode === "quick");
  }
};

const setPracticeMode = (mode, { clearCurrentAnswers = false, force = false } = {}) => {
  if (mode === "quick" && !state.quickQuestionIds.length) {
    state.quickQuestionIds = selectQuickPracticeIds(state.masterQuestions, state.questionOrder);
  }
  const availableQuestions = selectQuestionSet(mode);
  if (!availableQuestions.length && !force) {
    showToast(mode === "wrong" ? "No mistakes to practise yet." : "There are no questions in this set yet.");
    elements.practiceMode.value = state.practiceMode;
    return;
  }
  if (clearCurrentAnswers) {
    availableQuestions.forEach((question) => {
      delete state.answers[question.id];
      delete state.feedback[question.id];
    });
  }
  beginNewRun();
  if (mode === "quick") {
    state.quickQuestionIds = selectQuickPracticeIds(state.masterQuestions, state.questionOrder);
  }
  const nextQuestions = selectQuestionSet(mode);
  state.practiceMode = mode;
  state.visibleQuestions = nextQuestions;
  state.currentIndex = 0;
  state.requireRunChecks = clearCurrentAnswers || mode === "wrong";
  elements.practiceMode.value = mode;
  elements.resultPanel.hidden = true;
  saveLocalState();
  renderAll();
};

const setQuestionTypeFilter = (questionType) => {
  const availableTypes = new Set(
    state.masterQuestions.map((question) => String(question.format || question.type || "unknown")),
  );
  const nextType = questionType === "all" || availableTypes.has(questionType)
    ? questionType
    : "all";
  state.questionTypeFilter = nextType;
  if (!selectQuestionSet(state.practiceMode).length) {
    state.practiceMode = "all";
    elements.practiceMode.value = "all";
    showToast(t("Practice set changed to All questions for this type.", "この問題タイプを表示するため、練習セットを全問題に変更しました。"));
  }
  beginNewRun();
  state.visibleQuestions = selectQuestionSet(state.practiceMode);
  state.currentIndex = 0;
  elements.resultPanel.hidden = true;
  saveLocalState();
  renderAll();
};

const answersEqual = (left, right) => {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return left === right;
  }
};

const setAnswer = (question, answer, { render = false } = {}) => {
  const previousRunResult = state.runResults[question.id];
  if (
    state.requireRunChecks
    && state.runChecked.has(question.id)
    && previousRunResult
    && !answersEqual(previousRunResult.answer, answer)
  ) {
    state.runChecked.delete(question.id);
    delete state.runResults[question.id];
    elements.resultPanel.hidden = true;
  }
  state.answers[question.id] = answer;
  delete state.feedback[question.id];
  if (state.official[question.id]) {
    state.retryEditing.add(question.id);
    elements.resultPanel.hidden = true;
  }
  saveLocalState();
  renderNavigation();
  if (render) renderQuestion();
};

const correctAnswerLabel = (question) => {
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(question.format)) {
    return question.choices.find((choice) => String(choice.id) === String(question.correct))?.en || "";
  }
  if (question.format === "truefalse") return question.correct ? "True" : "False";
  if (["typing", "translation", "listenType", "mistake"].includes(question.format)) {
    return question.accepted[0] || "";
  }
  if (question.format === "order") return question.correctWords.join(" ");
  if (question.format === "grid") return String(question.correctCell || "");
  return "";
};

const gradeQuestion = (question, answer = state.answers[question.id]) => (
  gradeQuestionAnswer(question, answer)
);

const checkQuestion = (question, { quiet = false, deferCoachingVoice = false } = {}) => {
  if (!answerReadyForCheck(question)) {
    if (!quiet) {
      showToast(answerExists(question)
        ? t("Complete every part before checking.", "すべての項目に答えてから採点してください。")
        : t("Answer this question first.", "先にこの問題に答えてください。"));
    }
    return null;
  }
  const previousRunResult = state.runResults[question.id];
  if (
    state.runChecked.has(question.id)
    && previousRunResult
    && answersEqual(previousRunResult.answer, state.answers[question.id])
  ) {
    if (!quiet) showToast("This answer is already checked.");
    maybeCompleteRun();
    return { ...previousRunResult, skipped: true };
  }
  const result = gradeQuestion(question);
  if (!result) return null;
  const firstAttempt = preserveFirstResult(
    state.official,
    state.retryAttempts,
    question.id,
    result,
  );
  const coaching = question.format === "speaking" ? null : nextAnswerCoaching(result.correct);
  const feedbackResult = { ...result, isRetry: !firstAttempt, coaching };
  state.feedback[question.id] = feedbackResult;
  state.retryEditing.delete(question.id);
  if (!state.runFirstResults[question.id]) state.runFirstResults[question.id] = result;
  state.runAnswerCounts[question.id] = Number(state.runAnswerCounts[question.id] || 0) + 1;
  state.runChecked.add(question.id);
  state.runResults[question.id] = feedbackResult;
  saveLocalState();
  updatePracticeModeLabels();
  renderScore();
  renderNavigation();
  if (state.visibleQuestions[state.currentIndex]?.id === question.id) renderFeedback(question);
  if (!quiet) provideAnswerFeedback(feedbackResult, { speakCoach: !deferCoachingVoice });
  maybeCompleteRun();
  return feedbackResult;
};

const feedbackMessage = (question, result) => {
  if (question.format === "matching") {
    return result.correct
      ? t(`All ${result.max} pairs are correct.`, `${result.max}組すべて正解です。`)
      : t(`${result.score} of ${result.max} pairs are correct. Check the remaining pairs.`, `${result.max}組中${result.score}組が正解です。残りを確認しましょう。`);
  }
  if (question.format === "sorting") {
    return result.correct
      ? t(`All ${result.max} items are in the correct group.`, `${result.max}項目すべて正しいグループです。`)
      : t(`${result.score} of ${result.max} items are in the correct group.`, `${result.max}項目中${result.score}項目が正しいグループです。`);
  }
  if (question.format === "speaking") {
    const answer = result?.answer || state.answers[question.id];
    if (answer?.messageEn || answer?.messageJa) {
      return t(answer?.messageEn || "", answer?.messageJa || "");
    }
    return result.correct
      ? t("Speaking practice complete.", "スピーキング練習を完了しました。")
      : t("Listen once more and try the sentence again.", "もう一度聞いて、文を言ってみましょう。");
  }
  return result.correct
    ? t("Correct — well done.", "正解です。よくできました。")
    : t("Not quite. Review the answer and try again.", "もう少しです。答えを確認して、もう一度挑戦しましょう。");
};

const renderSpeechDiagnostic = (question, result) => {
  if (question.format !== "speaking") return "";
  const answer = result?.answer || state.answers[question.id] || {};
  if (!answer.transcript || answer.selfPractised) return "";
  const substitutions = Array.isArray(answer.substitutions) ? answer.substitutions : [];
  const missing = Array.isArray(answer.missing) ? answer.missing : [];
  const unexpected = Array.isArray(answer.unexpected) ? answer.unexpected : [];
  const detailRows = [
    substitutions.length ? `<li><b>${escapeHTML(t("Change", "言い換え"))}</b><span>${substitutions.map(({ heard, expected }) => `“${escapeHTML(heard)}” → “${escapeHTML(expected)}”`).join(", ")}</span></li>` : "",
    missing.length ? `<li><b>${escapeHTML(t("Missing", "不足"))}</b><span>${escapeHTML(missing.join(", "))}</span></li>` : "",
    unexpected.length ? `<li><b>${escapeHTML(t("Extra", "余分"))}</b><span>${escapeHTML(unexpected.join(", "))}</span></li>` : "",
  ].filter(Boolean).join("");
  return `
    <section class="speech-diagnostic" aria-label="${escapeHTML(t("Speaking feedback details", "スピーキングの詳しいフィードバック"))}">
      <div class="speech-diagnostic-compare"><span><small>${escapeHTML(t("I heard", "認識された文"))}</small><strong>${escapeHTML(answer.heardText || answer.transcript)}</strong></span><span><small>${escapeHTML(t("Target", "目標文"))}</small><strong>${escapeHTML(answer.targetText || question.speakText)}</strong></span></div>
      ${detailRows ? `<ul class="speech-diagnostic-details">${detailRows}</ul>` : ""}
      <div class="speech-diagnostic-next"><small>${escapeHTML(t("NEXT STEP", "次の練習"))}</small><strong>${escapeHTML(answer.practiceChunks || question.speakText)}</strong><span>${escapeHTML(t("Listen once, then repeat one chunk at a time.", "一度お手本を聞き、区切りごとに繰り返しましょう。"))}</span></div>
    </section>
  `;
};

const prepareQuestionRetry = (question) => {
  const keepEditableText = ["typing", "translation", "listenType", "mistake"].includes(
    question.format,
  );
  if (!keepEditableText) delete state.answers[question.id];
  state.retryEditing.add(question.id);
  delete state.feedback[question.id];
  elements.resultPanel.hidden = true;
  saveLocalState();
  renderQuestion();
  const focusTarget = keepEditableText
    ? elements.questionCard.querySelector("input, textarea")
    : elements.questionCard.querySelector("button, select, input, textarea");
  focusTarget?.focus();
  if (keepEditableText && typeof focusTarget?.select === "function") focusTarget.select();
};

const renderTextAudioButton = (text, label = "Listen", language = "en", secondaryText = "") => {
  const cleanText = String(text ?? "").trim();
  const cleanSecondaryText = String(secondaryText ?? "").trim();
  if (!cleanText) return "";
  const labelParts = String(label).split(" / ");
  const mainLabel = labelParts.shift() || "Listen";
  const subLabel = labelParts.join(" / ");
  return `
    <button
      class="text-audio-btn"
      data-audio-text="${escapeHTML(cleanText)}"
      data-audio-language="${escapeHTML(language)}"
      ${cleanSecondaryText ? `data-audio-secondary-text="${escapeHTML(cleanSecondaryText)}" data-audio-secondary-language="ja"` : ""}
      type="button"
      title="${escapeHTML(label)}"
    ><span class="audio-play-icon" aria-hidden="true">▶</span><span class="audio-button-copy"><b>${escapeHTML(mainLabel)}</b>${subLabel ? `<small lang="ja">${escapeHTML(subLabel)}</small>` : ""}</span></button>
  `;
};

const bilingualPromptAudio = (english, japanese) => {
  const originalEnglish = String(english || "").trim();
  const firstJapaneseCharacter = originalEnglish.search(/[\u3040-\u30ff\u3400-\u9fff]/u);
  const englishOnly = firstJapaneseCharacter >= 0
    ? originalEnglish.slice(0, firstJapaneseCharacter).replace(/[\s:："'“‘「『（(]+$/u, "").trim()
    : originalEnglish;
  return {
    en: englishOnly || originalEnglish,
    jp: String(japanese || (firstJapaneseCharacter >= 0 ? originalEnglish.slice(firstJapaneseCharacter) : ""))
      .replace(/^[「『“"'\s]+|[」』”"'\s]+$/gu, "")
      .trim(),
  };
};

const LESSON_KEY_POINTS = Object.freeze({
  "june-28": [
    ["Polite orders with I’d like and Could I have", "I’d like / Could I have を使った丁寧な注文"],
    ["Past questions: did + base verb", "過去の質問は did ＋ 動詞の原形"],
    ["Natural follow-up questions and reactions", "会話を続ける質問と自然なリアクション"],
  ],
  "june-29": [
    ["hear, hear about and hear of", "hear / hear about / hear of の違い"],
    ["Natural reactions such as Exactly and For real?", "Exactly / For real? などの自然な反応"],
    ["Clear position words: top-right and bottom-left", "右上・左下などの位置表現"],
  ],
  "june-30": [
    ["annoyed describes a feeling; annoying describes the cause", "annoyed は気持ち、annoying は原因"],
    ["Comparisons with easier than", "easier than を使った比較"],
    ["Preferences with prefer + reason", "prefer と理由を組み合わせる"],
  ],
  "july-04": [
    ["Actually adds the real or corrected information", "Actually で本当の情報を付け加える"],
    ["avoid + verb-ing", "avoid の後は動詞-ing"],
    ["Useful phrases for unexpected situations and gratitude", "急な事情・感謝に使える表現"],
  ],
  "july-05": [
    ["though as a natural sentence-ending contrast", "文末の though で自然な対比"],
    ["to go for takeaway orders", "持ち帰り注文の to go"],
    ["go-to for a favourite regular choice", "いつものお気に入りを表す go-to"],
  ],
  "july-06": [
    ["Choose tense and modal forms from context", "文脈から時制・助動詞を選ぶ"],
    ["Separate grammatical correctness from natural nuance", "文法的な正しさと自然なニュアンスを分ける"],
    ["Build longer answers in two clear steps", "長い答えを2段階で組み立てる"],
  ],
  "july-07": [
    ["bring vs buy", "bring（持ってくる）と buy（買う）の違い"],
    ["tell someone to + verb", "tell 人 to ＋ 動詞"],
    ["on my behalf for acting for another person", "代理を表す on my behalf"],
  ],
  "july-11": [
    ["be connected and live broadcast", "be connected と live broadcast"],
    ["notice vs realize", "notice（気づく）と realize（理解して気づく）"],
    ["Talk naturally about hometowns and live events", "出身地・生放送について自然に話す"],
  ],
  "july-12": [
    ["have–had–had and the past participle", "have–had–had と過去分詞"],
    ["any in questions and negative sentences", "疑問文・否定文の any"],
    ["yet for things not completed up to now", "今の時点で未完了を表す yet"],
  ],
  "july-13": [
    ["might vs will for different levels of certainty", "可能性の強さで might / will を選ぶ"],
    ["around this time for approximate timing", "おおよその時間を表す around this time"],
    ["go by and signal in everyday city talk", "街の会話で使う go by / signal"],
  ],
  "july-18": [
    ["be supposed to for rules and expectations", "ルール・期待を表す be supposed to"],
    ["Choose do/does and have/has by the subject", "主語に合わせて do/does・have/has を選ぶ"],
    ["on fire vs start a fire", "on fire と start a fire の違い"],
  ],
  "july-19": [
    ["both, either and neither for two choices", "2つの選択を表す both / either / neither"],
    ["would rather + base verb", "would rather ＋ 動詞の原形"],
    ["Natural reactions with hilarious and run into", "hilarious / run into の自然な使い方"],
  ],
  "july-22": [
    ["would be: a modal followed by the base form be", "would の後は原形 be"],
    ["both, either and neither", "both / either / neither の使い分け"],
    ["Yes and No answer the fact, even after a negative question", "否定疑問でも事実が肯定なら Yes、否定なら No"],
    ["Use That’s right or Actually to avoid ambiguity after right?", "right? には That’s right / Actually で明確に答える"],
  ],
  "july-23": [
    ["Present perfect: have + past participle", "現在完了は have ＋ 過去分詞"],
    ["under the weather means feeling unwell", "under the weather は体調が悪い"],
    ["too + adjective + to for something difficult or impossible", "too ＋ 形容詞 ＋ to の形"],
    ["Natural food, movement and Doraemon vocabulary", "食べ物・動き・ドラえもんの自然な英語"],
  ],
  "july-25": [
    ["get + adjective shows a change", "get ＋ 形容詞は状態の変化"],
    ["annoyed, frustrated and angry have different strengths", "annoyed / frustrated / angry の強さと原因"],
    ["nerves is a noun; nervous is an adjective", "nerves は名詞、nervous は形容詞"],
    ["gut feeling is a natural everyday word for intuition", "gut feeling は日常的な「直感」"],
  ],
  "july-26": [
    ["hope is for a possible future; wish contrasts with reality", "hope は可能な未来、wish は現実と違う願い"],
    ["wish + past for the present; wish + past perfect for past regret", "現在の願いは wish＋過去形、過去の後悔は wish＋過去完了"],
    ["Present perfect looks back from now", "現在完了は「今」から過去を見る"],
    ["Past perfect looks back from a past point", "過去完了は「過去の時点」からさらに前を見る"],
  ],
  "july-27": [
    ["spill is accidental; pour is intentional; splash has force", "spill はうっかり、pour は意図的、splash は勢いよく"],
    ["an acquired taste is something you learn to enjoy", "an acquired taste は慣れると好きになる味"],
    ["Past, present perfect and past perfect use different time viewpoints", "過去形・現在完了・過去完了は基準時点が違う"],
    ["haven’t … yet, didn’t and have never are not interchangeable", "haven’t … yet / didn’t / have never の違い"],
  ],
});

const renderLessonGuide = async () => {
  if (!state.lesson || !elements.lessonGuideContent) return;
  const language = languageModeFromSettings(state.settings);
  const deepGuide = DEEP_LESSON_GUIDES[state.lesson.id] || null;
  const themes = [...new Set((state.lesson.themes || [])
    .map((theme) => typeof theme === "string" ? theme : theme?.en)
    .filter(Boolean))];
  const keyPoints = LESSON_KEY_POINTS[state.lesson.id]
    || themes.map((theme) => [theme, ""])
    || [];
  let phrases = Array.isArray(state.lesson.phrases) ? state.lesson.phrases : [];
  if (!phrases.length) {
    try {
      phrases = (await buildPhraseCatalog()).filter((phrase) => phrase.lessonId === state.lesson.id);
    } catch {
      phrases = [];
    }
  }
  const cleanPhrases = phrases.map((phrase) => ({
    en: String(phrase.en || phrase.english || ""),
    jp: normalizeJapaneseMeaning(phrase.jp || phrase.ja || phrase.japanese || ""),
    note: String(phrase.note || ""),
  })).filter((phrase) => phrase.en && phrase.jp);
  const questionCorrections = state.masterQuestions
    .filter((question) => question.format === "mistake" && question.wrongSentence && question.accepted?.[0])
    .slice(0, 6);
  const corrections = [
    ...(deepGuide?.corrections || []).map(([wrongSentence, naturalSentence]) => ({ wrongSentence, accepted: [naturalSentence] })),
    ...questionCorrections,
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.wrongSentence === item.wrongSentence) === index).slice(0, 8);
  const examples = [...new Set(state.masterQuestions
    .flatMap((question) => [question.speakText, question.audioText])
    .filter(Boolean))].slice(0, 6);
  const coverageItems = buildPracticeMapTargets(state.masterQuestions);
  const bilingual = (en, jp) => {
    const text = learningText(en, jp, language);
    return `<strong>${escapeHTML(text.primary)}</strong>${text.secondary ? `<small lang="ja">${escapeHTML(text.secondary)}</small>` : ""}`;
  };
  const guideCard = (className, title, body, open = false) => `
    <details class="guide-card ${className}"${open ? " open" : ""}>
      <summary><h3>${escapeHTML(title)}</h3><span class="guide-card-toggle" aria-hidden="true">＋</span></summary>
      <div class="guide-card-body">${body}</div>
    </details>
  `;
  const keyPointBody = deepGuide?.points?.length ? `<div class="guide-concepts">${deepGuide.points.map(([titleEn, titleJa, detailEn, detailJa, exampleEn, exampleJa], index) => `
    <article class="guide-concept guide-tone-${(index % 4) + 1}">
      <p class="guide-concept-number">${String(index + 1).padStart(2, "0")}</p>
      <h4>${escapeHTML(titleEn)}${state.settings.showJapanese ? `<small lang="ja">${escapeHTML(titleJa)}</small>` : ""}</h4>
      <p>${escapeHTML(detailEn)}</p>
      ${state.settings.showJapanese ? `<p class="jp" lang="ja">${escapeHTML(detailJa)}</p>` : ""}
      <div class="guide-example"><strong>${escapeHTML(exampleEn)}</strong>${state.settings.showJapanese ? `<small lang="ja">${escapeHTML(exampleJa)}</small>` : ""}${renderTextAudioButton(exampleEn, uiText("Hear the example", "例文を聞く", language))}</div>
    </article>
  `).join("")}</div>` : `<ul>${keyPoints.slice(0, 8).map(([en, jp]) => `<li>${bilingual(en, jp)}</li>`).join("") || `<li>${escapeHTML(uiText("Useful conversation English", "会話で使える英語", language))}</li>`}</ul>`;
  const phraseBody = `<div class="guide-phrase-list">${cleanPhrases.map((phrase) => `
    <div>
      <span>${bilingual(phrase.en, phrase.jp)}</span>
      ${renderTextAudioButton(phrase.en, uiText("Listen", "英語を聞く", language))}
      ${state.settings.showJapanese && phrase.jp ? renderTextAudioButton(phrase.jp, uiText("Listen in Japanese", "日本語を聞く", language), "ja") : ""}
    </div>
  `).join("") || examples.map((example) => `<div><span><strong>${escapeHTML(example)}</strong></span>${renderTextAudioButton(example, uiText("Listen", "英語を聞く", language))}</div>`).join("")}</div>`;
  const correctionBody = corrections.map((question) => `<p><del>${escapeHTML(question.wrongSentence)}</del><span aria-hidden="true"> → </span><strong>${escapeHTML(question.accepted[0])}</strong></p>`).join("");
  const coverageBody = `<p class="guide-coverage-intro">${escapeHTML(uiText(
    `This map covers the model English used across all ${state.masterQuestions.length} questions in this lesson.`,
    `この一覧は、このレッスン全${state.masterQuestions.length}問で使うお手本英語を確認できます。`,
    language,
  ))}</p><div class="guide-coverage-list">${coverageItems.map((item, index) => `<div><b>${String(index + 1).padStart(2, "0")}</b><span>${bilingual(item.en, item.jp)}</span>${renderTextAudioButton(item.en, uiText("Listen", "英語を聞く", language))}</div>`).join("")}</div>`;
  const takeaway = uiText(
    deepGuide?.takeaway?.[0] || "Read one phrase aloud, listen once, then use it in your own sentence.",
    deepGuide?.takeaway?.[1] || "フレーズを声に出し、一度聞いてから、自分の文で使ってみましょう。",
    language,
  );
  elements.lessonGuideContent.innerHTML = `
    <div class="guide-snapshot">
      <p class="eyebrow">${escapeHTML(uiText("Today’s Lesson Snapshot", "今日のまとめ", language))}</p>
      <h2>${escapeHTML(state.lesson.title)}</h2>
      <p>${escapeHTML(state.lesson.summary || "Review the key English from this lesson.")}</p>
      ${state.settings.showJapanese && state.lesson.summaryJa ? `<p lang="ja">${escapeHTML(state.lesson.summaryJa)}</p>` : ""}
    </div>
    <div class="guide-grid">
      ${guideCard("guide-card-themes", uiText("Key points", "重要ポイント", language), keyPointBody, true)}
      ${guideCard("guide-card-phrases", uiText("English you can use", "すぐ使える英語", language), phraseBody)}
      ${corrections.length ? guideCard("guide-card-corrections", uiText("Natural corrections", "自然な言い直し", language), correctionBody) : ""}
      ${guideCard("guide-card-coverage", uiText(`Practice map · ${state.masterQuestions.length} questions`, `問題対応リスト · 全${state.masterQuestions.length}問`, language), coverageBody)}
      ${guideCard("guide-card-takeaway", uiText("Final takeaway", "最後に覚えること", language), `<p>${escapeHTML(takeaway)}</p>`)}
    </div>
  `;
  attachAudioHandlers(elements.lessonGuideContent);
};

const renderFeedback = (question) => {
  if (state.retryEditing.has(question.id)) {
    elements.feedbackCard.hidden = true;
    elements.feedbackCard.className = "feedback-card";
    elements.feedbackCard.textContent = "";
    return;
  }
  const result = state.feedback[question.id] || state.official[question.id];
  if (!result) {
    elements.feedbackCard.hidden = true;
    elements.feedbackCard.className = "feedback-card";
    elements.feedbackCard.textContent = "";
    return;
  }
  const explanationEn = textFor(question.explanation, "en");
  const explanationJa = textFor(question.explanation, "jp");
  const correctAnswer = correctAnswerLabel(question);
  const retryNote = result.isRetry
    ? `<p><strong>${escapeHTML(t("Retry:", "再挑戦："))}</strong> ${escapeHTML(t("Your first score is safely locked. This result is practice only.", "初回スコアは保存済みです。今回は練習として記録されます。"))}</p>`
    : `<p><strong>${escapeHTML(t("First answer recorded.", "初回答を記録しました。"))}</strong> ${escapeHTML(t("Future tries will not change this official score.", "この後の再挑戦で初回スコアは変わりません。"))}</p>`;
  const scoreText = result.max > 1 ? ` (${result.score} / ${result.max})` : "";
  const coachingText = result.coaching
    ? t(result.coaching.messageEn, result.coaching.messageJa)
    : "";
  elements.feedbackCard.className = `feedback-card ${result.correct ? "correct" : "wrong"}`;
  elements.feedbackCard.innerHTML = `
    ${coachingText ? `<p class="answer-coach"><span class="answer-coach-icon" aria-hidden="true"><span>${result.correct ? "✓" : "↻"}</span></span><strong>${escapeHTML(coachingText)}</strong></p>` : ""}
    <p><strong>${escapeHTML(feedbackMessage(question, result))}${escapeHTML(scoreText)}</strong></p>
    ${retryNote}
    ${renderSpeechDiagnostic(question, result)}
    ${!result.correct && correctAnswer ? `
      <div class="feedback-audio-row">
        <p><strong>${escapeHTML(t("Answer:", "答え："))}</strong> ${escapeHTML(correctAnswer)}</p>
        ${renderTextAudioButton(correctAnswer, t("Listen to the answer", "答えを聞く"))}
      </div>
    ` : ""}
    ${explanationEn ? `
      <div class="feedback-audio-row">
        <p>${escapeHTML(explanationEn)}</p>
        ${renderTextAudioButton(explanationEn, t("Listen to the explanation", "英語の解説を聞く"))}
      </div>
    ` : ""}
    ${state.settings.showJapanese && explanationJa ? `
      <div class="feedback-audio-row jp">
        <p>${escapeHTML(explanationJa)}</p>
        ${renderTextAudioButton(explanationJa, t("Listen in Japanese", "日本語の解説を聞く"), "ja")}
      </div>
    ` : ""}
    ${!result.correct ? `<button class="secondary-btn" data-retry-question="${escapeHTML(question.id)}" type="button">${escapeHTML(t("Try again", "もう一度挑戦"))}</button>` : ""}
  `;
  elements.feedbackCard.hidden = false;
  attachAudioHandlers(elements.feedbackCard);
  elements.feedbackCard.querySelector("[data-retry-question]")?.addEventListener("click", () => {
    prepareQuestionRetry(question);
  });
};

const renderAudioPractice = (text, kind = "listen") => `
  <div class="audio-practice">
    <button class="audio-btn" data-audio-text="${escapeHTML(text)}" data-audio-language="en" type="button">${kind === "speak" ? escapeHTML(t("Hear the model", "お手本を聞く")) : escapeHTML(t("Play audio", "音声を聞く"))}</button>
    <span class="audio-status" role="status">${state.settings.voice === "gb" ? "UK · Libby" : "US · Ava"}</span>
  </div>
`;

const renderChoiceQuestion = (question, selectedAnswer = state.answers[question.id]) => {
  const hasSelection = selectedAnswer !== undefined
    && selectedAnswer !== null
    && String(selectedAnswer) !== "";
  return `
    <div class="choice-list" role="radiogroup" aria-label="${escapeHTML(t("Answer choices", "回答の選択肢"))}">
      ${choiceOrder(question).map((choice, index) => `
        <div class="choice-audio-row">
          <button class="choice-option ${String(selectedAnswer) === String(choice.id) ? "selected" : ""}" data-choice="${escapeHTML(choice.id)}" type="button" role="radio" aria-checked="${String(String(selectedAnswer) === String(choice.id))}" tabindex="${String(selectedAnswer) === String(choice.id) || (!hasSelection && index === 0) ? "0" : "-1"}">
            <span class="letter">${String.fromCharCode(65 + index)}</span>
            <span>${escapeHTML(choice.en)}${state.settings.showJapanese && state.settings.showChoiceTranslations && choice.jp ? `<small>${escapeHTML(choice.jp)}</small>` : ""}</span>
          </button>
          ${renderTextAudioButton(choice.en, t(`Listen to choice ${String.fromCharCode(65 + index)}`, `選択肢${String.fromCharCode(65 + index)}を聞く`))}
        </div>
      `).join("")}
    </div>
  `;
};

const renderTextQuestion = (question) => {
  const answer = String(state.answers[question.id] || "");
  const wrongSentence = question.format === "mistake" && question.wrongSentence
    ? `
      <div class="context-box">
        <div class="context-audio-row">
          <span><strong>Original:</strong> ${escapeHTML(question.wrongSentence)}</span>
          ${renderTextAudioButton(question.wrongSentence, t("Listen to the original", "元の文を聞く"))}
        </div>
      </div>
    `
    : "";
  return `
    ${wrongSentence}
    <label>
      <span class="question-jp">${escapeHTML(t("Type your answer", "英語で答えを入力"))}</span>
      <input class="answer-input" id="typedAnswer" type="text" autocomplete="off" spellcheck="false" value="${escapeHTML(answer)}" placeholder="${escapeHTML(t("Type your English answer", "英語の答えを入力"))}">
    </label>
  `;
};

const renderOrderQuestion = (question) => {
  const answer = Array.isArray(state.answers[question.id]) ? state.answers[question.id].map(Number) : [];
  const used = new Set(answer);
  const completedSentence = answer.length === question.words.length
    ? answer.map((tokenIndex) => question.words[tokenIndex] || "").join(" ").trim()
    : "";
  return `
    <p class="question-jp">${escapeHTML(t("Build your sentence here:", "ここで英文を組み立てましょう："))}</p>
    <div class="built-sentence" aria-label="Your sentence">
      ${answer.map((tokenIndex, position) => `
        <button class="word-chip" data-remove-word="${position}" type="button">${escapeHTML(question.words[tokenIndex] || "")}</button>
      `).join("")}
    </div>
    ${completedSentence ? `
      <div class="completed-order-audio">
        ${renderTextAudioButton(completedSentence, t("Listen to your sentence", "作った文を聞く"))}
      </div>
    ` : ""}
    <p class="question-jp">${escapeHTML(t("Word bank:", "単語リスト："))}</p>
    <div class="word-bank">
      ${question.words.map((word, tokenIndex) => used.has(tokenIndex) ? "" : `
        <button class="word-chip" data-add-word="${tokenIndex}" type="button">${escapeHTML(word)}</button>
      `).join("")}
    </div>
  `;
};

const renderMatchingQuestion = (question) => {
  const answer = safeProgress(state.answers[question.id], {});
  const meanings = orderFor(`${question.id}:matching`, question.pairs.map((pair) => pair.jp), true);
  return `
    <div class="matching-grid">
      ${question.pairs.map((pair) => `
        <div class="matching-row">
          <div class="matching-term">
            <strong>${escapeHTML(pair.en)}</strong>
            ${renderTextAudioButton(pair.en, t("Listen", "聞く"))}
          </div>
          <select data-match-pair="${escapeHTML(pair.id)}" aria-label="Match for ${escapeHTML(pair.en)}">
            <option value="">${escapeHTML(t("Choose the Japanese meaning", "日本語の意味を選ぶ"))}</option>
            ${meanings.map((meaning) => `<option value="${escapeHTML(meaning)}" ${answer[pair.id] === meaning ? "selected" : ""}>${escapeHTML(meaning)}</option>`).join("")}
          </select>
        </div>
      `).join("")}
    </div>
  `;
};

const renderSortingQuestion = (question) => {
  const answer = safeProgress(state.answers[question.id], {});
  return `
    <div class="sorting-category-audio" aria-label="Listen to sorting group names">
      <span>${escapeHTML(t("Group names:", "グループ名："))}</span>
      ${question.categories.map((category) => renderTextAudioButton(category, t("Listen", "聞く"))).join("")}
    </div>
    <div class="sorting-board">
      ${question.sortingItems.map((item) => `
        <div class="sort-column">
          <div class="sort-item-heading">
            <h3>${escapeHTML(item.text)}</h3>
            ${renderTextAudioButton(item.text, t("Listen", "聞く"))}
          </div>
          <select data-sort-item="${escapeHTML(item.id)}" aria-label="Category for ${escapeHTML(item.text)}">
            <option value="">${escapeHTML(t("Choose a group", "グループを選ぶ"))}</option>
            ${question.categories.map((category) => `<option value="${escapeHTML(category)}" ${answer[item.id] === category ? "selected" : ""}>${escapeHTML(category)}</option>`).join("")}
          </select>
        </div>
      `).join("")}
    </div>
  `;
};

const renderGridQuestion = (question) => {
  const selected = state.answers[question.id];
  const cells = [
    "top-left", "top-center", "top-right",
    "middle-left", "center", "middle-right",
    "bottom-left", "bottom-center", "bottom-right",
  ];
  const labelFor = (cell) => gridCellDisplay(question, cell, state.settings.showJapanese);
  const hasLabels = cells.some((cell) => labelFor(cell).primary);
  return `
    <div class="position-grid${hasLabels ? " has-labels" : ""}" role="radiogroup" aria-label="${escapeHTML(t(hasLabels ? "Sentence grid" : "Position grid", hasLabels ? "英文グリッド" : "位置グリッド"))}">
      ${cells.map((cell, index) => {
        const label = labelFor(cell);
        const accessibleLabel = label.primary
          ? `${cell.replaceAll("-", " ")}: ${label.primary}${label.secondary ? ` / ${label.secondary}` : ""}`
          : cell.replaceAll("-", " ");
        return `
        <button class="${selected === cell ? "selected" : ""}${label.primary ? " has-label" : ""}" data-grid-cell="${cell}" type="button" role="radio" aria-checked="${String(selected === cell)}" aria-label="${escapeHTML(accessibleLabel)}" tabindex="${selected === cell || (!selected && index === 0) ? "0" : "-1"}">
          ${label.primary ? `<span class="grid-cell-label">${escapeHTML(label.primary)}</span>${label.secondary ? `<small lang="ja">${escapeHTML(label.secondary)}</small>` : ""}` : ""}
        </button>
      `;
      }).join("")}
    </div>
  `;
};

const renderSpeakingQuestion = (question) => {
  const answer = safeProgress(state.answers[question.id], {});
  const supported = speechRecognitionSupported();
  return `
    ${renderAudioPractice(question.speakText, "speak")}
    <div class="speaking-practice">
      <p class="speech-target">${escapeHTML(question.speakText)}</p>
      ${state.settings.showJapanese && question.speakJa ? `<p class="question-jp">${escapeHTML(question.speakJa)}</p>` : ""}
      <button class="mic-btn" id="speakButton" type="button" ${supported ? "" : "disabled"}>${supported ? escapeHTML(t("Start speaking", "話してみる")) : escapeHTML(t("Microphone unavailable", "マイクを利用できません"))}</button>
      <button class="word-chip" id="selfPracticeButton" type="button">${escapeHTML(t("I practised it", "声に出して練習しました"))}</button>
      <span class="speech-status" id="speechStatus" role="status">${supported ? escapeHTML(t("Listen first, then press the microphone.", "まずお手本を聞いてから、マイクを押してください。")) : escapeHTML(t("You can still listen and mark the sentence as practised.", "音声を聞き、練習済みとして記録できます。"))}</span>
      ${answer.transcript ? `<p class="speech-target">“${escapeHTML(answer.transcript)}”</p>` : ""}
    </div>
  `;
};

const renderQuestionBody = (question) => {
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(question.format)) return renderChoiceQuestion(question);
  if (question.format === "truefalse") {
    const withChoices = {
      ...question,
      choices: [
        { id: "true", en: "True", jp: "正しい" },
        { id: "false", en: "False", jp: "違う" },
      ],
    };
    const stored = state.answers[question.id];
    const renderedAnswer = stored === true ? "true" : stored === false ? "false" : "";
    return renderChoiceQuestion(withChoices, renderedAnswer);
  }
  if (["typing", "translation", "listenType", "mistake"].includes(question.format)) return renderTextQuestion(question);
  if (question.format === "order") return renderOrderQuestion(question);
  if (question.format === "matching") return renderMatchingQuestion(question);
  if (question.format === "sorting") return renderSortingQuestion(question);
  if (question.format === "grid") return renderGridQuestion(question);
  if (question.format === "speaking") return renderSpeakingQuestion(question);
  return "<p>This question format is not available yet.</p>";
};

const attachAudioHandlers = (root = elements.questionCard) => {
  root?.querySelectorAll("[data-audio-text]").forEach((button) => {
    if (button.dataset.audioBound === "true") return;
    button.dataset.audioBound = "true";
    const status = button.closest(".audio-practice")?.querySelector(".audio-status");
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.classList.add("loading");
      button.setAttribute("aria-busy", "true");
      const play = (text, language) => speakText(text, {
        voice: state.settings.voice,
        language,
        rate: state.settings.playbackRate,
        onStatus: ({ phase, messageEn, messageJa }) => {
          if (status) {
            status.textContent = state.settings.showJapanese && messageJa ? messageJa : messageEn;
          }
          button.classList.toggle("loading", phase === "loading");
        },
      });
      let result = await play(button.dataset.audioText, button.dataset.audioLanguage || "en");
      if (result?.played && button.dataset.audioSecondaryText) {
        result = await play(
          button.dataset.audioSecondaryText,
          button.dataset.audioSecondaryLanguage || "ja",
        );
      }
      if (["sound-off", "voice-off"].includes(result?.reason)) showToast(t("Voice is off. Turn it on to listen.", "音声がオフです。ヘッダーでオンにしてください。"));
      if (["unavailable", "natural-voice-unavailable", "browser-voice-unavailable", "voice-unavailable"].includes(result?.reason)) {
        showToast(t("Voice is temporarily unavailable on this device.", "この端末では音声を一時的に利用できません。"));
      }
      button.disabled = false;
      button.classList.remove("loading");
      button.removeAttribute("aria-busy");
    });
  });
};

const maybeInstantCheck = (question, complete, options = {}) => {
  if (state.settings.checkMode === "instant" && complete) return checkQuestion(question, options);
  return null;
};

const recordSpeakingActivity = (question, result, recognitionAvailable) => {
  if (isTeacherPreview || result?.band === "cancelled") return;
  saveSpeakingActivity({
    lessonId: state.lesson?.id,
    questionId: question.id,
    targetText: question.speakText,
    transcript: result?.transcript || "",
    feedbackBand: result?.band,
    recognitionAvailable,
  }).catch(() => {});
};

const bindRovingRadioGroup = ({ groupSelector, radioSelector, dataKey, columns = 1 }) => {
  const group = elements.questionCard.querySelector(groupSelector);
  if (!group) return;
  group.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const radios = [...group.querySelectorAll(radioSelector)];
    const current = event.target.closest(radioSelector);
    const currentIndex = radios.indexOf(current);
    if (currentIndex < 0 || !radios.length) return;
    event.preventDefault();
    event.stopPropagation();
    let nextIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = radios.length - 1;
    else {
      const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
      const distance = ["ArrowUp", "ArrowDown"].includes(event.key) ? columns : 1;
      nextIndex = (currentIndex + (direction * distance) + radios.length) % radios.length;
    }
    const target = radios[nextIndex];
    const value = target.dataset[dataKey];
    target.click();
    queueMicrotask(() => {
      const nextGroup = elements.questionCard.querySelector(groupSelector);
      [...(nextGroup?.querySelectorAll(radioSelector) || [])]
        .find((radio) => radio.dataset[dataKey] === value)
        ?.focus();
    });
  });
};

const attachQuestionHandlers = (question) => {
  attachAudioHandlers();
  elements.questionCard.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = question.format === "truefalse"
        ? button.dataset.choice === "true"
        : button.dataset.choice;
      const pronunciation = question.format === "truefalse"
        ? (value ? "True" : "False")
        : question.choices?.find((choice) => String(choice.id) === String(value))?.en;
      setAnswer(question, value, { render: true });
      const result = maybeInstantCheck(question, true, { deferCoachingVoice: true });
      const speechItems = [];
      if (state.settings.autoPronounceChoices !== false && state.settings.sound && pronunciation) {
        speechItems.push({ text: pronunciation, language: "en" });
      }
      if (result?.coaching?.messageEn && !result.skipped) {
        speechItems.push({ text: result.coaching.messageEn, language: "en" });
      }
      queueFeedbackSpeech(speechItems);
    });
  });
  bindRovingRadioGroup({
    groupSelector: ".choice-list[role='radiogroup']",
    radioSelector: "[data-choice][role='radio']",
    dataKey: "choice",
  });
  const typedInput = $("#typedAnswer");
  if (typedInput) {
    typedInput.addEventListener("input", () => setAnswer(question, typedInput.value));
    typedInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkQuestion(question);
      }
    });
    typedInput.addEventListener("change", () => maybeInstantCheck(question, Boolean(typedInput.value.trim())));
  }
  elements.questionCard.querySelectorAll("[data-add-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = Array.isArray(state.answers[question.id]) ? [...state.answers[question.id]] : [];
      answer.push(Number(button.dataset.addWord));
      setAnswer(question, answer, { render: true });
      maybeInstantCheck(question, answer.length === question.words.length);
    });
  });
  elements.questionCard.querySelectorAll("[data-remove-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = Array.isArray(state.answers[question.id]) ? [...state.answers[question.id]] : [];
      answer.splice(Number(button.dataset.removeWord), 1);
      setAnswer(question, answer, { render: true });
    });
  });
  elements.questionCard.querySelectorAll("[data-match-pair]").forEach((select) => {
    select.addEventListener("change", () => {
      const answer = { ...safeProgress(state.answers[question.id], {}) };
      answer[select.dataset.matchPair] = select.value;
      setAnswer(question, answer);
      maybeInstantCheck(question, question.pairs.every((pair) => answer[pair.id]));
    });
  });
  elements.questionCard.querySelectorAll("[data-sort-item]").forEach((select) => {
    select.addEventListener("change", () => {
      const answer = { ...safeProgress(state.answers[question.id], {}) };
      answer[select.dataset.sortItem] = select.value;
      setAnswer(question, answer);
      maybeInstantCheck(question, question.sortingItems.every((item) => answer[item.id]));
    });
  });
  elements.questionCard.querySelectorAll("[data-grid-cell]").forEach((button) => {
    button.addEventListener("click", () => {
      setAnswer(question, button.dataset.gridCell, { render: true });
      maybeInstantCheck(question, true);
    });
  });
  bindRovingRadioGroup({
    groupSelector: ".position-grid[role='radiogroup']",
    radioSelector: "[data-grid-cell][role='radio']",
    dataKey: "gridCell",
    columns: 3,
  });
  const speakingButton = $("#speakButton");
  if (speakingButton) {
    speakingButton.addEventListener("click", async () => {
      const recognitionAvailable = speechRecognitionSupported();
      speakingButton.disabled = true;
      speakingButton.classList.add("listening");
      const status = $("#speechStatus");
      const result = await startSpeechPractice(question.speakText, {
        voice: state.settings.voice,
        onStatus: ({ phase, messageEn, messageJa }) => {
          if (status) {
            const language = languageModeFromSettings(state.settings);
            status.textContent = language === "bilingual" && messageEn && messageJa
              ? `${messageEn}\n${messageJa}`
              : language === "ja" && messageJa ? messageJa : messageEn;
          }
          speakingButton.classList.toggle("listening", phase === "listening");
        },
      });
      speakingButton.disabled = false;
      speakingButton.classList.remove("listening");
      recordSpeakingActivity(question, result, recognitionAvailable);
      if (!["unavailable", "cancelled"].includes(result.band)) {
        setAnswer(question, result, { render: true });
        maybeInstantCheck(question, true);
      }
    });
  }
  const selfPracticeButton = $("#selfPracticeButton");
  if (selfPracticeButton) {
    selfPracticeButton.addEventListener("click", () => {
      const result = {
        transcript: "",
        band: "self-practice",
        matched: true,
        selfPractised: true,
        messageEn: "Speaking practice marked complete.",
        messageJa: "発話練習を完了しました。",
      };
      setAnswer(question, result, { render: true });
      recordSpeakingActivity(question, result, speechRecognitionSupported());
      maybeInstantCheck(question, true);
    });
  }
};

const renderQuestion = () => {
  stopAudio();
  stopSpeechPractice();
  const question = state.visibleQuestions[state.currentIndex];
  if (!question) {
    clearHintTimer();
    hintQuestionId = "";
    elements.hintBox.open = false;
    elements.questionType.textContent = t("No questions", "問題がありません");
    elements.questionCounter.textContent = "0 / 0";
    elements.questionCard.innerHTML = `<h2>${escapeHTML(t("No questions in this practice set.", "この練習セットには問題がありません。"))}</h2>`;
    elements.hintBox.hidden = true;
    elements.feedbackCard.hidden = true;
    return;
  }
  elements.questionType.textContent = questionTypeLabel(question.format);
  elements.questionCounter.textContent = `${state.currentIndex + 1} / ${state.visibleQuestions.length}`;
  const situationEn = textFor(question.situation, "en");
  const contextEn = textFor(question.context, "en");
  const contextJa = textFor(question.context, "jp");
  const promptEn = textFor(question.prompt, "en");
  const promptJa = textFor(question.prompt, "jp");
  const promptAudio = bilingualPromptAudio(promptEn, promptJa);
  const imageAlt = question.imageAlt || promptEn;
  const storyboardPanel = storyboardPanelLayout(question.imagePanel);
  const illustration = question.image
    ? storyboardPanel
      ? `<figure class="question-illustration is-storyboard">
          <div class="storyboard-panel-window" role="img" aria-label="${escapeHTML(imageAlt)}" style="--storyboard-x:${storyboardPanel.column * -100}%;--storyboard-y:${storyboardPanel.row * -100}%">
            <img src="${escapeHTML(question.image)}" alt="" aria-hidden="true" loading="eager">
          </div>
        </figure>`
      : `<figure class="question-illustration"><img src="${escapeHTML(question.image)}" alt="${escapeHTML(imageAlt)}" loading="eager"></figure>`
    : "";
  const audio = ["listenChoice", "listenType"].includes(question.format)
    ? renderAudioPractice(question.audioText)
    : "";
  const renderContextBox = (text, japanese, audioLabel) => text ? `
    <div class="context-box">
      <div class="context-audio-row">
        <span>${escapeHTML(text)}${state.settings.showJapanese && japanese ? `<br><small>${escapeHTML(japanese)}</small>` : ""}</span>
        ${renderTextAudioButton(text, audioLabel)}
        ${state.settings.showJapanese && japanese ? renderTextAudioButton(japanese, t("Listen in Japanese", "日本語を聞く"), "ja") : ""}
      </div>
    </div>
  ` : "";
  elements.questionCard.innerHTML = `
    ${illustration}
    ${renderContextBox(situationEn, "", t("Listen to the situation", "場面を聞く"))}
    ${renderContextBox(contextEn, contextJa, t("Listen to the context", "文脈を聞く"))}
    <div class="prompt-heading-row">
      <h2>${escapeHTML(promptEn)}</h2>
      ${renderTextAudioButton(
        promptAudio.en,
        state.settings.showJapanese
          ? t("Listen: English → Japanese", "英語→日本語で聞く")
          : t("Listen to the question", "質問文を聞く"),
        "en",
        state.settings.showJapanese ? promptAudio.jp : "",
      )}
    </div>
    ${state.settings.showJapanese && promptJa ? `
      <div class="prompt-ja-audio">
        <p class="question-jp">${escapeHTML(promptJa)}</p>
        ${renderTextAudioButton(promptJa, t("Listen in Japanese", "日本語を聞く"), "ja")}
      </div>
    ` : ""}
    ${audio}
    ${renderQuestionBody(question)}
  `;
  const hintEn = textFor(question.hint, "en");
  const hintJa = textFor(question.hint, "jp");
  const hasHint = Boolean(hintEn || hintJa);
  const questionChanged = hintQuestionId !== question.id;
  hintQuestionId = question.id;
  elements.hintBox.hidden = !hasHint;
  if (!hasHint) {
    elements.hintBox.open = false;
    clearHintTimer();
  }
  elements.hintContent.textContent = [
    hintEn,
    state.settings.showJapanese ? hintJa : "",
  ].filter(Boolean).join(" / ");
  if (hasHint && elements.hintBox.open) syncHintTimer({ restart: questionChanged });
  elements.previousQuestion.disabled = state.currentIndex === 0;
  elements.nextQuestion.disabled = state.currentIndex >= state.visibleQuestions.length - 1;
  attachQuestionHandlers(question);
  renderFeedback(question);
  renderNavigation();
};

const renderNavigation = () => {
  elements.questionNav.innerHTML = state.visibleQuestions.map((question, index) => {
    const official = state.official[question.id];
    const classes = [
      index === state.currentIndex ? "current" : "",
      official ? (Number(official.score) === Number(question.maxPoints || 1) ? "correct" : "wrong") : "",
      !official && answerExists(question) ? "answered" : "",
    ].filter(Boolean).join(" ");
    const status = official
      ? (official.correct ? "correct" : "needs review")
      : (answerReadyForCheck(question)
        ? "answered, not checked"
        : (answerExists(question) ? "partly answered" : "unanswered"));
    return `<button class="${classes}" data-question-index="${index}" type="button" ${index === state.currentIndex ? 'aria-current="step"' : ""} aria-label="Question ${index + 1}, ${status}">${index + 1}</button>`;
  }).join("");
  elements.questionNav.querySelectorAll("[data-question-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentIndex = Number(button.dataset.questionIndex);
      saveLocalState();
      renderQuestion();
    });
  });
  updateCheckAnsweredButton();
};

const pendingAnsweredQuestions = () => state.visibleQuestions.filter((question) => {
  if (!answerReadyForCheck(question)) return false;
  const previous = state.runResults[question.id];
  return !(
    state.runChecked.has(question.id)
    && previous
    && answersEqual(previous.answer, state.answers[question.id])
  );
});

const updateCheckAnsweredButton = () => {
  if (!elements.checkAnswered) return;
  const count = pendingAnsweredQuestions().length;
  elements.checkAnswered.textContent = t(
    `Check ${count} answered`,
    `回答済み ${count}問を採点`,
  );
  elements.checkAnswered.disabled = state.settings.checkMode === "instant" || count === 0;
  elements.checkAnswered.removeAttribute("aria-label");
};

const renderScore = () => {
  const totals = officialTotals();
  elements.scorePill.textContent = t(
    `First score ${totals.score} / ${totals.max}`,
    `初回スコア ${totals.score} / ${totals.max}`,
  );
};

const renderLockedQuestionTeasers = () => {
  const lockedQuestions = Array.isArray(state.lesson?.lockedQuestions)
    ? state.lesson.lockedQuestions
    : [];
  if (!lockedQuestions.length) {
    elements.lockedQuestionTeasers.hidden = true;
    elements.lockedQuestionTeasers.replaceChildren();
    return;
  }
  const cards = lockedQuestions.map((question) => {
    const requiredPlan = planFor(question.requiredPlan || "standard");
    const planEn = requiredPlan.name;
    const planJa = requiredPlan.nameJa;
    return `
      <article class="locked-question-teaser locked-${escapeHTML(requiredPlan.key)}">
        <span class="locked-question-plan">${escapeHTML(planEn)} · ${escapeHTML(planJa)}</span>
        <div class="locked-question-placeholder" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
        <h3>${escapeHTML(questionTypeLabel(question.format))}</h3>
        <p>${escapeHTML(t(
          `This ${planEn} practice is locked. Its question, choices, hint, explanation and answer stay private until your plan includes it.`,
          `この問題は${planJa}対象です。対象プランになるまで、問題文・選択肢・ヒント・説明・正解は表示・送信されません。`,
        ))}</p>
      </article>
    `;
  }).join("");
  elements.lockedQuestionTeasers.innerHTML = `
    <div class="locked-question-heading">
      <span>${escapeHTML(t("More practice available", "追加問題があります"))}</span>
      <h2>${escapeHTML(t(
        `${lockedQuestions.length} plan-locked question${lockedQuestions.length === 1 ? "" : "s"}`,
        `プラン限定問題 ${lockedQuestions.length}問`,
      ))}</h2>
      <p>${escapeHTML(t(
        "Only safe labels are shown here. Locked learning content is protected by the database.",
        "ここには安全な分類情報だけを表示しています。限定問題の内容はデータベース側で保護されています。",
      ))}</p>
    </div>
    <div class="locked-question-grid">${cards}</div>
    <a class="primary-btn" href="/plans" target="_blank" rel="noopener">${escapeHTML(t("Compare plans", "プランを見る"))}</a>
  `;
  elements.lockedQuestionTeasers.hidden = false;
};

const renderAll = () => {
  updateQuestionTypeOptions();
  updatePracticeModeLabels();
  renderSettings();
  renderScore();
  renderQuestion();
  renderLockedQuestionTeasers();
};

const runIsComplete = () => {
  if (!state.visibleQuestions.length) return false;
  if (state.visibleQuestions.some((question) => state.retryEditing.has(question.id))) return false;
  if (state.requireRunChecks) {
    return state.visibleQuestions.every((question) => state.runChecked.has(question.id));
  }
  return state.visibleQuestions.every((question) => Boolean(state.official[question.id]));
};

const saveCompletedRun = async () => {
  if (isTeacherPreview) return;
  const runKey = state.runAttemptId || uuid();
  if (state.savedRuns[runKey] || state.savingRuns.has(runKey)) return;
  state.savingRuns.add(runKey);
  const currentResults = Object.fromEntries(state.visibleQuestions.map((question) => [
    question.id,
    state.runResults[question.id] || state.official[question.id] || null,
  ]));
  const firstResults = Object.fromEntries(state.visibleQuestions.map((question) => [
    question.id,
    state.runFirstResults[question.id] || currentResults[question.id],
  ]));
  const answerCounts = Object.fromEntries(state.visibleQuestions.map((question) => [
    question.id,
    Math.max(1, Number(state.runAnswerCounts[question.id] || 1)),
  ]));
  const totals = state.visibleQuestions.reduce((result, question) => {
    const checked = currentResults[question.id];
    result.score += Number(checked?.score || 0);
    result.max += Number(question.maxPoints || 1);
    result.answered += checked ? 1 : 0;
    result.wrong += checked && Number(checked.score) < Number(question.maxPoints || 1) ? 1 : 0;
    return result;
  }, { score: 0, max: 0, answered: 0, wrong: 0 });
  const firstTotals = state.visibleQuestions.reduce((result, question) => {
    const checked = firstResults[question.id];
    result.score += Number(checked?.score || 0);
    result.wrong += checked && Number(checked.score) < Number(question.maxPoints || 1) ? 1 : 0;
    return result;
  }, { score: 0, wrong: 0 });
  const started = new Date(state.runStartedAt).getTime();
  try {
    const saveResult = await saveAttempt({
      clientAttemptId: runKey,
      lessonId: state.lesson.id,
      practiceMode: state.settings.checkMode,
      firstScore: firstTotals.score,
      maxScore: totals.max,
      answeredCount: totals.answered,
      questionCount: state.visibleQuestions.length,
      wrongCount: firstTotals.wrong,
      durationSeconds: Number.isFinite(started) ? Math.round((Date.now() - started) / 1000) : 0,
      answers: {
        practiceSet: state.practiceMode,
        results: currentResults,
        firstResults,
        officialResults: Object.fromEntries(state.visibleQuestions.map((question) => [
          question.id,
          state.official[question.id] || null,
        ])),
        answerCounts,
      },
      startedAt: state.runStartedAt,
      completedAt: new Date().toISOString(),
    });
    if (saveResult.saved) {
      state.savedRuns[runKey] = new Date().toISOString();
      saveLocalState();
    }
  } finally {
    state.savingRuns.delete(runKey);
  }
};

const maybeCompleteRun = () => {
  if (!runIsComplete()) {
    elements.resultPanel.hidden = true;
    return;
  }
  const results = state.visibleQuestions.map((question) => (
    state.runResults[question.id] || state.official[question.id]
  ));
  const score = results.reduce((sum, result) => sum + Number(result?.score || 0), 0);
  const max = state.visibleQuestions.reduce((sum, question) => sum + Number(question.maxPoints || 1), 0);
  elements.resultHeading.textContent = score === max
    ? t("Excellent work.", "全問正解です。すばらしいです。")
    : t("Good practice — keep going.", "よい練習でした。この調子で続けましょう。");
  elements.resultSummary.textContent = t(
    `This practice: ${score} / ${max}. Your first official answers stay safely recorded.`,
    `今回の練習：${score} / ${max}。初回答はそのまま安全に記録されています。`,
  );
  const firstCompletionReveal = elements.resultPanel.hidden;
  elements.resultPanel.hidden = false;
  if (firstCompletionReveal) void playCompletionSound();
  saveCompletedRun().catch(() => {});
};

const initialiseLesson = async () => {
  elements.hubBackLink.href = returnTo;
  try {
    let allowOfflinePreview = true;
    if (!isTeacherPreview) {
      const access = await loadStudentAccess({ refresh: true });
      applyStudentFeatureVisibility(access);
      const reviewLessonsAllowed = featureAllowed(access, "show_review_lessons");
      const homeworkAllowed = featureAllowed(access, "show_homework");
      const allowed = reviewLessonsAllowed || homeworkAllowed;
      // A signed-in learner whose general Review Lessons surface is hidden may
      // still open an assigned homework lesson through RLS, but must never fall
      // back to a bundled public preview after that RLS lookup is denied.
      allowOfflinePreview = !access.authenticated;
      if (access.authenticated && !allowed) {
        renderStudentAccessBoundary(document.querySelector("#quizMain"), access.settings.account_enabled === false ? {
          title: "Your Review Hub access is paused.",
          titleJa: "Review Hubの利用は一時停止中です。",
          detail: "No lessons are being shared with this account right now.",
          detailJa: "現在、このアカウントにはレッスンが公開されていません。",
        } : {
          title: "Lessons are not in your current learning plan.",
          titleJa: "現在の学習プランでは、レッスンは非表示です。",
          detail: "Your teacher can make review lessons or homework available when needed.",
          detailJa: "必要に応じて、先生が復習レッスンや宿題を公開できます。",
        });
        return;
      }
    }
    await loadScopedSettings();
    syncAmbientFromSettings();
    lessonScopeReady = true;
    const lesson = await getLessonById(lessonId, {
      preview: isTeacherPreview,
      allowOfflinePreview,
    });
    if (!lesson) throw new Error("This lesson could not be found.");
    state.lesson = lesson;
    state.masterQuestions = lesson.questions;
    await renderLessonGuide();
    elements.lessonDate.textContent = formatDate(lesson.lessonDate);
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonSummary.textContent = lesson.summary;
    elements.lessonSummaryJa.textContent = lesson.summaryJa;
    elements.lessonSummaryJa.hidden = !state.settings.showJapanese;
    if (lesson.locked) {
      const profileRequired = lesson.lockReason === "profile-required";
      const lockTitle = profileRequired
        ? t("Complete your learning profile", "学習プロフィールを完成してください")
        : t("Unlock this complete lesson", "この完全版レッスンを開放")
      const lockMessage = profileRequired
        ? t(
          "Finish the required profile fields once, then return to this lesson. Your verified sign-in email cannot be edited here.",
          "必須プロフィール項目を一度入力してから、このレッスンに戻ってください。確認済みのログインメールはここでは変更できません。",
        )
        : t(
          "Sign in and use an access code, or wait for the teacher to approve your membership period.",
          "ログイン後、アクセスコードを入力するか、先生による利用期間の承認をお待ちください。",
        );
      const lockAction = profileRequired
        ? t("Complete profile", "プロフィールを入力")
        : t("Open account", "アカウントを開く");
      elements.questionCard.innerHTML = `
        <div class="membership-lock-card">
          <span class="membership-lock-kicker">${escapeHTML(t("PLAN ACCESS", "プラン限定"))}</span>
          <h2>${escapeHTML(lockTitle)}</h2>
          <p>${escapeHTML(lockMessage)}</p>
          <a class="primary-btn" href="/#account">${escapeHTML(lockAction)}</a>
        </div>
      `;
      elements.questionNav.innerHTML = "";
      elements.checkQuestion.disabled = true;
      elements.checkAnswered.disabled = true;
      elements.previousQuestion.disabled = true;
      elements.nextQuestion.disabled = true;
      elements.practiceMode.disabled = true;
      elements.questionTypeFilter.disabled = true;
      elements.shuffleQuestions.disabled = true;
      elements.premiumTasksPanel.hidden = true;
      renderLockedQuestionTeasers();
      return;
    }
    if (!state.masterQuestions.length) throw new Error("This lesson does not have readable practice questions yet.");
    restoreProgress();
    const allIds = state.masterQuestions.map((question) => question.id);
    const allIdSet = new Set(allIds);
    state.runChecked = new Set([...state.runChecked].filter((id) => allIdSet.has(id)));
    state.runResults = Object.fromEntries(
      Object.entries(state.runResults).filter(([id]) => allIdSet.has(id)),
    );
    state.runFirstResults = Object.fromEntries(
      Object.entries(state.runFirstResults).filter(([id]) => allIdSet.has(id)),
    );
    state.runAnswerCounts = Object.fromEntries(
      Object.entries(state.runAnswerCounts).filter(([id]) => allIdSet.has(id)),
    );
    const resumableOrder = [
      ...state.questionOrder.filter((id) => allIds.includes(id)),
      ...allIds.filter((id) => !state.questionOrder.includes(id)),
    ];
    state.questionOrder = state.hasPersistedRunState
      ? resumableOrder
      : shuffleArray(allIds);
    if (!state.hasPersistedRunState) state.choiceOrders = {};
    state.quickQuestionIds = state.quickQuestionIds.filter((id) => allIdSet.has(id));
    if (requestedPractice) {
      beginNewRun();
      state.questionTypeFilter = "all";
      state.practiceMode = requestedPractice === "quick" ? "quick" : "all";
      state.quickQuestionIds = selectQuickPracticeIds(state.masterQuestions, state.questionOrder);
    } else if (!state.quickQuestionIds.length) {
      state.quickQuestionIds = selectQuickPracticeIds(state.masterQuestions, state.questionOrder);
    }
    elements.practiceMode.value = state.practiceMode;
    updateQuestionTypeOptions();
    const selected = selectQuestionSet(state.practiceMode);
    if (!selected.length) state.practiceMode = "all";
    state.visibleQuestions = selectQuestionSet(state.practiceMode);
    if (!state.hasPersistedRunState) state.requireRunChecks = state.practiceMode === "wrong";
    const savedLast = getLessonProgress(lessonId)?.lastQuestionId;
    const savedIndex = state.visibleQuestions.findIndex((question) => question.id === savedLast);
    state.currentIndex = savedIndex >= 0 ? savedIndex : 0;
    saveLocalState();
    renderAll();
    await renderPremiumLessonTasks({
      lesson: state.lesson,
      container: elements.premiumTasksPanel,
      showJapanese: state.settings.showJapanese,
      showMessage: showToast,
    });
    maybeCompleteRun();
  } catch (error) {
    elements.lessonTitle.textContent = "Lesson unavailable";
    elements.lessonSummary.textContent = error?.message || "Please return to the lesson library and try again.";
    elements.questionCard.innerHTML = `<h2>${escapeHTML(error?.message || "The lesson could not be loaded.")}</h2>`;
    elements.questionNav.innerHTML = "";
    elements.checkQuestion.disabled = true;
    elements.checkAnswered.disabled = true;
  }
};

onStudentAuthChange((session) => {
  if (!lessonScopeReady || authScopeLocked || isTeacherPreview) return;
  const nextUserId = session?.user?.id ? String(session.user.id) : null;
  if (nextUserId === activeStudentUserId) return;
  authScopeLocked = true;
  stopAudio();
  stopSpeechPractice();
  clearHintTimer();
  elements.hintBox.open = false;
  elements.hintBox.hidden = true;
  elements.feedbackCard.hidden = true;
  elements.questionCard.innerHTML = `
    <h2>Account changed</h2>
    <p>This lesson is reloading safely for the current account.</p>
  `;
  elements.checkQuestion.disabled = true;
  elements.checkAnswered.disabled = true;
  elements.previousQuestion.disabled = true;
  elements.nextQuestion.disabled = true;
  window.location.reload();
});

elements.languageToggle.addEventListener("change", () => {
  const languageMode = elements.languageToggle.value;
  persistSettings({ languageMode, showJapanese: languageMode !== "en" });
  elements.lessonSummaryJa.hidden = !state.settings.showJapanese;
  renderLessonGuide();
  renderQuestion();
});
elements.themeToggle?.addEventListener("change", () => {
  persistSettings({ theme: elements.themeToggle.value });
});
elements.voiceToggle.addEventListener("click", () => {
  const voiceEnabled = !state.settings.voiceEnabled;
  if (!voiceEnabled) stopAudio();
  persistSettings({ voiceEnabled });
});
elements.voiceVolume.addEventListener("change", () => persistSettings({ voiceVolume: Number(elements.voiceVolume.value) / 100 }));
elements.sfxToggle.addEventListener("click", () => persistSettings({ sfxEnabled: !state.settings.sfxEnabled }));
elements.sfxVolume.addEventListener("change", () => persistSettings({ sfxVolume: Number(elements.sfxVolume.value) / 100 }));
elements.ambientToggle.addEventListener("click", async () => {
  const ambientEnabled = !state.settings.ambientEnabled;
  persistSettings({ ambientEnabled });
  await setAmbientPlayback(ambientEnabled, { ...state.settings, ambientEnabled, userGesture: true });
});
elements.ambientTrack.addEventListener("change", async () => {
  persistSettings({ ambientTrack: elements.ambientTrack.value });
  if (state.settings.ambientEnabled) await setAmbientPlayback(true, { ...state.settings, userGesture: true });
});
elements.ambientVolume.addEventListener("input", async () => {
  persistSettings({ ambientVolume: Number(elements.ambientVolume.value) / 100 });
  if (state.settings.ambientEnabled) await setAmbientPlayback(true, { ...state.settings, userGesture: true });
});
elements.voiceSelect.addEventListener("change", () => {
  stopAudio();
  persistSettings({ voice: elements.voiceSelect.value });
  renderQuestion();
});
elements.playbackRate.addEventListener("change", () => {
  stopAudio();
  persistSettings({ playbackRate: Number(elements.playbackRate.value) });
});
elements.autoPronounceChoices?.addEventListener("change", () => {
  persistSettings({ autoPronounceChoices: elements.autoPronounceChoices.checked });
});
elements.checkModeButtons.forEach((button) => {
  button.addEventListener("click", () => persistSettings({ checkMode: button.dataset.check }));
});
elements.hintModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    persistSettings({ hintMode: button.dataset.hintMode });
    syncHintTimer({ restart: button.dataset.hintMode === "auto" });
  });
});
elements.hintBox.addEventListener("toggle", () => {
  if (elements.hintBox.open) syncHintTimer({ restart: true });
  else clearHintTimer();
});
elements.showChoiceTranslations?.addEventListener("change", () => {
  persistSettings({ showChoiceTranslations: elements.showChoiceTranslations.checked });
  renderQuestion();
});
elements.practiceMode.addEventListener("change", () => setPracticeMode(elements.practiceMode.value));
elements.questionTypeFilter?.addEventListener("change", () => {
  setQuestionTypeFilter(elements.questionTypeFilter.value);
});
const openSettings = (scope = "all") => {
  if (elements.lessonSettingsDialog) {
    elements.lessonSettingsDialog.dataset.settingsScope = scope === "practice" ? "practice" : "all";
  }
  renderSettings();
  if (typeof elements.lessonSettingsDialog?.showModal === "function") {
    elements.lessonSettingsDialog.showModal();
  } else {
    elements.lessonSettingsDialog?.setAttribute("open", "");
  }
};
elements.openLessonSettings?.addEventListener("click", () => {
  openSettings("all");
});
elements.openPracticeSettings?.addEventListener("click", () => {
  openSettings("practice");
});
elements.shuffleQuestions.addEventListener("click", () => {
  state.questionOrder = shuffleArray(state.questionOrder);
  state.choiceOrders = {};
  state.visibleQuestions = selectQuestionSet(state.practiceMode);
  state.currentIndex = 0;
  saveLocalState();
  renderAll();
  showToast("Question order shuffled.");
});
elements.checkQuestion.addEventListener("click", () => {
  const question = state.visibleQuestions[state.currentIndex];
  if (question) checkQuestion(question);
});
elements.checkAnswered.addEventListener("click", () => {
  let partial = 0;
  let checked = 0;
  const checkedResults = [];
  state.visibleQuestions.forEach((question) => {
    if (answerReadyForCheck(question)) {
      const result = checkQuestion(question, { quiet: true });
      if (result && !result.skipped) {
        checked += 1;
        checkedResults.push(result);
      }
    } else if (answerExists(question)) {
      partial += 1;
    }
  });
  if (!checked && partial) {
    showToast(t(
      "Complete every part of the unfinished answer before checking.",
      "未完成の回答は、すべての項目に答えてから採点してください。",
    ));
  } else if (!checked) {
    showToast(t(
      "All completed answers are already checked.",
      "回答済みの問題はすべて採点済みです。",
    ));
  }
  else {
    provideAnswerFeedback(checkedResults.every((result) => result.correct));
    renderQuestion();
    showToast(t(
      `Checked ${checked} answered question${checked === 1 ? "" : "s"}.`,
      `回答済みの${checked}問を採点しました。`,
    ));
  }
});
elements.previousQuestion.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    saveLocalState();
    renderQuestion();
  }
});
elements.nextQuestion.addEventListener("click", () => {
  if (state.currentIndex < state.visibleQuestions.length - 1) {
    state.currentIndex += 1;
    saveLocalState();
    renderQuestion();
  }
});
elements.retryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.retry;
    setPracticeMode(mode, { clearCurrentAnswers: true });
    window.scrollTo({ top: elements.questionNav.offsetTop - 90, behavior: "smooth" });
  });
});
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  if (![document.body, document.documentElement].includes(document.activeElement)) return;
  if (event.key === "ArrowLeft") elements.previousQuestion.click();
  if (event.key === "ArrowRight") elements.nextQuestion.click();
});

installPlayfulInteractions();
watchSystemTheme(() => applyThemePreference(state.settings.theme));
initialiseLesson();
