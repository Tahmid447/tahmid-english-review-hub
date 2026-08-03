# Migration Report / 移行レポート

## 1. Preserved source files

| Item | Repository path | SHA-256 |
|---|---|---|
| Takiwaki Review Hub v7 ZIP | `backups/takiwaki_review_hub_v7_original.zip` | `73886b1c6c81e8bddf075cf622cb7aea06e8ed72d31304f4d748898a4ea39067` |
| General entrance HTML | `backups/general-entrance-original.html` | `3aefbca69b47a4afdef0bc7d76d807690ead757c564d87c03d6fb3f96bbc3ea6` |
| Extracted legacy site | `legacy-site/` | Preserved without edits |

The automated validation checks both supplied-file hashes on every test run.

## 2. Live-site comparison

The production site at `https://jocular-chaja-86e78d.netlify.app/` was compared
with the ZIP on July 30, 2026.

- The entrance `index.html` was byte-for-byte identical.
- All six lesson pages matched the ZIP’s quiz content.
- The only page difference was the deployed return link:
  `../../index.html` in the ZIP versus `/` on Netlify.

The existing production site was not overwritten.

## 3. Original lesson inventory

| Lesson | Original top-level questions |
|---|---:|
| June 28 | 21 |
| June 29 | 15 |
| June 30 | 22 |
| July 4 | 27 |
| July 5 | 24 |
| July 6 | 34 |
| **Total** | **143** |

Original formats:

| Format | Count |
|---|---:|
| Multiple Choice | 55 |
| Situation Choice | 35 |
| Typed Answer | 31 |
| Sentence Order | 14 |
| Matching | 7 |
| Position Grid | 1 |

The 143 figure counts top-level activities. Matching activities contain
multiple independently scored pairs, so the original maximum score is higher
than 143.

Stable question IDs, answer structure, hints, explanations, and first-answer
scoring were migrated. The untouched ZIP remains the audit source.

## 4. Intentional English corrections

Only nine clearly misleading or malformed learning items were corrected in the
migrated copy. The backup and `legacy-site/` were not edited.

| Lesson / ID | Correction |
|---|---|
| June 30 / q5 | Replaced the unnatural “mentally full” explanation with “mentally overwhelmed.” |
| June 30 / q22 | Removed malformed accepted comparison variants and kept two complete natural answers. |
| July 4 / q6 | Explained `came up` as “something unexpected happened.” |
| July 4 / q11 | Changed the context to the natural phrase “doing nothing special.” |
| July 4 / q14 | Rewrote the noun hint as “a person, place, thing, or idea.” |
| July 4 / q19 | Corrected the explanation of `always` with the verb `be` and action verbs. |
| July 5 / q16 | Taught the complete conversational form `I’ve got to`, not an incomplete fragment. |
| July 6 / q22 | Corrected “or representing” to “or represents.” |
| July 6 / q25 | Clarified the matching prompt as “nuance word” and corrected its wording. |

## 5. Added practice

Each of the six existing lessons receives 13 additive activities:

- 2 Listening Choice
- 2 Listening Dictation
- 2 Speaking Practice
- 1 True or False
- 1 Sentence Order
- 1 Matching
- 1 Sorting
- 1 Dialogue
- 1 Japanese-to-English Translation
- 1 Situation Choice

That now adds **132** activities while preserving the **143** original activities.
The six public lessons therefore contain **275** top-level activities.

## 6. Notion-derived drafts

Eleven lessons after July 6 were catalogued from the connected Notion database.
Each now contains 31 activities: five illustration-led questions, six listening
activities, five speaking activities, and 15 varied reading, writing, sentence-
building, matching, dialogue, and correction activities. That produces **341
reviewed activities**. They were published to both audiences in the v9 launch
migration after review.

The complete reviewed source bundle contains:

- 143 migrated originals
- 132 additions
- 341 Notion-derived activities, published to both audiences
- **616 total activities**
- **14 implemented formats**

Draft JSON and curriculum source files are not copied to the public Netlify
bundle. The draft payloads are installed through an RLS-protected Supabase
migration.

## 7. Repository and branches

- Private repository: `Tahmid447/tahmid-english-review-hub`
- `main`: preserved v7 baseline commit
- `upgrade/review-hub-v8`: Netlify preview deployment branch
- `upgrade/review-hub-v9-playful-jp`: v9 implementation branch
- `backup/v8-calm-baseline`: one-step visual rollback

The old `Tahmid447/Takiwaki` repository was not changed or archived.
