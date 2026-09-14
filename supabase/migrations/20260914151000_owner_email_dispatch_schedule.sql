-- Server-side dispatcher. Optional extensions are not available in local PGlite.
do $$ begin
  if exists(select 1 from pg_available_extensions where name='pg_cron') then
    create extension if not exists pg_cron with schema pg_catalog;
  end if;
  if exists(select 1 from pg_available_extensions where name='pg_net') then
    create extension if not exists pg_net with schema extensions;
  end if;
end $$;
create table review_email_private.dispatches (
  request_id bigint primary key,
  created_at timestamptz not null default now()
);
alter table review_email_private.dispatches enable row level security;
revoke all on review_email_private.dispatches from public,anon,authenticated;
create function review_email_private.dispatch_pending() returns bigint
language plpgsql security definer set search_path='' as $$
declare token text; request_id bigint;
begin
  delete from review_email_private.dispatches where created_at < now()-interval '30 days';
  delete from review_email_private.events where created_at < now()-interval '30 days';
  if not exists(select 1 from review_email_private.events
    where accepted_at is null and attempts < 3 and available_at <= now()) then return null; end if;
  select decrypted_secret into token from vault.decrypted_secrets where name='english_hub_owner_dispatch_token';
  if token is null or length(token) < 32 then raise exception 'Owner dispatcher token not configured'; end if;
  select net.http_post(
    url := 'https://tahmid-email-alerts.tahmidhc245.workers.dev/process',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||token),
    body := '{}'::jsonb, timeout_milliseconds := 30000
  ) into request_id;
  insert into review_email_private.dispatches(request_id) values(request_id);
  return request_id;
end $$;
revoke all on function review_email_private.dispatch_pending() from public,anon,authenticated;
do $$ begin
  if to_regnamespace('cron') is not null and to_regnamespace('net') is not null then
    -- pg_net was not previously installed in this project. Keep its request
    -- queue (which briefly contains Authorization headers) inaccessible to clients.
    revoke all on schema net from public,anon,authenticated;
    perform cron.schedule('english-hub-owner-email','*/5 * * * *','select review_email_private.dispatch_pending();');
  end if;
end $$;
