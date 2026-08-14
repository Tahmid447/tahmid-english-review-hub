import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const sha256 = (relativePath) =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");

// These migrations are already live and therefore immutable. Building current
// lesson data must never rewrite production history. A checksum failure means
// an applied migration was edited and the build must stop immediately.
const appliedQuestionMigrations = new Map([
  [
    "supabase/migrations/202607300003_review_hub_questions.sql",
    "4e6df65665ef071ebeabaa793903e995dc2a9fb15236eec8edb120775d6b12f3",
  ],
  [
    "supabase/migrations/202608020009_expanded_lesson_questions.sql",
    "d17a120679a7d92f5a711645b88ed5bcf00149fe081c104606466dd4ecc91c07",
  ],
  [
    "supabase/migrations/202608030013_expand_legacy_lesson_skills.sql",
    "ecde3f37c5baf35331957015ea62cf5ec49b2299f4d061585ebd5aa0c3ec3a8c",
  ],
]);

for (const [relativePath, expectedHash] of appliedQuestionMigrations) {
  const actualHash = sha256(relativePath);
  if (actualHash !== expectedHash) {
    throw new Error(
      `Applied migration ${relativePath} was modified. Restore it before generating a forward-only migration.`,
    );
  }
}

const legacyLessons = readJSON("src/data/legacy-lessons.json");
const legacyAdditions = readJSON("src/data/legacy-additions.json");
const notionDrafts = readJSON("src/data/notion-drafts.json");
const output = path.join(
  root,
  "supabase",
  "migrations",
  "202608140016_visual_question_content_corrections.sql",
);

const sqlString = (value) =>
  `'${String(value ?? "").replaceAll("'", "''")}'`;
const jsonValue = (value) =>
  `${sqlString(JSON.stringify(value))}::jsonb`;

const pointsFor = (question) => {
  const format = question.format || question.type;
  if (format === "matching") return Math.max(1, question.pairs?.length || 0);
  if (format === "sorting") return Math.max(1, question.items?.length || 0);
  return 1;
};

const bundles = [
  ...legacyLessons.map((lesson) => ({
    slug: lesson.id,
    questions: [
      ...lesson.questions,
      ...(legacyAdditions[lesson.id] || []),
    ],
  })),
  ...notionDrafts.map((lesson) => ({
    slug: lesson.id,
    questions: lesson.questions,
  })),
];

const visualRows = [];
const visualKeys = new Set();
for (const bundle of bundles) {
  bundle.questions.forEach((question, position) => {
    if (!question.image) return;
    const sourceKey = `${bundle.slug}\u0000${question.id}`;
    if (visualKeys.has(sourceKey)) {
      throw new Error(
        `Duplicate visual migration source pair: ${bundle.slug}/${question.id}`,
      );
    }
    visualKeys.add(sourceKey);
    const format = question.format || question.type;
    visualRows.push([
      sqlString(bundle.slug),
      sqlString(question.id),
      String(position),
      question.section ? sqlString(question.section) : "null",
      sqlString(format),
      jsonValue(question),
      question.isOriginal === false ? "false" : "true",
      String(pointsFor(question)),
    ].join(", "));
  });
}

if (visualRows.length !== 85) {
  throw new Error(`Expected 85 visual question corrections, found ${visualRows.length}.`);
}

const sql = `-- Forward-only corrections for all 85 reviewed visual questions.
--
-- Migrations 003, 009 and 013 are already live and must remain byte-for-byte
-- immutable. This migration updates only reviewed question content and leaves
-- teacher-managed active/plan/locked-display controls unchanged.

do $visuals$
declare
  updated_count integer;
begin
  with source (
    lesson_slug, stable_key, position, section, format, payload,
    is_original, points
  ) as (
    values
      ${visualRows.map((row) => `(${row})`).join(",\n      ")}
  )
  update public.review_questions question
  set position = source.position,
      section = source.section,
      format = source.format,
      payload = source.payload,
      is_original = source.is_original,
      points = source.points,
      updated_at = now()
  from source
  join public.review_lessons lesson on lesson.slug = source.lesson_slug
  where question.lesson_id = lesson.id
    and question.stable_key = source.stable_key;

  get diagnostics updated_count = row_count;
  if updated_count <> 85 then
    raise exception 'Visual question correction incomplete: expected 85 updated rows, updated %.', updated_count;
  end if;
end;
$visuals$;

update public.review_lessons
set content_version = greatest(content_version, 4),
    updated_at = now()
where slug in (
  'june-28', 'june-29', 'june-30', 'july-04', 'july-05', 'july-06',
  'july-07', 'july-11', 'july-12', 'july-13', 'july-18', 'july-19',
  'july-22', 'july-23', 'july-25', 'july-26', 'july-27'
);
`;

fs.writeFileSync(output, sql);
console.log("Verified applied question migrations are immutable.");
console.log("Generated forward-only migration 016 with 85 visual question corrections.");
