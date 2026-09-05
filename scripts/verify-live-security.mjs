import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../src/config.js";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

async function readRows(resource, column) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${resource}?select=${encodeURIComponent(column)}`,
    { headers },
  );
  const body = await response.text();
  let rows = null;
  try {
    rows = JSON.parse(body);
  } catch {
    rows = null;
  }
  return { resource, status: response.status, rows };
}

const publicLessons = await readRows(
  "review_public_lessons",
  "id,is_preview,audience,status,question_count",
);
const publicQuestions = await readRows(
  "review_public_questions",
  "id,lesson_id,required_plan,locked_display",
);
const questionTeasers = await readRows(
  "review_question_teasers",
  "id,lesson_id,position,section,format,required_plan",
);
const publicPlans = await readRows("review_plan_catalog", "plan_key,active");
const publicCurriculumLevels = await readRows(
  "review_curriculum_levels",
  "category,level,active,is_preview",
);
const publicCurriculumItems = await readRows(
  "review_curriculum_items",
  "id,category,level,required_plan,active,is_preview",
);
const protectedResources = [
  ["review_profiles", "user_id"],
  ["review_teachers", "user_id"],
  ["review_lessons", "id"],
  ["review_questions", "id"],
  ["review_assignments", "id"],
  ["review_attempts", "id"],
  ["review_answers", "id"],
  ["review_speaking_activity", "id"],
  ["review_phrase_activity", "id"],
  ["review_user_settings", "user_id"],
  ["review_memberships", "user_id"],
  ["review_access_codes", "id"],
  ["review_access_code_redemptions", "code_id"],
  ["review_lesson_access_overrides", "lesson_id"],
  ["review_learner_plan_overrides", "user_id"],
  ["review_premium_tasks", "id"],
  ["review_task_submissions", "id"],
  ["review_submission_feedback", "id"],
  ["review_teacher_students", "student_id"],
  ["review_student_hub_settings", "student_id"],
  ["review_student_curriculum_access", "student_id"],
  ["review_curriculum_progress", "student_id"],
  ["review_curriculum_favorites", "student_id"],
  ["review_announcements", "id"],
  ["review_announcement_targets", "announcement_id"],
  ["review_teacher_audit_log", "id"],
];

const protectedResults = await Promise.all(
  protectedResources.map(([resource, column]) => readRows(resource, column)),
);

const failures = [];
if (publicLessons.status !== 200 || publicLessons.rows?.length !== 31) {
  failures.push(
    `Expected 31 public lessons; received status ${publicLessons.status} and ${
      Array.isArray(publicLessons.rows) ? publicLessons.rows.length : "no"
    } rows.`,
  );
}
const publicQuestionCount = Array.isArray(publicLessons.rows)
  ? publicLessons.rows.reduce((sum, lesson) => sum + Number(lesson.question_count || 0), 0)
  : 0;
if (publicQuestionCount !== 1100) {
  failures.push(`Expected 1,100 authored questions in public lesson metadata; received ${publicQuestionCount}.`);
}
if (
  Array.isArray(publicLessons.rows)
  && publicLessons.rows.some((lesson) => lesson.status !== "published" || lesson.audience !== "both")
) {
  failures.push("Every public catalog lesson must be published for both audiences.");
}
const publicLessonIds = Array.isArray(publicLessons.rows)
  ? publicLessons.rows.map((lesson) => lesson.id)
  : [];
if (new Set(publicLessonIds).size !== publicLessonIds.length) {
  failures.push("The public lesson catalog returned duplicate lesson IDs.");
}
const previewLessonCount = Array.isArray(publicLessons.rows)
  ? publicLessons.rows.filter((lesson) => lesson.is_preview === true).length
  : 0;
if (previewLessonCount !== 2) {
  failures.push(`Expected exactly 2 public preview lessons; received ${previewLessonCount}.`);
}
if (publicQuestions.status !== 200 || publicQuestions.rows?.length !== 80) {
  failures.push(
    `Expected 80 anonymous preview questions; received status ${publicQuestions.status} and ${
      Array.isArray(publicQuestions.rows) ? publicQuestions.rows.length : "no"
    } rows.`,
  );
}
if (
  Array.isArray(publicQuestions.rows)
  && publicQuestions.rows.some((question) => question.required_plan !== "free")
) {
  failures.push("The anonymous full-payload question view returned a non-Free question.");
}
const previewLessonIds = new Set(
  Array.isArray(publicLessons.rows)
    ? publicLessons.rows.filter((lesson) => lesson.is_preview === true).map((lesson) => lesson.id)
    : [],
);
if (
  Array.isArray(publicQuestions.rows)
  && publicQuestions.rows.some((question) => !previewLessonIds.has(question.lesson_id))
) {
  failures.push("The anonymous full-payload question view returned a non-preview lesson question.");
}
const allowedTeaserPlans = new Set(["standard", "premium", "premium_plus"]);
if (questionTeasers.status !== 200) {
  failures.push(
    `Expected a readable payload-free question teaser view; received status ${questionTeasers.status}.`,
  );
}
if (
  Array.isArray(questionTeasers.rows)
  && questionTeasers.rows.some((question) => (
    !publicLessonIds.includes(question.lesson_id)
    || !allowedTeaserPlans.has(question.required_plan)
  ))
) {
  failures.push("The question teaser view returned an invalid lesson reference or plan tier.");
}
const expectedPublicPlanKeys = ["free", "premium", "premium_plus", "standard"];
const publicPlanKeys = Array.isArray(publicPlans.rows)
  ? publicPlans.rows.map((plan) => plan.plan_key).sort()
  : [];
if (
  publicPlans.status !== 200
  || publicPlanKeys.length !== expectedPublicPlanKeys.length
  || publicPlanKeys.some((key, index) => key !== expectedPublicPlanKeys[index])
  || publicPlans.rows.some((plan) => plan.active !== true)
) {
  failures.push(
    `Expected public Free, Standard, Premium and Premium+ descriptions; received status ${publicPlans.status} and keys ${
      publicPlanKeys.length ? publicPlanKeys.join(", ") : "none"
    }.`,
  );
}
const curriculumCategories = ["phonics", "phrases", "words"];
const previewLevelCategories = Array.isArray(publicCurriculumLevels.rows)
  ? publicCurriculumLevels.rows.map(({ category }) => category).sort()
  : [];
if (
  publicCurriculumLevels.status !== 200
  || previewLevelCategories.length !== curriculumCategories.length
  || previewLevelCategories.some((category, index) => category !== curriculumCategories[index])
  || publicCurriculumLevels.rows.some((level) => (
    level.level !== 1 || level.active !== true || level.is_preview !== true
  ))
) {
  failures.push(
    `Expected exactly one anonymous Level 1 preview for Words, Phrases and Phonics; received status ${publicCurriculumLevels.status} and ${previewLevelCategories.length} rows.`,
  );
}
const expectedPreviewItems = { words: 3, phrases: 3, phonics: 1 };
const previewItemCounts = Object.fromEntries(Object.keys(expectedPreviewItems).map((category) => [
  category,
  Array.isArray(publicCurriculumItems.rows)
    ? publicCurriculumItems.rows.filter((item) => item.category === category).length
    : 0,
]));
if (
  publicCurriculumItems.status !== 200
  || !Array.isArray(publicCurriculumItems.rows)
  || publicCurriculumItems.rows.length !== 7
  || Object.entries(expectedPreviewItems).some(([category, count]) => previewItemCounts[category] !== count)
  || publicCurriculumItems.rows.some((item) => (
    item.level !== 1
    || item.active !== true
    || item.is_preview !== true
    || item.required_plan !== "free"
  ))
) {
  failures.push(
    `Expected seven Free anonymous structured-learning preview items (3 Words, 3 Phrases, 1 Phonics); received status ${publicCurriculumItems.status} and ${Array.isArray(publicCurriculumItems.rows) ? publicCurriculumItems.rows.length : "no"} rows.`,
  );
}
for (const result of protectedResults) {
  if (result.status !== 401) {
    failures.push(
      `${result.resource} returned status ${result.status}; expected an anonymous 401 denial.`,
    );
  }
}

if (failures.length) {
  console.error("Live Supabase security verification failed:");
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Live Supabase security verification passed.");
  console.log("  ✓ 31 published public lessons with 1,100 authored questions");
  console.log("  ✓ exactly 2 free preview lessons");
  console.log("  ✓ 80 anonymous preview activities; non-preview payloads are absent from the anonymous view");
  console.log(
    `  ✓ anonymous full payloads are Free-only; safe teaser view has ${questionTeasers.rows.length} configured rows`,
  );
  console.log("  ✓ public Free, Standard, Premium and Premium+ plan descriptions");
  console.log("  ✓ only the intended Level 1 structured-learning previews are anonymous");
  console.log(
    `  ✓ ${protectedResults.length} personal/base resources reject anonymous reads`,
  );
}
