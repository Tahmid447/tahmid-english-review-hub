// Prepares reviewable SQL only. It never connects to a database.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root, readFrozenSeed} from './curriculum-release.mjs';
readFrozenSeed();
if(!process.argv[2])throw new Error('Pass an output directory outside the repository.');
const output=path.resolve(process.argv[2]);
if(output===root||output.startsWith(root+path.sep))throw new Error('Use a private directory outside Git.');
fs.mkdirSync(output,{recursive:true,mode:0o700});
const files=fs.readdirSync(path.join(root,'supabase/migrations')).filter(f=>/^20260905002[4-7]_.*\.sql$/.test(f)).sort();
if(files.length!==4)throw new Error('Expected only migrations 024–027.');
const start=`begin;
set local lock_timeout='5s';
set local statement_timeout='60s';
do $ledger_guard$ begin
 if exists(select 1 from supabase_migrations.schema_migrations where version <> '20260820104726') then
  raise exception 'Migration ledger changed since the reviewed preflight. Inspect it before applying this release.';
 end if;
end $ledger_guard$;
create temporary table release_legacy_rows (name text, rows jsonb) on commit drop;
do $save$ declare t record; payload jsonb; begin
 for t in select tablename from pg_tables where schemaname='public' and tablename like 'review_%' loop
  execute format('select coalesce(jsonb_agg(to_jsonb(t)), ''[]''::jsonb) from public.%I t',t.tablename) into payload;
  insert into release_legacy_rows values(t.tablename,payload);
 end loop;
end $save$;
`;
const preserve=`
do $preserve$ declare t record; missing integer; actual_count integer; begin
 for t in select * from release_legacy_rows loop
  execute format('select count(*) from jsonb_array_elements($1) old where not exists(select 1 from public.%I actual where to_jsonb(actual) @> old)',t.name) into missing using t.rows;
  execute format('select count(*) from public.%I',t.name) into actual_count;
  if missing <> 0 or actual_count <> jsonb_array_length(t.rows) then raise exception 'Legacy data preservation failed for %',t.name;end if;
 end loop;
end $preserve$;
`;
const manifest=[];let body=start;let ledger='';
for(const filename of files){
 const source=fs.readFileSync(path.join(root,'supabase/migrations',filename),'utf8');
 if(source.split('\nbegin;').length!==2||source.split('\ncommit;').length!==2)throw new Error(`Unexpected transaction wrapper in ${filename}`);
 const sql=source.replace('\nbegin;','\n').replace('\ncommit;','\n');
 const [version,...nameParts]=filename.replace(/\.sql$/,'').split('_');const name=nameParts.join('_');
 const digest=crypto.createHash('sha256').update(source).digest('hex');
 manifest.push({filename,version,sha256:digest});body+=sql+'\n';
 // The reviewed source and SHA remain in Git + the private manifest. Avoid
 // duplicating the 1.6 MB migration payload past the Management API body limit.
 // statements is nullable (as with CLI migration-repair ledger entries).
 ledger+=`insert into supabase_migrations.schema_migrations(version,name) values ('${version}','${name}'); -- sha256 ${digest}\n`;
}
body+=preserve;
const post=fs.readFileSync(path.join(root,'scripts/sql/structured-hub-postflight.sql'),'utf8');
for(const [file,sql] of [['dryrun.sql',body+ledger+post+'\nrollback;\n'],['apply.sql',body+ledger+post+'\ncommit;\n']]){
 fs.writeFileSync(path.join(output,file),sql,{mode:0o600});
}
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({expectedLegacyLedger:['20260820104726'],migrations:manifest},null,2)+'\n',{mode:0o600});
console.log(`Prepared dryrun.sql, apply.sql and manifest.json in ${output}. Both SQL files preserve every legacy review row and validate the ledger; only the final transaction outcome differs.`);
