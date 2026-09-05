import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const seedPath = path.join(root, "supabase/migrations/202609050025_structured_learning_content.sql");
export const qualityPath = path.join(root, "supabase/migrations/202609050027_curriculum_quality.sql");
export const SEED_SHA256 = "15b8fdb1721acaef7c6550cc5ee58d9d39e8bd5b10338db1ae2cf7c205d8f379";
export const categories = ["words", "phrases", "phonics"];

export function readFrozenSeed() {
  const sql = fs.readFileSync(seedPath, "utf8");
  const hash = crypto.createHash("sha256").update(sql).digest("hex");
  if (hash !== SEED_SHA256) throw new Error("Migration 025 is release-frozen. Restore its reviewed bytes; create migration 026 or later for curriculum updates.");
  const payloads = [...sql.matchAll(/from jsonb_to_recordset\(\$curriculum_seed\$(\[[\s\S]*?\])\$curriculum_seed\$::jsonb\) as value\(/g)]
    .map((match) => JSON.parse(match[1]));
  if (payloads.length !== 2 || payloads[0].length !== 96 || payloads[1].length !== 480) throw new Error("Frozen curriculum seed is incomplete.");
  return { sql, levels: payloads[0], items: payloads[1] };
}

export function currentCurriculumRows() {
  const ids = new Set();
  const counts = { words: 10, phrases: 4, phonics: 1 };
  const items = categories.flatMap((category) => {
    const source = JSON.parse(fs.readFileSync(path.join(root, `curriculum/${category}.json`), "utf8"));
    if (source.type !== category || source.levels.length !== 32) throw new Error(`Invalid ${category} source.`);
    return source.levels.flatMap((entry, index) => {
      if (entry.level !== index + 1 || entry.items.length !== counts[category]) throw new Error(`Invalid ${category} Level ${entry.level} count/order.`);
      return entry.items.map((item) => {
        if (item.level !== entry.level || ids.has(item.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) throw new Error(`Invalid or repeated item ${item.id}.`);
        ids.add(item.id);
        const content = { ...item };
        for (const field of ["id", "level", "icon", "tags"]) delete content[field];
        if (category === "words") {
          content.topic = content.category;
          delete content.category;
        }
        return {
          id: item.id,
          category,
          level: entry.level,
          title_en: category === "words" ? item.word : category === "phrases" ? item.phrase : item.phonicsTarget,
          title_ja: category === "phonics" ? item.japaneseHint : item.japanese,
          content,
          icon: String(item.icon ?? ""),
          tags: item.tags || [],
        };
      });
    });
  });
  const goals = JSON.parse(fs.readFileSync(path.join(root, "curriculum/level-goals.json"), "utf8"));
  if (goals.levels.length !== 32) throw new Error("Level goals must cover 32 levels.");
  const levels = categories.flatMap((category) => goals.levels.map((entry, index) => {
    if (entry.level !== index + 1 || !entry[category]?.en || !entry[category]?.ja) throw new Error(`Missing ${category} goal for Level ${index + 1}.`);
    return { category, level: entry.level, description_en: entry[category].en, description_ja: entry[category].ja, icon: "" };
  }));
  return { items, levels };
}

export const itemEditorialFields = ({ title_en, title_ja, content, icon, tags }) => ({ title_en, title_ja, content, icon, tags });
export const levelEditorialFields = ({ description_en, description_ja, icon }) => ({ description_en, description_ja, icon });

export function curriculumQualityPatches() {
  const before = readFrozenSeed();
  const after = currentCurriculumRows();
  const oldItems = new Map(before.items.map((item) => [item.id, item]));
  const oldLevels = new Map(before.levels.map((level) => [`${level.category}:${level.level}`, level]));
  const items = after.items.map((item) => {
    const old = oldItems.get(item.id);
    if (!old || old.category !== item.category || old.level !== item.level) throw new Error(`027 cannot create or move ${item.id}; preserve progress and access identifiers.`);
    return { id: item.id, category: item.category, level: item.level, before_fields: itemEditorialFields(old), after_fields: itemEditorialFields(item) };
  });
  const levels = after.levels.map((level) => ({ category: level.category, level: level.level, before_fields: levelEditorialFields(oldLevels.get(`${level.category}:${level.level}`)), after_fields: levelEditorialFields(level) }));
  return { items, levels };
}
