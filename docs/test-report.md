# Test Report / 動作確認レポート

Last updated: **August 18, 2026**

## August 18 final-polish checkpoint 4

- Scope: 17 lesson-specific Premium topic sets, three choices per lesson, used
  by both the speaking and essay task; topic-specific bilingual prompts,
  recommended phrases and vocabulary; selected-topic persistence and Teacher
  Studio visibility. Migration `017` is now applied; Preview UI publication is
  pending.
- `node scripts/test-premium-topics.mjs` — PASS: 17 lesson sets, 51 topics,
  three distinct phrase/vocabulary sets per lesson, both submission paths,
  accessible selector hooks, mobile layout, database validation and Teacher
  queue display.
- `node scripts/validate-premium-schema.mjs` — PASS with migration `017`
  requirements.
- PostgreSQL 18 parser — PASS: migration `017` parsed as 11 statements.
- `npm test`, `npm run build`, `npm run verify:visuals`, JavaScript syntax
  checks and `git diff --check` — PASS after integration.
- Preflight — PASS: 17 expected lessons, 34 stable/active Premium tasks, zero
  pre-existing `017` columns and the prior restore schema present.
- Restore checkpoint — PASS: `codex_backup_20260818_pre017` stores exactly 34
  non-personal Premium task definitions with RLS/access revocation and no
  learner submission/Auth data.
- Migration `017` — PASS in one SQL Editor transaction: both columns present,
  34 tasks with three topics, 102 task/topic presentations, 51 unique lesson
  topics, zero invalid topic rows, validation trigger present, and 34 backup
  rows retained.
- Live UI/RLS/submission QA is pending until application checkpoint `0dda67a`
  is published to Preview.

## August 18 final-polish checkpoint 3

- Scope: separate Voice/SFX/Ambient settings, refined procedural feedback SFX,
  five procedural study ambiences, ducking, persistence and PWA audio refresh;
  no downloaded music, Supabase schema, Edge Function or Production change.
- Regression coverage — PASS: Ambient defaults OFF with Calm Focus selected,
  SFX persists without changing Voice, all five track keys exist, speech keeps
  its separate volume and unsupported Web Audio fails safely.
- Local Browser QA — PASS: settings dialog opened with Voice ON, SFX ON,
  Ambient OFF and Calm Focus; switching SFX OFF left Voice ON, then switching
  Ambient ON left both other preferences unchanged. The temporary settings were
  restored after the check.
- Natural US/UK/Japanese live-service checks remain covered by the existing
  audio audit; the final live audit will be rerun after the integrated Preview.

## August 18 final-polish checkpoint 2

- Scope: learner-facing Light default, pricing/promotion, Premium/Premium+
  styling, lock presentation, and shared personal footer; no Supabase schema,
  Edge Function or Production change.
- `npm test` — PASS, including exact price/savings, promotion eligibility and
  contact-message assertions.
- `npm run build` — PASS.
- `npm run verify:visuals` — PASS for all 85 assets.
- Local Browser QA at the available desktop viewport — PASS: both Premium
  badges remained fully visible, the Premium-only 30-day/`¥3,490` offer and
  personal-confirmation disclaimer rendered, all four cards stayed aligned,
  and the shared footer rendered. Dedicated 390 px and deployed Dark/Lighthouse
  checks remain part of integrated Preview QA.
- `git diff --check` — PASS.

## August 18 final-polish checkpoint 1

- Scope: Teacher Studio one-language English/Japanese completion and safe lesson
  source display; no Supabase schema, Edge Function or Production change.
- `npm test` — PASS, including the new Teacher Studio language/source-safety
  suite.
- `npm run build` — PASS; private draft authoring files remained excluded.
- `npm run verify:visuals` — PASS for all 85 visual assets.
- `node scripts/test-teacher-i18n.mjs` — PASS for selected-language controls,
  dynamic confirmation/status coverage, persistence/rerendering, Notion host
  allow-listing and public-build exclusion.
- `node scripts/test-teacher-controls.mjs` and
  `node scripts/test-teacher-workflows-v15.mjs` — PASS after the UI copy/source
  changes.
- Local Browser QA — PASS for English-to-Japanese login-screen switching,
  including visible text and accessible names. Authenticated live Teacher QA is
  intentionally deferred until the integrated Preview deployment so the
  existing user session is preserved.
- `git diff --check` — PASS.

## August 14 final-product rollout verification

Current release status must be read separately from local test results:

- Working branch: `upgrade/review-hub-v9-final-product`.
- Exact deployed application commit:
  `049b5ff4da6606fcffc461f412f314d253916e13`; historical rollout/logical-
  restore checkpoint: `fcf561d78da6de405d6ca54b78ebfc99df3d3a0a`.
- Current documentation checkpoint is branch HEAD (`git rev-parse HEAD`), because
  a documentation commit cannot contain its own final hash.
- The dedicated v9 preview successfully published the application commit as
  Netlify deploy `6a7e9a1002ab210008522e82`. Production static files remain
  pre-v9 and untouched.
- Migrations `202608140015_teacher_preview_and_premium_workflows.sql` and
  `202608140016_visual_question_content_corrections.sql` are live, and the
  matching updated `membership-access` Edge Function is deployed.
- Authenticated Supabase/RLS/OAuth/access-code/submission QA and real-device QA
  are pending. Local/static PASS results below do not prove those live paths.

### Passing live rollout evidence

- Supabase target — VERIFIED: project ref `ycmybggetemkhorkhfnf`.
- Pre-change restore point — PARTIAL SAFETY: Supabase Free had no official
  dashboard backup, so privacy-safe schema `codex_backup_20260814_fcf561d` was
  created. It excludes learner/Auth personal data and has RLS/access revocation;
  it is not full disaster recovery.
- Migration `015` — PASS in its own SQL Editor transaction: 34 active tasks,
  exactly 17 speaking/essay lesson pairs, 34 stable seeds, and the expected
  profile/preview/review/reissue/redeem functions and privacy/ownership policies.
- Migration `016` — PASS in a separate SQL Editor transaction: 85 visual rows
  changed versus the restore snapshot; all 17 lessons have
  `content_version >= 4`; 85 unique English and 85 unique Japanese hints; zero
  missing guidance and zero invalid choice sets. The 34 Premium tasks remained.
- Migration tracking — ABSENT: changes were applied manually; the project has
  no `supabase_migrations.schema_migrations` table and the dashboard reports no
  migration records. The postconditions above, not a ledger, are the evidence.
- `membership-access` — DEPLOYED: the matching source was deployed and the
  fresh dashboard timestamp plus audited transactional response fields and
  generic error boundary were observed.
- Netlify Preview — PASS: exact application commit `049b5ff` published as deploy
  `6a7e9a1002ab210008522e82`.
- Immutable Preview URL — VERIFIED:
  `https://6a7e9a1002ab210008522e82--tahmid-english-review-hub-v9-preview.netlify.app`.
- Production — NOT DEPLOYED: its static site remains pre-v9. Preview and
  production share Supabase, so the verified backend changes are nevertheless
  live for requests from either frontend.

### Passing local tranche evidence

- `npm test` — PASS after the deployed authentication fixes: content,
  question-quality, learning-experience, learner-platform, Teacher Studio,
  premium-schema, plan-platform, and v15 workflow suites passed.
- `npm run build` — PASS in the learner, Teacher/Auth, visual-content, and
  frontend tranches.
- `npm run verify:visuals` — PASS: all 85 required WebPs are present and pass
  file checks.
- `node scripts/audit-question-quality.mjs` — PASS: 17 lessons, 616 activities,
  and 85 visual questions.
- `node scripts/validate-content.mjs` — PASS: 1,369 integrity/security
  assertions.
- `node scripts/test-learning-experience.mjs` — PASS after the final learner
  experience and accessibility changes.
- `node scripts/test-learner-platform.mjs` — PASS: all 14 formats, immediate
  retry, format-aware completeness, checked-only totals, profile gate, theme,
  and PWA regression assertions.
- `node scripts/test-teacher-workflows-v15.mjs` — PASS.
- `node scripts/test-teacher-controls.mjs` — PASS.
- `node scripts/validate-premium-schema.mjs` — PASS.
- `node scripts/test-plan-platform.mjs` — PASS after pricing/theme/PWA and
  accessibility changes.
- PostgreSQL 18 parser checks — PASS: migration `015` parsed as 60 statements
  and migration `016` parsed as 2 statements. This proves syntax, not live
  schema dependencies or RLS behaviour.
- `node scripts/generate-question-migration.mjs` — PASS and regenerated
  forward-only migration `016` with an exact 85-row postcondition.
- JavaScript syntax checks and final integrated `git diff --check` — PASS.
- Local Browser QA — PASS for the checked public flows: 390 px and 430 px
  home/pricing/phrase/lesson layouts have no page-level horizontal overflow;
  621/768/900 px learner headers stay compact; desktop layout was visually
  checked at 1,024 and 1,440 px; light/dark persistence, six-month calculations,
  editable/reset/copied plan message, 24-item progressive phrase rendering,
  roving radio keys, and immediate Retry were exercised. The exact first-score
  denominator invariant was verified later on deployed commit `ecf8726`, as
  recorded below. The local browser console log was empty during the final
  checked route.
- `npm run verify:live` — BLOCKED in this sandbox on August 14: DNS resolution
  for `ycmybggetemkhorkhfnf.supabase.co` returned `ENOTFOUND` before any live
  assertion ran.
- `npm run audit:audio-live` — BLOCKED for the same DNS restriction before any
  live request ran. Historical PASS evidence below is retained but does not
  replace a fresh post-deployment run.

The complete `npm test`, `npm run build`, and `npm run verify:visuals` sequence
passed after the profile-save fixes. After the final query cache-bust in
`049b5ff`, the latest full `npm test` and `npm run build` passed again.

### Prior validated public Browser QA (`ecf8726`)

- Home — PASS: 17 lessons, 616 activities, and 14 formats displayed.
- Pricing — PASS: exact monthly and six-month values; Dark preference persisted.
- Phrase Library — PASS: progressive rendering expanded from 24 to 30 items.
- Sample lesson — PASS: automatic shuffle notice appeared; radio-arrow input
  stayed on Question 1; the visual question showed a unique hint and a
  distractor-specific bilingual explanation.
- Retry regression — FAIL on `fcf561d`, then FIXED/PASS on `ecf8726`: a wrong
  first attempt initially displayed `0/1`; the old deploy incorrectly changed
  it to `0/2` after a correct retry. The exact new deploy retained the official
  `0/1` score after that retry.
- Audio controls — PASS for 0.5x setting persistence and the mixed
  English-to-Japanese control path, with no console error. This was a UI/control
  check, not a substitute for the pending fresh live-audio command or physical
  audio QA.
- Locked June 30 lesson — PASS: no protected question payload was exposed.
- Teacher public gate — PASS: unauthenticated gate and English/Japanese switch.
- Routing/assets — PASS: legacy Taki redirect and replacement WebP delivery.
- Browser log — PASS: no warning or error entries in the checked run.
- Earlier Google starts — PARTIAL: learner and Teacher reached the official
  chooser and the Teacher return target was correct. Learner auth was later
  completed below; Teacher auth remains pending.

### Authenticated Google learner profile-save hotfix

- Google sign-in — PASS.
- First Save profile — REPRODUCIBLE FAIL before the fix:
  `permission denied for table review_profiles`; the old conflict-update sent
  insert-only `user_id`.
- Fix chain — `d0b244b` split insert/update and added modal-local status;
  `50656f8` avoided the stale automatic race; `a69ab08` bumped PWA cache v3;
  `049b5ff` cache-busted the query.
- Database scope — unchanged: no migration `017`, no new grant, and no
  `UPDATE(user_id)` permission.
- Live retest — PASS: modal-local and page success appeared, the gate closed,
  reload stayed complete, Standard showed through August 2, 2027, and all 44
  June 30 questions were accessible.
- Safe sign-out — PASS: reload stayed signed out and a second lesson tab locked.
- Tier-negative limitation — NOT PROVED: Premium task cards appeared while the
  label said Standard, so the identity likely has Teacher elevation. Dedicated
  non-teacher tier accounts are required.
- End state — learner signed out; Teacher auth remains pending.

### Content review evidence

- All 85 illustration-led questions were manually reviewed across the rendered
  image, prompt, four choices, answer, hint, bilingual explanations, and alt
  text.
- All 85 now have unique, question-specific, non-answer-revealing English and
  Japanese guidance, one bilingual correct-evidence pair, and three bilingual
  distractor-conflict reason pairs.
- Four images were replaced and rechecked:
  `july-13-03-rush-back.webp`, `july-19-02-either-day.webp`,
  `july-22-01-availability.webp`, and `july-27-02-poured-sauce.webp`.
- The valid July 27 splash image was kept while its inaccurate alt/brief was
  corrected. Six ambiguous distractor sets were corrected.
- The exact lesson/question/fix ledger is
  `docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`.

### Final-product checks still required

- Fresh live-security and live-audio checks from an environment with Supabase
  network access, plus one final exact-commit test/build/diff check if anything
  changes after this report.
- Deployed light/dark Lighthouse checks for home, phrases, pricing, and lesson;
  remaining named-breakpoint and overflow inspection not covered by the exact
  public run above.
- Authenticated Teacher; dedicated non-teacher Free/Standard/Premium/Premium+
  access negatives/positives; email auth; Teacher preview; and access-code
  lifecycle. Scoped Google learner profile/reload/sign-out passed above.
- Draft privacy, real speaking recording/upload/return/resubmission, essay
  review/publication, and RLS-negative checks after migration/function rollout.
- Real iPhone Safari and Android Chrome touch, microphone, PWA install/update,
  and offline-shell checks.

## August 11 Premium platform preview verification (dated record)

This section is retained as historical evidence from the prior session. It is
not the current deployment source of truth: the current source is the August 14
rollout record above for `upgrade/review-hub-v9-final-product@049b5ff`. The
reported migration `014`/older Edge deployment was not independently re-read
from a remote migration ledger; the project currently has no such ledger.

- `npm test`: PASS, including the new fixed-price/contact/Premium+ platform
  checks.
- `npm run build`: PASS; `/plans`, `src/plans.js` and `src/pricing.js` are in
  the public allowlist while private authoring sources remain excluded.
- `npm run verify:visuals`: PASS for all 85 WebP question assets.
- `git diff --check` and JavaScript syntax checks: PASS.
- Fixed source-of-truth values: Free ¥0, Standard ¥3,980, Premium ¥6,980 and
  Premium+ ¥16,800 monthly; six-month values ¥0/¥20,300/¥35,600/¥85,700.
- The supplied LINE QR decoded to the same URL now stored in the central contact
  config. The exact supplied Instagram URL is also asserted by test. No
  placeholder profile and no fake payment-success copy remain.
- Central lesson Settings, 1.0x fresh playback, default-on selected-choice
  pronunciation, always-on new-run shuffle and derived question-type practice
  pass static/runtime regression checks.
- Migration 014 is applied to Supabase project `ycmybggetemkhorkhfnf`. A live
  readback confirmed active Free, Standard, Premium and Premium+ rows, plan
  ranks 0/10/20/30, the safe teaser view and the new catalog constraint.
- The matching `membership-access` Edge Function was deployed from the committed
  source. The dashboard showed the new deployment timestamp and cleared its
  modified-file marker.
- Netlify preview
  `https://tahmid-english-review-hub-v9-preview.netlify.app` is published from
  `upgrade/review-hub-v9-premium-platform`. The application implementation is
  commit `fe81008`; build, redirects, headers and post-processing completed
  without errors.
- Hosted desktop and 390 × 844 browser checks pass for `/plans`: all four
  monthly and six-month prices, selected-plan contact copy, exact LINE and
  Instagram destinations, modal fit and zero page-level horizontal overflow.
- Hosted lesson checks pass for the consolidated Settings dialog, 1.0x playback,
  default-on selected-choice pronunciation, dynamic question-type filtering,
  reshuffle and zero desktop/mobile horizontal overflow.
- Valid-teacher browser controls remain pending because the test browser has no
  teacher-authorised login session. No password was entered or requested.

## Automated content and security checks

- The preserved source ZIP and supplied general entrance page still match their
  recorded SHA-256 hashes.
- All six original lessons and all **143 original activities** are present with
  stable IDs.
- All **132 added activities** and **341 Notion-derived activities** are present.
- The complete reviewed source contains **616 activities in 14 formats**.
- The production build excludes `notion-drafts.json` and `curriculum.js`.
- The public route catalogue contains all 17 reviewed lessons after the v9
  publication decision.
- The Netlify lesson redirect preserves the requested lesson slug.
- The shipped anonymous private-hub HTML does not contain the learner’s display
  name; it is inserted only after an authorised profile check.

Run locally:

```bash
npm run build
npm test
npm run verify:live
```

## August 3 current verification snapshot

- `npm test`: PASS — 17 lessons, 616 activities, 14 formats and 1,369
  integrity/security assertions.
- `npm run build`: PASS — 616 protected question rows generated; private source
  files remain excluded from `dist/`.
- `npm run verify:visuals`: PASS — all 85 WebP visual-question assets exist and
  match the manifest dimensions/type checks.
- Hosted preview visual check: PASS — all 85/85 assets return HTTP 200,
  `image/webp`, and non-empty image bytes with concurrency limited to four. The local preview server's missing
  WebP MIME mapping was found during this check and fixed.
- `npm run verify:live`: PASS — 17 public catalogue lessons, exactly two free
  previews, 80 anonymous preview activities, two plan descriptions, and 18
  private/base resources denying anonymous reads.
- `npm run audit:audio-live`: PASS — one live natural-English request for every
  lesson plus Japanese and British voice requests; every listening/speaking
  activity has a non-empty target.
- Hosted browser: PASS — the home summary displays 17 lessons and 616 activities;
  new runs automatically shuffle both question and choice order; 0.5x, 1x and
  1.5x playback and mixed Japanese/English sequencing complete without a stuck
  control.
- `membership-access` Edge Function: deployed as version 2; CORS preflight and
  unauthenticated rejection were verified. An authenticated learner submitted
  a well-formed unknown code and received the distinct bilingual "not found"
  result instead of an endless loading state. A valid teacher session is still
  required for the full create/edit/reissue/delete/redeem browser workflow.
- Supabase migrations 010, 011 and 012: PASS in the authenticated dashboard on
  August 3. The private Premium recording bucket and all three authenticated
  storage policies are visible after application. Migration 012 verification
  returned two question-access columns, the payload-free teaser view and the
  question-access function. Migration 013 then raised the live total to 616;
  all 616 questions still have the Free
  default; no lesson was silently moved behind a paid tier.
- Per-question plan controls: PASS in local static/security tests — Teacher
  Studio exposes Free, Standard, Premium, safe-teaser and hidden settings. The
  teaser view cannot select payload, stable key, prompt, choices, hint,
  explanation or answer fields. Valid-teacher and below-tier learner browser
  confirmation remains pending because no test question has been deliberately
  tier-locked in the live catalogue.
- New v9 Netlify preview: PASS at
  `https://tahmid-english-review-hub-v9-preview.netlify.app`, deployed from the
  working v9 branch. Hosted checks pass for 17/616 summary, 85/85 WebP
  responses, automatic reshuffle, 0.5x/1.5x selection, natural and mixed
  English/Japanese audio, Google callback, sign-out and the protected Teacher
  Studio entry page. A 390 × 844 check found a bilingual hint-button overflow;
  it was fixed and rechecked at `width = scrollWidth = 390` with no browser
  warnings/errors. Real-device touch, microphone upload and valid-teacher
  end-to-end controls remain pending.

The July 30 sections below are retained as dated historical evidence. Their
485-question counts describe the pre-expansion deployment and are not the
current 616-activity source/build total.

## July 30 live Supabase verification (before the 31-activity expansion)

The three Review Hub migrations were applied to the existing
`Tahmid English Academy` project through the trusted Supabase SQL Editor. They
create or update only `review_` objects.

Verified live counts:

| Check | Result |
|---|---:|
| All Review Hub lessons | 17 |
| Published to both audiences | 17 |
| Remaining private drafts | 0 |
| All active activities | 485 |
| Public activities | 485 |
| Published July 7–27 activities | 264 |

Anonymous REST checks:

- `review_public_lessons`: **200**, 17 rows
- `review_public_questions`: **200**, 485 rows
- ten personal/base resources reject anonymous reads
- private authoring data is absent from the public static build

## Credentialed RLS test

Three temporary, auto-confirmed test identities were used: an authorised
teacher, a private learner, and a second ordinary learner. No test password was
stored in the repository, Notion, SQL, or this report.

| Test | Private learner | Other learner | Teacher |
|---|---:|---:|---:|
| Password sign-in | 200 | 200 | 200 |
| Visible profile rows | 1 (self) | 1 (self) | all test profiles |
| Visible lessons | 6 | 6 | 17 |
| Visible drafts | 0 | 0 | 11 |
| Reads first learner’s test attempt | 1 | 0 | 1 |

The private learner’s own attempt, retry answer, speaking record, phrase
record, and assignment were accepted. The second learner could not read the
attempt. The teacher could read it for feedback and analytics.

## Browser and interaction checks

Local Chromium-based browser checks covered:

- general entrance and 17 lesson cards
- private anonymous gate and authorised private dashboard
- teacher-only gate, teacher sign-in, 17 published lessons, audience controls,
  and
  student count excluding teachers
- Manual and Instant Check
- first-answer score lock and retry-only results
- question and choice shuffle
- partial matching/sorting scoring
- mistakes-only, unanswered-only, and all-question practice
- all 14 activity formats
- English-only, bilingual, and full Japanese interface modes
- hint auto-close and keep-open modes
- answer feedback sounds and vibration feature detection
- Phrase and Vocabulary Library tabs, filters, search, favorites, speaking,
  per-card US/UK audio and Japanese meaning audio,
  learning notes, practice count, and last-practised date
- account-scoped local progress, phrase activity, and settings
- 390 px responsive layout with no horizontal overflow and 44 px controls
- 404 and invalid-lesson handling

Safari checks covered the general hub, a scored lesson answer, and natural
voice playback before packaging.

## Hosted Netlify production smoke test (pre-expansion snapshot)

The separate Netlify preview at
`https://tahmid-english-review-hub-preview.netlify.app/` was deployed from the
private GitHub repository’s `upgrade/review-hub-v8` branch. After that review,
the same static output was promoted to
`https://jocular-chaja-86e78d.netlify.app/`.

Hosted checks covered:

- 17 public lessons and 485 public activities
- the short `/lesson/june-28` route and the query-string lesson route
- Manual Check and first-answer lock
- the anonymous private-account gate
- authorised private sign-in, personal history, and history after reload
- refusal of a second learner account without private-hub scope
- teacher sign-in, 17 published lessons, audience editing, and two
  non-teacher test learners
- question-level, format, retry, lesson, speaking, phrase, and session analytics
- direct learner refusal for the July 27 draft
- teacher-only preview of all 24 July 27 draft activities
- all 199 Phrase Library cards, 15 Vocabulary cards, and their learning notes
- live US Ava, UK Libby, and Japanese Nanami playback
- hosted phrase practice synchronising back to teacher analytics
- Japanese UI at the 390 px mobile breakpoint with no page-level horizontal
  overflow
- the July 27 illustration at 342 px inside the 390 px mobile viewport

The first hosted deploy revealed that an internal Netlify rewrite did not
expose the lesson slug to browser JavaScript. The player now also derives the
lesson ID from `/lesson/:slug`; an automated regression assertion and a second
hosted smoke test both pass.

## Natural voice

The live `natural-speech` Edge Function returned valid `audio/mpeg` for both:

- American English / Ava: HTTP 200
- British English / Libby: HTTP 200

No browser/computer speech fallback is used. If natural speech is unavailable,
the UI gives a clear retry message instead of switching to a mechanical voice.

The live function also returned valid `audio/mpeg` for Japanese / Nanami.

## Items that require the real learner or a physical device

- The teacher account can now enter the private hub as a preview learner while
  retaining teacher authorisation. A separate permanent learner account can
  still be created later when the learner’s email is supplied.
- The real learner’s sign-in, password handoff, and history-after-relogin need
  confirmation after that account is created.
- Browser microphone permission was denied in the automated environment, so
  the safe manual-speaking fallback was verified; real microphone recognition
  still needs one short check on the learner’s device.
- Responsive browser checks passed, but a final touch check on the learner’s
  physical phone/tablet remains recommended.

The three temporary test identities and their cascade-linked test records were
removed after the hosted preview smoke test. A scoped SQL verification returned
zero remaining `codex.reviewhub.*` users, zero test profiles, and zero orphaned
attempts. The existing `tahmidhc245@gmail.com` teacher identity remains present
and authorised.

## August 2 v10 membership addendum

- All 17 lesson titles remain visible before sign-in.
- Two preview lessons expose 62 activities; the other 423 activity payloads are
  no longer returned through the anonymous question view or static fallback.
- Anonymous REST verification returned 17 catalogue rows, exactly two
  `is_preview` lessons, and 62 public question rows.
- The repeatable live check confirms that 13 personal/base resources reject
  anonymous reads, including memberships, access codes, and redemptions.
- Sign-in and create-account panels switch correctly and expose eight
  privacy-conscious profile fields/controls.
- The complete source now passes all 1,369 content/security assertions and
  all 616-activity validation.
- The Lesson Guide shows non-empty, bilingual key points and playable phrases.
- Natural voice playback completed without browser console errors; requests now
  retry once and reject invalid/empty audio without falling back to a computer
  voice.
- The full-image layout uses `object-fit: contain` and responsive height limits,
  preventing the late-July illustrations from being cropped.
- Supabase migration 005 completed successfully. Production, preview, and local
  authentication return URLs are approved. Email signup remains confirmed-email
  only. Google OAuth was still pending at the time of this dated August 2
  snapshot; it was enabled and locally tested on August 3.

## August 2 lesson skill expansion (local source)

This is a dated intermediate snapshot. The final August 14 source contains 85
visual questions/assets, not 55; see the current verification section above.

- All 11 Notion-derived lessons generate 31 activities each.
- Every lesson has five distinct illustration-led activities, six listening
  activities, and five speaking activities.
- The reviewed source and protected question migration contain 616 activities.
- At this intermediate point, the visual production manifest contained 55
  unique WebP paths, alt text, and lesson-specific scene briefs.
- `npm test` passes with 1,369 assertions.
- At this intermediate point, `npm run verify:visuals` passed with all 55
  then-required illustrations present.
