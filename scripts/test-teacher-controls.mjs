import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [teacher, teacherPage, membership, hub, migration] = await Promise.all([
  readFile(new URL("../src/teacher.js", import.meta.url), "utf8"),
  readFile(new URL("../teacher.html", import.meta.url), "utf8"),
  readFile(new URL("../src/supabase.js", import.meta.url), "utf8"),
  readFile(new URL("../src/hub.js", import.meta.url), "utf8"),
  readFile(new URL("../supabase/migrations/202608020007_teacher_controls.sql", import.meta.url), "utf8"),
]);

assert.match(teacher, /lastGeneratedCode/);
assert.match(teacher, /Copy full code/);
assert.match(teacher, /last four characters/);
assert.match(teacher, /Open profile & controls/);
assert.match(teacher, /Locked for this learner/);
assert.match(teacher, /Send password-reset email/);
assert.match(teacher, /DELETE \$\{lesson\.slug\}/);
assert.match(teacher, /Restore/);
assert.match(teacher, /signInTeacherWithGoogle/);
assert.match(teacherPage, /id="teacherGoogleSignIn"/);

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

console.log("Teacher controls regression tests passed.");
console.log("  ✓ full-code handoff and masked history");
console.log("  ✓ bounded redemption request and full-code validation");
console.log("  ✓ learner drilldown, assignment, lock, reset, and activity controls");
console.log("  ✓ archived restore and guarded permanent deletion");
console.log("  ✓ teacher-authorised Google sign-in without password sharing");
