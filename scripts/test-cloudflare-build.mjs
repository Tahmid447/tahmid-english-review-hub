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
const config = read("src/config.js");
assert(config.includes('NATURAL_SPEECH_URL = "https://tahmid-english-review-hub.netlify.app/.netlify/functions/natural-speech"'));
assert(config.includes("https://ycmybggetemkhorkhfnf.supabase.co"));
assert(read("_headers").includes("connect-src 'self' https://tahmid-english-review-hub.netlify.app"));
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
    assert(!/sb_secret_[\w-]{20,}|sbp_[a-f0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text), `Secret pattern in ${path.relative(dist, file)}`);
    for (const match of text.matchAll(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g)) {
      const payload = JSON.parse(Buffer.from(match[0].split(".")[1], "base64url"));
      assert.equal(payload.role, "anon", `Non-public JWT in ${path.relative(dist, file)}`);
    }
  }
}
scan(dist);
console.log(`Cloudflare build checks passed: routes, speech endpoint, headers and ${checked} public text assets.`);
