-- Private profile photos: one compact image per account, replaced in place.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('review-avatars','review-avatars',false,102400,array['image/webp'])
on conflict(id) do update set public=false,file_size_limit=102400,allowed_mime_types=array['image/webp'];

create or replace function public.review_can_read_avatar(object_name text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select auth.uid() is not null and exists(
    select 1 from public.review_profiles p
    where object_name=p.user_id::text||'/avatar.webp'
      and (p.user_id=auth.uid() or public.review_teacher_can_manage(p.user_id))
  )
$$;
revoke all on function public.review_can_read_avatar(text) from public;
grant execute on function public.review_can_read_avatar(text) to authenticated;
create policy review_avatar_read on storage.objects for select to authenticated
using(bucket_id='review-avatars' and public.review_can_read_avatar(name));
create policy review_avatar_insert on storage.objects for insert to authenticated
with check(bucket_id='review-avatars' and name=auth.uid()::text||'/avatar.webp');
create policy review_avatar_update on storage.objects for update to authenticated
using(bucket_id='review-avatars' and name=auth.uid()::text||'/avatar.webp')
with check(bucket_id='review-avatars' and name=auth.uid()::text||'/avatar.webp');
create policy review_avatar_delete on storage.objects for delete to authenticated
using(bucket_id='review-avatars' and name=auth.uid()::text||'/avatar.webp');

-- Store references, never copies of private question payloads. Content is
-- resolved with its ordinary RLS when opening a favorite on My Page.
create table public.review_saved_learning (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.review_lessons(id) on delete cascade,
  question_key text not null default '' check(length(question_key)<=160),
  created_at timestamptz not null default now(),
  primary key(user_id,lesson_id,question_key)
);
alter table public.review_saved_learning enable row level security;
revoke all on public.review_saved_learning from anon,authenticated;
grant select,delete on public.review_saved_learning to authenticated;
create policy review_saved_learning_read on public.review_saved_learning for select to authenticated
using(user_id=auth.uid());
create policy review_saved_learning_delete on public.review_saved_learning for delete to authenticated
using(user_id=auth.uid());

create or replace function public.review_save_learning(target_slug text,target_question text default '',favorite boolean default true)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare target_lesson uuid; question_value text:=coalesce(target_question,'');
begin
  if auth.uid() is null then raise exception 'Sign in to save learning'; end if;
  select id into target_lesson from public.review_lessons where slug=target_slug;
  if target_lesson is null then raise exception 'Lesson unavailable'; end if;
  if not favorite then
    delete from public.review_saved_learning where user_id=auth.uid() and lesson_id=target_lesson and question_key=question_value;
    return false;
  end if;
  if not public.review_can_read_lesson(target_lesson) then raise exception 'Lesson access required'; end if;
  if question_value<>'' and not exists(
    select 1 from public.review_questions q where q.lesson_id=target_lesson and q.active and public.review_can_read_question(q.id)
      and (q.stable_key=question_value or q.id::text=question_value or q.payload->>'id'=question_value)
  ) then raise exception 'Question unavailable'; end if;
  insert into public.review_saved_learning(user_id,lesson_id,question_key)
  values(auth.uid(),target_lesson,question_value) on conflict do nothing;
  return true;
end;
$$;
revoke all on function public.review_save_learning(text,text,boolean) from public;
grant execute on function public.review_save_learning(text,text,boolean) to authenticated;

-- Small projection for the catalogue: full lesson/question content is loaded
-- only after a learner opens an individual lesson.
create index if not exists review_saved_learning_recent on public.review_saved_learning(user_id,created_at desc);

-- The site owner can use their own learner preview without weakening teacher
-- ownership or another learner's activity policies.
drop policy review_phrase_select on public.review_phrase_activity;
create policy review_phrase_select on public.review_phrase_activity for select to authenticated
using ((user_id=auth.uid() and (not public.is_review_teacher() or public.review_is_site_owner()) and public.review_student_hub_feature_enabled('progress')) or public.review_teacher_can_manage(user_id));
drop policy review_phrase_insert_self on public.review_phrase_activity;
create policy review_phrase_insert_self on public.review_phrase_activity for insert to authenticated
with check (user_id=auth.uid() and (not public.is_review_teacher() or public.review_is_site_owner()) and public.review_student_hub_feature_enabled('progress') and (lesson_id is null or public.review_can_read_lesson(lesson_id)));
drop policy review_phrase_update_self on public.review_phrase_activity;
create policy review_phrase_update_self on public.review_phrase_activity for update to authenticated
using (user_id=auth.uid() and (not public.is_review_teacher() or public.review_is_site_owner()) and public.review_student_hub_feature_enabled('progress'))
with check (user_id=auth.uid() and (not public.is_review_teacher() or public.review_is_site_owner()) and public.review_student_hub_feature_enabled('progress') and (not is_favorite or lesson_id is null or public.review_can_read_lesson(lesson_id)));

-- Personal cards are private homework notes, distinct from public curriculum.
create table public.review_personal_cards (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.review_profiles(user_id) on delete cascade,
  category text not null check(category in ('words','phrases','sentences','notes')),
  text_en text not null default '' check(length(text_en)<=2000),
  text_ja text not null default '' check(length(text_ja)<=2000),
  teacher_note text not null default '' check(length(teacher_note)<=2000),
  audio_enabled boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(length(btrim(text_en))>0 or length(btrim(text_ja))>0),
  check(not audio_enabled or length(btrim(text_en))>0)
);
create index review_personal_cards_student_recent on public.review_personal_cards(student_id,created_at desc);
alter table public.review_personal_cards enable row level security;
revoke all on public.review_personal_cards from anon,authenticated;
grant select,insert on public.review_personal_cards to authenticated;
grant update(category,text_en,text_ja,teacher_note,audio_enabled,active) on public.review_personal_cards to authenticated;
create policy review_personal_cards_read on public.review_personal_cards for select to authenticated
using ((teacher_id=auth.uid() and public.review_teacher_can_manage(student_id)) or
  (student_id=auth.uid() and active and public.review_student_hub_feature_enabled('homework')));
create policy review_personal_cards_create on public.review_personal_cards for insert to authenticated
with check(teacher_id=auth.uid() and public.review_teacher_can_manage(student_id));
create policy review_personal_cards_edit on public.review_personal_cards for update to authenticated
using(teacher_id=auth.uid() and public.review_teacher_can_manage(student_id))
with check(teacher_id=auth.uid() and public.review_teacher_can_manage(student_id));
create trigger review_personal_cards_updated_at before update on public.review_personal_cards
for each row execute function public.review_set_updated_at();

create table public.review_personal_card_favorites (
  student_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.review_personal_cards(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(student_id,card_id)
);
alter table public.review_personal_card_favorites enable row level security;
revoke all on public.review_personal_card_favorites from anon,authenticated;
grant select,delete on public.review_personal_card_favorites to authenticated;
create policy review_personal_card_favorites_read on public.review_personal_card_favorites for select to authenticated using(student_id=auth.uid());
create policy review_personal_card_favorites_remove on public.review_personal_card_favorites for delete to authenticated using(student_id=auth.uid());
create function public.review_save_personal_card(target_card uuid, favorite boolean default true)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not favorite then
    delete from public.review_personal_card_favorites where student_id=auth.uid() and card_id=target_card;
    return false;
  end if;
  if not public.review_student_hub_feature_enabled('homework') or not exists(
    select 1 from public.review_personal_cards where id=target_card and student_id=auth.uid() and active
  ) then raise exception 'This card is not available'; end if;
  insert into public.review_personal_card_favorites(student_id,card_id) values(auth.uid(),target_card) on conflict do nothing;
  return true;
end;
$$;
revoke all on function public.review_save_personal_card(uuid,boolean) from public;
grant execute on function public.review_save_personal_card(uuid,boolean) to authenticated;

-- Account preferences also persist for the verified owner's learner preview.
create policy review_settings_owner_self on public.review_user_settings for all to authenticated
using(user_id=auth.uid() and public.review_is_site_owner())
with check(user_id=auth.uid() and public.review_is_site_owner());
create policy review_curriculum_favorites_owner_self on public.review_curriculum_favorites for select to authenticated
using(student_id=auth.uid() and public.review_is_site_owner());
create policy review_curriculum_progress_owner_self on public.review_curriculum_progress for select to authenticated
using(student_id=auth.uid() and public.review_is_site_owner());

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
  if auth.uid() is null or (public.is_review_teacher() and not public.review_is_site_owner()) then
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
  if auth.uid() is null or (public.is_review_teacher() and not public.review_is_site_owner()) then
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
