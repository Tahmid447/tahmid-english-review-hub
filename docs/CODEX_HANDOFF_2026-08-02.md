# Codex Handoff — Tahmid English Review Hub v9

Updated: 2026-08-28 (Asia/Tokyo)

## Open this project

- Repository folder: `/Users/tahmidahmed/Documents/Codex/2026-08-03/codex-handoff-tahmid-english-review-hub/work/tahmid-english-review-hub`
- Working branch: `upgrade/review-hub-v9-final-product`
- Exact August 28 public-release application checkpoint:
  `85ecfbf33c24b077a28cd9235467d32a4a73e8ba`
- Exact August 28 launch-UX application checkpoint:
  `fbd67fac20823e88ef4010f10e6558f53a99ecd4`
- Exact August 26 final application checkpoint:
  `8fb49e02184c3569e85fbd7cede2fe9866d16c93`
- Previous August 26 entrance/audio checkpoint:
  `a7002c04785f7a802800ba89083e92737fe4b274`
- Previous August 25 application checkpoint:
  `ae766535442dcd17d2d6976303dafb0423a3edc3`
- Previous August 24 application checkpoint:
  `18571bd82be51986e43621fc5242c2e6386221b6`
- Feature checkpoint before audio optimisation:
  `5cd3a53b2f5094e751b1374e7f232b3519a77dfd`
- Exact live-validated final-polish artifact:
  `7899024a8c9baee9cdd91b0fe93346a1bcc8427d`
- Exact August 20 application checkpoint:
  `3a9eea849a836b86208b4068213d1867e0f0f165`
- Exact verified-source checkpoint:
  `3e371a1b80c80ab964f2fe52f20c1618352e82ad`
- Historical rollout / logical-restore checkpoint: `fcf561d78da6de405d6ca54b78ebfc99df3d3a0a`
- Current documentation checkpoint: branch HEAD (`git rev-parse HEAD`). This
  document cannot contain the final hash of the commit that contains itself.
- Canonical GitHub implementation checkpoint: `c14625d50204227c917ecc01d59322cb63006cee`
- Published handoff checkpoint: `a87eb5e1aaa9cff079319b68dfed40bdb2b1a408`
- Production: https://jocular-chaja-86e78d.netlify.app
- New-account public release: https://tahmid-english-review-hub-v9-release.netlify.app
- Exact new-account release deploy: https://6a90b24a2703d100098ffe4b--tahmid-english-review-hub-v9-release.netlify.app
- New Netlify project/Site ID: `f30d0264-70d0-4234-83ec-c717fa428f99`
- Dedicated v9 preview: https://tahmid-english-review-hub-v9-preview.netlify.app
- Exact validated Preview permalink: https://6a8420afed26890008660823--tahmid-english-review-hub-v9-preview.netlify.app
- Current-account Preview: https://tahmid-english-review-hub-preview.netlify.app
- Exact current-account Preview permalink: https://6a8eee9d22a46700081feb04--tahmid-english-review-hub-preview.netlify.app
- Supabase project ref: `ycmybggetemkhorkhfnf`

Do not place OAuth client secrets, passwords, service-role keys, database passwords, or access tokens in this file, Git, screenshots, or chat.

## Deployment truth

- The August 28 release checkpoint `85ecfbf` is public on the user's new
  Netlify account at
  `https://tahmid-english-review-hub-v9-release.netlify.app`. Netlify deploy
  `6a90b24a2703d100098ffe4b` is published from the exact GitHub branch/commit.
  The project is public, automatic publishing is on, and the Netlify overlay
  badge is disabled. Netlify labels this branch deploy as Production for the
  new project. The legacy production URL
  `https://jocular-chaja-86e78d.netlify.app` remains untouched in the old
  account; do not describe it as upgraded.
- Supabase Auth now allow-lists
  `https://tahmid-english-review-hub-v9-release.netlify.app/**`. A real Google
  OAuth retest returned to the new domain, completed the existing learner
  session, unlocked Quick and Full entry for all 17 lessons, and no longer
  copied OAuth token fragments into internal return links.
- The release workflow is now local-first: finish and verify a coherent batch
  locally, publish one Preview, pass its public/authenticated gates, and only
  then publish Production. Do not spend Netlify credits on each small edit.
- Browser-blocked Study Music now presents one centered, animated invitation
  for 4.2 seconds and fades out by about five seconds if ignored. A tap starts
  the selected local track; it never claims that a browser can bypass autoplay
  policy.
- `/plans` now keeps its large settings controls behind an explicit Settings
  button at every desktop width, shows all four current prices and core benefits
  in a compact first-glance row, and keeps each long feature list behind an
  accessible `What's included / 含まれる内容` disclosure. The full 2×2 plan
  cards and complete comparison table remain available below.
- The in-question Practice settings shortcut no longer duplicates the complete
  top dialog. It contains only Voice On/Off, US/UK voice, selected-choice
  pronunciation, manual/instant checking and hint behaviour. The top Settings
  dialog remains complete with speed/volume, SFX, five Study Music tracks,
  translations, display language and theme.
- The release typography uses an explicit editorial system-serif stack for
  display headings and a highly legible system sans stack for controls/body
  copy, with balanced headings and Japanese line-breaking/spacing refinements.
- The August 26 final application checkpoint `8fb49e0` is published only to the
  current-account Preview as Netlify deploy `6a8eee9d22a46700081feb04`.
  Production static files remain untouched and pre-v9.
- The user selected the balanced layout direction. Public `/plans` now uses a
  clear 2×2 desktop hierarchy (Free/Standard, then Premium/Premium+) and one
  column on small screens. The private no-index comparison remains available,
  defaults to the adopted layout, and labels it as the production choice.
- English/Japanese display lines now use separate elements instead of relying
  on slash-delimited wrapping. This fixes collisions in the pricing selector,
  plan names, and comparison heading. Premium review tiles stay side by side
  when space permits, and Premium+ keeps its English and Japanese names on
  independent lines.
- The learner entrance now reveals `Understand · Hear · Say · Use` word by
  word, adds a real-lesson value story, clearer two-free-lesson CTA, restrained
  scroll/hover/touch motion and a reduced-motion fallback. No customer claim
  was added without an implemented product path.
- Premium's narrow two-column label was replaced with two full-width personal
  review rows, and Standard's `14` now explicitly says `ways to practise /
  選べる14種類の練習`. `/pricing-layout-preview` provides a no-index switch
  between the polished four-card story and a balanced 2×2 plan layout; the
  public `/plans` page remains on the improved four-card design until the user
  chooses an option.
- Prominent Music Credits navigation was removed. The required CC BY 4.0
  attribution remains as a quiet footer line plus `/music-credits`. Study Music
  still defaults ON; when a browser blocks autoplay, every page now shows a
  fixed one-tap `Begin with music` prompt. The August 26 live Preview check
  confirmed a local M4A playing with advancing current time.
- Click, correct, retry and completion cues were redesigned as distinct,
  warmer multi-note sounds. Cross-page buttons, links and keyboard activation
  now receive consistent interaction feedback without duplicating handlers.
- The uploaded Premium design demo was re-audited again. The overlapping
  `2×`/`3×` decorations were removed. Premium now shows two quiet, separate
  value tiles: one speaking review and one writing review per lesson. The
  promotion shows `FIRST 30 DAYS ¥0` followed by `SECOND MONTH ¥3,490 · 50%
  OFF`. Premium+ shows three monthly 50-minute sessions on a stable `01—02—03`
  line. Motion is restrained and disabled by reduced-motion.
- Speaking comparison is now transcript-aware. The reproduced target
  “I haven’t taken a bath yet.” versus recognized “How are you” is classified
  as a different sentence, not a one-word error. Feedback shows `I heard`,
  `Target`, change/missing/extra details and short retry chunks; the existing
  exact one-word correction remains covered by regression tests. This is
  transcript comparison, not phoneme-level pronunciation scoring.
- Every unlocked lesson card now asks the learner to choose **Quick Practice**
  (8 balanced questions, approximately 5–10 minutes) or **Full Lesson** before
  entry. The lesson URL, selector, shuffled run and question navigation retain
  the chosen mode; Browser QA confirmed exactly eight question buttons.
- Every lesson now also exposes a question-local **Practice settings** button.
  From August 28 onward it deliberately shows only answer-time controls: Voice
  On/Off, US/UK voice, selected-choice pronunciation, manual/instant checking
  and hint behavior. The top Settings button opens the complete preference set.
- Lesson Guides now show the full useful-phrase inventory and a bilingual
  Practice map with one model target for every question. The new audit proves
  coverage for all 17 lessons and all 616 activities, with no missing model
  targets across the 14 implemented formats.
- Procedural ambient synthesis was removed. Study Music defaults ON at 18% and
  offers five complete instrumental recordings by Kevin MacLeod under CC BY
  4.0, with in-product and repository attribution. Web-optimised AAC/M4A copies
  total about 15 MB instead of the initial 39 MB MP3 set. The final local and
  immutable Preview checks played all five tracks with progressing current
  time, finite duration, ready state 4 and no media error. Beatles recordings
  were not included because no suitable authorised licence was established.
- The same device-level music preference and visible five-track/volume controls
  now follow the learner across Hub, lesson, phrase/vocabulary library, plans,
  Teacher Studio, music credits, contact flow and the public error page. On the
  August 25 immutable Preview, both Plans and Teacher Studio played the real
  local M4A with ready state 4, advancing current time and no media error.
  Browser autoplay may require one tap; the UI reports that honestly.
- The final immutable Preview passed 390 px checks for Premium/Premium+ (clear
  review/session values and no horizontal overflow), all five study tracks,
  and cross-page Plans/Teacher music playback.

- The August 20 premium-clarity/audio checkpoint was implemented at `3a9eea8`,
  pushed with handoff commit `1a5dfe6`, and published to the current-account
  Preview as Netlify deploy `6a8644cf609c578ecd08fb4e`. It replaces the conflicting
  Light/Dark surface cascade, keeps lesson/dashboard/lock/pricing content
  readable, moves pricing value badges inside their cards, adds distinct
  Premium and Premium+ Coaching visuals, removes the oversized gold locked-card
  ornament, and preserves reduced-motion behavior.
- Historical August 20 audio note: the initial procedural ambience defaulted
  ON at 18% and handled autoplay after the first interaction. That generator
  was fully replaced by the five licensed local recordings documented in the
  August 24 bullets above; do not restore the procedural tracks.
- Four unused `Codex QA 2026-08-18 ...` access-code rows were permanently
  deleted after the user explicitly authorised deletion. Existing non-QA codes
  were not changed.
- The currently signed-in Netlify account is Tahmid447's team
  (`tahmidhc245@gmail.com`). It owns the actual production site
  `jocular-chaja-86e78d` and the older GitHub-connected Preview candidate
  `tahmid-english-review-hub-preview`; it does not have access to the dedicated
  `tahmid-english-review-hub-v9-preview` project. The current-account Preview
  now targets `upgrade/review-hub-v9-final-product`; its first new deploy
  completed successfully in 14 seconds with 15 uploaded files, 12 redirect
  rules and 6 header rules. Never deploy `jocular-chaja-86e78d` during this QA phase.
- Teacher Studio Sources now contains 17/17 verified Notion HTTPS links and
  zero missing-source rows. The six older bundled lessons were individually
  matched by date and lesson content in the connected Notion workspace; their
  canonical `legacy_zip` provenance remains unchanged and the Notion pages are
  recorded as supplemental teacher-facing source links. Migration `018`
  applied the six exact page IDs/URLs and its six-row postcondition passed.

- Historical August 18 phase record: the final-polish work proceeded in
  recoverable phases. The first
  local checkpoint completes Teacher Studio one-language English/Japanese UI
  coverage and honest source-link handling (`8b76baa`). The second checkpoint
  adds the bright Light default, refined plan/lock/footer system, clipped-badge
  guard, exact six-month figures, and the honest new-applicant Premium monthly
  offer. Both checkpoints passed the local suite; integrated Preview QA is
  still required before either is treated as a release.
- The third final-polish checkpoint separates Voice, Sound Effects, and Ambient
  Music. The August 20 follow-up changes the default to ON with Calm Focus at
  18%, adds a 0–40% learner control, starts after the first browser-permitted
  interaction, persists per learner, and ducks during natural speech. No
  external music asset existed at that checkpoint; the licensed August 24
  replacement above is now authoritative.
- The fourth final-polish checkpoint is complete locally: all 17 lessons have
  three learner-selectable Premium topics (51 authored topics total). Each
  choice has bilingual speaking and essay prompts, topic-specific recommended
  phrases and vocabulary, and a Core/Stretch label. The chosen topic is saved
  with the learner attempt and shown in Teacher Studio. Migration `017` was
  applied to shared Supabase after a new privacy-safe restore checkpoint. The
  matching application checkpoint is `0dda67a`; rollout record `7899024`
  published it to Preview and live topic UI QA now passes. Real learner
  submission/Teacher feedback remains pending.

- Exact rollout commit `7899024a8c9baee9cdd91b0fe93346a1bcc8427d`
  is published to the dedicated preview as Netlify deploy
  `6a8420afed26890008660823`.
- The production static site is still pre-v9 and was not deployed or otherwise
  changed during this rollout.
- Supabase migrations `015` and `016` were manually applied in order, each in a
  separate SQL Editor transaction, and the matching `membership-access` Edge
  Function is deployed.
- Supabase migrations `001`–`017` were applied outside the migration connector
  and remain absent from its ledger; their live state is verified by
  postconditions. Migration `018` was applied through the connected Supabase
  migration tool and is the sole tracked entry (`20260820104726`,
  `legacy_notion_source_links`). Do not infer that the earlier schema is absent
  merely because its historical ledger rows are missing.
- The preview and production frontends share Supabase project
  `ycmybggetemkhorkhfnf`; therefore the backend and Edge changes can affect the
  older production frontend even though its static deployment is untouched.
- Public browser QA and scoped authenticated Google learner sign-in/profile/
  reload/lesson/sign-out checks passed. Teacher auth, dedicated non-teacher tier
  negatives, remaining RLS/access-code/submission, microphone, Lighthouse, and
  physical-device QA remain pending. No production promotion is authorised.
- The earlier profile hotfix made no database change. Migration `017` now adds
  Premium topic metadata and selected-topic persistence in shared Supabase.
  It did not change Edge Functions, authentication, plan prices or existing
  task/submission identities.

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
- First Save profile initially failed with
  `permission denied for table review_profiles` because the old upsert included
  insert-only `user_id` on update. The fix chain is `d0b244b` (split payloads and
  modal status), `50656f8` (avoid stale race), `a69ab08` (PWA cache v3), and
  `049b5ff` (query cache-bust). `UPDATE(user_id)` remains deliberately ungranted.
- System, Light, and Dark themes share one persisted preference across the learner, phrase, lesson, and pricing experiences.
- A fresh installation now starts in Light mode while explicit saved System or
  Dark choices remain respected. Premium and Premium+ have distinct, restrained
  visual treatment with reduced-motion support.
- The Premium monthly enquiry path advertises only the approved new-applicant
  offer: 30 days free and month two at 50% (`¥3,490`). It explicitly requires
  Tahmid's personal eligibility/activation confirmation and does not imitate a
  payment or subscription checkout. Six-month plans are not included.
- Six-month cards show the total, normal six-month total, exact yen saving,
  percentage, and monthly equivalent from the central plan catalogue.
- Locked learning content uses readable, honest plan-access cards without
  blurred fake question previews; protected payloads remain withheld by the
  database.
- A public-shell PWA manifest, service worker, install metadata, and offline fallback are present. Protected routes, Supabase/API responses, learner data, answers, recordings, and auth-bearing requests are excluded from caching.
- Voice has its own on/off, volume, accent and playback-speed settings. SFX has
  an independent on/off and volume control with restrained layered click,
  correct, try-again and completion cues. Study Music has an independent
  on/off, track and 0–40% volume control; its five complete vocal-free local
  recordings are licensed under CC BY 4.0 and credited at `/music-credits`.
  PWA public cache v9 plus query-versioned audio modules prevents a stale audio
  shell. Speech temporarily ducks the music instead of stopping it.
- Every accessible lesson card offers Quick Practice (8 balanced questions,
  approximately 5–10 minutes) and Full Lesson. A fresh Quick run includes
  understanding, listening, speaking, production, visual and interactive
  families where available, then fills to eight unique questions.
- The phrase/vocabulary library has progressive rendering, retained filters, pronunciation, favourites, practice activity, and corrected type/presentation behavior.
- Responsive, contrast, touch-target, compact-header, lesson-radio keyboard,
  and pricing accessibility fixes are present locally. August 20 local
  Lighthouse accessibility checks scored 100 with zero binary failures on
  home, phrase, pricing, and lesson pages. Final deployed Lighthouse and
  real-device confirmation remain pending.

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
- Migration `017` enriches those same 34 tasks without replacing their
  identities or submission history. It requires exactly 34 updated task rows,
  three unique topics per task, valid bilingual prompts, 3–6 recommended
  phrases, and 3–8 vocabulary items. A submission stores
  `selected_topic_key`; the database requires a valid offered topic at final
  submission and prevents topic changes while work is under review.
- Before `017`, privacy-safe schema `codex_backup_20260818_pre017` captured all
  34 non-personal Premium task definitions and excludes learner submissions
  and Auth data. Live postconditions passed: 34 tasks with three topics, 102
  task/topic presentations, 51 unique lesson topics, zero invalid topic rows,
  and the selected-topic columns/validation trigger present.
- Learner drafts remain private until submission. Speaking recordings remain in the private storage bucket and are referenced by object path only.
- The local review design uses an atomic teacher review RPC, fresh return/resubmission timestamps, transactional code redemption/reissue, recording ownership/task/quota checks, and teacher-only plan preview.
- Teacher Studio is organised around seven jobs: **Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, and Insights**. It also includes an English/Japanese display preference, learner and queue filters, Dashboard plan counts and 30-day new-learner count, honest localized source provenance, non-mutating Free/Standard/Premium/Premium+ preview, and safer sign-out.
- The August 18 polish checkpoint extends the selected-language rule through
  JavaScript-generated table headings, statuses, confirmation dialogs, toasts,
  placeholders, empty states, learner controls, question management, analytics,
  access-code management and Premium review controls. English mode renders the
  Teacher Studio UI in English; Japanese mode renders natural Japanese rather
  than recurring bilingual slash labels. A dedicated regression suite now
  covers language persistence, rerendering, private-source exclusion and the
  explicit `Source link missing / 元資料リンク未登録` fallback.
- Existing valid Notion URLs remain teacher-only and are allow-listed to Notion
  HTTPS hosts. Missing URLs are never invented. Private `notion-drafts.json`
  authoring content remains excluded from the public build.
- There is no automatic or AI grading. The retained database compatibility field is always written `false`; Tahmid remains responsible for reviewing and publishing feedback.

## Verification evidence

The exact August 26 final application checkpoint `8fb49e0` passed:

```sh
npm test
npm run build
npm run verify:visuals
npm run verify:audio
git diff --check
```

This is 17 lessons, 616 activities, 85 visual questions, 14 formats and 1,382
integrity/security assertions. The audio verifier checks exactly five unique,
complete M4A recordings, file headers, size bounds, official ISRC source links
and CC BY 4.0 attribution. The integrated suite also ran the new Lesson Guide
coverage audit across all 17 lessons/616 activities. Browser QA on the exact
immutable Netlify deploy confirmed the adopted 2×2 public plan grid, readable
Premium speaking/writing and Premium+ coaching visuals, the local Practice
settings dialog with every required control, Quick Practice with eight
questions, and the June 29 Lesson Guide Practice map with all 37 model targets.
The BGM control changed from Off to On from one explicit Preview interaction.
Earlier same-day verification confirmed the real local M4A advanced without a
media error. The speaking regression reproducing “How are you” against “I
haven’t taken a bath yet” passed as `different-sentence`.

The August 18 Teacher/i18n/source checkpoint passed `npm test`, `npm run build`,
`npm run verify:visuals`, the new `node scripts/test-teacher-i18n.mjs`, and
`git diff --check`. Local Browser QA also switched the logged-out Teacher Studio
between English and Japanese and confirmed the visible login UI, labels and
accessible names changed to the selected language. The existing logged-in live
Teacher session was not logged out; authenticated QA remains for the later
Preview phase.

The final integrated worktree passed these local checks on August 14. After the
profile-save fixes, `npm test`, `npm run build`, and `npm run verify:visuals`
passed. After the final cache-bust, the latest full test/build also passed:

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
and migration `016` (2 statements). The new local migration `017` also parsed
successfully (11 statements). Local Browser QA covered public home,
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
and Netlify Preview publication of exact application commit `049b5ff`.

Public QA on the earlier validated `ecf8726` deploy passed for:

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

Authenticated Google learner retest on `049b5ff` passed modal-local and page
success, gate close, complete-profile reload, Standard membership shown through
August 2, 2027, access to all 44 June 30 questions, and safe sign-out/reload;
the second open lesson tab became locked. Premium task cards also appeared, so
the identity seems teacher-elevated and cannot prove strict Standard-versus-
Premium denial. Teacher auth remains pending; the learner is signed out.

## Rollout progress and required order

1. **Completed:** run the complete local test/build/visual suite and
   `git diff --check`.
2. **Completed with stated limitation:** create the privacy-safe logical restore
   point because an official Free-plan backup was unavailable.
3. **Completed:** apply and verify migration `015`, then migration `016`, in
   separate SQL Editor transactions.
4. **Completed:** deploy and timestamp-check the matching
   `membership-access` Edge Function.
5. **Completed:** publish exact application commit `049b5ff`, pass public QA,
   and pass scoped Google learner profile/reload/lesson/sign-out QA.
6. **Completed:** apply and verify migration `017`; publish the matching 51
   topic UI; verify mouse and keyboard topic switching, topic-specific prompts,
   phrases and vocabulary, and all 34 Teacher task rows showing three topics.
7. **Completed:** permanently delete the four unused `Codex QA 2026-08-18 ...`
   access-code rows; verify zero matching rows remain.
8. **Completed:** publish the August 20 application checkpoint to the
   current-account Preview only and verify the deploy, public content,
   Light/Dark presentation, all five ambience graphs and Lighthouse accessibility.
9. **Completed:** publish August 24 checkpoint `18571bd` to the current-account
   Preview only; verify the redesigned Premium/Premium+ visuals, 8-question
   Quick Practice, five licensed/optimised Study Music tracks, 390 px layout
   and empty browser error log on immutable deploy `6a8c2e337479160008093171`.
10. **Completed:** publish August 25 checkpoint `ae76653` to the current-account
    Preview only; verify cross-page music controls/real playback, transcript-
    aware speaking guidance, clearer Premium/Premium+ value cards and 390 px
    no-overflow on immutable deploy `6a8c62cc2b35130008cdffb1`.
11. **Completed:** publish August 26 checkpoint `a7002c0` to Preview only;
    verify the entrance/value animation, quieter legal music attribution,
    one-tap autoplay fallback, refreshed SFX, exact 8-question Quick mode,
    Premium wrapping fix, explicit Standard `14` label, and both no-index
    pricing-layout previews on immutable deploy `6a8e0def46faf70007aa4ef9`.
12. **Completed:** adopt the balanced 2×2 public plan layout, repair bilingual
    typography, add question-local settings and full 17-lesson/616-activity
    Guide coverage, publish application checkpoint `8fb49e0`, and verify the
    public plan grid, settings dialog and June 29 Guide on immutable deploy
    `6a8eee9d22a46700081feb04`.
13. **Completed locally:** implement and verify the August 28 centered/fading
    music invitation, scan-first pricing, collapsible feature details, compact
    pricing settings header, typography refinement and focused question-local
    settings at application checkpoint `fbd67fa`.
14. **Completed:** import the GitHub repository into the user's new Netlify
    account, configure `upgrade/review-hub-v9-final-product`, `npm run build`
    and `dist`, publish the new public release, add its Supabase Auth redirect,
    and pass public plus Google-authenticated release gates on exact commit
    `85ecfbf` / deploy `6a90b24a2703d100098ffe4b`.
15. **Pending:** authenticate dedicated non-teacher Free/
   Standard/Premium/Premium+ accounts; test tier/RLS/access codes, email auth,
   speaking/essay submissions, and published feedback.
16. **Pending:** complete desktop/tablet/390 px and real iPhone Safari/Android
   Chrome touch, microphone, PWA, and offline QA.
17. Promote to production only after every preview gate passes and the correct
   production Netlify account is available. Preserve a known-good rollback
   deploy and prepare forward fixes for database issues.

## Remaining and blockers

- The new-account release is public and verified. The only production naming
  decision still open is whether customers should adopt the new release URL or
  whether the legacy `jocular-chaja-86e78d` address must later be migrated from
  its old Netlify account. No destructive transfer or old-site change was made.
- August 26 entrance/conversion, cross-page Study Music fallback, SFX,
  balanced public pricing, bilingual typography, question-local settings and
  complete Guide coverage are published to Preview. There is no known
  code-level blocker in that tranche. The checked public artifact is commit
  `8fb49e0`, deploy `6a8eee9d22a46700081feb04`;
  Production was not deployed.
- The pricing choice is complete: `/plans` uses the balanced 2×2 option because
  it makes the four alternatives easier to compare without an excessively
  long vertical sales path. The former stack remains only as a private visual
  reference in `/pricing-layout-preview`.

- Live access-code CRUD progressed: temporary Standard, Premium and Premium+
  codes were created; one Standard code was edited; one Premium code was
  reissued; complete-code one-time display and copy passed. The four unused QA
  rows were then permanently deleted with user authorisation and zero matching
  rows remained. No QA code was redeemed.

- Post-hotfix tests/build/visual verification, exact-commit Preview publication,
  public QA, and scoped authenticated Google learner QA are complete.
- Strict plan denial is unproved because the identity appeared teacher-elevated;
  dedicated non-teacher tier accounts are required.
- Teacher auth remains pending; the learner account is currently signed out.
- Local and deployed August 20 Lighthouse accessibility are 100/100 on home,
  phrase, pricing, and lesson pages with zero binary failures. Deployed
  performance measurements remain pending.
- Remaining authenticated Teacher/tier RLS, email-auth, access-code, and
  submission QA is pending; the scoped Google learner flow above is complete.
- Real-device touch, PWA install/update, offline fallback, Safari/Chrome microphone, and upload QA are pending.
- Replacing the legacy production URL still requires access to the Netlify
  account that owns it, or a deliberate customer-facing URL migration. The new
  project is already public and Netlify-production; this note concerns only the
  old address/ownership.
- Supabase Free plan has no official backup. The privacy-safe logical restore
  schema is useful for this migration but is not full disaster recovery and
  excludes personal/Auth data.
- Because production and preview share Supabase, any backend correction must be
  a careful forward fix; a Netlify rollback alone cannot undo it.
- Human-feedback capacity must be bounded before launch; see the workload note in `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`.

## Exact next step

Use the public new-account release for owner review and decide whether its URL
becomes the customer-facing production address or whether the old Netlify URL
must be migrated. After that naming decision, run one physical iPhone Safari
and Android Chrome pass for touch, microphone permission, PWA/offline update,
then test dedicated non-teacher Free/Standard/Premium/Premium+ accounts for
strict tier/RLS denial and submission workflows. Do not redeploy for cosmetic
micro-edits; keep the local-first, coherent-batch workflow.

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
