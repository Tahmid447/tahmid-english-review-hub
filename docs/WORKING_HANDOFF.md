# September 11 work in progress — resume here

The user authorized continuing after a credit/account interruption. The SIX current requests are: mobile My Page header overlap, failed photo uploads, teacher playback blocked by popups, accessible submission queue, rating-induced scroll jumps, and recorded teacher voice feedback.

- Production is still **10.4.1 / 55a4b63747caaa62e203c8485c5fc4f83df7bdf1**; September 11 changes are local and not deployed yet.
- Implemented: responsive member header; JPEG avatar compression with legacy WebP reads; rating updates preserve card DOM and level strip scroll stays horizontal; inline private audio players; queue first with status/learner/type filters and early navigation tab; 3-minute teacher recorder + file attachment, private draft/publish/return voice feedback.
- New migration `20260911081000_mobile_profiles_and_voice_feedback.sql` **NOT applied live yet**. It extends avatar MIME/path policies and adds private feedback storage plus validated atomic review RPC. Existing migration files untouched.
- Private backup: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-11-voice-feedback/before.json`. Management helper syntax is `--out=/absolute/path.json` (with equals).
- PostgreSQL/PGlite tests passed, including draft privacy, cross-account rejection, publish/return, replacement and cleanup. Full suite passed before the final photo URL-race cleanup; `scripts/test-profile-photos.mjs` passes the JPEG compatibility case. Need final build and checks.
- Mobile local My Page checked at 390px: no horizontal overflow; header ends 178px, avatar begins 213px.
- `scripts/qa-mobile-feedback.html` is a LOOPBACK-ONLY development fixture, excluded from the build. Its microphone returns generated audio and its upload client is in-memory; it never records the user's microphone. Browser test started but the temporary tab disappeared when a new user message arrived. Reopen and finish record/stop/preview/upload/dispose, plus photo conversion.
- Teacher own production preview photo was temporarily set to the public site logo, then removed. Verify it remains cleared. No student progress or submissions were changed during QA.
- User was asked to log into the in-app production browser as the test learner. Reply pending. Teacher preview login remains available; do not request passwords or copy session credentials.
- Remaining: finish component/browser checks; apply ONLY the new migration with matching ledger row; bump cache/query/version; build; commit/push working + production branch; verify `/release.json`; check live teacher recording and upload/profile on mobile. Never publish a fake feedback message or test audio to a real learner.

---

# Working handoff — 2026-09-10

This is the existing Tahmid English Review Hub. Read this file before continuing in a new Codex chat. Do not recreate the site or replay historical migrations.

## Source, production and recovery

- Repository: https://github.com/Tahmid447/tahmid-english-review-hub
- Working branch: `codex/structured-learning-hub`
- Production branch: `upgrade/review-hub-v9-final-product` (Netlify builds pushes)
- Site: https://tahmid-english-review-hub.netlify.app
- Netlify site ID: `f30d0264-70d0-4234-83ec-c717fa428f99`, team `tahmidbdjp`
- Supabase: `ycmybggetemkhorkhfnf`
- Release sequence: 10.2.0 `95fc29ab62f1015fa4a6bcdb3d644293fcfda107` → audio hotfix 10.3.0 `9a16ec1ae1b707d4e040352e359e528d9017d168` → member features 10.4.0 `a29dbf753b900c9cb14cc018baff9c23465589db` → final loading refinement 10.4.1 in this checkpoint.
- Check production `/release.json` for the exact deployed SHA. Final assets: `20260910-member2`, cache `te-review-public-v27`, package 10.4.1.
- User authorized this Sep 10 implementation and production publishing. Future permissions must come from the new conversation. Never force-push/reset or create another Netlify site.
- Existing Netlify CLI login can belong to a different account. Use the established Git production branch.
- Codex account/session changes do not delete this checkout or GitHub history. Logins may need renewal. Inspect Git status before resuming; preserve uncommitted work.
- Credentials and private backups stay outside Git.

## Completed requests

- [x] Reliable US Ava / UK Libby endpoint; actual browser playback completion checked for both.
- [x] Japanese choices and click-to-pronounce controls in BOTH lesson settings panels, independent of interface language.
- [x] Clear red reference-price and discount badges on all paid plans. Reference is accurately labelled as the post-campaign price, not an invented past selling price.
- [x] Lighter home portal and `/lessons` with 31 metadata-only cards; home link opens a new tab.
- [x] `/my-page`: name/goal edits, compact private photo visible to assigned teacher, announcements/detail, personal cards and searchable categorized favorites.
- [x] Favorites: Words, Phrases, Phonics, phrasebook, whole lessons, exact questions and teacher personal cards.
- [x] Teacher personal words/phrases/sentences/notes for one learner; optional US/UK audio; edit/hide/re-show without leaving the learner dialog.
- [x] BGM on/off/track/volume account persistence, pending-save recovery, explicit OFF preserved; new accounts default ON subject to browser gesture requirements.
- [x] Softer click/correct/retry/completion sounds.
- [x] Server-verified owner preview from Teacher Studio, without copying credentials or expanding other teachers' access.
- [x] Reduced data transfer, inspected DB size, retained all learner progress.
- [x] GitHub recovery instructions, full tests/build and live browser verification.

## Database — already applied; do not replay

Ledger: 001–027, `20260908080538_experience_campaigns`, `20260908082230_campaign_save_scope`, **`20260910070630_learner_my_page`**. Last migration applied live with its matching ledger entry on Sep 10. Do not edit the applied file.

Adds private `review-avatars` policies, validated lesson/question favorites, personal cards/favorites, immutable student/teacher targets and verified-owner own settings/preview activity permissions. Avatar uses one fixed WebP path per account, max 100KB, short-lived signed reads.

Private backup: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-10-my-page/before.json`.

Live DB measured **19MB**. Monthly transfer/invocation usage was not measured; deleting records does not reset those quotas. No progress deletion or recurring purge was installed. Sep 10 both existing paid learners had 31 assignments and all 12 feature flags; their active memberships were preserved. Older Sep 6 summaries with fewer assignments/features are stale; never restore them automatically.

`scripts/admin-query.mjs` uses the existing Supabase CLI owner's macOS keychain login in memory, read-only by default. SQL file required; `--out` writes chmod-600 results; `--write` is an explicit production mutation. Management API returns only the final SQL statement result. `supabase db query --linked` was unusable due to create-login-role privileges; do not repeat it as the migration strategy.

## Audio, performance and preferences

- Current browser speech: `/.netlify/functions/natural-speech`, pinned `edge-tts-universal` 1.4.0. Historical Supabase endpoint produced 502 after ~12.8s and remains untouched; current code uses Netlify.
- Exact voices: US `en-US-AvaNeural`, UK `en-GB-LibbyNeural`, JP `ja-JP-NanamiNeural`. No device voice substitution. Safari reuses a tap-unlocked audio element. Long-text chunking, bounded timeout/retry, account/voice/text cache: 7 days, 8MB/160 clips.
- No Supabase authorization is sent to the Netlify speech endpoint; response is private/no-store. Signed photos and private API/audio responses are excluded from public service worker caches.
- Catalogue fetches only metadata; opened lesson fetches only its own questions. Independent profile/question/teaser and preference/content reads run concurrently with auth-change guards.
- One public metadata sample: 31 rows, 14,329 bytes, 665ms. Not a universal loading-time guarantee.
- Supabase SDK 2.57.4 served locally with MIT licence. Minimal service worker prefetch; local dev unregisters stale workers.
- Account preferences use pending-save recovery and small settings POST keepalive to survive fast navigation/offline retries. Remote preferences sync other signed-in browsers.
- `/my-page?owner_preview=1` reuses the teacher session only on supported learning routes after `review_is_site_owner` confirms identity. Normal Home/student auth stays separate. Internal supported links carry the preview flag.

## Verification and practical limits

- `npm test` passed: content/teacher/learner regression checks, real PostgreSQL/PGlite access policy tests, pending preference recovery and owner identity tests.
- `npm run build` passed. `npm run verify:voices` checked 480 curriculum items and 2,112 audio payload contracts.
- Production browser: US/UK library audio completed; owner My Page loaded; unchanged profile saved; existing announcement detail opened; lesson/question favorites saved and exact question reopened. Both temporary owner favorites were removed. No test card or announcement was sent to real learners.
- Local browser: both lesson settings panels, Japanese choices with English UI, US/UK choice playback completion, OFF/track after reload, desktop and phone layouts.
- Production BGM OFF and a changed track survived reload; original Windswept/OFF selection restored afterwards.
- Teacher personal-card controls inspected live without console errors. Card create/edit/hide/favorite, learner isolation and avatar policies tested in isolated PostgreSQL.
- Fresh real-student login and actual photo upload round-trip were not performed. Owner preview supplied signed-in UI checks. Playback completion/exact identities were verified, not human listening-quality certification.

User guide: `docs/RELEASE_2026-09-10.md`.
