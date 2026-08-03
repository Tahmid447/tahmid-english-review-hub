import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

const legacyLessons = readJSON("src/data/legacy-lessons.json");
const legacyAdditions = readJSON("src/data/legacy-additions.json");
const notionDrafts = readJSON("src/data/notion-drafts.json");
const output = path.join(
  root,
  "supabase",
  "migrations",
  "202607300003_review_hub_questions.sql",
);
const expandedOutput = path.join(
  root,
  "supabase",
  "migrations",
  "202608020009_expanded_lesson_questions.sql",
);
const legacySkillExpansionOutput = path.join(
  root,
  "supabase",
  "migrations",
  "202608030013_expand_legacy_lesson_skills.sql",
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
    sourceType: "legacy",
    questions: [
      ...lesson.questions,
      ...(legacyAdditions[lesson.id] || []),
    ],
  })),
  ...notionDrafts.map((lesson) => ({
    slug: lesson.id,
    sourceType: "notion",
    questions: lesson.questions,
  })),
];

const rows = [];
const expandedRows = [];
const legacySkillExpansionRows = [];
for (const bundle of bundles) {
  bundle.questions.forEach((question, position) => {
    const format = question.format || question.type;
    const row = [
      sqlString(bundle.slug),
      sqlString(question.id),
      String(position),
      question.section ? sqlString(question.section) : "null",
      sqlString(format),
      jsonValue(question),
      question.isOriginal === false ? "false" : "true",
      String(pointsFor(question)),
    ].join(", ");
    rows.push(row);
    if (bundle.sourceType === "notion") expandedRows.push(row);
    if (
      bundle.sourceType === "legacy"
      && /-extra-(?:dictation-3|speaking-[3-5]|visual-[1-5])$/.test(question.id)
    ) {
      legacySkillExpansionRows.push(row);
    }
  });
}

const makeQuestionUpsert = (selectedRows, header) => `${header}
--
-- Generated from the private repository's reviewed source bundle.
-- Draft payloads live behind Supabase RLS and are intentionally excluded from
-- the public Netlify build. Re-running this migration is idempotent.

insert into public.review_questions (
  lesson_id, stable_key, position, section, format, payload,
  is_original, points, active
)
select
  lesson.id,
  source.stable_key,
  source.position,
  source.section,
  source.format,
  source.payload,
  source.is_original,
  source.points,
  true
from (
  values
    ${selectedRows.map((row) => `(${row})`).join(",\n    ")}
) as source (
  lesson_slug, stable_key, position, section, format, payload,
  is_original, points
)
join public.review_lessons lesson on lesson.slug = source.lesson_slug
on conflict (lesson_id, stable_key) do update set
  position = excluded.position,
  section = excluded.section,
  format = excluded.format,
  payload = excluded.payload,
  is_original = excluded.is_original,
  points = excluded.points,
  active = true;
`;

const sql = makeQuestionUpsert(rows, "-- Review Hub question catalogue");
const expandedSql = `${makeQuestionUpsert(
  expandedRows,
  "-- Expanded 31-activity lesson payload, including five visual questions per lesson",
)}
update public.review_lessons
set content_version = greatest(content_version, 2),
    content = jsonb_set(content, '{draft_questions}', '31'::jsonb, true),
    updated_at = now()
where slug in (
  'july-07', 'july-11', 'july-12', 'july-13', 'july-18', 'july-19',
  'july-22', 'july-23', 'july-25', 'july-26', 'july-27'
);
`;
const legacySkillExpansionSql = `${makeQuestionUpsert(
  legacySkillExpansionRows,
  "-- Add visual, listening, and speaking coverage to the six legacy lessons",
)}
update public.review_lessons
set content_version = greatest(content_version, 3),
    content = jsonb_set(content, '{added_questions}', '22'::jsonb, true),
    updated_at = now()
where slug in ('june-28', 'june-29', 'june-30', 'july-04', 'july-05', 'july-06');
`;

fs.writeFileSync(output, sql);
fs.writeFileSync(expandedOutput, expandedSql);
fs.writeFileSync(legacySkillExpansionOutput, legacySkillExpansionSql);
console.log(`Generated ${rows.length} RLS-protected question rows.`);
console.log(`Generated ${expandedRows.length} expanded lesson rows for migration 009.`);
console.log(`Generated ${legacySkillExpansionRows.length} legacy skill-expansion rows for migration 013.`);
