process.on("uncaughtException", (error) => { console.error(error.message, error.query || ""); process.exit(1); });
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { normalizeCategoryAccess, categoryLevelAllowed } from "../src/curriculum-access.js";
const modulePath = process.env.PGLITE_MODULE || "@electric-sql/pglite";
const { PGlite } = await import(modulePath);
const { pgcrypto } = await import(process.env.PGLITE_CRYPTO_MODULE || "@electric-sql/pglite/contrib/pgcrypto");
const db = new PGlite({ extensions: { pgcrypto } });
// Supabase-provided schemas are fixtures; all application SQL, helpers and RLS
// below execute unchanged from the repository against real PostgreSQL/WASM.
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth; create schema storage; create schema extensions;
  create extension pgcrypto with schema extensions;
  create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create function auth.role() returns text language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.role', true), '') $$;
  create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, metadata jsonb, created_at timestamptz default now());
  alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as
    $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'),1)-1] $$;
  create function storage.filename(name text) returns text language sql immutable as
    $$ select (string_to_array(name, '/'))[array_length(string_to_array(name, '/'),1)] $$;
  grant usage on schema auth, public, storage, extensions to anon, authenticated;
  grant execute on function auth.uid(), auth.role(), storage.foldername(text), storage.filename(text) to anon, authenticated;
`);
const migrationDir = new URL("../supabase/migrations/", import.meta.url);
const files = (await readdir(migrationDir)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
for (const file of files) {
  if (file > "202609050027_curriculum_quality.sql") continue;
  try {
    await db.exec(await readFile(new URL(file, migrationDir), "utf8"));
    if (file === "202607300001_review_hub.sql") await db.exec(`
      insert into auth.users(id) values ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
      insert into review_teachers(user_id) values ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
    `);
  }
  catch (error) { console.error(`Migration failed: ${file}: ${error.message}`); process.exit(1); }
}
console.log("All application migrations through 027 executed in PostgreSQL.");
await db.exec(await readFile(new URL("202609050026_personalisation_security.sql", migrationDir), "utf8"));
console.log("026 replay preserves schema and content.");
const rows = async (sql) => (await db.query(sql)).rows;
const scalar = async (sql) => Object.values((await rows(sql))[0])[0];
const ids = {
  teacherA: "10000000-0000-4000-8000-000000000001", teacherB: "10000000-0000-4000-8000-000000000002",
  studentA: "20000000-0000-4000-8000-000000000001", studentB: "20000000-0000-4000-8000-000000000002",
  orphan: "20000000-0000-4000-8000-000000000003",
};
const as = async (identity) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${ids[identity] || ""}', false); set role ${identity ? "authenticated" : "anon"};`);
};
const admin = async (sql) => { await db.exec("reset role; select set_config('request.jwt.claim.sub', '', false);"); return db.exec(sql); };
const rejects = async (sql, pattern) => {
  await assert.rejects(db.exec(sql), pattern);
};
await admin(`
  insert into auth.users(id) values ${Object.values(ids).map((id) => `('${id}')`).join(",")} on conflict do nothing;
  insert into review_teachers(user_id) values ('${ids.teacherA}'), ('${ids.teacherB}') on conflict do nothing;
  insert into review_profiles(user_id,first_name,last_name,age_group,native_language,english_level)
    values ('${ids.studentA}','Student','A','18–24','ja','beginner'), ('${ids.studentB}','Student','B','18–24','ja','beginner'), ('${ids.orphan}','No','Settings','18–24','ja','beginner');
  insert into review_teacher_students(teacher_id,student_id) values ('${ids.teacherA}','${ids.studentA}'), ('${ids.teacherB}','${ids.studentB}');
`);
assert.equal(await scalar("select count(*)::integer from review_curriculum_items"), 480);
const item1 = await scalar("select id from review_curriculum_items where category='words' and level=1 and not is_preview order by position limit 1");
const item8 = await scalar("select id from review_curriculum_items where category='words' and level=8 order by position limit 1");
const item9 = await scalar("select id from review_curriculum_items where category='words' and level=9 order by position limit 1");
const phrase8 = await scalar("select id from review_curriculum_items where category='phrases' and level=8 order by position limit 1");
await as("teacherA");
assert.deepEqual((await rows("select user_id from review_profiles order by user_id")).map((r) => r.user_id), [ids.studentA]);
assert.equal(await scalar(`select count(*)::integer from review_student_hub_settings where student_id='${ids.studentB}'`), 0);
await rejects(`insert into review_student_curriculum_access(student_id,item_id,access_mode,updated_by) values('${ids.studentB}','${item8}','allow','${ids.teacherA}')`, /row-level security/);
await rejects(`select review_assign_learning_pack('${ids.studentB}','Wrong student','',array['${item8}'])`, /not assigned/);
await db.exec(`update review_student_hub_settings set category_access='{"words":{"min":1,"max":4,"unlock":[8],"lock":[2]},"phrases":{"min":8,"max":10,"unlock":[],"lock":[]}}',updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`);
await rejects(`update review_student_hub_settings set category_access='{"words":{"min":32,"max":1,"unlock":[],"lock":[]}}',updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`, /check constraint/);
await rejects(`update review_student_hub_settings set category_access='{"words":{"min":1,"max":4,"unlock":["8"],"lock":[]}}',updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`, /check constraint/);
await as("studentA");
assert.equal(await scalar(`select count(*)::integer from review_profiles where user_id='${ids.studentB}'`), 0);
assert.equal(await scalar("select review_student_curriculum_scope_allowed('words',8)"), true);
assert.equal(await scalar("select review_student_curriculum_scope_allowed('words',2)"), false);
assert.equal(await scalar("select review_student_curriculum_scope_allowed('phrases',8)"), true);
assert.equal(await scalar("select review_student_curriculum_scope_allowed('phonics',8)"), false);
assert.equal(await scalar(`select count(*)::integer from review_curriculum_items where id='${item9}'`), 0);
assert.equal(await scalar("select count(*)::integer from review_student_curriculum_access"), 0);
assert.deepEqual(await rows(`update review_student_hub_settings set show_words=false where student_id='${ids.studentA}' returning student_id`), [], "A student cannot update their own visibility settings");
assert.equal(await scalar("select show_words from review_student_hub_settings"), true);
await as("teacherA");
const pack = await scalar(`select (review_assign_learning_pack('${ids.studentA}','A private mixed pack','Practice these together',array['${item9}','${phrase8}'])).id`);
await as("studentA");
assert.equal(await scalar(`select count(*)::integer from review_student_learning_packs where id='${pack}'`), 1);
assert.equal(await scalar(`select count(*)::integer from review_curriculum_items where id='${item9}'`), 1);
await db.exec(`select review_save_curriculum_progress('${item9}','reviewed','good'); select review_set_curriculum_favorite('${item9}',true);`);
await as("studentB");
assert.equal(await scalar(`select count(*)::integer from review_student_learning_packs where id='${pack}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_student_learning_pack_items where pack_id='${pack}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_curriculum_progress where student_id='${ids.studentA}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_curriculum_items where id='${item9}'`), 0);
await rejects(`select review_set_learning_pack_active('${pack}',false)`, /not assigned/);
await as("teacherB");
assert.equal(await scalar(`select count(*)::integer from review_curriculum_progress where student_id='${ids.studentA}'`), 0);
await rejects(`select review_set_learning_pack_active('${pack}',false)`, /not assigned/);
await as("teacherA");
assert.equal(await scalar(`select count(*)::integer from review_curriculum_progress where student_id='${ids.studentA}'`), 1);
await db.exec(`insert into review_student_curriculum_access(student_id,item_id,access_mode,updated_by) values('${ids.studentA}','${item9}','block','${ids.teacherA}')`);
await as("studentA");
assert.equal(await scalar(`select count(*)::integer from review_curriculum_items where id='${item9}'`), 0, "Item block wins over pack");
assert.equal(await scalar(`select count(*)::integer from review_student_learning_pack_items where pack_id='${pack}' and item_id='${item9}'`), 0, "Pack metadata must not leak blocked item IDs");
await rejects(`select review_save_curriculum_progress('${item9}','reviewed','good')`, /not available/);
await as("teacherA");
await db.exec(`update review_student_hub_settings set show_phrases=false, show_words=false,updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`);
await as("studentA");
assert.equal(await scalar("select count(*)::integer from review_curriculum_items where category in ('words','phrases')"), 0);
assert.equal(await scalar("select count(*)::integer from review_student_learning_packs"), 0, "All-hidden packs are private");
await as("teacherA");
await db.exec(`select review_set_learning_pack_active('${pack}',false)`);
await admin(`delete from review_student_hub_settings where student_id='${ids.orphan}'`);
await as("orphan");
assert.equal(await scalar("select count(*)::integer from review_curriculum_items"), 0, "Missing authoritative settings fail closed");
await as(null);
assert.equal(await scalar("select count(*)::integer from review_curriculum_items"), 7, "Anonymous gets only deliberate public preview items");
assert.equal(await scalar("select count(*)::integer from review_public_questions"), 80);
await rejects("select * from review_student_learning_packs", /permission denied/);
console.log("Student isolation, teacher ownership, category scopes, personal packs, item blocks and missing-settings checks passed.");

const privateLesson = "30000000-0000-4000-8000-000000000001";
const privateQuestion = "40000000-0000-4000-8000-000000000001";
const privateLockedQuestion = "40000000-0000-4000-8000-000000000002";
const privateDraft = "30000000-0000-4000-8000-000000000002";
await as("teacherA");
assert.equal(await scalar(`insert into review_lessons(id,slug,lesson_date,title_en,status,audience,is_preview,assignment_only,created_by)
  values('${privateDraft}','private-draft-security-probe','2026-09-05','Private draft','draft','both',false,true,'${ids.teacherA}') returning id`), privateDraft,
  "The author can create a private draft with INSERT RETURNING before assigning a student");
assert.equal(await scalar(`update review_lessons set title_en='Edited private draft' where id='${privateDraft}' returning title_en`), "Edited private draft");
await db.exec(`insert into review_questions(lesson_id,stable_key,position,format,payload)
  values('${privateDraft}','private-draft-question',0,'mcq','{}')`);
await as("teacherB");
assert.equal(await scalar(`select count(*)::integer from review_lessons where id='${privateDraft}'`), 0);
await rejects(`select review_permanently_delete_lesson('${privateDraft}','DELETE private-draft-security-probe')`, /private lesson is not available/);
await as("teacherA");
await rejects(`select review_permanently_delete_lesson('${privateDraft}','DELETE private-draft-security-probe')`, /Archive the lesson/);
await db.exec(`update review_lessons set status='archived' where id='${privateDraft}'`);
await as("teacherB");
await rejects(`select review_permanently_delete_lesson('${privateDraft}','DELETE private-draft-security-probe')`, /private lesson is not available/);
await as("teacherA");
await rejects(`select review_permanently_delete_lesson('${privateDraft}',null)`, /confirmation did not match/);
assert.equal(await scalar(`select review_permanently_delete_lesson('${privateDraft}','DELETE private-draft-security-probe')`), true,
  "The author can deliberately delete an archived unused private draft");
await admin(`
  insert into review_lessons(id,slug,lesson_date,title_en,status,audience,is_preview,assignment_only,content)
    values('${privateLesson}','private-security-probe','2026-09-05','Private lesson','published','both',true,true,'{"private":"Only student A"}');
  insert into review_questions(id,lesson_id,stable_key,position,format,payload,required_plan)
    values('${privateQuestion}','${privateLesson}','security-probe',0,'mcq','{"prompt":"Private question"}','free');
  insert into review_questions(id,lesson_id,stable_key,position,format,payload,required_plan,locked_display)
    values('${privateLockedQuestion}','${privateLesson}','security-probe-locked',1,'mcq','{"prompt":"Private paid prompt","answer":"Private answer"}','premium','blur');
  insert into review_assignments(lesson_id,student_id,assigned_by,required_plan)
    values('${privateLesson}','${ids.studentA}','${ids.teacherA}','free');
`);
await as("teacherA");
assert.equal(await scalar(`select count(*)::integer from review_lessons where id='${privateLesson}'`), 1);
assert.equal(await scalar(`select count(*)::integer from review_questions where id='${privateQuestion}'`), 1);
assert.equal(await scalar(`select count(*)::integer from review_question_teasers where lesson_id='${privateLesson}'`), 0, "An authorized teacher reads full questions rather than teasers");
assert.equal(await scalar("select (review_teacher_preview_lesson('private-security-probe','premium_plus')->'lesson'->>'id')"), privateLesson);
await as("teacherB");
assert.equal(await scalar(`select count(*)::integer from review_lessons where id='${privateLesson}'`), 0, "Unassigned teachers cannot read private lesson bodies");
assert.equal(await scalar(`select count(*)::integer from review_questions where id='${privateQuestion}'`), 0, "Unassigned teachers cannot read private question payloads");
assert.equal(await scalar(`select count(*)::integer from review_public_lessons where id='${privateLesson}'`), 0, "The owner view cannot leak private lesson metadata to other teachers");
assert.equal(await scalar(`select count(*)::integer from review_public_questions where id='${privateQuestion}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_question_teasers where lesson_id='${privateLesson}'`), 0);
await rejects("select review_teacher_preview_lesson('private-security-probe','premium_plus')", /private lesson is not available/);
assert.deepEqual(await rows(`update review_lessons set assignment_only=false where id='${privateLesson}' returning id`), [], "A teacher cannot make another teacher's private lesson public");
await rejects(`insert into review_assignments(lesson_id,student_id,assigned_by,required_plan) values('${privateLesson}','${ids.studentB}','${ids.teacherB}','free')`, /private lesson is not available/);
await rejects(`insert into review_lesson_access_overrides(lesson_id,student_id,access_mode,updated_by) values('${privateLesson}','${ids.studentB}','allow','${ids.teacherB}')`, /private lesson is not available/);
await rejects(`insert into review_questions(lesson_id,stable_key,position,format,payload) values('${privateLesson}','unauthorized-question',1,'mcq','{}')`, /row-level security/);
console.log("Private lesson Teacher A/B isolation, preview RPC, mutations and self-assignment bypass checks passed.");
await as("studentA");
assert.equal(await scalar(`select review_can_read_lesson('${privateLesson}')`), true);
assert.equal(await scalar(`select count(*)::integer from review_public_questions where id='${privateQuestion}'`), 1);
const privateTeasers = await rows(`select * from review_question_teasers where lesson_id='${privateLesson}'`);
assert.equal(privateTeasers.length, 1, "The assigned learner may see the intended plan-locked teaser");
assert.deepEqual(Object.keys(privateTeasers[0]).sort(), ['format','id','lesson_id','position','required_plan','section'], "The teaser must not contain prompt, answer or lesson content");
await as("studentB");
assert.equal(await scalar(`select review_can_read_lesson('${privateLesson}')`), false);
assert.equal(await scalar(`select count(*)::integer from review_lessons where id='${privateLesson}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_public_lessons where id='${privateLesson}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_public_questions where id='${privateQuestion}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_question_teasers where lesson_id='${privateLesson}'`), 0);
await as(null);
assert.equal(await scalar(`select count(*)::integer from review_public_lessons where id='${privateLesson}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_public_questions where id='${privateQuestion}'`), 0);
assert.equal(await scalar(`select count(*)::integer from review_question_teasers where lesson_id='${privateLesson}'`), 0);
await as("teacherA");
await db.exec(`update review_student_hub_settings set show_review_lessons=false,show_homework=false,updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`);
await as("studentA");
assert.equal(await scalar("select count(*)::integer from review_public_lessons"), 0, "Owner view respects OFF");
assert.equal(await scalar("select count(*)::integer from review_public_questions"), 0, "Owner view cannot leak preview payload");
assert.equal(await scalar("select count(*)::integer from review_question_teasers"), 0, "Owner view cannot leak teaser metadata when both lesson surfaces are off");
assert.equal(await scalar(`select review_can_read_lesson('${privateLesson}')`), false);
await as("teacherA");
await db.exec(`update review_student_hub_settings set show_homework=true,updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`);
await as("studentA");
assert.equal(await scalar(`select review_can_read_lesson('${privateLesson}')`), true, "Personal homework works independently of library visibility");
await as("teacherA");
await db.exec(`update review_student_hub_settings set account_enabled=false,updated_by='${ids.teacherA}' where student_id='${ids.studentA}'`);
await as("studentA");
assert.equal(await scalar(`select review_can_read_lesson('${privateLesson}')`), false);
assert.equal(await scalar("select count(*)::integer from review_curriculum_items"), 0);
console.log("Personal lesson, preview views, homework independence and account pause checks passed.");

const settings = { account_enabled: true, show_words: true, allowed_level_min: 1, allowed_level_max: 4, allowed_levels: [], category_access: { words: { min: 1, max: 4, unlock: [8], lock: [2, 8] } } };
assert.equal(categoryLevelAllowed(settings, "words", 8), false);
assert.equal(categoryLevelAllowed(settings, "words", 3), true);
assert.equal(categoryLevelAllowed(settings, "words", 2), false);
assert.throws(() => normalizeCategoryAccess({ words: { min: 4, max: 1, unlock: [], lock: [] } }), /valid range/);
assert.throws(() => normalizeCategoryAccess({ words: { min: 1, max: 4, unlock: ["8"], lock: [] } }), /numbers/);
await db.close();
console.log("Personalisation security regression passed.");
