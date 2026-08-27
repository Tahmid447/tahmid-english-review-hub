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
assert.equal(store.getSettings().playbackRate, 1, "Fresh settings use natural 1.0× playback.");
assert.equal(store.getSettings().autoPronounceChoices, true, "Choice pronunciation defaults on.");
assert.equal(store.getSettings().ambientEnabled, true, "Study ambience defaults on for new and migrated learners.");
assert.equal(store.getSettings().ambientVolume, 0.18, "Default ambience is audible but remains background-level.");
assert.equal(store.getSettings().ambientTrack, "calm_focus", "Calm Focus is selected by default.");
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
assert.equal(store.getSettings().voiceEnabled, true);
assert.equal(store.getSettings().sfxEnabled, true);
store.saveLessonProgress("june-28", { answeredCount: 1, firstScore: 1 });
store.updateSettings({ sound: false, hintMode: "manual", sfxEnabled: false, ambientEnabled: true, ambientTrack: "night_focus" });
assert.equal(store.getSettings().voiceEnabled, false);
assert.equal(store.getSettings().sfxEnabled, false, "The SFX toggle persists independently.");
assert.equal(store.getSettings().sound, false, "The legacy sound alias follows Voice only.");

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
assert.equal(store.getSettings().ambientEnabled, true);
assert.equal(store.getSettings().ambientTrack, "night_focus");
store.updateSettings({ sfxEnabled: true });
assert.equal(store.getSettings().voiceEnabled, false, "Turning SFX on never changes the Voice preference.");
assert.equal(Object.hasOwn(store.getSettings(), "vibration"), false);

store.setStorageUser(null);
assert.equal(
  store.getLessonProgress("june-28")?.answeredCount,
  4,
  "Signing out restores only the anonymous resume scope.",
);
store.updateSettings({ sound: true, sfxEnabled: true, playbackRate: 0.5 });
assert.equal(store.getSettings().playbackRate, 0.5, "The slow 0.5× voice speed is stored exactly.");
store.updateSettings({ playbackRate: 1.5 });
assert.equal(store.getSettings().playbackRate, 1.5, "The fast 1.5× voice speed is stored exactly.");
store.updateSettings({ shuffleChoices: false });
assert.equal(
  store.getSettings().shuffleChoices,
  true,
  "An old unchecked preference cannot disable automatic choice shuffling.",
);
store.updateSettings({ autoPronounceChoices: false });
assert.equal(store.getSettings().autoPronounceChoices, false, "Learners can explicitly disable choice pronunciation.");

let currentAuthUserId = "student-a";
let authStateListener = null;
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
    onAuthStateChange: (callback) => {
      authStateListener = callback;
      return { data: { subscription: { unsubscribe() {} } } };
    },
    signInWithPassword: async () => ({
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
let deferredAuthSession = null;
remote.onStudentAuthChange(async (session) => {
  deferredAuthSession = session;
});
assert.equal(typeof authStateListener, "function");
authStateListener("SIGNED_IN", { user: { id: "student-a" } });
assert.equal(
  deferredAuthSession,
  null,
  "Supabase auth callbacks return before application database work starts.",
);
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(deferredAuthSession?.user?.id, "student-a");
assert.equal(
  (await remote.signInStudent("learner@example.com", "safe-test-password")).data.session.user.id,
  "student-a",
  "Password sign-in settles normally after auth listeners are registered.",
);
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

const lessonScript = fs.readFileSync(path.join(root, "src", "lesson.js"), "utf8");
const lessonPage = fs.readFileSync(path.join(root, "lesson.html"), "utf8");
const audioScript = fs.readFileSync(path.join(root, "src", "audio.js"), "utf8");
const localServer = fs.readFileSync(path.join(root, "scripts", "serve.mjs"), "utf8");
assert.match(lessonScript, /orderFor\(`\$\{question\.id\}:choices`, ids, true\)/);
assert.match(lessonScript, /state\.questionOrder = shuffleArray\(state\.questionOrder\)/);
assert.doesNotMatch(lessonPage, /id="shuffleChoices"/);
assert.match(lessonPage, /Questions &amp; choices shuffle automatically/);
assert.match(lessonPage, /id="voiceToggle"/);
assert.match(lessonPage, /id="sfxToggle"/);
assert.match(lessonPage, /id="ambientToggle"/);
assert.match(lessonPage, /id="ambientTrack"/);
assert.match(lessonPage, /id="ambientVolume"/);
assert.match(lessonPage, /first tap or key press/);
assert.match(lessonPage, /Five real instrumental tracks/);
assert.match(lessonPage, /Clear Air/);
assert.doesNotMatch(lessonPage, /data-ui-en="Music credits"/);
assert.match(lessonPage, /CC BY 4\.0/);
assert.match(lessonScript, /setAmbientPlayback/);
assert.match(lessonScript, /syncAmbientFromSettings/);
assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /id="ambientVolume"/);
assert.match(fs.readFileSync(path.join(root, "phrases.html"), "utf8"), /id="ambientVolume"/);
assert.match(audioScript, /dataset\.ambientState = state/);
assert.match(audioScript, /waiting-for-gesture/);
assert.match(audioScript, /\["pointerdown", "keydown", "touchstart"\]/);
assert.match(audioScript, /export function ambientPlaybackStatus/);
assert.match(audioScript, /function ambientStartPrompt/);
assert.match(audioScript, /id = "ambientStartPrompt"/);
assert.match(audioScript, /Begin with music \/ BGMと一緒に始める/);
assert.match(audioScript, /AMBIENT_PROMPT_VISIBLE_MS = 4200/);
assert.match(audioScript, /prompt\.classList\.add\("is-leaving"\)/);
assert.match(audioScript, /prompt\.dataset\.ambientDismissed = "true"/);
assert.match(audioScript, /assets\/audio\/ambient\/clear-air\.m4a/);
assert.doesNotMatch(audioScript, /buildAmbientGraph|addAmbientTone|addAmbientTexture/);
assert.match(lessonScript, /playCompletionSound/);
assert.match(lessonScript, /speech-diagnostic-compare/);
assert.match(lessonScript, /I heard/);
assert.match(lessonScript, /NEXT STEP/);
assert.match(localServer, /"\.webp": "image\/webp"/);
assert.match(localServer, /"\.mp3": "audio\/mpeg"/);
assert.match(localServer, /"\.m4a": "audio\/mp4"/);

const {
  AMBIENT_TRACKS,
  ambientPlaybackStatus,
  duckAmbient,
  normalizePlaybackRate,
  playInterfaceSound,
  setAmbientPlayback,
  speakText,
  speakingFeedbackForSimilarity,
  speakingFeedbackForTranscript,
  splitSpeechSegments,
} = await import("../src/audio.js");
assert.deepEqual(Object.keys(AMBIENT_TRACKS), ["calm_focus", "lofi_study", "quiet_morning", "night_focus", "rainy_desk"]);
assert.equal(normalizePlaybackRate(0.5), 0.5);
assert.equal(normalizePlaybackRate("1.5"), 1.5);
assert.equal(normalizePlaybackRate(0.75), 1);
assert.deepEqual(
  splitSpeechSegments("注文するときは “I’d like pasta, please.” が丁寧で自然です。", "ja")
    .map(({ language, text }) => [language, text]),
  [
    ["ja", "注文するときは “"],
    ["en", "I’d like pasta, please.”"],
    ["ja", "が丁寧で自然です。"],
  ],
  "Quoted English in a Japanese explanation is delegated to the English voice.",
);
assert.deepEqual(
  splitSpeechSegments("“What would you like to drink?” は自然で丁寧な聞き方です。", "ja")
    .map(({ language }) => language),
  ["en", "ja"],
  "A Japanese explanation may begin with a natural English model phrase.",
);

const originalAudio = globalThis.Audio;
const originalFetch = globalThis.fetch;
const audioInstances = [];
const speechRequests = [];
globalThis.Audio = class FakeAudio {
  constructor(source) {
    this.source = source;
    this.readyState = 4;
    this.currentTime = 0;
    this.duration = 180;
    this.paused = true;
    this.playbackRate = 1;
    this.defaultPlaybackRate = 1;
    audioInstances.push(this);
  }

  addEventListener() {}
  pause() { this.paused = true; }
  removeAttribute() {}
  load() {}

  play() {
    this.paused = false;
    queueMicrotask(() => {
      this.onplaying?.();
      this.onended?.();
    });
    return Promise.resolve();
  }
};
globalThis.fetch = async (_url, options = {}) => {
  speechRequests.push(JSON.parse(options.body || "{}"));
  return {
    ok: true,
    blob: async () => new Blob([new Uint8Array(256)], { type: "audio/mpeg" }),
  };
};
const ambientResult = await setAmbientPlayback(true, {
  ambientEnabled: true,
  ambientTrack: "calm_focus",
  ambientVolume: 0.18,
  userGesture: true,
});
assert.equal(ambientResult.played, true, "A user gesture starts the real study-music file.");
assert.equal(ambientResult.source, "/assets/audio/ambient/clear-air.m4a");
assert.equal(audioInstances.at(-1).source, "/assets/audio/ambient/clear-air.m4a");
assert.equal(audioInstances.at(-1).loop, true, "Study music loops continuously.");
assert.equal(audioInstances.at(-1).volume, 0.18);
duckAmbient(true);
assert(Math.abs(audioInstances.at(-1).volume - 0.0432) < 0.00001, "Study music softens while speech plays.");
duckAmbient(false);
assert.equal(ambientPlaybackStatus().contextState, "playing");
await setAmbientPlayback(false, { ambientEnabled: false });
assert.equal(audioInstances.at(-1).paused, true);
const slowVoice = await speakText("Playback rate check.", { language: "en", rate: 0.5 });
assert.equal(slowVoice.played, true);
assert.equal(slowVoice.rate, 0.5);
assert.equal(audioInstances.at(-1).playbackRate, 0.5, "The audio element receives the selected slow rate.");
assert.equal(audioInstances.at(-1).volume, 1, "Voice has its own volume independent of SFX and Ambient.");
const mixedVoice = await speakText(
  "注文するときは “I’d like pasta, please.” が丁寧で自然です。",
  { language: "ja", voice: "us", rate: 1.5 },
);
assert.equal(mixedVoice.played, true);
assert.equal(mixedVoice.rate, 1.5);
assert(audioInstances.slice(-3).every(({ playbackRate }) => playbackRate === 1.5));
assert.deepEqual(
  speechRequests.slice(-3).map(({ accent }) => accent),
  ["ja", "us", "ja"],
  "Mixed explanations request Nanami, Ava, then Nanami in their natural language order.",
);
assert.equal(playInterfaceSound("click").reason, "unsupported", "Procedural SFX fails safely without Web Audio.");
if (originalAudio === undefined) delete globalThis.Audio;
else globalThis.Audio = originalAudio;
if (originalFetch === undefined) delete globalThis.fetch;
else globalThis.fetch = originalFetch;

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
const changedWordFeedback = speakingFeedbackForTranscript(
  "reason with someone",
  "reasonable with someone",
  () => 0,
);
assert.equal(changedWordFeedback.band, "word-mismatch");
assert.equal(changedWordFeedback.matched, false);
assert.match(changedWordFeedback.messageEn, /reasonable.*reason/i);
const differentSentenceFeedback = speakingFeedbackForTranscript(
  "I haven’t taken a bath yet.",
  "How are you",
  () => 0,
);
assert.equal(differentSentenceFeedback.band, "different-sentence");
assert.equal(differentSentenceFeedback.matched, false);
assert.match(differentSentenceFeedback.messageEn, /different sentence/i);
assert.doesNotMatch(differentSentenceFeedback.messageEn, /one word/i);
assert.equal(differentSentenceFeedback.heardText, "How are you");
assert.equal(differentSentenceFeedback.targetText, "I haven’t taken a bath yet.");
assert(differentSentenceFeedback.missing.length >= 3);
const multipleDifferenceFeedback = speakingFeedbackForTranscript(
  "I haven’t taken a bath yet.",
  "I have taken shower",
  () => 0,
);
assert.equal(multipleDifferenceFeedback.band, "sentence-mismatch");
assert.match(multipleDifferenceFeedback.messageEn, /parts need attention/i);

const { DEEP_LESSON_GUIDES } = await import("../src/lesson-guides.js");
assert.equal(Object.keys(DEEP_LESSON_GUIDES).length, 17, "All 17 lessons have detailed lesson guides.");
assert(Object.values(DEEP_LESSON_GUIDES).every((guide) => guide.points.length >= 3));
assert(Object.values(DEEP_LESSON_GUIDES).every((guide) => guide.corrections.length >= 2));

const i18nSource = fs.readFileSync(path.join(root, "src/i18n.js"), "utf8");
assert.match(i18nSource, /data-ui-lines/);
assert.match(i18nSource, /ui-line-ja/);

const { normalizeJapaneseMeaning } = await import("../src/data.js");
assert.equal(
  normalizeJapaneseMeaning("語順を並べましょう：彼女が言ったことが聞こえませんでした。"),
  "彼女が言ったことが聞こえませんでした。",
  "Phrase cards remove exercise instructions and retain the real Japanese meaning.",
);
assert.equal(
  normalizeJapaneseMeaning("聞こえた英文をそのまま入力してください。"),
  "",
  "Instruction-only Japanese is never displayed as a phrase translation.",
);
assert.equal(
  normalizeJapaneseMeaning("「今マレーシアにいたらいいのに。」に合う英文を選んでください。"),
  "今マレーシアにいたらいいのに。",
  "Quoted Japanese targets remain available as the actual meaning.",
);

const hubScript = fs.readFileSync(path.join(root, "src", "hub.js"), "utf8");
const phraseScript = fs.readFileSync(path.join(root, "src", "phrases.js"), "utf8");
const sharedStyles = fs.readFileSync(path.join(root, "src", "styles.css"), "utf8");
assert.match(lessonScript, /querySelectorAll\("\[data-audio-text\]"\)/);
assert.match(lessonScript, /Listen to the question/);
assert.match(lessonScript, /Listen to choice/);
assert.match(lessonScript, /Listen to the explanation/);
assert.match(lessonScript, /Listen to your sentence/);
assert.match(lessonScript, /Listen to the original/);
assert.match(lessonScript, /matching-term/);
assert.match(lessonScript, /sorting-category-audio/);
assert.match(lessonScript, /playAnswerFeedback\(Boolean\(correct\)\)/);
assert.doesNotMatch(lessonScript, /navigator\.vibrate|vibrationToggle/);
assert.match(lessonScript, /Date\.now\(\) \+ 5000/);
assert.match(lessonScript, /data-audio-secondary-text/);
assert.doesNotMatch(lessonScript, /aria-label="\$\{escapeHTML\(`\$\{label\}: \$\{cleanText\}`\)\}"/);
assert.match(lessonScript, /elements\.checkAnswered\.removeAttribute\("aria-label"\)/);
assert.match(lessonScript, /result = await play\([\s\S]{0,160}audioSecondaryText/);
assert.match(lessonScript, /rate: state\.settings\.playbackRate/);
assert.match(lessonScript, /<details class="guide-card/);
assert.match(lessonPage, /data-hint-mode="auto"/);
assert.match(lessonPage, /data-hint-mode="manual"/);
assert.match(
  sharedStyles,
  /@media \(max-width: 620px\)[\s\S]*?\.hint-mode-toggle button \{ white-space: normal; overflow-wrap: anywhere; \}/,
  "Bilingual hint controls wrap instead of causing horizontal mobile overflow.",
);
assert.doesNotMatch(lessonPage, /id="vibrationToggle"/);
assert.match(lessonScript, /onStudentAuthChange/);
assert.match(lessonScript, /authScopeLocked = true/);
assert.match(lessonScript, /window\.location\.reload\(\)/);
assert.match(
  lessonScript,
  /lessonPathMatch[\s\S]{0,180}decodeURIComponent\(lessonPathMatch\?\.\[1\]/,
  "Netlify /lesson/:slug rewrites retain a usable lesson ID in the browser.",
);
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
console.log("  ✓ lesson text audio, hint timer and sound feedback hooks");
