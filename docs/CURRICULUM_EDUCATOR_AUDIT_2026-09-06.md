# Tahmid English Curriculum Level 1–32 — educator review

Reviewed against the existing v10 source at `8537cb53129e6c5743b19d977332bb5c6b9cf152`. This continues the existing curriculum and preserves every item ID and level assignment.

## Coverage and result

| Strand | Items reviewed | Editorially revised | Retained after review |
|---|---:|---:|---:|
| Words | 320 | 99 | 221 |
| Phrases | 128 | 21 | 107 |
| Phonics | 32 | 32 | 0 |
| Total | 480 | 152 | 328 |

The complete item-by-item record is [`curriculum/educator-audit.json`](../curriculum/educator-audit.json). It contains a decision for all 480 IDs and the exact previous/current values of every changed editorial field. Image metadata is deliberately recorded in the separate visual map and asset licence ledger. `node scripts/audit-curriculum-editorial.mjs` recreates the editorial record against the pinned v10 baseline.

The review covered everyday usefulness, grammar burden, naturalness, Japanese meaning, collocations, common learner mistakes, US/UK pronunciation variation, progression, repeated learning purposes, and continuity with saved learner progress. Frequency is an educator's judgement of usefulness in the topic and situation; no invented corpus frequency scores or certified CEFR equivalences are presented.

## Progression decisions

The levels are short, teacher-guided steps. Words, Phrases, and Phonics develop related but separate skills: a useful spoken phrase can appear before every word in it has its own word card. For example, “I'm hungry” is immediately useful in Phrase Level 1, while Word Level 9 develops a larger set of feelings and needs. Examples in early phonics are listening and imitation models; this is not presented as a fully decodable reading programme in which every sentence contains only previously taught graphemes.

The broad sequence is:

- Levels 1–8: name familiar things, take part in a lesson, use short needs/requests, and connect basic consonants and short vowels to words.
- Levels 9–16: describe feelings and routines, get around, solve everyday problems, and keep consonant clusters/digraphs clear.
- Levels 17–24: explain study/work needs, handle services and technology, ask precise follow-up questions, and distinguish common long-vowel spellings.
- Levels 25–32: discuss causes, evidence, uncertainty, compromise, and reflection; use precise collocations and clause patterns; connect spelling with pronunciation, stress, and connected speech.

Late levels retain some familiar headwords intentionally but now require more precise use. For example, Level 29 does not stop at recognising “passport” or “platform”: it practises renewing a passport before booking, a last-minute platform change, reporting missing luggage, and distinguishing an airport transfer from a connecting flight. Level 17 uses school words to discuss putting work off, keeping track of vocabulary, asking a follow-up question, and choosing an improvement goal. Moving these established IDs would alter existing learner access and review history without enough educational benefit.

The 96 bilingual can-do goals in [`curriculum/level-goals.json`](../curriculum/level-goals.json) give every category/level a concrete learning purpose. The forward content release places these goals in the existing level descriptions, so they can be shown by the Learning Library and Teacher Studio.

## Representative before/after improvements

| Item | Before | After | Educational reason |
|---|---|---|---|
| L1 student | “Every student has a notebook.” | “I'm a student.” | Reduce beginner grammar and vocabulary burden. |
| L1 pen | “May I use your pen?” | “I have a pen.” | Make the first word model independently manageable. |
| L4 hand | “Raise your hand if you know.” | “Raise your hand.” | Teach a usable action without a conditional clause. |
| L8 open / close | Multiple Japanese senses on the primary card | 開ける / 閉める; the other sense remains in the usage note | Match the main audio and visual to one intended sense. |
| L9 hungry | “pronounce ng as one sound” | Explain the /ŋɡ/ sequence in /ˈhʌŋɡri/ | Correct a sound-sequence error. |
| L9 tired | “Usually one smooth syllable” without a variety distinction | Distinguish common US /taɪrd/ from UK /aɪə/ movement | Avoid correcting a valid UK model as wrong. |
| L13 pants | Plural-form note only | Explain US trousers / common UK underwear distinction | Address an important Japanese-learner and US/UK false friend. |
| L15 carry | Blanket prohibition on “bring” away from the speaker | Explain carrying versus directional bring/take | Remove an overbroad rule; movement perspective depends on context. |
| L16 invite | Prohibit “invite … for an event” generally | Give “invite … to a party”; allow to/for dinner | Teach natural collocations without banning a standard variant. |
| L18 colleague | Hint omitted the final consonant | Finish with /ɡ/ after /iː/ | Keep the actual word ending clear. |
| L25 reduce | “Reduce is transitive” as an absolute rule | Teach “reduce water use” and “reduce by ten percent” | Focus on productive patterns instead of an inaccurate blanket restriction. |
| L29 arrival | “arrival hall” | “arrivals hall” in the usage note and an estimated arrival time in the example | Use an everyday travel collocation and a more useful context. |
| L29 transfer | “a short transfer in Seoul” | An airport transfer taking longer than expected causes a missed connection | Clarify the transport/connection distinction. |
| L17 phrase 1 | “In my opinion, it's worth trying.” | “I think it's worth a try.” | A natural everyday opinion with a useful noun collocation. |
| L19 confirmation dialogue | “by noon” paraphrased as “before lunch” | “by twelve” | Check the exact deadline instead of introducing a different time. |
| L20 running behind | Claimed “running late” means a definite late arrival | Acknowledge both as natural for being behind schedule | Remove a false distinction between common expressions. |
| L25 agree to disagree | General friendly end to discussion | Specify topics where a single joint decision is unnecessary | Teach appropriate social use rather than an all-purpose conflict solution. |
| L30 retrospective phrase | A future-looking question paired with a past counterfactual answer | Both turns discuss alternative past choices | Align grammar and dialogue meaning. |

The exact full list is in the machine-readable item audit. Most retained material was already serviceable; it was not replaced merely to increase the change count.

## Phonics review of all 32 levels

Every lesson now has an `audioFocus` and `contrastPairs` teaching sequence. The voice module uses pronounceable examples and a short practice sentence instead of submitting IPA or the lesson heading as the target sound. The audio workstream verifies the real payloads and voice identity separately; this editorial review is not a claim that every acoustic output has been heard.

Material corrections include:

- Level 4 introduces l/r explicitly instead of jumping into l/r blends without teaching the contrast.
- Level 11 `/cl/` becomes `/kl/`; Level 12 `/cr/` becomes `/kr/`. The former values were spelling inside IPA slashes.
- Level 10 no longer instructs learners to stretch stop consonants; it describes connecting sounds without an extra vowel.
- Levels 17–20 describe common silent-e patterns while acknowledging exceptions, rather than treating the pattern as universal.
- Levels 19 and 23 identify both common US and UK long-o models.
- Level 22 replaces isolated `read` with `leaf`, avoiding present/past ambiguity in synthesis.
- Level 19 replaces isolated `close` with `bone`, avoiding verb/adjective ambiguity in synthesis.
- Level 24 replaces `room` with `pool` in the long-/uː/ practice group because room also has a standard short-vowel variant.
- Level 15 avoids the variable plural ending in “paths”; Level 23 no longer has a boat travelling down a road. The revised practice sentences fit a plausible situation.
- Levels 30–32 move from word endings to word stress, weak vowels, and sentence-level linking. The sequence supports intelligibility rather than requiring a learner to erase every trace of an accent.

## Pronunciation and framework references

The review uses original explanations. Pronunciation facts were checked where needed against [Cambridge's hungry entry](https://dictionary.cambridge.org/us/dictionary/english/hungry?q=Hungry) and [Cambridge's US/UK tired pronunciation](https://dictionary.cambridge.org/pronunciation/english/tired). No dictionary examples or explanatory passages were copied into the course.

The progression follows the general distinction between communicative activity and phonological control described in the [Council of Europe's CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions) and its [phonological competence resources](https://www.coe.int/en/web/common-european-framework-reference-languages/phonological-competence). The internal Levels 1–32 are not official CEFR levels, and completing 480 short items is not represented as a proficiency certificate.

## Visual meaning audit

All 320 word IDs have a curated visual specification in [`scripts/word-visual-map.json`](../scripts/word-visual-map.json). The 273 initial selected source drawings were rendered in eight contact sheets and examined. This caught source-name ambiguities that filename matching alone missed:

- Mulberry `pupil.svg` depicts the pupil of an eye. The student card uses `study_,_to.svg`.
- Mulberry `partner.svg` depicts a romantic couple. The learning-partner card uses two people working on a page.
- `pants.svg` depicts underwear in the source's UK vocabulary. The US pants card uses `trousers.svg`.
- `order_1_,_to.svg` depicts ordering a list, and `order_2_,_to.svg` depicts giving an order. The food-order card uses a customer/waiter/soup scene.
- `sink.svg` is a washbasin and `sink_2.svg` is a kitchen sink; room compositions use the appropriate one.
- Chicken uses the food illustration, matching its intended primary meaning. The green apple drawing now agrees with its example sentence.

Fifty-nine word meanings need original visual cues in addition to the licensed illustration. [`scripts/word-visual-cues.mjs`](../scripts/word-visual-cues.mjs) supplies examples such as an actual ticket, a road map, a receipt, a masked password field, a cost/change calculation, a deadline clock, and an information-compression diagram for summarising. These 59 compositions were rendered and inspected in five contact sheets. This review also found and fixed drawing reuse that differed only in text: schedule versus deadline, and price versus expensive now have materially different visual explanations.

The visual compiler's source bounding-box fit addresses the differing amounts of blank space in the original drawings, keeping narrow pencils and wide trains visible at a meaningful size. A second inspection of the generated student, deadline, expensive, reuse, and platform images confirmed the improved scale. Final inspection also verified that the boy/girl portraits exclude the other person's arm, the nose ring follows the actual nose after fitting, and the cough illustration places the covering arm near the mouth.

The nine final compiled-image samples are preserved in [`qa/word-visual-detail-review.png`](qa/word-visual-detail-review.png). This sheet renders the actual local curriculum assets; it is an image-content check, while the release report separately records browser layout and interaction checks.

Original source provenance and commercial-use terms are recorded by the release in `assets/ATTRIBUTIONS.md` and `assets/curriculum-attributions.json`. No Global Crown artwork or database content was used. No AI image generation was used for this system.

## Release preservation and verification

The frozen 025 migration remains byte-for-byte unchanged. Its SHA-256 is `15b8fdb1721acaef7c6550cc5ee58d9d39e8bd5b10338db1ae2cf7c205d8f379`. The release generator verifies that hash and the forward quality migration against the current source.

Migration 027 updates editorial fields and the 96 level descriptions. It preserves IDs, levels, activation state, preview status, plan requirements, ordering, student access rows, progress, and favourites. It checks the expected old or already-updated editorial state before making changes and aborts if independent content edits would be overwritten. The release workstream owns final generation and production application; this document does not imply that local preparation alone constitutes deployment.

Completed editorial/asset checks:

- 32 populated levels per strand; 320 / 128 / 32 items; 480 unique stable IDs.
- An explicit retain/revise decision and exact editorial differences for all 480 items.
- 96 bilingual can-do goals.
- 320 curated word visual specifications and source existence checks.
- 273 initial drawings and 59 specialised word cues inspected as rendered images.
- Final compiled boy/girl portrait crops, nose highlight, cough pose, and five other concrete/composite examples inspected and recorded in the nine-image detail sheet.
- Visual contract test passes: no exact same-level drawing duplicates after ignoring text and IDs.
- Security workstream reported successful PostgreSQL execution of 027 after 001–026 and successful regression tests; final generated source must be rechecked before release.

Production screenshots, real voice playback, per-student security, and the final deployed SHA belong in the release report. They are separate evidence from an editorial audit.

## Level-by-level learning purposes

| Level | Words | Phrases | Phonics |
|---|---|---|---|
| 1 | Name the things and people in your first lesson. | Greet someone, introduce yourself, and say thank you. | Hear first consonants inside words and copy a short model. |
| 2 | Describe familiar things using colours and shapes. | Ask for help, another turn, or a repetition. | Feel how the tongue and lips make voiced consonants. |
| 3 | Introduce family members and friends. | Choose something and express likes politely. | Contrast breath and voice in f/v, then practise h/w. |
| 4 | Name body parts and follow simple actions. | Introduce family and use simple home routines. | Distinguish l/r and recognise other common consonant spellings. |
| 5 | Name everyday food and ask for a drink. | Ask the time and talk about everyday routines. | Hear and form short a with an open jaw. |
| 6 | Describe rooms and find things at home. | Ask for food or drink and explain a preference. | Keep short i relaxed and distinct from a long ee sound. |
| 7 | Describe animals using simple sentences. | Ask about prices, colours, and trying clothes on. | Recognise the US and UK models of short o. |
| 8 | Follow instructions and say what you can do. | Ask for directions and describe a location. | Hear short e without gliding into another vowel. |
| 9 | Say how you feel and what you need. | Discuss the weather and nearby plans. | Keep short u unrounded and clear. |
| 10 | Talk about the weather and the world outside. | Describe how you feel and check on someone. | Blend a consonant, short vowel, and final consonant. |
| 11 | Describe daily routines and when things happen. | Invite a friend and talk about hobbies. | Join a first consonant directly to l. |
| 12 | Find places in town and explain where they are. | Manage classroom tasks and encourage a classmate. | Join a first consonant directly to r. |
| 13 | Describe clothes, fit, and what to wear. | Describe an experience and ask how it went. | Keep s clusters together without inserting a vowel. |
| 14 | Choose transport and talk about a journey. | Arrange a time and promise a later reply. | Distinguish the flowing sh sound from the stopped ch sound. |
| 15 | Explain household tasks and ask for practical help. | Check in, find a seat, and ask for a local recommendation. | Use tongue placement and voicing to contrast the two th sounds. |
| 16 | Ask questions, explain an idea, and keep a conversation going. | Explain a problem and acknowledge a possible misunderstanding. | Connect wh, ph, and ng spellings with their sounds. |
| 17 | Describe study habits, check meaning, and plan improvements. | Give an opinion and respond to another viewpoint. | Contrast short a and long a in common silent e words. |
| 18 | Coordinate a workday and discuss a shared project. | Suggest a way forward and weigh simple options. | Contrast short i and long i in common silent e words. |
| 19 | Describe symptoms and arrange an appointment. | Request clarification and check your understanding precisely. | Contrast short o and long o in US and UK models. |
| 20 | Compare prices and complete a purchase. | Coordinate deadlines, meetings, and shared work. | Recognise u_e and e_e patterns while noticing exceptions. |
| 21 | Discuss relationships, support, and shared responsibilities. | Show consideration, gratitude, and a thoughtful apology. | Recognise common ai and ay spellings for long a. |
| 22 | Choose precise descriptions for plans and behaviour. | Raise a service problem politely and ask for a solution. | Recognise common ee and ea spellings for long e. |
| 23 | Manage arrangements and respond to changes. | Tell a lively story and respond empathetically. | Hear long o in oa/ow words and contrast different ow sounds. |
| 24 | Explain a technology problem and follow practical steps. | Reflect on progress and choose a next learning goal. | Distinguish the vowel quality in moon and book. |
| 25 | Discuss environmental choices and their consequences. | Disagree respectfully and consider alternative explanations. | Compare US and UK ar/or models without adding a vowel after r. |
| 26 | Explain nuanced feelings and respond with empathy. | Present a main idea and invite other perspectives. | Recognise the central vowels in er/ir/ur words. |
| 27 | Compare evidence and explain the reasoning behind a view. | Negotiate conditions and work towards a compromise. | Keep oi/oy as one smooth vowel glide. |
| 28 | Prioritise, negotiate, and improve a shared project. | Use everyday idioms to describe progress and shared understanding. | Keep ou/ow as one glide and distinguish it from long o. |
| 29 | Handle travel changes, missing baggage, and detailed arrangements. | Share updates, clarify responsibility, and acknowledge concerns. | Choose common spellings while noticing soft c/g exceptions. |
| 30 | Express preferences, constraints, and decisions using natural verb patterns. | Reflect on past choices and discuss complex outcomes. | Choose -s and -ed endings by the previous sound. |
| 31 | Evaluate options precisely and express degrees of certainty. | Qualify an opinion and recognise nuance in an argument. | Use stress and weak vowels to make a word easier to understand. |
| 32 | Clarify assumptions, resolve disagreements, and reflect on decisions. | Reframe an issue and question the assumptions behind a plan. | Link words and use stress to highlight meaning in a sentence. |
