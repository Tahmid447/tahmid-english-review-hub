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

const rows = [];
for (const bundle of bundles) {
  bundle.questions.forEach((question, position) => {
    const format = question.format || question.type;
    rows.push(
      [
        sqlString(bundle.slug),
        sqlString(question.id),
        String(position),
        question.section ? sqlString(question.section) : "null",
        sqlString(format),
        jsonValue(question),
        question.isOriginal === false ? "false" : "true",
        String(pointsFor(question)),
      ].join(", "),
    );
  });
}

const sql = `-- Review Hub question catalogue
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
    ${rows.map((row) => `(${row})`).join(",\n    ")}
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

fs.writeFileSync(output, sql);
console.log(`Generated ${rows.length} RLS-protected question rows.`);
