# Tahmid English Hub - Weekly Progress

## October 7 - Learning point reviews and mobile notebook (published)
- Implemented on `codex/lesson-review-journey`: per-point Got it / Review again with undo, resume links, accessible lesson review near the top, My Page activity/progress chart, teacher learner filtering and point-level confidence reports.
- iPhone notes use a contextual sheet with phrase/example/question starters, color swatches, autosave/retry and retained drafts on failures. Desktop annotations and existing practice remain intact.
- Published runtime `5af418f43433afb98e240b2b3cdfee1e4ceb4881` (feature `16f5777`) through existing main/Cloudflare Pages, production deployment `db1298fa-c3d5-496b-afed-46a78225f70a`. Production release identity and Pages/Worker build success confirmed. Applied only additive migration `20261007025813_lesson_block_review_journey.sql`, once atomically with its ledger entry; ledger now 16 entries. No reset, existing content/settings/progress change or infrastructure change.
- Private 52-table row/schema checkpoint verified; all original fingerprints matched after migration. After release, 51 tables matched and one auth user timestamp changed, with all 8 users and other account fields retained. Production HTTP/new assets, authenticated-role read-only summary RPCs and anonymous-denial checks passed. Existing student session renders actual My Page journey/empty Notes; 390px My Page has no overflow or captured console errors. No signed-in teacher session or physical iPhone was available; existing authenticated local UI QA is reused, not repeated.
- Standing owner authorization is recorded in `AGENTS.md` line 10 and deployment guide: complete normal verified, data-safe releases without reconfirmation, while honoring task-specific restrictions and protected high-risk operations. Handoff updated; final docs use `[CI Skip]`.
- Focused SQL/RLS/model checks, 68 existing practice checks, production packaging, and isolated 390/820/1280 browser checks passed. No physical-device claim and no broad test rerun. Preview and release prerequisites are recorded in `docs/WORKING_HANDOFF.md`.

## October 4 - Learning experience and previews
- Published `50ba2ff` on existing main/Cloudflare Pages, deployment `88dff703-6e00-4f1a-924d-8b7b5954f2f6`: notifications Read all (including older unread items), authenticated saved-setting learner previews with actual published note cards/images, and Desktop/Tablet-iPad/Mobile preview widths.
- Added reversible Classic/Color/Focus practice appearance without clearing answers and a copyable six-format Quick Prompt in Quick Import. No AI-service dependency, database migration, data reset, authentication or infrastructure changes; global BGM OFF retained.
- Scoped unit/import checks, required production build/output checks and targeted browser smoke passed. Production preview loaded real cards/lesson, 820px had no overflow, and final inbox control had no errors. Local 390px and bulk-read checks passed. Same-day private backup reused; original data counts did not decrease, and one image asset was added by concurrent activity. Preview is read-only and limited to saved features/published notes; no physical iPad claim. See handoff.

## October 4 - Music controls
- Corrected global OFF scope in live runtime `495e26e`: disables BGM for visitors and all learner accounts regardless of individual ON, and hides controls/prompt while policy loads. Production signed-out home and test-learner My Page show no BGM controls/prompt/audio under the owner's saved OFF. No database changes. Focused regression and corrected build/output check passed.
- Published `3a97dde` through existing main/Cloudflare Pages (`9d2ed288-a2b4-4eb8-9473-5d5dd6e1bff8`): learner BGM OFF persists across preference loading and account scope changes; delayed OFF stops actual audio. Added Study music to existing global and individual learner feature controls. Teacher ON does not override personal OFF; speech and sound effects remain independent.
- Relevant automated tests, isolated actual browser playback/OFF/reload/global-control checks and Cloudflare build pass. Forward migration `20261004120000` applied once with exact ledger source. Production actual BGM pause and OFF after logout/login/My Page verified on owner-managed test account; Teacher checkbox visible. Global defaults unchanged. Existing rows/content preserved; only test preference timestamp and additive ledger entry changed. See working handoff for evidence and verification limits.

## Current Week
2026-09-14 to 2026-09-20

## Completed
- Published import/image blocker fix (`be0301e`): saved-Draft explicit date applies automatically unless manually edited; simultaneous image edits save independently; inline Saved/error state and persistent cover; lesson-based optional image metadata; one-level Practice disclosure; complete release-hash module/CSS stamping. Exact production A-K passed on an owner-controlled test learner.
- Published reading/import UX (`232bd65`): full-width card covers, protected editable lesson dates, staged image import, priority-based disclosures, section jumps/back-to-top, practice state and clearer student/teacher shortcuts. Relevant tests and isolated desktop/390px QA pass.
- Published Duplicate for learner (`5b8c5d6`): list/editor action, destination selector, editable independent draft, fresh block/question IDs, private teacher-image copies and no learner activity transfer.
- Existing 10.7 production: interactive notebook practice, stored progress, recoverable Trash, private images and in-site updates.
- Published 10.8 workflow upgrade: editable Quick Import metadata and blocks; preserve existing metadata unless explicitly replaced.
- Published teacher improvements: note-list contextual actions, actionable dashboard priorities, learner-specific note creation.
- Published student improvements: first-class Lesson Notes navigation, up to three next actions, meaningful update indicators, exact source/practice links and compact mobile navigation.
- Real PostgreSQL/RLS regression tests and isolated browser QA, including profile/settings and archive/Trash restoration.

## In Progress
- None for this request. Blocker fixes are deployed and exact production QA is complete; no database migration.

## Next
1. Validate on a physical iPhone during normal acceptance testing. A normal login of the existing owner-controlled test student passed production QA; no real student's credentials were used.
2. Consider cross-device announcement/card acknowledgements if real usage warrants a persistent model.
3. Design a persisted teacher-review state before stronger free-response review queues.

## Important Decisions
- Continue the existing Cloudflare Pages/Supabase/Workers project and IDs; never recreate it or replay applied migrations.
- Reuse notebook versions, question snapshots, notifications and existing status RPCs. No permanent-delete control was added.
- Overview is one bounded read-only RPC with security-invoker/RLS; no learner answer content is returned.
- Announcement/For You indicators are per-user browser acknowledgements, NOT synced read receipts or learning completion. Notebook/progress states remain database-backed.
- Metadata suggestions are deterministic, content-derived and editable, not AI-generated claims about lesson topics.
- Auth, email, pronunciation, storage privacy and original learning models are unchanged.

## QA / Known Issues
- Quick Import image defaults are editable templates, not AI analysis. Files upload only on Save/Publish; keep the page open to retry partial uploads. Already successful uploads are reused. Unsaved local files have no cross-session resume.
- New reading/import tests cover date parsing/ambiguity/manual-value protection, practice aliases, cover/detail sizing, default disclosures, next actions and image validation/retry. Existing notebook/practice/workflow/duplicate and My Page tests passed; browser import-to-publish with six practice types and image, weak-point review, answer-preserving disclosures, 390px and console checks passed.
- Duplicate feature: focused notebook/practice/workflow/new-copy suites, Cloudflare build/output check and local browser A-to-B draft/image/edit/publish checks passed. Source/activity stays unchanged; cross-account and anonymous reads are denied. No new migration or production write.
- Before the first copy save, learner/date/content and staged image metadata/removal are editable. Normal image upload/replacement follows the existing saved-draft flow. A failed image copy leaves a clearly flagged partial draft for manual image repair; no automatic cross-session resume or persisted source-note link.
- Full `npm test`, Cloudflare build/output checks and voice contract passed. No lint or TypeScript configuration exists.
- Desktop and 390px browser checks passed for the changed student/teacher surfaces; no horizontal document overflow found.
- Production Teacher/Notes/Quick Import/owner My Page and new overview rendering pass; HTTP routes return 200, anonymous private reads/RPC return 401, no captured console errors, My Page/Teacher document width 390px at 390px.
- Physical iPhone remains unverified. Exact import-to-publish flow was additionally tested in production with the existing owner-controlled test-student account for the blocker fix. Successful-flow console logs were empty; full network HAR was not collected.
- Existing 45-second foreground notification fallback remains; do not promise instant or OS push notifications.
- See [workflow report](LESSON_WORKFLOW.md) for scope and verification details.

## Last Verified
- Blocker fix production: `be0301e5f40f10a620203257864921cd2db96876`, deployment `de79a0a8-4ed8-4c7c-924b-94dcdca99ca5`, built `2026-09-16T13:48:40.538Z`. Requested HTML/modules/CSS match local build byte-for-byte; normal reload loads release hashes. A-K passed, including two simultaneous image edits, reload persistence, cover, Publish, actual test-student access and 390px. All 588 original rows across 48 collections unchanged; only owner-QA fixtures/related records added. Anonymous private reads denied; no SQL/auth/RLS/DNS change. See current handoff for evidence, fixture IDs and cache-header qualification.
- Reading/import production deployment: `4604f8d7-45cf-4b84-8494-be3f255c09c3`, runtime `232bd6540e647a6bec70a39297ac3eb4753950b0`, built `2026-09-16T11:56:55.041Z`. Custom domain and browser modules match. HTTP 200, live cover images/progress/Quick Import/date/reader/My Page shortcuts, 390px and clean console checks passed. Anonymous private reads/RPC denied (401). All 50 review/storage table fingerprints match before/after; no database/storage writes or migration. Existing backup/previous Pages release retained. Final docs use `[CI Skip]`.
- Production duplicate deployment: `dc88a141-e149-4b4a-91b1-be1ef4fb3df7`, exact runtime commit `5b8c5d67b4b299b0668571df92ddc671be072734`, built `2026-09-16T08:55:20.894Z`; existing Cloudflare/GitHub main flow. Custom-domain release matches; Teacher duplicate selector opens/cancels normally, fresh tab console errors empty, HTTP routes 200. No DB/storage write or migration. Prior local tests/build reused.
- Duplicate feature local checkpoint: `5b8c5d67b4b299b0668571df92ddc671be072734`, `codex/duplicate-for-learner` from main `12e5c29`; desktop and 390px checks, no captured console errors. Isolated preview http://127.0.0.1:4178/teacher?studio=notes . No push/deployment.
- 2026-09-16 JST; verified local implementation commit `ac1e41e05a00f221887f4b093479d2bfa36550cd`, based on `b44322687f37c6d97fc5b54ec5a15a06d82705c9`.
- Production: https://tahmidenglishhub.dpdns.org, 10.8.0 / `24417f3e0daef754a6997ec9d51469971b5aa91a`; deployment `65aa899d-3bb0-4b1c-a190-7033dd197dfa`.
- Live ledger: 14 entries through newly applied `20260915230000`; authenticated-only, read-only RPC. RLS/policies unchanged and image bucket private.
- Existing 50 table fingerprints matched before/after migration and final smoke. No learner data, content or image changes. Private current-row checkpoint retained outside Git.
