import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVisualManifestSources, visualAssetPanelKey } from "./visual-manifest-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { entries } = loadVisualManifestSources(root);

const missing = [];
const tooSmall = [];
const invalidPanels = [];
const duplicatePanels = [];
const seenPanels = new Set();
const physicalAssets = new Map();
for (const question of entries) {
  const visualKey = visualAssetPanelKey(question);
  if (seenPanels.has(visualKey)) duplicatePanels.push(visualKey);
  seenPanels.add(visualKey);
  if (question.visualSource === "storyboard" && ![1, 2, 3, 4, 5].includes(Number(question.imagePanel))) {
    invalidPanels.push(visualKey);
  }
  const relative = String(question.asset || "").replace(/^\//, "");
  const file = path.join(root, relative);
  physicalAssets.set(question.asset, file);
}

for (const [asset, file] of physicalAssets) {
  if (!fs.existsSync(file)) {
    missing.push(asset);
    continue;
  }
  if (fs.statSync(file).size < 10_000) tooSmall.push(asset);
}

if (missing.length || tooSmall.length || invalidPanels.length || duplicatePanels.length) {
  if (missing.length) {
    console.error(`Missing ${missing.length} visual assets:`);
    missing.forEach((asset) => console.error(`  - ${asset}`));
  }
  if (tooSmall.length) {
    console.error(`Suspiciously small visual assets (${tooSmall.length}):`);
    tooSmall.forEach((asset) => console.error(`  - ${asset}`));
  }
  if (invalidPanels.length) {
    console.error(`Invalid storyboard panels (${invalidPanels.length}):`);
    invalidPanels.forEach((key) => console.error(`  - ${key}`));
  }
  if (duplicatePanels.length) {
    console.error(`Duplicate visual asset/panel pairs (${duplicatePanels.length}):`);
    duplicatePanels.forEach((key) => console.error(`  - ${key}`));
  }
  process.exitCode = 1;
} else {
  console.log(`Verified ${entries.length} visual panels across ${physicalAssets.size} image assets.`);
}
