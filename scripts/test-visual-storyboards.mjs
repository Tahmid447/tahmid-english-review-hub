import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectQuickPracticeIds, storyboardPanelLayout } from "../src/lesson-grading.js";
import { loadVisualManifestSources, visualAssetPanelKey } from "./visual-manifest-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const drafts = JSON.parse(fs.readFileSync(path.join(root, "src/data/notion-drafts.json"), "utf8"));
const lessonById = new Map(drafts.map((lesson) => [lesson.id, lesson]));
const {
  entries,
  standaloneEntries,
  storyboardEntries,
  storyboardManifest,
} = loadVisualManifestSources(root, { lessonById });

assert.equal(
  storyboardEntries.length,
  storyboardManifest.storyboards.length * 5,
  "Every storyboard contributes exactly five visual question panels.",
);
assert.equal(
  entries.length,
  standaloneEntries.length + storyboardEntries.length,
  "The combined visual inventory includes both standalone and storyboard questions.",
);
assert.equal(
  new Set(entries.map(visualAssetPanelKey)).size,
  entries.length,
  "Every visual is unique by physical asset and cropped panel.",
);

for (const storyboard of storyboardManifest.storyboards) {
  const lesson = lessonById.get(storyboard.lessonId);
  assert(lesson, `${storyboard.lessonId}: generated lesson exists.`);
  assert.equal(storyboard.panels.length, 5, `${storyboard.lessonId}: storyboard has five panels.`);
  storyboard.panels.forEach((panel, index) => {
    assert(storyboardPanelLayout(index + 1), `${storyboard.lessonId}: panel ${index + 1} has a valid crop.`);
    assert(panel.imageAlt && panel.scenePrompt, `${storyboard.lessonId}: panel ${index + 1} is accessible and specified.`);
  });

  const visualQuestions = lesson.questions.filter((question) => question.imagePanel != null);
  assert.equal(visualQuestions.length, 5, `${storyboard.lessonId}: five cropped visual questions were generated.`);
  assert.equal(
    new Set(visualQuestions.map((question) => visualAssetPanelKey({
      asset: question.image,
      imagePanel: question.imagePanel,
    }))).size,
    5,
    `${storyboard.lessonId}: all five visual panels remain distinct.`,
  );

  const quickIds = new Set(selectQuickPracticeIds(
    lesson.questions,
    lesson.questions.map((question) => question.id),
  ));
  assert(
    visualQuestions.some((question) => quickIds.has(question.id)),
    `${storyboard.lessonId}: Quick Practice includes an illustration-led question.`,
  );

  const grid = lesson.questions.find((question) => question.format === "grid");
  assert(grid, `${storyboard.lessonId}: labelled grid activity exists.`);
  assert.equal(Object.keys(grid.gridCells || {}).length, 9, `${storyboard.lessonId}: grid has nine labelled cells.`);
  assert(
    String(grid.gridCells?.[grid.correctCell] || "").trim(),
    `${storyboard.lessonId}: the correct grid cell has a visible label.`,
  );
}

console.log(
  `Visual storyboard tests passed: ${storyboardManifest.storyboards.length} storyboards, ${storyboardEntries.length} cropped panels, labelled grids and Quick Practice coverage.`,
);
