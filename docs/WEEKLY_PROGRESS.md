# Tahmid English Hub - Weekly Progress

## Current Week
2026-09-14 to 2026-09-20

## Completed
- Existing 10.7 production: interactive notebook practice, stored progress, recoverable Trash, private images and in-site updates.
- Published 10.8 workflow upgrade: editable Quick Import metadata and blocks; preserve existing metadata unless explicitly replaced.
- Published teacher improvements: note-list contextual actions, actionable dashboard priorities, learner-specific note creation.
- Published student improvements: first-class Lesson Notes navigation, up to three next actions, meaningful update indicators, exact source/practice links and compact mobile navigation.
- Real PostgreSQL/RLS regression tests and isolated browser QA, including profile/settings and archive/Trash restoration.

## In Progress
- None for this release. User-approved publication and requested smoke checks are complete.

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
- Full `npm test`, Cloudflare build/output checks and voice contract passed. No lint or TypeScript configuration exists.
- Desktop and 390px browser checks passed for the changed student/teacher surfaces; no horizontal document overflow found.
- Production Teacher/Notes/Quick Import/owner My Page and new overview rendering pass; HTTP routes return 200, anonymous private reads/RPC return 401, no captured console errors, My Page/Teacher document width 390px at 390px.
- Physical iPhone and fresh real-student production login remain unverified. Full local QA was reused rather than repeated in production.
- Existing 45-second foreground notification fallback remains; do not promise instant or OS push notifications.
- See [workflow report](LESSON_WORKFLOW.md) for scope and verification details.

## Last Verified
- 2026-09-16 JST; verified local implementation commit `ac1e41e05a00f221887f4b093479d2bfa36550cd`, based on `b44322687f37c6d97fc5b54ec5a15a06d82705c9`.
- Production: https://tahmidenglishhub.dpdns.org, 10.8.0 / `24417f3e0daef754a6997ec9d51469971b5aa91a`; deployment `65aa899d-3bb0-4b1c-a190-7033dd197dfa`.
- Live ledger: 14 entries through newly applied `20260915230000`; authenticated-only, read-only RPC. RLS/policies unchanged and image bucket private.
- Existing 50 table fingerprints matched before/after migration and final smoke. No learner data, content or image changes. Private current-row checkpoint retained outside Git.
