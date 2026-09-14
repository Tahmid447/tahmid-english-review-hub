-- Owner-only event outbox. Never copies auth secrets, links or passwords.
create schema review_email_private;
revoke all on schema review_email_private from public, anon, authenticated;
create table review_email_private.config (
  singleton boolean primary key default true check (singleton),
  token_hash bytea not null
);
create table review_email_private.events (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('signup','password_reset_requested')),
  user_id uuid not null,
  email text not null,
  created_at timestamptz not null default now(),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  lease_id uuid,
  accepted_at timestamptz,
  last_error text
);
alter table review_email_private.config enable row level security;
alter table review_email_private.events enable row level security;
revoke all on all tables in schema review_email_private from public, anon, authenticated;
create index review_email_events_pending on review_email_private.events (available_at, created_at) where accepted_at is null and attempts < 3;

create function review_email_private.capture_auth_event() returns trigger
language plpgsql security definer set search_path = '' as $$
declare event_kind text;
begin
  if tg_op = 'INSERT' then event_kind := 'signup';
  elsif nullif(to_jsonb(new)->>'recovery_sent_at','') is not null
    and (to_jsonb(new)->>'recovery_sent_at') is distinct from (to_jsonb(old)->>'recovery_sent_at')
  then event_kind := 'password_reset_requested';
  else return new;
  end if;
  if new.email is not null and new.email <> '' then
    insert into review_email_private.events(kind,user_id,email) values(event_kind,new.id,new.email);
  end if;
  return new;
exception when others then
  -- Notifications must never prevent signup, login, or password recovery.
  raise warning 'Owner email event could not be queued';
  return new;
end $$;
revoke all on function review_email_private.capture_auth_event() from public, anon, authenticated;
create trigger review_capture_owner_email_event after insert or update on auth.users
for each row execute function review_email_private.capture_auth_event();

create function review_email_private.check_token(p_token text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_token is null or length(p_token) < 64 or length(p_token) > 128 or not exists (
    select 1 from review_email_private.config where singleton
      and token_hash = sha256(convert_to(p_token, 'UTF8'))
  ) then raise exception 'Unauthorized' using errcode='42501'; end if;
end $$;
revoke all on function review_email_private.check_token(text) from public, anon, authenticated;

create function public.review_claim_owner_email_events(p_token text)
returns table(id uuid,kind text,email text,created_at timestamptz,lease_id uuid)
language plpgsql security definer set search_path = '' as $$
declare v_lease uuid := gen_random_uuid();
begin
  perform review_email_private.check_token(p_token);
  delete from review_email_private.events e where e.created_at < now() - interval '30 days';
  return query
  with pending as (
    select e.id from review_email_private.events e
    where e.accepted_at is null and e.attempts < 3 and e.available_at <= now()
    order by e.created_at limit 100 for update skip locked
  )
  update review_email_private.events e set attempts=e.attempts+1,
    lease_id=v_lease, available_at=now()+interval '10 minutes'
  from pending p where e.id=p.id
  returning e.id,e.kind,e.email,e.created_at,e.lease_id;
end $$;

create function public.review_finish_owner_email_events(p_token text,p_lease uuid,p_accepted boolean,p_error text default null)
returns integer language plpgsql security definer set search_path = '' as $$
declare affected integer;
begin
  perform review_email_private.check_token(p_token);
  update review_email_private.events e set
    accepted_at=case when p_accepted then now() else null end,
    last_error=case when p_accepted then null else left(regexp_replace(coalesce(p_error,'FAILED'),'[^A-Z0-9_]','','g'),80) end,
    available_at=now()+interval '15 minutes', lease_id=null
  where e.lease_id=p_lease and e.accepted_at is null;
  get diagnostics affected = row_count;
  return affected;
end $$;
revoke all on function public.review_claim_owner_email_events(text) from public,anon,authenticated;
revoke all on function public.review_finish_owner_email_events(text,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.review_claim_owner_email_events(text) to anon;
grant execute on function public.review_finish_owner_email_events(text,uuid,boolean,text) to anon;
