import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const migrationPath = resolve(
  here,
  "../supabase/migrations/202608020008_premium_plans_and_submissions.sql",
);
const sql = await readFile(migrationPath, "utf8");

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

console.log(
  "Premium schema static checks passed: required objects, RLS markers, private feedback gate and no password columns.",
);
