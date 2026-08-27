# Test Report / 動作確認レポート

Last updated: **August 28, 2026**

## August 28 new-account public release and OAuth gate

- Application commit: `85ecfbf33c24b077a28cd9235467d32a4a73e8ba`.
- Netlify public release — PASS: project
  `tahmid-english-review-hub-v9-release`, Site ID
  `f30d0264-70d0-4234-83ec-c717fa428f99`, deploy
  `6a90b24a2703d100098ffe4b`, public URL
  `https://tahmid-english-review-hub-v9-release.netlify.app`.
  Netlify shows exact branch `upgrade/review-hub-v9-final-product` at
  `85ecfbf` as published with automatic publishing on.
- Full local verification — PASS after the final navigation-safety fix:
  `npm test`, `npm run build`, `npm run test:learner-platform` and
  `git diff --check`. The suite remains 17 lessons, 616 activities, 85 visual
  questions, 14 formats and 1,382 integrity/security assertions.
- Public Home/Plans/Lesson QA — PASS: 17 lessons and 616 questions; centered
  BGM invitation visible then absent after five seconds; all four plan prices
  and compact disclosures; June 29 full mode with 37 questions and automatic
  shuffle; no Netlify overlay badge.
- Settings scope — PASS: the question-local dialog contains only Voice On/Off,
  US/UK voice, selected-choice pronunciation, Manual/Instant checking and hint
  behavior. The top dialog retains speed/voice volume, SFX/volume, five Study
  Music tracks/volume, choice translations, display language and theme.
- Google OAuth — PASS after adding the new public origin to Supabase Auth's
  redirect allow-list. The real `tahmidhc245@gmail.com` flow returned to the
  new domain, completed sign-in, and exposed Quick plus Full entry for all 17
  lessons with zero locked lesson links.
- OAuth navigation safety — PASS: the final release removes one-time callback
  query values and access/refresh/provider token fragments from internal
  `return` links. A regression test covers the sanitizer; the deployed
  post-login Phrase Library link was `/phrases?return=%2F` and contained no
  auth token field.
- Production naming note: Netlify treats this as the new project's public
  Production deploy. The legacy old-account URL
  `https://jocular-chaja-86e78d.netlify.app` was intentionally not overwritten.

## August 28 release UX and local-first checkpoint

- Application commit: `fbd67fac20823e88ef4010f10e6558f53a99ecd4`.
- Full local verification — PASS: `npm test`, `npm run build`,
  `npm run verify:visuals` and `git diff --check`. This retains 17 lessons,
  616 activities, 85 visual questions, 14 formats, 1,382 integrity/security
  assertions, full 616-question Lesson Guide coverage and five verified local
  M4A Study Music tracks.
- Real local Browser QA — PASS: a fresh lesson showed the centered Study Music
  invitation; it was absent after the 4.2-second hold plus fade. June 29 then
  loaded all 37 questions and the automatic question/choice shuffle notice.
- Focused Practice settings — PASS: the question-local dialog showed only
  Voice On/Off, US/UK voice, selected-choice pronunciation, manual/instant
  checking and hint behaviour. SFX, Study Music, display language and theme
  were absent. Reopening from the top Settings button showed the complete set,
  including speed/volume, SFX, all five tracks, translations, language and theme.
- Pricing scan/readability — PASS locally: all four plan names, current prices
  and one core benefit appeared before the full card grid. Free, Standard,
  Premium and Premium+ kept their full cards; long benefit lists were collapsed
  behind keyboard-accessible `What's included / 含まれる内容` disclosures.
  The settings controls were hidden behind the explicit Settings button.
- Typography — PASS in exercised Home, Plans and Lesson views: display headings
  use the new editorial system-serif stack, controls/body use the system sans
  stack, and English/Japanese copy no longer collided in the tested views.
- Netlify/Production — this dated local checkpoint was subsequently superseded
  by the public `85ecfbf` release documented immediately above.

## August 26 final pricing, typography, settings and Lesson Guide checkpoint

- Application commit: `8fb49e02184c3569e85fbd7cede2fe9866d16c93`.
- Netlify Preview — PASS: deploy `6a8eee9d22a46700081feb04` published from
  that exact commit. Immutable URL:
  `https://6a8eee9d22a46700081feb04--tahmid-english-review-hub-preview.netlify.app/`.
  Production was not deployed; Supabase schema and Edge Functions were not
  changed in this checkpoint.
- Full verification — PASS: `npm test`, `npm run build`,
  `npm run verify:visuals` and `git diff --check`. The suite covers 17 lessons,
  616 activities, 85 visual questions, 14 formats, 1,382 assertions, all five
  complete Study Music assets, and the new 17-lesson/616-question Lesson Guide
  model-target audit.
- Public pricing — PASS: `/plans` renders four cards in the adopted 2×2 desktop
  hierarchy and keeps Premium's speaking/writing review tiles side by side.
  Premium+ shows its English and Japanese names on separate lines and retains
  the three-session/50-minute coaching visual. The private no-index comparison
  defaults to and labels the adopted layout.
- Typography — PASS in the exercised public and private pricing views:
  English/Japanese headings render as separate lines instead of colliding or
  relying on slash wrapping.
- Lesson-local settings — PASS on the public Preview: the question-toolbar
  button opens the complete dialog with voice/volume/speed, selected-choice
  pronunciation, SFX/volume, five Study Music tracks/volume, checking mode,
  hint behavior, display language and theme.
- Lesson Guide — PASS on public `june-29`: the guide opened without the old
  large section-level blank and exposed `Practice map · 37 questions / 問題対応
  リスト · 全37問`; automated coverage confirms model targets for all 616
  questions.
- Study Music control — PASS on the public Preview: one explicit interaction
  changed the persisted state from `Ambient Off` to `Ambient On`. Earlier
  same-day browser/audio verification proved the real local M4A advanced with
  ready state 4 and no media error. Browser autoplay restrictions still mean a
  first visit may require the existing one-tap start prompt.
- Speaking regression — PASS in the integrated suite: target “I haven’t taken
  a bath yet.” versus transcript “How are you” is `different-sentence`, not a
  one-word correction. Real microphone/recognition QA remains a device gate.

## August 26 entrance, pricing-layout, BGM fallback and SFX checkpoint

- Application commit: `a7002c04785f7a802800ba89083e92737fe4b274`.
- Netlify Preview — PASS: deploy `6a8e0def46faf70007aa4ef9` published from
  the exact commit above. Immutable URL:
  `https://6a8e0def46faf70007aa4ef9--tahmid-english-review-hub-preview.netlify.app/`.
  Production was not deployed; Supabase schema and Edge Functions were not
  changed in this checkpoint.
- Full local verification — PASS: `npm test`, `npm run build`,
  `npm run verify:visuals`, JavaScript syntax checks and `git diff --check`.
  This includes 17 lessons, 616 activities, 85 visuals, 14 formats, 1,382
  integrity/security assertions, all five complete M4A tracks, learner,
  Teacher, plan and Premium workflow tests.
- Published mobile layout — PASS at 390 × 844: Hub, Quick lesson and pricing
  had `scrollWidth === clientWidth === 390`. Premium's speaking/writing review
  rows were each 280 px wide with no internal overflow. Standard visibly says
  `14 ways to practise / 選べる14種類の練習`.
- Quick Practice — PASS on the public Preview: `june-29&practice=quick` showed
  `1 / 8`, exactly eight question-navigation buttons and the 5–10 minute entry
  label.
- Study Music — PASS on the public Preview: the real local audio element
  reported `playing`, `paused === false` and advancing current time. A fresh
  browser-blocked start was also exercised locally: the fixed one-tap prompt
  appeared and playback began after the click. This is an honest autoplay
  fallback, not a promise that browsers permit unprompted audible playback.
- Interaction sound — PASS locally in a real browser: the normal click cue
  reported the new two-note pattern. Static regressions cover distinct
  correct, retry and completion calls; grading content was not altered.
- Pricing layout comparison — PASS on the public Preview at 1440 × 900. Layout
  A rendered four equal 280 px cards; layout B rendered four equal 550 px cards
  in 2×2; both had no page overflow. The route is `noindex,nofollow`, and its
  CTAs are deliberately disabled because it is a visual decision page.
- Browser log — no new error-level message was produced by the August 26
  version. One stale pre-build module error from the earlier `experience1`
  cache and Supabase multi-client warnings from navigating one QA tab remain
  historical test-session noise, not errors from `experience3`.

## August 25 cross-page music, speaking and plan-clarity checkpoint

- Application commit: `ae766535442dcd17d2d6976303dafb0423a3edc3`.
- Netlify Preview — PASS: deploy `6a8c62cc2b35130008cdffb1` published from
  `upgrade/review-hub-v9-final-product` in 12 seconds (12 uploaded files, four
  generated pages and eight changed assets). Immutable URL:
  `https://6a8c62cc2b35130008cdffb1--tahmid-english-review-hub-preview.netlify.app`.
  Production was not deployed.
- Cross-page Study Music — PASS locally and on the exact Preview: Plans and
  Teacher Studio expose Music On/Off, all five named tracks and 0–40% volume.
  Both routes played `/assets/audio/ambient/clear-air.m4a` with `paused=false`,
  ready state 4, advancing current time and no media error. The same device
  preference is shared with Hub, lesson, library, music credits, contact flow
  and the public error page. A browser that blocks autoplay shows the honest
  “Tap once to start” state.
- Speaking comparison — PASS: the reproduced target “I haven’t taken a bath
  yet.” versus recognized “How are you” returns `different-sentence`, never
  the one-word message. The result retains the original target/heard text,
  identifies missing/extra/change words and supplies short retry chunks. A
  real one-word substitution still receives the precise heard→target message.
  This validates transcript-level comparison; real microphone recognition and
  phoneme-level pronunciation scoring remain outside this claim.
- Premium/Premium+ clarity — PASS at desktop and 390 px: removed the crowded
  `2×`/`3×` ornaments. Premium shows one speaking and one writing review per
  lesson plus separate `FIRST 30 DAYS ¥0` and `SECOND MONTH ¥3,490 · 50% OFF`
  steps. Premium+ shows three sessions per month, 50 minutes each, on a stable
  `01—02—03` line. Mobile `scrollWidth` equalled its 390 px viewport.
- `npm test`, `npm run build`, `npm run verify:visuals`, the five-recording
  audio verifier and `git diff --check` — PASS. The suite covers 17 lessons,
  616 activities, 85 visuals, 14 formats and 1,382 integrity/security checks.

## August 24 Premium, Quick Practice and licensed-music checkpoint

- Application commit: `18571bd82be51986e43621fc5242c2e6386221b6`.
  Feature parent: `5cd3a53b2f5094e751b1374e7f232b3519a77dfd`.
- Netlify Preview — PASS: deploy `6a8c2e337479160008093171` published from
  `upgrade/review-hub-v9-final-product`. Immutable URL:
  `https://6a8c2e337479160008093171--tahmid-english-review-hub-preview.netlify.app`.
  Production was not deployed.
- Premium visual QA — PASS at 1440 px and 390 px in Light/Dark: Premium shows
  a visible `🎁 SPEAK → WRITE` story and gift-led new-applicant offer; Premium+
  shows `LIVE 01 02 03`. The former three-dot orbit is absent. The only motion
  is a slow whole-card border highlight plus restrained session glow, disabled
  by reduced-motion. Mobile `scrollWidth` equalled the 390 px viewport.
- Quick Practice — PASS locally and on the exact Preview: lesson cards offer
  Quick (5–10 minutes, 8 questions) and Full Lesson before entry. The Quick URL
  loaded with `practice=quick`, selected the Quick set, rendered question
  buttons 1–8 only, and displayed the exact bilingual duration/count notice.
- Study Music — PASS: removed procedural Web Audio ambience; Ambient defaults
  ON at 18%, starts after the first permitted interaction, loops, supports five
  choices and 0–40% volume, and ducks during voice playback. All five final
  AAC/M4A recordings reached ready state 4 with progressing current time,
  finite duration, `paused=false` and no media error locally and on the exact
  Preview. The web copies total about 15 MB instead of about 39 MB for the
  initial MP3 downloads.
- Licensing — PASS: all five tracks are Kevin MacLeod recordings with official
  ISRC source links and CC BY 4.0 attribution in `/music-credits` and
  `assets/audio/ambient/LICENSE.md`. Beatles recordings were not used because
  no authorised reusable recording licence was established.
- Browser console — PASS: zero error-level messages on the exact Preview during
  the final Premium/Quick/music checks.
- `npm test` — PASS: 17 lessons, 616 activities, 85 visuals, 14 formats, 1,382
  integrity/security assertions, and all learner/teacher/Premium/plan/v15
  suites.
- `npm run build`, `npm run verify:visuals`, `npm run verify:audio`, JavaScript
  syntax checks and `git diff --check` — PASS.

## August 20 premium clarity and ambient-audio checkpoint

- Application commit: `3a9eea849a836b86208b4068213d1867e0f0f165`.
  It was pushed with handoff commit `1a5dfe6245ee06ed5d7e787fe84f78e69cbdf161`
  and published as Netlify deploy `6a8644cf609c578ecd08fb4e`. Production is untouched.
- Scope: unified readable Light/Dark learner surfaces; compact settings through
  tablet/small-desktop widths; redesigned membership locks; contained pricing
  badges; distinct Premium review and Premium+ Coaching illustrations; study
  ambience default ON, 0–40% volume control, first-interaction autoplay-policy
  handling, and richer procedural profiles for all five tracks.
- Access-code cleanup — PASS: four explicitly named `Codex QA 2026-08-18 ...`
  rows were permanently deleted after user confirmation; zero matching rows
  remained and non-QA rows were untouched.
- Local browser visual QA — PASS: home, learner progress, lesson, phrases,
  locked lessons and pricing were checked in Light and Dark. Compact 793 px
  home/pricing checks showed readable content and no observed page overflow.
- Ambient browser QA — PASS: fresh load reported `waiting-for-gesture` with no
  audio graph; a real pointer interaction changed it to `playing`. Calm Focus
  (16 nodes), Lo-Fi Study (15), Quiet Morning (16), Night Focus (12), and Rainy
  Desk (15) each played; 5%, 18%, and 35% volume values were reflected and the
  final setting was restored to Calm Focus at 18%.
- Lighthouse accessibility — PASS locally and on the published Preview: home,
  phrases, pricing and lesson each scored 100 with zero binary audit failures
  after correcting inactive billing contrast and visible-label/accessibility-name mismatches.
- `npm test` — PASS: 17 lessons, 616 activities, 85 visual questions, 14
  formats, 1,369 integrity/security assertions, and all learner/teacher/
  Premium/plan/v15 suites.
- `npm run build` — PASS; the static `dist/` build excludes private drafts.
- `npm run verify:visuals` — PASS for all 85 WebP assets.
- JavaScript syntax checks and `git diff --check` — PASS.
- Notion source audit — PASS: the connected workspace was searched and each of
  the six legacy pages was matched by date and lesson content. Source checkpoint
  `3e371a1b80c80ab964f2fe52f20c1618352e82ad` preserves `legacy_zip` provenance
  and adds exact page IDs/URLs. Migration `018` passed PostgreSQL parsing,
  applied successfully to `ycmybggetemkhorkhfnf`, and its six-row postcondition
  passed. Live Teacher Studio shows 17 source links and zero missing links.
- Netlify account audit/publication — PASS: current session is
  Tahmid447's team (`tahmidhc245@gmail.com`). It owns
  `tahmid-english-review-hub-preview` and production
  `jocular-chaja-86e78d`, but not the dedicated v9 Preview project. The Preview
  candidate was switched from `upgrade/review-hub-v9-playful-jp` to
  `upgrade/review-hub-v9-final-product`. Deploy `6a8644cf609c578ecd08fb4e`
  completed in 14 seconds with no redirect/header/build error. Exact permalink:
  `https://6a8644cf609c578ecd08fb4e--tahmid-english-review-hub-preview.netlify.app`.
  Published Browser QA confirmed the new home/lock/pricing designs, Light/Dark,
  default Ambient ON at 18%, and all five playing Web Audio graphs. Production
  must not be deployed.
- Verified-source Preview publication — PASS: commit `3e371a1` published as
  Netlify deploy `6a86db95cd49160008ff49c7` in 12 seconds. Immutable URL:
  `https://6a86db95cd49160008ff49c7--tahmid-english-review-hub-preview.netlify.app`.
  The production site `jocular-chaja-86e78d` was not deployed.
- Post-source verification — PASS: `npm test` (1,382 assertions),
  `npm run build`, `npm run verify:visuals` (85), migration `018` PostgreSQL
  parser (2 statements), and `git diff --check`.

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
- Live UI/RLS/submission QA was deferred until application checkpoint
  `0dda67a` reached Preview; the completed UI results and remaining real-
  submission gate are recorded below.
- Preview publication — PASS: rollout commit `7899024` published as Netlify
  deploy `6a8420afed26890008660823`.
- Live Premium teacher preview — PASS: both essay and speaking cards showed
  three topics; mouse and ArrowRight changed the selected topic, bilingual
  prompt, phrase set and vocabulary set together. Mutating submission controls
  stayed disabled in Teacher preview.
- Live Teacher Studio — PASS: the preserved authenticated session survived the
  deploy; all 34 task rows reported three topics; English and Japanese modes
  both rendered and the setting was restored to Japanese.
- Access-code CRUD — PARTIAL PASS/PENDING CLEANUP: temporary Standard, Premium
  and Premium+ codes were created; Standard label/duration/use-limit editing,
  Premium reissue, one-time complete-code display and copy passed. Four unused
  QA rows (one disabled pre-reissue row plus three enabled rows) remain pending
  explicit deletion confirmation. Redemption was not attempted.

## August 18 final-polish checkpoint 3

- Historical snapshot, superseded by the licensed-recording August 24
  checkpoint above.
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
