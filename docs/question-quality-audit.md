# Question quality audit

Generated: 2026-08-03T13:20:39.247Z

## Scope and method

- Audited all 17 lessons and 562 activities one by one with format-specific integrity checks.
- Every activity was checked for bilingual prompt, hint, and explanation; answer completeness; unique choice text; exactly one keyed choice where applicable; and required audio/speaking/order/matching/sorting fields.
- Every visual activity was also checked that its keyed English/Japanese answer equals the lesson phrase selected by the manifest and that both explanations explicitly identify that model answer.
- Audited all 55 visual questions against the manifest and file inventory; the visual QA record confirms human inspection of every WebP scene.
- This report distinguishes programmatic whole-corpus checks from the human image review; it does not label an unchecked item as complete.

## Corrections made in this audit

- 31 legacy typing activities had only a Japanese prompt. Added an explicit English instruction and retained the Japanese target: july-04-original-q24, july-04-original-q25, july-04-original-q26, july-04-original-q27, july-05-original-q20, july-05-original-q21, july-05-original-q22, july-05-original-q23, july-05-original-q24, july-06-original-q28, july-06-original-q29, july-06-original-q30, july-06-original-q31, july-06-original-q32, july-06-original-q33, july-06-original-q34, june-28-original-q17a, june-28-original-q17b, june-28-original-q17c, june-28-original-q17d, june-28-original-q17e, june-29-original-q12a, june-29-original-q12b, june-29-original-q12c, june-29-original-q12d, june-30-original-q17, june-30-original-q18, june-30-original-q19, june-30-original-q20, june-30-original-q21, june-30-original-q22.
- 7 legacy matching activities lacked a learning explanation. Added a bilingual explanation of one-to-one whole-meaning matching: july-04-original-q23, july-05-original-q9, july-06-original-q11, july-06-original-q25, june-28-original-q16, june-29-original-q11, june-30-original-q16.
- Replaced generic generated hints/explanations across all 419 generated activities (78 legacy additions + 341 expanded activities) with format-specific bilingual guidance that states the model answer and why it fits.
- Corrected 6 potentially ambiguous visual choice sets by selecting semantically distinct distractors: july-19-draft-visual-3, july-22-draft-visual-5, july-25-draft-visual-1, july-25-draft-visual-4, july-26-draft-visual-1, july-26-draft-visual-5.
- Corrected the image mismatch documented in scripts/visual-human-qa.json: july-25-draft-visual-4 — Replaced the illustration with one that shows repeated calls from the same identifiable male contact and the learner's frustration.
- Changed runtime behavior so each new practice run shuffles both question order and choice order automatically; a resumed run retains its saved order.

## Lesson summary

| Lesson | Activities | Format inventory | Result |
|---|---:|---|---|
| july-04 | 40 | dialogue:1, listenChoice:2, listenType:2, matching:2, mcq:12, order:4, situation:8, sorting:1, speaking:2, translation:1, truefalse:1, typing:4 | PASS |
| july-05 | 37 | dialogue:1, listenChoice:2, listenType:2, matching:2, mcq:9, order:4, situation:7, sorting:1, speaking:2, translation:1, truefalse:1, typing:5 | PASS |
| july-06 | 47 | dialogue:1, listenChoice:2, listenType:2, matching:3, mcq:12, order:6, situation:9, sorting:1, speaking:2, translation:1, truefalse:1, typing:7 | PASS |
| june-28 | 34 | dialogue:1, listenChoice:2, listenType:2, matching:2, mcq:8, order:1, situation:8, sorting:1, speaking:2, translation:1, truefalse:1, typing:5 | PASS |
| june-29 | 28 | dialogue:1, grid:1, listenChoice:2, listenType:2, matching:2, mcq:7, order:1, situation:3, sorting:1, speaking:2, translation:1, truefalse:1, typing:4 | PASS |
| june-30 | 35 | dialogue:1, listenChoice:2, listenType:2, matching:2, mcq:7, order:4, situation:6, sorting:1, speaking:2, translation:1, truefalse:1, typing:6 | PASS |
| july-07 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-11 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-12 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-13 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-18 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-19 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-22 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-23 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-25 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-26 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |
| july-27 | 31 | dialogue:1, listenChoice:3, listenType:3, matching:1, mcq:4, mistake:1, order:2, situation:6, sorting:1, speaking:5, translation:2, truefalse:2 | PASS |

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
| july-04 | july-04-extra-true-false | truefalse | “Don’t mention it.” means “どういたしまして。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-order | order | Put the words in order: あとで雨が降るかもしれません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-translation | translation | Translate into English: 急な事情ができました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-04 | july-04-extra-situation | situation | Which sentence best expresses this meaning: 仕方ありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-05 | july-05-extra-true-false | truefalse | “I changed my mind.” means “考えが変わりました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-order | order | Put the words in order: どちらの選択肢でも大丈夫です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-translation | translation | Translate into English: 天気によります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-05 | july-05-extra-situation | situation | Which sentence best expresses this meaning: まだ分かりません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-06 | july-06-extra-true-false | truefalse | “I’ll check and let you know.” means “確認してお知らせします。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-order | order | Put the words in order: そこが難しいと感じる部分です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-translation | translation | Translate into English: だんだん慣れてきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-06 | july-06-extra-situation | situation | Which sentence best expresses this meaning: それは今まで試したことがありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
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
| june-28 | june-28-extra-true-false | truefalse | “That sounds good.” means “それはよさそうですね。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-order | order | Put the words in order: ほかに何かいかがですか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-translation | translation | Translate into English: 何を注文しましたか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-28 | june-28-extra-situation | situation | Which sentence best expresses this meaning: 仕方ありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
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
| june-29 | june-29-extra-true-false | truefalse | “The button is in the bottom-left corner.” means “ボタンは左下にあります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-order | order | Put the words in order: 彼女が言ったことが聞こえませんでした。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-translation | translation | Translate into English: それがはっきり聞こえました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-29 | june-29-extra-situation | situation | Which sentence best expresses this meaning: その通り。それが私の言いたいことです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
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
| june-30 | june-30-extra-true-false | truefalse | “The second half was exciting.” means “後半はわくわくしました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-order | order | Put the words in order: 何もうまくいかず、もどかしかったです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-matching | matching | Match each English phrase with its natural Japanese meaning. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-sorting | sorting | Sort each phrase by its language purpose. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-dialogue | dialogue | Choose the most natural next line in the conversation. | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-translation | translation | Translate into English: 軽い味なので紅茶の方が好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| june-30 | june-30-extra-situation | situation | Which sentence best expresses this meaning: 誰が勝つと思いますか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-1 | mcq | Choose the English sentence that means: ノートを持ってきました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-2 | mcq | Choose the English sentence that means: 新しいノートを買いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-3 | mcq | Choose the English sentence that means: あなたは私にそうするよう言いました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-choice-4 | mcq | Choose the English sentence that means: 携帯の充電が切れました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-true-false-1 | truefalse | “Where will she come from?” means “彼女はどこから来ますか？”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-true-false-2 | truefalse | “I got a flat tire.” means “料理が得意です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-typed-1 | translation | Translate into English: 料理が得意です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-typed-2 | translation | Translate into English: 彼女が私の代理で署名しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-order-1 | order | Put the words in order: 私のためにしてもらえますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-order-2 | order | Put the words in order: 彼が私の代わりに出席しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-07 | july-07-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-07 | july-07-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-07 | july-07-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-07 | july-07-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-07 | july-07-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-07 | july-07-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-11 | july-11-draft-choice-1 | mcq | Choose the English sentence that means: 携帯はWi-Fiにつながっています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-2 | mcq | Choose the English sentence that means: ケーブルを接続しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-3 | mcq | Choose the English sentence that means: その番組は生放送されます。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-choice-4 | mcq | Choose the English sentence that means: ライブ配信を見ました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-true-false-1 | truefalse | “I went back to my hometown.” means “地元に帰りました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-true-false-2 | truefalse | “I’m staying at my parents’ house.” means “変な音に気づきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-typed-1 | translation | Translate into English: 変な音に気づきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-typed-2 | translation | Translate into English: 違う鍵を持っていると気づきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-order-1 | order | Put the words in order: 人は話す時に近くに立つことがあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-order-2 | order | Put the words in order: 昨日そのパソコンは接続されていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-11 | july-11-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-11 | july-11-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-11 | july-11-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-11 | july-11-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-11 | july-11-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-11 | july-11-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-12 | july-12-draft-choice-1 | mcq | Choose the English sentence that means: まだお酒を飲んでいません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-2 | mcq | Choose the English sentence that means: もう昼食を食べましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-3 | mcq | Choose the English sentence that means: 正午に昼食を食べました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-choice-4 | mcq | Choose the English sentence that means: 私はお酒を飲みません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-true-false-1 | truefalse | “I didn’t drink yesterday.” means “昨日は飲みませんでした。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-true-false-2 | truefalse | “I haven’t eaten anything today.” means “彼女はもう朝食を食べました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-typed-1 | translation | Translate into English: 彼女はもう朝食を食べました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-typed-2 | translation | Translate into English: まだ決めていません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-order-1 | order | Put the words in order: マレーシア料理を食べたことがありますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-order-2 | order | Put the words in order: この鞄を何年も持っています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-12 | july-12-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-12 | july-12-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-12 | july-12-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-12 | july-12-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-12 | july-12-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-12 | july-12-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-13 | july-13-draft-choice-1 | mcq | Choose the English sentence that means: この時間帯に誰かが電話するかもしれません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-2 | mcq | Choose the English sentence that means: この時間には普段誰も電話しません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-3 | mcq | Choose the English sentence that means: 電波が弱いです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-choice-4 | mcq | Choose the English sentence that means: Wi-Fi接続が不安定です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-true-false-1 | truefalse | “I need to rush back.” means “急いで戻る必要があります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-true-false-2 | truefalse | “That’s unusual.” means “この店にはティラミスがありませんが、あちらにはあります。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-typed-1 | translation | Translate into English: この店にはティラミスがありませんが、あちらにはあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-typed-2 | translation | Translate into English: 一週間が早く過ぎました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-order-1 | order | Put the words in order: 通りは人でいっぱいです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-order-2 | order | Put the words in order: 週の初めは長く感じます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-13 | july-13-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-13 | july-13-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-13 | july-13-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-13 | july-13-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-13 | july-13-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-13 | july-13-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-18 | july-18-draft-choice-1 | mcq | Choose the English sentence that means: そのクラスに参加する予定でした。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-2 | mcq | Choose the English sentence that means: 彼女は猫を飼っています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-3 | mcq | Choose the English sentence that means: 彼女は猫を飼っていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-choice-4 | mcq | Choose the English sentence that means: 彼女はまだ食べていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-true-false-1 | truefalse | “I do like this song.” means “この歌は本当に好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-true-false-2 | truefalse | “The pot was on the stove.” means “鍋に火がつきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-typed-1 | translation | Translate into English: 鍋に火がつきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-typed-2 | translation | Translate into English: 家が燃えています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-order-1 | order | Put the words in order: 彼は今日は絶好調です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-order-2 | order | Put the words in order: 運転免許を持っています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-18 | july-18-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-18 | july-18-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-18 | july-18-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-18 | july-18-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-18 | july-18-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-18 | july-18-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-19 | july-19-draft-choice-1 | mcq | Choose the English sentence that means: 紅茶もコーヒーも両方好きです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-2 | mcq | Choose the English sentence that means: どちらの日でも大丈夫です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-3 | mcq | Choose the English sentence that means: どちらの選択肢も好きではありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-choice-4 | mcq | Choose the English sentence that means: どちらも好きではありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-true-false-1 | truefalse | “I’d rather stay home than go out.” means “外出するより家にいたいです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-true-false-2 | truefalse | “I’d rather not talk about it.” means “それは爆笑するほど面白かったです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-typed-1 | translation | Translate into English: それは爆笑するほど面白かったです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-typed-2 | translation | Translate into English: その冗談で爆笑しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-order-1 | order | Put the words in order: 昔の友人に偶然会いました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-order-2 | order | Put the words in order: 仕事へ向かっている途中です。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-19 | july-19-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-19 | july-19-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-19 | july-19-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-19 | july-19-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-19 | july-19-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-19 | july-19-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-22 | july-22-draft-choice-1 | mcq | Choose the English sentence that means: 8月4日午前10時はご都合いかがですか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-2 | mcq | Choose the English sentence that means: 皆さん、準備はできましたか？ | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-3 | mcq | Choose the English sentence that means: 両方好きです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-choice-4 | mcq | Choose the English sentence that means: どちらでも大丈夫です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-true-false-1 | truefalse | “Neither is okay.” means “どちらも駄目です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-true-false-2 | truefalse | “I prefer cucumber to eggplant.” means “はい、焼肉が好きです。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-typed-1 | translation | Translate into English: はい、焼肉が好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-typed-2 | translation | Translate into English: いいえ、好きではありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-order-1 | order | Put the words in order: その通りです。好きではありません。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-order-2 | order | Put the words in order: 実は本当に好きです。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-22 | july-22-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-22 | july-22-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-22 | july-22-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-22 | july-22-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-22 | july-22-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-22 | july-22-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-23 | july-23-draft-choice-1 | mcq | Choose the English sentence that means: まだ一つも思いついていません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-2 | mcq | Choose the English sentence that means: 少し体調がよくありません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-3 | mcq | Choose the English sentence that means: 暑すぎて外に出られません。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-choice-4 | mcq | Choose the English sentence that means: たった今昼食を注文しました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-true-false-1 | truefalse | “A car suddenly appeared.” means “車が突然現れました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-true-false-2 | truefalse | “It fell on the floor.” means “それは床に落ちています。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-typed-1 | translation | Translate into English: それは床に落ちています。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-typed-2 | translation | Translate into English: それを床に置きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-order-1 | order | Put the words in order: たった今家に着きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-order-2 | order | Put the words in order: 親子丼を注文しました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-23 | july-23-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-23 | july-23-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-23 | july-23-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-23 | july-23-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-23 | july-23-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-23 | july-23-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-25 | july-25-draft-choice-1 | mcq | Choose the English sentence that means: お腹が空いてきました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-2 | mcq | Choose the English sentence that means: もう腹ペコです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-3 | mcq | Choose the English sentence that means: その音にイライラしています。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-choice-4 | mcq | Choose the English sentence that means: 何もうまくいかず、もどかしいです。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-true-false-1 | truefalse | “He’s getting on my nerves.” means “彼にはだんだんイライラしてきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-true-false-2 | truefalse | “He’s making me nervous.” means “寒くなってきました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-typed-1 | translation | Translate into English: 寒くなってきました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-typed-2 | translation | Translate into English: 催眠をかけられたことがありますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-order-1 | order | Put the words in order: 何かがおかしい気がします。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-order-2 | order | Put the words in order: 誰かいますか？ | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-25 | july-25-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-25 | july-25-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-25 | july-25-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-25 | july-25-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-25 | july-25-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-25 | july-25-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-26 | july-26-draft-choice-1 | mcq | Choose the English sentence that means: 来年マレーシアへ行けるといいな。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-2 | mcq | Choose the English sentence that means: 今マレーシアにいたらいいのに。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-3 | mcq | Choose the English sentence that means: もっと勉強しておけばよかった。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-choice-4 | mcq | Choose the English sentence that means: そこで生まれていたらよかった。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-true-false-1 | truefalse | “I have already eaten breakfast.” means “もう朝食を食べました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-true-false-2 | truefalse | “I haven’t eaten dinner yet.” means “たった今家に着きました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-typed-1 | translation | Translate into English: たった今家に着きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-typed-2 | translation | Translate into English: 2016年からここに住んでいます。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-order-1 | order | Put the words in order: 彼が電話する前に夕食を終えていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-order-2 | order | Put the words in order: あなたが到着した時にはもう食べていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-26 | july-26-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-26 | july-26-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-26 | july-26-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-26 | july-26-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-26 | july-26-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-26 | july-26-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-27 | july-27-draft-choice-1 | mcq | Choose the English sentence that means: シャツにコーヒーをこぼしました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-2 | mcq | Choose the English sentence that means: 彼女はパスタにソースをかけました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-3 | mcq | Choose the English sentence that means: 彼は私に水をバシャッとかけました。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-choice-4 | mcq | Choose the English sentence that means: コーヒーは慣れると好きになる味です。 | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-true-false-1 | truefalse | “This dessert has a sophisticated flavor.” means “このデザートは洗練された味です。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-true-false-2 | truefalse | “He plays tennis every week.” means “去年マレーシアに行きました。”. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-typed-1 | translation | Translate into English: 去年マレーシアに行きました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-typed-2 | translation | Translate into English: マレーシアへ行ったことがあります。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-order-1 | order | Put the words in order: 彼が着く前に食べていました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-order-2 | order | Put the words in order: 昔はここに住んでいました。 | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-matching | matching | Match the English and Japanese. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
| july-27 | july-27-draft-sorting | sorting | Sort the phrases by topic. | format answer valid | EN/JP prompt + hint + explanation | not required | PASS |
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
| july-27 | july-27-draft-visual-1 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-27 | july-27-draft-visual-2 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-27 | july-27-draft-visual-3 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-27 | july-27-draft-visual-4 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |
| july-27 | july-27-draft-visual-5 | situation | Which sentence best matches the illustration? | one keyed choice; distractors unique | EN/JP prompt + hint + explanation | manifest + file + human QA | PASS |

## Failures

- None.

