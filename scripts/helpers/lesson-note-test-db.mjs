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

const migrationDir = new URL("../../supabase/migrations/", import.meta.url);
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

export {db,ids,rows,scalar,as};
