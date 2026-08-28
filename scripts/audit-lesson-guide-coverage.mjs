import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeQuestion } from "../src/data.js";
import { DEEP_LESSON_GUIDES } from "../src/lesson-guides.js";
import {
  buildPracticeMapTargets,
  isHumanReadableModelTarget,
  practiceMapTargetsForQuestion,
} from "../src/lesson-guide-targets.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, "src/data", name), "utf8"));
const legacy = read("legacy-lessons.json");
const additions = read("legacy-additions.json");
const drafts = read("notion-drafts.json");
const lessons = [
  ...legacy.map((lesson) => ({ ...lesson, questions: [...(lesson.questions || []), ...(additions[lesson.id] || [])] })),
  ...drafts,
];

const assertReadableTargets = (targets, label) => {
  assert(targets.length > 0, `${label}: contributes at least one Practice-map target.`);
  targets.forEach((target, index) => {
    assert.equal(typeof target.en, "string", `${label} target ${index + 1}: English is a string.`);
    assert(isHumanReadableModelTarget(target.en), `${label} target ${index + 1}: English is human-readable.`);
    assert(/[A-Za-z]/.test(target.en), `${label} target ${index + 1}: English contains readable Latin text.`);
    assert(!/\[object\s+(?:Object|Array)\]/i.test(`${target.en} ${target.jp}`), `${label} target ${index + 1}: no object coercion is visible.`);
  });
};

const expectedLessonCount = legacy.length + drafts.length;
const expectedQuestionCount = lessons.reduce((sum, lesson) => sum + (lesson.questions || []).length, 0);
assert.equal(lessons.length, expectedLessonCount, "The lesson guide audit covers every bundled lesson.");
let totalQuestions = 0;
let totalTargets = 0;
for (const lesson of lessons) {
  const guide = DEEP_LESSON_GUIDES[lesson.id];
  assert(guide, `${lesson.id}: detailed guide is present.`);
  assert(guide.points.length >= 3, `${lesson.id}: at least three beginner-friendly key points are present.`);
  assert(guide.corrections.length >= 2, `${lesson.id}: at least two natural corrections are present.`);
  assert(guide.takeaway?.[0] && guide.takeaway?.[1], `${lesson.id}: bilingual takeaway is present.`);
  const questions = lesson.questions || [];
  assert(questions.length > 0, `${lesson.id}: questions are present.`);
  questions.forEach((question, index) => {
    assertReadableTargets(
      practiceMapTargetsForQuestion(question),
      `${lesson.id}/${question.id || `question-${index + 1}`} raw payload`,
    );
    assertReadableTargets(
      practiceMapTargetsForQuestion(normalizeQuestion(question, lesson.id, index)),
      `${lesson.id}/${question.id || `question-${index + 1}`} normalized payload`,
    );
  });
  const lessonTargets = buildPracticeMapTargets(
    questions.map((question, index) => normalizeQuestion(question, lesson.id, index)),
  );
  assertReadableTargets(lessonTargets, `${lesson.id} complete Practice map`);
  totalTargets += lessonTargets.length;
  totalQuestions += questions.length;
}

assert.equal(totalQuestions, expectedQuestionCount, "The Practice-map audit covers every bundled activity.");
assert.equal(isHumanReadableModelTarget("[object Object]"), false, "Implicit object coercion is never a readable model target.");
assert.equal(isHumanReadableModelTarget("prefix [object Array] suffix"), false, "Embedded object-coercion text is rejected too.");

const july22 = drafts.find((lesson) => lesson.id === "july-22");
const july22Targets = buildPracticeMapTargets(
  july22.questions.map((question, index) => normalizeQuestion(question, july22.id, index)),
);
assert.equal(july22Targets[4]?.en, "Neither is okay.");
assert.equal(july22Targets[4]?.jp, "どちらも駄目です。");
assert.equal(july22Targets[5]?.en, "I prefer cucumber to eggplant.");
assert.equal(july22Targets[5]?.jp, "ナスよりキュウリの方が好きです。");

const nestedPayloadFixtures = [
  {
    id: "nested-choice",
    format: "mcq",
    prompt: { en: "Choose the natural reply.", jp: "自然な返答を選んでください。" },
    choices: [{ id: "a", en: { en: "That works for me.", jp: "それで大丈夫です。" } }],
    correct: "a",
  },
  {
    id: "nested-pair",
    format: "matching",
    pairs: [{ en: { en: "I appreciate it.", jp: "感謝します。" } }],
  },
  {
    id: "nested-sort",
    format: "sorting",
    categories: ["response"],
    items: [[{ en: "It can’t be helped.", jp: "仕方ありません。" }, "response"]],
  },
];
nestedPayloadFixtures.forEach((fixture, index) => {
  const normalized = normalizeQuestion(fixture, "nested-fixtures", index);
  assertReadableTargets(practiceMapTargetsForQuestion(normalized), fixture.id);
});
assert.equal(practiceMapTargetsForQuestion(normalizeQuestion(nestedPayloadFixtures[0], "nested-fixtures", 0))[0].en, "That works for me.");
assert.equal(practiceMapTargetsForQuestion(normalizeQuestion(nestedPayloadFixtures[1], "nested-fixtures", 1))[0].en, "I appreciate it.");
assert.equal(practiceMapTargetsForQuestion(normalizeQuestion(nestedPayloadFixtures[2], "nested-fixtures", 2))[0].en, "It can’t be helped.");

console.log(`Lesson guide coverage passed: ${lessons.length} lessons, ${totalQuestions} activities, ${totalTargets} readable model targets, no object-coercion or model-answer gaps.`);
