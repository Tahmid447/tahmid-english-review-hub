import fs from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const speechOrigin = "https://tahmid-english-review-hub.netlify.app";
const speechEndpoint = `${speechOrigin}/.netlify/functions/natural-speech`;

// Keep the proven Node speech backend during migration. The browser connects
// directly, preserving per-client Netlify rate limiting and avoiding a shared
// proxy IP. No Supabase credentials are sent to this endpoint. Retiring Netlify
// requires a separately verified migration of this backend.
const configPath = new URL("src/config.js", dist);
let config = fs.readFileSync(configPath, "utf8");
const endpointDeclaration = /export const NATURAL_SPEECH_URL = [^;]+;/;
if (!endpointDeclaration.test(config)) throw new Error("Missing speech configuration.");
config = config.replace(endpointDeclaration, `export const NATURAL_SPEECH_URL = ${JSON.stringify(speechEndpoint)};`);
fs.writeFileSync(configPath, config);

// Pages serves clean /name paths for name.html itself. Rewriting those paths
// back to .html can conflict with that canonicalization. Only aliases need
// rules here. The app already derives lesson IDs and categories from paths.
fs.writeFileSync(new URL("_redirects", dist), [
  "/takiwaki /?legacy=takiwaki 301",
  "/takiwaki.html /?legacy=takiwaki 301",
  "/words /learn 200",
  "/phonics /learn 200",
  "/plans /pricing 200",
  "/lesson/* /lesson 200",
  "",
].join("\n"));

const headersPath = new URL("_headers", dist);
let headers = fs.readFileSync(headersPath, "utf8");
if (!headers.includes("connect-src 'self'")) throw new Error("Missing connection policy.");
headers = headers.replace("connect-src 'self'", `connect-src 'self' ${speechOrigin}`);
headers += "\n/release.json\n  Cache-Control: no-store\n\n/src/config.js\n  Cache-Control: no-cache\n";
fs.writeFileSync(headersPath, headers);

const releasePath = new URL("release.json", dist);
const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
release.hosting = "cloudflare-pages";
release.speechBackend = "existing-netlify-function";
// Existing modules have versioned URLs and are cached by the service worker.
// Change its cache namespace on every source commit so a normal Git deployment
// also invalidates old code without a separate manual cache-version edit.
release.cache = `te-review-public-cf-${release.commit.slice(0, 12)}`;
const workerPath = new URL("sw.js", dist);
const worker = fs.readFileSync(workerPath, "utf8");
if (!/const CACHE_NAME = "[^"]+";/.test(worker)) throw new Error("Missing public cache version.");
fs.writeFileSync(workerPath, worker.replace(/const CACHE_NAME = "[^"]+";/, `const CACHE_NAME = ${JSON.stringify(release.cache)};`));
fs.writeFileSync(releasePath, `${JSON.stringify(release, null, 2)}\n`);
console.log("Cloudflare Pages output prepared; existing Netlify speech service retained.");
