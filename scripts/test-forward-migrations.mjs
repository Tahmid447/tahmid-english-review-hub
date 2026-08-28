import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  NEW_PREMIUM_TOPIC_MANIFEST,
  NEW_PREMIUM_TOPIC_SLUGS,
  validatePremiumTopicManifest,
} from "./premium-topic-manifest.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const sha256 = (relativePath) => crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, relativePath)))
  .digest("hex");

const appliedMigrations = new Map([
  ["supabase/migrations/202607300003_review_hub_questions.sql", "4e6df65665ef071ebeabaa793903e995dc2a9fb15236eec8edb120775d6b12f3"],
  ["supabase/migrations/202608020009_expanded_lesson_questions.sql", "d17a120679a7d92f5a711645b88ed5bcf00149fe081c104606466dd4ecc91c07"],
  ["supabase/migrations/202608030013_expand_legacy_lesson_skills.sql", "ecde3f37c5baf35331957015ea62cf5ec49b2299f4d061585ebd5aa0c3ec3a8c"],
  ["supabase/migrations/202608140016_visual_question_content_corrections.sql", "8b8ecacef39346fedf91f1949620a85fe43d8c7f300e6ca735be3c42c2fc6f00"],
  ["supabase/migrations/202608180017_premium_task_topics.sql", "b6656cd933ea72200af544ed29ae30d4d6f08f30abf646996a98aeb591166017"],
]);

const expectedSlugs = [
  "july-30-part-1",
  "july-30-part-2",
  "august-02",
  "august-03",
  "august-09",
  "august-10-part-1",
  "august-10-part-2",
  "august-16-part-1",
  "august-16-part-2",
  "august-17-part-1",
  "august-17-part-2",
  "august-23",
  "august-24",
  "august-25",
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

for (const [relativePath, expectedHash] of appliedMigrations) {
  assert.equal(sha256(relativePath), expectedHash, `${relativePath} must remain byte-for-byte immutable`);
}

const migration019 = read("supabase/migrations/202608280019_lesson_source_segments.sql");
const migration020 = read("supabase/migrations/202608280020_new_notion_lessons_and_questions.sql");
const migration021 = read("supabase/migrations/202608280021_new_lesson_premium_tasks_topics.sql");
const migration022 = read("supabase/migrations/202608280022_publish_new_notion_lessons.sql");
const migration023 = read("supabase/migrations/202608280023_existing_notion_lesson_format_parity.sql");
const questionGenerator = read("scripts/generate-question-migration.mjs");
const premiumGenerator = read("scripts/generate-premium-topic-migration.mjs");
const packageJson = readJson("package.json");

assert.match(migration019, /unique\s*\(source_type, source_notion_page_id, source_segment\)/i);
assert.deepEqual(
  fs.readdirSync(path.join(root, "supabase", "migrations"))
    .filter((name) => /^2026082800(?:19|20|21|22|23)_/.test(name))
    .sort(),
  [
    "202608280019_lesson_source_segments.sql",
    "202608280020_new_notion_lessons_and_questions.sql",
    "202608280021_new_lesson_premium_tasks_topics.sql",
    "202608280022_publish_new_notion_lessons.sql",
    "202608280023_existing_notion_lesson_format_parity.sql",
  ],
  "the forward migrations are ordered 019 → 020 → 021 → 022 → 023",
);

const canonicalLessons = readJson("src/data/notion-drafts.json")
  .filter(({ id }) => expectedSlugs.includes(id));
assert.equal(canonicalLessons.length, 14);
assert.deepEqual(canonicalLessons.map(({ id }) => id), expectedSlugs);
assert.equal(new Set(canonicalLessons.map(({ sourceNotionPageId }) => sourceNotionPageId)).size, 10);
assert.equal(
  new Set(canonicalLessons.map(({ sourceNotionPageId, sourceSegment }) => `${sourceNotionPageId}::${sourceSegment}`)).size,
  14,
);

const canonicalQuestions = canonicalLessons.flatMap(({ questions }) => questions);
assert.equal(canonicalQuestions.length, 462);
assert.equal(new Set(canonicalQuestions.map(({ id }) => id)).size, 462);
for (const lesson of canonicalLessons) {
  assert.equal(
    lesson.sourceNotionUrl,
    `https://app.notion.com/p/${lesson.sourceNotionPageId.replaceAll("-", "")}`,
    `${lesson.id} preserves its exact Notion source link`,
  );
  assert.equal(lesson.audience, "both", `${lesson.id} is available to both learner audiences`);
  assert.ok(lesson.summary && lesson.summaryJa, `${lesson.id} has English and Japanese catalogue summaries`);
  assert.equal(lesson.questions.length, 33, `${lesson.id} has 33 activities`);
  assert.deepEqual(
    [...new Set(lesson.questions.map(({ format, type }) => format || type))].sort(),
    expectedFormats,
    `${lesson.id} covers all 14 formats`,
  );
}

const lessonSourceRows = migration020
  .split("insert into review_release_020_lessons values\n")[1]
  ?.split(";\n\ndo $source$")[0]
  ?.match(/^  \('/gm) || [];
const questionSourceRows = migration020
  .split("insert into review_release_020_questions values\n")[1]
  ?.split(";\n\ndo $source$")[0]
  ?.match(/^  \('/gm) || [];
assert.equal(lessonSourceRows.length, 14, "020 carries exactly 14 lesson source rows");
assert.equal(questionSourceRows.length, 462, "020 carries exactly 462 question source rows");
assert.match(migration020, /on conflict \(source_type, source_notion_page_id, source_segment\) do update/i);
assert.match(migration020, /'draft', 'both', 'notion'/);
assert.match(migration020, /question\.stable_key like lesson\.slug \|\| '-draft-%'/i);
assert.match(migration020, /on conflict \(lesson_id, stable_key\) do update set/i);
const questionConflict = migration020.split("on conflict (lesson_id, stable_key) do update set")[1]
  ?.split("do $verify$")[0] || "";
assert.ok(!/\bactive\s*=|\brequired_plan\s*=|\blocked_display\s*=/.test(questionConflict));

validatePremiumTopicManifest();
assert.deepEqual(NEW_PREMIUM_TOPIC_SLUGS, expectedSlugs);
assert.equal(NEW_PREMIUM_TOPIC_MANIFEST.length, 14);
assert.equal(NEW_PREMIUM_TOPIC_MANIFEST.reduce((sum, { topics }) => sum + topics.length, 0), 42);
const premiumSourceRows = migration021
  .split("with source(slug, topics) as (\n  values\n")[1]
  ?.split("\n),\nauthor as")[0]
  ?.match(/^    \('/gm) || [];
assert.equal(premiumSourceRows.length, 14, "021 carries one reviewed topic set per lesson");
assert.match(migration021, /'speaking'::text as task_type/);
assert.match(migration021, /'essay'::text/);
assert.match(migration021, /seeded_count <> 28/);
assert.match(migration021, /topic_count <> 84/);

assert.match(migration022, /lesson_count <> 14 or source_page_count <> 10/);
assert.match(migration022, /active_question_count <> 462/);
assert.match(migration022, /count\(question\.id\) <> 33[\s\S]*count\(distinct question\.format\) <> 14/);
assert.match(migration022, /premium_task_count <> 28/);
assert.match(migration022, /set status = 'published',[\s\S]*audience = 'both'/);
assert.match(migration022, /question_count >= 33/);
assert.match(migration023, /stored_lessons <> 11 or stored_questions <> 363/);
assert.match(migration023, /count\(\*\) <> 33[\s\S]*count\(distinct question\.format\) <> 14/);
assert.match(migration023, /review_release_023_question_controls/);

assert.match(questionGenerator, /202608280020_new_notion_lessons_and_questions\.sql/);
assert.match(questionGenerator, /202608280022_publish_new_notion_lessons\.sql/);
assert.doesNotMatch(questionGenerator, /writeFileSync\([^\n]*(?:202607300003|202608020009|202608030013|202608140016|202608180017)/);
assert.match(premiumGenerator, /202608280021_new_lesson_premium_tasks_topics\.sql/);
assert.doesNotMatch(premiumGenerator, /writeFile\([^\n]*202608180017/);
assert.match(packageJson.scripts.build, /generate:migration/);
assert.match(packageJson.scripts["generate:migration"], /generate:lessons.*generate:premium-topics.*generate:publish/);

console.log("Forward-only migration tests passed.");
console.log("  ✓ applied migrations 003/009/013/016/017 are immutable");
console.log("  ✓ migration order 019 → 020 → 021 → 022 → 023 is complete");
console.log("  ✓ 14 lessons / 10 Notion pages / 462 questions / 14 formats");
console.log("  ✓ 28 Premium tasks with 42 reviewed bilingual topic definitions");
console.log("  ✓ publication remains gated by provenance, coverage and Premium checks");
console.log("  ✓ prior 11 Notion lessons reach 33 questions / 14 formats without overwriting teacher controls");
