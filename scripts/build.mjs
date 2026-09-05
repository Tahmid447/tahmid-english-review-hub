import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const files = [
  "index.html",
  "teacher.html",
  "lesson.html",
  "learn.html",
  "phrases.html",
  "pricing.html",
  "pricing-layout-preview.html",
  "music-credits.html",
  "illustration-credits.html",
  "404.html",
  "offline.html",
  "manifest.webmanifest",
  "sw.js",
];
const publicSourceFiles = [
  "audio.js",
  "speech-contract.js",
  "curriculum-audio.js",
  "curriculum-access.js",
  "phonics-visuals.js",
  "config.js",
  "data.js",
  "effects.js",
  "hub.js",
  "i18n.js",
  "lesson.js",
  "lesson-grading.js",
  "lesson-guides.js",
  "lesson-guide-targets.js",
  "lesson-source.js",
  "learn.js",
  "learn.css",
  "curriculum-visuals.js",
  "curriculum-visuals.css",
  "curriculum-api.js",
  "student-visibility.js",
  "student-shell.js",
  "phrases.js",
  "plans.js",
  "pricing.js",
  "pricing-layout-preview.js",
  "premium-tasks.js",
  "pwa.js",
  "store.js",
  "study-music.js",
  "styles.css",
  "supabase.js",
  "teacher.js",
];
const publicDataFiles = [];
const offlinePreviewIds = new Set(["june-28", "june-29"]);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
const commit = process.env.COMMIT_REF || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(dist, 'release.json'), JSON.stringify({ version: '10.1.0', commit, builtAt: new Date().toISOString(), cache: 'te-review-public-v23' }, null, 2) + '\n');

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
  fs.cpSync(assets, path.join(dist, "assets"), {
    recursive: true,
    filter: (source) => path.basename(source) !== ".DS_Store",
  });
}

fs.writeFileSync(
  path.join(dist, "_redirects"),
  [
    "/takiwaki /?legacy=takiwaki 301!",
    "/takiwaki.html /?legacy=takiwaki 301!",
    "/teacher /teacher.html 200",
    "/lesson/* /lesson.html?id=:splat 200",
    "/learn /learn.html 200",
    "/words /learn.html?category=words 200",
    "/phonics /learn.html?category=phonics 200",
    "/phrases /phrases.html 200",
    "/plans /pricing.html 200",
    "/pricing-layout-preview /pricing-layout-preview.html 200",
    "/music-credits /music-credits.html 200",
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
    "  Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "  Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob: https://ycmybggetemkhorkhfnf.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co; worker-src 'self' blob:; manifest-src 'self'; form-action 'self'; upgrade-insecure-requests",
    "",
    "/sw.js",
    "  Cache-Control: no-cache, no-store, must-revalidate",
    "",
    "/manifest.webmanifest",
    "  Cache-Control: public, max-age=3600",
    "",
    "/assets/curriculum/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/assets/audio/ambient/*",
    "  Cache-Control: public, max-age=31536000, immutable",
  ].join("\n") + "\n",
);

const forbiddenPublicFiles = [
  path.join(dist, "src", "data", "notion-drafts.json"),
  path.join(dist, "src", "data", "curriculum.js"),
  path.join(dist, "demo-data", "curriculum.json"),
  path.join(dist, "src", "demo-curriculum-api.js"),
  path.join(dist, "src", "demo-student-visibility.js"),
  path.join(dist, "src", "demo-shell.js"),
  path.join(dist, "src", "personas.js"),
  path.join(dist, "src", "demo-teacher.js"),
  path.join(dist, "src", "demo-teacher.css"),
  path.join(dist, "src", "learn-demo.js"),
];
if (forbiddenPublicFiles.some((file) => fs.existsSync(file))) {
  throw new Error("Private authoring data was copied into the public build.");
}

console.log("Static site built in dist/ (private draft sources excluded).");
