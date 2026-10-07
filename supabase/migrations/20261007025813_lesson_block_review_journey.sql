-- Additive learning signals. No existing lesson, answer or annotation is rewritten.
create function public.review_note_learning_point(b jsonb) returns boolean
language sql immutable set search_path='' as $$
 select coalesce(b->>'type' in ('useful_phrase','vocabulary','grammar_point','common_mistake',
 'natural_english_upgrade','japanese_to_english','pronunciation','comparison','nuance'),false);
$$;
create function public.review_note_learning_snapshot(b jsonb) returns jsonb
language sql immutable set search_path='' as $$
 select b - 'displayOptions' - 'pronunciation' - 'tags';
$$;

create table public.review_lesson_note_block_reviews (
 note_id uuid not null references public.review_lesson_notes(id) on delete cascade,
 student_id uuid not null references auth.users(id),
 block_id text not null,
 block_snapshot jsonb not null,
 state text not null check(state in ('understood','revisit','unmarked')),
 version integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key(note_id,student_id,block_id)
);
create index review_note_block_reviews_student on public.review_lesson_note_block_reviews(student_id,updated_at desc);
alter table public.review_lesson_note_block_reviews enable row level security;
revoke all on public.review_lesson_note_block_reviews from public,anon,authenticated;
grant select on public.review_lesson_note_block_reviews to authenticated;
create policy review_note_block_reviews_read on public.review_lesson_note_block_reviews
for select to authenticated using(public.review_note_access(note_id));

-- Students can read only their own learning events, for their activity chart.
-- Existing teacher access remains unchanged; no responses or note bodies are in these events.
create policy review_note_own_learning_activity on public.review_lesson_note_activity
for select to authenticated using(actor_id=(select auth.uid()) and actor_role='student'
 and action_type in ('practice','reviewed','block_understood','block_revisit')
 and public.review_note_access(note_id));

create function public.review_note_review_point(target_note uuid,target_block text,expected_block jsonb,
 review_state text,expected_version integer default 0) returns public.review_lesson_note_block_reviews
language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; b jsonb; r public.review_lesson_note_block_reviews;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) then raise exception 'Note unavailable';end if;
 b=public.review_note_block(n,target_block);
 if not public.review_note_learning_point(b) then raise exception 'Learning point unavailable';end if;
 if public.review_note_learning_snapshot(b) is distinct from public.review_note_learning_snapshot(expected_block)
 then raise exception 'NOTE_CONFLICT: refresh this learning point';end if;
 if review_state is null or review_state not in ('understood','revisit','unmarked') then raise exception 'Invalid review state';end if;
 select * into r from public.review_lesson_note_block_reviews where note_id=n.id and student_id=auth.uid() and block_id=target_block;
 if coalesce(r.version,0) is distinct from expected_version then raise exception 'NOTE_CONFLICT: review changed in another session';end if;
 if r.state=review_state and r.block_snapshot=public.review_note_learning_snapshot(b) then return r;end if;
 insert into public.review_lesson_note_block_reviews(note_id,student_id,block_id,block_snapshot,state)
 values(n.id,auth.uid(),target_block,public.review_note_learning_snapshot(b),review_state)
 on conflict(note_id,student_id,block_id) do update set block_snapshot=excluded.block_snapshot,state=excluded.state,
 version=review_lesson_note_block_reviews.version+1,updated_at=now() returning * into r;
 if review_state<>'unmarked' then
  perform public.review_note_event(n,case when review_state='understood' then 'block_understood' else 'block_revisit' end,target_block);
 end if;
 return r;
end;
$$;
revoke all on function public.review_note_review_point(uuid,text,jsonb,text,integer) from public,anon;
grant execute on function public.review_note_review_point(uuid,text,jsonb,text,integer) to authenticated;

-- Aggregates cover every visible published note. Only the next-action list is bounded.
create function public.review_note_journey(for_teacher boolean default false,target_student uuid default null,
 local_timezone text default 'Asia/Tokyo') returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if not exists(select 1 from pg_catalog.pg_timezone_names where name=local_timezone) then raise exception 'Invalid timezone';end if;
 with visible as materialized (
  select n.* from public.review_lesson_notes n where n.status='published' and n.deleted_at is null
   and case when for_teacher then n.teacher_id=auth.uid() else n.student_id=auth.uid() end
   and (target_student is null or n.student_id=target_student)
 ), summaries as materialized (
  select n.id,n.student_id,n.title,n.lesson_date,n.version,
   s.viewed_at,s.reviewed_at,coalesce(s.reviewed_version,0)>=n.version as reviewed,
   coalesce(l.total,0) as learning_total,coalesce(l.understood,0) as understood,coalesce(l.revisit,0) as revisit,
   coalesce(l.unmarked,0) as unmarked,l.next_point,l.next_revisit,l.last_review_at,
   coalesce(p.total,0) as practice_total,coalesce(p.completed,0) as practice_completed,
   coalesce(p.checked,0) as practice_checked,coalesce(p.correct,0) as practice_correct,
   coalesce(p.needs_review,0) as practice_review,p.next_practice,p.last_practice_at
  from visible n
  left join public.review_lesson_note_review_status s on s.note_id=n.id and s.student_id=n.student_id
  left join lateral (
   select count(*) as total,count(*) filter(where r.state='understood') as understood,
    count(*) filter(where r.state='revisit') as revisit,
    count(*) filter(where r.state is null or r.state='unmarked') as unmarked,
    (array_agg(b.value->>'id' order by b.ordinality) filter(where r.state is null or r.state='unmarked'))[1] as next_point,
    (array_agg(b.value->>'id' order by b.ordinality) filter(where r.state='revisit'))[1] as next_revisit,
    max(r.updated_at) filter(where r.state<>'unmarked') as last_review_at
   from jsonb_array_elements(n.content_json->'blocks') with ordinality b
   left join public.review_lesson_note_block_reviews r on r.note_id=n.id and r.student_id=n.student_id
    and r.block_id=b.value->>'id' and r.block_snapshot=public.review_note_learning_snapshot(b.value)
   where public.review_note_learning_point(b.value)
  ) l on true
  left join lateral (
   select count(*) as total,count(*) filter(where a.completed) as completed,
    count(*) filter(where a.is_correct is not null) as checked,count(*) filter(where a.is_correct) as correct,
    count(*) filter(where a.is_correct=false or a.self_check_status='review') as needs_review,
    (array_agg(b.value->>'id' order by b.ordinality) filter(where not coalesce(a.completed,false) or a.is_correct=false or a.self_check_status='review'))[1] as next_practice,
    max(a.updated_at) as last_practice_at
   from jsonb_array_elements(n.content_json->'blocks') with ordinality b
   left join public.review_lesson_note_practice_attempts a on a.note_id=n.id and a.student_id=n.student_id
    and a.question_id=coalesce(nullif(b.value->>'questionId',''),b.value->>'id') and a.question_snapshot=b.value
   where b.value->>'type' in ('quick_practice','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review')
  ) p on true
 ), days as (
  select ((now() at time zone local_timezone)::date-i)::text as day
  from generate_series(0,6) i
 ), events as (
  select (a.created_at at time zone local_timezone)::date::text as day,
   count(distinct (a.note_id,a.entity_key)) filter(where a.action_type in ('block_understood','block_revisit')) as points,
   count(distinct (a.note_id,a.entity_key)) filter(where a.action_type='practice') as practice
  from public.review_lesson_note_activity a join visible n on n.id=a.note_id and n.student_id=a.actor_id
  where a.actor_role='student' and a.created_at >= (((now() at time zone local_timezone)::date-6)::timestamp at time zone local_timezone)
   and a.action_type in ('practice','block_understood','block_revisit') group by 1
 ), totals as (
  select count(*) as lessons,count(*) filter(where viewed_at is not null) as opened,
   count(*) filter(where reviewed) as reviewed,
   coalesce(sum(learning_total),0) as learning_total,coalesce(sum(understood),0) as understood,
   coalesce(sum(revisit),0) as revisit,coalesce(sum(practice_total),0) as practice_total,
   coalesce(sum(practice_completed),0) as practice_completed,coalesce(sum(practice_checked),0) as practice_checked,
   coalesce(sum(practice_correct),0) as practice_correct from summaries
 )
 select jsonb_build_object('totals',(select to_jsonb(t) from totals t),'timezone',local_timezone,
  'days',(select jsonb_agg(jsonb_build_object('day',d.day,'points',coalesce(a.points,0),'practice',coalesce(a.practice,0)) order by d.day) from days d left join events a using(day)),
  'learners',(select coalesce(jsonb_agg(to_jsonb(x)),'[]') from (
   select student_id,count(*) as lessons,count(*) filter(where viewed_at is not null) as opened,
    sum(learning_total) as learning_total,sum(understood) as understood,sum(revisit) as revisit,
    sum(practice_total) as practice_total,sum(practice_completed) as practice_completed,
    max(greatest(last_review_at,last_practice_at)) as last_active_at
   from summaries group by student_id order by sum(revisit) desc,student_id
  ) x),
  'notes',(select coalesce(jsonb_agg(to_jsonb(x)),'[]') from (
   select * from summaries order by (revisit>0) desc,(unmarked>0) desc,lesson_date desc,id limit 100
  ) x)) into result;
 return result;
end;
$$;
revoke all on function public.review_note_journey(boolean,uuid,text) from public,anon;
grant execute on function public.review_note_journey(boolean,uuid,text) to authenticated;
