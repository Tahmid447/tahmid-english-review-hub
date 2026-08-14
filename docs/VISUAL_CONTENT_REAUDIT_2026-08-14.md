# Visual content re-audit — 2026-08-14

## Scope and evidence

This re-audit covers all 85 illustration-led questions: five in each of the 17 lessons. Each item was compared across the rendered WebP, `scripts/visual-question-manifest.json`, the lesson phrase, prompt, all four choices, keyed answer, hint, English/Japanese explanations, and alt text.

The image review was manual: all 85 WebPs were inspected in 17 lesson contact sheets, and uncertain scenes were reopened at original resolution. The teaching text also received an individual 85-item pass: every question now has its own English/Japanese hint, bilingual statement of the supporting visual evidence, and three bilingual conflict reasons keyed to the exact distractors displayed. Static checks then verified the 1:1 manifest/data/file mapping, unique IDs and assets, exact keyed English/Japanese phrase, question-specific guidance, non-revealing hints, exact reason coverage, and the known ambiguous-choice regression list. Static tests cannot determine what pixels mean; manual inspection cannot replace structural tests. Both methods were used.

## Per-lesson inspection ledger

| Lesson | Five visual question IDs | Manual image/content review | Static audit |
|---|---|---|---|
| june-28 | `june-28-extra-visual-1`<br>`june-28-extra-visual-2`<br>`june-28-extra-visual-3`<br>`june-28-extra-visual-4`<br>`june-28-extra-visual-5` | PASS | PASS |
| june-29 | `june-29-extra-visual-1`<br>`june-29-extra-visual-2`<br>`june-29-extra-visual-3`<br>`june-29-extra-visual-4`<br>`june-29-extra-visual-5` | PASS after distractor fix | PASS |
| june-30 | `june-30-extra-visual-1`<br>`june-30-extra-visual-2`<br>`june-30-extra-visual-3`<br>`june-30-extra-visual-4`<br>`june-30-extra-visual-5` | PASS after distractor fix | PASS |
| july-04 | `july-04-extra-visual-1`<br>`july-04-extra-visual-2`<br>`july-04-extra-visual-3`<br>`july-04-extra-visual-4`<br>`july-04-extra-visual-5` | PASS | PASS |
| july-05 | `july-05-extra-visual-1`<br>`july-05-extra-visual-2`<br>`july-05-extra-visual-3`<br>`july-05-extra-visual-4`<br>`july-05-extra-visual-5` | PASS after distractor fix | PASS |
| july-06 | `july-06-extra-visual-1`<br>`july-06-extra-visual-2`<br>`july-06-extra-visual-3`<br>`july-06-extra-visual-4`<br>`july-06-extra-visual-5` | PASS | PASS |
| july-07 | `july-07-draft-visual-1`<br>`july-07-draft-visual-2`<br>`july-07-draft-visual-3`<br>`july-07-draft-visual-4`<br>`july-07-draft-visual-5` | PASS | PASS |
| july-11 | `july-11-draft-visual-1`<br>`july-11-draft-visual-2`<br>`july-11-draft-visual-3`<br>`july-11-draft-visual-4`<br>`july-11-draft-visual-5` | PASS after distractor fix | PASS |
| july-12 | `july-12-draft-visual-1`<br>`july-12-draft-visual-2`<br>`july-12-draft-visual-3`<br>`july-12-draft-visual-4`<br>`july-12-draft-visual-5` | PASS | PASS |
| july-13 | `july-13-draft-visual-1`<br>`july-13-draft-visual-2`<br>`july-13-draft-visual-3`<br>`july-13-draft-visual-4`<br>`july-13-draft-visual-5` | PASS after distractor and image fixes | PASS |
| july-18 | `july-18-draft-visual-1`<br>`july-18-draft-visual-2`<br>`july-18-draft-visual-3`<br>`july-18-draft-visual-4`<br>`july-18-draft-visual-5` | PASS | PASS |
| july-19 | `july-19-draft-visual-1`<br>`july-19-draft-visual-2`<br>`july-19-draft-visual-3`<br>`july-19-draft-visual-4`<br>`july-19-draft-visual-5` | PASS after image fix | PASS |
| july-22 | `july-22-draft-visual-1`<br>`july-22-draft-visual-2`<br>`july-22-draft-visual-3`<br>`july-22-draft-visual-4`<br>`july-22-draft-visual-5` | PASS after image and distractor fixes | PASS |
| july-23 | `july-23-draft-visual-1`<br>`july-23-draft-visual-2`<br>`july-23-draft-visual-3`<br>`july-23-draft-visual-4`<br>`july-23-draft-visual-5` | PASS | PASS |
| july-25 | `july-25-draft-visual-1`<br>`july-25-draft-visual-2`<br>`july-25-draft-visual-3`<br>`july-25-draft-visual-4`<br>`july-25-draft-visual-5` | PASS | PASS |
| july-26 | `july-26-draft-visual-1`<br>`july-26-draft-visual-2`<br>`july-26-draft-visual-3`<br>`july-26-draft-visual-4`<br>`july-26-draft-visual-5` | PASS | PASS |
| july-27 | `july-27-draft-visual-1`<br>`july-27-draft-visual-2`<br>`july-27-draft-visual-3`<br>`july-27-draft-visual-4`<br>`july-27-draft-visual-5` | PASS after image and text fixes | PASS |

## Exact issue and correction ledger

### Image-to-question corrections

| Question / asset | Prior inconsistency | Exact correction |
|---|---|---|
| `july-13-draft-visual-3`<br>`july-13-03-rush-back.webp` | The prompt and alt said the person was rushing **back toward** an office, but the runner appeared to be moving away from the visible entrance. The direction and forgotten reason were not visually proven. | Replaced the image so the learner has visibly turned and is running into the open office, with the return direction clear. Tightened the manifest brief to require the office interior and forgotten document ahead of the runner. |
| `july-19-draft-visual-2`<br>`july-19-02-either-day.webp` | The target was “Either **day** works for me,” but the two cards showed only a circle and triangle. They were options, not identifiable calendar days. | Replaced the image with two visibly different calendar-date cards and equal approval for both. The brief now rejects abstract shape cards explicitly. |
| `july-22-draft-visual-1`<br>`july-22-01-availability.webp` | The target asks about **August 4 at 10 a.m.** The prior image showed 4 and 10 o’clock but did not establish August; its thumbs-up also looked like an answer rather than a question. | Replaced the image with an `8/4` appointment card, a 10:00 clock, and a questioning scheduling interaction. Updated alt text and scene brief to carry the complete date/time meaning. |
| `july-27-draft-visual-2`<br>`july-27-02-poured-sauce.webp` | The correct sentence used “She,” but the illustration showed an adult man pouring the sauce. | Replaced the image with an adult woman cook. Updated alt text and scene brief to require her face, pouring hand, sauce stream, and pasta in one clear frame. |
| `july-27-draft-visual-3`<br>`july-27-03-splashed-water.webp` | The existing image correctly showed an adult man splashing an adult woman, but the alt text called the splasher a child and the brief avoided the pronoun/gender relationship. | Kept the valid image. Changed the alt to “A man playfully splashes water onto a woman” and aligned the brief, generated hint context, and English/Japanese explanations with the adult man/woman scene. |

### Ambiguous-choice corrections

| Question | Prior competing answer | Why it was ambiguous | Replacement set outcome |
|---|---|---|---|
| `june-29-extra-visual-1` | “I heard about it yesterday.” | The still image had no time evidence, so recognition of a restaurant could also be interpreted as having heard about it yesterday. | Replaced it with “I heard it clearly,” “For real?”, and “Click the top-right box”; only “I’ve heard of that restaurant” describes recognition of the shown restaurant. |
| `june-30-extra-visual-1` | “The noise is annoying.” | The construction noise and annoyed person made both this sentence and “I’m annoyed by the noise” true. | Replaced all near-duplicate noise/frustration choices with unrelated tea, exercise, and football scenes. |
| `july-05-extra-visual-3` | “I’m not sure yet.” | A thoughtful shopper between two choices could naturally be unsure as well as asking for time to think. | Replaced it with “That makes sense,” “That’s a good point,” and “Either option works for me”; the pause gesture uniquely supports “Let me think about it.” |
| `july-11-draft-visual-3` | “I’m staying at my parents’ house.” | The traveler greeting older family at a home could simultaneously be staying there. | Replaced it with Wi-Fi, live-broadcast, and conversational-distance sentences. |
| `july-13-draft-visual-1` | “No one usually calls me at this time.” | A person waiting beside a silent phone could not visually establish either a likely caller or a history of no callers. | Replaced it with weak-signal, unusual-event, and packed-street sentences. |
| `july-22-draft-visual-3` | “Either is fine.” | Equal open-handed approval of two dishes could mean either is acceptable, not necessarily that both are liked. | Replaced it with appointment, vegetable-preference, and night-shift sentences; “I like both” is now the only food-approval answer. |

### Individually reviewed guidance corrections (85/85)

- Prior hints repeated the exact Japanese model answer in quotation marks. That allowed a learner to match it to the bilingual choices without interpreting the image.
- An initial rewrite replaced that leak with a single generic hint on all 85 items. It also produced repetitive reasons and unnatural clauses such as “the illustration shows a customer orders.” Those drafts were treated as unresolved, not as completed work.
- All 85 English/Japanese hints were then written item by item. Each directs attention to evidence unique to that scene—such as the selected corner, match clock, subject, direction of movement, meal state, or event order—without containing the keyed English or Japanese answer.
- Prior explanations used one generic clause saying that all other choices described other situations. They did not teach why each individual distractor failed.
- Every manifest entry now stores one bilingual correct-evidence statement and three bilingual conflict reasons keyed to the exact distractor sentence. The generated explanation names each displayed distractor and states the concrete visual conflict; it does not merely repeat a translation or a common rejection sentence.
- English explanations use complete standalone evidence sentences, eliminating the “shows a customer orders” construction. Japanese explanations likewise pair each distractor with its own concrete mismatch.
- The generator is the source of truth, so the corrections were regenerated consistently into both `src/data/legacy-additions.json` and `src/data/notion-drafts.json`.

## Regression coverage added

`scripts/audit-question-quality.mjs` now fails when:

- a visual hint contains the keyed English or Japanese answer verbatim;
- any of the six known ambiguous distractors returns;
- either explanation field omits any displayed distractor;
- a visual lacks its individually reviewed hint, evidence statement, or any of its three choice-keyed bilingual reasons;
- generated guidance differs from the reviewed manifest text, two visual hints are duplicated, or a reason is attached to the wrong displayed choice;
- the retired generic rationale or known “illustration shows a customer orders” grammar pattern returns;
- the manifest is not exactly 17 lessons × 5 visual briefs;
- manifest assets or visual question IDs are duplicated;
- the keyed bilingual choice, manifest phrase, alt text, or asset mapping diverges.

## Verification results

- `node scripts/build-practice-data.mjs` — PASS: regenerated 132 legacy additions and 341 draft questions.
- `node scripts/audit-question-quality.mjs` — PASS: 17 lessons, 616 activities, 85 visuals.
- `node scripts/validate-content.mjs` — PASS: 1,369 integrity/security assertions.
- `npm run verify:visuals` — PASS: all 85 required WebP assets exist and pass the file-size check.
- Reviewed-guidance inventory — PASS: 85/85 unique English hints, 85/85 unique Japanese hints, 85 bilingual correct-evidence pairs, and 255/255 bilingual distractor-conflict reasons keyed to the displayed choices.
- `node scripts/generate-question-migration.mjs` — PASS: verified immutable migrations 003/009/013 and regenerated forward-only migration 016 with all 85 reviewed rows plus an exact 85-row update postcondition.
- `node --check` for the build, audit, and migration generators — PASS.
- `git diff --check` — PASS.
- `npm test` — PASS: content, question-quality, learning-experience, learner-platform, Teacher Studio, premium-schema, plan-platform, and v15 workflow suites all passed after the final content regeneration.
- Pillow decode/verify sweep — PASS: 85 valid WebP files; 85/85 were manually reviewed before corrections, with the four replacement assets reviewed separately after replacement.
