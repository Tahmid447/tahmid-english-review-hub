# Cloudflare Pages deployment — September 13, 2026

The existing website is live at https://tahmidenglishhub.dpdns.org with HTTPS. GitHub integration builds the existing repository. Supabase and the Netlify pronunciation backend are retained.

## Project and publishing

- Repository: https://github.com/Tahmid447/tahmid-english-review-hub
- Production branch: `main`; automatic production deployments enabled.
- Cloudflare Pages project: `tahmid-english-hub`.
- Pages address: https://tahmid-english-hub.pages.dev
- Dashboard: https://dash.cloudflare.com/e8f1eea5d1c73f3cbc307d71f0a98ca9/pages/view/tahmid-english-hub
- Framework: None; root: repository root; build: `npm run build:cloudflare`; output: `dist`; Node: 22 via `.node-version`.
- Cloudflare account and domain use Free plans. No paid service was purchased.

`main` was advanced normally from the original baseline to the verified current source, preserving every ancestor. No branch reset or force-push was used. The preparation branch `codex/cloudflare-pages-migration` remains available. The old Netlify production branch `upgrade/review-hub-v9-final-product` is unchanged.

The user authorized and completed the official Cloudflare Workers and Pages GitHub App installation with all-repository access. This Pages project selects only `Tahmid447/tahmid-english-review-hub` as its build source.

## Domain and HTTPS

DigitalPlat remains the registrar for `tahmidenglishhub.dpdns.org`. Cloudflare Pages explicitly required Cloudflare DNS for this registered apex domain. DigitalPlat had no website or email records to preserve. Its external nameservers are now:

- `kolton.ns.cloudflare.com`
- `sue.ns.cloudflare.com`

Cloudflare zone `7128466a332f4e64f5be0dc9914713f9` contains a proxied root CNAME to `tahmid-english-hub.pages.dev`. The Pages custom domain is attached. Both Google and Cloudflare public DNS returned the assigned nameservers, and the custom URL passed HTTPS certificate validation and returned the expected release. Domain registration currently expires September 12, 2027; DigitalPlat states free renewal is available within 120 days of expiry.

## Supabase and secrets

The existing project `ycmybggetemkhorkhfnf` remains authoritative for users, Google/email authentication, Postgres, private storage, membership and progress. No database migrations were applied and no users or student records were removed.

The Site URL is `https://tahmidenglishhub.dpdns.org`. Added `https://tahmidenglishhub.dpdns.org/**` and `https://tahmid-english-hub.pages.dev/**` to allowed redirects, preserving every previous entry. The Google callback remains `https://ycmybggetemkhorkhfnf.supabase.co/auth/v1/callback`; no Google OAuth client replacement was needed.

The deployed `membership-access` source was downloaded privately and compared byte-for-byte with the repository before changing it. Only the two new exact origins were added to its CORS allowlist. It was deployed to the same project, retaining its existing JWT configuration and explicit server-side identity/teacher checks. Old Netlify origins still work; an unrelated origin is not permitted.

`src/config.js` contains the public Supabase URL and anon key only. No private Cloudflare build variables are required. Optional overrides are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, supplied together under Pages Settings → Variables and secrets. The importer rejects service-role/secret keys. Never put private keys, database passwords or login tokens into frontend files, logs, or Git.

## Keep the Netlify speech service

The Cloudflare build uses `https://tahmid-english-review-hub.netlify.app/.netlify/functions/natural-speech`. Direct browser requests preserve Netlify's per-client rate limiting and send the speech text and fixed voice profile, without a Supabase key, user session or cookie. Audio responses remain private/no-store and play through Blob URLs.

**Netlify remains required for pronunciation as well as rollback.** Do not remove it. Moving the Node/WebSocket speech service is separate work requiring live Ava, Libby and Nanami verification. The historical Supabase speech function remains unused.

## Verification and limits

- Full local application tests, voice-contract checks, Cloudflare build/output checks and local Pages routing checks passed.
- Live HTTPS, homepage layout/assets, lessons, My Page, teacher login, aliases, nested lesson refreshes and query-preserving Google returns passed. Unknown routes return a real 404.
- Google login with the existing owner account succeeded on both Pages and the custom domain. The final-domain Teacher Studio loaded its existing learners, 31 lessons, 24 phrase repetitions and two reviewed submissions. A private learner recording played to `ended=true` at 7.937 seconds.
- Pronunciation playback completed through the live UI. US Ava, UK Libby and Japanese Nanami service responses had already passed live voice-contract/MP3 checks.
- The user selected owner preview for practice testing. A one-question exercise scored 1/1 and survived reload. A temporary learning-goal change saved to Supabase, survived reload, and was restored to its original empty value. A read-only server query confirmed restoration.
- Owner preview cannot persist official student attempts: existing database policies intentionally exclude teachers from those writes. No fresh real-student login or official student-result write was attempted. This is a verification limit, not evidence of a new migration failure. Existing learner data remains available.
- Logout returned to the protected sign-in form. The tested production pages had no captured browser warning/error logs.
- Live anonymous-access checks passed: 31 lesson metadata rows, two free previews, expected free activities, and 28 protected resources rejecting anonymous reads.
- Aggregate data counts and migration ledger matched the pre-migration baseline after deployment. Only the reversible owner profile test was written; no student submission/feedback was edited.
- Initial automatic-update proof: commit `c569b0b1de14af4b69b5ba83b6c808303620a0f8` created deployment `e1f3ee05-d77e-4564-bf14-ae396c98eaf7`, and its new footer text and release ID appeared on the custom domain. The final `main` publishing configuration is also verified before task completion.

`/release.json` records the actual source commit and hosting platform. Every build stamps the public service-worker cache with the commit so normal updates invalidate cached code. The build preserves clean multi-page routes and required aliases without a blanket single-page fallback.

## Recovery and future work

The original Netlify website remains https://tahmid-english-review-hub.netlify.app at commit `abf447a1c547b5a65b829a8678d58572cdd546c5`; its source branch is unchanged. A verified full-history Git bundle, original auth URLs, deployed membership-function body/source and aggregate data baseline are stored privately outside Git in the migration workspace's `private-backup` directory. These are not a full database backup. The existing Netlify account could read site/deployment metadata but not every environment detail; no secret values were copied.

For a bad frontend update, revert the relevant Git commit on `main` and push, or use a known successful Pages deployment rollback. Keep the old Netlify auth redirects and speech function. Database rollback is neither needed nor included in this frontend migration.

To edit: change the file → commit and push to `main` → Cloudflare builds and publishes automatically. No ZIP upload. Future development should start from current `main`, preserve the existing Supabase project, and use its own user authorization.
