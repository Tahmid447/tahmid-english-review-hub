# Existing English Review Hub — start here

Read `docs/WORKING_HANDOFF.md` before changing this project. It records the active request, release, remaining checks and production database ledger.

This repository is the existing Tahmid English Review Hub, hosted on Cloudflare Pages with the existing Supabase backend and Cloudflare Workers speech service. Preserve the existing project, user identities, assignments, curriculum IDs and source history. Do not recreate the website, reset branches or force-push.

- Current source and Cloudflare production branch: `main`. Create new work branches from current `main`.
- Retained Netlify production branch: `upgrade/review-hub-v9-final-product`. Its old site is retained as an optional backup; the live website no longer depends on Netlify.
- Current production URL: https://tahmidenglishhub.dpdns.org . Read `docs/CLOUDFLARE_DEPLOYMENT.md` for the verified hosting setup.
- Deployment permissions depend on the user's current conversation; do not infer blanket future publishing permission from old release notes.
- Inspect Git status and the live migration ledger before resuming. Local files and Git history survive a Codex account change; browser/CLI logins may need to be renewed.
- Never replay historical migrations in production. Apply only a reviewed forward migration, with a private backup and a matching ledger entry.
- Pronunciation Worker `tahmid-english-speech` builds from the same repository/main. Configuration: `workers/speech/wrangler.jsonc`; endpoint: `https://speech.tahmidenglishhub.dpdns.org/api/natural-speech`. Run `npm run test:speech:cloudflare` for backend changes. Never reintroduce a Netlify fallback.
- Run the checks relevant to the change. `npm test`, `npm run build`, and `npm run verify:voices` describe the normal release checks. Verify real browser playback for audio changes.
- Supabase browser configuration is public; account passwords, service-role keys, personal backups and access tokens must stay outside Git.
- `scripts/admin-query.mjs` uses the existing owner Supabase CLI login in memory. It defaults to read-only and fixes the production project ID deliberately. Treat `--write` as an explicit production operation.
- Keep `docs/WORKING_HANDOFF.md` current at release checkpoints so another chat can resume without Codex's session files.

- Current email system: Cloudflare receives domain aliases; genuine Gmail SMTP sends auth mail and private owner notices. Read `docs/FREE_EMAIL_CONTINUATION.md` and `workers/email-alerts/README.md`. Native Supabase Cron is active; Cloudflare Cron is absent. Never restore the historical failed Resend sender from old handoff sections. The two owner-email migrations are already applied and immutable.
