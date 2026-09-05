-- Generated from curriculum/*.json by scripts/generate-structured-curriculum-seed.mjs.
-- Forward-only, one-time seed. It fails closed when either structured curriculum
-- table already has rows, so replay cannot overwrite or reactivate live content.
begin;

do $migration_guard$
begin
  if to_regclass('public.review_curriculum_levels') is null
    or to_regclass('public.review_curriculum_items') is null then
    raise exception 'Apply 202609050024_structured_learning_hub.sql before this seed migration.';
  end if;
  if exists (select 1 from public.review_curriculum_levels)
    or exists (select 1 from public.review_curriculum_items) then
    raise exception 'Structured curriculum tables are not empty. Migration 025 is one-time only; inspect live rows and create a forward migration instead of replaying it.';
  end if;
end
$migration_guard$;

with seed as (
  select *
  from jsonb_to_recordset($curriculum_seed$[
  {
    "category": "words",
    "level": 1,
    "title_en": "Level 1 · Words",
    "title_ja": "レベル1・単語",
    "description_en": "Build useful vocabulary for classroom.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "📘",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "category": "words",
    "level": 2,
    "title_en": "Level 2 · Words",
    "title_ja": "レベル2・単語",
    "description_en": "Build useful vocabulary for colors and shapes.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🔴",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "category": "words",
    "level": 3,
    "title_en": "Level 3 · Words",
    "title_ja": "レベル3・単語",
    "description_en": "Build useful vocabulary for family and people.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "👩",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "category": "words",
    "level": 4,
    "title_en": "Level 4 · Words",
    "title_ja": "レベル4・単語",
    "description_en": "Build useful vocabulary for body.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🙂",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "category": "words",
    "level": 5,
    "title_en": "Level 5 · Words",
    "title_ja": "レベル5・単語",
    "description_en": "Build useful vocabulary for food and drink.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🍚",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "category": "words",
    "level": 6,
    "title_en": "Level 6 · Words",
    "title_ja": "レベル6・単語",
    "description_en": "Build useful vocabulary for home.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏠",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "category": "words",
    "level": 7,
    "title_en": "Level 7 · Words",
    "title_ja": "レベル7・単語",
    "description_en": "Build useful vocabulary for animals.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🐕",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "category": "words",
    "level": 8,
    "title_en": "Level 8 · Words",
    "title_ja": "レベル8・単語",
    "description_en": "Build useful vocabulary for basic actions.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏃",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "category": "words",
    "level": 9,
    "title_en": "Level 9 · Words",
    "title_ja": "レベル9・単語",
    "description_en": "Build useful vocabulary for feelings and needs.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "😊",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "category": "words",
    "level": 10,
    "title_en": "Level 10 · Words",
    "title_ja": "レベル10・単語",
    "description_en": "Build useful vocabulary for weather and nature.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "☀️",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "category": "words",
    "level": 11,
    "title_en": "Level 11 · Words",
    "title_ja": "レベル11・単語",
    "description_en": "Build useful vocabulary for time and routines.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🌅",
    "active": true,
    "is_preview": false,
    "position": 11
  },
  {
    "category": "words",
    "level": 12,
    "title_en": "Level 12 · Words",
    "title_ja": "レベル12・単語",
    "description_en": "Build useful vocabulary for places in town.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏫",
    "active": true,
    "is_preview": false,
    "position": 12
  },
  {
    "category": "words",
    "level": 13,
    "title_en": "Level 13 · Words",
    "title_ja": "レベル13・単語",
    "description_en": "Build useful vocabulary for clothing.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "👕",
    "active": true,
    "is_preview": false,
    "position": 13
  },
  {
    "category": "words",
    "level": 14,
    "title_en": "Level 14 · Words",
    "title_ja": "レベル14・単語",
    "description_en": "Build useful vocabulary for transport and travel.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🚗",
    "active": true,
    "is_preview": false,
    "position": 14
  },
  {
    "category": "words",
    "level": 15,
    "title_en": "Level 15 · Words",
    "title_ja": "レベル15・単語",
    "description_en": "Build useful vocabulary for chores and practical actions.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🧽",
    "active": true,
    "is_preview": false,
    "position": 15
  },
  {
    "category": "words",
    "level": 16,
    "title_en": "Level 16 · Words",
    "title_ja": "レベル16・単語",
    "description_en": "Build useful vocabulary for communication.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "❓",
    "active": true,
    "is_preview": false,
    "position": 16
  },
  {
    "category": "words",
    "level": 17,
    "title_en": "Level 17 · Words",
    "title_ja": "レベル17・単語",
    "description_en": "Build useful vocabulary for study skills.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "📚",
    "active": true,
    "is_preview": false,
    "position": 17
  },
  {
    "category": "words",
    "level": 18,
    "title_en": "Level 18 · Words",
    "title_ja": "レベル18・単語",
    "description_en": "Build useful vocabulary for work.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏢",
    "active": true,
    "is_preview": false,
    "position": 18
  },
  {
    "category": "words",
    "level": 19,
    "title_en": "Level 19 · Words",
    "title_ja": "レベル19・単語",
    "description_en": "Build useful vocabulary for health.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🧑‍⚕️",
    "active": true,
    "is_preview": false,
    "position": 19
  },
  {
    "category": "words",
    "level": 20,
    "title_en": "Level 20 · Words",
    "title_ja": "レベル20・単語",
    "description_en": "Build useful vocabulary for shopping and money.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏷️",
    "active": true,
    "is_preview": false,
    "position": 20
  },
  {
    "category": "words",
    "level": 21,
    "title_en": "Level 21 · Words",
    "title_ja": "レベル21・単語",
    "description_en": "Build useful vocabulary for relationships.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🏘️",
    "active": true,
    "is_preview": false,
    "position": 21
  },
  {
    "category": "words",
    "level": 22,
    "title_en": "Level 22 · Words",
    "title_ja": "レベル22・単語",
    "description_en": "Build useful vocabulary for useful adjectives.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🟢",
    "active": true,
    "is_preview": false,
    "position": 22
  },
  {
    "category": "words",
    "level": 23,
    "title_en": "Level 23 · Words",
    "title_ja": "レベル23・単語",
    "description_en": "Build useful vocabulary for plans and logistics.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "📍",
    "active": true,
    "is_preview": false,
    "position": 23
  },
  {
    "category": "words",
    "level": 24,
    "title_en": "Level 24 · Words",
    "title_ja": "レベル24・単語",
    "description_en": "Build useful vocabulary for technology.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "📱",
    "active": true,
    "is_preview": false,
    "position": 24
  },
  {
    "category": "words",
    "level": 25,
    "title_en": "Level 25 · Words",
    "title_ja": "レベル25・単語",
    "description_en": "Build useful vocabulary for environment.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "♻️",
    "active": true,
    "is_preview": false,
    "position": 25
  },
  {
    "category": "words",
    "level": 26,
    "title_en": "Level 26 · Words",
    "title_ja": "レベル26・単語",
    "description_en": "Build useful vocabulary for nuanced emotions.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "😌",
    "active": true,
    "is_preview": false,
    "position": 26
  },
  {
    "category": "words",
    "level": 27,
    "title_en": "Level 27 · Words",
    "title_ja": "レベル27・単語",
    "description_en": "Build useful vocabulary for critical thinking.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "⚖️",
    "active": true,
    "is_preview": false,
    "position": 27
  },
  {
    "category": "words",
    "level": 28,
    "title_en": "Level 28 · Words",
    "title_ja": "レベル28・単語",
    "description_en": "Build useful vocabulary for business and projects.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "📑",
    "active": true,
    "is_preview": false,
    "position": 28
  },
  {
    "category": "words",
    "level": 29,
    "title_en": "Level 29 · Words",
    "title_ja": "レベル29・単語",
    "description_en": "Build useful vocabulary for travel details.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🧳",
    "active": true,
    "is_preview": false,
    "position": 29
  },
  {
    "category": "words",
    "level": 30,
    "title_en": "Level 30 · Words",
    "title_ja": "レベル30・単語",
    "description_en": "Build useful vocabulary for high utility verbs.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🧩",
    "active": true,
    "is_preview": false,
    "position": 30
  },
  {
    "category": "words",
    "level": 31,
    "title_en": "Level 31 · Words",
    "title_ja": "レベル31・単語",
    "description_en": "Build useful vocabulary for precise adjectives.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "⚙️",
    "active": true,
    "is_preview": false,
    "position": 31
  },
  {
    "category": "words",
    "level": 32,
    "title_en": "Level 32 · Words",
    "title_ja": "レベル32・単語",
    "description_en": "Build useful vocabulary for advanced communication.",
    "description_ja": "単語を、音声と分かりやすい例で練習します。",
    "icon": "🔦",
    "active": true,
    "is_preview": false,
    "position": 32
  },
  {
    "category": "phrases",
    "level": 1,
    "title_en": "Level 1 · Phrases",
    "title_ja": "レベル1・フレーズ",
    "description_en": "Practise “Hi, I'm Ren.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "category": "phrases",
    "level": 2,
    "title_en": "Level 2 · Phrases",
    "title_ja": "レベル2・フレーズ",
    "description_en": "Practise “Can I try?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "category": "phrases",
    "level": 3,
    "title_en": "Level 3 · Phrases",
    "title_ja": "レベル3・フレーズ",
    "description_en": "Practise “I like this one.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "category": "phrases",
    "level": 4,
    "title_en": "Level 4 · Phrases",
    "title_ja": "レベル4・フレーズ",
    "description_en": "Practise “This is my brother.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "category": "phrases",
    "level": 5,
    "title_en": "Level 5 · Phrases",
    "title_ja": "レベル5・フレーズ",
    "description_en": "Practise “What time is it?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "category": "phrases",
    "level": 6,
    "title_en": "Level 6 · Phrases",
    "title_ja": "レベル6・フレーズ",
    "description_en": "Practise “Can I have some water?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "category": "phrases",
    "level": 7,
    "title_en": "Level 7 · Phrases",
    "title_ja": "レベル7・フレーズ",
    "description_en": "Practise “How much is this?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "category": "phrases",
    "level": 8,
    "title_en": "Level 8 · Phrases",
    "title_ja": "レベル8・フレーズ",
    "description_en": "Practise “How do I get to the station?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "category": "phrases",
    "level": 9,
    "title_en": "Level 9 · Phrases",
    "title_ja": "レベル9・フレーズ",
    "description_en": "Practise “It looks like rain.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "category": "phrases",
    "level": 10,
    "title_en": "Level 10 · Phrases",
    "title_ja": "レベル10・フレーズ",
    "description_en": "Practise “I don't feel well.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "category": "phrases",
    "level": 11,
    "title_en": "Level 11 · Phrases",
    "title_ja": "レベル11・フレーズ",
    "description_en": "Practise “Do you want to join us?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 11
  },
  {
    "category": "phrases",
    "level": 12,
    "title_en": "Level 12 · Phrases",
    "title_ja": "レベル12・フレーズ",
    "description_en": "Practise “What page are we on?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 12
  },
  {
    "category": "phrases",
    "level": 13,
    "title_en": "Level 13 · Phrases",
    "title_ja": "レベル13・フレーズ",
    "description_en": "Practise “I've never tried that before.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 13
  },
  {
    "category": "phrases",
    "level": 14,
    "title_en": "Level 14 · Phrases",
    "title_ja": "レベル14・フレーズ",
    "description_en": "Practise “Are you free after school?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 14
  },
  {
    "category": "phrases",
    "level": 15,
    "title_en": "Level 15 · Phrases",
    "title_ja": "レベル15・フレーズ",
    "description_en": "Practise “I'd like to check in.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 15
  },
  {
    "category": "phrases",
    "level": 16,
    "title_en": "Level 16 · Phrases",
    "title_ja": "レベル16・フレーズ",
    "description_en": "Practise “Something seems to be wrong.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 16
  },
  {
    "category": "phrases",
    "level": 17,
    "title_en": "Level 17 · Phrases",
    "title_ja": "レベル17・フレーズ",
    "description_en": "Practise “In my opinion, it's worth trying.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 17
  },
  {
    "category": "phrases",
    "level": 18,
    "title_en": "Level 18 · Phrases",
    "title_ja": "レベル18・フレーズ",
    "description_en": "Practise “Why don't we start with the easiest part?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 18
  },
  {
    "category": "phrases",
    "level": 19,
    "title_en": "Level 19 · Phrases",
    "title_ja": "レベル19・フレーズ",
    "description_en": "Practise “Could you say that another way?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 19
  },
  {
    "category": "phrases",
    "level": 20,
    "title_en": "Level 20 · Phrases",
    "title_ja": "レベル20・フレーズ",
    "description_en": "Practise “I'll get back to you by Friday.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 20
  },
  {
    "category": "phrases",
    "level": 21,
    "title_en": "Level 21 · Phrases",
    "title_ja": "レベル21・フレーズ",
    "description_en": "Practise “I hope I'm not interrupting.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 21
  },
  {
    "category": "phrases",
    "level": 22,
    "title_en": "Level 22 · Phrases",
    "title_ja": "レベル22・フレーズ",
    "description_en": "Practise “I'm afraid this isn't what I ordered.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 22
  },
  {
    "category": "phrases",
    "level": 23,
    "title_en": "Level 23 · Phrases",
    "title_ja": "レベル23・フレーズ",
    "description_en": "Practise “You won't believe what happened next.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 23
  },
  {
    "category": "phrases",
    "level": 24,
    "title_en": "Level 24 · Phrases",
    "title_ja": "レベル24・フレーズ",
    "description_en": "Practise “I'm working on being more consistent.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 24
  },
  {
    "category": "phrases",
    "level": 25,
    "title_en": "Level 25 · Phrases",
    "title_ja": "レベル25・フレーズ",
    "description_en": "Practise “I understand your point, but I see it differently.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 25
  },
  {
    "category": "phrases",
    "level": 26,
    "title_en": "Level 26 · Phrases",
    "title_ja": "レベル26・フレーズ",
    "description_en": "Practise “Let me walk you through the main idea.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 26
  },
  {
    "category": "phrases",
    "level": 27,
    "title_en": "Level 27 · Phrases",
    "title_ja": "レベル27・フレーズ",
    "description_en": "Practise “What would a fair compromise look like?” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 27
  },
  {
    "category": "phrases",
    "level": 28,
    "title_en": "Level 28 · Phrases",
    "title_ja": "レベル28・フレーズ",
    "description_en": "Practise “I'm still getting the hang of it.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 28
  },
  {
    "category": "phrases",
    "level": 29,
    "title_en": "Level 29 · Phrases",
    "title_ja": "レベル29・フレーズ",
    "description_en": "Practise “Just to keep you in the loop, the deadline has changed.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 29
  },
  {
    "category": "phrases",
    "level": 30,
    "title_en": "Level 30 · Phrases",
    "title_ja": "レベル30・フレーズ",
    "description_en": "Practise “Looking back, I would have approached it differently.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 30
  },
  {
    "category": "phrases",
    "level": 31,
    "title_en": "Level 31 · Phrases",
    "title_ja": "レベル31・フレーズ",
    "description_en": "Practise “I can see both sides of the argument.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 31
  },
  {
    "category": "phrases",
    "level": 32,
    "title_en": "Level 32 · Phrases",
    "title_ja": "レベル32・フレーズ",
    "description_en": "Practise “To put it another way, we're treating the symptom, not the cause.” and related phrases in natural conversation.",
    "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
    "icon": "💬",
    "active": true,
    "is_preview": false,
    "position": 32
  },
  {
    "category": "phonics",
    "level": 1,
    "title_en": "Level 1 · Phonics",
    "title_ja": "レベル1・フォニックス",
    "description_en": "Hear and practise first alphabet sounds: m, s, t, p.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "category": "phonics",
    "level": 2,
    "title_en": "Level 2 · Phonics",
    "title_ja": "レベル2・フォニックス",
    "description_en": "Hear and practise alphabet sounds: n, b, d, g.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "category": "phonics",
    "level": 3,
    "title_en": "Level 3 · Phonics",
    "title_ja": "レベル3・フォニックス",
    "description_en": "Hear and practise breathy and voiced consonants: f, v, h, w.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "category": "phonics",
    "level": 4,
    "title_en": "Level 4 · Phonics",
    "title_ja": "レベル4・フォニックス",
    "description_en": "Hear and practise remaining common alphabet sounds: c, k, j, z, y, x, q.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "category": "phonics",
    "level": 5,
    "title_en": "Level 5 · Phonics",
    "title_ja": "レベル5・フォニックス",
    "description_en": "Hear and practise short a in closed syllables.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "category": "phonics",
    "level": 6,
    "title_en": "Level 6 · Phonics",
    "title_ja": "レベル6・フォニックス",
    "description_en": "Hear and practise short i in closed syllables.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "category": "phonics",
    "level": 7,
    "title_en": "Level 7 · Phonics",
    "title_ja": "レベル7・フォニックス",
    "description_en": "Hear and practise short o in closed syllables.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "category": "phonics",
    "level": 8,
    "title_en": "Level 8 · Phonics",
    "title_ja": "レベル8・フォニックス",
    "description_en": "Hear and practise short e in closed syllables.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "category": "phonics",
    "level": 9,
    "title_en": "Level 9 · Phonics",
    "title_ja": "レベル9・フォニックス",
    "description_en": "Hear and practise short u in closed syllables.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "category": "phonics",
    "level": 10,
    "title_en": "Level 10 · Phonics",
    "title_ja": "レベル10・フォニックス",
    "description_en": "Hear and practise cVC blending and clear final consonants.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "category": "phonics",
    "level": 11,
    "title_en": "Level 11 · Phonics",
    "title_ja": "レベル11・フォニックス",
    "description_en": "Hear and practise l blends at the beginning.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 11
  },
  {
    "category": "phonics",
    "level": 12,
    "title_en": "Level 12 · Phonics",
    "title_ja": "レベル12・フォニックス",
    "description_en": "Hear and practise r blends at the beginning.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 12
  },
  {
    "category": "phonics",
    "level": 13,
    "title_en": "Level 13 · Phonics",
    "title_ja": "レベル13・フォニックス",
    "description_en": "Hear and practise s blends and three consonant starts.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 13
  },
  {
    "category": "phonics",
    "level": 14,
    "title_en": "Level 14 · Phonics",
    "title_ja": "レベル14・フォニックス",
    "description_en": "Hear and practise digraphs sh and ch.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 14
  },
  {
    "category": "phonics",
    "level": 15,
    "title_en": "Level 15 · Phonics",
    "title_ja": "レベル15・フォニックス",
    "description_en": "Hear and practise voiceless and voiced th.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 15
  },
  {
    "category": "phonics",
    "level": 16,
    "title_en": "Level 16 · Phonics",
    "title_ja": "レベル16・フォニックス",
    "description_en": "Hear and practise digraphs wh, ph, and ng.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 16
  },
  {
    "category": "phonics",
    "level": 17,
    "title_en": "Level 17 · Phonics",
    "title_ja": "レベル17・フォニックス",
    "description_en": "Hear and practise silent e makes long a.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 17
  },
  {
    "category": "phonics",
    "level": 18,
    "title_en": "Level 18 · Phonics",
    "title_ja": "レベル18・フォニックス",
    "description_en": "Hear and practise silent e makes long i.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 18
  },
  {
    "category": "phonics",
    "level": 19,
    "title_en": "Level 19 · Phonics",
    "title_ja": "レベル19・フォニックス",
    "description_en": "Hear and practise silent e makes long o.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 19
  },
  {
    "category": "phonics",
    "level": 20,
    "title_en": "Level 20 · Phonics",
    "title_ja": "レベル20・フォニックス",
    "description_en": "Hear and practise silent e patterns with u and e.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 20
  },
  {
    "category": "phonics",
    "level": 21,
    "title_en": "Level 21 · Phonics",
    "title_ja": "レベル21・フォニックス",
    "description_en": "Hear and practise long a vowel teams ai and ay.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 21
  },
  {
    "category": "phonics",
    "level": 22,
    "title_en": "Level 22 · Phonics",
    "title_ja": "レベル22・フォニックス",
    "description_en": "Hear and practise long e vowel teams ee and ea.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 22
  },
  {
    "category": "phonics",
    "level": 23,
    "title_en": "Level 23 · Phonics",
    "title_ja": "レベル23・フォニックス",
    "description_en": "Hear and practise long o vowel teams oa and ow.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 23
  },
  {
    "category": "phonics",
    "level": 24,
    "title_en": "Level 24 · Phonics",
    "title_ja": "レベル24・フォニックス",
    "description_en": "Hear and practise two common sounds of oo.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 24
  },
  {
    "category": "phonics",
    "level": 25,
    "title_en": "Level 25 · Phonics",
    "title_ja": "レベル25・フォニックス",
    "description_en": "Hear and practise r controlled vowels ar and or.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 25
  },
  {
    "category": "phonics",
    "level": 26,
    "title_en": "Level 26 · Phonics",
    "title_ja": "レベル26・フォニックス",
    "description_en": "Hear and practise r controlled spellings er, ir, and ur.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 26
  },
  {
    "category": "phonics",
    "level": 27,
    "title_en": "Level 27 · Phonics",
    "title_ja": "レベル27・フォニックス",
    "description_en": "Hear and practise diphthong oi and oy.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 27
  },
  {
    "category": "phonics",
    "level": 28,
    "title_en": "Level 28 · Phonics",
    "title_ja": "レベル28・フォニックス",
    "description_en": "Hear and practise diphthong ou and ow.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 28
  },
  {
    "category": "phonics",
    "level": 29,
    "title_en": "Level 29 · Phonics",
    "title_ja": "レベル29・フォニックス",
    "description_en": "Hear and practise common spelling choices: c, k, ck, soft c, soft g, and dge.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 29
  },
  {
    "category": "phonics",
    "level": 30,
    "title_en": "Level 30 · Phonics",
    "title_ja": "レベル30・フォニックス",
    "description_en": "Hear and practise pronouncing plural s and past ed endings.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 30
  },
  {
    "category": "phonics",
    "level": 31,
    "title_en": "Level 31 · Phonics",
    "title_ja": "レベル31・フォニックス",
    "description_en": "Hear and practise word stress, schwa, and r colored weak vowels.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 31
  },
  {
    "category": "phonics",
    "level": 32,
    "title_en": "Level 32 · Phonics",
    "title_ja": "レベル32・フォニックス",
    "description_en": "Hear and practise sentence rhythm, linking, and reduced function words.",
    "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
    "icon": "🔤",
    "active": true,
    "is_preview": false,
    "position": 32
  }
]$curriculum_seed$::jsonb) as value(
    category text,
    level smallint,
    title_en text,
    title_ja text,
    description_en text,
    description_ja text,
    icon text,
    active boolean,
    is_preview boolean,
    position integer
  )
)
insert into public.review_curriculum_levels (
  category, level, title_en, title_ja, description_en, description_ja,
  icon, active, is_preview, position
)
select category, level, title_en, title_ja, description_en, description_ja,
  icon, active, is_preview, position
from seed;

with seed as (
  select *
  from jsonb_to_recordset($curriculum_seed$[
  {
    "id": "word-l01-book",
    "category": "words",
    "level": 1,
    "title_en": "book",
    "title_ja": "本",
    "content": {
      "word": "book",
      "japanese": "本",
      "kanaReading": "ブック",
      "pronunciationHint": "Use the short /ʊ/ sound, not a long “oo.”",
      "exampleSentence": "This book is new.",
      "exampleJapanese": "この本は新しいです。",
      "commonMistake": "Do not stretch the vowel as in “moon.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "📘",
    "tags": [
      "classroom",
      "level-1",
      "book"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "id": "word-l01-pen",
    "category": "words",
    "level": 1,
    "title_en": "pen",
    "title_ja": "ペン",
    "content": {
      "word": "pen",
      "japanese": "ペン",
      "kanaReading": "ペン",
      "pronunciationHint": "Finish with a clear /n/ sound.",
      "exampleSentence": "May I use your pen?",
      "exampleJapanese": "あなたのペンを使ってもいいですか。",
      "commonMistake": "Do not add an extra vowel after the final n.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🖊️",
    "tags": [
      "classroom",
      "level-1",
      "pen"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 2
  },
  {
    "id": "word-l01-desk",
    "category": "words",
    "level": 1,
    "title_en": "desk",
    "title_ja": "机",
    "content": {
      "word": "desk",
      "japanese": "机",
      "kanaReading": "デスク",
      "pronunciationHint": "Join /s/ and /k/ at the end without a vowel.",
      "exampleSentence": "My desk is by the window.",
      "exampleJapanese": "私の机は窓のそばです。",
      "commonMistake": "Avoid saying “desuku” with extra vowels.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🪑",
    "tags": [
      "classroom",
      "level-1",
      "desk"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 3
  },
  {
    "id": "word-l01-chair",
    "category": "words",
    "level": 1,
    "title_en": "chair",
    "title_ja": "椅子",
    "content": {
      "word": "chair",
      "japanese": "椅子",
      "kanaReading": "チェア",
      "pronunciationHint": "Start with the /tʃ/ sound in “cheese.”",
      "exampleSentence": "Please sit on this chair.",
      "exampleJapanese": "この椅子に座ってください。",
      "commonMistake": "Do not pronounce the first sound like /ʃ/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "💺",
    "tags": [
      "classroom",
      "level-1",
      "chair"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l01-bag",
    "category": "words",
    "level": 1,
    "title_en": "bag",
    "title_ja": "かばん",
    "content": {
      "word": "bag",
      "japanese": "かばん",
      "kanaReading": "バッグ",
      "pronunciationHint": "Use a short, open /æ/ vowel.",
      "exampleSentence": "My bag is under the desk.",
      "exampleJapanese": "私のかばんは机の下です。",
      "commonMistake": "Do not make the vowel sound like the one in “bug.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🎒",
    "tags": [
      "classroom",
      "level-1",
      "bag"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l01-door",
    "category": "words",
    "level": 1,
    "title_en": "door",
    "title_ja": "ドア",
    "content": {
      "word": "door",
      "japanese": "ドア",
      "kanaReading": "ドア",
      "pronunciationHint": "Hold the vowel smoothly and finish with a light r in US English.",
      "exampleSentence": "Please close the door.",
      "exampleJapanese": "ドアを閉めてください。",
      "commonMistake": "Do not split it into two strong syllables.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🚪",
    "tags": [
      "classroom",
      "level-1",
      "door"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l01-window",
    "category": "words",
    "level": 1,
    "title_en": "window",
    "title_ja": "窓",
    "content": {
      "word": "window",
      "japanese": "窓",
      "kanaReading": "ウィンドウ",
      "pronunciationHint": "Stress the first syllable: WIN-dow.",
      "exampleSentence": "Open the window, please.",
      "exampleJapanese": "窓を開けてください。",
      "commonMistake": "Do not stress the final syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🪟",
    "tags": [
      "classroom",
      "level-1",
      "window"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l01-teacher",
    "category": "words",
    "level": 1,
    "title_en": "teacher",
    "title_ja": "先生",
    "content": {
      "word": "teacher",
      "japanese": "先生",
      "kanaReading": "ティーチャー",
      "pronunciationHint": "Stress TEE and use /tʃ/ in the middle.",
      "exampleSentence": "Our teacher is kind.",
      "exampleJapanese": "私たちの先生は親切です。",
      "commonMistake": "Do not use a /ʃ/ sound in the middle.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🧑‍🏫",
    "tags": [
      "classroom",
      "level-1",
      "teacher"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l01-student",
    "category": "words",
    "level": 1,
    "title_en": "student",
    "title_ja": "生徒",
    "content": {
      "word": "student",
      "japanese": "生徒",
      "kanaReading": "スチューデント",
      "pronunciationHint": "Stress STU and keep the final t light.",
      "exampleSentence": "Every student has a notebook.",
      "exampleJapanese": "生徒はみんなノートを持っています。",
      "commonMistake": "Do not drop the final t completely.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "🧑‍🎓",
    "tags": [
      "classroom",
      "level-1",
      "student"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l01-lesson",
    "category": "words",
    "level": 1,
    "title_en": "lesson",
    "title_ja": "レッスン・授業",
    "content": {
      "word": "lesson",
      "japanese": "レッスン・授業",
      "kanaReading": "レッスン",
      "pronunciationHint": "Stress LES; the second vowel is weak.",
      "exampleSentence": "The lesson starts at ten.",
      "exampleJapanese": "授業は10時に始まります。",
      "commonMistake": "Do not pronounce both syllables with equal stress.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "classroom"
    },
    "icon": "📝",
    "tags": [
      "classroom",
      "level-1",
      "lesson"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l02-red",
    "category": "words",
    "level": 2,
    "title_en": "red",
    "title_ja": "赤い",
    "content": {
      "word": "red",
      "japanese": "赤い",
      "kanaReading": "レッド",
      "pronunciationHint": "Keep the vowel short and the final d voiced.",
      "exampleSentence": "I have a red cup.",
      "exampleJapanese": "私は赤いカップを持っています。",
      "commonMistake": "Do not replace the r with an l sound.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "🔴",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "red"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l02-blue",
    "category": "words",
    "level": 2,
    "title_en": "blue",
    "title_ja": "青い",
    "content": {
      "word": "blue",
      "japanese": "青い",
      "kanaReading": "ブルー",
      "pronunciationHint": "Blend /b/ and /l/ before the long /uː/.",
      "exampleSentence": "Her shoes are blue.",
      "exampleJapanese": "彼女の靴は青いです。",
      "commonMistake": "Do not insert a vowel between b and l.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "🔵",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "blue"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l02-yellow",
    "category": "words",
    "level": 2,
    "title_en": "yellow",
    "title_ja": "黄色い",
    "content": {
      "word": "yellow",
      "japanese": "黄色い",
      "kanaReading": "イエロー",
      "pronunciationHint": "Begin with the consonant /j/, like “yes.”",
      "exampleSentence": "The yellow bus is here.",
      "exampleJapanese": "黄色いバスが来ました。",
      "commonMistake": "Do not begin with a Japanese-style strong イ sound.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "🟡",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "yellow"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l02-green",
    "category": "words",
    "level": 2,
    "title_en": "green",
    "title_ja": "緑の",
    "content": {
      "word": "green",
      "japanese": "緑の",
      "kanaReading": "グリーン",
      "pronunciationHint": "Blend /g/ and /r/, then hold /iː/.",
      "exampleSentence": "We saw a green bird.",
      "exampleJapanese": "私たちは緑の鳥を見ました。",
      "commonMistake": "Do not insert a vowel between g and r.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "🟢",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "green"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l02-black",
    "category": "words",
    "level": 2,
    "title_en": "black",
    "title_ja": "黒い",
    "content": {
      "word": "black",
      "japanese": "黒い",
      "kanaReading": "ブラック",
      "pronunciationHint": "Use /æ/ and end with a crisp /k/.",
      "exampleSentence": "He wears a black hat.",
      "exampleJapanese": "彼は黒い帽子をかぶっています。",
      "commonMistake": "Do not add a vowel after the final k.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "⚫",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "black"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l02-white",
    "category": "words",
    "level": 2,
    "title_en": "white",
    "title_ja": "白い",
    "content": {
      "word": "white",
      "japanese": "白い",
      "kanaReading": "ホワイト",
      "pronunciationHint": "Start with rounded lips for /w/ and finish with t.",
      "exampleSentence": "The wall is white.",
      "exampleJapanese": "壁は白いです。",
      "commonMistake": "Do not drop the final t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "⚪",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "white"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l02-circle",
    "category": "words",
    "level": 2,
    "title_en": "circle",
    "title_ja": "円・丸",
    "content": {
      "word": "circle",
      "japanese": "円・丸",
      "kanaReading": "サークル",
      "pronunciationHint": "Stress CIR; the second syllable is weak.",
      "exampleSentence": "Draw a circle around the answer.",
      "exampleJapanese": "答えを丸で囲んでください。",
      "commonMistake": "Do not pronounce the c as /k/ at the start.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "⭕",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "circle"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l02-square",
    "category": "words",
    "level": 2,
    "title_en": "square",
    "title_ja": "正方形",
    "content": {
      "word": "square",
      "japanese": "正方形",
      "kanaReading": "スクウェア",
      "pronunciationHint": "Say the /skw/ cluster as one smooth start.",
      "exampleSentence": "This shape is a square.",
      "exampleJapanese": "この形は正方形です。",
      "commonMistake": "Do not separate s, k, and w with vowels.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "🟥",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "square"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l02-star",
    "category": "words",
    "level": 2,
    "title_en": "star",
    "title_ja": "星",
    "content": {
      "word": "star",
      "japanese": "星",
      "kanaReading": "スター",
      "pronunciationHint": "Open with /st/ and hold the central vowel.",
      "exampleSentence": "That star is bright.",
      "exampleJapanese": "あの星は明るいです。",
      "commonMistake": "Do not insert a vowel between s and t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "⭐",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "star"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l02-line",
    "category": "words",
    "level": 2,
    "title_en": "line",
    "title_ja": "線・列",
    "content": {
      "word": "line",
      "japanese": "線・列",
      "kanaReading": "ライン",
      "pronunciationHint": "Use the /aɪ/ sound, as in “eye.”",
      "exampleSentence": "Stand in a straight line.",
      "exampleJapanese": "まっすぐ一列に並んでください。",
      "commonMistake": "Do not pronounce it like “lean.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "colors-and-shapes"
    },
    "icon": "➖",
    "tags": [
      "colors-and-shapes",
      "level-2",
      "line"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l03-mother",
    "category": "words",
    "level": 3,
    "title_en": "mother",
    "title_ja": "母・お母さん",
    "content": {
      "word": "mother",
      "japanese": "母・お母さん",
      "kanaReading": "マザー",
      "pronunciationHint": "Voice the middle th /ð/ as in “this.”",
      "exampleSentence": "My mother likes music.",
      "exampleJapanese": "私の母は音楽が好きです。",
      "commonMistake": "Do not use the unvoiced th from “think.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👩",
    "tags": [
      "family-and-people",
      "level-3",
      "mother"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l03-father",
    "category": "words",
    "level": 3,
    "title_en": "father",
    "title_ja": "父・お父さん",
    "content": {
      "word": "father",
      "japanese": "父・お父さん",
      "kanaReading": "ファーザー",
      "pronunciationHint": "Use a voiced /ð/ in the middle.",
      "exampleSentence": "My father cooks on Sunday.",
      "exampleJapanese": "私の父は日曜日に料理をします。",
      "commonMistake": "Do not replace th with a z sound.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👨",
    "tags": [
      "family-and-people",
      "level-3",
      "father"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l03-sister",
    "category": "words",
    "level": 3,
    "title_en": "sister",
    "title_ja": "姉・妹",
    "content": {
      "word": "sister",
      "japanese": "姉・妹",
      "kanaReading": "シスター",
      "pronunciationHint": "Stress SIS and keep the second vowel weak.",
      "exampleSentence": "My sister plays tennis.",
      "exampleJapanese": "私の姉はテニスをします。",
      "commonMistake": "Do not strongly pronounce both syllables.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👧",
    "tags": [
      "family-and-people",
      "level-3",
      "sister"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l03-brother",
    "category": "words",
    "level": 3,
    "title_en": "brother",
    "title_ja": "兄・弟",
    "content": {
      "word": "brother",
      "japanese": "兄・弟",
      "kanaReading": "ブラザー",
      "pronunciationHint": "Blend /b/ and /r/ and voice the th.",
      "exampleSentence": "Her brother is twelve.",
      "exampleJapanese": "彼女の弟は12歳です。",
      "commonMistake": "Do not insert a vowel between b and r.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👦",
    "tags": [
      "family-and-people",
      "level-3",
      "brother"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l03-grandmother",
    "category": "words",
    "level": 3,
    "title_en": "grandmother",
    "title_ja": "祖母・おばあさん",
    "content": {
      "word": "grandmother",
      "japanese": "祖母・おばあさん",
      "kanaReading": "グランドマザー",
      "pronunciationHint": "Stress GRAND. In natural speech, the d may be light or absent depending on the speaker.",
      "exampleSentence": "My grandmother tells funny stories.",
      "exampleJapanese": "私の祖母は面白い話をしてくれます。",
      "commonMistake": "Both /ɡrænd-/ and /ɡræn-/ are heard; do not force an extra vowel between the two parts.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👵",
    "tags": [
      "family-and-people",
      "level-3",
      "grandmother"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l03-grandfather",
    "category": "words",
    "level": 3,
    "title_en": "grandfather",
    "title_ja": "祖父・おじいさん",
    "content": {
      "word": "grandfather",
      "japanese": "祖父・おじいさん",
      "kanaReading": "グランドファーザー",
      "pronunciationHint": "Stress GRAND. The d is often light or absent before f in natural speech.",
      "exampleSentence": "His grandfather grows tomatoes.",
      "exampleJapanese": "彼の祖父はトマトを育てています。",
      "commonMistake": "Connect “grand” and “father” without a full pause, and use a voiced th in “father.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👴",
    "tags": [
      "family-and-people",
      "level-3",
      "grandfather"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l03-baby",
    "category": "words",
    "level": 3,
    "title_en": "baby",
    "title_ja": "赤ちゃん",
    "content": {
      "word": "baby",
      "japanese": "赤ちゃん",
      "kanaReading": "ベイビー",
      "pronunciationHint": "Stress BAY and use a long /eɪ/.",
      "exampleSentence": "The baby is sleeping.",
      "exampleJapanese": "赤ちゃんは眠っています。",
      "commonMistake": "Do not make the first vowel short.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👶",
    "tags": [
      "family-and-people",
      "level-3",
      "baby"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l03-friend",
    "category": "words",
    "level": 3,
    "title_en": "friend",
    "title_ja": "友達",
    "content": {
      "word": "friend",
      "japanese": "友達",
      "kanaReading": "フレンド",
      "pronunciationHint": "Blend /f/ and /r/ and keep the final d.",
      "exampleSentence": "Mika is my best friend.",
      "exampleJapanese": "ミカは私の親友です。",
      "commonMistake": "Do not add a vowel after the final d.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "🧑‍🤝‍🧑",
    "tags": [
      "family-and-people",
      "level-3",
      "friend"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l03-boy",
    "category": "words",
    "level": 3,
    "title_en": "boy",
    "title_ja": "男の子",
    "content": {
      "word": "boy",
      "japanese": "男の子",
      "kanaReading": "ボーイ",
      "pronunciationHint": "Glide smoothly through /ɔɪ/.",
      "exampleSentence": "The boy has a blue kite.",
      "exampleJapanese": "その男の子は青い凧を持っています。",
      "commonMistake": "Do not split the vowel into two syllables.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "🧒",
    "tags": [
      "family-and-people",
      "level-3",
      "boy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l03-girl",
    "category": "words",
    "level": 3,
    "title_en": "girl",
    "title_ja": "女の子",
    "content": {
      "word": "girl",
      "japanese": "女の子",
      "kanaReading": "ガール",
      "pronunciationHint": "Hold the central vowel and finish with l.",
      "exampleSentence": "The girl is reading.",
      "exampleJapanese": "その女の子は本を読んでいます。",
      "commonMistake": "Do not add a vowel after the final l.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "family-and-people"
    },
    "icon": "👧",
    "tags": [
      "family-and-people",
      "level-3",
      "girl"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l04-head",
    "category": "words",
    "level": 4,
    "title_en": "head",
    "title_ja": "頭",
    "content": {
      "word": "head",
      "japanese": "頭",
      "kanaReading": "ヘッド",
      "pronunciationHint": "Use the short /e/ sound in “bed.”",
      "exampleSentence": "Put the hat on your head.",
      "exampleJapanese": "帽子を頭にかぶってください。",
      "commonMistake": "Do not pronounce it like “heed.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "🙂",
    "tags": [
      "body",
      "level-4",
      "head"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l04-face",
    "category": "words",
    "level": 4,
    "title_en": "face",
    "title_ja": "顔",
    "content": {
      "word": "face",
      "japanese": "顔",
      "kanaReading": "フェイス",
      "pronunciationHint": "Use the long /eɪ/ sound and finish with /s/.",
      "exampleSentence": "Wash your face with warm water.",
      "exampleJapanese": "ぬるま湯で顔を洗ってください。",
      "commonMistake": "The final sound is /s/, not /z/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "😀",
    "tags": [
      "body",
      "level-4",
      "face"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l04-eye",
    "category": "words",
    "level": 4,
    "title_en": "eye",
    "title_ja": "目",
    "content": {
      "word": "eye",
      "japanese": "目",
      "kanaReading": "アイ",
      "pronunciationHint": "This is one vowel sound: /aɪ/.",
      "exampleSentence": "Something is in my eye.",
      "exampleJapanese": "目に何か入っています。",
      "commonMistake": "Do not add a y sound after the word.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "👁️",
    "tags": [
      "body",
      "level-4",
      "eye"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l04-ear",
    "category": "words",
    "level": 4,
    "title_en": "ear",
    "title_ja": "耳",
    "content": {
      "word": "ear",
      "japanese": "耳",
      "kanaReading": "イア",
      "pronunciationHint": "Begin with /ɪ/ and glide gently toward r.",
      "exampleSentence": "My left ear hurts.",
      "exampleJapanese": "左耳が痛いです。",
      "commonMistake": "Do not pronounce it the same as “year.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "👂",
    "tags": [
      "body",
      "level-4",
      "ear"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l04-nose",
    "category": "words",
    "level": 4,
    "title_en": "nose",
    "title_ja": "鼻",
    "content": {
      "word": "nose",
      "japanese": "鼻",
      "kanaReading": "ノウズ",
      "pronunciationHint": "Use /oʊ/ and a voiced final /z/.",
      "exampleSentence": "The dog has a wet nose.",
      "exampleJapanese": "その犬は鼻がぬれています。",
      "commonMistake": "The final sound is /z/, not /s/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "👃",
    "tags": [
      "body",
      "level-4",
      "nose"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l04-mouth",
    "category": "words",
    "level": 4,
    "title_en": "mouth",
    "title_ja": "口",
    "content": {
      "word": "mouth",
      "japanese": "口",
      "kanaReading": "マウス",
      "pronunciationHint": "End with the unvoiced th /θ/.",
      "exampleSentence": "Open your mouth wide.",
      "exampleJapanese": "口を大きく開けてください。",
      "commonMistake": "Do not pronounce it like the computer “mouse.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "👄",
    "tags": [
      "body",
      "level-4",
      "mouth"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l04-hand",
    "category": "words",
    "level": 4,
    "title_en": "hand",
    "title_ja": "手",
    "content": {
      "word": "hand",
      "japanese": "手",
      "kanaReading": "ハンド",
      "pronunciationHint": "Use /æ/ and keep the final d.",
      "exampleSentence": "Raise your hand if you know.",
      "exampleJapanese": "分かったら手を挙げてください。",
      "commonMistake": "Do not drop the final d.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "✋",
    "tags": [
      "body",
      "level-4",
      "hand"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l04-foot",
    "category": "words",
    "level": 4,
    "title_en": "foot",
    "title_ja": "足・足首から下",
    "content": {
      "word": "foot",
      "japanese": "足・足首から下",
      "kanaReading": "フット",
      "pronunciationHint": "Use short /ʊ/, not long /uː/.",
      "exampleSentence": "My right foot is cold.",
      "exampleJapanese": "右足が冷たいです。",
      "commonMistake": "The plural is “feet,” not “foots.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "🦶",
    "tags": [
      "body",
      "level-4",
      "foot"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l04-arm",
    "category": "words",
    "level": 4,
    "title_en": "arm",
    "title_ja": "腕",
    "content": {
      "word": "arm",
      "japanese": "腕",
      "kanaReading": "アーム",
      "pronunciationHint": "Hold the vowel; pronounce r lightly in US English.",
      "exampleSentence": "She carried the box in one arm.",
      "exampleJapanese": "彼女は片腕で箱を運びました。",
      "commonMistake": "Do not confuse “arm” with “hand.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "💪",
    "tags": [
      "body",
      "level-4",
      "arm"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l04-leg",
    "category": "words",
    "level": 4,
    "title_en": "leg",
    "title_ja": "脚",
    "content": {
      "word": "leg",
      "japanese": "脚",
      "kanaReading": "レッグ",
      "pronunciationHint": "Use a short /e/ and a firm final g.",
      "exampleSentence": "Stretch each leg slowly.",
      "exampleJapanese": "両脚をゆっくり伸ばしてください。",
      "commonMistake": "Do not add a vowel after the final g.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "body"
    },
    "icon": "🦵",
    "tags": [
      "body",
      "level-4",
      "leg"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l05-rice",
    "category": "words",
    "level": 5,
    "title_en": "rice",
    "title_ja": "ご飯・米",
    "content": {
      "word": "rice",
      "japanese": "ご飯・米",
      "kanaReading": "ライス",
      "pronunciationHint": "Use /aɪ/ and finish with /s/.",
      "exampleSentence": "We eat rice with dinner.",
      "exampleJapanese": "私たちは夕食にご飯を食べます。",
      "commonMistake": "“Rice” is normally uncountable; avoid “a rice.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🍚",
    "tags": [
      "food-and-drink",
      "level-5",
      "rice"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l05-bread",
    "category": "words",
    "level": 5,
    "title_en": "bread",
    "title_ja": "パン",
    "content": {
      "word": "bread",
      "japanese": "パン",
      "kanaReading": "ブレッド",
      "pronunciationHint": "Use the short /e/ in “bed.”",
      "exampleSentence": "I made toast with this bread.",
      "exampleJapanese": "このパンでトーストを作りました。",
      "commonMistake": "“Bread” is uncountable; say “a slice of bread.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🍞",
    "tags": [
      "food-and-drink",
      "level-5",
      "bread"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l05-egg",
    "category": "words",
    "level": 5,
    "title_en": "egg",
    "title_ja": "卵",
    "content": {
      "word": "egg",
      "japanese": "卵",
      "kanaReading": "エッグ",
      "pronunciationHint": "Start with a short /e/ and finish with g.",
      "exampleSentence": "Would you like an egg?",
      "exampleJapanese": "卵はいかがですか。",
      "commonMistake": "Use “an,” not “a,” before “egg.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🥚",
    "tags": [
      "food-and-drink",
      "level-5",
      "egg"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l05-milk",
    "category": "words",
    "level": 5,
    "title_en": "milk",
    "title_ja": "牛乳",
    "content": {
      "word": "milk",
      "japanese": "牛乳",
      "kanaReading": "ミルク",
      "pronunciationHint": "Finish with the /lk/ cluster without an extra vowel.",
      "exampleSentence": "Please put the milk in the fridge.",
      "exampleJapanese": "牛乳を冷蔵庫に入れてください。",
      "commonMistake": "“Milk” is usually uncountable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🥛",
    "tags": [
      "food-and-drink",
      "level-5",
      "milk"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l05-water",
    "category": "words",
    "level": 5,
    "title_en": "water",
    "title_ja": "水",
    "content": {
      "word": "water",
      "japanese": "水",
      "kanaReading": "ウォーター",
      "pronunciationHint": "In US speech, the middle t often sounds like a quick d.",
      "exampleSentence": "Could I have some water?",
      "exampleJapanese": "お水をいただけますか。",
      "commonMistake": "Do not say “a water” unless you mean one serving.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "💧",
    "tags": [
      "food-and-drink",
      "level-5",
      "water"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l05-apple",
    "category": "words",
    "level": 5,
    "title_en": "apple",
    "title_ja": "りんご",
    "content": {
      "word": "apple",
      "japanese": "りんご",
      "kanaReading": "アップル",
      "pronunciationHint": "Stress AP and use /æ/ at the start.",
      "exampleSentence": "I cut the apple in half.",
      "exampleJapanese": "りんごを半分に切りました。",
      "commonMistake": "Use “an apple,” not “a apple.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🍎",
    "tags": [
      "food-and-drink",
      "level-5",
      "apple"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l05-banana",
    "category": "words",
    "level": 5,
    "title_en": "banana",
    "title_ja": "バナナ",
    "content": {
      "word": "banana",
      "japanese": "バナナ",
      "kanaReading": "バナナ",
      "pronunciationHint": "Stress the middle syllable: ba-NA-na.",
      "exampleSentence": "This banana is very sweet.",
      "exampleJapanese": "このバナナはとても甘いです。",
      "commonMistake": "Do not stress the first syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🍌",
    "tags": [
      "food-and-drink",
      "level-5",
      "banana"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l05-chicken",
    "category": "words",
    "level": 5,
    "title_en": "chicken",
    "title_ja": "鶏肉・にわとり",
    "content": {
      "word": "chicken",
      "japanese": "鶏肉・にわとり",
      "kanaReading": "チキン",
      "pronunciationHint": "Stress CHICK; the second vowel is weak.",
      "exampleSentence": "We had chicken for lunch.",
      "exampleJapanese": "昼食に鶏肉を食べました。",
      "commonMistake": "Use “chicken” without “a” when you mean the food.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🍗",
    "tags": [
      "food-and-drink",
      "level-5",
      "chicken"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l05-fish",
    "category": "words",
    "level": 5,
    "title_en": "fish",
    "title_ja": "魚",
    "content": {
      "word": "fish",
      "japanese": "魚",
      "kanaReading": "フィッシュ",
      "pronunciationHint": "Finish with the /ʃ/ sound.",
      "exampleSentence": "The fish is fresh today.",
      "exampleJapanese": "今日の魚は新鮮です。",
      "commonMistake": "The usual plural can be “fish,” not always “fishes.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🐟",
    "tags": [
      "food-and-drink",
      "level-5",
      "fish"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l05-soup",
    "category": "words",
    "level": 5,
    "title_en": "soup",
    "title_ja": "スープ",
    "content": {
      "word": "soup",
      "japanese": "スープ",
      "kanaReading": "スープ",
      "pronunciationHint": "Hold the /uː/ vowel and finish with p.",
      "exampleSentence": "The soup smells wonderful.",
      "exampleJapanese": "そのスープはとてもいい香りです。",
      "commonMistake": "Do not add a vowel after the final p.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "food-and-drink"
    },
    "icon": "🥣",
    "tags": [
      "food-and-drink",
      "level-5",
      "soup"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l06-house",
    "category": "words",
    "level": 6,
    "title_en": "house",
    "title_ja": "家・住宅",
    "content": {
      "word": "house",
      "japanese": "家・住宅",
      "kanaReading": "ハウス",
      "pronunciationHint": "Glide through /aʊ/ and end with /s/.",
      "exampleSentence": "Their house has a small garden.",
      "exampleJapanese": "彼らの家には小さな庭があります。",
      "commonMistake": "Use “home” for the idea of where you live, not always “house.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🏠",
    "tags": [
      "home",
      "level-6",
      "house"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l06-room",
    "category": "words",
    "level": 6,
    "title_en": "room",
    "title_ja": "部屋",
    "content": {
      "word": "room",
      "japanese": "部屋",
      "kanaReading": "ルーム",
      "pronunciationHint": "Hold the long /uː/ sound.",
      "exampleSentence": "My room is upstairs.",
      "exampleJapanese": "私の部屋は2階です。",
      "commonMistake": "Say “in my room,” not “at my room.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🚪",
    "tags": [
      "home",
      "level-6",
      "room"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l06-kitchen",
    "category": "words",
    "level": 6,
    "title_en": "kitchen",
    "title_ja": "台所・キッチン",
    "content": {
      "word": "kitchen",
      "japanese": "台所・キッチン",
      "kanaReading": "キッチン",
      "pronunciationHint": "Stress KITCH; the final vowel is weak.",
      "exampleSentence": "Dad is cooking in the kitchen.",
      "exampleJapanese": "父は台所で料理をしています。",
      "commonMistake": "Do not pronounce the t as a separate syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🍳",
    "tags": [
      "home",
      "level-6",
      "kitchen"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l06-bathroom",
    "category": "words",
    "level": 6,
    "title_en": "bathroom",
    "title_ja": "浴室・トイレ",
    "content": {
      "word": "bathroom",
      "japanese": "浴室・トイレ",
      "kanaReading": "バスルーム",
      "pronunciationHint": "Use the unvoiced th /θ/ in “bath.”",
      "exampleSentence": "The bathroom is down the hall.",
      "exampleJapanese": "浴室は廊下の先です。",
      "commonMistake": "In US English, “bathroom” may also mean a toilet room.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🛁",
    "tags": [
      "home",
      "level-6",
      "bathroom"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l06-bedroom",
    "category": "words",
    "level": 6,
    "title_en": "bedroom",
    "title_ja": "寝室",
    "content": {
      "word": "bedroom",
      "japanese": "寝室",
      "kanaReading": "ベッドルーム",
      "pronunciationHint": "Stress BED and connect the two parts.",
      "exampleSentence": "The bedroom gets morning sun.",
      "exampleJapanese": "寝室には朝日が入ります。",
      "commonMistake": "Do not separate “bed” and “room” with a long pause.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🛏️",
    "tags": [
      "home",
      "level-6",
      "bedroom"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l06-bed",
    "category": "words",
    "level": 6,
    "title_en": "bed",
    "title_ja": "ベッド",
    "content": {
      "word": "bed",
      "japanese": "ベッド",
      "kanaReading": "ベッド",
      "pronunciationHint": "Use short /e/ and keep the final d.",
      "exampleSentence": "I went to bed early.",
      "exampleJapanese": "私は早く寝ました。",
      "commonMistake": "Say “go to bed” without “the” for sleeping.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🛏️",
    "tags": [
      "home",
      "level-6",
      "bed"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l06-table",
    "category": "words",
    "level": 6,
    "title_en": "table",
    "title_ja": "テーブル",
    "content": {
      "word": "table",
      "japanese": "テーブル",
      "kanaReading": "テイブル",
      "pronunciationHint": "Stress TAY; the second syllable is weak.",
      "exampleSentence": "Dinner is on the table.",
      "exampleJapanese": "夕食はテーブルの上です。",
      "commonMistake": "Do not pronounce the final e.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🪵",
    "tags": [
      "home",
      "level-6",
      "table"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l06-lamp",
    "category": "words",
    "level": 6,
    "title_en": "lamp",
    "title_ja": "ランプ",
    "content": {
      "word": "lamp",
      "japanese": "ランプ",
      "kanaReading": "ランプ",
      "pronunciationHint": "Use /æ/ and close both lips for final p.",
      "exampleSentence": "Turn off the lamp before bed.",
      "exampleJapanese": "寝る前にランプを消してください。",
      "commonMistake": "Do not drop the final p.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "💡",
    "tags": [
      "home",
      "level-6",
      "lamp"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l06-key",
    "category": "words",
    "level": 6,
    "title_en": "key",
    "title_ja": "鍵",
    "content": {
      "word": "key",
      "japanese": "鍵",
      "kanaReading": "キー",
      "pronunciationHint": "Use a long /iː/ vowel.",
      "exampleSentence": "I cannot find my key.",
      "exampleJapanese": "鍵が見つかりません。",
      "commonMistake": "“Key” and “quay” can sound the same, but meanings differ.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🔑",
    "tags": [
      "home",
      "level-6",
      "key"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l06-clock",
    "category": "words",
    "level": 6,
    "title_en": "clock",
    "title_ja": "時計",
    "content": {
      "word": "clock",
      "japanese": "時計",
      "kanaReading": "クロック",
      "pronunciationHint": "Blend /k/ and /l/ and use a short vowel.",
      "exampleSentence": "The clock is five minutes fast.",
      "exampleJapanese": "その時計は5分進んでいます。",
      "commonMistake": "Use “watch” for one worn on the wrist.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "home"
    },
    "icon": "🕰️",
    "tags": [
      "home",
      "level-6",
      "clock"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l07-dog",
    "category": "words",
    "level": 7,
    "title_en": "dog",
    "title_ja": "犬",
    "content": {
      "word": "dog",
      "japanese": "犬",
      "kanaReading": "ドッグ",
      "pronunciationHint": "Use an open vowel and finish with a voiced g.",
      "exampleSentence": "Our dog loves the park.",
      "exampleJapanese": "うちの犬は公園が大好きです。",
      "commonMistake": "Do not add a vowel after the final g.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐕",
    "tags": [
      "animals",
      "level-7",
      "dog"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l07-cat",
    "category": "words",
    "level": 7,
    "title_en": "cat",
    "title_ja": "猫",
    "content": {
      "word": "cat",
      "japanese": "猫",
      "kanaReading": "キャット",
      "pronunciationHint": "Use the open /æ/ vowel and a crisp final t.",
      "exampleSentence": "The cat is under the sofa.",
      "exampleJapanese": "猫はソファの下にいます。",
      "commonMistake": "Do not pronounce it like “cut.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐈",
    "tags": [
      "animals",
      "level-7",
      "cat"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l07-bird",
    "category": "words",
    "level": 7,
    "title_en": "bird",
    "title_ja": "鳥",
    "content": {
      "word": "bird",
      "japanese": "鳥",
      "kanaReading": "バード",
      "pronunciationHint": "Hold the r-colored vowel in US English.",
      "exampleSentence": "A bird is singing outside.",
      "exampleJapanese": "外で鳥が鳴いています。",
      "commonMistake": "Do not add a vowel after the final d.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐦",
    "tags": [
      "animals",
      "level-7",
      "bird"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l07-rabbit",
    "category": "words",
    "level": 7,
    "title_en": "rabbit",
    "title_ja": "うさぎ",
    "content": {
      "word": "rabbit",
      "japanese": "うさぎ",
      "kanaReading": "ラビット",
      "pronunciationHint": "Stress RAB; the second vowel is weak.",
      "exampleSentence": "The rabbit has long ears.",
      "exampleJapanese": "そのうさぎは耳が長いです。",
      "commonMistake": "Do not double the spoken b just because spelling has two.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐇",
    "tags": [
      "animals",
      "level-7",
      "rabbit"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l07-horse",
    "category": "words",
    "level": 7,
    "title_en": "horse",
    "title_ja": "馬",
    "content": {
      "word": "horse",
      "japanese": "馬",
      "kanaReading": "ホース",
      "pronunciationHint": "Keep the h and finish with /s/.",
      "exampleSentence": "The horse ran across the field.",
      "exampleJapanese": "馬は野原を走りました。",
      "commonMistake": "Do not confuse it with “hose”: the vowel and final sound differ, and UK English may not pronounce the r in “horse.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐎",
    "tags": [
      "animals",
      "level-7",
      "horse"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l07-cow",
    "category": "words",
    "level": 7,
    "title_en": "cow",
    "title_ja": "牛",
    "content": {
      "word": "cow",
      "japanese": "牛",
      "kanaReading": "カウ",
      "pronunciationHint": "Use one smooth /aʊ/ glide.",
      "exampleSentence": "The cow is eating grass.",
      "exampleJapanese": "牛は草を食べています。",
      "commonMistake": "Do not stretch it into two syllables.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐄",
    "tags": [
      "animals",
      "level-7",
      "cow"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l07-sheep",
    "category": "words",
    "level": 7,
    "title_en": "sheep",
    "title_ja": "羊",
    "content": {
      "word": "sheep",
      "japanese": "羊",
      "kanaReading": "シープ",
      "pronunciationHint": "Use /ʃ/ and a long /iː/.",
      "exampleSentence": "Three sheep are near the fence.",
      "exampleJapanese": "3匹の羊が柵のそばにいます。",
      "commonMistake": "The plural is “sheep,” not “sheeps.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐑",
    "tags": [
      "animals",
      "level-7",
      "sheep"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l07-pig",
    "category": "words",
    "level": 7,
    "title_en": "pig",
    "title_ja": "豚",
    "content": {
      "word": "pig",
      "japanese": "豚",
      "kanaReading": "ピッグ",
      "pronunciationHint": "Use a short /ɪ/ and final voiced g.",
      "exampleSentence": "The pig rolled in the mud.",
      "exampleJapanese": "豚は泥の中を転がりました。",
      "commonMistake": "Do not pronounce it like “peak.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐖",
    "tags": [
      "animals",
      "level-7",
      "pig"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l07-lion",
    "category": "words",
    "level": 7,
    "title_en": "lion",
    "title_ja": "ライオン",
    "content": {
      "word": "lion",
      "japanese": "ライオン",
      "kanaReading": "ライオン",
      "pronunciationHint": "Stress LI and make the ending two light sounds.",
      "exampleSentence": "The lion rested in the shade.",
      "exampleJapanese": "ライオンは日陰で休みました。",
      "commonMistake": "Do not pronounce it as only one syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🦁",
    "tags": [
      "animals",
      "level-7",
      "lion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l07-elephant",
    "category": "words",
    "level": 7,
    "title_en": "elephant",
    "title_ja": "象",
    "content": {
      "word": "elephant",
      "japanese": "象",
      "kanaReading": "エレファント",
      "pronunciationHint": "Stress EL; keep the other syllables lighter.",
      "exampleSentence": "An elephant can use its trunk like a hand.",
      "exampleJapanese": "象は鼻を手のように使えます。",
      "commonMistake": "Do not stress the final syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "animals"
    },
    "icon": "🐘",
    "tags": [
      "animals",
      "level-7",
      "elephant"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l08-run",
    "category": "words",
    "level": 8,
    "title_en": "run",
    "title_ja": "走る",
    "content": {
      "word": "run",
      "japanese": "走る",
      "kanaReading": "ラン",
      "pronunciationHint": "Use the short /ʌ/ vowel.",
      "exampleSentence": "I run around the park each morning.",
      "exampleJapanese": "私は毎朝公園を走ります。",
      "commonMistake": "The past form is “ran,” not “runned.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🏃",
    "tags": [
      "basic-actions",
      "level-8",
      "run"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l08-walk",
    "category": "words",
    "level": 8,
    "title_en": "walk",
    "title_ja": "歩く",
    "content": {
      "word": "walk",
      "japanese": "歩く",
      "kanaReading": "ウォーク",
      "pronunciationHint": "The l is silent; use a broad vowel.",
      "exampleSentence": "We walk to school together.",
      "exampleJapanese": "私たちは一緒に歩いて学校へ行きます。",
      "commonMistake": "Do not pronounce the written l.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🚶",
    "tags": [
      "basic-actions",
      "level-8",
      "walk"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l08-jump",
    "category": "words",
    "level": 8,
    "title_en": "jump",
    "title_ja": "跳ぶ",
    "content": {
      "word": "jump",
      "japanese": "跳ぶ",
      "kanaReading": "ジャンプ",
      "pronunciationHint": "Finish with the /mp/ cluster.",
      "exampleSentence": "Can you jump over this line?",
      "exampleJapanese": "この線を跳び越えられますか。",
      "commonMistake": "Do not add a vowel after p.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🤸",
    "tags": [
      "basic-actions",
      "level-8",
      "jump"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l08-sit",
    "category": "words",
    "level": 8,
    "title_en": "sit",
    "title_ja": "座る",
    "content": {
      "word": "sit",
      "japanese": "座る",
      "kanaReading": "シット",
      "pronunciationHint": "Use short /ɪ/ and a final t.",
      "exampleSentence": "Please sit next to me.",
      "exampleJapanese": "私の隣に座ってください。",
      "commonMistake": "“Sit” is intransitive; do not use it as “seat someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🧘",
    "tags": [
      "basic-actions",
      "level-8",
      "sit"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l08-stand",
    "category": "words",
    "level": 8,
    "title_en": "stand",
    "title_ja": "立つ",
    "content": {
      "word": "stand",
      "japanese": "立つ",
      "kanaReading": "スタンド",
      "pronunciationHint": "Blend /st/ and keep the final d.",
      "exampleSentence": "Stand near the yellow sign.",
      "exampleJapanese": "黄色い標識の近くに立ってください。",
      "commonMistake": "“Stand up” is natural when focusing on the movement; “stand” alone can describe the position or give a concise instruction.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🧍",
    "tags": [
      "basic-actions",
      "level-8",
      "stand"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l08-open",
    "category": "words",
    "level": 8,
    "title_en": "open",
    "title_ja": "開ける・開いている",
    "content": {
      "word": "open",
      "japanese": "開ける・開いている",
      "kanaReading": "オウプン",
      "pronunciationHint": "Stress O; the second vowel is weak.",
      "exampleSentence": "Open the box carefully.",
      "exampleJapanese": "箱を注意して開けてください。",
      "commonMistake": "Do not use “open” where “turn on” is needed for a device.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "📂",
    "tags": [
      "basic-actions",
      "level-8",
      "open"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l08-close",
    "category": "words",
    "level": 8,
    "title_en": "close",
    "title_ja": "閉める・近い",
    "content": {
      "word": "close",
      "japanese": "閉める・近い",
      "kanaReading": "クロウズ",
      "pronunciationHint": "As a verb, finish with voiced /z/.",
      "exampleSentence": "Close the gate behind you.",
      "exampleJapanese": "後ろの門を閉めてください。",
      "commonMistake": "The adjective “close” meaning near ends with /s/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🔒",
    "tags": [
      "basic-actions",
      "level-8",
      "close"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l08-read",
    "category": "words",
    "level": 8,
    "title_en": "read",
    "title_ja": "読む",
    "content": {
      "word": "read",
      "japanese": "読む",
      "kanaReading": "リード",
      "pronunciationHint": "The present form rhymes with “need.”",
      "exampleSentence": "I read one page every night.",
      "exampleJapanese": "私は毎晩1ページ読みます。",
      "commonMistake": "The past spelling is the same but is pronounced “red.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "📖",
    "tags": [
      "basic-actions",
      "level-8",
      "read"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l08-write",
    "category": "words",
    "level": 8,
    "title_en": "write",
    "title_ja": "書く",
    "content": {
      "word": "write",
      "japanese": "書く",
      "kanaReading": "ライト",
      "pronunciationHint": "The initial w is silent.",
      "exampleSentence": "Write your name at the top.",
      "exampleJapanese": "上に名前を書いてください。",
      "commonMistake": "Do not pronounce the initial w.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "✍️",
    "tags": [
      "basic-actions",
      "level-8",
      "write"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l08-listen",
    "category": "words",
    "level": 8,
    "title_en": "listen",
    "title_ja": "聞く・耳を傾ける",
    "content": {
      "word": "listen",
      "japanese": "聞く・耳を傾ける",
      "kanaReading": "リスン",
      "pronunciationHint": "The t is silent.",
      "exampleSentence": "Listen to the whole sentence.",
      "exampleJapanese": "文全体を聞いてください。",
      "commonMistake": "Use “listen to,” not “listen music.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "basic-actions"
    },
    "icon": "🎧",
    "tags": [
      "basic-actions",
      "level-8",
      "listen"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l09-happy",
    "category": "words",
    "level": 9,
    "title_en": "happy",
    "title_ja": "うれしい・幸せな",
    "content": {
      "word": "happy",
      "japanese": "うれしい・幸せな",
      "kanaReading": "ハッピー",
      "pronunciationHint": "Stress HAP and use /æ/.",
      "exampleSentence": "I feel happy when we cook together.",
      "exampleJapanese": "一緒に料理をすると私はうれしいです。",
      "commonMistake": "Say “I am happy,” not “I happy.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "😊",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "happy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l09-sad",
    "category": "words",
    "level": 9,
    "title_en": "sad",
    "title_ja": "悲しい",
    "content": {
      "word": "sad",
      "japanese": "悲しい",
      "kanaReading": "サッド",
      "pronunciationHint": "Use the open /æ/ vowel.",
      "exampleSentence": "She felt sad after the movie.",
      "exampleJapanese": "彼女は映画の後で悲しくなりました。",
      "commonMistake": "Use “feel sad,” not “feel sadly,” for your condition.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "😢",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "sad"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l09-tired",
    "category": "words",
    "level": 9,
    "title_en": "tired",
    "title_ja": "疲れた",
    "content": {
      "word": "tired",
      "japanese": "疲れた",
      "kanaReading": "タイアード",
      "pronunciationHint": "Usually one smooth syllable in natural speech.",
      "exampleSentence": "We were tired after the long walk.",
      "exampleJapanese": "長く歩いた後、私たちは疲れていました。",
      "commonMistake": "Use “tired” for your feeling and “tiring” for the cause.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "🥱",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "tired"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l09-angry",
    "category": "words",
    "level": 9,
    "title_en": "angry",
    "title_ja": "怒っている",
    "content": {
      "word": "angry",
      "japanese": "怒っている",
      "kanaReading": "アングリー",
      "pronunciationHint": "Stress ANG and pronounce the g.",
      "exampleSentence": "He was angry about the broken promise.",
      "exampleJapanese": "彼は約束が破られたことに怒っていました。",
      "commonMistake": "Use “angry with someone” or “angry about something.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "😠",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "angry"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l09-scared",
    "category": "words",
    "level": 9,
    "title_en": "scared",
    "title_ja": "怖がっている",
    "content": {
      "word": "scared",
      "japanese": "怖がっている",
      "kanaReading": "スケアード",
      "pronunciationHint": "Blend /sk/ and finish with d.",
      "exampleSentence": "The child is scared of thunder.",
      "exampleJapanese": "その子は雷を怖がっています。",
      "commonMistake": "Say “scared of,” not “scared from.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "😨",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "scared"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l09-excited",
    "category": "words",
    "level": 9,
    "title_en": "excited",
    "title_ja": "わくわくした",
    "content": {
      "word": "excited",
      "japanese": "わくわくした",
      "kanaReading": "イクサイティッド",
      "pronunciationHint": "Stress CI: ex-CI-ted.",
      "exampleSentence": "I am excited about the school trip.",
      "exampleJapanese": "私は遠足を楽しみにしています。",
      "commonMistake": "Use “excited” for a person and “exciting” for an event.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "🤩",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "excited"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l09-hungry",
    "category": "words",
    "level": 9,
    "title_en": "hungry",
    "title_ja": "お腹が空いた",
    "content": {
      "word": "hungry",
      "japanese": "お腹が空いた",
      "kanaReading": "ハングリー",
      "pronunciationHint": "Stress HUN and pronounce ng as one sound.",
      "exampleSentence": "I am hungry after swimming.",
      "exampleJapanese": "泳いだ後はお腹が空きます。",
      "commonMistake": "Say “I am hungry,” not “I have hungry.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "😋",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "hungry"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l09-thirsty",
    "category": "words",
    "level": 9,
    "title_en": "thirsty",
    "title_ja": "喉が渇いた",
    "content": {
      "word": "thirsty",
      "japanese": "喉が渇いた",
      "kanaReading": "サースティー",
      "pronunciationHint": "Begin with unvoiced th /θ/.",
      "exampleSentence": "Are you thirsty after practice?",
      "exampleJapanese": "練習の後、喉が渇いていますか。",
      "commonMistake": "Do not replace th with s.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "🥤",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "thirsty"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l09-sick",
    "category": "words",
    "level": 9,
    "title_en": "sick",
    "title_ja": "具合が悪い",
    "content": {
      "word": "sick",
      "japanese": "具合が悪い",
      "kanaReading": "シック",
      "pronunciationHint": "Use short /ɪ/ and a final k.",
      "exampleSentence": "I stayed home because I was sick.",
      "exampleJapanese": "具合が悪かったので家にいました。",
      "commonMistake": "In British English, “be sick” can also mean vomit.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "🤒",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "sick"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l09-fine",
    "category": "words",
    "level": 9,
    "title_en": "fine",
    "title_ja": "元気な・大丈夫な",
    "content": {
      "word": "fine",
      "japanese": "元気な・大丈夫な",
      "kanaReading": "ファイン",
      "pronunciationHint": "Use the /aɪ/ vowel.",
      "exampleSentence": "I am fine now, thank you.",
      "exampleJapanese": "今は大丈夫です、ありがとう。",
      "commonMistake": "“Fine” can sound merely okay, not always excellent.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "feelings-and-needs"
    },
    "icon": "🙂",
    "tags": [
      "feelings-and-needs",
      "level-9",
      "fine"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l10-sunny",
    "category": "words",
    "level": 10,
    "title_en": "sunny",
    "title_ja": "晴れた",
    "content": {
      "word": "sunny",
      "japanese": "晴れた",
      "kanaReading": "サニー",
      "pronunciationHint": "Stress SUN; the final y is /i/.",
      "exampleSentence": "It will be sunny this afternoon.",
      "exampleJapanese": "今日の午後は晴れるでしょう。",
      "commonMistake": "Use “sunny,” not “sun,” after “It is.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "☀️",
    "tags": [
      "weather-and-nature",
      "level-10",
      "sunny"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l10-rainy",
    "category": "words",
    "level": 10,
    "title_en": "rainy",
    "title_ja": "雨の",
    "content": {
      "word": "rainy",
      "japanese": "雨の",
      "kanaReading": "レイニー",
      "pronunciationHint": "Use the long /eɪ/ in the first syllable.",
      "exampleSentence": "We need boots on rainy days.",
      "exampleJapanese": "雨の日には長靴が必要です。",
      "commonMistake": "Use “rainy” for weather and “raining” for the action now.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🌧️",
    "tags": [
      "weather-and-nature",
      "level-10",
      "rainy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l10-cloudy",
    "category": "words",
    "level": 10,
    "title_en": "cloudy",
    "title_ja": "曇った",
    "content": {
      "word": "cloudy",
      "japanese": "曇った",
      "kanaReading": "クラウディー",
      "pronunciationHint": "Blend /kl/ and glide through /aʊ/.",
      "exampleSentence": "The sky became cloudy before lunch.",
      "exampleJapanese": "昼食前に空が曇りました。",
      "commonMistake": "Do not use “cloud” directly after “It is.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "☁️",
    "tags": [
      "weather-and-nature",
      "level-10",
      "cloudy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l10-windy",
    "category": "words",
    "level": 10,
    "title_en": "windy",
    "title_ja": "風が強い",
    "content": {
      "word": "windy",
      "japanese": "風が強い",
      "kanaReading": "ウィンディー",
      "pronunciationHint": "Stress WIN; keep the d audible.",
      "exampleSentence": "It is too windy for a picnic.",
      "exampleJapanese": "風が強すぎてピクニックには向きません。",
      "commonMistake": "Do not confuse “windy” with “winding.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🌬️",
    "tags": [
      "weather-and-nature",
      "level-10",
      "windy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l10-hot",
    "category": "words",
    "level": 10,
    "title_en": "hot",
    "title_ja": "暑い・熱い",
    "content": {
      "word": "hot",
      "japanese": "暑い・熱い",
      "kanaReading": "ホット",
      "pronunciationHint": "Use a short open vowel.",
      "exampleSentence": "The sand is hot in the sun.",
      "exampleJapanese": "日なたの砂は熱いです。",
      "commonMistake": "Use “hot” for temperature, not “high.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🥵",
    "tags": [
      "weather-and-nature",
      "level-10",
      "hot"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l10-cold",
    "category": "words",
    "level": 10,
    "title_en": "cold",
    "title_ja": "寒い・冷たい",
    "content": {
      "word": "cold",
      "japanese": "寒い・冷たい",
      "kanaReading": "コウルド",
      "pronunciationHint": "Use /oʊ/ and keep the /ld/ ending.",
      "exampleSentence": "My hands are cold.",
      "exampleJapanese": "手が冷たいです。",
      "commonMistake": "Say “I am cold” for your feeling, not “I have cold.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🥶",
    "tags": [
      "weather-and-nature",
      "level-10",
      "cold"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l10-sky",
    "category": "words",
    "level": 10,
    "title_en": "sky",
    "title_ja": "空",
    "content": {
      "word": "sky",
      "japanese": "空",
      "kanaReading": "スカイ",
      "pronunciationHint": "Blend /sk/ before /aɪ/.",
      "exampleSentence": "The evening sky turned pink.",
      "exampleJapanese": "夕方の空がピンク色になりました。",
      "commonMistake": "Use “in the sky,” not usually “on the sky.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🌌",
    "tags": [
      "weather-and-nature",
      "level-10",
      "sky"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l10-sun",
    "category": "words",
    "level": 10,
    "title_en": "sun",
    "title_ja": "太陽",
    "content": {
      "word": "sun",
      "japanese": "太陽",
      "kanaReading": "サン",
      "pronunciationHint": "Use the short /ʌ/ vowel.",
      "exampleSentence": "The sun rises in the east.",
      "exampleJapanese": "太陽は東から昇ります。",
      "commonMistake": "Use “the sun” with the definite article.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🌞",
    "tags": [
      "weather-and-nature",
      "level-10",
      "sun"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l10-moon",
    "category": "words",
    "level": 10,
    "title_en": "moon",
    "title_ja": "月",
    "content": {
      "word": "moon",
      "japanese": "月",
      "kanaReading": "ムーン",
      "pronunciationHint": "Hold the long /uː/ vowel.",
      "exampleSentence": "The moon looks large tonight.",
      "exampleJapanese": "今夜は月が大きく見えます。",
      "commonMistake": "Use “the moon” when referring to Earth’s moon.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "🌙",
    "tags": [
      "weather-and-nature",
      "level-10",
      "moon"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l10-snow",
    "category": "words",
    "level": 10,
    "title_en": "snow",
    "title_ja": "雪",
    "content": {
      "word": "snow",
      "japanese": "雪",
      "kanaReading": "スノウ",
      "pronunciationHint": "Blend /sn/ and glide through /oʊ/.",
      "exampleSentence": "Fresh snow covered the road.",
      "exampleJapanese": "新雪が道路を覆いました。",
      "commonMistake": "“Snow” is usually uncountable; avoid “a snow.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "weather-and-nature"
    },
    "icon": "❄️",
    "tags": [
      "weather-and-nature",
      "level-10",
      "snow"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l11-morning",
    "category": "words",
    "level": 11,
    "title_en": "morning",
    "title_ja": "朝",
    "content": {
      "word": "morning",
      "japanese": "朝",
      "kanaReading": "モーニング",
      "pronunciationHint": "Stress MORN; the ending is weak.",
      "exampleSentence": "I study English every morning.",
      "exampleJapanese": "私は毎朝英語を勉強します。",
      "commonMistake": "Say “in the morning,” but “this morning” without “in.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "🌅",
    "tags": [
      "time-and-routines",
      "level-11",
      "morning"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l11-afternoon",
    "category": "words",
    "level": 11,
    "title_en": "afternoon",
    "title_ja": "午後",
    "content": {
      "word": "afternoon",
      "japanese": "午後",
      "kanaReading": "アフタヌーン",
      "pronunciationHint": "Stress the final syllable: after-NOON.",
      "exampleSentence": "The meeting is this afternoon.",
      "exampleJapanese": "会議は今日の午後です。",
      "commonMistake": "Do not say “in this afternoon.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "🌤️",
    "tags": [
      "time-and-routines",
      "level-11",
      "afternoon"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l11-evening",
    "category": "words",
    "level": 11,
    "title_en": "evening",
    "title_ja": "夕方・晩",
    "content": {
      "word": "evening",
      "japanese": "夕方・晩",
      "kanaReading": "イーブニング",
      "pronunciationHint": "Stress EVE and keep the middle light.",
      "exampleSentence": "We take a walk in the evening.",
      "exampleJapanese": "私たちは夕方に散歩します。",
      "commonMistake": "Use “in the evening,” but “this evening” without “in.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "🌆",
    "tags": [
      "time-and-routines",
      "level-11",
      "evening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l11-night",
    "category": "words",
    "level": 11,
    "title_en": "night",
    "title_ja": "夜",
    "content": {
      "word": "night",
      "japanese": "夜",
      "kanaReading": "ナイト",
      "pronunciationHint": "The gh is silent; finish with t.",
      "exampleSentence": "I read before bed at night.",
      "exampleJapanese": "私は夜、寝る前に本を読みます。",
      "commonMistake": "Say “at night,” not “in night.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "🌃",
    "tags": [
      "time-and-routines",
      "level-11",
      "night"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l11-today",
    "category": "words",
    "level": 11,
    "title_en": "today",
    "title_ja": "今日",
    "content": {
      "word": "today",
      "japanese": "今日",
      "kanaReading": "トゥデイ",
      "pronunciationHint": "Stress DAY.",
      "exampleSentence": "I have plenty of time today.",
      "exampleJapanese": "今日は時間がたっぷりあります。",
      "commonMistake": "Do not add “on” before “today.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "📅",
    "tags": [
      "time-and-routines",
      "level-11",
      "today"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l11-tomorrow",
    "category": "words",
    "level": 11,
    "title_en": "tomorrow",
    "title_ja": "明日",
    "content": {
      "word": "tomorrow",
      "japanese": "明日",
      "kanaReading": "トゥモロウ",
      "pronunciationHint": "Stress MOR: to-MOR-row.",
      "exampleSentence": "Let us finish this tomorrow.",
      "exampleJapanese": "これは明日終わらせましょう。",
      "commonMistake": "Do not add “on” before “tomorrow.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "➡️",
    "tags": [
      "time-and-routines",
      "level-11",
      "tomorrow"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l11-yesterday",
    "category": "words",
    "level": 11,
    "title_en": "yesterday",
    "title_ja": "昨日",
    "content": {
      "word": "yesterday",
      "japanese": "昨日",
      "kanaReading": "イエスタデイ",
      "pronunciationHint": "Stress YES and keep the rest lighter.",
      "exampleSentence": "Yesterday was my day off.",
      "exampleJapanese": "昨日は休みでした。",
      "commonMistake": "Do not use present tense for a finished event yesterday.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "⬅️",
    "tags": [
      "time-and-routines",
      "level-11",
      "yesterday"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l11-early",
    "category": "words",
    "level": 11,
    "title_en": "early",
    "title_ja": "早く・早い",
    "content": {
      "word": "early",
      "japanese": "早く・早い",
      "kanaReading": "アーリー",
      "pronunciationHint": "Use an r-colored first vowel in US English.",
      "exampleSentence": "She arrived ten minutes early.",
      "exampleJapanese": "彼女は10分早く着きました。",
      "commonMistake": "“Early” is not the same as “fast.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "⏰",
    "tags": [
      "time-and-routines",
      "level-11",
      "early"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l11-late",
    "category": "words",
    "level": 11,
    "title_en": "late",
    "title_ja": "遅い・遅れて",
    "content": {
      "word": "late",
      "japanese": "遅い・遅れて",
      "kanaReading": "レイト",
      "pronunciationHint": "Use the long /eɪ/ vowel.",
      "exampleSentence": "The train is five minutes late.",
      "exampleJapanese": "電車は5分遅れています。",
      "commonMistake": "Use “late for” an event or obligation; “late to class” is also common when focusing on arrival.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "⌛",
    "tags": [
      "time-and-routines",
      "level-11",
      "late"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l11-busy",
    "category": "words",
    "level": 11,
    "title_en": "busy",
    "title_ja": "忙しい",
    "content": {
      "word": "busy",
      "japanese": "忙しい",
      "kanaReading": "ビジー",
      "pronunciationHint": "Pronounce the s like /z/: BIZ-ee.",
      "exampleSentence": "I am busy until Friday.",
      "exampleJapanese": "私は金曜日まで忙しいです。",
      "commonMistake": "Do not pronounce the s as /s/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "time-and-routines"
    },
    "icon": "📋",
    "tags": [
      "time-and-routines",
      "level-11",
      "busy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l12-school",
    "category": "words",
    "level": 12,
    "title_en": "school",
    "title_ja": "学校",
    "content": {
      "word": "school",
      "japanese": "学校",
      "kanaReading": "スクール",
      "pronunciationHint": "Blend /sk/ and hold /uː/.",
      "exampleSentence": "The school is across from the park.",
      "exampleJapanese": "学校は公園の向かいです。",
      "commonMistake": "Say “go to school” without “the” for attending classes.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🏫",
    "tags": [
      "places-in-town",
      "level-12",
      "school"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l12-park",
    "category": "words",
    "level": 12,
    "title_en": "park",
    "title_ja": "公園",
    "content": {
      "word": "park",
      "japanese": "公園",
      "kanaReading": "パーク",
      "pronunciationHint": "Keep the p unvoiced and use the r in US English.",
      "exampleSentence": "We met near the park gate.",
      "exampleJapanese": "私たちは公園の門の近くで会いました。",
      "commonMistake": "Do not confuse “park” the place with “park” a vehicle.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🏞️",
    "tags": [
      "places-in-town",
      "level-12",
      "park"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l12-station",
    "category": "words",
    "level": 12,
    "title_en": "station",
    "title_ja": "駅",
    "content": {
      "word": "station",
      "japanese": "駅",
      "kanaReading": "ステイション",
      "pronunciationHint": "Stress STAY and use /ʃ/ before the ending.",
      "exampleSentence": "Which station is next?",
      "exampleJapanese": "次はどの駅ですか。",
      "commonMistake": "Use “at the station,” not “in station.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🚉",
    "tags": [
      "places-in-town",
      "level-12",
      "station"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l12-store",
    "category": "words",
    "level": 12,
    "title_en": "store",
    "title_ja": "店",
    "content": {
      "word": "store",
      "japanese": "店",
      "kanaReading": "ストア",
      "pronunciationHint": "Blend /st/ and hold the vowel.",
      "exampleSentence": "That store closes at eight.",
      "exampleJapanese": "あの店は8時に閉まります。",
      "commonMistake": "British English often uses “shop” where US English uses “store.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🏪",
    "tags": [
      "places-in-town",
      "level-12",
      "store"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l12-hospital",
    "category": "words",
    "level": 12,
    "title_en": "hospital",
    "title_ja": "病院",
    "content": {
      "word": "hospital",
      "japanese": "病院",
      "kanaReading": "ホスピタル",
      "pronunciationHint": "Stress HOS; later syllables are lighter.",
      "exampleSentence": "The hospital is beside the bank.",
      "exampleJapanese": "病院は銀行の隣です。",
      "commonMistake": "Use “go to the hospital” in US English for a visit.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🏥",
    "tags": [
      "places-in-town",
      "level-12",
      "hospital"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l12-library",
    "category": "words",
    "level": 12,
    "title_en": "library",
    "title_ja": "図書館",
    "content": {
      "word": "library",
      "japanese": "図書館",
      "kanaReading": "ライブラリー",
      "pronunciationHint": "Usually three syllables: LI-brar-y, with the stress on LI.",
      "exampleSentence": "You can borrow this at the library.",
      "exampleJapanese": "これは図書館で借りられます。",
      "commonMistake": "Keep the r after b clear; some speakers reduce the middle syllable in fast speech.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "📚",
    "tags": [
      "places-in-town",
      "level-12",
      "library"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l12-restaurant",
    "category": "words",
    "level": 12,
    "title_en": "restaurant",
    "title_ja": "レストラン",
    "content": {
      "word": "restaurant",
      "japanese": "レストラン",
      "kanaReading": "レストラント",
      "pronunciationHint": "Often three syllables: RES-ta-rant.",
      "exampleSentence": "This restaurant serves vegetable curry.",
      "exampleJapanese": "このレストランでは野菜カレーを出します。",
      "commonMistake": "Do not pronounce every written vowel equally.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🍽️",
    "tags": [
      "places-in-town",
      "level-12",
      "restaurant"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l12-bank",
    "category": "words",
    "level": 12,
    "title_en": "bank",
    "title_ja": "銀行",
    "content": {
      "word": "bank",
      "japanese": "銀行",
      "kanaReading": "バンク",
      "pronunciationHint": "Use /æ/ and finish with /ŋk/.",
      "exampleSentence": "The bank is closed today.",
      "exampleJapanese": "銀行は今日休みです。",
      "commonMistake": "Do not add a vowel after k.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🏦",
    "tags": [
      "places-in-town",
      "level-12",
      "bank"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l12-post-office",
    "category": "words",
    "level": 12,
    "title_en": "post office",
    "title_ja": "郵便局",
    "content": {
      "word": "post office",
      "japanese": "郵便局",
      "kanaReading": "ポウスト オフィス",
      "pronunciationHint": "Keep the final t in “post” before “office.”",
      "exampleSentence": "I mailed the parcel at the post office.",
      "exampleJapanese": "郵便局で小包を送りました。",
      "commonMistake": "Write it as two words, not one.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "📮",
    "tags": [
      "places-in-town",
      "level-12",
      "post-office"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l12-playground",
    "category": "words",
    "level": 12,
    "title_en": "playground",
    "title_ja": "遊び場・校庭",
    "content": {
      "word": "playground",
      "japanese": "遊び場・校庭",
      "kanaReading": "プレイグラウンド",
      "pronunciationHint": "Stress PLAY and connect both parts smoothly.",
      "exampleSentence": "The children are on the playground.",
      "exampleJapanese": "子どもたちは遊び場にいます。",
      "commonMistake": "US English often uses “on the playground”; UK English commonly uses “in the playground.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "places-in-town"
    },
    "icon": "🛝",
    "tags": [
      "places-in-town",
      "level-12",
      "playground"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l13-shirt",
    "category": "words",
    "level": 13,
    "title_en": "shirt",
    "title_ja": "シャツ",
    "content": {
      "word": "shirt",
      "japanese": "シャツ",
      "kanaReading": "シャート",
      "pronunciationHint": "Use the r-colored vowel /ɝː/ in US English.",
      "exampleSentence": "This shirt fits me well.",
      "exampleJapanese": "このシャツは私によく合います。",
      "commonMistake": "A shirt normally has a collar or buttons; a T-shirt is different.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "👕",
    "tags": [
      "clothing",
      "level-13",
      "shirt"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l13-pants",
    "category": "words",
    "level": 13,
    "title_en": "pants",
    "title_ja": "ズボン",
    "content": {
      "word": "pants",
      "japanese": "ズボン",
      "kanaReading": "パンツ",
      "pronunciationHint": "Use /æ/ and finish with /nts/.",
      "exampleSentence": "These pants are too long.",
      "exampleJapanese": "このズボンは長すぎます。",
      "commonMistake": "“Pants” is plural in form: say “these pants.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "👖",
    "tags": [
      "clothing",
      "level-13",
      "pants"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l13-dress",
    "category": "words",
    "level": 13,
    "title_en": "dress",
    "title_ja": "ワンピース・ドレス",
    "content": {
      "word": "dress",
      "japanese": "ワンピース・ドレス",
      "kanaReading": "ドレス",
      "pronunciationHint": "Finish with a clear /s/.",
      "exampleSentence": "She wore a blue dress.",
      "exampleJapanese": "彼女は青いワンピースを着ていました。",
      "commonMistake": "English “dress” is not every type of clothing.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "👗",
    "tags": [
      "clothing",
      "level-13",
      "dress"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l13-skirt",
    "category": "words",
    "level": 13,
    "title_en": "skirt",
    "title_ja": "スカート",
    "content": {
      "word": "skirt",
      "japanese": "スカート",
      "kanaReading": "スカート",
      "pronunciationHint": "Blend /sk/ and keep the final t.",
      "exampleSentence": "This skirt has two pockets.",
      "exampleJapanese": "このスカートにはポケットが2つあります。",
      "commonMistake": "Do not drop the final t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "🩱",
    "tags": [
      "clothing",
      "level-13",
      "skirt"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l13-shoes",
    "category": "words",
    "level": 13,
    "title_en": "shoes",
    "title_ja": "靴",
    "content": {
      "word": "shoes",
      "japanese": "靴",
      "kanaReading": "シューズ",
      "pronunciationHint": "Finish with a voiced /z/.",
      "exampleSentence": "Please leave your shoes by the door.",
      "exampleJapanese": "靴をドアのそばに置いてください。",
      "commonMistake": "Use the plural “shoes” for a pair.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "👟",
    "tags": [
      "clothing",
      "level-13",
      "shoes"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l13-socks",
    "category": "words",
    "level": 13,
    "title_en": "socks",
    "title_ja": "靴下",
    "content": {
      "word": "socks",
      "japanese": "靴下",
      "kanaReading": "ソックス",
      "pronunciationHint": "Finish with the /ks/ cluster.",
      "exampleSentence": "My socks are still wet.",
      "exampleJapanese": "靴下はまだぬれています。",
      "commonMistake": "Use “a pair of socks,” not “a socks.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "🧦",
    "tags": [
      "clothing",
      "level-13",
      "socks"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l13-hat",
    "category": "words",
    "level": 13,
    "title_en": "hat",
    "title_ja": "帽子",
    "content": {
      "word": "hat",
      "japanese": "帽子",
      "kanaReading": "ハット",
      "pronunciationHint": "Use the open /æ/ vowel.",
      "exampleSentence": "Take your hat off indoors.",
      "exampleJapanese": "室内では帽子を取ってください。",
      "commonMistake": "“Hat” usually has a brim or shaped crown; “cap” is more specific.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "🎩",
    "tags": [
      "clothing",
      "level-13",
      "hat"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l13-coat",
    "category": "words",
    "level": 13,
    "title_en": "coat",
    "title_ja": "コート・上着",
    "content": {
      "word": "coat",
      "japanese": "コート・上着",
      "kanaReading": "コウト",
      "pronunciationHint": "Use /oʊ/ and keep the final t.",
      "exampleSentence": "Bring a warm coat tonight.",
      "exampleJapanese": "今夜は暖かいコートを持ってきてください。",
      "commonMistake": "Do not drop the final t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "🧥",
    "tags": [
      "clothing",
      "level-13",
      "coat"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l13-gloves",
    "category": "words",
    "level": 13,
    "title_en": "gloves",
    "title_ja": "手袋",
    "content": {
      "word": "gloves",
      "japanese": "手袋",
      "kanaReading": "グラヴズ",
      "pronunciationHint": "Finish with the voiced /vz/ cluster.",
      "exampleSentence": "I need gloves for the snow.",
      "exampleJapanese": "雪の日には手袋が必要です。",
      "commonMistake": "Use the plural for the usual pair.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "🧤",
    "tags": [
      "clothing",
      "level-13",
      "gloves"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l13-umbrella",
    "category": "words",
    "level": 13,
    "title_en": "umbrella",
    "title_ja": "傘",
    "content": {
      "word": "umbrella",
      "japanese": "傘",
      "kanaReading": "アンブレラ",
      "pronunciationHint": "Stress BREL: um-BREL-la.",
      "exampleSentence": "I left my umbrella on the train.",
      "exampleJapanese": "電車に傘を忘れました。",
      "commonMistake": "Use “an umbrella,” not “a umbrella.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "clothing"
    },
    "icon": "☂️",
    "tags": [
      "clothing",
      "level-13",
      "umbrella"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l14-car",
    "category": "words",
    "level": 14,
    "title_en": "car",
    "title_ja": "車",
    "content": {
      "word": "car",
      "japanese": "車",
      "kanaReading": "カー",
      "pronunciationHint": "Use a strong r in US English and a long vowel in UK English.",
      "exampleSentence": "We rented a small car.",
      "exampleJapanese": "私たちは小型車を借りました。",
      "commonMistake": "Say “by car,” but “in the car.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🚗",
    "tags": [
      "transport-and-travel",
      "level-14",
      "car"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l14-bus",
    "category": "words",
    "level": 14,
    "title_en": "bus",
    "title_ja": "バス",
    "content": {
      "word": "bus",
      "japanese": "バス",
      "kanaReading": "バス",
      "pronunciationHint": "Use the short /ʌ/ vowel and final /s/.",
      "exampleSentence": "The bus comes every twenty minutes.",
      "exampleJapanese": "そのバスは20分ごとに来ます。",
      "commonMistake": "The plural is “buses,” not “bus.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🚌",
    "tags": [
      "transport-and-travel",
      "level-14",
      "bus"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l14-train",
    "category": "words",
    "level": 14,
    "title_en": "train",
    "title_ja": "電車",
    "content": {
      "word": "train",
      "japanese": "電車",
      "kanaReading": "トレイン",
      "pronunciationHint": "Blend /tr/ and use /eɪ/.",
      "exampleSentence": "I caught the last train home.",
      "exampleJapanese": "最終電車で帰りました。",
      "commonMistake": "Say “by train,” but “on the train.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🚆",
    "tags": [
      "transport-and-travel",
      "level-14",
      "train"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l14-bicycle",
    "category": "words",
    "level": 14,
    "title_en": "bicycle",
    "title_ja": "自転車",
    "content": {
      "word": "bicycle",
      "japanese": "自転車",
      "kanaReading": "バイシクル",
      "pronunciationHint": "Stress BI and make the middle c sound /s/.",
      "exampleSentence": "He rides his bicycle to work.",
      "exampleJapanese": "彼は自転車で通勤します。",
      "commonMistake": "“Ride a bicycle,” not “drive a bicycle.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🚲",
    "tags": [
      "transport-and-travel",
      "level-14",
      "bicycle"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l14-airplane",
    "category": "words",
    "level": 14,
    "title_en": "airplane",
    "title_ja": "飛行機",
    "content": {
      "word": "airplane",
      "japanese": "飛行機",
      "kanaReading": "エアプレイン",
      "pronunciationHint": "Stress AIR and connect both parts.",
      "exampleSentence": "The airplane landed safely.",
      "exampleJapanese": "飛行機は無事に着陸しました。",
      "commonMistake": "Use “on the airplane,” not “in airplane.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "✈️",
    "tags": [
      "transport-and-travel",
      "level-14",
      "airplane"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l14-taxi",
    "category": "words",
    "level": 14,
    "title_en": "taxi",
    "title_ja": "タクシー",
    "content": {
      "word": "taxi",
      "japanese": "タクシー",
      "kanaReading": "タクシー",
      "pronunciationHint": "Stress TAX and use /ks/.",
      "exampleSentence": "Let us take a taxi to the hotel.",
      "exampleJapanese": "ホテルまでタクシーで行きましょう。",
      "commonMistake": "Say “take a taxi,” not “ride taxi.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🚕",
    "tags": [
      "transport-and-travel",
      "level-14",
      "taxi"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l14-boat",
    "category": "words",
    "level": 14,
    "title_en": "boat",
    "title_ja": "ボート",
    "content": {
      "word": "boat",
      "japanese": "ボート",
      "kanaReading": "ボウト",
      "pronunciationHint": "Use /oʊ/ and finish with t.",
      "exampleSentence": "We crossed the lake by boat.",
      "exampleJapanese": "私たちはボートで湖を渡りました。",
      "commonMistake": "Do not drop the final t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "⛵",
    "tags": [
      "transport-and-travel",
      "level-14",
      "boat"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l14-ticket",
    "category": "words",
    "level": 14,
    "title_en": "ticket",
    "title_ja": "切符・チケット",
    "content": {
      "word": "ticket",
      "japanese": "切符・チケット",
      "kanaReading": "ティケット",
      "pronunciationHint": "Stress TICK; the second vowel is weak.",
      "exampleSentence": "Keep your ticket until you leave.",
      "exampleJapanese": "出るまで切符を持っていてください。",
      "commonMistake": "Say “a ticket to Tokyo,” not “a ticket for Tokyo” when naming a destination.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🎫",
    "tags": [
      "transport-and-travel",
      "level-14",
      "ticket"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l14-map",
    "category": "words",
    "level": 14,
    "title_en": "map",
    "title_ja": "地図",
    "content": {
      "word": "map",
      "japanese": "地図",
      "kanaReading": "マップ",
      "pronunciationHint": "Use the open /æ/ vowel.",
      "exampleSentence": "The map shows a shorter route.",
      "exampleJapanese": "その地図にはもっと短い道が載っています。",
      "commonMistake": "Say “on the map,” not “in the map.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🗺️",
    "tags": [
      "transport-and-travel",
      "level-14",
      "map"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l14-trip",
    "category": "words",
    "level": 14,
    "title_en": "trip",
    "title_ja": "旅行",
    "content": {
      "word": "trip",
      "japanese": "旅行",
      "kanaReading": "トリップ",
      "pronunciationHint": "Blend /tr/ and use short /ɪ/.",
      "exampleSentence": "Our class trip was fun.",
      "exampleJapanese": "修学旅行は楽しかったです。",
      "commonMistake": "Use “trip” for the whole journey; “travel” is usually uncountable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "transport-and-travel"
    },
    "icon": "🧳",
    "tags": [
      "transport-and-travel",
      "level-14",
      "trip"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l15-clean",
    "category": "words",
    "level": 15,
    "title_en": "clean",
    "title_ja": "掃除する・清潔な",
    "content": {
      "word": "clean",
      "japanese": "掃除する・清潔な",
      "kanaReading": "クリーン",
      "pronunciationHint": "Blend /kl/ and hold /iː/.",
      "exampleSentence": "I clean the kitchen after dinner.",
      "exampleJapanese": "夕食後に台所を掃除します。",
      "commonMistake": "Use “clean” without “up” when removing dirt generally.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🧽",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "clean"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l15-wash",
    "category": "words",
    "level": 15,
    "title_en": "wash",
    "title_ja": "洗う",
    "content": {
      "word": "wash",
      "japanese": "洗う",
      "kanaReading": "ウォッシュ",
      "pronunciationHint": "Finish with /ʃ/.",
      "exampleSentence": "Wash your hands before eating.",
      "exampleJapanese": "食べる前に手を洗ってください。",
      "commonMistake": "Use “wash” with water; “clean” is broader.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🧼",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "wash"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l15-cook",
    "category": "words",
    "level": 15,
    "title_en": "cook",
    "title_ja": "料理する",
    "content": {
      "word": "cook",
      "japanese": "料理する",
      "kanaReading": "クック",
      "pronunciationHint": "Use short /ʊ/, not long /uː/.",
      "exampleSentence": "Can you cook rice for four people?",
      "exampleJapanese": "4人分のご飯を炊けますか。",
      "commonMistake": "“Cook” is the action; “a cook” is a person.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🍳",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "cook"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l15-sweep",
    "category": "words",
    "level": 15,
    "title_en": "sweep",
    "title_ja": "掃く",
    "content": {
      "word": "sweep",
      "japanese": "掃く",
      "kanaReading": "スウィープ",
      "pronunciationHint": "Blend /sw/ and hold /iː/.",
      "exampleSentence": "Please sweep the floor before guests arrive.",
      "exampleJapanese": "お客さんが来る前に床を掃いてください。",
      "commonMistake": "The past form is “swept,” not “sweeped.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🧹",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "sweep"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l15-carry",
    "category": "words",
    "level": 15,
    "title_en": "carry",
    "title_ja": "運ぶ・持ち歩く",
    "content": {
      "word": "carry",
      "japanese": "運ぶ・持ち歩く",
      "kanaReading": "キャリー",
      "pronunciationHint": "Stress CAR; the final y is /i/.",
      "exampleSentence": "Could you carry this box upstairs?",
      "exampleJapanese": "この箱を2階まで運んでもらえますか。",
      "commonMistake": "Do not use “bring” when the direction is away from the speaker.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "📦",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "carry"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l15-fix",
    "category": "words",
    "level": 15,
    "title_en": "fix",
    "title_ja": "直す・固定する",
    "content": {
      "word": "fix",
      "japanese": "直す・固定する",
      "kanaReading": "フィックス",
      "pronunciationHint": "Finish with /ks/.",
      "exampleSentence": "I need to fix the loose handle.",
      "exampleJapanese": "緩んだ取っ手を直す必要があります。",
      "commonMistake": "Use “fix” for repair, not every kind of problem-solving in formal writing.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🔧",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "fix"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l15-borrow",
    "category": "words",
    "level": 15,
    "title_en": "borrow",
    "title_ja": "借りる",
    "content": {
      "word": "borrow",
      "japanese": "借りる",
      "kanaReading": "ボロウ",
      "pronunciationHint": "Stress BOR; the ending is weak.",
      "exampleSentence": "May I borrow your charger?",
      "exampleJapanese": "充電器を借りてもいいですか。",
      "commonMistake": "“Borrow” means receive temporarily; “lend” means give temporarily.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🤲",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "borrow"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l15-return",
    "category": "words",
    "level": 15,
    "title_en": "return",
    "title_ja": "返す・戻る",
    "content": {
      "word": "return",
      "japanese": "返す・戻る",
      "kanaReading": "リターン",
      "pronunciationHint": "Stress TURN.",
      "exampleSentence": "Please return the key by Friday.",
      "exampleJapanese": "金曜日までに鍵を返してください。",
      "commonMistake": "Use “return the key,” not “return back the key.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "↩️",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "return"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l15-choose",
    "category": "words",
    "level": 15,
    "title_en": "choose",
    "title_ja": "選ぶ",
    "content": {
      "word": "choose",
      "japanese": "選ぶ",
      "kanaReading": "チューズ",
      "pronunciationHint": "Use /tʃ/ and finish with voiced /z/.",
      "exampleSentence": "Choose the answer that sounds natural.",
      "exampleJapanese": "自然に聞こえる答えを選んでください。",
      "commonMistake": "The past form is “chose”; “chosen” needs an auxiliary.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "✅",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "choose"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l15-pack",
    "category": "words",
    "level": 15,
    "title_en": "pack",
    "title_ja": "荷造りする",
    "content": {
      "word": "pack",
      "japanese": "荷造りする",
      "kanaReading": "パック",
      "pronunciationHint": "Use /æ/ and finish with k.",
      "exampleSentence": "I packed a light jacket for the trip.",
      "exampleJapanese": "旅行用に薄い上着を詰めました。",
      "commonMistake": "Say “pack a bag,” not “pack up a bag” unless emphasizing completion.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "chores-and-practical-actions"
    },
    "icon": "🧳",
    "tags": [
      "chores-and-practical-actions",
      "level-15",
      "pack"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l16-ask",
    "category": "words",
    "level": 16,
    "title_en": "ask",
    "title_ja": "尋ねる・頼む",
    "content": {
      "word": "ask",
      "japanese": "尋ねる・頼む",
      "kanaReading": "アスク",
      "pronunciationHint": "Finish with the /sk/ cluster.",
      "exampleSentence": "Please ask if anything is unclear.",
      "exampleJapanese": "分からないことがあれば尋ねてください。",
      "commonMistake": "Use “ask someone a question,” not “ask a question to someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "❓",
    "tags": [
      "communication",
      "level-16",
      "ask"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l16-answer",
    "category": "words",
    "level": 16,
    "title_en": "answer",
    "title_ja": "答える・答え",
    "content": {
      "word": "answer",
      "japanese": "答える・答え",
      "kanaReading": "アンサー",
      "pronunciationHint": "The w is silent.",
      "exampleSentence": "Could you answer the final question?",
      "exampleJapanese": "最後の質問に答えてもらえますか。",
      "commonMistake": "Do not pronounce the written w.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "💬",
    "tags": [
      "communication",
      "level-16",
      "answer"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l16-explain",
    "category": "words",
    "level": 16,
    "title_en": "explain",
    "title_ja": "説明する",
    "content": {
      "word": "explain",
      "japanese": "説明する",
      "kanaReading": "イクスプレイン",
      "pronunciationHint": "Stress PLAIN and blend /kspl/.",
      "exampleSentence": "Can you explain that rule again?",
      "exampleJapanese": "そのルールをもう一度説明してもらえますか。",
      "commonMistake": "Say “explain it to me,” not “explain me it.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "🧑‍🏫",
    "tags": [
      "communication",
      "level-16",
      "explain"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l16-repeat",
    "category": "words",
    "level": 16,
    "title_en": "repeat",
    "title_ja": "繰り返す",
    "content": {
      "word": "repeat",
      "japanese": "繰り返す",
      "kanaReading": "リピート",
      "pronunciationHint": "Stress the second syllable: re-PEAT.",
      "exampleSentence": "Please repeat the address slowly.",
      "exampleJapanese": "住所をもう一度ゆっくり言ってください。",
      "commonMistake": "Do not add “again” unless repetition needs extra emphasis.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "🔁",
    "tags": [
      "communication",
      "level-16",
      "repeat"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l16-speak",
    "category": "words",
    "level": 16,
    "title_en": "speak",
    "title_ja": "話す",
    "content": {
      "word": "speak",
      "japanese": "話す",
      "kanaReading": "スピーク",
      "pronunciationHint": "Blend /sp/ and hold /iː/.",
      "exampleSentence": "Could you speak a little more slowly?",
      "exampleJapanese": "もう少しゆっくり話してもらえますか。",
      "commonMistake": "Use “speak to someone,” not normally “speak someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "🗣️",
    "tags": [
      "communication",
      "level-16",
      "speak"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l16-whisper",
    "category": "words",
    "level": 16,
    "title_en": "whisper",
    "title_ja": "ささやく",
    "content": {
      "word": "whisper",
      "japanese": "ささやく",
      "kanaReading": "ウィスパー",
      "pronunciationHint": "The wh begins like /w/; stress WHIS.",
      "exampleSentence": "She whispered the answer to me.",
      "exampleJapanese": "彼女は私に答えをささやきました。",
      "commonMistake": "Say “whisper to someone,” not “whisper someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "🤫",
    "tags": [
      "communication",
      "level-16",
      "whisper"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l16-shout",
    "category": "words",
    "level": 16,
    "title_en": "shout",
    "title_ja": "叫ぶ",
    "content": {
      "word": "shout",
      "japanese": "叫ぶ",
      "kanaReading": "シャウト",
      "pronunciationHint": "Use /ʃ/ and glide through /aʊ/.",
      "exampleSentence": "Do not shout across the room.",
      "exampleJapanese": "部屋の向こうに向かって叫ばないでください。",
      "commonMistake": "Use “shout at” for anger and “shout to” for distance.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "📣",
    "tags": [
      "communication",
      "level-16",
      "shout"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l16-call",
    "category": "words",
    "level": 16,
    "title_en": "call",
    "title_ja": "電話する・呼ぶ",
    "content": {
      "word": "call",
      "japanese": "電話する・呼ぶ",
      "kanaReading": "コール",
      "pronunciationHint": "Hold the vowel and finish with l.",
      "exampleSentence": "I will call you after work.",
      "exampleJapanese": "仕事の後で電話します。",
      "commonMistake": "Do not add “to” before the person: say “call me.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "📞",
    "tags": [
      "communication",
      "level-16",
      "call"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l16-message",
    "category": "words",
    "level": 16,
    "title_en": "message",
    "title_ja": "メッセージを送る・伝言",
    "content": {
      "word": "message",
      "japanese": "メッセージを送る・伝言",
      "kanaReading": "メッセージ",
      "pronunciationHint": "Stress MES; the final age sounds /ɪdʒ/.",
      "exampleSentence": "Message me when you arrive.",
      "exampleJapanese": "着いたらメッセージを送ってください。",
      "commonMistake": "As a verb, say “message me,” not “message to me.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "📱",
    "tags": [
      "communication",
      "level-16",
      "message"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l16-invite",
    "category": "words",
    "level": 16,
    "title_en": "invite",
    "title_ja": "招待する",
    "content": {
      "word": "invite",
      "japanese": "招待する",
      "kanaReading": "インヴァイト",
      "pronunciationHint": "Stress VITE and use /aɪ/.",
      "exampleSentence": "We invited our neighbors to dinner.",
      "exampleJapanese": "近所の人たちを夕食に招きました。",
      "commonMistake": "Use “invite someone to an event,” not “invite someone for an event.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "communication"
    },
    "icon": "💌",
    "tags": [
      "communication",
      "level-16",
      "invite"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l17-homework",
    "category": "words",
    "level": 17,
    "title_en": "homework",
    "title_ja": "宿題",
    "content": {
      "word": "homework",
      "japanese": "宿題",
      "kanaReading": "ホームワーク",
      "pronunciationHint": "Stress HOME and connect both parts.",
      "exampleSentence": "I finished my homework before dinner.",
      "exampleJapanese": "夕食前に宿題を終えました。",
      "commonMistake": "“Homework” is uncountable; avoid “homeworks.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "📚",
    "tags": [
      "study-skills",
      "level-17",
      "homework"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l17-question",
    "category": "words",
    "level": 17,
    "title_en": "question",
    "title_ja": "質問・問題",
    "content": {
      "word": "question",
      "japanese": "質問・問題",
      "kanaReading": "クウェスチョン",
      "pronunciationHint": "The tion ending sounds /tʃən/.",
      "exampleSentence": "Write one question about the story.",
      "exampleJapanese": "物語について質問を1つ書いてください。",
      "commonMistake": "Use “ask a question,” not “say a question.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "❔",
    "tags": [
      "study-skills",
      "level-17",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l17-notebook",
    "category": "words",
    "level": 17,
    "title_en": "notebook",
    "title_ja": "ノート",
    "content": {
      "word": "notebook",
      "japanese": "ノート",
      "kanaReading": "ノウトブック",
      "pronunciationHint": "Stress NOTE and keep “book” short.",
      "exampleSentence": "I keep new vocabulary in a notebook.",
      "exampleJapanese": "新しい単語をノートに書いています。",
      "commonMistake": "English “notebook” is a bound writing book, not any memo.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "📓",
    "tags": [
      "study-skills",
      "level-17",
      "notebook"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l17-dictionary",
    "category": "words",
    "level": 17,
    "title_en": "dictionary",
    "title_ja": "辞書",
    "content": {
      "word": "dictionary",
      "japanese": "辞書",
      "kanaReading": "ディクショナリー",
      "pronunciationHint": "Stress DIC; keep later vowels light.",
      "exampleSentence": "Check the word in a learner’s dictionary.",
      "exampleJapanese": "学習者向け辞書でその単語を調べてください。",
      "commonMistake": "Say “look up a word in a dictionary,” not “search a word.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "📖",
    "tags": [
      "study-skills",
      "level-17",
      "dictionary"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l17-subject",
    "category": "words",
    "level": 17,
    "title_en": "subject",
    "title_ja": "科目・話題",
    "content": {
      "word": "subject",
      "japanese": "科目・話題",
      "kanaReading": "サブジェクト",
      "pronunciationHint": "As a noun, stress SUB.",
      "exampleSentence": "Science is my favorite subject.",
      "exampleJapanese": "理科は私の好きな科目です。",
      "commonMistake": "Do not confuse a school subject with a lesson period.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "🧪",
    "tags": [
      "study-skills",
      "level-17",
      "subject"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l17-grade",
    "category": "words",
    "level": 17,
    "title_en": "grade",
    "title_ja": "成績・学年",
    "content": {
      "word": "grade",
      "japanese": "成績・学年",
      "kanaReading": "グレイド",
      "pronunciationHint": "Blend /gr/ and use /eɪ/.",
      "exampleSentence": "Her writing grade improved this term.",
      "exampleJapanese": "今学期、彼女の作文の成績が上がりました。",
      "commonMistake": "“Grade” can mean a score or school year depending on context.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "📊",
    "tags": [
      "study-skills",
      "level-17",
      "grade"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l17-test",
    "category": "words",
    "level": 17,
    "title_en": "test",
    "title_ja": "テスト・試験",
    "content": {
      "word": "test",
      "japanese": "テスト・試験",
      "kanaReading": "テスト",
      "pronunciationHint": "Use short /e/ and finish with /st/.",
      "exampleSentence": "We have a listening test tomorrow.",
      "exampleJapanese": "明日はリスニングテストがあります。",
      "commonMistake": "Use “take a test,” not “receive a test,” for sitting an exam.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "🧾",
    "tags": [
      "study-skills",
      "level-17",
      "test"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l17-practice",
    "category": "words",
    "level": 17,
    "title_en": "practice",
    "title_ja": "練習・練習する",
    "content": {
      "word": "practice",
      "japanese": "練習・練習する",
      "kanaReading": "プラクティス",
      "pronunciationHint": "Stress PRAC and use /æ/.",
      "exampleSentence": "Daily practice makes speaking easier.",
      "exampleJapanese": "毎日の練習で話すことが楽になります。",
      "commonMistake": "In UK spelling, the verb is often “practise,” while the noun is “practice.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "🎯",
    "tags": [
      "study-skills",
      "level-17",
      "practice"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l17-remember",
    "category": "words",
    "level": 17,
    "title_en": "remember",
    "title_ja": "覚えている・思い出す",
    "content": {
      "word": "remember",
      "japanese": "覚えている・思い出す",
      "kanaReading": "リメンバー",
      "pronunciationHint": "Stress MEM: re-MEM-ber.",
      "exampleSentence": "Remember to bring your workbook.",
      "exampleJapanese": "ワークブックを持ってくるのを忘れないでください。",
      "commonMistake": "“Remember to do” is future duty; “remember doing” recalls the past.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "🧠",
    "tags": [
      "study-skills",
      "level-17",
      "remember"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l17-improve",
    "category": "words",
    "level": 17,
    "title_en": "improve",
    "title_ja": "改善する・上達する",
    "content": {
      "word": "improve",
      "japanese": "改善する・上達する",
      "kanaReading": "インプルーヴ",
      "pronunciationHint": "Stress PROVE and finish with voiced v.",
      "exampleSentence": "Reading aloud can improve your rhythm.",
      "exampleJapanese": "音読すると話すリズムがよくなります。",
      "commonMistake": "Use “improve something” without “to.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "study-skills"
    },
    "icon": "📈",
    "tags": [
      "study-skills",
      "level-17",
      "improve"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l18-office",
    "category": "words",
    "level": 18,
    "title_en": "office",
    "title_ja": "オフィス・事務所",
    "content": {
      "word": "office",
      "japanese": "オフィス・事務所",
      "kanaReading": "オフィス",
      "pronunciationHint": "Stress OF; the ending is /ɪs/.",
      "exampleSentence": "Our office is near the station.",
      "exampleJapanese": "私たちのオフィスは駅の近くです。",
      "commonMistake": "Say “at the office” for your workplace location.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🏢",
    "tags": [
      "work",
      "level-18",
      "office"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l18-meeting",
    "category": "words",
    "level": 18,
    "title_en": "meeting",
    "title_ja": "会議",
    "content": {
      "word": "meeting",
      "japanese": "会議",
      "kanaReading": "ミーティング",
      "pronunciationHint": "Stress MEET and hold /iː/.",
      "exampleSentence": "The meeting starts in five minutes.",
      "exampleJapanese": "会議は5分後に始まります。",
      "commonMistake": "Use “have a meeting,” not “do a meeting.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "👥",
    "tags": [
      "work",
      "level-18",
      "meeting"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l18-schedule",
    "category": "words",
    "level": 18,
    "title_en": "schedule",
    "title_ja": "予定・日程",
    "content": {
      "word": "schedule",
      "japanese": "予定・日程",
      "kanaReading": "スケジュール",
      "pronunciationHint": "US often begins /sk/; UK often begins /ʃ/.",
      "exampleSentence": "My schedule is full on Thursday.",
      "exampleJapanese": "木曜日は予定がいっぱいです。",
      "commonMistake": "Both common pronunciations are acceptable; stay consistent.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🗓️",
    "tags": [
      "work",
      "level-18",
      "schedule"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l18-customer",
    "category": "words",
    "level": 18,
    "title_en": "customer",
    "title_ja": "顧客・お客さま",
    "content": {
      "word": "customer",
      "japanese": "顧客・お客さま",
      "kanaReading": "カスタマー",
      "pronunciationHint": "Stress CUS; later vowels are weak.",
      "exampleSentence": "The customer asked for a receipt.",
      "exampleJapanese": "お客さまは領収書を求めました。",
      "commonMistake": "A “customer” buys; a “client” often receives professional services.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🛍️",
    "tags": [
      "work",
      "level-18",
      "customer"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l18-manager",
    "category": "words",
    "level": 18,
    "title_en": "manager",
    "title_ja": "管理者・店長",
    "content": {
      "word": "manager",
      "japanese": "管理者・店長",
      "kanaReading": "マネジャー",
      "pronunciationHint": "Stress MAN and make g sound /dʒ/.",
      "exampleSentence": "The manager approved my day off.",
      "exampleJapanese": "上司は私の休暇を承認しました。",
      "commonMistake": "Do not pronounce the g as in “go.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🧑‍💼",
    "tags": [
      "work",
      "level-18",
      "manager"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l18-project",
    "category": "words",
    "level": 18,
    "title_en": "project",
    "title_ja": "プロジェクト",
    "content": {
      "word": "project",
      "japanese": "プロジェクト",
      "kanaReading": "プロジェクト",
      "pronunciationHint": "As a noun, stress PROJ.",
      "exampleSentence": "Our project needs a clearer goal.",
      "exampleJapanese": "私たちのプロジェクトにはもっと明確な目標が必要です。",
      "commonMistake": "The verb “project” has stress on the second syllable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🗂️",
    "tags": [
      "work",
      "level-18",
      "project"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l18-report",
    "category": "words",
    "level": 18,
    "title_en": "report",
    "title_ja": "報告書・報告する",
    "content": {
      "word": "report",
      "japanese": "報告書・報告する",
      "kanaReading": "リポート",
      "pronunciationHint": "Stress PORT.",
      "exampleSentence": "Please send the report by noon.",
      "exampleJapanese": "正午までに報告書を送ってください。",
      "commonMistake": "Say “report on a topic,” not “report about” in formal contexts.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "📄",
    "tags": [
      "work",
      "level-18",
      "report"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l18-deadline",
    "category": "words",
    "level": 18,
    "title_en": "deadline",
    "title_ja": "締め切り",
    "content": {
      "word": "deadline",
      "japanese": "締め切り",
      "kanaReading": "デッドライン",
      "pronunciationHint": "Stress DEAD and connect both parts.",
      "exampleSentence": "The deadline is next Wednesday.",
      "exampleJapanese": "締め切りは次の水曜日です。",
      "commonMistake": "Say “meet a deadline,” not “keep a deadline.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "⏳",
    "tags": [
      "work",
      "level-18",
      "deadline"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l18-colleague",
    "category": "words",
    "level": 18,
    "title_en": "colleague",
    "title_ja": "同僚",
    "content": {
      "word": "colleague",
      "japanese": "同僚",
      "kanaReading": "コリーグ",
      "pronunciationHint": "Stress COL and hold /iː/ at the end.",
      "exampleSentence": "A colleague helped me check the figures.",
      "exampleJapanese": "同僚が数字の確認を手伝ってくれました。",
      "commonMistake": "Do not use “colleague” for every friend at work unless you work together.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "🤝",
    "tags": [
      "work",
      "level-18",
      "colleague"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l18-break",
    "category": "words",
    "level": 18,
    "title_en": "break",
    "title_ja": "休憩・壊す",
    "content": {
      "word": "break",
      "japanese": "休憩・壊す",
      "kanaReading": "ブレイク",
      "pronunciationHint": "Use the /eɪ/ vowel.",
      "exampleSentence": "Let us take a short break.",
      "exampleJapanese": "短い休憩を取りましょう。",
      "commonMistake": "Use “take a break,” not “do a break.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "work"
    },
    "icon": "☕",
    "tags": [
      "work",
      "level-18",
      "break"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l19-doctor",
    "category": "words",
    "level": 19,
    "title_en": "doctor",
    "title_ja": "医師",
    "content": {
      "word": "doctor",
      "japanese": "医師",
      "kanaReading": "ドクター",
      "pronunciationHint": "Stress DOC; the ending is weak.",
      "exampleSentence": "The doctor asked about my symptoms.",
      "exampleJapanese": "医師は私の症状について尋ねました。",
      "commonMistake": "Use “see a doctor,” not “meet a doctor,” for medical care.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🧑‍⚕️",
    "tags": [
      "health",
      "level-19",
      "doctor"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l19-medicine",
    "category": "words",
    "level": 19,
    "title_en": "medicine",
    "title_ja": "薬",
    "content": {
      "word": "medicine",
      "japanese": "薬",
      "kanaReading": "メディスン",
      "pronunciationHint": "Usually three syllables: MED-i-cine.",
      "exampleSentence": "Take this medicine after breakfast.",
      "exampleJapanese": "この薬を朝食後に飲んでください。",
      "commonMistake": "Say “take medicine,” not “drink medicine” generally.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "💊",
    "tags": [
      "health",
      "level-19",
      "medicine"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l19-fever",
    "category": "words",
    "level": 19,
    "title_en": "fever",
    "title_ja": "熱・発熱",
    "content": {
      "word": "fever",
      "japanese": "熱・発熱",
      "kanaReading": "フィーヴァー",
      "pronunciationHint": "Stress FEE and use /v/.",
      "exampleSentence": "He has a slight fever.",
      "exampleJapanese": "彼には微熱があります。",
      "commonMistake": "Say “have a fever,” not “be fever.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🌡️",
    "tags": [
      "health",
      "level-19",
      "fever"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l19-cough",
    "category": "words",
    "level": 19,
    "title_en": "cough",
    "title_ja": "せき・せきをする",
    "content": {
      "word": "cough",
      "japanese": "せき・せきをする",
      "kanaReading": "コフ",
      "pronunciationHint": "The gh sounds /f/.",
      "exampleSentence": "Her cough is getting better.",
      "exampleJapanese": "彼女のせきはよくなっています。",
      "commonMistake": "As a verb, say “cough,” not “do a cough.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "😷",
    "tags": [
      "health",
      "level-19",
      "cough"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l19-headache",
    "category": "words",
    "level": 19,
    "title_en": "headache",
    "title_ja": "頭痛",
    "content": {
      "word": "headache",
      "japanese": "頭痛",
      "kanaReading": "ヘッドエイク",
      "pronunciationHint": "Stress HEAD and pronounce “ache” /eɪk/.",
      "exampleSentence": "I have a headache from the bright screen.",
      "exampleJapanese": "明るい画面のせいで頭が痛いです。",
      "commonMistake": "Say “have a headache,” not “my head is headache.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🤕",
    "tags": [
      "health",
      "level-19",
      "headache"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l19-rest",
    "category": "words",
    "level": 19,
    "title_en": "rest",
    "title_ja": "休む・休息",
    "content": {
      "word": "rest",
      "japanese": "休む・休息",
      "kanaReading": "レスト",
      "pronunciationHint": "Use short /e/ and finish with /st/.",
      "exampleSentence": "You should rest this afternoon.",
      "exampleJapanese": "今日の午後は休んだほうがいいです。",
      "commonMistake": "“Get some rest” is very common; “take a rest” is also natural in some varieties and contexts.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🛌",
    "tags": [
      "health",
      "level-19",
      "rest"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l19-healthy",
    "category": "words",
    "level": 19,
    "title_en": "healthy",
    "title_ja": "健康な",
    "content": {
      "word": "healthy",
      "japanese": "健康な",
      "kanaReading": "ヘルシー",
      "pronunciationHint": "The th is unvoiced /θ/.",
      "exampleSentence": "A healthy breakfast gives me energy.",
      "exampleJapanese": "健康的な朝食で元気が出ます。",
      "commonMistake": "Use “healthy” for a person or habit; “healthful” is less common.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🥗",
    "tags": [
      "health",
      "level-19",
      "healthy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l19-exercise",
    "category": "words",
    "level": 19,
    "title_en": "exercise",
    "title_ja": "運動・練習する",
    "content": {
      "word": "exercise",
      "japanese": "運動・練習する",
      "kanaReading": "エクササイズ",
      "pronunciationHint": "Stress EX; the final s sounds /z/.",
      "exampleSentence": "Gentle exercise helps my back.",
      "exampleJapanese": "軽い運動は腰に良いです。",
      "commonMistake": "“Exercise” can be countable for a task, uncountable for activity.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "🏋️",
    "tags": [
      "health",
      "level-19",
      "exercise"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l19-pain",
    "category": "words",
    "level": 19,
    "title_en": "pain",
    "title_ja": "痛み",
    "content": {
      "word": "pain",
      "japanese": "痛み",
      "kanaReading": "ペイン",
      "pronunciationHint": "Use the /eɪ/ vowel.",
      "exampleSentence": "I felt a sharp pain in my shoulder.",
      "exampleJapanese": "肩に鋭い痛みを感じました。",
      "commonMistake": "Use “pain in my shoulder,” not “pain of my shoulder.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "⚡",
    "tags": [
      "health",
      "level-19",
      "pain"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l19-appointment",
    "category": "words",
    "level": 19,
    "title_en": "appointment",
    "title_ja": "予約・約束",
    "content": {
      "word": "appointment",
      "japanese": "予約・約束",
      "kanaReading": "アポイントメント",
      "pronunciationHint": "Stress POINT.",
      "exampleSentence": "I made a dentist appointment for Monday.",
      "exampleJapanese": "月曜日に歯医者の予約を取りました。",
      "commonMistake": "Say “make an appointment,” not “reserve a doctor.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "health"
    },
    "icon": "📆",
    "tags": [
      "health",
      "level-19",
      "appointment"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l20-price",
    "category": "words",
    "level": 20,
    "title_en": "price",
    "title_ja": "価格",
    "content": {
      "word": "price",
      "japanese": "価格",
      "kanaReading": "プライス",
      "pronunciationHint": "Use /aɪ/ and finish with /s/.",
      "exampleSentence": "The price includes tax.",
      "exampleJapanese": "価格には税金が含まれています。",
      "commonMistake": "“Price” is the amount asked; “cost” can be the amount paid.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "🏷️",
    "tags": [
      "shopping-and-money",
      "level-20",
      "price"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l20-cost",
    "category": "words",
    "level": 20,
    "title_en": "cost",
    "title_ja": "費用・費用がかかる",
    "content": {
      "word": "cost",
      "japanese": "費用・費用がかかる",
      "kanaReading": "コスト",
      "pronunciationHint": "Use a short vowel and final /st/.",
      "exampleSentence": "How much does delivery cost?",
      "exampleJapanese": "配送料はいくらかかりますか。",
      "commonMistake": "Ask “How much does it cost?” not “How much is the cost?” in casual speech.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "💰",
    "tags": [
      "shopping-and-money",
      "level-20",
      "cost"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l20-cash",
    "category": "words",
    "level": 20,
    "title_en": "cash",
    "title_ja": "現金",
    "content": {
      "word": "cash",
      "japanese": "現金",
      "kanaReading": "キャッシュ",
      "pronunciationHint": "Use /æ/ and finish with /ʃ/.",
      "exampleSentence": "Can I pay in cash?",
      "exampleJapanese": "現金で払えますか。",
      "commonMistake": "Say “pay in cash” or “pay cash,” not “pay by cash.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "💵",
    "tags": [
      "shopping-and-money",
      "level-20",
      "cash"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l20-change",
    "category": "words",
    "level": 20,
    "title_en": "change",
    "title_ja": "おつり・変化",
    "content": {
      "word": "change",
      "japanese": "おつり・変化",
      "kanaReading": "チェインジ",
      "pronunciationHint": "Begin /tʃ/ and finish /ndʒ/.",
      "exampleSentence": "Here is your change.",
      "exampleJapanese": "こちらがおつりです。",
      "commonMistake": "“Change” is uncountable when it means coins or money returned.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "🪙",
    "tags": [
      "shopping-and-money",
      "level-20",
      "change"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l20-receipt",
    "category": "words",
    "level": 20,
    "title_en": "receipt",
    "title_ja": "領収書・レシート",
    "content": {
      "word": "receipt",
      "japanese": "領収書・レシート",
      "kanaReading": "リシート",
      "pronunciationHint": "The p is silent; stress CEIPT.",
      "exampleSentence": "Would you like a receipt?",
      "exampleJapanese": "レシートは必要ですか。",
      "commonMistake": "Do not pronounce the written p.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "🧾",
    "tags": [
      "shopping-and-money",
      "level-20",
      "receipt"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l20-discount",
    "category": "words",
    "level": 20,
    "title_en": "discount",
    "title_ja": "割引",
    "content": {
      "word": "discount",
      "japanese": "割引",
      "kanaReading": "ディスカウント",
      "pronunciationHint": "As a noun, stress DIS.",
      "exampleSentence": "This coupon gives a ten-percent discount.",
      "exampleJapanese": "このクーポンで10パーセント割引になります。",
      "commonMistake": "Say “a discount on an item,” not “discount of an item.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "💸",
    "tags": [
      "shopping-and-money",
      "level-20",
      "discount"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l20-size",
    "category": "words",
    "level": 20,
    "title_en": "size",
    "title_ja": "サイズ・大きさ",
    "content": {
      "word": "size",
      "japanese": "サイズ・大きさ",
      "kanaReading": "サイズ",
      "pronunciationHint": "Finish with voiced /z/.",
      "exampleSentence": "Do you have this in a larger size?",
      "exampleJapanese": "これのもっと大きいサイズはありますか。",
      "commonMistake": "Use “What size?” rather than “Which size are you?”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "📏",
    "tags": [
      "shopping-and-money",
      "level-20",
      "size"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l20-cheap",
    "category": "words",
    "level": 20,
    "title_en": "cheap",
    "title_ja": "安い",
    "content": {
      "word": "cheap",
      "japanese": "安い",
      "kanaReading": "チープ",
      "pronunciationHint": "Use /tʃ/ and hold /iː/.",
      "exampleSentence": "The bag was cheap but sturdy.",
      "exampleJapanese": "そのかばんは安いけれど丈夫でした。",
      "commonMistake": "“Cheap” can imply low quality; use “inexpensive” for a neutral tone.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "🪙",
    "tags": [
      "shopping-and-money",
      "level-20",
      "cheap"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l20-expensive",
    "category": "words",
    "level": 20,
    "title_en": "expensive",
    "title_ja": "高価な",
    "content": {
      "word": "expensive",
      "japanese": "高価な",
      "kanaReading": "イクスペンシヴ",
      "pronunciationHint": "Stress PEN.",
      "exampleSentence": "That jacket is too expensive for me.",
      "exampleJapanese": "その上着は私には高すぎます。",
      "commonMistake": "Say “expensive,” not “high price” as an adjective.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "💎",
    "tags": [
      "shopping-and-money",
      "level-20",
      "expensive"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l20-order",
    "category": "words",
    "level": 20,
    "title_en": "order",
    "title_ja": "注文・注文する",
    "content": {
      "word": "order",
      "japanese": "注文・注文する",
      "kanaReading": "オーダー",
      "pronunciationHint": "Stress OR; pronounce r in US English.",
      "exampleSentence": "I ordered the soup without onions.",
      "exampleJapanese": "スープを玉ねぎ抜きで注文しました。",
      "commonMistake": "Use “order something,” not “order for something.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "shopping-and-money"
    },
    "icon": "🛒",
    "tags": [
      "shopping-and-money",
      "level-20",
      "order"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l21-neighbor",
    "category": "words",
    "level": 21,
    "title_en": "neighbor",
    "title_ja": "近所の人",
    "content": {
      "word": "neighbor",
      "japanese": "近所の人",
      "kanaReading": "ネイバー",
      "pronunciationHint": "Use /eɪ/ and a voiced /b/.",
      "exampleSentence": "Our neighbor watered the plants for us.",
      "exampleJapanese": "近所の人が代わりに植物へ水をやってくれました。",
      "commonMistake": "US spelling is “neighbor”; UK spelling is “neighbour.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🏘️",
    "tags": [
      "relationships",
      "level-21",
      "neighbor"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l21-guest",
    "category": "words",
    "level": 21,
    "title_en": "guest",
    "title_ja": "客・ゲスト",
    "content": {
      "word": "guest",
      "japanese": "客・ゲスト",
      "kanaReading": "ゲスト",
      "pronunciationHint": "The u is silent; start with hard g.",
      "exampleSentence": "Each guest received a name card.",
      "exampleJapanese": "客は一人ずつ名札を受け取りました。",
      "commonMistake": "Do not pronounce the written u.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🛎️",
    "tags": [
      "relationships",
      "level-21",
      "guest"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l21-host",
    "category": "words",
    "level": 21,
    "title_en": "host",
    "title_ja": "主催者・迎える人",
    "content": {
      "word": "host",
      "japanese": "主催者・迎える人",
      "kanaReading": "ホウスト",
      "pronunciationHint": "Use /oʊ/ and finish with /st/.",
      "exampleSentence": "The host introduced everyone.",
      "exampleJapanese": "主催者が全員を紹介しました。",
      "commonMistake": "A host welcomes guests; it does not mean every event worker.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🎙️",
    "tags": [
      "relationships",
      "level-21",
      "host"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l21-partner",
    "category": "words",
    "level": 21,
    "title_en": "partner",
    "title_ja": "相手・協力者",
    "content": {
      "word": "partner",
      "japanese": "相手・協力者",
      "kanaReading": "パートナー",
      "pronunciationHint": "Stress PART; the second vowel is weak.",
      "exampleSentence": "Practice the dialogue with a partner.",
      "exampleJapanese": "相手と会話を練習してください。",
      "commonMistake": "“Partner” does not always mean a romantic partner.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🤝",
    "tags": [
      "relationships",
      "level-21",
      "partner"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l21-team",
    "category": "words",
    "level": 21,
    "title_en": "team",
    "title_ja": "チーム",
    "content": {
      "word": "team",
      "japanese": "チーム",
      "kanaReading": "チーム",
      "pronunciationHint": "Hold the long /iː/ vowel.",
      "exampleSentence": "Our team solved the problem together.",
      "exampleJapanese": "私たちのチームは一緒に問題を解決しました。",
      "commonMistake": "Say “on a team” in US English, often “in a team” in UK English.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "👨‍👩‍👧‍👦",
    "tags": [
      "relationships",
      "level-21",
      "team"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l21-promise",
    "category": "words",
    "level": 21,
    "title_en": "promise",
    "title_ja": "約束・約束する",
    "content": {
      "word": "promise",
      "japanese": "約束・約束する",
      "kanaReading": "プロミス",
      "pronunciationHint": "Stress PROM; the final s is /s/.",
      "exampleSentence": "I promise to return it tomorrow.",
      "exampleJapanese": "明日返すと約束します。",
      "commonMistake": "Use “promise to do,” not “promise doing.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🤞",
    "tags": [
      "relationships",
      "level-21",
      "promise"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l21-trust",
    "category": "words",
    "level": 21,
    "title_en": "trust",
    "title_ja": "信頼・信頼する",
    "content": {
      "word": "trust",
      "japanese": "信頼・信頼する",
      "kanaReading": "トラスト",
      "pronunciationHint": "Blend /tr/ and use short /ʌ/.",
      "exampleSentence": "It takes time to build trust.",
      "exampleJapanese": "信頼を築くには時間がかかります。",
      "commonMistake": "Use “trust someone,” not “trust in someone,” for ordinary confidence.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🫶",
    "tags": [
      "relationships",
      "level-21",
      "trust"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l21-support",
    "category": "words",
    "level": 21,
    "title_en": "support",
    "title_ja": "支援・支える",
    "content": {
      "word": "support",
      "japanese": "支援・支える",
      "kanaReading": "サポート",
      "pronunciationHint": "Stress PORT.",
      "exampleSentence": "Thank you for your support this week.",
      "exampleJapanese": "今週支えてくれてありがとう。",
      "commonMistake": "“Support” is usually uncountable as help.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "💪",
    "tags": [
      "relationships",
      "level-21",
      "support"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l21-respect",
    "category": "words",
    "level": 21,
    "title_en": "respect",
    "title_ja": "尊敬・尊重する",
    "content": {
      "word": "respect",
      "japanese": "尊敬・尊重する",
      "kanaReading": "リスペクト",
      "pronunciationHint": "As a noun, stress SPECT strongly.",
      "exampleSentence": "We respect each other’s opinions.",
      "exampleJapanese": "私たちは互いの意見を尊重します。",
      "commonMistake": "Use “respect someone,” without “to.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "🙇",
    "tags": [
      "relationships",
      "level-21",
      "respect"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l21-advice",
    "category": "words",
    "level": 21,
    "title_en": "advice",
    "title_ja": "助言",
    "content": {
      "word": "advice",
      "japanese": "助言",
      "kanaReading": "アドヴァイス",
      "pronunciationHint": "Finish with unvoiced /s/.",
      "exampleSentence": "Her advice helped me decide.",
      "exampleJapanese": "彼女の助言が決断の助けになりました。",
      "commonMistake": "“Advice” is uncountable; say “a piece of advice.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "relationships"
    },
    "icon": "💡",
    "tags": [
      "relationships",
      "level-21",
      "advice"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l22-available",
    "category": "words",
    "level": 22,
    "title_en": "available",
    "title_ja": "利用できる・都合がつく",
    "content": {
      "word": "available",
      "japanese": "利用できる・都合がつく",
      "kanaReading": "アヴェイラブル",
      "pronunciationHint": "Stress VAIL; later syllables are light.",
      "exampleSentence": "Is this room available after three?",
      "exampleJapanese": "この部屋は3時以降空いていますか。",
      "commonMistake": "For people, “available” means free to meet, not always single.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🟢",
    "tags": [
      "useful-adjectives",
      "level-22",
      "available"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l22-convenient",
    "category": "words",
    "level": 22,
    "title_en": "convenient",
    "title_ja": "便利な",
    "content": {
      "word": "convenient",
      "japanese": "便利な",
      "kanaReading": "コンヴィーニエント",
      "pronunciationHint": "Stress VEN.",
      "exampleSentence": "The later train is more convenient for me.",
      "exampleJapanese": "後の電車のほうが私には便利です。",
      "commonMistake": "Something is convenient for a person, not convenient to a person.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "👌",
    "tags": [
      "useful-adjectives",
      "level-22",
      "convenient"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l22-possible",
    "category": "words",
    "level": 22,
    "title_en": "possible",
    "title_ja": "可能な",
    "content": {
      "word": "possible",
      "japanese": "可能な",
      "kanaReading": "ポッシブル",
      "pronunciationHint": "Stress POS; the ending is weak.",
      "exampleSentence": "Is it possible to change the date?",
      "exampleJapanese": "日付を変更することは可能ですか。",
      "commonMistake": "Say “It is possible to…,” not “It is possible that I can…” when simpler.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🔓",
    "tags": [
      "useful-adjectives",
      "level-22",
      "possible"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l22-necessary",
    "category": "words",
    "level": 22,
    "title_en": "necessary",
    "title_ja": "必要な",
    "content": {
      "word": "necessary",
      "japanese": "必要な",
      "kanaReading": "ネセサリー",
      "pronunciationHint": "Stress NES; keep later syllables light.",
      "exampleSentence": "A reservation is not necessary today.",
      "exampleJapanese": "今日は予約は必要ありません。",
      "commonMistake": "Spell it with one c and two s letters.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "📌",
    "tags": [
      "useful-adjectives",
      "level-22",
      "necessary"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l22-certain",
    "category": "words",
    "level": 22,
    "title_en": "certain",
    "title_ja": "確かな・ある",
    "content": {
      "word": "certain",
      "japanese": "確かな・ある",
      "kanaReading": "サートゥン",
      "pronunciationHint": "The t is often softened; stress CER.",
      "exampleSentence": "I am certain that I locked the door.",
      "exampleJapanese": "ドアに鍵をかけたことは確かです。",
      "commonMistake": "“Certain” is stronger than “probably.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "✔️",
    "tags": [
      "useful-adjectives",
      "level-22",
      "certain"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l22-familiar",
    "category": "words",
    "level": 22,
    "title_en": "familiar",
    "title_ja": "よく知っている・見覚えのある",
    "content": {
      "word": "familiar",
      "japanese": "よく知っている・見覚えのある",
      "kanaReading": "ファミリアー",
      "pronunciationHint": "Stress MIL: fa-MIL-iar.",
      "exampleSentence": "This song sounds familiar.",
      "exampleJapanese": "この曲は聞き覚えがあります。",
      "commonMistake": "Say “familiar with something,” not “familiar to something” for your knowledge.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🎵",
    "tags": [
      "useful-adjectives",
      "level-22",
      "familiar"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l22-polite",
    "category": "words",
    "level": 22,
    "title_en": "polite",
    "title_ja": "礼儀正しい",
    "content": {
      "word": "polite",
      "japanese": "礼儀正しい",
      "kanaReading": "ポライト",
      "pronunciationHint": "Stress LITE and use /aɪ/.",
      "exampleSentence": "It is polite to wait your turn.",
      "exampleJapanese": "順番を待つのは礼儀正しいことです。",
      "commonMistake": "“Polite” describes behavior; “kind” describes caring.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🙏",
    "tags": [
      "useful-adjectives",
      "level-22",
      "polite"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l22-honest",
    "category": "words",
    "level": 22,
    "title_en": "honest",
    "title_ja": "正直な",
    "content": {
      "word": "honest",
      "japanese": "正直な",
      "kanaReading": "オネスト",
      "pronunciationHint": "The h is silent; stress HON.",
      "exampleSentence": "Please give me an honest answer.",
      "exampleJapanese": "正直な答えをください。",
      "commonMistake": "Use “honest with someone” and “honest about something.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🪞",
    "tags": [
      "useful-adjectives",
      "level-22",
      "honest"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l22-patient",
    "category": "words",
    "level": 22,
    "title_en": "patient",
    "title_ja": "辛抱強い・患者",
    "content": {
      "word": "patient",
      "japanese": "辛抱強い・患者",
      "kanaReading": "ペイシェント",
      "pronunciationHint": "Stress PA and pronounce ti as /ʃ/.",
      "exampleSentence": "Our instructor was patient with beginners.",
      "exampleJapanese": "先生は初心者に辛抱強く接しました。",
      "commonMistake": "Do not confuse adjective “patient” with noun “patient.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "🧘",
    "tags": [
      "useful-adjectives",
      "level-22",
      "patient"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l22-careful",
    "category": "words",
    "level": 22,
    "title_en": "careful",
    "title_ja": "注意深い",
    "content": {
      "word": "careful",
      "japanese": "注意深い",
      "kanaReading": "ケアフル",
      "pronunciationHint": "Stress CARE; the ending is weak.",
      "exampleSentence": "Be careful with the hot plate.",
      "exampleJapanese": "熱い皿に気をつけてください。",
      "commonMistake": "Say “careful with” an object and “careful about” a decision.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "useful-adjectives"
    },
    "icon": "⚠️",
    "tags": [
      "useful-adjectives",
      "level-22",
      "careful"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l23-arrive",
    "category": "words",
    "level": 23,
    "title_en": "arrive",
    "title_ja": "到着する",
    "content": {
      "word": "arrive",
      "japanese": "到着する",
      "kanaReading": "アライヴ",
      "pronunciationHint": "Stress RIVE and finish with voiced v.",
      "exampleSentence": "We arrived at the venue before noon.",
      "exampleJapanese": "私たちは正午前に会場へ着きました。",
      "commonMistake": "Use “arrive at” a place and “arrive in” a city or country.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "📍",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "arrive"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l23-leave",
    "category": "words",
    "level": 23,
    "title_en": "leave",
    "title_ja": "出発する・置いていく",
    "content": {
      "word": "leave",
      "japanese": "出発する・置いていく",
      "kanaReading": "リーヴ",
      "pronunciationHint": "Hold /iː/ and finish with voiced v.",
      "exampleSentence": "The first bus leaves at six.",
      "exampleJapanese": "始発バスは6時に出ます。",
      "commonMistake": "“Leave” can mean depart or intentionally/accidentally keep something behind.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🚪",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "leave"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l23-miss",
    "category": "words",
    "level": 23,
    "title_en": "miss",
    "title_ja": "逃す・恋しく思う",
    "content": {
      "word": "miss",
      "japanese": "逃す・恋しく思う",
      "kanaReading": "ミス",
      "pronunciationHint": "Use short /ɪ/ and final /s/.",
      "exampleSentence": "I missed the train by one minute.",
      "exampleJapanese": "1分差で電車に乗り遅れました。",
      "commonMistake": "Say “miss the bus,” not “miss to the bus.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "💨",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "miss"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l23-catch",
    "category": "words",
    "level": 23,
    "title_en": "catch",
    "title_ja": "つかむ・間に合う",
    "content": {
      "word": "catch",
      "japanese": "つかむ・間に合う",
      "kanaReading": "キャッチ",
      "pronunciationHint": "Use /æ/ and finish /tʃ/.",
      "exampleSentence": "We can catch the express train.",
      "exampleJapanese": "急行電車に間に合います。",
      "commonMistake": "The past form is “caught,” not “catched.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🫴",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "catch"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l23-cancel",
    "category": "words",
    "level": 23,
    "title_en": "cancel",
    "title_ja": "取り消す",
    "content": {
      "word": "cancel",
      "japanese": "取り消す",
      "kanaReading": "キャンセル",
      "pronunciationHint": "Stress CAN; the second vowel is weak.",
      "exampleSentence": "They canceled the outdoor event.",
      "exampleJapanese": "彼らは屋外イベントを中止しました。",
      "commonMistake": "US past spelling may be “canceled”; UK commonly uses “cancelled.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "❌",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "cancel"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l23-delay",
    "category": "words",
    "level": 23,
    "title_en": "delay",
    "title_ja": "遅らせる・遅延",
    "content": {
      "word": "delay",
      "japanese": "遅らせる・遅延",
      "kanaReading": "ディレイ",
      "pronunciationHint": "Stress LAY.",
      "exampleSentence": "Heavy rain delayed our flight.",
      "exampleJapanese": "大雨で飛行機が遅れました。",
      "commonMistake": "Use “be delayed,” not “be delay.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🕒",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "delay"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l23-reserve",
    "category": "words",
    "level": 23,
    "title_en": "reserve",
    "title_ja": "予約する・取っておく",
    "content": {
      "word": "reserve",
      "japanese": "予約する・取っておく",
      "kanaReading": "リザーヴ",
      "pronunciationHint": "Stress SERVE.",
      "exampleSentence": "I reserved a table by the window.",
      "exampleJapanese": "窓際の席を予約しました。",
      "commonMistake": "Reserve a table or room; book is often more conversational.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🪑",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "reserve"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l23-confirm",
    "category": "words",
    "level": 23,
    "title_en": "confirm",
    "title_ja": "確認する",
    "content": {
      "word": "confirm",
      "japanese": "確認する",
      "kanaReading": "コンファーム",
      "pronunciationHint": "Stress FIRM.",
      "exampleSentence": "Please confirm your name and address.",
      "exampleJapanese": "お名前と住所をご確認ください。",
      "commonMistake": "“Confirm” means establish as correct, not simply look at.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "✅",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "confirm"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l23-prepare",
    "category": "words",
    "level": 23,
    "title_en": "prepare",
    "title_ja": "準備する",
    "content": {
      "word": "prepare",
      "japanese": "準備する",
      "kanaReading": "プリペア",
      "pronunciationHint": "Stress PARE.",
      "exampleSentence": "I prepared a short introduction.",
      "exampleJapanese": "短い自己紹介を準備しました。",
      "commonMistake": "Use “prepare for an event” but “prepare something” without “for.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🧰",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "prepare"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l23-deliver",
    "category": "words",
    "level": 23,
    "title_en": "deliver",
    "title_ja": "配達する・伝える",
    "content": {
      "word": "deliver",
      "japanese": "配達する・伝える",
      "kanaReading": "デリヴァー",
      "pronunciationHint": "Stress LIV.",
      "exampleSentence": "They deliver groceries in the evening.",
      "exampleJapanese": "その店は夕方に食料品を配達します。",
      "commonMistake": "“Deliver something to someone” is the clearest basic pattern; a double-object pattern is also possible in some contexts.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "plans-and-logistics"
    },
    "icon": "🚚",
    "tags": [
      "plans-and-logistics",
      "level-23",
      "deliver"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l24-device",
    "category": "words",
    "level": 24,
    "title_en": "device",
    "title_ja": "機器・端末",
    "content": {
      "word": "device",
      "japanese": "機器・端末",
      "kanaReading": "ディヴァイス",
      "pronunciationHint": "Stress VICE and finish with /s/.",
      "exampleSentence": "Restart the device after the update.",
      "exampleJapanese": "更新後に端末を再起動してください。",
      "commonMistake": "“Device” is broad; name the phone or tablet when specificity helps.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "📱",
    "tags": [
      "technology",
      "level-24",
      "device"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l24-screen",
    "category": "words",
    "level": 24,
    "title_en": "screen",
    "title_ja": "画面",
    "content": {
      "word": "screen",
      "japanese": "画面",
      "kanaReading": "スクリーン",
      "pronunciationHint": "Blend /skr/ and hold /iː/.",
      "exampleSentence": "The text is too small on this screen.",
      "exampleJapanese": "この画面では文字が小さすぎます。",
      "commonMistake": "Say “on the screen,” not “in the screen.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🖥️",
    "tags": [
      "technology",
      "level-24",
      "screen"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l24-charger",
    "category": "words",
    "level": 24,
    "title_en": "charger",
    "title_ja": "充電器",
    "content": {
      "word": "charger",
      "japanese": "充電器",
      "kanaReading": "チャージャー",
      "pronunciationHint": "Begin /tʃ/ and stress CHAR.",
      "exampleSentence": "I packed the wrong charger.",
      "exampleJapanese": "間違った充電器を荷物に入れました。",
      "commonMistake": "A charger supplies power; a cable alone may not be a charger.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🔌",
    "tags": [
      "technology",
      "level-24",
      "charger"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l24-battery",
    "category": "words",
    "level": 24,
    "title_en": "battery",
    "title_ja": "電池・バッテリー",
    "content": {
      "word": "battery",
      "japanese": "電池・バッテリー",
      "kanaReading": "バッテリー",
      "pronunciationHint": "Stress BAT; US speech often softens the t.",
      "exampleSentence": "My battery is very low.",
      "exampleJapanese": "バッテリー残量がほとんどありません。",
      "commonMistake": "Say “the battery is low,” not usually “the battery is little.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🔋",
    "tags": [
      "technology",
      "level-24",
      "battery"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l24-password",
    "category": "words",
    "level": 24,
    "title_en": "password",
    "title_ja": "パスワード",
    "content": {
      "word": "password",
      "japanese": "パスワード",
      "kanaReading": "パスワード",
      "pronunciationHint": "Stress PASS and connect both parts.",
      "exampleSentence": "Choose a unique password for this account.",
      "exampleJapanese": "このアカウントには固有のパスワードを選んでください。",
      "commonMistake": "Do not share or reuse passwords.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🔐",
    "tags": [
      "technology",
      "level-24",
      "password"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l24-account",
    "category": "words",
    "level": 24,
    "title_en": "account",
    "title_ja": "アカウント・口座",
    "content": {
      "word": "account",
      "japanese": "アカウント・口座",
      "kanaReading": "アカウント",
      "pronunciationHint": "Stress COUNT.",
      "exampleSentence": "I created a separate study account.",
      "exampleJapanese": "学習用に別のアカウントを作りました。",
      "commonMistake": "Use “log in to an account,” not “login an account.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "👤",
    "tags": [
      "technology",
      "level-24",
      "account"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l24-update",
    "category": "words",
    "level": 24,
    "title_en": "update",
    "title_ja": "更新・更新する",
    "content": {
      "word": "update",
      "japanese": "更新・更新する",
      "kanaReading": "アップデイト",
      "pronunciationHint": "As a verb, stress DATE; as a noun, often stress UP.",
      "exampleSentence": "Please update the app tonight.",
      "exampleJapanese": "今夜アプリを更新してください。",
      "commonMistake": "“Update” changes existing software; “upgrade” moves to a higher version or plan.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🔄",
    "tags": [
      "technology",
      "level-24",
      "update"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l24-download",
    "category": "words",
    "level": 24,
    "title_en": "download",
    "title_ja": "ダウンロードする",
    "content": {
      "word": "download",
      "japanese": "ダウンロードする",
      "kanaReading": "ダウンロウド",
      "pronunciationHint": "As a verb, usually stress LOAD.",
      "exampleSentence": "Download the worksheet before class.",
      "exampleJapanese": "授業前にワークシートをダウンロードしてください。",
      "commonMistake": "A download moves data to your device; upload sends it away.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "⬇️",
    "tags": [
      "technology",
      "level-24",
      "download"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l24-upload",
    "category": "words",
    "level": 24,
    "title_en": "upload",
    "title_ja": "アップロードする",
    "content": {
      "word": "upload",
      "japanese": "アップロードする",
      "kanaReading": "アップロウド",
      "pronunciationHint": "As a verb, usually stress LOAD.",
      "exampleSentence": "Upload one clear photo of your work.",
      "exampleJapanese": "課題の鮮明な写真を1枚アップロードしてください。",
      "commonMistake": "Do not confuse upload with download.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "⬆️",
    "tags": [
      "technology",
      "level-24",
      "upload"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l24-connect",
    "category": "words",
    "level": 24,
    "title_en": "connect",
    "title_ja": "接続する・つながる",
    "content": {
      "word": "connect",
      "japanese": "接続する・つながる",
      "kanaReading": "コネクト",
      "pronunciationHint": "Stress NECT.",
      "exampleSentence": "Connect the headphones before the call.",
      "exampleJapanese": "通話前にヘッドホンを接続してください。",
      "commonMistake": "Use “connect to a network” and “connect a device to a network.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "technology"
    },
    "icon": "🔗",
    "tags": [
      "technology",
      "level-24",
      "connect"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l25-recycle",
    "category": "words",
    "level": 25,
    "title_en": "recycle",
    "title_ja": "リサイクルする",
    "content": {
      "word": "recycle",
      "japanese": "リサイクルする",
      "kanaReading": "リサイクル",
      "pronunciationHint": "Stress CY: re-CY-cle.",
      "exampleSentence": "We recycle glass at the community center.",
      "exampleJapanese": "地域センターでガラスをリサイクルします。",
      "commonMistake": "Not every material marked plastic is locally recyclable.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "♻️",
    "tags": [
      "environment",
      "level-25",
      "recycle"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l25-waste",
    "category": "words",
    "level": 25,
    "title_en": "waste",
    "title_ja": "廃棄物・無駄にする",
    "content": {
      "word": "waste",
      "japanese": "廃棄物・無駄にする",
      "kanaReading": "ウェイスト",
      "pronunciationHint": "Use /eɪ/ and finish /st/.",
      "exampleSentence": "Plan meals carefully to reduce food waste.",
      "exampleJapanese": "食品ロスを減らすため、食事をよく計画しましょう。",
      "commonMistake": "“Waste” is usually uncountable when referring to rubbish broadly.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🗑️",
    "tags": [
      "environment",
      "level-25",
      "waste"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l25-energy",
    "category": "words",
    "level": 25,
    "title_en": "energy",
    "title_ja": "エネルギー",
    "content": {
      "word": "energy",
      "japanese": "エネルギー",
      "kanaReading": "エナジー",
      "pronunciationHint": "Stress EN; the g sounds /dʒ/.",
      "exampleSentence": "Turning off lights saves energy.",
      "exampleJapanese": "照明を消すとエネルギーを節約できます。",
      "commonMistake": "Do not pronounce the g as in “go.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "⚡",
    "tags": [
      "environment",
      "level-25",
      "energy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l25-pollution",
    "category": "words",
    "level": 25,
    "title_en": "pollution",
    "title_ja": "汚染",
    "content": {
      "word": "pollution",
      "japanese": "汚染",
      "kanaReading": "ポルーション",
      "pronunciationHint": "Stress LU and pronounce tion /ʃən/.",
      "exampleSentence": "The city is working to reduce air pollution.",
      "exampleJapanese": "市は大気汚染の削減に取り組んでいます。",
      "commonMistake": "“Pollution” is uncountable; avoid “pollutions” in general use.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🏭",
    "tags": [
      "environment",
      "level-25",
      "pollution"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l25-climate",
    "category": "words",
    "level": 25,
    "title_en": "climate",
    "title_ja": "気候",
    "content": {
      "word": "climate",
      "japanese": "気候",
      "kanaReading": "クライメット",
      "pronunciationHint": "Stress CLI and use /aɪ/.",
      "exampleSentence": "This plant grows well in a warm climate.",
      "exampleJapanese": "この植物は暖かい気候でよく育ちます。",
      "commonMistake": "Weather is short-term; climate describes long-term patterns.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🌍",
    "tags": [
      "environment",
      "level-25",
      "climate"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l25-protect",
    "category": "words",
    "level": 25,
    "title_en": "protect",
    "title_ja": "守る",
    "content": {
      "word": "protect",
      "japanese": "守る",
      "kanaReading": "プロテクト",
      "pronunciationHint": "Stress TECT.",
      "exampleSentence": "Trees protect the path from strong wind.",
      "exampleJapanese": "木々が強風から道を守っています。",
      "commonMistake": "Use “protect something from danger,” not “protect danger.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🛡️",
    "tags": [
      "environment",
      "level-25",
      "protect"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l25-reduce",
    "category": "words",
    "level": 25,
    "title_en": "reduce",
    "title_ja": "減らす",
    "content": {
      "word": "reduce",
      "japanese": "減らす",
      "kanaReading": "リデュース",
      "pronunciationHint": "Stress DUCE.",
      "exampleSentence": "We can reduce water use at home.",
      "exampleJapanese": "家庭で水の使用量を減らせます。",
      "commonMistake": "“Reduce” is transitive; say what becomes smaller.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "📉",
    "tags": [
      "environment",
      "level-25",
      "reduce"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l25-reuse",
    "category": "words",
    "level": 25,
    "title_en": "reuse",
    "title_ja": "再利用する",
    "content": {
      "word": "reuse",
      "japanese": "再利用する",
      "kanaReading": "リユーズ",
      "pronunciationHint": "Stress USE and finish with voiced /z/.",
      "exampleSentence": "Reuse the jar to store pencils.",
      "exampleJapanese": "その瓶を鉛筆入れとして再利用してください。",
      "commonMistake": "The noun “reuse” may have /s/ at the end; the verb has /z/.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🫙",
    "tags": [
      "environment",
      "level-25",
      "reuse"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l25-resource",
    "category": "words",
    "level": 25,
    "title_en": "resource",
    "title_ja": "資源・資料",
    "content": {
      "word": "resource",
      "japanese": "資源・資料",
      "kanaReading": "リソース",
      "pronunciationHint": "Stress RE in US English; UK stress may differ.",
      "exampleSentence": "Clean water is a precious resource.",
      "exampleJapanese": "きれいな水は貴重な資源です。",
      "commonMistake": "Use plural “resources” for several materials or sources.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "💧",
    "tags": [
      "environment",
      "level-25",
      "resource"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l25-sustainable",
    "category": "words",
    "level": 25,
    "title_en": "sustainable",
    "title_ja": "持続可能な",
    "content": {
      "word": "sustainable",
      "japanese": "持続可能な",
      "kanaReading": "サステイナブル",
      "pronunciationHint": "Stress STAIN; later syllables are light.",
      "exampleSentence": "The café uses sustainable packaging.",
      "exampleJapanese": "そのカフェは持続可能な包装を使っています。",
      "commonMistake": "Do not use “sustainable” merely to mean popular or modern.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "environment"
    },
    "icon": "🌱",
    "tags": [
      "environment",
      "level-25",
      "sustainable"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l26-confident",
    "category": "words",
    "level": 26,
    "title_en": "confident",
    "title_ja": "自信がある",
    "content": {
      "word": "confident",
      "japanese": "自信がある",
      "kanaReading": "コンフィデント",
      "pronunciationHint": "Stress CON; later vowels are weak.",
      "exampleSentence": "I feel more confident after practicing.",
      "exampleJapanese": "練習した後はもっと自信が持てます。",
      "commonMistake": "Say “confident about something” or “confident that…”.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😌",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "confident"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l26-nervous",
    "category": "words",
    "level": 26,
    "title_en": "nervous",
    "title_ja": "緊張している",
    "content": {
      "word": "nervous",
      "japanese": "緊張している",
      "kanaReading": "ナーヴァス",
      "pronunciationHint": "Stress NER; the second vowel is weak.",
      "exampleSentence": "She felt nervous before her presentation.",
      "exampleJapanese": "彼女は発表前に緊張していました。",
      "commonMistake": "“Nervous” describes anxiety; “sensitive” has a different meaning.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😬",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "nervous"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l26-proud",
    "category": "words",
    "level": 26,
    "title_en": "proud",
    "title_ja": "誇りに思う",
    "content": {
      "word": "proud",
      "japanese": "誇りに思う",
      "kanaReading": "プラウド",
      "pronunciationHint": "Blend /pr/ and glide through /aʊ/.",
      "exampleSentence": "I am proud of your steady progress.",
      "exampleJapanese": "あなたの着実な進歩を誇りに思います。",
      "commonMistake": "Say “proud of,” not “proud for.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "🏅",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "proud"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l26-disappointed",
    "category": "words",
    "level": 26,
    "title_en": "disappointed",
    "title_ja": "がっかりした",
    "content": {
      "word": "disappointed",
      "japanese": "がっかりした",
      "kanaReading": "ディサポインティッド",
      "pronunciationHint": "Stress POINT.",
      "exampleSentence": "We were disappointed by the cancellation.",
      "exampleJapanese": "私たちは中止にがっかりしました。",
      "commonMistake": "Use “disappointed” for a person and “disappointing” for a result.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😞",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "disappointed"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l26-grateful",
    "category": "words",
    "level": 26,
    "title_en": "grateful",
    "title_ja": "感謝している",
    "content": {
      "word": "grateful",
      "japanese": "感謝している",
      "kanaReading": "グレイトフル",
      "pronunciationHint": "Blend /gr/ and use /eɪ/.",
      "exampleSentence": "I am grateful for your honest feedback.",
      "exampleJapanese": "率直なフィードバックに感謝しています。",
      "commonMistake": "Say “grateful for something” and “grateful to someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "🙏",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "grateful"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l26-curious",
    "category": "words",
    "level": 26,
    "title_en": "curious",
    "title_ja": "好奇心がある",
    "content": {
      "word": "curious",
      "japanese": "好奇心がある",
      "kanaReading": "キュリアス",
      "pronunciationHint": "Stress CURE; the ending is light.",
      "exampleSentence": "The children were curious about the new machine.",
      "exampleJapanese": "子どもたちは新しい機械に興味津々でした。",
      "commonMistake": "“Curious” can mean interested or unusual, depending on context.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "🧐",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "curious"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l26-embarrassed",
    "category": "words",
    "level": 26,
    "title_en": "embarrassed",
    "title_ja": "恥ずかしい・気まずい",
    "content": {
      "word": "embarrassed",
      "japanese": "恥ずかしい・気まずい",
      "kanaReading": "エンバラスト",
      "pronunciationHint": "Stress BAR and finish with t.",
      "exampleSentence": "I felt embarrassed when I forgot her name.",
      "exampleJapanese": "彼女の名前を忘れて恥ずかしく感じました。",
      "commonMistake": "Use “embarrassed” for a person and “embarrassing” for the situation.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😳",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "embarrassed"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l26-relieved",
    "category": "words",
    "level": 26,
    "title_en": "relieved",
    "title_ja": "ほっとした",
    "content": {
      "word": "relieved",
      "japanese": "ほっとした",
      "kanaReading": "リリーヴド",
      "pronunciationHint": "Stress LIEVED and keep the final d.",
      "exampleSentence": "We were relieved to hear the good news.",
      "exampleJapanese": "良い知らせを聞いてほっとしました。",
      "commonMistake": "Say “relieved to know” or “relieved that…,” not “relieved about” in every case.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😮‍💨",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "relieved"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l26-frustrated",
    "category": "words",
    "level": 26,
    "title_en": "frustrated",
    "title_ja": "いら立った・もどかしい",
    "content": {
      "word": "frustrated",
      "japanese": "いら立った・もどかしい",
      "kanaReading": "フラストレイティッド",
      "pronunciationHint": "Stress FRUS.",
      "exampleSentence": "He was frustrated with the slow connection.",
      "exampleJapanese": "彼は接続の遅さにいら立っていました。",
      "commonMistake": "Use “frustrated” for a person and “frustrating” for a cause.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "😣",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "frustrated"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l26-calm",
    "category": "words",
    "level": 26,
    "title_en": "calm",
    "title_ja": "落ち着いた",
    "content": {
      "word": "calm",
      "japanese": "落ち着いた",
      "kanaReading": "カーム",
      "pronunciationHint": "The l is silent; hold the vowel.",
      "exampleSentence": "Take a breath and stay calm.",
      "exampleJapanese": "深呼吸して落ち着いてください。",
      "commonMistake": "Do not pronounce the written l.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "nuanced-emotions"
    },
    "icon": "🧘",
    "tags": [
      "nuanced-emotions",
      "level-26",
      "calm"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l27-compare",
    "category": "words",
    "level": 27,
    "title_en": "compare",
    "title_ja": "比較する",
    "content": {
      "word": "compare",
      "japanese": "比較する",
      "kanaReading": "コンペア",
      "pronunciationHint": "Stress PARE.",
      "exampleSentence": "Compare the two solutions before choosing.",
      "exampleJapanese": "選ぶ前に2つの解決策を比較してください。",
      "commonMistake": "Compare A with B to examine differences; “compare to” often notes similarity.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "⚖️",
    "tags": [
      "critical-thinking",
      "level-27",
      "compare"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l27-contrast",
    "category": "words",
    "level": 27,
    "title_en": "contrast",
    "title_ja": "対比する・対照",
    "content": {
      "word": "contrast",
      "japanese": "対比する・対照",
      "kanaReading": "コントラスト",
      "pronunciationHint": "As a verb, stress TRAST; noun stress often begins earlier.",
      "exampleSentence": "Contrast the writer’s two main ideas.",
      "exampleJapanese": "筆者の2つの主な考えを対比してください。",
      "commonMistake": "Do not use “contrast” when only listing similarities.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "◐",
    "tags": [
      "critical-thinking",
      "level-27",
      "contrast"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l27-describe",
    "category": "words",
    "level": 27,
    "title_en": "describe",
    "title_ja": "説明する・描写する",
    "content": {
      "word": "describe",
      "japanese": "説明する・描写する",
      "kanaReading": "ディスクライブ",
      "pronunciationHint": "Stress SCRIBE.",
      "exampleSentence": "Describe what changed in the picture.",
      "exampleJapanese": "絵の中で何が変わったか説明してください。",
      "commonMistake": "Describe something directly; do not add “about.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "🖼️",
    "tags": [
      "critical-thinking",
      "level-27",
      "describe"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l27-summarize",
    "category": "words",
    "level": 27,
    "title_en": "summarize",
    "title_ja": "要約する",
    "content": {
      "word": "summarize",
      "japanese": "要約する",
      "kanaReading": "サマライズ",
      "pronunciationHint": "Stress SUM and finish with voiced /z/.",
      "exampleSentence": "Summarize the article in three sentences.",
      "exampleJapanese": "記事を3文で要約してください。",
      "commonMistake": "A summary keeps key ideas, not every detail.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "📝",
    "tags": [
      "critical-thinking",
      "level-27",
      "summarize"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l27-analyze",
    "category": "words",
    "level": 27,
    "title_en": "analyze",
    "title_ja": "分析する",
    "content": {
      "word": "analyze",
      "japanese": "分析する",
      "kanaReading": "アナライズ",
      "pronunciationHint": "Stress AN and finish with voiced /z/.",
      "exampleSentence": "Analyze why the plan succeeded.",
      "exampleJapanese": "計画が成功した理由を分析してください。",
      "commonMistake": "Do not use “analyze about”; analyze takes a direct object.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "🔍",
    "tags": [
      "critical-thinking",
      "level-27",
      "analyze"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l27-evidence",
    "category": "words",
    "level": 27,
    "title_en": "evidence",
    "title_ja": "証拠・根拠",
    "content": {
      "word": "evidence",
      "japanese": "証拠・根拠",
      "kanaReading": "エヴィデンス",
      "pronunciationHint": "Stress EV; the later vowels are weak.",
      "exampleSentence": "The chart provides evidence for her claim.",
      "exampleJapanese": "その図は彼女の主張の根拠になります。",
      "commonMistake": "“Evidence” is uncountable; say “a piece of evidence.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "🔎",
    "tags": [
      "critical-thinking",
      "level-27",
      "evidence"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l27-reason",
    "category": "words",
    "level": 27,
    "title_en": "reason",
    "title_ja": "理由・推論する",
    "content": {
      "word": "reason",
      "japanese": "理由・推論する",
      "kanaReading": "リーズン",
      "pronunciationHint": "The s sounds /z/.",
      "exampleSentence": "Give one reason for your choice.",
      "exampleJapanese": "選んだ理由を1つ挙げてください。",
      "commonMistake": "Use “the reason for a decision” or “the reason why…”.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "🧠",
    "tags": [
      "critical-thinking",
      "level-27",
      "reason"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l27-result",
    "category": "words",
    "level": 27,
    "title_en": "result",
    "title_ja": "結果・結果として生じる",
    "content": {
      "word": "result",
      "japanese": "結果・結果として生じる",
      "kanaReading": "リザルト",
      "pronunciationHint": "Stress ZULT.",
      "exampleSentence": "The result matched our prediction.",
      "exampleJapanese": "結果は私たちの予想と一致しました。",
      "commonMistake": "Use “result of” for a cause and “result in” for an outcome.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "📊",
    "tags": [
      "critical-thinking",
      "level-27",
      "result"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l27-method",
    "category": "words",
    "level": 27,
    "title_en": "method",
    "title_ja": "方法",
    "content": {
      "word": "method",
      "japanese": "方法",
      "kanaReading": "メソッド",
      "pronunciationHint": "Use the voiceless th /θ/, as in “think.”",
      "exampleSentence": "This method works well for short texts.",
      "exampleJapanese": "この方法は短い文章に効果的です。",
      "commonMistake": "Do not voice the th as /ð/ or replace it with d or z.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "🧪",
    "tags": [
      "critical-thinking",
      "level-27",
      "method"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l27-opinion",
    "category": "words",
    "level": 27,
    "title_en": "opinion",
    "title_ja": "意見",
    "content": {
      "word": "opinion",
      "japanese": "意見",
      "kanaReading": "オピニオン",
      "pronunciationHint": "Stress PIN.",
      "exampleSentence": "In my opinion, the second option is clearer.",
      "exampleJapanese": "私の意見では、2つ目の案のほうが明確です。",
      "commonMistake": "Say “in my opinion,” not “according to my opinion.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "critical-thinking"
    },
    "icon": "💭",
    "tags": [
      "critical-thinking",
      "level-27",
      "opinion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l28-proposal",
    "category": "words",
    "level": 28,
    "title_en": "proposal",
    "title_ja": "提案書・提案",
    "content": {
      "word": "proposal",
      "japanese": "提案書・提案",
      "kanaReading": "プロポウザル",
      "pronunciationHint": "Stress PO: pro-PO-sal.",
      "exampleSentence": "The team discussed my proposal.",
      "exampleJapanese": "チームは私の提案について話し合いました。",
      "commonMistake": "A proposal is a developed suggestion, not merely an idea.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "📑",
    "tags": [
      "business-and-projects",
      "level-28",
      "proposal"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l28-budget",
    "category": "words",
    "level": 28,
    "title_en": "budget",
    "title_ja": "予算",
    "content": {
      "word": "budget",
      "japanese": "予算",
      "kanaReading": "バジェット",
      "pronunciationHint": "Stress BUD; g sounds /dʒ/.",
      "exampleSentence": "The project stayed within budget.",
      "exampleJapanese": "そのプロジェクトは予算内に収まりました。",
      "commonMistake": "Say “within budget” or “over budget,” not “inside the budget.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "💹",
    "tags": [
      "business-and-projects",
      "level-28",
      "budget"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l28-priority",
    "category": "words",
    "level": 28,
    "title_en": "priority",
    "title_ja": "優先事項",
    "content": {
      "word": "priority",
      "japanese": "優先事項",
      "kanaReading": "プライオリティー",
      "pronunciationHint": "Stress OR: pri-OR-i-ty.",
      "exampleSentence": "Safety is our first priority.",
      "exampleJapanese": "安全が私たちの最優先事項です。",
      "commonMistake": "“Top priority” is natural; avoid redundant “most top priority.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "🥇",
    "tags": [
      "business-and-projects",
      "level-28",
      "priority"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l28-strategy",
    "category": "words",
    "level": 28,
    "title_en": "strategy",
    "title_ja": "戦略",
    "content": {
      "word": "strategy",
      "japanese": "戦略",
      "kanaReading": "ストラテジー",
      "pronunciationHint": "Stress STRAT; g sounds /dʒ/.",
      "exampleSentence": "We need a simple launch strategy.",
      "exampleJapanese": "簡単な立ち上げ戦略が必要です。",
      "commonMistake": "A strategy is an overall approach; a tactic is one action.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "♟️",
    "tags": [
      "business-and-projects",
      "level-28",
      "strategy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l28-progress",
    "category": "words",
    "level": 28,
    "title_en": "progress",
    "title_ja": "進捗・進歩",
    "content": {
      "word": "progress",
      "japanese": "進捗・進歩",
      "kanaReading": "プログレス",
      "pronunciationHint": "As a noun, stress PRO.",
      "exampleSentence": "We review progress every Friday.",
      "exampleJapanese": "毎週金曜日に進捗を確認します。",
      "commonMistake": "“Progress” is uncountable; avoid “progresses” for general advancement.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "📈",
    "tags": [
      "business-and-projects",
      "level-28",
      "progress"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l28-feedback",
    "category": "words",
    "level": 28,
    "title_en": "feedback",
    "title_ja": "フィードバック・意見",
    "content": {
      "word": "feedback",
      "japanese": "フィードバック・意見",
      "kanaReading": "フィードバック",
      "pronunciationHint": "Stress FEED and connect both parts.",
      "exampleSentence": "Your specific feedback improved the draft.",
      "exampleJapanese": "具体的なフィードバックのおかげで下書きが改善しました。",
      "commonMistake": "“Feedback” is uncountable; avoid “feedbacks.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "🗨️",
    "tags": [
      "business-and-projects",
      "level-28",
      "feedback"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l28-negotiate",
    "category": "words",
    "level": 28,
    "title_en": "negotiate",
    "title_ja": "交渉する",
    "content": {
      "word": "negotiate",
      "japanese": "交渉する",
      "kanaReading": "ニゴウシエイト",
      "pronunciationHint": "Stress GO: ne-GO-ti-ate.",
      "exampleSentence": "They negotiated a later delivery date.",
      "exampleJapanese": "彼らは配達日を遅らせる交渉をしました。",
      "commonMistake": "Negotiate “with” a person and “for/about” terms.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "🤝",
    "tags": [
      "business-and-projects",
      "level-28",
      "negotiate"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l28-approve",
    "category": "words",
    "level": 28,
    "title_en": "approve",
    "title_ja": "承認する・賛成する",
    "content": {
      "word": "approve",
      "japanese": "承認する・賛成する",
      "kanaReading": "アプルーヴ",
      "pronunciationHint": "Stress PROVE and finish with voiced v.",
      "exampleSentence": "The client approved the final design.",
      "exampleJapanese": "顧客は最終デザインを承認しました。",
      "commonMistake": "Approve a thing directly; approve “of” behavior or an idea generally.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "✅",
    "tags": [
      "business-and-projects",
      "level-28",
      "approve"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l28-revise",
    "category": "words",
    "level": 28,
    "title_en": "revise",
    "title_ja": "修正する・復習する",
    "content": {
      "word": "revise",
      "japanese": "修正する・復習する",
      "kanaReading": "リヴァイズ",
      "pronunciationHint": "Stress VISE and finish with voiced /z/.",
      "exampleSentence": "Please revise the opening paragraph.",
      "exampleJapanese": "冒頭の段落を修正してください。",
      "commonMistake": "In UK education, “revise” can mean study again; context matters.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "✏️",
    "tags": [
      "business-and-projects",
      "level-28",
      "revise"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l28-launch",
    "category": "words",
    "level": 28,
    "title_en": "launch",
    "title_ja": "開始する・発売する",
    "content": {
      "word": "launch",
      "japanese": "開始する・発売する",
      "kanaReading": "ローンチ",
      "pronunciationHint": "Finish with /ntʃ/.",
      "exampleSentence": "We will launch the new course in April.",
      "exampleJapanese": "4月に新しいコースを開始します。",
      "commonMistake": "Use “launch a product,” not “open a product.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "business-and-projects"
    },
    "icon": "🚀",
    "tags": [
      "business-and-projects",
      "level-28",
      "launch"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l29-luggage",
    "category": "words",
    "level": 29,
    "title_en": "luggage",
    "title_ja": "荷物",
    "content": {
      "word": "luggage",
      "japanese": "荷物",
      "kanaReading": "ラゲッジ",
      "pronunciationHint": "Stress LUG; g sounds /dʒ/.",
      "exampleSentence": "Your luggage can go under the seat.",
      "exampleJapanese": "荷物は座席の下に置けます。",
      "commonMistake": "“Luggage” is uncountable; say “a piece of luggage.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🧳",
    "tags": [
      "travel-details",
      "level-29",
      "luggage"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l29-passport",
    "category": "words",
    "level": 29,
    "title_en": "passport",
    "title_ja": "パスポート",
    "content": {
      "word": "passport",
      "japanese": "パスポート",
      "kanaReading": "パスポート",
      "pronunciationHint": "Stress PASS and keep the final t.",
      "exampleSentence": "Keep your passport in a safe place.",
      "exampleJapanese": "パスポートを安全な場所に保管してください。",
      "commonMistake": "Do not drop the final t.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🛂",
    "tags": [
      "travel-details",
      "level-29",
      "passport"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l29-customs",
    "category": "words",
    "level": 29,
    "title_en": "customs",
    "title_ja": "税関",
    "content": {
      "word": "customs",
      "japanese": "税関",
      "kanaReading": "カスタムズ",
      "pronunciationHint": "Finish with voiced /z/.",
      "exampleSentence": "We went through customs quickly.",
      "exampleJapanese": "私たちはすぐに税関を通過しました。",
      "commonMistake": "Use plural-form “customs” for the border service.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🛃",
    "tags": [
      "travel-details",
      "level-29",
      "customs"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l29-destination",
    "category": "words",
    "level": 29,
    "title_en": "destination",
    "title_ja": "目的地",
    "content": {
      "word": "destination",
      "japanese": "目的地",
      "kanaReading": "デスティネイション",
      "pronunciationHint": "Stress NA and pronounce tion /ʃən/.",
      "exampleSentence": "Kyoto is our final destination.",
      "exampleJapanese": "京都が私たちの最終目的地です。",
      "commonMistake": "A destination is the place you are going, not the route.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "📍",
    "tags": [
      "travel-details",
      "level-29",
      "destination"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l29-accommodation",
    "category": "words",
    "level": 29,
    "title_en": "accommodation",
    "title_ja": "宿泊施設",
    "content": {
      "word": "accommodation",
      "japanese": "宿泊施設",
      "kanaReading": "アコモデイション",
      "pronunciationHint": "Stress DA: accom-mo-DA-tion.",
      "exampleSentence": "The price includes accommodation and breakfast.",
      "exampleJapanese": "料金には宿泊と朝食が含まれています。",
      "commonMistake": "“Accommodation” is usually uncountable in UK English.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🏨",
    "tags": [
      "travel-details",
      "level-29",
      "accommodation"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l29-reservation",
    "category": "words",
    "level": 29,
    "title_en": "reservation",
    "title_ja": "予約",
    "content": {
      "word": "reservation",
      "japanese": "予約",
      "kanaReading": "レザヴェイション",
      "pronunciationHint": "Stress VA.",
      "exampleSentence": "I changed the reservation online.",
      "exampleJapanese": "オンラインで予約を変更しました。",
      "commonMistake": "A reservation is the booking record; a reserve is not the noun here.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "📋",
    "tags": [
      "travel-details",
      "level-29",
      "reservation"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l29-departure",
    "category": "words",
    "level": 29,
    "title_en": "departure",
    "title_ja": "出発",
    "content": {
      "word": "departure",
      "japanese": "出発",
      "kanaReading": "ディパーチャー",
      "pronunciationHint": "Stress PAR.",
      "exampleSentence": "Check the departure time on the board.",
      "exampleJapanese": "掲示板で出発時刻を確認してください。",
      "commonMistake": "Departure is leaving; arrival is reaching the destination.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🛫",
    "tags": [
      "travel-details",
      "level-29",
      "departure"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l29-arrival",
    "category": "words",
    "level": 29,
    "title_en": "arrival",
    "title_ja": "到着",
    "content": {
      "word": "arrival",
      "japanese": "到着",
      "kanaReading": "アライヴァル",
      "pronunciationHint": "Stress RI: ar-RI-val.",
      "exampleSentence": "Please wait in the arrival hall.",
      "exampleJapanese": "到着ロビーで待ってください。",
      "commonMistake": "Use “on arrival” for the moment you reach a place.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🛬",
    "tags": [
      "travel-details",
      "level-29",
      "arrival"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l29-platform",
    "category": "words",
    "level": 29,
    "title_en": "platform",
    "title_ja": "ホーム・台",
    "content": {
      "word": "platform",
      "japanese": "ホーム・台",
      "kanaReading": "プラットフォーム",
      "pronunciationHint": "Stress PLAT.",
      "exampleSentence": "The train leaves from platform six.",
      "exampleJapanese": "電車は6番ホームから出ます。",
      "commonMistake": "Use “on the platform,” not “in the platform.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🚉",
    "tags": [
      "travel-details",
      "level-29",
      "platform"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l29-transfer",
    "category": "words",
    "level": 29,
    "title_en": "transfer",
    "title_ja": "乗り換え・移す",
    "content": {
      "word": "transfer",
      "japanese": "乗り換え・移す",
      "kanaReading": "トランスファー",
      "pronunciationHint": "As a noun, stress TRANS; as a verb, stress FER.",
      "exampleSentence": "We have a short transfer in Seoul.",
      "exampleJapanese": "ソウルで短い乗り継ぎがあります。",
      "commonMistake": "Stress changes between common noun and verb uses.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "travel-details"
    },
    "icon": "🔀",
    "tags": [
      "travel-details",
      "level-29",
      "transfer"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l30-manage",
    "category": "words",
    "level": 30,
    "title_en": "manage",
    "title_ja": "何とかする・管理する",
    "content": {
      "word": "manage",
      "japanese": "何とかする・管理する",
      "kanaReading": "マネジ",
      "pronunciationHint": "Stress MAN and end with /ɪdʒ/.",
      "exampleSentence": "I managed to finish before the deadline.",
      "exampleJapanese": "締め切り前になんとか終えました。",
      "commonMistake": "Use “manage to do,” not “manage doing,” for succeeding.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "🧩",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "manage"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l30-avoid",
    "category": "words",
    "level": 30,
    "title_en": "avoid",
    "title_ja": "避ける",
    "content": {
      "word": "avoid",
      "japanese": "避ける",
      "kanaReading": "アヴォイド",
      "pronunciationHint": "Stress VOID.",
      "exampleSentence": "Try to avoid checking your phone while studying.",
      "exampleJapanese": "勉強中に携帯を見るのを避けてみてください。",
      "commonMistake": "Use “avoid doing,” not “avoid to do.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "🚫",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "avoid"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l30-afford",
    "category": "words",
    "level": 30,
    "title_en": "afford",
    "title_ja": "余裕がある・購入できる",
    "content": {
      "word": "afford",
      "japanese": "余裕がある・購入できる",
      "kanaReading": "アフォード",
      "pronunciationHint": "Stress FORD.",
      "exampleSentence": "We cannot afford a longer delay.",
      "exampleJapanese": "これ以上の遅れは許容できません。",
      "commonMistake": "Use “afford to do” or “afford something,” not “afford for.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "💳",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "afford"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l30-recommend",
    "category": "words",
    "level": 30,
    "title_en": "recommend",
    "title_ja": "勧める",
    "content": {
      "word": "recommend",
      "japanese": "勧める",
      "kanaReading": "レコメンド",
      "pronunciationHint": "Stress MEND.",
      "exampleSentence": "I recommend taking the earlier train.",
      "exampleJapanese": "早い電車に乗ることを勧めます。",
      "commonMistake": "Use “recommend doing” or “recommend that…,” not “recommend you to do.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "👍",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "recommend"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l30-suggest",
    "category": "words",
    "level": 30,
    "title_en": "suggest",
    "title_ja": "提案する・示唆する",
    "content": {
      "word": "suggest",
      "japanese": "提案する・示唆する",
      "kanaReading": "サジェスト",
      "pronunciationHint": "Stress GEST.",
      "exampleSentence": "She suggested meeting near the station.",
      "exampleJapanese": "彼女は駅の近くで会うことを提案しました。",
      "commonMistake": "Use “suggest doing,” not “suggest to do.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "💡",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "suggest"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l30-prefer",
    "category": "words",
    "level": 30,
    "title_en": "prefer",
    "title_ja": "より好む",
    "content": {
      "word": "prefer",
      "japanese": "より好む",
      "kanaReading": "プリファー",
      "pronunciationHint": "Stress FER.",
      "exampleSentence": "I prefer tea without sugar.",
      "exampleJapanese": "私は砂糖なしの紅茶のほうが好きです。",
      "commonMistake": "Say “prefer A to B,” not “prefer A than B.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "☕",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "prefer"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l30-depend",
    "category": "words",
    "level": 30,
    "title_en": "depend",
    "title_ja": "左右される・頼る",
    "content": {
      "word": "depend",
      "japanese": "左右される・頼る",
      "kanaReading": "ディペンド",
      "pronunciationHint": "Stress PEND.",
      "exampleSentence": "The finish time depends on the weather.",
      "exampleJapanese": "終了時刻は天候によります。",
      "commonMistake": "Use “depend on,” not “depend of.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "🔗",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "depend"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l30-notice",
    "category": "words",
    "level": 30,
    "title_en": "notice",
    "title_ja": "気づく・通知",
    "content": {
      "word": "notice",
      "japanese": "気づく・通知",
      "kanaReading": "ノウティス",
      "pronunciationHint": "Stress NO and finish with /s/.",
      "exampleSentence": "Did you notice the change in tone?",
      "exampleJapanese": "口調の変化に気づきましたか。",
      "commonMistake": "“Notice” is observing; “realize” is understanding a fact.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "👀",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "notice"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l30-realize",
    "category": "words",
    "level": 30,
    "title_en": "realize",
    "title_ja": "気づく・理解する",
    "content": {
      "word": "realize",
      "japanese": "気づく・理解する",
      "kanaReading": "リアライズ",
      "pronunciationHint": "Stress RE and finish with voiced /z/.",
      "exampleSentence": "I realized that I had the wrong date.",
      "exampleJapanese": "日付を間違えていたことに気づきました。",
      "commonMistake": "US spelling is “realize”; UK also accepts “realise.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "💡",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "realize"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l30-handle",
    "category": "words",
    "level": 30,
    "title_en": "handle",
    "title_ja": "対処する・扱う",
    "content": {
      "word": "handle",
      "japanese": "対処する・扱う",
      "kanaReading": "ハンドル",
      "pronunciationHint": "Stress HAN; the ending is weak.",
      "exampleSentence": "She handled the complaint calmly.",
      "exampleJapanese": "彼女は苦情に落ち着いて対処しました。",
      "commonMistake": "Handle a problem directly; do not add “with.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "high-utility-verbs"
    },
    "icon": "🛠️",
    "tags": [
      "high-utility-verbs",
      "level-30",
      "handle"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l31-efficient",
    "category": "words",
    "level": 31,
    "title_en": "efficient",
    "title_ja": "効率的な",
    "content": {
      "word": "efficient",
      "japanese": "効率的な",
      "kanaReading": "イフィシェント",
      "pronunciationHint": "Stress FI and pronounce ci /ʃ/.",
      "exampleSentence": "This shortcut makes the process more efficient.",
      "exampleJapanese": "この近道で作業がより効率的になります。",
      "commonMistake": "Efficient means using resources well; effective means producing the result.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "⚙️",
    "tags": [
      "precise-adjectives",
      "level-31",
      "efficient"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l31-flexible",
    "category": "words",
    "level": 31,
    "title_en": "flexible",
    "title_ja": "柔軟な",
    "content": {
      "word": "flexible",
      "japanese": "柔軟な",
      "kanaReading": "フレクシブル",
      "pronunciationHint": "Stress FLEX; later vowels are weak.",
      "exampleSentence": "My work hours are fairly flexible.",
      "exampleJapanese": "私の勤務時間はかなり柔軟です。",
      "commonMistake": "Flexible can describe schedules, materials, or attitudes.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "🤸",
    "tags": [
      "precise-adjectives",
      "level-31",
      "flexible"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l31-reliable",
    "category": "words",
    "level": 31,
    "title_en": "reliable",
    "title_ja": "信頼できる",
    "content": {
      "word": "reliable",
      "japanese": "信頼できる",
      "kanaReading": "リライアブル",
      "pronunciationHint": "Stress LI: re-LI-a-ble.",
      "exampleSentence": "We need a reliable internet connection.",
      "exampleJapanese": "安定して信頼できるインターネット接続が必要です。",
      "commonMistake": "Reliable means dependable, not simply accurate.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "🛡️",
    "tags": [
      "precise-adjectives",
      "level-31",
      "reliable"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l31-appropriate",
    "category": "words",
    "level": 31,
    "title_en": "appropriate",
    "title_ja": "適切な",
    "content": {
      "word": "appropriate",
      "japanese": "適切な",
      "kanaReading": "アプロウプリエット",
      "pronunciationHint": "As an adjective, stress PRO.",
      "exampleSentence": "Choose language appropriate for the audience.",
      "exampleJapanese": "聞き手に適切な言葉を選んでください。",
      "commonMistake": "Use “appropriate for” a person or purpose; “appropriate to” is also standard in suitable contexts.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "🎯",
    "tags": [
      "precise-adjectives",
      "level-31",
      "appropriate"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l31-significant",
    "category": "words",
    "level": 31,
    "title_en": "significant",
    "title_ja": "重要な・かなりの",
    "content": {
      "word": "significant",
      "japanese": "重要な・かなりの",
      "kanaReading": "シグニフィカント",
      "pronunciationHint": "Stress NIF.",
      "exampleSentence": "The change produced a significant improvement.",
      "exampleJapanese": "その変更で大きな改善がありました。",
      "commonMistake": "Significant may mean important or statistically meaningful; context matters.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "📌",
    "tags": [
      "precise-adjectives",
      "level-31",
      "significant"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l31-specific",
    "category": "words",
    "level": 31,
    "title_en": "specific",
    "title_ja": "具体的な・特定の",
    "content": {
      "word": "specific",
      "japanese": "具体的な・特定の",
      "kanaReading": "スペシフィック",
      "pronunciationHint": "Stress CIF.",
      "exampleSentence": "Please give one specific example.",
      "exampleJapanese": "具体的な例を1つ挙げてください。",
      "commonMistake": "Specific is more precise than “special.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "🔎",
    "tags": [
      "precise-adjectives",
      "level-31",
      "specific"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l31-temporary",
    "category": "words",
    "level": 31,
    "title_en": "temporary",
    "title_ja": "一時的な",
    "content": {
      "word": "temporary",
      "japanese": "一時的な",
      "kanaReading": "テンポラリー",
      "pronunciationHint": "Stress TEM; later vowels are light.",
      "exampleSentence": "This is only a temporary solution.",
      "exampleJapanese": "これは一時的な解決策にすぎません。",
      "commonMistake": "Do not use “temporarily solution”; use adjective “temporary.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "⏱️",
    "tags": [
      "precise-adjectives",
      "level-31",
      "temporary"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l31-permanent",
    "category": "words",
    "level": 31,
    "title_en": "permanent",
    "title_ja": "永久的な",
    "content": {
      "word": "permanent",
      "japanese": "永久的な",
      "kanaReading": "パーマネント",
      "pronunciationHint": "Stress PER; later vowels are weak.",
      "exampleSentence": "The mark is permanent, so use a pencil first.",
      "exampleJapanese": "その印は消えないので、最初は鉛筆を使ってください。",
      "commonMistake": "Permanent contrasts with temporary, not with recent.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "🪨",
    "tags": [
      "precise-adjectives",
      "level-31",
      "permanent"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l31-likely",
    "category": "words",
    "level": 31,
    "title_en": "likely",
    "title_ja": "ありそうな",
    "content": {
      "word": "likely",
      "japanese": "ありそうな",
      "kanaReading": "ライクリー",
      "pronunciationHint": "Stress LIKE; the ending is /li/.",
      "exampleSentence": "Rain is likely this evening.",
      "exampleJapanese": "今晩は雨が降りそうです。",
      "commonMistake": "Say “It is likely that…” or “is likely to…,” not “maybe likely.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "📊",
    "tags": [
      "precise-adjectives",
      "level-31",
      "likely"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l31-unlikely",
    "category": "words",
    "level": 31,
    "title_en": "unlikely",
    "title_ja": "ありそうにない",
    "content": {
      "word": "unlikely",
      "japanese": "ありそうにない",
      "kanaReading": "アンライクリー",
      "pronunciationHint": "Stress LIKE; keep the un prefix light.",
      "exampleSentence": "The shop is unlikely to open today.",
      "exampleJapanese": "その店は今日開かないでしょう。",
      "commonMistake": "“Unlikely” means improbable, not impossible.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "precise-adjectives"
    },
    "icon": "📉",
    "tags": [
      "precise-adjectives",
      "level-31",
      "unlikely"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "word-l32-clarify",
    "category": "words",
    "level": 32,
    "title_en": "clarify",
    "title_ja": "明確にする",
    "content": {
      "word": "clarify",
      "japanese": "明確にする",
      "kanaReading": "クラリファイ",
      "pronunciationHint": "Stress CLAR and finish /faɪ/.",
      "exampleSentence": "Could you clarify what the final step involves?",
      "exampleJapanese": "最後の手順に何が含まれるか明確にしてもらえますか。",
      "commonMistake": "Clarify an idea directly; “clarify about” is usually unnecessary.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🔦",
    "tags": [
      "advanced-communication",
      "level-32",
      "clarify"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "word-l32-emphasize",
    "category": "words",
    "level": 32,
    "title_en": "emphasize",
    "title_ja": "強調する",
    "content": {
      "word": "emphasize",
      "japanese": "強調する",
      "kanaReading": "エンファサイズ",
      "pronunciationHint": "Stress EM; finish with voiced /z/.",
      "exampleSentence": "The guide emphasizes regular practice.",
      "exampleJapanese": "そのガイドは継続的な練習を強調しています。",
      "commonMistake": "US spelling is “emphasize”; UK also uses “emphasise.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "❗",
    "tags": [
      "advanced-communication",
      "level-32",
      "emphasize"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "word-l32-persuade",
    "category": "words",
    "level": 32,
    "title_en": "persuade",
    "title_ja": "説得する",
    "content": {
      "word": "persuade",
      "japanese": "説得する",
      "kanaReading": "パースウェイド",
      "pronunciationHint": "Stress SWADE.",
      "exampleSentence": "She persuaded the team to test the idea.",
      "exampleJapanese": "彼女はその案を試すようチームを説得しました。",
      "commonMistake": "Use “persuade someone to do”; “convince” commonly takes “that.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🗣️",
    "tags": [
      "advanced-communication",
      "level-32",
      "persuade"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "word-l32-acknowledge",
    "category": "words",
    "level": 32,
    "title_en": "acknowledge",
    "title_ja": "認める・受け取ったと伝える",
    "content": {
      "word": "acknowledge",
      "japanese": "認める・受け取ったと伝える",
      "kanaReading": "アクノリッジ",
      "pronunciationHint": "Stress KNOL; the ending is /ɪdʒ/.",
      "exampleSentence": "He acknowledged the concern before responding.",
      "exampleJapanese": "彼は返答する前に懸念を認めました。",
      "commonMistake": "The initial k is pronounced; the written w is not separately heard.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🙋",
    "tags": [
      "advanced-communication",
      "level-32",
      "acknowledge"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "word-l32-respond",
    "category": "words",
    "level": 32,
    "title_en": "respond",
    "title_ja": "返答する・反応する",
    "content": {
      "word": "respond",
      "japanese": "返答する・反応する",
      "kanaReading": "リスポンド",
      "pronunciationHint": "Stress SPOND.",
      "exampleSentence": "Please respond by the end of the week.",
      "exampleJapanese": "週末までに返答してください。",
      "commonMistake": "Use “respond to,” not “respond someone.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "↪️",
    "tags": [
      "advanced-communication",
      "level-32",
      "respond"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 5
  },
  {
    "id": "word-l32-contribute",
    "category": "words",
    "level": 32,
    "title_en": "contribute",
    "title_ja": "貢献する・提供する",
    "content": {
      "word": "contribute",
      "japanese": "貢献する・提供する",
      "kanaReading": "コントリビュート",
      "pronunciationHint": "Stress TRIB in common US speech.",
      "exampleSentence": "Everyone contributed one practical idea.",
      "exampleJapanese": "全員が実用的な案を1つずつ出しました。",
      "commonMistake": "Use “contribute to a project,” not “contribute for.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🧱",
    "tags": [
      "advanced-communication",
      "level-32",
      "contribute"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 6
  },
  {
    "id": "word-l32-collaborate",
    "category": "words",
    "level": 32,
    "title_en": "collaborate",
    "title_ja": "協力する",
    "content": {
      "word": "collaborate",
      "japanese": "協力する",
      "kanaReading": "コラボレイト",
      "pronunciationHint": "Stress LAB.",
      "exampleSentence": "The two classes collaborated on a video.",
      "exampleJapanese": "2つのクラスが動画制作で協力しました。",
      "commonMistake": "Use “collaborate with people on a project.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🤝",
    "tags": [
      "advanced-communication",
      "level-32",
      "collaborate"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 7
  },
  {
    "id": "word-l32-resolve",
    "category": "words",
    "level": 32,
    "title_en": "resolve",
    "title_ja": "解決する・決意する",
    "content": {
      "word": "resolve",
      "japanese": "解決する・決意する",
      "kanaReading": "リゾルヴ",
      "pronunciationHint": "Stress SOLVE and finish with voiced v.",
      "exampleSentence": "We resolved the issue without delaying the launch.",
      "exampleJapanese": "開始を遅らせずに問題を解決しました。",
      "commonMistake": "Resolve suggests a definite solution; it is stronger than discuss.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🧩",
    "tags": [
      "advanced-communication",
      "level-32",
      "resolve"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 8
  },
  {
    "id": "word-l32-reflect",
    "category": "words",
    "level": 32,
    "title_en": "reflect",
    "title_ja": "振り返る・反映する",
    "content": {
      "word": "reflect",
      "japanese": "振り返る・反映する",
      "kanaReading": "リフレクト",
      "pronunciationHint": "Stress FLECT.",
      "exampleSentence": "Take a minute to reflect on what you learned.",
      "exampleJapanese": "学んだことを1分間振り返ってください。",
      "commonMistake": "Use “reflect on” when thinking carefully about something.",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🪞",
    "tags": [
      "advanced-communication",
      "level-32",
      "reflect"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 9
  },
  {
    "id": "word-l32-adapt",
    "category": "words",
    "level": 32,
    "title_en": "adapt",
    "title_ja": "適応する・調整する",
    "content": {
      "word": "adapt",
      "japanese": "適応する・調整する",
      "kanaReading": "アダプト",
      "pronunciationHint": "Stress DAPT.",
      "exampleSentence": "Good teachers adapt activities to each learner.",
      "exampleJapanese": "良い先生は生徒一人ひとりに活動を合わせます。",
      "commonMistake": "Use “adapt to a situation” and “adapt something for a purpose.”",
      "imageType": "emoji",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby",
      "topic": "advanced-communication"
    },
    "icon": "🌱",
    "tags": [
      "advanced-communication",
      "level-32",
      "adapt"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 10
  },
  {
    "id": "phrase-l01-01",
    "category": "phrases",
    "level": 1,
    "title_en": "Hi, I'm Ren.",
    "title_ja": "こんにちは、レンです。",
    "content": {
      "phrase": "Hi, I'm Ren.",
      "japanese": "こんにちは、レンです。",
      "situation": "初めて会った人に名前を伝えるとき",
      "naturalUsage": "Hi のあとに名前を続ける、短く親しみやすい自己紹介です。",
      "exampleDialogue": "A: Hi, I'm Ren. B: Hi, Ren! I'm Mia.",
      "commonMistake": "I Ren. ではなく、be動詞を入れて I'm Ren. と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "greeting",
      "introduction",
      "beginner"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "id": "phrase-l01-02",
    "category": "phrases",
    "level": 1,
    "title_en": "Nice to meet you.",
    "title_ja": "はじめまして。",
    "content": {
      "phrase": "Nice to meet you.",
      "japanese": "はじめまして。",
      "situation": "初対面のあいさつをするとき",
      "naturalUsage": "自己紹介の直後に使う定番のあいさつです。",
      "exampleDialogue": "A: I'm Yui. Nice to meet you. B: Nice to meet you, too.",
      "commonMistake": "初対面では Nice to see you. より Nice to meet you. が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "greeting",
      "introduction",
      "polite"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 2
  },
  {
    "id": "phrase-l01-03",
    "category": "phrases",
    "level": 1,
    "title_en": "I'm hungry.",
    "title_ja": "おなかがすきました。",
    "content": {
      "phrase": "I'm hungry.",
      "japanese": "おなかがすきました。",
      "situation": "食べたい気持ちを伝えるとき",
      "naturalUsage": "家族や友達に今の状態を短く伝えられます。",
      "exampleDialogue": "A: I'm hungry. B: Let's have a snack.",
      "commonMistake": "I hungry. ではなく、I'm hungry. と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "feelings",
      "food",
      "beginner"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 3
  },
  {
    "id": "phrase-l01-04",
    "category": "phrases",
    "level": 1,
    "title_en": "Thank you.",
    "title_ja": "ありがとう。",
    "content": {
      "phrase": "Thank you.",
      "japanese": "ありがとう。",
      "situation": "何かをしてもらったとき",
      "naturalUsage": "小さな親切にも使える、最も基本的なお礼です。",
      "exampleDialogue": "A: Here is your pencil. B: Thank you.",
      "commonMistake": "Thank. だけで終わらず、Thank you. と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "thanks",
      "manners",
      "beginner"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l02-01",
    "category": "phrases",
    "level": 2,
    "title_en": "Can I try?",
    "title_ja": "やってみてもいい？",
    "content": {
      "phrase": "Can I try?",
      "japanese": "やってみてもいい？",
      "situation": "活動やゲームに挑戦したいとき",
      "naturalUsage": "先生や友達に許可を求める、短く自然な表現です。",
      "exampleDialogue": "A: Who wants to go first? B: Can I try?",
      "commonMistake": "Can I trying? ではなく、Can I のあとには try の原形を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "permission",
      "classroom",
      "action"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l02-02",
    "category": "phrases",
    "level": 2,
    "title_en": "Please help me.",
    "title_ja": "手伝ってください。",
    "content": {
      "phrase": "Please help me.",
      "japanese": "手伝ってください。",
      "situation": "一人では難しくて助けが必要なとき",
      "naturalUsage": "困っていることをはっきり、丁寧に伝えられます。",
      "exampleDialogue": "A: Please help me. B: Sure. What do you need?",
      "commonMistake": "Help me please. も通じますが、Please help me. は初級者にも使いやすい形です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "help",
      "request",
      "classroom"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l02-03",
    "category": "phrases",
    "level": 2,
    "title_en": "I don't know.",
    "title_ja": "分かりません。",
    "content": {
      "phrase": "I don't know.",
      "japanese": "分かりません。",
      "situation": "答えや情報が分からないとき",
      "naturalUsage": "無理に答えず、分からないことを率直に伝える表現です。",
      "exampleDialogue": "A: Where is Ken? B: I don't know.",
      "commonMistake": "I no know. ではなく、don't を使って I don't know. と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "classroom",
      "knowledge",
      "beginner"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l02-04",
    "category": "phrases",
    "level": 2,
    "title_en": "One more time, please.",
    "title_ja": "もう一度お願いします。",
    "content": {
      "phrase": "One more time, please.",
      "japanese": "もう一度お願いします。",
      "situation": "聞き取れなかった内容を繰り返してほしいとき",
      "naturalUsage": "授業でも日常会話でも使える簡単な聞き返しです。",
      "exampleDialogue": "A: Open to page twelve. B: One more time, please.",
      "commonMistake": "Once more time とは言わず、One more time と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "clarification",
      "classroom",
      "listening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l03-01",
    "category": "phrases",
    "level": 3,
    "title_en": "I like this one.",
    "title_ja": "私はこれが好きです。",
    "content": {
      "phrase": "I like this one.",
      "japanese": "私はこれが好きです。",
      "situation": "いくつかの中から好みを伝えるとき",
      "naturalUsage": "物を指しながら this one と言うと自然です。",
      "exampleDialogue": "A: Which bag do you like? B: I like this one.",
      "commonMistake": "I like this it. のように one と it を重ねません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "preference",
      "choice",
      "daily-life"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l03-02",
    "category": "phrases",
    "level": 3,
    "title_en": "That's my favorite.",
    "title_ja": "それが一番好きです。",
    "content": {
      "phrase": "That's my favorite.",
      "japanese": "それが一番好きです。",
      "situation": "特に好きなものを伝えるとき",
      "naturalUsage": "食べ物、色、曲など幅広い話題に使えます。",
      "exampleDialogue": "A: Do you like strawberry ice cream? B: Yes! That's my favorite.",
      "commonMistake": "my favorite のあとに名詞がなくても、話題が明らかなら自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "preference",
      "favorite",
      "conversation"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l03-03",
    "category": "phrases",
    "level": 3,
    "title_en": "I don't like it very much.",
    "title_ja": "それはあまり好きではありません。",
    "content": {
      "phrase": "I don't like it very much.",
      "japanese": "それはあまり好きではありません。",
      "situation": "好みではないことをやわらかく伝えるとき",
      "naturalUsage": "I hate it. より穏やかで、相手を傷つけにくい言い方です。",
      "exampleDialogue": "A: Do you like spicy food? B: I don't like it very much.",
      "commonMistake": "not very much は好きな程度が低いという意味で、語順を崩さないようにします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "preference",
      "softening",
      "food"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l03-04",
    "category": "phrases",
    "level": 3,
    "title_en": "Which one do you want?",
    "title_ja": "どれがほしいですか？",
    "content": {
      "phrase": "Which one do you want?",
      "japanese": "どれがほしいですか？",
      "situation": "相手に選んでもらうとき",
      "naturalUsage": "目の前に複数の選択肢がある場面で使います。",
      "exampleDialogue": "A: Which one do you want? B: The blue one, please.",
      "commonMistake": "Which do you want one? ではなく、Which one をひとまとまりで使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "choice",
      "question",
      "shopping"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l04-01",
    "category": "phrases",
    "level": 4,
    "title_en": "This is my brother.",
    "title_ja": "こちらは私の兄（弟）です。",
    "content": {
      "phrase": "This is my brother.",
      "japanese": "こちらは私の兄（弟）です。",
      "situation": "家族を人に紹介するとき",
      "naturalUsage": "そばにいる人を紹介するときは This is ... を使います。",
      "exampleDialogue": "A: This is my brother, Kai. B: Hi, Kai.",
      "commonMistake": "日本語の兄・弟の区別が必要なら older brother / younger brother を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "family",
      "introduction",
      "people"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l04-02",
    "category": "phrases",
    "level": 4,
    "title_en": "I'm home!",
    "title_ja": "ただいま！",
    "content": {
      "phrase": "I'm home!",
      "japanese": "ただいま！",
      "situation": "家に帰ってきたことを知らせるとき",
      "naturalUsage": "英語には「ただいま」と完全に同じ決まり文句がないため、帰宅を伝える自然な言い方です。",
      "exampleDialogue": "A: I'm home! B: Welcome back.",
      "commonMistake": "I came home. は帰宅した事実の説明で、玄関での一言には I'm home! が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "home",
      "family",
      "greeting"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l04-03",
    "category": "phrases",
    "level": 4,
    "title_en": "Where's my backpack?",
    "title_ja": "私のリュックはどこ？",
    "content": {
      "phrase": "Where's my backpack?",
      "japanese": "私のリュックはどこ？",
      "situation": "持ち物が見つからないとき",
      "naturalUsage": "家や学校で物の場所を尋ねる日常的な表現です。",
      "exampleDialogue": "A: Where's my backpack? B: It's by the door.",
      "commonMistake": "Where my backpack? ではなく、Where's を入れます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "home",
      "location",
      "belongings"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l04-04",
    "category": "phrases",
    "level": 4,
    "title_en": "Let's clean up.",
    "title_ja": "片づけよう。",
    "content": {
      "phrase": "Let's clean up.",
      "japanese": "片づけよう。",
      "situation": "一緒に片づけを始めるとき",
      "naturalUsage": "遊びや作業のあとに、みんなへ明るく呼びかける表現です。",
      "exampleDialogue": "A: Dinner is almost ready. B: Okay, let's clean up.",
      "commonMistake": "Let's のあとには cleaning ではなく clean の原形を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "home",
      "suggestion",
      "chores"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l05-01",
    "category": "phrases",
    "level": 5,
    "title_en": "What time is it?",
    "title_ja": "何時ですか？",
    "content": {
      "phrase": "What time is it?",
      "japanese": "何時ですか？",
      "situation": "現在の時刻を知りたいとき",
      "naturalUsage": "時計が見えないときや予定を確認するときに使います。",
      "exampleDialogue": "A: What time is it? B: It's seven thirty.",
      "commonMistake": "What time it is? ではなく、疑問文では is it の順にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "time",
      "question",
      "daily-routine"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l05-02",
    "category": "phrases",
    "level": 5,
    "title_en": "I'm getting ready.",
    "title_ja": "今、準備しています。",
    "content": {
      "phrase": "I'm getting ready.",
      "japanese": "今、準備しています。",
      "situation": "出発などの準備中だと伝えるとき",
      "naturalUsage": "まさに準備を進めている最中に使う表現です。",
      "exampleDialogue": "A: Are you ready for school? B: I'm getting ready.",
      "commonMistake": "I'm preparing. も可能ですが、身支度には getting ready が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "routine",
      "present-progressive",
      "home"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l05-03",
    "category": "phrases",
    "level": 5,
    "title_en": "I usually walk to school.",
    "title_ja": "たいてい歩いて学校へ行きます。",
    "content": {
      "phrase": "I usually walk to school.",
      "japanese": "たいてい歩いて学校へ行きます。",
      "situation": "普段の通学方法を話すとき",
      "naturalUsage": "usually を一般動詞の前に置いて、習慣を表します。",
      "exampleDialogue": "A: How do you get to school? B: I usually walk to school.",
      "commonMistake": "walk school ではなく、行き先の前に to を入れます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "routine",
      "frequency",
      "school"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l05-04",
    "category": "phrases",
    "level": 5,
    "title_en": "See you tomorrow.",
    "title_ja": "また明日。",
    "content": {
      "phrase": "See you tomorrow.",
      "japanese": "また明日。",
      "situation": "翌日にまた会う相手と別れるとき",
      "naturalUsage": "学校や職場の帰りに使う親しみやすい別れの言葉です。",
      "exampleDialogue": "A: I'm going home now. B: Okay, see you tomorrow.",
      "commonMistake": "See you next tomorrow. とは言わず、tomorrow だけを使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "farewell",
      "time",
      "school"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l06-01",
    "category": "phrases",
    "level": 6,
    "title_en": "Can I have some water?",
    "title_ja": "お水をもらえますか？",
    "content": {
      "phrase": "Can I have some water?",
      "japanese": "お水をもらえますか？",
      "situation": "飲み物をお願いするとき",
      "naturalUsage": "家庭、学校、レストランで使える丁寧で基本的な頼み方です。",
      "exampleDialogue": "A: Can I have some water? B: Of course.",
      "commonMistake": "Can I have a water? より、量を表す some water が基本です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "food",
      "request",
      "restaurant"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l06-02",
    "category": "phrases",
    "level": 6,
    "title_en": "It smells good.",
    "title_ja": "いい匂いがします。",
    "content": {
      "phrase": "It smells good.",
      "japanese": "いい匂いがします。",
      "situation": "料理の香りをほめるとき",
      "naturalUsage": "料理を見たり香りを感じたりした瞬間の自然な反応です。",
      "exampleDialogue": "A: I made curry. B: It smells good.",
      "commonMistake": "I'm smelling good. だと自分がよい匂いという意味になりやすいです。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "food",
      "reaction",
      "senses"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l06-03",
    "category": "phrases",
    "level": 6,
    "title_en": "I'm full.",
    "title_ja": "おなかいっぱいです。",
    "content": {
      "phrase": "I'm full.",
      "japanese": "おなかいっぱいです。",
      "situation": "十分に食べたことを伝えるとき",
      "naturalUsage": "食事を終えたいときに短く自然に使えます。",
      "exampleDialogue": "A: Would you like more rice? B: No, thanks. I'm full.",
      "commonMistake": "My stomach is full. も意味は通じますが、会話では I'm full. が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "food",
      "feelings",
      "meal"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l06-04",
    "category": "phrases",
    "level": 6,
    "title_en": "Could I get this without cheese?",
    "title_ja": "これはチーズ抜きにできますか？",
    "content": {
      "phrase": "Could I get this without cheese?",
      "japanese": "これはチーズ抜きにできますか？",
      "situation": "料理から食材を抜いてほしいとき",
      "naturalUsage": "注文時に without を使って希望を明確に伝えます。",
      "exampleDialogue": "A: Could I get this without cheese? B: Yes, no problem.",
      "commonMistake": "no cheese だけでも通じますが、文にすると丁寧です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "restaurant",
      "request",
      "food"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l07-01",
    "category": "phrases",
    "level": 7,
    "title_en": "How much is this?",
    "title_ja": "これはいくらですか？",
    "content": {
      "phrase": "How much is this?",
      "japanese": "これはいくらですか？",
      "situation": "店で商品の値段を尋ねるとき",
      "naturalUsage": "商品を指しながら使える、買い物の基本表現です。",
      "exampleDialogue": "A: How much is this? B: It's twelve dollars.",
      "commonMistake": "How many is this? は数を尋ねる表現で、値段には How much を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "shopping",
      "price",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l07-02",
    "category": "phrases",
    "level": 7,
    "title_en": "Do you have this in blue?",
    "title_ja": "これの青はありますか？",
    "content": {
      "phrase": "Do you have this in blue?",
      "japanese": "これの青はありますか？",
      "situation": "同じ商品の別の色を探すとき",
      "naturalUsage": "in のあとに色やサイズを置いて在庫を尋ねます。",
      "exampleDialogue": "A: Do you have this in blue? B: Let me check.",
      "commonMistake": "Do you have blue this? ではなく、this in blue の順にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "shopping",
      "color",
      "request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l07-03",
    "category": "phrases",
    "level": 7,
    "title_en": "Can I try it on?",
    "title_ja": "試着してもいいですか？",
    "content": {
      "phrase": "Can I try it on?",
      "japanese": "試着してもいいですか？",
      "situation": "服や靴を試着したいとき",
      "naturalUsage": "try on は身につけて試すという意味の句動詞です。",
      "exampleDialogue": "A: Can I try it on? B: The fitting room is over there.",
      "commonMistake": "代名詞 it は try と on の間に置き、try on it とは通常言いません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "shopping",
      "clothes",
      "permission"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l07-04",
    "category": "phrases",
    "level": 7,
    "title_en": "I'll take it.",
    "title_ja": "これにします。",
    "content": {
      "phrase": "I'll take it.",
      "japanese": "これにします。",
      "situation": "店で買う商品を決めたとき",
      "naturalUsage": "商品を選び終え、購入の意思を店員に伝える表現です。",
      "exampleDialogue": "A: Does the jacket fit? B: Yes, I'll take it.",
      "commonMistake": "I'll buy it. も正しいですが、接客場面では I'll take it. がとても自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "shopping",
      "decision",
      "purchase"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l08-01",
    "category": "phrases",
    "level": 8,
    "title_en": "How do I get to the station?",
    "title_ja": "駅へはどう行けばいいですか？",
    "content": {
      "phrase": "How do I get to the station?",
      "japanese": "駅へはどう行けばいいですか？",
      "situation": "道順を尋ねるとき",
      "naturalUsage": "How do I get to ...? は目的地までの行き方を尋ねる定番表現です。",
      "exampleDialogue": "A: How do I get to the station? B: Go straight for two blocks.",
      "commonMistake": "How can I go the station? ではなく、get to the station が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "directions",
      "travel",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l08-02",
    "category": "phrases",
    "level": 8,
    "title_en": "Is it far from here?",
    "title_ja": "ここから遠いですか？",
    "content": {
      "phrase": "Is it far from here?",
      "japanese": "ここから遠いですか？",
      "situation": "目的地までの距離感を確認するとき",
      "naturalUsage": "道を聞いたあとに続けると便利な質問です。",
      "exampleDialogue": "A: Is it far from here? B: No, it's about five minutes away.",
      "commonMistake": "far away here ではなく、far from here と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "directions",
      "distance",
      "travel"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l08-03",
    "category": "phrases",
    "level": 8,
    "title_en": "It's across from the park.",
    "title_ja": "公園の向かい側にあります。",
    "content": {
      "phrase": "It's across from the park.",
      "japanese": "公園の向かい側にあります。",
      "situation": "建物や場所の位置を説明するとき",
      "naturalUsage": "across from を使うと、道などを挟んだ向かい側を表せます。",
      "exampleDialogue": "A: Where's the library? B: It's across from the park.",
      "commonMistake": "across the park では公園を横切る意味になるため、向かい側は across from です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "location",
      "directions",
      "prepositions"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l08-04",
    "category": "phrases",
    "level": 8,
    "title_en": "I think we're lost.",
    "title_ja": "道に迷ったみたいです。",
    "content": {
      "phrase": "I think we're lost.",
      "japanese": "道に迷ったみたいです。",
      "situation": "正しい道から外れたと思うとき",
      "naturalUsage": "断定せず I think を添えることで、状況を自然に共有します。",
      "exampleDialogue": "A: I don't see the museum. B: I think we're lost.",
      "commonMistake": "We're lose. ではなく、状態を表す形容詞 lost を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "directions",
      "problem",
      "travel"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l09-01",
    "category": "phrases",
    "level": 9,
    "title_en": "It looks like rain.",
    "title_ja": "雨が降りそうです。",
    "content": {
      "phrase": "It looks like rain.",
      "japanese": "雨が降りそうです。",
      "situation": "空模様を見て雨を予想するとき",
      "naturalUsage": "見た様子から天気を予想する、日常的なひと言です。",
      "exampleDialogue": "A: Should we take an umbrella? B: Yes, it looks like rain.",
      "commonMistake": "It looks rain. ではなく、名詞 rain の前に like を入れます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "weather",
      "prediction",
      "daily-life"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l09-02",
    "category": "phrases",
    "level": 9,
    "title_en": "What are you doing this weekend?",
    "title_ja": "今週末は何をする予定ですか？",
    "content": {
      "phrase": "What are you doing this weekend?",
      "japanese": "今週末は何をする予定ですか？",
      "situation": "近い週末の予定を尋ねるとき",
      "naturalUsage": "現在進行形で、すでに考えている近い未来の予定を聞けます。",
      "exampleDialogue": "A: What are you doing this weekend? B: I'm visiting my grandparents.",
      "commonMistake": "this weekend の前に on は通常つけません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "plans",
      "weekend",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l09-03",
    "category": "phrases",
    "level": 9,
    "title_en": "Let's stay inside today.",
    "title_ja": "今日は中で過ごそう。",
    "content": {
      "phrase": "Let's stay inside today.",
      "japanese": "今日は中で過ごそう。",
      "situation": "天気が悪く屋内で過ごす提案をするとき",
      "naturalUsage": "stay inside は外出せず室内にいるという自然な表現です。",
      "exampleDialogue": "A: It's really windy. B: Let's stay inside today.",
      "commonMistake": "stay in inside のように前置詞を重ねません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "weather",
      "suggestion",
      "plans"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l09-04",
    "category": "phrases",
    "level": 9,
    "title_en": "The weather cleared up.",
    "title_ja": "天気が回復しました。",
    "content": {
      "phrase": "The weather cleared up.",
      "japanese": "天気が回復しました。",
      "situation": "雨や曇りのあとに空が晴れたとき",
      "naturalUsage": "clear up は悪かった天気がよくなる変化を表します。",
      "exampleDialogue": "A: Can we play outside now? B: Sure. The weather cleared up.",
      "commonMistake": "The weather became clear. も文法的ですが、会話では cleared up が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "weather",
      "change",
      "phrasal-verb"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l10-01",
    "category": "phrases",
    "level": 10,
    "title_en": "I don't feel well.",
    "title_ja": "気分がよくありません。",
    "content": {
      "phrase": "I don't feel well.",
      "japanese": "気分がよくありません。",
      "situation": "体調が悪いことを伝えるとき",
      "naturalUsage": "症状がはっきりしなくても使える便利な表現です。",
      "exampleDialogue": "A: You look tired. B: I don't feel well.",
      "commonMistake": "I don't feel good. も会話では使われますが、well は体調を明確に表します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "health",
      "feelings",
      "problem"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l10-02",
    "category": "phrases",
    "level": 10,
    "title_en": "My throat hurts.",
    "title_ja": "のどが痛いです。",
    "content": {
      "phrase": "My throat hurts.",
      "japanese": "のどが痛いです。",
      "situation": "のどの痛みを説明するとき",
      "naturalUsage": "体の部位を主語にして hurts と言う簡単な症状表現です。",
      "exampleDialogue": "A: What's wrong? B: My throat hurts.",
      "commonMistake": "I hurt my throat. は自分でのどを傷つけたという意味になります。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "health",
      "symptoms",
      "body"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l10-03",
    "category": "phrases",
    "level": 10,
    "title_en": "I need to take a break.",
    "title_ja": "休憩する必要があります。",
    "content": {
      "phrase": "I need to take a break.",
      "japanese": "休憩する必要があります。",
      "situation": "疲れて少し休みたいとき",
      "naturalUsage": "勉強、運動、仕事をいったん止めたい場面で使えます。",
      "exampleDialogue": "A: Do you want to keep going? B: I need to take a break.",
      "commonMistake": "take rest より take a break が自然な組み合わせです。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "health",
      "rest",
      "request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l10-04",
    "category": "phrases",
    "level": 10,
    "title_en": "Are you feeling better?",
    "title_ja": "具合はよくなりましたか？",
    "content": {
      "phrase": "Are you feeling better?",
      "japanese": "具合はよくなりましたか？",
      "situation": "体調を崩した人の回復具合を尋ねるとき",
      "naturalUsage": "相手を気づかう、やさしく自然な質問です。",
      "exampleDialogue": "A: Are you feeling better? B: Yes, a little. Thanks.",
      "commonMistake": "Do you feel better? も正しいですが、回復中の様子には Are you feeling better? が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "health",
      "care",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l11-01",
    "category": "phrases",
    "level": 11,
    "title_en": "Do you want to join us?",
    "title_ja": "一緒に参加しませんか？",
    "content": {
      "phrase": "Do you want to join us?",
      "japanese": "一緒に参加しませんか？",
      "situation": "友達を活動に誘うとき",
      "naturalUsage": "すでに始めているグループへ相手を気軽に招く表現です。",
      "exampleDialogue": "A: We're playing cards. Do you want to join us? B: Sure!",
      "commonMistake": "join with us ではなく、join us と直接つなげます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "invitation",
      "friends",
      "activities"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l11-02",
    "category": "phrases",
    "level": 11,
    "title_en": "That sounds fun.",
    "title_ja": "楽しそうですね。",
    "content": {
      "phrase": "That sounds fun.",
      "japanese": "楽しそうですね。",
      "situation": "相手の提案や予定に興味を示すとき",
      "naturalUsage": "聞いた内容への前向きな反応として使います。",
      "exampleDialogue": "A: We're going bowling after lunch. B: That sounds fun.",
      "commonMistake": "That sounds funny. は「おかしく聞こえる」という意味になることがあります。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "reaction",
      "invitation",
      "positive"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l11-03",
    "category": "phrases",
    "level": 11,
    "title_en": "Maybe next time.",
    "title_ja": "また今度ね。",
    "content": {
      "phrase": "Maybe next time.",
      "japanese": "また今度ね。",
      "situation": "誘いをやわらかく断るとき",
      "naturalUsage": "今は参加できないことを角を立てずに伝えます。",
      "exampleDialogue": "A: Can you come to the game? B: I can't today. Maybe next time.",
      "commonMistake": "Next time maybe. より Maybe next time. の語順が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "declining",
      "invitation",
      "softening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l11-04",
    "category": "phrases",
    "level": 11,
    "title_en": "I'm really into drawing.",
    "title_ja": "絵を描くことにすごく夢中です。",
    "content": {
      "phrase": "I'm really into drawing.",
      "japanese": "絵を描くことにすごく夢中です。",
      "situation": "今熱中している趣味を話すとき",
      "naturalUsage": "be into ... は、好きで夢中になっていることを会話的に表します。",
      "exampleDialogue": "A: What do you do for fun? B: I'm really into drawing.",
      "commonMistake": "I'm interesting in drawing. ではなく、interested in または into を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "hobbies",
      "interest",
      "conversation"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l12-01",
    "category": "phrases",
    "level": 12,
    "title_en": "What page are we on?",
    "title_ja": "今、何ページですか？",
    "content": {
      "phrase": "What page are we on?",
      "japanese": "今、何ページですか？",
      "situation": "授業で開くページを確認するとき",
      "naturalUsage": "授業の進行についていけなくなったときにすぐ使えます。",
      "exampleDialogue": "A: What page are we on? B: Page thirty-four.",
      "commonMistake": "Which page we are? ではなく、What page are we on? が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "school",
      "classroom",
      "clarification"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l12-02",
    "category": "phrases",
    "level": 12,
    "title_en": "Can we work together?",
    "title_ja": "一緒に取り組んでもいい？",
    "content": {
      "phrase": "Can we work together?",
      "japanese": "一緒に取り組んでもいい？",
      "situation": "ペアやグループで作業したいとき",
      "naturalUsage": "クラスメートを共同作業に誘う簡潔な表現です。",
      "exampleDialogue": "A: Can we work together? B: Yes, let's be partners.",
      "commonMistake": "work together with us のように不要な語を足さず、二人ならこの形で十分です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "school",
      "teamwork",
      "request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l12-03",
    "category": "phrases",
    "level": 12,
    "title_en": "I left my notebook at home.",
    "title_ja": "ノートを家に置いてきました。",
    "content": {
      "phrase": "I left my notebook at home.",
      "japanese": "ノートを家に置いてきました。",
      "situation": "必要な持ち物を家に忘れたとき",
      "naturalUsage": "忘れた物が今も家にある場合は left ... at home が自然です。",
      "exampleDialogue": "A: Where's your notebook? B: I left my notebook at home.",
      "commonMistake": "I forgot my notebook at home. より left my notebook at home が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "school",
      "mistake",
      "belongings"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l12-04",
    "category": "phrases",
    "level": 12,
    "title_en": "Good luck on your test.",
    "title_ja": "テスト、頑張ってね。",
    "content": {
      "phrase": "Good luck on your test.",
      "japanese": "テスト、頑張ってね。",
      "situation": "テスト前の相手を応援するとき",
      "naturalUsage": "on your test と添えて、何について応援しているかを示します。",
      "exampleDialogue": "A: I have a math test today. B: Good luck on your test.",
      "commonMistake": "Fight! は日本語の「ファイト」の意味では通常使いません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "school",
      "encouragement",
      "test"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l13-01",
    "category": "phrases",
    "level": 13,
    "title_en": "I've never tried that before.",
    "title_ja": "それは今までやったことがありません。",
    "content": {
      "phrase": "I've never tried that before.",
      "japanese": "それは今までやったことがありません。",
      "situation": "初めての体験だと伝えるとき",
      "naturalUsage": "現在までの経験の有無を現在完了で表します。",
      "exampleDialogue": "A: Have you ever gone kayaking? B: I've never tried that before.",
      "commonMistake": "I've never tried that ago. のように現在完了と ago を一緒に使いません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "experience",
      "present-perfect",
      "conversation"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l13-02",
    "category": "phrases",
    "level": 13,
    "title_en": "It was better than I expected.",
    "title_ja": "思っていたよりよかったです。",
    "content": {
      "phrase": "It was better than I expected.",
      "japanese": "思っていたよりよかったです。",
      "situation": "体験が予想以上によかったとき",
      "naturalUsage": "映画、食事、イベントなどの感想に幅広く使えます。",
      "exampleDialogue": "A: How was the school play? B: It was better than I expected.",
      "commonMistake": "better than I expected it のように末尾へ it を足しません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "experience",
      "comparison",
      "reaction"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l13-03",
    "category": "phrases",
    "level": 13,
    "title_en": "I had a great time.",
    "title_ja": "とても楽しかったです。",
    "content": {
      "phrase": "I had a great time.",
      "japanese": "とても楽しかったです。",
      "situation": "イベントや訪問の感想を伝えるとき",
      "naturalUsage": "帰り際や翌日に、楽しい時間への感謝も込めて使えます。",
      "exampleDialogue": "A: Thanks for coming today. B: I had a great time.",
      "commonMistake": "I was a great time. ではなく、have a great time を過去形にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "experience",
      "past",
      "positive"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l13-04",
    "category": "phrases",
    "level": 13,
    "title_en": "How did it go?",
    "title_ja": "どうだった？",
    "content": {
      "phrase": "How did it go?",
      "japanese": "どうだった？",
      "situation": "相手が終えた出来事の結果や様子を尋ねるとき",
      "naturalUsage": "試験、面接、発表など、すでに話題になっている出来事に使います。",
      "exampleDialogue": "A: I just finished my interview. B: How did it go?",
      "commonMistake": "How was it going? は進行中の様子を尋ねる意味になり、結果を聞く形とは異なります。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "experience",
      "follow-up",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l14-01",
    "category": "phrases",
    "level": 14,
    "title_en": "Are you free after school?",
    "title_ja": "放課後、時間ある？",
    "content": {
      "phrase": "Are you free after school?",
      "japanese": "放課後、時間ある？",
      "situation": "相手の予定が空いているか確認するとき",
      "naturalUsage": "誘いを出す前に都合を尋ねる自然な導入です。",
      "exampleDialogue": "A: Are you free after school? B: Yes, until five.",
      "commonMistake": "Do you free? ではなく、形容詞 free の前に be動詞を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "plans",
      "availability",
      "friends"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l14-02",
    "category": "phrases",
    "level": 14,
    "title_en": "I'm planning to leave early.",
    "title_ja": "早めに出る予定です。",
    "content": {
      "phrase": "I'm planning to leave early.",
      "japanese": "早めに出る予定です。",
      "situation": "自分が考えている予定を共有するとき",
      "naturalUsage": "確定に近い個人的な計画を plan to で伝えます。",
      "exampleDialogue": "A: Will traffic be busy? B: Maybe, so I'm planning to leave early.",
      "commonMistake": "I'm planning leave ではなく、planning to leave とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "plans",
      "future",
      "time"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l14-03",
    "category": "phrases",
    "level": 14,
    "title_en": "Does Saturday work for you?",
    "title_ja": "土曜日で都合はいいですか？",
    "content": {
      "phrase": "Does Saturday work for you?",
      "japanese": "土曜日で都合はいいですか？",
      "situation": "会う日程を調整するとき",
      "naturalUsage": "work for you は「あなたにとって都合がよい」という会話表現です。",
      "exampleDialogue": "A: Does Saturday work for you? B: Saturday is perfect.",
      "commonMistake": "Is Saturday working for you? より、日程確認には Does Saturday work for you? が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "scheduling",
      "plans",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l14-04",
    "category": "phrases",
    "level": 14,
    "title_en": "I'll let you know tonight.",
    "title_ja": "今夜連絡します。",
    "content": {
      "phrase": "I'll let you know tonight.",
      "japanese": "今夜連絡します。",
      "situation": "すぐに決められず、あとで返事をするとき",
      "naturalUsage": "確認後に情報や決定を伝える約束として使います。",
      "exampleDialogue": "A: Can you come on Sunday? B: I'll let you know tonight.",
      "commonMistake": "I'll tell you if I know. より、let you know が自然な定型表現です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "plans",
      "follow-up",
      "promise"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l15-01",
    "category": "phrases",
    "level": 15,
    "title_en": "I'd like to check in.",
    "title_ja": "チェックインをお願いします。",
    "content": {
      "phrase": "I'd like to check in.",
      "japanese": "チェックインをお願いします。",
      "situation": "ホテルのフロントで到着手続きをするとき",
      "naturalUsage": "I'd like to ... を使う丁寧で落ち着いた依頼です。",
      "exampleDialogue": "A: How can I help you? B: I'd like to check in.",
      "commonMistake": "I want check in. ではなく、want to または丁寧な I'd like to を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "travel",
      "hotel",
      "request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l15-02",
    "category": "phrases",
    "level": 15,
    "title_en": "Which platform does it leave from?",
    "title_ja": "何番ホームから出ますか？",
    "content": {
      "phrase": "Which platform does it leave from?",
      "japanese": "何番ホームから出ますか？",
      "situation": "電車の出発ホームを確認するとき",
      "naturalUsage": "it は直前に話題にした電車を指し、leave from で出発場所を尋ねます。",
      "exampleDialogue": "A: Which platform does it leave from? B: Platform six.",
      "commonMistake": "Where platform does it leave? ではなく、Which platform ... from? とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "travel",
      "train",
      "directions"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l15-03",
    "category": "phrases",
    "level": 15,
    "title_en": "Is this seat taken?",
    "title_ja": "この席はどなたか使っていますか？",
    "content": {
      "phrase": "Is this seat taken?",
      "japanese": "この席はどなたか使っていますか？",
      "situation": "席を使ってよいか確認するとき",
      "naturalUsage": "電車、カフェ、待合室などで、その席に誰かいるかを丁寧に尋ねます。",
      "exampleDialogue": "A: Is this seat taken? B: No, go ahead.",
      "commonMistake": "Is anyone sitting? だけではどの席か曖昧なため、この定型表現が便利です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "travel",
      "seat",
      "polite"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l15-04",
    "category": "phrases",
    "level": 15,
    "title_en": "Could you recommend somewhere nearby?",
    "title_ja": "近くのおすすめの場所を教えていただけますか？",
    "content": {
      "phrase": "Could you recommend somewhere nearby?",
      "japanese": "近くのおすすめの場所を教えていただけますか？",
      "situation": "近所の店や観光地を教えてもらうとき",
      "naturalUsage": "somewhere nearby で場所の種類を限定せずおすすめを尋ねられます。",
      "exampleDialogue": "A: Could you recommend somewhere nearby? B: There's a nice café around the corner.",
      "commonMistake": "recommend me somewhere より、recommend somewhere to me またはこの形が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "travel",
      "recommendation",
      "local"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l16-01",
    "category": "phrases",
    "level": 16,
    "title_en": "Something seems to be wrong.",
    "title_ja": "何か問題があるようです。",
    "content": {
      "phrase": "Something seems to be wrong.",
      "japanese": "何か問題があるようです。",
      "situation": "原因は不明だが正常ではないと伝えるとき",
      "naturalUsage": "断定を避けながら問題を知らせる、穏やかな表現です。",
      "exampleDialogue": "A: Why won't the screen turn on? B: Something seems to be wrong.",
      "commonMistake": "Something is wrong. より控えめに言いたいときは seems to be を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "problem",
      "uncertainty",
      "technology"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l16-02",
    "category": "phrases",
    "level": 16,
    "title_en": "I can't get this to work.",
    "title_ja": "どうしてもこれがうまく動きません。",
    "content": {
      "phrase": "I can't get this to work.",
      "japanese": "どうしてもこれがうまく動きません。",
      "situation": "機械やアプリがうまく動かないとき",
      "naturalUsage": "試しているのに期待どおり作動しない状況を表します。",
      "exampleDialogue": "A: Is the printer ready? B: No, I can't get this to work.",
      "commonMistake": "I can't make this working. ではなく、get this to work と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "problem",
      "technology",
      "help"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l16-03",
    "category": "phrases",
    "level": 16,
    "title_en": "I may have misunderstood.",
    "title_ja": "私が勘違いしたかもしれません。",
    "content": {
      "phrase": "I may have misunderstood.",
      "japanese": "私が勘違いしたかもしれません。",
      "situation": "説明の理解が違っていた可能性を認めるとき",
      "naturalUsage": "相手を責めず、自分側の誤解として丁寧に確認できます。",
      "exampleDialogue": "A: The meeting starts at three. B: Oh, I may have misunderstood.",
      "commonMistake": "I might misunderstand. だとこれから誤解する可能性にも聞こえるため、過去は may have misunderstood です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "misunderstanding",
      "polite",
      "problem"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l16-04",
    "category": "phrases",
    "level": 16,
    "title_en": "Could you take a look?",
    "title_ja": "ちょっと見てもらえますか？",
    "content": {
      "phrase": "Could you take a look?",
      "japanese": "ちょっと見てもらえますか？",
      "situation": "問題や作業内容を確認してほしいとき",
      "naturalUsage": "詳しい説明のあとに、相手へ確認や助けを頼む自然な表現です。",
      "exampleDialogue": "A: This file won't open. Could you take a look? B: Sure.",
      "commonMistake": "look it ではなく、look at it または take a look と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "help",
      "request",
      "problem"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l17-01",
    "category": "phrases",
    "level": 17,
    "title_en": "In my opinion, it's worth trying.",
    "title_ja": "私の意見では、試す価値があります。",
    "content": {
      "phrase": "In my opinion, it's worth trying.",
      "japanese": "私の意見では、試す価値があります。",
      "situation": "自分の考えを明確に述べるとき",
      "naturalUsage": "意見であることを示してから、worth + 動名詞で価値を伝えます。",
      "exampleDialogue": "A: Should we use the new app? B: In my opinion, it's worth trying.",
      "commonMistake": "worth to try ではなく、worth trying とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "opinion",
      "recommendation",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l17-02",
    "category": "phrases",
    "level": 17,
    "title_en": "I see what you mean.",
    "title_ja": "言いたいことは分かります。",
    "content": {
      "phrase": "I see what you mean.",
      "japanese": "言いたいことは分かります。",
      "situation": "相手の考えを理解したと示すとき",
      "naturalUsage": "完全な賛成とは限らず、まず相手の視点を受け止める表現です。",
      "exampleDialogue": "A: The first option is simpler. B: I see what you mean.",
      "commonMistake": "I know what you mean. も使えますが、議論では I see ... が理解の変化を自然に示します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "understanding",
      "opinion",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l17-03",
    "category": "phrases",
    "level": 17,
    "title_en": "I completely agree with you.",
    "title_ja": "あなたにまったく同感です。",
    "content": {
      "phrase": "I completely agree with you.",
      "japanese": "あなたにまったく同感です。",
      "situation": "相手の意見に強く賛成するとき",
      "naturalUsage": "with you を添えて、誰の意見に賛成かを示します。",
      "exampleDialogue": "A: We need more time to practice. B: I completely agree with you.",
      "commonMistake": "I agree you. ではなく、agree with you と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "agreement",
      "opinion",
      "emphasis"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l17-04",
    "category": "phrases",
    "level": 17,
    "title_en": "I'm not convinced yet.",
    "title_ja": "まだ納得していません。",
    "content": {
      "phrase": "I'm not convinced yet.",
      "japanese": "まだ納得していません。",
      "situation": "説明を聞いても判断が変わっていないとき",
      "naturalUsage": "強い否定を避けつつ、追加の根拠が必要だと伝えられます。",
      "exampleDialogue": "A: This plan will save money. B: I'm not convinced yet.",
      "commonMistake": "I'm not convincing. は自分に説得力がないという意味になるため、convinced を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "disagreement",
      "opinion",
      "softening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l18-01",
    "category": "phrases",
    "level": 18,
    "title_en": "Why don't we start with the easiest part?",
    "title_ja": "一番簡単な部分から始めませんか？",
    "content": {
      "phrase": "Why don't we start with the easiest part?",
      "japanese": "一番簡単な部分から始めませんか？",
      "situation": "作業の進め方を提案するとき",
      "naturalUsage": "Why don't we ...? は仲間に提案する自然な疑問文です。",
      "exampleDialogue": "A: This project feels huge. B: Why don't we start with the easiest part?",
      "commonMistake": "Why we don't start ...? ではなく、Why don't we start ...? の語順です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "suggestion",
      "teamwork",
      "planning"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l18-02",
    "category": "phrases",
    "level": 18,
    "title_en": "We could give it another day.",
    "title_ja": "もう一日様子を見てもいいかもしれません。",
    "content": {
      "phrase": "We could give it another day.",
      "japanese": "もう一日様子を見てもいいかもしれません。",
      "situation": "決定を急がず待つ案を出すとき",
      "naturalUsage": "could を使い、押しつけず選択肢として提案します。",
      "exampleDialogue": "A: Should we decide now? B: We could give it another day.",
      "commonMistake": "give another day it ではなく、give it another day の順にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "suggestion",
      "decision",
      "time"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l18-03",
    "category": "phrases",
    "level": 18,
    "title_en": "Let's think it over.",
    "title_ja": "よく考えてみましょう。",
    "content": {
      "phrase": "Let's think it over.",
      "japanese": "よく考えてみましょう。",
      "situation": "結論を出す前に検討する時間を取りたいとき",
      "naturalUsage": "think over は選択肢や提案を慎重に検討するという意味です。",
      "exampleDialogue": "A: Do we have to answer today? B: No, let's think it over.",
      "commonMistake": "代名詞 it は think と over の間に置きます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "decision",
      "reflection",
      "phrasal-verb"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l18-04",
    "category": "phrases",
    "level": 18,
    "title_en": "That seems like the best option.",
    "title_ja": "それが最善の選択肢のようです。",
    "content": {
      "phrase": "That seems like the best option.",
      "japanese": "それが最善の選択肢のようです。",
      "situation": "比較したあとで有力な案を示すとき",
      "naturalUsage": "seems like を使うことで、断定しすぎない判断になります。",
      "exampleDialogue": "A: We can take the earlier train. B: That seems like the best option.",
      "commonMistake": "That seems the best option. も可能ですが、会話では seems like が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "decision",
      "opinion",
      "choice"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l19-01",
    "category": "phrases",
    "level": 19,
    "title_en": "Could you say that another way?",
    "title_ja": "別の言い方で言っていただけますか？",
    "content": {
      "phrase": "Could you say that another way?",
      "japanese": "別の言い方で言っていただけますか？",
      "situation": "同じ説明を別の表現で聞きたいとき",
      "naturalUsage": "単なる繰り返しではなく、言い換えをお願いする表現です。",
      "exampleDialogue": "A: The result was inconclusive. B: Could you say that another way?",
      "commonMistake": "Say again は繰り返し、say that another way は言い換えを求めます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "clarification",
      "listening",
      "conversation-repair"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l19-02",
    "category": "phrases",
    "level": 19,
    "title_en": "What exactly do you mean?",
    "title_ja": "具体的にはどういう意味ですか？",
    "content": {
      "phrase": "What exactly do you mean?",
      "japanese": "具体的にはどういう意味ですか？",
      "situation": "相手の意図をより正確に確認するとき",
      "naturalUsage": "exactly を強く言いすぎると詰問調になるため、穏やかな声で使います。",
      "exampleDialogue": "A: We may need to change the format. B: What exactly do you mean?",
      "commonMistake": "What do you mean exactly? も自然ですが、語調によっては強く聞こえる点に注意します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "clarification",
      "meaning",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l19-03",
    "category": "phrases",
    "level": 19,
    "title_en": "Let me make sure I understood.",
    "title_ja": "理解できているか確認させてください。",
    "content": {
      "phrase": "Let me make sure I understood.",
      "japanese": "理解できているか確認させてください。",
      "situation": "聞いた内容を自分の言葉で確認する前",
      "naturalUsage": "大事な情報の認識違いを防ぐ、丁寧な会話のつなぎです。",
      "exampleDialogue": "A: Send the draft by noon. B: Let me make sure I understood. You need it before lunch, right?",
      "commonMistake": "make sure のあとには内容を表す節を続けます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "clarification",
      "confirmation",
      "listening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l19-04",
    "category": "phrases",
    "level": 19,
    "title_en": "I didn't catch the last part.",
    "title_ja": "最後の部分が聞き取れませんでした。",
    "content": {
      "phrase": "I didn't catch the last part.",
      "japanese": "最後の部分が聞き取れませんでした。",
      "situation": "発言の終わりだけ聞こえなかったとき",
      "naturalUsage": "catch はここでは音や言葉を聞き取るという意味です。",
      "exampleDialogue": "A: Meet me beside the north entrance. B: Sorry, I didn't catch the last part.",
      "commonMistake": "I couldn't hear the last part. も正しいですが、didn't catch は聞き返しでよく使われます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "clarification",
      "listening",
      "conversation-repair"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l20-01",
    "category": "phrases",
    "level": 20,
    "title_en": "I'll get back to you by Friday.",
    "title_ja": "金曜日までにお返事します。",
    "content": {
      "phrase": "I'll get back to you by Friday.",
      "japanese": "金曜日までにお返事します。",
      "situation": "確認後の返答期限を伝えるとき",
      "naturalUsage": "仕事や学校の連絡で、いつ返事をするか明確にできます。",
      "exampleDialogue": "A: Can you confirm the numbers? B: I'll get back to you by Friday.",
      "commonMistake": "until Friday は金曜まで継続する意味で、締切には by Friday を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "work",
      "follow-up",
      "deadline"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l20-02",
    "category": "phrases",
    "level": 20,
    "title_en": "Could we move the meeting to three?",
    "title_ja": "会議を3時に変更できますか？",
    "content": {
      "phrase": "Could we move the meeting to three?",
      "japanese": "会議を3時に変更できますか？",
      "situation": "予定時刻の変更を相談するとき",
      "naturalUsage": "move ... to ... で予定を別の時刻へ動かすことを表します。",
      "exampleDialogue": "A: Could we move the meeting to three? B: Three works for me.",
      "commonMistake": "move the meeting at three ではなく、変更先には to three を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "work",
      "scheduling",
      "request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l20-03",
    "category": "phrases",
    "level": 20,
    "title_en": "I'm running a little behind.",
    "title_ja": "少し予定より遅れています。",
    "content": {
      "phrase": "I'm running a little behind.",
      "japanese": "少し予定より遅れています。",
      "situation": "到着や作業が遅れていると連絡するとき",
      "naturalUsage": "late と断定する前でも、予定より遅れ気味なら使えます。",
      "exampleDialogue": "A: Are you almost here? B: I'm running a little behind.",
      "commonMistake": "I'm running late は明確な遅刻、running behind は予定からの遅れを広く表します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "work",
      "delay",
      "scheduling"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l20-04",
    "category": "phrases",
    "level": 20,
    "title_en": "Let's divide the work evenly.",
    "title_ja": "作業を均等に分けましょう。",
    "content": {
      "phrase": "Let's divide the work evenly.",
      "japanese": "作業を均等に分けましょう。",
      "situation": "チームで担当を決めるとき",
      "naturalUsage": "作業量の偏りを避けたいときの建設的な提案です。",
      "exampleDialogue": "A: There are eight sections. B: Let's divide the work evenly.",
      "commonMistake": "divide the work equally も可能ですが、人ごとの量には evenly が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "teamwork",
      "work",
      "planning"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l21-01",
    "category": "phrases",
    "level": 21,
    "title_en": "I hope I'm not interrupting.",
    "title_ja": "お邪魔でなければよいのですが。",
    "content": {
      "phrase": "I hope I'm not interrupting.",
      "japanese": "お邪魔でなければよいのですが。",
      "situation": "忙しそうな人に声をかけるとき",
      "naturalUsage": "用件に入る前に相手への配慮を示すクッション表現です。",
      "exampleDialogue": "A: I hope I'm not interrupting. B: Not at all. What's up?",
      "commonMistake": "I hope I don't interrupt. より、今まさに声をかけている場面では I'm not interrupting が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "politeness",
      "social",
      "softening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l21-02",
    "category": "phrases",
    "level": 21,
    "title_en": "No rush—whenever you're ready.",
    "title_ja": "急がなくて大丈夫です。準備ができたときで。",
    "content": {
      "phrase": "No rush—whenever you're ready.",
      "japanese": "急がなくて大丈夫です。準備ができたときで。",
      "situation": "相手を急がせたくないと伝えるとき",
      "naturalUsage": "待てることを伝え、相手のプレッシャーを減らす温かい表現です。",
      "exampleDialogue": "A: I need another minute. B: No rush—whenever you're ready.",
      "commonMistake": "Don't hurry. は命令の響きが出ることがあり、No rush. のほうが柔らかいです。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "reassurance",
      "social",
      "patience"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l21-03",
    "category": "phrases",
    "level": 21,
    "title_en": "It was thoughtful of you to ask.",
    "title_ja": "気にかけて声をかけてくれてありがとう。",
    "content": {
      "phrase": "It was thoughtful of you to ask.",
      "japanese": "気にかけて声をかけてくれてありがとう。",
      "situation": "相手の心づかいに感謝するとき",
      "naturalUsage": "行動そのものだけでなく、その思いやりを評価する表現です。",
      "exampleDialogue": "A: Do you need a ride home? B: I'm okay, but it was thoughtful of you to ask.",
      "commonMistake": "You are thoughtful to ask. より It was thoughtful of you to ask. が自然な構文です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "thanks",
      "kindness",
      "social"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l21-04",
    "category": "phrases",
    "level": 21,
    "title_en": "I didn't mean to leave you out.",
    "title_ja": "仲間外れにするつもりはありませんでした。",
    "content": {
      "phrase": "I didn't mean to leave you out.",
      "japanese": "仲間外れにするつもりはありませんでした。",
      "situation": "相手を意図せず誘いや話から外してしまったとき",
      "naturalUsage": "意図がなかったことを伝えつつ、相手の気持ちに配慮する謝罪表現です。",
      "exampleDialogue": "A: Everyone knew about the plan except me. B: I'm sorry. I didn't mean to leave you out.",
      "commonMistake": "leave you outside は物理的に外へ残す意味で、仲間外れは leave you out です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "apology",
      "social",
      "relationships"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l22-01",
    "category": "phrases",
    "level": 22,
    "title_en": "I'm afraid this isn't what I ordered.",
    "title_ja": "すみません、これは注文したものと違うようです。",
    "content": {
      "phrase": "I'm afraid this isn't what I ordered.",
      "japanese": "すみません、これは注文したものと違うようです。",
      "situation": "店で注文と違う品が届いたとき",
      "naturalUsage": "I'm afraid を添えると、問題を丁寧に切り出せます。",
      "exampleDialogue": "A: Is everything okay? B: I'm afraid this isn't what I ordered.",
      "commonMistake": "I'm afraid of this isn't ... とはせず、I'm afraid のあとに文を続けます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "service",
      "complaint",
      "restaurant"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l22-02",
    "category": "phrases",
    "level": 22,
    "title_en": "Would it be possible to exchange this?",
    "title_ja": "これは交換していただけますか？",
    "content": {
      "phrase": "Would it be possible to exchange this?",
      "japanese": "これは交換していただけますか？",
      "situation": "購入品の交換を丁寧に依頼するとき",
      "naturalUsage": "可能かどうかを尋ねる形で、控えめかつ丁寧に依頼します。",
      "exampleDialogue": "A: Would it be possible to exchange this? B: Do you have the receipt?",
      "commonMistake": "exchange to another one ではなく、exchange this for another one と言えます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "service",
      "exchange",
      "polite-request"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l22-03",
    "category": "phrases",
    "level": 22,
    "title_en": "There seems to be an extra charge.",
    "title_ja": "追加料金がついているようです。",
    "content": {
      "phrase": "There seems to be an extra charge.",
      "japanese": "追加料金がついているようです。",
      "situation": "請求額に心当たりのない料金があるとき",
      "naturalUsage": "mistake と決めつけず、確認を促す穏やかな伝え方です。",
      "exampleDialogue": "A: Is there a problem with the bill? B: There seems to be an extra charge.",
      "commonMistake": "There has an extra charge. ではなく、存在は There is / seems to be で表します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "service",
      "billing",
      "complaint"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l22-04",
    "category": "phrases",
    "level": 22,
    "title_en": "Thank you for sorting that out.",
    "title_ja": "解決してくださってありがとうございます。",
    "content": {
      "phrase": "Thank you for sorting that out.",
      "japanese": "解決してくださってありがとうございます。",
      "situation": "店員や担当者が問題を解決してくれたとき",
      "naturalUsage": "sort out は問題や混乱をきちんと処理するという意味です。",
      "exampleDialogue": "A: We've removed the incorrect fee. B: Thank you for sorting that out.",
      "commonMistake": "Thank you to sort ... ではなく、Thank you for sorting ... とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "service",
      "thanks",
      "resolution"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l23-01",
    "category": "phrases",
    "level": 23,
    "title_en": "You won't believe what happened next.",
    "title_ja": "このあと何が起きたか、きっと信じられないよ。",
    "content": {
      "phrase": "You won't believe what happened next.",
      "japanese": "このあと何が起きたか、きっと信じられないよ。",
      "situation": "驚く展開の前に聞き手の興味を引くとき",
      "naturalUsage": "物語の山場へ入る前の、会話的で生き生きしたつなぎです。",
      "exampleDialogue": "A: I finally found my missing phone. You won't believe what happened next. B: Tell me!",
      "commonMistake": "You can't believe ... より、これから話す内容には You won't believe ... が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "storytelling",
      "surprise",
      "narrative"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l23-02",
    "category": "phrases",
    "level": 23,
    "title_en": "It turned out to be a misunderstanding.",
    "title_ja": "結局、誤解だったと分かりました。",
    "content": {
      "phrase": "It turned out to be a misunderstanding.",
      "japanese": "結局、誤解だったと分かりました。",
      "situation": "出来事の意外な結末を説明するとき",
      "naturalUsage": "turn out to be は、あとで事実が判明した流れを表します。",
      "exampleDialogue": "A: Was your reservation canceled? B: No, it turned out to be a misunderstanding.",
      "commonMistake": "It was turned out ... と受け身にせず、It turned out ... とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "storytelling",
      "outcome",
      "phrasal-verb"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l23-03",
    "category": "phrases",
    "level": 23,
    "title_en": "I couldn't stop laughing.",
    "title_ja": "笑いが止まりませんでした。",
    "content": {
      "phrase": "I couldn't stop laughing.",
      "japanese": "笑いが止まりませんでした。",
      "situation": "とてもおもしろかった出来事を振り返るとき",
      "naturalUsage": "stop + 動名詞で、その動作をやめるという意味になります。",
      "exampleDialogue": "A: How was the comedy show? B: I couldn't stop laughing.",
      "commonMistake": "stop to laugh は別の行動を止めて笑う意味なので、stop laughing を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "storytelling",
      "emotion",
      "reaction"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l23-04",
    "category": "phrases",
    "level": 23,
    "title_en": "That must have been stressful.",
    "title_ja": "それは大変だったでしょうね。",
    "content": {
      "phrase": "That must have been stressful.",
      "japanese": "それは大変だったでしょうね。",
      "situation": "相手のつらい体験に共感するとき",
      "naturalUsage": "過去の状況を想像し、must have been で強い共感を示します。",
      "exampleDialogue": "A: My flight was canceled at midnight. B: That must have been stressful.",
      "commonMistake": "That must be stressful. は現在の状況、過去の体験には must have been を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "empathy",
      "storytelling",
      "past-deduction"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l24-01",
    "category": "phrases",
    "level": 24,
    "title_en": "I'm working on being more consistent.",
    "title_ja": "もっと継続できるよう取り組んでいます。",
    "content": {
      "phrase": "I'm working on being more consistent.",
      "japanese": "もっと継続できるよう取り組んでいます。",
      "situation": "改善したい習慣や目標を話すとき",
      "naturalUsage": "work on + 動名詞で、時間をかけて改善中だと伝えます。",
      "exampleDialogue": "A: How is your English practice going? B: I'm working on being more consistent.",
      "commonMistake": "work to being ではなく、work on being とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "goals",
      "habits",
      "self-improvement"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l24-02",
    "category": "phrases",
    "level": 24,
    "title_en": "I've made more progress than I realized.",
    "title_ja": "思っていた以上に上達していました。",
    "content": {
      "phrase": "I've made more progress than I realized.",
      "japanese": "思っていた以上に上達していました。",
      "situation": "自分の成長に気づいたとき",
      "naturalUsage": "これまでの積み重ねによる現在の進歩を現在完了で表します。",
      "exampleDialogue": "A: Listen to your recording from last year. B: I've made more progress than I realized.",
      "commonMistake": "make a progress とは言わず、不可算名詞として make progress と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "progress",
      "reflection",
      "present-perfect"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l24-03",
    "category": "phrases",
    "level": 24,
    "title_en": "I'm taking it one step at a time.",
    "title_ja": "一歩ずつ進めています。",
    "content": {
      "phrase": "I'm taking it one step at a time.",
      "japanese": "一歩ずつ進めています。",
      "situation": "大きな目標へ焦らず着実に進むとき",
      "naturalUsage": "難しい課題に無理なく取り組む姿勢を表す決まり表現です。",
      "exampleDialogue": "A: Isn't the course difficult? B: It is, but I'm taking it one step at a time.",
      "commonMistake": "step by step も使えますが、この文では one step at a time が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "goals",
      "progress",
      "mindset"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l24-04",
    "category": "phrases",
    "level": 24,
    "title_en": "What would you like to improve next?",
    "title_ja": "次は何を伸ばしたいですか？",
    "content": {
      "phrase": "What would you like to improve next?",
      "japanese": "次は何を伸ばしたいですか？",
      "situation": "次の学習目標を一緒に考えるとき",
      "naturalUsage": "would like to で、相手の希望を丁寧に尋ねます。",
      "exampleDialogue": "A: Your pronunciation is much clearer. What would you like to improve next? B: My listening skills.",
      "commonMistake": "What do you want improve? ではなく、want to improve または would like to improve とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "goals",
      "learning",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l25-01",
    "category": "phrases",
    "level": 25,
    "title_en": "I understand your point, but I see it differently.",
    "title_ja": "おっしゃる点は分かりますが、私は違う見方をしています。",
    "content": {
      "phrase": "I understand your point, but I see it differently.",
      "japanese": "おっしゃる点は分かりますが、私は違う見方をしています。",
      "situation": "相手を尊重しながら異なる意見を述べるとき",
      "naturalUsage": "理解を示してから but で自分の見方を伝える、建設的な反対表現です。",
      "exampleDialogue": "A: Speed should be our top priority. B: I understand your point, but I see it differently.",
      "commonMistake": "I have a different opinion than you. より、この形は人ではなく見方の違いに焦点を当てます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "disagreement",
      "diplomacy",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l25-02",
    "category": "phrases",
    "level": 25,
    "title_en": "I'm not sure that's the whole picture.",
    "title_ja": "それだけが全体像ではないと思います。",
    "content": {
      "phrase": "I'm not sure that's the whole picture.",
      "japanese": "それだけが全体像ではないと思います。",
      "situation": "議論に不足している視点があると示すとき",
      "naturalUsage": "相手の主張を真っ向から否定せず、追加検討を促します。",
      "exampleDialogue": "A: The low score means the idea failed. B: I'm not sure that's the whole picture.",
      "commonMistake": "whole picture は文字どおりの写真ではなく、状況全体という比喩です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "disagreement",
      "perspective",
      "softening"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l25-03",
    "category": "phrases",
    "level": 25,
    "title_en": "Could there be another explanation?",
    "title_ja": "別の説明も考えられませんか？",
    "content": {
      "phrase": "Could there be another explanation?",
      "japanese": "別の説明も考えられませんか？",
      "situation": "結論に対する別の可能性を提案するとき",
      "naturalUsage": "疑問形で代案を示すため、議論の雰囲気を協力的に保てます。",
      "exampleDialogue": "A: She didn't reply, so she must be upset. B: Could there be another explanation?",
      "commonMistake": "Is there can be ... とはせず、Could there be ... の語順にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "discussion",
      "alternative",
      "critical-thinking"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l25-04",
    "category": "phrases",
    "level": 25,
    "title_en": "Let's agree to disagree on that.",
    "title_ja": "その点は意見の違いを認め合いましょう。",
    "content": {
      "phrase": "Let's agree to disagree on that.",
      "japanese": "その点は意見の違いを認め合いましょう。",
      "situation": "意見の一致が難しく、友好的に議論を終えるとき",
      "naturalUsage": "互いの立場を変えずに、対立を長引かせないための表現です。",
      "exampleDialogue": "A: I still prefer the original design. B: Fair enough. Let's agree to disagree on that.",
      "commonMistake": "これは相手に同意する表現ではなく、意見の不一致を受け入れる表現です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "disagreement",
      "resolution",
      "diplomacy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l26-01",
    "category": "phrases",
    "level": 26,
    "title_en": "Let me walk you through the main idea.",
    "title_ja": "中心となる考えを順にご説明します。",
    "content": {
      "phrase": "Let me walk you through the main idea.",
      "japanese": "中心となる考えを順にご説明します。",
      "situation": "発表や説明を始めるとき",
      "naturalUsage": "walk someone through ... は、手順や内容を順を追って案内する表現です。",
      "exampleDialogue": "A: This diagram looks complicated. B: Let me walk you through the main idea.",
      "commonMistake": "walk through you ではなく、walk you through ... の順にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "presentation",
      "explanation",
      "professional"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l26-02",
    "category": "phrases",
    "level": 26,
    "title_en": "The key takeaway is that small changes add up.",
    "title_ja": "重要なポイントは、小さな変化も積み重なるということです。",
    "content": {
      "phrase": "The key takeaway is that small changes add up.",
      "japanese": "重要なポイントは、小さな変化も積み重なるということです。",
      "situation": "発表の要点をまとめるとき",
      "naturalUsage": "key takeaway は聞き手に覚えてほしい最重要点を示します。",
      "exampleDialogue": "A: How would you summarize the results? B: The key takeaway is that small changes add up.",
      "commonMistake": "takeaway はここでは持ち帰り料理ではなく、学ぶべき要点という意味です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "presentation",
      "summary",
      "key-point"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l26-03",
    "category": "phrases",
    "level": 26,
    "title_en": "I'd like to build on that idea.",
    "title_ja": "その考えをさらに発展させたいと思います。",
    "content": {
      "phrase": "I'd like to build on that idea.",
      "japanese": "その考えをさらに発展させたいと思います。",
      "situation": "他の人の発言につなげて意見を加えるとき",
      "naturalUsage": "相手の貢献を認めながら、自分の考えへ滑らかにつなげます。",
      "exampleDialogue": "A: We should ask users earlier. B: I'd like to build on that idea.",
      "commonMistake": "build up that idea より、考えを発展させる場合は build on that idea です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "discussion",
      "collaboration",
      "idea"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l26-04",
    "category": "phrases",
    "level": 26,
    "title_en": "Does anyone have a different perspective?",
    "title_ja": "別の視点をお持ちの方はいますか？",
    "content": {
      "phrase": "Does anyone have a different perspective?",
      "japanese": "別の視点をお持ちの方はいますか？",
      "situation": "議論で多様な意見を募るとき",
      "naturalUsage": "反対意見も歓迎していることを示す、開かれた問いかけです。",
      "exampleDialogue": "A: We've heard two similar suggestions. Does anyone have a different perspective? B: I do.",
      "commonMistake": "another perspective は追加の一つ、different perspective は異なる視点を強調します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "discussion",
      "facilitation",
      "perspective"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l27-01",
    "category": "phrases",
    "level": 27,
    "title_en": "What would a fair compromise look like?",
    "title_ja": "公平な妥協案とはどのようなものでしょうか？",
    "content": {
      "phrase": "What would a fair compromise look like?",
      "japanese": "公平な妥協案とはどのようなものでしょうか？",
      "situation": "双方が受け入れられる解決策を探すとき",
      "naturalUsage": "特定案を押しつけず、共同で着地点を考える質問です。",
      "exampleDialogue": "A: Neither side likes the current proposal. B: What would a fair compromise look like?",
      "commonMistake": "compromise は常に悪い妥協ではなく、双方が譲る合意も表します。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "negotiation",
      "compromise",
      "question"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l27-02",
    "category": "phrases",
    "level": 27,
    "title_en": "I can be flexible on the timing.",
    "title_ja": "時期については柔軟に対応できます。",
    "content": {
      "phrase": "I can be flexible on the timing.",
      "japanese": "時期については柔軟に対応できます。",
      "situation": "交渉で譲れる条件を示すとき",
      "naturalUsage": "on のあとに、柔軟に変更できる具体的な点を置きます。",
      "exampleDialogue": "A: The budget is fixed, but the date isn't. B: I can be flexible on the timing.",
      "commonMistake": "flexible for the timing より、条件については flexible on が自然です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "negotiation",
      "flexibility",
      "scheduling"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l27-03",
    "category": "phrases",
    "level": 27,
    "title_en": "That works for me, provided we keep the scope small.",
    "title_ja": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
    "content": {
      "phrase": "That works for me, provided we keep the scope small.",
      "japanese": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
      "situation": "条件付きで提案に同意するとき",
      "naturalUsage": "provided ... で、合意に必要な条件を明確に示します。",
      "exampleDialogue": "A: Can we test the idea this month? B: That works for me, provided we keep the scope small.",
      "commonMistake": "provided はここでは「提供された」ではなく、if と同じ条件の意味です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "negotiation",
      "condition",
      "agreement"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l27-04",
    "category": "phrases",
    "level": 27,
    "title_en": "I think we're closer to an agreement.",
    "title_ja": "合意に近づいていると思います。",
    "content": {
      "phrase": "I think we're closer to an agreement.",
      "japanese": "合意に近づいていると思います。",
      "situation": "交渉が前進したことを確認するとき",
      "naturalUsage": "まだ合意済みとは言わず、進展を前向きに評価します。",
      "exampleDialogue": "A: We both support the revised schedule. B: I think we're closer to an agreement.",
      "commonMistake": "close to agree ではなく、close to an agreement と名詞を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "negotiation",
      "progress",
      "agreement"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l28-01",
    "category": "phrases",
    "level": 28,
    "title_en": "I'm still getting the hang of it.",
    "title_ja": "まだコツをつかんでいる途中です。",
    "content": {
      "phrase": "I'm still getting the hang of it.",
      "japanese": "まだコツをつかんでいる途中です。",
      "situation": "新しい技能にまだ慣れていないとき",
      "naturalUsage": "できないと否定せず、上達中であることを前向きに伝えます。",
      "exampleDialogue": "A: How are you finding the new software? B: I'm still getting the hang of it.",
      "commonMistake": "get the hang of it は「ぶら下がる」ではなく「コツをつかむ」という慣用表現です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "idiom",
      "learning",
      "progress"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l28-02",
    "category": "phrases",
    "level": 28,
    "title_en": "Let's call it a day.",
    "title_ja": "今日はここまでにしましょう。",
    "content": {
      "phrase": "Let's call it a day.",
      "japanese": "今日はここまでにしましょう。",
      "situation": "その日の作業を終えるとき",
      "naturalUsage": "十分作業したあと、区切りを提案する定番の慣用表現です。",
      "exampleDialogue": "A: We've finished all the urgent tasks. B: Great. Let's call it a day.",
      "commonMistake": "実際に何かを day と呼ぶ意味ではありません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "idiom",
      "work",
      "ending"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l28-03",
    "category": "phrases",
    "level": 28,
    "title_en": "That idea is worth keeping in mind.",
    "title_ja": "その考えは覚えておく価値があります。",
    "content": {
      "phrase": "That idea is worth keeping in mind.",
      "japanese": "その考えは覚えておく価値があります。",
      "situation": "今すぐ採用しなくても後で役立つ意見を評価するとき",
      "naturalUsage": "keep in mind は忘れず考慮しておくという意味です。",
      "exampleDialogue": "A: We could invite former students next year. B: That idea is worth keeping in mind.",
      "commonMistake": "remember in mind のように同じ意味を重ねず、keep in mind とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "idiom",
      "idea",
      "consideration"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l28-04",
    "category": "phrases",
    "level": 28,
    "title_en": "We're on the same page now.",
    "title_ja": "これで認識が一致しました。",
    "content": {
      "phrase": "We're on the same page now.",
      "japanese": "これで認識が一致しました。",
      "situation": "お互いの理解や方針が一致したとき",
      "naturalUsage": "話し合いのあとに共通理解を確認する慣用表現です。",
      "exampleDialogue": "A: So the first draft is due Tuesday. B: Right, we're on the same page now.",
      "commonMistake": "実際に同じページを開いている意味だけではなく、認識の一致にも使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "idiom",
      "agreement",
      "teamwork"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l29-01",
    "category": "phrases",
    "level": 29,
    "title_en": "Just to keep you in the loop, the deadline has changed.",
    "title_ja": "情報共有ですが、締切が変更になりました。",
    "content": {
      "phrase": "Just to keep you in the loop, the deadline has changed.",
      "japanese": "情報共有ですが、締切が変更になりました。",
      "situation": "関係者へ最新情報を簡潔に伝えるとき",
      "naturalUsage": "keep someone in the loop は、進展を継続的に共有するという意味です。",
      "exampleDialogue": "A: Just to keep you in the loop, the deadline has changed. B: Thanks for letting me know.",
      "commonMistake": "in a loop ではなく、定型表現は in the loop です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "professional",
      "update",
      "idiom"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l29-02",
    "category": "phrases",
    "level": 29,
    "title_en": "Could you clarify what you need from me?",
    "title_ja": "私に何をしてほしいのか明確にしていただけますか？",
    "content": {
      "phrase": "Could you clarify what you need from me?",
      "japanese": "私に何をしてほしいのか明確にしていただけますか？",
      "situation": "自分の役割や依頼内容が曖昧なとき",
      "naturalUsage": "相手を責めずに、必要な行動を具体化してもらう質問です。",
      "exampleDialogue": "A: We need your support on the launch. B: Could you clarify what you need from me?",
      "commonMistake": "clarify me とは言わず、clarify what ... または clarify something for me とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "professional",
      "clarification",
      "responsibility"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l29-03",
    "category": "phrases",
    "level": 29,
    "title_en": "I'll make sure this is handled today.",
    "title_ja": "今日中に確実に対応します。",
    "content": {
      "phrase": "I'll make sure this is handled today.",
      "japanese": "今日中に確実に対応します。",
      "situation": "問題への対応を引き受けるとき",
      "naturalUsage": "自分が直接処理する場合にも、担当者へ確実につなぐ場合にも使えます。",
      "exampleDialogue": "A: The customer is still waiting for a reply. B: I'll make sure this is handled today.",
      "commonMistake": "handle は他動詞なので handle with this ではなく handle this とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "professional",
      "ownership",
      "deadline"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l29-04",
    "category": "phrases",
    "level": 29,
    "title_en": "I appreciate you bringing this to my attention.",
    "title_ja": "この件を知らせてくださりありがとうございます。",
    "content": {
      "phrase": "I appreciate you bringing this to my attention.",
      "japanese": "この件を知らせてくださりありがとうございます。",
      "situation": "問題や見落としを知らせてもらったとき",
      "naturalUsage": "指摘に防御的にならず、共有への感謝を丁寧に示します。",
      "exampleDialogue": "A: One figure in the report may be outdated. B: I appreciate you bringing this to my attention.",
      "commonMistake": "appreciate の直後は to bring ではなく、you bringing の形にします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "professional",
      "thanks",
      "feedback"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l30-01",
    "category": "phrases",
    "level": 30,
    "title_en": "Looking back, I would have approached it differently.",
    "title_ja": "振り返ると、今なら別のやり方で取り組むと思います。",
    "content": {
      "phrase": "Looking back, I would have approached it differently.",
      "japanese": "振り返ると、今なら別のやり方で取り組むと思います。",
      "situation": "過去の判断から学んだことを話すとき",
      "naturalUsage": "looking back で現在からの振り返りを示し、仮定法で別の可能性を述べます。",
      "exampleDialogue": "A: Would you run the project the same way again? B: Looking back, I would have approached it differently.",
      "commonMistake": "過去の反実仮想には would approach ではなく would have approached を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "reflection",
      "hypothetical",
      "learning"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l30-02",
    "category": "phrases",
    "level": 30,
    "title_en": "The experience changed how I think about success.",
    "title_ja": "その経験で、成功に対する考え方が変わりました。",
    "content": {
      "phrase": "The experience changed how I think about success.",
      "japanese": "その経験で、成功に対する考え方が変わりました。",
      "situation": "経験による価値観の変化を説明するとき",
      "naturalUsage": "how I think about ... で、あるテーマへの考え方を自然に表します。",
      "exampleDialogue": "A: What did you learn from the competition? B: The experience changed how I think about success.",
      "commonMistake": "changed my thinking way ではなく、changed how I think と言います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "reflection",
      "values",
      "experience"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l30-03",
    "category": "phrases",
    "level": 30,
    "title_en": "There isn't always a clear-cut answer.",
    "title_ja": "いつも明確な答えがあるとは限りません。",
    "content": {
      "phrase": "There isn't always a clear-cut answer.",
      "japanese": "いつも明確な答えがあるとは限りません。",
      "situation": "複雑で単純に判断できない問題を話すとき",
      "naturalUsage": "clear-cut は境界や答えがはっきりしているという意味の形容詞です。",
      "exampleDialogue": "A: Which choice is morally right? B: There isn't always a clear-cut answer.",
      "commonMistake": "not always は「いつもではない」であり、「決してない」という意味ではありません。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "abstract",
      "nuance",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l30-04",
    "category": "phrases",
    "level": 30,
    "title_en": "What matters most is how we respond.",
    "title_ja": "最も大切なのは、私たちがどう対応するかです。",
    "content": {
      "phrase": "What matters most is how we respond.",
      "japanese": "最も大切なのは、私たちがどう対応するかです。",
      "situation": "困難への姿勢を重視すると伝えるとき",
      "naturalUsage": "What matters most is ... で重要な点を強調できます。",
      "exampleDialogue": "A: We can't undo the mistake. B: True. What matters most is how we respond.",
      "commonMistake": "What is most important is ... も正しいですが、matters most はより会話的です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "reflection",
      "values",
      "response"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l31-01",
    "category": "phrases",
    "level": 31,
    "title_en": "I can see both sides of the argument.",
    "title_ja": "その議論については、双方の立場が分かります。",
    "content": {
      "phrase": "I can see both sides of the argument.",
      "japanese": "その議論については、双方の立場が分かります。",
      "situation": "対立する二つの意見にそれぞれ理由があるとき",
      "naturalUsage": "中立的な視点を示し、単純な賛否を避ける表現です。",
      "exampleDialogue": "A: Should homework be optional? B: I can see both sides of the argument.",
      "commonMistake": "both side ではなく、複数形の both sides とします。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "nuance",
      "debate",
      "perspective"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l31-02",
    "category": "phrases",
    "level": 31,
    "title_en": "That's true to an extent.",
    "title_ja": "それはある程度そのとおりです。",
    "content": {
      "phrase": "That's true to an extent.",
      "japanese": "それはある程度そのとおりです。",
      "situation": "相手の主張を部分的に認めるとき",
      "naturalUsage": "同意の範囲に限りがあることを簡潔に示します。",
      "exampleDialogue": "A: Technology always makes life easier. B: That's true to an extent.",
      "commonMistake": "to some extent も自然です。to an extent はやや簡潔な形です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "nuance",
      "partial-agreement",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l31-03",
    "category": "phrases",
    "level": 31,
    "title_en": "The issue is more subtle than it first appears.",
    "title_ja": "その問題は一見したよりも微妙で複雑です。",
    "content": {
      "phrase": "The issue is more subtle than it first appears.",
      "japanese": "その問題は一見したよりも微妙で複雑です。",
      "situation": "表面的な理解では不十分だと指摘するとき",
      "naturalUsage": "first appears で第一印象と詳しく見た結果の違いを表します。",
      "exampleDialogue": "A: It seems like a simple pricing problem. B: The issue is more subtle than it first appears.",
      "commonMistake": "subtle は単に difficult ではなく、見分けにくい細かな違いや複雑さを含みます。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "nuance",
      "analysis",
      "complexity"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l31-04",
    "category": "phrases",
    "level": 31,
    "title_en": "I wouldn't go so far as to say that.",
    "title_ja": "そこまで言い切るつもりはありません。",
    "content": {
      "phrase": "I wouldn't go so far as to say that.",
      "japanese": "そこまで言い切るつもりはありません。",
      "situation": "相手の結論が強すぎるとやわらかく反論するとき",
      "naturalUsage": "一部は認めつつ、その強い言い方までは支持しないことを示します。",
      "exampleDialogue": "A: So the entire plan was a failure? B: I wouldn't go so far as to say that.",
      "commonMistake": "far は物理的距離ではなく、意見をどこまで強く述べるかの比喩です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "nuance",
      "disagreement",
      "diplomacy"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phrase-l32-01",
    "category": "phrases",
    "level": 32,
    "title_en": "To put it another way, we're treating the symptom, not the cause.",
    "title_ja": "言い換えると、原因ではなく症状に対処しているだけです。",
    "content": {
      "phrase": "To put it another way, we're treating the symptom, not the cause.",
      "japanese": "言い換えると、原因ではなく症状に対処しているだけです。",
      "situation": "複雑な考えを言い換えて核心を示すとき",
      "naturalUsage": "To put it another way で、前の説明を別の角度から明確にします。",
      "exampleDialogue": "A: Why isn't the quick fix enough? B: To put it another way, we're treating the symptom, not the cause.",
      "commonMistake": "put it in another way も通じますが、定型表現は put it another way です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "advanced",
      "rephrasing",
      "analysis"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phrase-l32-02",
    "category": "phrases",
    "level": 32,
    "title_en": "I don't have a firm view on that yet.",
    "title_ja": "それについては、まだはっきりした意見がありません。",
    "content": {
      "phrase": "I don't have a firm view on that yet.",
      "japanese": "それについては、まだはっきりした意見がありません。",
      "situation": "情報不足で立場を決めていないとき",
      "naturalUsage": "無知ではなく、判断を保留していることを落ち着いて伝えます。",
      "exampleDialogue": "A: Do you support the proposed change? B: I don't have a firm view on that yet.",
      "commonMistake": "I have no opinion. は関心がないようにも響くため、この表現はより慎重です。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "advanced",
      "uncertainty",
      "opinion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 2
  },
  {
    "id": "phrase-l32-03",
    "category": "phrases",
    "level": 32,
    "title_en": "That raises a broader question about who benefits.",
    "title_ja": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
    "content": {
      "phrase": "That raises a broader question about who benefits.",
      "japanese": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
      "situation": "個別の話題からより大きな論点へ広げるとき",
      "naturalUsage": "raise a question は、検討すべき問いを生じさせるという意味です。",
      "exampleDialogue": "A: The service will collect more user data. B: That raises a broader question about who benefits.",
      "commonMistake": "rise a question ではなく、他動詞 raise a question を使います。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "advanced",
      "critical-thinking",
      "discussion"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 3
  },
  {
    "id": "phrase-l32-04",
    "category": "phrases",
    "level": 32,
    "title_en": "We may need to rethink the assumptions behind our plan.",
    "title_ja": "計画の前提そのものを見直す必要があるかもしれません。",
    "content": {
      "phrase": "We may need to rethink the assumptions behind our plan.",
      "japanese": "計画の前提そのものを見直す必要があるかもしれません。",
      "situation": "計画の土台となる考えに疑問を投げかけるとき",
      "naturalUsage": "失敗を責めるのではなく、前提から再検討する必要性を提案します。",
      "exampleDialogue": "A: None of our predictions matched the results. B: We may need to rethink the assumptions behind our plan.",
      "commonMistake": "rethink about the assumptions ではなく、rethink the assumptions と直接目的語を取ります。",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "💬",
    "tags": [
      "advanced",
      "strategy",
      "reflection"
    ],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 4
  },
  {
    "id": "phonics-l01",
    "category": "phonics",
    "level": 1,
    "title_en": "First alphabet sounds: m, s, t, p",
    "title_ja": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
    "content": {
      "phonicsTarget": "First alphabet sounds: m, s, t, p",
      "sound": "/m/, /s/, /t/, /p/",
      "examples": [
        "moon",
        "sun",
        "top",
        "pen"
      ],
      "japaneseHint": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
      "mouthTip": "Close both lips for /m/. For /s/, keep a narrow air channel. Release /t/ and /p/ without adding a vowel.",
      "practiceWords": [
        "map",
        "sip",
        "tap",
        "pot"
      ],
      "practiceSentence": "Sam taps the map.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": true,
    "position": 1
  },
  {
    "id": "phonics-l02",
    "category": "phonics",
    "level": 2,
    "title_en": "Alphabet sounds: n, b, d, g",
    "title_ja": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
    "content": {
      "phonicsTarget": "Alphabet sounds: n, b, d, g",
      "sound": "/n/, /b/, /d/, /g/",
      "examples": [
        "net",
        "bag",
        "dog",
        "gum"
      ],
      "japaneseHint": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
      "mouthTip": "Touch the ridge behind your upper teeth for /n/ and /d/. Close the lips for /b/ and use the back of the tongue for /g/.",
      "practiceWords": [
        "nod",
        "bed",
        "dig",
        "big"
      ],
      "practiceSentence": "Ben digs by the big bed.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l03",
    "category": "phonics",
    "level": 3,
    "title_en": "Breathy and voiced consonants: f, v, h, w",
    "title_ja": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
    "content": {
      "phonicsTarget": "Breathy and voiced consonants: f, v, h, w",
      "sound": "/f/, /v/, /h/, /w/",
      "examples": [
        "fan",
        "van",
        "hat",
        "wet"
      ],
      "japaneseHint": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
      "mouthTip": "Let air pass between the upper teeth and lower lip for /f/ and /v/. Voice only /v/. Round the lips before /w/.",
      "practiceWords": [
        "fine",
        "vine",
        "hop",
        "win"
      ],
      "practiceSentence": "We have five hats.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l04",
    "category": "phonics",
    "level": 4,
    "title_en": "Remaining common alphabet sounds: c, k, j, z, y, x, q",
    "title_ja": "cはcatでは/k/、jは/dʒ/、yはyesの短い子音です。xは多くの場合/k/と/s/を続けます。",
    "content": {
      "phonicsTarget": "Remaining common alphabet sounds: c, k, j, z, y, x, q",
      "sound": "/k/, /dʒ/, /z/, /j/, /ks/, /kw/",
      "examples": [
        "cat",
        "kite",
        "jam",
        "zip",
        "yes",
        "box",
        "quiz"
      ],
      "japaneseHint": "cはcatでは/k/、jは/dʒ/、yはyesの短い子音です。xは多くの場合/k/と/s/を続けます。",
      "mouthTip": "Use the back of the tongue for /k/. Round the lips while starting /kw/. Keep /ks/ together at the end of a word.",
      "practiceWords": [
        "cup",
        "kid",
        "jet",
        "zoo",
        "yak",
        "fox",
        "quit"
      ],
      "practiceSentence": "The quick fox can jump.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l05",
    "category": "phonics",
    "level": 5,
    "title_en": "Short a in closed syllables",
    "title_ja": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
    "content": {
      "phonicsTarget": "Short a in closed syllables",
      "sound": "/æ/",
      "examples": [
        "cat",
        "map",
        "hand",
        "bag"
      ],
      "japaneseHint": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
      "mouthTip": "Lower the jaw, spread the lips slightly, and keep the tongue low and forward.",
      "practiceWords": [
        "cap",
        "jam",
        "flag",
        "stand"
      ],
      "practiceSentence": "A black cat sat on the mat.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l06",
    "category": "phonics",
    "level": 6,
    "title_en": "Short i in closed syllables",
    "title_ja": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
    "content": {
      "phonicsTarget": "Short i in closed syllables",
      "sound": "/ɪ/",
      "examples": [
        "sit",
        "fish",
        "milk",
        "ring"
      ],
      "japaneseHint": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
      "mouthTip": "Keep the jaw relaxed and the tongue high but loose. End quickly without smiling too widely.",
      "practiceWords": [
        "pin",
        "ship",
        "gift",
        "swim"
      ],
      "practiceSentence": "Six fish swim in the river.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l07",
    "category": "phonics",
    "level": 7,
    "title_en": "Short o in closed syllables",
    "title_ja": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
    "content": {
      "phonicsTarget": "Short o in closed syllables",
      "sound": "/ɒ/ (UK), /ɑ/ (US)",
      "examples": [
        "hot",
        "box",
        "clock",
        "stop"
      ],
      "japaneseHint": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
      "mouthTip": "Drop the jaw and keep the sound short. Use slightly rounder lips for the common UK pronunciation.",
      "practiceWords": [
        "log",
        "shop",
        "rock",
        "pond"
      ],
      "practiceSentence": "Tom drops the box by the clock.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l08",
    "category": "phonics",
    "level": 8,
    "title_en": "Short e in closed syllables",
    "title_ja": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
    "content": {
      "phonicsTarget": "Short e in closed syllables",
      "sound": "/e/ or /ɛ/",
      "examples": [
        "bed",
        "pen",
        "head",
        "step"
      ],
      "japaneseHint": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
      "mouthTip": "Keep the tongue at mid height and the lips relaxed. Do not glide toward /iː/.",
      "practiceWords": [
        "red",
        "desk",
        "left",
        "next"
      ],
      "practiceSentence": "Meg left her red pen on the desk.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l09",
    "category": "phonics",
    "level": 9,
    "title_en": "Short u in closed syllables",
    "title_ja": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
    "content": {
      "phonicsTarget": "Short u in closed syllables",
      "sound": "/ʌ/",
      "examples": [
        "sun",
        "cup",
        "bus",
        "lunch"
      ],
      "japaneseHint": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
      "mouthTip": "Relax the lips and jaw. Keep the tongue central and avoid rounding as for /uː/.",
      "practiceWords": [
        "run",
        "jump",
        "duck",
        "brush"
      ],
      "practiceSentence": "The duck runs under the bus.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l10",
    "category": "phonics",
    "level": 10,
    "title_en": "CVC blending and clear final consonants",
    "title_ja": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
    "content": {
      "phonicsTarget": "CVC blending and clear final consonants",
      "sound": "consonant + short vowel + consonant",
      "examples": [
        "map",
        "sit",
        "bed",
        "hot",
        "cup"
      ],
      "japaneseHint": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
      "mouthTip": "Stretch the first two sounds just enough to connect them, then stop cleanly on the final consonant.",
      "practiceWords": [
        "tap",
        "win",
        "red",
        "hop",
        "sun"
      ],
      "practiceSentence": "Kim can hop and run.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l11",
    "category": "phonics",
    "level": 11,
    "title_en": "L-blends at the beginning",
    "title_ja": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
    "content": {
      "phonicsTarget": "L-blends at the beginning",
      "sound": "/bl/, /cl/, /fl/, /gl/, /pl/, /sl/",
      "examples": [
        "blue",
        "clap",
        "flag",
        "glad",
        "plant",
        "sleep"
      ],
      "japaneseHint": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
      "mouthTip": "Make the first consonant briefly, then move the tongue tip directly to /l/ without releasing a vowel.",
      "practiceWords": [
        "black",
        "clock",
        "flower",
        "glass",
        "plane",
        "slow"
      ],
      "practiceSentence": "The blue flag flies above the plane.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l12",
    "category": "phonics",
    "level": 12,
    "title_en": "R-blends at the beginning",
    "title_ja": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
    "content": {
      "phonicsTarget": "R-blends at the beginning",
      "sound": "/br/, /cr/, /dr/, /fr/, /gr/, /pr/, /tr/",
      "examples": [
        "brown",
        "crab",
        "dress",
        "frog",
        "green",
        "press",
        "tree"
      ],
      "japaneseHint": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
      "mouthTip": "Keep the tongue tip away from the roof of the mouth for /r/ and move into the following vowel smoothly.",
      "practiceWords": [
        "bread",
        "cry",
        "drink",
        "fresh",
        "grass",
        "prize",
        "train"
      ],
      "practiceSentence": "A green frog rests by the tree.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l13",
    "category": "phonics",
    "level": 13,
    "title_en": "S-blends and three-consonant starts",
    "title_ja": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
    "content": {
      "phonicsTarget": "S-blends and three-consonant starts",
      "sound": "/sp/, /st/, /sk/, /sm/, /sn/, /sw/, /str/",
      "examples": [
        "spin",
        "stop",
        "skin",
        "smile",
        "snow",
        "swim",
        "street"
      ],
      "japaneseHint": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
      "mouthTip": "Hold a thin /s/ airflow, shape the next consonant immediately, and release into the vowel only once.",
      "practiceWords": [
        "space",
        "star",
        "school",
        "small",
        "snake",
        "sweet",
        "strong"
      ],
      "practiceSentence": "The strong swimmer starts slowly.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l14",
    "category": "phonics",
    "level": 14,
    "title_en": "Digraphs sh and ch",
    "title_ja": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
    "content": {
      "phonicsTarget": "Digraphs sh and ch",
      "sound": "/ʃ/ and /tʃ/",
      "examples": [
        "ship",
        "fish",
        "chair",
        "lunch"
      ],
      "japaneseHint": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
      "mouthTip": "Round the lips slightly for both. For /tʃ/, briefly block the air before releasing it; for /ʃ/, let air flow continuously.",
      "practiceWords": [
        "shop",
        "brush",
        "chat",
        "beach"
      ],
      "practiceSentence": "She chose fresh fish for lunch.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l15",
    "category": "phonics",
    "level": 15,
    "title_en": "Voiceless and voiced th",
    "title_ja": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
    "content": {
      "phonicsTarget": "Voiceless and voiced th",
      "sound": "/θ/ and /ð/",
      "examples": [
        "think",
        "bath",
        "this",
        "mother"
      ],
      "japaneseHint": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
      "mouthTip": "Place the tongue tip gently between the teeth. Blow air for /θ/ and add voice for /ð/ without pulling the tongue back.",
      "practiceWords": [
        "three",
        "mouth",
        "that",
        "weather"
      ],
      "practiceSentence": "Those three paths are narrow.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l16",
    "category": "phonics",
    "level": 16,
    "title_en": "Digraphs wh, ph, and ng",
    "title_ja": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
    "content": {
      "phonicsTarget": "Digraphs wh, ph, and ng",
      "sound": "/w/, /f/, /ŋ/",
      "examples": [
        "when",
        "phone",
        "sing"
      ],
      "japaneseHint": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
      "mouthTip": "Round the lips for /w/. Touch upper teeth to lower lip for /f/. For /ŋ/, lift the back of the tongue and keep the tip down.",
      "practiceWords": [
        "whale",
        "photo",
        "graph",
        "long",
        "singer"
      ],
      "practiceSentence": "When will Phil sing that long song?",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l17",
    "category": "phonics",
    "level": 17,
    "title_en": "Silent e makes long a",
    "title_ja": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。",
    "content": {
      "phonicsTarget": "Silent e makes long a",
      "sound": "/eɪ/ in a_e",
      "examples": [
        "cake",
        "name",
        "late",
        "game"
      ],
      "japaneseHint": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。",
      "mouthTip": "Begin with a mid-front vowel and glide upward. Keep the final consonant clear; do not pronounce the final e.",
      "practiceWords": [
        "lake",
        "same",
        "gate",
        "plane"
      ],
      "practiceSentence": "Jake made a cake by the lake.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l18",
    "category": "phonics",
    "level": 18,
    "title_en": "Silent e makes long i",
    "title_ja": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。",
    "content": {
      "phonicsTarget": "Silent e makes long i",
      "sound": "/aɪ/ in i_e",
      "examples": [
        "bike",
        "time",
        "five",
        "smile"
      ],
      "japaneseHint": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。",
      "mouthTip": "Start with an open vowel and glide toward /ɪ/. Stop on the final consonant without sounding the e.",
      "practiceWords": [
        "kite",
        "line",
        "drive",
        "white"
      ],
      "practiceSentence": "Mike rides his bike at five.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l19",
    "category": "phonics",
    "level": 19,
    "title_en": "Silent e makes long o",
    "title_ja": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。",
    "content": {
      "phonicsTarget": "Silent e makes long o",
      "sound": "/oʊ/ in o_e",
      "examples": [
        "home",
        "note",
        "rose",
        "stone"
      ],
      "japaneseHint": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。",
      "mouthTip": "Begin with relaxed lips, then round them as the vowel glides. Keep the last consonant distinct.",
      "practiceWords": [
        "hope",
        "rope",
        "close",
        "phone"
      ],
      "practiceSentence": "Rose wrote a note at home.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l20",
    "category": "phonics",
    "level": 20,
    "title_en": "Silent e patterns with u and e",
    "title_ja": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。",
    "content": {
      "phonicsTarget": "Silent e patterns with u and e",
      "sound": "/juː/ or /uː/ in u_e; /iː/ in e_e",
      "examples": [
        "cube",
        "June",
        "rule",
        "theme"
      ],
      "japaneseHint": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。",
      "mouthTip": "For /juː/, begin with a light y sound before rounded /uː/. For /iː/, keep the tongue high and smile slightly.",
      "practiceWords": [
        "cute",
        "tune",
        "flute",
        "these"
      ],
      "practiceSentence": "June chose a cute theme for the flute show.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l21",
    "category": "phonics",
    "level": 21,
    "title_en": "Long a vowel teams ai and ay",
    "title_ja": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
    "content": {
      "phonicsTarget": "Long a vowel teams ai and ay",
      "sound": "/eɪ/",
      "examples": [
        "rain",
        "train",
        "day",
        "play"
      ],
      "japaneseHint": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
      "mouthTip": "Start at a clear mid vowel and glide upward. Keep it one syllable rather than separating e and i.",
      "practiceWords": [
        "mail",
        "paint",
        "stay",
        "today"
      ],
      "practiceSentence": "We may take the train on a rainy day.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l22",
    "category": "phonics",
    "level": 22,
    "title_en": "Long e vowel teams ee and ea",
    "title_ja": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
    "content": {
      "phonicsTarget": "Long e vowel teams ee and ea",
      "sound": "/iː/",
      "examples": [
        "green",
        "sleep",
        "read",
        "team"
      ],
      "japaneseHint": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
      "mouthTip": "Keep the tongue high and front with lightly spread lips. Hold the sound without adding a second vowel.",
      "practiceWords": [
        "feet",
        "street",
        "clean",
        "speak"
      ],
      "practiceSentence": "The team reads beneath the green tree.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l23",
    "category": "phonics",
    "level": 23,
    "title_en": "Long o vowel teams oa and ow",
    "title_ja": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
    "content": {
      "phonicsTarget": "Long o vowel teams oa and ow",
      "sound": "/oʊ/",
      "examples": [
        "boat",
        "road",
        "snow",
        "window"
      ],
      "japaneseHint": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
      "mouthTip": "Glide from a neutral rounded vowel to tighter lips. Do not split the vowel team into two syllables.",
      "practiceWords": [
        "coat",
        "toast",
        "grow",
        "yellow"
      ],
      "practiceSentence": "The yellow boat moves slowly down the road.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l24",
    "category": "phonics",
    "level": 24,
    "title_en": "Two common sounds of oo",
    "title_ja": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
    "content": {
      "phonicsTarget": "Two common sounds of oo",
      "sound": "/uː/ and /ʊ/",
      "examples": [
        "moon",
        "food",
        "book",
        "good"
      ],
      "japaneseHint": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
      "mouthTip": "Round the lips for both. Hold /uː/ longer with a tenser tongue; keep /ʊ/ short and relaxed.",
      "practiceWords": [
        "room",
        "spoon",
        "cook",
        "foot"
      ],
      "practiceSentence": "The cook put good food in the cool room.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l25",
    "category": "phonics",
    "level": 25,
    "title_en": "R-controlled vowels ar and or",
    "title_ja": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
    "content": {
      "phonicsTarget": "R-controlled vowels ar and or",
      "sound": "/ɑr/ and /ɔr/ in US English",
      "examples": [
        "car",
        "star",
        "fork",
        "short"
      ],
      "japaneseHint": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
      "mouthTip": "For US /r/, pull the tongue slightly back without touching the roof. Avoid adding a Japanese vowel after r.",
      "practiceWords": [
        "park",
        "farm",
        "storm",
        "morning"
      ],
      "practiceSentence": "A short storm passed over the farm.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l26",
    "category": "phonics",
    "level": 26,
    "title_en": "R-controlled spellings er, ir, and ur",
    "title_ja": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
    "content": {
      "phonicsTarget": "R-controlled spellings er, ir, and ur",
      "sound": "/ɝ/ or /ɜː/",
      "examples": [
        "her",
        "bird",
        "turn",
        "first"
      ],
      "japaneseHint": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
      "mouthTip": "Keep the lips relaxed. In US English, curl or bunch the tongue without touching the roof; in UK English, sustain the central vowel.",
      "practiceWords": [
        "term",
        "shirt",
        "nurse",
        "Thursday"
      ],
      "practiceSentence": "The first bird returned on Thursday.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l27",
    "category": "phonics",
    "level": 27,
    "title_en": "Diphthong oi and oy",
    "title_ja": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
    "content": {
      "phonicsTarget": "Diphthong oi and oy",
      "sound": "/ɔɪ/",
      "examples": [
        "coin",
        "voice",
        "boy",
        "enjoy"
      ],
      "japaneseHint": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
      "mouthTip": "Begin with rounded lips, then relax and raise the tongue toward /ɪ/. Do not make two separate beats.",
      "practiceWords": [
        "point",
        "choice",
        "toy",
        "annoy"
      ],
      "practiceSentence": "The boy enjoyed choosing a shiny coin.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l28",
    "category": "phonics",
    "level": 28,
    "title_en": "Diphthong ou and ow",
    "title_ja": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
    "content": {
      "phonicsTarget": "Diphthong ou and ow",
      "sound": "/aʊ/",
      "examples": [
        "house",
        "cloud",
        "cow",
        "town"
      ],
      "japaneseHint": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
      "mouthTip": "Drop the jaw for the first part, then lift it while rounding the lips. Keep the glide within one syllable.",
      "practiceWords": [
        "sound",
        "round",
        "brown",
        "flower"
      ],
      "practiceSentence": "A brown cow walked around the town.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l29",
    "category": "phonics",
    "level": 29,
    "title_en": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
    "title_ja": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
    "content": {
      "phonicsTarget": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
      "sound": "/k/, /s/, /g/, /dʒ/",
      "examples": [
        "cat",
        "kite",
        "back",
        "city",
        "giant",
        "bridge"
      ],
      "japaneseHint": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
      "mouthTip": "Use the back of the tongue for /k/ and /g/. For /dʒ/, briefly stop the air, then release it with voice.",
      "practiceWords": [
        "coat",
        "skin",
        "clock",
        "cent",
        "gem",
        "badge"
      ],
      "practiceSentence": "The giant placed a badge beside the city clock.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l30",
    "category": "phonics",
    "level": 30,
    "title_en": "Pronouncing plural -s and past -ed endings",
    "title_ja": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
    "content": {
      "phonicsTarget": "Pronouncing plural -s and past -ed endings",
      "sound": "-s: /s/, /z/, /ɪz/; -ed: /t/, /d/, /ɪd/",
      "examples": [
        "cats",
        "dogs",
        "buses",
        "washed",
        "played",
        "wanted"
      ],
      "japaneseHint": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
      "mouthTip": "Keep voicing on for /z/ and /d/ endings. Add a full extra syllable only after sibilants for -es or after /t, d/ for -ed.",
      "practiceWords": [
        "books",
        "pens",
        "classes",
        "looked",
        "cleaned",
        "needed"
      ],
      "practiceSentence": "She washed the cups, cleaned the trays, and packed the boxes.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l31",
    "category": "phonics",
    "level": 31,
    "title_en": "Word stress, schwa, and r-colored weak vowels",
    "title_ja": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
    "content": {
      "phonicsTarget": "Word stress, schwa, and r-colored weak vowels",
      "sound": "/ə/ in unstressed syllables; /ɚ/ in some unstressed US endings",
      "examples": [
        "about",
        "banana",
        "support",
        "teacher"
      ],
      "japaneseHint": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
      "mouthTip": "Relax the jaw and tongue for schwa. Make the stressed syllable longer, clearer, and slightly louder. In US English, keep a light r-color in endings such as “teacher”; UK English commonly uses a non-rhotic weak vowel there.",
      "practiceWords": [
        "ago",
        "today",
        "computer",
        "family"
      ],
      "practiceSentence": "A computer can support a family project.",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  },
  {
    "id": "phonics-l32",
    "category": "phonics",
    "level": 32,
    "title_en": "Sentence rhythm, linking, and reduced function words",
    "title_ja": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
    "content": {
      "phonicsTarget": "Sentence rhythm, linking, and reduced function words",
      "sound": "stressed content words with linked, reduced grammar words",
      "examples": [
        "pick it up",
        "want to go",
        "a cup of tea",
        "meet you at eight"
      ],
      "japaneseHint": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
      "mouthTip": "Tap a steady beat on key words. Let final consonants connect to following vowels, and reduce “to,” “a,” and “of” instead of stressing every word.",
      "practiceWords": [
        "pick it up",
        "turn it on",
        "send it over",
        "meet at eight"
      ],
      "practiceSentence": "Could you send it over when you arrive?",
      "audioUSVoice": "Ava",
      "audioUKVoice": "Libby"
    },
    "icon": "🔤",
    "tags": [],
    "required_plan": "free",
    "active": true,
    "is_preview": false,
    "position": 1
  }
]$curriculum_seed$::jsonb) as value(
    id text,
    category text,
    level smallint,
    title_en text,
    title_ja text,
    content jsonb,
    icon text,
    tags text[],
    required_plan text,
    active boolean,
    is_preview boolean,
    position integer
  )
)
insert into public.review_curriculum_items (
  id, category, level, title_en, title_ja, content, icon, tags,
  required_plan, active, is_preview, position
)
select id, category, level, title_en, title_ja, content, icon, tags,
  required_plan, active, is_preview, position
from seed;

do $seed_postcheck$
declare
  missing_levels integer;
  missing_items integer;
  actual_levels integer;
  actual_items integer;
begin
  select count(*)
  into missing_levels
  from jsonb_to_recordset($curriculum_seed$[
  {
    "category": "words",
    "level": 1
  },
  {
    "category": "words",
    "level": 2
  },
  {
    "category": "words",
    "level": 3
  },
  {
    "category": "words",
    "level": 4
  },
  {
    "category": "words",
    "level": 5
  },
  {
    "category": "words",
    "level": 6
  },
  {
    "category": "words",
    "level": 7
  },
  {
    "category": "words",
    "level": 8
  },
  {
    "category": "words",
    "level": 9
  },
  {
    "category": "words",
    "level": 10
  },
  {
    "category": "words",
    "level": 11
  },
  {
    "category": "words",
    "level": 12
  },
  {
    "category": "words",
    "level": 13
  },
  {
    "category": "words",
    "level": 14
  },
  {
    "category": "words",
    "level": 15
  },
  {
    "category": "words",
    "level": 16
  },
  {
    "category": "words",
    "level": 17
  },
  {
    "category": "words",
    "level": 18
  },
  {
    "category": "words",
    "level": 19
  },
  {
    "category": "words",
    "level": 20
  },
  {
    "category": "words",
    "level": 21
  },
  {
    "category": "words",
    "level": 22
  },
  {
    "category": "words",
    "level": 23
  },
  {
    "category": "words",
    "level": 24
  },
  {
    "category": "words",
    "level": 25
  },
  {
    "category": "words",
    "level": 26
  },
  {
    "category": "words",
    "level": 27
  },
  {
    "category": "words",
    "level": 28
  },
  {
    "category": "words",
    "level": 29
  },
  {
    "category": "words",
    "level": 30
  },
  {
    "category": "words",
    "level": 31
  },
  {
    "category": "words",
    "level": 32
  },
  {
    "category": "phrases",
    "level": 1
  },
  {
    "category": "phrases",
    "level": 2
  },
  {
    "category": "phrases",
    "level": 3
  },
  {
    "category": "phrases",
    "level": 4
  },
  {
    "category": "phrases",
    "level": 5
  },
  {
    "category": "phrases",
    "level": 6
  },
  {
    "category": "phrases",
    "level": 7
  },
  {
    "category": "phrases",
    "level": 8
  },
  {
    "category": "phrases",
    "level": 9
  },
  {
    "category": "phrases",
    "level": 10
  },
  {
    "category": "phrases",
    "level": 11
  },
  {
    "category": "phrases",
    "level": 12
  },
  {
    "category": "phrases",
    "level": 13
  },
  {
    "category": "phrases",
    "level": 14
  },
  {
    "category": "phrases",
    "level": 15
  },
  {
    "category": "phrases",
    "level": 16
  },
  {
    "category": "phrases",
    "level": 17
  },
  {
    "category": "phrases",
    "level": 18
  },
  {
    "category": "phrases",
    "level": 19
  },
  {
    "category": "phrases",
    "level": 20
  },
  {
    "category": "phrases",
    "level": 21
  },
  {
    "category": "phrases",
    "level": 22
  },
  {
    "category": "phrases",
    "level": 23
  },
  {
    "category": "phrases",
    "level": 24
  },
  {
    "category": "phrases",
    "level": 25
  },
  {
    "category": "phrases",
    "level": 26
  },
  {
    "category": "phrases",
    "level": 27
  },
  {
    "category": "phrases",
    "level": 28
  },
  {
    "category": "phrases",
    "level": 29
  },
  {
    "category": "phrases",
    "level": 30
  },
  {
    "category": "phrases",
    "level": 31
  },
  {
    "category": "phrases",
    "level": 32
  },
  {
    "category": "phonics",
    "level": 1
  },
  {
    "category": "phonics",
    "level": 2
  },
  {
    "category": "phonics",
    "level": 3
  },
  {
    "category": "phonics",
    "level": 4
  },
  {
    "category": "phonics",
    "level": 5
  },
  {
    "category": "phonics",
    "level": 6
  },
  {
    "category": "phonics",
    "level": 7
  },
  {
    "category": "phonics",
    "level": 8
  },
  {
    "category": "phonics",
    "level": 9
  },
  {
    "category": "phonics",
    "level": 10
  },
  {
    "category": "phonics",
    "level": 11
  },
  {
    "category": "phonics",
    "level": 12
  },
  {
    "category": "phonics",
    "level": 13
  },
  {
    "category": "phonics",
    "level": 14
  },
  {
    "category": "phonics",
    "level": 15
  },
  {
    "category": "phonics",
    "level": 16
  },
  {
    "category": "phonics",
    "level": 17
  },
  {
    "category": "phonics",
    "level": 18
  },
  {
    "category": "phonics",
    "level": 19
  },
  {
    "category": "phonics",
    "level": 20
  },
  {
    "category": "phonics",
    "level": 21
  },
  {
    "category": "phonics",
    "level": 22
  },
  {
    "category": "phonics",
    "level": 23
  },
  {
    "category": "phonics",
    "level": 24
  },
  {
    "category": "phonics",
    "level": 25
  },
  {
    "category": "phonics",
    "level": 26
  },
  {
    "category": "phonics",
    "level": 27
  },
  {
    "category": "phonics",
    "level": 28
  },
  {
    "category": "phonics",
    "level": 29
  },
  {
    "category": "phonics",
    "level": 30
  },
  {
    "category": "phonics",
    "level": 31
  },
  {
    "category": "phonics",
    "level": 32
  }
]$curriculum_seed$::jsonb)
    as expected(category text, level smallint)
  where not exists (
    select 1
    from public.review_curriculum_levels actual
    where actual.category = expected.category
      and actual.level = expected.level
  );

  select count(*)
  into missing_items
  from jsonb_array_elements_text($curriculum_seed$[
  "word-l01-book",
  "word-l01-pen",
  "word-l01-desk",
  "word-l01-chair",
  "word-l01-bag",
  "word-l01-door",
  "word-l01-window",
  "word-l01-teacher",
  "word-l01-student",
  "word-l01-lesson",
  "word-l02-red",
  "word-l02-blue",
  "word-l02-yellow",
  "word-l02-green",
  "word-l02-black",
  "word-l02-white",
  "word-l02-circle",
  "word-l02-square",
  "word-l02-star",
  "word-l02-line",
  "word-l03-mother",
  "word-l03-father",
  "word-l03-sister",
  "word-l03-brother",
  "word-l03-grandmother",
  "word-l03-grandfather",
  "word-l03-baby",
  "word-l03-friend",
  "word-l03-boy",
  "word-l03-girl",
  "word-l04-head",
  "word-l04-face",
  "word-l04-eye",
  "word-l04-ear",
  "word-l04-nose",
  "word-l04-mouth",
  "word-l04-hand",
  "word-l04-foot",
  "word-l04-arm",
  "word-l04-leg",
  "word-l05-rice",
  "word-l05-bread",
  "word-l05-egg",
  "word-l05-milk",
  "word-l05-water",
  "word-l05-apple",
  "word-l05-banana",
  "word-l05-chicken",
  "word-l05-fish",
  "word-l05-soup",
  "word-l06-house",
  "word-l06-room",
  "word-l06-kitchen",
  "word-l06-bathroom",
  "word-l06-bedroom",
  "word-l06-bed",
  "word-l06-table",
  "word-l06-lamp",
  "word-l06-key",
  "word-l06-clock",
  "word-l07-dog",
  "word-l07-cat",
  "word-l07-bird",
  "word-l07-rabbit",
  "word-l07-horse",
  "word-l07-cow",
  "word-l07-sheep",
  "word-l07-pig",
  "word-l07-lion",
  "word-l07-elephant",
  "word-l08-run",
  "word-l08-walk",
  "word-l08-jump",
  "word-l08-sit",
  "word-l08-stand",
  "word-l08-open",
  "word-l08-close",
  "word-l08-read",
  "word-l08-write",
  "word-l08-listen",
  "word-l09-happy",
  "word-l09-sad",
  "word-l09-tired",
  "word-l09-angry",
  "word-l09-scared",
  "word-l09-excited",
  "word-l09-hungry",
  "word-l09-thirsty",
  "word-l09-sick",
  "word-l09-fine",
  "word-l10-sunny",
  "word-l10-rainy",
  "word-l10-cloudy",
  "word-l10-windy",
  "word-l10-hot",
  "word-l10-cold",
  "word-l10-sky",
  "word-l10-sun",
  "word-l10-moon",
  "word-l10-snow",
  "word-l11-morning",
  "word-l11-afternoon",
  "word-l11-evening",
  "word-l11-night",
  "word-l11-today",
  "word-l11-tomorrow",
  "word-l11-yesterday",
  "word-l11-early",
  "word-l11-late",
  "word-l11-busy",
  "word-l12-school",
  "word-l12-park",
  "word-l12-station",
  "word-l12-store",
  "word-l12-hospital",
  "word-l12-library",
  "word-l12-restaurant",
  "word-l12-bank",
  "word-l12-post-office",
  "word-l12-playground",
  "word-l13-shirt",
  "word-l13-pants",
  "word-l13-dress",
  "word-l13-skirt",
  "word-l13-shoes",
  "word-l13-socks",
  "word-l13-hat",
  "word-l13-coat",
  "word-l13-gloves",
  "word-l13-umbrella",
  "word-l14-car",
  "word-l14-bus",
  "word-l14-train",
  "word-l14-bicycle",
  "word-l14-airplane",
  "word-l14-taxi",
  "word-l14-boat",
  "word-l14-ticket",
  "word-l14-map",
  "word-l14-trip",
  "word-l15-clean",
  "word-l15-wash",
  "word-l15-cook",
  "word-l15-sweep",
  "word-l15-carry",
  "word-l15-fix",
  "word-l15-borrow",
  "word-l15-return",
  "word-l15-choose",
  "word-l15-pack",
  "word-l16-ask",
  "word-l16-answer",
  "word-l16-explain",
  "word-l16-repeat",
  "word-l16-speak",
  "word-l16-whisper",
  "word-l16-shout",
  "word-l16-call",
  "word-l16-message",
  "word-l16-invite",
  "word-l17-homework",
  "word-l17-question",
  "word-l17-notebook",
  "word-l17-dictionary",
  "word-l17-subject",
  "word-l17-grade",
  "word-l17-test",
  "word-l17-practice",
  "word-l17-remember",
  "word-l17-improve",
  "word-l18-office",
  "word-l18-meeting",
  "word-l18-schedule",
  "word-l18-customer",
  "word-l18-manager",
  "word-l18-project",
  "word-l18-report",
  "word-l18-deadline",
  "word-l18-colleague",
  "word-l18-break",
  "word-l19-doctor",
  "word-l19-medicine",
  "word-l19-fever",
  "word-l19-cough",
  "word-l19-headache",
  "word-l19-rest",
  "word-l19-healthy",
  "word-l19-exercise",
  "word-l19-pain",
  "word-l19-appointment",
  "word-l20-price",
  "word-l20-cost",
  "word-l20-cash",
  "word-l20-change",
  "word-l20-receipt",
  "word-l20-discount",
  "word-l20-size",
  "word-l20-cheap",
  "word-l20-expensive",
  "word-l20-order",
  "word-l21-neighbor",
  "word-l21-guest",
  "word-l21-host",
  "word-l21-partner",
  "word-l21-team",
  "word-l21-promise",
  "word-l21-trust",
  "word-l21-support",
  "word-l21-respect",
  "word-l21-advice",
  "word-l22-available",
  "word-l22-convenient",
  "word-l22-possible",
  "word-l22-necessary",
  "word-l22-certain",
  "word-l22-familiar",
  "word-l22-polite",
  "word-l22-honest",
  "word-l22-patient",
  "word-l22-careful",
  "word-l23-arrive",
  "word-l23-leave",
  "word-l23-miss",
  "word-l23-catch",
  "word-l23-cancel",
  "word-l23-delay",
  "word-l23-reserve",
  "word-l23-confirm",
  "word-l23-prepare",
  "word-l23-deliver",
  "word-l24-device",
  "word-l24-screen",
  "word-l24-charger",
  "word-l24-battery",
  "word-l24-password",
  "word-l24-account",
  "word-l24-update",
  "word-l24-download",
  "word-l24-upload",
  "word-l24-connect",
  "word-l25-recycle",
  "word-l25-waste",
  "word-l25-energy",
  "word-l25-pollution",
  "word-l25-climate",
  "word-l25-protect",
  "word-l25-reduce",
  "word-l25-reuse",
  "word-l25-resource",
  "word-l25-sustainable",
  "word-l26-confident",
  "word-l26-nervous",
  "word-l26-proud",
  "word-l26-disappointed",
  "word-l26-grateful",
  "word-l26-curious",
  "word-l26-embarrassed",
  "word-l26-relieved",
  "word-l26-frustrated",
  "word-l26-calm",
  "word-l27-compare",
  "word-l27-contrast",
  "word-l27-describe",
  "word-l27-summarize",
  "word-l27-analyze",
  "word-l27-evidence",
  "word-l27-reason",
  "word-l27-result",
  "word-l27-method",
  "word-l27-opinion",
  "word-l28-proposal",
  "word-l28-budget",
  "word-l28-priority",
  "word-l28-strategy",
  "word-l28-progress",
  "word-l28-feedback",
  "word-l28-negotiate",
  "word-l28-approve",
  "word-l28-revise",
  "word-l28-launch",
  "word-l29-luggage",
  "word-l29-passport",
  "word-l29-customs",
  "word-l29-destination",
  "word-l29-accommodation",
  "word-l29-reservation",
  "word-l29-departure",
  "word-l29-arrival",
  "word-l29-platform",
  "word-l29-transfer",
  "word-l30-manage",
  "word-l30-avoid",
  "word-l30-afford",
  "word-l30-recommend",
  "word-l30-suggest",
  "word-l30-prefer",
  "word-l30-depend",
  "word-l30-notice",
  "word-l30-realize",
  "word-l30-handle",
  "word-l31-efficient",
  "word-l31-flexible",
  "word-l31-reliable",
  "word-l31-appropriate",
  "word-l31-significant",
  "word-l31-specific",
  "word-l31-temporary",
  "word-l31-permanent",
  "word-l31-likely",
  "word-l31-unlikely",
  "word-l32-clarify",
  "word-l32-emphasize",
  "word-l32-persuade",
  "word-l32-acknowledge",
  "word-l32-respond",
  "word-l32-contribute",
  "word-l32-collaborate",
  "word-l32-resolve",
  "word-l32-reflect",
  "word-l32-adapt",
  "phrase-l01-01",
  "phrase-l01-02",
  "phrase-l01-03",
  "phrase-l01-04",
  "phrase-l02-01",
  "phrase-l02-02",
  "phrase-l02-03",
  "phrase-l02-04",
  "phrase-l03-01",
  "phrase-l03-02",
  "phrase-l03-03",
  "phrase-l03-04",
  "phrase-l04-01",
  "phrase-l04-02",
  "phrase-l04-03",
  "phrase-l04-04",
  "phrase-l05-01",
  "phrase-l05-02",
  "phrase-l05-03",
  "phrase-l05-04",
  "phrase-l06-01",
  "phrase-l06-02",
  "phrase-l06-03",
  "phrase-l06-04",
  "phrase-l07-01",
  "phrase-l07-02",
  "phrase-l07-03",
  "phrase-l07-04",
  "phrase-l08-01",
  "phrase-l08-02",
  "phrase-l08-03",
  "phrase-l08-04",
  "phrase-l09-01",
  "phrase-l09-02",
  "phrase-l09-03",
  "phrase-l09-04",
  "phrase-l10-01",
  "phrase-l10-02",
  "phrase-l10-03",
  "phrase-l10-04",
  "phrase-l11-01",
  "phrase-l11-02",
  "phrase-l11-03",
  "phrase-l11-04",
  "phrase-l12-01",
  "phrase-l12-02",
  "phrase-l12-03",
  "phrase-l12-04",
  "phrase-l13-01",
  "phrase-l13-02",
  "phrase-l13-03",
  "phrase-l13-04",
  "phrase-l14-01",
  "phrase-l14-02",
  "phrase-l14-03",
  "phrase-l14-04",
  "phrase-l15-01",
  "phrase-l15-02",
  "phrase-l15-03",
  "phrase-l15-04",
  "phrase-l16-01",
  "phrase-l16-02",
  "phrase-l16-03",
  "phrase-l16-04",
  "phrase-l17-01",
  "phrase-l17-02",
  "phrase-l17-03",
  "phrase-l17-04",
  "phrase-l18-01",
  "phrase-l18-02",
  "phrase-l18-03",
  "phrase-l18-04",
  "phrase-l19-01",
  "phrase-l19-02",
  "phrase-l19-03",
  "phrase-l19-04",
  "phrase-l20-01",
  "phrase-l20-02",
  "phrase-l20-03",
  "phrase-l20-04",
  "phrase-l21-01",
  "phrase-l21-02",
  "phrase-l21-03",
  "phrase-l21-04",
  "phrase-l22-01",
  "phrase-l22-02",
  "phrase-l22-03",
  "phrase-l22-04",
  "phrase-l23-01",
  "phrase-l23-02",
  "phrase-l23-03",
  "phrase-l23-04",
  "phrase-l24-01",
  "phrase-l24-02",
  "phrase-l24-03",
  "phrase-l24-04",
  "phrase-l25-01",
  "phrase-l25-02",
  "phrase-l25-03",
  "phrase-l25-04",
  "phrase-l26-01",
  "phrase-l26-02",
  "phrase-l26-03",
  "phrase-l26-04",
  "phrase-l27-01",
  "phrase-l27-02",
  "phrase-l27-03",
  "phrase-l27-04",
  "phrase-l28-01",
  "phrase-l28-02",
  "phrase-l28-03",
  "phrase-l28-04",
  "phrase-l29-01",
  "phrase-l29-02",
  "phrase-l29-03",
  "phrase-l29-04",
  "phrase-l30-01",
  "phrase-l30-02",
  "phrase-l30-03",
  "phrase-l30-04",
  "phrase-l31-01",
  "phrase-l31-02",
  "phrase-l31-03",
  "phrase-l31-04",
  "phrase-l32-01",
  "phrase-l32-02",
  "phrase-l32-03",
  "phrase-l32-04",
  "phonics-l01",
  "phonics-l02",
  "phonics-l03",
  "phonics-l04",
  "phonics-l05",
  "phonics-l06",
  "phonics-l07",
  "phonics-l08",
  "phonics-l09",
  "phonics-l10",
  "phonics-l11",
  "phonics-l12",
  "phonics-l13",
  "phonics-l14",
  "phonics-l15",
  "phonics-l16",
  "phonics-l17",
  "phonics-l18",
  "phonics-l19",
  "phonics-l20",
  "phonics-l21",
  "phonics-l22",
  "phonics-l23",
  "phonics-l24",
  "phonics-l25",
  "phonics-l26",
  "phonics-l27",
  "phonics-l28",
  "phonics-l29",
  "phonics-l30",
  "phonics-l31",
  "phonics-l32"
]$curriculum_seed$::jsonb) expected(id)
  where not exists (
    select 1
    from public.review_curriculum_items actual
    where actual.id = expected.id
  );

  select count(*) into actual_levels from public.review_curriculum_levels;
  select count(*) into actual_items from public.review_curriculum_items;

  if missing_levels <> 0 or missing_items <> 0
    or actual_levels <> 96 or actual_items <> 480 then
    raise exception 'Structured curriculum seed incomplete: % levels and % items missing; % levels and % items present.',
      missing_levels, missing_items, actual_levels, actual_items;
  end if;
end
$seed_postcheck$;

commit;
