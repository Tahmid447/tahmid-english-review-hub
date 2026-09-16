import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
const release = JSON.parse(read("release.json"));
assert.equal(release.hosting, "cloudflare-pages", "Run build:cloudflare first.");
assert.match(release.commit, /^[a-f0-9]{40}$/);
assert.equal(release.cache, `te-review-public-cf-${release.commit.slice(0, 12)}`);
assert(read("sw.js").includes(`const CACHE_NAME = ${JSON.stringify(release.cache)};`));

// A real Pages runtime/browser smoke test additionally verifies canonical
// redirects, nested refreshes, asset loading, queries and OAuth returns.
const routes = read("_redirects").trim().split("\n").map((line) => line.split(/\s+/));
for (const [from, to, status] of routes) {
  assert(["200", "301"].includes(status), `Unsupported redirect: ${from}`);
  assert(!to.includes(".html"), `Avoid canonical redirect cycles: ${from}`);
  if (status === "200") {
    assert(fs.existsSync(path.join(dist, `${to.slice(1)}.html`)), `Missing target ${to}`);
  }
}
assert(routes.some(([from, to]) => from === "/lesson/*" && to === "/lesson"));
for (const page of ["index", "lessons", "my-page", "teacher", "lesson", "learn", "phrases", "pricing", "404"]) {
  assert(fs.existsSync(path.join(dist, `${page}.html`)), `Missing ${page}`);
}
assert.equal(release.speechBackend, "cloudflare-workers");
assert.equal(release.assetVersion, `cf-${release.commit.slice(0, 12)}`);
assert(read("lesson.html").includes(`/src/lesson.js?v=${release.assetVersion}`));
assert(read("src/audio.js").includes(`./config.js?v=${release.assetVersion}`));
for (const module of ['lesson-note-studio','lesson-note-model','lesson-note-view','note-practice-model','note-import-images']) {
  const parent=module==='lesson-note-studio'?'teacher': 'lesson-note-studio';
  assert(read(`src/${parent}.js`).includes(`./${module}.js?v=${release.assetVersion}`), `Unversioned lesson dependency: ${module}`);
}
for (const css of ['lesson-notes','learning-overview']) assert(read('teacher.html').includes(`/src/${css}.css?v=${release.assetVersion}`));
assert(read('_headers').includes('/src/*\n  Cache-Control: no-cache'));
assert(read('_headers').includes('/teacher\n  Cache-Control: no-store'));
const config = read("src/config.js");
assert(config.includes('NATURAL_SPEECH_URL = "https://speech.tahmidenglishhub.dpdns.org/api/natural-speech"'));
assert(config.includes("https://ycmybggetemkhorkhfnf.supabase.co"));
assert(read("_headers").includes("connect-src 'self' https://speech.tahmidenglishhub.dpdns.org"));
assert(read("src/audio.js").includes('NATURAL_SPEECH_URL.startsWith(`${SUPABASE_URL}/functions/`)'));
assert(read("src/lesson.js").includes("lessonPathMatch"), "Nested lessons must read the displayed route.");
assert(read("src/learn.js").includes('path === "/words"'), "Words alias must survive an internal rewrite.");

// Prevent private deployment inputs and server-side sources from being served.
const forbidden = new Set([".git", ".env", ".dev.vars", "node_modules", "supabase", "backups", "private-backups", "netlify.toml"]);
let checked = 0;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    assert(!forbidden.has(entry.name), `Private path in public output: ${entry.name}`);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.(?:js|json|html|css|webmanifest)$/.test(entry.name)) continue;
    checked++;
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']((?:\.{1,2}\/|\/)[^"'\s]+\.js(?:\?[^"'\s]*)?)["']/g)) assert.equal(new URL(match[1], 'https://build.invalid/').searchParams.get('v'), release.assetVersion, `Missing build hash in ${file}: ${match[1]}`);
    if (entry.name.endsWith('.html')) for (const match of text.matchAll(/(?:src|href)=["']((?:\.{1,2}\/|\/)[^"'\s]+\.(?:js|css)(?:\?[^"'\s]*)?)["']/g)) assert.equal(new URL(match[1], 'https://build.invalid/').searchParams.get('v'), release.assetVersion, `Unversioned HTML asset in ${file}: ${match[1]}`);
    for (const match of text.matchAll(/\.(?:js|css)\?v=([A-Za-z0-9._-]+)/g)) assert.equal(match[1], release.assetVersion, `Stale public module URL in ${file}`);
    assert(!/https?:\/\/[^\s"\'<>]*netlify\.app|\/\.netlify\/functions\//i.test(text), `Netlify dependency in ${path.relative(dist, file)}`);
    assert(!/sb_secret_[\w-]{20,}|sbp_[a-f0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text), `Secret pattern in ${path.relative(dist, file)}`);
    for (const match of text.matchAll(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g)) {
      const payload = JSON.parse(Buffer.from(match[0].split(".")[1], "base64url"));
      assert.equal(payload.role, "anon", `Non-public JWT in ${path.relative(dist, file)}`);
    }
  }
}
scan(dist);
console.log(`Cloudflare build checks passed: routes, speech endpoint, headers and ${checked} public text assets.`);
