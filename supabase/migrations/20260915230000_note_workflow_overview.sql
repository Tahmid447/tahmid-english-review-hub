-- A bounded read of existing notebook state. No new learning or notification records.
create function public.review_note_overview(max_notes integer default 30, for_teacher boolean default false) returns jsonb
language sql stable security invoker set search_path = '' as $$
 with visible as materialized (
  select n.* from public.review_lesson_notes n
  where n.deleted_at is null and n.status <> 'archived'
    and case when for_teacher then n.teacher_id = auth.uid() else n.student_id = auth.uid() end
 ), summaries as (
  select n.id, n.student_id, n.title, n.summary, n.focus, n.tags, n.status,
   n.lesson_date, n.version, n.updated_at, n.published_at,
   coalesce(s.viewed_version, 0) as viewed_version,
   coalesce(s.reviewed_version, 0) as reviewed_version,
   coalesce(p.total, 0) as practice_total,
   coalesce(p.completed, 0) as practice_completed,
   coalesce(p.attempted, 0) as practice_attempted,
   coalesce(p.needs_review, 0) as practice_review,
   p.next_block, p.last_practice_at,
   (select count(*) from public.review_lesson_note_suggestions g where g.note_id = n.id and g.status = 'pending') as pending_suggestions,
   (select count(*) from public.review_lesson_note_notifications i where i.note_id = n.id and i.recipient_id = auth.uid() and i.unread) as unread_activity
  from visible n
  left join public.review_lesson_note_review_status s on s.note_id = n.id and s.student_id = n.student_id
  left join lateral (
   select count(*) as total, count(*) filter(where a.completed) as completed,
    count(*) filter(where a.answered_at is not null) as attempted,
    count(*) filter(where a.is_correct = false or a.self_check_status = 'review') as needs_review,
    (array_agg(b.value->>'id' order by b.ordinality) filter(where not coalesce(a.completed, false) or a.is_correct = false or a.self_check_status = 'review'))[1] as next_block,
    max(a.updated_at) as last_practice_at
   from jsonb_array_elements(n.content_json->'blocks') with ordinality b
   left join public.review_lesson_note_practice_attempts a on a.note_id = n.id and a.student_id = n.student_id
    and a.question_id = coalesce(nullif(b.value->>'questionId',''), b.value->>'id') and a.question_snapshot = b.value
   where b.value->>'type' in ('quick_practice','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review')
  ) p on true
 ), ordered as (
  select * from summaries
  order by (pending_suggestions > 0) desc, (unread_activity > 0) desc,
   (viewed_version < version and status = 'published') desc,
   (practice_total > practice_completed) desc, updated_at desc, id
  limit greatest(1, least(coalesce(max_notes, 30), 100))
 )
 select jsonb_build_object('notes', coalesce((select jsonb_agg(to_jsonb(o)) from ordered o), '[]'::jsonb),
  'new_notes', (select count(*) from summaries where status = 'published' and viewed_version = 0),
  'updated_notes', (select count(*) from summaries where status = 'published' and viewed_version > 0 and viewed_version < version),
  'unfinished_notes', (select count(*) from summaries where status = 'published' and practice_total > practice_completed),
  'total_notes', (select count(*) from summaries));
$$;
revoke all on function public.review_note_overview(integer,boolean) from public, anon;
grant execute on function public.review_note_overview(integer,boolean) to authenticated;
