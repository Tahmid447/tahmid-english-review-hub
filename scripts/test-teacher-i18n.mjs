import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [page, teacher, buildScript] = await Promise.all([
  readFile(new URL("../teacher.html", import.meta.url), "utf8"),
  readFile(new URL("../src/teacher.js", import.meta.url), "utf8"),
  readFile(new URL("./build.mjs", import.meta.url), "utf8"),
]);

// Teacher Studio uses the shared language helper, persists the selected language,
// and rerenders dynamic panels so generated labels follow the current selection.
assert.match(teacher, /import \{ uiText \} from "\.\/i18n\.js\?v=20260906-studio1"/);
assert.match(teacher, /TEACHER_LANGUAGE_STORAGE_KEY/);
assert.match(teacher, /localStorage\.setItem\(TEACHER_LANGUAGE_STORAGE_KEY, teacherLanguage\)/);
assert.match(teacher, /if \(state\.session\) renderActiveTab\(\)/);
assert.match(teacher, /teacherText\("Source link missing", "元資料リンク未登録"\)/);
assert.match(teacher, /teacherLanguage === "ja" \? lesson\.title_ja \|\| lesson\.title_en/);

// Static controls carry explicit one-language alternatives instead of rendering
// recurring "English / 日本語" labels in the normal interface.
for (const id of [
  "teacherLanguage",
  "teacherPreviewPlan",
  "editorStatus",
  "editorAudience",
  "questionRequiredPlan",
  "questionLockedDisplay",
]) {
  assert.match(page, new RegExp(`id="${id}"`));
}
for (const copy of [
  "Free sample (available without an account)",
  "Question access",
  "Below-plan display",
  "Easy Answer Builder",
  "Advanced format settings",
]) {
  const escaped = copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(page, new RegExp(`data-teacher-en="${escaped}"`));
}
assert.doesNotMatch(page, />Status \/ 公開状態</);
assert.doesNotMatch(page, />Audience \/ 公開先</);
assert.doesNotMatch(page, />Question access \/ 問題の公開範囲</);

// Private authoring data remains outside the public build. Only safe source
// metadata received through the teacher-authorised database is rendered.
assert.match(buildScript, /const publicDataFiles = \[\];/);
assert.match(buildScript, /forbiddenPublicFiles[\s\S]*?notion-drafts\.json/);
assert.doesNotMatch(teacher, /fetch\([^)]*notion-drafts\.json/);
assert.match(teacher, /safeNotionLink/);
assert.match(teacher, /\["notion\.so", "www\.notion\.so", "app\.notion\.com"\]/);

// The dynamic messages most likely to regress must be explicitly language-aware.
for (const expression of [
  "Publish this score and feedback to the learner now?",
  "Pause access for",
  "Send a secure password-reset email to",
  "This lesson is published. Saving this question will update live learner practice now.",
  "Refresh the six published bundled lessons and their activities?",
]) {
  const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(teacher, new RegExp(`teacherText\\([\\s\\S]{0,80}${escaped}`));
}

console.log("Teacher Studio language and source-safety checks passed.");
console.log("  ✓ English/Japanese one-language controls and persisted rerendering");
console.log("  ✓ dynamic confirmations, statuses, dates and source-missing labels");
console.log("  ✓ private Notion authoring data remains outside the public build");
