# Working handoff — September 16, 2026

## September 16 - Import / image publication blockers

Release preparation on `codex/import-publish-blockers`, based on verified GitHub main `35a4f81`. Existing production runtime is `232bd6540e647a6bec70a39297ac3eb4753950b0`, deployment `4604f8d7-45cf-4b84-8494-be3f255c09c3`. Use the existing main-to-Cloudflare Pages flow only.

Actual production reproduction: a saved Draft ignored explicit imported September 13 because opening it marked its date as manually touched. Editing two image captions caused each Save to reject the other pending image, blocking cover/publication; switching tabs incorrectly said all changes were saved. The owner-controlled Email Gmail Test fixture is `01b966af-aa48-4fff-a4bf-c976bcf974f3`, still a private Draft. No real learner note was edited.

Focused fixes: protect dates only after manual edits in the current editor session; show Current/Imported dates. Save one image independently while preserving other pending edits and display save/error status beside the image. Default image title/alt to the lesson title, type Infographic and caption blank, with optional Edit image details. Quick Practice is one initially closed group with directly visible questions when expanded, retaining original block IDs/question snapshots and Open/Close all.

Production already had hash-stamped entry modules and the image chooser was visible in the reproduced session; the historical missing chooser is not independently reproduced. Confirmed cache gaps were bare imports such as note-import-images.js and learning-overview.css. Build now stamps all local module/HTML JS/CSS references and CSS imports with the release SHA. Revalidate /src assets and do not store protected HTML. Normal navigation/reload receives the release; do not forcibly reload an editor with unsaved work.

Passed notebook/practice/workflow/duplicate PostgreSQL/RLS and reading/import suites, syntax, Cloudflare build and all 86 public-text-asset checks. Isolated browser A-K passed: saved Draft date import, two queued images/defaults/cover, Save Draft, simultaneous image edits saved individually and persisted after reload, cover persisted, folded practice/full images, Publish and actual synthetic Student B view, 390px no overflow, clean successful-flow console. Manual-date protection and a deliberate two-tab NOTE_CONFLICT also passed: error is inline and pending input is retained.

No migration, SQL write, auth/RLS, DNS, email, voice or hosting change. Fresh pre-QA private row checkpoint: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-16-import-publish-fix/before.json`; existing storage/deployment recovery remains. After publication, run exact A-K on an owner-controlled test learner and compare all original rows to this snapshot. Local isolated preview is http://127.0.0.1:4180/teacher?studio=notes (PID 49496, /tmp/tahmid-import-fix-qa.log).

Production release identity and final A-K results will be recorded after deployment.

---

## September 16 - Reading and Quick Import improvements published

**Complete and live:** runtime commit `232bd6540e647a6bec70a39297ac3eb4753950b0`, existing Cloudflare Pages production deployment `4604f8d7-45cf-4b84-8494-be3f255c09c3`, built `2026-09-16T11:56:55.041Z`. Custom-domain `/release.json` and loaded JS module versions match. Branch `codex/lesson-reading-import` fast-forwarded existing GitHub main from `afa3cd6`, preserving prior releases. The user explicitly authorized implementation and publication in this task. No new hosting, database migration, auth, email, DNS or voice change was made.

Production smoke passed: home/Teacher/My Page/Notes HTTP 200; signed-in Teacher cards show actual private cover images at full card width, progress counts and existing notes; Quick Import image input and editable parsed date render with all existing-field overwrite checkboxes OFF. Cancelled without applying/saving/uploading. Existing note Student View renders section navigation and folded support/practice content. Owner My Page renders saved-phrase/Notes shortcuts; Teacher and My Page at 390px have no horizontal overflow. Captured production console errors are empty. Anonymous profiles/notes/practice/assets/personal-card queries and overview RPC all return 401. Read-only fingerprints of **all 50 existing review/storage tables match exactly before and after publication/smoke**. No production data or storage write was performed. Final documentation-only checkpoint uses `[CI Skip]`; runtime remains the implementation SHA above.

Implemented full-width 16:9 cover images on note cards while retaining whole-image detail/zoom; editable Quick Import lesson-date extraction (ISO, Japanese and English dates; ambiguous numeric dates require review); existing/manual metadata remains protected by per-field overwrite choices. The untouched default date of a new draft accepts the imported date. Existing deterministic title/introduction/focus/topics suggestions and block editing remain. Practice import recognizes natural-English correction, short free response and self-check aliases.

Quick Import stages up to six PNG/JPEG/WebP files with editable filename-based title/alt and lesson-caption defaults plus cover selection. Nothing is uploaded until Save/Publish. Existing private upload/order/version APIs are reused; a new note stays draft until uploads finish. A partially failed upload retains queued files and skips already successful uploads when retried on the same open page. If the initial text save fails, unsaved text is retained instead of reloading it. The existing Images tab and Duplicate for learner flow remain available. Files are not persisted across navigation/reload before upload; follow the visible save/unsaved-work warnings. No AI image analysis is claimed.

Student notes keep Focus/key phrases/main corrections/grammar visible, with practice, extra examples, Japanese support, tips and comparison/nuance folded. Section jumps expand their target; Open/Close all retains answers and does not reveal model answers. Back to top appears after scrolling. Existing practice rows provide completed/last-practiced/simple-score state, and weak-point links resolve to the current question snapshot. My Page adds continue/weak-point/latest-note actions and saved-phrase shortcuts. Teacher cards show progress/update/suggestion counts and direct Images/Progress actions; existing archive/draft/Trash/duplicate operations are preserved.

Passed relevant notebook/practice/workflow/duplicate PostgreSQL/RLS suites, new reading/import tests, My Page suite, JS syntax, whitespace checks and Cloudflare build/output checks (86 public text assets). Final error-path guard was syntax-checked and focused tests rerun. Isolated browser QA: text/date/six practice types/image metadata/cover imported, saved as draft and published to synthetic Student B; image remains fully visible, incorrect answer produces weak-point navigation, input survives Open/Close all, and no captured console errors. Desktop and 390px import/reader/My Page have no horizontal overflow. Back-to-top reaches the header. Physical-phone and fresh actual-student production login are not claimed.

Synthetic local preview: http://127.0.0.1:4179/teacher?studio=notes (PID 43511; `/tmp/tahmid-reading-import-qa.log`). Restart with `NOTE_QA_PORT=4179 NOTE_QA_WORKFLOW=1 node scripts/serve-notes-qa.mjs`. This is isolated in-memory PostgreSQL/storage, not production. Existing previews were left alone. Production ledger remains 14 entries through `20260915230000`, verified read-only; no applied SQL is changed. Existing private checkpoint `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-16-workflow-release/before.json` is readable, prior successful Pages deployment is available for frontend rollback, and 50 current production table fingerprints were captured before release for comparison. Do not replay migrations.

---

## September 16 - Duplicate for learner published

User-approved production deployment is complete. Exact runtime/implementation commit `5b8c5d67b4b299b0668571df92ddc671be072734` was fast-forwarded from `12e5c29` onto the existing GitHub `main`. Existing Cloudflare Pages project `tahmid-english-hub` built production deployment `dc88a141-e149-4b4a-91b1-be1ef4fb3df7`; custom-domain `/release.json` matches this exact SHA, built `2026-09-16T08:55:20.894Z`. Version remains 10.8.0; no implementation or release metadata was changed before publishing.

Reused all successful local tests/build/browser checks below. Only production release identity, deployment status and lightweight live smoke were checked: home, Teacher Notes and learner Notes HTTP 200; signed-in Teacher Notes list, Duplicate for learner and destination selector render. Dialog cancelled without preparing or saving a copy. Fresh production tab has no captured console errors. The pre-existing tab had old-release refresh/network errors at navigation; these were not reproduced in the fresh release tab.

No database/storage write, migration, learner-state mutation, auth/email/DNS/hosting change or force push was performed. Existing private checkpoint remains readable and prior successful Pages deployment remains available for frontend recovery. Public verification URL: https://tahmidenglishhub.dpdns.org/teacher?studio=notes . New docs-only checkpoint uses `[CI Skip]`; runtime stays the exact implementation SHA above.

---

## Historical checkpoint - Duplicate for learner verified locally before publication

Focused implementation commit: `5b8c5d67b4b299b0668571df92ddc671be072734`, branch `codex/duplicate-for-learner`, based on current `origin/main` / `12e5c29`. No push, deployment or production write. Production remains the 10.8.0 release below. The latest request authorized this enhancement, not another production deployment.

List contextual menu and saved-note editor now offer **Duplicate for learner**. Choose an authorized learner, then review a new unsaved draft in the existing editor. Learner and lesson date remain editable before its first save; date defaults to today. Metadata, all teaching/practice definitions, formatting/order, permissions and ready teacher images are copied. Blocks/questions receive new IDs. No source note/student identity, publication state, learner activity, personal cards, student attachments, notifications or history are copied. New save/image operations create their own normal audit rows.

On first Save Draft or Publish, the existing RPC creates a private draft and existing asset reserve/upload/finish/order APIs copy the original full image and thumbnail bytes to new learner/note-specific private paths. Cover/block references are remapped. No source asset IDs enter persisted copy content, even on image failure. Publication occurs only after copying finishes. The staged Images tab allows caption/title/alt/cover edits and removal; normal upload/replace controls are available after the first draft save. If a copy fails, its partial draft is opened with an explicit warning; inspect/re-upload missing images and reselect them before publishing. There is no automatic cross-session image-copy resume. The copied-from notice is transient; no source-reference schema was added.

**No migration needed.** Read-only live check: 14 ledger entries, latest `20260915230000` recorded source MD5 `70ebb592a797d05b5a9cf0febea64c97`; overview remains security-invoker, authenticated allowed and anonymous denied. Existing SQL, policies, storage bucket, auth/email/voice and production data are unchanged.

Passed `npm run test:lesson-notes` (86 original checks, 68 practice checks, workflow and new duplicate suite), changed JS syntax, `git diff --check`, `npm run build:cloudflare`, and `npm run test:cloudflare` (85 public text assets). New API tests use the unchanged migrations/RPCs with real PostgreSQL/PGlite and RLS: A-to-B draft/edit/publish, all model block/practice definitions and fresh IDs, exact unchanged source/detail/activity, student attachment exclusion, private full/thumbnail bytes and paths, order/cover/block remapping, cross-account/anonymous denial, upload failure cleanup and text-only copies. Reused prior whole-site/voice QA; no exhaustive repetition.

Local browser smoke passed list action, learner switch, unsaved draft, title/caption editing, first save, teacher-image display from destination path, editor action/cancel, publish and Student View. At 390px, dialog width 366px and document width 390px; captured console errors empty. Physical phone/new production student login were not tested. Synthetic QA preview: http://127.0.0.1:4178/teacher?studio=notes (detached PID 35437, log `/tmp/tahmid-duplicate-qa.log`); restart with `NOTE_QA_PORT=4178 NOTE_QA_WORKFLOW=1 node scripts/serve-notes-qa.mjs`. It uses an isolated in-memory database/images, never production. The older user preview on 4177 was left running.

---

## September 16 - Lesson workflow 10.8 published and smoke-verified

**Complete and live:** 10.8.0, runtime commit `24417f3e0daef754a6997ec9d51469971b5aa91a`, existing Cloudflare Pages production deployment `65aa899d-3bb0-4b1c-a190-7033dd197dfa`. Custom-domain `/release.json` matches, built `2026-09-15T17:38:31.993Z`. The user explicitly approved publication after reviewing the local preview. The implementation remains `ac1e41e`; subsequent runtime-checkpoint changes are documentation and release version only. `main` advanced normally from `b443226` with all history preserved. No force push or hosting/auth/DNS/email configuration change.

**Migration `20260915230000_note_workflow_overview` is APPLIED LIVE**, atomically with its exact source in the ledger; ledger count 14. Security-invoker and authenticated-only execution are verified. All 50 existing public review/storage table fingerprints matched before migration, after migration and after production smoke; user identities, RLS flags and policies are unchanged. Current private row checkpoint (about 0.7MB, 48 collections) and evidence: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-16-workflow-release`. This complements existing Git/deployment recovery records; it is not a fresh full storage backup. No existing row or image was changed. Never replay this or any prior applied migration.

Reused successful full tests/local QA/voice contract for `ac1e41e`. Ran only the release build and 85-public-text-asset Cloudflare output check, migration/data comparisons, and requested production smoke. Homepage, Teacher, My Page and Notes HTTP 200; authenticated Teacher dashboard, note list, Quick Import dialog and owner My Page overview render. Import was opened/cancelled only, with no save. Anonymous profiles/notes/practice/assets/personal cards and overview RPC all return 401. Actual production My Page/Teacher at 390px had document width 390px; captured console errors are empty. No repeated all-voice/practice/archive/Favorites walkthrough.

Limits retained: My Page smoke uses existing owner preview, not a fresh real-student login; no physical iPhone test. Announcement/For You acknowledgements remain browser-local. The 45-second foreground notification fallback remains. Final documentation-only commit uses the supported `[CI Skip]` prefix to avoid a redundant Pages build; production runtime remains the SHA above. Read [weekly progress](WEEKLY_PROGRESS.md) and [workflow report](LESSON_WORKFLOW.md) for functional details.

---

## Historical checkpoint - Lesson workflow verified locally before publication

Current work: `codex/lesson-workflow-clarity`, created from `origin/main` / `b44322687f37c6d97fc5b54ec5a15a06d82705c9`. This is the EXISTING project at `/Users/tahmidahmed/Documents/Codex/2026-09-14/interactive-lesson-notes`, not the separate New project folder. Read [weekly progress](WEEKLY_PROGRESS.md) and [workflow report](LESSON_WORKFLOW.md) for the concise status and requested 14-point report.

Implemented locally at `ac1e41e05a00f221887f4b093479d2bfa36550cd`: complete protected/editable Quick Import metadata, note-list management, exact source/practice links, My Page next actions and meaningful badges, teacher priorities/learner-specific creation, compact mobile navigation. Existing data models, private storage, auth/email and pronunciation are preserved. Tests/build/voice contract and isolated browser workflows pass.

**Production remains 10.7.0 / b44322687f37c6d97fc5b54ec5a15a06d82705c9.** No production writes, push or deployment in this checkpoint. Live ledger has 13 entries through `20260915190000`, with RLS enabled and image bucket private. New `20260915230000_note_workflow_overview.sql` is local only; it adds one read-only security-invoker RPC, no tables/policies. Publishing requires a current-conversation decision, private backup, matching forward ledger entry and post-deploy checks. Never replay historical migrations.

Announcement/For You acknowledgements are browser-local and user-scoped, not synced receipts or learning completion. Actual notebook progress remains server-backed. Physical iPhone and fresh real-student production login are not verified. The previous Codex task's history is readable despite the reported `thread_not_found` when starting its next turn; exact underlying service cause is not established.

---

## September 15 — Lesson Notes practice 10.7 published and verified

**The requested upgrade is complete and live.** Runtime commit `b637f1bce3472dca015cdd67418722ab29cc68a4`, Cloudflare production deployment `0be247a8-46aa-490a-a475-195918b3fcf3`, `/release.json` verified 10.7.0 at the custom domain (built 2026-09-14T18:47:39.700Z). This final follow-up also excludes historical retry snapshots from routine detail reads; current answers/progress are unchanged. Source branch `codex/lesson-note-practice` advanced normally from `fd27885` and is merged into `main`. No Netlify/auth/email/DNS change.

Full operation/import/architecture guide: [Lesson Notes practice 10.7](LESSON_NOTE_PRACTICE.md). It covers the requested eleven report points. Adds all nine semantic practice types, stored answers/simple objective checking, retry/self-check, current-question progress and compact teacher response details. Also fixes direct image-block upload/selection, whole-image previews, cover removal/change, formatted student annotations visible to teacher, reviewed/read undo, recoverable archive → Trash → draft restoration, student attachment removal by teacher, and a clear in-site notification bell in website headers.

**Forward migration `20260915190000_note_practice_and_updates.sql` is APPLIED LIVE with matching statement/ledger row.** The ledger now has 13 entries. Never edit or replay it or older notebook/email SQL. Production checks: attempt RLS enabled; authenticated practice RPC allowed, anonymous denied; recipient-filtered inbox in Realtime publication; image bucket remains private. Anonymous REST requests to notes, practice and notifications returned 401. Real production practice rows remain zero because synthetic learning tests use a separate local database.

Private backup directory: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-15-note-practice`. Before/after/final snapshots compare all pre-existing fields exactly unchanged: **2 notes, 2 assets**, original annotations/content, notifications/read states, 5 profiles, memberships/assignments, saved phrases/favorites, submissions/feedback and image-object metadata. The live read/unread test changed only the teacher's existing read notice, then restored it; no student received a test lesson/comment. No production content or uploaded photo was replaced or removed.

Validation: full `npm test`; original 86 notebook assertions + 68 new real PostgreSQL/RLS/import/formatting/practice checks; changed-JS syntax and whitespace checks; Cloudflare build and 83-public-text-asset output checks; voice contract (480 items, 2,112 payloads, 32 phonics levels). Additional curly-apostrophe/whitespace/punctuation normalization check passed. No lint/TypeScript setup exists, so these are not claimed as separate checks. Voice provider/code is unchanged; no new live pronunciation test was needed for this release.

Browser checks used isolated synthetic users and real local PostgreSQL/RLS: import/save/publish; choice, fill, free response and self-check saves; 3/4 completed, 4/4 attempted, 2/2 correct, 1 needs review; teacher expanded responses; formatted English/Japanese memo and teacher display; direct block upload/selection; portrait and landscape contain/zoom; cover set/remove; learner attachment; read/unread and reviewed undo; archive → Trash → restore draft; Student B sees no Student A notes; mobile 390px no horizontal overflow. Existing phrase saving/suggestions/voice and revision paths are covered by the original regression suite/prior live evidence.

Live teacher session loaded both real notes, the existing image selector, actual private teacher/student photos in full, and clear notification titles/actions. My Page owner preview and Teacher Studio headers were checked at 390px; the stray floating badge is now inside its tab. No new warning/error logs were captured after the new release loaded; the pre-existing tab had old-network/expired-refresh errors before reload. Two live teacher tabs reflected changed unread counts automatically and restored counts. Realtime subscriptions/publication were confirmed; immediate delivery latency was not established, and **the 45-second foreground fallback remains the verified recovery path**. Do not claim guaranteed instantaneous or OS push delivery. Physical iPhone and a fresh actual-student production login were not tested.

Final housekeeping: only the original teacher tab is kept; temporary browser tabs and the loopback QA server are closed. New chats should read this section and the guide, fetch current main, inspect status and the live ledger, and continue from preserved Git history. Private backups must never be committed. The separate free Gmail/owner-auth-alert system below remains intact and complete.

---

## September 15 — free email system in service; final integration checkpoint

**This section supersedes all earlier email “pending” statements.** Free-only decision retained; no purchase or paid trial. Incoming domain aliases remain on Cloudflare; outgoing/auth mail uses the owner's selected genuine Gmail with display name `Tahmid English Hub`. Domain From delivery remains unreliable and is intentionally not claimed fixed. Full operating guide: [free email operation](FREE_EMAIL_CONTINUATION.md); implementation: [owner Worker](../workers/email-alerts/README.md). Exact inbox addresses, credentials and beginner Japanese guide are outside Git.

- User delegated the forwarding choice. Selected Gmail now forwards **all new mail** to private main Gmail, retaining its own Inbox copy. Verification completed, saved setting re-read, and actual forwarded copy reached main Inbox at 00:01 JST.
- Main Gmail Send-as exposed the main address in Return-Path despite a correct visible selected-Gmail From and SPF/DKIM/DMARC pass. Removed that new entry and the old failed Resend support entry; main's own default sender remains. No account/mail/Cloudflare receiving rule was deleted. Send/reply by opening the selected Gmail account directly. Its Gmail-only sending display name is now `Tahmid English Hub`.
- Direct selected-Gmail UI message reached its self-plus Inbox and forwarded to main at 00:01; original sending headers contained no main address. Internal self-delivery had no Authentication-Results/Return-Path header, so those are not measured on this test. Separate owner-only SMTP threaded reply arrived in main Inbox at 00:27. A UI Reply-button click is not claimed. Domain-recipient messages exist in main only; compose their replies from the selected mailbox using the customer's address.
- Signup/reset evidence in the 23:07 checkpoint remains valid: actual Inbox links, password update and normal sign-ins passed with owner test accounts. All non-SMTP Supabase auth settings/templates/Google configuration were preserved. Current original Google session still works; no new Google OAuth login was forced.
- **Owner signup/reset event notifications are active.** Private auth outbox, scoped token RPCs, fixed-owner Cloudflare Worker with Gmail SMTPS, and native Supabase Cron every five minutes. Manual two-event digest arrived 23:42; automatic one-event digest arrived **00:10 JST**. Native cron succeeded, pg_net response 200 `processed:1, accepted:true`, final queue zero pending/three accepted. No auth link/password/token is in notifications. They report events, not recipient delivery or password-change success.
- Worker final deployed version `d6c08503-8991-4ce0-8721-fbc8c2739bb5`; `ALERTS_ENABLED=true`, diagnostic `SEND_ENABLED=false`. `/health` 200, unauthenticated `/process` 401, authenticated `/test` 409, empty `/process` 200/processed 0. Cloudflare Cron was configured but never verified to fire, and removed; native Supabase Cron job `english-hub-owner-email` ID 1 is the actual scheduler.

**Database ledger has twelve entries.** Both `20260914144000_owner_email_notifications` and `20260914151000_owner_email_dispatch_schedule` are applied live with matching ledger statements and private backups. They add private notification structures, an auth trigger, pg_cron/pg_net, and a Vault-backed dispatcher. Do not replay/edit applied files. The independently published `20260914130000_interactive_lesson_notes` migration is preserved and now reconciled from current main. The notebook section's eleven-entry count is historical.

This notification phase created one additional owner-only unconfirmed signup fixture (no profile), users 7 → 8, profiles 5 unchanged. Existing profiles, attempt, submissions and feedback compare exactly unchanged in before/after backups. Lessons remain 31; attempts 1, submissions 2, feedback 2. No real learner credentials/results were changed. The earlier auth phase changed only the dedicated owner test password and created its separate confirmed fixture. Do not claim the whole database was untouched: additive notification schemas and owner fixtures were deliberate.

Source branch `codex/email-delivery-alerts` integrated published notebook main `dc173fb` without overwriting its files. Runtime email implementation commit `e0bb41c`; integration `6654206`. Before final publication the site served notebook release `dc173fbf552e160c6f6610ec944d1dce77257dd4` / 10.6.0. Final release details are recorded in the private checkpoint after publication. Email changes add no frontend sender secrets. Merged full `npm test` passed, including all 86 notebook assertions and SMTP/queue/scheduler security tests. `npm run build:cloudflare` and `npm run test:cloudflare` passed (76 public text assets). Known SMTP, queue/admin tokens and test passwords were scanned against tracked files and built assets with no matches. `/`, `/reset-password` and `/release.json` returned HTTPS 200; NS/MX/SPF/DMARC matched the existing receiving setup.

Private evidence: `../email-private-backup/gmail-smtp-secret.json`, `gmail-worker-secrets.json`, `gmail-auth-success-checkpoint.json`, `owner-queue-before.json`, `owner-queue-after.json`, `native-cron-live-result.json`, `native-cron-final-result.json`, `gmail-sendas-result.json`, `gmail-direct-result.json`, `gmail-direct-reply-result.json`. Secret SQL provisioning files and auth backups must never be printed or committed. Private resume: `/Users/tahmidahmed/Documents/New project/ENGLISH_HUB_RESUME.md`.

---

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

## September 14, after 23:07 JST — Gmail SMTP and real authentication email tests passed

**This section supersedes the older Resend/pending-Gmail status below.** The user selected an existing additional Gmail by logging in after being asked for the sending account, then personally enabled its 2-Step Verification. The selected sender was disclosed before use. Sending now uses **Google Gmail custom SMTP**, display name `Tahmid English Hub`, genuine Gmail From address. The private main destination was not published. The precise sender and credentials are in the private checkpoint and Supabase settings; no secret is in Git. The user's decision remains **free only; no domain purchase**.

- Created `English Hub Supabase SMTP` app password. The first, unused key was revoked after the local credential form rejected its origin; a replacement was created. Only the replacement is active. The local form was repaired before SMTP was attempted; no mail was sent by the failed form. The normal Google password was never read.
- Direct Gmail SMTP accepted the owner diagnostic, and it reached the main Gmail **Inbox at 22:53 JST**, showing the branded display name. Then only six Supabase SMTP fields changed: host `smtp.gmail.com`, port `465`, user, password, sender address and sender name. All other auth settings compared unchanged, including confirmation, Google login, templates, Site URL, redirects and 30 emails/hour cap. Password equality could not be checked through configuration readback; the actual subsequent Supabase deliveries verified the credential. Resend and suspended SMTP2GO are no longer the production auth mailer.
- **Password reset passed using an actually received Gmail message at 22:56 JST.** The production `/reset-password` page requested mail for the existing owner-controlled test student. The received link opened the correct production reset page and correct identity; password save succeeded. The new password then authenticated through both the auth API and the actual website UI. The API session and UI test session were signed out.
- **New signup passed using an actually received Gmail message at 23:07 JST.** One new owner-controlled plus-address test account was created through the actual website form, confirmed through the Inbox email, and signed in normally with its password. It was signed out afterward. Signup and password-login UI tests used `https://tahmid-english-hub.pages.dev` (same live code/backend, existing allowed redirect), keeping the owner's main-domain Google session separate. Do not claim that the signup test used the custom-domain origin. The reset request/link/password form did use the production custom domain.
- Counts before/after: users **6 → 7**, profiles **4 → 5**, because of the deliberate new signup fixture; attempts **1**, submissions **2**, feedback **2**, lessons **31** unchanged. Both test accounts have no granted learning access; no real student password/result was changed. Migration ledger remains nine entries ending `20260911081000`.

**Still in progress:** receive replies to the selected sender in the main inbox, configure/verify a usable sending/reply workflow, and separate owner event notifications. A user question is pending about forwarding all new mail from the selected existing Gmail versus only English Hub subject matches, because the selected mailbox also has other uses. Do not silently forward unrelated mail before that answer. The earlier Cloudflare direct-email diagnostic remains disabled and has no active notifications. No database migration for owner notifications has been applied. Do not mark the complete email task finished yet.

Private current files: `../email-private-backup/gmail-auth-success-checkpoint.json`, `gmail-smtp-secret.json`, `gmail-auth-test-accounts.json`, `gmail-smtp-test.json`, `gmail-recovery-result.json`, `auth-before-gmail-20260914.json`, `auth-after-gmail-20260914.json`, and before/after signup data counts. These are outside Git with restrictive permissions. The local one-time setup servers exited; never log or commit their captured values. The latest branch remains `codex/email-delivery-alerts`; website source is still production `42a5895` because no frontend change was required for SMTP.

## September 14, 21:06 JST — free-only decision and Google delivery diagnostic

**The user declined the domain purchase: 「購入せず、無料のまま進める」.** This supersedes all older pending-domain questions. No purchase, checkout, paid subscription or paid trial was started. Continue with free options; do not ask for the same purchase again.

Production remains `42a589540cc525358025411d9e5394aec8a3a601` on `main`, with Cloudflare Pages deployment `d32b1104-45d5-4a6b-8be8-22a6351da4c9` verified live at 18:53 JST. The source, dedicated reset page and teacher reset correction were rechecked on resume. The live migration ledger still has nine entries ending `20260911081000`. No database, user, password, production SMTP or DNS changes were made in this continuation.

This continuation uses branch `codex/email-delivery-alerts`, based on current `origin/main`. The earlier `codex/support-recovery-fix` checkpoint `c8e8394` is historical documentation, not a missing runtime release. Existing incoming support/hello receipt remains verified. Resend remains the production SMTP provider; outgoing support/signup/reset delivery to Gmail is unresolved. SMTP2GO remains suspended and is not in production. Relevant mailbox threads were reviewed again; no new human remediation was found.

Two distinct free-path diagnostics were performed:

- **Cloudflare direct email to the already verified owner inbox failed.** An authenticated owner-only Worker, `tahmid-email-alerts`, attempted one direct notification using the free verified-destination binding. It returned HTTP 502 / `E_DELIVERY_FAILED` / permanent delivery failure. The API did not provide Gmail's detailed rejection reason. This is not a successful notification setup and does not establish an exact cause. Diagnostic sending was then disabled. Live checks now return 200 at `/health`, 401 for unauthenticated `/test`, and 409 for authenticated `/test`; no email is sent while disabled. Version `5fb704f9-7b78-4613-a6e2-7916145e7b22`. No webhook, cron, student events or automatic retries are connected. Code and focused tests are in `workers/email-alerts/` and `scripts/test-email-alerts.mjs`; secrets and raw evidence are outside Git.
- **Google-to-Google mail with the existing site URL reached the main Gmail Inbox at 21:05 JST.** Subject: `English Hub Google delivery check — 14 September 21:06` (subject label differs from the actual minute). This was one authorized message between the owner's existing Gmail accounts, containing the production website link and support address, with no auth link/password. Gmail displayed `mailed-by: gmail.com`, `Signed by: gmail.com`, TLS. This proves receipt of that Google-sent diagnostic only; it is not a dedicated-account SMTP test, not a Supabase signup/reset success, and not domain-address sending recovery. Do not infer that every future message or new Gmail account will deliver.

Next free option: use a dedicated English Hub Gmail as the genuine sender (display name `Tahmid English Hub`), preserving the private main inbox and existing domain reception. A question is pending asking whether an English Hub Gmail already exists or must be created. **No dedicated address has been selected or created; no personal Gmail has been published.** The original user request requires the user to handle Google login/password/OTP/2FA/authorization at the relevant screen. Do not expose any app password in chat or Git. See [free email continuation](FREE_EMAIL_CONTINUATION.md) for the concrete remaining sequence. The task is **not complete**, and automatic owner notifications remain unconfigured.

Newest private evidence: `../email-private-backup/resume-free-20260914.json`, `cloudflare-owner-test.json`, `owner-alert-secrets.json`, and the private `ENGLISH_HUB_RESUME.md` in the user's New project folder. Secret files are outside Git with restrictive permissions.

## September 14 evening — receiving verified; outgoing Gmail still blocked

This section supersedes older email status below. The email task is **not complete**. Cloudflare still receives `hello@` and `support@`; production Supabase and Gmail Send-as still use Resend. SMTP2GO is **not** connected to production.

- Fresh owner-controlled incoming tests on September 14 reached the main Gmail Inbox: support at 18:36 JST and hello at 18:44 JST. The main inbox now has an `English Hub` label and a filter applying it to either professional recipient, including the nine matching existing conversations. The filter only labels; it does not archive, delete, mark read or disable spam checks.
- Fresh Gmail support reply at 18:42 JST used the correct verified professional sender but bounced at the alternate owner Gmail. Resend event `50eb4a89-afc4-4eb5-8696-48b6ad3a138b`, SMTP `550 5.7.1` likely unsolicited mail, sending IP `23.251.234.56`. Gmail's Sent folder is not evidence of delivery.
- Sending is not universally broken: event `53b74c3f-c69a-4e99-a643-27567743caba` to the SMTP2GO ticket mailbox was **delivered**. The previous signup/reset Gmail events remain bounced. Repeated unchanged tests will not repair recipient filtering.
- Spamhaus's official checker reported a DBL listing of the shared parent **dpdns.org**. The SMTP2GO mail-tester result `https://mail-tester.com/test-hnmnhy0bl` was 5.1/10, with SPF/DKIM/DMARC and reverse DNS passing, and DBL botnet/phishing URI penalties. These are evidence of a parent reputation problem, not proof that this user's site is compromised or that this is Gmail's exact classifier or SMTP2GO's suspension trigger. Cloudflare's shared website IP is not the SMTP sending IP; do not purchase IP delisting.
- SMTP2GO account 925988 was activated after the user handled verification. Three diagnostic messages preceded its 16:20 JST unusual-activity suspension. No sends after suspension. The provider changed its outbound IP between the two Gmail rejections; neither delivered. The third diagnostic reached mail-tester. The account is on Free (1,000/month, 200/hour per Rick's ticket response), not the earlier unverified 200/day note.
- Existing SMTP2GO ticket 407446 contains the actual bounce/authentication evidence and the 18:24 JST suspension-review request. Sarah's onboarding email and DigitalPlat contact were followed up; Resend already has the support report. Latest mailbox review found acknowledgments but no human remediation. Never evade the suspension or create another SMTP2GO account.
- Independently managed `tahmidenglishhub.com` was available in the logged-in Cloudflare registrar at USD 10.46 initial and USD 10.46/year renewal. No checkout/purchase. **The user subsequently declined: free only.** A new domain is not part of the authorized continuation.

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
