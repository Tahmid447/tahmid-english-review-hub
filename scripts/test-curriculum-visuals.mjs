import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  curriculumVisualMarkup,
  curriculumVisualMetadata,
  visualSpecFor,
} from "../src/curriculum-visuals.js";

const categories = ["words", "phrases", "phonics"];
const sources = await Promise.all(categories.map(async (category) => JSON.parse(await readFile(
  new URL(`../curriculum/${category}.json`, import.meta.url),
  "utf8",
))));

const visualModule = await readFile(new URL("../src/curriculum-visuals.js", import.meta.url), "utf8");
const visualCss = await readFile(new URL("../src/curriculum-visuals.css", import.meta.url), "utf8");
const learningPage = await readFile(new URL("../learn.html", import.meta.url), "utf8");
const buildScript = await readFile(new URL("./build.mjs", import.meta.url), "utf8");
const serviceWorker = await readFile(new URL("../sw.js", import.meta.url), "utf8");
const attribution = await readFile(new URL("../assets/ATTRIBUTIONS.md", import.meta.url), "utf8");

const allVisuals = [];
const visualKeys = new Set();
const expectedCounts = { words: 320, phrases: 128, phonics: 32 };

for (const [sourceIndex, source] of sources.entries()) {
  const category = categories[sourceIndex];
  const items = source.levels.flatMap(({ items: levelItems }) => levelItems);
  assert.equal(items.length, expectedCounts[category], `${category} visual coverage must match its curriculum`);

  for (const item of items) {
    const spec = visualSpecFor(item, category);
    const markup = curriculumVisualMarkup(item, category);
    const repeatedMarkup = curriculumVisualMarkup(item, category);

    assert.equal(spec.id, item.id);
    assert.equal(spec.category, category);
    assert.equal(spec.source, "original-inline-svg");
    assert.ok(spec.family && spec.variant && spec.visualKey, `${item.id} needs a meaningful visual specification`);
    assert.equal(visualKeys.has(spec.visualKey), false, `${item.id} must have its own stable visual key`);
    visualKeys.add(spec.visualKey);

    assert.equal(markup, repeatedMarkup, `${item.id} illustration must be deterministic`);
    assert.match(markup, /^<svg\b/);
    assert.match(markup, /data-generated-art="tahmid-original"/);
    assert.match(markup, new RegExp(`data-visual-id="${item.id}"`));
    assert.doesNotMatch(markup, /<(?:image|foreignObject|use)\b/i, `${item.id} must not embed an external asset`);
    assert.doesNotMatch(markup.replace("http://www.w3.org/2000/svg", ""), /(?:https?:|data:|blob:|href\s*=|url\s*\()/i);
    assert.doesNotMatch(markup, /\p{Extended_Pictographic}/u, `${item.id} main artwork must not be an emoji`);

    if (category === "words" && item.level <= 12) {
      assert.equal(spec.confidence, "exact", `${item.id} needs an exact semantic illustration for foundational learning`);
    }
    if (category === "phrases") assert.equal(spec.family, "dialogue");
    if (category === "phonics") {
      assert.equal(spec.family, "phonics");
      assert.ok(spec.label.length >= 1 && spec.label.length <= 13, `${item.id} needs a compact sound label`);
    }
    allVisuals.push({ item, spec, markup });
  }
}

assert.equal(allVisuals.length, 480, "Every curriculum item needs a main visual");
assert.equal(visualKeys.size, 480, "All curriculum visual keys must be stable and unique");
assert.equal(curriculumVisualMetadata.earlyWordMotifCount, 120, "Words Levels 1–12 need exact concept mappings");
assert.equal(curriculumVisualMetadata.externalAssets, 0);

assert.doesNotMatch(visualModule, /\.(?:innerHTML|outerHTML)\s*=|insertAdjacentHTML|new\s+DOMParser/i,
  "The illustration renderer must construct SVG safely with DOM APIs");
assert.doesNotMatch(visualCss, /@import|url\s*\(/i, "Illustration CSS must not request a remote or bundled third-party asset");
assert.match(visualCss, /\.learn-card\.has-curriculum-visual \.learn-card-head/);
assert.match(visualCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(visualCss, /html\[data-theme="dark"\] \.curriculum-visual/);

assert.match(learningPage, /href="\/src\/curriculum-visuals\.css/,
  "The Learning Library must load the original illustration stylesheet");
assert.match(learningPage, /src="\/src\/curriculum-visuals\.js/,
  "The Learning Library must install the illustration enhancer");
assert.match(buildScript, /"curriculum-visuals\.js"/);
assert.match(buildScript, /"curriculum-visuals\.css"/);
assert.match(serviceWorker, /"\/src\/curriculum-visuals\.js"/);
assert.match(serviceWorker, /"\/src\/curriculum-visuals\.css"/);

assert.match(attribution, /Original artwork generated locally/i);
assert.match(attribution, /does not download, hotlink, trace or bundle artwork/i);
assert.match(attribution, /externalAssets|third-party illustration licence|no third-party illustration/i);
assert.doesNotMatch(attribution, /https?:\/\//i, "Original artwork documentation does not need an external attribution URL");

console.log("Curriculum visuals verified: 480/480 original SVG cues, including 120 exact foundational word motifs.");
