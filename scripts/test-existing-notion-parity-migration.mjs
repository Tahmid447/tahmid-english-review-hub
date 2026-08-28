import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));

const expectedSlugs = [
  "july-07",
  "july-11",
  "july-12",
  "july-13",
  "july-18",
  "july-19",
  "july-22",
  "july-23",
  "july-25",
  "july-26",
  "july-27",
];
const expectedFormats = [
  "dialogue",
  "grid",
  "listenChoice",
  "listenType",
  "matching",
  "mcq",
  "mistake",
  "order",
  "situation",
  "sorting",
  "speaking",
  "translation",
  "truefalse",
  "typing",
];

const drafts = readJson("src/data/notion-drafts.json");
const lessons = drafts.filter(({ id }) => expectedSlugs.includes(id));
assert.deepEqual(lessons.map(({ id }) => id), expectedSlugs);
assert.equal(lessons.length, 11);

const authoredQuestions = lessons.flatMap(({ questions }) => questions);
assert.equal(authoredQuestions.length, 363);
assert.equal(new Set(authoredQuestions.map(({ id }) => id)).size, 363);
for (const lesson of lessons) {
  assert.equal(lesson.sourceType, "notion", `${lesson.id} remains a Notion lesson`);
  assert.equal(lesson.questions.length, 33, `${lesson.id} has 33 authored questions`);
  assert.deepEqual(
    [...new Set(lesson.questions.map(({ format, type }) => format || type))].sort(),
    expectedFormats,
    `${lesson.id} covers all 14 formats`,
  );
}

const migration009 = read("supabase/migrations/202608020009_expanded_lesson_questions.sql");
for (const lesson of lessons) {
  const oldKeys = [...migration009.matchAll(new RegExp(`\\('${lesson.id}', '([^']+)'`, "g"))]
    .map((match) => match[1]);
  assert.equal(oldKeys.length, 31, `${lesson.id} had 31 generated rows before parity migration 023`);
  assert.deepEqual(
    lesson.questions.map(({ id }) => id).filter((id) => !oldKeys.includes(id)),
    [`${lesson.id}-draft-typing`, `${lesson.id}-draft-grid`],
    `${lesson.id} was missing only typing and grid`,
  );
}

const migration = read("supabase/migrations/202608280023_existing_notion_lesson_format_parity.sql");
const generator = read("scripts/generate-existing-notion-parity-migration.mjs");
const packageJson = readJson("package.json");

const lessonRows = migration
  .split("insert into review_release_023_lessons values\n")[1]
  ?.split(";\n\ndo $preflight$")[0]
  ?.match(/^  \('/gm) || [];
const questionRows = migration
  .split("insert into review_release_023_questions values\n")[1]
  ?.split(";\n\ndo $source$")[0]
  ?.match(/^  \('/gm) || [];
assert.equal(lessonRows.length, 11, "023 targets exactly 11 existing Notion lessons");
assert.equal(questionRows.length, 363, "023 carries exactly 363 authored question rows");

for (const slug of expectedSlugs) {
  assert.match(migration, new RegExp(`\\('${slug}'\\)`), `${slug} is in the exact target lesson table`);
  assert.match(migration, new RegExp(`'${slug}-draft-typing'`), `${slug} includes the missing typing row`);
  assert.match(migration, new RegExp(`'${slug}-draft-grid'`), `${slug} includes the missing grid row`);
}
for (const lesson of drafts.filter(({ id }) => !expectedSlugs.includes(id))) {
  assert.doesNotMatch(
    migration.split("insert into review_release_023_questions values\n")[1]?.split(";\n\ndo $source$")[0] || "",
    new RegExp(`'${lesson.id}-draft-`),
    `023 must not carry questions from ${lesson.id}`,
  );
}

assert.match(migration, /stored_lessons <> 11 or stored_questions <> 363/);
assert.match(migration, /count\(\*\) <> 33[\s\S]*count\(distinct question\.format\) <> 14/);
assert.match(migration, /jsonb_set\([\s\S]*'\{draft_questions\}'[\s\S]*'33'::jsonb/);
assert.match(migration, /content_version = greatest\(lesson\.content_version, 5\)/);
assert.match(migration, /review_release_023_lesson_controls/);
assert.match(migration, /review_release_023_question_controls/);
assert.match(migration, /question\.active is distinct from before\.active/);
assert.match(migration, /question\.required_plan is distinct from before\.required_plan/);
assert.match(migration, /question\.locked_display is distinct from before\.locked_display/);

const questionConflict = migration.split("on conflict (lesson_id, stable_key) do update set")[1]
  ?.split("-- Only bundle metadata changes")[0] || "";
assert.doesNotMatch(questionConflict, /\bactive\s*=/);
assert.doesNotMatch(questionConflict, /\brequired_plan\s*=/);
assert.doesNotMatch(questionConflict, /\blocked_display\s*=/);
const lessonUpdate = migration.split("update public.review_lessons lesson")[1]
  ?.split("do $verify$")[0] || "";
assert.doesNotMatch(lessonUpdate, /\bstatus\s*=/);
assert.doesNotMatch(lessonUpdate, /\baudience\s*=/);

assert.match(generator, /202608280023_existing_notion_lesson_format_parity\.sql/);
assert.match(generator, /EXPECTED_QUESTION_COUNT_PER_LESSON = 33/);
assert.match(generator, /EXISTING_NOTION_PARITY_FORMATS\.length/);
assert.match(packageJson.scripts["generate:migration"], /generate:existing-notion-parity/);
assert.match(packageJson.scripts.test, /test-existing-notion-parity-migration\.mjs/);

console.log("Existing Notion lesson parity migration tests passed.");
console.log("  ✓ 11 target lessons / 363 authored questions / 14 formats each");
console.log("  ✓ missing typing + labelled-grid rows are present for all 11 lessons");
console.log("  ✓ lesson status/audience and question access controls remain teacher-managed");
console.log("  ✓ migration 023 is scoped only to july-07 through july-27 Notion lessons");
