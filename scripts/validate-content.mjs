import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  lessonSourceIdentityKey,
  sourceSegmentIsValid,
  validateLessonSourceIdentities,
} from "../src/lesson-source.js";
import { loadVisualManifestSources, visualAssetPanelKey } from "./visual-manifest-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const readText = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const sha256 = (relative) =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, relative)))
    .digest("hex");

const legacy = readJson("src/data/legacy-lessons.json");
const additions = readJson("src/data/legacy-additions.json");
const drafts = readJson("src/data/notion-drafts.json");
const {
  entries: visualEntries,
  storyboardEntries,
} = loadVisualManifestSources(root);
const migration = readText("supabase/migrations/202607300001_review_hub.sql");
const catalogMigration = readText(
  "supabase/migrations/202607300002_review_hub_catalog.sql",
);
const questionMigration = readText(
  "supabase/migrations/202607300003_review_hub_questions.sql",
);
const sourceSegmentMigration = readText(
  "supabase/migrations/202608280019_lesson_source_segments.sql",
);
const releaseLessonMigration = readText(
  "supabase/migrations/202608280020_new_notion_lessons_and_questions.sql",
);
const releasePremiumMigration = readText(
  "supabase/migrations/202608280021_new_lesson_premium_tasks_topics.sql",
);
const releasePublishMigration = readText(
  "supabase/migrations/202608280022_publish_new_notion_lessons.sql",
);
const buildScript = readText("scripts/build.mjs");
const phraseScript = readText("src/phrases.js");
const phrasePage = readText("phrases.html");
const styles = readText("src/styles.css");
const teacherScript = readText("src/teacher.js");
const teacherPage = readText("teacher.html");
const teacherStyles = readText("src/styles.css");

const errors = [];
const checks = [];

function assert(condition, message) {
  if (condition) checks.push(message);
  else errors.push(message);
}

function unique(values) {
  return new Set(values).size === values.length;
}

assert(
  sha256("backups/takiwaki_review_hub_v7_original.zip") ===
    "73886b1c6c81e8bddf075cf622cb7aea06e8ed72d31304f4d748898a4ea39067",
  "The original Takiwaki ZIP backup is byte-for-byte unchanged.",
);
assert(
  sha256("backups/general-entrance-original.html") ===
    "3aefbca69b47a4afdef0bc7d76d807690ead757c564d87c03d6fb3f96bbc3ea6",
  "The supplied general entrance HTML backup is byte-for-byte unchanged.",
);

const expectedLegacyCounts = {
  "june-28": 21,
  "june-29": 15,
  "june-30": 22,
  "july-04": 27,
  "july-05": 24,
  "july-06": 34,
};

const expectedLegacyNotionPages = {
  "june-28": "38cfb48a-4617-808a-9263-fee027cc6af9",
  "june-29": "38dfb48a-4617-800f-8ce5-c0aa04de07f9",
  "june-30": "38efb48a-4617-8037-9b2d-d432187ba326",
  "july-04": "393fb48a-4617-8045-a96c-d91c774320bb",
  "july-05": "394fb48a-4617-80a1-9710-e0e64f757112",
  "july-06": "395fb48a-4617-80e2-9060-f3cdccd556ef",
};

assert(Array.isArray(legacy) && legacy.length === 6, "Six legacy lessons are present.");
assert(
  unique(legacy.map((lesson) => lesson.id)),
  "Legacy lesson slugs are unique.",
);

let originalTotal = 0;
const originalIds = [];
for (const lesson of legacy) {
  const expected = expectedLegacyCounts[lesson.id];
  assert(Boolean(expected), `${lesson.id}: lesson is in the approved legacy inventory.`);
  assert(
    lesson.status === "published" && lesson.audience === "both",
    `${lesson.id}: legacy catalogue visibility is published/both.`,
  );
  assert(
    lesson.sourceType === "legacy_zip",
    `${lesson.id}: source remains traceable to the preserved legacy ZIP.`,
  );
  assert(
    lesson.sourceNotionPageId === expectedLegacyNotionPages[lesson.id],
    `${lesson.id}: verified supplemental Notion page ID is preserved.`,
  );
  assert(
    lesson.sourceNotionUrl ===
      `https://app.notion.com/p/${expectedLegacyNotionPages[lesson.id].replaceAll("-", "")}`,
    `${lesson.id}: verified supplemental Notion URL is exact and HTTPS.`,
  );
  assert(
    lesson.originalQuestionCount === expected,
    `${lesson.id}: declared original count is ${expected}.`,
  );
  assert(
    lesson.questions.length === expected,
    `${lesson.id}: extracted original count is ${expected}.`,
  );

  lesson.questions.forEach((question, index) => {
    originalTotal += 1;
    originalIds.push(question.id);
    const prefix = `${lesson.id} original question ${index + 1}`;
    assert(question.isOriginal === true, `${prefix}: isOriginal is preserved.`);
    assert(
      question.id === `${lesson.id}-original-${question.legacyId}`,
      `${prefix}: stable ID is derived from the preserved legacy ID.`,
    );
    assert(
      /^q\d+[a-z]?$/.test(question.legacyId),
      `${prefix}: legacy source ID is preserved.`,
    );
    assert(Boolean(question.type), `${prefix}: type is present.`);
    assert(Boolean(question.section), `${prefix}: section is present.`);
    assert(Boolean(question.hint), `${prefix}: hint is present.`);
    assert(
      Boolean(question.explanation) || question.type === "matching",
      `${prefix}: explanation is present where the original format supplied one.`,
    );

    if (["mcq", "situation"].includes(question.type)) {
      assert(
        Array.isArray(question.choices) &&
          question.choices.length >= 2 &&
          question.choices.some((choice) => choice.id === question.correct),
        `${prefix}: choices and official answer are valid.`,
      );
    }
    if (question.type === "typing") {
      assert(
        Array.isArray(question.accepted) && question.accepted.length > 0,
        `${prefix}: accepted answer list is present.`,
      );
    }
    if (question.type === "order") {
      assert(
        Array.isArray(question.words) &&
          Array.isArray(question.correctOrder) &&
          question.words.length === question.correctOrder.length,
        `${prefix}: word-order answer has matching token counts.`,
      );
    }
    if (question.type === "matching") {
      assert(
        Array.isArray(question.pairs) && question.pairs.length >= 2,
        `${prefix}: matching pairs are intact.`,
      );
    }
    if (question.type === "grid") {
      assert(Boolean(question.correctCell), `${prefix}: grid answer is present.`);
    }
  });
}

assert(originalTotal === 143, "Exactly 143 original top-level questions are preserved.");
assert(unique(originalIds), "All 143 original question IDs are unique.");
assert(
  unique(legacy.map((lesson) => lesson.sourceNotionPageId)),
  "All six verified legacy Notion source page IDs are unique.",
);

const expectedAdditionFormats = [
  "listenChoice",
  "listenType",
  "speaking",
  "truefalse",
  "order",
  "matching",
  "sorting",
  "dialogue",
  "translation",
  "situation",
];
let additionTotal = 0;
for (const lessonId of Object.keys(expectedLegacyCounts)) {
  const lessonAdditions = additions[lessonId];
  assert(Array.isArray(lessonAdditions), `${lessonId}: additive practice exists.`);
  if (!Array.isArray(lessonAdditions)) continue;
  additionTotal += lessonAdditions.length;
  assert(lessonAdditions.length === 22, `${lessonId}: exactly 22 activities were added.`);
  assert(
    lessonAdditions.every((question) => question.isOriginal === false),
    `${lessonId}: additions are clearly separated from originals.`,
  );
  const formats = new Set(lessonAdditions.map((question) => question.format));
  assert(
    expectedAdditionFormats.every((format) => formats.has(format)),
    `${lessonId}: listening, speaking, and eight mixed formats are covered.`,
  );
}
assert(additionTotal === 132, "Exactly 132 additive activities are present (22 × 6).");

assert(Array.isArray(drafts) && drafts.length >= 11, "The complete Notion-derived lesson set is present.");
const notionIds = drafts.map((lesson) => lesson.sourceNotionPageId);
assert(notionIds.every(Boolean), "Every Notion draft keeps its source page ID.");
assert(
  drafts.every((lesson) => sourceSegmentIsValid(lesson.sourceSegment || "full")),
  "Every Notion draft has a valid source segment.",
);
let notionSourceIdentitiesAreValid = true;
try {
  validateLessonSourceIdentities(drafts);
} catch {
  notionSourceIdentitiesAreValid = false;
}
assert(
  notionSourceIdentitiesAreValid && unique(drafts.map(lessonSourceIdentityKey)),
  "Notion source page IDs may repeat only when their source segments differ.",
);
assert(unique(drafts.map((lesson) => lesson.id)), "Notion draft slugs are unique.");
assert(
  visualEntries.length === (legacy.length + drafts.length) * 5,
  "The combined visual manifests contain five briefs for every lesson.",
);
assert(
  unique(visualEntries.map(visualAssetPanelKey)),
  "Every visual-question asset and panel pair is unique.",
);
assert(
  visualEntries.every((question) =>
    /^\/assets\/questions\/visual\/[a-z0-9-]+\.webp$/.test(question.asset)
    && Boolean(question.imageAlt)
    && Boolean(question.scenePrompt)
  ),
  "Every visual brief has a web-safe asset path, meaningful alt text, and a concrete scene prompt.",
);
assert(
  storyboardEntries.every((question) => [1, 2, 3, 4, 5].includes(Number(question.imagePanel))),
  "Storyboard visual briefs use only the five visible 3×2 panel positions.",
);

let draftQuestionTotal = 0;
const draftQuestionIds = [];
for (const lesson of drafts) {
  draftQuestionTotal += lesson.questions.length;
  draftQuestionIds.push(...lesson.questions.map((question) => question.id));
  assert(lesson.sourceType === "notion", `${lesson.id}: source type is notion.`);
  assert(lesson.status === "draft", `${lesson.id}: starts as a private draft.`);
  assert(
    ["general", "takiwaki", "both"].includes(lesson.audience),
    `${lesson.id}: audience value is valid.`,
  );
  assert(lesson.questions.length >= 31, `${lesson.id}: at least 31 varied activities exist.`);
  assert(
    new Set(lesson.questions.map((question) => question.format)).size >= 9,
    `${lesson.id}: at least nine activity formats are included.`,
  );
  const visualQuestions = lesson.questions.filter((question) => Boolean(question.image));
  const listeningQuestions = lesson.questions.filter((question) =>
    ["listenChoice", "listenType"].includes(question.format)
  );
  const speakingQuestions = lesson.questions.filter((question) => question.format === "speaking");
  assert(visualQuestions.length >= 5, `${lesson.id}: at least five illustration-led activities exist.`);
  assert(listeningQuestions.length >= 5, `${lesson.id}: at least five listening activities exist.`);
  assert(speakingQuestions.length >= 5, `${lesson.id}: at least five speaking activities exist.`);
  assert(
    unique(visualQuestions.map((question) => visualAssetPanelKey({
      asset: question.image,
      imagePanel: question.imagePanel,
    }))),
    `${lesson.id}: each illustration-led activity uses a distinct visual asset/panel pair.`,
  );
  const mistake = lesson.questions.find((question) => question.format === "mistake");
  assert(
    Boolean(mistake?.wrongSentence) &&
      !mistake.accepted?.includes(mistake.wrongSentence),
    `${lesson.id}: Mistake Detective contains an actual sentence change.`,
  );
  const dialogue = lesson.questions.find((question) => question.format === "dialogue");
  assert(
    Array.isArray(dialogue?.choices) &&
      dialogue.choices.length >= 3 &&
      unique(dialogue.choices.map((choice) => choice.en)),
    `${lesson.id}: dialogue choices are present and distinct.`,
  );
}
assert(
  draftQuestionTotal >= drafts.length * 31,
  `At least ${drafts.length * 31} Notion-derived activities are present (31 per lesson minimum).`,
);
assert(unique(draftQuestionIds), "All Notion draft question IDs are unique.");

const allQuestions = [
  ...legacy.flatMap((lesson) => lesson.questions),
  ...Object.values(additions).flat(),
  ...drafts.flatMap((lesson) => lesson.questions),
];
const allQuestionIds = allQuestions.map((question) => question.id);
const allFormats = new Set(allQuestions.map((question) => question.format || question.type));
assert(
  allQuestions.length === originalTotal + additionTotal + draftQuestionTotal,
  `The complete bundle contains all ${originalTotal + additionTotal + draftQuestionTotal} source activities.`,
);
assert(unique(allQuestionIds), "Question IDs are unique across the complete bundle.");
assert(allFormats.size >= 9, `The complete bundle has ${allFormats.size} activity formats.`);

const publicStaticCatalog = legacy.filter(
  (lesson) =>
    lesson.status === "published" && ["general", "both"].includes(lesson.audience),
);
assert(
  publicStaticCatalog.length === 6,
  "Only the six reviewed legacy lessons are in the public static catalogue.",
);
assert(
  drafts.every((lesson) => lesson.status !== "published"),
  "No Notion-derived draft is exposed in the public static catalogue.",
);
assert(
  !/fs\.cpSync\(\s*source,\s*path\.join\(dist,\s*directory\)/.test(buildScript),
  "The public build does not recursively copy the private source tree.",
);
assert(
  /notion-drafts\.json/.test(buildScript) &&
    /Private authoring data was copied into the public build/.test(buildScript),
  "The build explicitly fails if a private Notion draft source reaches dist.",
);

assert(
  /drop constraint if exists review_lessons_source_type_source_notion_page_id_key/i.test(sourceSegmentMigration)
    && /unique\s*\(\s*source_type\s*,\s*source_notion_page_id\s*,\s*source_segment\s*\)/i.test(sourceSegmentMigration),
  "Database deduplication uses source type + Notion page ID + source segment.",
);
assert(
  /status\s*=\s*'published'[\s\S]{0,180}audience\s+in\s*\(\s*'general'\s*,\s*'both'\s*\)/i.test(
    migration,
  ),
  "RLS public visibility requires published general/both content.",
);
assert(
  /create\s+or\s+replace\s+function\s+public\.is_review_teacher[\s\S]*security\s+definer/i.test(
    migration,
  ),
  "Teacher authorisation is checked by the security-definer helper.",
);
assert(
  !/grant\s+delete\s+on\s+public\.review_/i.test(migration),
  "No Review Hub client receives hard-delete grants.",
);
assert(
  /fetchAll\(\s*["']review_answers["'][\s\S]{0,420}first_is_correct[\s\S]{0,220}latest_is_correct[\s\S]{0,220}answer_count/i.test(
    teacherScript,
  ),
  "Teacher analytics loads protected first, latest, and retry answer data.",
);
assert(
  /fetchAll\(\s*["']review_questions["'][\s\S]{0,280}stable_key[\s\S]{0,180}format[\s\S]{0,180}payload/i.test(
    teacherScript,
  ),
  "Teacher analytics loads question metadata for format and prompt breakdowns.",
);
assert(
  /Question-level mistakes/.test(teacherScript) &&
    /Weak activity formats/.test(teacherScript) &&
    /Listening and dictation breakdown/.test(teacherScript) &&
    /Retry result detail/.test(teacherScript) &&
    /Lesson-by-lesson scores/.test(teacherScript),
  "Teacher Studio includes all requested analytics views.",
);
assert(
  /verifyTeacher\(session\)[\s\S]{0,520}await refreshDashboard\(\)/.test(teacherScript),
  "Teacher analytics loads only after the active teacher check.",
);
assert(
  !/service[_-]?role|SUPABASE_SERVICE_ROLE_KEY/i.test(teacherScript) &&
    !/\.from\(\s*["']review_answers["']\s*\)\s*\.delete/i.test(teacherScript),
  "Teacher analytics uses the signed-in RLS client without privileged keys or answer deletion.",
);
assert(
  /Insights &amp; activity/.test(teacherPage),
  "Teacher Studio exposes the analytics area with a clear tab label.",
);
assert(
  /makeAction\(\s*["']Questions["'][\s\S]{0,120}openQuestionManager/.test(
    teacherScript,
  ) &&
    /function\s+openQuestionEditor/.test(teacherScript),
  "Teacher analytics changes preserve the lesson question-management workflow.",
);
assert(
  /\.teacher-analytics-metrics/.test(teacherStyles) &&
    /\.teacher-analytics-section/.test(teacherStyles) &&
    !/(^|[},]\s*)\.analytics-/m.test(teacherStyles),
  "Analytics styling is scoped to Teacher Studio.",
);
assert(
  !/SUPABASE_SERVICE_ROLE_KEY|eyJ[a-zA-Z0-9_-]{20,}|password\s*=/i.test(
    catalogMigration,
  ),
  "The catalogue migration contains no service-role key or password.",
);
assert(
  (catalogMigration.match(/'published',\s*'both',\s*'legacy_zip'/g) || [])
    .length === 6,
  "The catalogue migration publishes exactly the six verified legacy lessons.",
);
assert(
  (
    catalogMigration.match(
      /'draft',\s*'(?:both|takiwaki|general)',\s*'notion'/g,
    ) || []
  ).length === 11,
  "The catalogue migration keeps all 11 Notion lessons as drafts.",
);
assert(
  sha256("supabase/migrations/202607300003_review_hub_questions.sql") ===
    "4e6df65665ef071ebeabaa793903e995dc2a9fb15236eec8edb120775d6b12f3",
  "The already-applied question migration remains byte-for-byte unchanged.",
);
assert(
  /on\s+conflict\s*\(\s*lesson_id\s*,\s*stable_key\s*\)\s+do\s+update/i.test(
    questionMigration,
  ),
  "Question migration is idempotent by lesson and stable question key.",
);
const releaseLessonRows = releaseLessonMigration
  .split("insert into review_release_020_lessons values\n")[1]
  ?.split(";\n\ndo $source$")[0]
  ?.match(/^  \('/gm) || [];
const releaseQuestionRows = releaseLessonMigration
  .split("insert into review_release_020_questions values\n")[1]
  ?.split(";\n\ndo $source$")[0]
  ?.match(/^  \('/gm) || [];
assert(
  releaseLessonRows.length === 14 && releaseQuestionRows.length === 462,
  "Forward migration 020 contains exactly 14 canonical lessons and 462 activities.",
);
assert(
  /on conflict \(source_type, source_notion_page_id, source_segment\) do update/i.test(
    releaseLessonMigration,
  ),
  "Forward migration 020 upserts split lessons by their complete source identity.",
);
assert(
  /seeded_count <> 28/.test(releasePremiumMigration)
    && /'speaking'::text as task_type/.test(releasePremiumMigration)
    && /'essay'::text/.test(releasePremiumMigration),
  "Forward migration 021 provides one speaking and one essay task for every new lesson.",
);
assert(
  /active_question_count <> 462/.test(releasePublishMigration)
    && /premium_task_count <> 28/.test(releasePublishMigration)
    && /set status = 'published',[\s\S]*audience = 'both'/.test(releasePublishMigration),
  "Forward migration 022 publishes only after question and Premium coverage pass.",
);

assert(
  /function\s+learningDetailsFor\s*\(/.test(phraseScript)
    && /createLearningItem\(\s*"Usage scene",\s*"使う場面"/.test(phraseScript)
    && /createLearningItem\(\s*"Grammar",\s*"文法"/.test(phraseScript)
    && /createLearningItem\(\s*"Vocabulary",\s*"語彙"/.test(phraseScript),
  "Every phrase card includes bilingual usage, grammar, and vocabulary guidance.",
);
assert(
  /data-voice":\s*"us"/.test(phraseScript)
    && /data-voice":\s*"gb"/.test(phraseScript)
    && /listenToPhrase\(phrase,\s*"us"/.test(phraseScript)
    && /listenToPhrase\(phrase,\s*"gb"/.test(phraseScript),
  "Phrase cards provide separate US and UK playback controls.",
);
assert(
  /speakText\(spokenText,\s*\{[\s\S]{0,160}voice:\s*voiceCode,[\s\S]{0,80}language/.test(phraseScript),
  "Phrase playback passes the selected card language and accent to the audio engine.",
);
assert(
  /toggleFavorite\(id\)/.test(phraseScript)
    && /recordPractice\(phrase\.id\)/.test(phraseScript)
    && /syncRemoteActivity\(id\)/.test(phraseScript),
  "Phrase favorites and practice history remain connected to local and remote storage.",
);
assert(
  /ACTIVITY_KEY_PREFIX/.test(phraseScript)
    && /ANONYMOUS_ACTIVITY_KEY/.test(phraseScript)
    && /activityKeyFor\(activeActivityUserId\)/.test(phraseScript)
    && /prepareActivityScope\(\)/.test(phraseScript)
    && /setStorageUser\(activeActivityUserId\);[\s\S]{0,100}bindSettings\(\)/.test(phraseScript)
    && /setStorageUser\(nextUserId\);[\s\S]{0,180}renderPhrases\(\)/.test(phraseScript)
    && /onAuthStateChange/.test(phraseScript)
    && /expectedUserId\s*!==\s*activeActivityUserId/.test(phraseScript)
    && /String\(session\.user\.id\)\s*!==\s*activeActivityUserId/.test(phraseScript),
  "Phrase activity is isolated between anonymous use and each authenticated account.",
);
assert(
  /\.filter\(\(phrase\)\s*=>\s*phrase\.status\s*!==\s*"draft"/.test(phraseScript)
    && /\.filter\(\(phrase\)\s*=>\s*phrase\.audience\s*!==\s*"takiwaki"\)/.test(phraseScript)
    && /\.filter\(isSafeLibraryPhrase\)/.test(phraseScript),
  "Phrase catalogue privacy and safe-content filters remain active.",
);
assert(
  /Speaking accent/.test(phrasePage)
    && /aria-label="Accent for speaking practice"/.test(phrasePage)
    && /id="phraseResults"\s+role="status"\s+aria-live="polite"/.test(phrasePage),
  "Phrase page clearly separates speaking accent settings and announces filtered results.",
);
assert(
  /\.phrase-learning-item/.test(styles)
    && /\.phrase-audio-group/.test(styles)
    && /\.phrase-audio-btn\[data-voice="us"\]/.test(styles)
    && /\.phrase-audio-btn\[data-voice="gb"\]/.test(styles),
  "Phrase learning notes and accent controls have scoped responsive styling.",
);

const privateDraftInDist = path.join(root, "dist", "src", "data", "notion-drafts.json");
const privateCurriculumInDist = path.join(root, "dist", "src", "data", "curriculum.js");
if (fs.existsSync(path.join(root, "dist"))) {
  assert(
    !fs.existsSync(privateDraftInDist) && !fs.existsSync(privateCurriculumInDist),
    "Built website contains no private Notion draft or curriculum source file.",
  );
}
assert(
  fs.existsSync(path.join(root, "assets", "og.png")),
  "The social sharing image exists.",
);

if (errors.length) {
  console.error(`\nContent validation failed with ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exitCode = 1;
} else {
  console.log("Review Hub content validation passed.");
  console.log(
    `  ✓ ${originalTotal} migrated legacy questions (stable IDs and structure preserved)`,
  );
  console.log(`  ✓ ${additionTotal} additive activities`);
  console.log(`  ✓ ${draftQuestionTotal} private draft activities`);
  console.log(`  ✓ ${allFormats.size} activity formats across ${allQuestions.length} activities`);
  console.log(`  ✓ ${checks.length} integrity and security assertions`);
}
