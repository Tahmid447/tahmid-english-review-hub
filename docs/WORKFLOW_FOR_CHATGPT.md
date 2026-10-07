# Workflow for ChatGPT / AI Lesson Authoring

## Goal

Use this workflow when an AI assistant is asked to turn a lesson into:

1. a Quick Import Markdown lesson note, and
2. a matching Tahmid English Hub cover image.

Do not begin by drafting from memory.

## Step 1 — Read the project rules

Read, in this order:

1. `AGENTS.md`
2. `docs/LESSON_NOTE_PRACTICE.md`
3. `docs/LESSON_WORKFLOW.md`
4. `docs/LESSON_NOTE_STANDARD.md`
5. `docs/COVER_IMAGE_STANDARD.md`
6. `templates/LESSON_NOTE_TEMPLATE.md`

Then inspect the gold examples:

- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Quick_Import.md`
- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Quick_Import.md`
- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Visual.png`
- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Visual.png`

If Quick Import behavior is uncertain or appears to have changed, inspect:
- `src/lesson-note-model.js`
- `src/note-practice-model.js`

## Step 2 — Establish the lesson boundary

Identify:
- student
- lesson date
- exact lesson source

If the request includes multiple dates, separate the content by date.

Do not pull in unrelated messages from before/after the lesson window.

If the date boundary is genuinely unclear, ask once before creating the files.

Use a date-first Lesson Title: `D Mon YYYY | Short Lesson Title`, for example `6 Oct 2026 | Everyday Words & Expressions`. Match the actual lesson date, include the year, and omit the student name unless explicitly requested. Keep the student name in the learner assignment and cover header. The cover headline can show only the topic. The older gold examples do not override this title convention.

## Step 3 — Extract candidate learning points

Make a private candidate list.

For each item, ask:

- Did this actually appear in the target lesson?
- Is it likely to help the student again?
- Is it distinct from another item?
- Can it be explained briefly?
- Does it deserve a card, or is it too minor?

Discard low-value items.

Do not create content just because there is room.

## Step 4 — Build the teaching blocks

Use only supported semantic block types.

Prefer a compact mix such as:
- useful phrase
- common mistake
- grammar
- natural English upgrade
- comparison
- pronunciation only when needed

Preserve original student wording in correction blocks.

Do not create fake originals.

## Step 5 — Build Quick Practice

Choose varied practice based on the lesson.

Usually 4-7 items are enough.

Use exact parser-safe fields.

For multiple choice:
- `A:`
- `B:`
- optionally `C:`
- `Answer: B`

Do not use `A.` or Markdown bullets as answer-choice labels.

For sentence reorder:
- use `Items:`
- one `- item` per line

For Japanese → English:
- add `Accepted answers:` if appropriate

## Step 6 — Validate the Markdown

Check against `LESSON_NOTE_STANDARD.md`.

Specifically verify:
- metadata labels
- date-first title matching the lesson date
- semantic headings
- field labels
- original/correct mappings
- practice choices
- no stray Markdown formatting
- no unnecessary repeated content

Never say "Quick Import-ready" unless this check was actually done.

## Step 7 — Design the cover

Inspect Oct 3 and Oct 4 cover references.

Select 2-4 lesson takeaways only.

Create the image using `COVER_IMAGE_STANDARD.md`.

Do not simply generate an attractive image; generate an image that clearly belongs to the Tahmid English Hub cover system.

## Step 8 — Visual QA

Inspect the generated image.

Check:
- student/date
- spelling
- Japanese
- layout
- crowding
- consistency with gold references

Regenerate if text is broken or the design looks generic/AI-made.

## Step 9 — Deliver

Deliver:
- `Student_YYYY-MM-DD_Quick_Import.md`
- `Student_YYYY-MM-DD_Visual.png`

If there are multiple dates, provide one pair per date.

Optionally provide one ZIP.

Keep the chat response short:
- what was created
- any important uncertainty
- import reminder: Preview Import first, then upload/set cover

## Step 10 — Do not mutate production unless asked

Creating lesson assets does not imply permission to:
- deploy
- publish a student lesson
- edit production data
- change database schema
- change site code

If repository documentation files themselves are being installed, make a focused documentation-only branch/commit unless the owner explicitly asks for another workflow.
