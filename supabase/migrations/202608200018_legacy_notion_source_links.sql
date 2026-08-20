-- Attach the six manually verified Notion source pages to the preserved legacy
-- lessons. Keep source_type = legacy_zip because the bundled ZIP remains the
-- public lesson source; these links are teacher-facing provenance only.

with source(slug, page_id, page_url) as (
  values
    ('june-28', '38cfb48a-4617-808a-9263-fee027cc6af9', 'https://app.notion.com/p/38cfb48a4617808a9263fee027cc6af9'),
    ('june-29', '38dfb48a-4617-800f-8ce5-c0aa04de07f9', 'https://app.notion.com/p/38dfb48a4617800f8ce5c0aa04de07f9'),
    ('june-30', '38efb48a-4617-8037-9b2d-d432187ba326', 'https://app.notion.com/p/38efb48a461780379b2dd432187ba326'),
    ('july-04', '393fb48a-4617-8045-a96c-d91c774320bb', 'https://app.notion.com/p/393fb48a46178045a96cd91c774320bb'),
    ('july-05', '394fb48a-4617-80a1-9710-e0e64f757112', 'https://app.notion.com/p/394fb48a461780a19710e0e64f757112'),
    ('july-06', '395fb48a-4617-80e2-9060-f3cdccd556ef', 'https://app.notion.com/p/395fb48a461780e29060f3cdccd556ef')
)
update public.review_lessons as lesson
set source_notion_page_id = source.page_id,
    source_notion_url = source.page_url,
    source_updated_at = now(),
    updated_at = now()
from source
where lesson.slug = source.slug
  and lesson.source_type = 'legacy_zip';

do $verify$
declare
  verified_count integer;
begin
  select count(*)
  into verified_count
  from public.review_lessons
  where (slug, source_notion_page_id, source_notion_url) in (
    values
      ('june-28', '38cfb48a-4617-808a-9263-fee027cc6af9', 'https://app.notion.com/p/38cfb48a4617808a9263fee027cc6af9'),
      ('june-29', '38dfb48a-4617-800f-8ce5-c0aa04de07f9', 'https://app.notion.com/p/38dfb48a4617800f8ce5c0aa04de07f9'),
      ('june-30', '38efb48a-4617-8037-9b2d-d432187ba326', 'https://app.notion.com/p/38efb48a461780379b2dd432187ba326'),
      ('july-04', '393fb48a-4617-8045-a96c-d91c774320bb', 'https://app.notion.com/p/393fb48a46178045a96cd91c774320bb'),
      ('july-05', '394fb48a-4617-80a1-9710-e0e64f757112', 'https://app.notion.com/p/394fb48a461780a19710e0e64f757112'),
      ('july-06', '395fb48a-4617-80e2-9060-f3cdccd556ef', 'https://app.notion.com/p/395fb48a461780e29060f3cdccd556ef')
  );

  if verified_count <> 6 then
    raise exception 'Legacy Notion source update incomplete: expected 6 verified rows, found %.', verified_count;
  end if;
end;
$verify$;
