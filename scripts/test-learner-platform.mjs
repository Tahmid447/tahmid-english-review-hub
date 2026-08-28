import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  QUESTION_FORMATS,
  answerExists,
  calculateOfficialTotals,
  gradeQuestionAnswer,
  gridCellDisplay,
  isAnswerGradeable,
  preserveFirstResult,
  selectQuickPracticeIds,
  storyboardPanelLayout,
} from "../src/lesson-grading.js";
import {
  classifyLibraryEntry,
  normalizeCatalogLanguages,
  sentencePatternFor,
} from "../src/data.js";
import { DEFAULT_SETTINGS, resolvedTheme, safeLocalReturnPath } from "../src/store.js";
import { persistStudentProfileRow } from "../src/supabase.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const question = (format, extra = {}) => ({ id: format, format, maxPoints: 1, ...extra });
const fixtures = new Map([
  ["mcq", [question("mcq", { correct: "b" }), "b"]],
  ["situation", [question("situation", { correct: "b" }), "b"]],
  ["dialogue", [question("dialogue", { correct: "b" }), "b"]],
  ["truefalse", [question("truefalse", { correct: true }), true]],
  ["typing", [question("typing", { accepted: ["I agree."] }), "I agree"]],
  ["translation", [question("translation", { accepted: ["I agree."] }), "I agree"]],
  ["listenType", [question("listenType", { accepted: ["I agree."] }), "I agree"]],
  ["listenChoice", [question("listenChoice", { correct: "b" }), "b"]],
  ["speaking", [question("speaking"), { transcript: "I agree", matched: true }]],
  ["mistake", [question("mistake", { accepted: ["I agree."] }), "I agree"]],
  ["order", [question("order", { words: ["I", "agree"], correctWords: ["I", "agree"] }), [0, 1]]],
  ["matching", [question("matching", {
    maxPoints: 2,
    pairs: [{ id: "a", jp: "猫" }, { id: "b", jp: "犬" }],
  }), { a: "猫", b: "犬" }]],
  ["sorting", [question("sorting", {
    maxPoints: 2,
    sortingItems: [{ id: "a", category: "noun" }, { id: "b", category: "verb" }],
  }), { a: "noun", b: "verb" }]],
  ["grid", [question("grid", { correctCell: "top-left" }), "top-left"]],
]);

assert.deepEqual([...fixtures.keys()], [...QUESTION_FORMATS], "Every supported format has a regression fixture.");
for (const [format, [item, answer]] of fixtures) {
  assert.equal(answerExists(item, answer), true, `${format} has an answer.`);
  assert.equal(isAnswerGradeable(item, answer), true, `${format} is complete enough to grade.`);
  assert.equal(gradeQuestionAnswer(item, answer, "2026-08-14T00:00:00.000Z")?.correct, true, `${format} grades correctly.`);
}

const quickQuestions = [
  question("mcq", { id: "understand" }),
  question("listenChoice", { id: "listen" }),
  question("speaking", { id: "speak" }),
  question("translation", { id: "write" }),
  question("mcq", { id: "visual", section: "See It", image: "/assets/questions/visual/storyboard.webp", imagePanel: 2 }),
  question("matching", { id: "match" }),
  question("dialogue", { id: "dialogue" }),
  question("typing", { id: "type" }),
  question("truefalse", { id: "extra-one" }),
  question("order", { id: "extra-two" }),
];
const quickIds = selectQuickPracticeIds(quickQuestions, quickQuestions.map(({ id }) => id), 8);
assert.equal(quickIds.length, 8, "Quick Practice contains eight questions for a 5–10 minute run.");
assert.equal(new Set(quickIds).size, 8, "Quick Practice never repeats a question.");
for (const requiredId of ["understand", "listen", "speak", "write", "visual", "match"]) {
  assert(quickIds.includes(requiredId), `Quick Practice keeps the ${requiredId} learning family.`);
}

assert.deepEqual(storyboardPanelLayout(1), { panel: 1, column: 0, row: 0 });
assert.deepEqual(storyboardPanelLayout(3), { panel: 3, column: 2, row: 0 });
assert.deepEqual(storyboardPanelLayout(4), { panel: 4, column: 0, row: 1 });
assert.deepEqual(storyboardPanelLayout(5), { panel: 5, column: 1, row: 1 });
assert.equal(storyboardPanelLayout(6), null, "The unused sixth storyboard cell is never selectable.");
assert.deepEqual(
  gridCellDisplay({ gridCells: { center: "I agree." } }, "center", true),
  { primary: "I agree.", secondary: "" },
  "Labelled grids expose their English tile text.",
);
assert.deepEqual(
  gridCellDisplay({ gridCells: { center: { en: "I agree.", jp: "賛成です。" } } }, "center", true),
  { primary: "I agree.", secondary: "賛成です。" },
  "Bilingual grid labels keep Japanese as optional supporting text.",
);
assert.deepEqual(
  gridCellDisplay({ correctCell: "center" }, "center", true),
  { primary: "", secondary: "" },
  "Legacy position grids remain intentionally unlabelled.",
);

const [orderQuestion] = fixtures.get("order");
const [matchingQuestion] = fixtures.get("matching");
const [sortingQuestion] = fixtures.get("sorting");
assert.equal(answerExists(orderQuestion, [0]), true);
assert.equal(isAnswerGradeable(orderQuestion, [0]), false, "A partial sentence cannot lock its first score.");
assert.equal(isAnswerGradeable(matchingQuestion, { a: "猫" }), false, "A partial match cannot lock its first score.");
assert.equal(isAnswerGradeable(sortingQuestion, { a: "noun" }), false, "A partial sort cannot lock its first score.");

const official = {};
const retries = {};
const firstWrong = { score: 0, max: 1, correct: false, answer: "a" };
const retryCorrect = { score: 1, max: 1, correct: true, answer: "b" };
assert.equal(preserveFirstResult(official, retries, "mcq", firstWrong), true);
assert.equal(preserveFirstResult(official, retries, "mcq", retryCorrect), false);
assert.deepEqual(official.mcq, firstWrong, "Retry never overwrites the official first result.");
assert.notEqual(official.mcq, firstWrong, "The official result is isolated from the mutable run result.");
assert.deepEqual(retries.mcq, [retryCorrect]);
assert.deepEqual(calculateOfficialTotals([question("mcq")], official), {
  score: 0,
  max: 1,
  availableMax: 1,
  checked: 1,
  wrong: 1,
}, "A correct retry leaves the displayed first score locked at 0 / 1.");

firstWrong.max = 2;
retryCorrect.max = 3;
assert.equal(official.mcq.max, 1, "Later run-result mutation cannot change the first-score denominator.");
assert.equal(retries.mcq[0].max, 1, "Stored retry history is also a stable snapshot.");

const totals = calculateOfficialTotals(
  [question("mcq"), question("typing"), { ...matchingQuestion, id: "matching" }],
  { mcq: firstWrong, matching: { score: 1, max: 2, correct: false } },
);
assert.deepEqual(totals, {
  score: 1,
  max: 3,
  availableMax: 4,
  checked: 2,
  wrong: 2,
}, "Unanswered questions stay out of the displayed first-score denominator.");

const defensiveTotals = calculateOfficialTotals(
  [question("mcq"), question("mcq")],
  { mcq: { score: 0, max: 2, correct: false } },
);
assert.deepEqual(defensiveTotals, {
  score: 0,
  max: 1,
  availableMax: 1,
  checked: 1,
  wrong: 1,
}, "A stale max or duplicated question id cannot make a retry increase the denominator.");

assert.deepEqual(normalizeCatalogLanguages({ en: "右上", jp: "top right" }), {
  en: "top right",
  jp: "右上",
  swapped: true,
});
assert.equal(classifyLibraryEntry("sparkly"), "word");
assert.equal(classifyLibraryEntry("No worries."), "phrase");
assert.equal(classifyLibraryEntry("I have been to Malaysia."), "pattern");
assert.equal(sentencePatternFor("I have been to Malaysia."), "I have been to [place].");

assert.equal(Object.hasOwn(DEFAULT_SETTINGS, "vibration"), false, "The unreliable vibration preference is retired.");
assert.equal(resolvedTheme("system", true), "dark");
assert.equal(resolvedTheme("system", false), "light");
assert.equal(safeLocalReturnPath("https://evil.example/path", "/", "https://review.example"), "/");
assert.equal(safeLocalReturnPath("/phrases?return=%2F#saved", "/", "https://review.example"), "/phrases?return=%2F#saved");
assert.equal(
  safeLocalReturnPath(
    "/?account=google#access_token=secret&refresh_token=private&expires_in=3600&type=bearer",
    "/",
    "https://review.example",
  ),
  "/",
  "OAuth callback tokens are never copied into internal return links.",
);
assert.equal(
  safeLocalReturnPath("/phrases?code=one-time#saved", "/", "https://review.example"),
  "/phrases#saved",
  "One-time callback query parameters are removed while ordinary anchors remain.",
);
assert.equal(safeLocalReturnPath("/teacher.html", "/", "https://review.example"), "/");
assert.equal(safeLocalReturnPath("/lesson/june-29?filter=listening", "/", "https://review.example"), "/lesson/june-29?filter=listening");

function profileClient(results) {
  const calls = [];
  const queue = [...results];
  const builder = {
    from(table) { calls.push(["from", table]); return builder; },
    insert(payload) { calls.push(["insert", payload]); return builder; },
    update(payload) { calls.push(["update", payload]); return builder; },
    eq(column, value) { calls.push(["eq", column, value]); return builder; },
    select(columns) { calls.push(["select", columns]); return builder; },
    maybeSingle() { calls.push(["maybeSingle"]); return Promise.resolve(queue.shift()); },
  };
  return { client: builder, calls };
}

const profilePayload = {
  user_id: "11111111-1111-4111-8111-111111111111",
  first_name: "Test",
  last_name: "Learner",
};
const existingProfileWrite = profileClient([{ data: profilePayload, error: null }]);
await persistStudentProfileRow(
  existingProfileWrite.client,
  profilePayload.user_id,
  profilePayload,
  true,
);
const existingUpdate = existingProfileWrite.calls.find(([operation]) => operation === "update")?.[1];
assert.equal(Object.hasOwn(existingUpdate, "user_id"), false,
  "Existing-profile saves never request UPDATE permission on the protected owner key.");
assert.equal(existingProfileWrite.calls.some(([operation]) => operation === "insert"), false);
assert.deepEqual(
  existingProfileWrite.calls.find(([operation]) => operation === "eq"),
  ["eq", "user_id", profilePayload.user_id],
  "Existing-profile saves stay scoped to the authenticated owner row.",
);

const newProfileWrite = profileClient([{ data: profilePayload, error: null }]);
await persistStudentProfileRow(newProfileWrite.client, profilePayload.user_id, profilePayload, false);
assert.deepEqual(newProfileWrite.calls.find(([operation]) => operation === "insert")?.[1], profilePayload,
  "A new learner profile includes its authenticated ownership key on INSERT.");

const racedProfileWrite = profileClient([
  { data: null, error: { code: "23505" } },
  { data: profilePayload, error: null },
]);
await persistStudentProfileRow(racedProfileWrite.client, profilePayload.user_id, profilePayload, false);
assert.equal(racedProfileWrite.calls.filter(([operation]) => operation === "update").length, 1,
  "A concurrent first-login INSERT race retries as an owner-scoped UPDATE.");
assert.equal(
  Object.hasOwn(racedProfileWrite.calls.find(([operation]) => operation === "update")?.[1], "user_id"),
  false,
  "The duplicate-insert fallback also keeps the owner key out of UPDATE.",
);

const automaticRaceWrite = profileClient([
  { data: null, error: { code: "23505" } },
  { data: profilePayload, error: null },
]);
await persistStudentProfileRow(
  automaticRaceWrite.client,
  profilePayload.user_id,
  profilePayload,
  false,
  false,
);
assert.equal(automaticRaceWrite.calls.some(([operation]) => operation === "update"), false,
  "An automatic first-login race re-reads the winning row instead of overwriting newer profile values.");

const failedProfileWrite = profileClient([{ data: null, error: { code: "42501" } }]);
const failedProfileResult = await persistStudentProfileRow(
  failedProfileWrite.client,
  profilePayload.user_id,
  profilePayload,
  false,
);
assert.equal(failedProfileResult.error?.code, "42501");
assert.equal(failedProfileWrite.calls.some(([operation]) => operation === "update"), false,
  "Non-conflict INSERT errors are returned without an unsafe fallback write.");

const lessonScript = fs.readFileSync(path.join(root, "src", "lesson.js"), "utf8");
const lessonPage = fs.readFileSync(path.join(root, "lesson.html"), "utf8");
const hubScript = fs.readFileSync(path.join(root, "src", "hub.js"), "utf8");
const supabaseScript = fs.readFileSync(path.join(root, "src", "supabase.js"), "utf8");
const homePage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const phraseScript = fs.readFileSync(path.join(root, "src", "phrases.js"), "utf8");
const phrasePage = fs.readFileSync(path.join(root, "phrases.html"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const buildScript = fs.readFileSync(path.join(root, "scripts", "build.mjs"), "utf8");
const netlify = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");

assert.doesNotMatch(lessonScript, /navigator\.vibrate|vibrationToggle/);
assert.doesNotMatch(lessonPage, /vibrationToggle/);
assert.match(lessonScript, /data-retry-question/);
assert.match(lessonScript, /Check \$\{count\} answered/);
assert.match(lessonScript, /role="radio" aria-checked=.*tabindex=/);
assert.match(lessonScript, /bindRovingRadioGroup/);
assert.match(lessonScript, /queueMicrotask/);
assert.match(homePage, /id="profileGateDialog"/);
assert.match(hubScript, /isGoogleSession/);
assert.match(hubScript, /id = "profileCompletionStatus"/);
assert.match(hubScript, /Saving your profile…/);
assert.match(supabaseScript, /existingProfile && !hasExplicitValues/);
assert.match(homePage, /src="\/src\/hub\.js\?v=20260828-release2"/);
assert.match(homePage, /id="musicStartChip"/);
assert.match(homePage, /Your lesson does not end when the call ends/);
assert.match(homePage, /eight-question Quick Practice/);
assert.match(hubScript, /from "\.\/supabase\.js\?v=20260814-profile-fix"/);
assert.match(supabaseScript, /signOutStudent[\s\S]*?withOperationTimeout/);
assert.match(supabaseScript, /removeItem\(STUDENT_AUTH_STORAGE_KEY\)/);
assert.match(supabaseScript, /studentClient = undefined/);
assert.match(hubScript, /window\.location\.replace\(`\/\?signedOut=\$\{status\}`\)/);
assert.match(hubScript, /function finishSignOutTransition\(\)/);
assert.match(hubScript, /url\.searchParams\.delete\("signedOut"\)/);
assert.match(homePage, /role="tab" aria-selected="true" aria-controls="studentLoginForm"/);
assert.match(homePage, /role="tabpanel" aria-labelledby="authTabSignin"/);
assert.doesNotMatch(hubScript, /role:\s*"link"/);
assert.match(homePage, /id="learningProgress"/);
assert.match(homePage, /id="streakCount"/);
assert.match(homePage, /id="retryImprovement"/);
assert.match(netlify, /from = "\/takiwaki"[\s\S]*?to = "\/\?legacy=takiwaki"[\s\S]*?status = 301/);
assert.doesNotMatch(buildScript, /"takiwaki\.html",/);
assert.match(buildScript, /"manifest\.webmanifest"/);
assert.match(buildScript, /"sw\.js"/);
assert.match(homePage, /src="\/assets\/app-icon-192\.png"[^>]*width="50"[^>]*height="50"/);
assert.match(phraseScript, /const PHRASE_PAGE_SIZE = 24/);
assert.match(phraseScript, /phrases\.slice\(0, visiblePhraseLimit\)/);
assert.match(phraseScript, /visiblePhraseLimit \+= PHRASE_PAGE_SIZE/);
assert.match(phraseScript, /phrase\.audience !== "takiwaki"/);
assert.match(phraseScript, /speechRecognitionSupported\(\)/);
assert.doesNotMatch(phraseScript, /"aria-label": `Play \$\{phrase\.en\}/);
assert.doesNotMatch(phraseScript, /"aria-label": `Practise saying/);
assert.match(phrasePage, /id="phraseLoadMore"/);
assert.match(serviceWorker, /request\.headers\.has\("authorization"\)/);
assert.doesNotMatch(serviceWorker, /supabase\.co|\/auth\/v1|\/rest\/v1|\/functions\/v1|\/storage\/v1/);

console.log("Learner platform regression tests passed (14 formats, retry, navigation, profile gate, theme and PWA).");
