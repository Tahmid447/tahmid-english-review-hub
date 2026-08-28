import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { notionDraftCurriculum } from "../src/data/curriculum.js";
import {
  compareLessonSourceOrder,
  lessonSourceIdentityKey,
  normalizeSourceSegment,
  sourceSegmentFromLesson,
  sourceSegmentIsValid,
  sourceSegmentPartIndex,
  validateLessonSourceIdentities,
} from "../src/lesson-source.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const readJson = (relative) => JSON.parse(read(relative));

assert.equal(normalizeSourceSegment(), "full");
assert.equal(normalizeSourceSegment(" Part-2 "), "part-2");
assert.equal(sourceSegmentFromLesson({ content: { sourceSegment: "part-3" } }), "part-3");
assert.equal(sourceSegmentPartIndex("part-12"), 12);
assert.equal(sourceSegmentIsValid("part_1"), false);
assert.equal(sourceSegmentIsValid("x".repeat(81)), false);

const sharedPage = "00000000-0000-8000-8000-000000000001";
const splitFixtures = [
  { id: "fixture-part-1", sourceType: "notion", sourceNotionPageId: sharedPage, sourceSegment: "part-1" },
  { id: "fixture-part-2", sourceType: "notion", sourceNotionPageId: sharedPage, sourceSegment: "part-2" },
];
assert.doesNotThrow(() => validateLessonSourceIdentities(splitFixtures));
assert.notEqual(lessonSourceIdentityKey(splitFixtures[0]), lessonSourceIdentityKey(splitFixtures[1]));
assert.throws(
  () => validateLessonSourceIdentities([...splitFixtures, { ...splitFixtures[0], id: "duplicate" }]),
  /duplicate Notion page and source segment/,
);
assert.throws(
  () => validateLessonSourceIdentities([{ ...splitFixtures[0], sourceSegment: "Part one" }]),
  /invalid source segment/,
);
assert.deepEqual(
  [...splitFixtures].sort(compareLessonSourceOrder).map(({ id }) => id),
  ["fixture-part-1", "fixture-part-2"],
);

validateLessonSourceIdentities(notionDraftCurriculum.map((lesson) => ({
  ...lesson,
  sourceType: "notion",
})));

const canonicalIds = new Set([
  "july-30-part-1", "july-30-part-2", "august-02", "august-03", "august-09",
  "august-10-part-1", "august-10-part-2", "august-16-part-1", "august-16-part-2",
  "august-17-part-1", "august-17-part-2", "august-23", "august-24", "august-25",
]);
const canonical = notionDraftCurriculum.filter(({ id }) => canonicalIds.has(id));
assert.equal(canonical.length, 14, "All 14 canonical split-aware lessons are authored.");
assert.equal(new Set(canonical.map(lessonSourceIdentityKey)).size, 14);
assert.equal(new Set(canonical.map(({ sourceNotionPageId }) => sourceNotionPageId)).size, 10);
assert(canonical.every(({ sourceNotionUrl }) => /^https:\/\/app\.notion\.com\/p\//.test(sourceNotionUrl)), "Every canonical lesson keeps its Notion link.");

const generated = readJson("src/data/notion-drafts.json")
  .filter(({ id }) => canonicalIds.has(id));
assert.equal(generated.length, 14, "Generated data contains all canonical lessons.");
generated.forEach((lesson) => {
  const authored = canonical.find(({ id }) => id === lesson.id);
  assert.equal(lesson.sourceNotionPageId, authored.sourceNotionPageId, `${lesson.id}: source page ID survives generation.`);
  assert.equal(lesson.sourceNotionUrl, authored.sourceNotionUrl, `${lesson.id}: source link survives generation.`);
  assert.equal(lesson.sourceSegment, authored.sourceSegment, `${lesson.id}: source segment survives generation.`);
});

const migration = read("supabase/migrations/202608280019_lesson_source_segments.sql");
assert.match(migration, /add column if not exists source_segment text not null default 'full'/i);
assert.match(migration, /set source_segment = substring\(slug from '\(part-\[1-9\]\[0-9\]\*\)\$'\)/i);
assert.match(migration, /drop constraint if exists review_lessons_source_type_source_notion_page_id_key/i);
assert.match(migration, /unique \(source_type, source_notion_page_id, source_segment\)/i);
assert.match(migration, /l\.source_segment/i);
assert.match(migration, /where source_type = 'notion'[\s\S]*group by source_type, source_notion_page_id, source_segment/i);

const teacher = read("src/teacher.js");
assert.match(teacher, /const sourceSegment = sourceSegmentFromLesson\(lesson\)/);
assert.match(teacher, /source_segment:\s*sourceSegment/);
assert.match(teacher, /\.eq\("source_segment", row\.source_segment\)/);
assert.match(teacher, /"source_type,source_notion_page_id,source_segment"/);
assert.match(teacher, /\.upsert\(row, \{ onConflict \}\)/);

const studentData = read("src/data.js");
const remoteData = read("src/supabase.js");
assert.match(studentData, /sourceSegment,\s*\n\s*partIndex/);
assert.match(remoteData, /source_segment/);
assert.match(remoteData, /const sourceSegment = sourceSegmentFromLesson/);
assert.match(remoteData, /sourceSegment,\s*\n\s*partIndex/);
assert.match(remoteData, /left\.lessonDate\.localeCompare\(right\.lessonDate\)[\s\S]*compareLessonSourceOrder/);

console.log("Source segment tests passed: 14 lessons, 10 Notion pages, unique page+segment provenance.");
