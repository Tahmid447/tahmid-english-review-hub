# Private owner email notifications

Production uses a Cloudflare Worker with Gmail SMTPS and a private Supabase event outbox. Authentication mail itself is sent directly by Supabase custom SMTP. Cloudflare Email Routing continues to receive the domain aliases independently.

## Live configuration — 15 September 2026

- Worker: `https://tahmid-email-alerts.tahmidhc245.workers.dev`; version `d6c08503-8991-4ce0-8721-fbc8c2739bb5`.
- `ALERTS_ENABLED=true`; `SEND_ENABLED=false` disables only the diagnostic `/test` route.
- **Supabase Cron**, job `english-hub-owner-email` (ID 1), runs `review_email_private.dispatch_pending()` every five minutes. The dispatcher makes an authenticated POST only when due events exist. Its credential lives in Supabase Vault, name `english_hub_owner_dispatch_token`.
- There are **no Cloudflare Cron triggers**. The earlier Cloudflare schedule did not produce a verified invocation, so it was removed. Native Supabase Cron ran successfully at 00:10 JST; HTTP 200 reported one accepted event and the main Gmail Inbox received the notification at 00:10. Subsequent empty-queue runs succeeded without extra messages.
- Earlier manual processing delivered a two-event digest at 23:42 JST. Final queue check: three accepted events, zero pending. Acceptance is SMTP acceptance; the separate Gmail UI checks establish these particular messages' Inbox receipt.

## Boundaries

`/health` is public and contains no private data. `POST /process` and `POST /test` require the random `ADMIN_TOKEN`. The former processes due events; the latter returns 409 while disabled. Sender, recipient and message structure are fixed by configuration/code; request content cannot select an address or create an open relay.

The Worker holds five secrets: `ADMIN_TOKEN`, `OWNER_EMAIL`, `SMTP_USER`, `SMTP_PASSWORD`, `QUEUE_TOKEN`. It connects only to `smtp.gmail.com:465` with TLS. The SMTP password is a user-authorized Google app password, never the ordinary Google password. Keep secrets outside Git/public assets/logs. The public Supabase anon key in Wrangler is intentionally public; no Supabase service-role credential is stored in this Worker.

The auth trigger records only event type, account ID/email and time. It never copies passwords, confirmation/reset links or auth tokens, and catches notification errors so they cannot block authentication. A signup event means an account was created, not that confirmation completed; a reset-request event does not mean the password changed or the email arrived. This is not notebook-event email integration or delivery analytics.

Scoped RPCs require a separate random 256-bit queue token, whose hash is in a private RLS-enabled table. Claims lease up to 100 events for ten minutes; failed sends retry after fifteen minutes, at most three claims. Digests reduce Gmail use. Event/dispatch records expire after thirty days. An ambiguous disconnect after SMTP acceptance but before acknowledgement can produce a duplicate; event IDs allow identification. Three failed claims leave an event pending for inspection until retention removes it. Database and Vault tables and pg_net request headers are inaccessible to browser roles.

## Operations

Validate locally with `npm run test:email-alerts`. Deploy with `npm run deploy:email-alerts`; existing Worker secrets persist. For initial provisioning/rotation use Wrangler secret input or a 0600 private JSON file with `wrangler secret bulk --config workers/email-alerts/wrangler.jsonc <private-file>`; never place literal credentials in shell history. Coordinate Google app-password rotation across Supabase SMTP and this Worker. Coordinate `ADMIN_TOKEN` rotation with Vault and `QUEUE_TOKEN` rotation with the private configuration hash.

The applied migrations `20260914144000_owner_email_notifications.sql` and `20260914151000_owner_email_dispatch_schedule.sql` are immutable. They have matching production ledger entries; do not replay them. Vault/config provisioning was performed separately with reviewed private SQL. No new service role is needed.

Read-only monitoring with the existing administrator query helper:

```sql
select jobid, jobname, schedule, active from cron.job where jobname='english-hub-owner-email';
select start_time, status, return_message from cron.job_run_details
where jobid=1 order by start_time desc limit 10;
select count(*) filter(where accepted_at is null) as pending,
       count(*) filter(where accepted_at is not null) as accepted,
       count(*) filter(where accepted_at is null and attempts>=3) as exhausted
from review_email_private.events;
select r.status_code,r.timed_out,r.error_msg,r.content
from net._http_response r join review_email_private.dispatches d on d.request_id=r.id
order by d.created_at desc limit 10;
```

Do not query/output Vault values or pg_net Authorization headers while diagnosing. A succeeded cron job only means the asynchronous HTTP request was queued: also inspect its response and, for an end-to-end check, the owner Inbox. To pause alerts, set `ALERTS_ENABLED=false` and disable this specific Cron job; do not disable Supabase authentication or delete users. Resume deliberately after checking queue age to avoid an unexpected backlog.

[Supabase Cron](https://supabase.com/docs/guides/cron), [scheduled requests and Vault](https://supabase.com/docs/guides/functions/schedule-functions), [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net), [Cloudflare TCP sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/).
