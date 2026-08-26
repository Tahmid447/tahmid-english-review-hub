import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEEP_LESSON_GUIDES } from "../src/lesson-guides.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, "src/data", name), "utf8"));
const legacy = read("legacy-lessons.json");
const additions = read("legacy-additions.json");
const drafts = read("notion-drafts.json");
const lessons = [
  ...legacy.map((lesson) => ({ ...lesson, questions: [...(lesson.questions || []), ...(additions[lesson.id] || [])] })),
  ...drafts,
];

const hasGuideTarget = (question) => {
  const format = question.format || question.type;
  if (format === "matching") return (question.pairs || []).every((pair) => pair.en && pair.jp);
  if (format === "sorting") return (question.items || []).every((item) => (Array.isArray(item) ? item[0] : item.en));
  if (format === "grid") return Boolean(question.correctCell);
  if (format === "truefalse") return Boolean(question.prompt);
  if (question.speakText || question.audioText || question.accepted?.[0] || question.correctWords?.length || question.correctOrder?.length) return true;
  if (question.correct != null) return (question.choices || []).some((choice) => String(choice.id) === String(question.correct));
  return false;
};

assert.equal(lessons.length, 17, "The lesson guide audit covers all 17 lessons.");
let totalQuestions = 0;
for (const lesson of lessons) {
  const guide = DEEP_LESSON_GUIDES[lesson.id];
  assert(guide, `${lesson.id}: detailed guide is present.`);
  assert(guide.points.length >= 3, `${lesson.id}: at least three beginner-friendly key points are present.`);
  assert(guide.corrections.length >= 2, `${lesson.id}: at least two natural corrections are present.`);
  assert(guide.takeaway?.[0] && guide.takeaway?.[1], `${lesson.id}: bilingual takeaway is present.`);
  const questions = lesson.questions || [];
  assert(questions.length > 0, `${lesson.id}: questions are present.`);
  const missing = questions.filter((question) => !hasGuideTarget(question));
  assert.deepEqual(missing.map(({ id }) => id), [], `${lesson.id}: every question can contribute a model answer to the Practice map.`);
  totalQuestions += questions.length;
}

assert.equal(totalQuestions, 616, "The Practice-map audit covers all 616 activities.");
console.log(`Lesson guide coverage passed: 17 lessons, ${totalQuestions} activities, no model-answer gaps.`);
