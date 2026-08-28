import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const sha256 = (relativePath) => crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, relativePath)))
  .digest("hex");

const IMMUTABLE_MIGRATIONS = new Map([
  ["supabase/migrations/202607300003_review_hub_questions.sql", "4e6df65665ef071ebeabaa793903e995dc2a9fb15236eec8edb120775d6b12f3"],
  ["supabase/migrations/202608020009_expanded_lesson_questions.sql", "d17a120679a7d92f5a711645b88ed5bcf00149fe081c104606466dd4ecc91c07"],
  ["supabase/migrations/202608030013_expand_legacy_lesson_skills.sql", "ecde3f37c5baf35331957015ea62cf5ec49b2299f4d061585ebd5aa0c3ec3a8c"],
  ["supabase/migrations/202608140016_visual_question_content_corrections.sql", "8b8ecacef39346fedf91f1949620a85fe43d8c7f300e6ca735be3c42c2fc6f00"],
  ["supabase/migrations/202608180017_premium_task_topics.sql", "b6656cd933ea72200af544ed29ae30d4d6f08f30abf646996a98aeb591166017"],
  ["supabase/migrations/202608280019_lesson_source_segments.sql", "83be6f676769c67636c6be42e9db12b82357567412ddb42d66d908ca84ede7d2"],
  ["supabase/migrations/202608280020_new_notion_lessons_and_questions.sql", "7fd3f5770903864ae21399fbb66893b57f48449bc47c6ab42bf26ba50d571c55"],
  ["supabase/migrations/202608280021_new_lesson_premium_tasks_topics.sql", "01da16e4c0d07c818445b14c6abfbd5c839ad447f2d98819dd468e9e2d78c323"],
  ["supabase/migrations/202608280022_publish_new_notion_lessons.sql", "df23a6cc9fa2ab4961253f38b0ab505fc8d33d3bdd2a25eb2a4a14816053ba96"],
]);

export const EXISTING_NOTION_PARITY_SLUGS = Object.freeze([
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
]);

export const EXISTING_NOTION_PARITY_FORMATS = Object.freeze([
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
]);

const EXPECTED_QUESTION_COUNT_PER_LESSON = 33;
const EXPECTED_QUESTION_COUNT = EXISTING_NOTION_PARITY_SLUGS.length * EXPECTED_QUESTION_COUNT_PER_LESSON;
const output = path.join(
  root,
  "supabase",
  "migrations",
  "202608280023_existing_notion_lesson_format_parity.sql",
);

const sqlString = (value) => `'${String(value ?? "").replaceAll("'", "''")}'`;
const nullableSqlString = (value) => (value == null || value === "" ? "null" : sqlString(value));
const jsonValue = (value) => `${sqlString(JSON.stringify(value))}::jsonb`;

const questionPoints = (question = {}) => {
  const supplied = Number(question.maxPoints ?? question.points);
  if (Number.isFinite(supplied) && supplied > 0) return supplied;
  const format = question.format || question.type;
  if (format === "matching") return Math.max(1, question.pairs?.length || 0);
  if (format === "sorting") return Math.max(1, question.items?.length || 0);
  return 1;
};

function verifyImmutableMigrations() {
  for (const [relativePath, expectedHash] of IMMUTABLE_MIGRATIONS) {
    const actualHash = sha256(relativePath);
    if (actualHash !== expectedHash) {
      throw new Error(`${relativePath} changed after its release checkpoint; restore it before generating 023.`);
    }
  }
}

function canonicalLessons() {
  const expected = new Set(EXISTING_NOTION_PARITY_SLUGS);
  const lessons = readJson("src/data/notion-drafts.json").filter(({ id }) => expected.has(id));
  if (lessons.length !== EXISTING_NOTION_PARITY_SLUGS.length) {
    throw new Error(`Expected ${EXISTING_NOTION_PARITY_SLUGS.length} existing Notion lessons, found ${lessons.length}.`);
  }

  const questions = new Set();
  for (const lesson of lessons) {
    if (lesson.sourceType !== "notion" || !lesson.sourceNotionPageId || !lesson.sourceNotionUrl) {
      throw new Error(`${lesson.id}: Notion provenance is incomplete.`);
    }
    if (!Array.isArray(lesson.questions) || lesson.questions.length !== EXPECTED_QUESTION_COUNT_PER_LESSON) {
      throw new Error(`${lesson.id}: expected ${EXPECTED_QUESTION_COUNT_PER_LESSON} authored questions.`);
    }
    const formats = [...new Set(lesson.questions.map(({ format, type }) => format || type))].sort();
    if (JSON.stringify(formats) !== JSON.stringify([...EXISTING_NOTION_PARITY_FORMATS].sort())) {
      throw new Error(`${lesson.id}: expected all ${EXISTING_NOTION_PARITY_FORMATS.length} formats.`);
    }
    for (const question of lesson.questions) {
      if (!question.id || questions.has(question.id)) {
        throw new Error(`${lesson.id}: duplicate or missing question ID ${question.id || "(empty)"}.`);
      }
      questions.add(question.id);
    }
  }
  if (questions.size !== EXPECTED_QUESTION_COUNT) {
    throw new Error(`Expected ${EXPECTED_QUESTION_COUNT} unique authored questions, found ${questions.size}.`);
  }
  return EXISTING_NOTION_PARITY_SLUGS.map((id) => lessons.find((lesson) => lesson.id === id));
}

function questionRow(lesson, question, position) {
  return [
    sqlString(lesson.id),
    sqlString(question.id),
    String(position),
    nullableSqlString(question.section),
    sqlString(question.format || question.type),
    jsonValue(question),
    question.isOriginal === true ? "true" : "false",
    String(questionPoints(question)),
  ].join(", ");
}

function generateMigration(lessons) {
  const lessonRows = EXISTING_NOTION_PARITY_SLUGS.map((slug) => `  (${sqlString(slug)})`).join(",\n");
  const questionRows = lessons.flatMap((lesson) => lesson.questions.map(
    (question, position) => `  (${questionRow(lesson, question, position)})`,
  )).join(",\n");

  return `-- Forward-only parity release for the 11 existing Notion lessons.
--
-- Migration 009 supplied 31 generated questions per lesson. The reviewed
-- authored bundle now contains 33 questions per lesson and adds the missing
-- typing and labelled-grid formats. This release snapshots all 363 authored
-- rows so their positions and payloads stay aligned while preserving every
-- teacher-managed lesson and question access control.

begin;

create temporary table review_release_023_lessons (
  slug text primary key
) on commit drop;

insert into review_release_023_lessons values
${lessonRows};

do $preflight$
declare
  stored_lessons integer;
begin
  if (select count(*) from review_release_023_lessons) <> ${EXISTING_NOTION_PARITY_SLUGS.length} then
    raise exception 'Release 023 needs exactly ${EXISTING_NOTION_PARITY_SLUGS.length} target lessons.';
  end if;

  select count(*) into stored_lessons
  from review_release_023_lessons source
  join public.review_lessons lesson
    on lesson.slug = source.slug
   and lesson.source_type = 'notion';

  if stored_lessons <> ${EXISTING_NOTION_PARITY_SLUGS.length} then
    raise exception 'Release 023 requires ${EXISTING_NOTION_PARITY_SLUGS.length} existing Notion lessons, found %.', stored_lessons;
  end if;
end;
$preflight$;

create temporary table review_release_023_questions (
  lesson_slug text not null,
  stable_key text not null,
  position integer not null,
  section text,
  format text not null,
  payload jsonb not null,
  is_original boolean not null,
  points numeric(8,2) not null,
  primary key (lesson_slug, stable_key)
) on commit drop;

insert into review_release_023_questions values
${questionRows};

do $source$
begin
  if (select count(*) from review_release_023_questions) <> ${EXPECTED_QUESTION_COUNT} then
    raise exception 'Release 023 needs exactly ${EXPECTED_QUESTION_COUNT} authored questions.';
  end if;

  if exists (
    select 1
    from review_release_023_questions
    group by lesson_slug
    having count(*) <> ${EXPECTED_QUESTION_COUNT_PER_LESSON}
       or count(distinct format) <> ${EXISTING_NOTION_PARITY_FORMATS.length}
  ) then
    raise exception 'Every release 023 lesson needs 33 questions across all 14 formats.';
  end if;

  if exists (
    select 1
    from review_release_023_questions
    where stable_key not like lesson_slug || '-draft-%'
  ) then
    raise exception 'Release 023 may update only generated draft question keys.';
  end if;
end;
$source$;

-- Snapshot controls before the content upsert. Existing rows may have been
-- disabled or tiered by a teacher, and those choices must survive this release.
create temporary table review_release_023_lesson_controls on commit drop as
select lesson.id, lesson.status, lesson.audience
from review_release_023_lessons source
join public.review_lessons lesson on lesson.slug = source.slug;

create temporary table review_release_023_question_controls on commit drop as
select question.id, question.active, question.required_plan, question.locked_display
from review_release_023_questions source
join public.review_lessons lesson on lesson.slug = source.lesson_slug
join public.review_questions question
  on question.lesson_id = lesson.id
 and question.stable_key = source.stable_key;

insert into public.review_questions (
  lesson_id, stable_key, position, section, format, payload,
  is_original, points, active
)
select
  lesson.id, source.stable_key, source.position, source.section, source.format,
  source.payload, source.is_original, source.points, true
from review_release_023_questions source
join public.review_lessons lesson
  on lesson.slug = source.lesson_slug
 and lesson.source_type = 'notion'
on conflict (lesson_id, stable_key) do update set
  position = excluded.position,
  section = excluded.section,
  format = excluded.format,
  payload = excluded.payload,
  is_original = excluded.is_original,
  points = excluded.points,
  updated_at = now();

-- Only bundle metadata changes. Publication status and audience remain under
-- Teacher Studio control.
update public.review_lessons lesson
set content_version = greatest(lesson.content_version, 5),
    content = jsonb_set(coalesce(lesson.content, '{}'::jsonb), '{draft_questions}', '33'::jsonb, true),
    updated_at = now()
from review_release_023_lessons source
where lesson.slug = source.slug
  and lesson.source_type = 'notion';

do $verify$
declare
  stored_lessons integer;
  stored_questions integer;
begin
  select count(*) into stored_lessons
  from review_release_023_lessons source
  join public.review_lessons lesson
    on lesson.slug = source.slug
   and lesson.source_type = 'notion';

  select count(*) into stored_questions
  from review_release_023_questions source
  join public.review_lessons lesson on lesson.slug = source.lesson_slug
  join public.review_questions question
    on question.lesson_id = lesson.id
   and question.stable_key = source.stable_key;

  if stored_lessons <> ${EXISTING_NOTION_PARITY_SLUGS.length} or stored_questions <> ${EXPECTED_QUESTION_COUNT} then
    raise exception 'Release 023 verification failed: % lessons / % questions.', stored_lessons, stored_questions;
  end if;

  if exists (
    select 1
    from review_release_023_questions source
    join public.review_lessons lesson on lesson.slug = source.lesson_slug
    join public.review_questions question
      on question.lesson_id = lesson.id
     and question.stable_key = source.stable_key
    where question.position is distinct from source.position
       or question.section is distinct from source.section
       or question.format is distinct from source.format
       or question.payload is distinct from source.payload
       or question.is_original is distinct from source.is_original
       or question.points is distinct from source.points
  ) then
    raise exception 'Release 023 stored question content does not match the reviewed bundle.';
  end if;

  if exists (
    select 1
    from review_release_023_questions source
    join public.review_lessons lesson on lesson.slug = source.lesson_slug
    join public.review_questions question
      on question.lesson_id = lesson.id
     and question.stable_key = source.stable_key
    group by lesson.id
    having count(*) <> ${EXPECTED_QUESTION_COUNT_PER_LESSON}
       or count(distinct question.format) <> ${EXISTING_NOTION_PARITY_FORMATS.length}
  ) then
    raise exception 'Release 023 stored coverage is not 33 questions across 14 formats per lesson.';
  end if;

  if exists (
    select 1
    from review_release_023_lesson_controls before
    join public.review_lessons lesson on lesson.id = before.id
    where lesson.status is distinct from before.status
       or lesson.audience is distinct from before.audience
  ) then
    raise exception 'Release 023 changed a teacher-managed lesson control.';
  end if;

  if exists (
    select 1
    from review_release_023_question_controls before
    join public.review_questions question on question.id = before.id
    where question.active is distinct from before.active
       or question.required_plan is distinct from before.required_plan
       or question.locked_display is distinct from before.locked_display
  ) then
    raise exception 'Release 023 changed a teacher-managed question control.';
  end if;
end;
$verify$;

commit;
`;
}

verifyImmutableMigrations();
const lessons = canonicalLessons();
fs.writeFileSync(output, generateMigration(lessons));

console.log("Verified migrations 003, 009, 013, 016, 017 and 019–022 are immutable.");
console.log(`Generated forward-only migration 023 for ${lessons.length} lessons and ${EXPECTED_QUESTION_COUNT} questions across ${EXISTING_NOTION_PARITY_FORMATS.length} formats.`);
