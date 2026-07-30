# Test Report / 動作確認レポート

Test date: **July 30, 2026**

## Automated content and security checks

- The preserved source ZIP and supplied general entrance page still match their
  recorded SHA-256 hashes.
- All six original lessons and all **143 original activities** are present with
  stable IDs.
- All **78 added activities** and **264 private draft activities** are present.
- The complete reviewed source contains **485 activities in 14 formats**.
- The production build excludes `notion-drafts.json` and `curriculum.js`.
- The public route catalogue contains only the six reviewed legacy lessons.
- The Netlify lesson redirect preserves the requested lesson slug.
- The shipped anonymous private-hub HTML does not contain the learner’s display
  name; it is inserted only after an authorised profile check.

Run locally:

```bash
npm run build
npm test
npm run verify:live
```

## Live Supabase verification

The three Review Hub migrations were applied to the existing
`Tahmid English Academy` project through the trusted Supabase SQL Editor. They
create or update only `review_` objects.

Verified live counts:

| Check | Result |
|---|---:|
| All Review Hub lessons | 17 |
| Published lessons | 6 |
| Private drafts | 11 |
| All active activities | 485 |
| Public activities | 221 |
| Private draft activities | 264 |

Anonymous REST checks:

- `review_public_lessons`: **200**, 6 rows
- `review_public_questions`: **200**, 221 rows
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

- general entrance and six lesson cards
- private anonymous gate and authorised private dashboard
- teacher-only gate, teacher sign-in, 11 drafts, six published lessons, and
  student count excluding teachers
- Manual and Instant Check
- first-answer score lock and retry-only results
- question and choice shuffle
- partial matching/sorting scoring
- mistakes-only, unanswered-only, and all-question practice
- all 14 activity formats
- English/Japanese display
- hint auto-close and keep-open modes
- answer feedback sounds and vibration feature detection
- Phrase Library filters, search, favorites, speaking, per-card US/UK audio,
  learning notes, practice count, and last-practised date
- account-scoped local progress, phrase activity, and settings
- 390 px responsive layout with no horizontal overflow and 44 px controls
- 404 and invalid-lesson handling

Safari checks covered the general hub, a scored lesson answer, and natural
voice playback before packaging.

## Hosted Netlify preview smoke test

The separate Netlify preview at
`https://tahmid-english-review-hub-preview.netlify.app/` was deployed from the
private GitHub repository’s `upgrade/review-hub-v8` branch. The existing
`jocular-chaja-86e78d` production site was not changed.

Hosted checks covered:

- six public lessons and 221 public activities
- the short `/lesson/june-28` route and the query-string lesson route
- Manual Check and first-answer lock
- the anonymous private-account gate
- authorised private sign-in, personal history, and history after reload
- refusal of a second learner account without private-hub scope
- teacher sign-in, 11 private drafts, six published lessons, and two
  non-teacher test learners
- question-level, format, retry, lesson, speaking, phrase, and session analytics
- direct learner refusal for the July 27 draft
- teacher-only preview of all 24 July 27 draft activities
- all 92 Phrase Library cards and 276 learning-note sections
- live US Ava and UK Libby playback
- hosted phrase practice synchronising back to teacher analytics

The first hosted deploy revealed that an internal Netlify rewrite did not
expose the lesson slug to browser JavaScript. The player now also derives the
lesson ID from `/lesson/:slug`; an automated regression assertion and a second
hosted smoke test both pass.

## Natural voice

The live `natural-speech` Edge Function returned valid `audio/mpeg` for both:

- American English / Ava: HTTP 200
- British English / Libby: HTTP 200

The UI also has a browser speech fallback with a clear retry message when the
natural voice is unavailable.

## Items that require the real learner or a physical device

- A permanent private learner account has not been created because the
  learner’s email was not supplied.
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
