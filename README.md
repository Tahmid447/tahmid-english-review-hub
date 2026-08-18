# Tahmid English Review Hub

Private development repository for the Tahmid English Review Hub v9 learner
platform and Teacher Studio.

Current work is on `upgrade/review-hub-v9-final-product`. The exact deployed
and live-validated final-polish artifact is
`7899024a8c9baee9cdd91b0fe93346a1bcc8427d` (Netlify deploy
`6a8420afed26890008660823`);
`fcf561d78da6de405d6ca54b78ebfc99df3d3a0a` remains the historical rollout and
logical-restore checkpoint. Authenticated learner Google sign-in, profile
completion, reload persistence, lesson access, and safe sign-out pass. Teacher
auth, dedicated non-teacher tier negatives, Lighthouse, microphone, and
physical-device QA remain pending. The production static site remains pre-v9. Read
`docs/CODEX_HANDOFF_2026-08-02.md` before further rollout work.

## Routes

- `/` — shared learner Review Hub and progress dashboard
- `/lesson/june-28` — shared lesson player
- `/phrases` — Phrase & Vocabulary Library
- `/plans` — Free, Standard, Premium, and Premium+ comparison/contact flow
- `/takiwaki` — compatibility route that redirects to the shared learner hub
- `/teacher` — authenticated Teacher Studio

The learner experience shares quiz, audio, preferences, progress, and Supabase
modules. Historical General/Takiwaki/Both access metadata remains compatible,
but there is no separate Takiwaki learner UI. Personal history and protected
lesson data are guarded by Supabase Auth and Row Level Security.

## Local final-product inventory

- 17 lessons, 616 activities, and 14 implemented practice formats
- 85 illustration-led questions, five per lesson
- format-aware answer completeness and **Check N answered** partial grading
- immediate bilingual retry with the first official result preserved
- fresh-run question/choice shuffle and saved-run order restoration
- Asia/Tokyo streak, weekly goal, unique completions, first accuracy, and retry
  improvement
- progressive phrase/vocabulary library with retained filters and audio
- persisted System/Light/Dark theme across home, phrases, lessons, and pricing
- public-shell PWA/offline fallback that excludes protected/authenticated data
- four-plan pricing, 13-row comparison, editable contact message, and exact
  savings/monthly equivalents
- Teacher Studio organised into Dashboard, Learners, Access codes, Lessons &
  content, Submissions, Sources, and Insights
- 34 active Premium review tasks: one speaking and one essay per lesson
- 51 lesson-specific Premium topic choices: three per lesson, shared by its
  speaking and essay tasks, with topic-specific bilingual guidance
- human teacher feedback only; no automatic or AI grading

All 85 visual questions were manually and programmatically re-audited across
image, prompt, choices, answer, hint, bilingual explanation, and alt text. Four
WebPs were replaced, one valid image received corrected alt/brief text, six
ambiguous distractor sets were corrected, and all 85 now have unique,
non-answer-revealing bilingual guidance. See
`docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md` for the per-question ledger.

## Fixed public prices

| Plan | Monthly | Six months | Saving | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: |
| Free | ¥0 | ¥0 | ¥0 | ¥0 |
| Standard | ¥3,980 | ¥20,300 | ¥3,580 (~15%) | ¥3,383 |
| Premium | ¥6,980 | ¥35,600 | ¥6,280 (~15%) | ¥5,933 |
| Premium+ | ¥16,800 | ¥85,700 | ¥15,100 (~15%) | ¥14,283 |

`src/plans.js` is the browser-side source of truth. `/plans` starts a real LINE
or Instagram conversation; it does not process payment or claim success.

## Local commands

```bash
npm run build
npm test
npm run verify:visuals
npm run verify:live
npm run audit:audio-live
node scripts/test-teacher-controls.mjs
node scripts/test-teacher-workflows-v15.mjs
node scripts/validate-premium-schema.mjs
node scripts/test-premium-topics.mjs
node scripts/test-plan-platform.mjs
git diff --check
```

After the authentication fixes, the full `npm test`, `npm run build`, and
`npm run verify:visuals` sequence passed. After the final query cache-bust in
`049b5ff`, the latest full `npm test` and `npm run build` also passed.

`npm run build` regenerates reviewed data and the protected Supabase question
migration. The public `dist/` allowlist deliberately excludes private authoring
sources. Static/local tests do not prove OAuth, RLS, recording upload, Netlify,
or real-device behavior. On August 14, the live-security and live-audio
commands were attempted but the sandbox could not resolve the Supabase host;
run them again from a network-enabled environment during Preview QA.

## Supabase release status

Supabase project `ycmybggetemkhorkhfnf` is on the Free plan, which did not offer
an official project backup in the dashboard. Before rollout, a privacy-safe
logical restore schema named `codex_backup_20260814_fcf561d` was created. It
contains migration-relevant catalog/data/definition snapshots, excludes
personal and Auth data, has RLS enabled, and has anonymous/authenticated access
revoked. It is a targeted restore point, **not** full-project disaster recovery.

The following forward changes are live:

1. `202608140015_teacher_preview_and_premium_workflows.sql` was applied in its
   own SQL Editor transaction. Verification found 34 active tasks, exactly one
   speaking and one essay task for each of 17 lessons, plus the expected
   functions and privacy/ownership policies.
2. `202608140016_visual_question_content_corrections.sql` was applied in a
   separate SQL Editor transaction. Verification found 85 changed visual rows,
   all 17 lessons at `content_version >= 4`, 85 unique English hints, 85 unique
   Japanese hints, and no missing guidance or invalid choice sets.
3. The matching `supabase/functions/membership-access/index.ts` was deployed,
   and its fresh deployment timestamp and audited response/error boundaries
   were observed in the dashboard.

Migration `202608180017_premium_task_topics.sql` was applied in one SQL Editor
transaction after a privacy-safe pre-017 task-definition snapshot. Live checks
found 34/34 tasks with three topics, 102 task/topic presentations, 51 unique
lesson topics, and zero invalid topic rows. It records the topic selected for
each learner attempt. The matching UI must still be published and tested on
Preview.

All three SQL files were applied manually. This project has no
`supabase_migrations.schema_migrations` ledger, and the dashboard still reports
no tracked migrations; do not infer ledger entries or blindly replay the files.
Authenticated learner/teacher, access-code, RLS, submission, microphone, and
real-device QA is still in progress.

The profile-save hotfix required no migration or Edge change, and
`UPDATE(user_id)` was deliberately not granted. Inserts
and updates are separate, and update payloads omit insert-only `user_id`.
Shared Supabase state is otherwise unchanged by the hotfix.

All Review Hub database objects use the `review_` prefix. The browser receives
only the public anon key; no service-role key or password belongs in this
repository. Learner passwords remain inside Supabase Auth and are never
readable in Teacher Studio. The PWA must never cache private learner records,
answers, teacher feedback, authenticated API responses, or recordings.

## Deployments

- Dedicated v9 preview:
  `https://tahmid-english-review-hub-v9-preview.netlify.app`
  — validated at `upgrade/review-hub-v9-final-product@7899024` as Netlify
  deploy `6a8420afed26890008660823`
- Exact validated immutable Preview permalink:
  `https://6a8420afed26890008660823--tahmid-english-review-hub-v9-preview.netlify.app`
- Production: `https://jocular-chaja-86e78d.netlify.app/`
  — static site remains untouched and pre-v9

Earlier public QA on the validated `ecf8726` deploy checked the 17/616/14 home totals, exact
monthly and six-month pricing, Dark persistence, phrase expansion from 24 to
30 items, shuffle notice and radio-arrow behavior, question-specific visual
guidance, 0.5x persistence, mixed English/Japanese audio controls, locked-lesson
payload withholding, Teacher unauthenticated gate and language switch, legacy
Taki redirect, replacement WebP delivery, and an empty browser warning/error
log. A Retry denominator bug found on `fcf561d` (`0/1` becoming `0/2`) was fixed
in `ecf8726`; the exact live retest stayed `0/1` after a correct retry.

Authenticated Google learner QA then reproduced
`permission denied for table review_profiles`: the old upsert sent insert-only
`user_id` on update. Commits `d0b244b` (split insert/update and modal status),
`50656f8` (avoid stale automatic race), `a69ab08` (PWA cache v3), and `049b5ff`
(query cache-bust) fixed it. Live retest passed modal and page success, gate
close, complete reload, Standard shown through August 2, 2027, access to all 44
June 30 questions, and sign-out/reload/cross-tab locking.

Premium task cards appeared despite the Standard label, so this identity seems
teacher-elevated. Strict Standard-versus-Premium denial is not proved and still
needs dedicated non-teacher tier accounts. Teacher auth remains pending; the
learner account is currently signed out.

The preview and production frontends share the same Supabase project, so the
backend migrations and Edge deployment also affect requests from the older
production frontend even though its static files were not deployed. Production
promotion remains blocked until Teacher auth, dedicated tier/RLS/access-code/
submission checks, Lighthouse, microphone, and physical iPhone/Android QA pass.
Preserve the previous successful Netlify deploy and the limited
logical restore point, while recognising that neither is a complete database
rollback.

## Safety and continuation

- `backups/takiwaki_review_hub_v7_original.zip` is an unchanged source backup.
- `backup/v8-calm-baseline` is the previous calm-interface rollback branch.
- `backups/general-entrance-original.html` preserves the supplied entrance.
- `legacy-site/` is an untouched extracted copy of the original ZIP.
- The unrelated legacy `Tahmid447/Takiwaki` repository is not used.

Read next:

- [`docs/CODEX_HANDOFF_2026-08-02.md`](docs/CODEX_HANDOFF_2026-08-02.md)
- [`docs/V9_FINAL_AUDIT.md`](docs/V9_FINAL_AUDIT.md)
- [`docs/test-report.md`](docs/test-report.md)
- [`docs/operations-guide.md`](docs/operations-guide.md)
- [`docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`](docs/PREMIUM_PLANS_AND_SUBMISSIONS.md)
- [`docs/TEACHER_AUTH_V15_2026-08-14.md`](docs/TEACHER_AUTH_V15_2026-08-14.md)
- [`docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`](docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md)
- [`docs/PERFORMANCE_AUDIT_2026-08-14.md`](docs/PERFORMANCE_AUDIT_2026-08-14.md)
