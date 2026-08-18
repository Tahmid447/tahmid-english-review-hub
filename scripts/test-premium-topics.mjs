import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PREMIUM_TOPIC_MANIFEST, validatePremiumTopicManifest } from "./premium-topic-manifest.mjs";

const root = new URL("../", import.meta.url);
const [migration, learnerUi, learnerClient, teacherUi, styles, generator] = await Promise.all([
  readFile(new URL("supabase/migrations/202608180017_premium_task_topics.sql", root), "utf8"),
  readFile(new URL("src/premium-tasks.js", root), "utf8"),
  readFile(new URL("src/supabase.js", root), "utf8"),
  readFile(new URL("src/teacher.js", root), "utf8"),
  readFile(new URL("src/styles.css", root), "utf8"),
  readFile(new URL("scripts/generate-premium-topic-migration.mjs", root), "utf8"),
]);

assert.equal(validatePremiumTopicManifest(), true);
assert.equal(PREMIUM_TOPIC_MANIFEST.length, 17);
assert.equal(PREMIUM_TOPIC_MANIFEST.flatMap((lesson) => lesson.topics).length, 51);

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
  assert.match(migration, new RegExp(`\\('${lesson.slug}',`));
}

assert.match(migration, /add column if not exists topics jsonb not null default '\[\]'::jsonb/);
assert.match(migration, /add column if not exists selected_topic_key text/);
assert.match(migration, /get diagnostics updated_count = row_count/);
assert.match(migration, /updated_count <> 34/);
assert.match(migration, /review_validate_submission_topic/);
assert.match(migration, /Choose a topic before submitting this Premium task/);
assert.match(migration, /old\.status not in \('draft', 'returned'\)/);
assert.match(migration, /covered_tasks <> 34 or invalid_topics <> 0/);
assert.match(generator, /validatePremiumTopicManifest\(\)/);

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

console.log("Premium topic tests passed: 17 lessons, 51 choices, topic-specific guidance, persistence and teacher visibility.");
