import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createDemoServer } from "./serve-demo.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const demoDist = path.join(root, "demo-dist");

const runNode = (script) => {
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${script} failed:\n${result.stdout}\n${result.stderr}`);
};

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const child = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(child) : [child];
  });

const directoryDigest = (directory) => {
  const digest = crypto.createHash("sha256");
  for (const file of walk(directory).sort()) {
    digest.update(path.relative(directory, file));
    digest.update(fs.readFileSync(file));
  }
  return digest.digest("hex");
};

runNode("scripts/build.mjs");
const productionFiles = walk(dist).map((file) => path.relative(dist, file));
for (const forbidden of [
  "demo-data/curriculum.json",
  "src/demo-curriculum-api.js",
  "src/demo-student-visibility.js",
  "src/demo-shell.js",
  "src/personas.js",
  "src/demo-teacher.js",
  "src/demo-teacher.css",
  "src/learn-demo.js",
]) {
  assert(!productionFiles.includes(forbidden), `Production dist must exclude ${forbidden}.`);
}
const productionHtml = fs.readFileSync(path.join(dist, "learn.html"), "utf8");
assert(!productionHtml.includes("LOCAL DEMO"));
assert(!productionHtml.includes("learn-demo.js"));
const productionDigestBeforeDemo = directoryDigest(dist);

runNode("scripts/build-demo.mjs");
assert.equal(directoryDigest(dist), productionDigestBeforeDemo, "Generating the demo must not mutate production dist.");

const demoHtml = fs.readFileSync(path.join(demoDist, "learn.html"), "utf8");
assert.match(demoHtml, /LOCAL DEMO/);
assert.match(demoHtml, /learn-demo\.js/);
assert.match(demoHtml, /demo-shell\.js/);
assert.match(demoHtml, /demo\.css/);
assert.match(demoHtml, /noindex,nofollow,noarchive/);
assert.doesNotMatch(demoHtml, /supabase-js/);
assert.doesNotMatch(demoHtml, /\/src\/pwa\.js/);
assert.equal(fs.existsSync(path.join(demoDist, "sw.js")), false, "A local demo must not register the production service worker.");
assert.equal(fs.existsSync(path.join(demoDist, "teacher.html")), true, "The demo includes an editable local Teacher Studio.");

const demoEntry = fs.readFileSync(path.join(demoDist, "src", "learn-demo.js"), "utf8");
assert.match(demoEntry, /\.\/demo-curriculum-api\.js/);
assert.match(demoEntry, /\.\/demo-student-visibility\.js/);
assert.match(demoEntry, /\.\/demo-supabase\.js/);
assert.doesNotMatch(demoEntry, /from "\.\/curriculum-api\.js/);
assert.doesNotMatch(demoEntry, /from "\.\/student-visibility\.js/);
const demoTeacherCss = fs.readFileSync(path.join(demoDist, "src", "demo-teacher.css"), "utf8");
assert.match(
  demoTeacherCss,
  /\.demo-switch input\s*\{[\s\S]*?width:\s*1px;[\s\S]*?clip-path:\s*inset\(50%\)/,
  "Hidden Teacher Demo checkboxes must not widen the viewport.",
);

const curriculum = JSON.parse(fs.readFileSync(path.join(demoDist, "demo-data", "curriculum.json"), "utf8"));
assert.equal(curriculum.levels.length, 96);
assert.equal(curriculum.items.length, 480);
assert.deepEqual(
  Object.fromEntries(["words", "phrases", "phonics"].map((category) => [
    category,
    curriculum.items.filter((item) => item.category === category).length,
  ])),
  { words: 320, phrases: 128, phonics: 32 },
);
for (const category of ["words", "phrases", "phonics"]) {
  assert.deepEqual(
    [...new Set(curriculum.levels.filter((entry) => entry.category === category).map((entry) => entry.level))],
    Array.from({ length: 32 }, (_, index) => index + 1),
    `${category} needs all 32 local demo levels.`,
  );
}

const storage = new Map();
const originalLocation = globalThis.location;
const originalLocalStorage = globalThis.localStorage;
const originalFetch = globalThis.fetch;
Object.defineProperty(globalThis, "location", {
  configurable: true,
  value: new URL("http://127.0.0.1:4174/learn?category=words&level=1"),
});
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
});
globalThis.fetch = async (url) => {
  assert.equal(url, "/demo-data/curriculum.json");
  return { ok: true, json: async () => curriculum };
};

try {
  const personas = await import(`../demo/personas.js?test=${Date.now()}`);
  const api = await import(`../demo/curriculum-api.js?test=${Date.now()}`);
  let items = await api.fetchCurriculumItems({ category: "words" });
  assert.equal(items.data.length, 320, "The Full Curriculum persona can inspect every word.");
  let levels = await api.fetchCurriculumLevels("words");
  assert.equal(levels.data.length, 32, "The Full Curriculum persona can inspect all 32 word levels.");

  personas.setDemoPersonaKey("starter");
  items = await api.fetchCurriculumItems({ category: "phrases" });
  assert.equal(items.data.length, 16, "The new-learner persona is limited to four phrase levels.");
  levels = await api.fetchCurriculumLevels("phrases");
  assert.deepEqual(levels.data.map((entry) => entry.level), [1, 2, 3, 4]);

  personas.setDemoPersonaKey("personal");
  items = await api.fetchCurriculumItems({ category: "words", level: 1 });
  assert.equal(items.data.length, 9, "An individually blocked item is hidden in the personal learner preview.");
  items = await api.fetchCurriculumItems({ category: "phrases", level: 16 });
  assert.deepEqual(items.data.map((item) => item.id), ["phrase-l16-01"], "An individual allow can open one out-of-range item.");

  personas.saveDemoPersonaSettings("personal", {
    show_phrases: false,
    allowed_level_min: 1,
    allowed_level_max: 2,
    allowed_levels: [],
  });
  items = await api.fetchCurriculumItems({ category: "phrases" });
  assert.equal(items.data.length, 0, "Teacher Demo edits immediately drive the learner-side adapter.");
  personas.resetDemoPersonaSettings("personal");

  const favorite = await api.toggleCurriculumFavorite("word-l01-book", true);
  assert.equal(favorite.data, true);
  let progress = await api.fetchCurriculumProgress();
  assert(progress.data.favorites.some((row) => row.item_id === "word-l01-book"));
  assert(progress.data.progress.some((row) => row.item_id === "word-l01-chair" && new Date(row.next_review_at) < new Date()), "The first demo visit includes a due review example.");

  const saved = await api.saveCurriculumProgress("word-l01-book", { status: "reviewed", selfRating: "good" });
  assert.equal(saved.data.status, "reviewed");
  assert.equal(saved.data.review_count, 1);
  const dueInDays = (new Date(saved.data.next_review_at).getTime() - Date.now()) / 86400000;
  assert(dueInDays > 2.99 && dueInDays <= 3.01, "Good schedules another review in three days.");
  progress = await api.fetchCurriculumProgress();
  assert(progress.data.progress.some((row) => row.item_id === "word-l01-book" && row.status === "reviewed"));

  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: new URL("https://preview.example/learn?persona=full"),
  });
  assert.throws(() => personas.assertLocalDemoRuntime(), /only on this computer/i);
} finally {
  if (originalLocation === undefined) delete globalThis.location;
  else Object.defineProperty(globalThis, "location", { configurable: true, value: originalLocation });
  if (originalLocalStorage === undefined) delete globalThis.localStorage;
  else Object.defineProperty(globalThis, "localStorage", { configurable: true, value: originalLocalStorage });
  globalThis.fetch = originalFetch;
}

const server = createDemoServer({ root: demoDist });
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
try {
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const rootResponse = await fetch(`${origin}/`, { redirect: "manual" });
  assert.equal(rootResponse.status, 302);
  assert.equal(rootResponse.headers.get("location"), "/learn?category=words&level=1&persona=full");
  const pageResponse = await fetch(`${origin}/learn?category=words&level=1`);
  assert.equal(pageResponse.status, 200);
  assert.match(pageResponse.headers.get("content-type"), /^text\/html/);
  assert.match(pageResponse.headers.get("content-security-policy"), /worker-src 'none'/);
  const cssResponse = await fetch(`${origin}/src/styles.css`);
  assert.equal(cssResponse.status, 200);
  assert.match(cssResponse.headers.get("content-type"), /^text\/css/);
  const teacherResponse = await fetch(`${origin}/teacher?persona=personal`);
  assert.equal(teacherResponse.status, 200);
  assert.match(await teacherResponse.text(), /Student visibility lab/i);
  const traversalResponse = await fetch(`${origin}/..%2Fpackage.json`);
  assert.equal(traversalResponse.status, 404);
  const hostileHostStatus = await new Promise((resolve, reject) => {
    const request = http.request({
      hostname: "127.0.0.1",
      port: address.port,
      path: "/learn",
      headers: { host: "preview.example" },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve(response.statusCode));
    });
    request.on("error", reject);
    request.end();
  });
  assert.equal(hostileHostStatus, 403, "Host-header rebinding cannot expose the local demo server.");
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log("Local demo preview checks passed (96 levels, 480 items, personas, storage and loopback isolation). ");
