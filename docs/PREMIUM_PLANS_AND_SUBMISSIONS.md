# Standard / Premium plans and teacher-reviewed submissions

This document describes the recommended product model implemented at the data
layer by `202608020008_premium_plans_and_submissions.sql`. It is a product and
operations recommendation—not a statement of current pricing or a promise that
the learner/teacher screens are already complete.

## Recommended plan split

| Feature | Standard | Premium |
| --- | --- | --- |
| Full self-study lesson library | Yes | Yes |
| Balanced listening, speaking, reading and writing practice | Yes | Yes |
| Core illustration-based questions | Yes | Yes |
| Phrase/vocabulary library and learning history | Yes | Yes |
| Advanced visual missions | — | Yes |
| Lesson-specific 2-minute speaking challenge | — | Yes |
| Lesson-specific 50–100 word essay | — | Yes |
| Personal teacher score and feedback | — | Yes |

Core illustration questions remain in Standard because visual context improves
learning for everyone. Premium should sell personal guidance and deeper output,
not remove essential practice from the base product.

### Launch pricing recommendation

These are suggested launch prices only and should be reviewed after observing
teacher workload, conversion and renewal rates:

- **Standard:** ¥3,980 per month, or ¥20,300 for six months (about 15% off).
- **Premium:** ¥5,980 per month, or ¥30,500 for six months (about 15% off).
- If an early-adopter offer is needed, use a time-limited/capped discount rather
  than permanently reducing the teacher-reviewed plan. Personal review time is
  the scarce part of the product.

The premium promise should include a clear review allowance (for example, one
speaking and one essay submission per lesson, with a stated turnaround target).
Do not advertise unlimited review until real workload is known.

## Learner workflow

### Two-minute speaking challenge

1. The learner opens an active Premium speaking task for a lesson.
2. The task shows the topic, a target of about two minutes, required lesson
   phrases/vocabulary and one short example.
3. The learner records or provides a transcript, reviews it, then submits it.
4. The submission moves from `draft` to `submitted`; it becomes locked while the
   teacher reviews it.
5. The teacher may return it for another attempt or publish a score and feedback.
6. Published feedback appears in the learner account beside the original work.

### 50–100 word essay

1. The task shows a lesson-specific prompt, target length and required language.
2. The learner drafts the English response. Final submission is rejected outside
   the task's configured word range.
3. The teacher reviews meaning, grammar, naturalness and use of target language.
4. The teacher publishes a score, a concise explanation and an improved model
   version where useful.

Each task has its own maximum number of attempts. A returned submission can be
revised; a submission already under review cannot be silently changed.

## Teacher workflow and AI assistance

1. Create one speaking task and/or one essay task for the lesson.
2. Add lesson-specific required phrases and vocabulary.
3. Review the queue of `submitted` work and mark an item `in_review`.
4. Write feedback manually, or ask AI to prepare a **draft** based on an explicit
   rubric. The teacher checks and edits every AI-assisted draft.
5. Set `published_at` only when the feedback is ready for the learner.

`ai_assisted` records whether AI helped draft the learner-visible feedback. AI
must not publish directly. Prompts, service keys and private teacher notes do not
belong in the learner-visible feedback record.

Teachers can set a learner's Standard/Premium tier, add a temporary per-feature
override, control assignment visibility and open/close dates, and require a plan
for an assignment. These controls never expose or copy a learner password.

## Data and access model

- `review_plan_catalog`: Standard/Premium feature definitions.
- `review_memberships.plan_tier`: normal effective tier.
- `review_learner_plan_overrides`: temporary tier or feature exceptions.
- `review_premium_tasks`: lesson-specific speaking/essay briefs.
- `review_task_submissions`: learner drafts and submitted work.
- `review_submission_feedback`: teacher feedback; learners see only rows with a
  publication time.
- `review_assignments`: visibility, open/close dates, required plan and whether
  teacher review is required.

RLS rules make tasks, submissions and feedback private. Learners read their own
records; teachers manage and review. The migration does not read `auth.users`
password data, and no Review Hub table has a password column.

## Free-tier-conscious audio approach

Start with text/essay submissions and transcript-only speaking practice while the
review workflow is proven. When recordings are enabled:

- record in the browser as compressed WebM/Opus;
- cap each clip near two minutes and reject oversized files before upload;
- store the file in a **private** object-storage bucket, not in Postgres;
- keep only `audio_object_path` in the submission row;
- use signed, short-lived playback URLs for the learner and teacher;
- retain only necessary versions (for example, remove abandoned drafts and set a
  documented retention period after feedback);
- monitor storage and bandwidth before raising submission limits.

The migration deliberately does not create a bucket. Bucket limits, MIME checks,
retention and object-level RLS should be deployed together when recording UI is
ready, rather than leaving a partially secured upload path.

## Publishing cadence recommendation

Launch with **one polished general lesson per week**. It is easier to maintain
audio, illustrations, QA and teacher feedback quality at that pace. After four to
six stable weeks, add a second weekly practice set only if review turnaround and
content QA remain healthy. Private lessons can still be published immediately to
the assigned learner.

For Premium, alternate the highlighted output focus—speaking one week, essay the
next—while keeping both task types available in the lesson. This creates variety
without doubling the promised teacher-review workload every week.

## Safe rollout order

1. Review and deploy the migration in a staging project.
2. Add Teacher Studio controls for plan tier, task authoring and the review queue.
3. Add learner text submissions and published feedback; test RLS with separate
   teacher and learner accounts.
4. Add private audio storage only after object policies and retention are tested.
5. Pilot Premium with a small number of learners before publishing paid limits.

