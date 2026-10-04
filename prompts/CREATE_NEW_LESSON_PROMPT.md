# Master Prompt — Create a Future Tahmid English Hub Lesson Note

I want you to create a new Tahmid English Hub Lesson Note from the lesson material I provide.

Repository:
https://github.com/Tahmid447/tahmid-english-review-hub

Before writing anything, inspect the repository and read:

- AGENTS.md
- docs/LESSON_NOTE_PRACTICE.md
- docs/LESSON_WORKFLOW.md
- docs/LESSON_NOTE_STANDARD.md
- docs/COVER_IMAGE_STANDARD.md
- templates/LESSON_NOTE_TEMPLATE.md
- docs/WORKFLOW_FOR_CHATGPT.md

Then inspect the gold-standard examples:

- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Quick_Import.md
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Quick_Import.md
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Visual.png
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Visual.png

If the current importer behavior is unclear or appears different from the documentation, inspect `src/lesson-note-model.js` and `src/note-practice-model.js` before claiming compatibility.

## My lesson

Student: [STUDENT NAME]
Lesson date: [YYYY-MM-DD]
Lesson source: [PASTE THE LESSON CHAT / TRANSCRIPT / NOTES HERE, OR TELL YOU WHICH PART OF THIS CHAT IS THE LESSON]

## Your job

Create TWO final deliverables:

1. `Student_YYYY-MM-DD_Quick_Import.md`
2. `Student_YYYY-MM-DD_Visual.png`

### Lesson-note rules

- Use ONLY material genuinely relevant to this lesson.
- Do not include my unrelated personal questions or unrelated chat topics.
- Do not invent student experiences, mistakes, or opinions.
- Preserve the student's original wording when making a correction card.
- If something is ambiguous or you are not sure what was meant, ask me instead of guessing.
- Select the most valuable learning points; do not dump everything from the conversation.
- Keep the note concise enough that a student would realistically review it.
- Quality is more important than the number of cards.
- Use varied practice types only when they add value.
- Use the repository's exact Quick Import syntax.
- Multiple-choice options must use `A:`, `B:`, `C:` — never `A.` or generic Markdown bullets.
- Do not insert decorative `**`, `---`, unsupported headings, or a separate answer-key dump.
- Add Japanese support only where useful and keep it concise.
- Treat American/British differences accurately and mention them only when relevant.
- Pronunciation/IPA must be accurate if included.
- Preview/validate the Markdown structure against the current importer before telling me it is ready.

### Cover-image rules

The October 3 and October 4 covers are the GOLD visual standard.

The new image should feel like the same design family:
- premium minimal editorial layout
- cream/off-white background
- deep navy typography
- muted teal accents
- soft pastel rounded panels
- strong typographic hierarchy
- spacious clean grid
- 2-4 lesson takeaways only
- no people
- no stock-photo look
- no random objects
- no glossy 3D
- no fake AI-poster feeling
- no invented lesson content

Use the actual reference images when the environment allows.

Preferred size: approximately 1800 × 1400 (9:7).

Inspect the final generated image for spelling, Japanese text, student/date accuracy, overflow, and visual consistency. Regenerate if necessary.

### Final response

Do not give me a huge essay.

Give me:
- the Markdown file
- the cover image
- optionally one ZIP containing both
- a short note telling me what you selected and any uncertainty
- a reminder to use Preview Import before publishing

If I give you more than one lesson date, create a separate Markdown + cover pair for each date unless I explicitly ask you to combine them.
