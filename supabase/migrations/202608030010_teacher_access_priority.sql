-- Teacher learner-specific access exceptions must take priority over the
-- ordinary preview, audience and membership-plan rules. A block still wins
-- over everything; an explicit allow grants this signed-in learner access to
-- the published lesson.

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
        or public.review_lesson_access_mode(l.id) = 'allow'
        or (
          coalesce(public.review_lesson_access_mode(l.id), 'inherit') <> 'block'
          and (
            (
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
    and (
      public.review_lesson_access_mode(id) = 'allow'
      or (
        coalesce(public.review_lesson_access_mode(id), 'inherit') <> 'block'
        and (
          (
            audience in ('general', 'both')
            and (is_preview or public.review_has_active_membership('general'))
          )
          or (
            audience in ('takiwaki', 'both')
            and public.review_has_active_membership('takiwaki')
            and exists (
              select 1 from public.review_profiles p
              where p.user_id = auth.uid()
                and p.access_scope = 'takiwaki'
            )
          )
        )
      )
    )
  )
);

comment on function public.review_can_read_lesson(uuid) is
  'Checks published lesson access. Teacher allow/block overrides take priority over normal audience and membership rules.';
