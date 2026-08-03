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

const publicLessons = await readRows("review_public_lessons", "id,is_preview");
const publicQuestions = await readRows(
  "review_public_questions",
  "id,required_plan,locked_display",
);
const questionTeasers = await readRows(
  "review_question_teasers",
  "id,lesson_id,position,section,format,required_plan",
);
const publicPlans = await readRows("review_plan_catalog", "plan_key,active");
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
  ["review_memberships", "id"],
  ["review_access_codes", "id"],
  ["review_access_code_redemptions", "id"],
  ["review_lesson_access_overrides", "id"],
  ["review_learner_plan_overrides", "id"],
  ["review_premium_tasks", "id"],
  ["review_task_submissions", "id"],
  ["review_submission_feedback", "id"],
];

const protectedResults = await Promise.all(
  protectedResources.map(([resource, column]) => readRows(resource, column)),
);

const failures = [];
if (publicLessons.status !== 200 || publicLessons.rows?.length !== 17) {
  failures.push(
    `Expected 17 public lessons; received status ${publicLessons.status} and ${
      Array.isArray(publicLessons.rows) ? publicLessons.rows.length : "no"
    } rows.`,
  );
}
const previewLessonCount = Array.isArray(publicLessons.rows)
  ? publicLessons.rows.filter((lesson) => lesson.is_preview === true).length
  : 0;
if (previewLessonCount !== 2) {
  failures.push(`Expected exactly 2 public preview lessons; received ${previewLessonCount}.`);
}
if (publicQuestions.status !== 200 || publicQuestions.rows?.length !== 62) {
  failures.push(
    `Expected 62 anonymous preview questions; received status ${publicQuestions.status} and ${
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
if (questionTeasers.status !== 200 || questionTeasers.rows?.length !== 0) {
  failures.push(
    `Expected no plan-locked teaser rows before teacher configuration; received status ${questionTeasers.status} and ${
      Array.isArray(questionTeasers.rows) ? questionTeasers.rows.length : "no"
    } rows.`,
  );
}
if (publicPlans.status !== 200 || publicPlans.rows?.length !== 2) {
  failures.push(
    `Expected 2 public plan descriptions; received status ${publicPlans.status} and ${
      Array.isArray(publicPlans.rows) ? publicPlans.rows.length : "no"
    } rows.`,
  );
}
for (const result of protectedResults) {
  if (result.status < 400) {
    failures.push(
      `${result.resource} unexpectedly returned status ${result.status} to an anonymous client.`,
    );
  }
}

if (failures.length) {
  console.error("Live Supabase security verification failed:");
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Live Supabase security verification passed.");
  console.log("  ✓ 17 published public lessons");
  console.log("  ✓ exactly 2 free preview lessons");
  console.log("  ✓ 62 anonymous preview activities; expanded member activities remain protected");
  console.log("  ✓ anonymous full payloads are Free-only; safe teaser view currently has 0 configured rows");
  console.log("  ✓ 2 public Standard/Premium plan descriptions");
  console.log(
    `  ✓ ${protectedResults.length} personal/base resources reject anonymous reads`,
  );
}
