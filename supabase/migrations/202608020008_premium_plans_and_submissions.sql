-- Standard/Premium plans, lesson review tasks and teacher feedback.
--
-- Privacy boundary:
--   * Supabase Auth remains the only password authority. No password, token or
--     OAuth secret is copied into any Review Hub table.
--   * Learners can read their own plan/submission records and only feedback a
--     teacher has explicitly published.
--   * Teachers manage plans, tasks, access controls, reviews and feedback.
--
-- Audio is represented by a private object-storage path, never by a base64/blob
-- column. This keeps database rows small and lets the application apply a
-- deliberate upload/retention policy when the recording workflow is enabled.

create table if not exists public.review_plan_catalog (
  plan_key text primary key
    check (plan_key in ('standard', 'premium')),
  name_en text not null,
  name_ja text not null,
  description_en text,
  description_ja text,
  entitlements jsonb not null default '{}'::jsonb
    check (jsonb_typeof(entitlements) = 'object'),
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.review_plan_catalog is
  'Feature definitions only. Commercial prices remain configurable outside this migration.';

insert into public.review_plan_catalog (
  plan_key, name_en, name_ja, description_en, description_ja,
  entitlements, display_order
)
values
  (
    'standard',
    'Standard',
    'スタンダード',
    'Complete self-study lessons with balanced listening, speaking, reading, writing and visual practice.',
    'リスニング・スピーキング・読む・書く・イラスト問題をバランスよく学べる自習プランです。',
    '{
      "core_lessons": true,
      "phrase_library": true,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": false,
      "premium_image_missions": false,
      "speaking_submission": false,
      "essay_submission": false
    }'::jsonb,
    10
  ),
  (
    'premium',
    'Premium',
    'プレミアム',
    'Everything in Standard plus advanced visual missions and teacher-reviewed speaking and essay challenges.',
    'スタンダードの全機能に加え、発展イラスト問題と先生によるスピーキング・英作文添削が含まれます。',
    '{
      "core_lessons": true,
      "phrase_library": true,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": true,
      "premium_image_missions": true,
      "speaking_submission": true,
      "essay_submission": true
    }'::jsonb,
    20
  )
on conflict (plan_key) do update set
  name_en = excluded.name_en,
  name_ja = excluded.name_ja,
  description_en = excluded.description_en,
  description_ja = excluded.description_ja,
  entitlements = excluded.entitlements,
  display_order = excluded.display_order,
  active = true,
  updated_at = now();

alter table public.review_memberships
  add column if not exists plan_tier text not null default 'standard'
    references public.review_plan_catalog(plan_key);

alter table public.review_access_codes
  add column if not exists plan_tier text not null default 'standard'
    references public.review_plan_catalog(plan_key);

-- A single, auditable override row can temporarily change a learner's tier or
-- individual features. Null plan_tier means "keep the membership tier".
create table if not exists public.review_learner_plan_overrides (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_tier text references public.review_plan_catalog(plan_key),
  feature_flags jsonb not null default '{}'::jsonb
    check (jsonb_typeof(feature_flags) = 'object'),
  reason text check (reason is null or length(reason) <= 500),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at > starts_at)
);

comment on table public.review_learner_plan_overrides is
  'Teacher-managed per-learner tier/feature exceptions; never stores authentication credentials.';

create index if not exists review_learner_plan_overrides_active_idx
  on public.review_learner_plan_overrides (starts_at, expires_at);

-- Teacher-reviewed Premium challenges. One lesson can offer a speaking task,
-- an essay task, or both. Required phrases are JSON arrays so lesson content
-- can evolve without another schema change.
create table if not exists public.review_premium_tasks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.review_lessons(id) on delete cascade,
  stable_key text not null check (length(btrim(stable_key)) between 1 and 180),
  task_type text not null check (task_type in ('speaking', 'essay')),
  title_en text not null check (length(btrim(title_en)) between 1 and 180),
  title_ja text,
  prompt_en text not null check (length(btrim(prompt_en)) between 1 and 4000),
  prompt_ja text,
  instructions_en text,
  instructions_ja text,
  required_phrases jsonb not null default '[]'::jsonb
    check (jsonb_typeof(required_phrases) = 'array'),
  required_vocabulary jsonb not null default '[]'::jsonb
    check (jsonb_typeof(required_vocabulary) = 'array'),
  target_seconds integer,
  min_word_count integer,
  max_word_count integer,
  max_attempts integer not null default 3 check (max_attempts between 1 and 20),
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, stable_key),
  check (
    (
      task_type = 'speaking'
      and target_seconds between 30 and 600
      and min_word_count is null
      and max_word_count is null
    )
    or
    (
      task_type = 'essay'
      and target_seconds is null
      and min_word_count between 10 and 1000
      and max_word_count between min_word_count and 2000
    )
  )
);

create index if not exists review_premium_tasks_lesson_idx
  on public.review_premium_tasks (lesson_id, task_type)
  where active;

-- Text stays in Postgres. A recording, when enabled, is stored as a compact
-- private object and only its path is kept here.
create table if not exists public.review_task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.review_premium_tasks(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt_number integer not null default 1 check (attempt_number between 1 and 20),
  client_submission_key text,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'in_review', 'reviewed', 'returned')),
  text_response text check (text_response is null or length(text_response) <= 20000),
  audio_object_path text
    check (audio_object_path is null or length(audio_object_path) between 1 and 700),
  transcript text check (transcript is null or length(transcript) <= 20000),
  duration_seconds integer
    check (duration_seconds is null or duration_seconds between 1 and 900),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_id, user_id, attempt_number)
);

create unique index if not exists review_task_submissions_client_key_uidx
  on public.review_task_submissions (user_id, client_submission_key)
  where client_submission_key is not null;

create index if not exists review_task_submissions_teacher_queue_idx
  on public.review_task_submissions (status, submitted_at)
  where status in ('submitted', 'in_review', 'returned');

create index if not exists review_task_submissions_learner_idx
  on public.review_task_submissions (user_id, created_at desc);

-- This table contains only learner-safe feedback. Teachers may prepare a row
-- privately; learners see it only after published_at is set.
create table if not exists public.review_submission_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique
    references public.review_task_submissions(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete restrict,
  score numeric(5,2) check (score is null or score between 0 and 100),
  rubric jsonb not null default '{}'::jsonb
    check (jsonb_typeof(rubric) = 'object'),
  feedback_en text check (feedback_en is null or length(feedback_en) <= 12000),
  feedback_ja text check (feedback_ja is null or length(feedback_ja) <= 12000),
  ai_assisted boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (feedback_en is not null or feedback_ja is not null)
);

comment on column public.review_submission_feedback.ai_assisted is
  'True only when AI helped draft the feedback. A teacher remains responsible for publishing it.';

-- Assignment-level visibility and schedule controls. These do not replace the
-- separate per-learner lesson allow/block override introduced in migration 007.
alter table public.review_assignments
  add column if not exists visible_to_student boolean not null default true,
  add column if not exists opens_at timestamptz,
  add column if not exists closes_at timestamptz,
  add column if not exists required_plan text not null default 'standard'
    references public.review_plan_catalog(plan_key),
  add column if not exists teacher_review_required boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'review_assignments_schedule_check'
      and conrelid = 'public.review_assignments'::regclass
  ) then
    alter table public.review_assignments
      add constraint review_assignments_schedule_check
      check (closes_at is null or opens_at is null or closes_at > opens_at);
  end if;
end;
$$;

drop trigger if exists review_plan_catalog_updated_at on public.review_plan_catalog;
create trigger review_plan_catalog_updated_at
before update on public.review_plan_catalog
for each row execute function public.review_set_updated_at();

drop trigger if exists review_learner_plan_overrides_updated_at
  on public.review_learner_plan_overrides;
create trigger review_learner_plan_overrides_updated_at
before update on public.review_learner_plan_overrides
for each row execute function public.review_set_updated_at();

drop trigger if exists review_premium_tasks_updated_at on public.review_premium_tasks;
create trigger review_premium_tasks_updated_at
before update on public.review_premium_tasks
for each row execute function public.review_set_updated_at();

drop trigger if exists review_task_submissions_updated_at
  on public.review_task_submissions;
create trigger review_task_submissions_updated_at
before update on public.review_task_submissions
for each row execute function public.review_set_updated_at();

drop trigger if exists review_submission_feedback_updated_at
  on public.review_submission_feedback;
create trigger review_submission_feedback_updated_at
before update on public.review_submission_feedback
for each row execute function public.review_set_updated_at();

-- Resolve the signed-in learner's effective tier without exposing another
-- learner's membership/override information.
create or replace function public.review_effective_plan()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when public.is_review_teacher() then 'premium'
    when auth.uid() is null then 'standard'
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
      'standard'
    )
  end;
$$;

revoke all on function public.review_effective_plan() from public;
grant execute on function public.review_effective_plan() to anon, authenticated;

create or replace function public.review_has_feature(requested_feature text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when public.is_review_teacher() then true
    when auth.uid() is null then false
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
grant execute on function public.review_has_feature(text) to anon, authenticated;

create or replace function public.review_plan_meets_requirement(required_plan text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_review_teacher()
    or required_plan = 'standard'
    or (required_plan = 'premium' and public.review_effective_plan() = 'premium');
$$;

revoke all on function public.review_plan_meets_requirement(text) from public;
grant execute on function public.review_plan_meets_requirement(text) to anon, authenticated;

create or replace function public.review_assignment_is_open(check_assignment uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.review_assignments a
    where a.id = check_assignment
      and (a.student_id = auth.uid() or public.is_review_teacher())
      and a.status <> 'dismissed'
      and a.visible_to_student
      and (a.opens_at is null or a.opens_at <= now())
      and (a.closes_at is null or a.closes_at > now())
      and public.review_plan_meets_requirement(a.required_plan)
  );
$$;

revoke all on function public.review_assignment_is_open(uuid) from public;
grant execute on function public.review_assignment_is_open(uuid) to authenticated;

-- Preserve the original attempt ownership validation and add assignment
-- visibility/schedule/tier enforcement.
create or replace function public.review_validate_attempt()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.assignment_id is not null and not exists (
    select 1
    from public.review_assignments a
    where a.id = new.assignment_id
      and a.student_id = new.user_id
      and a.lesson_id = new.lesson_id
      and a.status <> 'dismissed'
  ) then
    raise exception 'The assignment does not belong to this student and lesson.';
  end if;

  if new.assignment_id is not null
     and not public.review_assignment_is_open(new.assignment_id) then
    raise exception 'This assignment is hidden, locked, outside its available dates, or requires another plan.';
  end if;
  return new;
end;
$$;

revoke all on function public.review_validate_attempt() from public;

-- Learners may prepare drafts and submit/return them. Once a submission enters
-- review, only a teacher may change it. The trigger also checks the task-specific
-- 2-minute/word-count boundaries on final submission.
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
    if not public.is_review_teacher() and new.user_id <> auth.uid() then
      raise exception 'A learner can only create their own submission.';
    end if;
    if not public.is_review_teacher()
       and (
         not task.active
         or not public.review_can_read_lesson(task.lesson_id)
         or not public.review_has_feature(required_feature)
       ) then
      raise exception 'This Premium review task is not available for this account.';
    end if;
    if not public.is_review_teacher() and new.status not in ('draft', 'submitted') then
      raise exception 'A new learner submission must be a draft or submitted.';
    end if;
    new.created_at := now();
    new.reviewed_at := null;
    if new.status = 'draft' then
      new.submitted_at := null;
    end if;
  elsif not public.is_review_teacher() then
    if old.user_id <> auth.uid()
       or new.user_id <> old.user_id
       or new.task_id <> old.task_id
       or new.attempt_number <> old.attempt_number
       or old.status not in ('draft', 'returned')
       or new.status not in ('draft', 'submitted') then
      raise exception 'This submission is locked while the teacher reviews it.';
    end if;
    new.created_at := old.created_at;
    new.reviewed_at := old.reviewed_at;
    new.submitted_at := old.submitted_at;
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
    if tg_op = 'INSERT' then
      new.submitted_at := coalesce(new.submitted_at, now());
    else
      new.submitted_at := coalesce(old.submitted_at, new.submitted_at, now());
    end if;
  end if;

  if public.is_review_teacher() and new.status in ('reviewed', 'returned') then
    new.reviewed_at := coalesce(new.reviewed_at, now());
  end if;
  return new;
end;
$$;

revoke all on function public.review_validate_task_submission() from public;

drop trigger if exists review_task_submissions_validate
  on public.review_task_submissions;
create trigger review_task_submissions_validate
before insert or update on public.review_task_submissions
for each row execute function public.review_validate_task_submission();

-- A teacher can approve a tier in one operation without broad direct access
-- from the learner application. Existing three-argument approval remains a
-- Standard approval for backwards compatibility.
create or replace function public.review_approve_membership_tiered(
  learner_id uuid,
  duration_days integer,
  membership_scope text default 'general',
  membership_plan text default 'standard'
)
returns public.review_memberships
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  approved public.review_memberships%rowtype;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  if duration_days < 1 or duration_days > 730 then
    raise exception 'Duration must be between 1 and 730 days.';
  end if;
  if membership_scope not in ('general', 'takiwaki', 'both') then
    raise exception 'Invalid access scope.';
  end if;
  if membership_plan not in ('standard', 'premium') then
    raise exception 'Invalid membership plan.';
  end if;

  insert into public.review_memberships (
    user_id, status, access_scope, plan_tier, plan_label,
    starts_at, expires_at, approval_source, approved_by, approved_at
  ) values (
    learner_id, 'active', membership_scope, membership_plan,
    initcap(membership_plan) || ' · ' || duration_days || ' days',
    now(), now() + make_interval(days => duration_days),
    'manual', auth.uid(), now()
  )
  on conflict (user_id) do update set
    status = 'active',
    access_scope = excluded.access_scope,
    plan_tier = excluded.plan_tier,
    plan_label = excluded.plan_label,
    starts_at = excluded.starts_at,
    expires_at = excluded.expires_at,
    approval_source = 'manual',
    approved_by = auth.uid(),
    approved_at = now(),
    updated_at = now()
  returning * into approved;

  if membership_scope in ('takiwaki', 'both') then
    update public.review_profiles
    set access_scope = 'takiwaki'
    where user_id = learner_id;
  end if;
  return approved;
end;
$$;

revoke all on function public.review_approve_membership_tiered(uuid, integer, text, text)
  from public;
grant execute on function public.review_approve_membership_tiered(uuid, integer, text, text)
  to authenticated;

-- New Teacher Studio versions can call this tier-aware generator. The original
-- review_create_access_code function remains available so the current Standard
-- workflow does not break while the UI is upgraded.
create or replace function public.review_create_access_code_tiered(
  code_label text,
  code_duration_days integer,
  code_scope text default 'general',
  code_plan text default 'standard',
  code_max_uses integer default 1,
  code_valid_until timestamptz default null
)
returns table (access_code text, code_id uuid)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  raw_code text;
  new_id uuid;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  if code_duration_days < 1 or code_duration_days > 730 then
    raise exception 'Duration must be between 1 and 730 days.';
  end if;
  if code_scope not in ('general', 'takiwaki', 'both') then
    raise exception 'Invalid access scope.';
  end if;
  if code_plan not in ('standard', 'premium') then
    raise exception 'Invalid membership plan.';
  end if;
  if code_max_uses < 1 or code_max_uses > 1000 then
    raise exception 'Maximum uses must be between 1 and 1000.';
  end if;

  raw_code := 'TEC-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));
  insert into public.review_access_codes (
    label, code_hash, code_last4, duration_days, access_scope,
    plan_tier, max_uses, valid_until, created_by
  ) values (
    btrim(code_label),
    encode(extensions.digest(raw_code, 'sha256'), 'hex'),
    right(raw_code, 4),
    code_duration_days,
    code_scope,
    code_plan,
    code_max_uses,
    code_valid_until,
    auth.uid()
  ) returning id into new_id;

  return query select raw_code, new_id;
end;
$$;

revoke all on function public.review_create_access_code_tiered(
  text, integer, text, text, integer, timestamptz
) from public;
grant execute on function public.review_create_access_code_tiered(
  text, integer, text, text, integer, timestamptz
) to authenticated;

-- Access-code redemption now carries its configured Standard/Premium tier into
-- the membership. Code generation can remain backwards-compatible: old codes
-- and the existing UI default to Standard.
create or replace function public.review_redeem_access_code(raw_code text)
returns table (
  membership_status text,
  membership_scope text,
  membership_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  matched public.review_access_codes%rowtype;
  next_start timestamptz;
  next_expiry timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Sign in before redeeming an access code.';
  end if;

  select * into matched
  from public.review_access_codes c
  where c.code_hash = encode(
    extensions.digest(upper(btrim(raw_code)), 'sha256'),
    'hex'
  )
  for update;

  if matched.id is null
     or not matched.enabled
     or matched.use_count >= matched.max_uses
     or (matched.valid_until is not null and matched.valid_until <= now()) then
    raise exception 'This access code is invalid, expired, or already used.';
  end if;
  if exists (
    select 1 from public.review_access_code_redemptions r
    where r.code_id = matched.id and r.user_id = auth.uid()
  ) then
    raise exception 'This account has already used this access code.';
  end if;

  select greatest(coalesce(m.expires_at, now()), now())
  into next_start
  from public.review_memberships m
  where m.user_id = auth.uid();
  next_start := coalesce(next_start, now());
  next_expiry := next_start + make_interval(days => matched.duration_days);

  insert into public.review_memberships (
    user_id, status, access_scope, plan_tier, plan_label,
    starts_at, expires_at, approval_source, approved_at
  ) values (
    auth.uid(), 'active', matched.access_scope, matched.plan_tier, matched.label,
    now(), next_expiry, 'access_code', now()
  )
  on conflict (user_id) do update set
    status = 'active',
    access_scope = excluded.access_scope,
    plan_tier = excluded.plan_tier,
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

  return query select 'active'::text, matched.access_scope, next_expiry;
end;
$$;

revoke all on function public.review_redeem_access_code(text) from public;
grant execute on function public.review_redeem_access_code(text) to authenticated;

-- RLS ----------------------------------------------------------------------

alter table public.review_plan_catalog enable row level security;
alter table public.review_learner_plan_overrides enable row level security;
alter table public.review_premium_tasks enable row level security;
alter table public.review_task_submissions enable row level security;
alter table public.review_submission_feedback enable row level security;

drop policy if exists review_plan_catalog_select on public.review_plan_catalog;
create policy review_plan_catalog_select
on public.review_plan_catalog for select
to anon, authenticated
using (active or public.is_review_teacher());

drop policy if exists review_plan_catalog_insert_teacher on public.review_plan_catalog;
create policy review_plan_catalog_insert_teacher
on public.review_plan_catalog for insert
to authenticated
with check (public.is_review_teacher());

drop policy if exists review_plan_catalog_update_teacher on public.review_plan_catalog;
create policy review_plan_catalog_update_teacher
on public.review_plan_catalog for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

drop policy if exists review_plan_overrides_select on public.review_learner_plan_overrides;
create policy review_plan_overrides_select
on public.review_learner_plan_overrides for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_plan_overrides_insert_teacher on public.review_learner_plan_overrides;
create policy review_plan_overrides_insert_teacher
on public.review_learner_plan_overrides for insert
to authenticated
with check (public.is_review_teacher() and updated_by = auth.uid());

drop policy if exists review_plan_overrides_update_teacher on public.review_learner_plan_overrides;
create policy review_plan_overrides_update_teacher
on public.review_learner_plan_overrides for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher() and updated_by = auth.uid());

drop policy if exists review_plan_overrides_delete_teacher on public.review_learner_plan_overrides;
create policy review_plan_overrides_delete_teacher
on public.review_learner_plan_overrides for delete
to authenticated
using (public.is_review_teacher());

drop policy if exists review_premium_tasks_select on public.review_premium_tasks;
create policy review_premium_tasks_select
on public.review_premium_tasks for select
to authenticated
using (
  public.is_review_teacher()
  or (
    active
    and public.review_can_read_lesson(lesson_id)
    and public.review_has_feature(
      case
        when task_type = 'speaking' then 'speaking_submission'
        else 'essay_submission'
      end
    )
  )
);

drop policy if exists review_premium_tasks_insert_teacher on public.review_premium_tasks;
create policy review_premium_tasks_insert_teacher
on public.review_premium_tasks for insert
to authenticated
with check (public.is_review_teacher() and created_by = auth.uid());

drop policy if exists review_premium_tasks_update_teacher on public.review_premium_tasks;
create policy review_premium_tasks_update_teacher
on public.review_premium_tasks for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

drop policy if exists review_premium_tasks_delete_teacher on public.review_premium_tasks;
create policy review_premium_tasks_delete_teacher
on public.review_premium_tasks for delete
to authenticated
using (public.is_review_teacher());

drop policy if exists review_task_submissions_select on public.review_task_submissions;
create policy review_task_submissions_select
on public.review_task_submissions for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_task_submissions_insert_self on public.review_task_submissions;
create policy review_task_submissions_insert_self
on public.review_task_submissions for insert
to authenticated
with check (
  public.is_review_teacher()
  or (
    user_id = auth.uid()
    and exists (
      select 1
      from public.review_premium_tasks t
      where t.id = task_id
        and t.active
        and public.review_can_read_lesson(t.lesson_id)
        and public.review_has_feature(
          case
            when t.task_type = 'speaking' then 'speaking_submission'
            else 'essay_submission'
          end
        )
    )
  )
);

drop policy if exists review_task_submissions_update on public.review_task_submissions;
create policy review_task_submissions_update
on public.review_task_submissions for update
to authenticated
using (user_id = auth.uid() or public.is_review_teacher())
with check (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_feedback_select on public.review_submission_feedback;
create policy review_feedback_select
on public.review_submission_feedback for select
to authenticated
using (
  public.is_review_teacher()
  or (
    published_at is not null
    and exists (
      select 1
      from public.review_task_submissions s
      where s.id = submission_id
        and s.user_id = auth.uid()
    )
  )
);

drop policy if exists review_feedback_insert_teacher on public.review_submission_feedback;
create policy review_feedback_insert_teacher
on public.review_submission_feedback for insert
to authenticated
with check (public.is_review_teacher() and teacher_id = auth.uid());

drop policy if exists review_feedback_update_teacher on public.review_submission_feedback;
create policy review_feedback_update_teacher
on public.review_submission_feedback for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

drop policy if exists review_feedback_delete_teacher on public.review_submission_feedback;
create policy review_feedback_delete_teacher
on public.review_submission_feedback for delete
to authenticated
using (public.is_review_teacher());

-- Students only see assignments intentionally made visible. Availability dates
-- are still returned so the UI can show a professional "opens on"/"closed"
-- state; review_assignment_is_open prevents starting a locked assignment.
drop policy if exists review_assignments_select on public.review_assignments;
create policy review_assignments_select
on public.review_assignments for select
to authenticated
using (
  public.is_review_teacher()
  or (student_id = auth.uid() and visible_to_student)
);

-- Explicit grants complement RLS. No learner-facing role receives DELETE on
-- submissions or any access at all to auth.users.
revoke all on public.review_plan_catalog from anon, authenticated;
grant select on public.review_plan_catalog to anon, authenticated;
grant insert, update on public.review_plan_catalog to authenticated;

revoke all on public.review_learner_plan_overrides from anon, authenticated;
grant select, insert, update, delete
  on public.review_learner_plan_overrides to authenticated;

revoke all on public.review_premium_tasks from anon, authenticated;
grant select, insert, update, delete on public.review_premium_tasks to authenticated;

revoke all on public.review_task_submissions from anon, authenticated;
grant select, insert, update on public.review_task_submissions to authenticated;

revoke all on public.review_submission_feedback from anon, authenticated;
grant select, insert, update, delete
  on public.review_submission_feedback to authenticated;
