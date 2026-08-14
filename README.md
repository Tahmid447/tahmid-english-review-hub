# Tahmid English Review Hub

Private development repository for the Tahmid English Review Hub v9 learner
platform and Teacher Studio.

Current work is on `upgrade/review-hub-v9-final-product`. The last pushed
checkpoint is `830c596`; the final integrated local suite passes and the final
intentional commit/push is pending. The
dedicated v9 preview is still the older `aad5749` deployment, and production is
still pre-v9. Read `docs/CODEX_HANDOFF_2026-08-02.md` before deployment work.

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
- 34 locally seeded Premium review tasks: one speaking and one essay per lesson
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
node scripts/test-plan-platform.mjs
git diff --check
```

`npm run build` regenerates reviewed data and the protected Supabase question
migration. The public `dist/` allowlist deliberately excludes private authoring
sources. Static/local tests do not prove OAuth, RLS, recording upload, Netlify,
or real-device behavior. On August 14, the live-security and live-audio
commands were attempted but the sandbox could not resolve the Supabase host;
run them again from a network-enabled environment after Preview rollout.

## Supabase release status

Apply forward migrations in filename order. Earlier project records report
migrations through `202608110014_premium_plus_and_entitlements.sql` and the
older matching Edge Function live; that remote ledger was not independently
rechecked during the August 14 audit.

The following final-product backend files are local and **not live**:

1. `202608140015_teacher_preview_and_premium_workflows.sql`
2. `202608140016_visual_question_content_corrections.sql`
3. the matching updated `supabase/functions/membership-access/index.ts`

Before applying them, export/back up the current Supabase state. Apply migration
`015`, then `016`, then deploy the matching Edge Function. Deploy the exact
pushed final-product commit to the dedicated preview and complete authenticated
teacher/four-tier learner, access-code, RLS, submission, and real-device QA
before any production promotion.

All Review Hub database objects use the `review_` prefix. The browser receives
only the public anon key; no service-role key or password belongs in this
repository. Learner passwords remain inside Supabase Auth and are never
readable in Teacher Studio. The PWA must never cache private learner records,
answers, teacher feedback, authenticated API responses, or recordings.

## Deployments

- Dedicated v9 preview:
  `https://tahmid-english-review-hub-v9-preview.netlify.app`
  — currently observed at `aad5749`, not the final-product branch
- Production: `https://jocular-chaja-86e78d.netlify.app/`
  — pre-v9; the audited Netlify account could not administer this project

Production promotion is blocked until migrations
`015` and `016`, updated Edge Function, preview auth/RLS flows, light/dark
responsive checks, and physical iPhone/Android QA pass. Preserve the previous
successful deploy and Supabase backup as rollback points.

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
