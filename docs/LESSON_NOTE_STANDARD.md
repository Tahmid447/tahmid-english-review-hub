# Lesson Note Authoring Standard

## Purpose

This file is the writing standard for Tahmid English Hub / Teacher Studio Lesson Notes.

Use it whenever creating a new Quick Import lesson note from a lesson chat, transcript, teacher notes, screenshots, or a corrected sentence list.

The goal is not to preserve every line of a lesson. The goal is to turn the most useful learning points into a short, polished, reviewable lesson note that feels worth a student's time.

## Source-of-truth order

When creating a note, use this priority order:

1. The actual lesson source supplied for that date: current chat, transcript, teacher notes, screenshots, or lesson recording notes.
2. The teacher's explicit corrections or clarifications in the same conversation.
3. The current Quick Import implementation and repository documentation.
4. General English knowledge only to explain or improve material already grounded in the lesson.

Never invent a student's experience, opinion, mistake, personal story, or lesson topic.

If a term is unresolved or ambiguous, leave it out or ask the teacher. Do not turn an uncertain guess into teaching content.

## Always inspect before authoring

Before claiming a file is Quick Import-ready, inspect the current repository standard:

- `AGENTS.md`
- `docs/LESSON_NOTE_PRACTICE.md`
- `docs/LESSON_WORKFLOW.md`
- `docs/LESSON_NOTE_STANDARD.md`
- `docs/COVER_IMAGE_STANDARD.md`
- `templates/LESSON_NOTE_TEMPLATE.md`

If the importer may have changed, inspect:

- `src/lesson-note-model.js`
- `src/note-practice-model.js`

Do not claim compatibility from memory alone.

## Content selection

### Keep only high-value material

Prefer:

- corrections the student is likely to repeat
- natural conversational upgrades
- reusable grammar patterns
- vocabulary that appeared naturally in the lesson
- useful word-family distinctions
- pronunciation or US/UK differences only when they genuinely matter
- short practice that tests the lesson's most important points

Avoid:

- every tiny translation question
- repeated explanations of the same point
- long dictionary-style entries
- unrelated personal questions
- material from another student's lesson
- filler added just to reach a certain number of cards
- facts or examples not needed for the lesson

### Default size

A normal lesson note should usually contain:

- about 4-8 teaching blocks
- about 4-7 practice items

These are not quotas. A light lesson can be shorter. Never pad a note.

If two lesson dates are being processed, create separate notes unless the teacher explicitly asks to combine them.

## Metadata

Use these exact labels:

Lesson Date: YYYY-MM-DD
Lesson Title: ...
Short Introduction: ...
Today's Focus: ...
Topics: topic one, topic two, topic three

### Metadata style

- `Lesson Title`: use `D Mon YYYY | Short Lesson Title`, for example `6 Oct 2026 | Everyday Words & Expressions`.
- Use the actual lesson date, matching `Lesson Date:`, rather than the creation or publishing date. Include the year; omit ordinal suffixes such as `6th`.
- Omit the student name from the title by default; the assigned learner and cover header identify the student. Add the name only when the teacher explicitly requests it.
- Keep the topic after the date short and student-friendly. The cover's large headline may show just the topic because its header already shows the student and date.
- `Short Introduction`: one sentence.
- `Today's Focus`: one concise sentence describing the main learning goal.
- `Topics`: usually 2-5 short tags.
- Do not exaggerate the scope of the lesson.

## Supported teaching blocks

Use semantic headings that the importer recognizes.

### Useful Phrase

```text
## Useful Phrase
English: ...
Japanese: ...
Explanation: ...
Example: ...
```

Use for a reusable expression worth saving.

### Natural English Upgrade

```text
## Natural English Upgrade
Original: ...
Natural: ...
Japanese: ...
Explanation: ...
Example: ...
```

Rules:
- Preserve the student's actual original wording when the source contains it.
- Do not manufacture an incorrect "Original" sentence.
- If there was no original sentence, use another block type.

### Common Mistake

```text
## Common Mistake
Incorrect: ...
Correct: ...
Japanese: ...
Explanation: ...
Examples:
...
...
```

Use when there is a clear error and correction.

### Grammar

```text
## Grammar
English: ...
Japanese: ...
Explanation: ...
Example: ...
```

Keep grammar explanations short and practical.

### Japanese to English

```text
## Japanese to English
English: ...
Japanese: ...
Explanation: ...
Example: ...
```

Use when a Japanese idea from the lesson has one especially useful English rendering.

### Comparison

```text
## Comparison
Word A: ...
Word B: ...
Japanese: ...
Explanation: ...
Examples:
...
...
```

Good for:
- sacrifice / suffer
- pain / painful
- for / since
- noun / adjective or verb / noun contrasts

### Pronunciation

```text
## Pronunciation
English: ...
IPA: ...
Japanese: ...
Explanation: ...
Examples:
...
...
```

Only include pronunciation when it adds real value.

If US and UK pronunciation differ meaningfully, show both clearly.

Do not invent a US/UK difference just to make the card look complete.

### Vocabulary

```text
## Vocabulary
English: ...
Japanese: ...
Explanation: ...
Example: ...
```

Use for a single genuinely useful word.

### Nuance

```text
## Nuance
English: ...
Japanese: ...
Explanation: ...
Examples:
...
...
```

Use sparingly. Do not turn Nuance into a dump of leftover vocabulary.

## Quick Practice

Use:

```text
## Quick Practice
```

Then choose only the practice types that fit the lesson.

### Multiple Choice

```text
### Multiple Choice
Question: ...
A: ...
B: ...
C: ...
Answer: B
Explanation: ...
Difficulty: easy
```

Important:
- Use `A:`, `B:`, `C:` exactly.
- Include at least two choices.
- Only one best answer unless the prompt explicitly says otherwise.
- Distractors should be plausible, not silly.

### Fill in the Blank

```text
### Fill in the Blank
Question: ...
Answer: ...
Explanation: ...
```

### Error Correction

```text
### Error Correction
Question: ...
Answer: ...
Explanation: ...
```

### Sentence Reorder

```text
### Sentence Reorder
Question: ...
Items:
- ...
- ...
- ...
Answer: ...
Explanation: ...
```

Use at least two reorder items.

### Japanese to English Practice

```text
### Japanese to English Practice
Question: ...
Answer: ...
Accepted answers:
...
...
Explanation: ...
```

Use `Accepted answers:` when more than one natural answer should count.

### Short Answer

```text
### Short Answer
Question: ...
Hint: ...
Answer: ...
Explanation: ...
```

The answer is a model, not the only acceptable response.

### Self Check

```text
### Self Check
Question: ...
Answer: ...
Explanation: ...
```

Use for a compact review of a distinction or rule.

## Import-safe formatting rules

The Quick Import parser is semantic, not a general Markdown renderer.

Therefore:

- Do not decorate field values with `**bold**`.
- Do not insert `---` as visual separators.
- Do not use unsupported labels such as `Natural Expressions:` unless you have verified the importer handles them.
- Do not add a separate answer-key section after interactive questions.
- Do not put long explanations inside `English:`.
- Do not use Markdown tables inside semantic blocks.
- Do not rely on emoji to create structure.
- Keep one field per intended semantic field.

Unrecognized text may be preserved as visible lesson text, so unnecessary Markdown can appear literally in Student View.

## Original sentence integrity

If a correction card represents a student's sentence:

- copy the original sentence faithfully
- correct only what is needed
- explain the actual error
- do not rewrite the original to make the correction look more dramatic

If the source is uncertain, do not present it as the student's mistake.

## Natural English quality

Prefer language a fluent speaker would actually say.

Do not overcorrect a sentence that is already grammatical. When a sentence is grammatical but less natural, say so in the explanation.

Distinguish:

- incorrect
- grammatical but unusual
- natural
- more natural in this context

## Japanese support

Japanese is support, not the main content.

Keep it:

- short
- accurate
- easy to understand
- focused on meaning or the key rule

Avoid long Japanese paragraphs unless the point genuinely needs them.

## American / British English

Default to internationally natural English.

Mention a US/UK difference only when it helps the student.

Examples:
- US verb: `practice`; UK verb: `practise`
- if pronunciation differs, label the IPA accurately
- if the difference is only spelling and does not matter to the lesson, keep it brief

Never create artificial dialect differences.

## Practice design

Practice should vary, but variety is not more important than usefulness.

A strong lesson commonly mixes:
- recognition: multiple choice
- retrieval: fill in the blank
- repair: error correction
- structure: sentence reorder
- production: Japanese to English
- personalization: short answer
- reflection: self check

Do not repeat the same target in every question.

## Final QA before delivery

Check all of the following:

- [ ] Correct student and lesson date
- [ ] Only material from the target lesson
- [ ] Metadata labels are exact
- [ ] Teaching headings are importer-supported
- [ ] Original sentences are preserved when used
- [ ] No invented personal history
- [ ] No unresolved term presented as fact
- [ ] Multiple choice uses `A:` / `B:` / `C:`
- [ ] Multiple choice has at least two choices
- [ ] Sentence reorder has at least two items
- [ ] No decorative `**` or `---` leaking into cards
- [ ] No unnecessary answer-key dump
- [ ] Japanese is concise
- [ ] US/UK notes are accurate and relevant
- [ ] Note is short enough to review comfortably
- [ ] Preview Import should be inspected before publishing

## Gold-standard references

Use these as quality references, not as content to copy:

- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Quick_Import.md`
- `examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Quick_Import.md`

Their strengths to preserve:
- concise scope
- semantic importer fields
- practical explanations
- mixed question types
- no padding
- lesson-specific content

The October 3/4 examples predate the date-first title convention. Follow the current metadata rule above for new lessons, while retaining those examples as content and visual references.
