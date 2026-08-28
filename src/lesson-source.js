export const DEFAULT_SOURCE_SEGMENT = "full";
export const MAX_SOURCE_SEGMENT_LENGTH = 80;
export const SOURCE_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const sourceValue = (record, camelName, snakeName) => (
  record?.[camelName] ?? record?.[snakeName]
);

export function sourceSegmentIsValid(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized.length <= MAX_SOURCE_SEGMENT_LENGTH
    && SOURCE_SEGMENT_PATTERN.test(normalized);
}

export function normalizeSourceSegment(value) {
  const normalized = String(value ?? DEFAULT_SOURCE_SEGMENT).trim().toLowerCase();
  return sourceSegmentIsValid(normalized) ? normalized : DEFAULT_SOURCE_SEGMENT;
}

export function sourceSegmentFromLesson(lesson = {}) {
  const content = lesson?.content && typeof lesson.content === "object" && !Array.isArray(lesson.content)
    ? lesson.content
    : {};
  return normalizeSourceSegment(
    sourceValue(lesson, "sourceSegment", "source_segment")
      ?? sourceValue(content, "sourceSegment", "source_segment"),
  );
}

export function sourceSegmentPartIndex(value) {
  const match = normalizeSourceSegment(value).match(/^part-([1-9][0-9]*)$/);
  return match ? Number(match[1]) : 0;
}

export function lessonSourceIdentityKey(lesson = {}) {
  const sourceType = String(sourceValue(lesson, "sourceType", "source_type") || "manual").trim();
  const pageId = String(sourceValue(lesson, "sourceNotionPageId", "source_notion_page_id") || "").trim();
  const segment = sourceSegmentFromLesson(lesson);
  return `${sourceType}\u0000${pageId}\u0000${segment}`;
}

export function validateLessonSourceIdentities(lessons = []) {
  const seen = new Set();
  for (const lesson of Array.isArray(lessons) ? lessons : []) {
    const sourceType = String(sourceValue(lesson, "sourceType", "source_type") || "manual").trim();
    if (sourceType !== "notion") continue;
    const pageId = String(sourceValue(lesson, "sourceNotionPageId", "source_notion_page_id") || "").trim();
    const rawSegment = sourceValue(lesson, "sourceSegment", "source_segment")
      ?? sourceValue(lesson?.content, "sourceSegment", "source_segment")
      ?? DEFAULT_SOURCE_SEGMENT;
    const segment = String(rawSegment).trim().toLowerCase();
    const label = String(lesson?.id || lesson?.slug || pageId || "Notion lesson");
    if (!pageId) throw new Error(`${label}: Notion source page ID is required.`);
    if (!sourceSegmentIsValid(segment)) {
      throw new Error(`${label}: invalid source segment “${rawSegment}”.`);
    }
    const identity = `${sourceType}\u0000${pageId}\u0000${segment}`;
    if (seen.has(identity)) {
      throw new Error(`${label}: duplicate Notion page and source segment (${pageId}/${segment}).`);
    }
    seen.add(identity);
  }
  return true;
}

export function compareLessonSourceOrder(left = {}, right = {}) {
  const leftSegment = sourceSegmentFromLesson(left);
  const rightSegment = sourceSegmentFromLesson(right);
  return sourceSegmentPartIndex(leftSegment) - sourceSegmentPartIndex(rightSegment)
    || leftSegment.localeCompare(rightSegment)
    || String(left?.id || left?.slug || "").localeCompare(String(right?.id || right?.slug || ""));
}
