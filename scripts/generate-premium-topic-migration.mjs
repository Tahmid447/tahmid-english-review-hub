import { writeFile } from "node:fs/promises";
import {
  NEW_PREMIUM_TOPIC_MANIFEST,
  NEW_PREMIUM_TOPIC_SLUGS,
  validatePremiumTopicManifest,
} from "./premium-topic-manifest.mjs";

validatePremiumTopicManifest();

const EXPECTED_LESSON_COUNT = 14;
const EXPECTED_TASK_COUNT = EXPECTED_LESSON_COUNT * 2;
const EXPECTED_TOPIC_COUNT = EXPECTED_LESSON_COUNT * 3;

if (NEW_PREMIUM_TOPIC_MANIFEST.length !== EXPECTED_LESSON_COUNT) {
  throw new Error(`Expected ${EXPECTED_LESSON_COUNT} new Premium lesson topic sets, found ${NEW_PREMIUM_TOPIC_MANIFEST.length}.`);
}

const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`;
const values = NEW_PREMIUM_TOPIC_MANIFEST.map(({ slug, topics }) => (
  `    (${sqlText(slug)}, ${sqlText(JSON.stringify(topics))}::jsonb)`
)).join(",\n");
const slugList = NEW_PREMIUM_TOPIC_SLUGS.map(sqlText).join(", ");

const migration = `-- Premium speaking/writing tasks and bilingual topic choices for the 14 new lessons.
-- Forward-only extension generated from scripts/premium-topic-manifest.mjs.
-- Requires migration 020 to have inserted all referenced review_lessons rows.

do $requirements$
declare
  lesson_count integer;
  active_teacher_count integer;
begin
  select count(*) into lesson_count
  from public.review_lessons
  where slug in (${slugList});

  if lesson_count <> ${EXPECTED_LESSON_COUNT} then
    raise exception 'Premium task prerequisites incomplete: expected ${EXPECTED_LESSON_COUNT} lessons from migration 020, found %.', lesson_count;
  end if;

  select count(*) into active_teacher_count
  from public.review_teachers
  where active;

  if active_teacher_count < 1 then
    raise exception 'Premium task prerequisites incomplete: an active teacher is required.';
  end if;
end;
$requirements$;

with source(slug, topics) as (
  values
${values}
),
author as (
  select user_id
  from public.review_teachers
  where active
  order by created_at, user_id
  limit 1
),
prepared as (
  select
    l.id as lesson_id,
    l.title_en,
    l.title_ja,
    source.slug,
    source.topics,
    author.user_id as teacher_id
  from source
  join public.review_lessons l on l.slug = source.slug
  cross join author
),
tasks as (
  select
    p.lesson_id,
    p.slug || '-premium-speaking-v1' as stable_key,
    'speaking'::text as task_type,
    'Speaking review · ' || p.title_en as title_en,
    'スピーキング添削 · ' || coalesce(p.title_ja, p.title_en) as title_ja,
    'Choose one of the three lesson topics and record a 60–90 second response. Give one concrete example, use the recommended language naturally and explain why the idea matters to you.' as prompt_en,
    '3つのレッスントピックから1つ選び、60〜90秒で録音してください。具体例を1つ挙げ、おすすめ表現を自然に使い、自分にとってなぜ大切かも説明しましょう。' as prompt_ja,
    'Plan briefly, record once, listen back, then re-record if needed before submitting.' as instructions_en,
    '短く内容を考えて録音し、聞き直してから必要に応じて録り直して提出してください。' as instructions_ja,
    coalesce(p.topics -> 0 -> 'phrases', '[]'::jsonb) as required_phrases,
    coalesce(p.topics -> 0 -> 'vocabulary', '[]'::jsonb) as required_vocabulary,
    90::integer as target_seconds,
    null::integer as min_word_count,
    null::integer as max_word_count,
    3::integer as max_attempts,
    true as active,
    p.teacher_id as created_by,
    p.topics
  from prepared p

  union all

  select
    p.lesson_id,
    p.slug || '-premium-essay-v1',
    'essay'::text,
    'Writing review · ' || p.title_en,
    '英作文添削 · ' || coalesce(p.title_ja, p.title_en),
    'Choose one of the three lesson topics and write 100–180 words. Give a clear reason, one supporting example and a final takeaway while using the recommended language naturally.',
    '3つのレッスントピックから1つ選び、100〜180語で書いてください。おすすめ表現を自然に使い、理由・具体例・最後のまとめを入れましょう。',
    'Write a clear beginning, supporting detail and final sentence. Check grammar, word choice and verb tense before submitting.',
    '導入・具体的な説明・最後の一文を入れ、提出前に文法・語彙・動詞の時制を確認してください。',
    coalesce(p.topics -> 0 -> 'phrases', '[]'::jsonb),
    coalesce(p.topics -> 0 -> 'vocabulary', '[]'::jsonb),
    null::integer,
    100::integer,
    180::integer,
    3::integer,
    true,
    p.teacher_id,
    p.topics
  from prepared p
)
insert into public.review_premium_tasks (
  lesson_id, stable_key, task_type, title_en, title_ja,
  prompt_en, prompt_ja, instructions_en, instructions_ja,
  required_phrases, required_vocabulary, target_seconds,
  min_word_count, max_word_count, max_attempts, active, created_by, topics
)
select
  lesson_id, stable_key, task_type, title_en, title_ja,
  prompt_en, prompt_ja, instructions_en, instructions_ja,
  required_phrases, required_vocabulary, target_seconds,
  min_word_count, max_word_count, max_attempts, active, created_by, topics
from tasks
on conflict (lesson_id, stable_key) do update set
  task_type = excluded.task_type,
  title_en = excluded.title_en,
  title_ja = excluded.title_ja,
  prompt_en = excluded.prompt_en,
  prompt_ja = excluded.prompt_ja,
  instructions_en = excluded.instructions_en,
  instructions_ja = excluded.instructions_ja,
  required_phrases = excluded.required_phrases,
  required_vocabulary = excluded.required_vocabulary,
  target_seconds = excluded.target_seconds,
  min_word_count = excluded.min_word_count,
  max_word_count = excluded.max_word_count,
  max_attempts = excluded.max_attempts,
  active = true,
  topics = excluded.topics,
  updated_at = now();

do $verify$
declare
  seeded_count integer;
  speaking_count integer;
  essay_count integer;
  topic_count integer;
  invalid_topic_count integer;
  invalid_task_count integer;
begin
  select
    count(*),
    count(*) filter (where t.task_type = 'speaking'),
    count(*) filter (where t.task_type = 'essay'),
    coalesce(sum(jsonb_array_length(t.topics)), 0)
  into seeded_count, speaking_count, essay_count, topic_count
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  where t.active
    and l.slug in (${slugList})
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    );

  select count(*) into invalid_topic_count
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  cross join lateral jsonb_array_elements(t.topics) item
  where t.active
    and l.slug in (${slugList})
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    )
    and (
      jsonb_typeof(item) <> 'object'
      or nullif(btrim(item ->> 'key'), '') is null
      or nullif(btrim(item ->> 'title_en'), '') is null
      or nullif(btrim(item ->> 'title_ja'), '') is null
      or nullif(btrim(item ->> 'description_en'), '') is null
      or nullif(btrim(item ->> 'description_ja'), '') is null
      or nullif(btrim(item ->> 'speaking_prompt_en'), '') is null
      or nullif(btrim(item ->> 'speaking_prompt_ja'), '') is null
      or nullif(btrim(item ->> 'essay_prompt_en'), '') is null
      or nullif(btrim(item ->> 'essay_prompt_ja'), '') is null
      or jsonb_typeof(item -> 'phrases') <> 'array'
      or jsonb_array_length(item -> 'phrases') not between 3 and 6
      or jsonb_typeof(item -> 'vocabulary') <> 'array'
      or jsonb_array_length(item -> 'vocabulary') not between 3 and 8
    );

  select count(*) into invalid_task_count
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  where t.active
    and l.slug in (${slugList})
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    )
    and (
      jsonb_array_length(t.topics) <> 3
      or (select count(distinct item ->> 'key') from jsonb_array_elements(t.topics) item) <> 3
      or (t.task_type = 'speaking' and (t.target_seconds <> 90 or t.min_word_count is not null or t.max_word_count is not null))
      or (t.task_type = 'essay' and (t.target_seconds is not null or t.min_word_count <> 100 or t.max_word_count <> 180))
    );

  if seeded_count <> ${EXPECTED_TASK_COUNT}
     or speaking_count <> ${EXPECTED_LESSON_COUNT}
     or essay_count <> ${EXPECTED_LESSON_COUNT}
     or topic_count <> ${EXPECTED_TASK_COUNT * 3}
     or invalid_topic_count <> 0
     or invalid_task_count <> 0 then
    raise exception 'New Premium task verification failed: tasks %, speaking %, essay %, topic rows %, invalid topics %, invalid tasks %.',
      seeded_count, speaking_count, essay_count, topic_count, invalid_topic_count, invalid_task_count;
  end if;
end;
$verify$;

comment on column public.review_premium_tasks.topics is
  'Learner-safe bilingual topic choices with topic-specific prompts, phrases and vocabulary.';
`;

const output = new URL("../supabase/migrations/202608280021_new_lesson_premium_tasks_topics.sql", import.meta.url);
await writeFile(output, migration);
console.log(`Generated forward migration 021 for ${EXPECTED_LESSON_COUNT} lessons, ${EXPECTED_TASK_COUNT} tasks and ${EXPECTED_TOPIC_COUNT} topic definitions.`);
