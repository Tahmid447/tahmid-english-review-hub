// Loopback-only browser integration fixture. Real PostgreSQL/RLS and real UI;
// synthetic identities and in-memory images. Never connects to production Supabase.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {db,ids,as} from './helpers/lesson-note-test-db.mjs';
const port=Number(process.env.NOTE_QA_PORT||4176),root=path.resolve('.'),images=new Map();let queue=Promise.resolve();
const roles=new Set(['teacher','student','other','otherTeacher']);
const tables=new Set(['review_lesson_notes','review_personal_cards','review_personal_card_favorites',...['annotations','suggestions','comments','assets','review_status','revisions','activity','notifications','practice_attempts'].map(k=>`review_lesson_note_${k}`)]);
for(const row of (await db.query("select tablename from pg_tables where schemaname='public' and tablename like 'review_%'")).rows)tables.add(row.tablename);
const exportedServices=[...fs.readFileSync(path.join(root,'src/supabase.js'),'utf8').matchAll(/^export (?:async )?(?:function|const) (\w+)/gm)].map(m=>m[1]);
if(process.env.NOTE_QA_WORKFLOW==='1')await (await import('./helpers/seed-workflow-qa.mjs')).seedWorkflowQA(db,ids,as);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.woff2':'font/woff2'};
const json=(response,data,status=200)=>{response.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});response.end(JSON.stringify(data));};
async function api(payload){
 if(!roles.has(payload.role))throw new Error('Invalid fixture identity');await as(payload.role);
 if(payload.op==='rpc'){
  if(!/^review_(?:note_[a-z_]+|my_hub_settings|save_personal_card|set_curriculum_favorite)$/.test(payload.name)||Object.keys(payload.args).some(k=>!/^[a-z_]+$/.test(k)))throw new Error('Invalid fixture RPC');
  const sql=`select to_jsonb(public.${payload.name}(${Object.keys(payload.args).map((k,i)=>`${k}=>$${i+1}`).join(',')})) as data`;
  return (await db.query(sql,Object.values(payload.args))).rows[0].data;
 }
 if(['update','upsert'].includes(payload.op)){
  if(!['review_profiles','review_user_settings'].includes(payload.table)||Object.keys(payload.values).some(k=>!/^[a-z_]+$/.test(k)))throw new Error('Invalid fixture update');
  const keys=Object.keys(payload.values),values=Object.values(payload.values);let sql;
  if(payload.op==='upsert')sql=`insert into public.${payload.table}(${keys.join(',')}) values(${keys.map((_,i)=>`$${i+1}`).join(',')}) on conflict(user_id) do update set ${keys.filter(k=>k!=='user_id').map(k=>`${k}=excluded.${k}`).join(',')} returning *`;
  else {if(payload.filters.length!==1||payload.filters[0][0]!=='user_id')throw new Error('Exact user required');values.push(payload.filters[0][1]);sql=`update public.${payload.table} set ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')} where user_id=$${values.length} returning *`;}
  const rows=(await db.query(sql,values)).rows;return payload.single?rows[0]:rows;
 }
 if(payload.op==='query'){
  if(!tables.has(payload.table))throw new Error('Invalid fixture table');
  const params=[],where=[];
  for(const [key,value,op] of payload.filters||[]){if(!/^[a-z_]+$/.test(key))throw new Error('Invalid column');if(value===null&&['is','not'].includes(op)){where.push(`${key} is ${op==='not'?'not ':''}null`);continue;}params.push(value);where.push(`${key}${op==='in'?`=any($${params.length})`:`=$${params.length}`}`);}
  const order=(payload.orders||[]).map(([key,ascending])=>{if(!/^[a-z_]+$/.test(key))throw new Error('Invalid order');return `${key} ${ascending?'asc':'desc'}`;}).join(',');
  const sql=`select * from public.${payload.table}${where.length?' where '+where.join(' and '):''}${order?' order by '+order:''} limit ${Math.min(1000,payload.limit||1000)} offset ${Math.max(0,payload.offset||0)}`;
  const data=(await db.query(sql,params)).rows.map(row=>({...row,...row.lesson_date?{lesson_date:new Date(row.lesson_date).toISOString().slice(0,10)}:{}}));
  if(payload.columns?.includes('assets:'))for(const n of data){n.assets=(await db.query('select id,state,uploader_role,thumbnail_path from review_lesson_note_assets where note_id=$1',[n.id])).rows;n.seen=(await db.query('select * from review_lesson_note_review_status where note_id=$1',[n.id])).rows;}
  if(payload.columns?.includes('note:'))for(const n of data)n.note=(await db.query('select title,lesson_date,student_id from review_lesson_notes where id=$1',[n.note_id])).rows[0];
  if(payload.single&&data.length!==1)throw new Error('Note unavailable');return payload.single||payload.maybeSingle?data[0]||null:data;
 }
 if(payload.op==='upload'){
  const bytes=Buffer.from(payload.bytes,'base64');if(bytes.length>5242880)throw new Error('Too large');
  await db.query("insert into storage.objects(bucket_id,name,metadata) values('review-lesson-note-assets',$1,$2)",[payload.path,{mimetype:payload.type,size:bytes.length}]);images.set(payload.path,{bytes,type:payload.type});return {path:payload.path};
 }
 if(payload.op==='remove'){
  for(const name of payload.paths){const result=await db.query("delete from storage.objects where bucket_id='review-lesson-note-assets' and name=$1 returning name",[name]);if(result.rows.length)images.delete(name);}return [];
 }
 if(payload.op==='signed'){
  const r=await db.query("select name from storage.objects where bucket_id='review-lesson-note-assets' and name=$1",[payload.path]);if(!r.rows.length)throw new Error('Image unavailable');
  return {signedUrl:`/__notes_qa/image?role=${payload.role}&path=${encodeURIComponent(payload.path)}`};
 }
 throw new Error('Unknown fixture operation');
}
http.createServer(async(req,res)=>{
 if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)){res.writeHead(403);res.end();return;}
 const url=new URL(req.url,`http://127.0.0.1:${port}`);
 if(url.pathname.startsWith('/__notes_qa')){
  const origin=req.headers.origin;if(origin&&origin!==`http://127.0.0.1:${port}`){json(res,{error:{message:'Origin denied'}},403);return;}
  if(url.pathname==='/__notes_qa/image'){
   queue=queue.then(async()=>{try{await api({op:'signed',role:url.searchParams.get('role'),path:url.searchParams.get('path')});const image=images.get(url.searchParams.get('path'));if(!image)throw new Error('Not found');res.writeHead(200,{'Content-Type':image.type,'Cache-Control':'no-store'});res.end(image.bytes);}catch{res.writeHead(404);res.end();}});return;
  }
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>15000000){json(res,{error:{message:'Too large'}},413);return;}}
  try{const payload=JSON.parse(raw);queue=queue.then(async()=>{try{json(res,{data:await api(payload),error:null});}catch(error){json(res,{data:null,error:{message:error.message}});}});}catch{json(res,{error:{message:'Invalid JSON'}},400);}return;
 }
 if(url.pathname==='/src/supabase.js'){
  res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});
  res.end(`import {services} from '/scripts/helpers/notes-qa-client.js';\n${exportedServices.map(name=>`export const ${name}=(...args)=>{if(!services.${name})throw new Error('Not implemented by local fixture: ${name}');return services.${name}(...args);};`).join('\n')}`);return;
 }
 const routes={'/':'/scripts/qa-lesson-notes.html','/my-page':'/my-page.html','/teacher':'/teacher.html'};
 const pathname=routes[url.pathname]||(url.pathname.startsWith('/my-page/notes')?'/lesson-notes.html':decodeURIComponent(url.pathname));
 const file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()||pathname.includes('/.')){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Isolated lesson-notes QA: http://127.0.0.1:${port}/scripts/qa-lesson-notes.html`));
