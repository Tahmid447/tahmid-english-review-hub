# Notion Import Catalogue / Notion取り込み一覧

Read-only review completed against `📘 Lessons (Takiwaki)`. The Notion source
pages were not edited. The database contained 11 unique lesson dates after
July 6; no same-date duplicate was found. July 25 already combines the morning
and afternoon material in one lesson.

The 11 lessons below were initially staged as `draft` and then published after
review. Each now contains 33 activities: five illustration-led questions,
three Listening Choice, three Dictation, five Speaking activities, and 17
mixed comprehension/use-it activities. Every lesson covers all 14 formats.

## August 28 expansion: 10 source pages → 14 lessons

The July 30–August 25 source review was completed read-only. Longer source
pages were split by teaching objective instead of forcing unrelated material
into one oversized lesson. Every resulting lesson contains 33 activities,
all 14 formats, a Quick Practice route, a Full Lesson route, a complete
bilingual Lesson Guide and five storyboard panels.

| Source date | Published lesson(s) | Split | Notion page ID |
|---|---|---|---|
| Jul 30 | `july-30-part-1`, `july-30-part-2` | 2 parts | `3c8fb48a-4617-815c-b642-f7b782ea654f` |
| Aug 2 | `august-02` | 1 lesson | `3b0fb48a-4617-8029-bc0e-d6def0eea387` |
| Aug 3 | `august-03` | 1 lesson | `3c7fb48a-4617-81da-b21f-dd973c1028e4` |
| Aug 9 | `august-09` | 1 lesson | `3c7fb48a-4617-8111-9092-fb5d18d0217c` |
| Aug 10 | `august-10-part-1`, `august-10-part-2` | 2 parts | `3c7fb48a-4617-81e6-bede-f715c9c982be` |
| Aug 16 | `august-16-part-1`, `august-16-part-2` | 2 parts | `3c7fb48a-4617-81c7-b250-e3872ff7108b` |
| Aug 17 | `august-17-part-1`, `august-17-part-2` | 2 parts | `3c7fb48a-4617-8145-941a-c0c2fc5d9c29` |
| Aug 23 | `august-23` | 1 lesson | `3c8fb48a-4617-817a-9095-e828b2cd2096` |
| Aug 24 | `august-24` | 1 lesson | `3c6fb48a-4617-804b-b367-df86ca29dba5` |
| Aug 25 | `august-25` | 1 lesson | `3c6fb48a-4617-80d4-8f16-e0d133de7fd4` |

Archived duplicate `3c8fb48a-4617-81f8-ba2e-f7990f20f9e5` was deliberately
excluded.

| Date | Draft title | Main themes | Initial audience | Notion page ID |
|---|---|---|---|---|
| Jul 7 | Bring, Buy & Acting for Someone | bring/bought, tell someone to, phone died, on my behalf | Both, after review | `396fb48a-4617-80fb-a8ff-c6fd8e293dc7` |
| Jul 11 | Connected, Live & Noticing Things | connected, live broadcast, hometown, notice/realize | Both, after review | `399fb48a-4617-80d5-abde-c3d52501ae61` |
| Jul 12 | Have, Had, Any & Yet | have–had–had, present perfect, any, yet | Both, after review | `39afb48a-4617-80a9-9c63-db695d539775` |
| Jul 13 | Possibility, Timing & City Talk | might/will, around this time, signal, go by | Both, after review | `3a8fb48a-4617-810b-b840-d2dd3af403b2` |
| Jul 18 | Supposed To, Helpers & Fire | be supposed to, do/does, have/has, fire expressions | Both, after review | `3a0fb48a-4617-808e-a9b2-e5f0069c227d` |
| Jul 19 | Both, Either, Neither & Rather | both/either/neither, would rather, run into | Both, after review | `3a1fb48a-4617-8020-a0bb-d5a603d16bf3` |
| Jul 22 | Availability, Two Choices & Clear Answers | would be, choices, negative questions, `right?` | Takiwaki only | `3a8fb48a-4617-8138-87ea-ee9f9fa9e4b3` |
| Jul 23 | Everyday English & Doraemon | present perfect, food vocabulary, natural movement phrases, Doraemon | Takiwaki only | `3a6fb48a-4617-812a-aabc-db6df34d0f54` |
| Jul 25 | Feelings, Getting & Intuition | hungry/starving, annoyed/angry, getting + adjective, gut feeling | Takiwaki only | `3a8fb48a-4617-806a-89af-c0605a4f3534` |
| Jul 26 | Hope, Wish & Perfect Tenses | hope/wish, unreal past, present perfect, past perfect | Takiwaki only | `3a9fb48a-4617-80ba-a872-cd6a7735ae4b` |
| Jul 27 | Spill, Acquired Taste & Tense Review | spill/pour/splash, acquired taste, tense review | Takiwaki only | `3acfb48a-4617-815b-82b9-e900531fcc19` |

## Safe publishing flow

1. Read the Notion note without modifying it.
2. Match by `source_type + source_notion_page_id + source_segment`.
3. Create or update the Supabase lesson as `draft`.
4. Review English, Japanese, answers, distractors, explanations, and audio text.
5. Preview from Teacher Studio.
6. Choose `general`, `takiwaki`, or `both`.
7. Publish only after teacher confirmation.

The unique database constraint prevents the same Notion page and source segment
from creating a duplicate lesson. Different segments deliberately allow one
long page to become Part 1 and Part 2. A repeated catalogue migration updates
descriptive content without silently changing a teacher’s selected status or
audience.
