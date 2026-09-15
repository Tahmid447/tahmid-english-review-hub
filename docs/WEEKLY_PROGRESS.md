# Tahmid English Hub - Weekly Progress

## Current Week
2026-09-14 to 2026-09-20

## Completed
- Existing 10.7 production: interactive notebook practice, stored progress, recoverable Trash, private images and in-site updates.
- Local workflow upgrade: editable Quick Import metadata and blocks; preserve existing metadata unless explicitly replaced.
- Local teacher improvements: note-list contextual actions, actionable dashboard priorities, learner-specific note creation.
- Local student improvements: first-class Lesson Notes navigation, up to three next actions, meaningful update indicators, exact source/practice links and compact mobile navigation.
- Real PostgreSQL/RLS regression tests and isolated browser QA, including profile/settings and archive/Trash restoration.

## In Progress
- User approved publication after local preview review. Workflow upgrade 10.8 is being released through existing main/Cloudflare Pages.
- New migration `20260915230000_note_workflow_overview.sql` is APPLIED LIVE with its matching ledger entry. Private checkpoint and unchanged-data/RLS comparison passed; frontend publication and minimal smoke checks follow.

## Next
1. Release the verified workflow changes when authorized; check the real teacher and student journeys afterward.
2. Validate the same workflows on a physical iPhone and fresh actual-student login.
3. Consider cross-device announcement/card acknowledgements if real usage warrants a persistent model.

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
- Physical iPhone, fresh real-student production login and new-feature live behavior remain unverified.
- Existing 45-second foreground notification fallback remains; do not promise instant or OS push notifications.
- See [workflow report](LESSON_WORKFLOW.md) for scope and verification details.

## Last Verified
- 2026-09-16 JST; verified local implementation commit `ac1e41e05a00f221887f4b093479d2bfa36550cd`, based on `b44322687f37c6d97fc5b54ec5a15a06d82705c9`.
- Production: https://tahmidenglishhub.dpdns.org, 10.7.0, the same baseline commit.
- Live ledger: 13 entries through `20260915190000`; note/practice/notification RLS enabled and image bucket private.
- This work has not written to production or changed existing learner records.
