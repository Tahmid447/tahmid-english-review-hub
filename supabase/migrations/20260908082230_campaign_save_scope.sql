-- Restrict target replacement explicitly for the production safe-update guard.
create or replace function public.review_save_experience(config jsonb, targets uuid[]) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not public.review_is_site_owner() then raise exception 'Site owner access required'; end if;
 if exists(select 1 from unnest(targets) t where not public.review_teacher_can_manage(t)) then raise exception 'Select only your learners'; end if;
 update public.review_site_experience set
 features=config->'features',campaign_enabled=(config->>'campaign_enabled')::boolean,
 welcome_enabled=(config->>'welcome_enabled')::boolean,name_en=config->>'name_en',name_ja=config->>'name_ja',
 audience=config->>'audience',starts_at=(config->>'starts_at')::timestamptz,ends_at=(config->>'ends_at')::timestamptz,
 prices=config->'prices' where id;
 delete from public.review_campaign_targets where not (student_id = any(coalesce(targets, '{}'::uuid[])));
 insert into public.review_campaign_targets(student_id) select distinct unnest(targets) on conflict (student_id) do nothing;
end $$;
revoke all on function public.review_save_experience(jsonb,uuid[]) from public,anon,authenticated;
grant execute on function public.review_save_experience(jsonb,uuid[]) to authenticated;
