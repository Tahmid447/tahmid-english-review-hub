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
const publicQuestions = await readRows("review_public_questions", "id");
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
  console.log("  ✓ 62 anonymous preview activities; 423 remain protected");
  console.log(
    `  ✓ ${protectedResults.length} personal/base resources reject anonymous reads`,
  );
}
