-- Teacher plan preview, private learner drafts, atomic review transitions and
-- complete Premium task coverage.
--
-- Migration 014 is already live. This migration is deliberately forward-only.

-- The same completeness rule is used by redemption and every paid-access
-- resolver. This keeps an incomplete Google/OAuth profile on Free access even
-- if a membership or learner override was approved before onboarding ended.
create or replace function public.review_profile_is_complete()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.review_profiles p
      where p.user_id = auth.uid()
        and nullif(btrim(coalesce(p.first_name, '')), '') is not null
        and nullif(btrim(coalesce(p.last_name, '')), '') is not null
        and nullif(btrim(coalesce(p.age_group, '')), '') is not null
        and nullif(btrim(coalesce(p.native_language, '')), '') is not null
        and nullif(btrim(coalesce(p.english_level, '')), '') is not null
    );
$$;

revoke all on function public.review_profile_is_complete() from public;
grant execute on function public.review_profile_is_complete()
  to anon, authenticated;

create or replace function public.review_has_active_membership(
  requested_scope text default 'general'
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_review_teacher()
    or (
      auth.uid() is not null
      and public.review_profile_is_complete()
      and exists (
        select 1
        from public.review_memberships m
        where m.user_id = auth.uid()
          and m.status = 'active'
          and m.starts_at <= now()
          and m.expires_at > now()
          and (m.access_scope = 'both' or m.access_scope = requested_scope)
      )
    );
$$;

revoke all on function public.review_has_active_membership(text) from public;
grant execute on function public.review_has_active_membership(text)
  to anon, authenticated;

create or replace function public.review_has_active_plan_membership()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and public.review_profile_is_complete()
    and exists (
      select 1
      from public.review_memberships m
      where m.user_id = auth.uid()
        and m.status = 'active'
        and m.starts_at <= now()
        and m.expires_at > now()
    );
$$;

revoke all on function public.review_has_active_plan_membership()
  from public;
grant execute on function public.review_has_active_plan_membership()
  to anon, authenticated;

create or replace function public.review_effective_plan()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when public.is_review_teacher() then 'premium_plus'
    when auth.uid() is null or not public.review_profile_is_complete() then 'free'
    else coalesce(
      (
        select o.plan_tier
        from public.review_learner_plan_overrides o
        where o.user_id = auth.uid()
          and o.plan_tier is not null
          and o.starts_at <= now()
          and (o.expires_at is null or o.expires_at > now())
      ),
      (
        select m.plan_tier
        from public.review_memberships m
        where m.user_id = auth.uid()
          and m.status = 'active'
          and m.starts_at <= now()
          and m.expires_at > now()
      ),
      'free'
    )
  end;
$$;

revoke all on function public.review_effective_plan() from public;
grant execute on function public.review_effective_plan()
  to anon, authenticated;

create or replace function public.review_has_feature(requested_feature text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when public.is_review_teacher() then true
    when auth.uid() is null or not public.review_profile_is_complete() then false
    else coalesce(
      (
        select (o.feature_flags ->> requested_feature)::boolean
        from public.review_learner_plan_overrides o
        where o.user_id = auth.uid()
          and o.feature_flags ? requested_feature
          and jsonb_typeof(o.feature_flags -> requested_feature) = 'boolean'
          and o.starts_at <= now()
          and (o.expires_at is null or o.expires_at > now())
      ),
      (
        select coalesce((p.entitlements ->> requested_feature)::boolean, false)
        from public.review_plan_catalog p
        where p.plan_key = public.review_effective_plan()
          and p.active
      ),
      false
    )
  end;
$$;

revoke all on function public.review_has_feature(text) from public;
grant execute on function public.review_has_feature(text)
  to anon, authenticated;

-- Preview lessons remain public. Every non-preview learner route, including an
-- explicit teacher allow, requires completed onboarding before paid/private
-- content can be selected through RLS.
create or replace function public.review_can_read_lesson(check_lesson uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.review_lessons l
    where l.id = check_lesson
      and l.status = 'published'
      and (
        public.is_review_teacher()
        or (
          l.audience in ('general', 'both')
          and l.is_preview
          and coalesce(public.review_lesson_access_mode(l.id), 'inherit') <> 'block'
        )
        or (
          public.review_profile_is_complete()
          and (
            public.review_lesson_access_mode(l.id) = 'allow'
            or (
              coalesce(public.review_lesson_access_mode(l.id), 'inherit') <> 'block'
              and (
                (
                  l.audience in ('general', 'both')
                  and public.review_has_active_membership('general')
                )
                or (
                  l.audience in ('takiwaki', 'both')
                  and public.review_has_active_membership('takiwaki')
                  and exists (
                    select 1
                    from public.review_profiles p
                    where p.user_id = auth.uid()
                      and p.access_scope = 'takiwaki'
                  )
                )
              )
            )
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_lesson(uuid) from public;
grant execute on function public.review_can_read_lesson(uuid)
  to anon, authenticated;

drop policy if exists review_lessons_select_catalog on public.review_lessons;
create policy review_lessons_select_catalog
on public.review_lessons for select
to anon, authenticated
using (
  public.is_review_teacher()
  or public.review_can_read_lesson(id)
);

-- The learner helper deliberately requires active questions in published,
-- readable lessons. Teacher Studio must additionally be able to edit draft,
-- review, archived, and currently inactive questions.
drop policy if exists review_questions_select_catalog on public.review_questions;
create policy review_questions_select_catalog
on public.review_questions for select
to anon, authenticated
using (
  public.is_review_teacher()
  or public.review_can_read_question(id)
);

-- A learner's unfinished essay is private until they explicitly submit it.
-- Teachers can review submitted/returned/reviewed work, but cannot select the
-- contents of a draft through the ordinary authenticated API.
drop policy if exists review_task_submissions_select
  on public.review_task_submissions;
create policy review_task_submissions_select
on public.review_task_submissions for select
to authenticated
using (
  user_id = auth.uid()
  or (public.is_review_teacher() and status <> 'draft')
);

-- A teacher must not be able to enumerate or sign an unfinished learner
-- recording merely by knowing its object path.
drop policy if exists review_recordings_select on storage.objects;
create policy review_recordings_select
on storage.objects for select
to authenticated
using (
  bucket_id = 'review-premium-recordings'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      public.is_review_teacher()
      and exists (
        select 1
        from public.review_task_submissions s
        join public.review_premium_tasks t
          on t.id = s.task_id
         and t.task_type = 'speaking'
        where s.audio_object_path = storage.objects.name
          and s.status <> 'draft'
          and cardinality(storage.foldername(storage.objects.name)) = 2
          and (storage.foldername(storage.objects.name))[1] = s.user_id::text
          and (storage.foldername(storage.objects.name))[2] = s.task_id::text
          and storage.filename(storage.objects.name)
            ~ '^[A-Za-z0-9-]+[.](webm|m4a|ogg|mp3)$'
      )
    )
  )
);

create or replace function public.review_recording_upload_within_quota(
  check_task uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, storage, pg_temp
as $$
  select exists (
    select 1
    from public.review_premium_tasks t
    where t.id = check_task
      and (
        select count(*)
        from storage.objects existing
        where existing.bucket_id = 'review-premium-recordings'
          and (storage.foldername(existing.name))[1] = auth.uid()::text
          and (storage.foldername(existing.name))[2] = t.id::text
      ) < least(t.max_attempts + 3, 23)
      and (
        select count(*)
        from storage.objects recent
        where recent.bucket_id = 'review-premium-recordings'
          and (storage.foldername(recent.name))[1] = auth.uid()::text
          and (storage.foldername(recent.name))[2] = t.id::text
          and recent.created_at > now() - interval '10 minutes'
      ) < 6
  );
$$;

revoke all on function public.review_recording_upload_within_quota(uuid)
  from public;
grant execute on function public.review_recording_upload_within_quota(uuid)
  to authenticated;

-- Recordings are stored as user-id/task-id/object-id.extension. Requiring an
-- active speaking task here prevents an authenticated client from using this
-- private bucket as arbitrary file storage or uploading under another task.
drop policy if exists review_recordings_insert_self on storage.objects;
create policy review_recordings_insert_self
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'review-premium-recordings'
  and not public.is_review_teacher()
  and cardinality(storage.foldername(name)) = 2
  and (storage.foldername(name))[1] = auth.uid()::text
  and storage.filename(name) ~ '^[A-Za-z0-9-]+[.](webm|m4a|ogg|mp3)$'
  and exists (
    select 1
    from public.review_premium_tasks t
    where t.id::text = (storage.foldername(storage.objects.name))[2]
      and t.task_type = 'speaking'
      and t.active
      and public.review_can_read_lesson(t.lesson_id)
      and public.review_has_feature('speaking_submission')
      -- Leave headroom for replacing one returned take, but cap abandoned
      -- uploads and rapid retries for each learner/task folder.
      and public.review_recording_upload_within_quota(t.id)
  )
);

drop policy if exists review_recordings_delete_safe on storage.objects;
create policy review_recordings_delete_safe
on storage.objects for delete
to authenticated
using (
  bucket_id = 'review-premium-recordings'
  -- Teachers never delete learner recordings directly. In particular, a
  -- draft-hidden row must not look "unlinked" through teacher SELECT RLS.
  and not public.is_review_teacher()
  and (storage.foldername(name))[1] = auth.uid()::text
  and not exists (
    select 1
    from public.review_task_submissions s
    where s.audio_object_path = storage.objects.name
      and s.status not in ('draft', 'returned')
  )
);

-- Teachers review through the transactional RPC below. Removing direct table
-- writes makes the status/feedback invariant enforceable at the database edge.
drop policy if exists review_task_submissions_update
  on public.review_task_submissions;
create policy review_task_submissions_update
on public.review_task_submissions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists review_task_submissions_insert_self
  on public.review_task_submissions;
create policy review_task_submissions_insert_self
on public.review_task_submissions for insert
to authenticated
with check (
  not public.is_review_teacher()
  and user_id = auth.uid()
  and exists (
    select 1
    from public.review_premium_tasks t
    where t.id = task_id
      and t.active
      and public.review_can_read_lesson(t.lesson_id)
      and public.review_has_feature(
        case when t.task_type = 'speaking'
          then 'speaking_submission'
          else 'essay_submission'
        end
      )
  )
);

drop policy if exists review_feedback_insert_teacher
  on public.review_submission_feedback;
drop policy if exists review_feedback_update_teacher
  on public.review_submission_feedback;
drop policy if exists review_feedback_delete_teacher
  on public.review_submission_feedback;
revoke insert, update, delete on public.review_submission_feedback
  from authenticated;

-- Keep learner state transitions deterministic. In particular, a returned
-- submission that is sent again receives a fresh queue timestamp and no stale
-- reviewed timestamp. Access is rechecked on every learner update so an
-- expired/disabled entitlement cannot be used to resubmit old work.
create or replace function public.review_validate_task_submission()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  task public.review_premium_tasks%rowtype;
  response_words integer;
  required_feature text;
  actor_is_teacher boolean := public.is_review_teacher();
begin
  select * into task
  from public.review_premium_tasks t
  where t.id = new.task_id;

  if task.id is null then
    raise exception 'Premium task not found.';
  end if;
  required_feature := case
    when task.task_type = 'speaking' then 'speaking_submission'
    else 'essay_submission'
  end;

  if tg_op = 'INSERT' then
    if actor_is_teacher then
      raise exception 'Teachers cannot create learner submissions.';
    end if;
    if new.user_id <> auth.uid() then
      raise exception 'A learner can only create their own submission.';
    end if;
    if (
         not task.active
         or not public.review_can_read_lesson(task.lesson_id)
         or not public.review_has_feature(required_feature)
       ) then
      raise exception 'This Premium review task is not available for this account.';
    end if;
    if new.status not in ('draft', 'submitted') then
      raise exception 'A new learner submission must be a draft or submitted.';
    end if;
    new.created_at := now();
    new.reviewed_at := null;
    new.submitted_at := case when new.status = 'submitted' then now() else null end;
  elsif not actor_is_teacher then
    if old.user_id <> auth.uid()
       or new.user_id <> old.user_id
       or new.task_id <> old.task_id
       or new.attempt_number <> old.attempt_number
       or old.status not in ('draft', 'returned')
       or new.status not in ('draft', 'submitted') then
      raise exception 'This submission is locked while the teacher reviews it.';
    end if;
    if not task.active
       or not public.review_can_read_lesson(task.lesson_id)
       or not public.review_has_feature(required_feature) then
      raise exception 'This Premium review task is not available for this account.';
    end if;
    new.created_at := old.created_at;
    new.reviewed_at := null;
    if new.status = 'submitted' then
      new.submitted_at := now();
    elsif old.status = 'draft' then
      new.submitted_at := null;
    else
      new.submitted_at := old.submitted_at;
    end if;
  end if;

  if tg_op = 'UPDATE' then
    if new.user_id <> old.user_id
       or new.task_id <> old.task_id
       or new.attempt_number <> old.attempt_number then
      raise exception 'Submission ownership, task and attempt number are immutable.';
    end if;
    new.created_at := old.created_at;
  end if;

  if new.attempt_number > task.max_attempts then
    raise exception 'This task allows at most % attempts.', task.max_attempts;
  end if;

  -- Audio is valid only for a speaking task and must point to the exact object
  -- uploaded for this learner and task. The object-existence check stops a
  -- guessed or stale path from becoming teacher-readable through a submission.
  if task.task_type = 'essay' then
    if new.audio_object_path is not null
       or new.duration_seconds is not null
       or new.transcript is not null then
      raise exception 'Essay submissions cannot attach speaking recording data.';
    end if;
  elsif new.audio_object_path is not null then
    if btrim(new.audio_object_path) !~ (
      '^' || new.user_id::text || '/' || new.task_id::text
      || '/[A-Za-z0-9-]+[.](webm|m4a|ogg|mp3)$'
    ) then
      raise exception 'The recording path must belong to this learner and speaking task.';
    end if;
    if new.duration_seconds is null then
      raise exception 'A speaking recording must include its duration.';
    end if;
    if not exists (
      select 1
      from storage.objects o
      where o.bucket_id = 'review-premium-recordings'
        and o.name = new.audio_object_path
    ) then
      raise exception 'The speaking recording was not found in private storage.';
    end if;
  elsif new.duration_seconds is not null then
    raise exception 'Recording duration cannot be saved without a recording.';
  end if;

  if new.status = 'submitted' then
    if task.task_type = 'essay' then
      if nullif(btrim(coalesce(new.text_response, '')), '') is null then
        raise exception 'Write your essay before submitting it.';
      end if;
      response_words := array_length(
        regexp_split_to_array(btrim(new.text_response), E'\\s+'),
        1
      );
      if response_words < task.min_word_count
         or response_words > task.max_word_count then
        raise exception 'The essay must contain between % and % words.',
          task.min_word_count, task.max_word_count;
      end if;
    elsif task.task_type = 'speaking' then
      if nullif(btrim(coalesce(new.audio_object_path, '')), '') is null
         and nullif(btrim(coalesce(new.transcript, '')), '') is null then
        raise exception 'Add a recording or transcript before submitting it.';
      end if;
      if new.duration_seconds is not null
         and new.duration_seconds > least(task.target_seconds + 60, 900) then
        raise exception 'The speaking recording is longer than this task allows.';
      end if;
    end if;
  end if;

  if actor_is_teacher and new.status in ('reviewed', 'returned') then
    new.reviewed_at := coalesce(new.reviewed_at, now());
  end if;
  return new;
end;
$$;

revoke all on function public.review_validate_task_submission() from public;

-- Feedback and submission status must change in one database transaction.
-- This prevents visible feedback with a stale submission state (or the reverse).
create or replace function public.review_save_submission_review(
  target_submission uuid,
  review_action text,
  review_score numeric default null,
  review_feedback_en text default null,
  review_feedback_ja text default null,
  review_ai_assisted boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target public.review_task_submissions%rowtype;
  feedback_id uuid;
  next_status text;
  publish_at timestamptz;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  if review_action is null or review_action not in ('draft', 'publish', 'return') then
    raise exception 'Choose draft, publish or return.';
  end if;
  if nullif(btrim(coalesce(review_feedback_en, '')), '') is null
     and nullif(btrim(coalesce(review_feedback_ja, '')), '') is null then
    raise exception 'Add English or Japanese feedback before saving.';
  end if;
  if review_score is not null and (review_score < 0 or review_score > 100) then
    raise exception 'Score must be between 0 and 100.';
  end if;

  select * into target
  from public.review_task_submissions
  where id = target_submission
  for update;

  if target.id is null or target.status = 'draft' then
    raise exception 'A private learner draft cannot be reviewed.';
  end if;
  if review_action in ('draft', 'return')
     and target.status not in ('submitted', 'in_review') then
    raise exception 'This submission is not waiting for review.';
  end if;
  if review_action = 'publish'
     and target.status not in ('submitted', 'in_review', 'reviewed') then
    raise exception 'This submission cannot be published from its current state.';
  end if;

  next_status := case review_action
    when 'publish' then 'reviewed'
    when 'return' then 'returned'
    else 'in_review'
  end;
  publish_at := case
    when review_action in ('publish', 'return') then now()
    else null
  end;

  insert into public.review_submission_feedback (
    submission_id, teacher_id, score, feedback_en, feedback_ja,
    ai_assisted, published_at
  ) values (
    target.id, auth.uid(), review_score,
    nullif(btrim(coalesce(review_feedback_en, '')), ''),
    nullif(btrim(coalesce(review_feedback_ja, '')), ''),
    false, publish_at
  )
  on conflict (submission_id) do update set
    teacher_id = auth.uid(),
    score = excluded.score,
    feedback_en = excluded.feedback_en,
    feedback_ja = excluded.feedback_ja,
    -- Keep the legacy compatibility column but do not create a new AI review
    -- workflow. Historical true values may remain on untouched old rows.
    ai_assisted = false,
    published_at = excluded.published_at,
    updated_at = now()
  returning id into feedback_id;

  update public.review_task_submissions
  set status = next_status
  where id = target.id;

  return jsonb_build_object(
    'submissionId', target.id,
    'feedbackId', feedback_id,
    'status', next_status,
    'published', publish_at is not null
  );
end;
$$;

revoke all on function public.review_save_submission_review(
  uuid, text, numeric, text, text, boolean
) from public;
grant execute on function public.review_save_submission_review(
  uuid, text, numeric, text, text, boolean
) to authenticated;

-- Teacher-only, plan-scoped lesson preview. Below-tier question payloads are
-- never included in the returned JSON, even though the caller is a teacher.
-- The result is a QA view only and never writes a learner entitlement.
create or replace function public.review_teacher_preview_lesson(
  lesson_slug text,
  preview_plan text default 'free'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  target public.review_lessons%rowtype;
  safe_plan text := lower(coalesce(preview_plan, 'free'));
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  if safe_plan not in ('free', 'standard', 'premium', 'premium_plus') then
    raise exception 'Invalid preview plan.';
  end if;

  select * into target
  from public.review_lessons l
  where l.slug = lesson_slug;
  if target.id is null then return null; end if;

  return jsonb_build_object(
    'plan', safe_plan,
    'lesson_accessible', (safe_plan <> 'free' or target.is_preview),
    'publication_status', target.status,
    'lesson', jsonb_build_object(
      'id', target.id,
      'slug', target.slug,
      'lesson_date', target.lesson_date,
      'title_en', target.title_en,
      'title_ja', target.title_ja,
      'summary_en', target.summary_en,
      'summary_ja', target.summary_ja,
      'status', target.status,
      'audience', target.audience,
      'source_type', target.source_type,
      'content_version', target.content_version,
      'content', case
        when safe_plan = 'free' then case
          -- Match review_public_lessons: the two complete sample lessons expose
          -- their full content, while locked catalog lessons expose safe themes only.
          when target.is_preview then coalesce(target.content, '{}'::jsonb)
          else jsonb_build_object('themes', target.content -> 'themes')
        end
        else target.content
      end,
      'is_preview', target.is_preview
    ),
    'questions', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'stable_key', q.stable_key,
          'position', q.position,
          'section', q.section,
          'format', q.format,
          'payload', q.payload,
          'is_original', q.is_original,
          'points', q.points,
          'required_plan', q.required_plan,
          'locked_display', q.locked_display
        ) order by q.position
      ), '[]'::jsonb)
      from public.review_questions q
      where q.lesson_id = target.id
        and q.active
        and (safe_plan <> 'free' or target.is_preview)
        and public.review_plan_rank(safe_plan)
            >= public.review_plan_rank(q.required_plan)
    ),
    'locked_questions', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'position', q.position,
          'section', q.section,
          'format', q.format,
          'required_plan', q.required_plan
        ) order by q.position
      ), '[]'::jsonb)
      from public.review_questions q
      where q.lesson_id = target.id
        and q.active
        and (safe_plan <> 'free' or target.is_preview)
        and q.locked_display = 'blur'
        and public.review_plan_rank(safe_plan)
            < public.review_plan_rank(q.required_plan)
    ),
    'premium_tasks', (
      select case
        when not (safe_plan <> 'free' or target.is_preview)
          or public.review_plan_rank(safe_plan) < public.review_plan_rank('premium')
          then '[]'::jsonb
        else coalesce(jsonb_agg(
          jsonb_build_object(
            'id', t.id,
            'lesson_id', t.lesson_id,
            'stable_key', t.stable_key,
            'task_type', t.task_type,
            'title_en', t.title_en,
            'title_ja', t.title_ja,
            'prompt_en', t.prompt_en,
            'prompt_ja', t.prompt_ja,
            'instructions_en', t.instructions_en,
            'instructions_ja', t.instructions_ja,
            'required_phrases', t.required_phrases,
            'required_vocabulary', t.required_vocabulary,
            'target_seconds', t.target_seconds,
            'min_word_count', t.min_word_count,
            'max_word_count', t.max_word_count,
            'max_attempts', t.max_attempts,
            'active', t.active
          ) order by t.task_type
        ), '[]'::jsonb)
      end
      from public.review_premium_tasks t
      where t.lesson_id = target.id
        and t.active
    )
  );
end;
$$;

revoke all on function public.review_teacher_preview_lesson(text, text) from public;
grant execute on function public.review_teacher_preview_lesson(text, text)
  to authenticated;

-- Rotate an access code in one transaction. Locking the source row before the
-- enabled check ensures concurrent requests cannot create two valid
-- replacements. The full replacement code is returned once and only its hash
-- is stored.
create or replace function public.review_reissue_access_code(target_code uuid)
returns table (access_code text, code_id uuid)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  current_code public.review_access_codes%rowtype;
  raw_code text;
  replacement_id uuid;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  if target_code is null then
    raise exception 'Choose an access code to reissue.';
  end if;

  select * into current_code
  from public.review_access_codes c
  where c.id = target_code
  for update;

  if current_code.id is null then
    raise exception 'Access code not found.';
  end if;
  if not current_code.enabled then
    raise exception 'Access code is already disabled or reissued.';
  end if;

  raw_code := 'TEC-' || upper(
    substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12)
  );
  insert into public.review_access_codes (
    label, code_hash, code_last4, duration_days, access_scope,
    plan_tier, max_uses, use_count, enabled, valid_until, created_by
  ) values (
    left(btrim(current_code.label) || ' (reissued)', 100),
    encode(extensions.digest(raw_code, 'sha256'), 'hex'),
    right(raw_code, 4),
    current_code.duration_days,
    current_code.access_scope,
    current_code.plan_tier,
    current_code.max_uses,
    0,
    true,
    case
      when current_code.valid_until > now() then current_code.valid_until
      else null
    end,
    auth.uid()
  ) returning id into replacement_id;

  update public.review_access_codes
  set enabled = false
  where id = current_code.id;

  return query select raw_code, replacement_id;
end;
$$;

revoke all on function public.review_reissue_access_code(uuid) from public;
grant execute on function public.review_reissue_access_code(uuid)
  to authenticated;

-- Keep access-code redemption transactional and never downgrade a still-active
-- higher tier. Row locking protects use counts and redemption history.
-- The earlier function returns three columns. PostgreSQL cannot change a
-- function return table with CREATE OR REPLACE, so replace it atomically inside
-- this migration transaction before adding membership_plan to the response.
drop function if exists public.review_redeem_access_code(text);

create or replace function public.review_redeem_access_code(raw_code text)
returns table (
  membership_status text,
  membership_scope text,
  membership_plan text,
  membership_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  matched public.review_access_codes%rowtype;
  current_membership public.review_memberships%rowtype;
  next_expiry timestamptz;
  next_plan text;
  next_scope text;
begin
  if auth.uid() is null then
    raise exception 'Sign in before redeeming an access code.';
  end if;
  if raw_code is null or upper(btrim(raw_code)) !~ '^TEC-[A-F0-9]{12}$' then
    raise exception 'Access code format is invalid.';
  end if;
  if not public.review_profile_is_complete() then
    raise exception 'Complete the learner profile before redeeming an access code.';
  end if;

  -- Serialize different code redemptions for the same learner, including the
  -- first redemption before a membership row exists.
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text, 0));

  select * into matched
  from public.review_access_codes c
  where c.code_hash = encode(
    extensions.digest(upper(btrim(raw_code)), 'sha256'),
    'hex'
  )
  for update;

  if matched.id is null then raise exception 'Access code not found.'; end if;
  if not matched.enabled then raise exception 'Access code disabled.'; end if;
  if matched.valid_until is not null and matched.valid_until <= now() then
    raise exception 'Access code expired.';
  end if;
  if exists (
    select 1 from public.review_access_code_redemptions r
    where r.code_id = matched.id and r.user_id = auth.uid()
  ) then
    raise exception 'Access code already redeemed by this account.';
  end if;
  if matched.use_count >= matched.max_uses then
    raise exception 'Access code used up.';
  end if;

  select * into current_membership
  from public.review_memberships m
  where m.user_id = auth.uid()
  for update;

  -- A single membership row cannot represent overlapping plan/scope periods.
  -- Reject an incompatible grant instead of over-extending the higher access.
  if current_membership.status = 'active'
     and current_membership.starts_at <= now()
     and current_membership.expires_at > now()
     and (
       current_membership.plan_tier <> matched.plan_tier
       or current_membership.access_scope <> matched.access_scope
     ) then
    raise exception 'Access code conflicts with the active membership. Ask the teacher to adjust or replace it.';
  end if;

  next_expiry := case
    when current_membership.status = 'active'
      and current_membership.starts_at <= now()
      and current_membership.expires_at > now()
      then current_membership.expires_at
    else now()
  end + make_interval(days => matched.duration_days);
  next_plan := matched.plan_tier;
  next_scope := matched.access_scope;

  insert into public.review_memberships (
    user_id, status, access_scope, plan_tier, plan_label,
    starts_at, expires_at, approval_source, approved_at
  ) values (
    auth.uid(), 'active', next_scope, next_plan, matched.label,
    now(), next_expiry, 'access_code', now()
  )
  on conflict (user_id) do update set
    status = 'active',
    access_scope = next_scope,
    plan_tier = next_plan,
    plan_label = excluded.plan_label,
    starts_at = least(coalesce(public.review_memberships.starts_at, now()), now()),
    expires_at = next_expiry,
    approval_source = 'access_code',
    approved_at = now(),
    updated_at = now();

  insert into public.review_access_code_redemptions (code_id, user_id)
  values (matched.id, auth.uid());
  update public.review_access_codes
  set use_count = use_count + 1
  where id = matched.id;

  if next_scope in ('takiwaki', 'both') then
    update public.review_profiles
    set access_scope = 'takiwaki'
    where user_id = auth.uid();
  end if;

  return query select 'active'::text, next_scope, next_plan, next_expiry;
end;
$$;

revoke all on function public.review_redeem_access_code(text) from public;
grant execute on function public.review_redeem_access_code(text) to authenticated;

-- Every catalogued launch lesson receives one speaking task and one essay task. The
-- scenarios are lesson-specific; stable keys make this seed idempotent.
with task_seed (
  slug, focus_en, focus_ja, situation_en, situation_ja, phrase_one, phrase_two
) as (
  values
    ('june-28', 'polite café questions and natural replies', 'カフェでの丁寧な質問と自然な返答', 'ordering at a café and responding when a choice is unavailable', 'カフェで注文し、希望の品がない時に返答する場面', 'What would you like to drink?', 'How about you?'),
    ('june-29', 'heard/hear reactions and position language', 'heard / hear の反応と位置表現', 'explaining what you heard and guiding someone to the correct position', '聞こえた内容を説明し、正しい位置へ案内する場面', 'I heard what she said.', 'in the top-right corner'),
    ('june-30', 'feelings, preferences and comparisons', '感情・好み・比較表現', 'discussing a sports match and explaining a personal preference', '試合について話し、自分の好みと理由を説明する場面', 'I am annoyed.', 'I prefer it because…'),
    ('july-04', 'unavoidable situations, safety and gratitude', '避けられない状況・安全・感謝', 'describing an unexpected problem and how you handled it safely', '予想外の問題と、安全に対処した方法を説明する場面', 'I couldn’t avoid it.', 'Thank you for helping me.'),
    ('july-05', 'natural reactions, reasons and everyday choices', '自然な反応・理由・日常の選択', 'choosing food or a familiar option and responding naturally to a friend', '食べ物や定番を選び、友人へ自然に返答する場面', 'It is good, though.', 'That is my go-to choice.'),
    ('july-06', 'grammar choices and natural conversation nuance', '文法の選択と自然な会話のニュアンス', 'correcting a misunderstanding and continuing the conversation politely', '誤解を訂正し、丁寧に会話を続ける場面', 'What I mean is…', 'It depends on the situation.'),
    ('july-07', 'bring/buy and acting for another person', 'bring / buy と人のための行動', 'helping someone after their phone dies and acting on their behalf', '携帯の充電が切れた人を助け、代わりに行動する場面', 'My phone died.', 'I did it on your behalf.'),
    ('july-11', 'connections, live broadcasts and noticing changes', '接続・生放送・変化への気づき', 'solving a connection problem during a live broadcast', '生放送中の接続問題を解決する場面', 'My phone is connected to the Wi-Fi.', 'I noticed the signal was weak.'),
    ('july-12', 'present perfect, any and yet', '現在完了・any・yet', 'asking about meals or experiences and comparing them with a finished past event', '食事や経験を尋ね、完了した過去の出来事と比べる場面', 'Have you had lunch yet?', 'I haven’t had any yet.'),
    ('july-13', 'possibility, timing and city communication', '可能性・時間帯・街での会話', 'making an uncertain plan while dealing with a weak phone signal', '電波が弱い中で、不確かな予定を相談する場面', 'Someone might call me around this time.', 'My signal is weak.'),
    ('july-18', 'be supposed to, helper verbs and emergency language', 'be supposed to・助動詞・緊急時の表現', 'explaining a missed obligation and responding to a fire emergency', '予定していたことをできなかった理由と、火災時の対応を説明する場面', 'I was supposed to join.', 'The building is on fire.'),
    ('july-19', 'both/either/neither and would rather', 'both / either / neither と would rather', 'choosing between two plans and explaining a preference', '2つの予定から選び、自分の希望を説明する場面', 'Either day works for me.', 'I would rather…'),
    ('july-22', 'availability and clear answers to two choices', '予定確認と2択への明確な返答', 'arranging a meeting time and answering a negative question clearly', '会う日時を決め、否定疑問文にも明確に答える場面', 'Would you be available…?', 'Either is fine.'),
    ('july-23', 'present perfect and everyday health or movement', '現在完了と体調・動作の日常表現', 'changing plans because you feel under the weather', '体調が優れないため予定を変更する場面', 'I’m feeling under the weather.', 'I haven’t thought of one yet.'),
    ('july-25', 'changing feelings and gut reactions', '変化する感情と直感', 'describing how your feelings changed and whether you trusted your intuition', '気持ちの変化と直感を信じたかどうかを説明する場面', 'I’m getting hungry.', 'I have a gut feeling.'),
    ('july-26', 'hope, wish and perfect tenses', 'hope / wish と完了形', 'contrasting a realistic hope with a present or past regret', '現実的な希望と、現在または過去の後悔を対比する場面', 'I hope I can…', 'I wish I had…'),
    ('july-27', 'spill/pour/splash, acquired tastes and tense review', 'spill / pour / splash・慣れる味・時制', 'telling the story of a small accident and something you gradually learned to enjoy', '小さな事故と、徐々に好きになったものについて話す場面', 'I spilled coffee on my shirt.', 'It is an acquired taste.')
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
    s.*,
    a.user_id as teacher_id
  from task_seed s
  join public.review_lessons l on l.slug = s.slug
  cross join author a
)
insert into public.review_premium_tasks (
  lesson_id, stable_key, task_type, title_en, title_ja,
  prompt_en, prompt_ja, instructions_en, instructions_ja,
  required_phrases, required_vocabulary, target_seconds,
  min_word_count, max_word_count, max_attempts, active, created_by
)
select
  p.lesson_id,
  p.slug || '-premium-speaking-v1',
  'speaking',
  'Speaking review · ' || p.title_en,
  'スピーキング添削 · ' || coalesce(p.title_ja, p.title_en),
  'Record a 60–90 second response about ' || p.situation_en ||
    '. Use both target expressions and add one specific detail from your own experience.',
  p.situation_ja || 'について60〜90秒で話してください。2つの目標表現を使い、自分の経験から具体例を1つ加えましょう。',
  'Plan briefly, record once, listen back, then re-record if needed before submitting.',
  '短く内容を考えて録音し、聞き直してから必要に応じて録り直して提出してください。',
  jsonb_build_array(p.phrase_one, p.phrase_two),
  jsonb_build_array(p.focus_en),
  90, null, null, 3, true, p.teacher_id
from prepared p
union all
select
  p.lesson_id,
  p.slug || '-premium-essay-v1',
  'essay',
  'Writing review · ' || p.title_en,
  '英作文添削 · ' || coalesce(p.title_ja, p.title_en),
  'Write 100–180 words about ' || p.situation_en ||
    '. Use both target expressions accurately, explain your reason, and finish with a clear takeaway.',
  p.situation_ja || 'について100〜180語で書いてください。2つの目標表現を正確に使い、理由と最後のまとめを入れましょう。',
  'Write a clear beginning, supporting detail and final sentence. Check verb tense before submitting.',
  '導入・具体的な説明・最後の一文を入れ、提出前に動詞の時制を確認してください。',
  jsonb_build_array(p.phrase_one, p.phrase_two),
  jsonb_build_array(p.focus_en),
  null, 100, 180, 3, true, p.teacher_id
from prepared p
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
  updated_at = now();

-- Fail loudly instead of reporting complete coverage after a partial/no-op
-- seed (for example when a lesson or active teacher is missing).
do $$
declare
  seeded_count integer;
begin
  select count(*) into seeded_count
  from public.review_premium_tasks t
  join public.review_lessons l on l.id = t.lesson_id
  where t.active
    and t.stable_key in (
      l.slug || '-premium-speaking-v1',
      l.slug || '-premium-essay-v1'
    )
    and l.slug in (
      'june-28', 'june-29', 'june-30', 'july-04', 'july-05', 'july-06',
      'july-07', 'july-11', 'july-12', 'july-13', 'july-18', 'july-19',
      'july-22', 'july-23', 'july-25', 'july-26', 'july-27'
    );
  if seeded_count <> 34 then
    raise exception 'Premium task seed incomplete: expected 34 active tasks, found %.', seeded_count;
  end if;
end;
$$;

comment on function public.review_teacher_preview_lesson(text, text) is
  'Teacher-only QA preview for one learner plan. It does not grant or mutate learner access.';
comment on function public.review_save_submission_review(uuid, text, numeric, text, text, boolean) is
  'Atomically saves teacher feedback and advances the submission review state.';
