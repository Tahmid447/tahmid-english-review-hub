-- Per-category progression, personal learning packs and private assignments.
-- Forward-only from 024/025. Additive schema; no existing content or history is
-- deleted or reseeded. Empty category_access preserves the saved legacy scope.
-- Replay is safe: guarded ADD COLUMN, CREATE IF NOT EXISTS and replaced helpers.
begin;

create or replace function public.review_valid_category_access(value jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare category record; rule record; entry jsonb;
begin
  if value is null or jsonb_typeof(value) <> 'object' then return false; end if;
  for category in select * from jsonb_each(value) loop
    if category.key not in ('words', 'phrases', 'phonics')
      or jsonb_typeof(category.value) <> 'object' then return false; end if;
    if not (category.value ?& array['min','max','unlock','lock']) then return false; end if;
    for rule in select * from jsonb_each(category.value) loop
      if rule.key in ('min','max') then
        if jsonb_typeof(rule.value) <> 'number' or rule.value::text !~ '^[0-9]+$'
          or rule.value::text::integer not between 1 and 32 then return false; end if;
      elsif rule.key in ('unlock','lock') then
        if jsonb_typeof(rule.value) <> 'array' or jsonb_array_length(rule.value) > 32 then return false; end if;
        for entry in select * from jsonb_array_elements(rule.value) loop
          if jsonb_typeof(entry) <> 'number' or entry::text !~ '^[0-9]+$'
            or entry::text::integer not between 1 and 32 then return false; end if;
        end loop;
      else return false;
      end if;
    end loop;
    if (category.value->>'min')::integer > (category.value->>'max')::integer then return false; end if;
  end loop;
  return true;
exception when others then return false;
end;
$$;
revoke all on function public.review_valid_category_access(jsonb) from public;
grant execute on function public.review_valid_category_access(jsonb) to authenticated;

alter table public.review_student_hub_settings
  add column if not exists category_access jsonb not null default '{}'::jsonb
    check (public.review_valid_category_access(category_access));
comment on column public.review_student_hub_settings.category_access is
  'Optional category rules {words:{min:1,max:4,unlock:[8],lock:[2]}}. Missing category inherits legacy scope. Lock wins over unlock. Item exceptions and active personal packs may extend level scope.';

create or replace function public.review_student_curriculum_scope_allowed(
  check_category text, check_level integer
)
returns boolean language sql stable security definer set search_path = '' as $$
  select check_level between 1 and 32
    and public.review_student_curriculum_category_enabled(check_category)
    and coalesce((
      select case when settings.category_access ? check_category then
        not ((settings.category_access -> check_category -> 'lock') @> to_jsonb(array[check_level]))
        and (
          check_level between (settings.category_access -> check_category ->> 'min')::integer
                          and (settings.category_access -> check_category ->> 'max')::integer
          or (settings.category_access -> check_category -> 'unlock') @> to_jsonb(array[check_level])
        )
      else
        check_level between settings.allowed_level_min and settings.allowed_level_max
        and (cardinality(settings.allowed_levels) = 0 or check_level = any(settings.allowed_levels))
      end
      from public.review_student_hub_settings settings
      where settings.student_id = auth.uid()
    ), false);
$$;
revoke all on function public.review_student_curriculum_scope_allowed(text, integer) from public;
grant execute on function public.review_student_curriculum_scope_allowed(text, integer) to authenticated;

create table if not exists public.review_student_learning_packs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.review_profiles(user_id) on delete cascade,
  teacher_id uuid not null references public.review_teachers(user_id) on delete restrict,
  title text not null check (length(btrim(title)) between 1 and 160),
  instructions text not null default '' check (length(instructions) <= 2000),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.review_student_learning_pack_items (
  pack_id uuid not null references public.review_student_learning_packs(id) on delete restrict,
  item_id text not null references public.review_curriculum_items(id) on update cascade on delete restrict,
  position integer not null check (position between 0 and 479),
  primary key (pack_id, item_id)
);
create index if not exists review_learning_packs_student_idx
  on public.review_student_learning_packs(student_id, active, created_at desc);
create index if not exists review_learning_pack_items_item_idx
  on public.review_student_learning_pack_items(item_id, pack_id);
alter table public.review_student_learning_packs enable row level security;
alter table public.review_student_learning_pack_items enable row level security;
revoke all on public.review_student_learning_packs from anon, authenticated;
revoke all on public.review_student_learning_pack_items from anon, authenticated;
grant select on public.review_student_learning_packs, public.review_student_learning_pack_items to authenticated;

create or replace function public.review_student_has_pack_item(check_item text)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null
    and public.review_student_hub_feature_enabled('account_enabled')
    and exists (
      select 1 from public.review_student_learning_packs pack
      join public.review_student_learning_pack_items entry on entry.pack_id = pack.id
      where pack.student_id = auth.uid() and pack.active and entry.item_id = check_item
    );
$$;
revoke all on function public.review_student_has_pack_item(text) from public;
grant execute on function public.review_student_has_pack_item(text) to authenticated;

create or replace function public.review_student_has_pack_level(check_category text, check_level integer)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.review_student_learning_packs pack
    join public.review_student_learning_pack_items entry on entry.pack_id = pack.id
    join public.review_curriculum_items item on item.id = entry.item_id
    where pack.student_id = auth.uid() and pack.active and item.active
      and item.category = check_category and item.level = check_level
  );
$$;
revoke all on function public.review_student_has_pack_level(text, integer) from public;
grant execute on function public.review_student_has_pack_level(text, integer) to authenticated;

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
            or public.review_student_has_pack_level(check_category, check_level)
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
            or public.review_student_has_pack_item(item.id)
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


create or replace function public.review_can_read_learning_pack(check_pack uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.review_student_learning_packs pack
    where pack.id = check_pack and (
      public.review_teacher_can_manage(pack.student_id)
      or (pack.student_id = auth.uid() and pack.active
        and public.review_student_hub_feature_enabled('account_enabled')
        and exists (select 1 from public.review_student_learning_pack_items entry
          where entry.pack_id = pack.id and public.review_can_read_curriculum_item(entry.item_id)))
    )
  );
$$;
revoke all on function public.review_can_read_learning_pack(uuid) from public;
grant execute on function public.review_can_read_learning_pack(uuid) to authenticated;
drop policy if exists review_learning_packs_select on public.review_student_learning_packs;
create policy review_learning_packs_select on public.review_student_learning_packs
  for select to authenticated using (public.review_can_read_learning_pack(id));
drop policy if exists review_learning_pack_items_select on public.review_student_learning_pack_items;
create policy review_learning_pack_items_select on public.review_student_learning_pack_items
  for select to authenticated using (
    public.review_can_read_learning_pack(pack_id)
    and public.review_can_read_curriculum_item(item_id)
  );

create or replace function public.review_assign_learning_pack(
  target_student uuid, pack_title text, pack_instructions text, item_ids text[]
)
returns public.review_student_learning_packs
language plpgsql security definer set search_path = '' as $$
declare saved public.review_student_learning_packs%rowtype; valid_count integer;
begin
  if not public.review_teacher_can_manage(target_student) then
    raise exception 'This learner is not assigned to the signed-in teacher.';
  end if;
  if pack_title is null or length(btrim(pack_title)) not between 1 and 160
    or length(coalesce(pack_instructions, '')) > 2000 then raise exception 'Add a valid pack title and instructions.'; end if;
  if item_ids is null or cardinality(item_ids) not between 1 and 480 then
    raise exception 'Choose between 1 and 480 published learning items.';
  end if;
  select count(distinct item.id) into valid_count
  from public.review_curriculum_items item
  join public.review_curriculum_levels level on level.category = item.category and level.level = item.level
  where item.id = any(item_ids) and item.active and level.active;
  if valid_count <> cardinality(item_ids) then raise exception 'Every pack item must be unique and published.'; end if;
  insert into public.review_student_learning_packs(student_id, teacher_id, title, instructions)
  values(target_student, auth.uid(), btrim(pack_title), coalesce(pack_instructions, '')) returning * into saved;
  insert into public.review_student_learning_pack_items(pack_id, item_id, position)
    select saved.id, value, (ordinality - 1)::integer from unnest(item_ids) with ordinality as entry(value, ordinality);
  return saved;
end;
$$;
revoke all on function public.review_assign_learning_pack(uuid, text, text, text[]) from public;
grant execute on function public.review_assign_learning_pack(uuid, text, text, text[]) to authenticated;

create or replace function public.review_set_learning_pack_active(target_pack uuid, next_active boolean)
returns public.review_student_learning_packs
language plpgsql security definer set search_path = '' as $$
declare saved public.review_student_learning_packs%rowtype;
begin
  select * into saved from public.review_student_learning_packs where id = target_pack for update;
  if saved.id is null or not public.review_teacher_can_manage(saved.student_id) then
    raise exception 'This learning pack is not assigned to the signed-in teacher.';
  end if;
  if next_active is null then raise exception 'Choose whether the pack is active.'; end if;
  update public.review_student_learning_packs set active = next_active, updated_at = now()
    where id = target_pack returning * into saved;
  return saved;
end;
$$;
revoke all on function public.review_set_learning_pack_active(uuid, boolean) from public;
grant execute on function public.review_set_learning_pack_active(uuid, boolean) to authenticated;
drop trigger if exists review_learning_pack_audit on public.review_student_learning_packs;
create trigger review_learning_pack_audit after insert or update on public.review_student_learning_packs
for each row execute function public.review_audit_teacher_change();

-- A published personal lesson must not become available to every paid member.
alter table public.review_lessons add column if not exists assignment_only boolean not null default false;
-- A teacher's shared catalogue access must not expose another teacher's
-- learner-specific lesson. Existing assignments survive ownership transfers.
create or replace function public.review_teacher_can_read_private_lesson(check_lesson uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and public.is_review_teacher() and exists (
    select 1 from public.review_lessons lesson where lesson.id = check_lesson and (
      lesson.created_by = auth.uid()
      or exists (
        select 1 from public.review_assignments assignment
        where assignment.lesson_id = lesson.id
          and public.review_teacher_can_manage(assignment.student_id)
      )
    )
  );
$$;
revoke all on function public.review_teacher_can_read_private_lesson(uuid) from public;
grant execute on function public.review_teacher_can_read_private_lesson(uuid) to authenticated;

create or replace function public.review_can_read_assigned_lesson(check_lesson uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select (public.is_review_teacher() and public.review_teacher_can_read_private_lesson(check_lesson)) or (
    not public.is_review_teacher() and auth.uid() is not null and public.review_student_hub_feature_enabled('account_enabled')
    and coalesce(public.review_lesson_access_mode(check_lesson), 'inherit') <> 'block'
    and (
      (public.review_student_hub_feature_enabled('review_lessons') and public.review_lesson_access_mode(check_lesson) = 'allow')
      or (public.review_student_hub_feature_enabled('homework') and exists (
        select 1 from public.review_assignments assignment
        where assignment.student_id = auth.uid() and assignment.lesson_id = check_lesson
          and assignment.status <> 'dismissed' and assignment.visible_to_student
          and (assignment.opens_at is null or assignment.opens_at <= now())
          and (assignment.closes_at is null or assignment.closes_at > now())
          and public.review_plan_meets_requirement(assignment.required_plan)
      ))
    )
  );
$$;
revoke all on function public.review_can_read_assigned_lesson(uuid) from public;
grant execute on function public.review_can_read_assigned_lesson(uuid) to anon, authenticated;

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
      and (not lesson.assignment_only or public.review_can_read_assigned_lesson(lesson.id))
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


-- These owner-executed public views bypass base-table RLS. Their predicates
-- must therefore enforce the same learner switches and private lesson boundary.
create or replace function public.review_can_read_catalog_lesson(check_lesson uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.review_lessons lesson
    where lesson.id = check_lesson and lesson.status = 'published'
      and lesson.audience in ('general','both')
      and (not lesson.assignment_only or public.review_can_read_assigned_lesson(lesson.id))
      and (auth.uid() is null or public.is_review_teacher() or (
        public.review_student_hub_feature_enabled('review_lessons')
        and coalesce(public.review_lesson_access_mode(lesson.id), 'inherit') <> 'block'
      ))
  );
$$;
revoke all on function public.review_can_read_catalog_lesson(uuid) from public;
grant execute on function public.review_can_read_catalog_lesson(uuid) to anon, authenticated;

create or replace view public.review_public_lessons with (security_barrier = true) as
select l.id, l.slug, l.lesson_date, l.title_en, l.title_ja, l.summary_en, l.summary_ja,
  l.status, l.audience, l.content_version,
  case when l.is_preview and public.review_can_read_lesson(l.id) then l.content
    else jsonb_build_object('themes', l.content -> 'themes') end as content,
  l.published_at, l.is_preview,
  (select count(*)::integer from public.review_questions q where q.lesson_id = l.id and q.active) as question_count,
  l.source_segment
from public.review_lessons l
where public.review_can_read_catalog_lesson(l.id);
create or replace view public.review_public_questions with (security_barrier = true) as
select q.id, q.lesson_id, q.stable_key, q.position, q.section, q.format, q.payload,
  q.is_original, q.points, q.required_plan, q.locked_display
from public.review_questions q join public.review_lessons l on l.id = q.lesson_id
where q.active and q.required_plan = 'free' and l.status = 'published'
  and l.audience in ('general','both') and l.is_preview
  and public.review_can_read_question(q.id);
revoke all on public.review_public_lessons, public.review_public_questions from public, anon, authenticated;
grant select on public.review_public_lessons, public.review_public_questions to anon, authenticated;


-- Restrictive policies AND with all older permissive teacher policies.
create or replace function public.review_lesson_private_scope(check_lesson uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.review_lessons lesson
    where lesson.id = check_lesson
      and (not lesson.assignment_only or public.review_can_read_assigned_lesson(lesson.id))
  );
$$;
revoke all on function public.review_lesson_private_scope(uuid) from public;
grant execute on function public.review_lesson_private_scope(uuid) to authenticated;

drop policy if exists review_private_lessons_select_scope on public.review_lessons;
create policy review_private_lessons_select_scope on public.review_lessons as restrictive
  for select to authenticated using (
    not assignment_only
    -- INSERT RETURNING evaluates the new row before a stable helper can query
    -- it; test the author on this row so a private draft can be created.
    or (public.is_review_teacher() and created_by = auth.uid())
    or public.review_can_read_assigned_lesson(id)
  );
drop policy if exists review_private_lessons_update_scope on public.review_lessons;
create policy review_private_lessons_update_scope on public.review_lessons as restrictive
  for update to authenticated
  using (not assignment_only or (public.is_review_teacher() and created_by = auth.uid()) or public.review_can_read_assigned_lesson(id))
  with check (not assignment_only or (public.is_review_teacher() and created_by = auth.uid()) or public.review_can_read_assigned_lesson(id));
drop policy if exists review_private_questions_scope on public.review_questions;
create policy review_private_questions_scope on public.review_questions as restrictive
  for all to authenticated
  using (public.review_lesson_private_scope(lesson_id))
  with check (public.review_lesson_private_scope(lesson_id));
drop policy if exists review_private_premium_tasks_scope on public.review_premium_tasks;
create policy review_private_premium_tasks_scope on public.review_premium_tasks as restrictive
  for all to authenticated
  using (public.review_lesson_private_scope(lesson_id))
  with check (public.review_lesson_private_scope(lesson_id));

-- Prevent granting oneself access by assigning a guessed private lesson UUID
-- to an owned learner or by adding an allow override. This executes before the
-- prospective assignment could make the caller a legitimate assigned teacher.
create or replace function public.review_guard_private_lesson_assignment()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and public.is_review_teacher() then
    if tg_op <> 'INSERT' and not public.review_lesson_private_scope(old.lesson_id) then
      raise exception 'This private lesson is not available to the signed-in teacher.';
    end if;
    if tg_op <> 'DELETE' and not public.review_lesson_private_scope(new.lesson_id) then
      raise exception 'This private lesson is not available to the signed-in teacher.';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.review_guard_private_lesson_assignment() from public;
drop trigger if exists review_assignments_private_lesson_guard on public.review_assignments;
create trigger review_assignments_private_lesson_guard before insert or update or delete
  on public.review_assignments for each row execute function public.review_guard_private_lesson_assignment();
drop trigger if exists review_overrides_private_lesson_guard on public.review_lesson_access_overrides;
create trigger review_overrides_private_lesson_guard before insert or update or delete
  on public.review_lesson_access_overrides for each row execute function public.review_guard_private_lesson_assignment();

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
  if target.assignment_only and not public.review_teacher_can_read_private_lesson(target.id) then
    raise exception 'This private lesson is not available to the signed-in teacher.';
  end if;

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

-- The legacy deletion RPC also runs as the owner. Keep its archive,
-- confirmation and history safeguards while applying the private boundary.
create or replace function public.review_permanently_delete_lesson(
  lesson_to_delete uuid,
  confirmation_text text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  target public.review_lessons%rowtype;
begin
  if not public.is_review_teacher() then
    raise exception 'Teacher authorisation is required.';
  end if;
  select * into target from public.review_lessons where id = lesson_to_delete for update;
  if not found then
    raise exception 'Lesson not found.';
  end if;
  if target.assignment_only and not public.review_teacher_can_read_private_lesson(target.id) then
    raise exception 'This private lesson is not available to the signed-in teacher.';
  end if;
  if target.status <> 'archived' then
    raise exception 'Archive the lesson before permanent deletion.';
  end if;
  if confirmation_text is distinct from ('DELETE ' || target.slug) then
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

notify pgrst, 'reload schema';
commit;
