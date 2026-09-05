import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curriculumDirectory = path.join(root, "curriculum");
const output = path.join(
  root,
  "supabase",
  "migrations",
  "202609050025_structured_learning_content.sql",
);
const categories = ["words", "phrases", "phonics"];
const CATEGORY_LABELS = Object.freeze({
  words: ["Words", "単語"],
  phrases: ["Phrases", "フレーズ"],
  phonics: ["Phonics", "フォニックス"],
});

const readableTopic = (value) => String(value || "")
  .trim()
  .replace(/[-_]+/g, " ")
  .replace(/\s+/g, " ");
const lowerInitial = (value) => {
  const text = readableTopic(value);
  return text ? `${text.charAt(0).toLocaleLowerCase()}${text.slice(1)}` : "";
};

const readItems = (category) => {
  const source = JSON.parse(
    fs.readFileSync(path.join(curriculumDirectory, `${category}.json`), "utf8"),
  );
  const items = Array.isArray(source)
    ? source
    : Array.isArray(source.items)
      ? source.items
      : Array.isArray(source.levels)
        ? source.levels.flatMap((entry) => (
          Array.isArray(entry?.items)
            ? entry.items.map((item) => ({ level: entry.level, ...item }))
            : []
        ))
        : null;
  if (!Array.isArray(items)) {
    throw new Error(`${category}.json must contain an array, { items: [] }, or { levels: [{ items: [] }] }.`);
  }
  return items;
};

const sourceByCategory = Object.fromEntries(
  categories.map((category) => [category, readItems(category)]),
);

const ids = new Set();
const rows = [];
for (const category of categories) {
  const levelPositions = new Map();
  for (const item of sourceByCategory[category]) {
    const id = String(item.id || "").trim();
    const level = Number(item.level);
    if (!/^[a-z0-9][a-z0-9-]{2,95}$/.test(id)) throw new Error(`Invalid curriculum id: ${id}`);
    if (ids.has(id)) throw new Error(`Duplicate curriculum id: ${id}`);
    if (!Number.isInteger(level) || level < 1 || level > 32) {
      throw new Error(`Invalid level for ${id}: ${item.level}`);
    }
    ids.add(id);
    const position = (levelPositions.get(level) || 0) + 1;
    levelPositions.set(level, position);
    const titleEn = category === "words"
      ? item.word
      : category === "phrases"
        ? item.phrase
        : item.phonicsTarget;
    const titleJa = category === "phonics"
      ? item.japaneseHint
      : item.japanese;
    if (!String(titleEn || "").trim() || !String(titleJa || "").trim()) {
      throw new Error(`Missing bilingual title for ${id}.`);
    }
    const content = { ...item };
    delete content.id;
    delete content.level;
    delete content.icon;
    delete content.tags;
    if (category === "words" && content.category) {
      content.topic = content.category;
      delete content.category;
    }
    rows.push({
      id,
      category,
      level,
      title_en: titleEn,
      title_ja: titleJa,
      content,
      icon: String(item.icon || (category === "words" ? "📘" : category === "phrases" ? "💬" : "🔤")),
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      required_plan: "free",
      active: true,
      is_preview: level === 1 && position <= (category === "phonics" ? 1 : 3),
      position,
    });
  }
  const missing = Array.from({ length: 32 }, (_, index) => index + 1)
    .filter((level) => !levelPositions.has(level));
  if (missing.length) throw new Error(`${category}.json is missing levels: ${missing.join(", ")}`);
  if (category === "words") {
    const shortLevels = [...levelPositions].filter(([, count]) => count < 10);
    if (shortLevels.length) throw new Error(`Every Words level needs at least 10 items: ${JSON.stringify(shortLevels)}`);
  }
}

const levels = categories.flatMap((category) => Array.from({ length: 32 }, (_, index) => {
  const level = index + 1;
  const [english, japanese] = CATEGORY_LABELS[category];
  const first = rows.find((row) => row.category === category && row.level === level);
  const topic = category === "words"
    ? readableTopic(first?.content?.topic)
    : category === "phrases"
      ? readableTopic(first?.title_en)
      : lowerInitial(first?.content?.phonicsTarget);
  const descriptionEn = category === "words" && topic
    ? `Build useful vocabulary for ${topic}.`
    : category === "phrases" && topic
      ? `Practise “${topic}” and related phrases in natural conversation.`
      : category === "phonics" && topic
        ? `Hear and practise ${topic}.`
        : `A clear step in your ${english.toLowerCase()} pathway.`;
  return {
    category,
    level,
    title_en: `Level ${level} · ${english}`,
    title_ja: `レベル${level}・${japanese}`,
    description_en: descriptionEn,
    description_ja: `${japanese}を、音声と分かりやすい例で練習します。`,
    icon: first?.icon || (category === "words" ? "📘" : category === "phrases" ? "💬" : "🔤"),
    active: true,
    is_preview: level === 1,
    position: level,
  };
}));

const jsonLiteral = (value) => JSON.stringify(value, null, 2)
  .replaceAll("$curriculum_seed$", "$curriculum seed$");

const sql = `-- Generated from curriculum/*.json by scripts/generate-structured-curriculum-seed.mjs.
-- Forward-only, one-time seed. It fails closed when either structured curriculum
-- table already has rows, so replay cannot overwrite or reactivate live content.
begin;

do $migration_guard$
begin
  if to_regclass('public.review_curriculum_levels') is null
    or to_regclass('public.review_curriculum_items') is null then
    raise exception 'Apply 202609050024_structured_learning_hub.sql before this seed migration.';
  end if;
  if exists (select 1 from public.review_curriculum_levels)
    or exists (select 1 from public.review_curriculum_items) then
    raise exception 'Structured curriculum tables are not empty. Migration 025 is one-time only; inspect live rows and create a forward migration instead of replaying it.';
  end if;
end
$migration_guard$;

with seed as (
  select *
  from jsonb_to_recordset($curriculum_seed$${jsonLiteral(levels)}$curriculum_seed$::jsonb) as value(
    category text,
    level smallint,
    title_en text,
    title_ja text,
    description_en text,
    description_ja text,
    icon text,
    active boolean,
    is_preview boolean,
    position integer
  )
)
insert into public.review_curriculum_levels (
  category, level, title_en, title_ja, description_en, description_ja,
  icon, active, is_preview, position
)
select category, level, title_en, title_ja, description_en, description_ja,
  icon, active, is_preview, position
from seed;

with seed as (
  select *
  from jsonb_to_recordset($curriculum_seed$${jsonLiteral(rows)}$curriculum_seed$::jsonb) as value(
    id text,
    category text,
    level smallint,
    title_en text,
    title_ja text,
    content jsonb,
    icon text,
    tags text[],
    required_plan text,
    active boolean,
    is_preview boolean,
    position integer
  )
)
insert into public.review_curriculum_items (
  id, category, level, title_en, title_ja, content, icon, tags,
  required_plan, active, is_preview, position
)
select id, category, level, title_en, title_ja, content, icon, tags,
  required_plan, active, is_preview, position
from seed;

do $seed_postcheck$
declare
  missing_levels integer;
  missing_items integer;
  actual_levels integer;
  actual_items integer;
begin
  select count(*)
  into missing_levels
  from jsonb_to_recordset($curriculum_seed$${jsonLiteral(levels.map(({ category, level }) => ({ category, level })))}$curriculum_seed$::jsonb)
    as expected(category text, level smallint)
  where not exists (
    select 1
    from public.review_curriculum_levels actual
    where actual.category = expected.category
      and actual.level = expected.level
  );

  select count(*)
  into missing_items
  from jsonb_array_elements_text($curriculum_seed$${jsonLiteral(rows.map(({ id }) => id))}$curriculum_seed$::jsonb) expected(id)
  where not exists (
    select 1
    from public.review_curriculum_items actual
    where actual.id = expected.id
  );

  select count(*) into actual_levels from public.review_curriculum_levels;
  select count(*) into actual_items from public.review_curriculum_items;

  if missing_levels <> 0 or missing_items <> 0
    or actual_levels <> ${levels.length} or actual_items <> ${rows.length} then
    raise exception 'Structured curriculum seed incomplete: % levels and % items missing; % levels and % items present.',
      missing_levels, missing_items, actual_levels, actual_items;
  end if;
end
$seed_postcheck$;

commit;
`;

if (fs.existsSync(output)) {
  const existing = fs.readFileSync(output, "utf8");
  if (existing !== sql) {
    throw new Error(
      "Migration 025 is release-frozen and no longer matches curriculum/*.json. "
      + "Keep 025 unchanged and create migration 026 or later for curriculum updates.",
    );
  }
  console.log(
    `Verified release-frozen ${path.relative(root, output)} with ${levels.length} levels and ${rows.length} items.`,
  );
} else {
  fs.writeFileSync(output, sql);
  console.log(`Wrote ${path.relative(root, output)} with ${levels.length} levels and ${rows.length} items.`);
}
