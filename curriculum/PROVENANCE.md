# Tahmid English Curriculum provenance

## Scope

The files in this directory are the editable source of truth for the structured learning library:

- `words.json`: 320 items across Levels 1–32
- `phrases.json`: 128 items across Levels 1–32
- `phonics.json`: 32 items across Levels 1–32

The item IDs are stable application identifiers. Content revisions should preserve IDs unless a deliberate data migration accompanies the change.

## Origin and permitted references

This curriculum is project-original editorial content prepared specifically for Tahmid English Review Hub. It was not transcribed, scraped, downloaded, or extracted from Global Crown or another commercial course. Other products may be considered only for general learning-experience principles such as clarity, pacing, and visual hierarchy; their wording, illustrations, database content, and course order must not be copied.

The curriculum JSON references versioned local illustrations under `/assets/curriculum/`; it does not hotlink remote images. Authored Mulberry artwork and original teaching compositions are documented per asset in `assets/curriculum-attributions.json` and `assets/ATTRIBUTIONS.md`. Any further third-party visual or audio asset must have a documented commercial-use licence, creator, source URL, and local attribution record before it is added.

Common English words and short conventional expressions can naturally overlap with other learning materials. Such overlap does not establish the source of longer explanations, examples, sequence, or artwork. Editors should nevertheless write contextual examples independently and avoid reconstructing a third-party course from reference material.

## Editorial review record

- 2026-09-05: Structural and bilingual audit covering all 480 items.
- Verified 32 populated levels in each category, 480 unique IDs, and no exact duplicates in the primary English or Japanese learning fields.
- Corrected identified pronunciation, translation, naturalness, and US/UK usage issues without replacing the curriculum or changing item counts.
- Retained intentional phonics word recycling while documenting that a future release should strengthen cumulative decodability and cross-strand alignment.

- 2026-09-06: Full educator review retained all 480 IDs and level placements, revised 99 word items, 21 phrase items and all 32 phonics items, and added 96 bilingual learning goals. See `docs/CURRICULUM_EDUCATOR_AUDIT_2026-09-06.md` and the exact per-item `educator-audit.json` before/after ledger. Phonics now includes l/r preparation, corrected IPA clusters, contextual audio cues and sound contrasts.

Pronunciation facts may be checked against reputable learner dictionaries and established US/UK pronunciation references. Dictionary wording must not be copied into the curriculum; facts should be expressed in original teaching language.

## Change policy

Before publishing a curriculum edit:

1. Keep all IDs unique and every item in its declared level.
2. Preserve 10 Words, 4 Phrases, and 1 Phonics item per level unless a planned schema/content migration changes those contracts.
3. Check English naturalness, Japanese meaning, register, and US/UK claims.
4. Never rewrite or regenerate the release-frozen
   `202609050025_structured_learning_content.sql`; express every later database
   content change in a reviewed forward migration numbered `026` or higher.
5. Run `npm run generate:curriculum` to verify the immutable `025` hash and
   the current source against the reviewed `027` forward migration. Before
   the first deployment of `027`, deliberate regeneration uses
   `node scripts/generate-curriculum-quality-migration.mjs --write`; after
   deployment, preserve `027` and express further edits in `028` or later.
   Run the structured curriculum and security tests before publishing.
6. Record and attribute any externally sourced asset before use.
