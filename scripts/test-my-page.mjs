process.on("uncaughtException", (error) => { console.error(error.stack, error.query || ""); process.exit(1); });
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

// September 11: JPEG profile uploads and atomic private/published voice reviews.
await as('teacher');await db.exec(`update review_student_hub_settings set show_homework=true,updated_by='${ids.teacher}' where student_id='${ids.student}'`);
await as('student');
await db.exec(`insert into storage.objects(bucket_id,name) values('review-avatars','${ids.student}/avatar.jpg')`);
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),2);
await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('review-avatars','${ids.other}/avatar.jpg')`),/row-level security/);
await as('otherTeacher');assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-avatars'`),0);
await db.exec('reset role');
const task=await scalar(`insert into review_premium_tasks(lesson_id,stable_key,task_type,title_en,title_ja,prompt_en,prompt_ja,target_seconds,created_by) values('${lesson}','voice-feedback-test','speaking','Speaking test','スピーキング','Say hello.','挨拶してください。',60,'${ids.teacher}') returning id`);
const submitted='30000000-0000-4000-8000-000000000001';
const second='30000000-0000-4000-8000-000000000002';
const privateDraft='30000000-0000-4000-8000-000000000003';
await db.exec(`alter table review_task_submissions disable trigger user;
 insert into review_task_submissions(id,task_id,user_id,attempt_number,status,transcript) values
 ('${submitted}','${task}','${ids.student}',1,'submitted','Learner speaking test'),
 ('${second}','${task}','${ids.student}',2,'submitted','Second test'),
 ('${privateDraft}','${task}','${ids.other}',1,'draft','Private draft');
 alter table review_task_submissions enable trigger user;`);
const audioPath=`${ids.teacher}/${submitted}/40000000-0000-4000-8000-000000000001.mp4`;
await as('teacher');
await db.exec(`insert into storage.objects(bucket_id,name) values('review-feedback-recordings','${audioPath}')`);
await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('review-feedback-recordings','${ids.teacher}/${privateDraft}/40000000-0000-4000-8000-000000000001.mp4')`),/row-level security/);
await assert.rejects(db.exec(`select review_save_submission_review_with_audio('${second}','draft',null,null,null,'${audioPath}',4)`),/belong/);
await assert.rejects(db.exec(`select review_save_submission_review_with_audio('${submitted}','draft',null,null,null,'${audioPath}',181)`),/3 minutes/);
await db.exec(`select review_save_submission_review_with_audio('${submitted}','draft',null,null,null,'${audioPath}',4)`);
await as('student');
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-feedback-recordings'`),0,'Unpublished feedback audio stays private.');
assert.equal(await scalar(`select count(*)::int from review_submission_feedback where submission_id='${submitted}'`),0);
await assert.rejects(db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',null,'Forged',null,null,null)`),/Teacher authorisation/);
await as('otherTeacher');
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-feedback-recordings'`),0);
await assert.rejects(db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',null,'Wrong teacher',null,null,null)`),/cannot be reviewed/);
await as('teacher');
await db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',80,null,null,'${audioPath}',4)`);
assert.deepEqual(await rows(`delete from storage.objects where bucket_id='review-feedback-recordings' and name='${audioPath}' returning name`),[],'Attached audio cannot be deleted or silently overwritten.');
assert.deepEqual(await rows(`update storage.objects set metadata='{}' where bucket_id='review-feedback-recordings' and name='${audioPath}' returning name`),[]);
await as('student');
assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-feedback-recordings'`),1);
assert.equal(await scalar(`select audio_object_path from review_submission_feedback where submission_id='${submitted}'`),audioPath);
await as('other');assert.equal(await scalar(`select count(*)::int from storage.objects where bucket_id='review-feedback-recordings'`),0);
await as('teacher');
const replacement=`${ids.teacher}/${submitted}/40000000-0000-4000-8000-000000000002.webm`;
await db.exec(`insert into storage.objects(bucket_id,name) values('review-feedback-recordings','${replacement}')`);
await db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',90,'Listen to the stress.',null,'${replacement}',3)`);
assert.equal((await rows(`delete from storage.objects where bucket_id='review-feedback-recordings' and name='${audioPath}' returning name`)).length,1);
await db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',90,'Written feedback only.',null,null,null)`);
assert.equal((await rows(`delete from storage.objects where bucket_id='review-feedback-recordings' and name='${replacement}' returning name`)).length,1);
const returnedPath=`${ids.teacher}/${second}/40000000-0000-4000-8000-000000000003.mp4`;
await db.exec(`insert into storage.objects(bucket_id,name) values('review-feedback-recordings','${returnedPath}');
 select review_save_submission_review_with_audio('${second}','return',null,null,null,'${returnedPath}',2);`);
await as('student');assert.equal(await scalar(`select status from review_task_submissions where id='${second}'`),'returned');
assert.equal(await scalar(`select count(*)::int from storage.objects where name='${returnedPath}'`),1);
await as(null);await assert.rejects(db.exec(`select review_save_submission_review_with_audio('${submitted}','publish',null,'Anonymous',null,null,null)`),/permission denied/);
console.log('JPEG/voice SQL passed: own uploads, assigned teachers, private drafts, atomic publish/return, immutable audio, cross-account denial, replacement and cleanup.');

await db.close();
