import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionDist = path.join(root, "dist");
const demoDist = path.join(root, "demo-dist");
const migrationPath = path.join(
  root,
  "supabase",
  "migrations",
  "202609050025_structured_learning_content.sql",
);

if (!fs.existsSync(path.join(productionDist, "learn.html"))) {
  throw new Error("Run the production build before generating the local demo.");
}

const migration = fs.readFileSync(migrationPath, "utf8");
const payloads = [...migration.matchAll(
  /from jsonb_to_recordset\(\$curriculum_seed\$(\[[\s\S]*?\])\$curriculum_seed\$::jsonb\) as value\(/g,
)].map((match) => JSON.parse(match[1]));
if (payloads.length !== 2) {
  throw new Error("The curriculum seed must contain one level payload and one item payload.");
}
const [levels, baselineItems] = payloads;
const goals = JSON.parse(fs.readFileSync(path.join(root, "curriculum", "level-goals.json"), "utf8"));
const items = ["words", "phrases", "phonics"].flatMap((category) => {
  const source = JSON.parse(fs.readFileSync(path.join(root, "curriculum", `${category}.json`), "utf8"));
  return source.levels.flatMap((level) => level.items.map((item) => {
    const baseline = baselineItems.find((row) => row.id === item.id);
    const content = { ...item };
    delete content.id; delete content.level; delete content.icon; delete content.tags;
    if (category === "words") { content.topic = content.category; delete content.category; }
    return { ...baseline, title_en: item.word || item.phrase || item.phonicsTarget,
      title_ja: item.japanese || item.japaneseHint, icon: item.icon || "", tags: item.tags || [], content };
  }));
});
for (const level of levels) {
  const goal = goals.levels.find((goal) => goal.level === level.level)?.[level.category];
  if (goal) { level.description_en = goal.en; level.description_ja = goal.ja; }
}
if (levels.length !== 96 || items.length !== 480) {
  throw new Error(`The demo requires 96 levels and 480 items; found ${levels.length} and ${items.length}.`);
}

fs.rmSync(demoDist, { recursive: true, force: true });
fs.cpSync(productionDist, demoDist, {
  recursive: true,
  filter: (source) => path.basename(source) !== ".DS_Store",
});

const demoDataDirectory = path.join(demoDist, "demo-data");
fs.mkdirSync(demoDataDirectory, { recursive: true });
fs.writeFileSync(
  path.join(demoDataDirectory, "curriculum.json"),
  `${JSON.stringify({ schema: 1, generatedAt: new Date().toISOString(), levels, items })}\n`,
);

const demoModules = Object.freeze({
  "personas.js": "personas.js",
  "curriculum-api.js": "demo-curriculum-api.js",
  "student-visibility.js": "demo-student-visibility.js",
  "supabase.js": "demo-supabase.js",
  "demo-shell.js": "demo-shell.js",
  "demo.css": "demo.css",
  "teacher.js": "demo-teacher.js",
  "teacher.css": "demo-teacher.css",
});
for (const [sourceName, outputName] of Object.entries(demoModules)) {
  fs.copyFileSync(
    path.join(root, "demo", sourceName),
    path.join(demoDist, "src", outputName),
  );
}

const learnSource = fs.readFileSync(path.join(root, "src", "learn.js"), "utf8");
const demoLearnSource = learnSource
  .replace(/\.\/curriculum-api\.js\?v=[A-Za-z0-9_-]+/g, "./demo-curriculum-api.js?v=local-demo1")
  .replace(/\.\/student-visibility\.js\?v=[A-Za-z0-9_-]+/g, "./demo-student-visibility.js?v=local-demo1")
  .replace(/\.\/supabase\.js\?v=[A-Za-z0-9_-]+/g, "./demo-supabase.js?v=local-demo1");
if (demoLearnSource === learnSource || !demoLearnSource.includes("./demo-curriculum-api.js")) {
  throw new Error("The demo learner entry could not be isolated from the production data adapter.");
}
fs.writeFileSync(path.join(demoDist, "src", "learn-demo.js"), demoLearnSource);

const productionHtml = fs.readFileSync(path.join(productionDist, "learn.html"), "utf8");
let demoHtml = productionHtml
  .replace(/\s*<link rel="manifest"[^>]*>/, "")
  .replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js[^>]*><\/script>/, "")
  .replace(/\s*<script type="module" src="\/src\/pwa\.js[^>]*><\/script>/, "")
  .replace(/<script type="module" src="\/src\/learn\.js\?v=[^"]+"><\/script>/, [
    '<script type="module" src="/src/demo-shell.js?v=local-demo1"></script>',
    '<script type="module" src="/src/learn-demo.js?v=local-demo1"></script>',
  ].join("\n  "))
  .replace("</head>", [
    '  <meta name="robots" content="noindex,nofollow,noarchive">',
    '  <link rel="stylesheet" href="/src/demo.css?v=local-demo1">',
    "</head>",
  ].join("\n"));
if (!demoHtml.includes("learn-demo.js") || demoHtml.includes("/src/pwa.js")) {
  throw new Error("The local demo HTML was not transformed safely.");
}
demoHtml = demoHtml.replace("<title>", "<title>LOCAL DEMO · ");
fs.writeFileSync(path.join(demoDist, "learn.html"), demoHtml);
fs.copyFileSync(path.join(root, "demo", "teacher.html"), path.join(demoDist, "teacher.html"));

for (const demoUnsafeFile of ["sw.js", "manifest.webmanifest", "_headers", "_redirects"]) {
  fs.rmSync(path.join(demoDist, demoUnsafeFile), { force: true });
}

console.log("Local-only curriculum demo built in demo-dist/ (96 levels, 480 items).");
