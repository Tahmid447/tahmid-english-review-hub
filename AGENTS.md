# Existing English Review Hub — start here

Read `docs/WORKING_HANDOFF.md` before changing this project. It records the active request, release, remaining checks and production database ledger.

This repository is the existing Tahmid English Review Hub, hosted on Netlify with Supabase. Preserve the existing project, user identities, assignments, curriculum IDs and source history. Do not recreate the website, reset branches or force-push.

- Working branch: `codex/structured-learning-hub`.
- Production branch: `upgrade/review-hub-v9-final-product` (Netlify builds pushes).
- Deployment permissions depend on the user's current conversation; do not infer blanket future publishing permission from old release notes.
- Inspect Git status and the live migration ledger before resuming. Local files and Git history survive a Codex account change; browser/CLI logins may need to be renewed.
- Never replay historical migrations in production. Apply only a reviewed forward migration, with a private backup and a matching ledger entry.
- Run the checks relevant to the change. `npm test`, `npm run build`, and `npm run verify:voices` describe the normal release checks. Verify real browser playback for audio changes.
- Supabase browser configuration is public; account passwords, service-role keys, personal backups and access tokens must stay outside Git.
- `scripts/admin-query.mjs` uses the existing owner Supabase CLI login in memory. It defaults to read-only and fixes the production project ID deliberately. Treat `--write` as an explicit production operation.
- Keep `docs/WORKING_HANDOFF.md` current at release checkpoints so another chat can resume without Codex's session files.
