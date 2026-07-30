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
  "netlify.toml",
];
const publicSourceFiles = [
  "audio.js",
  "config.js",
  "data.js",
  "hub.js",
  "lesson.js",
  "phrases.js",
  "store.js",
  "styles.css",
  "supabase.js",
  "teacher.js",
];
const publicDataFiles = [
  "legacy-lessons.json",
  "legacy-additions.json",
];

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

const forbiddenPublicFiles = [
  path.join(dist, "src", "data", "notion-drafts.json"),
  path.join(dist, "src", "data", "curriculum.js"),
];
if (forbiddenPublicFiles.some((file) => fs.existsSync(file))) {
  throw new Error("Private authoring data was copied into the public build.");
}

console.log("Static site built in dist/ (private draft sources excluded).");
