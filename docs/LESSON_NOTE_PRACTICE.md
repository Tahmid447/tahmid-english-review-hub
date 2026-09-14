# Lesson Notes 10.7 — practice and notebook usability

This extends the existing private Lesson Notes on Cloudflare Pages at https://tahmidenglishhub.dpdns.org. It does not replace the curriculum, accounts, favorites, voice service, or previous semantic note JSON. No paid service, AI grader, notebook email sender, or public image bucket is added.

## 1. Architecture found

The application uses browser ES modules, an explicit static build list, Supabase authentication/RPCs/RLS, and private Storage images. A lesson note contains `content_json` with `schemaVersion: 1` and stable semantic block IDs. Teacher content, personal annotations, suggestions, comments, images, history and review state are separate. Existing Ava/Libby speech and saved phrases are reused.

## 2. Integration approach

Practice definitions remain in the existing block JSON. A small view/controller renders each practice block in the same notebook. One authoritative RPC validates and saves a learner's response against the current question snapshot. Lesson progress is derived from current blocks and attempts, avoiding an additional aggregate table that could become inconsistent. Existing material remains readable without conversion.

## 3. Types and fields

- `quick_practice_group`: a collapsible practice section.
- `multiple_choice`: accessible radio choices.
- `fill_in_blank`: text response and optional answer matching.
- `error_correction`: correction response and optional accepted models.
- `sentence_reorder`: tap word/phrase tiles in order, undo the last tile.
- `japanese_to_english_practice`: English response to a Japanese prompt.
- `short_answer`: free response, saved without automatic grading.
- `self_check`: understood / more review.
- `remember_review`: recall reminder with understood / more review.

Existing `quick_practice` blocks also gain persistent answers; their block ID is the fallback question ID. New individual questions have distinct stable `id` and `questionId`; duplication creates new identities. Supported optional fields: `japaneseSupport`/mode, `hint`, `explanation`, `answerKey`, `acceptedAnswers`, `tags`, `difficulty` (`easy`, `medium`, `challenging`). The existing `englishText` is the prompt.

## 4. Quick Import

Paste, inspect **Preview import**, then **Add these blocks**. Fields can be inline after the colon or on following lines. Lists have one value per line. Unrecognized text is preserved; embedded HTML/link destinations are removed.

```markdown
# Today's English
## Quick Practice
### Multiple Choice
Question: Which is more natural?
A: I decided to absent the training.
B: I decided to skip the training.
Answer: B
Japanese: 自然な文を選びましょう。
Hint: Think about the verb.
Explanation: Use skip the training.
Difficulty: easy

### Fill in the Blank
Question: I ___ enough sleep last night.
Answer: got

### Error Correction
Question: It has update.
Answer:
There's an update.
It has been updated.

### Sentence Reorder
Question: Put these words in order.
Items:
- home
- I
- went
Answer: I went home.

### Japanese → English Practice
Question: 「めまいがします」を英語で。
Accepted answers:
I feel dizzy.
I'm dizzy.

### Short Answer
Question: Make a sentence using should have.

### Self Check
Prompt: Can you explain your answer?

### Remember & Review
Question: Review today's expression.

## Image
Upload a worksheet here after importing.
```

`Images`, `Infographic`, `画像` and `図解` also create image placeholders. Import does not fetch or generate images; choose an existing upload or upload directly in the block. **Save note & upload here** explicitly saves current teacher changes first, then attaches the optimized private image and saves its block reference.

## 5. Database changes

Forward migration: `20260915190000_note_practice_and_updates.sql`.

- New `review_lesson_note_practice_attempts`, one row per note/student/question; current response, question snapshot, correctness, completion, self-check, opened/answered/updated timestamps, model reveal, optimistic version, last five retry/previous-question responses.
- Annotation `body_format`: bounded plain-text ranges (bold and four highlight colors). Original text is retained; no arbitrary HTML/styles.
- Note `deleted_at` for recoverable Trash.
- Existing notification table gains `recipient_id` and a recipient/unread/time index; old rows still go to the original teacher.
- Existing private event/inbox model now covers practice, reviewed/undo and important teacher updates. Adds this inbox table to existing Supabase Realtime publication when available.
- New RPCs: `review_note_practice`, `review_note_annotate_rich`, `review_note_set_reviewed`, `review_note_set_read`, `review_note_trash`.

Historical migrations must never be replayed. Use a private backup and matching ledger entry when applying this one forward migration.

## 6. Access and concurrency

Students see and change only their own published, non-trashed notes, subject to existing learning access and note permissions. Only the assigned teacher can inspect attempts, edit questions, archive/Trash/restore or remove a learner attachment. Direct attempt writes are denied; the RPC derives identity from authentication. Notifications are visible only to their recipient and require note access. Private signed-image rules remain unchanged.

Practice saves compare the exact current block snapshot and the attempt version. Stale tabs receive a conflict rather than silently overwriting work. When a question changes, old answers stop contributing to current progress; the learner's next attempt preserves bounded previous history. Formatting is escaped for display on both teacher and student pages.

## 7. Student and image UX

Practice shows Check & save, hint, Reveal model, Complete and Try again. Self-check buttons are bilingual. The top summary remains compact. Each existing notebook annotation can format selected words with bold/yellow/green/blue/pink or clear formatting, with a formatted preview and autosave. Reader updates preserve unsaved answers/notes and indicate new teacher activity instead of replacing drafts.

Images use `object-fit: contain` in blocks, galleries, teacher inspection and cover thumbnails. Portrait and landscape images show their full extent. The zoom viewer remains available. Mobile galleries use one column and practice controls wrap with touch-sized targets.

Teacher image controls support **Set cover**, **Remove cover**, choose another image, replacement and archive. Note deletion is **recoverable Trash**: archive first, then Delete to Trash; restore returns a private draft. There is deliberately no irreversible purge control. Existing content, image objects and history are retained.

## 8. Teacher progress view

Open a learner's note → **Student activity**. Compact summary: attempted/total, completed/total, correct/auto-checked, needs review and last activity. Expand **Responses & review needs** for each answer and self-check. Changed questions clearly label the previous answer as belonging to the old question. Personal annotations retain bold/highlights; learner images show in full. The same view shows reviewed/unreviewed status and Read/Unread undo.

## 9. Progress and notifications

Opening a visible question records opened state; it does not claim the learner answered. A submitted answer records attempted time. An objectively correct answer completes the item; a nonmatching model marks review needed. Free responses count as answered/completed with correctness unset. Learners can reveal, manually complete or retry. Retry resets current progress while retaining at most five prior response snapshots. A question's completion and the whole lesson's Reviewed toggle are distinct.

Notifications appear through a labeled **Notifications · お知らせ** bell in the existing website headers, including Home and My Page. They link directly to the note/activity and support read/unread. Meaningful updates include publication/content changes, material additions/replacements, comments, suggestions, learner memo/image changes, practice and reviewed/undo. Notifications aggregate per note and actor; repeated work on the same entity within 30 minutes does not create dozens of entries. Reading/opening a question itself does not notify. Old historical activity is not retroactively broadcast.

Updates use a recipient-filtered Realtime subscription while the site is open, with a visible-tab 45-second fallback and refresh on return to the tab. Unsaved editor work is protected from automatic reload. This is not an OS push-notification service and sends no notebook email. The separate owner signup/reset email system remains unchanged.

## 10. Limits

- Matching ignores case, whitespace, curly apostrophe/quote differences and terminal punctuation. It compares teacher-provided answers; it cannot judge all possible natural English. Nonmatching text explicitly says another natural answer may be possible.
- Short answers have no AI grade. Teacher inspection is the review path.
- Progress is by lesson; section-specific totals are not included.
- Full question changes (including support text) invalidate current progress until the learner attempts that version. Last five previous responses are stored, not an unlimited practice log.
- Notes retain existing 150-block / 220KB limits; inbox loads the latest 100 grouped entries. Retained Trash/history uses storage until a separate explicit retention decision is made.
- Real-time availability depends on network/service state. Reopening or the fallback catches missed events. Closed-site OS notifications are not included.
- Physical iPhone hardware and a newly authenticated real student were not used for this release's test. Mobile UI and learner writes were exercised with isolated synthetic accounts and real PostgreSQL/RLS.

## 11. Validation

- Full `npm test`, including the original 86 notebook assertions and 68 new SQL/RLS/import/formatting/progress assertions.
- Cloudflare production build and output security checks; changed JavaScript syntax and whitespace checks.
- Existing voice-contract verification (480 items / 2,112 exact payloads / 32 phonics levels).
- Browser: teacher import/save/publish; direct block image upload and assignment; cover set/remove; learner selection/fill/free response/self-check and saved progress; bold/highlight memo save and teacher rendering; learner attachment; portrait/landscape full display/zoom; reviewed undo; teacher read/unread; compact/expanded response details; archive → Trash → restore draft; desktop and 390px layout.

Production-specific evidence and exact release SHA are recorded at the top of `WORKING_HANDOFF.md` after deployment. The local QA server uses synthetic identities and in-memory storage; it is excluded from public build output.
