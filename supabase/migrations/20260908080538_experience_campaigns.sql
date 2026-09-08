-- Forward-only release: owner-managed presentation, authenticated targeting,
-- global feature defaults, and atomic announcement publication.
create table public.review_site_owner (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.review_site_owner enable row level security;
revoke all on public.review_site_owner from public, anon, authenticated;
insert into public.review_site_owner(user_id)
select user_id from public.review_teachers
where active and (select count(*) from public.review_teachers where active)=1;
create function public.review_is_site_owner() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.review_site_owner o join public.review_teachers t using(user_id)
 where o.user_id=auth.uid() and t.active);
$$;
revoke all on function public.review_is_site_owner() from public, anon, authenticated;
grant execute on function public.review_is_site_owner() to authenticated;

create function public.review_valid_features(value jsonb) returns boolean
language sql immutable set search_path='' as $$
 select jsonb_typeof(value)='object' and not exists(select 1 from jsonb_each(value) e where
 e.key not in ('show_dashboard','show_words','show_phrases','show_phonics','show_review_lessons','show_homework','show_progress','show_pricing','show_contact_teacher','show_trial_cta','show_payment_plan','show_announcements') or jsonb_typeof(e.value)<>'boolean');
$$;
create table public.review_site_experience (
 id boolean primary key default true check(id),
 features jsonb not null default '{}' check(public.review_valid_features(features)),
 campaign_key uuid not null default gen_random_uuid(),
 campaign_enabled boolean not null default false,
 welcome_enabled boolean not null default false,
 name_en text not null default 'Your next chapter in English' check(length(name_en) between 1 and 120),
 name_ja text not null default '英語で、新しい一歩を。' check(length(name_ja) between 1 and 120),
 audience text not null default 'all' check(audience in ('all','selected')),
 starts_at timestamptz not null default now(),
 ends_at timestamptz not null default now()+interval '21 days',
 prices jsonb not null default '{}',
 updated_at timestamptz not null default now(),
 check(ends_at>starts_at)
);
alter table public.review_site_experience enable row level security;
revoke all on public.review_site_experience from public, anon, authenticated;
grant select,update on public.review_site_experience to authenticated;
create policy owner_experience on public.review_site_experience for all to authenticated
using(public.review_is_site_owner()) with check(public.review_is_site_owner());
-- New applicant quotes only; existing memberships and agreements are untouched.
-- These reference prices become applicable after the advertised deadline.
insert into public.review_site_experience(id,campaign_enabled,welcome_enabled,starts_at,ends_at,prices)
values(true,true,true,'2026-09-08T00:00:00+09:00','2026-10-01T00:00:00+09:00',
'{"standard":{"regular":4980,"offer":3980},"premium":{"regular":8980,"offer":6980},"premium_plus":{"regular":21800,"offer":16800}}');
create function public.review_validate_campaign() returns trigger language plpgsql set search_path='' as $$
declare p text; v jsonb;
begin
 for p in select unnest(array['standard','premium','premium_plus']) loop
  v:=new.prices->p;
  if v is null or jsonb_typeof(v->'regular') is distinct from 'number' or jsonb_typeof(v->'offer') is distinct from 'number'
   or (v->>'regular')::numeric < (v->>'offer')::numeric or (v->>'offer')::numeric < 1
   or (v->>'regular')::numeric > 1000000 or (v->>'regular')::numeric <> trunc((v->>'regular')::numeric)
   or (v->>'offer')::numeric <> trunc((v->>'offer')::numeric) then
   raise exception 'Enter whole-yen prices: 1 <= offer <= regular <= 1000000';
  end if;
 end loop;
 new.updated_at:=now(); return new;
end $$;
create trigger validate_campaign before insert or update on public.review_site_experience
for each row execute function public.review_validate_campaign();

create table public.review_campaign_targets (
 student_id uuid primary key references public.review_profiles(user_id) on delete cascade
);
alter table public.review_campaign_targets enable row level security;
revoke all on public.review_campaign_targets from public,anon,authenticated;
grant select,insert,delete on public.review_campaign_targets to authenticated;
create policy owner_campaign_targets on public.review_campaign_targets for all to authenticated
using(public.review_is_site_owner()) with check(public.review_is_site_owner());
create table public.review_offer_receipts (
 student_id uuid references auth.users(id) on delete cascade,
 campaign_key uuid not null,
 dismissed_at timestamptz not null default now(),
 primary key(student_id,campaign_key)
);
alter table public.review_offer_receipts enable row level security;
revoke all on public.review_offer_receipts from public,anon,authenticated;

alter table public.review_student_hub_settings add column inherit_features boolean not null default true;
-- Preserve any previously hidden individual feature as an explicit custom setup.
update public.review_student_hub_settings set inherit_features=false where
not(show_dashboard and show_words and show_phrases and show_phonics and show_review_lessons and show_homework
 and show_progress and show_pricing and show_contact_teacher and show_trial_cta and show_payment_plan and show_announcements);
create function public.review_my_hub_settings() returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare s jsonb; f jsonb; k text;
begin
 if auth.uid() is null then return null; end if;
 select to_jsonb(h) into s from public.review_student_hub_settings h where student_id=auth.uid();
 if public.review_is_site_owner() then
  s:=coalesce(s,'{}') || '{"account_enabled":true,"allowed_level_min":1,"allowed_level_max":32,"allowed_levels":[],"category_access":{},"owner_preview":true}';
  for k in select unnest(array['dashboard','words','phrases','phonics','review_lessons','homework','progress','pricing','contact_teacher','trial_cta','payment_plan','announcements']) loop
   s:=s||jsonb_build_object('show_'||k,true);
  end loop;
  return s;
 end if;
 if s is null then return null; end if;
 if (s->>'inherit_features')::boolean then
  select features into f from public.review_site_experience where id;
  s:=s||coalesce(f,'{}');
 end if;
 return s;
end $$;
revoke all on function public.review_my_hub_settings() from public,anon,authenticated;
grant execute on function public.review_my_hub_settings() to authenticated;
create or replace function public.review_student_hub_feature_enabled(requested_feature text) returns boolean
language sql stable security definer set search_path='' as $$
 select case when public.is_review_teacher() then true when auth.uid() is null then false else
 coalesce((s->>'account_enabled')::boolean,false) and case
 when requested_feature='account_enabled' then true
 when requested_feature in ('dashboard','words','phrases','phonics','review_lessons','homework','progress','pricing','contact_teacher','trial_cta','payment_plan','announcements')
 then coalesce((s->>('show_'||requested_feature))::boolean,false)
 when requested_feature in ('show_dashboard','show_words','show_phrases','show_phonics','show_review_lessons','show_homework','show_progress','show_pricing','show_contact_teacher','show_trial_cta','show_payment_plan','show_announcements')
 then coalesce((s->>requested_feature)::boolean,false) else false end end
 from (select public.review_my_hub_settings() s) x;
$$;

create function public.review_my_experience() returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare c public.review_site_experience; eligible boolean; welcome boolean:=false; target_ok boolean; f jsonb;
begin
 select * into c from public.review_site_experience where id;
 target_ok:=c.audience='all' or exists(select 1 from public.review_campaign_targets where student_id=auth.uid());
 f:=case when auth.uid() is null then c.features else public.review_my_hub_settings() end;
 eligible:=target_ok and now()>=c.starts_at and now()<c.ends_at;
 if auth.uid() is not null and eligible and c.welcome_enabled
  and coalesce((f->>'show_pricing')::boolean,true) and coalesce((f->>'account_enabled')::boolean,false) then
  welcome:=exists(select 1 from auth.users where id=auth.uid() and created_at>=c.starts_at and created_at<c.ends_at)
   and not exists(select 1 from public.review_memberships where user_id=auth.uid() and status='active' and expires_at>now())
;
 end if;
 return jsonb_build_object('features',coalesce(f,'{}'),'campaign',case when target_ok and (c.campaign_enabled or welcome) then
 jsonb_build_object('key',c.campaign_key,'active',eligible,'name_en',c.name_en,'name_ja',c.name_ja,'starts_at',c.starts_at,'ends_at',c.ends_at,'prices',c.prices)
 else null end,'welcome',welcome and not exists(select 1 from public.review_offer_receipts where student_id=auth.uid() and campaign_key=c.campaign_key));
end $$;
revoke all on function public.review_my_experience() from public,anon,authenticated;
grant execute on function public.review_my_experience() to anon,authenticated;
create function public.review_dismiss_offer() returns void
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 insert into public.review_offer_receipts(student_id,campaign_key)
 select auth.uid(),campaign_key from public.review_site_experience where id on conflict do nothing;
end $$;
revoke all on function public.review_dismiss_offer() from public,anon,authenticated;
grant execute on function public.review_dismiss_offer() to authenticated;

-- INSERT RETURNING must evaluate the new teacher-owned row directly. A stable
-- helper that re-queries the table cannot yet see that row in the same statement.
drop policy review_announcements_select on public.review_announcements;
create policy review_announcements_select on public.review_announcements for select to authenticated
using((teacher_id=auth.uid() and public.is_review_teacher()) or public.review_can_read_announcement(id));
create function public.review_publish_announcement(payload jsonb, target_student uuid default null)
returns public.review_announcements language plpgsql security definer set search_path='' as $$
declare a public.review_announcements;
begin
 if not public.is_review_teacher() then raise exception 'Teacher access required'; end if;
 if target_student is not null and not public.review_teacher_can_manage(target_student) then raise exception 'Learner is not assigned to this teacher'; end if;
 insert into public.review_announcements(teacher_id,audience,title_en,title_ja,body_en,body_ja,active,starts_at,ends_at)
 values(auth.uid(),case when target_student is null then 'all' else 'targeted' end,
 payload->>'title_en',payload->>'title_ja',payload->>'body_en',payload->>'body_ja',true,
 coalesce((payload->>'starts_at')::timestamptz,now()),(payload->>'ends_at')::timestamptz) returning * into a;
 if target_student is not null then insert into public.review_announcement_targets(announcement_id,student_id) values(a.id,target_student); end if;
 return a;
end $$;
revoke all on function public.review_publish_announcement(jsonb,uuid) from public,anon,authenticated;
grant execute on function public.review_publish_announcement(jsonb,uuid) to authenticated;
revoke all on function public.review_validate_campaign(),public.review_valid_features(jsonb) from public,anon,authenticated;
grant execute on function public.review_valid_features(jsonb) to authenticated;
create function public.review_save_experience(config jsonb, targets uuid[]) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not public.review_is_site_owner() then raise exception 'Site owner access required'; end if;
 if exists(select 1 from unnest(targets) t where not public.review_teacher_can_manage(t)) then raise exception 'Select only your learners'; end if;
 update public.review_site_experience set
 features=config->'features',campaign_enabled=(config->>'campaign_enabled')::boolean,
 welcome_enabled=(config->>'welcome_enabled')::boolean,name_en=config->>'name_en',name_ja=config->>'name_ja',
 audience=config->>'audience',starts_at=(config->>'starts_at')::timestamptz,ends_at=(config->>'ends_at')::timestamptz,
 prices=config->'prices' where id;
 delete from public.review_campaign_targets;
 insert into public.review_campaign_targets(student_id) select distinct unnest(targets);
end $$;
revoke all on function public.review_save_experience(jsonb,uuid[]) from public,anon,authenticated;
grant execute on function public.review_save_experience(jsonb,uuid[]) to authenticated;
