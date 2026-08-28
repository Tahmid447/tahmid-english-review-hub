# August 28, 2026 Notion lesson expansion release

This release converts 10 canonical Notion lesson pages dated July 30 through
August 25 into 14 public Review Hub lessons. Long source pages are split into
Part 1 and Part 2 by learning objective. No source page was edited.

## Release inventory

- 31 total published lessons
- 1,100 total activities
- 155 visual questions: 85 standalone illustrations and 70 panels across 14
  five-panel storyboards
- 14 practice formats in every new lesson
- 14 new Quick Practice routes and 14 new Full Lesson routes
- 14 complete bilingual Lesson Guides
- 28 new Premium teacher-review tasks: 14 speaking and 14 essay
- 42 new bilingual Premium topics; 93 topic choices across all 31 lessons

## Database rollout

The shared Supabase project has no tracked migration ledger. These forward-only
migrations were applied manually in SQL Editor and must not be blindly replayed:

1. `202608280019_lesson_source_segments.sql`
2. `202608280020_new_notion_lessons_and_questions.sql`
3. `202608280021_new_lesson_premium_tasks_topics.sql`
4. `202608280022_publish_new_notion_lessons.sql`
5. `202608280023_existing_notion_lesson_format_parity.sql`

Live verification after step 5 returned:

- 14 release lessons found, 14 published, 14 audience `both`
- 462 questions across the new 14 lessons, exactly 33 per lesson
- 363 questions across the prior 11 Notion lessons, exactly 33 per lesson
- exactly 14 distinct formats in every Notion-derived lesson
- 31 public lessons and 1,100 public questions overall
- 28 Premium tasks: 14 speaking and 14 essay

## Quality gates

The integrated test/build/visual run passed with 31 lessons, 1,100 activities,
155 visual questions (85 standalone illustrations and 70 storyboard panels),
570 readable Lesson Guide targets and 1,542 integrity and security assertions.
Applied migrations `003`, `009`, `013`, `016`, `017`,
and the earlier August 28 migrations `019`–`022` remain byte-for-byte unchanged;
`023` carries the existing-lesson parity update forward without rewriting them.

Local browser QA covered Home, Plans and a full lesson in Light and Dark at
desktop and 390×844 mobile sizes. It also confirmed the adopted 2×2 pricing
layout, compact sticky header, focused question-local settings, complete top
settings, the five-second BGM invitation and real playback of the selected M4A
track.

Real iPhone/Android touch, microphone permission and PWA installation remain
owner-device follow-up checks; they are not claimed as automated verification.
