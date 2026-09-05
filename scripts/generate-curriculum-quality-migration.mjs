import fs from "node:fs";
import path from "node:path";
import { curriculumQualityPatches, qualityPath, root } from "./curriculum-release.mjs";

const patches = curriculumQualityPatches();
const literal = (value) => JSON.stringify(value, null, 2);
const sql = `-- Generated from curriculum/*.json by scripts/generate-curriculum-quality-migration.mjs.
-- 025 remains immutable. This release updates editorial fields only, preserving
-- IDs, level placement, Teacher controls, plan access, progress and favourites.
-- Replay accepts the exact after-state. Any intervening Teacher content edits
-- fail closed with item IDs, before a single update is committed.
begin;

lock table public.review_curriculum_items, public.review_curriculum_levels in share row exclusive mode;

create temporary table review_release_027_items on commit drop as
select * from jsonb_to_recordset($curriculum_quality$${literal(patches.items)}$curriculum_quality$::jsonb)
  as patch(id text, category text, level smallint, before_fields jsonb, after_fields jsonb);

create temporary table review_release_027_levels on commit drop as
select * from jsonb_to_recordset($curriculum_quality$${literal(patches.levels)}$curriculum_quality$::jsonb)
  as patch(category text, level smallint, before_fields jsonb, after_fields jsonb);

do $quality_guard$
declare
  conflicts text;
begin
  if (select count(*) from review_release_027_items) <> 480
    or (select count(distinct id) from review_release_027_items) <> 480
    or (select count(*) from review_release_027_levels) <> 96 then
    raise exception 'Migration 027 source is incomplete.';
  end if;

  select string_agg(conflict.id, ', ') into conflicts from (
    select patch.id from review_release_027_items patch
    left join public.review_curriculum_items actual on actual.id = patch.id
    where actual.id is null or actual.category <> patch.category or actual.level <> patch.level
      or jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
           'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags))
        not in (patch.before_fields, patch.after_fields)
    order by patch.id limit 12
  ) conflict;
  if conflicts is not null then
    raise exception 'Migration 027 stopped: missing, moved, or independently edited curriculum items: %. Compare with the preserved before/after manifest before proceeding.', conflicts;
  end if;

  select string_agg(conflict.id, ', ') into conflicts from (
    select patch.category || ':' || patch.level as id from review_release_027_levels patch
    left join public.review_curriculum_levels actual using (category, level)
    where actual.category is null
      or jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon)
        not in (patch.before_fields, patch.after_fields)
    order by patch.category, patch.level limit 12
  ) conflict;
  if conflicts is not null then
    raise exception 'Migration 027 stopped: missing or independently edited level descriptions: %.', conflicts;
  end if;
end
$quality_guard$;

update public.review_curriculum_items actual
set title_en = patch.after_fields->>'title_en',
    title_ja = patch.after_fields->>'title_ja',
    content = patch.after_fields->'content',
    icon = patch.after_fields->>'icon',
    tags = array(select jsonb_array_elements_text(patch.after_fields->'tags'))
from review_release_027_items patch
where actual.id = patch.id
  and jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
      'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags)) <> patch.after_fields;

update public.review_curriculum_levels actual
set description_en = patch.after_fields->>'description_en',
    description_ja = patch.after_fields->>'description_ja',
    icon = patch.after_fields->>'icon'
from review_release_027_levels patch
where actual.category = patch.category and actual.level = patch.level
  and jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon) <> patch.after_fields;

do $quality_postcheck$
begin
  if exists (
    select 1 from review_release_027_items patch
    left join public.review_curriculum_items actual on actual.id = patch.id
    where actual.id is null or actual.category <> patch.category or actual.level <> patch.level
      or jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
           'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags)) is distinct from patch.after_fields
  ) or exists (
    select 1 from review_release_027_levels patch
    left join public.review_curriculum_levels actual using (category, level)
    where actual.category is null
      or jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon) is distinct from patch.after_fields
  ) then
    raise exception 'Migration 027 postcheck failed; rolling back the entire transaction.';
  end if;
end
$quality_postcheck$;

commit;
`;

if (fs.existsSync(qualityPath) && !process.argv.includes("--write")) {
  if (fs.readFileSync(qualityPath, "utf8") !== sql) throw new Error("Migration 027 does not match the reviewed curriculum. Before deployment, regenerate deliberately with --write and review the diff. After deployment, keep 027 frozen and create migration 028 or later.");
  console.log(`Verified ${path.relative(root, qualityPath)}: 480 preserved IDs and 96 learning goals.`);
} else {
  fs.writeFileSync(qualityPath, sql);
  console.log(`Wrote ${path.relative(root, qualityPath)}: 480 preserved IDs and 96 learning goals.`);
}
