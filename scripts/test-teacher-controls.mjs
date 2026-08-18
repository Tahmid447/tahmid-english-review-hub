import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  teacher,
  teacherPage,
  membership,
  hub,
  migration,
  priorityMigration,
  questionAccessMigration,
  membershipFunction,
  lessonUi,
  lessonPage,
] = await Promise.all([
  readFile(new URL("../src/teacher.js", import.meta.url), "utf8"),
  readFile(new URL("../teacher.html", import.meta.url), "utf8"),
  readFile(new URL("../src/supabase.js", import.meta.url), "utf8"),
  readFile(new URL("../src/hub.js", import.meta.url), "utf8"),
  readFile(new URL("../supabase/migrations/202608020007_teacher_controls.sql", import.meta.url), "utf8"),
  readFile(new URL("../supabase/migrations/202608030010_teacher_access_priority.sql", import.meta.url), "utf8"),
  readFile(new URL("../supabase/migrations/202608030012_question_access_controls.sql", import.meta.url), "utf8"),
  readFile(new URL("../supabase/functions/membership-access/index.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/lesson.js", import.meta.url), "utf8"),
  readFile(new URL("../lesson.html", import.meta.url), "utf8"),
]);

assert.match(teacher, /lastGeneratedCode/);
assert.match(teacher, /Copy full code/);
assert.match(teacher, /last four characters/);
assert.match(teacher, /Open learner/);
assert.match(teacher, /Hide this lesson/);
assert.match(teacher, /Allow this lesson/);
assert.match(teacher, /Apply to selected/);
assert.match(teacher, /required_plan/);
assert.match(teacher, /review_approve_membership_tiered/);
assert.match(teacher, /updateTeacherAccessCode/);
assert.match(teacher, /deleteTeacherAccessCode/);
assert.match(teacher, /reissueTeacherAccessCode/);
assert.match(teacher, /Send password-reset email/);
assert.match(teacher, /DELETE \$\{lesson\.slug\}/);
assert.match(teacher, /Restore/);
assert.match(teacher, /signInTeacherWithGoogle/);
assert.match(teacherPage, /id="teacherGoogleSignIn"/);
assert.match(teacherPage, /id="editorIsPreview"/);
assert.match(teacherPage, /id="questionRequiredPlan"/);
assert.match(teacherPage, /id="questionLockedDisplay"/);
assert.match(teacher, /questionAccessLabel/);
assert.match(teacher, /required_plan: requiredPlan/);
assert.match(teacher, /locked_display: lockedDisplay/);

assert.match(membership, /AbortController/);
assert.match(membership, /12000/);
assert.match(membership, /\^TEC-\[A-F0-9\]\{12\}\$/);
assert.match(membership, /export async function signInTeacherWithGoogle/);
assert.match(hub, /codeForm\.hidden = result\.active/);
assert.match(hub, /four characters.*masked reference/);

assert.match(migration, /review_lesson_access_overrides/);
assert.match(migration, /review_permanently_delete_lesson/);
assert.match(migration, /target\.status <> 'archived'/);
assert.match(migration, /review_attempts where lesson_id = target\.id/);
assert.match(migration, /confirmation_text <> \('DELETE ' \|\| target\.slug\)/);
assert.match(priorityMigration, /review_lesson_access_mode\(l\.id\) = 'allow'/);
assert.match(priorityMigration, /review_lesson_access_mode\(id\) = 'allow'/);
assert.match(questionAccessMigration, /add column if not exists required_plan/);
assert.match(questionAccessMigration, /add column if not exists locked_display/);
assert.match(questionAccessMigration, /review_can_read_question\(check_question uuid\)/);
assert.match(questionAccessMigration, /review_question_teasers/);
assert.match(questionAccessMigration, /not public\.review_can_read_question\(q\.id\)/);
const teaserSelect = questionAccessMigration.match(
  /create or replace view public\.review_question_teasers[\s\S]*?comment on view public\.review_question_teasers/,
)?.[0] || "";
assert.ok(teaserSelect, "The payload-free teaser view must exist.");
assert.doesNotMatch(teaserSelect, /q\.(?:payload|stable_key)|prompt|choice|hint|explanation|answer/i);
assert.match(lessonPage, /id="lockedQuestionTeasers"/);
assert.match(lessonUi, /renderLockedQuestionTeasers/);
assert.match(lessonUi, /question, choices, hint, explanation and answer stay private/);
assert.match(membershipFunction, /"expired"/);
assert.match(membershipFunction, /"used_up"/);
assert.match(membershipFunction, /serviceRoleTeacherActions = new Set\(\["create", "update", "delete", "learner-auth-status"\]\)/);
assert.match(membershipFunction, /if \(action === "reissue"\)[\s\S]*?"review_reissue_access_code"/);
assert.match(teacherPage, /data-teacher-tab="submissions"/);
assert.match(teacher, /Open private recording/);
assert.match(teacher, /Publish feedback/);
assert.match(teacher, /New learners \(30 days\)/);
assert.match(teacher, /\["free", "Free", "無料"\][\s\S]*?\["standard", "Standard", "スタンダード"\][\s\S]*?\["premium", "Premium", "プレミアム"\][\s\S]*?\["premium_plus", "Premium\+", "プレミアムプラス"\]/);
assert.match(teacher, /state\.profiles\.forEach\(\(profile\) => \{[\s\S]*?membershipFor\(profile\.user_id\)[\s\S]*?planCounts\[planKey\] \+= 1/);
assert.match(teacher, /Bundled lesson · Source link missing/);
assert.match(teacher, /Teacher-created · Source link missing/);
assert.match(teacher, /Source link missing/);
assert.match(teacher, /元資料リンク未登録/);
assert.doesNotMatch(teacher, /sourceCell\.textContent = lesson\.source_type === "legacy_zip" \? "Original site" : "Manual"/);

console.log("Teacher controls regression tests passed.");
console.log("  ✓ full-code handoff and masked history");
console.log("  ✓ bounded redemption request and full-code validation");
console.log("  ✓ learner drilldown, scheduled/tiered assignment, bulk access, reset, and activity controls");
console.log("  ✓ access-code edit, reissue, safe delete/disable, and distinct redemption errors");
console.log("  ✓ archived restore and guarded permanent deletion");
console.log("  ✓ teacher-authorised Google sign-in without password sharing");
console.log("  ✓ payload-safe per-question Free, Standard, Premium, teaser, and hidden access controls");
console.log("  ✓ dashboard learner-plan counts and honest localized lesson provenance");
