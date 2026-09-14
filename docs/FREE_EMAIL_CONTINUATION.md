# Free email operation — verified 15 September 2026

The owner declined a paid domain and selected an existing additional Gmail, then enabled its 2-Step Verification. The free setup is now in service. This replaces earlier pending-provider instructions. Exact private inbox/account details and the beginner guide are outside Git in `../email-private-backup/EMAIL_GUIDE_JA.md`.

| Function | Current service and behavior |
| --- | --- |
| Incoming `hello@tahmidenglishhub.dpdns.org` and `support@tahmidenglishhub.dpdns.org` | Cloudflare Email Routing forwards to the verified private main Gmail; Inbox receipt tested separately for both aliases. Catch-all remains off. |
| Signup, reset and other configured auth mail | Existing Supabase project uses genuine selected Gmail through `smtp.gmail.com:465`, display name `Tahmid English Hub`. Branded templates and redirects are preserved. |
| Reply destination | Selected Gmail forwards all new mail to the main Gmail, keeping its own Inbox copy. User delegated this choice after disclosure that the account has other uses. |
| Manual sending/replies | Open the selected Gmail account and send as that account. Its Gmail sending display name is `Tahmid English Hub`. Main Gmail Send-as was removed after a real test exposed the private main in Return-Path. |
| Owner signup/reset notices | Private outbox → Supabase Cron every five minutes → Cloudflare Worker → Gmail SMTP → main Inbox. No auth passwords/tokens/links are copied. |

**Domain addresses are currently receive-only.** Resend domain-origin mail to Gmail was authenticated but rejected; SMTP2GO was suspended. Parent `dpdns.org` reputation evidence does not prove the exact Gmail classifier or a site compromise. No support response, new paid domain, repeated unchanged retry, or suspension evasion is required by the working Gmail route. Do not disguise Gmail mail as the domain address. Do not restore the failed Resend Send-as entry.

To reply to mail originally addressed to the selected Gmail, open that original message in the selected mailbox. Domain-address mail arrives only in the main mailbox: copy the customer's email address, switch to the selected sender account, and compose the response there. Pressing Reply from the main account would expose its address. No forwarding from main back to the selected account was added, avoiding a loop.

## Verified evidence

- Support/hello Inbox receipts: 14 September 18:36 and 18:44 JST.
- Supabase Gmail SMTP: direct diagnostic Inbox 22:53; actual password reset Inbox/link/save/API login/UI login at 22:56 onward; actual new signup Inbox/link/UI login 23:07. Reset used the custom-domain page; signup and password login UI used the production Pages origin with the same backend, keeping the owner Google session separate. Only owner-controlled fixtures were used; test sessions were signed out.
- Forwarding: confirmation completed; exact saved setting re-read; mail remained in selected Inbox and reached main Inbox at 00:01 on 15 September.
- Manual Gmail UI send: received self-plus copy at 00:01; original headers did not contain the main address. Gmail internal self-delivery did not include SPF/DKIM/DMARC result headers, so do not claim those were measured on this specific message. An earlier Gmail Send-as test passed SPF/DKIM/DMARC for gmail.com but leaked the main Return-Path, hence removal.
- Owner-only SMTP threaded reply reached the main Inbox at 00:27. This verified threading/SMTP delivery, not a Gmail UI Reply-button action.
- Owner notices: two-event manual digest Inbox 23:42; **automatic Supabase Cron** digest Inbox 00:10, with cron success, pg_net HTTP 200, one accepted event, and final pending count zero. Cloudflare Cron was not proven to run and was removed.
- Existing owner Google session still renders the production site. Fresh Google OAuth reauthentication was not repeated. Website, reset route and HTTPS return 200; no learning data was edited by this email continuation.

## Cost and maintenance

No purchase, credit card, auto-renewing trial or paid capacity was enabled. Gmail personal-account limits are generally 500 emails/day and shared with this account's other use; Supabase's existing 30 auth emails/hour cap remains. Owner notices use the same Gmail allowance. This is a small-volume free configuration; capacity, recipient filtering and Google restrictions can interrupt delivery. Do not promise unlimited service or permanent Inbox placement.

Keep the selected Gmail signed in when replying, keep 2-Step Verification enabled, and keep its app password active. Changing the Google password may revoke app passwords; if necessary, create a replacement and update both Supabase SMTP and the owner Worker. Inspect the separate owner queue if notifications stop. Protect the local private backups. A future preference for a domain From address or larger volume requires a fresh decision and actual delivery tests; no paid upgrade is authorized by this checkpoint.

[Google app passwords](https://support.google.com/accounts/answer/185833?hl=en), [Gmail sending limits](https://support.google.com/mail/answer/22839?hl=en), [Gmail Send-as and original-address disclosure](https://support.google.com/mail/answer/22370?hl=en), [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp). Technical owner-notification guide: [Worker README](../workers/email-alerts/README.md).
