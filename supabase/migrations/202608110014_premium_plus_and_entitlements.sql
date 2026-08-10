-- Four-tier entitlement model: Free, Standard, Premium and Premium+.
-- Existing Standard/Premium memberships and overrides remain valid.

do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.review_plan_catalog'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%plan_key%'
  loop
    execute format(
      'alter table public.review_plan_catalog drop constraint %I',
      constraint_row.conname
    );
  end loop;
end;
$$;

alter table public.review_plan_catalog
  add constraint review_plan_catalog_plan_key_check
  check (plan_key in ('free', 'standard', 'premium', 'premium_plus'));

insert into public.review_plan_catalog (
  plan_key, name_en, name_ja, description_en, description_ja,
  entitlements, display_order, active
)
values
  (
    'free', 'Free', '無料',
    'Two complete sample lessons and safe previews of plan-only practice.',
    '完成版サンプルレッスン2つと、プラン限定練習の安全なプレビューを利用できます。',
    '{
      "core_lessons": false,
      "phrase_library": false,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": false,
      "premium_image_missions": false,
      "speaking_submission": false,
      "essay_submission": false,
      "live_coaching": false,
      "monthly_progress_note": false
    }'::jsonb,
    0, true
  ),
  (
    'standard', 'Standard', 'スタンダード',
    'The complete self-study Review Hub.',
    'Review Hubをすべて使える自習プランです。',
    '{
      "core_lessons": true,
      "phrase_library": true,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": false,
      "premium_image_missions": false,
      "speaking_submission": false,
      "essay_submission": false,
      "live_coaching": false,
      "monthly_progress_note": false
    }'::jsonb,
    10, true
  ),
  (
    'premium', 'Premium', 'プレミアム',
    'Standard plus teacher-reviewed speaking and writing.',
    'Standardに先生のスピーキング・英作文添削を追加します。',
    '{
      "core_lessons": true,
      "phrase_library": true,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": true,
      "premium_image_missions": true,
      "speaking_submission": true,
      "essay_submission": true,
      "live_coaching": false,
      "monthly_progress_note": false
    }'::jsonb,
    20, true
  ),
  (
    'premium_plus', 'Premium+', 'プレミアムプラス',
    'Premium plus three live coaching lessons each month and a progress note.',
    'Premiumに月3回のライブ個人レッスンと毎月の進捗レポートを追加します。',
    '{
      "core_lessons": true,
      "phrase_library": true,
      "image_practice": true,
      "progress_history": true,
      "teacher_review": true,
      "premium_image_missions": true,
      "speaking_submission": true,
      "essay_submission": true,
      "live_coaching": true,
      "monthly_progress_note": true
    }'::jsonb,
    30, true
  )
on conflict (plan_key) do update set
  name_en = excluded.name_en,
  name_ja = excluded.name_ja,
  description_en = excluded.description_en,
  description_ja = excluded.description_ja,
  entitlements = excluded.entitlements,
  display_order = excluded.display_order,
  active = excluded.active,
  updated_at = now();

do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.review_questions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%required_plan%'
  loop
    execute format(
      'alter table public.review_questions drop constraint %I',
      constraint_row.conname
    );
  end loop;
end;
$$;

alter table public.review_questions
  add constraint review_questions_required_plan_check
  check (required_plan in ('free', 'standard', 'premium', 'premium_plus'));

create or replace function public.review_plan_rank(plan_key text)
returns integer
language sql
immutable
set search_path = public, pg_temp
as $$
  select case lower(coalesce(plan_key, 'free'))
    when 'premium_plus' then 30
    when 'premium' then 20
    when 'standard' then 10
    else 0
  end;
$$;

revoke all on function public.review_plan_rank(text) from public;
grant execute on function public.review_plan_rank(text) to anon, authenticated;

create or replace function public.review_effective_plan()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when public.is_review_teacher() then 'premium_plus'
    when auth.uid() is null then 'free'
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
    or public.review_plan_rank(public.review_effective_plan())
       >= public.review_plan_rank(required_plan);
$$;

revoke all on function public.review_plan_meets_requirement(text) from public;
grant execute on function public.review_plan_meets_requirement(text) to anon, authenticated;

create or replace function public.review_can_read_question(check_question uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.review_questions q
    where q.id = check_question
      and q.active
      and public.review_can_read_lesson(q.lesson_id)
      and public.review_plan_meets_requirement(q.required_plan)
  );
$$;

revoke all on function public.review_can_read_question(uuid) from public;
grant execute on function public.review_can_read_question(uuid) to anon, authenticated;

create or replace view public.review_question_teasers
with (security_barrier = true)
as
select
  q.id,
  q.lesson_id,
  q.position,
  q.section,
  q.format,
  q.required_plan
from public.review_questions q
where q.active
  and q.required_plan in ('standard', 'premium', 'premium_plus')
  and q.locked_display = 'blur'
  and public.review_can_read_lesson(q.lesson_id)
  and not public.review_can_read_question(q.id);

revoke all on public.review_question_teasers from public, anon, authenticated;
grant select on public.review_question_teasers to anon, authenticated;

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
  membership_label text;
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
  if membership_plan not in ('standard', 'premium', 'premium_plus') then
    raise exception 'Invalid membership plan.';
  end if;
  membership_label := case membership_plan
    when 'premium_plus' then 'Premium+'
    when 'premium' then 'Premium'
    else 'Standard'
  end;

  insert into public.review_memberships (
    user_id, status, access_scope, plan_tier, plan_label,
    starts_at, expires_at, approval_source, approved_by, approved_at
  ) values (
    learner_id, 'active', membership_scope, membership_plan,
    membership_label || ' · ' || duration_days || ' days',
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

revoke all on function public.review_approve_membership_tiered(uuid, integer, text, text) from public;
grant execute on function public.review_approve_membership_tiered(uuid, integer, text, text) to authenticated;

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
  if not public.is_review_teacher() then raise exception 'Teacher authorisation is required.'; end if;
  if code_duration_days < 1 or code_duration_days > 730 then raise exception 'Duration must be between 1 and 730 days.'; end if;
  if code_scope not in ('general', 'takiwaki', 'both') then raise exception 'Invalid access scope.'; end if;
  if code_plan not in ('standard', 'premium', 'premium_plus') then raise exception 'Invalid membership plan.'; end if;
  if code_max_uses < 1 or code_max_uses > 1000 then raise exception 'Maximum uses must be between 1 and 1000.'; end if;

  raw_code := 'TEC-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));
  insert into public.review_access_codes (
    label, code_hash, code_last4, duration_days, access_scope,
    plan_tier, max_uses, valid_until, created_by
  ) values (
    btrim(code_label),
    encode(extensions.digest(raw_code, 'sha256'), 'hex'),
    right(raw_code, 4),
    code_duration_days, code_scope, code_plan, code_max_uses,
    code_valid_until, auth.uid()
  ) returning id into new_id;

  return query select raw_code, new_id;
end;
$$;

revoke all on function public.review_create_access_code_tiered(text, integer, text, text, integer, timestamptz) from public;
grant execute on function public.review_create_access_code_tiered(text, integer, text, text, integer, timestamptz) to authenticated;

comment on function public.review_effective_plan() is
  'Resolves teacher override, learner override, active membership, then Free in deterministic priority order.';
