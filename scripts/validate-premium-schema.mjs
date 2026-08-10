import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const migrationPath = resolve(
  here,
  "../supabase/migrations/202608020008_premium_plans_and_submissions.sql",
);
const sql = await readFile(migrationPath, "utf8");
const recordingSql = await readFile(
  resolve(here, "../supabase/migrations/202608030011_private_premium_recordings.sql"),
  "utf8",
);
const premiumPlusSql = await readFile(
  resolve(here, "../supabase/migrations/202608110014_premium_plus_and_entitlements.sql"),
  "utf8",
);
const learnerUi = await readFile(resolve(here, "../src/premium-tasks.js"), "utf8");
const supabaseClient = await readFile(resolve(here, "../src/supabase.js"), "utf8");
const teacherUi = await readFile(resolve(here, "../src/teacher.js"), "utf8");

const requiredFragments = [
  "review_plan_catalog",
  "review_learner_plan_overrides",
  "review_premium_tasks",
  "review_task_submissions",
  "review_submission_feedback",
  "review_effective_plan()",
  "review_has_feature(requested_feature text)",
  "review_validate_task_submission()",
  "review_approve_membership_tiered",
  "review_create_access_code_tiered",
  "enable row level security",
  "published_at is not null",
  "visible_to_student",
  "required_plan",
  "audio_object_path",
];

const missing = requiredFragments.filter((fragment) => !sql.includes(fragment));
if (missing.length) {
  throw new Error(`Premium schema is missing: ${missing.join(", ")}`);
}

const forbiddenPatterns = [
  /\bpassword\s+(?:text|varchar|character)/i,
  /\bservice_role\b/i,
  /grant\s+.*\bdelete\b.*review_task_submissions/i,
  /to\s+anon[^;]*review_task_submissions/i,
];
const unsafe = forbiddenPatterns.filter((pattern) => pattern.test(sql));
if (unsafe.length) {
  throw new Error(`Premium schema failed a safety check: ${unsafe.join(", ")}`);
}

for (const fragment of ["review-premium-recordings", "public = false", "review_recordings_insert_self", "review_recordings_delete_safe"]) {
  if (!recordingSql.includes(fragment)) throw new Error(`Private recording schema is missing: ${fragment}`);
}
for (const fragment of ["premium_plus", "review_plan_rank", "review_plan_meets_requirement", "review_can_read_question"]) {
  if (!premiumPlusSql.includes(fragment)) throw new Error(`Premium+ entitlement schema is missing: ${fragment}`);
}
for (const fragment of ["Save draft / 下書き保存", "Re-record / 録り直す", "Submit recording / 録音を提出", "Teacher feedback"]) {
  if (!learnerUi.includes(fragment)) throw new Error(`Premium learner UI is missing: ${fragment}`);
}
if (!supabaseClient.includes("remove([editable.audio_object_path])")) {
  throw new Error("Replacing a returned recording must remove the superseded private object.");
}
for (const fragment of ["audio/mp4\": \"m4a", "audio/ogg\": \"ogg", "audio/mpeg\": \"mp3", "contentType,"]) {
  if (!supabaseClient.includes(fragment)) throw new Error(`Cross-browser recording upload support is missing: ${fragment}`);
}
for (const fragment of ["Create a Premium review task", "Publish feedback", "AI-assisted draft", "item.status !== \"draft\""]) {
  if (!teacherUi.includes(fragment)) throw new Error(`Premium teacher UI is missing: ${fragment}`);
}

console.log("Premium schema/UI static checks passed: tier controls, submissions, private recordings, teacher feedback, RLS markers and no password columns.");
