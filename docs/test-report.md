# Test Report / 動作確認レポート

Last updated: **August 11, 2026**

## August 11 Premium platform preview verification

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
  commit `fe81008` on `upgrade/review-hub-v9-premium-platform`; build, redirects,
  headers and post-processing completed without errors.
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

- All 11 Notion-derived lessons generate 31 activities each.
- Every lesson has five distinct illustration-led activities, six listening
  activities, and five speaking activities.
- The reviewed source and protected question migration contain 616 activities.
- The visual production manifest contains 55 unique WebP paths, alt text, and
  lesson-specific scene briefs.
- `npm test` passes with 1,369 assertions.
- `npm run verify:visuals` now passes with all 55 final illustrations present.
