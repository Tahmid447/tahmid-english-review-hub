import fs from "node:fs";
import path from "node:path";

const readJson = (file, fallback) => (
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback
);

export const visualAssetPanelKey = (entry = {}) => (
  `${String(entry.asset || "").trim()}#${entry.imagePanel == null ? "full" : Number(entry.imagePanel)}`
);

export function loadVisualManifestSources(root, { lessonById = new Map() } = {}) {
  const standaloneManifest = readJson(
    path.join(root, "scripts", "visual-question-manifest.json"),
    { questions: [] },
  );
  const storyboardManifest = readJson(
    path.join(root, "scripts", "visual-storyboard-manifest.json"),
    { storyboards: [] },
  );
  const standaloneEntries = (standaloneManifest.questions || []).map((entry) => ({
    ...entry,
    imagePanel: null,
    visualSource: "standalone",
  }));
  const storyboardEntries = (storyboardManifest.storyboards || []).flatMap((storyboard) => (
    (storyboard.panels || []).map((panel, panelIndex) => {
      const distractorIndexes = Array.isArray(panel.distractorIndexes)
        ? panel.distractorIndexes
        : [];
      const phrases = lessonById.get(storyboard.lessonId)?.phrases || [];
      const reasons = distractorIndexes.map((phraseIndex) => {
        const distractor = phrases[phraseIndex];
        return distractor ? {
          choice: distractor.en,
          en: `that sentence means “${distractor.jp},” which is different from the visible action and context`,
          ja: `その英文は「${distractor.jp}」という意味で、絵に見える動作・状況とは異なります`,
        } : null;
      }).filter(Boolean);
      return {
        lessonId: storyboard.lessonId,
        slot: panelIndex + 1,
        phraseIndex: panel.phraseIndex,
        distractorIndexes,
        asset: storyboard.asset,
        imagePanel: panelIndex + 1,
        imageAlt: panel.imageAlt,
        scenePrompt: panel.scenePrompt,
        reviewedGuidance: {
          hintEn: panel.hintEn,
          hintJa: panel.hintJa,
          evidenceEn: panel.evidenceEn,
          evidenceJa: panel.evidenceJa,
          reasons,
        },
        visualSource: "storyboard",
      };
    })
  ));
  return {
    standaloneManifest,
    storyboardManifest,
    standaloneEntries,
    storyboardEntries,
    entries: [...standaloneEntries, ...storyboardEntries],
  };
}
