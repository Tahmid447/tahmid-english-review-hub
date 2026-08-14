# Codex Handoff — Tahmid English Review Hub v9

Updated: 2026-08-14 (Asia/Tokyo)

## Open this project

- Repository folder: `/Users/tahmidahmed/Documents/Codex/2026-08-03/codex-handoff-tahmid-english-review-hub/work/tahmid-english-review-hub`
- Working branch: `upgrade/review-hub-v9-final-product`
- Last pushed checkpoint: `830c596`
- Final local commit: pending; the final-product worktree has passed the integrated
  local test gate and still needs an intentional commit and push
- Production: https://jocular-chaja-86e78d.netlify.app
- Dedicated v9 preview: https://tahmid-english-review-hub-v9-preview.netlify.app
- Supabase project ref: `ycmybggetemkhorkhfnf`

Do not place OAuth client secrets, passwords, service-role keys, database passwords, or access tokens in this file, Git, screenshots, or chat.

## Deployment truth

- The dedicated preview is still the older `upgrade/review-hub-v9-premium-platform@aad5749` deployment observed in Netlify. The final-product branch has **not** been deployed there.
- Production is still the pre-v9 site. The currently available Netlify account could not administer that production project during the audit.
- Migrations `202608140015_teacher_preview_and_premium_workflows.sql` and `202608140016_visual_question_content_corrections.sql` are local only and are **not live**.
- The matching updated `membership-access` Edge Function is local only and is **not deployed**.
- Earlier project records report migrations through `014` and the older matching Edge Function live. That older remote ledger was not independently rechecked during the August 14 final audit.
- Authenticated preview QA and physical-device QA are pending. No final-product production promotion is authorised yet.

## Completed locally on the final-product branch

### Learner product

- The reviewed library contains 17 lessons, 616 activities, and all 14 implemented activity formats.
- Every new practice run reshuffles questions and applicable choices; a resumed saved run keeps its saved order.
- All 14 formats now use format-aware answer completeness. **Check N answered** grades only complete answered items, uses a checked-only denominator, and does not lock an incomplete ordering, matching, or sorting response as the first result.
- An incorrect checked answer offers an immediate bilingual retry while preserving the immutable first result and recording retry improvement separately.
- The shared progress experience uses Asia/Tokyo dates for streak, weekly goal, unique completions, first-attempt accuracy, and retry improvement.
- The former `/takiwaki` route redirects into the common learner experience; historical audience/access compatibility remains in the data layer rather than maintaining a second learner UI.
- First-time Google users have a real profile-completion gate with the verified email displayed read-only. Returning complete profiles do not repeat the gate.
- System, Light, and Dark themes share one persisted preference across the learner, phrase, lesson, and pricing experiences.
- A public-shell PWA manifest, service worker, install metadata, and offline fallback are present. Protected routes, Supabase/API responses, learner data, answers, recordings, and auth-bearing requests are excluded from caching.
- The phrase/vocabulary library has progressive rendering, retained filters, pronunciation, favourites, practice activity, and corrected type/presentation behavior.
- Responsive, contrast, touch-target, compact-header, lesson-radio keyboard, and pricing accessibility fixes are present locally. Final deployed Lighthouse and real-device confirmation remain pending.

### Visual and teaching-content re-audit

- All 85 illustration-led questions were reviewed across image, prompt, four choices, keyed answer, hint, English/Japanese explanation, and alt text.
- Each of the 85 questions now has its own lesson/question-specific, non-answer-revealing bilingual hint, one bilingual correct-evidence statement, and three bilingual distractor-conflict reasons.
- Four WebP illustrations were replaced and rechecked: `july-13-03-rush-back.webp`, `july-19-02-either-day.webp`, `july-22-01-availability.webp`, and `july-27-02-poured-sauce.webp`.
- One valid July 27 splash illustration was retained while its inaccurate alt text and scene brief were corrected. Six ambiguous distractor sets were also corrected.
- Exact per-lesson and per-question evidence is in `docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`, `docs/question-quality-audit.md`, and `scripts/visual-human-qa.json`.
- Migration `016` carries the reviewed 85-row visual-content correction set for the live database, with an exact update postcondition. It has not been applied.

### Plans and pricing

| Plan | Monthly | Six months | Six-month saving | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: |
| Free | ¥0 | ¥0 | ¥0 | ¥0 |
| Standard | ¥3,980 | ¥20,300 | ¥3,580 (about 15%) | ¥3,383 |
| Premium | ¥6,980 | ¥35,600 | ¥6,280 (about 15%) | ¥5,933 |
| Premium+ | ¥16,800 | ¥85,700 | ¥15,100 (about 15%) | ¥14,283 |

- `/plans` has four plan cards, a 13-row comparison, exact yen savings and monthly equivalents, clear best-for copy, Premium as the recommended option, and a contact-first flow with no payment-success claim.
- The contact dialog supports an editable name and message, copies the current edited text, retains intentional edits, and has an explicit reset action.
- The supplied LINE QR and exact Instagram destination remain the only contact destinations.

### Premium and Teacher Studio

- Migration `015` seeds exactly 34 active review tasks: one speaking and one essay task for each of the 17 lessons, with a hard count postcondition.
- Learner drafts remain private until submission. Speaking recordings remain in the private storage bucket and are referenced by object path only.
- The local review design uses an atomic teacher review RPC, fresh return/resubmission timestamps, transactional code redemption/reissue, recording ownership/task/quota checks, and teacher-only plan preview.
- Teacher Studio is organised around seven jobs: **Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, and Insights**. It also includes an English/Japanese display preference, learner and queue filters, Dashboard plan counts and 30-day new-learner count, honest localized source provenance, non-mutating Free/Standard/Premium/Premium+ preview, and safer sign-out.
- There is no automatic or AI grading. The retained database compatibility field is always written `false`; Tahmid remains responsible for reviewing and publishing feedback.

## Verification evidence

The final integrated worktree passed these local checks on August 14:

```sh
npm run build
npm test
npm run verify:visuals
node scripts/audit-question-quality.mjs
node scripts/test-learning-experience.mjs
node scripts/test-learner-platform.mjs
node scripts/test-teacher-controls.mjs
node scripts/test-teacher-workflows-v15.mjs
node scripts/validate-premium-schema.mjs
node scripts/test-plan-platform.mjs
git diff --check
```

PostgreSQL 18 parser checks also passed for migration `015` (60 statements)
and migration `016` (2 statements). Local Browser QA covered public home,
pricing, phrase, and lesson flows at 390/430/621/768/900/1024/1440 px,
including no checked horizontal overflow, light/dark persistence, pricing
calculations/contact editing, roving radio keys, Retry, and immutable first
score. `npm run verify:live` and `npm run audit:audio-live` were attempted but
could not start their live assertions because this sandbox returned DNS
`ENOTFOUND` for the Supabase host. Those results prove local/static behavior,
not live Supabase RLS, OAuth, Netlify, microphone, or physical-device behavior.
See `docs/test-report.md` for dated evidence and remaining gates.

## Required rollout order

1. Review the worktree and create a recoverable database backup/export before any Supabase change.
2. Run the complete local test/build/visual suite and `git diff --check`; resolve every failure.
3. Make one intentional final local commit and push `upgrade/review-hub-v9-final-product`.
4. Apply `202608140015_teacher_preview_and_premium_workflows.sql` to the intended Supabase project.
5. Apply `202608140016_visual_question_content_corrections.sql` only after `015` succeeds.
6. Deploy the matching `supabase/functions/membership-access` implementation.
7. Deploy the exact pushed final-product commit to the dedicated v9 preview, not production.
8. Complete authenticated teacher and Free/Standard/Premium/Premium+ learner QA, including Google first-time/returning flows, email auth, access-code lifecycle, RLS privacy, speaking upload, essay return/resubmission, published feedback, and sign-out/reload.
9. Complete desktop/tablet/390 px checks plus real iPhone Safari and Android Chrome touch/microphone QA.
10. Promote to production only after every preview gate passes and the correct production Netlify account is available. Preserve a known-good rollback deploy.

## Remaining and blockers

- Final integrated tests/build and local responsive Browser QA are recorded.
  Deployed Lighthouse/performance profiling remains pending because the final
  branch is not yet on Preview.
- Migration `015`, migration `016`, and the matching Edge Function are not live.
- Preview is still `aad5749`; production is still pre-v9.
- Authenticated Supabase/RLS/OAuth/access-code/submission QA is pending.
- Real-device touch, PWA install/update, offline fallback, Safari/Chrome microphone, and upload QA are pending.
- Production deployment requires access to the Netlify account that owns the existing production site, or a deliberate replacement plan approved only after preview QA.
- Human-feedback capacity must be bounded before launch; see the workload note in `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`.

## Exact next step

From this repository and branch, inspect the passing final diff, create the
intentional final commit, and push `upgrade/review-hub-v9-final-product`.
Before touching Supabase, take a recoverable backup and verify the remote
migration ledger/schema through `014`; then apply migration `015`, verify it,
apply `016`, verify it, and deploy the matching Edge Function. Deploy only the
exact pushed commit to Preview, then complete authenticated and real-device QA.

## Read first in the next Codex session

1. `docs/CODEX_HANDOFF_2026-08-02.md`
2. `docs/V9_FINAL_AUDIT.md`
3. `docs/test-report.md`
4. `docs/TEACHER_AUTH_V15_2026-08-14.md`
5. `docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`
6. `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`
7. `docs/operations-guide.md`
8. `docs/PERFORMANCE_AUDIT_2026-08-14.md`

Git plus this handoff is the reliable continuation point; a live Codex task is not automatically transferred between accounts.
