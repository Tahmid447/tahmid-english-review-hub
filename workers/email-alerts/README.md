# Owner email diagnostic — disabled

This isolated Worker tested Cloudflare's free sending to an already verified Email Routing destination. It is not the production authentication mailer or an active notification system.

On 14 September 2026 one owner-authorized send returned `E_DELIVERY_FAILED` (permanent delivery failure). `SEND_ENABLED` is now `false`. No triggers, schedules, webhook subscriptions or retries exist. Keep sending disabled unless a new, justified owner diagnostic is needed.

The `/test` route requires a random bearer secret and can only send a fixed message to the fixed owner destination. Request content cannot select the sender, recipient, subject or text. Unauthenticated callers get 401; authenticated callers get 409 while disabled. `/health` is public and contains no private data. Sending acceptance, if returned in a future diagnostic, would not prove inbox delivery.

The `NOTIFY_OWNER` binding allows verified destinations only. `OWNER_EMAIL` and `ADMIN_TOKEN` are Worker secrets; never commit them or put them in the public website configuration. There is no frontend integration. Existing Email Routing aliases and the production speech Worker are independent.

Focused local validation:

```sh
node scripts/test-email-alerts.mjs
```

Configuration: `workers/email-alerts/wrangler.jsonc`. Deployed service: `https://tahmid-email-alerts.tahmidhc245.workers.dev`. Latest disabled version: `5fb704f9-7b78-4613-a6e2-7916145e7b22`.

Official references: [verified-destination pricing](https://developers.cloudflare.com/email-service/platform/pricing/), [sending bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/), [Workers sending API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/).
