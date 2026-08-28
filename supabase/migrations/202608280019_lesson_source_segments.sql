-- Preserve one canonical Notion page while allowing reviewed instructional
-- segments (for example Part 1 and Part 2) to become separate lessons.

alter table public.review_lessons
  add column if not exists source_segment text not null default 'full';

-- A split-aware bundle may already have been imported under a `*-part-N`
-- slug before this column existed. Preserve that row as its matching segment
-- so the first post-migration sync updates it instead of creating a duplicate.
update public.review_lessons
set source_segment = substring(slug from '(part-[1-9][0-9]*)$')
where source_type = 'notion'
  and source_segment = 'full'
  and slug ~ '-part-[1-9][0-9]*$';

do $constraints$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_lessons'::regclass
      and conname = 'review_lessons_source_segment_format'
  ) then
    alter table public.review_lessons
      add constraint review_lessons_source_segment_format
      check (
        length(btrim(source_segment)) between 1 and 80
        and source_segment ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      );
  end if;
end;
$constraints$;

alter table public.review_lessons
  drop constraint if exists review_lessons_source_type_source_notion_page_id_key;

do $constraints$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_lessons'::regclass
      and conname = 'review_lessons_source_provenance_key'
  ) then
    alter table public.review_lessons
      add constraint review_lessons_source_provenance_key
      unique (source_type, source_notion_page_id, source_segment);
  end if;
end;
$constraints$;

comment on column public.review_lessons.source_segment is
  'Stable instructional segment within one source page, such as full, part-1 or part-2.';

-- Append source_segment to the existing learner-safe catalogue view. The
-- source page URL and private lesson content remain protected as before.
create or replace view public.review_public_lessons
with (security_barrier = true)
as
select
  l.id,
  l.slug,
  l.lesson_date,
  l.title_en,
  l.title_ja,
  l.summary_en,
  l.summary_ja,
  l.status,
  l.audience,
  l.content_version,
  case when l.is_preview then l.content else jsonb_build_object('themes', l.content -> 'themes') end as content,
  l.published_at,
  l.is_preview,
  (select count(*)::integer from public.review_questions q where q.lesson_id = l.id and q.active) as question_count,
  l.source_segment
from public.review_lessons l
where l.status = 'published'
  and l.audience in ('general', 'both');

revoke all on public.review_public_lessons from public, anon, authenticated;
grant select on public.review_public_lessons to anon, authenticated;

do $verify$
begin
  if exists (
    select 1
    from public.review_lessons
    where source_type = 'notion'
    group by source_type, source_notion_page_id, source_segment
    having count(*) > 1
  ) then
    raise exception 'Lesson source provenance is not unique by source type, Notion page and segment.';
  end if;
end;
$verify$;
