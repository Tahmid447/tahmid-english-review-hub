-- Review Hub catalogue migration
--
-- This migration seeds catalogue metadata only. The bundled question JSON remains
-- the source of truth in src/data/. After both migrations run,
-- sign in to Teacher Studio and choose “Sync bundled content” to upsert all
-- 485 question activities:
--   • 143 migrated legacy questions (stable IDs and structure preserved)
--   • 78 additive listening/speaking/mixed activities
--   • 264 draft activities (24 × 11 Notion-derived lessons)
--
-- Running this migration again is safe. It does not create users, store passwords,
-- use a service-role key, or touch the separate Do/Does application.

insert into public.review_lessons (
  id, slug, lesson_date, title_en, title_ja, status, audience,
  source_type, content_version, content
)
values
  (
    '00000000-0000-4000-8000-000000000628', 'june-28', '2026-06-28',
    'Café Talk & Polite Answers', 'Polite Conversation Review',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":21,"added_questions":13}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000629', 'june-29', '2026-06-29',
    'What Did You Hear? Reactions & Position', 'Heard, Reactions & Position',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":15,"added_questions":13}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000630', 'june-30', '2026-06-30',
    'Feelings, Preferences & Match Talk', 'Feelings, Prefer & Sports English',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":22,"added_questions":13}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000704', 'july-04', '2026-07-04',
    'Everyday English: When Life Happens', 'Daily Life Survival English',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":27,"added_questions":13}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000705', 'july-05', '2026-07-05',
    'Natural Reactions & Everyday Choices', 'Reactions, Reasons & Choices',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":24,"added_questions":13}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000706', 'july-06', '2026-07-06',
    'Connected Speech & Useful Conversation', 'July 6 Complete Review',
    'published', 'both', 'legacy_zip', 1,
    '{"bundled":true,"original_questions":34,"added_questions":13}'::jsonb
  )
-- Refresh descriptive catalogue fields without undoing a teacher's publishing
-- or audience decision on a subsequent seed run.
on conflict (slug) do update set
  lesson_date = excluded.lesson_date,
  title_en = excluded.title_en,
  title_ja = excluded.title_ja,
  content_version = excluded.content_version,
  content = excluded.content;

insert into public.review_lessons (
  id, slug, lesson_date, title_en, title_ja, status, audience,
  source_type, source_notion_page_id, source_notion_url,
  content_version, content
)
values
  (
    '00000000-0000-4000-8000-000000000707', 'july-07', '2026-07-07',
    'Bring, Buy & Acting for Someone', 'bring / buy と「人のために」の表現',
    'draft', 'both', 'notion',
    '396fb48a-4617-80fb-a8ff-c6fd8e293dc7',
    'https://app.notion.com/p/396fb48a461780fba8ffc6fd8e293dc7',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000711', 'july-11', '2026-07-11',
    'Connected, Live & Noticing Things', 'connected・live・notice / realize',
    'draft', 'both', 'notion',
    '399fb48a-4617-80d5-abde-c3d52501ae61',
    'https://app.notion.com/p/399fb48a461780d5abdec3d52501ae61',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000712', 'july-12', '2026-07-12',
    'Have, Had, Any & Yet', 'have–had–had と any / yet',
    'draft', 'both', 'notion',
    '39afb48a-4617-80a9-9c63-db695d539775',
    'https://app.notion.com/p/39afb48a461780a99c63db695d539775',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000713', 'july-13', '2026-07-13',
    'Possibility, Timing & City Talk', '可能性・時間帯・街の会話',
    'draft', 'both', 'notion',
    '3a8fb48a-4617-810b-b840-d2dd3af403b2',
    'https://app.notion.com/p/3a8fb48a4617810bb840d2dd3af403b2',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000718', 'july-18', '2026-07-18',
    'Supposed To, Helpers & Fire', 'be supposed to・助動詞・fire表現',
    'draft', 'both', 'notion',
    '3a0fb48a-4617-808e-a9b2-e5f0069c227d',
    'https://app.notion.com/p/3a0fb48a4617808ea9b2e5f0069c227d',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000719', 'july-19', '2026-07-19',
    'Both, Either, Neither & Rather', 'both / either / neither と rather',
    'draft', 'both', 'notion',
    '3a1fb48a-4617-8020-a0bb-d5a603d16bf3',
    'https://app.notion.com/p/3a1fb48a46178020a0bbd5a603d16bf3',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000722', 'july-22', '2026-07-22',
    'Availability, Two Choices & Clear Answers', '予定確認・2つの選択・Yes / No',
    'draft', 'takiwaki', 'notion',
    '3a8fb48a-4617-8138-87ea-ee9f9fa9e4b3',
    'https://app.notion.com/p/3a8fb48a4617813887eaee9f9fa9e4b3',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000723', 'july-23', '2026-07-23',
    'Everyday English & Doraemon', '日常英語とドラえもん',
    'draft', 'takiwaki', 'notion',
    '3a6fb48a-4617-812a-aabc-db6df34d0f54',
    'https://app.notion.com/p/3a6fb48a4617812aaabcdb6df34d0f54',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000725', 'july-25', '2026-07-25',
    'Feelings, Getting & Intuition', '感情・変化・直感',
    'draft', 'takiwaki', 'notion',
    '3a8fb48a-4617-806a-89af-c0605a4f3534',
    'https://app.notion.com/p/3a8fb48a4617806a89afc0605a4f3534',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000726', 'july-26', '2026-07-26',
    'Hope, Wish & Perfect Tenses', 'hope / wish と完了形',
    'draft', 'takiwaki', 'notion',
    '3a9fb48a-4617-80ba-a872-cd6a7735ae4b',
    'https://app.notion.com/p/3a9fb48a461780baa872cd6a7735ae4b',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000727', 'july-27', '2026-07-27',
    'Spill, Acquired Taste & Tense Review', 'spill・大人の味・時制の総復習',
    'draft', 'takiwaki', 'notion',
    '3acfb48a-4617-815b-82b9-e900531fcc19',
    'https://app.notion.com/p/3acfb48a4617815b82b9e900531fcc19',
    1, '{"bundled":true,"draft_questions":24}'::jsonb
  )
on conflict (source_type, source_notion_page_id) do update set
  slug = excluded.slug,
  lesson_date = excluded.lesson_date,
  title_en = excluded.title_en,
  title_ja = excluded.title_ja,
  source_notion_url = excluded.source_notion_url,
  content_version = excluded.content_version,
  content = excluded.content;

-- Notice that the conflict update above deliberately does not overwrite
-- status or audience. Once a teacher reviews a Notion draft, re-running this
-- catalogue migration cannot silently republish, unpublish, or change its audience.
