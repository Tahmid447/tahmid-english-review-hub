import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { notionDraftCurriculum } from "../src/data/curriculum.js";
import {
  LEGACY_PREMIUM_TOPIC_SLUGS,
  NEW_PREMIUM_TOPIC_MANIFEST,
  NEW_PREMIUM_TOPIC_SLUGS,
  PREMIUM_TOPIC_MANIFEST,
  validatePremiumTopicManifest,
} from "./premium-topic-manifest.mjs";

const root = new URL("../", import.meta.url);
const [legacyMigration, extensionMigration, learnerUi, learnerClient, teacherUi, styles, generator] = await Promise.all([
  readFile(new URL("supabase/migrations/202608180017_premium_task_topics.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/202608280021_new_lesson_premium_tasks_topics.sql", root), "utf8"),
  readFile(new URL("src/premium-tasks.js", root), "utf8"),
  readFile(new URL("src/supabase.js", root), "utf8"),
  readFile(new URL("src/teacher.js", root), "utf8"),
  readFile(new URL("src/styles.css", root), "utf8"),
  readFile(new URL("scripts/generate-premium-topic-migration.mjs", root), "utf8"),
]);

assert.equal(validatePremiumTopicManifest(), true);
assert.equal(LEGACY_PREMIUM_TOPIC_SLUGS.length, 17);
assert.equal(NEW_PREMIUM_TOPIC_SLUGS.length, 14);
assert.equal(NEW_PREMIUM_TOPIC_MANIFEST.length, 14);
assert.equal(PREMIUM_TOPIC_MANIFEST.length, 31);
assert.equal(PREMIUM_TOPIC_MANIFEST.flatMap((lesson) => lesson.topics).length, 93);

const curriculumBySlug = new Map(notionDraftCurriculum.map((lesson) => [lesson.id, lesson]));
const ignoredThemeWords = new Set([
  "about", "after", "again", "before", "could", "every", "first", "from", "have",
  "into", "lesson", "more", "other", "should", "something", "their", "there", "these",
  "they", "this", "through", "using", "what", "when", "where", "which", "with", "would",
]);
const meaningfulTokens = (value) => new Set(
  String(value || "")
    .toLowerCase()
    .replaceAll("’", "'")
    .match(/[a-z]+/g)
    ?.filter((word) => word.length >= 4 && !ignoredThemeWords.has(word)) || [],
);

for (const lesson of PREMIUM_TOPIC_MANIFEST) {
  assert.equal(lesson.topics.length, 3, `${lesson.slug} must offer three real choices.`);
  assert.equal(new Set(lesson.topics.map((topic) => topic.key)).size, 3);
  assert.equal(new Set(lesson.topics.map((topic) => JSON.stringify(topic.phrases))).size, 3, `${lesson.slug} phrase guidance must change by topic.`);
  assert.equal(new Set(lesson.topics.map((topic) => JSON.stringify(topic.vocabulary))).size, 3, `${lesson.slug} vocabulary must change by topic.`);
  for (const topic of lesson.topics) {
    assert.equal(topic.phrases.length, 3);
    assert.equal(topic.vocabulary.length, 4);
    assert.match(topic.speaking_prompt_en, /60–90 seconds/);
    assert.match(topic.essay_prompt_en, /100–180 words/);
    assert.ok(["Core", "Stretch"].includes(topic.challenge));
  }
  const targetMigration = NEW_PREMIUM_TOPIC_SLUGS.includes(lesson.slug) ? extensionMigration : legacyMigration;
  assert.match(targetMigration, new RegExp(`\\('${lesson.slug}',`));
}

for (const lesson of NEW_PREMIUM_TOPIC_MANIFEST) {
  const curriculum = curriculumBySlug.get(lesson.slug);
  assert.ok(curriculum, `${lesson.slug} must map to canonical curriculum content.`);
  const sourceTokens = meaningfulTokens([
    curriculum.title,
    curriculum.titleJa,
    ...curriculum.themes,
    ...curriculum.phrases.flatMap((phrase) => [phrase.en, phrase.jp, phrase.topic]),
  ].join(" "));
  for (const topic of lesson.topics) {
    const topicTokens = meaningfulTokens([
      topic.title_en,
      topic.description_en,
      ...topic.phrases,
      ...topic.vocabulary,
    ].join(" "));
    assert.ok(
      [...topicTokens].some((word) => sourceTokens.has(word)),
      `${lesson.slug}/${topic.key} must use language derived from its curriculum.`,
    );
  }
}

assert.match(legacyMigration, /add column if not exists topics jsonb not null default '\[\]'::jsonb/);
assert.match(legacyMigration, /add column if not exists selected_topic_key text/);
assert.match(legacyMigration, /get diagnostics updated_count = row_count/);
assert.match(legacyMigration, /updated_count <> 34/);
assert.match(legacyMigration, /review_validate_submission_topic/);
assert.match(legacyMigration, /Choose a topic before submitting this Premium task/);
assert.match(legacyMigration, /old\.status not in \('draft', 'returned'\)/);
assert.match(legacyMigration, /covered_tasks <> 34 or invalid_topics <> 0/);

assert.match(extensionMigration, /Requires migration 020/);
assert.match(extensionMigration, /lesson_count <> 14/);
assert.match(extensionMigration, /active_teacher_count < 1/);
assert.match(extensionMigration, /on conflict \(lesson_id, stable_key\) do update set/);
assert.match(extensionMigration, /topics = excluded\.topics/);
assert.match(extensionMigration, /'speaking'::text as task_type/);
assert.match(extensionMigration, /'essay'::text/);
assert.match(extensionMigration, /-premium-speaking-v1/);
assert.match(extensionMigration, /-premium-essay-v1/);
assert.match(extensionMigration, /seeded_count <> 28/);
assert.match(extensionMigration, /speaking_count <> 14/);
assert.match(extensionMigration, /essay_count <> 14/);
assert.match(extensionMigration, /topic_count <> 84/);
for (const slug of LEGACY_PREMIUM_TOPIC_SLUGS) {
  assert.doesNotMatch(extensionMigration, new RegExp(`\\('${slug}',`));
}
assert.match(generator, /validatePremiumTopicManifest\(\)/);
assert.match(generator, /NEW_PREMIUM_TOPIC_MANIFEST/);
assert.match(generator, /202608280021_new_lesson_premium_tasks_topics\.sql/);
assert.doesNotMatch(generator, /202608180017_premium_task_topics\.sql/);

assert.match(learnerClient, /required_vocabulary,topics,target_seconds/);
assert.match(learnerClient, /status,selected_topic_key,text_response/);
assert.match(learnerClient, /selected_topic_key: String\(topicKey \|\| ""\)\.trim\(\) \|\| null/);
assert.match(learnerUi, /role", "radiogroup"/);
assert.match(learnerUi, /setAttribute\("role", "radio"\)/);
assert.match(learnerUi, /Recommended phrases:/);
assert.match(learnerUi, /Recommended vocabulary:/);
assert.match(learnerUi, /topicKey: selectedTopic\(\)\?\.key/g);
assert.equal((learnerUi.match(/topicKey: selectedTopic\(\)\?\.key/g) || []).length, 2);
assert.match(teacherUi, /Chosen topic:/);
assert.match(teacherUi, /選択トピック/);
assert.match(teacherUi, /selected_topic_key/);
assert.match(styles, /\.premium-topic-choices[\s\S]*grid-template-columns: repeat\(3/);
assert.match(styles, /@media \(max-width: 680px\)[\s\S]*\.premium-topic-choices \{ grid-template-columns: 1fr/);

console.log("Premium topic tests passed: 31 lessons, 93 choices, 14 forward-seeded lesson tasks, topic-specific guidance, persistence and teacher visibility.");
