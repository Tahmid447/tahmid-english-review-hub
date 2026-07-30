-- Tahmid English Review Hub v8
-- Isolated from the existing Do/Does application: every object created here is
-- prefixed with review_. This migration never reads, alters, or drops an
-- existing application table.

create extension if not exists pgcrypto;

create table if not exists public.review_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'ja' check (locale in ('en', 'ja')),
  access_scope text not null default 'general'
    check (access_scope in ('general', 'takiwaki')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.review_profiles.access_scope is
  'Private content gate. Students cannot update this column themselves.';

create table if not exists public.review_teachers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_review_teacher()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.review_teachers t
      where t.user_id = auth.uid()
        and t.active
    );
$$;

revoke all on function public.is_review_teacher() from public;
grant execute on function public.is_review_teacher() to anon, authenticated;

create table if not exists public.review_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  lesson_date date not null,
  title_en text not null check (length(btrim(title_en)) between 1 and 180),
  title_ja text,
  summary_en text,
  summary_ja text,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  audience text not null default 'takiwaki'
    check (audience in ('general', 'takiwaki', 'both')),
  source_type text not null default 'manual'
    check (source_type in ('legacy_zip', 'notion', 'manual')),
  source_notion_page_id text,
  source_notion_url text,
  source_updated_at timestamptz,
  content_version integer not null default 1 check (content_version > 0),
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, source_notion_page_id),
  check (
    (source_type = 'notion' and source_notion_page_id is not null)
    or source_type <> 'notion'
  )
);

create index if not exists review_lessons_catalog_idx
  on public.review_lessons (status, audience, lesson_date desc);

create table if not exists public.review_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.review_lessons(id) on delete cascade,
  stable_key text not null check (length(btrim(stable_key)) between 1 and 180),
  position integer not null check (position >= 0),
  section text,
  format text not null check (
    format in (
      'mcq', 'situation', 'truefalse', 'typing', 'translation',
      'order', 'matching', 'sorting', 'grid', 'listenChoice',
      'listenType', 'speaking', 'dialogue', 'mistake'
    )
  ),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  is_original boolean not null default false,
  points numeric(8,2) not null default 1 check (points > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, stable_key),
  unique (id, lesson_id)
);

create index if not exists review_questions_lesson_position_idx
  on public.review_questions (lesson_id, position)
  where active;

create table if not exists public.review_assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.review_lessons(id) on delete restrict,
  student_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id) on delete restrict,
  due_at timestamptz,
  status text not null default 'assigned'
    check (status in ('assigned', 'completed', 'dismissed')),
  note text check (note is null or length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, student_id)
);

create index if not exists review_assignments_student_idx
  on public.review_assignments (student_id, status, due_at);

create table if not exists public.review_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.review_lessons(id) on delete restrict,
  assignment_id uuid references public.review_assignments(id) on delete set null,
  client_attempt_key text,
  practice_mode text not null default 'manual'
    check (practice_mode in ('manual', 'instant')),
  first_score numeric(10,2) not null default 0 check (first_score >= 0),
  max_score numeric(10,2) not null default 0 check (max_score >= 0),
  answered_count integer not null default 0 check (answered_count >= 0),
  question_count integer not null default 0 check (question_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  answer_snapshot jsonb not null default '[]'::jsonb
    check (jsonb_typeof(answer_snapshot) in ('array', 'object')),
  started_at timestamptz not null default now(),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  check (first_score <= max_score or max_score = 0),
  check (answered_count <= question_count),
  check (wrong_count <= answered_count)
);

create unique index if not exists review_attempts_client_key_uidx
  on public.review_attempts (user_id, client_attempt_key)
  where client_attempt_key is not null;

create index if not exists review_attempts_student_date_idx
  on public.review_attempts (user_id, started_at desc);

create index if not exists review_attempts_lesson_date_idx
  on public.review_attempts (lesson_id, started_at desc);

create table if not exists public.review_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null,
  question_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null,
  answer jsonb not null default '{}'::jsonb,
  first_is_correct boolean,
  first_points numeric(8,2) check (first_points is null or first_points >= 0),
  latest_is_correct boolean,
  latest_points numeric(8,2) check (latest_points is null or latest_points >= 0),
  answer_count integer not null default 1 check (answer_count > 0),
  feedback_band text check (
    feedback_band is null
    or feedback_band in ('great', 'good', 'almost', 'keep_practising', 'not_scored')
  ),
  first_answered_at timestamptz not null default now(),
  last_answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (attempt_id, user_id)
    references public.review_attempts(id, user_id) on delete cascade,
  foreign key (question_id, lesson_id)
    references public.review_questions(id, lesson_id) on delete restrict,
  unique (attempt_id, question_id)
);

create index if not exists review_answers_student_idx
  on public.review_answers (user_id, last_answered_at desc);

create table if not exists public.review_speaking_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.review_lessons(id) on delete set null,
  question_id uuid references public.review_questions(id) on delete set null,
  target_text text not null,
  transcript text,
  feedback_band text not null default 'not_scored'
    check (feedback_band in ('great', 'good', 'almost', 'keep_practising', 'not_scored')),
  recognition_available boolean not null default false,
  practiced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists review_speaking_student_idx
  on public.review_speaking_activity (user_id, practiced_at desc);

create table if not exists public.review_phrase_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase_id text not null,
  lesson_id uuid references public.review_lessons(id) on delete set null,
  is_favorite boolean not null default false,
  practice_count integer not null default 0 check (practice_count >= 0),
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, phrase_id)
);

create index if not exists review_phrase_activity_student_idx
  on public.review_phrase_activity (user_id, is_favorite, last_practiced_at desc);

create table if not exists public.review_user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb
    check (jsonb_typeof(settings) = 'object'),
  updated_at timestamptz not null default now()
);

-- Keep timestamps and publication/archive markers consistent.
create or replace function public.review_set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.review_stamp_lesson()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  if auth.uid() is not null then
    new.updated_by = auth.uid();
  end if;
  -- Client-side publication must never expose an empty lesson. Privileged
  -- migrations may seed catalogue rows before their question migration runs.
  if new.status = 'published'
     and auth.uid() is not null
     and not exists (
       select 1
       from public.review_questions q
       where q.lesson_id = new.id
         and q.active
     )
  then
    raise exception 'A lesson must contain at least one active question before it can be published.';
  end if;
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  if new.status = 'archived' and new.archived_at is null then
    new.archived_at = now();
  elsif new.status <> 'archived' then
    new.archived_at = null;
  end if;
  return new;
end;
$$;

create or replace function public.review_keep_published_lesson_nonempty()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lesson_is_published boolean := false;
begin
  -- SQL migrations and trusted service-role workflows may rebuild catalogue
  -- content. Authenticated browser clients must preserve the live invariant.
  if auth.uid() is null or coalesce(auth.role(), '') = 'service_role' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  -- An inactive question, an activation, or an ordinary content/position edit
  -- cannot remove the final active question.
  if not old.active then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE'
     and new.active
     and new.lesson_id = old.lesson_id
  then
    return new;
  end if;

  -- Serialise removals per lesson so two concurrent requests cannot each see
  -- the other question and leave a published lesson empty after both commit.
  select l.status = 'published'
  into lesson_is_published
  from public.review_lessons l
  where l.id = old.lesson_id
  for update;

  if lesson_is_published
     and not exists (
       select 1
       from public.review_questions q
       where q.lesson_id = old.lesson_id
         and q.id <> old.id
         and q.active
     )
  then
    raise exception
      'A published lesson must keep at least one active question.'
      using errcode = '23514';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.review_keep_published_lesson_nonempty() from public;

create or replace function public.review_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Auth is shared with the Do/Does application. Only users explicitly
  -- provisioned for Review Hub should receive a Review Hub profile.
  if coalesce(new.raw_app_meta_data ->> 'app', '') <> 'review_hub'
     and coalesce(new.raw_user_meta_data ->> 'app', '') <> 'review_hub'
  then
    return new;
  end if;

  insert into public.review_profiles (user_id, display_name)
  values (
    new.id,
    nullif(
      coalesce(
        new.raw_user_meta_data ->> 'display_name',
        new.raw_user_meta_data ->> 'full_name'
      ),
      ''
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.review_handle_new_user() from public;

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
  return new;
end;
$$;

revoke all on function public.review_validate_attempt() from public;

create or replace function public.review_complete_assignment()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.completed_at is not null and new.assignment_id is not null then
    update public.review_assignments
    set status = 'completed',
        updated_at = now()
    where id = new.assignment_id
      and student_id = new.user_id
      and lesson_id = new.lesson_id;
  end if;
  return new;
end;
$$;

revoke all on function public.review_complete_assignment() from public;

create or replace function public.review_validate_answer()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  attempt_lesson uuid;
  attempt_user uuid;
begin
  select a.lesson_id, a.user_id
  into attempt_lesson, attempt_user
  from public.review_attempts a
  where a.id = new.attempt_id;

  if attempt_lesson is null
    or attempt_lesson <> new.lesson_id
    or attempt_user <> new.user_id then
    raise exception 'The answer does not match its attempt.';
  end if;

  if not exists (
    select 1
    from public.review_questions q
    where q.id = new.question_id
      and q.lesson_id = new.lesson_id
      and q.active
  ) then
    raise exception 'The answer does not match an active lesson question.';
  end if;
  return new;
end;
$$;

revoke all on function public.review_validate_answer() from public;

drop trigger if exists review_profiles_updated_at on public.review_profiles;
create trigger review_profiles_updated_at
before update on public.review_profiles
for each row execute function public.review_set_updated_at();

drop trigger if exists review_teachers_updated_at on public.review_teachers;
create trigger review_teachers_updated_at
before update on public.review_teachers
for each row execute function public.review_set_updated_at();

drop trigger if exists review_lessons_stamp on public.review_lessons;
create trigger review_lessons_stamp
before insert or update on public.review_lessons
for each row execute function public.review_stamp_lesson();

drop trigger if exists review_questions_updated_at on public.review_questions;
create trigger review_questions_updated_at
before update on public.review_questions
for each row execute function public.review_set_updated_at();

drop trigger if exists review_questions_keep_published_nonempty
  on public.review_questions;
create trigger review_questions_keep_published_nonempty
before update or delete on public.review_questions
for each row execute function public.review_keep_published_lesson_nonempty();

drop trigger if exists review_assignments_updated_at on public.review_assignments;
create trigger review_assignments_updated_at
before update on public.review_assignments
for each row execute function public.review_set_updated_at();

drop trigger if exists review_attempts_validate on public.review_attempts;
create trigger review_attempts_validate
before insert or update on public.review_attempts
for each row execute function public.review_validate_attempt();

drop trigger if exists review_attempts_updated_at on public.review_attempts;
create trigger review_attempts_updated_at
before update on public.review_attempts
for each row execute function public.review_set_updated_at();

drop trigger if exists review_attempts_complete_assignment on public.review_attempts;
create trigger review_attempts_complete_assignment
after insert or update of completed_at on public.review_attempts
for each row execute function public.review_complete_assignment();

drop trigger if exists review_answers_validate on public.review_answers;
create trigger review_answers_validate
before insert or update on public.review_answers
for each row execute function public.review_validate_answer();

drop trigger if exists review_answers_updated_at on public.review_answers;
create trigger review_answers_updated_at
before update on public.review_answers
for each row execute function public.review_set_updated_at();

drop trigger if exists review_phrase_activity_updated_at on public.review_phrase_activity;
create trigger review_phrase_activity_updated_at
before update on public.review_phrase_activity
for each row execute function public.review_set_updated_at();

drop trigger if exists review_user_settings_updated_at on public.review_user_settings;
create trigger review_user_settings_updated_at
before update on public.review_user_settings
for each row execute function public.review_set_updated_at();

drop trigger if exists review_auth_user_created on auth.users;
create trigger review_auth_user_created
after insert on auth.users
for each row execute function public.review_handle_new_user();

-- A security-definer read helper avoids recursive question/lesson RLS checks.
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
      and (
        public.is_review_teacher()
        or (
          l.status = 'published'
          and l.audience in ('general', 'both')
        )
        or (
          auth.uid() is not null
          and l.status = 'published'
          and l.audience in ('takiwaki', 'both')
          and exists (
            select 1
            from public.review_profiles p
            where p.user_id = auth.uid()
              and p.access_scope = 'takiwaki'
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_lesson(uuid) from public;
grant execute on function public.review_can_read_lesson(uuid) to anon, authenticated;

-- Row-level security is enabled on every Review Hub table, including content.
alter table public.review_profiles enable row level security;
alter table public.review_teachers enable row level security;
alter table public.review_lessons enable row level security;
alter table public.review_questions enable row level security;
alter table public.review_assignments enable row level security;
alter table public.review_attempts enable row level security;
alter table public.review_answers enable row level security;
alter table public.review_speaking_activity enable row level security;
alter table public.review_phrase_activity enable row level security;
alter table public.review_user_settings enable row level security;

-- Profiles: users see themselves; teachers see students. access_scope cannot be
-- changed through the normal authenticated client grants below.
drop policy if exists review_profiles_select on public.review_profiles;
create policy review_profiles_select
on public.review_profiles for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_profiles_insert_self on public.review_profiles;
create policy review_profiles_insert_self
on public.review_profiles for insert
to authenticated
with check (user_id = auth.uid() and access_scope = 'general');

drop policy if exists review_profiles_update_self on public.review_profiles;
create policy review_profiles_update_self
on public.review_profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists review_teachers_select on public.review_teachers;
create policy review_teachers_select
on public.review_teachers for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

-- Lessons/questions: anonymous visitors receive only published general/both
-- material. Draft, review, archived, and Takiwaki-only material never passes
-- the anonymous policy.
drop policy if exists review_lessons_select_catalog on public.review_lessons;
create policy review_lessons_select_catalog
on public.review_lessons for select
to anon, authenticated
using (
  public.is_review_teacher()
  or (
    status = 'published'
    and audience in ('general', 'both')
  )
  or (
    auth.uid() is not null
    and status = 'published'
    and audience in ('takiwaki', 'both')
    and exists (
      select 1
      from public.review_profiles p
      where p.user_id = auth.uid()
        and p.access_scope = 'takiwaki'
    )
  )
);

drop policy if exists review_lessons_insert_teacher on public.review_lessons;
create policy review_lessons_insert_teacher
on public.review_lessons for insert
to authenticated
with check (public.is_review_teacher());

drop policy if exists review_lessons_update_teacher on public.review_lessons;
create policy review_lessons_update_teacher
on public.review_lessons for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

drop policy if exists review_questions_select_catalog on public.review_questions;
create policy review_questions_select_catalog
on public.review_questions for select
to anon, authenticated
using (active and public.review_can_read_lesson(lesson_id));

drop policy if exists review_questions_insert_teacher on public.review_questions;
create policy review_questions_insert_teacher
on public.review_questions for insert
to authenticated
with check (public.is_review_teacher());

drop policy if exists review_questions_update_teacher on public.review_questions;
create policy review_questions_update_teacher
on public.review_questions for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

-- Assignments are private to the assigned student and the authorised teacher.
drop policy if exists review_assignments_select on public.review_assignments;
create policy review_assignments_select
on public.review_assignments for select
to authenticated
using (student_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_assignments_insert_teacher on public.review_assignments;
create policy review_assignments_insert_teacher
on public.review_assignments for insert
to authenticated
with check (
  public.is_review_teacher()
  and assigned_by = auth.uid()
);

drop policy if exists review_assignments_update_teacher on public.review_assignments;
create policy review_assignments_update_teacher
on public.review_assignments for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

-- Attempts/answers/activity/settings are student-owned. Teachers have read-only
-- visibility for feedback and dashboard reporting.
drop policy if exists review_attempts_select on public.review_attempts;
create policy review_attempts_select
on public.review_attempts for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_attempts_insert_self on public.review_attempts;
create policy review_attempts_insert_self
on public.review_attempts for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.review_can_read_lesson(lesson_id)
);

drop policy if exists review_attempts_update_self on public.review_attempts;
create policy review_attempts_update_self
on public.review_attempts for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists review_answers_select on public.review_answers;
create policy review_answers_select
on public.review_answers for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_answers_insert_self on public.review_answers;
create policy review_answers_insert_self
on public.review_answers for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.review_attempts a
    where a.id = attempt_id
      and a.user_id = auth.uid()
      and a.lesson_id = lesson_id
  )
);

drop policy if exists review_answers_update_self on public.review_answers;
create policy review_answers_update_self
on public.review_answers for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists review_speaking_select on public.review_speaking_activity;
create policy review_speaking_select
on public.review_speaking_activity for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_speaking_insert_self on public.review_speaking_activity;
create policy review_speaking_insert_self
on public.review_speaking_activity for insert
to authenticated
with check (
  user_id = auth.uid()
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
);

drop policy if exists review_phrase_select on public.review_phrase_activity;
create policy review_phrase_select
on public.review_phrase_activity for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_phrase_insert_self on public.review_phrase_activity;
create policy review_phrase_insert_self
on public.review_phrase_activity for insert
to authenticated
with check (
  user_id = auth.uid()
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
);

drop policy if exists review_phrase_update_self on public.review_phrase_activity;
create policy review_phrase_update_self
on public.review_phrase_activity for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists review_settings_select on public.review_user_settings;
create policy review_settings_select
on public.review_user_settings for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_settings_insert_self on public.review_user_settings;
create policy review_settings_insert_self
on public.review_user_settings for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists review_settings_update_self on public.review_user_settings;
create policy review_settings_update_self
on public.review_user_settings for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Anonymous learners use deliberately narrow catalogue views. The views expose
-- lesson content needed by the quiz UI, but never Notion source identifiers,
-- source URLs, creator/updater UUIDs, or audit timestamps.
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
  l.content,
  l.published_at
from public.review_lessons l
where l.status = 'published'
  and l.audience in ('general', 'both');

comment on view public.review_public_lessons is
  'Learner-safe public lesson catalogue without Notion source or audit metadata.';

create or replace view public.review_public_questions
with (security_barrier = true)
as
select
  q.id,
  q.lesson_id,
  q.stable_key,
  q.position,
  q.section,
  q.format,
  q.payload,
  q.is_original,
  q.points
from public.review_questions q
join public.review_lessons l on l.id = q.lesson_id
where q.active
  and l.status = 'published'
  and l.audience in ('general', 'both');

comment on view public.review_public_questions is
  'Learner-safe active questions for publicly published Review Hub lessons.';

-- Explicit grants complement RLS. There are deliberately no client DELETE
-- grants: lessons are archived instead of hard-deleted.
revoke all on public.review_profiles from anon, authenticated;
grant select on public.review_profiles to authenticated;
grant insert (user_id, display_name, avatar_url, locale)
  on public.review_profiles to authenticated;
grant update (display_name, avatar_url, locale, updated_at)
  on public.review_profiles to authenticated;

revoke all on public.review_teachers from anon, authenticated;
grant select on public.review_teachers to authenticated;

revoke all on public.review_lessons from anon, authenticated;
grant select on public.review_lessons to authenticated;
grant insert, update on public.review_lessons to authenticated;

revoke all on public.review_questions from anon, authenticated;
grant select on public.review_questions to authenticated;
grant insert, update on public.review_questions to authenticated;

revoke all on public.review_public_lessons from public, anon, authenticated;
grant select on public.review_public_lessons to anon, authenticated;

revoke all on public.review_public_questions from public, anon, authenticated;
grant select on public.review_public_questions to anon, authenticated;

revoke all on public.review_assignments from anon, authenticated;
grant select, insert, update on public.review_assignments to authenticated;

revoke all on public.review_attempts from anon, authenticated;
grant select, insert, update on public.review_attempts to authenticated;

revoke all on public.review_answers from anon, authenticated;
grant select, insert, update on public.review_answers to authenticated;

revoke all on public.review_speaking_activity from anon, authenticated;
grant select, insert on public.review_speaking_activity to authenticated;

revoke all on public.review_phrase_activity from anon, authenticated;
grant select, insert, update on public.review_phrase_activity to authenticated;

revoke all on public.review_user_settings from anon, authenticated;
grant select, insert, update on public.review_user_settings to authenticated;

-- Bootstrap note:
-- 1. Create each Review Hub user through Supabase Auth (never place a password
--    in SQL) with user metadata {"app":"review_hub"}. The explicit app marker
--    prevents users of the separate Do/Does app from receiving Review Hub rows.
-- 2. In the SQL editor, add that Auth UUID:
--      insert into public.review_teachers (user_id, display_name)
--      values ('AUTH-USER-UUID', 'Teacher');
-- 3. Set the personal student's access only from the trusted SQL editor:
--      insert into public.review_profiles
--        (user_id, display_name, access_scope)
--      values
--        ('STUDENT-AUTH-UUID', 'Student', 'takiwaki')
--      on conflict (user_id) do update
--        set access_scope = excluded.access_scope;
--    Use this insert/upsert form for an Auth user who existed before the
--    migration or was created without the Review Hub metadata marker. Tagged
--    newly created Auth users receive a general profile automatically.
