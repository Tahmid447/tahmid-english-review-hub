import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  lessonSourceIdentityKey,
  sourceSegmentPartIndex,
  validateLessonSourceIdentities,
} from "../src/lesson-source.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const sha256 = (relativePath) => crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, relativePath)))
  .digest("hex");

// These migrations are already live. A build may verify them, but it must
// never regenerate or edit them. New reviewed content always moves forward.
const APPLIED_MIGRATIONS = new Map([
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
  [
    "supabase/migrations/202608140016_visual_question_content_corrections.sql",
    "8b8ecacef39346fedf91f1949620a85fe43d8c7f300e6ca735be3c42c2fc6f00",
  ],
  [
    "supabase/migrations/202608180017_premium_task_topics.sql",
    "b6656cd933ea72200af544ed29ae30d4d6f08f30abf646996a98aeb591166017",
  ],
]);

const CANONICAL_NEW_LESSON_IDS = Object.freeze([
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
]);
const EXPECTED_FORMATS = Object.freeze([
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
const EXPECTED_LESSON_COUNT = CANONICAL_NEW_LESSON_IDS.length;
const EXPECTED_QUESTION_COUNT_PER_LESSON = 33;
const EXPECTED_QUESTION_COUNT = EXPECTED_LESSON_COUNT * EXPECTED_QUESTION_COUNT_PER_LESSON;
const EXPECTED_NOTION_PAGE_COUNT = 10;

const lessonOutput = path.join(
  root,
  "supabase",
  "migrations",
  "202608280020_new_notion_lessons_and_questions.sql",
);
const publishOutput = path.join(
  root,
  "supabase",
  "migrations",
  "202608280022_publish_new_notion_lessons.sql",
);
const premiumOutput = path.join(
  root,
  "supabase",
  "migrations",
  "202608280021_new_lesson_premium_tasks_topics.sql",
);
const requestedMode = process.argv.slice(2);
const generationMode = requestedMode.includes("--content-only")
  ? "content"
  : requestedMode.includes("--publish-only")
    ? "publish"
    : "all";
if (requestedMode.length > 1 || (requestedMode.length === 1 && generationMode === "all")) {
  throw new Error("Use --content-only or --publish-only, or omit flags to generate both.");
}

const sqlString = (value) => `'${String(value ?? "").replaceAll("'", "''")}'`;
const nullableSqlString = (value) => (value == null || value === "" ? "null" : sqlString(value));
const jsonValue = (value) => `${sqlString(JSON.stringify(value))}::jsonb`;
const sqlList = (values) => values.map(sqlString).join(", ");

const questionPoints = (question = {}) => {
  const supplied = Number(question.maxPoints ?? question.points);
  if (Number.isFinite(supplied) && supplied > 0) return supplied;
  const format = question.format || question.type;
  if (format === "matching") return Math.max(1, question.pairs?.length || 0);
  if (format === "sorting") return Math.max(1, question.items?.length || 0);
  return 1;
};

function verifyAppliedMigrations() {
  for (const [relativePath, expectedHash] of APPLIED_MIGRATIONS) {
    const actualHash = sha256(relativePath);
    if (actualHash !== expectedHash) {
      throw new Error(
        `Applied migration ${relativePath} was modified. Restore it before generating a forward-only migration.`,
      );
    }
  }
  const sourceSegmentMigration = readText("supabase/migrations/202608280019_lesson_source_segments.sql");
  if (!/unique\s*\(source_type, source_notion_page_id, source_segment\)/i.test(sourceSegmentMigration)) {
    throw new Error("Migration 019 must establish split-aware Notion provenance before migration 020.");
  }
}

function canonicalLessons() {
  const expectedIds = new Set(CANONICAL_NEW_LESSON_IDS);
  const lessons = readJSON("src/data/notion-drafts.json").filter(({ id }) => expectedIds.has(id));
  if (lessons.length !== EXPECTED_LESSON_COUNT) {
    throw new Error(`Expected ${EXPECTED_LESSON_COUNT} canonical lessons, found ${lessons.length}.`);
  }
  const actualIds = new Set(lessons.map(({ id }) => id));
  const missing = CANONICAL_NEW_LESSON_IDS.filter((id) => !actualIds.has(id));
  if (missing.length) throw new Error(`Canonical lesson data is missing: ${missing.join(", ")}.`);
  validateLessonSourceIdentities(lessons);
  if (new Set(lessons.map(lessonSourceIdentityKey)).size !== EXPECTED_LESSON_COUNT) {
    throw new Error("Canonical Notion page + segment identities are not unique.");
  }
  if (new Set(lessons.map(({ sourceNotionPageId }) => sourceNotionPageId)).size !== EXPECTED_NOTION_PAGE_COUNT) {
    throw new Error(`Expected ${EXPECTED_NOTION_PAGE_COUNT} source Notion pages.`);
  }
  const questionIds = new Set();
  lessons.forEach((lesson) => {
    if (!lesson.sourceNotionUrl || !lesson.sourceNotionPageId || !lesson.sourceSegment) {
      throw new Error(`${lesson.id}: source provenance is incomplete.`);
    }
    if (!Array.isArray(lesson.questions) || lesson.questions.length !== EXPECTED_QUESTION_COUNT_PER_LESSON) {
      throw new Error(`${lesson.id}: expected ${EXPECTED_QUESTION_COUNT_PER_LESSON} questions.`);
    }
    const formats = [...new Set(lesson.questions.map((question) => question.format || question.type))].sort();
    if (JSON.stringify(formats) !== JSON.stringify([...EXPECTED_FORMATS].sort())) {
      throw new Error(`${lesson.id}: expected all ${EXPECTED_FORMATS.length} activity formats.`);
    }
    lesson.questions.forEach((question) => {
      if (!question.id || questionIds.has(question.id)) {
        throw new Error(`${lesson.id}: duplicate or missing question ID ${question.id || "(empty)"}.`);
      }
      questionIds.add(question.id);
    });
  });
  if (questionIds.size !== EXPECTED_QUESTION_COUNT) {
    throw new Error(`Expected ${EXPECTED_QUESTION_COUNT} unique questions, found ${questionIds.size}.`);
  }
  return CANONICAL_NEW_LESSON_IDS.map((id) => lessons.find((lesson) => lesson.id === id));
}

function lessonContent(lesson) {
  return {
    bundled: true,
    sourceSegment: lesson.sourceSegment,
    partIndex: sourceSegmentPartIndex(lesson.sourceSegment),
    themes: Array.isArray(lesson.themes) ? lesson.themes : [],
    phrases: Array.isArray(lesson.phrases) ? lesson.phrases : [],
    draft_questions: lesson.questions.length,
  };
}

function lessonRow(lesson) {
  return [
    sqlString(lesson.id),
    sqlString(lesson.lessonDate),
    sqlString(lesson.title),
    sqlString(lesson.titleJa || ""),
    nullableSqlString(lesson.summary),
    nullableSqlString(lesson.summaryJa),
    sqlString(lesson.sourceNotionPageId),
    sqlString(lesson.sourceNotionUrl),
    sqlString(lesson.sourceSegment),
    nullableSqlString(lesson.sourceUpdatedAt),
    String(Math.max(1, Number(lesson.contentVersion) || 1)),
    jsonValue(lessonContent(lesson)),
  ].join(", ");
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

function generateLessonMigration(lessons) {
  const lessonRows = lessons.map((lesson) => `  (${lessonRow(lesson)})`).join(",\n");
  const questionRows = lessons.flatMap((lesson) => lesson.questions.map(
    (question, position) => `  (${questionRow(lesson, question, position)})`,
  )).join(",\n");
  const slugs = sqlList(CANONICAL_NEW_LESSON_IDS);

  return `-- Forward-only canonical lesson import: 14 lessons / 462 questions.
--
-- Requires migration 019. Applied migrations 003, 009, 013, 016 and 017
-- remain byte-for-byte immutable. Re-running this migration is idempotent and
-- preserves teacher-managed lesson publication/audience decisions and each
-- existing question's active/required_plan/locked_display controls.

begin;

create temporary table review_release_020_lessons (
  slug text primary key,
  lesson_date date not null,
  title_en text not null,
  title_ja text,
  summary_en text,
  summary_ja text,
  source_notion_page_id text not null,
  source_notion_url text not null,
  source_segment text not null,
  source_updated_at timestamptz,
  content_version integer not null,
  content jsonb not null
) on commit drop;

insert into review_release_020_lessons values
${lessonRows};

do $source$
begin
  if (select count(*) from review_release_020_lessons) <> ${EXPECTED_LESSON_COUNT} then
    raise exception 'Release 020 needs exactly ${EXPECTED_LESSON_COUNT} lessons.';
  end if;
  if (select count(distinct source_notion_page_id) from review_release_020_lessons) <> ${EXPECTED_NOTION_PAGE_COUNT} then
    raise exception 'Release 020 needs exactly ${EXPECTED_NOTION_PAGE_COUNT} Notion source pages.';
  end if;
  if exists (
    select 1 from review_release_020_lessons
    group by source_notion_page_id, source_segment
    having count(*) > 1
  ) then
    raise exception 'Release 020 contains duplicate Notion page + segment provenance.';
  end if;
end;
$source$;

insert into public.review_lessons (
  slug, lesson_date, title_en, title_ja, summary_en, summary_ja,
  status, audience, source_type, source_notion_page_id, source_notion_url,
  source_segment, source_updated_at, content_version, content
)
select
  slug, lesson_date, title_en, title_ja, summary_en, summary_ja,
  'draft', 'both', 'notion', source_notion_page_id, source_notion_url,
  source_segment, source_updated_at, content_version, content
from review_release_020_lessons
on conflict (source_type, source_notion_page_id, source_segment) do update set
  slug = excluded.slug,
  lesson_date = excluded.lesson_date,
  title_en = excluded.title_en,
  title_ja = excluded.title_ja,
  summary_en = excluded.summary_en,
  summary_ja = excluded.summary_ja,
  source_notion_url = excluded.source_notion_url,
  source_updated_at = excluded.source_updated_at,
  content_version = greatest(public.review_lessons.content_version, excluded.content_version),
  content = excluded.content,
  updated_at = now();

create temporary table review_release_020_questions (
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

insert into review_release_020_questions values
${questionRows};

do $source$
begin
  if (select count(*) from review_release_020_questions) <> ${EXPECTED_QUESTION_COUNT} then
    raise exception 'Release 020 needs exactly ${EXPECTED_QUESTION_COUNT} questions.';
  end if;
  if exists (
    select 1 from review_release_020_questions
    group by lesson_slug
    having count(*) <> ${EXPECTED_QUESTION_COUNT_PER_LESSON}
       or count(distinct format) <> ${EXPECTED_FORMATS.length}
  ) then
    raise exception 'Every release 020 lesson needs 33 questions across all 14 formats.';
  end if;
end;
$source$;

-- Retire only generated rows removed from the reviewed bundle. Teacher-created
-- questions use different stable keys and are deliberately untouched.
update public.review_questions question
set active = false,
    updated_at = now()
from public.review_lessons lesson
where question.lesson_id = lesson.id
  and lesson.slug in (${slugs})
  and question.stable_key like lesson.slug || '-draft-%'
  and not exists (
    select 1
    from review_release_020_questions source
    where source.lesson_slug = lesson.slug
      and source.stable_key = question.stable_key
  );

insert into public.review_questions (
  lesson_id, stable_key, position, section, format, payload,
  is_original, points, active
)
select
  lesson.id, source.stable_key, source.position, source.section, source.format,
  source.payload, source.is_original, source.points, true
from review_release_020_questions source
join public.review_lessons lesson on lesson.slug = source.lesson_slug
on conflict (lesson_id, stable_key) do update set
  position = excluded.position,
  section = excluded.section,
  format = excluded.format,
  payload = excluded.payload,
  is_original = excluded.is_original,
  points = excluded.points,
  updated_at = now();

do $verify$
declare
  stored_lessons integer;
  stored_questions integer;
begin
  select count(*) into stored_lessons
  from review_release_020_lessons source
  join public.review_lessons lesson
    on lesson.source_type = 'notion'
   and lesson.source_notion_page_id = source.source_notion_page_id
   and lesson.source_segment = source.source_segment
   and lesson.slug = source.slug;

  select count(*) into stored_questions
  from review_release_020_questions source
  join public.review_lessons lesson on lesson.slug = source.lesson_slug
  join public.review_questions question
    on question.lesson_id = lesson.id
   and question.stable_key = source.stable_key;

  if stored_lessons <> ${EXPECTED_LESSON_COUNT} or stored_questions <> ${EXPECTED_QUESTION_COUNT} then
    raise exception 'Release 020 verification failed: % lessons / % questions.', stored_lessons, stored_questions;
  end if;
end;
$verify$;

commit;
`;
}

function generatePublishMigration() {
  const slugs = sqlList(CANONICAL_NEW_LESSON_IDS);
  return `-- Publish the canonical 14-lesson release only after 019, 020 and 021.
-- This migration fails closed if lesson provenance, activity coverage or
-- Premium task coverage is incomplete.

begin;

do $preflight$
declare
  lesson_count integer;
  source_page_count integer;
  active_question_count integer;
  premium_task_count integer;
begin
  select count(*), count(distinct source_notion_page_id)
  into lesson_count, source_page_count
  from public.review_lessons
  where slug in (${slugs})
    and source_type = 'notion';

  if lesson_count <> ${EXPECTED_LESSON_COUNT} or source_page_count <> ${EXPECTED_NOTION_PAGE_COUNT} then
    raise exception 'Release 022 preflight failed: % lessons / % Notion pages.', lesson_count, source_page_count;
  end if;

  if exists (
    select 1
    from public.review_lessons
    where slug in (${slugs})
    group by source_notion_page_id, source_segment
    having count(*) > 1
  ) then
    raise exception 'Release 022 found duplicate Notion page + segment provenance.';
  end if;

  select count(*) into active_question_count
  from public.review_questions question
  join public.review_lessons lesson on lesson.id = question.lesson_id
  where lesson.slug in (${slugs})
    and question.active
    and question.stable_key like lesson.slug || '-draft-%';

  if active_question_count <> ${EXPECTED_QUESTION_COUNT} then
    raise exception 'Release 022 needs ${EXPECTED_QUESTION_COUNT} active generated questions, found %.', active_question_count;
  end if;

  if exists (
    select 1
    from public.review_lessons lesson
    left join public.review_questions question
      on question.lesson_id = lesson.id
     and question.active
     and question.stable_key like lesson.slug || '-draft-%'
    where lesson.slug in (${slugs})
    group by lesson.id
    having count(question.id) <> ${EXPECTED_QUESTION_COUNT_PER_LESSON}
       or count(distinct question.format) <> ${EXPECTED_FORMATS.length}
  ) then
    raise exception 'Release 022 requires 33 active questions across 14 formats for every lesson.';
  end if;

  select count(*) into premium_task_count
  from public.review_premium_tasks task
  join public.review_lessons lesson on lesson.id = task.lesson_id
  where lesson.slug in (${slugs})
    and task.active
    and task.task_type in ('speaking', 'essay');

  if premium_task_count <> ${EXPECTED_LESSON_COUNT * 2} then
    raise exception 'Release 022 needs ${EXPECTED_LESSON_COUNT * 2} active Premium tasks, found %.', premium_task_count;
  end if;

  if exists (
    select 1
    from public.review_lessons lesson
    left join public.review_premium_tasks task
     on task.lesson_id = lesson.id
     and task.active
     and task.task_type in ('speaking', 'essay')
    where lesson.slug in (${slugs})
    group by lesson.id
    having count(task.id) <> 2
       or count(distinct task.task_type) <> 2
       or bool_or(jsonb_typeof(task.topics) <> 'array' or jsonb_array_length(task.topics) < 2)
  ) then
    raise exception 'Release 022 requires one speaking and one essay task with reviewed topics per lesson.';
  end if;
end;
$preflight$;

update public.review_lessons
set status = 'published',
    audience = 'both',
    published_at = coalesce(published_at, now()),
    updated_at = now()
where slug in (${slugs})
  and source_type = 'notion';

do $verify$
declare
  published_count integer;
  public_count integer;
begin
  select count(*) into published_count
  from public.review_lessons
  where slug in (${slugs})
    and status = 'published'
    and audience = 'both';

  select count(*) into public_count
  from public.review_public_lessons
  where slug in (${slugs})
    and question_count >= ${EXPECTED_QUESTION_COUNT_PER_LESSON};

  if published_count <> ${EXPECTED_LESSON_COUNT} or public_count <> ${EXPECTED_LESSON_COUNT} then
    raise exception 'Release 022 publish verification failed: % published / % public.', published_count, public_count;
  end if;
end;
$verify$;

commit;
`;
}

function verifyPublishGenerationInputs() {
  if (!fs.existsSync(lessonOutput) || !fs.existsSync(premiumOutput)) {
    throw new Error("Generate migrations 020 and 021 before the release gate migration 022.");
  }
  const lessonMigration = fs.readFileSync(lessonOutput, "utf8");
  const premiumMigration = fs.readFileSync(premiumOutput, "utf8");
  if (!/Release 020 needs exactly 462 questions/.test(lessonMigration)) {
    throw new Error("Migration 020 does not contain the reviewed 462-question release.");
  }
  if (!/seeded_count <> 28/.test(premiumMigration)
      || !/'speaking'::text as task_type/.test(premiumMigration)
      || !/'essay'::text/.test(premiumMigration)) {
    throw new Error("Migration 021 does not contain the reviewed speaking + essay task release.");
  }
}

verifyAppliedMigrations();
const lessons = canonicalLessons();
if (generationMode === "content" || generationMode === "all") {
  fs.writeFileSync(lessonOutput, generateLessonMigration(lessons));
}
if (generationMode === "publish" || generationMode === "all") {
  verifyPublishGenerationInputs();
  fs.writeFileSync(publishOutput, generatePublishMigration());
}

console.log("Verified applied migrations 003, 009, 013, 016 and 017 are immutable.");
if (generationMode === "content" || generationMode === "all") {
  console.log(`Generated forward-only migration 020 with ${EXPECTED_LESSON_COUNT} lessons and ${EXPECTED_QUESTION_COUNT} questions.`);
}
if (generationMode === "publish" || generationMode === "all") {
  console.log("Generated release gate migration 022 after verifying 020 and 021 (019 → 020 → 021 → 022).");
}
