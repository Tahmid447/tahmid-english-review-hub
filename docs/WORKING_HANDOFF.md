# Working handoff — September 14, 2026

## Interactive Personal Lesson Notes — published and verified

This section is the current notebook task checkpoint; the independent email issue below remains open. Implemented on `codex/interactive-lesson-notes` from verified Cloudflare/main `42a589540cc525358025411d9e5394aec8a3a601`. Runtime checkpoint `596205a`; **production release `2468b2313012e22dc07747bcc35eed5fd9da0fe1`, version 10.6.0**, verified at the custom domain `/release.json` after Cloudflare deployment `d7c9a0b4-a2d4-4b83-b91d-ec958f107140` succeeded (built 2026-09-14T14:51:32.682Z). This final handoff commit changes documentation only. Full 30-point implementation/operation guide: [Interactive Personal Lesson Notes](INTERACTIVE_LESSON_NOTES.md).

**Migration `20260914130000_interactive_lesson_notes.sql` is APPLIED LIVE**, with matching ledger row. Read-only inspection confirmed `review_lesson_notes` exists and `review-lesson-note-assets` is private. This feature is the tenth live ledger entry. A concurrent, independent email task subsequently added **`20260914144000_owner_email_notifications`**; the observed ledger now has **eleven** entries. That migration was not created/applied by this notebook task, is not in this feature branch, and must be preserved and reconciled with its separate source before future database work. Never edit/replay this applied migration; use a new forward migration for any database correction. Existing historical sections mentioning nine entries describe earlier checkpoints.

Private backup: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-14-lesson-notes/before.json`. It includes existing profiles, memberships, assignments, personal cards/favorites, 2 submissions and 2 feedback rows plus progress counts, buckets and ledger. Final notebook tables contain no test notes or images. A single private draft for the existing owner-controlled Email Test account verified real teacher RPC save/reload and pronunciation; it was never published, had no student activity/notification/assets, was backed up to `live-qa-backup.json`, and was removed using an exact ID/title/unpublished/version guard. No real learner was sent lesson content or a notification. The user authorized implementing and publishing this feature to the existing Cloudflare site and supplied a logged-in owner Teacher Studio session.

Validation passed: full `npm test`; the new real PostgreSQL/PGlite suite covers 86 explicit assertions; `npm run build:cloudflare`; `npm run test:cloudflare`; `npm run verify:voices` (480 items, 2112 exact payloads, 32 phonics levels); changed-JavaScript syntax and whitespace checks. No lint/TypeScript configuration exists, so neither is claimed. Cloudflare preview `06af1a5f-749c-4c1b-9669-a1959037aa98` built runtime checkpoint `596205a`.

Local browser QA used synthetic accounts and isolated PostgreSQL/storage only: teacher import/save draft/publish; learner draft invisibility, annotation autosave, existing favorites, proposed correction accepted by teacher, actual multiple-image JPEG/thumbnail uploads, student image attribution, batched teacher inbox, desktop/390px layout, fullscreen image zoom, EN/EN+JP preview, explicitly permitted student block edit and teacher inspection of its previous version with student actor/time/affected block. Restore/reorder/replace/cross-student denial also passed database tests. The native browser confirmation stalled the automation during an optional restore UI check; restore is not claimed as completed through the browser. No physical iPhone or new live student login has been tested.

Final live checks: GitHub/main fast-forwarded normally, Cloudflare custom-domain release SHA verified, signed-in teacher notebook list and inbox loaded without console errors, private draft saved/reloaded through the real Supabase RPC/data layer, and US Ava / UK Libby each reached the shared player's playback-complete status. My Page includes the new Lesson Notes link. Both index and direct detail hard-refresh paths return the private app shell without lesson contents embedded in HTML. Anonymous REST requests to notes/annotations/revisions returned 401. Teacher Student View is the notebook preview workflow; ordinary learner routes use the separate learner session, not a copied teacher session.

Private before/final comparison: all original fields of 5 profiles, 5 memberships, 4 teacher/student relationships, 2 personal cards, 1 favorite, 2 submissions and 2 feedback rows are unchanged (excluding the intentionally new nullable source metadata fields). Learning counts remain 8 answers, 1 attempt, 24 curriculum progress rows. Backups `before.json`, `after.json`, `final.json`, and `live-qa-backup.json` are outside Git. No paid dependency, new secret, public image bucket, DNS/auth setting change or email provider was introduced.

Complete core notebook feature. Known limits: physical iPhone and a fresh real-student production session were not tested; browser student scenarios used isolated synthetic accounts. Notifications are in-app only for this feature; no note email sender was added. The separate email migration observed during this work does not establish notebook-email integration. See the 30-point guide for upload/history/search limits. Optional improvements belong to later requests, not unfinished core implementation.

---

## September 14 evening — receiving verified; outgoing Gmail still blocked

This section supersedes older email status below. The email task is **not complete**. Cloudflare still receives `hello@` and `support@`; production Supabase and Gmail Send-as still use Resend. SMTP2GO is **not** connected to production.

- Fresh owner-controlled incoming tests on September 14 reached the main Gmail Inbox: support at 18:36 JST and hello at 18:44 JST. The main inbox now has an `English Hub` label and a filter applying it to either professional recipient, including the nine matching existing conversations. The filter only labels; it does not archive, delete, mark read or disable spam checks.
- Fresh Gmail support reply at 18:42 JST used the correct verified professional sender but bounced at the alternate owner Gmail. Resend event `50eb4a89-afc4-4eb5-8696-48b6ad3a138b`, SMTP `550 5.7.1` likely unsolicited mail, sending IP `23.251.234.56`. Gmail's Sent folder is not evidence of delivery.
- Sending is not universally broken: event `53b74c3f-c69a-4e99-a643-27567743caba` to the SMTP2GO ticket mailbox was **delivered**. The previous signup/reset Gmail events remain bounced. Repeated unchanged tests will not repair recipient filtering.
- Spamhaus's official checker reported a DBL listing of the shared parent **dpdns.org**. The SMTP2GO mail-tester result `https://mail-tester.com/test-hnmnhy0bl` was 5.1/10, with SPF/DKIM/DMARC and reverse DNS passing, and DBL botnet/phishing URI penalties. These are evidence of a parent reputation problem, not proof that this user's site is compromised or that this is Gmail's exact classifier or SMTP2GO's suspension trigger. Cloudflare's shared website IP is not the SMTP sending IP; do not purchase IP delisting.
- SMTP2GO account 925988 was activated after the user handled verification. Three diagnostic messages preceded its 16:20 JST unusual-activity suspension. No sends after suspension. The provider changed its outbound IP between the two Gmail rejections; neither delivered. The third diagnostic reached mail-tester. The account is on Free (1,000/month, 200/hour per Rick's ticket response), not the earlier unverified 200/day note.
- Existing SMTP2GO ticket 407446 contains the actual bounce/authentication evidence and the 18:24 JST suspension-review request. Sarah's onboarding email and DigitalPlat contact were followed up; Resend already has the support report. Latest mailbox review found acknowledgments but no human remediation. Never evade the suspension or create another SMTP2GO account.
- Independently managed `tahmidenglishhub.com` was available in the logged-in Cloudflare registrar at USD 10.46 initial and USD 10.46/year renewal. No checkout/purchase. User approval is pending because the original request forbids paid purchases without explicit permission. A new domain would remove the shared parent dependency; delivery must still be tested. Keep email providers free and do not migrate DNS or auth origins until the domain decision.

### Teacher-triggered password recovery correction

The teacher's learner reset action incorrectly targeted `/`; it now targets the existing isolated `/reset-password` page. Rejected network requests release the button and report an error. Teacher and learner success copy reports request acceptance without promising inbox delivery. No password, account, auth configuration, migration or learner progress change is involved. Regression coverage executes the real teacher action and checks redirect parity with the learner route, failure cleanup, cancellation and missing email.

Validation: full `npm test`, `npm run build:cloudflare`, `npm run test:cloudflare`, and `npm run verify:voices` passed. Deployment verification follows the source commit. The live database ledger remains nine entries, ending `20260911081000`; do not replay it.

The dedicated test student is an owner-controlled plus-address that reaches the owner's main Gmail. This is appropriate for testing and is not evidence of the delivery failure; another owner Gmail was also rejected. Auth links belong only to the account owner. Do not CC signup/reset secrets to the site owner. Any future owner email notifications must be separate events without those links; automatic event notifications are not yet configured.

Private continuation files, outside Git: `../email-private-backup/email-resume-checkpoint.json`, `EMAIL-SETUP-STATUS.md`, `auth-audit-20260914-evening.json` and `smtp2go-auth-secret.json`. Never print or commit their secret values. The earlier real signup/reset link tests proved application behavior through the authorized provider preview, not Gmail receipt. Preserve the dedicated test user and existing Google owner session.

## September 13 — professional email setup

The user authorized a free professional email system for the existing domain, including live configuration and signup/password-reset tests. Cloudflare Email Routing is active for `hello@tahmidenglishhub.dpdns.org` and `support@tahmidenglishhub.dpdns.org`; both route to the owner's verified private inbox (kept outside Git). Catch-all remains disabled. Resend domain `daece08f-2f31-43f0-9d7e-355c8b2e5898` is verified in Tokyo. Its Free plan allows 100 emails/day and 3,000/month, with paid overages disabled.

Custom SMTP is active in the same Supabase project: `smtp.resend.com:465`, username `resend`, sender `Tahmid English Hub <support@tahmidenglishhub.dpdns.org>`. The domain-restricted sending key is stored only by Supabase. Auth email cap is 30/hour; per-user interval 60 seconds. All 13 existing email template types are branded; source lives in `supabase/email-templates/`, excluded from the website build. Confirmation, Google login, Site URL and redirects remain enabled/unchanged.

The new `/reset-password` page supports email requests and a validated recovery-link password form. Recovery uses a separate in-memory Supabase client, never the learner or teacher persistent session. Passwords are only updated following `PASSWORD_RECOVERY` and a fresh matching server identity check. The page has no analytics or third-party scripts and removes auth URL fragments after consumption. Student and teacher login forms link to it. `npm run test:password-recovery` checks the delayed SDK event, identity changes, validation, expired sessions and cleanup.

At this implementation checkpoint: full existing tests, new recovery tests and Cloudflare build checks passed; public DNS resolves all mail records, and the existing website remains HTTPS 200. Real signup/reset delivery, forwarding receipt and professional replies still require end-to-end verification. No production database migration or user/password write has occurred in this email phase. Do not mark the email task complete on this checkpoint alone.

Google's current official notice says third-party Gmail Send-as ends January 2027 (new configurations may be restricted earlier), while forwarding into Gmail continues. See `https://support.google.com/mail/answer/17101213?hl=en`. Do not promise permanent professional replies through Gmail. Private email audit/rollback files are outside Git in the migration workspace's `email-private-backup` directory.

## September 13 — pronunciation migration

The user explicitly requested removing the Netlify dependency. The native speech transport is in `workers/speech/`, uses Cloudflare WebSocket upgrade, and shares the existing voice contract. The custom endpoint is `https://speech.tahmidenglishhub.dpdns.org/api/natural-speech`. Cloudflare Worker Builds is connected to this same repository/main, with `npm run test:speech:cloudflare` and `npm run deploy:speech`. Preview Worker builds are disabled; Pages preview builds remain enabled. No Supabase changes or database writes are needed for this phase. See `docs/CLOUDFLARE_DEPLOYMENT.md`.

## Current production

The existing website has moved to **https://tahmidenglishhub.dpdns.org**, hosted on Cloudflare Pages project **tahmid-english-hub**. **`main` is now the source and automatic production branch.** Start new work from current `main`; the historical branch names below describe earlier releases.

Read [Cloudflare deployment](CLOUDFLARE_DEPLOYMENT.md) for exact build settings, DNS, authentication, recovery and verification limits. Build command `npm run build:cloudflare`, output `dist`, Node 22. `/release.json` identifies the live source commit and public cache version.

GitHub history was preserved by fast-forwarding the old `main` baseline. The original checkout on `codex/structured-learning-hub` and Netlify production branch `upgrade/review-hub-v9-final-product` were retained. Netlify still serves the unchanged old site as an optional historical backup. Pronunciation has moved to Cloudflare Worker `tahmid-english-speech`, with the same three voices and no Netlify fallback.

Supabase project, identities, data and migration ledger remain unchanged. Only auth Site URL/redirect additions and the two exact membership CORS origins changed. Google login, teacher reads, private recording playback, logout and a reversible owner-profile database save were tested on the new domain. User chose owner preview for practice: grading/reload passed, but existing teacher-exclusion policies prevent official student-attempt writes from owner preview. Do not claim a new real-student result write was verified.

All prior local tests plus live anonymous-access protection passed. No production database migration was run. Owner profile test text was restored. No student result, submission or feedback was edited.

The user authorized this migration and public deployment in this conversation. Future tasks require their own scope and authorization.

---

# Historical handoff — September 11 release

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
