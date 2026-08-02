import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const files = [
  "index.html",
  "takiwaki.html",
  "teacher.html",
  "lesson.html",
  "phrases.html",
  "404.html",
];
const publicSourceFiles = [
  "audio.js",
  "config.js",
  "data.js",
  "effects.js",
  "hub.js",
  "i18n.js",
  "lesson.js",
  "phrases.js",
  "store.js",
  "styles.css",
  "supabase.js",
  "teacher.js",
];
const publicDataFiles = [];
const offlinePreviewIds = new Set(["june-28", "june-29"]);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(dist, file));
}

fs.mkdirSync(path.join(dist, "src", "data"), { recursive: true });
for (const file of publicSourceFiles) {
  fs.copyFileSync(
    path.join(root, "src", file),
    path.join(dist, "src", file),
  );
}
for (const file of publicDataFiles) {
  fs.copyFileSync(
    path.join(root, "src", "data", file),
    path.join(dist, "src", "data", file),
  );
}

// The source repository keeps the complete offline migration catalogue, but a
// production browser should never receive subscriber-only question payloads.
// Only the two advertised preview lessons are bundled as an outage fallback.
const sourceLessons = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "legacy-lessons.json"), "utf8"));
const sourceAdditions = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "legacy-additions.json"), "utf8"));
const previewLessons = sourceLessons.filter((lesson) => offlinePreviewIds.has(lesson.id));
const previewAdditions = Object.fromEntries(
  Object.entries(sourceAdditions).filter(([lessonId]) => offlinePreviewIds.has(lessonId)),
);
fs.writeFileSync(path.join(dist, "src", "data", "legacy-lessons.json"), `${JSON.stringify(previewLessons, null, 2)}\n`);
fs.writeFileSync(path.join(dist, "src", "data", "legacy-additions.json"), `${JSON.stringify(previewAdditions, null, 2)}\n`);

const assets = path.join(root, "assets");
if (fs.existsSync(assets)) {
  fs.cpSync(assets, path.join(dist, "assets"), { recursive: true });
}

fs.writeFileSync(
  path.join(dist, "_redirects"),
  [
    "/takiwaki /takiwaki.html 200",
    "/teacher /teacher.html 200",
    "/lesson/* /lesson.html?id=:splat 200",
    "/phrases /phrases.html 200",
  ].join("\n") + "\n",
);

fs.writeFileSync(
  path.join(dist, "_headers"),
  [
    "/*",
    "  X-Frame-Options: DENY",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: microphone=(self)",
  ].join("\n") + "\n",
);

const forbiddenPublicFiles = [
  path.join(dist, "src", "data", "notion-drafts.json"),
  path.join(dist, "src", "data", "curriculum.js"),
];
if (forbiddenPublicFiles.some((file) => fs.existsSync(file))) {
  throw new Error("Private authoring data was copied into the public build.");
}

console.log("Static site built in dist/ (private draft sources excluded).");
