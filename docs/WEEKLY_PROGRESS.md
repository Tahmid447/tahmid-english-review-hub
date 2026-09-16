# Tahmid English Hub - Weekly Progress

## Current Week
2026-09-14 to 2026-09-20

## Completed
- Published Duplicate for learner (`5b8c5d6`): list/editor action, destination selector, editable independent draft, fresh block/question IDs, private teacher-image copies and no learner activity transfer.
- Existing 10.7 production: interactive notebook practice, stored progress, recoverable Trash, private images and in-site updates.
- Published 10.8 workflow upgrade: editable Quick Import metadata and blocks; preserve existing metadata unless explicitly replaced.
- Published teacher improvements: note-list contextual actions, actionable dashboard priorities, learner-specific note creation.
- Published student improvements: first-class Lesson Notes navigation, up to three next actions, meaningful update indicators, exact source/practice links and compact mobile navigation.
- Real PostgreSQL/RLS regression tests and isolated browser QA, including profile/settings and archive/Trash restoration.

## In Progress
- None for this request. User-approved Duplicate for learner production deployment and minimal live smoke are complete.

## Next
1. Validate on a physical iPhone and fresh actual-student login during normal acceptance testing.
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
- Duplicate feature: focused notebook/practice/workflow/new-copy suites, Cloudflare build/output check and local browser A-to-B draft/image/edit/publish checks passed. Source/activity stays unchanged; cross-account and anonymous reads are denied. No new migration or production write.
- Before the first copy save, learner/date/content and staged image metadata/removal are editable. Normal image upload/replacement follows the existing saved-draft flow. A failed image copy leaves a clearly flagged partial draft for manual image repair; no automatic cross-session resume or persisted source-note link.
- Full `npm test`, Cloudflare build/output checks and voice contract passed. No lint or TypeScript configuration exists.
- Desktop and 390px browser checks passed for the changed student/teacher surfaces; no horizontal document overflow found.
- Production Teacher/Notes/Quick Import/owner My Page and new overview rendering pass; HTTP routes return 200, anonymous private reads/RPC return 401, no captured console errors, My Page/Teacher document width 390px at 390px.
- Physical iPhone and fresh real-student production login remain unverified. Full local QA was reused rather than repeated in production.
- Existing 45-second foreground notification fallback remains; do not promise instant or OS push notifications.
- See [workflow report](LESSON_WORKFLOW.md) for scope and verification details.

## Last Verified
- Production duplicate deployment: `dc88a141-e149-4b4a-91b1-be1ef4fb3df7`, exact runtime commit `5b8c5d67b4b299b0668571df92ddc671be072734`, built `2026-09-16T08:55:20.894Z`; existing Cloudflare/GitHub main flow. Custom-domain release matches; Teacher duplicate selector opens/cancels normally, fresh tab console errors empty, HTTP routes 200. No DB/storage write or migration. Prior local tests/build reused.
- Duplicate feature local checkpoint: `5b8c5d67b4b299b0668571df92ddc671be072734`, `codex/duplicate-for-learner` from main `12e5c29`; desktop and 390px checks, no captured console errors. Isolated preview http://127.0.0.1:4178/teacher?studio=notes . No push/deployment.
- 2026-09-16 JST; verified local implementation commit `ac1e41e05a00f221887f4b093479d2bfa36550cd`, based on `b44322687f37c6d97fc5b54ec5a15a06d82705c9`.
- Production: https://tahmidenglishhub.dpdns.org, 10.8.0 / `24417f3e0daef754a6997ec9d51469971b5aa91a`; deployment `65aa899d-3bb0-4b1c-a190-7033dd197dfa`.
- Live ledger: 14 entries through newly applied `20260915230000`; authenticated-only, read-only RPC. RLS/policies unchanged and image bucket private.
- Existing 50 table fingerprints matched before/after migration and final smoke. No learner data, content or image changes. Private current-row checkpoint retained outside Git.
