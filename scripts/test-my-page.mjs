process.on("uncaughtException", (error) => { console.error(error.message, error.query || ""); process.exit(1); });
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

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
for (const file of (await readdir(migrationDir)).filter(name=>/^\d+.*\.sql$/.test(name)).sort()) {
  await db.exec(await readFile(new URL(file,migrationDir),'utf8'));
  if(file==='202607300001_review_hub.sql') await db.exec(`
    insert into auth.users(id) values ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
    insert into review_teachers(user_id) values ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
  `);
}
const ids={teacher:'10000000-0000-4000-8000-000000000001',otherTeacher:'10000000-0000-4000-8000-000000000002',student:'20000000-0000-4000-8000-000000000001',other:'20000000-0000-4000-8000-000000000002'};
const rows=async sql=>(await db.query(sql)).rows;
const scalar=async sql=>Object.values((await rows(sql))[0])[0];
const as=async key=>{await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[key] || ''}',false);set role ${key?'authenticated':'anon'}`);};
await db.exec(`grant select,insert,update,delete on storage.objects to authenticated;
 insert into auth.users(id) values ('${ids.student}'),('${ids.other}');
 insert into review_profiles(user_id,first_name,last_name) values ('${ids.student}','Student','A'),('${ids.other}','Student','B'),('${ids.teacher}','Teacher','Owner') on conflict(user_id) do nothing;
 insert into review_teacher_students(teacher_id,student_id) values ('${ids.teacher}','${ids.student}'),('${ids.otherTeacher}','${ids.other}') on conflict do nothing;
 insert into review_site_owner values('${ids.teacher}') on conflict do nothing;
`);
const lesson=await scalar("select id from review_lessons where slug='june-28'");
const question=await scalar(`select stable_key from review_questions where lesson_id='${lesson}' and active and required_plan='free' limit 1`);
await as('teacher');
await db.exec(`insert into review_user_settings(user_id,settings) values('${ids.teacher}','{"ambientEnabled":false}') on conflict(user_id) do update set settings=excluded.settings`);
assert.equal(await scalar(`select settings->>'ambientEnabled' from review_user_settings where user_id='${ids.teacher}'`),'false');
const ownerItem=await scalar("select id from review_curriculum_items where category='words' and active limit 1");
assert.equal(await scalar(`select review_set_curriculum_favorite('${ownerItem}',true)`),true);
assert.equal(await scalar(`select count(*)::int from review_curriculum_favorites where student_id='${ids.teacher}'`),1);
await as('student');
assert.equal(await scalar(`update review_profiles set display_name='New learner name' where user_id='${ids.student}' returning display_name`),'New learner name');
assert.deepEqual(await rows(`update review_profiles set display_name='Wrong name' where user_id='${ids.other}' returning user_id`),[]);
await db.exec(`insert into storage.objects(bucket_id,name) values('review-avatars','${ids.student}/avatar.webp')`);
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),1);
await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('review-avatars','${ids.other}/avatar.webp')`),/row-level security/);
await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('review-avatars','${ids.student}/second.webp')`),/row-level security/);
assert.equal(await scalar("select review_save_learning('june-28','',true)"),true);
assert.equal(await scalar(`select review_save_learning('june-28','${question}',true)`),true);
await assert.rejects(db.exec("select review_save_learning('june-28','made-up-question',true)"),/Question unavailable/);
await assert.rejects(db.exec(`insert into review_saved_learning(user_id,lesson_id) values('${ids.other}','${lesson}')`),/permission denied/);
await as('other');
assert.equal(await scalar('select count(*)::int from review_saved_learning'),0);
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),0);
await as('otherTeacher');
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),0);
await as('teacher');
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),1);
assert.equal(await scalar(`select display_name from review_profiles where user_id='${ids.student}'`),'New learner name');
const card=await scalar(`insert into review_personal_cards(teacher_id,student_id,category,text_en,text_ja,audio_enabled) values('${ids.teacher}','${ids.student}','phrases','Hi, I am Ren.','こんにちは、レンです。',true) returning id`);
await assert.rejects(db.exec(`insert into review_personal_cards(teacher_id,student_id,category,text_en) values('${ids.teacher}','${ids.other}','words','secret')`),/row-level security/);
await assert.rejects(db.exec(`update review_personal_cards set student_id='${ids.other}' where id='${card}'`),/permission denied/);
await as('otherTeacher');assert.equal(await scalar(`select count(*)::int from review_personal_cards`),0);
await as('other');assert.equal(await scalar(`select count(*)::int from review_personal_cards`),0);
await assert.rejects(db.exec(`select review_save_personal_card('${card}',true)`),/not available/);
await as(null);await assert.rejects(db.exec(`select * from review_personal_cards`),/permission denied/);
await assert.rejects(db.exec(`select review_save_learning('june-28','',true)`),/permission denied/);
await as('student');assert.equal(await scalar(`select count(*)::int from review_personal_cards`),1);
assert.equal(await scalar(`select review_save_personal_card('${card}',true)`),true);
assert.deepEqual(await rows(`update review_personal_cards set text_en='changed' where id='${card}' returning id`),[]);
await as('teacher');await db.exec(`update review_personal_cards set active=false where id='${card}'`);
await as('student');assert.equal(await scalar(`select count(*)::int from review_personal_cards`),0);
await assert.rejects(db.exec(`select review_save_personal_card('${card}',true)`),/not available/);
assert.equal(await scalar(`select review_save_personal_card('${card}',false)`),false);
await as('teacher');await db.exec(`update review_student_hub_settings set show_review_lessons=false,show_homework=false,inherit_features=false,updated_by='${ids.teacher}' where student_id='${ids.student}'`);
await as('student');assert.equal(await scalar("select review_save_learning('june-28','',false)"),false);
await assert.rejects(db.exec("select review_save_learning('june-28','',true)"),/access required/);
console.log('My Page SQL passed: private avatars, profile isolation, lesson/question saves, personal cards, assigned teachers, hidden content and removal after revocation.');
await db.close();
