-- Question-level Free / Standard / Premium access controls.
--
-- Locked answer payloads must never be sent to an ineligible learner. A
-- separate teaser view exposes only safe metadata for questions configured as
-- "blur"; questions configured as "hidden" do not appear at all.

alter table public.review_questions
  add column if not exists required_plan text not null default 'free'
    check (required_plan in ('free', 'standard', 'premium')),
  add column if not exists locked_display text not null default 'blur'
    check (locked_display in ('blur', 'hidden'));

comment on column public.review_questions.required_plan is
  'Minimum learner tier for this question. Free still follows the parent lesson access rule.';

comment on column public.review_questions.locked_display is
  'For an ineligible learner, show a payload-free teaser or hide the question completely.';

create or replace function public.review_has_active_plan_membership()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.review_memberships m
      where m.user_id = auth.uid()
        and m.status = 'active'
        and m.starts_at <= now()
        and m.expires_at > now()
    );
$$;

revoke all on function public.review_has_active_plan_membership() from public;
grant execute on function public.review_has_active_plan_membership() to anon, authenticated;

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
      and (
        public.is_review_teacher()
        or q.required_plan = 'free'
        or (
          public.review_has_active_plan_membership()
          and (
            q.required_plan = 'standard'
            or (
              q.required_plan = 'premium'
              and public.review_effective_plan() = 'premium'
            )
          )
        )
      )
  );
$$;

revoke all on function public.review_can_read_question(uuid) from public;
grant execute on function public.review_can_read_question(uuid) to anon, authenticated;

drop policy if exists review_questions_select_catalog on public.review_questions;
create policy review_questions_select_catalog
on public.review_questions for select
to anon, authenticated
using (public.review_can_read_question(id));

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
  q.points,
  q.required_plan,
  q.locked_display
from public.review_questions q
join public.review_lessons l on l.id = q.lesson_id
where q.active
  and q.required_plan = 'free'
  and l.status = 'published'
  and l.audience in ('general', 'both')
  and l.is_preview;

comment on view public.review_public_questions is
  'Learner-safe full payloads for active Free questions in published preview lessons.';

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
  and q.required_plan in ('standard', 'premium')
  and q.locked_display = 'blur'
  and public.review_can_read_lesson(q.lesson_id)
  and not public.review_can_read_question(q.id);

comment on view public.review_question_teasers is
  'Payload-free metadata for plan-locked questions configured as blur teasers. Never exposes prompts, choices, hints, explanations or answers.';

revoke all on public.review_public_questions from public, anon, authenticated;
grant select on public.review_public_questions to anon, authenticated;

revoke all on public.review_question_teasers from public, anon, authenticated;
grant select on public.review_question_teasers to anon, authenticated;
