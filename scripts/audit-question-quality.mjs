import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { legacyAdditions as legacyPhrases } from "../src/data/curriculum.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const legacy = readJson("src/data/legacy-lessons.json");
const additions = readJson("src/data/legacy-additions.json");
const drafts = readJson("src/data/notion-drafts.json");
const manifest = readJson("scripts/visual-question-manifest.json");
const visualQa = readJson("scripts/visual-human-qa.json");

const errors = [];
const rows = [];
const lessonSummaries = [];

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const comparable = (value) => clean(value).toLocaleLowerCase("en").replace(/[‘’'“”".,!?;:()]/g, "");
const unique = (values) => new Set(values).size === values.length;
const escapeCell = (value) => clean(value).replaceAll("|", "\\|");
const knownAmbiguousVisualChoices = new Map([
  ["june-29-extra-visual-1", ["I heard about it yesterday."]],
  ["june-30-extra-visual-1", ["The noise is annoying."]],
  ["july-05-extra-visual-3", ["I’m not sure yet."]],
  ["july-11-draft-visual-3", ["I’m staying at my parents’ house."]],
  ["july-13-draft-visual-1", ["No one usually calls me at this time."]],
  ["july-22-draft-visual-3", ["Either is fine."]],
]);
const visualTargetByAsset = new Map(manifest.questions.map((entry) => {
  const lesson = drafts.find((candidate) => candidate.id === entry.lessonId);
  const phrases = lesson?.phrases || legacyPhrases[entry.lessonId];
  return [entry.asset, {
    lessonId: entry.lessonId,
    phrase: phrases?.[entry.phraseIndex] || null,
  }];
}));

function bilingual(question, field) {
  const value = question[field];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      en: clean(value.en ?? value.english),
      jp: clean(value.jp ?? value.ja ?? value.japanese),
    };
  }
  return {
    en: clean(value),
    jp: clean(question[`${field}Ja`] ?? question[`${field}JP`]),
  };
}

function fail(lessonId, questionId, message) {
  errors.push(`${lessonId}/${questionId}: ${message}`);
}

function validateQuestion(lessonId, question, index) {
  const id = clean(question.id) || `question-${index + 1}`;
  const format = clean(question.format || question.type);
  const beforeCount = errors.length;
  const prompt = bilingual(question, "prompt");
  const hint = bilingual(question, "hint");
  const explanation = bilingual(question, "explanation");

  if (!clean(question.id)) fail(lessonId, id, "missing stable question ID");
  if (!format) fail(lessonId, id, "missing activity format");
  for (const [name, value] of Object.entries({ prompt, hint, explanation })) {
    if (!value.en) fail(lessonId, id, `${name} is missing English guidance`);
    if (!value.jp) fail(lessonId, id, `${name} is missing Japanese guidance`);
  }

  const choiceFormats = new Set(["mcq", "situation", "listenChoice", "dialogue"]);
  if (choiceFormats.has(format)) {
    const choices = Array.isArray(question.choices) ? question.choices : [];
    const ids = choices.map((choice) => clean(choice?.id));
    const english = choices.map((choice) => comparable(choice?.en ?? choice?.text ?? choice));
    if (choices.length < 2) fail(lessonId, id, "fewer than two choices");
    if (ids.some((choiceId) => !choiceId) || !unique(ids)) fail(lessonId, id, "choice IDs are missing or duplicated");
    if (english.some((text) => !text) || !unique(english)) fail(lessonId, id, "English choices are missing or duplicated");
    if (ids.filter((choiceId) => choiceId === clean(question.correct)).length !== 1) {
      fail(lessonId, id, "the declared correct answer does not resolve to exactly one choice");
    }
  }

  if (format === "truefalse" && typeof question.correct !== "boolean") {
    fail(lessonId, id, "true/false answer is not a boolean");
  }

  if (["typing", "translation", "listenType", "mistake"].includes(format)) {
    const accepted = Array.isArray(question.accepted) ? question.accepted.map(comparable).filter(Boolean) : [];
    // Punctuation and contraction variants may intentionally normalize to the
    // same value; the grader keeps them for readable answer feedback.
    if (!accepted.length) fail(lessonId, id, "accepted answer list is empty");
    if (format === "mistake" && accepted.includes(comparable(question.wrongSentence))) {
      fail(lessonId, id, "the intentionally wrong sentence is accepted as correct");
    }
  }

  if (format === "order") {
    const words = Array.isArray(question.words) ? question.words : [];
    const correctWords = Array.isArray(question.correctWords) ? question.correctWords : [];
    const correctOrder = Array.isArray(question.correctOrder) ? question.correctOrder : [];
    if (!words.length) fail(lessonId, id, "word-order activity has no tokens");
    if (!correctWords.length && correctOrder.length !== words.length) {
      fail(lessonId, id, "word-order answer is incomplete");
    }
    if (correctWords.length && correctWords.length !== words.length) {
      fail(lessonId, id, "word-order token and answer lengths differ");
    }
  }

  if (format === "matching") {
    const pairs = Array.isArray(question.pairs) ? question.pairs : [];
    const english = pairs.map((pair) => comparable(pair?.en ?? pair?.left));
    const japanese = pairs.map((pair) => comparable(pair?.jp ?? pair?.ja ?? pair?.right));
    if (pairs.length < 2) fail(lessonId, id, "matching activity has fewer than two pairs");
    if (english.some((value) => !value) || !unique(english)) fail(lessonId, id, "matching English terms are missing or duplicated");
    if (japanese.some((value) => !value) || !unique(japanese)) fail(lessonId, id, "matching Japanese meanings are missing or duplicated");
  }

  if (format === "sorting") {
    const categories = Array.isArray(question.categories) ? question.categories.map(clean).filter(Boolean) : [];
    const items = Array.isArray(question.items) ? question.items : [];
    if (categories.length < 2 || !unique(categories)) fail(lessonId, id, "sorting categories are missing or duplicated");
    if (!items.length) fail(lessonId, id, "sorting activity has no items");
    for (const item of items) {
      const category = clean(Array.isArray(item) ? item[1] : item?.category ?? item?.correct);
      if (!categories.includes(category)) fail(lessonId, id, `sorting item refers to unknown category “${category}”`);
    }
  }

  if (["listenChoice", "listenType"].includes(format) && !clean(question.audioText)) {
    fail(lessonId, id, "listening activity has no audio text");
  }
  if (format === "speaking" && (!clean(question.speakText) || !clean(question.speakJa))) {
    fail(lessonId, id, "speaking activity lacks an English model or Japanese meaning");
  }
  if (format === "grid" && !clean(question.correctCell)) {
    fail(lessonId, id, "grid activity has no correct cell");
  }

  let mediaStatus = "not required";
  if (question.image) {
    mediaStatus = "manifest + file + human QA";
    const asset = clean(question.image);
    const manifestEntry = manifest.questions.find((entry) => entry.asset === asset);
    if (!manifestEntry) fail(lessonId, id, "visual is not present in the manifest");
    if (!fs.existsSync(path.join(root, asset.replace(/^\//, "")))) fail(lessonId, id, "visual asset file is missing");
    if (!clean(question.imageAlt)) fail(lessonId, id, "visual has no alt text");
    if (manifestEntry && clean(manifestEntry.imageAlt) !== clean(question.imageAlt)) {
      fail(lessonId, id, "question alt text differs from the approved visual brief");
    }
    const reviewed = manifestEntry?.reviewedGuidance;
    if (!reviewed) {
      fail(lessonId, id, "visual has no individually reviewed guidance record");
    } else {
      for (const field of ["hintEn", "hintJa", "evidenceEn", "evidenceJa"]) {
        if (!clean(reviewed[field])) fail(lessonId, id, `reviewed guidance is missing ${field}`);
      }
      if (clean(hint.en) !== clean(reviewed.hintEn) || clean(hint.jp) !== clean(reviewed.hintJa)) {
        fail(lessonId, id, "generated hints differ from the individually reviewed bilingual hints");
      }
      if (!clean(explanation.en).includes(clean(reviewed.evidenceEn))) {
        fail(lessonId, id, "English explanation omits the question-specific visual evidence");
      }
      if (!clean(explanation.jp).includes(clean(reviewed.evidenceJa))) {
        fail(lessonId, id, "Japanese explanation omits the question-specific visual evidence");
      }
      const reviewedReasons = Array.isArray(reviewed.reasons) ? reviewed.reasons : [];
      const distractorChoices = (question.choices || [])
        .filter((choice) => clean(choice?.id) !== clean(question.correct));
      if (reviewedReasons.length !== distractorChoices.length || reviewedReasons.length !== 3) {
        fail(lessonId, id, "visual does not have exactly one reviewed reason for each of its three distractors");
      }
      if (!unique(reviewedReasons.map((reason) => clean(reason?.choice)))) {
        fail(lessonId, id, "reviewed distractor reason choices are duplicated");
      }
      for (const distractor of distractorChoices) {
        const reason = reviewedReasons.find((candidate) => clean(candidate?.choice) === clean(distractor?.en));
        if (!reason) {
          fail(lessonId, id, `no reviewed reason is keyed to distractor “${clean(distractor?.en)}”`);
          continue;
        }
        if (!clean(reason.en) || !clean(reason.ja)) {
          fail(lessonId, id, `reviewed reason for “${clean(distractor?.en)}” is not bilingual`);
        }
        if (!clean(explanation.en).includes(clean(reason.en))) {
          fail(lessonId, id, `English explanation omits the specific conflict for “${clean(distractor?.en)}”`);
        }
        if (!clean(explanation.jp).includes(clean(reason.ja))) {
          fail(lessonId, id, `Japanese explanation omits the specific conflict for “${clean(distractor?.en)}”`);
        }
      }
    }
    const visualTarget = visualTargetByAsset.get(asset);
    const correctChoice = Array.isArray(question.choices)
      ? question.choices.find((choice) => clean(choice?.id) === clean(question.correct))
      : null;
    if (!visualTarget?.phrase || visualTarget.lessonId !== lessonId) {
      fail(lessonId, id, "visual target phrase cannot be resolved from the lesson manifest");
    } else {
      if (
        comparable(correctChoice?.en) !== comparable(visualTarget.phrase.en)
        || comparable(correctChoice?.jp) !== comparable(visualTarget.phrase.jp)
      ) {
        fail(lessonId, id, "visual correct choice does not match the manifest target phrase");
      }
      if (
        !comparable(explanation.en).includes(comparable(visualTarget.phrase.en))
        || !explanation.jp.includes(clean(visualTarget.phrase.en))
      ) {
        fail(lessonId, id, "visual explanation does not identify the matching English model answer in both language fields");
      }
    }
    if (hint.en.includes(visualTarget?.phrase?.en || "__missing_target__") || hint.jp.includes(visualTarget?.phrase?.jp || "__missing_target__")) {
      fail(lessonId, id, "visual hint reveals the model answer verbatim");
    }
    const ambiguousChoices = knownAmbiguousVisualChoices.get(id) || [];
    if (ambiguousChoices.some((text) => question.choices?.some((choice) => comparable(choice?.en) === comparable(text)))) {
      fail(lessonId, id, "visual retains a known semantically ambiguous distractor");
    }
    const distractorChoices = (question.choices || []).filter((choice) => clean(choice?.id) !== clean(question.correct));
    if (!distractorChoices.every((choice) => explanation.en.includes(clean(choice?.en)) && explanation.jp.includes(clean(choice?.en)))) {
      fail(lessonId, id, "visual explanation does not discuss every distractor individually in both languages");
    }
    if (
      /does not match the illustrated action or situation/i.test(explanation.en)
      || explanation.jp.includes("画像に描かれた中心場面とは異なります")
    ) {
      fail(lessonId, id, "visual explanation still uses the retired generic distractor rationale");
    }
    if (/illustration shows (?:an? |the )[^,.!?]{0,60}\b(?:orders|accepts|asks|chooses|recognizes|hears|selects|looks|faces|leaves|notices|waits|pauses|changes|arrives|buys|discovers|realizes|eats|holds|plans|wishes|spills|pours|splashes|learns|performs)\b/i.test(explanation.en)) {
      fail(lessonId, id, "English explanation contains the known ‘shows a customer orders’ grammar pattern");
    }
  }

  const passed = errors.length === beforeCount;
  rows.push({
    lessonId,
    id,
    format,
    prompt: prompt.en,
    answerStatus: choiceFormats.has(format) ? "one keyed choice; distractors unique" : "format answer valid",
    guidanceStatus: "EN/JP prompt + hint + explanation",
    mediaStatus,
    result: passed ? "PASS" : "FAIL",
  });
}

const lessons = [
  ...legacy.map((lesson) => ({ ...lesson, questions: [...lesson.questions, ...(additions[lesson.id] || [])] })),
  ...drafts,
];

if (lessons.length !== 17) errors.push(`Expected 17 lessons; found ${lessons.length}.`);
const lessonIds = lessons.map((lesson) => clean(lesson.id));
if (!unique(lessonIds)) errors.push("Lesson IDs are not unique.");

for (const lesson of lessons) {
  const start = errors.length;
  lesson.questions.forEach((question, index) => validateQuestion(lesson.id, question, index));
  const counts = Object.fromEntries(
    [...new Set(lesson.questions.map((question) => clean(question.format || question.type)))]
      .sort()
      .map((format) => [format, lesson.questions.filter((question) => clean(question.format || question.type) === format).length]),
  );
  lessonSummaries.push({
    id: lesson.id,
    questions: lesson.questions.length,
    formats: Object.entries(counts).map(([format, count]) => `${format}:${count}`).join(", "),
    result: errors.length === start ? "PASS" : "FAIL",
  });
}

if (rows.length !== 616) errors.push(`Expected 616 activities; found ${rows.length}.`);
if (!unique(rows.map((row) => row.id))) errors.push("Question IDs are not unique across all lessons.");
if (manifest.questions.length !== 85) errors.push(`Expected 85 visual briefs; found ${manifest.questions.length}.`);
const manifestLessonCounts = new Map();
for (const entry of manifest.questions) {
  manifestLessonCounts.set(entry.lessonId, (manifestLessonCounts.get(entry.lessonId) || 0) + 1);
}
if (manifestLessonCounts.size !== 17 || [...manifestLessonCounts.values()].some((count) => count !== 5)) {
  errors.push("Visual manifest must contain exactly five briefs for each of the 17 lessons.");
}
if (!unique(manifest.questions.map((entry) => clean(entry.asset)))) errors.push("Visual manifest asset paths are not unique.");
if (!unique(manifest.questions.map((entry) => clean(entry.reviewedGuidance?.hintEn)))) {
  errors.push("Reviewed English visual hints must be question-specific and unique across all 85 visuals.");
}
if (!unique(manifest.questions.map((entry) => clean(entry.reviewedGuidance?.hintJa)))) {
  errors.push("Reviewed Japanese visual hints must be question-specific and unique across all 85 visuals.");
}
if (!unique(rows.filter((row) => row.mediaStatus !== "not required").map((row) => row.id))) {
  errors.push("Visual question IDs are not unique.");
}
if (!visualQa.allManifestAssetsChecked || visualQa.manifestAssetCount !== manifest.questions.length) {
  errors.push("Human visual QA record does not cover the current manifest.");
}

const legacyTypingIds = rows.filter((row) => row.format === "typing").map((row) => row.id);
const legacyMatchingIds = legacy.flatMap((lesson) => lesson.questions)
  .filter((question) => (question.format || question.type) === "matching")
  .map((question) => question.id);
const customVisuals = manifest.questions.filter((question) => Array.isArray(question.distractorIndexes));

const report = [
  "# Question quality audit",
  "",
  `Source review date: ${visualQa.checkedAt}`,
  "",
  "## Scope and method",
  "",
  `- Audited all ${lessons.length} lessons and ${rows.length} activities one by one with format-specific integrity checks.`,
  "- Every activity was checked for bilingual prompt, hint, and explanation; answer completeness; unique choice text; exactly one keyed choice where applicable; and required audio/speaking/order/matching/sorting fields.",
  "- Every visual activity was also checked that its keyed English/Japanese answer equals the lesson phrase selected by the manifest and that both explanations explicitly identify that model answer.",
  `- Audited all ${manifest.questions.length} visual questions against the manifest and file inventory; the visual QA record confirms human inspection of every WebP scene.`,
  "- This report distinguishes programmatic whole-corpus checks from the human image review; it does not label an unchecked item as complete.",
  "",
  "## Corrections made in this audit",
  "",
  "- Re-inspected all 85 WebP illustrations in lesson contact sheets, with original-resolution follow-up for ambiguous scenes, and compared each asset with its manifest brief and actual question data.",
  "- Wrote 85 unique English hints and 85 unique Japanese hints item by item. Each hint points to scene-specific evidence without repeating either model answer.",
  "- Added one bilingual correct-evidence statement and three bilingual, choice-keyed conflict reasons to every visual manifest entry: 85 evidence pairs and 255 distractor-reason pairs in total.",
  "- Rebuilt all 85 explanations as natural standalone sentences that identify the correct model and explain the concrete visual conflict for every displayed distractor in both languages.",
  `- ${legacyTypingIds.length} legacy typing activities had only a Japanese prompt. Added an explicit English instruction and retained the Japanese target: ${legacyTypingIds.join(", ")}.`,
  `- ${legacyMatchingIds.length} legacy matching activities lacked a learning explanation. Added a bilingual explanation of one-to-one whole-meaning matching: ${legacyMatchingIds.join(", ")}.`,
  "- Replaced generic generated hints/explanations across all 473 generated activities (132 legacy additions + 341 expanded activities) with format-specific bilingual guidance; explanations state the model answer and why it fits, while visual hints guide without revealing it.",
  `- ${customVisuals.length} visual choice sets now use explicitly selected, semantically distinct distractors: ${customVisuals.map((item) => `${item.lessonId}-visual-${item.slot}`).join(", ")}.`,
  `- Visual corrections and additions documented in scripts/visual-human-qa.json: ${visualQa.findings.map((finding) => `${finding.questionId || finding.questionIds} — ${finding.fix}`).join(" ")}`,
  "- Changed runtime behavior so each new practice run shuffles both question order and choice order automatically; a resumed run retains its saved order.",
  "",
  "## Lesson summary",
  "",
  "| Lesson | Activities | Format inventory | Result |",
  "|---|---:|---|---|",
  ...lessonSummaries.map((lesson) => `| ${lesson.id} | ${lesson.questions} | ${escapeCell(lesson.formats)} | ${lesson.result} |`),
  "",
  "## Per-question results",
  "",
  "| Lesson | Question ID | Format | Prompt (English) | Answer integrity | Guidance | Media | Result |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map((row) => `| ${row.lessonId} | ${row.id} | ${row.format} | ${escapeCell(row.prompt)} | ${row.answerStatus} | ${row.guidanceStatus} | ${row.mediaStatus} | ${row.result} |`),
  "",
  "## Failures",
  "",
  ...(errors.length ? errors.map((error) => `- ${error}`) : ["- None."]),
];

const output = path.join(root, "docs", "question-quality-audit.md");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${report.join("\n")}\n`);

if (errors.length) {
  console.error(`Question quality audit failed with ${errors.length} issue(s).`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Question quality audit passed: ${lessons.length} lessons, ${rows.length} activities, ${manifest.questions.length} visuals.`);
  console.log(`Wrote ${path.relative(root, output)}.`);
}
