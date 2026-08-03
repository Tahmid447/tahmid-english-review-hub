# Test Report / 動作確認レポート

Last updated: **August 3, 2026**

## Automated content and security checks

- The preserved source ZIP and supplied general entrance page still match their
  recorded SHA-256 hashes.
- All six original lessons and all **143 original activities** are present with
  stable IDs.
- All **78 added activities** and **341 Notion-derived activities** are present.
- The complete reviewed source contains **562 activities in 14 formats**.
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

- `npm test`: PASS — 17 lessons, 562 activities, 14 formats and 1,369
  integrity/security assertions.
- `npm run build`: PASS — 562 protected question rows generated; private source
  files remain excluded from `dist/`.
- `npm run verify:visuals`: PASS — all 55 WebP visual-question assets exist and
  match the manifest dimensions/type checks.
- Local built-site HTTP visual check: PASS — 55/55 assets return HTTP 200,
  `image/webp`, and non-empty image bytes. The local preview server's missing
  WebP MIME mapping was found during this check and fixed.
- `npm run verify:live`: PASS — 17 public catalogue lessons, exactly two free
  previews, 62 anonymous preview activities, two plan descriptions, and 18
  private/base resources denying anonymous reads.
- `npm run audit:audio-live`: PASS — one live natural-English request for every
  lesson plus Japanese and British voice requests; every listening/speaking
  activity has a non-empty target.
- Local browser: PASS — the home summary displays 17 lessons and 562 activities;
  new runs automatically shuffle both question and choice order; 0.5x, 1x and
  1.5x playback and mixed Japanese/English sequencing complete without a stuck
  control.
- `membership-access` Edge Function: deployed as version 2; CORS preflight and
  unauthenticated rejection were verified. An authenticated learner submitted
  a well-formed unknown code and received the distinct bilingual "not found"
  result instead of an endless loading state. A valid teacher session is still
  required for the full create/edit/reissue/delete/redeem browser workflow.

The July 30 sections below are retained as dated historical evidence. Their
485-question counts describe the pre-expansion deployment and are not the
current 562-activity source/build total.

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
  all 562-activity validation.
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
- The reviewed source and protected question migration contain 562 activities.
- The visual production manifest contains 55 unique WebP paths, alt text, and
  lesson-specific scene briefs.
- `npm test` passes with 1,369 assertions.
- `npm run verify:visuals` now passes with all 55 final illustrations present.
