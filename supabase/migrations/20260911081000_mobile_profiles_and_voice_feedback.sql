-- Forward-only: retain existing WebP photos; new photos use Safari-compatible JPEG.
update storage.buckets set allowed_mime_types=array['image/webp','image/jpeg'], file_size_limit=102400, public=false where id='review-avatars';
create or replace function public.review_can_read_avatar(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select auth.uid() is not null and exists(select 1 from public.review_profiles p
    where object_name in (p.user_id::text||'/avatar.webp',p.user_id::text||'/avatar.jpg')
      and (p.user_id=auth.uid() or public.review_teacher_can_manage(p.user_id)))
$$;
drop policy review_avatar_insert on storage.objects;
create policy review_avatar_insert on storage.objects for insert to authenticated
with check(bucket_id='review-avatars' and name in(auth.uid()::text||'/avatar.webp',auth.uid()::text||'/avatar.jpg'));
drop policy review_avatar_update on storage.objects;
create policy review_avatar_update on storage.objects for update to authenticated
using(bucket_id='review-avatars' and name in(auth.uid()::text||'/avatar.webp',auth.uid()::text||'/avatar.jpg'))
with check(bucket_id='review-avatars' and name in(auth.uid()::text||'/avatar.webp',auth.uid()::text||'/avatar.jpg'));
drop policy review_avatar_delete on storage.objects;
create policy review_avatar_delete on storage.objects for delete to authenticated
using(bucket_id='review-avatars' and name in(auth.uid()::text||'/avatar.webp',auth.uid()::text||'/avatar.jpg'));

-- Audio belongs to the same private/published review as its text and score.
alter table public.review_submission_feedback
  add column audio_object_path text,
  add column audio_duration_seconds numeric;
alter table public.review_submission_feedback drop constraint review_submission_feedback_check;
alter table public.review_submission_feedback add constraint review_feedback_content_check
  check(feedback_en is not null or feedback_ja is not null or audio_object_path is not null);
alter table public.review_submission_feedback add constraint review_feedback_audio_check
  check((audio_object_path is null and audio_duration_seconds is null) or
    (audio_object_path is not null and audio_duration_seconds is not null and length(audio_object_path)<=180 and audio_duration_seconds>0 and audio_duration_seconds<=180));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('review-feedback-recordings','review-feedback-recordings',false,5242880,array['audio/mp4','audio/webm','audio/ogg','audio/wav','audio/x-wav','audio/mpeg']);

create function public.review_feedback_audio_target(object_name text)
returns uuid language plpgsql immutable set search_path=public,pg_temp as $$
begin
  if object_name !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(mp4|webm|ogg|wav|mp3)$' then return null; end if;
  return split_part(object_name,'/',2)::uuid;
end $$;

create function public.review_can_manage_feedback_audio(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select public.is_review_teacher() and split_part(object_name,'/',1)=auth.uid()::text
    and exists(select 1 from public.review_task_submissions s
      where s.id=public.review_feedback_audio_target(object_name) and s.status<>'draft'
        and public.review_teacher_can_manage(s.user_id))
$$;
create function public.review_can_read_feedback_audio(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select public.review_can_manage_feedback_audio(object_name) or exists(
    select 1 from public.review_submission_feedback f join public.review_task_submissions s on s.id=f.submission_id
    where f.audio_object_path=object_name and f.published_at is not null and s.user_id=auth.uid() and public.review_student_hub_feature_enabled('homework'))
$$;
create function public.review_feedback_audio_upload_allowed(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select public.review_can_manage_feedback_audio(object_name) and
    (select count(*) from storage.objects o where o.bucket_id='review-feedback-recordings'
       and split_part(o.name,'/',1)=auth.uid()::text
       and public.review_feedback_audio_target(o.name)=public.review_feedback_audio_target(object_name))<4
$$;
create function public.review_feedback_audio_delete_allowed(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select public.review_can_manage_feedback_audio(object_name) and not exists(
    select 1 from public.review_submission_feedback f where f.audio_object_path=object_name)
$$;
revoke all on function public.review_feedback_audio_target(text),public.review_can_manage_feedback_audio(text),public.review_can_read_feedback_audio(text),public.review_feedback_audio_upload_allowed(text),public.review_feedback_audio_delete_allowed(text) from public;
grant execute on function public.review_feedback_audio_target(text),public.review_can_manage_feedback_audio(text),public.review_can_read_feedback_audio(text),public.review_feedback_audio_upload_allowed(text),public.review_feedback_audio_delete_allowed(text) to authenticated;
create policy review_feedback_audio_read on storage.objects for select to authenticated
using(bucket_id='review-feedback-recordings' and public.review_can_read_feedback_audio(name));
create policy review_feedback_audio_insert on storage.objects for insert to authenticated
with check(bucket_id='review-feedback-recordings' and public.review_feedback_audio_upload_allowed(name));
-- No update: a published recording cannot be silently overwritten by a draft.
create policy review_feedback_audio_delete on storage.objects for delete to authenticated
using(bucket_id='review-feedback-recordings' and public.review_feedback_audio_delete_allowed(name));

create function public.review_save_submission_review_with_audio(
  target_submission uuid,review_action text,review_score numeric default null,
  review_feedback_en text default null,review_feedback_ja text default null,
  review_audio_path text default null,review_audio_duration numeric default null
)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare target public.review_task_submissions%rowtype; feedback_id uuid; next_status text; publish_at timestamptz;
begin
  if not public.is_review_teacher() then raise exception 'Teacher authorisation is required.'; end if;
  if review_action is null or review_action not in('draft','publish','return') then raise exception 'Choose draft, publish or return.'; end if;
  if nullif(btrim(coalesce(review_feedback_en,'')),'') is null and nullif(btrim(coalesce(review_feedback_ja,'')),'') is null and review_audio_path is null then
    raise exception 'Add written or voice feedback before saving.';
  end if;
  if review_score is not null and (review_score<0 or review_score>100) then raise exception 'Score must be between 0 and 100.'; end if;
  select * into target from public.review_task_submissions where id=target_submission for update;
  if target.id is null or target.status='draft' or not public.review_teacher_can_manage(target.user_id) then raise exception 'This submission cannot be reviewed.'; end if;
  if review_action in('draft','return') and target.status not in('submitted','in_review') then raise exception 'This submission is not waiting for review.'; end if;
  if review_action='publish' and target.status not in('submitted','in_review','reviewed') then raise exception 'This submission cannot be published from its current state.'; end if;
  if review_audio_path is not null then
    if public.review_feedback_audio_target(review_audio_path) is distinct from target.id
      or not public.review_can_manage_feedback_audio(review_audio_path) then raise exception 'Recording must belong to this teacher and submission.'; end if;
    if review_audio_duration is null or review_audio_duration<=0 or review_audio_duration>180 then raise exception 'Voice feedback must be 3 minutes or shorter.'; end if;
    if not exists(select 1 from storage.objects where bucket_id='review-feedback-recordings' and name=review_audio_path) then raise exception 'Voice recording was not found in private storage.'; end if;
  elsif review_audio_duration is not null then raise exception 'Recording duration requires an audio file.';
  end if;
  next_status:=case review_action when 'publish' then 'reviewed' when 'return' then 'returned' else 'in_review' end;
  publish_at:=case when review_action in('publish','return') then now() else null end;
  insert into public.review_submission_feedback(submission_id,teacher_id,score,feedback_en,feedback_ja,audio_object_path,audio_duration_seconds,ai_assisted,published_at)
  values(target.id,auth.uid(),review_score,nullif(btrim(coalesce(review_feedback_en,'')),''),nullif(btrim(coalesce(review_feedback_ja,'')),''),review_audio_path,review_audio_duration,false,publish_at)
  on conflict(submission_id) do update set teacher_id=auth.uid(),score=excluded.score,feedback_en=excluded.feedback_en,feedback_ja=excluded.feedback_ja,
    audio_object_path=excluded.audio_object_path,audio_duration_seconds=excluded.audio_duration_seconds,ai_assisted=false,published_at=excluded.published_at,updated_at=now()
  returning id into feedback_id;
  update public.review_task_submissions set status=next_status where id=target.id;
  return jsonb_build_object('submissionId',target.id,'feedbackId',feedback_id,'status',next_status,'published',publish_at is not null);
end $$;
revoke all on function public.review_save_submission_review_with_audio(uuid,text,numeric,text,text,text,numeric) from public;
grant execute on function public.review_save_submission_review_with_audio(uuid,text,numeric,text,text,text,numeric) to authenticated;
