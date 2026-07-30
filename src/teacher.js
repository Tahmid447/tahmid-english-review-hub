import {
  getTeacherClient,
  getTeacherSession,
  onTeacherAuthChange,
  signInTeacher,
  signOutTeacher,
} from "./supabase.js";

const client = getTeacherClient();

const elements = {
  loginPanel: document.querySelector("#teacherLoginPanel"),
  loginForm: document.querySelector("#teacherLoginForm"),
  email: document.querySelector("#teacherEmail"),
  password: document.querySelector("#teacherPassword"),
  loginStatus: document.querySelector("#teacherLoginStatus"),
  app: document.querySelector("#teacherApp"),
  logout: document.querySelector("#teacherLogout"),
  name: document.querySelector("#teacherName"),
  students: document.querySelector("#teacherStudentCount"),
  published: document.querySelector("#teacherPublishedCount"),
  drafts: document.querySelector("#teacherDraftCount"),
  sessions: document.querySelector("#teacherSessionCount"),
  panel: document.querySelector("#teacherPanel"),
  tabs: [...document.querySelectorAll("[data-teacher-tab]")],
  newLesson: document.querySelector("#newLessonButton"),
  editor: document.querySelector("#lessonEditor"),
  editorForm: document.querySelector("#lessonEditorForm"),
  editorHeading: document.querySelector("#editorHeading"),
  editorId: document.querySelector("#editorLessonId"),
  editorTitle: document.querySelector("#editorTitle"),
  editorDate: document.querySelector("#editorDate"),
  editorStatus: document.querySelector("#editorStatus"),
  editorAudience: document.querySelector("#editorAudience"),
  editorSummary: document.querySelector("#editorSummary"),
  editorMessage: document.querySelector("#editorStatusMessage"),
  preview: document.querySelector("#previewDraftButton"),
  questionManager: document.querySelector("#questionManager"),
  questionManagerHeading: document.querySelector("#questionManagerHeading"),
  questionManagerMeta: document.querySelector("#questionManagerMeta"),
  questionManagerStatus: document.querySelector("#questionManagerStatus"),
  questionManagerPanel: document.querySelector("#questionManagerPanel"),
  previewQuestions: document.querySelector("#previewQuestionsButton"),
  newQuestion: document.querySelector("#newQuestionButton"),
  questionEditor: document.querySelector("#questionEditor"),
  questionEditorForm: document.querySelector("#questionEditorForm"),
  questionEditorHeading: document.querySelector("#questionEditorHeading"),
  questionRecordId: document.querySelector("#questionRecordId"),
  questionStableKey: document.querySelector("#questionStableKey"),
  questionSection: document.querySelector("#questionSection"),
  questionFormat: document.querySelector("#questionFormat"),
  questionPromptEn: document.querySelector("#questionPromptEn"),
  questionPromptJa: document.querySelector("#questionPromptJa"),
  questionHintEn: document.querySelector("#questionHintEn"),
  questionHintJa: document.querySelector("#questionHintJa"),
  questionExplanationEn: document.querySelector("#questionExplanationEn"),
  questionExplanationJa: document.querySelector("#questionExplanationJa"),
  questionAudioText: document.querySelector("#questionAudioText"),
  questionSpeakText: document.querySelector("#questionSpeakText"),
  questionSpeakJa: document.querySelector("#questionSpeakJa"),
  questionAnswerPayload: document.querySelector("#questionAnswerPayload"),
  questionAnswerHelp: document.querySelector("#questionAnswerHelp"),
  easyChoiceFields: document.querySelector("#easyChoiceFields"),
  easyAcceptedField: document.querySelector("#easyAcceptedField"),
  easyChoiceAEn: document.querySelector("#easyChoiceAEn"),
  easyChoiceAJa: document.querySelector("#easyChoiceAJa"),
  easyChoiceBEn: document.querySelector("#easyChoiceBEn"),
  easyChoiceBJa: document.querySelector("#easyChoiceBJa"),
  easyCorrectChoice: document.querySelector("#easyCorrectChoice"),
  easyAcceptedAnswers: document.querySelector("#easyAcceptedAnswers"),
  questionTemplate: document.querySelector("#questionTemplateButton"),
  questionEditorStatus: document.querySelector("#questionEditorStatus"),
  cancelQuestion: document.querySelector("#cancelQuestionButton"),
  toast: document.querySelector("#toast"),
};

const state = {
  session: null,
  teacher: null,
  tab: "drafts",
  lessons: [],
  profiles: [],
  attempts: [],
  assignments: [],
  answers: [],
  analyticsQuestions: [],
  speaking: [],
  phrases: [],
  analyticsView: "overview",
  syncing: false,
  questionLesson: null,
  questions: [],
  questionLoading: false,
  questionSaving: false,
};

function make(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.type) node.type = options.type;
  if (options.title) node.title = options.title;
  return node;
}

function showToast(message, kind = "info") {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.dataset.kind = kind;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 3600);
}

function readableError(error, fallback) {
  const message = error?.message || "";
  if (/review_|relation .* does not exist/i.test(message)) {
    return "Review Hub database setup is not complete yet. Run the supplied migration and catalogue seed first.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "The email or password is not correct.";
  }
  if (/row-level security|permission denied/i.test(message)) {
    return "This account is not authorised for that teacher action.";
  }
  if (/must contain at least one active question/i.test(message)) {
    return "Add and activate at least one question before publishing this lesson.";
  }
  if (/duplicate key|review_questions_lesson_id_stable_key/i.test(message)) {
    return "That stable key is already used by another question in this lesson.";
  }
  return fallback || message || "Something went wrong. Please try again.";
}

function formatDate(value, includeTime = false) {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function statusLabel(status) {
  return {
    draft: "Draft",
    review: "Ready for review",
    published: "Published",
    archived: "Archived",
  }[status] || status;
}

function audienceLabel(audience) {
  return {
    general: "General",
    takiwaki: "Takiwaki only",
    both: "Both",
  }[audience] || audience;
}

const QUESTION_FORMATS = Object.freeze({
  mcq: {
    label: "Multiple choice",
    example: {
      choices: [
        { id: "a", en: "First answer", jp: "最初の答え" },
        { id: "b", en: "Second answer", jp: "2つ目の答え" },
      ],
      correct: "a",
    },
  },
  situation: {
    label: "Situation choice",
    example: {
      choices: [
        { id: "a", en: "Natural response", jp: "自然な返答" },
        { id: "b", en: "Other response", jp: "別の返答" },
      ],
      correct: "a",
    },
  },
  truefalse: { label: "True / false", example: { correct: true } },
  typing: { label: "Typing", example: { accepted: ["Natural answer", "Another accepted answer"] } },
  translation: {
    label: "Translation",
    example: { accepted: ["Natural English answer"] },
  },
  order: {
    label: "Word order",
    example: {
      words: ["you", "How", "are"],
      correctWords: ["How", "are", "you"],
    },
  },
  matching: {
    label: "Matching",
    example: {
      pairs: [
        { en: "Good morning.", jp: "おはようございます。" },
        { en: "See you.", jp: "またね。" },
      ],
    },
  },
  sorting: {
    label: "Sorting",
    example: {
      categories: ["formal", "casual"],
      items: [
        ["Good morning.", "formal"],
        ["Hi!", "casual"],
      ],
    },
  },
  grid: { label: "Position grid", example: { correctCell: "bottom-left" } },
  listenChoice: {
    label: "Listening choice",
    example: {
      choices: [
        { id: "a", en: "Sentence heard", jp: "聞こえた文" },
        { id: "b", en: "Different sentence", jp: "別の文" },
      ],
      correct: "a",
    },
  },
  listenType: {
    label: "Listening dictation",
    example: { accepted: ["The sentence the learner hears."] },
  },
  speaking: { label: "Speaking", example: {} },
  dialogue: {
    label: "Dialogue",
    example: {
      context: "A: How are you?\nB: ...",
      contextJa: "A：元気ですか？\nB：…",
      choices: [
        { id: "a", en: "I’m good, thanks.", jp: "元気です、ありがとう。" },
        { id: "b", en: "At seven.", jp: "7時です。" },
      ],
      correct: "a",
    },
  },
  mistake: {
    label: "Correct the mistake",
    example: {
      wrongSentence: "He go to work.",
      accepted: ["He goes to work."],
    },
  },
});

const MANAGED_QUESTION_PAYLOAD_KEYS = new Set([
  "id",
  "format",
  "type",
  "section",
  "prompt",
  "promptJa",
  "promptJP",
  "hint",
  "hintJa",
  "explanation",
  "explanationJa",
  "audioText",
  "speakText",
  "speakJa",
  "isOriginal",
  "maxPoints",
  "points",
]);

function formatQuestionLabel(format) {
  return QUESTION_FORMATS[format]?.label || format;
}

function bilingualValue(value, japaneseFallback = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      en: String(value.en ?? value.english ?? ""),
      jp: String(value.jp ?? value.ja ?? value.japanese ?? japaneseFallback),
    };
  }
  return { en: String(value ?? ""), jp: String(japaneseFallback ?? "") };
}

function questionPayloadDetails(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !MANAGED_QUESTION_PAYLOAD_KEYS.has(key)),
  );
}

async function fetchAll(table, columns, options = {}) {
  const pageSize = 1000;
  const rows = [];
  for (let from = 0; ; from += pageSize) {
    let query = client.from(table).select(columns).range(from, from + pageSize - 1);
    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true,
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

async function verifyTeacher(session) {
  const { data, error } = await client
    .from("review_teachers")
    .select("user_id, display_name, active")
    .eq("user_id", session.user.id)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("This account is not authorised for Teacher Studio.");
  return data;
}

function showLogin(message = "") {
  state.session = null;
  state.teacher = null;
  elements.loginPanel.hidden = false;
  elements.app.hidden = true;
  elements.logout.hidden = true;
  elements.loginStatus.textContent = message;
  elements.password.value = "";
}

async function enterStudio(session) {
  try {
    const teacher = await verifyTeacher(session);
    state.session = session;
    state.teacher = teacher;
    elements.loginPanel.hidden = true;
    elements.app.hidden = false;
    elements.logout.hidden = false;
    elements.name.textContent =
      teacher.display_name ||
      session.user.user_metadata?.display_name ||
      session.user.email?.split("@")[0] ||
      "Teacher";
    await refreshDashboard();
  } catch (error) {
    const message = readableError(error, "This account is not authorised for Teacher Studio.");
    if (!/setup is not complete/i.test(message)) await signOutTeacher();
    showLogin(message);
  }
}

async function refreshDashboard() {
  elements.panel.replaceChildren(make("p", { text: "Loading secure dashboard…" }));
  try {
    const [
      lessons,
      profiles,
      teachers,
      attempts,
      assignments,
      answers,
      analyticsQuestions,
      speaking,
      phrases,
    ] = await Promise.all([
      fetchAll("review_lessons", "*, review_questions(count)", {
        order: { column: "lesson_date", ascending: false },
      }),
      fetchAll("review_profiles", "user_id, display_name, locale, access_scope, created_at"),
      fetchAll("review_teachers", "user_id, active"),
      fetchAll(
        "review_attempts",
        "id, user_id, lesson_id, assignment_id, practice_mode, first_score, max_score, answered_count, question_count, wrong_count, duration_seconds, started_at, completed_at",
        { order: { column: "completed_at", ascending: false } },
      ),
      fetchAll(
        "review_assignments",
        "id, lesson_id, student_id, assigned_by, due_at, status, note, created_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchAll(
        "review_answers",
        "id, attempt_id, question_id, user_id, lesson_id, answer, first_is_correct, first_points, latest_is_correct, latest_points, answer_count, feedback_band, first_answered_at, last_answered_at",
        { order: { column: "last_answered_at", ascending: false } },
      ),
      fetchAll(
        "review_questions",
        "id, lesson_id, stable_key, section, format, payload, active",
        { order: { column: "position", ascending: true } },
      ),
      fetchAll(
        "review_speaking_activity",
        "id, user_id, lesson_id, question_id, target_text, transcript, feedback_band, recognition_available, practiced_at",
        { order: { column: "practiced_at", ascending: false } },
      ),
      fetchAll(
        "review_phrase_activity",
        "id, user_id, phrase_id, practice_count, last_practiced_at, is_favorite",
        { order: { column: "last_practiced_at", ascending: false } },
      ),
    ]);

    state.lessons = lessons;
    const teacherIds = new Set(
      teachers
        .filter((teacher) => teacher.active)
        .map((teacher) => teacher.user_id),
    );
    state.profiles = profiles.filter((profile) => !teacherIds.has(profile.user_id));
    state.attempts = attempts;
    state.assignments = assignments;
    state.answers = answers;
    state.analyticsQuestions = analyticsQuestions;
    state.speaking = speaking;
    state.phrases = phrases;
    updateMetrics();
    renderActiveTab();
  } catch (error) {
    elements.panel.replaceChildren(
      make("p", { text: readableError(error, "The dashboard could not be loaded.") }),
    );
  }
}

function updateMetrics() {
  elements.students.textContent = String(state.profiles.length);
  elements.published.textContent = String(
    state.lessons.filter((lesson) => lesson.status === "published").length,
  );
  elements.drafts.textContent = String(
    state.lessons.filter((lesson) => ["draft", "review"].includes(lesson.status)).length,
  );
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  elements.sessions.textContent = String(
    state.attempts.filter((attempt) => new Date(attempt.completed_at).getTime() >= sevenDaysAgo)
      .length,
  );
}

function questionCount(lesson) {
  const value = lesson.review_questions;
  if (Array.isArray(value)) return Number(value[0]?.count || 0);
  return Number(value?.count || 0);
}

function makeTable(headers) {
  const table = make("table", { className: "data-table" });
  const thead = make("thead");
  const row = make("tr");
  for (const header of headers) row.append(make("th", { text: header }));
  thead.append(row);
  const tbody = make("tbody");
  table.append(thead, tbody);
  return { table, tbody };
}

function makeAction(label, handler, title = "") {
  const button = make("button", { text: label, type: "button", title });
  button.addEventListener("click", handler);
  return button;
}

function safeNotionLink(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !["notion.so", "www.notion.so", "app.notion.com"].includes(parsed.hostname)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

function lessonRows(lessons) {
  const { table, tbody } = makeTable([
    "Lesson",
    "Date",
    "Status",
    "Audience",
    "Questions",
    "Source",
    "Actions",
  ]);

  for (const lesson of lessons) {
    const row = make("tr");
    const titleCell = make("td");
    titleCell.append(make("strong", { text: lesson.title_en }));
    if (lesson.title_ja) titleCell.append(make("br"), make("small", { text: lesson.title_ja }));

    const sourceCell = make("td");
    const notionUrl = safeNotionLink(lesson.source_notion_url);
    if (notionUrl) {
      const link = make("a", { text: "Notion note ↗" });
      link.href = notionUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      sourceCell.append(link);
    } else {
      sourceCell.textContent = lesson.source_type === "legacy_zip" ? "Original site" : "Manual";
    }

    const actions = make("td", { className: "table-actions" });
    actions.append(
      makeAction("Edit", () => openEditor(lesson)),
      makeAction("Questions", () => openQuestionManager(lesson)),
      makeAction("Preview", () => previewLesson(lesson)),
    );
    if (lesson.status !== "archived") {
      actions.append(makeAction("Archive", () => archiveLesson(lesson)));
    }

    row.append(
      titleCell,
      make("td", { text: formatDate(lesson.lesson_date) }),
      make("td", { text: statusLabel(lesson.status) }),
      make("td", { text: audienceLabel(lesson.audience) }),
      make("td", { text: questionCount(lesson) }),
      sourceCell,
      actions,
    );
    tbody.append(row);
  }
  return table;
}

function renderLessons(mode) {
  const filtered =
    mode === "drafts"
      ? state.lessons.filter((lesson) => ["draft", "review"].includes(lesson.status))
      : state.lessons.filter((lesson) => ["published", "archived"].includes(lesson.status));

  if (!filtered.length) {
    elements.panel.replaceChildren(
      make("p", {
        text:
          mode === "drafts"
            ? "There are no private drafts waiting for review."
            : "There are no published or archived lessons yet.",
      }),
    );
    return;
  }
  elements.panel.replaceChildren(lessonRows(filtered));
}

function lessonTitle(lessonId) {
  return state.lessons.find((lesson) => lesson.id === lessonId)?.title_en || "Unknown lesson";
}

function profileName(userId) {
  return (
    state.profiles.find((profile) => profile.user_id === userId)?.display_name ||
    `Student ${userId.slice(0, 6)}`
  );
}

function renderStudents() {
  const published = state.lessons.filter((lesson) => lesson.status === "published");
  const { table, tbody } = makeTable([
    "Student",
    "Access",
    "Sessions",
    "Latest practice",
    "Assigned",
    "New assignment",
  ]);

  for (const profile of state.profiles) {
    const attempts = state.attempts.filter((attempt) => attempt.user_id === profile.user_id);
    const assignments = state.assignments.filter(
      (assignment) => assignment.student_id === profile.user_id,
    );
    const assignCell = make("td");
    if (published.length) {
      const select = make("select");
      select.setAttribute("aria-label", `Assign a lesson to ${profileName(profile.user_id)}`);
      for (const lesson of published) {
        const option = make("option", { text: `${formatDate(lesson.lesson_date)} · ${lesson.title_en}` });
        option.value = lesson.id;
        select.append(option);
      }
      const button = makeAction("Assign", () =>
        assignLesson(profile.user_id, select.value, button),
      );
      const group = make("div", { className: "table-actions" });
      group.append(select, button);
      assignCell.append(group);
    } else {
      assignCell.textContent = "Publish a lesson first";
    }

    const row = make("tr");
    row.append(
      make("td", { text: profileName(profile.user_id) }),
      make("td", { text: profile.access_scope === "takiwaki" ? "Takiwaki" : "General" }),
      make("td", { text: attempts.length }),
      make("td", {
        text: attempts[0]?.completed_at ? formatDate(attempts[0].completed_at, true) : "—",
      }),
      make("td", {
        text: assignments.length
          ? `${assignments.filter((item) => item.status === "assigned").length} active`
          : "None",
      }),
      assignCell,
    );
    tbody.append(row);
  }

  if (!state.profiles.length) {
    elements.panel.replaceChildren(
      make("p", { text: "No student profiles have been created yet." }),
    );
  } else {
    elements.panel.replaceChildren(table);
  }
}

function formatPercent(correct, total) {
  return total > 0 ? `${Math.round((Number(correct || 0) / total) * 100)}%` : "—";
}

function questionAnalyticsTitle(question) {
  if (!question) return { en: "Question unavailable", jp: "" };
  const payload =
    question.payload && typeof question.payload === "object" && !Array.isArray(question.payload)
      ? question.payload
      : {};
  const prompt = bilingualValue(payload.prompt, payload.promptJa || payload.promptJP || "");
  return {
    en: prompt.en || question.stable_key || "Untitled question",
    jp: prompt.jp,
  };
}

function summarizeAnswerValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    const text = JSON.stringify(value);
    return text.length > 110 ? `${text.slice(0, 107)}…` : text;
  } catch {
    return "Structured response";
  }
}

function retryOutcome(answer) {
  if (answer.first_is_correct === false && answer.latest_is_correct === true) return "Recovered";
  if (answer.first_is_correct === false && answer.latest_is_correct === false) {
    return "Still needs work";
  }
  if (answer.first_is_correct === true && answer.latest_is_correct === false) {
    return "Changed to incorrect";
  }
  if (answer.latest_is_correct === true) return "Stayed correct";
  return "Not scored";
}

function buildQuestionAnalytics() {
  const questionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const grouped = new Map();

  for (const answer of state.answers) {
    const question = questionMap.get(answer.question_id);
    const key = answer.question_id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        questionId: key,
        question,
        lessonId: answer.lesson_id || question?.lesson_id,
        format: question?.format || "unknown",
        responses: 0,
        firstScored: 0,
        firstCorrect: 0,
        firstWrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        latestWrong: 0,
        recovered: 0,
        retries: 0,
        students: new Set(),
        lastAnsweredAt: null,
      });
    }
    const item = grouped.get(key);
    item.responses += 1;
    item.students.add(answer.user_id);
    item.retries += Math.max(0, Number(answer.answer_count || 1) - 1);
    if (typeof answer.first_is_correct === "boolean") {
      item.firstScored += 1;
      if (answer.first_is_correct) item.firstCorrect += 1;
      else item.firstWrong += 1;
    }
    if (typeof answer.latest_is_correct === "boolean") {
      item.latestScored += 1;
      if (answer.latest_is_correct) item.latestCorrect += 1;
      else item.latestWrong += 1;
    }
    if (answer.first_is_correct === false && answer.latest_is_correct === true) {
      item.recovered += 1;
    }
    if (
      answer.last_answered_at &&
      (!item.lastAnsweredAt ||
        new Date(answer.last_answered_at).getTime() >
          new Date(item.lastAnsweredAt).getTime())
    ) {
      item.lastAnsweredAt = answer.last_answered_at;
    }
  }

  return [...grouped.values()].sort(
    (left, right) =>
      right.firstWrong - left.firstWrong ||
      left.firstCorrect / Math.max(1, left.firstScored) -
        right.firstCorrect / Math.max(1, right.firstScored) ||
      right.responses - left.responses,
  );
}

function buildFormatAnalytics(questionStats = buildQuestionAnalytics()) {
  const grouped = new Map();
  for (const question of questionStats) {
    if (!grouped.has(question.format)) {
      grouped.set(question.format, {
        format: question.format,
        questions: 0,
        responses: 0,
        firstScored: 0,
        firstCorrect: 0,
        firstWrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        latestWrong: 0,
        recovered: 0,
        retries: 0,
        students: new Set(),
      });
    }
    const item = grouped.get(question.format);
    item.questions += 1;
    item.responses += question.responses;
    item.firstScored += question.firstScored;
    item.firstCorrect += question.firstCorrect;
    item.firstWrong += question.firstWrong;
    item.latestScored += question.latestScored;
    item.latestCorrect += question.latestCorrect;
    item.latestWrong += question.latestWrong;
    item.recovered += question.recovered;
    item.retries += question.retries;
    question.students.forEach((student) => item.students.add(student));
  }
  return [...grouped.values()].sort(
    (left, right) =>
      left.firstCorrect / Math.max(1, left.firstScored) -
        right.firstCorrect / Math.max(1, right.firstScored) ||
      right.responses - left.responses,
  );
}

function buildLessonAnalytics() {
  const grouped = new Map();
  const ensure = (lessonId) => {
    if (!grouped.has(lessonId)) {
      grouped.set(lessonId, {
        lessonId,
        sessions: 0,
        students: new Set(),
        score: 0,
        maxScore: 0,
        sessionPercentTotal: 0,
        scoredSessions: 0,
        answered: 0,
        wrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        recovered: 0,
        lastPracticedAt: null,
      });
    }
    return grouped.get(lessonId);
  };
  for (const attempt of state.attempts) {
    const item = ensure(attempt.lesson_id);
    item.sessions += 1;
    item.students.add(attempt.user_id);
    item.score += Number(attempt.first_score || 0);
    item.maxScore += Number(attempt.max_score || 0);
    item.answered += Number(attempt.answered_count || 0);
    item.wrong += Number(attempt.wrong_count || 0);
    if (Number(attempt.max_score) > 0) {
      item.sessionPercentTotal +=
        (Number(attempt.first_score || 0) / Number(attempt.max_score)) * 100;
      item.scoredSessions += 1;
    }
    if (
      attempt.completed_at &&
      (!item.lastPracticedAt ||
        new Date(attempt.completed_at).getTime() >
          new Date(item.lastPracticedAt).getTime())
    ) {
      item.lastPracticedAt = attempt.completed_at;
    }
  }
  for (const answer of state.answers) {
    const item = ensure(answer.lesson_id);
    item.students.add(answer.user_id);
    if (typeof answer.latest_is_correct === "boolean") {
      item.latestScored += 1;
      if (answer.latest_is_correct) item.latestCorrect += 1;
    }
    if (answer.first_is_correct === false && answer.latest_is_correct === true) {
      item.recovered += 1;
    }
  }
  return [...grouped.values()].sort(
    (left, right) =>
      new Date(right.lastPracticedAt || 0).getTime() -
        new Date(left.lastPracticedAt || 0).getTime() ||
      lessonTitle(left.lessonId).localeCompare(lessonTitle(right.lessonId)),
  );
}

function analyticsMetric(label, value, note) {
  const card = make("article", { className: "teacher-analytics-metric" });
  card.append(
    make("span", { text: label }),
    make("strong", { text: value }),
    make("small", { text: note }),
  );
  return card;
}

function analyticsSection(title, description = "") {
  const section = make("section", { className: "teacher-analytics-section" });
  section.append(make("h2", { text: title }));
  if (description) section.append(make("p", { text: description }));
  return section;
}

function analyticsEmpty(message) {
  return make("p", { className: "teacher-analytics-empty", text: message });
}

async function editAnalyticsQuestion(questionId) {
  const question = state.analyticsQuestions.find((item) => item.id === questionId);
  const lesson = state.lessons.find((item) => item.id === question?.lesson_id);
  if (!question || !lesson) {
    showToast("That question is no longer available.", "error");
    return;
  }
  const loaded = await loadLessonQuestions(lesson, { open: true });
  if (!loaded) return;
  const fullQuestion = state.questions.find((item) => item.id === questionId);
  if (fullQuestion) openQuestionEditor(fullQuestion);
}

function questionMistakesSection(questionStats, { limit } = {}) {
  const section = analyticsSection(
    "Question-level mistakes",
    "First-answer misses identify what needs reteaching; latest accuracy shows whether retries helped.",
  );
  const mistakes = questionStats
    .filter((item) => item.firstWrong > 0 || item.latestWrong > 0)
    .slice(0, limit || 300);
  if (!mistakes.length) {
    section.append(analyticsEmpty("No scored question mistakes have been recorded yet."));
    return section;
  }

  const { table, tbody } = makeTable([
    "Question",
    "Lesson",
    "Format",
    "First misses",
    "First accuracy",
    "Latest accuracy",
    "Recovered",
    "Extra tries",
    "Action",
  ]);
  for (const item of mistakes) {
    const title = questionAnalyticsTitle(item.question);
    const questionCell = make("td");
    questionCell.append(make("strong", { text: title.en }));
    if (title.jp) questionCell.append(make("br"), make("small", { text: title.jp }));
    const action = make("td", { className: "table-actions" });
    if (item.question) {
      action.append(makeAction("Edit", () => editAnalyticsQuestion(item.questionId)));
    } else {
      action.textContent = "Unavailable";
    }
    const row = make("tr");
    row.append(
      questionCell,
      make("td", { text: lessonTitle(item.lessonId) }),
      make("td", { text: formatQuestionLabel(item.format) }),
      make("td", { text: `${item.firstWrong} / ${item.firstScored}` }),
      make("td", { text: formatPercent(item.firstCorrect, item.firstScored) }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.recovered }),
      make("td", { text: item.retries }),
      action,
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function formatsSection(formatStats, { listeningOnly = false } = {}) {
  const scoredFormats = formatStats.filter(
    (item) => item.firstScored > 0 || item.latestScored > 0,
  );
  const formats = listeningOnly
    ? scoredFormats.filter((item) => ["listenChoice", "listenType"].includes(item.format))
    : scoredFormats;
  const section = analyticsSection(
    listeningOnly ? "Listening and dictation breakdown" : "Weak activity formats",
    listeningOnly
      ? "Compare listening recognition with full-sentence dictation."
      : "Formats are ordered from the lowest first-answer accuracy upward.",
  );
  if (!formats.length) {
    section.append(
      analyticsEmpty(
        listeningOnly
          ? "No listening or dictation answers have been recorded yet."
          : "No scored activity-format data is available yet.",
      ),
    );
    return section;
  }
  const { table, tbody } = makeTable([
    "Format",
    "Questions",
    "Responses",
    "First accuracy",
    "Latest accuracy",
    "First misses",
    "Recovered",
    "Extra tries",
  ]);
  for (const item of formats) {
    const row = make("tr");
    row.append(
      make("td", { text: formatQuestionLabel(item.format) }),
      make("td", { text: item.questions }),
      make("td", { text: item.responses }),
      make("td", { text: formatPercent(item.firstCorrect, item.firstScored) }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.firstWrong }),
      make("td", { text: item.recovered }),
      make("td", { text: item.retries }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function retriesSection() {
  const section = analyticsSection(
    "Retry result detail",
    "The first response remains the official score; this view shows what changed during retries.",
  );
  const questionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const retried = state.answers
    .filter((answer) => Number(answer.answer_count || 1) > 1)
    .sort(
      (left, right) =>
        Number(right.answer_count || 1) - Number(left.answer_count || 1) ||
        new Date(right.last_answered_at).getTime() -
          new Date(left.last_answered_at).getTime(),
    )
    .slice(0, 300);
  if (!retried.length) {
    section.append(analyticsEmpty("No within-session retries have been recorded yet."));
    return section;
  }

  const { table, tbody } = makeTable([
    "Student",
    "Lesson",
    "Question",
    "Format",
    "First answer",
    "Latest answer",
    "Result",
    "Points",
    "Tries",
    "Last answered",
  ]);
  for (const answer of retried) {
    const question = questionMap.get(answer.question_id);
    const title = questionAnalyticsTitle(question);
    const stored =
      answer.answer && typeof answer.answer === "object" && !Array.isArray(answer.answer)
        ? answer.answer
        : {};
    const row = make("tr");
    row.append(
      make("td", { text: profileName(answer.user_id) }),
      make("td", { text: lessonTitle(answer.lesson_id) }),
      make("td", { text: title.en }),
      make("td", { text: formatQuestionLabel(question?.format || "unknown") }),
      make("td", { text: summarizeAnswerValue(stored.first) }),
      make("td", { text: summarizeAnswerValue(stored.latest) }),
      make("td", { text: retryOutcome(answer) }),
      make("td", {
        text: `${Number(answer.first_points || 0)} → ${Number(answer.latest_points || 0)}`,
      }),
      make("td", { text: answer.answer_count }),
      make("td", { text: formatDate(answer.last_answered_at, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function lessonsSection(lessonStats, { limit } = {}) {
  const section = analyticsSection(
    "Lesson-by-lesson scores",
    "Weighted score keeps multi-point activities accurate; session average treats every session equally.",
  );
  const rows = lessonStats.slice(0, limit || 300);
  if (!rows.length) {
    section.append(analyticsEmpty("No lesson score data has been recorded yet."));
    return section;
  }
  const { table, tbody } = makeTable([
    "Lesson",
    "Sessions",
    "Learners",
    "Weighted first score",
    "Average session",
    "Latest answer accuracy",
    "Recovered",
    "Wrong answers",
    "Last practice",
  ]);
  for (const item of rows) {
    const row = make("tr");
    row.append(
      make("td", { text: lessonTitle(item.lessonId) }),
      make("td", { text: item.sessions }),
      make("td", { text: item.students.size }),
      make("td", { text: formatPercent(item.score, item.maxScore) }),
      make("td", {
        text:
          item.scoredSessions > 0
            ? `${Math.round(item.sessionPercentTotal / item.scoredSessions)}%`
            : "—",
      }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.recovered }),
      make("td", { text: item.wrong }),
      make("td", { text: formatDate(item.lastPracticedAt, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function speakingSection() {
  const section = analyticsSection(
    "Speaking practice",
    "Speaking records are separate from listening and dictation scores.",
  );
  if (!state.speaking.length) {
    section.append(analyticsEmpty("No speaking practice has been recorded yet."));
    return section;
  }
  const recognised = state.speaking.filter((item) => item.recognition_available).length;
  const strong = state.speaking.filter((item) =>
    ["great", "good"].includes(item.feedback_band),
  ).length;
  const grid = make("div", { className: "teacher-analytics-mini-grid" });
  grid.append(
    analyticsMetric("Speaking records", state.speaking.length, "All recorded practice"),
    analyticsMetric(
      "Recognition available",
      formatPercent(recognised, state.speaking.length),
      `${recognised} recognised sessions`,
    ),
    analyticsMetric(
      "Great / good",
      formatPercent(strong, state.speaking.length),
      `${strong} strong results`,
    ),
  );
  section.append(grid);
  return section;
}

function sessionsSection({ limit } = {}) {
  const section = analyticsSection(
    "Practice sessions",
    "Official first scores remain separate from later retry improvements.",
  );
  const attempts = state.attempts.slice(0, limit || 300);
  if (!attempts.length) {
    section.append(analyticsEmpty("No practice sessions have been saved yet."));
    return section;
  }
  const { table, tbody } = makeTable([
    "Student",
    "Lesson",
    "First score",
    "Accuracy",
    "Answered",
    "Wrong",
    "Mode",
    "Duration",
    "Completed",
  ]);
  for (const attempt of attempts) {
    const score =
      attempt.max_score > 0
        ? `${attempt.first_score} / ${attempt.max_score}`
        : "Practice recorded";
    const minutes = Math.floor((attempt.duration_seconds || 0) / 60);
    const seconds = (attempt.duration_seconds || 0) % 60;
    const row = make("tr");
    row.append(
      make("td", { text: profileName(attempt.user_id) }),
      make("td", { text: lessonTitle(attempt.lesson_id) }),
      make("td", { text: score }),
      make("td", { text: formatPercent(attempt.first_score, attempt.max_score) }),
      make("td", { text: `${attempt.answered_count} / ${attempt.question_count}` }),
      make("td", { text: attempt.wrong_count }),
      make("td", { text: attempt.practice_mode === "instant" ? "Instant" : "Manual" }),
      make("td", { text: `${minutes}:${String(seconds).padStart(2, "0")}` }),
      make("td", { text: formatDate(attempt.completed_at, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function renderActivity() {
  const questionStats = buildQuestionAnalytics();
  const formatStats = buildFormatAnalytics(questionStats);
  const lessonStats = buildLessonAnalytics();
  const firstScored = state.answers.filter(
    (answer) => typeof answer.first_is_correct === "boolean",
  );
  const latestScored = state.answers.filter(
    (answer) => typeof answer.latest_is_correct === "boolean",
  );
  const firstCorrect = firstScored.filter((answer) => answer.first_is_correct).length;
  const latestCorrect = latestScored.filter((answer) => answer.latest_is_correct).length;
  const initiallyWrong = firstScored.filter(
    (answer) => answer.first_is_correct === false,
  );
  const recovered = initiallyWrong.filter(
    (answer) => answer.latest_is_correct === true,
  ).length;
  const analyticsQuestionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const listeningAnswers = state.answers.filter((answer) => {
    const question = analyticsQuestionMap.get(answer.question_id);
    return (
      ["listenChoice", "listenType"].includes(question?.format) &&
      typeof answer.first_is_correct === "boolean"
    );
  });
  const listeningCorrect = listeningAnswers.filter(
    (answer) => answer.first_is_correct === true,
  ).length;

  const wrap = make("div", { className: "teacher-analytics" });
  const heading = make("div", { className: "teacher-analytics-heading" });
  heading.append(
    make("div", { text: "Learning insights" }),
    make("p", {
      text: "RLS-protected answer records, attempts, speaking, and phrase activity.",
    }),
  );
  wrap.append(heading);

  const metrics = make("section", { className: "teacher-analytics-metrics" });
  metrics.append(
    analyticsMetric(
      "First-answer accuracy",
      formatPercent(firstCorrect, firstScored.length),
      `${firstScored.length} scored answers`,
    ),
    analyticsMetric(
      "Latest accuracy",
      formatPercent(latestCorrect, latestScored.length),
      "After any retries",
    ),
    analyticsMetric(
      "Recovered on retry",
      formatPercent(recovered, initiallyWrong.length),
      `${recovered} corrected after a miss`,
    ),
    analyticsMetric(
      "Listening first accuracy",
      formatPercent(listeningCorrect, listeningAnswers.length),
      `${listeningAnswers.length} listening answers`,
    ),
    analyticsMetric(
      "Speaking records",
      state.speaking.length,
      "Pronunciation practice",
    ),
    analyticsMetric(
      "Phrase repetitions",
      state.phrases.reduce((sum, item) => sum + Number(item.practice_count || 0), 0),
      `${state.phrases.filter((item) => item.is_favorite).length} favourites`,
    ),
  );
  wrap.append(metrics);

  const views = [
    ["overview", "Overview"],
    ["questions", "Question mistakes"],
    ["formats", "Weak formats"],
    ["listening", "Listening & dictation"],
    ["retries", "Retry detail"],
    ["lessons", "Lesson scores"],
    ["sessions", "Sessions"],
  ];
  const tabs = make("div", { className: "teacher-tabs teacher-analytics-tabs" });
  tabs.setAttribute("role", "tablist");
  for (const [value, label] of views) {
    const button = make("button", { type: "button", text: label });
    button.classList.toggle("active", state.analyticsView === value);
    button.setAttribute("aria-pressed", String(state.analyticsView === value));
    button.addEventListener("click", () => {
      state.analyticsView = value;
      renderActivity();
    });
    tabs.append(button);
  }
  wrap.append(tabs);

  const content = make("div", { className: "teacher-analytics-content" });
  if (state.analyticsView === "overview") {
    content.append(
      questionMistakesSection(questionStats, { limit: 8 }),
      formatsSection(formatStats),
      lessonsSection(lessonStats, { limit: 8 }),
      sessionsSection({ limit: 12 }),
    );
  }
  if (state.analyticsView === "questions") {
    content.append(questionMistakesSection(questionStats));
  }
  if (state.analyticsView === "formats") {
    content.append(formatsSection(formatStats));
  }
  if (state.analyticsView === "listening") {
    const listeningQuestionStats = questionStats.filter((item) =>
      ["listenChoice", "listenType"].includes(item.format),
    );
    content.append(
      formatsSection(formatStats, { listeningOnly: true }),
      questionMistakesSection(listeningQuestionStats),
      speakingSection(),
    );
  }
  if (state.analyticsView === "retries") content.append(retriesSection());
  if (state.analyticsView === "lessons") content.append(lessonsSection(lessonStats));
  if (state.analyticsView === "sessions") content.append(sessionsSection());
  wrap.append(content);
  elements.panel.replaceChildren(wrap);
}

function renderActiveTab() {
  for (const button of elements.tabs) {
    button.classList.toggle("active", button.dataset.teacherTab === state.tab);
  }
  if (state.tab === "drafts" || state.tab === "lessons") renderLessons(state.tab);
  if (state.tab === "students") renderStudents();
  if (state.tab === "activity") renderActivity();
}

function orderedQuestions() {
  return [...state.questions].sort(
    (left, right) =>
      Number(left.position || 0) - Number(right.position || 0) ||
      left.stable_key.localeCompare(right.stable_key),
  );
}

function activeQuestionCount() {
  return state.questions.filter((question) => question.active).length;
}

function syncQuestionCountToLesson() {
  const lesson = state.lessons.find((item) => item.id === state.questionLesson?.id);
  if (lesson) lesson.review_questions = [{ count: state.questions.length }];
}

function questionPrompt(question) {
  const payload = question.payload && typeof question.payload === "object" ? question.payload : {};
  return bilingualValue(payload.prompt, payload.promptJa || payload.promptJP || "");
}

function renderQuestionManager() {
  const lesson = state.questionLesson;
  if (!lesson) return;
  const questions = orderedQuestions();
  const active = activeQuestionCount();
  elements.questionManagerHeading.textContent = lesson.title_en;
  elements.questionManagerMeta.textContent =
    `${formatDate(lesson.lesson_date)} · ${statusLabel(lesson.status)} · ` +
    `${active} active · ${questions.length - active} inactive`;

  if (!questions.length) {
    elements.questionManagerPanel.replaceChildren(
      make("p", {
        text: "No questions yet. Add the first question, then preview and publish the lesson.",
      }),
    );
    return;
  }

  const { table, tbody } = makeTable([
    "Order",
    "Question",
    "Section",
    "Format",
    "State",
    "Actions",
  ]);
  questions.forEach((question, index) => {
    const prompt = questionPrompt(question);
    const questionCell = make("td");
    questionCell.append(make("strong", { text: prompt.en || "Untitled question" }));
    if (prompt.jp) questionCell.append(make("br"), make("small", { text: prompt.jp }));
    questionCell.append(make("br"), make("small", { text: question.stable_key }));

    const actions = make("td", { className: "table-actions" });
    const up = makeAction("↑", () => moveQuestion(question, -1, up), "Move up");
    const down = makeAction("↓", () => moveQuestion(question, 1, down), "Move down");
    up.disabled = index === 0 || state.questionLoading;
    down.disabled = index === questions.length - 1 || state.questionLoading;
    const edit = makeAction("Edit", () => openQuestionEditor(question));
    const toggle = makeAction(
      question.active ? "Mark inactive" : "Restore",
      () => setQuestionActive(question, !question.active, toggle),
      question.active
        ? "Keep the question for records but remove it from learner practice"
        : "Return this question to learner practice",
    );
    actions.append(up, down, edit, toggle);

    const status = make("span", {
      className: `status-dot${question.active ? " published" : ""}`,
      text: question.active ? "Active" : "Inactive",
    });
    const row = make("tr");
    row.append(
      make("td", { text: index + 1 }),
      questionCell,
      make("td", { text: question.section || "—" }),
      make("td", { text: formatQuestionLabel(question.format) }),
      make("td"),
      actions,
    );
    row.children[4].append(status);
    tbody.append(row);
  });
  elements.questionManagerPanel.replaceChildren(table);
}

async function loadLessonQuestions(lesson, { open = false } = {}) {
  state.questionLesson = lesson;
  state.questions = [];
  state.questionLoading = true;
  elements.questionManagerHeading.textContent = lesson.title_en;
  elements.questionManagerMeta.textContent =
    `${formatDate(lesson.lesson_date)} · ${statusLabel(lesson.status)}`;
  elements.questionManagerStatus.textContent = "Loading questions…";
  elements.questionManagerPanel.replaceChildren(make("p", { text: "Loading secure question data…" }));
  if (open && !elements.questionManager.open) elements.questionManager.showModal();

  let data;
  let error;
  try {
    ({ data, error } = await client
      .from("review_questions")
      .select(
        "id,lesson_id,stable_key,position,section,format,payload,is_original,points,active",
      )
      .eq("lesson_id", lesson.id)
      .order("position", { ascending: true })
      .order("stable_key", { ascending: true }));
  } catch (caught) {
    error = caught;
  }

  state.questionLoading = false;
  if (error) {
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The questions could not be loaded.",
    );
    elements.questionManagerPanel.replaceChildren(
      make("p", { text: "Question data is unavailable right now." }),
    );
    return false;
  }
  state.questions = Array.isArray(data) ? data : [];
  syncQuestionCountToLesson();
  elements.questionManagerStatus.textContent =
    "Changes are saved securely. Questions are never hard-deleted here.";
  renderQuestionManager();
  return true;
}

function openQuestionManager(lesson) {
  loadLessonQuestions(lesson, { open: true });
}

async function moveQuestion(question, direction, button) {
  if (state.questionLoading) return;
  const current = orderedQuestions();
  const from = current.findIndex((item) => item.id === question.id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= current.length) return;

  const moved = [...current];
  [moved[from], moved[to]] = [moved[to], moved[from]];
  state.questionLoading = true;
  button.disabled = true;
  elements.questionManagerStatus.textContent = "Saving the new order…";

  const updates = moved
    .map((item, position) => ({ item, position }))
    .filter(({ item, position }) => Number(item.position) !== position);
  let results;
  try {
    results = await Promise.all(
      updates.map(({ item, position }) =>
        client.from("review_questions").update({ position }).eq("id", item.id),
      ),
    );
  } catch (error) {
    state.questionLoading = false;
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The order could not be saved. Reload the question manager and try again.",
    );
    await loadLessonQuestions(state.questionLesson);
    return;
  }
  const failed = results.find((result) => result.error);
  if (failed) {
    elements.questionManagerStatus.textContent = readableError(
      failed.error,
      "The order could not be saved. The list has been reloaded.",
    );
    await loadLessonQuestions(state.questionLesson);
    return;
  }

  state.questions = moved.map((item, position) => ({ ...item, position }));
  state.questionLoading = false;
  elements.questionManagerStatus.textContent = "Question order saved.";
  renderQuestionManager();
}

async function setQuestionActive(question, active, button) {
  if (
    !active &&
    question.active &&
    state.questionLesson?.status === "published" &&
    activeQuestionCount() === 1
  ) {
    elements.questionManagerStatus.textContent =
      "A published lesson must keep at least one active question. Move the lesson back to Draft first.";
    return;
  }

  button.disabled = true;
  const label = button.textContent;
  button.textContent = active ? "Restoring…" : "Updating…";
  let error;
  try {
    ({ error } = await client
      .from("review_questions")
      .update({ active })
      .eq("id", question.id)
      .eq("lesson_id", state.questionLesson.id));
  } catch (caught) {
    error = caught;
  }
  button.disabled = false;
  button.textContent = label;
  if (error) {
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The question state could not be changed.",
    );
    return;
  }

  state.questions = state.questions.map((item) =>
    item.id === question.id ? { ...item, active } : item,
  );
  elements.questionManagerStatus.textContent = active
    ? "Question restored to learner practice."
    : "Question marked inactive. Its records were kept.";
  renderQuestionManager();
}

function questionAnswerExample(format) {
  return JSON.stringify(QUESTION_FORMATS[format]?.example || {}, null, 2);
}

function updateQuestionAnswerHelp({ replaceDefault = false } = {}) {
  const format = elements.questionFormat.value;
  const example = questionAnswerExample(format);
  const oldExample = elements.questionEditor.dataset.answerExample || "";
  const current = elements.questionAnswerPayload.value.trim();
  if (replaceDefault || (!elements.questionRecordId.value && (!current || current === oldExample))) {
    elements.questionAnswerPayload.value = example;
  }
  elements.questionEditor.dataset.answerExample = example;

  const extra =
    format === "speaking"
      ? " Use the dedicated speaking target fields; an empty JSON object is valid."
      : ["listenChoice", "listenType"].includes(format)
        ? " Add the sentence to the Listening audio text field."
        : "";
  elements.questionAnswerHelp.textContent =
    `${formatQuestionLabel(format)}：上の「かんたん回答設定」を使えます。詳細JSONは通常変更不要です。${extra}`;
  const choiceFormat = ["mcq", "situation", "dialogue", "listenChoice"].includes(format);
  const acceptedFormat = ["typing", "translation", "listenType", "mistake"].includes(format);
  elements.easyChoiceFields.hidden = !choiceFormat;
  elements.easyAcceptedField.hidden = !acceptedFormat;
  elements.questionAudioText.closest("label").hidden = !["listenChoice", "listenType"].includes(format);
  elements.questionSpeakText.closest("label").hidden = format !== "speaking";
  elements.questionSpeakJa.closest("label").hidden = format !== "speaking";
}

function openQuestionEditor(question = null) {
  const lesson = state.questionLesson;
  if (!lesson) return;
  elements.questionEditorForm.reset();
  elements.questionEditorStatus.textContent = "";
  elements.questionRecordId.value = question?.id || "";
  elements.questionEditorHeading.textContent = question ? "Edit question" : "Add question";

  if (!question) {
    elements.questionStableKey.value =
      `${lesson.slug}-custom-${Date.now().toString(36)}`;
    elements.questionSection.value = "Extra Practice";
    elements.questionFormat.value = "mcq";
    elements.questionPromptEn.value = "";
    elements.questionPromptJa.value = "";
    elements.easyChoiceAEn.value = "";
    elements.easyChoiceAJa.value = "";
    elements.easyChoiceBEn.value = "";
    elements.easyChoiceBJa.value = "";
    elements.easyCorrectChoice.value = "a";
    elements.easyAcceptedAnswers.value = "";
    elements.questionEditor.dataset.answerExample = "";
    updateQuestionAnswerHelp({ replaceDefault: true });
    elements.questionEditor.showModal();
    return;
  }

  const payload =
    question.payload && typeof question.payload === "object" && !Array.isArray(question.payload)
      ? question.payload
      : {};
  const format = question.format || payload.format || payload.type || "mcq";
  const prompt = bilingualValue(
    payload.prompt || (format === "typing" ? "Type this sentence in English." : ""),
    payload.promptJa || payload.promptJP || "",
  );
  const hint = bilingualValue(payload.hint, payload.hintJa || "");
  const explanation = bilingualValue(payload.explanation, payload.explanationJa || "");
  elements.questionStableKey.value = question.stable_key;
  elements.questionSection.value = question.section || payload.section || "";
  elements.questionFormat.value = format;
  elements.questionPromptEn.value = prompt.en;
  elements.questionPromptJa.value = prompt.jp;
  elements.questionHintEn.value = hint.en;
  elements.questionHintJa.value = hint.jp;
  elements.questionExplanationEn.value = explanation.en;
  elements.questionExplanationJa.value = explanation.jp;
  elements.questionAudioText.value = String(payload.audioText || "");
  elements.questionSpeakText.value = String(payload.speakText || "");
  elements.questionSpeakJa.value = String(payload.speakJa || "");
  elements.easyChoiceAEn.value = String(payload.choices?.[0]?.en || "");
  elements.easyChoiceAJa.value = String(payload.choices?.[0]?.jp || "");
  elements.easyChoiceBEn.value = String(payload.choices?.[1]?.en || "");
  elements.easyChoiceBJa.value = String(payload.choices?.[1]?.jp || "");
  elements.easyCorrectChoice.value = ["a", "b"].includes(String(payload.correct))
    ? String(payload.correct)
    : "a";
  elements.easyAcceptedAnswers.value = Array.isArray(payload.accepted)
    ? payload.accepted.join("\n")
    : "";
  elements.questionAnswerPayload.value = JSON.stringify(questionPayloadDetails(payload), null, 2);
  elements.questionEditor.dataset.answerExample = "";
  updateQuestionAnswerHelp();
  elements.questionEditor.showModal();
}

function parseQuestionDetails() {
  let details;
  try {
    details = JSON.parse(elements.questionAnswerPayload.value || "{}");
  } catch {
    throw new Error("Answer & format details must be valid JSON.");
  }
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    throw new Error("Answer & format details must be one JSON object.");
  }
  const managed = Object.keys(details).filter((key) => MANAGED_QUESTION_PAYLOAD_KEYS.has(key));
  if (managed.length) {
    throw new Error(
      `Use the dedicated fields for ${managed.join(", ")} instead of adding them to the JSON.`,
    );
  }
  return details;
}

function applyEasyAnswerFields(details, format) {
  const next = { ...details };
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(format)) {
    const first = elements.easyChoiceAEn.value.trim();
    const second = elements.easyChoiceBEn.value.trim();
    if (first || second) {
      next.choices = [
        { id: "a", en: first, jp: elements.easyChoiceAJa.value.trim() },
        { id: "b", en: second, jp: elements.easyChoiceBJa.value.trim() },
      ];
      next.correct = elements.easyCorrectChoice.value === "b" ? "b" : "a";
    }
  }
  if (["typing", "translation", "listenType", "mistake"].includes(format)) {
    const accepted = elements.easyAcceptedAnswers.value
      .split(/\n+/)
      .map((answer) => answer.trim())
      .filter(Boolean);
    if (accepted.length) next.accepted = accepted;
  }
  return next;
}

function validateQuestionDetails(format, details, fields) {
  const choiceFormats = ["mcq", "situation", "dialogue", "listenChoice"];
  if (choiceFormats.includes(format)) {
    if (!Array.isArray(details.choices) || details.choices.length < 2) {
      throw new Error("Add at least two choices to the answer JSON.");
    }
    const ids = details.choices.map((choice) => String(choice?.id ?? ""));
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
      throw new Error("Every choice needs a unique, non-empty id.");
    }
    if (!ids.includes(String(details.correct ?? ""))) {
      throw new Error("The correct value must match one of the choice ids.");
    }
  }
  if (format === "truefalse" && typeof details.correct !== "boolean") {
    throw new Error("True / false JSON needs a boolean correct value.");
  }
  if (["typing", "translation", "listenType", "mistake"].includes(format)) {
    if (
      !Array.isArray(details.accepted) ||
      !details.accepted.some((answer) => String(answer || "").trim())
    ) {
      throw new Error("Add at least one accepted answer.");
    }
  }
  if (format === "mistake" && !String(details.wrongSentence || "").trim()) {
    throw new Error("Correct-the-mistake questions need a wrongSentence value.");
  }
  if (format === "order") {
    if (!Array.isArray(details.words) || !details.words.length) {
      throw new Error("Word-order JSON needs a non-empty words array.");
    }
    const hasCorrectWords = Array.isArray(details.correctWords) && details.correctWords.length;
    const hasCorrectOrder = Array.isArray(details.correctOrder) && details.correctOrder.length;
    if (!hasCorrectWords && !hasCorrectOrder) {
      throw new Error("Word-order JSON needs correctWords or a legacy correctOrder array.");
    }
  }
  if (
    format === "matching" &&
    (!Array.isArray(details.pairs) ||
      !details.pairs.length ||
      details.pairs.some(
        (pair) => !String(pair?.en || "").trim() || !String(pair?.jp || "").trim(),
      ))
  ) {
    throw new Error("Matching JSON needs one or more English/Japanese pairs.");
  }
  if (format === "sorting") {
    if (!Array.isArray(details.categories) || !details.categories.length) {
      throw new Error("Sorting JSON needs at least one category.");
    }
    if (!Array.isArray(details.items) || !details.items.length) {
      throw new Error("Sorting JSON needs at least one item.");
    }
    const categories = new Set(details.categories.map(String));
    const invalidItem = details.items.find((item) => {
      const text = Array.isArray(item) ? item[0] : item?.text ?? item?.en;
      const category = Array.isArray(item) ? item[1] : item?.category ?? item?.correct;
      return !String(text || "").trim() || !categories.has(String(category ?? ""));
    });
    if (invalidItem) {
      throw new Error("Every sorting item needs text and one of the listed categories.");
    }
  }
  if (
    format === "grid" &&
    ![
      "top-left",
      "top-center",
      "top-right",
      "middle-left",
      "center",
      "middle-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ].includes(details.correctCell)
  ) {
    throw new Error("Choose a valid position-grid correctCell value.");
  }
  if (["listenChoice", "listenType"].includes(format) && !fields.audioText) {
    throw new Error("Listening questions need Listening audio text.");
  }
  if (format === "speaking" && !fields.speakText) {
    throw new Error("Speaking questions need an English speaking target.");
  }
}

function buildQuestionPayload(question, stableKey, section, format, details, fields) {
  const payload = {
    ...details,
    id: stableKey,
    format,
    type: format,
    section,
    prompt: { en: fields.promptEn, jp: fields.promptJa },
    hint: { en: fields.hintEn, jp: fields.hintJa },
    explanation: { en: fields.explanationEn, jp: fields.explanationJa },
    isOriginal: question ? question.is_original !== false : false,
  };
  if (fields.audioText) payload.audioText = fields.audioText;
  if (fields.speakText) payload.speakText = fields.speakText;
  if (fields.speakJa) payload.speakJa = fields.speakJa;
  return payload;
}

async function saveQuestion(event) {
  event.preventDefault();
  if (state.questionSaving || !state.questionLesson) return;
  const recordId = elements.questionRecordId.value;
  const existing = state.questions.find((question) => question.id === recordId) || null;
  const stableKey = elements.questionStableKey.value.trim();
  const section = elements.questionSection.value.trim();
  const format = elements.questionFormat.value;
  const fields = {
    promptEn: elements.questionPromptEn.value.trim(),
    promptJa: elements.questionPromptJa.value.trim(),
    hintEn: elements.questionHintEn.value.trim(),
    hintJa: elements.questionHintJa.value.trim(),
    explanationEn: elements.questionExplanationEn.value.trim(),
    explanationJa: elements.questionExplanationJa.value.trim(),
    audioText: elements.questionAudioText.value.trim(),
    speakText: elements.questionSpeakText.value.trim(),
    speakJa: elements.questionSpeakJa.value.trim(),
  };

  try {
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(stableKey)) {
      throw new Error(
        "Use letters, numbers, dots, underscores, colons, or hyphens in the stable key.",
      );
    }
    if (stableKey.length > 180) throw new Error("Keep the stable key under 181 characters.");
    if (
      state.questions.some(
        (question) => question.id !== recordId && question.stable_key === stableKey,
      )
    ) {
      throw new Error("That stable key is already used in this lesson.");
    }
    if (!fields.promptEn) throw new Error("Add the English prompt.");
    const details = applyEasyAnswerFields(parseQuestionDetails(), format);
    validateQuestionDetails(format, details, fields);
    const payload = buildQuestionPayload(
      existing,
      stableKey,
      section,
      format,
      details,
      fields,
    );
    if (
      state.questionLesson.status === "published" &&
      !window.confirm(
        "This lesson is published. Saving this question will update live learner practice now. Continue?",
      )
    ) {
      return;
    }
    const row = {
      stable_key: stableKey,
      section: section || null,
      format,
      payload,
      points: questionPoints(payload),
    };

    state.questionSaving = true;
    const submit = elements.questionEditorForm.querySelector("button[type='submit']");
    submit.disabled = true;
    elements.questionEditorStatus.textContent = "Saving question…";
    let result;
    if (existing) {
      result = await client
        .from("review_questions")
        .update(row)
        .eq("id", existing.id)
        .eq("lesson_id", state.questionLesson.id);
    } else {
      result = await client.from("review_questions").insert({
        ...row,
        lesson_id: state.questionLesson.id,
        position:
          state.questions.reduce(
            (maximum, question) => Math.max(maximum, Number(question.position)),
            -1,
          ) + 1,
        is_original: false,
        active: true,
      });
    }
    if (result.error) throw result.error;

    elements.questionEditor.close();
    showToast(existing ? "Question updated." : "Question added.");
    await loadLessonQuestions(state.questionLesson);
  } catch (error) {
    elements.questionEditorStatus.textContent = readableError(
      error,
      error?.message || "The question could not be saved.",
    );
  } finally {
    state.questionSaving = false;
    const submit = elements.questionEditorForm.querySelector("button[type='submit']");
    if (submit) submit.disabled = false;
  }
}

async function countActiveQuestionsForLesson(lessonId) {
  const { count, error } = await client
    .from("review_questions")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("active", true);
  if (error) throw error;
  return Number(count || 0);
}

function openEditor(lesson = null) {
  elements.editorForm.reset();
  elements.editorMessage.textContent = "";
  elements.editorId.value = lesson?.id || "";
  elements.editorHeading.textContent = lesson ? "Edit lesson" : "New draft lesson";
  elements.editorTitle.value = lesson?.title_en || "";
  elements.editorDate.value = lesson?.lesson_date || new Date().toISOString().slice(0, 10);
  elements.editorStatus.value = lesson?.status || "draft";
  elements.editorAudience.value = lesson?.audience || "both";
  elements.editorSummary.value = lesson?.summary_en || "";
  elements.editor.showModal();
}

function previewLesson(lesson) {
  const url = new URL("/lesson.html", window.location.origin);
  url.searchParams.set("id", lesson.slug);
  url.searchParams.set("preview", "1");
  window.open(url.href, "_blank", "noopener,noreferrer");
}

async function archiveLesson(lesson) {
  const confirmed = window.confirm(
    `Archive “${lesson.title_en}”? It will be hidden, but its content and student records will be kept.`,
  );
  if (!confirmed) return;
  const { error } = await client
    .from("review_lessons")
    .update({ status: "archived" })
    .eq("id", lesson.id);
  if (error) {
    showToast(readableError(error, "The lesson could not be archived."), "error");
    return;
  }
  showToast("Lesson archived. Nothing was deleted.");
  await refreshDashboard();
}

async function saveLesson(event) {
  event.preventDefault();
  const id = elements.editorId.value;
  const status = elements.editorStatus.value;
  if (status === "published") {
    if (!id) {
      elements.editorMessage.textContent =
        "Save this as a draft first, add at least one question, then publish it.";
      return;
    }
    elements.editorMessage.textContent = "Checking active questions…";
    try {
      const active = await countActiveQuestionsForLesson(id);
      if (!active) {
        elements.editorMessage.textContent =
          "Add and activate at least one question before publishing this lesson.";
        return;
      }
    } catch (error) {
      elements.editorMessage.textContent = readableError(
        error,
        "Active questions could not be verified, so the lesson was not published.",
      );
      return;
    }
    if (!window.confirm("Publish this lesson to its selected audience now?")) return;
  }

  const title = elements.editorTitle.value.trim();
  const lessonDate = elements.editorDate.value;
  const payload = {
    title_en: title,
    lesson_date: lessonDate,
    status,
    audience: elements.editorAudience.value,
    summary_en: elements.editorSummary.value.trim() || null,
  };

  if (!title || !lessonDate) {
    elements.editorMessage.textContent = "Add a title and lesson date.";
    return;
  }

  elements.editorMessage.textContent = "Saving…";
  let result;
  if (id) {
    result = await client.from("review_lessons").update(payload).eq("id", id);
  } else {
    payload.slug = `custom-${lessonDate}-${Date.now().toString(36)}`;
    payload.source_type = "manual";
    payload.created_by = state.session.user.id;
    result = await client.from("review_lessons").insert(payload);
  }

  if (result.error) {
    elements.editorMessage.textContent = readableError(
      result.error,
      "The lesson could not be saved.",
    );
    return;
  }
  elements.editor.close();
  showToast(status === "published" ? "Lesson published." : "Lesson saved privately.");
  await refreshDashboard();
}

async function assignLesson(studentId, lessonId, button) {
  button.disabled = true;
  button.textContent = "Assigning…";
  const { error } = await client.from("review_assignments").upsert(
    {
      lesson_id: lessonId,
      student_id: studentId,
      assigned_by: state.session.user.id,
      status: "assigned",
    },
    { onConflict: "lesson_id,student_id" },
  );
  button.disabled = false;
  button.textContent = "Assign";
  if (error) {
    showToast(readableError(error, "The lesson could not be assigned."), "error");
    return;
  }
  showToast("Assignment saved.");
  await refreshDashboard();
}

function bundledLessonRow(lesson, status, audience, sourceType) {
  const isLegacy = sourceType === "legacy_zip";
  return {
    slug: lesson.id,
    lesson_date: lesson.lessonDate,
    title_en: lesson.title,
    title_ja: lesson.takiTitle || lesson.titleJa || null,
    summary_en: lesson.summary || null,
    summary_ja: lesson.summaryJa || null,
    status,
    audience,
    source_type: sourceType,
    source_notion_page_id: lesson.sourceNotionPageId || null,
    source_notion_url: lesson.sourceNotionUrl || null,
    content_version: lesson.contentVersion || 1,
    content: {
      bundled: true,
      themes: lesson.themes || [],
      phrases: lesson.phrases || [],
      categoryLabels: lesson.categoryLabels || {},
      originalQuestionCount: isLegacy ? lesson.originalQuestionCount : 0,
    },
  };
}

function questionPoints(question) {
  if (question.type === "matching" || question.format === "matching") {
    return Math.max(1, question.pairs?.length || 1);
  }
  if (question.type === "sorting" || question.format === "sorting") {
    return Math.max(1, question.items?.length || 1);
  }
  return 1;
}

async function upsertLessonBundle(lesson, questions, defaults) {
  const row = bundledLessonRow(lesson, defaults.status, defaults.audience, defaults.sourceType);
  let existing = null;
  if (row.source_type === "notion") {
    const lookup = await client
      .from("review_lessons")
      .select("id, status, audience")
      .eq("source_type", "notion")
      .eq("source_notion_page_id", row.source_notion_page_id)
      .maybeSingle();
    if (lookup.error) throw lookup.error;
    existing = lookup.data;
  } else {
    const lookup = await client
      .from("review_lessons")
      .select("id, status, audience")
      .eq("slug", row.slug)
      .maybeSingle();
    if (lookup.error) throw lookup.error;
    existing = lookup.data;
  }

  let lessonRecord;
  if (existing) {
    // A reviewed Notion lesson keeps the teacher's current status and audience.
    delete row.status;
    delete row.audience;
    const update = await client
      .from("review_lessons")
      .update(row)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (update.error) throw update.error;
    lessonRecord = update.data;
  } else {
    const insert = await client.from("review_lessons").insert(row).select("id").single();
    if (insert.error) throw insert.error;
    lessonRecord = insert.data;
  }

  const records = questions.map((question, index) => ({
    lesson_id: lessonRecord.id,
    stable_key: question.id,
    position: index,
    section: question.section || null,
    format: question.format || question.type,
    payload: question,
    is_original: Boolean(question.isOriginal),
    points: questionPoints(question),
    active: true,
  }));

  for (let start = 0; start < records.length; start += 100) {
    const batch = records.slice(start, start + 100);
    const { error } = await client
      .from("review_questions")
      .upsert(batch, { onConflict: "lesson_id,stable_key" });
    if (error) throw error;
  }
}

async function syncBundledContent(button) {
  if (state.syncing) return;
  const confirmed = window.confirm(
    "Refresh the six published legacy lessons and their 221 activities? Private Notion drafts are installed securely by the database migration and are never included in the public website bundle.",
  );
  if (!confirmed) return;

  state.syncing = true;
  button.disabled = true;
  const originalText = button.textContent;
  try {
    const [legacyResponse, additionsResponse] = await Promise.all([
      fetch("/src/data/legacy-lessons.json"),
      fetch("/src/data/legacy-additions.json"),
    ]);
    if (![legacyResponse, additionsResponse].every((response) => response.ok)) {
      throw new Error("Bundled content files could not be loaded.");
    }
    const [legacy, additions] = await Promise.all([
      legacyResponse.json(),
      additionsResponse.json(),
    ]);

    let completed = 0;
    const total = legacy.length;
    for (const lesson of legacy) {
      button.textContent = `Syncing ${completed + 1} / ${total}`;
      await upsertLessonBundle(lesson, [...lesson.questions, ...(additions[lesson.id] || [])], {
        status: "published",
        audience: "both",
        sourceType: "legacy_zip",
      });
      completed += 1;
    }
    showToast("The six published lessons and activities are now in sync.");
    await refreshDashboard();
  } catch (error) {
    showToast(readableError(error, "Bundled content could not be synced."), "error");
  } finally {
    state.syncing = false;
    button.disabled = false;
    button.textContent = originalText;
  }
}

function addSyncButton() {
  if (!elements.newLesson || document.querySelector("#syncBundledContent")) return;
  const button = make("button", {
    className: "secondary-btn",
    text: "Sync bundled content / 初期データ再同期",
    type: "button",
    title: "保守用：コードに同梱された6件の初期レッスンを再同期します",
  });
  button.id = "syncBundledContent";
  button.addEventListener("click", () => syncBundledContent(button));
  elements.newLesson.before(button);
}

async function initialise() {
  if (!client) {
    showLogin("The secure connection library could not be loaded.");
    return;
  }

  addSyncButton();
  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.loginStatus.textContent = "Signing in…";
    const { data, error } = await signInTeacher(
      elements.email.value.trim(),
      elements.password.value,
    );
    if (error) {
      showLogin(readableError(error, "Sign-in failed."));
      return;
    }
    await enterStudio(data.session);
  });

  elements.logout.addEventListener("click", async () => {
    await signOutTeacher();
    showLogin("Signed out safely.");
  });

  for (const button of elements.tabs) {
    button.addEventListener("click", () => {
      state.tab = button.dataset.teacherTab;
      renderActiveTab();
    });
  }

  elements.newLesson.addEventListener("click", () => openEditor());
  elements.editorForm.addEventListener("submit", saveLesson);
  elements.preview.addEventListener("click", () => {
    const lesson = state.lessons.find((item) => item.id === elements.editorId.value);
    if (lesson) previewLesson(lesson);
    else elements.editorMessage.textContent = "Save the draft before previewing it.";
  });
  elements.newQuestion.addEventListener("click", () => openQuestionEditor());
  elements.previewQuestions.addEventListener("click", () => {
    if (!state.questionLesson) return;
    if (!activeQuestionCount()) {
      elements.questionManagerStatus.textContent =
        "Activate at least one question before opening the learner preview.";
      return;
    }
    previewLesson(state.questionLesson);
  });
  elements.questionFormat.addEventListener("change", () => updateQuestionAnswerHelp());
  elements.questionTemplate.addEventListener("click", () => {
    updateQuestionAnswerHelp({ replaceDefault: true });
    const format = elements.questionFormat.value;
    if (["mcq", "situation", "dialogue", "listenChoice"].includes(format)) {
      elements.easyChoiceAEn.value ||= "Natural answer";
      elements.easyChoiceAJa.value ||= "自然な答え";
      elements.easyChoiceBEn.value ||= "Other answer";
      elements.easyChoiceBJa.value ||= "別の答え";
      elements.easyChoiceAEn.focus();
    } else if (["typing", "translation", "listenType", "mistake"].includes(format)) {
      elements.easyAcceptedAnswers.value ||= "Natural English answer";
      elements.easyAcceptedAnswers.focus();
    } else if (format === "speaking") {
      elements.questionSpeakText.focus();
    }
    elements.questionEditorStatus.textContent =
      "ひな形を入れました。サンプル英文を実際の問題内容に書き換えてください。";
  });
  elements.questionEditorForm.addEventListener("submit", saveQuestion);
  elements.cancelQuestion.addEventListener("click", () => elements.questionEditor.close());
  elements.questionManager.addEventListener("close", () => {
    renderActiveTab();
  });

  const session = await getTeacherSession();
  if (!session) {
    showLogin();
  } else {
    await enterStudio(session);
  }

  onTeacherAuthChange((session, event) => {
    if (event === "SIGNED_OUT") showLogin();
    if (event === "TOKEN_REFRESHED" && session) state.session = session;
  });
}

initialise();
