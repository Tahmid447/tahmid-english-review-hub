-- Publish the canonical 14-lesson release only after 019, 020 and 021.
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
  where slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    and source_type = 'notion';

  if lesson_count <> 14 or source_page_count <> 10 then
    raise exception 'Release 022 preflight failed: % lessons / % Notion pages.', lesson_count, source_page_count;
  end if;

  if exists (
    select 1
    from public.review_lessons
    where slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    group by source_notion_page_id, source_segment
    having count(*) > 1
  ) then
    raise exception 'Release 022 found duplicate Notion page + segment provenance.';
  end if;

  select count(*) into active_question_count
  from public.review_questions question
  join public.review_lessons lesson on lesson.id = question.lesson_id
  where lesson.slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    and question.active
    and question.stable_key like lesson.slug || '-draft-%';

  if active_question_count <> 462 then
    raise exception 'Release 022 needs 462 active generated questions, found %.', active_question_count;
  end if;

  if exists (
    select 1
    from public.review_lessons lesson
    left join public.review_questions question
      on question.lesson_id = lesson.id
     and question.active
     and question.stable_key like lesson.slug || '-draft-%'
    where lesson.slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    group by lesson.id
    having count(question.id) <> 33
       or count(distinct question.format) <> 14
  ) then
    raise exception 'Release 022 requires 33 active questions across 14 formats for every lesson.';
  end if;

  select count(*) into premium_task_count
  from public.review_premium_tasks task
  join public.review_lessons lesson on lesson.id = task.lesson_id
  where lesson.slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    and task.active
    and task.task_type in ('speaking', 'essay');

  if premium_task_count <> 28 then
    raise exception 'Release 022 needs 28 active Premium tasks, found %.', premium_task_count;
  end if;

  if exists (
    select 1
    from public.review_lessons lesson
    left join public.review_premium_tasks task
     on task.lesson_id = lesson.id
     and task.active
     and task.task_type in ('speaking', 'essay')
    where lesson.slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
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
where slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
  and source_type = 'notion';

do $verify$
declare
  published_count integer;
  public_count integer;
begin
  select count(*) into published_count
  from public.review_lessons
  where slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    and status = 'published'
    and audience = 'both';

  select count(*) into public_count
  from public.review_public_lessons
  where slug in ('july-30-part-1', 'july-30-part-2', 'august-02', 'august-03', 'august-09', 'august-10-part-1', 'august-10-part-2', 'august-16-part-1', 'august-16-part-2', 'august-17-part-1', 'august-17-part-2', 'august-23', 'august-24', 'august-25')
    and question_count >= 33;

  if published_count <> 14 or public_count <> 14 then
    raise exception 'Release 022 publish verification failed: % published / % public.', published_count, public_count;
  end if;
end;
$verify$;

commit;
