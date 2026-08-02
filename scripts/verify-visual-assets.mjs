import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "visual-question-manifest.json"), "utf8"),
);

const missing = [];
const tooSmall = [];
for (const question of manifest.questions || []) {
  const relative = String(question.asset || "").replace(/^\//, "");
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    missing.push(question.asset);
    continue;
  }
  if (fs.statSync(file).size < 10_000) tooSmall.push(question.asset);
}

if (missing.length || tooSmall.length) {
  if (missing.length) {
    console.error(`Missing ${missing.length} visual assets:`);
    missing.forEach((asset) => console.error(`  - ${asset}`));
  }
  if (tooSmall.length) {
    console.error(`Suspiciously small visual assets (${tooSmall.length}):`);
    tooSmall.forEach((asset) => console.error(`  - ${asset}`));
  }
  process.exitCode = 1;
} else {
  console.log(`Verified ${(manifest.questions || []).length} visual-question assets.`);
}
