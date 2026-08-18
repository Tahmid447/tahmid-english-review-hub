import { writeFile } from "node:fs/promises";
import { PREMIUM_TOPIC_MANIFEST, validatePremiumTopicManifest } from "./premium-topic-manifest.mjs";

validatePremiumTopicManifest();

const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`;
const values = PREMIUM_TOPIC_MANIFEST.map(({ slug, topics }) => (
  `    (${sqlText(slug)}, ${sqlText(JSON.stringify(topics))}::jsonb)`
)).join(",\n");

const migration = `-- Premium topic choices and selected-topic persistence.
-- Generated from scripts/premium-topic-manifest.mjs. Do not edit topic JSON here.

alter table public.review_premium_tasks
  add column if not exists topics jsonb not null default '[]'::jsonb;

alter table public.review_task_submissions
  add column if not exists selected_topic_key text;

do $constraints$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.review_premium_tasks'::regclass
      and conname = 'review_premium_tasks_topics_array'
  ) then
    alter table public.review_premium_tasks
      add constraint review_premium_tasks_topics_array
      check (jsonb_typeof(topics) = 'array');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.review_task_submissions'::regclass
      and conname = 'review_task_submissions_topic_key_length'
  ) then
    alter table public.review_task_submissions
      add constraint review_task_submissions_topic_key_length
      check (selected_topic_key is null or length(btrim(selected_topic_key)) between 1 and 100);
  end if;
end;
$constraints$;

do $topics$
declare
  updated_count integer;
begin
  with source(slug, topics) as (
    values
${values}
  )
  update public.review_premium_tasks t
  set topics = source.topics,
      updated_at = now()
  from public.review_lessons l, source
  where t.lesson_id = l.id
    and l.slug = source.slug
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    );
  get diagnostics updated_count = row_count;
  if updated_count <> 34 then
    raise exception 'Premium topic update incomplete: expected 34 tasks, updated %.', updated_count;
  end if;
end;
$topics$;

create or replace function public.review_validate_submission_topic()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  task_topics jsonb;
begin
  select t.topics into task_topics
  from public.review_premium_tasks t
  where t.id = new.task_id;

  task_topics := coalesce(task_topics, '[]'::jsonb);
  if new.selected_topic_key is not null and not exists (
    select 1
    from jsonb_array_elements(task_topics) item
    where item ->> 'key' = btrim(new.selected_topic_key)
  ) then
    raise exception 'Choose a topic offered for this Premium task.';
  end if;

  if new.status = 'submitted'
     and jsonb_array_length(task_topics) > 0
     and nullif(btrim(coalesce(new.selected_topic_key, '')), '') is null then
    raise exception 'Choose a topic before submitting this Premium task.';
  end if;

  if tg_op = 'UPDATE'
     and old.status not in ('draft', 'returned')
     and new.selected_topic_key is distinct from old.selected_topic_key then
    raise exception 'The selected topic is locked while the teacher reviews this submission.';
  end if;
  return new;
end;
$function$;

revoke all on function public.review_validate_submission_topic() from public;

drop trigger if exists review_task_submissions_topic_validate
  on public.review_task_submissions;
create trigger review_task_submissions_topic_validate
before insert or update on public.review_task_submissions
for each row execute function public.review_validate_submission_topic();

do $verify$
declare
  covered_tasks integer;
  invalid_topics integer;
  invalid_topic_sets integer;
begin
  select count(*) into covered_tasks
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  where t.active
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    )
    and jsonb_array_length(t.topics) = 3;

  select count(*) into invalid_topics
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  cross join lateral jsonb_array_elements(t.topics) item
  where t.active
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

  select count(*) into invalid_topic_sets
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  where t.active
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    )
    and (
      jsonb_array_length(t.topics) <> 3
      or (select count(distinct item ->> 'key') from jsonb_array_elements(t.topics) item) <> 3
    );

  if covered_tasks <> 34 or invalid_topics <> 0 or invalid_topic_sets <> 0 then
    raise exception 'Premium topic verification failed: covered %, invalid topics %, invalid sets %.',
      covered_tasks, invalid_topics, invalid_topic_sets;
  end if;
end;
$verify$;

comment on column public.review_premium_tasks.topics is
  'Learner-safe bilingual topic choices with topic-specific prompts, phrases and vocabulary.';
comment on column public.review_task_submissions.selected_topic_key is
  'The stable topic chosen by the learner for this attempt.';
`;

const output = new URL("../supabase/migrations/202608180017_premium_task_topics.sql", import.meta.url);
await writeFile(output, migration);
console.log("Generated migration 017 for 17 lessons, 34 tasks and 51 topic definitions.");
