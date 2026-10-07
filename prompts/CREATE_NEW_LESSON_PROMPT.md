# GOLDEN PROMPT — TAHMID ENGLISH HUB LESSON NOTE + COVER

I want you to create a finished Tahmid English Hub Lesson Note from the actual lesson material in this conversation or the lesson material I provide below.

Repository:
https://github.com/Tahmid447/tahmid-english-review-hub

Student: [STUDENT NAME]
Lesson date: [YYYY-MM-DD]

Lesson source / boundary:
[PASTE THE LESSON MATERIAL HERE, OR CLEARLY STATE WHERE THE LESSON STARTS AND ENDS IN THIS CHAT]

IMPORTANT:
Do not begin writing the lesson from memory.
Do not assume you remember the format from an earlier conversation.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — INSPECT THE CURRENT PROJECT FIRST
━━━━━━━━━━━━━━━━━━━━━━

Before creating anything, inspect the CURRENT repository and read:

- AGENTS.md
- docs/LESSON_NOTE_PRACTICE.md
- docs/LESSON_WORKFLOW.md
- docs/LESSON_NOTE_STANDARD.md
- docs/COVER_IMAGE_STANDARD.md
- docs/WORKFLOW_FOR_CHATGPT.md
- templates/LESSON_NOTE_TEMPLATE.md

Then inspect the current gold-standard examples:

- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Quick_Import.md
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Quick_Import.md
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-03_Visual.png
- examples/lesson-authoring/mary-oct-2026/Mary_2026-10-04_Visual.png

For the cover image, you MUST actually open/inspect the October 3 and October 4 image files visually if your environment supports it.

Do NOT rely only on the written description of their style.

If you cannot access the actual reference image pixels, tell me before generating the cover instead of guessing.

If Quick Import behavior is unclear, has changed, or the documentation and runtime may differ, inspect the CURRENT:
- src/lesson-note-model.js
- src/note-practice-model.js
and any other relevant current importer code.

Do not claim “Quick Import-ready” unless the FINAL Markdown has actually been checked against the current importer structure.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — ANALYZE THE LESSON BEFORE WRITING
━━━━━━━━━━━━━━━━━━━━━━

Privately review the complete lesson source first.

Identify:
- actual corrections
- useful vocabulary
- natural-English upgrades
- grammar patterns
- pronunciation points
- US/UK differences only when genuinely relevant
- useful Japanese → English expressions
- reusable conversational phrases
- important word-family or nuance differences
- larger vocabulary sets taught as a group
- items that are useful enough for the student to save individually

Then decide what is genuinely worth reviewing.

DO NOT:
- dump every question from the chat
- include my unrelated personal questions
- add filler to reach a target number
- invent what the student said
- invent student history, opinions, mistakes, or experiences
- convert an uncertain term into a fact
- repeat the same teaching point in multiple cards

Quality and usefulness are more important than quantity.

A normal lesson may have around 4–8 teaching blocks and 4–7 practice items, but these are NOT quotas.

If the actual lesson strongly justifies more content, use more.

For example:
If the lesson deliberately taught 10 useful Japanese fish names in English, do not arbitrarily reduce them to 3 just to keep the note short.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — DESIGN THE CONTENT STRUCTURE INTELLIGENTLY
━━━━━━━━━━━━━━━━━━━━━━

Choose the block type separately for EVERY learning point.

Do not force all lessons into the same structure.

Use only block types supported by the CURRENT importer.

Examples include:
Useful Phrase
Vocabulary
Grammar
Natural English Upgrade
Common Mistake
Japanese to English
Comparison
Pronunciation
Nuance

For corrections:
Preserve the student's ACTUAL original wording.

Never manufacture an incorrect Original sentence.

If the original wording is unavailable, use a different teaching block instead of pretending the student said something.

━━━━━━━━━━━━━━━━━━━━━━
INDIVIDUAL SAVE / FAVORITES RULE
━━━━━━━━━━━━━━━━━━━━━━

The student should be able to save useful words or expressions individually whenever that makes educational sense.

The existing Lesson Note system saves eligible lesson blocks individually to Save to My Phrases / Favorites.

Therefore:

If several independent vocabulary items are taught together and a learner may reasonably want to save ONE item without saving all the others, structure them as separate saveable blocks.

Example:
If the lesson teaches:
tuna
salmon
mackerel
yellowtail
horse mackerel
Atka mackerel
etc.

Do NOT place all of them only inside one giant vocabulary block if that prevents useful individual saving.

Prefer separate Vocabulary blocks for the individual fish names, while keeping them conceptually grouped as one lesson topic.

The same principle applies to:
- food names
- job vocabulary
- travel words
- phrasal verbs
- expressions
- collocations
- other independent learning items

Do not create separate cards unnecessarily when the items only make sense together.

Before finalizing, ask:
“If the student likes one item here, can they save/review that individual item naturally?”

If the current application or importer cannot support the desired individual-save behavior for the proposed structure, do NOT pretend that it can. Tell me what limitation you found.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — ADAPT PRACTICE TO THIS SPECIFIC LESSON
━━━━━━━━━━━━━━━━━━━━━━

Do not automatically create the same seven question types every lesson.

Choose the question types AFTER analyzing what was actually learned.

Use the question type that best tests each target.

Examples:

For vocabulary-heavy lessons:
- contextual multiple choice
- meaning recall
- Japanese → English
- English → meaning discrimination
- choosing between similar words
- short personalized production

For grammar:
- error correction
- fill in the blank
- sentence reorder
- natural vs unnatural choice
- Japanese → English production

For conversation/natural English:
- choose the most natural response
- rewrite an unnatural sentence
- complete a realistic dialogue
- short-answer production
- situation-based choice

For pronunciation:
- sound/stress discrimination or focused review only when the current site supports it appropriately

For word forms:
- noun / verb / adjective selection
- tense or past-participle selection

Do not include a question type simply to create variety.

Do not test trivial information.

Avoid repeating the same target in several questions unless repetition is genuinely useful.

Distractors in multiple choice should be plausible.

The practice should feel like a teacher deliberately designed it for THIS lesson.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — QUICK IMPORT SAFETY
━━━━━━━━━━━━━━━━━━━━━━

Use the repository's CURRENT exact Quick Import syntax.

Follow the actual parser rules.

In particular:
- exact metadata labels
- supported semantic headings only
- A: / B: / C: for multiple-choice options
- never A. / B. / C.
- Items: for sentence reorder
- Accepted answers: when multiple answers are genuinely acceptable
- no decorative **bold markers** leaking into content
- no --- separators
- no unsupported pseudo-headings
- no Markdown tables inside semantic lesson blocks
- no separate answer-key dump
- no unnecessary text outside supported fields

Keep explanations in Explanation:, not inside English:.

Keep Japanese support concise.

Mention US/UK spelling or pronunciation differences only when useful and accurate.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — FINAL MARKDOWN QA
━━━━━━━━━━━━━━━━━━━━━━

Before giving me the Markdown:

Validate the FINAL file, not an earlier draft.

Check:
- correct student
- correct date
- correct lesson boundary
- only actual lesson material
- original sentences preserved accurately
- no invented student facts
- no unresolved claims
- correct block types
- correct field mappings
- correct multiple-choice syntax
- correct reorder syntax
- individual saveability considered for vocabulary/phrase sets
- question types genuinely fit this lesson
- no unnecessary repetition
- no stray Markdown formatting
- reasonable lesson length
- natural English
- accurate Japanese
- accurate US/UK notes
- current importer compatibility

If possible, run the current parser/validator on the final Markdown.

Only after this may you call it Quick Import-ready.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 7 — COVER IMAGE: HARD GOLD-STANDARD RULE
━━━━━━━━━━━━━━━━━━━━━━

Create ONE final lesson cover image.

The October 3 and October 4 Mary images are HARD visual references, not loose inspiration.

You MUST visually inspect the actual reference images first.

The new cover must clearly look like another page from the SAME design system:

- warm cream/off-white background
- deep navy modern sans-serif typography
- muted teal accents
- soft lavender / mint / pale neutral rounded cards
- clean editorial grid
- generous spacing
- thin dark top rule
- TAHMID ENGLISH CLUB at top left
- STUDENT / DATE at top right
- small teal category label
- strong large title
- one hero teaching area
- one or two supporting teaching cards when useful
- 2–4 memorable lesson takeaways maximum
- approximately 1800 × 1400, 9:7

STRICTLY AVOID:
- photography
- cinematic city scenes
- sunsets
- landscapes
- stock photography
- people
- coffee cups
- bags
- random objects
- serif poster headlines
- glossy 3D
- fake dashboard design
- decorative AI-art clutter
- generic “motivational poster” styling

Do not change the art direction because another design looks attractive.

The goal is CONSISTENCY with Oct 3 / Oct 4.

Adapt the information architecture to the current lesson, but preserve the visual family.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 8 — COVER CONTENT SELECTION
━━━━━━━━━━━━━━━━━━━━━━

Do not put the whole lesson on the cover.

Choose only 2–4 strong learning takeaways.

The cover should communicate the character of this lesson at a glance.

For a vocabulary-set lesson, you may show a small representative set or a clean category concept.

For a grammar lesson, use a simple visual relationship such as:
past → now
original → natural
word A ↔ word B
verb → past → past participle

Never invent content simply to make the cover look better.

━━━━━━━━━━━━━━━━━━━━━━
PHASE 9 — VISUAL QA
━━━━━━━━━━━━━━━━━━━━━━

Inspect the generated image before showing it to me.

Check:
- correct student
- correct date and year
- correct title
- English spelling
- Japanese text
- no text clipping
- no weird AI-generated characters
- no invented lesson content
- no random object
- no photography
- same design family as Oct 3 / Oct 4
- readability at lesson-card thumbnail size

If the generated image fails these checks, reject it internally and regenerate.

Do NOT show me a chain of failed experimental images.

Show me only the accepted final cover unless I specifically ask to see alternatives.

━━━━━━━━━━━━━━━━━━━━━━
FINAL DELIVERABLE
━━━━━━━━━━━━━━━━━━━━━━

Give me:

1. Student_YYYY-MM-DD_Quick_Import.md
2. Student_YYYY-MM-DD_Visual.png

Optionally:
3. one ZIP containing both

Keep your final chat message short.

Tell me:
- how many teaching blocks were selected
- how many practice questions were selected
- whether any larger vocabulary set was intentionally split into individually saveable blocks
- whether the final Markdown was actually validated against the current importer
- whether the actual Oct 3 / Oct 4 cover files were visually inspected
- any genuine uncertainty that I should know before publishing

Do not claim a check was performed if it was not.

Remind me to use Preview Import before publishing.
