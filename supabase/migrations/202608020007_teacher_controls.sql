-- Teacher Studio: per-learner lesson locks and deliberately safe hard deletion.
-- Passwords remain exclusively in Supabase Auth and are never exposed here.

create table if not exists public.review_lesson_access_overrides (
  lesson_id uuid not null references public.review_lessons(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  access_mode text not null default 'block'
    check (access_mode in ('allow', 'block')),
  note text check (note is null or length(note) <= 500),
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (lesson_id, student_id)
);

create index if not exists review_lesson_access_overrides_student_idx
  on public.review_lesson_access_overrides (student_id, access_mode, lesson_id);

drop trigger if exists review_lesson_access_overrides_updated_at
  on public.review_lesson_access_overrides;
create trigger review_lesson_access_overrides_updated_at
before update on public.review_lesson_access_overrides
for each row execute function public.review_set_updated_at();

alter table public.review_lesson_access_overrides enable row level security;

drop policy if exists review_lesson_access_overrides_select
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_select
on public.review_lesson_access_overrides for select
to authenticated
using (student_id = auth.uid() or public.is_review_teacher());

drop policy if exists review_lesson_access_overrides_insert_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_insert_teacher
on public.review_lesson_access_overrides for insert
to authenticated
with check (public.is_review_teacher() and updated_by = auth.uid());

drop policy if exists review_lesson_access_overrides_update_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_update_teacher
on public.review_lesson_access_overrides for update
to authenticated
using (public.is_review_teacher())
with check (public.is_review_teacher() and updated_by = auth.uid());

drop policy if exists review_lesson_access_overrides_delete_teacher
  on public.review_lesson_access_overrides;
create policy review_lesson_access_overrides_delete_teacher
on public.review_lesson_access_overrides for delete
to authenticated
using (public.is_review_teacher());

revoke all on public.review_lesson_access_overrides from anon, authenticated;
grant select, insert, update, delete
  on public.review_lesson_access_overrides to authenticated;

create or replace function public.review_lesson_access_mode(check_lesson uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select o.access_mode
  from public.review_lesson_access_overrides o
  where o.lesson_id = check_lesson
    and o.student_id = auth.uid()
  limit 1;
$$;

revoke all on function public.review_lesson_access_mode(uuid) from public;
grant execute on function public.review_lesson_access_mode(uuid) to anon, authenticated;

-- A teacher can lock one published lesson for one signed-in learner. Removing
-- that override returns the lesson to the normal membership/audience rules.
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
          coalesce(public.review_lesson_access_mode(l.id), 'allow') <> 'block'
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
    and coalesce(public.review_lesson_access_mode(id), 'allow') <> 'block'
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
);

-- Hard deletion is intentionally narrower than archiving. It only succeeds
-- for an already archived lesson with no learner records, and requires the
-- exact phrase "DELETE <slug>". This protects scores and feedback history.
create or replace function public.review_permanently_delete_lesson(
  lesson_to_delete uuid,
  confirmation_text text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target public.review_lessons%rowtype;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;

  select * into target
  from public.review_lessons
  where id = lesson_to_delete;

  if not found then
    raise exception 'Lesson not found.';
  end if;
  if target.status <> 'archived' then
    raise exception 'Archive the lesson before permanent deletion.';
  end if;
  if confirmation_text <> ('DELETE ' || target.slug) then
    raise exception 'The deletion confirmation did not match.';
  end if;
  if exists (select 1 from public.review_assignments where lesson_id = target.id)
     or exists (select 1 from public.review_attempts where lesson_id = target.id)
     or exists (select 1 from public.review_answers where lesson_id = target.id)
     or exists (select 1 from public.review_speaking_activity where lesson_id = target.id) then
    raise exception 'This lesson has learner history and cannot be permanently deleted. Keep it archived.';
  end if;

  delete from public.review_lessons where id = target.id;
  return true;
end;
$$;

revoke all on function public.review_permanently_delete_lesson(uuid, text) from public;
grant execute on function public.review_permanently_delete_lesson(uuid, text) to authenticated;
