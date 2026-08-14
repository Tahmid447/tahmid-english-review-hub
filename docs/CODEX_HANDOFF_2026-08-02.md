# Codex Handoff — Tahmid English Review Hub v9

Updated: 2026-08-14 (Asia/Tokyo)

## Open this project

- Repository folder: `/Users/tahmidahmed/Documents/Codex/2026-08-03/codex-handoff-tahmid-english-review-hub/work/tahmid-english-review-hub`
- Working branch: `upgrade/review-hub-v9-final-product`
- Exact deployed application commit: `ecf8726a871218d439f69fa780d17d199f378692`
- Application parent / historical rollout checkpoint: `fcf561d78da6de405d6ca54b78ebfc99df3d3a0a`
- Current documentation checkpoint: branch HEAD (`git rev-parse HEAD`). This
  document cannot contain the final hash of the commit that contains itself.
- Canonical GitHub implementation checkpoint: `c14625d50204227c917ecc01d59322cb63006cee`
- Published handoff checkpoint: `a87eb5e1aaa9cff079319b68dfed40bdb2b1a408`
- Production: https://jocular-chaja-86e78d.netlify.app
- Dedicated v9 preview: https://tahmid-english-review-hub-v9-preview.netlify.app
- Exact Preview permalink: https://6a7e6b11f28ff70008bff23a--tahmid-english-review-hub-v9-preview.netlify.app
- Supabase project ref: `ycmybggetemkhorkhfnf`

Do not place OAuth client secrets, passwords, service-role keys, database passwords, or access tokens in this file, Git, screenshots, or chat.

## Deployment truth

- Exact application commit `ecf8726a871218d439f69fa780d17d199f378692`
  is published to the dedicated preview. Its parent is `fcf561d`, the original
  rollout/restore checkpoint.
- Netlify deploy `6a7e6b11f28ff70008bff23a` is published. Netlify reported a
  10-second build/9-second total, 1 new file, 1 changed asset, 12 redirect
  rules, 6 header rules, and no errors.
- The production static site is still pre-v9 and was not deployed or otherwise
  changed during this rollout.
- Supabase migrations `015` and `016` were manually applied in order, each in a
  separate SQL Editor transaction, and the matching `membership-access` Edge
  Function is deployed.
- The Supabase migration ledger is absent: the project has no
  `supabase_migrations.schema_migrations` table and the dashboard reports no
  tracked migrations. The manual applications are verified by live
  postconditions, not by ledger entries.
- The preview and production frontends share Supabase project
  `ycmybggetemkhorkhfnf`; therefore the backend and Edge changes can affect the
  older production frontend even though its static deployment is untouched.
- Public browser QA on the exact deploy passed for the recorded routes and
  interactions. Authenticated/RLS/access-code/submission/logout, microphone,
  Lighthouse, and physical-device QA remain pending. No final-product
  production promotion is authorised yet.

### Database restore point and limitation

- The Supabase Free plan did not provide an official project backup in the
  dashboard.
- A privacy-safe logical restore schema named
  `codex_backup_20260814_fcf561d` was created before the migrations.
- It snapshots 17 lesson rows, 85 visual-question rows, 0 then-current Premium
  task rows, 25 routine definitions, 3 view definitions, 57 policy definitions,
  24 trigger definitions, and table/routine privileges.
- It contains no learner/Auth personal data. All 10 backup tables have RLS
  enabled, schema usage for `anon`/`authenticated` is revoked, and direct table
  access is revoked.
- This is a migration-specific logical restore point, not full-project disaster
  recovery and not a substitute for an official backup.

## Completed implementation and rollout

### Learner product

- The reviewed library contains 17 lessons, 616 activities, and all 14 implemented activity formats.
- Every new practice run reshuffles questions and applicable choices; a resumed saved run keeps its saved order.
- All 14 formats now use format-aware answer completeness. **Check N answered** grades only complete answered items, uses a checked-only denominator, and does not lock an incomplete ordering, matching, or sorting response as the first result.
- An incorrect checked answer offers an immediate bilingual retry while preserving the immutable first result and recording retry improvement separately.
- Public QA on parent commit `fcf561d` exposed a Retry denominator regression:
  an initial `0/1` became `0/2` after a correct retry. Application commit
  `ecf8726` fixed it, and the exact deployed retest remained `0/1` after the
  correct retry.
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
- Migration `016` carried the reviewed 85-row visual-content correction set to
  the live database. Post-application checks found 85 changed rows, all 17
  lessons at `content_version >= 4`, 85 unique English and 85 unique Japanese
  hints, zero missing guidance, and zero invalid choice sets.

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

- Migration `015` seeded exactly 34 active review tasks: one speaking and one
  essay task for each of the 17 lessons. Live checks confirmed all 17 pairs and
  the expected functions, policies, ownership rules, and transactional RPCs.
- Learner drafts remain private until submission. Speaking recordings remain in the private storage bucket and are referenced by object path only.
- The local review design uses an atomic teacher review RPC, fresh return/resubmission timestamps, transactional code redemption/reissue, recording ownership/task/quota checks, and teacher-only plan preview.
- Teacher Studio is organised around seven jobs: **Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, and Insights**. It also includes an English/Japanese display preference, learner and queue filters, Dashboard plan counts and 30-day new-learner count, honest localized source provenance, non-mutating Free/Standard/Premium/Premium+ preview, and safer sign-out.
- There is no automatic or AI grading. The retained database compatibility field is always written `false`; Tahmid remains responsible for reviewing and publishing feedback.

## Verification evidence

The final integrated worktree passed these local checks on August 14. After
the Retry fix, the complete `npm test`, `npm run build`, and
`npm run verify:visuals` sequence was rerun and passed:

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
result storage. The exact `0/1` denominator invariant was subsequently verified
on deployed commit `ecf8726`, as recorded below. `npm run verify:live` and
`npm run audit:audio-live` were attempted but
could not start their live assertions because this sandbox returned DNS
`ENOTFOUND` for the Supabase host. Those results prove local/static behavior,
not live Supabase RLS, OAuth, Netlify, microphone, or physical-device behavior.
See `docs/test-report.md` for dated evidence and remaining gates.

Live rollout verification also confirmed the logical restore point, migration
`015` and `016` postconditions, the fresh matching Edge Function deployment,
and Netlify Preview publication of exact application commit `ecf8726`.

Public QA on the exact immutable deploy permalink passed for:

- home totals of 17 lessons, 616 activities, and 14 formats;
- exact monthly/six-month pricing, Dark persistence, and phrase rendering from
  24 to 30 items;
- sample-lesson shuffle notice, radio-arrow focus staying on Question 1,
  question-specific visual hint and bilingual distractor explanation;
- fixed Retry scoring (`0/1` wrong, then correct retry, official score remains
  `0/1`), 0.5x setting persistence, and mixed English-to-Japanese controls
  without a console error;
- locked June 30 withholding its question payload, the Teacher unauthenticated
  gate and English/Japanese switch, legacy Taki redirect, replacement WebP
  delivery, and an empty browser warning/error log.

Google learner and teacher journeys reached Google's official account chooser;
the Teacher journey carried the correct return target. No account was selected,
so login, profile completion, and authenticated behavior are still pending.

## Rollout progress and required order

1. **Completed:** run the complete local test/build/visual suite and
   `git diff --check`.
2. **Completed with stated limitation:** create the privacy-safe logical restore
   point because an official Free-plan backup was unavailable.
3. **Completed:** apply and verify migration `015`, then migration `016`, in
   separate SQL Editor transactions.
4. **Completed:** deploy and timestamp-check the matching
   `membership-access` Edge Function.
5. **Completed:** publish exact application commit `ecf8726` to the dedicated
   v9 preview and pass the recorded public browser QA, including the live Retry
   regression/retest.
6. **In progress:** complete authenticated teacher plus
   Free/Standard/Premium/Premium+ learner QA, including Google first-time and
   returning flows, email auth, access-code lifecycle, RLS privacy, speaking
   upload, essay return/resubmission, published feedback, and sign-out/reload.
7. **Pending:** complete desktop/tablet/390 px and real iPhone Safari/Android
   Chrome touch, microphone, PWA, and offline QA.
8. Promote to production only after every preview gate passes and the correct
   production Netlify account is available. Preserve a known-good rollback
   deploy and prepare forward fixes for database issues.

## Remaining and blockers

- Final integrated tests/build/visual verification after the Retry fix, backend
  rollout, exact-commit Preview publication, and recorded public Browser QA are
  complete.
- Google redirects reached the official chooser but stopped before account
  selection; no authenticated success is claimed.
- Deployed Lighthouse/performance checks remain pending.
- Authenticated Supabase/RLS/OAuth/access-code/submission QA is pending.
- Real-device touch, PWA install/update, offline fallback, Safari/Chrome microphone, and upload QA are pending.
- Production deployment requires access to the Netlify account that owns the existing production site, or a deliberate replacement plan approved only after preview QA.
- Supabase Free plan has no official backup. The privacy-safe logical restore
  schema is useful for this migration but is not full disaster recovery and
  excludes personal/Auth data.
- Because production and preview share Supabase, any backend correction must be
  a careful forward fix; a Netlify rollback alone cannot undo it.
- Human-feedback capacity must be bounded before launch; see the workload note in `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`.

## Exact next step

Using exact deploy `6a7e6b11f28ff70008bff23a`, exercise authenticated teacher
and Free/Standard/Premium/Premium+ learner/RLS/access-code/submission/logout
flows without entering or recording anyone's password. Then complete
microphone, Lighthouse, and physical-device QA. Record PASS/FAIL evidence
before any production deployment.

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
