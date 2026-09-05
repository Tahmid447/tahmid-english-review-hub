import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migrationPath = new URL(
  "../supabase/migrations/202609050024_structured_learning_hub.sql",
  import.meta.url,
);
const apiPath = new URL("../src/curriculum-api.js", import.meta.url);
const studentVisibilityPath = new URL("../src/student-visibility.js", import.meta.url);
const learningUiPath = new URL("../src/learn.js", import.meta.url);
const learningCssPath = new URL("../src/learn.css", import.meta.url);
const learningPagePath = new URL("../learn.html", import.meta.url);
const membershipFunctionPath = new URL(
  "../supabase/functions/membership-access/index.ts",
  import.meta.url,
);
const seedPath = new URL(
  "../supabase/migrations/202609050025_structured_learning_content.sql",
  import.meta.url,
);
const seedGeneratorPath = new URL(
  "./generate-structured-curriculum-seed.mjs",
  import.meta.url,
);
const curriculumPaths = Object.fromEntries(["words", "phrases", "phonics"].map((category) => [
  category,
  new URL(`../curriculum/${category}.json`, import.meta.url),
]));

const [migration, api, studentVisibility, learningUi, learningCss, learningPage, membershipFunction, seed, seedGenerator, ...curriculumSources] = await Promise.all([
  readFile(migrationPath, "utf8"),
  readFile(apiPath, "utf8"),
  readFile(studentVisibilityPath, "utf8"),
  readFile(learningUiPath, "utf8"),
  readFile(learningCssPath, "utf8"),
  readFile(learningPagePath, "utf8"),
  readFile(membershipFunctionPath, "utf8"),
  readFile(seedPath, "utf8"),
  readFile(seedGeneratorPath, "utf8"),
  ...Object.values(curriculumPaths).map((file) => readFile(file, "utf8")),
]);

const curriculum = Object.fromEntries(
  Object.keys(curriculumPaths).map((category, index) => [
    category,
    JSON.parse(curriculumSources[index]),
  ]),
);
const generatedPayloads = [...seed.matchAll(
  /from jsonb_to_recordset\(\$curriculum_seed\$(\[[\s\S]*?\])\$curriculum_seed\$::jsonb\) as value\(/g,
)].map((match) => JSON.parse(match[1]));
assert.equal(generatedPayloads.length, 2, "The seed must contain level and item payloads");
const [generatedLevels, generatedItems] = generatedPayloads;
assert.equal(generatedLevels.length, 96);
assert.equal(generatedItems.length, 480);
assert.equal(new Set(generatedLevels.map(({ category, level }) => `${category}:${level}`)).size, 96);
assert.ok(generatedLevels.every(({ description_en: description }) => (
  description && !/[\u3040-\u30ff\u3400-\u9fff]/u.test(description)
)), "English level descriptions must not contain Japanese copy");
assert.ok(generatedLevels.every(({ description_en: description }) => !/[a-z]+-[a-z]+/i.test(description)),
  "English level descriptions must present readable topics rather than internal slugs");
const generatedItemsById = new Map(generatedItems.map((item) => [item.id, item]));
const seenItemIds = new Set();
const expectedCounts = { words: 320, phrases: 128, phonics: 32 };
const requiredFields = {
  words: ["id", "level", "category", "word", "japanese", "pronunciationHint", "exampleSentence", "exampleJapanese", "commonMistake", "imageType", "icon", "audioUSVoice", "audioUKVoice", "tags"],
  phrases: ["id", "level", "phrase", "japanese", "situation", "naturalUsage", "exampleDialogue", "commonMistake", "audioUSVoice", "audioUKVoice", "tags"],
  phonics: ["id", "level", "phonicsTarget", "sound", "examples", "japaneseHint", "mouthTip", "practiceWords", "practiceSentence", "audioUSVoice", "audioUKVoice"],
};

for (const [category, source] of Object.entries(curriculum)) {
  assert.equal(source.type, category);
  assert.equal(source.levels.length, 32, `${category} must define Levels 1–32`);
  assert.deepEqual(source.levels.map(({ level }) => level), Array.from({ length: 32 }, (_, index) => index + 1));
  const items = source.levels.flatMap(({ level, items: levelItems }) => {
    assert.equal(Array.isArray(levelItems), true, `${category} Level ${level} needs an items array`);
    if (category === "words") assert.equal(levelItems.length, 10, `Words Level ${level} needs 10 words`);
    if (category === "phrases") assert.ok(levelItems.length >= 4, `Phrases Level ${level} needs at least 4 phrases`);
    if (category === "phonics") assert.ok(levelItems.length >= 1, `Phonics Level ${level} needs a lesson`);
    return levelItems;
  });
  assert.equal(items.length, expectedCounts[category]);
  for (const item of items) {
    assert.equal(item.level >= 1 && item.level <= 32, true);
    for (const field of requiredFields[category]) {
      const value = item[field];
      assert.ok(value !== undefined && value !== null && value !== "", `${item.id} is missing ${field}`);
      if (Array.isArray(value)) assert.ok(value.length, `${item.id}.${field} must not be empty`);
    }
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(seenItemIds.has(item.id), false, `Duplicate curriculum id: ${item.id}`);
    seenItemIds.add(item.id);
    assert.equal(item.audioUSVoice, "Ava");
    assert.equal(item.audioUKVoice, "Libby");
    assert.doesNotMatch(JSON.stringify(item), /https?:\/\//i, `${item.id} must not embed an external asset`);
    if (category === "words") assert.equal(item.imageType, "emoji");

    const generated = generatedItemsById.get(item.id);
    assert.ok(generated, `${item.id} is missing from the generated seed payload`);
    const expectedContent = { ...item };
    delete expectedContent.id;
    delete expectedContent.level;
    delete expectedContent.icon;
    delete expectedContent.tags;
    if (category === "words") {
      expectedContent.topic = expectedContent.category;
      delete expectedContent.category;
    }
    assert.deepEqual(generated.content, expectedContent, `${item.id} seed content is stale`);
    assert.deepEqual(generated.tags, item.tags || [], `${item.id} seed tags are stale`);
    assert.equal(generated.title_en, category === "words" ? item.word : category === "phrases" ? item.phrase : item.phonicsTarget);
  }
}
assert.equal(seenItemIds.size, 480);
const seededIds = [...seed.matchAll(/"id": "([a-z0-9-]+)"/g)].map((match) => match[1]);
assert.equal(seededIds.length, 480, "The content migration must contain all 480 source items");
assert.equal(new Set(seededIds).size, 480, "The content migration must not duplicate item IDs");
assert.match(seed, /Migration 025 is one-time only/i);
assert.match(seed, /if exists \(select 1 from public\.review_curriculum_levels\)[\s\S]*or exists \(select 1 from public\.review_curriculum_items\)/i);
assert.doesNotMatch(seed, /on conflict/i, "The one-time seed must never overwrite live Teacher edits");
assert.match(seed, /actual_levels <> 96 or actual_items <> 480/i);
assert.doesNotMatch(seed, /\b(?:delete|truncate|drop)\s+(?:from|table)\b/i);
assert.match(seedGenerator, /Migration 025 is release-frozen/);
assert.match(seedGenerator, /existing !== sql/);
assert.match(seedGenerator, /create migration 026 or later/);
assert.match(
  JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")).scripts["generate:migration"],
  /generate:curriculum/,
  "The normal build pipeline must regenerate the structured curriculum migration",
);

for (const mode of ["flash", "reverse", "audio-choice", "text-choice"]) {
  assert.match(learningUi, new RegExp(`value: "${mode}"`), `Learning UI needs ${mode} review mode`);
}
assert.equal(
  [...learningUi.matchAll(/value: "audio-choice"/g)].length,
  3,
  "Every curriculum category needs audio choice review",
);
assert.equal(
  [...learningUi.matchAll(/value: "text-choice"/g)].length,
  3,
  "Every curriculum category needs a four-choice quiz",
);
assert.match(learningUi, /\["1", "2", "3", "4"\]/, "Choice review needs keyboard access");
assert.match(learningUi, /reviewChoiceCorrect/, "Choice review needs correctness feedback");
assert.match(learningUi, /playAnswerFeedback\(correct\)/, "Choice review needs the existing short answer sound");
assert.match(learningUi, /playCompletionSound\(\)/, "Review completion needs the existing completion cue");
for (const sampleField of ["exampleSentence", "exampleDialogue", "practiceWords", "practiceSentence"]) {
  assert.match(learningUi, new RegExp(`content\\.${sampleField}`), `Card audio must expose ${sampleField} through natural voice controls`);
}
assert.match(learningUi, /function audioSamples\(/, "Cards need selectable primary and practice audio samples");
assert.match(learningUi, /function audioGlyph\(/, "Natural voice playback needs a visible speaking indicator");
assert.match(learningCss, /@keyframes learn-audio-wave/, "Natural voice playback needs waveform animation");
assert.match(learningUi, /PHONICS_CHOICE_FALLBACKS/, "Phonics quizzes need four unambiguous sound choices even with one open level");
assert.match(learningUi, /promptText: content\.phonicsTarget/, "Phonics quizzes must name the exact lesson focus instead of using an ambiguous whole word");
assert.match(learningUi, /Match the sound to this phonics focus/);
assert.match(learningUi, /learn-review-answer"\)\?\.focus\(\)/, "Reveal must restore focus to the answer");
assert.match(learningUi, /state\.reviewCompleted \? "\.learn-review-completion" : "\.learn-review-prompt"/, "Review focus must distinguish a new card from completion");
assert.match(learningUi, /learn-review-answer learn-review-completion[\s\S]*tabindex: "-1"/, "Visible completion content must receive focus");
assert.match(learningCss, /\.learn-choice-grid/);
assert.match(learningCss, /\.learn-choice-button\[data-result="correct"\]/);
assert.match(learningCss, /\.learn-choice-button\[data-result="wrong"\]/);
assert.match(learningCss, /@keyframes learn-answer-success/, "Correct answers need subtle visual feedback");
assert.match(learningPage, /location\.protocol==="file:"/, "Direct Finder opening needs a clear local-preview boundary");
assert.match(learningPage, /npm run preview:demo/);
assert.match(learningPage, /http:\/\/127\.0\.0\.1:4174\/learn/);

const tables = [
  "review_teacher_students",
  "review_student_hub_settings",
  "review_curriculum_levels",
  "review_curriculum_items",
  "review_student_curriculum_access",
  "review_curriculum_progress",
  "review_curriculum_favorites",
  "review_announcements",
  "review_announcement_targets",
  "review_teacher_audit_log",
];
for (const table of tables) {
  assert.match(migration, new RegExp(`create table if not exists public\\.${table}\\b`, "i"));
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
}

const settingKeys = [
  "account_enabled",
  "show_dashboard",
  "show_words",
  "show_phrases",
  "show_phonics",
  "show_review_lessons",
  "show_homework",
  "show_progress",
  "show_pricing",
  "show_contact_teacher",
  "show_trial_cta",
  "show_payment_plan",
  "show_announcements",
  "allowed_level_min",
  "allowed_level_max",
  "allowed_levels",
];
for (const key of settingKeys) {
  assert.match(migration, new RegExp(`\\b${key}\\b`, "i"));
  assert.match(api, new RegExp(`\\b${key}\\b`));
}

for (const key of settingKeys.filter((key) => key.startsWith("show_") || key === "account_enabled")) {
  assert.match(
    migration,
    new RegExp(`${key} boolean not null default true`, "i"),
    `${key} must preserve the current visible-by-default experience`,
  );
  assert.match(api, new RegExp(`${key}: true`));
}
assert.match(migration, /allowed_level_min smallint not null default 1/i);
assert.match(migration, /allowed_level_max smallint not null default 4/i);
assert.match(api, /allowed_level_min: 1/);
assert.match(api, /allowed_level_max: 4/);
assert.match(migration, /allowed_level_min <> 1[\s\S]*allowed_level_max <> 4[\s\S]*cardinality\(settings\.allowed_levels\) <> 0/i,
  "The transactional postcheck must enforce the Level 1–4 starter scope");

const helpers = [
  "review_teacher_can_manage",
  "review_student_hub_feature_enabled",
  "review_student_curriculum_scope_allowed",
  "review_can_read_curriculum_level",
  "review_can_read_curriculum_item",
  "review_can_read_announcement",
  "review_save_curriculum_progress",
  "review_set_curriculum_favorite",
];
for (const helper of helpers) {
  assert.match(migration, new RegExp(`function public\\.${helper}\\b`, "i"));
}
for (const table of tables) {
  assert.match(
    migration,
    new RegExp(`to_regclass\\('public\\.${table}'\\) is not null`, "i"),
    `The one-time migration guard must detect ${table}`,
  );
}
assert.match(migration, /to_regprocedure\('public\.review_teacher_can_manage\(uuid\)'\) is not null/i);
const ownershipBackfill = migration.match(
  /-- There was no ownership concept[\s\S]*?-- Every existing learner starts/i,
)?.[0] || "";
assert.equal(
  (ownershipBackfill.match(/on conflict \(teacher_id, student_id\) do nothing/gi) || []).length,
  3,
  "Every historical ownership backfill must preserve an existing inactive or transferred mapping",
);
assert.doesNotMatch(ownershipBackfill, /on conflict[\s\S]{0,80}do update/i);
assert.match(migration, /auth\.uid\(\) is null[\s\S]*item\.is_preview/i);
assert.match(migration, /public\.review_teacher_can_manage\(student_id\)/i);
const curriculumAccessSelectPolicy = migration.match(
  /create policy review_student_curriculum_access_select[\s\S]*?;\s*(?=\n\s*drop policy)/i,
)?.[0] || "";
assert.match(curriculumAccessSelectPolicy, /review_teacher_can_manage\(student_id\)/i);
assert.doesNotMatch(
  curriculumAccessSelectPolicy,
  /student_id\s*=\s*auth\.uid\(\)/i,
  "Learners must not read raw allow/block rows; curriculum item RLS is the public boundary.",
);
assert.match(migration, /with sole_teacher as[\s\S]*having count\(\*\) = 1/i);
assert.match(migration, /select distinct code\.created_by, redemption\.user_id[\s\S]*review_access_code_redemptions redemption/i);
assert.match(migration, /function public\.review_link_access_code_teacher\b/i);
assert.match(migration, /Teacher accounts cannot redeem learner access codes/i);
assert.match(migration, /function public\.review_reject_teacher_student_identity\b/i);
assert.match(migration, /before insert or update[\s\S]*review_teacher_students[\s\S]*review_reject_teacher_student_identity/i);
const teacherCanManage = migration.match(
  /function public\.review_teacher_can_manage\(check_student uuid\)[\s\S]*?\$\$;/i,
)?.[0] || "";
assert.match(teacherCanManage, /student_teacher\.user_id = check_student[\s\S]*student_teacher\.active/i,
  "Active Teacher identities must be excluded from learner ownership");
assert.match(migration, /code\.created_by = auth\.uid\(\)[\s\S]*for update/i,
  "Access-code reissue must be scoped to its creating teacher.");
assert.match(migration, /create policy review_codes_teacher_select[\s\S]*created_by = auth\.uid\(\)/i);
assert.doesNotMatch(migration, /order by t\.created_at, t\.user_id[\s\S]*limit 1/i,
  "Multi-teacher projects must not guess a learner owner from teacher creation order.");
const teacherIdentityCleanup = migration.match(
  /function public\.review_remove_teacher_student_identity\(\)[\s\S]*?\$\$;\s*(?=\n\s*revoke all on function)/i,
)?.[0] || "";
assert.match(teacherIdentityCleanup, /if new\.active then[\s\S]*where ownership\.student_id = new\.user_id[\s\S]*if \([\s\S]*count\(\*\)[\s\S]*\) = 1 then/i,
  "Teacher promotion must always remove learner identity before any sole-teacher adoption.");
assert.doesNotMatch(teacherIdentityCleanup, /if new\.active and/i,
  "Teacher identity cleanup must not depend on there being only one teacher.");
assert.match(migration, /if active_teacher_count = 1 then[\s\S]*Structured Hub rollout left % learners without an active teacher owner/i,
  "The rollout may require automatic ownership only when one teacher exists.");
assert.match(migration, /Structured Hub rollout created % active teacher-as-learner mappings/i);
assert.match(migration, /function public\.review_assign_student_teacher\b/i);
const featureEnabled = migration.match(
  /function public\.review_student_hub_feature_enabled\([\s\S]*?\$\$;/i,
)?.[0] || "";
assert.match(featureEnabled, /authoritative settings vanish[\s\S]*false/i,
  "A missing authoritative settings row must fail closed");
const curriculumScope = migration.match(
  /function public\.review_student_curriculum_scope_allowed\([\s\S]*?\$\$;/i,
)?.[0] || "";
assert.match(curriculumScope, /where settings\.student_id = auth\.uid\(\)[\s\S]*false/i,
  "A missing level-scope row must fail closed");
assert.equal(
  (migration.match(/references public\.review_curriculum_items\(id\) on update cascade on delete restrict/gi) || []).length,
  3,
  "Access, progress and favourites must preserve history when an item is retired",
);
assert.doesNotMatch(migration, /create policy review_curriculum_(?:levels|items)_delete_teacher/i);
assert.doesNotMatch(migration, /grant insert, update, delete on public\.review_curriculum_(?:levels|items)/i);
assert.doesNotMatch(
  migration,
  /insert into public\.review_curriculum_(?:levels|items)\b/i,
  "The foundation migration must not seed curriculum content.",
);

const exports = [
  "DEFAULT_HUB_SETTINGS",
  "fetchStudentHubContext",
  "fetchCurriculumItems",
  "fetchCurriculumLevels",
  "fetchCurriculumProgress",
  "saveCurriculumProgress",
  "toggleCurriculumFavorite",
  "fetchStudentAnnouncements",
  "fetchTeacherHubSettings",
  "saveTeacherHubSettings",
  "saveTeacherCurriculumAccess",
];
for (const exported of exports) {
  assert.match(api, new RegExp(`export (?:const|async function) ${exported}\\b`));
}
assert.match(api, /reason: "migration-unavailable"/);
assert.match(api, /error: null/);
assert.match(api, /if \(!data\)[\s\S]*account_enabled: false[\s\S]*"hub-settings-missing"/,
  "A successful settings query with no row must close learner access");
assert.match(studentVisibility, /result\?\.reason\s*&&\s*result\.reason !== "migration-unavailable"/,
  "Only the explicit pre-migration compatibility result may retain open rollout defaults");

const policySql = (name) => migration.match(
  new RegExp(`create policy ${name}\\b[\\s\\S]*?;(?=\\s*(?:drop policy|--|$))`, "i"),
)?.[0] || "";
for (const name of [
  "review_attempts_select",
  "review_attempts_insert_self",
  "review_attempts_update_self",
  "review_answers_select",
  "review_answers_insert_self",
  "review_answers_update_self",
  "review_speaking_select",
  "review_speaking_insert_self",
  "review_phrase_select",
  "review_phrase_insert_self",
  "review_phrase_update_self",
]) {
  const policy = policySql(name);
  assert.match(policy, /not public\.is_review_teacher\(\)/i, `${name} must reject Teacher identity self-access`);
  assert.match(policy, /review_student_hub_feature_enabled\('progress'\)/i, `${name} must honour learner progress visibility`);
}
for (const name of ["review_attempts_insert_self", "review_attempts_update_self"]) {
  assert.match(policySql(name), /review_can_read_lesson\(lesson_id\)/i, `${name} must require readable lesson content`);
}
for (const name of ["review_answers_insert_self", "review_answers_update_self"]) {
  const policy = policySql(name);
  assert.match(policy, /review_can_read_question\(question_id\)/i, `${name} must require readable question content`);
  assert.match(policy, /attempt\.id = review_answers\.attempt_id[\s\S]*attempt\.user_id = auth\.uid\(\)/i,
    `${name} must bind the answer to the learner's own attempt`);
}
for (const name of ["review_settings_select", "review_settings_insert_self", "review_settings_update_self"]) {
  const policy = policySql(name);
  assert.match(policy, /review_student_hub_feature_enabled\('account_enabled'\)/i,
    `${name} must honour account pause without coupling preferences to progress visibility`);
}

assert.match(membershipFunction, /\.from\("review_teacher_students"\)/);
assert.match(membershipFunction, /\.eq\("teacher_id", user\.id\)/);
assert.match(membershipFunction, /\.eq\("student_id", learnerId\)/);
assert.match(membershipFunction, /\.eq\("active", true\)/);
assert.ok(
  (membershipFunction.match(/\.eq\("created_by", user\.id\)/g) || []).length >= 5,
  "Service-role access-code reads and mutations must remain scoped to the caller.",
);
assert.ok(
  membershipFunction.indexOf('.from("review_teacher_students")')
    < membershipFunction.indexOf("auth.admin.getUserById(learnerId)"),
  "Learner ownership must be checked before the Auth-admin lookup.",
);
assert.match(membershipFunction, /"Cache-Control": "no-store"/);
assert.match(membershipFunction, /const isUuid =/);
assert.match(membershipFunction, /Teacher accounts cannot redeem learner access codes/);

console.log("Structured Learning Hub schema/API checks passed.");
