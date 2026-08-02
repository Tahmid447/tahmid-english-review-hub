-- Review Hub membership, learner profiles, preview access and manual approvals.
-- Passwords remain entirely inside Supabase Auth and are never copied here.

alter table public.review_profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists contact_email text,
  add column if not exists age_group text,
  add column if not exists native_language text,
  add column if not exists english_level text,
  add column if not exists learning_goal text;

alter table public.review_lessons
  add column if not exists is_preview boolean not null default false;

-- Keep two genuinely useful lessons available before membership approval.
update public.review_lessons
set is_preview = slug in ('june-28', 'june-29');

create table if not exists public.review_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'expired', 'suspended', 'cancelled')),
  access_scope text not null default 'general'
    check (access_scope in ('general', 'takiwaki', 'both')),
  plan_label text not null default 'Awaiting approval',
  starts_at timestamptz,
  expires_at timestamptz,
  approval_source text not null default 'manual'
    check (approval_source in ('manual', 'access_code', 'complimentary')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  notes text check (notes is null or length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or starts_at is null or expires_at > starts_at)
);

create index if not exists review_memberships_status_expiry_idx
  on public.review_memberships (status, expires_at);

create table if not exists public.review_access_codes (
  id uuid primary key default gen_random_uuid(),
  label text not null check (length(btrim(label)) between 1 and 100),
  code_hash text not null unique,
  code_last4 text not null check (length(code_last4) = 4),
  duration_days integer not null check (duration_days between 1 and 730),
  access_scope text not null default 'general'
    check (access_scope in ('general', 'takiwaki', 'both')),
  max_uses integer not null default 1 check (max_uses between 1 and 1000),
  use_count integer not null default 0 check (use_count >= 0 and use_count <= max_uses),
  enabled boolean not null default true,
  valid_until timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.review_access_code_redemptions (
  code_id uuid not null references public.review_access_codes(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (code_id, user_id)
);

drop trigger if exists review_memberships_updated_at on public.review_memberships;
create trigger review_memberships_updated_at
before update on public.review_memberships
for each row execute function public.review_set_updated_at();

create or replace function public.review_create_membership_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.review_memberships (user_id, status, access_scope, plan_label)
  values (new.user_id, 'pending', 'general', 'Awaiting teacher approval')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.review_create_membership_for_profile() from public;

drop trigger if exists review_profile_membership_created on public.review_profiles;
create trigger review_profile_membership_created
after insert on public.review_profiles
for each row execute function public.review_create_membership_for_profile();

-- Backfill membership rows for existing Review Hub learners.
insert into public.review_memberships (
  user_id, status, access_scope, plan_label, starts_at, expires_at,
  approval_source, approved_at
)
select
  p.user_id,
  case when p.access_scope = 'takiwaki' then 'active' else 'pending' end,
  case when p.access_scope = 'takiwaki' then 'takiwaki' else 'general' end,
  case when p.access_scope = 'takiwaki' then 'Private learner access' else 'Awaiting teacher approval' end,
  case when p.access_scope = 'takiwaki' then now() else null end,
  case when p.access_scope = 'takiwaki' then now() + interval '365 days' else null end,
  'manual',
  case when p.access_scope = 'takiwaki' then now() else null end
from public.review_profiles p
on conflict (user_id) do nothing;

create or replace function public.review_has_active_membership(requested_scope text default 'general')
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_review_teacher()
    or (
      auth.uid() is not null
      and exists (
        select 1
        from public.review_memberships m
        where m.user_id = auth.uid()
          and m.status = 'active'
          and m.starts_at <= now()
          and m.expires_at > now()
          and (
            m.access_scope = 'both'
            or m.access_scope = requested_scope
          )
      )
    );
$$;

revoke all on function public.review_has_active_membership(text) from public;
grant execute on function public.review_has_active_membership(text) to anon, authenticated;

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
          and (l.is_preview or public.review_has_active_membership('general'))
        )
        or (
          l.audience in ('takiwaki', 'both')
          and public.review_has_active_membership('takiwaki')
          and exists (
            select 1 from public.review_profiles p
            where p.user_id = auth.uid()
              and p.access_scope = 'takiwaki'
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_lesson(uuid) from public;
grant execute on function public.review_can_read_lesson(uuid) to anon, authenticated;

drop policy if exists review_lessons_select_catalog on public.review_lessons;
create policy review_lessons_select_catalog
on public.review_lessons for select
to anon, authenticated
using (
  public.is_review_teacher()
  or (
    status = 'published'
    and audience in ('general', 'both')
    and (is_preview or public.review_has_active_membership('general'))
  )
  or (
    status = 'published'
    and audience in ('takiwaki', 'both')
    and public.review_has_active_membership('takiwaki')
    and exists (
      select 1 from public.review_profiles p
      where p.user_id = auth.uid()
        and p.access_scope = 'takiwaki'
    )
  )
);

alter table public.review_memberships enable row level security;
alter table public.review_access_codes enable row level security;
alter table public.review_access_code_redemptions enable row level security;

drop policy if exists review_memberships_select on public.review_memberships;
create policy review_memberships_select
on public.review_memberships for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_memberships_update_teacher on public.review_memberships;
create policy review_memberships_update_teacher
on public.review_memberships for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

create or replace function public.review_approve_membership(
  learner_id uuid,
  duration_days integer,
  membership_scope text default 'general'
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
  insert into public.review_memberships (
    user_id, status, access_scope, plan_label, starts_at, expires_at,
    approval_source, approved_by, approved_at
  ) values (
    learner_id, 'active', membership_scope, duration_days || '-day manual approval',
    now(), now() + make_interval(days => duration_days),
    'manual', auth.uid(), now()
  )
  on conflict (user_id) do update set
    status = 'active',
    access_scope = excluded.access_scope,
    plan_label = excluded.plan_label,
    starts_at = excluded.starts_at,
    expires_at = excluded.expires_at,
    approval_source = 'manual',
    approved_by = auth.uid(),
    approved_at = now(),
    updated_at = now()
  returning * into approved;

  if membership_scope in ('takiwaki', 'both') then
    update public.review_profiles set access_scope = 'takiwaki' where user_id = learner_id;
  end if;
  return approved;
end;
$$;

revoke all on function public.review_approve_membership(uuid, integer, text) from public;
grant execute on function public.review_approve_membership(uuid, integer, text) to authenticated;

drop policy if exists review_codes_teacher_select on public.review_access_codes;
create policy review_codes_teacher_select
on public.review_access_codes for select
to authenticated
using (public.is_review_teacher());

drop policy if exists review_codes_teacher_update on public.review_access_codes;
create policy review_codes_teacher_update
on public.review_access_codes for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher());

drop policy if exists review_redemptions_select on public.review_access_code_redemptions;
create policy review_redemptions_select
on public.review_access_code_redemptions for select
to authenticated
using (user_id = auth.uid() or public.is_review_teacher());

create or replace function public.review_create_access_code(
  code_label text,
  code_duration_days integer,
  code_scope text default 'general',
  code_max_uses integer default 1,
  code_valid_until timestamptz default null
)
returns table (access_code text, code_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
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
  raw_code := 'TEC-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 12));
  insert into public.review_access_codes (
    label, code_hash, code_last4, duration_days, access_scope,
    max_uses, valid_until, created_by
  ) values (
    btrim(code_label),
    encode(digest(raw_code, 'sha256'), 'hex'),
    right(raw_code, 4),
    code_duration_days,
    code_scope,
    code_max_uses,
    code_valid_until,
    auth.uid()
  ) returning id into new_id;
  return query select raw_code, new_id;
end;
$$;

revoke all on function public.review_create_access_code(text, integer, text, integer, timestamptz) from public;
grant execute on function public.review_create_access_code(text, integer, text, integer, timestamptz) to authenticated;

create or replace function public.review_redeem_access_code(raw_code text)
returns table (membership_status text, membership_scope text, membership_expires_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
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
  where c.code_hash = encode(digest(upper(btrim(raw_code)), 'sha256'), 'hex')
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
    user_id, status, access_scope, plan_label, starts_at, expires_at,
    approval_source, approved_at
  ) values (
    auth.uid(), 'active', matched.access_scope, matched.label,
    now(), next_expiry, 'access_code', now()
  )
  on conflict (user_id) do update set
    status = 'active',
    access_scope = excluded.access_scope,
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

-- Update the auth trigger so email sign-up metadata becomes a teacher-readable
-- learning profile. Google users are safely completed by the client after OAuth.
create or replace function public.review_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(new.raw_app_meta_data ->> 'app', '') <> 'review_hub'
     and coalesce(new.raw_user_meta_data ->> 'app', '') <> 'review_hub'
  then
    return new;
  end if;

  insert into public.review_profiles (
    user_id, display_name, first_name, last_name, contact_email,
    age_group, native_language, english_level, learning_goal
  ) values (
    new.id,
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    new.email,
    nullif(new.raw_user_meta_data ->> 'age_group', ''),
    nullif(new.raw_user_meta_data ->> 'native_language', ''),
    nullif(new.raw_user_meta_data ->> 'english_level', ''),
    nullif(new.raw_user_meta_data ->> 'learning_goal', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Anonymous catalogue shows every published title, but only two preview
-- lessons expose complete guide content and questions.
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
  (select count(*)::integer from public.review_questions q where q.lesson_id = l.id and q.active) as question_count
from public.review_lessons l
where l.status = 'published'
  and l.audience in ('general', 'both');

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
  and l.audience in ('general', 'both')
  and l.is_preview;

revoke all on public.review_memberships from anon, authenticated;
grant select, update on public.review_memberships to authenticated;

revoke all on public.review_access_codes from anon, authenticated;
grant select, update on public.review_access_codes to authenticated;

revoke all on public.review_access_code_redemptions from anon, authenticated;
grant select on public.review_access_code_redemptions to authenticated;

revoke all on public.review_profiles from anon, authenticated;
grant select on public.review_profiles to authenticated;
grant insert (
  user_id, display_name, avatar_url, locale, first_name, last_name,
  contact_email, age_group, native_language, english_level, learning_goal
) on public.review_profiles to authenticated;
grant update (
  display_name, avatar_url, locale, first_name, last_name,
  contact_email, age_group, native_language, english_level, learning_goal, updated_at
) on public.review_profiles to authenticated;

revoke all on public.review_public_lessons from public, anon, authenticated;
grant select on public.review_public_lessons to anon, authenticated;
revoke all on public.review_public_questions from public, anon, authenticated;
grant select on public.review_public_questions to anon, authenticated;
