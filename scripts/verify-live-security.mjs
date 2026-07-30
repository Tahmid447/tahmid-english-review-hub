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

const publicLessons = await readRows("review_public_lessons", "id");
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
if (publicQuestions.status !== 200 || publicQuestions.rows?.length !== 485) {
  failures.push(
    `Expected 485 public questions; received status ${publicQuestions.status} and ${
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
  console.log("  ✓ 485 published public activities");
  console.log(
    `  ✓ ${protectedResults.length} personal/base resources reject anonymous reads`,
  );
}
