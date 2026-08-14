# Teacher/Auth v15 implementation note

Updated: 2026-08-14 (Asia/Tokyo)

## Implemented locally

- Forward-only migration `202608140015_teacher_preview_and_premium_workflows.sql`:
  - hides learner draft rows and draft recordings from teachers;
  - prevents direct teacher submission/feedback writes, routing reviews through one transactional RPC;
  - refreshes `submitted_at` and clears `reviewed_at` when returned work is resubmitted;
  - provides a teacher-only, plan-scoped lesson preview RPC without writing learner access;
  - makes access-code redemption transactional and serialized, and rejects incompatible overlapping plan/scope grants rather than over-granting time;
  - rotates/reissues access codes through one teacher-authorised row-locking transaction, so concurrent requests cannot create multiple enabled replacements;
  - binds every recording path to its learner and active speaking task, verifies that the private object exists before saving the path, rejects audio fields on essays, and limits orphan/rapid uploads;
  - applies one reusable profile-completeness check to memberships, effective plans, feature flags, access-code redemption, and direct non-preview lesson access;
  - seeds one speaking and one essay task for each of the 17 lessons, with a 34-row postcondition;
  - keeps the legacy `ai_assisted` column for compatibility but always writes `false` in the new review workflow.
- Teacher Studio job navigation: Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, and Insights.
- Persistent English/Japanese display selector, learner search/plan/status filters, submission status filters, and clearer lesson/feature exception labels.
- Teacher preview selector for Free, Standard, Premium and Premium+, with a prominent non-mutating preview banner and disabled submission controls.
- Safer local teacher sign-out with bounded timeout and named-session cleanup.
- Teacher sign-out now discards the in-memory client and hard-navigates after local cleanup, including when the remote sign-out call times out.
- First-time Google onboarding displays the verified sign-in email as read-only, and a direct paid lesson route sends incomplete learners to profile completion instead of showing a payment/membership prompt.
- Membership Edge Function redemption now calls the authenticated SQL RPC instead of coordinating multiple service-role writes. Reissued codes no longer copy an already-expired deadline.
- Membership Edge Function reissue now calls the authenticated transactional SQL RPC and has no compensating multi-request insert/update/delete flow.

## Verification performed

- `npm run build` — PASS.
- `node scripts/test-teacher-workflows-v15.mjs` — PASS.
- `node scripts/test-teacher-controls.mjs` — PASS.
- `node scripts/validate-premium-schema.mjs` — PASS.
- `node scripts/test-plan-platform.mjs` — PASS.
- `node --check src/teacher.js` — PASS.
- `node --check src/supabase.js` — PASS.
- PostgreSQL parser against migration 015 — PASS.
- `git diff --check` for the teacher/auth tranche — PASS.
- `npm test` — PASS (including content, learner platform, teacher controls, Premium schema and plan-platform suites). The additional v15 workflow test also passes independently.

## Not applied or deployed

- Migration 015 has **not** been applied to Supabase.
- `membership-access` has **not** been deployed.
- No preview or production deployment was performed from this tranche.
- Authenticated browser QA still needs migration/function deployment in preview, then teacher/learner test accounts.

## Required preview QA after deployment

1. Confirm Free preview reveals only true sample lessons and never phrase-library/question payloads above tier.
2. Confirm Standard/Premium/Premium+ previews show their expected questions, Premium tasks, and a teacher-only preview banner, without creating progress or submissions.
3. Save draft feedback, publish feedback, return work, and resubmit; confirm each state/timestamp and learner visibility.
4. Confirm a teacher cannot query learner draft text or sign a draft recording URL.
5. Confirm a learner cannot attach an essay recording, forge another learner/task path, or submit a path for a missing object; verify upload quota messaging after repeated abandoned uploads.
6. Reissue the same access code from two concurrent requests; confirm exactly one replacement succeeds and the other gets the already-disabled/reissued conflict.
7. Redeem valid, malformed, disabled, expired, used-up, duplicate, same-plan extension, and conflicting active-plan codes.
8. Approve an intentionally incomplete Google profile and open a paid lesson URL directly; confirm it remains Free/locked until all required profile fields are saved, while the verified email remains read-only.
9. Confirm all 17 lessons have one active speaking and one active essay review task.
