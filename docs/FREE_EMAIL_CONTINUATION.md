# Free email continuation

The user declined a paid domain on 14 September 2026. Keep the existing Cloudflare website, Supabase project, professional incoming aliases and private owner inbox. Current `support@` sending through Resend is authenticated but Gmail rejects it. Do not mark the task complete or retry unchanged failing messages.

## Evidence for a free alternative

An owner Gmail sent one diagnostic to the owner's main Gmail at 21:05 JST. It reached Inbox with the existing website URL and support address in its body. This supports testing a dedicated Gmail sender. It does not validate a new account, SMTP connection, Supabase mail, or delivery to every recipient.

The dedicated Gmail address is **not yet selected**. Ask for the existing English Hub address or arrange a new free Google account. Do not publish either personal owner Gmail by assumption. The sender would visibly be the dedicated `@gmail.com`, with display name `Tahmid English Hub`; do not disguise it as the domain address.

## Remaining work

1. User signs into or creates the dedicated Google account. Pause at personal password, CAPTCHA, OTP, 2FA or Google authorization screens as the original request requires. Do not invent birth date, phone number or other personal details.
2. Enable user-controlled 2-Step Verification and obtain a separate app password for `English Hub Supabase SMTP` if the account supports app passwords. Supabase custom SMTP uses password authentication; the ordinary Google password must not be used. Keep the secret in the existing private backup directory and Supabase only; never log it.
3. Verify a direct SMTP test to the owner before changing production. Use `smtp.gmail.com`, port 465 with SSL (or 587 with STARTTLS), full dedicated Gmail address as username, its app password, and the same Gmail as the sender. Do not use the Workspace-only SMTP relay. If Google blocks authentication, retain the existing configuration and inspect that exact error rather than weakening account security.
4. Back up current Supabase auth settings privately. Change only the SMTP fields after the direct test passes: host, port, username, password, sender email/name, preserving current rate caps and all other auth settings. Keep confirmations and Google login enabled. Do not remove redirect URLs or change user identities. Keep existing website links initially: the Google diagnostic containing them delivered; a website migration is not established as necessary.
5. Verify actual signup and recovery emails through the existing site and owner-controlled test accounts, their sender, Inbox/Spam placement, links, password change and subsequent sign-in. Earlier Resend-preview link success is not inbox receipt. Preserve the dedicated test student's identity and learning data; do not reset a real student's password or copy secrets to the owner.
6. Set up the dedicated Gmail's incoming forwarding to the private main Gmail, verify it, and choose a safe reply workflow that sends from the dedicated account. Preserve domain `hello@`/`support@` reception. Verify any optional Gmail Send-as capability against Google's current policy, rather than promising its permanence.
7. Add separate owner event notifications only once their sending route works. They may summarize signup/reset/delivery events; they must not contain students' verification/reset URLs, tokens or passwords. Do not call a disabled diagnostic Worker or Teacher Studio status view an implemented email notification system.
8. Save source/configuration evidence and update `WORKING_HANDOFF.md` and the private resume memo. Report remaining failures honestly.

Gmail's published personal-account sending limit is generally 500 emails per day, and accounts may be restricted for excessive failures or unusual activity. This is a small-volume free fallback, not a bulk-mail service or a delivery guarantee. Retain Supabase's current lower 30/hour cap while testing and do not activate paid capacity.

## Primary references

- [Google app passwords and 2-Step Verification](https://support.google.com/accounts/answer/185833?hl=en)
- [Gmail sending limits](https://support.google.com/mail/answer/22839?hl=en)
- [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase Google SMTP troubleshooting](https://supabase.com/docs/guides/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y) — Workspace examples; personal-account behavior still requires a real test.

Supabase's built-in SMTP is not an all-user free replacement: it restricts mail to project-team addresses and is not intended for production use.
