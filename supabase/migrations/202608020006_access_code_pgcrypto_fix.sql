-- Make the access-code functions resolve Supabase's pgcrypto extension explicitly.
-- This fixes hosted projects where extensions is not in the function search path.

create extension if not exists pgcrypto with schema extensions;

do $$
begin
  perform extensions.digest('review-hub-health-check', 'sha256');
  perform extensions.gen_random_bytes(1);
end;
$$;

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
  if code_max_uses < 1 or code_max_uses > 1000 then
    raise exception 'Maximum uses must be between 1 and 1000.';
  end if;

  raw_code := 'TEC-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));
  insert into public.review_access_codes (
    label, code_hash, code_last4, duration_days, access_scope,
    max_uses, valid_until, created_by
  ) values (
    btrim(code_label),
    encode(extensions.digest(raw_code, 'sha256'), 'hex'),
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
