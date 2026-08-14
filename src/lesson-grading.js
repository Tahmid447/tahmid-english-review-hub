import { normalizeAnswerText } from "./store.js";

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
  if (typeof structuredClone === "function") return structuredClone(answer);
  return JSON.parse(JSON.stringify(answer));
};

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
  return questions.reduce((totals, question) => {
    const result = official?.[question.id];
    totals.availableMax += Number(question.maxPoints || 1);
    if (!result) return totals;
    totals.score += Number(result.score || 0);
    totals.max += Number(result.max || question.maxPoints || 1);
    totals.checked += 1;
    if (Number(result.score || 0) < Number(result.max || question.maxPoints || 1)) {
      totals.wrong += 1;
    }
    return totals;
  }, {
    score: 0,
    max: 0,
    availableMax: 0,
    checked: 0,
    wrong: 0,
  });
}

export function preserveFirstResult(official, retryAttempts, questionId, result, limit = 20) {
  const firstAttempt = !official[questionId];
  if (firstAttempt) {
    official[questionId] = result;
  } else {
    const retries = Array.isArray(retryAttempts[questionId])
      ? retryAttempts[questionId]
      : [];
    retryAttempts[questionId] = [...retries, result].slice(-Math.max(1, Number(limit || 20)));
  }
  return firstAttempt;
}
