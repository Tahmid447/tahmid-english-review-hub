import { normalizeAnswerText } from "./store.js?v=20260906-studio1";

export const QUESTION_FORMATS = Object.freeze([
  "mcq",
  "situation",
  "dialogue",
  "truefalse",
  "typing",
  "translation",
  "listenType",
  "listenChoice",
  "speaking",
  "mistake",
  "order",
  "matching",
  "sorting",
  "grid",
]);

const quickPracticeFamily = (question) => {
  const format = String(question?.format || question?.type || "unknown");
  const section = String(question?.section || "").trim().toLowerCase();
  if (
    section.includes("visual")
    || section === "see it"
    || Boolean(question?.image)
    || Boolean(question?.imagePanel)
  ) return "visual";
  if (["listenChoice", "listenType"].includes(format)) return "listening";
  if (format === "speaking") return "speaking";
  if (["typing", "translation", "order"].includes(format)) return "production";
  if (["matching", "sorting", "grid"].includes(format)) return "interactive";
  return "understanding";
};

const STORYBOARD_PANELS = Object.freeze({
  1: Object.freeze({ column: 0, row: 0 }),
  2: Object.freeze({ column: 1, row: 0 }),
  3: Object.freeze({ column: 2, row: 0 }),
  4: Object.freeze({ column: 0, row: 1 }),
  5: Object.freeze({ column: 1, row: 1 }),
});

export function storyboardPanelLayout(imagePanel) {
  const panel = Number(imagePanel);
  const position = Number.isInteger(panel) ? STORYBOARD_PANELS[panel] : null;
  return position ? { panel, ...position } : null;
}

export function gridCellDisplay(question, cell, showJapanese = false) {
  const value = question?.gridCells && typeof question.gridCells === "object"
    ? question.gridCells[cell]
    : null;
  if (value && typeof value === "object") {
    const english = String(value.en || value.english || "").trim();
    const japanese = String(value.jp || value.ja || value.japanese || "").trim();
    return {
      primary: english || japanese,
      secondary: showJapanese && english && japanese ? japanese : "",
    };
  }
  return { primary: String(value || "").trim(), secondary: "" };
}

export function selectQuickPracticeIds(questions, orderedIds = [], limit = 8) {
  const byId = new Map((Array.isArray(questions) ? questions : []).map((question) => [String(question.id), question]));
  const preferredOrder = [...new Set([
    ...(Array.isArray(orderedIds) ? orderedIds : []).map(String),
    ...byId.keys(),
  ])];
  const candidates = preferredOrder.map((id) => byId.get(id)).filter(Boolean);
  const target = Math.max(1, Math.min(Number(limit) || 8, candidates.length));
  const selected = [];
  const selectedIds = new Set();
  ["understanding", "listening", "speaking", "production", "visual", "interactive"].forEach((family) => {
    const question = candidates.find((candidate) => (
      !selectedIds.has(String(candidate.id)) && quickPracticeFamily(candidate) === family
    ));
    if (question && selected.length < target) {
      selected.push(String(question.id));
      selectedIds.add(String(question.id));
    }
  });
  candidates.forEach((question) => {
    const id = String(question.id);
    if (selected.length < target && !selectedIds.has(id)) {
      selected.push(id);
      selectedIds.add(id);
    }
  });
  return selected;
}

const hasText = (value) => String(value ?? "").trim().length > 0;

export function answerExists(question, answer) {
  if (answer === false || answer === true) return true;
  if (answer == null) return false;
  if (typeof answer === "string") return hasText(answer);
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === "object") {
    if (question?.format === "speaking") {
      return hasText(answer.transcript) || answer.selfPractised === true;
    }
    return Object.values(answer).some(hasText);
  }
  return false;
}

export function isAnswerGradeable(question, answer) {
  if (!question || !answerExists(question, answer)) return false;
  if (question.format === "order") {
    const words = Array.isArray(question.words) ? question.words : [];
    if (!words.length || !Array.isArray(answer) || answer.length !== words.length) return false;
    const indexes = answer.map(Number);
    return indexes.every((index) => Number.isInteger(index) && index >= 0 && index < words.length)
      && new Set(indexes).size === words.length;
  }
  if (question.format === "matching") {
    const pairs = Array.isArray(question.pairs) ? question.pairs : [];
    return pairs.length > 0 && pairs.every((pair) => hasText(answer?.[pair.id]));
  }
  if (question.format === "sorting") {
    const items = Array.isArray(question.sortingItems) ? question.sortingItems : [];
    return items.length > 0 && items.every((item) => hasText(answer?.[item.id]));
  }
  return true;
}

const cloneAnswer = (answer) => {
  if (answer == null) return answer;
  if (typeof structuredClone === "function") return structuredClone(answer);
  return JSON.parse(JSON.stringify(answer));
};

const snapshotResult = (result = {}) => ({
  ...result,
  answer: cloneAnswer(result.answer),
});

export function gradeQuestionAnswer(question, answer, checkedAt = new Date().toISOString()) {
  if (!isAnswerGradeable(question, answer)) return null;
  const max = Number(question.maxPoints || 1);
  let score = 0;
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(question.format)) {
    score = String(answer) === String(question.correct) ? 1 : 0;
  } else if (question.format === "truefalse") {
    score = answer === Boolean(question.correct) ? 1 : 0;
  } else if (["typing", "translation", "listenType", "mistake"].includes(question.format)) {
    const normalized = normalizeAnswerText(answer);
    score = (question.accepted || []).some(
      (accepted) => normalizeAnswerText(accepted) === normalized,
    ) ? 1 : 0;
  } else if (question.format === "order") {
    const sentence = answer.map((tokenIndex) => question.words[Number(tokenIndex)]).join(" ");
    score = normalizeAnswerText(sentence) === normalizeAnswerText((question.correctWords || []).join(" "))
      ? 1
      : 0;
  } else if (question.format === "matching") {
    score = question.pairs.reduce((total, pair) => (
      String(answer?.[pair.id] || "") === String(pair.jp) ? total + 1 : total
    ), 0);
  } else if (question.format === "sorting") {
    score = question.sortingItems.reduce((total, item) => (
      String(answer?.[item.id] || "") === String(item.category) ? total + 1 : total
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
    answer: cloneAnswer(answer),
    checkedAt,
  };
}

export function calculateOfficialTotals(questions = [], official = {}) {
  const totals = {
    score: 0,
    max: 0,
    availableMax: 0,
    checked: 0,
    wrong: 0,
  };
  const questionIds = new Set();
  questions.forEach((question) => {
    const questionId = String(question?.id ?? "");
    if (!questionId || questionIds.has(questionId)) return;
    questionIds.add(questionId);
    const result = official?.[questionId];
    const suppliedMax = Number(question.maxPoints);
    const questionMax = Number.isFinite(suppliedMax) && suppliedMax > 0 ? suppliedMax : 1;
    totals.availableMax += questionMax;
    if (!result) return;
    const suppliedScore = Number(result.score);
    const score = Number.isFinite(suppliedScore)
      ? Math.min(questionMax, Math.max(0, suppliedScore))
      : 0;
    totals.score += score;
    // The denominator belongs to the unique checked question, never to the
    // number of attempts. Use the current question definition instead of a
    // mutable or stale persisted result.max value.
    totals.max += questionMax;
    totals.checked += 1;
    if (score < questionMax) {
      totals.wrong += 1;
    }
  });
  return totals;
}

export function preserveFirstResult(official, retryAttempts, questionId, result, limit = 20) {
  const firstAttempt = !official[questionId];
  if (firstAttempt) {
    // Keep the official first result isolated from the live run result. The
    // latter is replaced during retries and must never be able to mutate the
    // score that was first recorded.
    official[questionId] = snapshotResult(result);
  } else {
    const retries = Array.isArray(retryAttempts[questionId])
      ? retryAttempts[questionId]
      : [];
    retryAttempts[questionId] = [...retries, snapshotResult(result)]
      .slice(-Math.max(1, Number(limit || 20)));
  }
  return firstAttempt;
}
