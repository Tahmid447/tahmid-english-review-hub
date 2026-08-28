# Visual question production guide

The 11 Notion-derived lessons now reserve five illustration-led activities each. The complete, machine-readable production list is:

- `scripts/visual-question-manifest.json`
- 55 unique scene briefs
- 55 unique target filenames
- five scenes per lesson from `july-07` through `july-27`

The 14 August 28 expansion lessons use
`scripts/visual-storyboard-manifest.json`: five panels per lesson, or 70 panels.
Together, the standalone manifest and storyboard manifest cover 155 visual
questions across all 31 lessons.

The generator intentionally does not invent a generic stock image. Each brief is tied to a real lesson phrase, and each activity asks the learner to select the sentence that matches the pictured action.

## Production contract

1. Generate the scene described by `globalArtDirection + scenePrompt`.
2. Do not add captions, speech bubbles, labels, UI, logos, watermarks, or answer-revealing English/Japanese text to the illustration.
3. Keep the key action legible at phone width. Avoid tiny background clues that become the only way to answer.
4. Preserve the requested 16:10 landscape composition. Recommended source size: 1536 × 960 pixels.
5. Export an sRGB WebP at the exact `asset` path in the manifest. Aim for 120–280 KB per file while preserving clean faces and hands.
6. Check that the correct phrase is visible from the action, but that the illustration does not literally print the answer.
7. Run `npm run verify:visuals`, `npm run generate:practice`, and `npm test` after the assets are added.

## Curriculum minimums

Every Notion-derived lesson now generates:

- 5 illustration-led choice activities (`See It`)
- 6 listening activities (3 listen-and-choose + 3 dictation)
- 5 speaking activities
- 17 additional activities across meaning choice, true/false, translation,
  full-sentence typing, sentence building, matching, sorting, labelled-grid,
  dialogue, mistake correction, and situation choice

That produces 33 activities and all 14 formats per Notion-derived lesson in the
current release. The general validator retains a 31-activity floor rather than
a permanent ceiling; the release migrations and parity tests enforce the
reviewed 33-question, 14-format bundle.

## Review checklist

- Scene matches the `phraseIndex` target in `src/data/curriculum.js`.
- No distractor choice is more visually plausible than the target.
- People and settings feel adult, warm, and credible rather than childish.
- The 55 files are visually consistent as one collection, but not repetitive.
- `imageAlt` describes the learning clue without adding unrelated detail.
- All filenames exactly match the manifest; filename case matters on Netlify.

The content generator fails if any lesson has fewer than five visual briefs, five listening activities, or five speaking activities. The content validator also verifies unique image paths, concrete scene briefs, and bilingual practice coverage.
