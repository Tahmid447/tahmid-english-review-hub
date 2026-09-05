# Tahmid English Review Hub

Private development repository for the Tahmid English Review Hub learner
platform and Teacher Studio.

The structured-learning v10 work is developed on
`codex/structured-learning-hub`. It adds teacher-owned learner controls and an
original Words / Phrases / Phonics pathway without removing the v9 lesson,
homework, progress, Premium, or phrasebook workflows. These v10 database and
frontend changes are **not live merely because they exist in this branch**;
follow the staged rollout instructions below.

The v9 base/release branch is `upgrade/review-hub-v9-final-product` and the
formal site is `https://tahmid-english-review-hub.netlify.app/`. The August 28 Notion expansion
adds 14 publishable lessons from 10 source pages, including deliberate Part 1 /
Part 2 splits for longer lessons. Database migrations `019`–`023` were applied
manually in order and their release postconditions passed before the matching
frontend release. `fcf561d78da6de405d6ca54b78ebfc99df3d3a0a` remains the
historical rollout and limited logical-restore checkpoint. Read
`docs/RELEASE_2026-08-28_NOTION_EXPANSION.md` and
`docs/CODEX_HANDOFF_2026-08-02.md` only as historical v9 evidence; the v10
release procedure in this README is authoritative for the pending upgrade.

## Routes

- `/` — shared learner Review Hub and progress dashboard
- `/lesson/june-28` — shared lesson player
- `/learn` — structured Words / Phrases / Phonics Learning Library
- `/words` and `/phonics` — compatibility entries into `/learn`
- `/phrases` — Phrase & Vocabulary Library
- `/plans` — Free, Standard, Premium, and Premium+ comparison/contact flow
- `/pricing-layout-preview` — private, no-index comparison of the former
  four-card stack and the adopted balanced 2×2 pricing layout
- `/music-credits` — CC BY 4.0 study-music attribution and official sources
- `/takiwaki` — compatibility route that redirects to the shared learner hub
- `/teacher` — authenticated Teacher Studio

The learner experience shares quiz, audio, preferences, progress, and Supabase
modules. Historical General/Takiwaki/Both access metadata remains compatible,
but there is no separate Takiwaki learner UI. Personal history and protected
lesson data are guarded by Supabase Auth and Row Level Security.

## Technology and configuration

This is a deliberately small static application: semantic HTML, shared CSS,
and native JavaScript ES modules, with Node scripts for the allowlisted build.
There is no React, Vite, Next.js, Tailwind, or component-library runtime.
Netlify publishes `dist/`; Supabase supplies email/Google Auth, Postgres, RLS,
Storage, and Edge Functions. A service worker provides the public offline shell
but does not cache authenticated API data.

The only browser-safe configuration values are:

- `VITE_SUPABASE_URL` or `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`

Both values must be provided together when overriding the committed public
configuration. The build rejects service-role/secret keys. Supabase-managed
Edge Function variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY`) stay in Supabase and must never be exposed to the
browser, Netlify output, source control, logs, or Teacher Studio.

## Structured Learning Hub v10

Teacher Studio stores one backward-compatible visibility profile per learner.
The switches are `account_enabled`, Dashboard, Words, Phrases, Phonics, Review
Lessons, Homework, Progress, Price Plan, Contact Teacher, Trial CTA, Payment /
Plan guidance, and Announcements. Teachers can also set a Level 1–32 range, an
exact level allow-list, and item-level `allow` / `block` overrides. Existing
learners are backfilled with all switches enabled and a conservative Level 1–4
starter range. Their existing v9 lessons and progress remain intact; Teachers
can deliberately extend the new library to any Level 1–32 range.

The browser removes disabled navigation and sections without leaving empty
layout gaps. `/learn`, `/phrases`, `/plans`, and `/lesson/...` also perform a
signed-in access check; the database remains authoritative. RLS restricts a
student to their own settings, favorites, progress, allowed curriculum rows,
announcements, and existing personal records. A teacher can read or change
learner-specific records only through the explicit teacher/student ownership
mapping. Existing approval and access-code relationships are preserved during
backfill; one active teacher may safely adopt otherwise unowned learners, while
a multi-teacher project leaves learners with no trusted provenance unassigned
instead of guessing an owner. Future code redemption links the learner to the
teacher who created that code. Teacher writes are recorded in an append-only
audit table.

The library source files are intentionally editable and reviewable:

- `curriculum/words.json` — 32 levels × 10 words = 320 items
- `curriculum/phrases.json` — 32 levels × 4 phrases = 128 items
- `curriculum/phonics.json` — 32 progressive levels = 32 items

`npm run generate:curriculum` validates those 480 original items against the
release-frozen, one-time seed migration. A mismatch fails the build instead of
rewriting migration `025`; later curriculum changes require migration `026` or
higher. Words contain meaning, kana reading,
pronunciation guidance, an original bilingual example, a common-mistake note,
an emoji icon, Ava/Libby voice metadata, and tags. Phrases add situation,
natural usage, dialogue, and mistake guidance. Phonics progresses from alphabet
sounds through vowels, consonants, blends, digraphs, silent e, r-controlled
vowels, spelling patterns, stress, and connected-speech practice.

Each accessible item offers US (Ava) and UK (Libby) playback through the
existing natural-speech Edge Function. Playback reports preparing/playing/error
state and honors the global voice setting and playback speed. If natural audio
is unavailable, the card shows a bilingual retry message; it never substitutes
a browser `speechSynthesis` computer voice.

The review experience supports flashcards in both directions, listening choice,
four-choice practice, Easy / Good / Hard self-rating, favorites, reviewed and
mastered states, per-level completion, weak/due review cues, and teacher-visible
progress. Public visitors receive only explicitly flagged Level 1 preview rows;
authentication does not bypass teacher settings, level access, plan
requirements, or item blocks.

### Copyright and asset policy

The v10 curriculum, example sentences, dialogues, explanations, order, and UI
are original to Tahmid English Review Hub. No Global Crown or other logged-in
third-party lesson text, screenshots, images, or data were copied or scraped.
The structured curriculum uses original deterministic inline SVG illustrations,
Unicode labels, and CSS presentation, so it adds no unlicensed image dependency.
If a future contributor adds an external
asset, its license, author, source URL, and required attribution must be recorded
before publication. The existing Kevin MacLeod study tracks remain separately
documented under CC BY 4.0 on `/music-credits`.

## Local final-product inventory

- 31 lessons, 1,100 activities, and 14 implemented practice formats
- 155 illustration-led questions, five per lesson
- format-aware answer completeness and **Check N answered** partial grading
- immediate bilingual retry with the first official result preserved
- fresh-run question/choice shuffle and saved-run order restoration
- pre-entry Quick Practice (8 balanced questions, about 5–10 minutes) or Full
  Lesson choice for every accessible lesson
- a focused question-local Practice settings control for voice,
  selected-choice pronunciation, checking mode and hints; SFX, Study Music,
  display language and theme remain in the complete top Settings panel
- expanded bilingual Lesson Guides with a model-answer Practice map covering
  every one of the 1,100 activities across all 31 lessons
- Asia/Tokyo streak, weekly goal, unique completions, first accuracy, and retry
  improvement
- progressive phrase/vocabulary library with retained filters and audio
- persisted System/Light/Dark theme across home, phrases, lessons, and pricing
- five complete licensed instrumental Study Music recordings, on by default,
  with device-wide track/volume controls, voice ducking and a public licence
  page; prominent Music Credits navigation was removed, while the required
  CC BY 4.0 attribution remains in a quiet footer line and detailed route;
  browsers that block autoplay receive a visible one-tap music prompt
- a word-by-word entrance sequence, real-lesson value story, scroll reveals,
  reduced-motion fallback, and clearer free-lesson conversion path on the Hub
- redesigned, more audible click/correct/retry/completion sound cues and
  cross-page interaction feedback
- transcript-aware speaking guidance that separates a different sentence from
  a precise one-word change, shows what the browser heard versus the target,
  and gives missing/extra/change details plus short retry chunks
- public-shell PWA/offline fallback that excludes protected/authenticated data
- four-plan pricing, 13-row comparison, editable contact message, and exact
  savings/monthly equivalents; the public plan cards use the clearer 2×2
  hierarchy on desktop and a single column on small screens
- Teacher Studio organised into Dashboard, Learners, Access codes, Lessons &
  content, Submissions, Sources, and Insights
- 62 active Premium review tasks: one speaking and one essay per lesson
- 93 lesson-specific Premium topic choices: three per lesson, shared by its
  speaking and essay tasks, with topic-specific bilingual guidance
- human teacher feedback only; no automatic or AI grading

All 155 visual questions were programmatically re-audited across
image, prompt, choices, answer, hint, bilingual explanation, and alt text. Four
WebPs were replaced, one valid image received corrected alt/brief text, six
ambiguous distractor sets were corrected, and all 155 now have unique,
non-answer-revealing bilingual guidance. The 85 standalone illustrations retain
their recorded human review; the 70 new storyboard panels have structural and
asset checks and are not mislabelled as previously human-inspected. See
`docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md` and
`docs/question-quality-audit.md` for the separate evidence scopes.

## Fixed public prices

| Plan | Monthly | Six months | Saving | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: |
| Free | ¥0 | ¥0 | ¥0 | ¥0 |
| Standard | ¥3,980 | ¥20,300 | ¥3,580 (~15%) | ¥3,383 |
| Premium | ¥6,980 | ¥35,600 | ¥6,280 (~15%) | ¥5,933 |
| Premium+ | ¥16,800 | ¥85,700 | ¥15,100 (~15%) | ¥14,283 |

`src/plans.js` is the browser-side source of truth. `/plans` starts a real LINE
or Instagram conversation; it does not process payment or claim success.

## Local curriculum demo

To review the complete 32-level curriculum before migrations `024` and `025`
are applied, run:

```bash
npm run preview:demo
```

Then open `http://127.0.0.1:4174/`. The local learner view contains all 480
items, four review modes, sample due/progress/favorite state, and switchable
teacher-visibility personas. `http://127.0.0.1:4174/teacher` opens an editable
mock Teacher Studio; its settings and learner progress stay in browser
`localStorage` and never call Supabase.

This command first creates the normal allowlisted `dist/`, then creates a
separate ignored `demo-dist/`. The demo server binds to loopback, rejects
non-local Host headers, has no service worker, and refuses its data adapter on
non-localhost origins. The normal production build does not contain the demo
adapter, persona data, local progress bypass, or the embedded 480-item payload.
Never deploy `demo-dist/`; Netlify must continue to publish `dist/`.

## Local commands

```bash
npm run build
npm run build:demo
npm run preview:demo
npm run test:demo
npm test
npm run generate:curriculum
node scripts/test-structured-learning-schema.mjs
npm run verify:visuals
npm run verify:audio
npm run verify:live
npm run audit:audio-live
node scripts/test-teacher-controls.mjs
node scripts/test-teacher-workflows-v15.mjs
node scripts/validate-premium-schema.mjs
node scripts/test-premium-topics.mjs
node scripts/test-plan-platform.mjs
git diff --check
```

`generate:curriculum` is deterministic and verifies that
`202609050025_structured_learning_content.sql` still matches the reviewed JSON.
The migration is release-frozen: the command fails on drift and never rewrites
an existing `025`. Review curriculum updates in a new `026+` migration.

After the authentication fixes, the full `npm test`, `npm run build`, and
`npm run verify:visuals` sequence passed. The same full sequence, including the
five-track audio verifier and the new 17-lesson/616-question Lesson Guide audit,
passed again for the August 26 application checkpoint `8fb49e0`.

`npm run build` regenerates reviewed data and the protected Supabase question
migration. The public `dist/` allowlist deliberately excludes private authoring
sources. Static/local tests do not prove OAuth, RLS, recording upload, Netlify,
or real-device behavior. On August 14, the live-security and live-audio
commands were attempted but the sandbox could not resolve the Supabase host;
run them again from a network-enabled environment during Preview QA.

## Supabase release status

Supabase project `ycmybggetemkhorkhfnf` is on the Free plan, which did not offer
an available physical backup or PITR at the September 5 v10 preflight. A
restricted, repository-external logical snapshot was therefore captured before
`024`; it contains all 19 existing `public.review_*` tables plus schema,
function, policy, grant, count, and migration-ledger metadata. It excludes Auth,
Storage binaries, secrets, and unrelated schemas, so it is a targeted recovery
aid rather than full-project disaster recovery. The older privacy-safe logical
restore schema named `codex_backup_20260814_fcf561d` was also retained. It
contains migration-relevant catalog/data/definition snapshots, excludes
personal and Auth data, has RLS enabled, and has anonymous/authenticated access
revoked.

The v10 migrations are prepared but must be treated as pending until their
post-checks have been run against the linked project:

1. `202609050024_structured_learning_hub.sql` adds teacher/student ownership,
   learner visibility settings, curriculum levels/items/access, progress,
   favorites, announcements/targets, audit records, learner mutation RPCs, and
   ownership-aware RLS for existing learner-specific tables. It is additive and
   backfills Level 1–4 starter defaults; it does not delete learner data. A
   fresh-install guard makes replay fail before any durable change.
2. `202609050025_structured_learning_content.sql` seeds 96 category/level rows
   and 480 curriculum items with one-time inserts. It refuses non-empty
   curriculum tables, so apply it only once and only after `024`; future content
   changes must use `026` or later.

The migration ledger is not trustworthy: the live
`supabase_migrations.schema_migrations` table contains only the single manual
`20260820104726 legacy_notion_source_links` entry even though the verified
001–023 schema/data is present. Do not run a blind `supabase db push`. For
rollout, confirm at least one active Teacher, take the best available snapshot,
record both SQL hashes, and run `024` as one exact transaction. Execute its
included post-checks, then run `025` and verify 32 levels in each category plus
item totals of 320/128/32. Never replay either one-time migration.

Read-only preflight confirmed that both
`https://tahmid-english-review-hub-preview.netlify.app/**` and the production
`/**` callback are already present in the remote Supabase Auth redirect
allow-list, with Google and email sign-in enabled. Recheck before OAuth QA; if
the list drifts, make only a targeted remote correction after inspecting the
current Auth configuration. Do not push the whole local `config.toml` blindly.
Deploy the updated `membership-access` Edge Function, then build and
publish to the stable Netlify Preview alias. Hash-prefixed Netlify deploy URLs
are useful for immutable static inspection but are intentionally not accepted
by the Edge Function CORS allow-list and must not be used for OAuth/RPC QA. Test
dedicated teacher and non-teacher learner accounts before promoting the same
commit to production. If the frontend is deployed before the database
migrations, the structured library shows a controlled unavailable or empty
state while the existing learning experience remains usable.

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

The August 28 Notion expansion was then applied manually and verified in this
strict order:

1. `202608280019_lesson_source_segments.sql` — adds segment-aware source
   identity so one long Notion page can safely become Part 1 and Part 2.
2. `202608280020_new_notion_lessons_and_questions.sql` — stores 14 lessons and
   462 questions, exactly 33 questions and 14 formats per lesson.
3. `202608280021_new_lesson_premium_tasks_topics.sql` — stores 28 Premium tasks
   and 42 new bilingual lesson topics.
4. `202608280022_publish_new_notion_lessons.sql` — fails closed unless all
   provenance, content, format and Premium checks pass, then publishes the 14
   lessons to both learner audiences.
5. `202608280023_existing_notion_lesson_format_parity.sql` — brings the prior
   11 Notion lessons to the same 33-question, 14-format contract by adding the
   missing typing and labelled-grid activities without changing teacher-managed
   publication, audience, plan, lock, or active controls.

The live post-check returned 14/14 newly published lessons with 462 questions,
the prior 11 Notion lessons with 363 questions (33 each and all 14 formats),
and 31 public lessons with 1,100 questions overall. It also confirmed 28 new
Premium tasks (14 speaking and 14 essay). Those manual applications are not
reliably represented by the partial migration ledger; never use a blind
`db push`.

All five August 28 SQL files were applied manually. The current ledger contains
only one `legacy_notion_source_links` record and does not represent that full
sequence; do not infer missing entries or blindly replay the files.
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
- Current-account Preview (August 26 final pricing hierarchy, typography,
  question-local settings, expanded Lesson Guides, conversion polish,
  cross-page music and Quick Practice):
  `https://tahmid-english-review-hub-preview.netlify.app/`
- Exact current-account Preview deploy:
  `https://6a8eee9d22a46700081feb04--tahmid-english-review-hub-preview.netlify.app/`
  — static inspection only; use the stable Preview alias for OAuth and Edge RPC
  tests because the backend CORS allow-list intentionally rejects per-deploy
  origins
- Production: `https://tahmid-english-review-hub.netlify.app/`
- Legacy production (old Netlify account, retained during transition):
  `https://jocular-chaja-86e78d.netlify.app/`
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

Current v10 rollout detail is also maintained in
[`docs/operations-guide.md`](docs/operations-guide.md).

Historical/reference documents (their version-specific branch names and deploy
IDs are evidence, not v10 release instructions):

- [`docs/CODEX_HANDOFF_2026-08-02.md`](docs/CODEX_HANDOFF_2026-08-02.md)
- [`docs/V9_FINAL_AUDIT.md`](docs/V9_FINAL_AUDIT.md)
- [`docs/test-report.md`](docs/test-report.md)
- [`docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`](docs/PREMIUM_PLANS_AND_SUBMISSIONS.md)
- [`docs/TEACHER_AUTH_V15_2026-08-14.md`](docs/TEACHER_AUTH_V15_2026-08-14.md)
- [`docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`](docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md)
- [`docs/PERFORMANCE_AUDIT_2026-08-14.md`](docs/PERFORMANCE_AUDIT_2026-08-14.md)

## Future improvements

- Add an owner/admin-only workflow for onboarding additional teachers and
  reviewing teacher/student transfers, while keeping teachers unable to claim
  arbitrary learners.
- Tune spaced-review intervals from real learner outcomes and add opt-in weekly
  teacher summaries.
- Add curriculum authoring/versioning in Teacher Studio after the checked-in
  JSON and migration workflow has proven stable.
- Put origin controls and durable rate limiting in front of public natural
  speech if usage grows beyond the current classroom scale.
- Complete physical iPhone, Android, tablet, screen-reader, microphone,
  dedicated plan-tier, and multi-teacher isolation QA before production
  promotion.
