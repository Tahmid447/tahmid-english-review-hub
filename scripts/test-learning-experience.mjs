import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storage = new Map([
  ["te-review-hub:settings:v1", JSON.stringify({ sound: false, voice: "gb" })],
  ["te-review-hub:lesson-progress:v1", JSON.stringify({
    "june-28": { answeredCount: 3, firstScore: 1 },
  })],
]);
const originalWindow = globalThis.window;
const originalCustomEvent = globalThis.CustomEvent;

globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};
globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};

const store = await import(`../src/store.js?scope-test=${Date.now()}`);

assert.equal(
  store.getLessonProgress("june-28")?.answeredCount,
  3,
  "Anonymous learners retain resumable legacy progress.",
);
assert.equal(
  store.getSettings().voice,
  "gb",
  "Anonymous learners retain legacy settings.",
);
store.saveLessonProgress("june-28", { answeredCount: 4 });

store.setStorageUser("student-a");
assert.equal(
  store.getLessonProgress("june-28"),
  null,
  "A signed-in learner never inherits anonymous progress.",
);
assert.equal(
  store.getSettings().sound,
  true,
  "A signed-in learner never inherits anonymous settings.",
);
store.saveLessonProgress("june-28", { answeredCount: 1, firstScore: 1 });
store.updateSettings({ sound: false, hintMode: "manual", vibration: false });

store.setStorageUser("student-b");
assert.equal(
  store.getLessonProgress("june-28"),
  null,
  "Two signed-in learners do not share lesson progress.",
);
assert.equal(store.getSettings().hintMode, "auto");

store.setStorageUser("student-a");
assert.equal(store.getLessonProgress("june-28")?.answeredCount, 1);
assert.equal(store.getSettings().hintMode, "manual");
assert.equal(store.getSettings().vibration, false);

store.setStorageUser(null);
assert.equal(
  store.getLessonProgress("june-28")?.answeredCount,
  4,
  "Signing out restores only the anonymous resume scope.",
);

let currentAuthUserId = "student-a";
const remoteSettings = new Map([
  ["student-a", { voice: "gb", sound: false }],
]);
const fakeSupabaseClient = {
  auth: {
    getSession: async () => ({
      data: {
        session: currentAuthUserId ? { user: { id: currentAuthUserId } } : null,
      },
      error: null,
    }),
  },
  from: (table) => {
    assert.equal(table, "review_user_settings");
    let selectedUserId = null;
    return {
      select() {
        return this;
      },
      eq(column, value) {
        assert.equal(column, "user_id");
        selectedUserId = String(value);
        return this;
      },
      async maybeSingle() {
        const settings = remoteSettings.get(selectedUserId);
        return {
          data: settings ? { settings, updated_at: "2026-07-30T00:00:00.000Z" } : null,
          error: null,
        };
      },
      async upsert(record) {
        if (record.settings?.sequence === 1) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        remoteSettings.set(String(record.user_id), record.settings);
        return { error: null };
      },
    };
  },
};
globalThis.window.supabase = {
  createClient: () => fakeSupabaseClient,
};
const remote = await import(`../src/supabase.js?settings-test=${Date.now()}`);
const loadedSettings = await remote.loadUserSettings("student-a");
assert.equal(loadedSettings.loaded, true);
assert.equal(loadedSettings.settings.voice, "gb");
assert.equal(
  (await remote.loadUserSettings("student-b")).reason,
  "auth-changed",
  "Remote settings loads are rejected after an account switch.",
);
await remote.saveUserSettings(
  { voice: "us", sound: true },
  { expectedUserId: "student-a" },
);
assert.equal(remoteSettings.get("student-a").voice, "us");
currentAuthUserId = "student-b";
assert.equal(
  (await remote.saveUserSettings(
    { voice: "gb", sound: false },
    { expectedUserId: "student-a" },
  )).reason,
  "auth-changed",
  "A stale settings save can never write to the newly signed-in account.",
);
assert.equal(remoteSettings.has("student-b"), false);
currentAuthUserId = "student-a";
const firstSettingsSave = remote.saveUserSettings(
  { sequence: 1 },
  { expectedUserId: "student-a" },
);
const secondSettingsSave = remote.saveUserSettings(
  { sequence: 2 },
  { expectedUserId: "student-a" },
);
await Promise.all([firstSettingsSave, secondSettingsSave]);
assert.equal(
  remoteSettings.get("student-a").sequence,
  2,
  "Rapid settings changes are saved remotely in the same order they were made.",
);

if (originalWindow === undefined) delete globalThis.window;
else globalThis.window = originalWindow;
if (originalCustomEvent === undefined) delete globalThis.CustomEvent;
else globalThis.CustomEvent = originalCustomEvent;

const { speakingFeedbackForSimilarity } = await import("../src/audio.js");
const bands = [
  [0.95, "excellent"],
  [0.75, "good"],
  [0.4, "keep-going"],
];
for (const [similarity, expectedBand] of bands) {
  const messages = [0, 0.5, 0.999].map((randomValue) => (
    speakingFeedbackForSimilarity(similarity, () => randomValue)
  ));
  assert(messages.every(({ band }) => band === expectedBand));
  assert.equal(
    new Set(messages.map(({ messageEn }) => messageEn)).size,
    3,
    `${expectedBand} speaking feedback has three varied comments.`,
  );
  assert(messages.every(({ messageJa }) => Boolean(messageJa)));
}

const lessonScript = fs.readFileSync(path.join(root, "src", "lesson.js"), "utf8");
const lessonPage = fs.readFileSync(path.join(root, "lesson.html"), "utf8");
const hubScript = fs.readFileSync(path.join(root, "src", "hub.js"), "utf8");
const phraseScript = fs.readFileSync(path.join(root, "src", "phrases.js"), "utf8");
assert.match(lessonScript, /querySelectorAll\("\[data-audio-text\]"\)/);
assert.match(lessonScript, /Listen to the question/);
assert.match(lessonScript, /Listen to choice/);
assert.match(lessonScript, /Listen to the explanation/);
assert.match(lessonScript, /Listen to your sentence/);
assert.match(lessonScript, /Listen to the original/);
assert.match(lessonScript, /matching-term/);
assert.match(lessonScript, /sorting-category-audio/);
assert.match(lessonScript, /playAnswerFeedback\(Boolean\(correct\)\)/);
assert.match(lessonScript, /navigator\.vibrate\(correct \? \[30, 40, 30\] : \[80, 40, 80\]\)/);
assert.match(lessonScript, /Date\.now\(\) \+ 5000/);
assert.match(lessonPage, /data-hint-mode="auto"/);
assert.match(lessonPage, /data-hint-mode="manual"/);
assert.match(lessonPage, /id="vibrationToggle"/);
assert.match(lessonScript, /onStudentAuthChange/);
assert.match(lessonScript, /authScopeLocked = true/);
assert.match(lessonScript, /window\.location\.reload\(\)/);
for (const [name, source] of [
  ["lesson", lessonScript],
  ["hub", hubScript],
  ["phrase library", phraseScript],
]) {
  assert.match(source, /loadUserSettings/);
  assert.match(source, /saveUserSettings/);
  assert.match(
    source,
    /expectedUserId/,
    `${name} settings synchronisation guards against account changes.`,
  );
}

console.log("Learning experience tests passed.");
console.log("  ✓ account-scoped local settings and progress");
console.log("  ✓ race-safe cross-device settings load and save");
console.log("  ✓ varied speaking feedback in every score band");
console.log("  ✓ lesson text audio, hint timer, sound and vibration hooks");
