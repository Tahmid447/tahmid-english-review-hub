-- Structured Learning Hub: teacher ownership, learner-specific visibility,
-- Words/Phrases/Phonics catalogue access, progress, favourites and notices.
--
-- This is a forward-only migration. It does not seed curriculum content and it
-- preserves the usual one-teacher deployment by assigning unowned learners only
-- when there is exactly one active Review Hub teacher. In multi-teacher projects,
-- ownership comes from an existing approval/access-code relationship or trusted
-- provisioning; an assigned teacher can later share or transfer ownership
-- through a guarded RPC.

begin;

-- This release has no trustworthy remote migration ledger. Refuse to replay
-- the foundation migration if any of its durable objects already exists;
-- subsequent changes must use a new forward migration.
do $migration_guard$
begin
  if to_regclass('public.review_teacher_students') is not null
    or to_regclass('public.review_student_hub_settings') is not null
    or to_regclass('public.review_curriculum_levels') is not null
    or to_regclass('public.review_curriculum_items') is not null
    or to_regclass('public.review_student_curriculum_access') is not null
    or to_regclass('public.review_curriculum_progress') is not null
    or to_regclass('public.review_curriculum_favorites') is not null
    or to_regclass('public.review_announcements') is not null
    or to_regclass('public.review_announcement_targets') is not null
    or to_regclass('public.review_teacher_audit_log') is not null
    or to_regprocedure('public.review_teacher_can_manage(uuid)') is not null then
    raise exception 'Structured Learning Hub migration 024 is one-time only. Existing rollout objects were found; inspect live state and create a new forward migration.';
  end if;
end
$migration_guard$;

-- ---------------------------------------------------------------------------
-- Ownership and learner-visible Hub configuration
-- ---------------------------------------------------------------------------

create table if not exists public.review_teacher_students (
  teacher_id uuid not null
    references public.review_teachers(user_id) on delete cascade,
  student_id uuid not null
    references public.review_profiles(user_id) on delete cascade,
  active boolean not null default true,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (teacher_id, student_id),
  check (teacher_id <> student_id)
);

create index if not exists review_teacher_students_student_idx
  on public.review_teacher_students (student_id, active, teacher_id);

create table if not exists public.review_student_hub_settings (
  student_id uuid primary key
    references public.review_profiles(user_id) on delete cascade,
  account_enabled boolean not null default true,
  show_dashboard boolean not null default true,
  show_words boolean not null default true,
  show_phrases boolean not null default true,
  show_phonics boolean not null default true,
  show_review_lessons boolean not null default true,
  show_homework boolean not null default true,
  show_progress boolean not null default true,
  show_pricing boolean not null default true,
  show_contact_teacher boolean not null default true,
  show_trial_cta boolean not null default true,
  show_payment_plan boolean not null default true,
  show_announcements boolean not null default true,
  allowed_level_min smallint not null default 1
    check (allowed_level_min between 1 and 32),
  allowed_level_max smallint not null default 4
    check (allowed_level_max between 1 and 32),
  allowed_levels smallint[] not null default '{}'::smallint[]
    check (
      allowed_levels <@ array[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
      ]::smallint[]
    ),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (allowed_level_min <= allowed_level_max)
);

comment on column public.review_student_hub_settings.allowed_levels is
  'Optional exact-level allow-list. Empty means every level inside allowed_level_min..allowed_level_max.';

-- ---------------------------------------------------------------------------
-- Structured Words / Phrases / Phonics catalogue
-- ---------------------------------------------------------------------------

create table if not exists public.review_curriculum_levels (
  category text not null
    check (category in ('words', 'phrases', 'phonics')),
  level smallint not null check (level between 1 and 32),
  title_en text not null check (length(btrim(title_en)) between 1 and 180),
  title_ja text,
  description_en text,
  description_ja text,
  icon text check (icon is null or length(icon) <= 120),
  active boolean not null default false,
  is_preview boolean not null default false,
  position integer not null default 0 check (position >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (category, level)
);

create index if not exists review_curriculum_levels_catalog_idx
  on public.review_curriculum_levels (category, active, position, level);

create table if not exists public.review_curriculum_items (
  id text primary key
    check (
      length(id) between 1 and 180
      and id ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'
    ),
  category text not null
    check (category in ('words', 'phrases', 'phonics')),
  level smallint not null check (level between 1 and 32),
  title_en text not null check (length(btrim(title_en)) between 1 and 500),
  title_ja text,
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  icon text check (icon is null or length(icon) <= 240),
  tags text[] not null default '{}'::text[],
  required_plan text not null default 'free'
    references public.review_plan_catalog(plan_key),
  active boolean not null default false,
  is_preview boolean not null default false,
  position integer not null default 0 check (position >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (category, level)
    references public.review_curriculum_levels(category, level)
    on update cascade on delete restrict
);

create index if not exists review_curriculum_items_catalog_idx
  on public.review_curriculum_items
    (category, level, active, position, id);

create table if not exists public.review_student_curriculum_access (
  student_id uuid not null
    references public.review_profiles(user_id) on delete cascade,
  item_id text not null
    references public.review_curriculum_items(id) on update cascade on delete restrict,
  access_mode text not null check (access_mode in ('allow', 'block')),
  note text check (note is null or length(note) <= 500),
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, item_id)
);

create index if not exists review_student_curriculum_access_item_idx
  on public.review_student_curriculum_access (item_id, access_mode, student_id);

create table if not exists public.review_curriculum_progress (
  student_id uuid not null
    references public.review_profiles(user_id) on delete cascade,
  item_id text not null
    references public.review_curriculum_items(id) on update cascade on delete restrict,
  status text not null default 'not_started'
    check (status in ('not_started', 'learning', 'reviewed', 'mastered')),
  self_rating text
    check (self_rating is null or self_rating in ('hard', 'good', 'easy')),
  review_count integer not null default 0 check (review_count >= 0),
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, item_id)
);

create index if not exists review_curriculum_progress_due_idx
  on public.review_curriculum_progress
    (student_id, next_review_at, status);

create table if not exists public.review_curriculum_favorites (
  student_id uuid not null
    references public.review_profiles(user_id) on delete cascade,
  item_id text not null
    references public.review_curriculum_items(id) on update cascade on delete restrict,
  created_at timestamptz not null default now(),
  primary key (student_id, item_id)
);

-- ---------------------------------------------------------------------------
-- Teacher announcements
-- ---------------------------------------------------------------------------

create table if not exists public.review_announcements (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null
    references public.review_teachers(user_id) on delete cascade,
  audience text not null default 'all'
    check (audience in ('all', 'targeted')),
  title_en text not null check (length(btrim(title_en)) between 1 and 240),
  title_ja text,
  body_en text check (body_en is null or length(body_en) <= 12000),
  body_ja text check (body_ja is null or length(body_ja) <= 12000),
  active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (body_en is not null or body_ja is not null),
  check (ends_at is null or ends_at > starts_at)
);

create index if not exists review_announcements_active_idx
  on public.review_announcements (teacher_id, active, starts_at, ends_at);

create table if not exists public.review_announcement_targets (
  announcement_id uuid not null
    references public.review_announcements(id) on delete cascade,
  student_id uuid not null
    references public.review_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (announcement_id, student_id)
);

create index if not exists review_announcement_targets_student_idx
  on public.review_announcement_targets (student_id, announcement_id);

-- Append-only, client-read-only record of teacher changes made through the
-- authenticated database API. Service-role/SQL-editor maintenance has no
-- auth.uid() and is deliberately not misattributed to a teacher.
create table if not exists public.review_teacher_audit_log (
  id bigint generated always as identity primary key,
  actor_teacher_id uuid references auth.users(id) on delete set null,
  student_id uuid references public.review_profiles(user_id) on delete set null,
  action text not null check (length(btrim(action)) between 1 and 120),
  entity_type text not null check (length(btrim(entity_type)) between 1 and 120),
  entity_id text,
  details jsonb not null default '{}'::jsonb
    check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists review_teacher_audit_actor_idx
  on public.review_teacher_audit_log (actor_teacher_id, created_at desc);
create index if not exists review_teacher_audit_student_idx
  on public.review_teacher_audit_log (student_id, created_at desc);

-- Reuse the existing timestamp trigger without changing any previous table.
drop trigger if exists review_teacher_students_updated_at
  on public.review_teacher_students;
create trigger review_teacher_students_updated_at
before update on public.review_teacher_students
for each row execute function public.review_set_updated_at();

drop trigger if exists review_student_hub_settings_updated_at
  on public.review_student_hub_settings;
create trigger review_student_hub_settings_updated_at
before update on public.review_student_hub_settings
for each row execute function public.review_set_updated_at();

drop trigger if exists review_curriculum_levels_updated_at
  on public.review_curriculum_levels;
create trigger review_curriculum_levels_updated_at
before update on public.review_curriculum_levels
for each row execute function public.review_set_updated_at();

drop trigger if exists review_curriculum_items_updated_at
  on public.review_curriculum_items;
create trigger review_curriculum_items_updated_at
before update on public.review_curriculum_items
for each row execute function public.review_set_updated_at();

drop trigger if exists review_student_curriculum_access_updated_at
  on public.review_student_curriculum_access;
create trigger review_student_curriculum_access_updated_at
before update on public.review_student_curriculum_access
for each row execute function public.review_set_updated_at();

drop trigger if exists review_curriculum_progress_updated_at
  on public.review_curriculum_progress;
create trigger review_curriculum_progress_updated_at
before update on public.review_curriculum_progress
for each row execute function public.review_set_updated_at();

drop trigger if exists review_announcements_updated_at
  on public.review_announcements;
create trigger review_announcements_updated_at
before update on public.review_announcements
for each row execute function public.review_set_updated_at();

-- Teacher identities must never become learner records. This trigger protects
-- every insertion path, including trusted SQL and future server-side code.
create or replace function public.review_reject_teacher_student_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.active and exists (
    select 1
    from public.review_teachers teacher
    where teacher.user_id = new.student_id
      and teacher.active
  ) then
    raise exception 'Teacher accounts cannot be assigned as learners.';
  end if;
  return new;
end;
$$;

revoke all on function public.review_reject_teacher_student_identity()
  from public;

drop trigger if exists review_teacher_students_reject_teacher_identity
  on public.review_teacher_students;
create trigger review_teacher_students_reject_teacher_identity
before insert or update
on public.review_teacher_students
for each row execute function public.review_reject_teacher_student_identity();

-- There was no ownership concept before this migration. Recover explicit
-- teacher/learner relationships from prior manual approvals and access-code
-- redemptions first. Multiple teachers may remain mapped only when the learner
-- has an explicit relationship with each of them.
insert into public.review_teacher_students (
  teacher_id, student_id, active, assigned_by
)
select distinct membership.approved_by, profile.user_id, true,
  membership.approved_by
from public.review_memberships membership
join public.review_profiles profile
  on profile.user_id = membership.user_id
join public.review_teachers teacher
  on teacher.user_id = membership.approved_by
 and teacher.active
where not exists (
    select 1
    from public.review_teachers learner_teacher
    where learner_teacher.user_id = profile.user_id
      and learner_teacher.active
  )
on conflict (teacher_id, student_id) do nothing;

insert into public.review_teacher_students (
  teacher_id, student_id, active, assigned_by
)
select distinct code.created_by, redemption.user_id, true, code.created_by
from public.review_access_code_redemptions redemption
join public.review_access_codes code
  on code.id = redemption.code_id
join public.review_teachers teacher
  on teacher.user_id = code.created_by
 and teacher.active
join public.review_profiles profile
  on profile.user_id = redemption.user_id
where not exists (
    select 1
    from public.review_teachers learner_teacher
    where learner_teacher.user_id = redemption.user_id
      and learner_teacher.active
  )
on conflict (teacher_id, student_id) do nothing;

-- Preserve the current single-teacher deployment without guessing across
-- tenants. If two or more active teachers exist, any learner without explicit
-- provenance remains unassigned until a trusted admin maps them or they redeem
-- a code issued by their teacher.
with sole_teacher as (
  select min(teacher.user_id::text)::uuid as user_id
  from public.review_teachers teacher
  where teacher.active
  having count(*) = 1
)
insert into public.review_teacher_students (
  teacher_id, student_id, active, assigned_by
)
select sole_teacher.user_id, profile.user_id, true, sole_teacher.user_id
from public.review_profiles profile
cross join sole_teacher
where profile.user_id <> sole_teacher.user_id
  and not exists (
    select 1
    from public.review_teachers learner_teacher
    where learner_teacher.user_id = profile.user_id
      and learner_teacher.active
  )
  and not exists (
    select 1
    from public.review_teacher_students current_owner
    where current_owner.student_id = profile.user_id
      and current_owner.active
  )
on conflict (teacher_id, student_id) do nothing;

-- Every existing learner starts with the conservative Level 1–4 library range.
insert into public.review_student_hub_settings (student_id)
select p.user_id
from public.review_profiles p
where not exists (
  select 1
  from public.review_teachers t
  where t.user_id = p.user_id
    and t.active
)
on conflict (student_id) do nothing;

create or replace function public.review_provision_structured_hub_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  default_teacher uuid;
begin
  if exists (
    select 1
    from public.review_teachers teacher
    where teacher.user_id = new.user_id
      and teacher.active
  ) then
    return new;
  end if;

  insert into public.review_student_hub_settings (student_id)
  values (new.user_id)
  on conflict (student_id) do nothing;

  select min(t.user_id::text)::uuid
  into default_teacher
  from public.review_teachers t
  where t.active
    and t.user_id <> new.user_id
  having count(*) = 1;

  if default_teacher is not null then
    insert into public.review_teacher_students (
      teacher_id, student_id, active, assigned_by
    ) values (
      default_teacher, new.user_id, true, default_teacher
    )
    on conflict (teacher_id, student_id) do update
    set active = true,
        updated_at = now();
  end if;
  return new;
end;
$$;

revoke all on function public.review_provision_structured_hub_profile()
  from public;

drop trigger if exists review_profile_structured_hub_created
  on public.review_profiles;
create trigger review_profile_structured_hub_created
after insert on public.review_profiles
for each row execute function public.review_provision_structured_hub_profile();

-- A successfully redeemed code is an explicit learner/teacher relationship.
-- Link the learner to the active teacher who created that code inside the same
-- transaction; a failed link rolls the entire redemption back safely.
create or replace function public.review_link_access_code_teacher()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  code_teacher uuid;
begin
  if exists (
    select 1
    from public.review_teachers teacher_identity
    where teacher_identity.user_id = new.user_id
      and teacher_identity.active
  ) then
    raise exception 'Teacher accounts cannot redeem learner access codes.';
  end if;

  select code.created_by
  into code_teacher
  from public.review_access_codes code
  join public.review_teachers teacher
    on teacher.user_id = code.created_by
   and teacher.active
  where code.id = new.code_id;

  if code_teacher is null then
    raise exception 'Access code owner is not active.';
  end if;

  insert into public.review_teacher_students (
    teacher_id, student_id, active, assigned_by
  ) values (
    code_teacher, new.user_id, true, code_teacher
  )
  on conflict (teacher_id, student_id) do update set
    active = true,
    assigned_by = excluded.assigned_by,
    updated_at = now();

  return new;
end;
$$;

revoke all on function public.review_link_access_code_teacher() from public;

drop trigger if exists review_access_code_redemption_teacher_link
  on public.review_access_code_redemptions;
create trigger review_access_code_redemption_teacher_link
after insert on public.review_access_code_redemptions
for each row execute function public.review_link_access_code_teacher();

-- A future teacher may first receive a Review Hub profile through the normal
-- Auth signup trigger. Promotion must not leave that teacher visible as a
-- learner to a previous owner; retain history but deactivate the mapping.
create or replace function public.review_remove_teacher_student_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.active then
    update public.review_teacher_students ownership
    set active = false,
        updated_at = now()
    where ownership.student_id = new.user_id
      and ownership.active;

    -- If a project was initialised before its first teacher was promoted,
    -- securely adopt only learners who still have no active owner. Later
    -- teachers never gain access to already-owned learners through this path.
    if (
      select count(*)
      from public.review_teachers active_teacher
      where active_teacher.active
    ) = 1 then
      insert into public.review_teacher_students (
        teacher_id, student_id, active, assigned_by
      )
      select new.user_id, profile.user_id, true, new.user_id
      from public.review_profiles profile
      where profile.user_id <> new.user_id
        and not exists (
          select 1
          from public.review_teachers teacher_identity
          where teacher_identity.user_id = profile.user_id
            and teacher_identity.active
        )
        and not exists (
          select 1
          from public.review_teacher_students current_owner
          where current_owner.student_id = profile.user_id
            and current_owner.active
        )
      on conflict (teacher_id, student_id) do update set
        active = true,
        assigned_by = new.user_id,
        updated_at = now();
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.review_remove_teacher_student_identity()
  from public;

drop trigger if exists review_teacher_remove_student_identity
  on public.review_teachers;
create trigger review_teacher_remove_student_identity
after insert or update of active on public.review_teachers
for each row execute function public.review_remove_teacher_student_identity();

-- ---------------------------------------------------------------------------
-- Authorisation helpers
-- ---------------------------------------------------------------------------

-- This is the single ownership predicate for all learner-specific teacher
-- reads and writes. Keeping it SECURITY DEFINER prevents recursive RLS checks
-- when a policy on another table consults the mapping table.
create or replace function public.review_teacher_can_manage(check_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select check_student is not null
    and auth.uid() is not null
    and not exists (
      select 1
      from public.review_teachers student_teacher
      where student_teacher.user_id = check_student
        and student_teacher.active
    )
    and exists (
      select 1
      from public.review_teachers t
      join public.review_teacher_students ownership
        on ownership.teacher_id = t.user_id
       and ownership.student_id = check_student
       and ownership.active
      where t.user_id = auth.uid()
        and t.active
    );
$$;

revoke all on function public.review_teacher_can_manage(uuid) from public;
grant execute on function public.review_teacher_can_manage(uuid)
  to authenticated;

-- An existing owner may deliberately share or transfer a learner. Teachers
-- cannot self-claim an arbitrary profile, and unassigned profiles remain a
-- trusted-admin provisioning case.
create or replace function public.review_assign_student_teacher(
  target_student uuid,
  target_teacher uuid,
  replace_existing boolean default true
)
returns public.review_teacher_students
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned public.review_teacher_students%rowtype;
begin
  if not public.review_teacher_can_manage(target_student) then
    raise exception 'This learner is not assigned to the signed-in teacher.';
  end if;
  if target_teacher is null or target_teacher = target_student then
    raise exception 'Choose a valid teacher.';
  end if;
  if not exists (
    select 1
    from public.review_teachers teacher
    where teacher.user_id = target_teacher
      and teacher.active
  ) then
    raise exception 'The selected teacher is not active.';
  end if;

  if coalesce(replace_existing, true) then
    update public.review_teacher_students ownership
    set active = false,
        updated_at = now()
    where ownership.student_id = target_student
      and ownership.teacher_id <> target_teacher
      and ownership.active;
  end if;

  insert into public.review_teacher_students (
    teacher_id, student_id, active, assigned_by
  ) values (
    target_teacher, target_student, true, auth.uid()
  )
  on conflict (teacher_id, student_id) do update set
    active = true,
    assigned_by = auth.uid(),
    updated_at = now()
  returning * into assigned;

  insert into public.review_teacher_audit_log (
    actor_teacher_id, student_id, action, entity_type, entity_id, details
  ) values (
    auth.uid(),
    target_student,
    case when coalesce(replace_existing, true) then 'transfer' else 'share' end,
    'review_teacher_students',
    target_teacher::text,
    jsonb_build_object(
      'target_teacher_id', target_teacher,
      'replace_existing', coalesce(replace_existing, true)
    )
  );

  return assigned;
end;
$$;

revoke all on function public.review_assign_student_teacher(uuid, uuid, boolean)
  from public;
grant execute on function public.review_assign_student_teacher(uuid, uuid, boolean)
  to authenticated;

-- The earlier reissue RPC was globally teacher-authorised. Keep its atomic
-- rotation behaviour while binding the source code to its creating teacher.
create or replace function public.review_reissue_access_code(target_code uuid)
returns table (access_code text, code_id uuid)
language plpgsql
security definer
set search_path = ''
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
  from public.review_access_codes code
  where code.id = target_code
    and code.created_by = auth.uid()
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
  where id = current_code.id
    and created_by = auth.uid();

  return query select raw_code, replacement_id;
end;
$$;

revoke all on function public.review_reissue_access_code(uuid) from public;
grant execute on function public.review_reissue_access_code(uuid)
  to authenticated;

create or replace function public.review_student_hub_feature_enabled(
  requested_feature text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_review_teacher() then true
    when auth.uid() is null then false
    when not exists (
      select 1
      from public.review_profiles profile
      where profile.user_id = auth.uid()
    ) then false
    when requested_feature not in (
      'account_enabled', 'dashboard', 'words', 'phrases', 'phonics',
      'review_lessons', 'homework', 'progress', 'pricing',
      'contact_teacher', 'trial_cta', 'payment_plan', 'announcements',
      'show_dashboard', 'show_words', 'show_phrases', 'show_phonics',
      'show_review_lessons', 'show_homework', 'show_progress',
      'show_pricing', 'show_contact_teacher', 'show_trial_cta',
      'show_payment_plan', 'show_announcements'
    ) then false
    else coalesce(
      (
        select settings.account_enabled
          and case requested_feature
            when 'account_enabled' then true
            when 'dashboard' then settings.show_dashboard
            when 'show_dashboard' then settings.show_dashboard
            when 'words' then settings.show_words
            when 'show_words' then settings.show_words
            when 'phrases' then settings.show_phrases
            when 'show_phrases' then settings.show_phrases
            when 'phonics' then settings.show_phonics
            when 'show_phonics' then settings.show_phonics
            when 'review_lessons' then settings.show_review_lessons
            when 'show_review_lessons' then settings.show_review_lessons
            when 'homework' then settings.show_homework
            when 'show_homework' then settings.show_homework
            when 'progress' then settings.show_progress
            when 'show_progress' then settings.show_progress
            when 'pricing' then settings.show_pricing
            when 'show_pricing' then settings.show_pricing
            when 'contact_teacher' then settings.show_contact_teacher
            when 'show_contact_teacher' then settings.show_contact_teacher
            when 'trial_cta' then settings.show_trial_cta
            when 'show_trial_cta' then settings.show_trial_cta
            when 'payment_plan' then settings.show_payment_plan
            when 'show_payment_plan' then settings.show_payment_plan
            when 'announcements' then settings.show_announcements
            when 'show_announcements' then settings.show_announcements
            else false
          end
        from public.review_student_hub_settings settings
        where settings.student_id = auth.uid()
      ),
      -- A missing row is integrity drift after this transactional migration;
      -- never reopen learner features when the authoritative settings vanish.
      false
    )
  end;
$$;

revoke all on function public.review_student_hub_feature_enabled(text)
  from public;
grant execute on function public.review_student_hub_feature_enabled(text)
  to authenticated;

create or replace function public.review_student_curriculum_category_enabled(
  check_category text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select check_category in ('words', 'phrases', 'phonics')
    and public.review_student_hub_feature_enabled(check_category);
$$;

revoke all on function public.review_student_curriculum_category_enabled(text)
  from public;
grant execute on function public.review_student_curriculum_category_enabled(text)
  to authenticated;

create or replace function public.review_student_curriculum_scope_allowed(
  check_category text,
  check_level integer
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select check_level between 1 and 32
    and public.review_student_curriculum_category_enabled(check_category)
    and coalesce(
      (
        select check_level between settings.allowed_level_min
                               and settings.allowed_level_max
          and (
            cardinality(settings.allowed_levels) = 0
            or check_level = any(settings.allowed_levels)
          )
        from public.review_student_hub_settings settings
        where settings.student_id = auth.uid()
      ),
      false
    );
$$;

revoke all on function public.review_student_curriculum_scope_allowed(text, integer)
  from public;
grant execute on function public.review_student_curriculum_scope_allowed(text, integer)
  to authenticated;

create or replace function public.review_can_read_curriculum_level(
  check_category text,
  check_level integer
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_curriculum_levels curriculum_level
    where curriculum_level.category = check_category
      and curriculum_level.level = check_level
      and (
        public.is_review_teacher()
        or (
          curriculum_level.active
          and auth.uid() is null
          and curriculum_level.is_preview
        )
        or (
          curriculum_level.active
          and auth.uid() is not null
          and public.review_student_curriculum_category_enabled(check_category)
          and (
            public.review_student_curriculum_scope_allowed(
              check_category, check_level
            )
            or exists (
              select 1
              from public.review_student_curriculum_access access
              join public.review_curriculum_items item
                on item.id = access.item_id
               and item.category = check_category
               and item.level = check_level
               and item.active
              where access.student_id = auth.uid()
                and access.access_mode = 'allow'
            )
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_curriculum_level(text, integer)
  from public;
grant execute on function public.review_can_read_curriculum_level(text, integer)
  to anon, authenticated;

create or replace function public.review_can_read_curriculum_item(
  check_item text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_curriculum_items item
    join public.review_curriculum_levels curriculum_level
      on curriculum_level.category = item.category
     and curriculum_level.level = item.level
    where item.id = check_item
      and (
        public.is_review_teacher()
        or (
          auth.uid() is null
          and item.active
          and item.is_preview
          and curriculum_level.active
          and curriculum_level.is_preview
        )
        or (
          auth.uid() is not null
          and item.active
          and curriculum_level.active
          and public.review_student_curriculum_category_enabled(item.category)
          and not exists (
            select 1
            from public.review_student_curriculum_access blocked
            where blocked.student_id = auth.uid()
              and blocked.item_id = item.id
              and blocked.access_mode = 'block'
          )
          and (
            exists (
              select 1
              from public.review_student_curriculum_access allowed
              where allowed.student_id = auth.uid()
                and allowed.item_id = item.id
                and allowed.access_mode = 'allow'
            )
            or (
              public.review_student_curriculum_scope_allowed(
                item.category, item.level
              )
              and public.review_plan_meets_requirement(item.required_plan)
            )
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_curriculum_item(text)
  from public;
grant execute on function public.review_can_read_curriculum_item(text)
  to anon, authenticated;

create or replace function public.review_can_read_announcement(
  check_announcement uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_announcements announcement
    where announcement.id = check_announcement
      and (
        (
          announcement.teacher_id = auth.uid()
          and public.is_review_teacher()
        )
        or (
          auth.uid() is not null
          and exists (
            select 1
            from public.review_teacher_students ownership
            where ownership.teacher_id = announcement.teacher_id
              and ownership.student_id = auth.uid()
              and ownership.active
          )
          and public.review_student_hub_feature_enabled('announcements')
          and announcement.active
          and announcement.starts_at <= now()
          and (announcement.ends_at is null or announcement.ends_at > now())
          and (
            announcement.audience = 'all'
            or exists (
              select 1
              from public.review_announcement_targets target
              where target.announcement_id = announcement.id
                and target.student_id = auth.uid()
            )
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_announcement(uuid)
  from public;
grant execute on function public.review_can_read_announcement(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security for Structured Learning Hub data
-- ---------------------------------------------------------------------------

alter table public.review_teacher_students enable row level security;
alter table public.review_student_hub_settings enable row level security;
alter table public.review_curriculum_levels enable row level security;
alter table public.review_curriculum_items enable row level security;
alter table public.review_student_curriculum_access enable row level security;
alter table public.review_curriculum_progress enable row level security;
alter table public.review_curriculum_favorites enable row level security;
alter table public.review_announcements enable row level security;
alter table public.review_announcement_targets enable row level security;
alter table public.review_teacher_audit_log enable row level security;

-- Access codes belong to the teacher who issued them. The Edge function uses a
-- service-role client for some operations, so it applies the same creator scope
-- explicitly as a second boundary.
drop policy if exists review_codes_teacher_select
  on public.review_access_codes;
create policy review_codes_teacher_select
on public.review_access_codes for select
to authenticated
using (
  created_by = auth.uid()
  and public.is_review_teacher()
);

drop policy if exists review_codes_teacher_update
  on public.review_access_codes;
create policy review_codes_teacher_update
on public.review_access_codes for update
to authenticated
using (
  created_by = auth.uid()
  and public.is_review_teacher()
)
with check (
  created_by = auth.uid()
  and public.is_review_teacher()
);

drop policy if exists review_teacher_students_select
  on public.review_teacher_students;
create policy review_teacher_students_select
on public.review_teacher_students for select
to authenticated
using (
  (teacher_id = auth.uid() and public.is_review_teacher())
  or (student_id = auth.uid() and active)
);

drop policy if exists review_student_hub_settings_select
  on public.review_student_hub_settings;
create policy review_student_hub_settings_select
on public.review_student_hub_settings for select
to authenticated
using (
  student_id = auth.uid()
  or public.review_teacher_can_manage(student_id)
);

drop policy if exists review_student_hub_settings_insert_teacher
  on public.review_student_hub_settings;
create policy review_student_hub_settings_insert_teacher
on public.review_student_hub_settings for insert
to authenticated
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_student_hub_settings_update_teacher
  on public.review_student_hub_settings;
create policy review_student_hub_settings_update_teacher
on public.review_student_hub_settings for update
to authenticated
using (public.review_teacher_can_manage(student_id))
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_curriculum_levels_select
  on public.review_curriculum_levels;
create policy review_curriculum_levels_select
on public.review_curriculum_levels for select
to anon, authenticated
using (public.review_can_read_curriculum_level(category, level));

drop policy if exists review_curriculum_levels_insert_teacher
  on public.review_curriculum_levels;
create policy review_curriculum_levels_insert_teacher
on public.review_curriculum_levels for insert
to authenticated
with check (
  public.is_review_teacher()
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists review_curriculum_levels_update_teacher
  on public.review_curriculum_levels;
create policy review_curriculum_levels_update_teacher
on public.review_curriculum_levels for update
to authenticated
using (public.is_review_teacher())
with check (
  public.is_review_teacher()
  and updated_by = auth.uid()
);

drop policy if exists review_curriculum_levels_delete_teacher
  on public.review_curriculum_levels;
-- Published catalogue history is retired with active=false. Physical DELETE is
-- intentionally unavailable so learner access/progress references are retained.

drop policy if exists review_curriculum_items_select
  on public.review_curriculum_items;
create policy review_curriculum_items_select
on public.review_curriculum_items for select
to anon, authenticated
using (public.review_can_read_curriculum_item(id));

drop policy if exists review_curriculum_items_insert_teacher
  on public.review_curriculum_items;
create policy review_curriculum_items_insert_teacher
on public.review_curriculum_items for insert
to authenticated
with check (
  public.is_review_teacher()
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists review_curriculum_items_update_teacher
  on public.review_curriculum_items;
create policy review_curriculum_items_update_teacher
on public.review_curriculum_items for update
to authenticated
using (public.is_review_teacher())
with check (
  public.is_review_teacher()
  and updated_by = auth.uid()
);

drop policy if exists review_curriculum_items_delete_teacher
  on public.review_curriculum_items;
-- Items follow the same soft-retire rule as their parent levels.

drop policy if exists review_student_curriculum_access_select
  on public.review_student_curriculum_access;
create policy review_student_curriculum_access_select
on public.review_student_curriculum_access for select
to authenticated
using (public.review_teacher_can_manage(student_id));

drop policy if exists review_student_curriculum_access_insert_teacher
  on public.review_student_curriculum_access;
create policy review_student_curriculum_access_insert_teacher
on public.review_student_curriculum_access for insert
to authenticated
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_student_curriculum_access_update_teacher
  on public.review_student_curriculum_access;
create policy review_student_curriculum_access_update_teacher
on public.review_student_curriculum_access for update
to authenticated
using (public.review_teacher_can_manage(student_id))
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_student_curriculum_access_delete_teacher
  on public.review_student_curriculum_access;
create policy review_student_curriculum_access_delete_teacher
on public.review_student_curriculum_access for delete
to authenticated
using (public.review_teacher_can_manage(student_id));

drop policy if exists review_curriculum_progress_select
  on public.review_curriculum_progress;
create policy review_curriculum_progress_select
on public.review_curriculum_progress for select
to authenticated
using (
  (
    student_id = auth.uid()
    and public.review_student_hub_feature_enabled('progress')
    and public.review_can_read_curriculum_item(item_id)
  )
  or public.review_teacher_can_manage(student_id)
);

drop policy if exists review_curriculum_progress_insert_self
  on public.review_curriculum_progress;
create policy review_curriculum_progress_insert_self
on public.review_curriculum_progress for insert
to authenticated
with check (
  student_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_curriculum_item(item_id)
);

drop policy if exists review_curriculum_progress_update_self
  on public.review_curriculum_progress;
create policy review_curriculum_progress_update_self
on public.review_curriculum_progress for update
to authenticated
using (student_id = auth.uid() and not public.is_review_teacher())
with check (
  student_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_curriculum_item(item_id)
);

drop policy if exists review_curriculum_favorites_select
  on public.review_curriculum_favorites;
create policy review_curriculum_favorites_select
on public.review_curriculum_favorites for select
to authenticated
using (
  (
    student_id = auth.uid()
    and public.review_can_read_curriculum_item(item_id)
  )
  or public.review_teacher_can_manage(student_id)
);

drop policy if exists review_curriculum_favorites_insert_self
  on public.review_curriculum_favorites;
create policy review_curriculum_favorites_insert_self
on public.review_curriculum_favorites for insert
to authenticated
with check (
  student_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_can_read_curriculum_item(item_id)
);

drop policy if exists review_curriculum_favorites_delete_self
  on public.review_curriculum_favorites;
create policy review_curriculum_favorites_delete_self
on public.review_curriculum_favorites for delete
to authenticated
using (student_id = auth.uid() and not public.is_review_teacher());

drop policy if exists review_announcements_select
  on public.review_announcements;
create policy review_announcements_select
on public.review_announcements for select
to authenticated
using (public.review_can_read_announcement(id));

drop policy if exists review_announcements_insert_teacher
  on public.review_announcements;
create policy review_announcements_insert_teacher
on public.review_announcements for insert
to authenticated
with check (
  public.is_review_teacher()
  and teacher_id = auth.uid()
);

drop policy if exists review_announcements_update_teacher
  on public.review_announcements;
create policy review_announcements_update_teacher
on public.review_announcements for update
to authenticated
using (teacher_id = auth.uid() and public.is_review_teacher())
with check (teacher_id = auth.uid() and public.is_review_teacher());

drop policy if exists review_announcements_delete_teacher
  on public.review_announcements;
create policy review_announcements_delete_teacher
on public.review_announcements for delete
to authenticated
using (teacher_id = auth.uid() and public.is_review_teacher());

drop policy if exists review_announcement_targets_select
  on public.review_announcement_targets;
create policy review_announcement_targets_select
on public.review_announcement_targets for select
to authenticated
using (
  (
    student_id = auth.uid()
    and public.review_can_read_announcement(announcement_id)
  )
  or exists (
    select 1
    from public.review_announcements announcement
    where announcement.id = announcement_id
      and announcement.teacher_id = auth.uid()
      and public.review_teacher_can_manage(student_id)
  )
);

drop policy if exists review_announcement_targets_insert_teacher
  on public.review_announcement_targets;
create policy review_announcement_targets_insert_teacher
on public.review_announcement_targets for insert
to authenticated
with check (
  public.review_teacher_can_manage(student_id)
  and exists (
    select 1
    from public.review_announcements announcement
    where announcement.id = announcement_id
      and announcement.teacher_id = auth.uid()
  )
);

drop policy if exists review_announcement_targets_delete_teacher
  on public.review_announcement_targets;
create policy review_announcement_targets_delete_teacher
on public.review_announcement_targets for delete
to authenticated
using (
  public.review_teacher_can_manage(student_id)
  and exists (
    select 1
    from public.review_announcements announcement
    where announcement.id = announcement_id
      and announcement.teacher_id = auth.uid()
  )
);

drop policy if exists review_teacher_audit_log_select
  on public.review_teacher_audit_log;
create policy review_teacher_audit_log_select
on public.review_teacher_audit_log for select
to authenticated
using (
  (actor_teacher_id = auth.uid() and public.is_review_teacher())
  or public.review_teacher_can_manage(student_id)
);

-- Explicit grants are kept narrow even when an RLS predicate would deny a
-- broader operation. Ownership assignment and audit rows remain server-only.
revoke all on public.review_teacher_students from anon, authenticated;
grant select on public.review_teacher_students to authenticated;

revoke all on public.review_student_hub_settings from anon, authenticated;
grant select, insert, update on public.review_student_hub_settings
  to authenticated;

revoke all on public.review_curriculum_levels from anon, authenticated;
grant select on public.review_curriculum_levels to anon, authenticated;
grant insert, update on public.review_curriculum_levels
  to authenticated;

revoke all on public.review_curriculum_items from anon, authenticated;
grant select on public.review_curriculum_items to anon, authenticated;
grant insert, update on public.review_curriculum_items
  to authenticated;

revoke all on public.review_student_curriculum_access
  from anon, authenticated;
grant select, insert, update, delete
  on public.review_student_curriculum_access to authenticated;

revoke all on public.review_curriculum_progress from anon, authenticated;
grant select, insert, update on public.review_curriculum_progress
  to authenticated;

revoke all on public.review_curriculum_favorites from anon, authenticated;
grant select, insert, delete on public.review_curriculum_favorites
  to authenticated;

revoke all on public.review_announcements from anon, authenticated;
grant select, insert, update, delete on public.review_announcements
  to authenticated;

revoke all on public.review_announcement_targets from anon, authenticated;
grant select, insert, delete on public.review_announcement_targets
  to authenticated;

revoke all on public.review_teacher_audit_log from anon, authenticated;
grant select on public.review_teacher_audit_log to authenticated;

-- ---------------------------------------------------------------------------
-- Append-only teacher audit and learner mutation RPCs
-- ---------------------------------------------------------------------------

create or replace function public.review_audit_teacher_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  snapshot jsonb;
  affected_student uuid;
  affected_entity text;
begin
  if auth.uid() is null or not public.is_review_teacher() then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  snapshot := case
    when tg_op = 'DELETE' then to_jsonb(old)
    else to_jsonb(new)
  end;
  affected_student := nullif(
    coalesce(snapshot ->> 'student_id', snapshot ->> 'user_id'),
    ''
  )::uuid;
  affected_entity := coalesce(
    snapshot ->> 'id',
    snapshot ->> 'item_id',
    snapshot ->> 'announcement_id',
    snapshot ->> 'student_id'
  );

  insert into public.review_teacher_audit_log (
    actor_teacher_id,
    student_id,
    action,
    entity_type,
    entity_id,
    details
  ) values (
    auth.uid(),
    affected_student,
    lower(tg_op),
    tg_table_name,
    affected_entity,
    jsonb_strip_nulls(jsonb_build_object(
      'access_mode', snapshot -> 'access_mode',
      'audience', snapshot -> 'audience',
      'active', snapshot -> 'active',
      'account_enabled', snapshot -> 'account_enabled'
    ))
  );

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.review_audit_teacher_change() from public;

drop trigger if exists review_student_hub_settings_audit
  on public.review_student_hub_settings;
create trigger review_student_hub_settings_audit
after insert or update or delete on public.review_student_hub_settings
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_student_curriculum_access_audit
  on public.review_student_curriculum_access;
create trigger review_student_curriculum_access_audit
after insert or update or delete on public.review_student_curriculum_access
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_announcements_audit
  on public.review_announcements;
create trigger review_announcements_audit
after insert or update or delete on public.review_announcements
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_announcement_targets_audit
  on public.review_announcement_targets;
create trigger review_announcement_targets_audit
after insert or update or delete on public.review_announcement_targets
for each row execute function public.review_audit_teacher_change();

create or replace function public.review_save_curriculum_progress(
  target_item text,
  next_status text,
  next_self_rating text default null
)
returns public.review_curriculum_progress
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.review_curriculum_progress%rowtype;
  reviewed_at timestamptz;
  due_at timestamptz;
begin
  if auth.uid() is null or public.is_review_teacher() then
    raise exception 'Learner authorisation is required.';
  end if;
  if target_item is null or btrim(target_item) = '' then
    raise exception 'Choose a curriculum item.';
  end if;
  if next_status is null
     or next_status not in ('not_started', 'learning', 'reviewed', 'mastered') then
    raise exception 'Invalid curriculum progress status.';
  end if;
  if next_self_rating is not null
     and next_self_rating not in ('hard', 'good', 'easy') then
    raise exception 'Invalid curriculum self-rating.';
  end if;
  if not public.review_student_hub_feature_enabled('progress')
     or not public.review_can_read_curriculum_item(target_item) then
    raise exception 'This curriculum item is not available for this account.';
  end if;

  reviewed_at := case
    when next_status = 'not_started' then null
    else now()
  end;
  due_at := case next_self_rating
    when 'hard' then now() + interval '1 day'
    when 'good' then now() + interval '3 days'
    when 'easy' then now() + interval '7 days'
    else null
  end;

  insert into public.review_curriculum_progress (
    student_id,
    item_id,
    status,
    self_rating,
    review_count,
    last_reviewed_at,
    next_review_at
  ) values (
    auth.uid(),
    target_item,
    next_status,
    next_self_rating,
    case when next_status = 'not_started' then 0 else 1 end,
    reviewed_at,
    due_at
  )
  on conflict (student_id, item_id) do update set
    status = excluded.status,
    self_rating = excluded.self_rating,
    review_count = case
      when excluded.status = 'not_started'
        then public.review_curriculum_progress.review_count
      else public.review_curriculum_progress.review_count + 1
    end,
    last_reviewed_at = excluded.last_reviewed_at,
    next_review_at = excluded.next_review_at,
    updated_at = now()
  returning * into saved;

  return saved;
end;
$$;

revoke all on function public.review_save_curriculum_progress(text, text, text)
  from public;
grant execute on function public.review_save_curriculum_progress(text, text, text)
  to authenticated;

create or replace function public.review_set_curriculum_favorite(
  target_item text,
  favorite boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or public.is_review_teacher() then
    raise exception 'Learner authorisation is required.';
  end if;
  if target_item is null or btrim(target_item) = '' then
    raise exception 'Choose a curriculum item.';
  end if;

  if coalesce(favorite, false) then
    if not public.review_can_read_curriculum_item(target_item) then
      raise exception 'This curriculum item is not available for this account.';
    end if;
    insert into public.review_curriculum_favorites (student_id, item_id)
    values (auth.uid(), target_item)
    on conflict (student_id, item_id) do nothing;
    return true;
  end if;

  delete from public.review_curriculum_favorites
  where student_id = auth.uid()
    and item_id = target_item;
  return false;
end;
$$;

revoke all on function public.review_set_curriculum_favorite(text, boolean)
  from public;
grant execute on function public.review_set_curriculum_favorite(text, boolean)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Apply the same ownership and visibility boundary to existing Hub features
-- ---------------------------------------------------------------------------

-- The plan resolver still owns plan entitlements; this wrapper additionally
-- makes account, homework and progress switches authoritative at the database
-- edge. Existing learners keep identical behaviour because all switches were
-- backfilled true.
create or replace function public.review_has_feature(requested_feature text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_review_teacher() then true
    when auth.uid() is null or not public.review_profile_is_complete() then false
    when not public.review_student_hub_feature_enabled('account_enabled') then false
    when requested_feature in (
      'teacher_review', 'premium_image_missions',
      'speaking_submission', 'essay_submission'
    ) and not public.review_student_hub_feature_enabled('homework') then false
    when requested_feature = 'progress_history'
      and not public.review_student_hub_feature_enabled('progress') then false
    when requested_feature = 'phrase_library'
      and not public.review_student_hub_feature_enabled('phrases') then false
    else coalesce(
      (
        select (override.feature_flags ->> requested_feature)::boolean
        from public.review_learner_plan_overrides override
        where override.user_id = auth.uid()
          and override.feature_flags ? requested_feature
          and jsonb_typeof(override.feature_flags -> requested_feature) = 'boolean'
          and override.starts_at <= now()
          and (override.expires_at is null or override.expires_at > now())
      ),
      (
        select coalesce((plan.entitlements ->> requested_feature)::boolean, false)
        from public.review_plan_catalog plan
        where plan.plan_key = public.review_effective_plan()
          and plan.active
      ),
      false
    )
  end;
$$;

revoke all on function public.review_has_feature(text) from public;
grant execute on function public.review_has_feature(text)
  to anon, authenticated;

create or replace function public.review_can_read_lesson(check_lesson uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_lessons lesson
    where lesson.id = check_lesson
      and lesson.status = 'published'
      and (
        public.is_review_teacher()
        or (
          lesson.audience in ('general', 'both')
          and lesson.is_preview
          and coalesce(
            public.review_lesson_access_mode(lesson.id), 'inherit'
          ) <> 'block'
          and (
            auth.uid() is null
            or public.review_student_hub_feature_enabled('review_lessons')
          )
        )
        or (
          -- Homework is an independent teacher-controlled surface. A visible,
          -- currently open assignment may launch its lesson even when the
          -- general Review Lessons catalogue is hidden for this learner.
          auth.uid() is not null
          and public.review_student_hub_feature_enabled('homework')
          and public.review_profile_is_complete()
          and coalesce(
            public.review_lesson_access_mode(lesson.id), 'inherit'
          ) <> 'block'
          and exists (
            select 1
            from public.review_assignments assignment
            where assignment.lesson_id = lesson.id
              and assignment.student_id = auth.uid()
              and assignment.status <> 'dismissed'
              and assignment.visible_to_student
              and (assignment.opens_at is null or assignment.opens_at <= now())
              and (assignment.closes_at is null or assignment.closes_at > now())
              and public.review_plan_meets_requirement(
                assignment.required_plan
              )
          )
        )
        or (
          auth.uid() is not null
          and public.review_student_hub_feature_enabled('review_lessons')
          and public.review_profile_is_complete()
          and (
            public.review_lesson_access_mode(lesson.id) = 'allow'
            or (
              coalesce(
                public.review_lesson_access_mode(lesson.id), 'inherit'
              ) <> 'block'
              and (
                (
                  lesson.audience in ('general', 'both')
                  and public.review_has_active_membership('general')
                )
                or (
                  lesson.audience in ('takiwaki', 'both')
                  and public.review_has_active_membership('takiwaki')
                  and exists (
                    select 1
                    from public.review_profiles profile
                    where profile.user_id = auth.uid()
                      and profile.access_scope = 'takiwaki'
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

create or replace function public.review_assignment_is_open(
  check_assignment uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_assignments assignment
    where assignment.id = check_assignment
      and (
        (
          assignment.student_id = auth.uid()
          and public.review_student_hub_feature_enabled('homework')
        )
        or public.review_teacher_can_manage(assignment.student_id)
      )
      and assignment.status <> 'dismissed'
      and assignment.visible_to_student
      and (assignment.opens_at is null or assignment.opens_at <= now())
      and (assignment.closes_at is null or assignment.closes_at > now())
      and public.review_plan_meets_requirement(assignment.required_plan)
  );
$$;

revoke all on function public.review_assignment_is_open(uuid) from public;
grant execute on function public.review_assignment_is_open(uuid)
  to authenticated;

-- Security-definer approval/review functions and direct table writes both pass
-- these triggers, closing the global-teacher bypass without rewriting their
-- transaction semantics.
create or replace function public.review_enforce_teacher_student_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_student uuid;
  new_student uuid;
begin
  if auth.uid() is null or not public.is_review_teacher() then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op <> 'INSERT' then
    old_student := nullif(
      coalesce(to_jsonb(old) ->> 'student_id', to_jsonb(old) ->> 'user_id'),
      ''
    )::uuid;
    if old_student is not null
       and not public.review_teacher_can_manage(old_student) then
      raise exception 'This learner is not assigned to the signed-in teacher.';
    end if;
  end if;

  if tg_op <> 'DELETE' then
    new_student := nullif(
      coalesce(to_jsonb(new) ->> 'student_id', to_jsonb(new) ->> 'user_id'),
      ''
    )::uuid;
    if new_student is not null
       and not public.review_teacher_can_manage(new_student) then
      raise exception 'This learner is not assigned to the signed-in teacher.';
    end if;
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.review_enforce_teacher_student_ownership()
  from public;

drop trigger if exists review_memberships_teacher_ownership
  on public.review_memberships;
create trigger review_memberships_teacher_ownership
before insert or update or delete on public.review_memberships
for each row execute function public.review_enforce_teacher_student_ownership();

drop trigger if exists review_plan_overrides_teacher_ownership
  on public.review_learner_plan_overrides;
create trigger review_plan_overrides_teacher_ownership
before insert or update or delete on public.review_learner_plan_overrides
for each row execute function public.review_enforce_teacher_student_ownership();

drop trigger if exists review_lesson_overrides_teacher_ownership
  on public.review_lesson_access_overrides;
create trigger review_lesson_overrides_teacher_ownership
before insert or update or delete on public.review_lesson_access_overrides
for each row execute function public.review_enforce_teacher_student_ownership();

drop trigger if exists review_assignments_teacher_ownership
  on public.review_assignments;
create trigger review_assignments_teacher_ownership
before insert or update or delete on public.review_assignments
for each row execute function public.review_enforce_teacher_student_ownership();

create or replace function public.review_enforce_submission_teacher_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_student uuid;
begin
  if auth.uid() is null or not public.is_review_teacher() then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  target_student := case
    when tg_op = 'DELETE' then old.user_id
    else new.user_id
  end;
  if not public.review_teacher_can_manage(target_student) then
    raise exception 'This learner is not assigned to the signed-in teacher.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.review_enforce_submission_teacher_ownership()
  from public;

drop trigger if exists review_task_submissions_teacher_ownership
  on public.review_task_submissions;
create trigger review_task_submissions_teacher_ownership
before insert or update or delete on public.review_task_submissions
for each row execute function public.review_enforce_submission_teacher_ownership();

create or replace function public.review_enforce_feedback_teacher_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_submission uuid;
  target_student uuid;
begin
  if auth.uid() is null or not public.is_review_teacher() then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  target_submission := case
    when tg_op = 'DELETE' then old.submission_id
    else new.submission_id
  end;
  select submission.user_id
  into target_student
  from public.review_task_submissions submission
  where submission.id = target_submission;

  if target_student is null
     or not public.review_teacher_can_manage(target_student) then
    raise exception 'This learner is not assigned to the signed-in teacher.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.review_enforce_feedback_teacher_ownership()
  from public;

drop trigger if exists review_submission_feedback_teacher_ownership
  on public.review_submission_feedback;
create trigger review_submission_feedback_teacher_ownership
before insert or update or delete on public.review_submission_feedback
for each row execute function public.review_enforce_feedback_teacher_ownership();

-- Learner-personal records: learners retain access to their own data while an
-- active teacher sees or manages only mapped students.
drop policy if exists review_profiles_select on public.review_profiles;
create policy review_profiles_select
on public.review_profiles for select
to authenticated
using (
  user_id = auth.uid()
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_memberships_select on public.review_memberships;
create policy review_memberships_select
on public.review_memberships for select
to authenticated
using (
  user_id = auth.uid()
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_memberships_update_teacher
  on public.review_memberships;
create policy review_memberships_update_teacher
on public.review_memberships for update
to authenticated
using (public.review_teacher_can_manage(user_id))
with check (public.review_teacher_can_manage(user_id));

drop policy if exists review_redemptions_select
  on public.review_access_code_redemptions;
create policy review_redemptions_select
on public.review_access_code_redemptions for select
to authenticated
using (
  user_id = auth.uid()
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_lesson_access_overrides_select
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_select
on public.review_lesson_access_overrides for select
to authenticated
using (
  student_id = auth.uid()
  or public.review_teacher_can_manage(student_id)
);

drop policy if exists review_lesson_access_overrides_insert_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_insert_teacher
on public.review_lesson_access_overrides for insert
to authenticated
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_lesson_access_overrides_update_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_update_teacher
on public.review_lesson_access_overrides for update
to authenticated
using (public.review_teacher_can_manage(student_id))
with check (
  public.review_teacher_can_manage(student_id)
  and updated_by = auth.uid()
);

drop policy if exists review_lesson_access_overrides_delete_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_delete_teacher
on public.review_lesson_access_overrides for delete
to authenticated
using (public.review_teacher_can_manage(student_id));

drop policy if exists review_plan_overrides_select
  on public.review_learner_plan_overrides;
create policy review_plan_overrides_select
on public.review_learner_plan_overrides for select
to authenticated
using (
  user_id = auth.uid()
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_plan_overrides_insert_teacher
  on public.review_learner_plan_overrides;
create policy review_plan_overrides_insert_teacher
on public.review_learner_plan_overrides for insert
to authenticated
with check (
  public.review_teacher_can_manage(user_id)
  and updated_by = auth.uid()
);

drop policy if exists review_plan_overrides_update_teacher
  on public.review_learner_plan_overrides;
create policy review_plan_overrides_update_teacher
on public.review_learner_plan_overrides for update
to authenticated
using (public.review_teacher_can_manage(user_id))
with check (
  public.review_teacher_can_manage(user_id)
  and updated_by = auth.uid()
);

drop policy if exists review_plan_overrides_delete_teacher
  on public.review_learner_plan_overrides;
create policy review_plan_overrides_delete_teacher
on public.review_learner_plan_overrides for delete
to authenticated
using (public.review_teacher_can_manage(user_id));

drop policy if exists review_assignments_select on public.review_assignments;
create policy review_assignments_select
on public.review_assignments for select
to authenticated
using (
  public.review_teacher_can_manage(student_id)
  or (
    student_id = auth.uid()
    and visible_to_student
    and public.review_student_hub_feature_enabled('homework')
  )
);

drop policy if exists review_assignments_insert_teacher
  on public.review_assignments;
create policy review_assignments_insert_teacher
on public.review_assignments for insert
to authenticated
with check (
  public.review_teacher_can_manage(student_id)
  and assigned_by = auth.uid()
);

drop policy if exists review_assignments_update_teacher
  on public.review_assignments;
create policy review_assignments_update_teacher
on public.review_assignments for update
to authenticated
using (public.review_teacher_can_manage(student_id))
with check (public.review_teacher_can_manage(student_id));

drop policy if exists review_attempts_select on public.review_attempts;
create policy review_attempts_select
on public.review_attempts for select
to authenticated
using (
  (
    user_id = auth.uid()
    and not public.is_review_teacher()
    and public.review_student_hub_feature_enabled('progress')
  )
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_attempts_insert_self on public.review_attempts;
create policy review_attempts_insert_self
on public.review_attempts for insert
to authenticated
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_lesson(lesson_id)
);

drop policy if exists review_attempts_update_self on public.review_attempts;
create policy review_attempts_update_self
on public.review_attempts for update
to authenticated
using (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_lesson(lesson_id)
)
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_lesson(lesson_id)
);

drop policy if exists review_answers_select on public.review_answers;
create policy review_answers_select
on public.review_answers for select
to authenticated
using (
  (
    user_id = auth.uid()
    and not public.is_review_teacher()
    and public.review_student_hub_feature_enabled('progress')
  )
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_answers_insert_self on public.review_answers;
create policy review_answers_insert_self
on public.review_answers for insert
to authenticated
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_question(question_id)
  and exists (
    select 1
    from public.review_attempts attempt
    where attempt.id = review_answers.attempt_id
      and attempt.user_id = auth.uid()
      and attempt.lesson_id = review_answers.lesson_id
  )
);

drop policy if exists review_answers_update_self on public.review_answers;
create policy review_answers_update_self
on public.review_answers for update
to authenticated
using (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_question(question_id)
  and exists (
    select 1
    from public.review_attempts attempt
    where attempt.id = review_answers.attempt_id
      and attempt.user_id = auth.uid()
      and attempt.lesson_id = review_answers.lesson_id
  )
)
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and public.review_can_read_question(question_id)
  and exists (
    select 1
    from public.review_attempts attempt
    where attempt.id = review_answers.attempt_id
      and attempt.user_id = auth.uid()
      and attempt.lesson_id = review_answers.lesson_id
  )
);

drop policy if exists review_speaking_select
  on public.review_speaking_activity;
create policy review_speaking_select
on public.review_speaking_activity for select
to authenticated
using (
  (
    user_id = auth.uid()
    and not public.is_review_teacher()
    and public.review_student_hub_feature_enabled('progress')
  )
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_speaking_insert_self
  on public.review_speaking_activity;
create policy review_speaking_insert_self
on public.review_speaking_activity for insert
to authenticated
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
);

drop policy if exists review_phrase_select
  on public.review_phrase_activity;
create policy review_phrase_select
on public.review_phrase_activity for select
to authenticated
using (
  (
    user_id = auth.uid()
    and not public.is_review_teacher()
    and public.review_student_hub_feature_enabled('progress')
  )
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_phrase_insert_self
  on public.review_phrase_activity;
create policy review_phrase_insert_self
on public.review_phrase_activity for insert
to authenticated
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
);

drop policy if exists review_phrase_update_self
  on public.review_phrase_activity;
create policy review_phrase_update_self
on public.review_phrase_activity for update
to authenticated
using (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
)
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('progress')
  and (lesson_id is null or public.review_can_read_lesson(lesson_id))
);

drop policy if exists review_settings_select on public.review_user_settings;
create policy review_settings_select
on public.review_user_settings for select
to authenticated
using (
  (
    user_id = auth.uid()
    and not public.is_review_teacher()
    and public.review_student_hub_feature_enabled('account_enabled')
  )
  or public.review_teacher_can_manage(user_id)
);

drop policy if exists review_settings_insert_self on public.review_user_settings;
create policy review_settings_insert_self
on public.review_user_settings for insert
to authenticated
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('account_enabled')
);

drop policy if exists review_settings_update_self on public.review_user_settings;
create policy review_settings_update_self
on public.review_user_settings for update
to authenticated
using (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('account_enabled')
)
with check (
  user_id = auth.uid()
  and not public.is_review_teacher()
  and public.review_student_hub_feature_enabled('account_enabled')
);

drop policy if exists review_task_submissions_select
  on public.review_task_submissions;
create policy review_task_submissions_select
on public.review_task_submissions for select
to authenticated
using (
  (
    user_id = auth.uid()
    and public.review_student_hub_feature_enabled('homework')
  )
  or (
    public.review_teacher_can_manage(user_id)
    and status <> 'draft'
  )
);

drop policy if exists review_feedback_select
  on public.review_submission_feedback;
create policy review_feedback_select
on public.review_submission_feedback for select
to authenticated
using (
  exists (
    select 1
    from public.review_task_submissions submission
    where submission.id = submission_id
      and (
        public.review_teacher_can_manage(submission.user_id)
        or (
          submission.user_id = auth.uid()
          and published_at is not null
          and public.review_student_hub_feature_enabled('homework')
        )
      )
  )
);

-- A mapped teacher may read only submitted learner recordings. Learners keep
-- access to their own private folder.
drop policy if exists review_recordings_select on storage.objects;
create policy review_recordings_select
on storage.objects for select
to authenticated
using (
  bucket_id = 'review-premium-recordings'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.review_task_submissions submission
      join public.review_premium_tasks task
        on task.id = submission.task_id
       and task.task_type = 'speaking'
      where submission.audio_object_path = storage.objects.name
        and submission.status <> 'draft'
        and public.review_teacher_can_manage(submission.user_id)
        and cardinality(storage.foldername(storage.objects.name)) = 2
        and (storage.foldername(storage.objects.name))[1]
          = submission.user_id::text
        and (storage.foldername(storage.objects.name))[2]
          = submission.task_id::text
        and storage.filename(storage.objects.name)
          ~ '^[A-Za-z0-9-]+[.](webm|m4a|ogg|mp3)$'
    )
  )
);

-- Extend the audit trail to the established teacher-controlled learner rows.
drop trigger if exists review_memberships_teacher_audit
  on public.review_memberships;
create trigger review_memberships_teacher_audit
after insert or update or delete on public.review_memberships
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_plan_overrides_teacher_audit
  on public.review_learner_plan_overrides;
create trigger review_plan_overrides_teacher_audit
after insert or update or delete on public.review_learner_plan_overrides
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_lesson_overrides_teacher_audit
  on public.review_lesson_access_overrides;
create trigger review_lesson_overrides_teacher_audit
after insert or update or delete on public.review_lesson_access_overrides
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_assignments_teacher_audit
  on public.review_assignments;
create trigger review_assignments_teacher_audit
after insert or update or delete on public.review_assignments
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_task_submissions_teacher_audit
  on public.review_task_submissions;
create trigger review_task_submissions_teacher_audit
after insert or update or delete on public.review_task_submissions
for each row execute function public.review_audit_teacher_change();

drop trigger if exists review_submission_feedback_teacher_audit
  on public.review_submission_feedback;
create trigger review_submission_feedback_teacher_audit
after insert or update or delete on public.review_submission_feedback
for each row execute function public.review_audit_teacher_change();

-- Fail the whole transaction rather than leaving a partial rollout. Teacher
-- identities are deliberately excluded from learner settings/ownership.
do $postcheck$
declare
  missing_settings integer;
  invalid_initial_settings integer;
  missing_owner integer;
  teacher_learner_mappings integer;
  active_teacher_count integer;
begin
  select count(*)
  into missing_settings
  from public.review_profiles profile
  where not exists (
      select 1
      from public.review_teachers teacher
      where teacher.user_id = profile.user_id
        and teacher.active
    )
    and not exists (
      select 1
      from public.review_student_hub_settings settings
      where settings.student_id = profile.user_id
    );
  if missing_settings <> 0 then
    raise exception 'Structured Hub rollout left % learner settings rows missing.', missing_settings;
  end if;

  select count(*)
  into invalid_initial_settings
  from public.review_student_hub_settings settings
  where settings.allowed_level_min <> 1
    or settings.allowed_level_max <> 4
    or cardinality(settings.allowed_levels) <> 0;
  if invalid_initial_settings <> 0 then
    raise exception 'Structured Hub rollout created % learner settings rows outside the Level 1-4 starter range.', invalid_initial_settings;
  end if;

  select count(*)
  into teacher_learner_mappings
  from public.review_teacher_students ownership
  join public.review_teachers teacher_identity
    on teacher_identity.user_id = ownership.student_id
   and teacher_identity.active
  where ownership.active;
  if teacher_learner_mappings <> 0 then
    raise exception 'Structured Hub rollout created % active teacher-as-learner mappings.', teacher_learner_mappings;
  end if;

  select count(*)
  into active_teacher_count
  from public.review_teachers teacher
  where teacher.active;

  -- Complete automatic ownership is safe and required in the current
  -- single-teacher deployment. With multiple teachers, provenance-free learners
  -- intentionally remain unassigned rather than being exposed to a guessed owner.
  if active_teacher_count = 1 then
    select count(*)
    into missing_owner
    from public.review_profiles profile
    where not exists (
        select 1
        from public.review_teachers teacher
        where teacher.user_id = profile.user_id
          and teacher.active
      )
      and not exists (
        select 1
        from public.review_teacher_students ownership
        where ownership.student_id = profile.user_id
          and ownership.active
      );
    if missing_owner <> 0 then
      raise exception 'Structured Hub rollout left % learners without an active teacher owner.', missing_owner;
    end if;
  end if;
end
$postcheck$;

commit;
