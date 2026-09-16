import fs from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const speechOrigin = "https://speech.tahmidenglishhub.dpdns.org";
const speechEndpoint = `${speechOrigin}/api/natural-speech`;

// The speech Worker is deployed from this same repository. No Netlify fallback
// or account credentials are used by pronunciation requests.
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
  "/my-page/notes /lesson-notes 200",
  "/my-page/notes/* /lesson-notes 200",
  "",
].join("\n"));

const headersPath = new URL("_headers", dist);
let headers = fs.readFileSync(headersPath, "utf8");
if (!headers.includes("connect-src 'self'")) throw new Error("Missing connection policy.");
headers = headers.replace("connect-src 'self'", `connect-src 'self' ${speechOrigin}`);
headers += "\n/release.json\n  Cache-Control: no-store\n\n/src/*\n  Cache-Control: no-cache\n";
for (const route of ['/teacher','/teacher.html','/my-page','/my-page/*','/my-page.html','/lesson-notes','/lesson-notes.html']) headers += `\n${route}\n  Cache-Control: no-store\n`;
fs.writeFileSync(headersPath, headers);

const releasePath = new URL("release.json", dist);
const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
release.hosting = "cloudflare-pages";
release.speechBackend = "cloudflare-workers";
// Existing modules have versioned URLs and are cached by the service worker.
// Change its cache namespace on every source commit so a normal Git deployment
// also invalidates old code without a separate manual cache-version edit.
release.cache = `te-review-public-cf-${release.commit.slice(0, 12)}`;
const workerPath = new URL("sw.js", dist);
const worker = fs.readFileSync(workerPath, "utf8");
if (!/const CACHE_NAME = "[^"]+";/.test(worker)) throw new Error("Missing public cache version.");
fs.writeFileSync(workerPath, worker.replace(/const CACHE_NAME = "[^"]+";/, `const CACHE_NAME = ${JSON.stringify(release.cache)};`));
// A returning browser may still be controlled by the previous service worker
// while the new one installs. Version the entire module graph as well as its
// cache, so fresh HTML cannot combine a new CSP with an old speech endpoint.
release.assetVersion = `cf-${release.commit.slice(0, 12)}`;
const stampReference = reference => {
  const url = new URL(reference, 'https://build.invalid/');
  url.searchParams.set('v', release.assetVersion);
  return reference.split(/[?#]/)[0] + url.search + url.hash;
};
function stampPublicAssets(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) { stampPublicAssets(file); continue; }
    if (!/\.(?:html|js|css)$/.test(entry.name)) continue;
    const text = fs.readFileSync(file, "utf8");
    let stamped = text.replace(/(\.(?:js|css)\?v=)[A-Za-z0-9._-]+/g, `$1${release.assetVersion}`);
    // Include new imports/styles that have no handwritten version query yet.
    // Do not stamp ordinary path constants such as the service worker allowlist.
    if (/\.(?:js|html)$/.test(entry.name)) stamped = stamped.replace(/(\bfrom\s*|\bimport\s*(?:\(\s*)?)(['"])((?:\.{1,2}\/|\/)[^'"\s]+\.js(?:\?[^'"\s]*)?)\2/g, (_, prefix, quote, reference) => prefix + quote + stampReference(reference) + quote);
    if (entry.name.endsWith('.html')) stamped = stamped.replace(/((?:src|href)=)(['"])((?:\.{1,2}\/|\/)[^'"\s]+\.(?:js|css)(?:\?[^'"\s]*)?)\2/g, (_, prefix, quote, reference) => prefix + quote + stampReference(reference) + quote);
    if (entry.name.endsWith('.css')) stamped = stamped.replace(/(@import\s+)(['"])((?:\.{1,2}\/|\/)[^'"\s]+\.css(?:\?[^'"\s]*)?)\2/g, (_, prefix, quote, reference) => prefix + quote + stampReference(reference) + quote);
    if (stamped !== text) fs.writeFileSync(file, stamped);
  }
}
stampPublicAssets(dist);
fs.writeFileSync(releasePath, `${JSON.stringify(release, null, 2)}\n`);
console.log("Cloudflare Pages output prepared; pronunciation runs on Cloudflare Workers.");
