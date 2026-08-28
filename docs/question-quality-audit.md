# Question quality audit

Source review date: 2026-08-14

## Scope and method

- Audited all 31 lessons and 1100 activities one by one with format-specific integrity checks.
- Every activity was checked for bilingual prompt, hint, and explanation; answer completeness; unique choice text; exactly one keyed choice where applicable; and required audio/speaking/order/matching/sorting fields.
- Every visual activity was also checked that its keyed English/Japanese answer equals the lesson phrase selected by the manifest and that both explanations explicitly identify that model answer.
- Audited all 155 visual questions against the combined standalone/storyboard manifests and file inventory. The prior QA record covers 85 standalone scenes; this report does not mislabel the 70 new storyboard panels as previously human-inspected.
- This report distinguishes programmatic whole-corpus checks from the human image review; it does not label an unchecked item as complete.

## Corrections made in this audit

- Preserved the prior original-resolution human review of 85 standalone WebP illustrations and added structural, asset, target, panel, hint and explanation checks for 70 storyboard panels.
- Checked 155 unique English hints and 155 unique Japanese hints. Each hint points to scene-specific evidence without repeating either model answer.
- Checked one bilingual correct-evidence statement and three bilingual, choice-keyed conflict reasons for every visual: 155 evidence pairs and 465 distractor-reason pairs in total.
- Checked all 155 explanations as natural standalone sentences that identify the correct model and explain the concrete visual conflict for every displayed distractor in both languages.
- 56 legacy typing activities had only a Japanese prompt. Added an explicit English instruction and retained the Japanese target: july-04-original-q24, july-04-original-q25, july-04-original-q26, july-04-original-q27, july-05-original-q20, july-05-original-q21, july-05-original-q22, july-05-original-q23, july-05-original-q24, july-06-original-q28, july-06-original-q29, july-06-original-q30, july-06-original-q31, july-06-original-q32, july-06-original-q33, july-06-original-q34, june-28-original-q17a, june-28-original-q17b, june-28-original-q17c, june-28-original-q17d, june-28-original-q17e, june-29-original-q12a, june-29-original-q12b, june-29-original-q12c, june-29-original-q12d, june-30-original-q17, june-30-original-q18, june-30-original-q19, june-30-original-q20, june-30-original-q21, june-30-original-q22, july-07-draft-typing, july-11-draft-typing, july-12-draft-typing, july-13-draft-typing, july-18-draft-typing, july-19-draft-typing, july-22-draft-typing, july-23-draft-typing, july-25-draft-typing, july-26-draft-typing, july-27-draft-typing, july-30-part-1-draft-typing, july-30-part-2-draft-typing, august-02-draft-typing, august-03-draft-typing, august-09-draft-typing, august-10-part-1-draft-typing, august-10-part-2-draft-typing, august-16-part-1-draft-typing, august-16-part-2-draft-typing, august-17-part-1-draft-typing, august-17-part-2-draft-typing, august-23-draft-typing, august-24-draft-typing, august-25-draft-typing.
- 7 legacy matching activities lacked a learning explanation. Added a bilingual explanation of one-to-one whole-meaning matching: july-04-original-q23, july-05-original-q9, july-06-original-q11, july-06-original-q25, june-28-original-q16, june-29-original-q11, june-30-original-q16.
- Audited format-specific bilingual guidance across all 957 generated activities; explanations state the model answer and why it fits, while visual hints guide without revealing it.
- 109 visual choice sets now use explicitly selected, semantically distinct distractors: june-28-visual-1, june-28-visual-2, june-28-visual-3, june-28-visual-4, june-28-visual-5, june-29-visual-1, june-29-visual-2, june-29-visual-3, june-29-visual-4, june-29-visual-5, june-30-visual-1, june-30-visual-2, june-30-visual-3, june-30-visual-4, june-30-visual-5, july-04-visual-1, july-04-visual-2, july-04-visual-3, july-04-visual-4, july-04-visual-5, july-05-visual-1, july-05-visual-2, july-05-visual-3, july-05-visual-4, july-05-visual-5, july-06-visual-1, july-06-visual-2, july-06-visual-3, july-06-visual-4, july-06-visual-5, july-11-visual-3, july-13-visual-1, july-19-visual-3, july-22-visual-3, july-22-visual-5, july-25-visual-1, july-25-visual-4, july-26-visual-1, july-26-visual-5, july-30-part-1-visual-1, july-30-part-1-visual-2, july-30-part-1-visual-3, july-30-part-1-visual-4, july-30-part-1-visual-5, july-30-part-2-visual-1, july-30-part-2-visual-2, july-30-part-2-visual-3, july-30-part-2-visual-4, july-30-part-2-visual-5, august-02-visual-1, august-02-visual-2, august-02-visual-3, august-02-visual-4, august-02-visual-5, august-03-visual-1, august-03-visual-2, august-03-visual-3, august-03-visual-4, august-03-visual-5, august-09-visual-1, august-09-visual-2, august-09-visual-3, august-09-visual-4, august-09-visual-5, august-10-part-1-visual-1, august-10-part-1-visual-2, august-10-part-1-visual-3, august-10-part-1-visual-4, august-10-part-1-visual-5, august-10-part-2-visual-1, august-10-part-2-visual-2, august-10-part-2-visual-3, august-10-part-2-visual-4, august-10-part-2-visual-5, august-16-part-1-visual-1, august-16-part-1-visual-2, august-16-part-1-visual-3, august-16-part-1-visual-4, august-16-part-1-visual-5, august-16-part-2-visual-1, august-16-part-2-visual-2, august-16-part-2-visual-3, august-16-part-2-visual-4, august-16-part-2-visual-5, august-17-part-1-visual-1, august-17-part-1-visual-2, august-17-part-1-visual-3, august-17-part-1-visual-4, august-17-part-1-visual-5, august-17-part-2-visual-1, august-17-part-2-visual-2, august-17-part-2-visual-3, august-17-part-2-visual-4, august-17-part-2-visual-5, august-23-visual-1, august-23-visual-2, august-23-visual-3, august-23-visual-4, august-23-visual-5, august-24-visual-1, august-24-visual-2, august-24-visual-3, august-24-visual-4, august-24-visual-5, august-25-visual-1, august-25-visual-2, august-25-visual-3, august-25-visual-4, august-25-visual-5.
- Visual corrections and additions documented in scripts/visual-human-qa.json: july-25-draft-visual-4 — Replaced the illustration with one that shows repeated calls from the same identifiable male contact and the learner's frustration. The 30 legacy expansion questions ending in extra-visual-1 through extra-visual-5 — Created and inspected five lesson-specific WebP illustrations for each of the six lessons, then checked every image against its manifest scene, target sentence, distractors, alt text, hint, and explanations. june-30-extra-visual-3 and june-30-extra-visual-4 — Rejected both drafts and regenerated them with clear digital match clocks showing 32:00 and 78:00. july-13-draft-visual-3 — Replaced the asset with a scene showing the runner turned toward an open office entrance, with the forgotten document visible inside, and aligned the manifest brief. july-19-draft-visual-2 — Replaced the asset with two distinct calendar-date cards and equal approval for both, and aligned the manifest brief. july-22-draft-visual-1 — Replaced the asset with a visible 8/4 card, a clock at 10:00, and a questioning scheduling gesture; updated alt text and the manifest brief. july-27-draft-visual-2 — Replaced the asset with an adult woman pouring a visible stream of sauce onto pasta; updated alt text and the manifest brief. july-27-draft-visual-3 — Kept the image and corrected the alt text and manifest brief to identify the adult man and woman accurately. june-29-extra-visual-1, june-30-extra-visual-1, july-05-extra-visual-3, july-11-draft-visual-3, july-13-draft-visual-1, and july-22-draft-visual-3 — Selected three semantically distinct distractors for each item and added a regression list that rejects the six ambiguous choices if they return. All 85 visual questions — Reviewed all 85 question records individually. Each manifest entry now stores a unique non-revealing hint in English and Japanese, bilingual visual evidence for the correct answer, and three bilingual reasons keyed to the exact displayed distractor text. Rebuilt explanations as natural standalone sentences and added failures for missing or mismatched reasons, duplicate hints, the retired generic rationale, and the known ungrammatical pattern.
- Changed runtime behavior so each new practice run shuffles both question order and choice order automatically; a resumed run retains its saved order.

## Lesson summary

| Lesson | Activities | Format inventory | Result |
|---|---:|---|---|
| july-04 | 49 | dialogue:1, listenChoice:2, listenType:3, matching:2, mcq:12, order:4, situation:13, sorting:1, speaking:5, translation:1, truefalse:1, typing:4 | PASS |
| july-05 | 46 | dialogue:1, listenChoice:2, listenType:3, matching:2, mcq:9, order:4, situation:12, sorting:1, speaking:5, translation:1, truefalse:1, typing:5 | PASS |
| july-06 | 56 | dialogue:1, listenChoice:2, listenType:3, matching:3, mcq:12, order:6, situation:14, sorting:1, speaking:5, translation:1, truefalse:1, typing:7 | PASS |
| june-28 | 43 | dialogue:1, listenChoice:2, listenType:3, matching:2, mcq:8, order:1, situation:13, sorting:1, speaking:5, translation:1, truefalse:1, typing:5 | PASS |
| june-29 | 37 | dialogue:1, grid:1, listenChoice:2, listenType:3, matching:2, mcq:7, order:1, situation:8, sorting:1, speaking:5, translation:1, truefalse:1, typing:4 | PASS |
| june-30 | 44 | dialogue:1, listenChoice:2, listenType:3, matching:2, mcq:7, order:4, situation:11, sorting:1, speaking:5, translation:1, truefalse:1, typing:6 | PASS |
| july-07 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-11 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-12 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-13 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-18 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-19 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-22 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-23 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-25 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-26 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-27 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-30-part-1 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| july-30-part-2 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-02 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-03 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-09 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-10-part-1 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-10-part-2 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-16-part-1 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-16-part-2 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-17-part-1 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-17-part-2 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-23 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-24 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |
| august-25 | 33 | dialogue:1, grid:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2, typing:1 | PASS |

## Per-question results

| Lesson | Question ID | Format | Prompt (English) | Answer integrity | Guidance | Media | Result |
|---|---|---|---|---|---|---|---|
| july-04 | july-04-original-q1 | situation | Which word naturally means 「実は」 at the beginning of a sentence? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q2 | mcq | Which sentence is grammatically natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q3 | mcq | True or False: “avoid to do” is the normal pattern in English. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q4 | situation | Which phrase fits best? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q5 | mcq | Which phrase means 「選択肢がない / そうするしかない」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q6 | situation | What is the most natural casual explanation? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q7 | mcq | Which version sounds more formal and polite? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q8 | mcq | Mistake Detective: Which phrase is unnatural for 「事故を起こす / 事故に遭う」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q9 | situation | Choose the natural sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q10 | mcq | Which sentence means 「歳とりたくない」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q11 | situation | Which sentence fits 「ただ座ってるだけだけどね」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q12 | mcq | Which phrase means 「わざと」 in everyday conversation? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q13 | mcq | Fix-It Challenge: Choose the natural question for 「それわざとやったの？」 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q14 | mcq | Which word is a noun meaning 「感謝 / 感謝の気持ち」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q15 | situation | Which phrase is the best daily expression? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q16 | situation | Which reply means 「いえいえ / 気にしないで」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q17 | mcq | Which is the most natural superlative of “sleepy”? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q18 | mcq | Which sentence sounds most natural in daily conversation? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q19 | mcq | Which sentence puts “always” in the right place? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q20 | order | Sentence Builder: Make 「実は、今日は少し疲れています。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q21 | order | Sentence Builder: Make 「疲れている時は運転を避けます。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q22 | order | Sentence Builder: Make 「急な事情があって行けませんでした。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q23 | matching | Speed Match: Match today’s phrases with the Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q24 | typing | Write this meaning in natural English: 「仕方ない。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q25 | typing | Write this meaning in natural English: 「もしこの高速で事故ったら、確実に死んでるわ。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q26 | typing | Write this meaning in natural English: 「それわざとやったの？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-original-q27 | typing | Write this meaning in natural English: 「本当に感謝しています。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-true-false | truefalse | “Don’t mention it.” means “どういたしまして。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-order | order | Put the words in order: あとで雨が降るかもしれません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-translation | translation | Translate into English: 急な事情ができました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-situation | situation | Which sentence best expresses this meaning: 仕方ありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-04 | july-04-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-04 | july-04-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-04 | july-04-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-04 | july-04-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-05 | july-05-original-q1 | situation | You want to say 「まあ、美味しいけどね」. Which sentence is natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q2 | mcq | Which Japanese feeling is closest to “It’s expensive, though”? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q3 | mcq | True or False: In casual conversation, “sentence + though” can mean 「〜だけどね」. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q4 | situation | Choose the best reply. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q5 | situation | Which reply is casual and natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q6 | situation | Which reply sounds kind and reassuring? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q7 | mcq | Which reply sounds polite and a little elegant, often used in service or business? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q8 | mcq | Mistake Detective: Which reply means 「またいつでも言って」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q9 | matching | Speed Match: Match each reply with the Japanese feeling. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q10 | situation | What is the shortest natural answer? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q11 | mcq | Which question means 「店内ですか？お持ち帰りですか？」 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q12 | mcq | True or False: “takeaway” is especially common in British/Australian English. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q13 | situation | Which answer is correct? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q14 | mcq | Which phrase means 「定番の / いつもの / 迷ったらこれ」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q15 | mcq | Mistake Detective: Which sentence is unnatural for 「これは私の定番コーヒーです」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q16 | mcq | Which sentence uses “got to” correctly? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q17 | order | Sentence Builder: Make 「まあ、美味しいけどね。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q18 | order | Sentence Builder: Make 「これ持ち帰りでお願いします。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q19 | order | Sentence Builder: Make 「これは私の定番コーヒーです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q20 | typing | Write this meaning in natural English: 「ただ座ってるだけだけどね。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q21 | typing | Write this meaning in natural English: 「全然大丈夫。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q22 | typing | Write this meaning in natural English: 「持ち帰りでお願いします。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q23 | typing | Write this meaning in natural English: 「店内ですか？お持ち帰りですか？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-original-q24 | typing | Write this meaning in natural English: 「これは私の定番コーヒーです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-true-false | truefalse | “I changed my mind.” means “考えが変わりました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-order | order | Put the words in order: どちらの選択肢でも大丈夫です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-translation | translation | Translate into English: 天気によります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-situation | situation | Which sentence best expresses this meaning: まだ分かりません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-05 | july-05-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-05 | july-05-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-05 | july-05-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-05 | july-05-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-06 | july-06-original-q1 | situation | Choose the most natural way to say 「今日はまだお酒を飲んでいません」. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q2 | mcq | Which sentence sounds like a finished-day result? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q3 | mcq | True or False: “I didn’t drink alcohol yet” is the best standard sentence for 「まだ飲んでいない」. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q4 | mcq | Choose the correct verb change for drink. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q5 | situation | Which sentence is natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q6 | mcq | Which sentence is a softer way to say you dislike soccer? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q7 | mcq | Mistake Detective: Which sentence is wrong? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q8 | situation | Which sentence is natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q9 | mcq | Which sentence means 「コメント欄の中で見ました」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q10 | mcq | Which sentence means she works for Instagram as a company? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q11 | matching | Part 1 Match: Connect the sentence with the meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q12 | order | Sentence Builder: Make 「今日はまだお酒を飲んでいません。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q13 | order | Sentence Builder: Make 「サッカーを見るのが嫌いです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q14 | order | Sentence Builder: Make 「インスタで見ました。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q15 | situation | Which word sounds natural for cute shiny accessories? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q16 | situation | Which word fits best? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q17 | situation | Which word is best for ピカピカ? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q18 | mcq | True or False: “sparkling water” usually means ラメの水. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q19 | situation | Which sentence is correct? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q20 | mcq | Which sentence means 「それは面白いです / 興味深いです」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q21 | mcq | Mistake Detective: Which sentence is dangerous if you mean 「私は興味があります」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q22 | situation | Which sentence is natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q23 | mcq | Which phrase is more natural than “behalf of me”? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q24 | mcq | Which sentence sounds like a formal representative phrase? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q25 | matching | Part 2 Match: Match each nuance word with its Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q26 | order | Sentence Builder: Make 「英語に興味があります。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q27 | order | Sentence Builder: Make 「私の代わりに返信してくれますか？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q28 | typing | Write this meaning in natural English: 今日はまだお酒を飲んでいません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q29 | typing | Write this meaning in natural English: サッカーを見るのが嫌いです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q30 | typing | Write this meaning in natural English: インスタで見ました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q31 | typing | Write this meaning in natural English: キラキラしたものが好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q32 | typing | Write this meaning in natural English: 英語に興味があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q33 | typing | Write this meaning in natural English: それは面白いです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-original-q34 | typing | Write this meaning in natural English: 私の代わりに返信してくれますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-true-false | truefalse | “I’ll check and let you know.” means “確認してお知らせします。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-order | order | Put the words in order: そこが難しいと感じる部分です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-translation | translation | Translate into English: だんだん慣れてきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-situation | situation | Which sentence best expresses this meaning: それは今まで試したことがありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-06 | july-06-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-06 | july-06-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-06 | july-06-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-06 | july-06-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-28 | june-28-original-q1 | mcq | Warm-up: Which sentence is the most polite way to ask 「何を飲みたいですか？」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q2 | situation | Café Mission: Choose the best reply. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q3 | mcq | TRUE or FALSE: “I like coffee” and “I’d like coffee” mean exactly the same thing. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q4 | situation | Mini Dialogue: B wants to ask A the same question back. What should B say? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q5 | mcq | Mistake Detective: What is wrong with “I would coffee”? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q6 | mcq | Speed Check: Which past question is correct? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q7 | mcq | TRUE or FALSE: After “Did,” we usually use the past verb like “helped.” | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q8 | situation | Fix-It Challenge: Choose the corrected sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q9 | situation | Stadium Question: What is the most natural way to ask 「どっちが勝つと思う？」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q10 | mcq | TRUE or FALSE: “Who will win, Japan or Brazil?” can sound natural even though Japan and Brazil are countries. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q11 | mcq | Nuance Check: Which one clearly means 「どちらのチームが勝ちますか？」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q12 | situation | Real-Life Reaction: What can you say? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q13 | situation | Soft Acceptance: Which phrase sounds closest to 「仕方ないね」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q14 | mcq | TRUE or FALSE: “There is nothing that can be done” is usually more casual than “There’s nothing we can do.” | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q15 | situation | Phrase Hunter: Which sentence fits this situation? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q16 | matching | Speed Match: Connect each phrase to the Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q17a | typing | Write this meaning in natural English: 何を飲みたいですか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q17b | typing | Write this meaning in natural English: コーヒーがいいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q17c | typing | Write this meaning in natural English: あなたはどうですか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q17d | typing | Write this meaning in natural English: 彼は昨日あなたを手伝いましたか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-original-q17e | typing | Write this meaning in natural English: 仕方ない。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-true-false | truefalse | “That sounds good.” means “それはよさそうですね。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-order | order | Put the words in order: ほかに何かいかがですか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-translation | translation | Translate into English: 何を注文しましたか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-situation | situation | Which sentence best expresses this meaning: 仕方ありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-28 | june-28-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-28 | june-28-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-28 | june-28-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-28 | june-28-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-29 | june-29-original-q1 | mcq | Which sentence means 「それ聞こえた」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q2 | mcq | Which sentence means 「それ聞いたよ」 as information? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q3 | mcq | Which sentence means 「それについて聞いた」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q4 | mcq | Which sentence means 「名前は聞いたことある」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q5 | situation | What is the best answer? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q6 | mcq | Which phrase means 「それなぁ！」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q7 | situation | Choose the best natural reaction. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q8 | mcq | Which phrase means 「マジで / ほんとそれ」 casually? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q9 | mcq | What does “top right” mean? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q10 | grid | Click the bottom left box. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q11 | matching | Match the English phrase with the Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q12a | typing | Write this meaning in natural English: 「それについて聞いた気がする。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q12b | typing | Write this meaning in natural English: 「名前は聞いたことある。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q12c | typing | Write this meaning in natural English: 「それほんとだよね。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-original-q12d | typing | Write this meaning in natural English: 「右上」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-true-false | truefalse | “The button is in the bottom-left corner.” means “ボタンは左下にあります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-order | order | Put the words in order: 彼女が言ったことが聞こえませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-translation | translation | Translate into English: それがはっきり聞こえました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-situation | situation | Which sentence best expresses this meaning: その通り。それが私の言いたいことです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-29 | june-29-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-29 | june-29-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-29 | june-29-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-29 | june-29-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-30 | june-30-original-q1 | situation | You want to say 「それがイライラする」. Which sentence is natural? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q2 | mcq | Which sentence means 「私はイライラしています」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q3 | situation | Which feeling word fits best? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q4 | mcq | Which one is stronger than “annoyed” and often means quite irritated? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q5 | situation | What is the most natural feeling phrase? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q6 | mcq | Mistake Detective: Which sentence is dangerous because it changes the meaning? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q7 | situation | What is the most natural sports question? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q8 | mcq | Which sentence means 「どっちが勝つと思う？」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q9 | mcq | Which question means 「コーヒーと紅茶、どちらが好きですか？」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q10 | situation | Choose the best complete answer. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q11 | mcq | Which sentence means 「冬より夏の方がゴルフしやすい」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q12 | mcq | Which pair means 「前半 / 後半」? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q13 | order | Sentence Builder: Make 「香りがいいのでコーヒーが好きです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q14 | order | Sentence Builder: Make 「どっちが勝つと思う？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q15 | order | Sentence Builder: Make 「冬より夏の方がゴルフしやすいです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q16 | matching | Speed Match: Match the English phrase with the Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q17 | typing | Write this meaning in natural English: 「私はイライラしています。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q18 | typing | Write this meaning in natural English: 「それはイライラします。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q19 | typing | Write this meaning in natural English: 「日本とブラジル、どちらが勝つと思う？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q20 | typing | Write this meaning in natural English: 「コーヒーと紅茶、どちらが好きですか？」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q21 | typing | Write this meaning in natural English: 「香りがいいのでコーヒーが好きです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-original-q22 | typing | Write this meaning in natural English: 「冬より夏の方がゴルフしやすいです。」 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-listen-choice-1 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-listen-choice-2 | listenChoice | Listen and choose the sentence you hear. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-speaking-1 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-speaking-2 | speaking | Listen, then say the sentence naturally. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-speaking-3 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-speaking-4 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-speaking-5 | speaking | Say the sentence naturally, then try once more without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-true-false | truefalse | “The second half was exciting.” means “後半はわくわくしました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-order | order | Put the words in order: 何もうまくいかず、もどかしかったです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-translation | translation | Translate into English: 軽い味なので紅茶の方が好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-situation | situation | Which sentence best expresses this meaning: 誰が勝つと思いますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-30 | june-30-extra-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-30 | june-30-extra-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-30 | june-30-extra-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| june-30 | june-30-extra-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-07 | july-07-draft-choice-1 | mcq | Choose the English sentence that means: ノートを持ってきました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-2 | mcq | Choose the English sentence that means: 新しいノートを買いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-3 | mcq | Choose the English sentence that means: あなたは私にそうするよう言いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-4 | mcq | Choose the English sentence that means: 携帯の充電が切れました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-true-false-1 | truefalse | “Where will she come from?” means “彼女はどこから来ますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-true-false-2 | truefalse | “I got a flat tire.” means “料理が得意です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-typed-1 | translation | Translate into English: 料理が得意です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-typed-2 | translation | Translate into English: 彼女が私の代理で署名しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-typing | typing | Type the complete English sentence from memory: 明日それを持ってきてください。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-order-1 | order | Put the words in order: 私のためにしてもらえますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-order-2 | order | Put the words in order: 彼が私の代わりに出席しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-grid | grid | Select the tile that means: 彼女はどこから来ますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-situation | situation | Which sentence would you use when you want to say: 明日それを持ってきてください。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-07 | july-07-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-07 | july-07-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-07 | july-07-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-07 | july-07-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-11 | july-11-draft-choice-1 | mcq | Choose the English sentence that means: 携帯はWi-Fiにつながっています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-2 | mcq | Choose the English sentence that means: ケーブルを接続しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-3 | mcq | Choose the English sentence that means: その番組は生放送されます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-4 | mcq | Choose the English sentence that means: ライブ配信を見ました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-true-false-1 | truefalse | “I went back to my hometown.” means “地元に帰りました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-true-false-2 | truefalse | “I’m staying at my parents’ house.” means “変な音に気づきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-typed-1 | translation | Translate into English: 変な音に気づきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-typed-2 | translation | Translate into English: 違う鍵を持っていると気づきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-typing | typing | Type the complete English sentence from memory: その標識に気づきませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-order-1 | order | Put the words in order: 人は話す時に近くに立つことがあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-order-2 | order | Put the words in order: 昨日そのパソコンは接続されていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-grid | grid | Select the tile that means: 地元に帰りました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-situation | situation | Which sentence would you use when you want to say: その標識に気づきませんでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-11 | july-11-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-11 | july-11-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-11 | july-11-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-11 | july-11-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-12 | july-12-draft-choice-1 | mcq | Choose the English sentence that means: まだお酒を飲んでいません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-2 | mcq | Choose the English sentence that means: もう昼食を食べましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-3 | mcq | Choose the English sentence that means: 正午に昼食を食べました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-4 | mcq | Choose the English sentence that means: 私はお酒を飲みません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-true-false-1 | truefalse | “I didn’t drink yesterday.” means “昨日は飲みませんでした。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-true-false-2 | truefalse | “I haven’t eaten anything today.” means “彼女はもう朝食を食べました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-typed-1 | translation | Translate into English: 彼女はもう朝食を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-typed-2 | translation | Translate into English: まだ決めていません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-typing | typing | Type the complete English sentence from memory: 昨夜夕食を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-order-1 | order | Put the words in order: マレーシア料理を食べたことがありますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-order-2 | order | Put the words in order: この鞄を何年も持っています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-grid | grid | Select the tile that means: 昨日は飲みませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-situation | situation | Which sentence would you use when you want to say: 昨夜夕食を食べました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-12 | july-12-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-12 | july-12-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-12 | july-12-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-12 | july-12-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-13 | july-13-draft-choice-1 | mcq | Choose the English sentence that means: この時間帯に誰かが電話するかもしれません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-2 | mcq | Choose the English sentence that means: この時間には普段誰も電話しません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-3 | mcq | Choose the English sentence that means: 電波が弱いです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-4 | mcq | Choose the English sentence that means: Wi-Fi接続が不安定です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-true-false-1 | truefalse | “I need to rush back.” means “急いで戻る必要があります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-true-false-2 | truefalse | “That’s unusual.” means “この店にはティラミスがありませんが、あちらにはあります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-typed-1 | translation | Translate into English: この店にはティラミスがありませんが、あちらにはあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-typed-2 | translation | Translate into English: 一週間が早く過ぎました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-typing | typing | Type the complete English sentence from memory: 東京では多くの人が歩いています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-order-1 | order | Put the words in order: 通りは人でいっぱいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-order-2 | order | Put the words in order: 週の初めは長く感じます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-grid | grid | Select the tile that means: 急いで戻る必要があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-situation | situation | Which sentence would you use when you want to say: 東京では多くの人が歩いています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-13 | july-13-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-13 | july-13-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-13 | july-13-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-13 | july-13-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-18 | july-18-draft-choice-1 | mcq | Choose the English sentence that means: そのクラスに参加する予定でした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-2 | mcq | Choose the English sentence that means: 彼女は猫を飼っています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-3 | mcq | Choose the English sentence that means: 彼女は猫を飼っていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-4 | mcq | Choose the English sentence that means: 彼女はまだ食べていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-true-false-1 | truefalse | “I do like this song.” means “この歌は本当に好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-true-false-2 | truefalse | “The pot was on the stove.” means “鍋に火がつきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-typed-1 | translation | Translate into English: 鍋に火がつきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-typed-2 | translation | Translate into English: 家が燃えています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-typing | typing | Type the complete English sentence from memory: 彼女は気合いが入って準備万端です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-order-1 | order | Put the words in order: 彼は今日は絶好調です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-order-2 | order | Put the words in order: 運転免許を持っています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-grid | grid | Select the tile that means: この歌は本当に好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-situation | situation | Which sentence would you use when you want to say: 彼女は気合いが入って準備万端です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-18 | july-18-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-18 | july-18-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-18 | july-18-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-18 | july-18-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-19 | july-19-draft-choice-1 | mcq | Choose the English sentence that means: 紅茶もコーヒーも両方好きです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-2 | mcq | Choose the English sentence that means: どちらの日でも大丈夫です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-3 | mcq | Choose the English sentence that means: どちらの選択肢も好きではありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-4 | mcq | Choose the English sentence that means: どちらも好きではありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-true-false-1 | truefalse | “I’d rather stay home than go out.” means “外出するより家にいたいです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-true-false-2 | truefalse | “I’d rather not talk about it.” means “それは爆笑するほど面白かったです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-typed-1 | translation | Translate into English: それは爆笑するほど面白かったです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-typed-2 | translation | Translate into English: その冗談で爆笑しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-typing | typing | Type the complete English sentence from memory: コーヒーを飲みたいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-order-1 | order | Put the words in order: 昔の友人に偶然会いました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-order-2 | order | Put the words in order: 仕事へ向かっている途中です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-grid | grid | Select the tile that means: 外出するより家にいたいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-situation | situation | Which sentence would you use when you want to say: コーヒーを飲みたいです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-19 | july-19-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-19 | july-19-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-19 | july-19-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-19 | july-19-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-22 | july-22-draft-choice-1 | mcq | Choose the English sentence that means: 8月4日午前10時はご都合いかがですか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-2 | mcq | Choose the English sentence that means: 皆さん、準備はできましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-3 | mcq | Choose the English sentence that means: 両方好きです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-4 | mcq | Choose the English sentence that means: どちらでも大丈夫です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-true-false-1 | truefalse | “Neither is okay.” means “どちらも駄目です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-true-false-2 | truefalse | “I prefer cucumber to eggplant.” means “はい、焼肉が好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-typed-1 | translation | Translate into English: はい、焼肉が好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-typed-2 | translation | Translate into English: いいえ、好きではありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-typing | typing | Type the complete English sentence from memory: 会議室は利用できますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-order-1 | order | Put the words in order: その通りです。好きではありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-order-2 | order | Put the words in order: 実は本当に好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-grid | grid | Select the tile that means: どちらも駄目です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-situation | situation | Which sentence would you use when you want to say: 会議室は利用できますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-22 | july-22-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-22 | july-22-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-22 | july-22-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-22 | july-22-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-23 | july-23-draft-choice-1 | mcq | Choose the English sentence that means: まだ一つも思いついていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-2 | mcq | Choose the English sentence that means: 少し体調がよくありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-3 | mcq | Choose the English sentence that means: 暑すぎて外に出られません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-4 | mcq | Choose the English sentence that means: たった今昼食を注文しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-true-false-1 | truefalse | “A car suddenly appeared.” means “車が突然現れました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-true-false-2 | truefalse | “It fell on the floor.” means “それは床に落ちています。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-typed-1 | translation | Translate into English: それは床に落ちています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-typed-2 | translation | Translate into English: それを床に置きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-typing | typing | Type the complete English sentence from memory: どこでもドアならどこへでも行けます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-order-1 | order | Put the words in order: たった今家に着きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-order-2 | order | Put the words in order: 親子丼を注文しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-grid | grid | Select the tile that means: 車が突然現れました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-situation | situation | Which sentence would you use when you want to say: どこでもドアならどこへでも行けます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-23 | july-23-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-23 | july-23-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-23 | july-23-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-23 | july-23-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-25 | july-25-draft-choice-1 | mcq | Choose the English sentence that means: お腹が空いてきました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-2 | mcq | Choose the English sentence that means: もう腹ペコです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-3 | mcq | Choose the English sentence that means: その音にイライラしています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-4 | mcq | Choose the English sentence that means: 何もうまくいかず、もどかしいです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-true-false-1 | truefalse | “He’s getting on my nerves.” means “彼にはだんだんイライラしてきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-true-false-2 | truefalse | “He’s making me nervous.” means “寒くなってきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-typed-1 | translation | Translate into English: 寒くなってきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-typed-2 | translation | Translate into English: 催眠をかけられたことがありますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-typing | typing | Type the complete English sentence from memory: 誰かにウェブサイトを任せました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-order-1 | order | Put the words in order: 何かがおかしい気がします。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-order-2 | order | Put the words in order: 誰かいますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-grid | grid | Select the tile that means: 彼にはだんだんイライラしてきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-situation | situation | Which sentence would you use when you want to say: 誰かにウェブサイトを任せました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-25 | july-25-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-25 | july-25-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-25 | july-25-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-25 | july-25-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-26 | july-26-draft-choice-1 | mcq | Choose the English sentence that means: 来年マレーシアへ行けるといいな。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-2 | mcq | Choose the English sentence that means: 今マレーシアにいたらいいのに。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-3 | mcq | Choose the English sentence that means: もっと勉強しておけばよかった。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-4 | mcq | Choose the English sentence that means: そこで生まれていたらよかった。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-true-false-1 | truefalse | “I have already eaten breakfast.” means “もう朝食を食べました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-true-false-2 | truefalse | “I haven’t eaten dinner yet.” means “たった今家に着きました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-typed-1 | translation | Translate into English: たった今家に着きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-typed-2 | translation | Translate into English: 2016年からここに住んでいます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-typing | typing | Type the complete English sentence from memory: 昨夜はお風呂に入りませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-order-1 | order | Put the words in order: 彼が電話する前に夕食を終えていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-order-2 | order | Put the words in order: あなたが到着した時にはもう食べていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-grid | grid | Select the tile that means: もう朝食を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-situation | situation | Which sentence would you use when you want to say: 昨夜はお風呂に入りませんでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-26 | july-26-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-26 | july-26-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-26 | july-26-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-26 | july-26-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-27 | july-27-draft-choice-1 | mcq | Choose the English sentence that means: シャツにコーヒーをこぼしました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-2 | mcq | Choose the English sentence that means: 彼女はパスタにソースをかけました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-3 | mcq | Choose the English sentence that means: 彼は私に水をバシャッとかけました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-4 | mcq | Choose the English sentence that means: コーヒーは慣れると好きになる味です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-true-false-1 | truefalse | “This dessert has a sophisticated flavor.” means “このデザートは洗練された味です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-true-false-2 | truefalse | “He plays tennis every week.” means “去年マレーシアに行きました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-typed-1 | translation | Translate into English: 去年マレーシアに行きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-typed-2 | translation | Translate into English: マレーシアへ行ったことがあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-typing | typing | Type the complete English sentence from memory: 秘密をばらさないで。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-order-1 | order | Put the words in order: 彼が着く前に食べていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-order-2 | order | Put the words in order: 昔はここに住んでいました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-grid | grid | Select the tile that means: このデザートは洗練された味です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-situation | situation | Which sentence would you use when you want to say: 秘密をばらさないで。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-27 | july-27-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-27 | july-27-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-27 | july-27-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-27 | july-27-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + prior human QA | PASS |
| july-30-part-1 | july-30-part-1-draft-choice-1 | mcq | Choose the English sentence that means: 来年マレーシアを訪れられるといいです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-choice-2 | mcq | Choose the English sentence that means: すべてうまくいくといいですね。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-choice-3 | mcq | Choose the English sentence that means: 今マレーシアにいたらいいのに。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-choice-4 | mcq | Choose the English sentence that means: もっと自由な時間があればいいのに。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-true-false-1 | truefalse | “I wish I could speak English more confidently.” means “もっと自信を持って英語を話せたらいいのに。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-true-false-2 | truefalse | “I wish I had studied harder.” means “あなたと一緒に行けばよかった。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-typed-1 | translation | Translate into English: あなたと一緒に行けばよかった。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-typed-2 | translation | Translate into English: もっと早く彼女に電話すればよかった。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-typing | typing | Type the complete English sentence from memory: また会えるといいですね。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-order-1 | order | Put the words in order: あんなことを言わなければよかった。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-order-2 | order | Put the words in order: 早く元気になるといいですね。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-grid | grid | Select the tile that means: もっと自信を持って英語を話せたらいいのに。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-situation | situation | Which sentence would you use when you want to say: また会えるといいですね。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-1 | july-30-part-1-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-1 | july-30-part-1-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-1 | july-30-part-1-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-1 | july-30-part-1-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-1 | july-30-part-1-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-2 | july-30-part-2-draft-choice-1 | mcq | Choose the English sentence that means: 私はもう朝食を食べました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-choice-2 | mcq | Choose the English sentence that means: 私はまだ夕食を食べていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-choice-3 | mcq | Choose the English sentence that means: 私はたった今家に着きました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-choice-4 | mcq | Choose the English sentence that means: 私は2016年からここに住んでいます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-true-false-1 | truefalse | “I had already eaten when you arrived.” means “あなたが着いた時には、私はもう食べ終えていました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-true-false-2 | truefalse | “She had left before I called.” means “彼は正午までにレポートを終えていました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-typed-1 | translation | Translate into English: 彼は正午までにレポートを終えていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-typed-2 | translation | Translate into English: そこに住んでいた時、私は車を持っていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-typing | typing | Type the complete English sentence from memory: もう仕事を終えましたか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-order-1 | order | Put the words in order: 私は以前そこへ行ったことがありました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-order-2 | order | Put the words in order: そこで生まれていたらよかったのに。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-grid | grid | Select the tile that means: あなたが着いた時には、私はもう食べ終えていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-situation | situation | Which sentence would you use when you want to say: もう仕事を終えましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-30-part-2 | july-30-part-2-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-2 | july-30-part-2-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-2 | july-30-part-2-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-2 | july-30-part-2-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| july-30-part-2 | july-30-part-2-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-02 | august-02-draft-choice-1 | mcq | Choose the English sentence that means: 年齢を伺ってもよろしいですか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-choice-2 | mcq | Choose the English sentence that means: できれば言いたくありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-choice-3 | mcq | Choose the English sentence that means: 気を悪くさせていなければいいのですが。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-choice-4 | mcq | Choose the English sentence that means: あなたの私生活に立ち入りたくありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-true-false-1 | truefalse | “Let’s dig into the details.” means “詳しい内容を掘り下げましょう。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-true-false-2 | truefalse | “I can’t tell the twins apart.” means “私は後ろ姿で彼だと分かりました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-typed-1 | translation | Translate into English: 私は後ろ姿で彼だと分かりました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-typed-2 | translation | Translate into English: この写真の人物を特定できますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-typing | typing | Type the complete English sentence from memory: もう100回も言いました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-order-1 | order | Put the words in order: 雨にもかかわらず、私たちは出かけました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-order-2 | order | Put the words in order: 雨が降っていましたが、私たちは出かけました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-grid | grid | Select the tile that means: 詳しい内容を掘り下げましょう。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-situation | situation | Which sentence would you use when you want to say: もう100回も言いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-02 | august-02-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-02 | august-02-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-02 | august-02-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-02 | august-02-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-02 | august-02-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-03 | august-03-draft-choice-1 | mcq | Choose the English sentence that means: 私はまだお風呂に入っていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-choice-2 | mcq | Choose the English sentence that means: 私は昨夜お風呂に入りませんでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-choice-3 | mcq | Choose the English sentence that means: もうシャワーを浴びましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-choice-4 | mcq | Choose the English sentence that means: 私はそれを一度も試したことがありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-true-false-1 | truefalse | “I tried it yesterday.” means “私は昨日それを試しました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-true-false-2 | truefalse | “Coffee can be an acquired taste.” means “それは洗練された味わいです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-typed-1 | translation | Translate into English: それは洗練された味わいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-typed-2 | translation | Translate into English: この味は大人により人気があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-typing | typing | Type the complete English sentence from memory: 彼は毎週末テニスをします。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-order-1 | order | Put the words in order: 私はもう昼食を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-order-2 | order | Put the words in order: 私はまだ決めていません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-grid | grid | Select the tile that means: 私は昨日それを試しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-situation | situation | Which sentence would you use when you want to say: 彼は毎週末テニスをします。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-03 | august-03-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-03 | august-03-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-03 | august-03-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-03 | august-03-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-03 | august-03-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-09 | august-09-draft-choice-1 | mcq | Choose the English sentence that means: 彼女は映画の途中で一筋の涙を流しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-choice-2 | mcq | Choose the English sentence that means: 彼は突然泣き出しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-choice-3 | mcq | Choose the English sentence that means: その話を聞いて涙がこみ上げました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-choice-4 | mcq | Choose the English sentence that means: コップ一杯の水が必要です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-true-false-1 | truefalse | “Could I have two coffees, please?” means “コーヒーを2杯いただけますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-true-false-2 | truefalse | “We ordered a whole chicken.” means “私は昼食に鶏肉を食べました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-typed-1 | translation | Translate into English: 私は昼食に鶏肉を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-typed-2 | translation | Translate into English: ケーキを一切れいかがですか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-typing | typing | Type the complete English sentence from memory: この建物には3つの層があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-order-1 | order | Put the words in order: スープの中に髪の毛が一本あります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-order-2 | order | Put the words in order: 私はテーブルに水をこぼしました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-grid | grid | Select the tile that means: コーヒーを2杯いただけますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-situation | situation | Which sentence would you use when you want to say: この建物には3つの層があります。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-09 | august-09-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-09 | august-09-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-09 | august-09-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-09 | august-09-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-09 | august-09-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-1 | august-10-part-1-draft-choice-1 | mcq | Choose the English sentence that means: 牛乳を冷蔵庫に入れてください。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-choice-2 | mcq | Choose the English sentence that means: アイスクリームは冷凍庫にあります。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-choice-3 | mcq | Choose the English sentence that means: 冷蔵庫が動いていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-choice-4 | mcq | Choose the English sentence that means: あなたの声がはっきり聞こえませんでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-true-false-1 | truefalse | “I didn’t hear the doorbell.” means “私はドアベルの音に気づきませんでした。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-true-false-2 | truefalse | “I can’t hear anything.” means “もう一度言っていただけますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-typed-1 | translation | Translate into English: もう一度言っていただけますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-typed-2 | translation | Translate into English: 回線が何度も途切れます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-typing | typing | Type the complete English sentence from memory: もう少しゆっくり話していただけますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-order-1 | order | Put the words in order: 声が途切れ途切れです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-order-2 | order | Put the words in order: 今は私の声が聞こえますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-grid | grid | Select the tile that means: 私はドアベルの音に気づきませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-situation | situation | Which sentence would you use when you want to say: もう少しゆっくり話していただけますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-1 | august-10-part-1-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-1 | august-10-part-1-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-1 | august-10-part-1-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-1 | august-10-part-1-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-1 | august-10-part-1-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-2 | august-10-part-2-draft-choice-1 | mcq | Choose the English sentence that means: このコーヒーは私には濃すぎます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-choice-2 | mcq | Choose the English sentence that means: 私はまろやかなコーヒーの方が好きです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-choice-3 | mcq | Choose the English sentence that means: 少し苦い味がします。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-choice-4 | mcq | Choose the English sentence that means: このブレンドは口当たりがよく、コクがあります。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-true-false-1 | truefalse | “I like bold coffee in the morning.” means “朝は力強い味のコーヒーが好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-true-false-2 | truefalse | “This roast tastes light and slightly acidic.” means “まだどこへ行くか決めていません。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-typed-1 | translation | Translate into English: まだどこへ行くか決めていません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-typed-2 | translation | Translate into English: フィリピンへ行くのは初めてになります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-typing | typing | Type the complete English sentence from memory: 決めたら、航空券を予約します。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-order-1 | order | Put the words in order: 私はフィリピンへ行ったことがありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-order-2 | order | Put the words in order: いつかセブを訪れたいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-grid | grid | Select the tile that means: 朝は力強い味のコーヒーが好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-situation | situation | Which sentence would you use when you want to say: 決めたら、航空券を予約します。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-10-part-2 | august-10-part-2-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-2 | august-10-part-2-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-2 | august-10-part-2-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-2 | august-10-part-2-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-10-part-2 | august-10-part-2-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-1 | august-16-part-1-draft-choice-1 | mcq | Choose the English sentence that means: 彼は私に断らず勝手にパソコンを使いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-choice-2 | mcq | Choose the English sentence that means: 彼女は自分の判断で決めました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-choice-3 | mcq | Choose the English sentence that means: 勝手に私の食べ物を取らないでください。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-choice-4 | mcq | Choose the English sentence that means: 今週末にバーベキューをします。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-true-false-1 | truefalse | “Could you do the dishes?” means “食器を洗ってもらえますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-true-false-2 | truefalse | “I need to do some shopping.” means “彼女は素晴らしい仕事をしました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-typed-1 | translation | Translate into English: 彼女は素晴らしい仕事をしました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-typed-2 | translation | Translate into English: 私は終電に間に合いました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-typing | typing | Type the complete English sentence from memory: 無事に家に着きましたか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-order-1 | order | Put the words in order: 私は風邪をひきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-order-2 | order | Put the words in order: 今朝あなたのメールを受け取りました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-grid | grid | Select the tile that means: 食器を洗ってもらえますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-situation | situation | Which sentence would you use when you want to say: 無事に家に着きましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-1 | august-16-part-1-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-1 | august-16-part-1-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-1 | august-16-part-1-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-1 | august-16-part-1-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-1 | august-16-part-1-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-2 | august-16-part-2-draft-choice-1 | mcq | Choose the English sentence that means: 少し体重が増えました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-choice-2 | mcq | Choose the English sentence that means: 体重を減らそうとしています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-choice-3 | mcq | Choose the English sentence that means: その会社は急速に成長しています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-choice-4 | mcq | Choose the English sentence that means: 彼らは予算を増やしました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-true-false-1 | truefalse | “We need to cut the budget.” means “予算を削減する必要があります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-true-false-2 | truefalse | “It’s hard to concentrate here.” means “講座の後に修了証を受け取りました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-typed-1 | translation | Translate into English: 講座の後に修了証を受け取りました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-typed-2 | translation | Translate into English: 私は結果に満足しています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-typing | typing | Type the complete English sentence from memory: 彼の声がほとんど聞こえませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-order-1 | order | Put the words in order: 騒音であなたの声が聞こえません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-order-2 | order | Put the words in order: 激しく雨が降っています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-grid | grid | Select the tile that means: 予算を削減する必要があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-situation | situation | Which sentence would you use when you want to say: 彼の声がほとんど聞こえませんでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-16-part-2 | august-16-part-2-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-2 | august-16-part-2-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-2 | august-16-part-2-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-2 | august-16-part-2-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-16-part-2 | august-16-part-2-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-1 | august-17-part-1-draft-choice-1 | mcq | Choose the English sentence that means: 今朝からずっと頭が痛いです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-choice-2 | mcq | Choose the English sentence that means: 一日中ずっと疲れを感じています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-choice-3 | mcq | Choose the English sentence that means: どのくらい頭痛が続いていますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-choice-4 | mcq | Choose the English sentence that means: 7時からずっと勉強しています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-true-false-1 | truefalse | “I’ve been studying for two hours.” means “2時間ずっと勉強しています。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-true-false-2 | truefalse | “I walk to work every day.” means “これは日常的な問題です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-typed-1 | translation | Translate into English: これは日常的な問題です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-typed-2 | translation | Translate into English: 昼食は何を食べますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-typing | typing | Type the complete English sentence from memory: 新しい予定にだんだん慣れてきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-order-1 | order | Put the words in order: 麺を食べようかと考えています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-order-2 | order | Put the words in order: 以前は朝食を抜いていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-grid | grid | Select the tile that means: 2時間ずっと勉強しています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-situation | situation | Which sentence would you use when you want to say: 新しい予定にだんだん慣れてきました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-1 | august-17-part-1-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-1 | august-17-part-1-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-1 | august-17-part-1-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-1 | august-17-part-1-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-1 | august-17-part-1-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-2 | august-17-part-2-draft-choice-1 | mcq | Choose the English sentence that means: 彼女はノースリーブのシャツを着ています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-choice-2 | mcq | Choose the English sentence that means: これは誰の鞄ですか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-choice-3 | mcq | Choose the English sentence that means: これは誰のものですか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-choice-4 | mcq | Choose the English sentence that means: その本は英語で書かれました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-true-false-1 | truefalse | “The entire room was silent.” means “部屋全体が静かでした。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-true-false-2 | truefalse | “I entirely agree with you.” means “私はレポートを最初から最後まで読みました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-typed-1 | translation | Translate into English: 私はレポートを最初から最後まで読みました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-typed-2 | translation | Translate into English: 私の冗談は全く受けませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-typing | typing | Type the complete English sentence from memory: その言葉は強すぎる印象になることがあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-order-1 | order | Put the words in order: その公演は大失敗でした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-order-2 | order | Put the words in order: 彼ははげ始めています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-grid | grid | Select the tile that means: 部屋全体が静かでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-situation | situation | Which sentence would you use when you want to say: その言葉は強すぎる印象になることがあります。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-17-part-2 | august-17-part-2-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-2 | august-17-part-2-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-2 | august-17-part-2-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-2 | august-17-part-2-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-17-part-2 | august-17-part-2-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-23 | august-23-draft-choice-1 | mcq | Choose the English sentence that means: 今日はお疲れさまでした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-choice-2 | mcq | Choose the English sentence that means: 対応してくれてありがとうございます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-choice-3 | mcq | Choose the English sentence that means: よい夜をお過ごしください。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-choice-4 | mcq | Choose the English sentence that means: その店は何時に開店しますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-true-false-1 | truefalse | “What time will the event start?” means “そのイベントは何時に始まりますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-true-false-2 | truefalse | “I’m confused by these instructions.” means “この説明は分かりにくいです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-typed-1 | translation | Translate into English: この説明は分かりにくいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-typed-2 | translation | Translate into English: 少し行き違いがあるようです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-typing | typing | Type the complete English sentence from memory: お酒に弱いので、あまり飲みません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-order-1 | order | Put the words in order: そのメッセージは怪しく見えます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-order-2 | order | Put the words in order: 何か違和感があります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-grid | grid | Select the tile that means: そのイベントは何時に始まりますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-situation | situation | Which sentence would you use when you want to say: お酒に弱いので、あまり飲みません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-23 | august-23-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-23 | august-23-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-23 | august-23-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-23 | august-23-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-23 | august-23-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-24 | august-24-draft-choice-1 | mcq | Choose the English sentence that means: 餃子は日本式のダンプリングです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-choice-2 | mcq | Choose the English sentence that means: 焼売は通常、蒸して作ります。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-choice-3 | mcq | Choose the English sentence that means: このダンプリングには豚肉が入っています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-choice-4 | mcq | Choose the English sentence that means: 餃子をカリッとするまで焼きました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-true-false-1 | truefalse | “We both like gyoza.” means “私たちは二人とも餃子が好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-true-false-2 | truefalse | “We are both hungry.” means “どちらの料理もおいしそうです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-typed-1 | translation | Translate into English: どちらの料理もおいしそうです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-typed-2 | translation | Translate into English: 彼は家にいないに違いありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-typing | typing | Type the complete English sentence from memory: 今日は少し体調がよくありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-order-1 | order | Put the words in order: これに触れてはいけません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-order-2 | order | Put the words in order: 私が何を食べたか知っていますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-grid | grid | Select the tile that means: 私たちは二人とも餃子が好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-situation | situation | Which sentence would you use when you want to say: 今日は少し体調がよくありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-24 | august-24-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-24 | august-24-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-24 | august-24-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-24 | august-24-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-24 | august-24-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-25 | august-25-draft-choice-1 | mcq | Choose the English sentence that means: ただいま！ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-choice-2 | mcq | Choose the English sentence that means: 戻りました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-choice-3 | mcq | Choose the English sentence that means: おかえりなさい！ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-choice-4 | mcq | Choose the English sentence that means: お戻りなさい！ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-true-false-1 | truefalse | “I’m off.” means “行ってきます。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-true-false-2 | truefalse | “I’m heading out now.” means “仕事へ向かっています。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-typed-1 | translation | Translate into English: 仕事へ向かっています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-typed-2 | translation | Translate into English: よい一日を！ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-typing | typing | Type the complete English sentence from memory: かわいそうな犬が外に置き去りにされました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-order-1 | order | Put the words in order: 気をつけてね！ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-order-2 | order | Put the words in order: 楽しんできてね！ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-grid | grid | Select the tile that means: 行ってきます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-listen-choice-1 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-listen-choice-2 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-listen-choice-3 | listenChoice | Listen and choose the sentence. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-dictation-1 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-dictation-2 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-dictation-3 | listenType | Type the complete sentence you hear. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-speaking-1 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-speaking-2 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-speaking-3 | speaking | Listen, then speak. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-speaking-4 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-speaking-5 | speaking | Say the sentence naturally, then try it once without looking. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-dialogue | dialogue | Choose the most natural next line. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-mistake | mistake | Correct the sentence. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-situation | situation | Which sentence would you use when you want to say: かわいそうな犬が外に置き去りにされました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| august-25 | august-25-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-25 | august-25-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-25 | august-25-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-25 | august-25-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |
| august-25 | august-25-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | storyboard manifest + file | PASS |

## Failures

- None.
