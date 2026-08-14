import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  premiumRecordingObjectPath,
  reviewProfileIsComplete,
} from "../src/supabase.js";

const root = new URL("../", import.meta.url);
const [
  migration,
  supabaseClient,
  teacherUi,
  teacherPage,
  membershipFunction,
  learnerHome,
  learnerHub,
  learnerLesson,
] = await Promise.all([
  readFile(new URL("supabase/migrations/202608140015_teacher_preview_and_premium_workflows.sql", root), "utf8"),
  readFile(new URL("src/supabase.js", root), "utf8"),
  readFile(new URL("src/teacher.js", root), "utf8"),
  readFile(new URL("teacher.html", root), "utf8"),
  readFile(new URL("supabase/functions/membership-access/index.ts", root), "utf8"),
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("src/hub.js", root), "utf8"),
  readFile(new URL("src/lesson.js", root), "utf8"),
]);

const functionBlock = (name) => migration.match(
  new RegExp(`create or replace function public\\.${name}\\([\\s\\S]*?\\n\\$\\$;`, "i"),
)?.[0] || "";

// Learner drafts (including recordings) stay private from teachers.
assert.match(migration, /public\.is_review_teacher\(\) and status <> 'draft'/);
assert.match(migration, /s\.audio_object_path = storage\.objects\.name[\s\S]*?s\.status <> 'draft'/);
assert.match(migration, /join public\.review_premium_tasks t[\s\S]*?t\.task_type = 'speaking'/);
assert.match(migration, /storage\.foldername\(storage\.objects\.name\)\)\[1\] = s\.user_id::text/);
assert.match(migration, /storage\.foldername\(storage\.objects\.name\)\)\[2\] = s\.task_id::text/);
assert.match(migration, /create policy review_recordings_insert_self[\s\S]*?t\.task_type = 'speaking'[\s\S]*?review_recording_upload_within_quota/);
assert.match(migration, /recent\.created_at > now\(\) - interval '10 minutes'/);
const recordingDeletePolicy = migration.match(
  /create policy review_recordings_delete_safe[\s\S]*?\n\);/,
)?.[0] || "";
assert.match(recordingDeletePolicy, /and not public\.is_review_teacher\(\)/);
assert.doesNotMatch(recordingDeletePolicy, /or \([\s\S]*?public\.is_review_teacher\(\)/);
assert.match(migration, /create policy review_task_submissions_update[\s\S]*?using \(user_id = auth\.uid\(\)\)[\s\S]*?with check \(user_id = auth\.uid\(\)\)/);
const directSubmissionUpdatePolicy = migration.match(
  /create policy review_task_submissions_update[\s\S]*?with check \([^;]+;/,
)?.[0] || "";
assert.doesNotMatch(directSubmissionUpdatePolicy, /is_review_teacher/);
assert.match(migration, /create policy review_task_submissions_insert_self[\s\S]*?not public\.is_review_teacher\(\)/);
assert.match(migration, /Teachers cannot create learner submissions/);
assert.match(migration, /drop policy if exists review_feedback_insert_teacher/);
assert.match(migration, /drop policy if exists review_feedback_update_teacher/);
assert.match(migration, /revoke insert, update, delete on public\.review_submission_feedback/);

// Recording paths are bound to the learner/task in both client and SQL. Essay
// rows cannot be used to make an audio object teacher-readable.
const learnerId = "11111111-1111-4111-8111-111111111111";
const taskId = "22222222-2222-4222-8222-222222222222";
assert.equal(
  premiumRecordingObjectPath({
    userId: learnerId,
    taskId,
    objectId: "33333333-3333-4333-8333-333333333333",
    extension: "WEBM",
  }),
  `${learnerId}/${taskId}/33333333-3333-4333-8333-333333333333.webm`,
);
assert.throws(() => premiumRecordingObjectPath({
  userId: learnerId,
  taskId: "../another-task",
  objectId: "recording",
  extension: "webm",
}), /valid learner and speaking task/);
assert.throws(() => premiumRecordingObjectPath({
  userId: learnerId,
  taskId,
  objectId: "../recording",
  extension: "webm",
}), /object identifier/);
assert.throws(() => premiumRecordingObjectPath({
  userId: learnerId,
  taskId,
  objectId: "recording",
  extension: "html",
}), /file type/);
const submissionTrigger = functionBlock("review_validate_task_submission");
assert.match(submissionTrigger, /Essay submissions cannot attach speaking recording data/);
assert.match(submissionTrigger, /new\.user_id::text \|\| '\/' \|\| new\.task_id::text/);
assert.match(submissionTrigger, /from storage\.objects o[\s\S]*?o\.name = new\.audio_object_path/);
assert.match(submissionTrigger, /Recording duration cannot be saved without a recording/);

// Review feedback and status move atomically, and a resubmission gets fresh queue metadata.
assert.match(migration, /create or replace function public\.review_save_submission_review/);
assert.match(migration, /if review_action is null or review_action not in/);
assert.match(migration, /insert into public\.review_submission_feedback[\s\S]*?update public\.review_task_submissions/);
assert.match(migration, /new\.reviewed_at := null;[\s\S]*?new\.submitted_at := now\(\)/);
assert.match(supabaseClient, /export async function saveTeacherSubmissionReview/);
assert.match(supabaseClient, /client\.rpc\("review_save_submission_review"/);
assert.match(teacherUi, /saveTeacherSubmissionReview\(\{/);
assert.doesNotMatch(teacherUi, /Feedback was saved, but the submission status could not be updated/);

// Teacher previews are authorised, plan-scoped, payload-safe and non-mutating.
assert.match(migration, /create or replace function public\.review_teacher_preview_lesson/);
assert.match(migration, /if not public\.is_review_teacher\(\)/);
assert.match(migration, /review_plan_rank\(safe_plan\)[\s\S]*?>= public\.review_plan_rank\(q\.required_plan\)/);
assert.match(migration, /when safe_plan = 'free' then case[\s\S]*?when target\.is_preview then coalesce\(target\.content, '\{\}'::jsonb\)[\s\S]*?else jsonb_build_object\('themes', target\.content -> 'themes'\)/);
assert.doesNotMatch(functionBlock("review_teacher_preview_lesson"), /- 'phrases'/);
assert.doesNotMatch(
  migration.match(/create or replace function public\.review_teacher_preview_lesson[\s\S]*?\$\$;/)?.[0] || "",
  /insert into public\.review_memberships|update public\.review_memberships/,
);
assert.match(supabaseClient, /client\.rpc\([\s\S]*?"review_teacher_preview_lesson"/);
assert.match(supabaseClient, /teacherPreviewTasksByLesson/);
assert.match(supabaseClient, /teacherPlanPreviewBanner/);
assert.match(supabaseClient, /Submissions are disabled in teacher plan preview/);
assert.match(supabaseClient, /Recordings are disabled in teacher plan preview/);
assert.match(supabaseClient, /disableSubmissionControls/);
assert.match(teacherUi, /previewPlan/);
assert.match(teacherUi, /url\.searchParams\.set\("previewPlan"/);

// Profile completeness is one shared server-side paid-access boundary. It
// applies to membership, overrides/features, and direct lesson RLS while the
// Teacher Studio still sees drafts and archived lessons.
assert.equal(reviewProfileIsComplete({
  first_name: "A",
  last_name: "B",
  age_group: "18–24",
  native_language: "ja",
  english_level: "beginner",
}), true);
assert.equal(reviewProfileIsComplete({
  first_name: "A",
  last_name: "B",
  age_group: "",
  native_language: "ja",
  english_level: "beginner",
}), false);
assert.match(migration, /create or replace function public\.review_profile_is_complete/);
assert.match(functionBlock("review_has_active_membership"), /review_profile_is_complete\(\)/);
assert.match(functionBlock("review_has_active_plan_membership"), /review_profile_is_complete\(\)/);
assert.match(functionBlock("review_effective_plan"), /not public\.review_profile_is_complete\(\) then 'free'/);
assert.match(functionBlock("review_has_feature"), /not public\.review_profile_is_complete\(\) then false/);
assert.match(functionBlock("review_can_read_lesson"), /public\.review_profile_is_complete\(\)[\s\S]*?review_lesson_access_mode/);
assert.match(migration, /create policy review_lessons_select_catalog[\s\S]*?public\.is_review_teacher\(\)[\s\S]*?or public\.review_can_read_lesson\(id\)/);
assert.match(migration, /create policy review_questions_select_catalog[\s\S]*?public\.is_review_teacher\(\)[\s\S]*?or public\.review_can_read_question\(id\)/);
assert.match(supabaseClient, /client\.rpc\([\s\S]*?"review_profile_is_complete"/);
assert.match(supabaseClient, /lockReason:[\s\S]*?"profile-required"/);
assert.match(learnerLesson, /lesson\.lockReason === "profile-required"/);
assert.match(learnerLesson, /Complete profile/);
assert.match(learnerLesson, /href="\/#account"/);
assert.match(learnerHome, /id="profileVerifiedEmail"[^>]*readonly[^>]*aria-readonly="true"/);
assert.match(learnerHub, /profileVerifiedEmail: authSession\.user\?\.email \|\| ""/);
assert.match(learnerHub, /id === "profileVerifiedEmail" \|\| !control\.value/);

// The seed is idempotent but also fails rather than silently claiming partial coverage.
const seededSlugs = [...migration.matchAll(/\('(june|july)-\d{2}',/g)].map((match) => match[0]);
assert.equal(seededSlugs.length, 17);
assert.match(migration, /expected 34 active tasks/);
assert.match(migration, /seeded_count <> 34/);
assert.match(migration, /-premium-speaking-v1/);
assert.match(migration, /-premium-essay-v1/);

// Redemption uses one SQL transaction, serialises first use, and refuses an
// incompatible overlapping grant rather than over-extending higher access.
assert.match(migration, /pg_advisory_xact_lock\(hashtextextended\(auth\.uid\(\)::text, 0\)\)/);
assert.match(migration, /drop function if exists public\.review_redeem_access_code\(text\);[\s\S]*?create or replace function public\.review_redeem_access_code/);
assert.match(functionBlock("review_redeem_access_code"), /membership_plan text/);
assert.match(functionBlock("review_redeem_access_code"), /return query select 'active'::text, next_scope, next_plan, next_expiry/);
assert.ok(
  migration.indexOf("Access code already redeemed by this account")
    < migration.indexOf("Access code used up"),
  "Already-redeemed must be checked before use-limit exhaustion.",
);
assert.match(migration, /Access code conflicts with the active membership/);
assert.match(migration, /current_membership\.starts_at <= now\(\)/);
assert.match(migration, /Complete the learner profile before redeeming an access code/);
for (const profileField of ["first_name", "last_name", "age_group", "native_language", "english_level"]) {
  assert.match(
    functionBlock("review_profile_is_complete"),
    new RegExp(`nullif\\(btrim\\(coalesce\\(p\\.${profileField}, ''\\)\\), ''\\) is not null`),
  );
}
assert.match(functionBlock("review_redeem_access_code"), /upper\(btrim\(raw_code\)\) !~ '\^TEC-\[A-F0-9\]\{12\}\$'/);
assert.match(membershipFunction, /userClient\.rpc\([\s\S]*?"review_redeem_access_code"/);
assert.match(membershipFunction, /membershipPlan: redemption\?\.membership_plan/);
assert.doesNotMatch(membershipFunction, /\.from\("review_memberships"\)[\s\S]*?\.select\("plan_tier"\)/);
assert.doesNotMatch(membershipFunction, /nextUseCount|reserved, error: reserveError/);
assert.match(membershipFunction, /if \(!supabaseUrl \|\| !anonKey\)/);
assert.match(membershipFunction, /console\.error\("membership-access unexpected failure", error\)/);
assert.match(membershipFunction, /Membership request failed\. Please refresh and try again\./);
assert.doesNotMatch(membershipFunction, /error instanceof Error \? error\.message/);

// Reissue holds a source-row lock and creates/disables in one SQL transaction;
// the Edge Function no longer performs compensating multi-request writes.
const reissueRpc = functionBlock("review_reissue_access_code");
assert.match(reissueRpc, /if not public\.is_review_teacher\(\)/);
assert.match(reissueRpc, /where c\.id = target_code[\s\S]*?for update/);
assert.ok(
  reissueRpc.indexOf("if not current_code.enabled") < reissueRpc.indexOf("insert into public.review_access_codes"),
  "The enabled check must occur while the source row is locked and before inserting.",
);
assert.match(reissueRpc, /insert into public\.review_access_codes[\s\S]*?update public\.review_access_codes[\s\S]*?set enabled = false/);
const edgeReissue = membershipFunction.match(
  /if \(action === "reissue"\)[\s\S]*?\n    if \(action === "redeem"\)/,
)?.[0] || "";
assert.match(edgeReissue, /userClient\.rpc\([\s\S]*?"review_reissue_access_code"/);
assert.doesNotMatch(edgeReissue, /\.from\("review_access_codes"\)|\.insert\(|\.update\(|\.delete\(/);

// Teacher Studio is organised by jobs and retains a one-language preference.
for (const tab of ["dashboard", "learners", "codes", "lessons", "submissions", "sources", "insights"]) {
  assert.match(teacherPage, new RegExp(`data-teacher-tab="${tab}"`));
}
assert.match(teacherPage, /id="teacherLanguage"/);
assert.match(teacherPage, /id="teacherPreviewPlan"/);
assert.match(teacherUi, /TEACHER_LANGUAGE_STORAGE_KEY/);
assert.match(teacherUi, /window\.localStorage\.setItem\(TEACHER_LANGUAGE_STORAGE_KEY/);
assert.match(teacherUi, /Search name or email/);
assert.match(teacherUi, /submissionStatusFilter/);
assert.match(teacherUi, /if \(code\.enabled === false\)[\s\S]*?Only an enabled code can be reissued/);
assert.match(teacherUi, /Hide this lesson/);
assert.match(teacherUi, /Use plan default/);
assert.doesNotMatch(teacherUi, /AI-assisted draft|ai\.type\s*=\s*"checkbox"/);
assert.match(supabaseClient, /review_ai_assisted: false/);
assert.match(migration, /false, publish_at[\s\S]*?ai_assisted = false/);
assert.match(supabaseClient, /client\.auth\.signOut\(\{ scope: "local" \}\)/);
assert.match(supabaseClient, /removeItem\(TEACHER_AUTH_STORAGE_KEY\)/);
assert.match(supabaseClient, /teacherClient = undefined/);
assert.match(teacherUi, /window\.location\.replace\(`\/teacher\.html\?signedOut=\$\{result\}`\)/);
assert.match(teacherUi, /showLogin\(signOutMessage\)/);

console.log("Teacher/Auth v15 workflow checks passed.");
console.log("  ✓ private drafts and recordings, transactional reviews and resubmission timestamps");
console.log("  ✓ safe teacher plan previews and complete 17-lesson Premium task seed");
console.log("  ✓ atomic access-code redemption without overlapping-tier overgrant");
console.log("  ✓ owner/task-bound private recordings and transactional code rotation");
console.log("  ✓ profile-complete paid access and direct-route onboarding guard");
console.log("  ✓ job-based Teacher Studio, language persistence, filters and safe sign-out");
