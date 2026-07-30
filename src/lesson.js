import { getLessonById } from "./data.js";
import {
  escapeHTML,
  getLessonProgress,
  getSettings,
  normalizeAnswerText,
  saveLessonProgress,
  setStorageUser,
  shuffleArray,
  updateSettings,
} from "./store.js";
import {
  playAnswerFeedback,
  speakText,
  speechRecognitionSupported,
  startSpeechPractice,
  stopAudio,
  stopSpeechPractice,
} from "./audio.js";
import {
  getStudentSession,
  loadUserSettings,
  onStudentAuthChange,
  saveAttempt,
  saveSpeakingActivity,
  saveUserSettings,
} from "./supabase.js";

const $ = (selector) => document.querySelector(selector);

const elements = {
  hubBackLink: $("#hubBackLink"),
  languageToggle: $("#languageToggle"),
  soundToggle: $("#soundToggle"),
  vibrationToggle: $("#vibrationToggle"),
  voiceSelect: $("#voiceSelect"),
  lessonDate: $("#lessonDate"),
  lessonTitle: $("#lessonTitle"),
  lessonSummary: $("#lessonSummary"),
  lessonSummaryJa: $("#lessonSummaryJa"),
  practiceMode: $("#practiceMode"),
  shuffleQuestions: $("#shuffleQuestions"),
  checkModeButtons: [...document.querySelectorAll("[data-check]")],
  hintModeButtons: [...document.querySelectorAll("[data-hint-mode]")],
  shuffleChoices: $("#shuffleChoices"),
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
  retryButtons: [...document.querySelectorAll("[data-retry]")],
  toast: $("#toast"),
};

const params = new URLSearchParams(window.location.search);
const lessonPathMatch = window.location.pathname.match(/^\/lesson\/([^/]+)\/?$/);
const lessonId = params.get("id") || decodeURIComponent(lessonPathMatch?.[1] || "");
const isTeacherPreview = params.get("preview") === "1";
const returnTo = isTeacherPreview
  ? "/teacher.html"
  : params.get("from") === "takiwaki"
    ? "/takiwaki.html"
    : "/";
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
  settings: getSettings(),
  startedAt: new Date().toISOString(),
  runAttemptId: uuid(),
  runStartedAt: new Date().toISOString(),
  questionOrder: [],
  answers: {},
  official: {},
  retryAttempts: {},
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
  toastTimer: null,
};

let hintCloseTimeout = null;
let hintCountdownInterval = null;
let hintDeadline = 0;
let hintQuestionId = "";
let activeStudentUserId = null;
let lessonScopeReady = false;
let authScopeLocked = false;

const textFor = (bilingual, language = "en") => {
  if (bilingual && typeof bilingual === "object") return String(bilingual[language] || "");
  return language === "en" ? String(bilingual || "") : "";
};

const showToast = (message) => {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
};

const vibrationSupported = () => (
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
);

const provideAnswerFeedback = (correct) => {
  playAnswerFeedback(Boolean(correct));
  if (!state.settings.vibration || !vibrationSupported()) return;
  try {
    navigator.vibrate(correct ? [30, 40, 30] : [80, 40, 80]);
  } catch {
    // Vibration is optional and may be blocked by the device or browser.
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
      elements.hintCountdown.textContent = seconds ? `Closes in ${seconds}s` : "Closing…";
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
  if (answer === false || answer === true) return true;
  if (answer == null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === "object") {
    if (question.format === "speaking") return Boolean(answer.transcript || answer.selfPractised);
    return Object.values(answer).some((value) => String(value ?? "").trim());
  }
  return false;
};

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
  state.practiceMode = ["all", "original", "extra", "wrong", "unanswered"].includes(saved.practiceMode)
    ? saved.practiceMode
    : "all";
};

const officialTotals = (questions = state.masterQuestions) => questions.reduce((totals, question) => {
  const result = state.official[question.id];
  totals.score += Number(result?.score || 0);
  totals.max += Number(question.maxPoints || 1);
  totals.checked += result ? 1 : 0;
  if (result && Number(result.score) < Number(question.maxPoints || 1)) totals.wrong += 1;
  return totals;
}, { score: 0, max: 0, checked: 0, wrong: 0 });

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
  elements.languageToggle.textContent = state.settings.showJapanese ? "EN + JP" : "EN only";
  elements.languageToggle.setAttribute("aria-pressed", String(state.settings.showJapanese));
  elements.soundToggle.textContent = state.settings.sound ? "Sound On" : "Sound Off";
  elements.soundToggle.setAttribute("aria-pressed", String(state.settings.sound));
  const canVibrate = vibrationSupported();
  elements.vibrationToggle.textContent = canVibrate
    ? (state.settings.vibration ? "Vibration On" : "Vibration Off")
    : "Vibration unavailable";
  elements.vibrationToggle.disabled = !canVibrate;
  elements.vibrationToggle.setAttribute(
    "aria-pressed",
    String(canVibrate && state.settings.vibration),
  );
  elements.voiceSelect.value = state.settings.voice;
  elements.shuffleChoices.checked = state.settings.shuffleChoices;
  elements.checkModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.check === state.settings.checkMode);
  });
  elements.hintModeButtons.forEach((button) => {
    const active = button.dataset.hintMode === state.settings.hintMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.checkAnswered.disabled = state.settings.checkMode === "instant";
};

const questionTypeLabel = (format) => ({
  mcq: "Choose",
  situation: "Real-life choice",
  dialogue: "Conversation",
  truefalse: "True or False",
  typing: "Type it",
  translation: "Translation",
  listenType: "Dictation",
  listenChoice: "Listening",
  speaking: "Speaking",
  mistake: "Mistake detective",
  order: "Sentence builder",
  matching: "Matching",
  sorting: "Sorting",
  grid: "Position",
}[format] || "Question");

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
  const order = state.settings.shuffleChoices
    ? orderFor(`${question.id}:choices`, ids)
    : ids;
  return order.map((id) => question.choices.find((choice) => choice.id === id)).filter(Boolean);
};

const selectQuestionSet = (mode) => {
  const byOrder = state.questionOrder
    .map((id) => state.masterQuestions.find((question) => question.id === id))
    .filter(Boolean);
  if (mode === "original") return byOrder.filter((question) => question.isOriginal);
  if (mode === "extra") return byOrder.filter((question) => !question.isOriginal);
  if (mode === "wrong") {
    return byOrder.filter((question) => {
      const result = state.official[question.id];
      return result && Number(result.score) < Number(question.maxPoints || 1);
    });
  }
  if (mode === "unanswered") return byOrder.filter((question) => !state.official[question.id]);
  return byOrder;
};

const updatePracticeModeLabels = () => {
  const originals = state.masterQuestions.filter((question) => question.isOriginal).length;
  const extras = state.masterQuestions.length - originals;
  const wrong = selectQuestionSet("wrong").length;
  const unanswered = selectQuestionSet("unanswered").length;
  const labels = {
    all: `All questions (${state.masterQuestions.length})`,
    original: `Original Review (${originals})`,
    extra: `Listen & Speak (${extras})`,
    wrong: `Mistakes only (${wrong})`,
    unanswered: `Unanswered only (${unanswered})`,
  };
  [...elements.practiceMode.options].forEach((option) => {
    option.textContent = labels[option.value] || option.textContent;
  });
};

const setPracticeMode = (mode, { clearCurrentAnswers = false, force = false } = {}) => {
  const nextQuestions = selectQuestionSet(mode);
  if (!nextQuestions.length && !force) {
    showToast(mode === "wrong" ? "No mistakes to practise yet." : "There are no questions in this set yet.");
    elements.practiceMode.value = state.practiceMode;
    return;
  }
  if (clearCurrentAnswers) {
    nextQuestions.forEach((question) => {
      delete state.answers[question.id];
      delete state.feedback[question.id];
    });
  }
  state.practiceMode = mode;
  state.visibleQuestions = nextQuestions;
  state.currentIndex = 0;
  beginNewRun();
  state.requireRunChecks = clearCurrentAnswers || mode === "wrong";
  elements.practiceMode.value = mode;
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

const gradeQuestion = (question, answer = state.answers[question.id]) => {
  const max = Number(question.maxPoints || 1);
  let score = 0;
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(question.format)) {
    score = String(answer) === String(question.correct) ? 1 : 0;
  } else if (question.format === "truefalse") {
    score = answer === Boolean(question.correct) ? 1 : 0;
  } else if (["typing", "translation", "listenType", "mistake"].includes(question.format)) {
    const normalized = normalizeAnswerText(answer);
    score = question.accepted.some((accepted) => normalizeAnswerText(accepted) === normalized) ? 1 : 0;
  } else if (question.format === "order") {
    const sentence = Array.isArray(answer)
      ? answer.map((tokenIndex) => question.words[Number(tokenIndex)]).join(" ")
      : "";
    score = normalizeAnswerText(sentence) === normalizeAnswerText(question.correctWords.join(" ")) ? 1 : 0;
  } else if (question.format === "matching") {
    score = question.pairs.reduce((total, pair) => (
      String(answer?.[pair.id] || "") === pair.jp ? total + 1 : total
    ), 0);
  } else if (question.format === "sorting") {
    score = question.sortingItems.reduce((total, item) => (
      String(answer?.[item.id] || "") === item.category ? total + 1 : total
    ), 0);
  } else if (question.format === "grid") {
    score = String(answer) === String(question.correctCell) ? 1 : 0;
  } else if (question.format === "speaking") {
    score = answer?.matched || answer?.selfPractised ? 1 : 0;
  }
  return {
    score,
    max,
    correct: score === max,
    answer: structuredClone(answer),
    checkedAt: new Date().toISOString(),
  };
};

const checkQuestion = (question, { quiet = false } = {}) => {
  if (!answerExists(question)) {
    if (!quiet) showToast("Answer this question first.");
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
  const firstAttempt = !state.official[question.id];
  if (firstAttempt) {
    state.official[question.id] = result;
  } else {
    const retries = Array.isArray(state.retryAttempts[question.id])
      ? state.retryAttempts[question.id]
      : [];
    retries.push(result);
    state.retryAttempts[question.id] = retries.slice(-20);
  }
  state.feedback[question.id] = { ...result, isRetry: !firstAttempt };
  if (!state.runFirstResults[question.id]) state.runFirstResults[question.id] = result;
  state.runAnswerCounts[question.id] = Number(state.runAnswerCounts[question.id] || 0) + 1;
  state.runChecked.add(question.id);
  state.runResults[question.id] = result;
  saveLocalState();
  updatePracticeModeLabels();
  renderScore();
  renderNavigation();
  if (state.visibleQuestions[state.currentIndex]?.id === question.id) renderFeedback(question);
  if (!quiet) provideAnswerFeedback(result.correct);
  maybeCompleteRun();
  return result;
};

const feedbackMessage = (question, result) => {
  if (question.format === "matching") {
    return result.correct
      ? `All ${result.max} pairs are correct.`
      : `${result.score} of ${result.max} pairs are correct. Check the remaining pairs.`;
  }
  if (question.format === "sorting") {
    return result.correct
      ? `All ${result.max} items are in the correct group.`
      : `${result.score} of ${result.max} items are in the correct group.`;
  }
  if (question.format === "speaking") {
    const answer = state.answers[question.id];
    return answer?.messageEn || (result.correct
      ? "Speaking practice complete."
      : "Listen once more and try the sentence again.");
  }
  return result.correct ? "Correct — well done." : "Not quite. Review the answer and try again.";
};

const renderTextAudioButton = (text, label = "Listen") => {
  const cleanText = String(text ?? "").trim();
  if (!cleanText) return "";
  return `
    <button
      class="text-audio-btn"
      data-audio-text="${escapeHTML(cleanText)}"
      type="button"
      aria-label="${escapeHTML(`${label}: ${cleanText}`)}"
      title="${escapeHTML(label)}"
    ><span aria-hidden="true">▶</span> ${escapeHTML(label)}</button>
  `;
};

const renderFeedback = (question) => {
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
    ? `<p><strong>Retry:</strong> Your first score is safely locked. This result is practice only.</p>`
    : `<p><strong>First answer recorded.</strong> Future tries will not change this official score.</p>`;
  const scoreText = result.max > 1 ? ` (${result.score} / ${result.max})` : "";
  elements.feedbackCard.className = `feedback-card ${result.correct ? "correct" : "wrong"}`;
  elements.feedbackCard.innerHTML = `
    <p><strong>${escapeHTML(feedbackMessage(question, result))}${escapeHTML(scoreText)}</strong></p>
    ${retryNote}
    ${!result.correct && correctAnswer ? `
      <div class="feedback-audio-row">
        <p><strong>Answer:</strong> ${escapeHTML(correctAnswer)}</p>
        ${renderTextAudioButton(correctAnswer, "Listen to the answer")}
      </div>
    ` : ""}
    ${explanationEn ? `
      <div class="feedback-audio-row">
        <p>${escapeHTML(explanationEn)}</p>
        ${renderTextAudioButton(explanationEn, "Listen to the explanation")}
      </div>
    ` : ""}
    ${state.settings.showJapanese && explanationJa ? `<p class="jp">${escapeHTML(explanationJa)}</p>` : ""}
  `;
  elements.feedbackCard.hidden = false;
  attachAudioHandlers(elements.feedbackCard);
};

const renderAudioPractice = (text, kind = "listen") => `
  <div class="audio-practice">
    <button class="audio-btn" data-audio-text="${escapeHTML(text)}" type="button">${kind === "speak" ? "Hear the model" : "Play audio"}</button>
    <span class="audio-status" role="status">${state.settings.voice === "gb" ? "UK · Libby" : "US · Ava"}</span>
  </div>
`;

const renderChoiceQuestion = (question, selectedAnswer = state.answers[question.id]) => {
  return `
    <div class="choice-list">
      ${choiceOrder(question).map((choice, index) => `
        <div class="choice-audio-row">
          <button class="choice-option ${String(selectedAnswer) === String(choice.id) ? "selected" : ""}" data-choice="${escapeHTML(choice.id)}" type="button">
            <span class="letter">${String.fromCharCode(65 + index)}</span>
            <span>${escapeHTML(choice.en)}${state.settings.showJapanese && choice.jp ? `<small>${escapeHTML(choice.jp)}</small>` : ""}</span>
          </button>
          ${renderTextAudioButton(choice.en, `Listen to choice ${String.fromCharCode(65 + index)}`)}
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
          ${renderTextAudioButton(question.wrongSentence, "Listen to the original")}
        </div>
      </div>
    `
    : "";
  return `
    ${wrongSentence}
    <label>
      <span class="question-jp">Type your answer</span>
      <input class="answer-input" id="typedAnswer" type="text" autocomplete="off" spellcheck="false" value="${escapeHTML(answer)}" placeholder="Type your English answer">
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
    <p class="question-jp">Build your sentence here:</p>
    <div class="built-sentence" aria-label="Your sentence">
      ${answer.map((tokenIndex, position) => `
        <button class="word-chip" data-remove-word="${position}" type="button">${escapeHTML(question.words[tokenIndex] || "")}</button>
      `).join("")}
    </div>
    ${completedSentence ? `
      <div class="completed-order-audio">
        ${renderTextAudioButton(completedSentence, "Listen to your sentence")}
      </div>
    ` : ""}
    <p class="question-jp">Word bank:</p>
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
            ${renderTextAudioButton(pair.en, "Listen")}
          </div>
          <select data-match-pair="${escapeHTML(pair.id)}" aria-label="Match for ${escapeHTML(pair.en)}">
            <option value="">Choose the Japanese meaning</option>
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
      <span>Group names:</span>
      ${question.categories.map((category) => renderTextAudioButton(category, "Listen")).join("")}
    </div>
    <div class="sorting-board">
      ${question.sortingItems.map((item) => `
        <div class="sort-column">
          <div class="sort-item-heading">
            <h3>${escapeHTML(item.text)}</h3>
            ${renderTextAudioButton(item.text, "Listen")}
          </div>
          <select data-sort-item="${escapeHTML(item.id)}" aria-label="Category for ${escapeHTML(item.text)}">
            <option value="">Choose a group</option>
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
  return `
    <div class="position-grid" aria-label="Position grid">
      ${cells.map((cell) => `
        <button class="${selected === cell ? "selected" : ""}" data-grid-cell="${cell}" type="button" aria-label="${cell.replace("-", " ")}"></button>
      `).join("")}
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
      <button class="mic-btn" id="speakButton" type="button" ${supported ? "" : "disabled"}>${supported ? "Start speaking" : "Microphone unavailable"}</button>
      <button class="word-chip" id="selfPracticeButton" type="button">I practised it</button>
      <span class="speech-status" id="speechStatus" role="status">${supported ? "Listen first, then press the microphone." : "You can still listen and mark the sentence as practised."}</span>
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
      const result = await speakText(button.dataset.audioText, {
        voice: state.settings.voice,
        onStatus: ({ phase, messageEn, messageJa }) => {
          if (status) {
            status.textContent = state.settings.showJapanese && messageJa ? messageJa : messageEn;
          }
          button.classList.toggle("loading", phase === "loading");
        },
      });
      if (result?.reason === "sound-off") showToast("Sound is off. Turn it on to listen.");
      if (result?.reason === "unavailable") showToast("Audio is unavailable in this browser.");
      button.disabled = false;
      button.classList.remove("loading");
      button.removeAttribute("aria-busy");
    });
  });
};

const maybeInstantCheck = (question, complete) => {
  if (state.settings.checkMode === "instant" && complete) checkQuestion(question);
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

const attachQuestionHandlers = (question) => {
  attachAudioHandlers();
  elements.questionCard.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = question.format === "truefalse"
        ? button.dataset.choice === "true"
        : button.dataset.choice;
      setAnswer(question, value, { render: true });
      maybeInstantCheck(question, true);
    });
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
          if (status) status.textContent = state.settings.showJapanese && messageJa ? messageJa : messageEn;
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
    elements.questionType.textContent = "No questions";
    elements.questionCounter.textContent = "0 / 0";
    elements.questionCard.innerHTML = "<h2>No questions in this practice set.</h2>";
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
  const audio = ["listenChoice", "listenType"].includes(question.format)
    ? renderAudioPractice(question.audioText)
    : "";
  const renderContextBox = (text, japanese, audioLabel) => text ? `
    <div class="context-box">
      <div class="context-audio-row">
        <span>${escapeHTML(text)}${state.settings.showJapanese && japanese ? `<br><small>${escapeHTML(japanese)}</small>` : ""}</span>
        ${renderTextAudioButton(text, audioLabel)}
      </div>
    </div>
  ` : "";
  elements.questionCard.innerHTML = `
    ${renderContextBox(situationEn, "", "Listen to the situation")}
    ${renderContextBox(contextEn, contextJa, "Listen to the context")}
    <div class="prompt-heading-row">
      <h2>${escapeHTML(promptEn)}</h2>
      ${renderTextAudioButton(promptEn, "Listen to the question")}
    </div>
    ${state.settings.showJapanese && promptJa ? `<p class="question-jp">${escapeHTML(promptJa)}</p>` : ""}
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
      : (answerExists(question) ? "answered, not checked" : "unanswered");
    return `<button class="${classes}" data-question-index="${index}" type="button" aria-label="Question ${index + 1}, ${status}">${index + 1}</button>`;
  }).join("");
  elements.questionNav.querySelectorAll("[data-question-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentIndex = Number(button.dataset.questionIndex);
      saveLocalState();
      renderQuestion();
    });
  });
};

const renderScore = () => {
  const totals = officialTotals();
  elements.scorePill.textContent = `First score ${totals.score} / ${totals.max}`;
};

const renderAll = () => {
  updatePracticeModeLabels();
  renderSettings();
  renderScore();
  renderQuestion();
};

const runIsComplete = () => {
  if (!state.visibleQuestions.length) return false;
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
  elements.resultHeading.textContent = score === max ? "Excellent work." : "Good practice — keep going.";
  elements.resultSummary.textContent = `This practice: ${score} / ${max}. Your first official answers stay safely recorded.`;
  elements.resultPanel.hidden = false;
  saveCompletedRun().catch(() => {});
};

const initialiseLesson = async () => {
  elements.hubBackLink.href = returnTo;
  try {
    await loadScopedSettings();
    lessonScopeReady = true;
    const lesson = await getLessonById(lessonId, { preview: isTeacherPreview });
    if (!lesson) throw new Error("This lesson could not be found.");
    state.lesson = lesson;
    state.masterQuestions = lesson.questions;
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
    state.questionOrder = [
      ...state.questionOrder.filter((id) => allIds.includes(id)),
      ...allIds.filter((id) => !state.questionOrder.includes(id)),
    ];
    elements.lessonDate.textContent = formatDate(lesson.lessonDate);
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonSummary.textContent = lesson.summary;
    elements.lessonSummaryJa.textContent = lesson.summaryJa;
    elements.lessonSummaryJa.hidden = !state.settings.showJapanese;
    elements.practiceMode.value = state.practiceMode;
    const selected = selectQuestionSet(state.practiceMode);
    if (!selected.length) state.practiceMode = "all";
    state.visibleQuestions = selectQuestionSet(state.practiceMode);
    if (!state.hasPersistedRunState) state.requireRunChecks = state.practiceMode === "wrong";
    const savedLast = getLessonProgress(lessonId)?.lastQuestionId;
    const savedIndex = state.visibleQuestions.findIndex((question) => question.id === savedLast);
    state.currentIndex = savedIndex >= 0 ? savedIndex : 0;
    saveLocalState();
    renderAll();
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

elements.languageToggle.addEventListener("click", () => {
  persistSettings({ showJapanese: !state.settings.showJapanese });
  elements.lessonSummaryJa.hidden = !state.settings.showJapanese;
  renderQuestion();
});
elements.soundToggle.addEventListener("click", () => {
  const sound = !state.settings.sound;
  if (!sound) stopAudio();
  persistSettings({ sound });
});
elements.vibrationToggle.addEventListener("click", () => {
  if (!vibrationSupported()) return;
  persistSettings({ vibration: !state.settings.vibration });
});
elements.voiceSelect.addEventListener("change", () => {
  stopAudio();
  persistSettings({ voice: elements.voiceSelect.value });
  renderQuestion();
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
elements.shuffleChoices.addEventListener("change", () => {
  persistSettings({ shuffleChoices: elements.shuffleChoices.checked });
  renderQuestion();
});
elements.practiceMode.addEventListener("change", () => setPracticeMode(elements.practiceMode.value));
elements.shuffleQuestions.addEventListener("click", () => {
  state.questionOrder = shuffleArray(state.questionOrder);
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
  let answered = 0;
  let checked = 0;
  const checkedResults = [];
  state.visibleQuestions.forEach((question) => {
    if (answerExists(question)) {
      answered += 1;
      const result = checkQuestion(question, { quiet: true });
      if (result && !result.skipped) {
        checked += 1;
        checkedResults.push(result);
      }
    }
  });
  if (!answered) showToast("Answer at least one question first.");
  else if (!checked) showToast("All unchanged answers are already checked.");
  else {
    provideAnswerFeedback(checkedResults.every((result) => result.correct));
    renderQuestion();
    showToast(`Checked ${checked} answered question${checked === 1 ? "" : "s"}.`);
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
  const tag = document.activeElement?.tagName;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;
  if (event.key === "ArrowLeft") elements.previousQuestion.click();
  if (event.key === "ArrowRight") elements.nextQuestion.click();
});

initialiseLesson();
