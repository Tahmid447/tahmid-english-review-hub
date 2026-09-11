# Working handoff — 2026-09-11 complete

This is the existing Tahmid English Review Hub. Read this file and `AGENTS.md` before continuing. Do not recreate the site, reset branches, force-push or replay historical migrations.

## Verified production and recovery

- Repository: https://github.com/Tahmid447/tahmid-english-review-hub
- Working branch: `codex/structured-learning-hub`
- Netlify production branch: `upgrade/review-hub-v9-final-product`
- Production: https://tahmid-english-review-hub.netlify.app
- **Verified release 10.5.1: `abf447a1c547b5a65b829a8678d58572cdd546c5`**; built 2026-09-11T08:47:44.837Z. `/release.json` confirms the source. Asset query `20260911-mobile2`, cache `te-review-public-v29`.
- Working branch may contain this final documentation checkpoint beyond the deployed source. No runtime changes are in that documentation-only commit.
- Netlify site `f30d0264-70d0-4234-83ec-c717fa428f99`, team `tahmidbdjp`; Supabase `ycmybggetemkhorkhfnf`.
- Deploy through the existing Git production branch. The Netlify CLI can be logged into a different account; do not relink/create a site.
- Codex account/credit interruptions did not remove the checkout. A recovery checkpoint was pushed before finishing. Inspect Git status and this handoff in a new chat; logins may need renewal, but never copy/mint session credentials to impersonate another user.
- The user authorized this work and public deployment. Future changes need authorization from their own conversation.

## September 11 — all six requested changes implemented

1. **Mobile My Page overlap:** shared fixed/sticky header height overrode member styles. Member headers now have natural height and a two-column mobile nav; photos stay below the navigation. Desktop layout remains flexible.
2. **Photo uploads:** new photos encode as JPEG, not a required WebP encoder. Up to 20MB input, square crop up to 384px, max 100KB output. Legacy WebP references still work. Native HEIC decoding is accepted where available; unreadable formats show JPEG/PNG guidance. Render identity prevents an older image request from replacing a newer/removed photo.
3. **Teacher recording playback:** inline private audio player replaces asynchronous `window.open`, which Safari blocked as a popup. User can replay or renew the signed URL in the same page.
4. **Clearer submissions:** Submissions is near the start of navigation with a waiting count; queue appears before collapsed task management. Filters: status, learner, speaking/writing. Learner details link directly to that learner's queue. Filter label text is in leaf spans so teacher-language rendering cannot erase the select controls.
5. **Rating scroll:** level strip scroll is horizontal only. Hard/Good/Easy update the existing card rather than replacing it; open examples and current position persist. Applies to the shared Words/Phrases/Phonics interface.
6. **Teacher voice feedback:** record, stop, preview, re-record/remove or choose an audio file. Limit 180 seconds / 5MB. Voice-only or combined text/voice review; private drafts stay private, Publish/Return makes it available to the intended learner. The learner hears it in the original lesson's feedback area. Page changes/sign-out release recording tracks. Native browser encoder is used: forcing advertised AAC support produced empty recordings in the Chromium test environment.

Guide: `docs/RELEASE_2026-09-11.md`.

## Database — already applied; never replay

**`20260911081000_mobile_profiles_and_voice_feedback.sql` is APPLIED LIVE with matching migration-ledger entry.** Do not edit the applied file.

Adds JPEG avatar paths/MIME alongside WebP, feedback audio path/duration columns, private `review-feedback-recordings` storage and `review_save_submission_review_with_audio`. Audio is bound to an active assigned teacher and exact submitted work. No overwrite of an existing audio object; deleting attached audio is denied. Published audio is readable only by the intended learner with homework enabled. Uploads are capped at 4 stored objects per teacher/submission; the UI cleans superseded/uncommitted files. Existing six-argument text-review RPC remains compatible.

The previous **`20260910070630_learner_my_page.sql`** is also already applied. It added avatars, lesson/question favorites, individual practice cards and owner preview permissions. Historical repository migrations precede those, including campaign migrations `20260908080538` and `20260908082230`. The live ledger uses a consolidated history: inspect the live versions instead of assuming every old repository file has a ledger row.

Private backups, outside Git:
- `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-11-voice-feedback/before.json`
- `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-11-voice-feedback/after.json`
- Previous: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-10-my-page/before.json`

Before/after comparison confirmed all original fields of **2 learner submissions and 1 feedback row unchanged**. No learner progress was modified or erased. The owner preview's temporary public-logo photo was removed; final avatar object count was zero. No sample voice feedback or announcement was sent to real learners.

`scripts/admin-query.mjs` uses the existing Supabase CLI keychain login in memory. Read-only by default. Syntax: `node scripts/admin-query.mjs /tmp/query.sql [--write] [--out=/private/result.json]`; use the equals sign for `--out` to suppress data output. It does not create parent directories. Only `--write` permits mutations. Management API returns the final SQL statement result. Do not retry `supabase db query --linked`, which previously failed create-login-role privileges.

## Verification

- Full `npm test` passed, including PostgreSQL/PGlite access boundaries, voice draft/publish/return/replace/cleanup, photo encoder behavior and existing learning/teacher regressions. Final filter patch additionally passed teacher i18n, learner platform and demo checks. Production build passed.
- Live owner-preview photo upload stored a 384px JPEG; image rendered, persisted after reload, then was removed to restore the account.
- Live teacher player finished the existing 7.937-second learner recording, `ended=true`, without a popup or console error.
- Live status/type filters changed results correctly and were restored to Waiting for review / All work.
- Member layout at 390px had no horizontal overflow; navigation bottom was above header bottom and avatar began 35px after the header. Desktop 1280px layout had a 1180px main region and correctly separated profile columns.
- Local generated-audio fixture confirmed real MediaRecorder recording, preview playback, bounded upload metadata and track shutdown. It never accessed the physical microphone or Supabase. Native recording output was WebM/Opus in this browser.
- Local isolated learner demo confirmed Hard and Easy updates with the card top unchanged at -617.078px and examples still open. Demo data adapters mean no production progress was written.
- **Limits:** no actual teacher microphone speech was recorded/published and no fresh real-student login or physical iPhone test was performed. The user was asked to log into the in-app browser as the test learner; no reply received. Signed-in production checks used the server-verified owner preview; student boundaries were exercised in PostgreSQL tests.

Development-only `scripts/qa-mobile-feedback.html` uses generated tones and an in-memory upload store, restricted to localhost and excluded from the public build. `demo/student-visibility.js` now exports the boundary copy expected by the current shared learner page. Temporary QA tabs can be closed. Reset viewport overrides before handoff.

## Prior September 10 features retained

Guide: `docs/RELEASE_2026-09-10.md`. Home portal, 31-lesson metadata catalogue, categorized favorites including exact questions, profile/announcements, teacher personal cards with optional Ava/Libby voice, campaign display, Japanese lesson choices, choice pronunciation and account-persistent BGM remain.

Speech uses the existing Netlify `/.netlify/functions/natural-speech` with pinned `edge-tts-universal` 1.4.0. US Ava `en-US-AvaNeural`, UK Libby `en-GB-LibbyNeural`, Japanese Nanami; no device-voice substitution. Safari reuses a tap-unlocked element. Bounded chunking/timeouts and per-account/voice/text cache (7 days, 8MB/160 clips). The historical Supabase speech endpoint remains deployed but is no longer used by the current frontend. The September 11 work did not change TTS synthesis.

Catalogue is metadata-only; individual lessons load only their own content with concurrent independent reads and identity guards. SDK is locally served. Public service-worker cache excludes private APIs, photos and audio responses. BGM settings have cloud persistence and pending-save recovery; explicit OFF is retained. New accounts default ON subject to browser gesture rules.

Owner preview: `/my-page?owner_preview=1`, backed by the existing teacher session and `review_is_site_owner`. Supported learning links retain the flag. Normal student/Home authentication remains separate. No session credentials are copied.

Sep 10 database footprint was 19MB; monthly transfer/invocation quotas were not measured. No recurring purge exists; deleting progress does not reset monthly quotas. Existing membership/assignment/visibility settings were preserved. Do not restore stale Sep 6 learner access values from old notes.
