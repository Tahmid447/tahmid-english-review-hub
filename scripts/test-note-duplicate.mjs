import assert from 'node:assert/strict';
import {db,ids,as} from './helpers/lesson-note-test-db.mjs';
import {createNoteApi,NOTE_BUCKET} from '../src/lesson-note-api.js';
import {BLOCK_TYPES,PERMISSIONS,newNote,newBlock,notePayload,duplicateNoteDraft,applyLessonImport,importLessonText} from '../src/lesson-note-model.js';
import {isPractice} from '../src/note-practice-model.js';

// Exercise the browser API against the unchanged PostgreSQL RPCs and RLS.
const wrap=async operation=>{try{return {data:await operation(),error:null};}catch(error){return {data:null,error};}};
const blobs=new Map();let failUpload=false;
const client={
 rpc:(name,args)=>wrap(async()=>(await db.query(`select to_jsonb(public.${name}(${Object.keys(args).map((key,i)=>`${key}=>$${i+1}`).join(',')})) as data`,Object.values(args))).rows[0].data),
 from(table){
  const filters=[],values=[],orders=[];let single=false;
  return {select(){return this;},limit(){return this;},eq(key,value){values.push(value);filters.push(`${key}=$${values.length}`);return this;},order(key,{ascending}){orders.push(`${key} ${ascending?'asc':'desc'}`);return this;},single(){single=true;return this;},
   then(resolve,reject){return wrap(async()=>{const rows=(await db.query(`select * from ${table}${filters.length?' where '+filters.join(' and '):''}${orders.length?' order by '+orders.join(','):''}`,values)).rows.map(row=>({...row,...row.lesson_date?{lesson_date:new Date(row.lesson_date).toISOString().slice(0,10)}:{}}));if(single&&!rows.length)throw new Error('Note unavailable');return single?rows[0]:rows;}).then(resolve,reject);}};
 },
 storage:{from(bucket){assert.equal(bucket,NOTE_BUCKET);return {
  download:path=>wrap(async()=>{const rows=(await db.query('select name from storage.objects where bucket_id=$1 and name=$2',[bucket,path])).rows;if(!rows.length)throw new Error('Image unavailable');return blobs.get(path);}),
  upload:(path,blob)=>wrap(async()=>{if(failUpload)throw new Error('Simulated upload failure');await db.query('insert into storage.objects(bucket_id,name,metadata) values($1,$2,$3)',[bucket,path,{mimetype:blob.type,size:blob.size}]);blobs.set(path,blob);return {path};}),
  remove:paths=>wrap(async()=>{await db.query('delete from storage.objects where bucket_id=$1 and name=any($2)',[bucket,paths]);return [];})
 };}}
};
const api=createNoteApi(client);
const query=async(sql,args=[])=>(await db.query(sql,args)).rows;
const count=async(table,noteId)=>(await query(`select count(*)::int as n from ${table} where note_id=$1`,[noteId]))[0].n;
const seedImage=async(noteId,caption)=>{
 const asset=await api.rpc('asset_reserve',{target_note:noteId,asset_metadata:{mime_type:'image/jpeg',title:'Teacher visual',alt_text:'Lesson diagram',caption,asset_type:'infographic'}});
 for(const path of [asset.storage_path,asset.thumbnail_path]){const blob=new Blob([`private JPEG fixture: ${path}`],{type:'image/jpeg'});const uploaded=await client.storage.from(NOTE_BUCKET).upload(path,blob);if(uploaded.error)throw uploaded.error;}
 return api.rpc('asset_finish',{target_asset:asset.id,replace_asset:null});
};

const modelSource={...newNote(ids.student),id:crypto.randomUUID(),title:'Every teaching type',status:'published',published_at:'2020-01-01',created_at:'2020-01-01',teacher_id:ids.teacher,content_json:{schemaVersion:1,blocks:Object.keys(BLOCK_TYPES).map(type=>({...newBlock(type),englishText:'Keep this definition',choices:['First','Second'],acceptedAnswers:['first'],answerKey:'A',hint:'A hint',formatting:{version:1,spans:[]}}))}};
const modelCopy=duplicateNoteDraft(modelSource,ids.other).note;
assert.equal(modelCopy.id,null);assert.equal(modelCopy.status,'draft');assert.equal(modelCopy.version,0);assert.equal(modelCopy.student_id,ids.other);
for(const key of ['published_at','created_at','teacher_id','updated_at','deleted_at'])assert.ok(!(key in modelCopy));
for(const key of Object.keys(PERMISSIONS))assert.equal(modelCopy[key],modelSource[key]);
modelCopy.content_json.blocks.forEach((block,i)=>{const original=modelSource.content_json.blocks[i];assert.notEqual(block.id,original.id);if(original.questionId||isPractice(original))assert.notEqual(block.questionId,original.questionId);const omitIds=({id,questionId,...rest})=>rest;assert.deepEqual(omitIds(block),omitIds(original));});
modelCopy.content_json.blocks[0].choices[0]='Independent';assert.equal(modelSource.content_json.blocks[0].choices[0],'First');

await db.query('insert into review_teacher_students(teacher_id,student_id) values($1,$2)',[ids.teacher,ids.other]);
await as('teacher');
let source=applyLessonImport(newNote(ids.student),importLessonText("Lesson Title: Health English\nShort Introduction: Reusable introduction\nToday's Focus: Describe how you feel.\nTopics: Health, Grammar\n\n## Useful Phrases\nEnglish: I feel better today.\n### Multiple Choice\nQuestion: Choose the adjective.\nA: better\nB: feel\nAnswer: A\n### Short Answer\nQuestion: How do you feel?"));
source={...source,status:'published',allow_student_suggestions:true,allow_student_images:true,allow_student_comments:true};source=await api.save(source);
const first=await seedImage(source.id,'First teacher caption'),second=await seedImage(source.id,'Second teacher caption');
source=await api.note(source.id);source.content_json.blocks.push({...newBlock('image'),assetId:first.id});source=await api.save(source);await api.order(source.id,[second.id,first.id],first.id,source.version);
await as('student');
await api.annotate(source.id,'','Student A private reminder',0);
await api.suggest(source.id,source.content_json.blocks[0].id,{englishText:'Student A suggestion'});
await api.comment(source.id,'Student A private comment');await api.savePhrase(source.id,source.content_json.blocks[0].id);
const question=source.content_json.blocks.find(b=>b.type==='multiple_choice');await api.practice(source.id,question.id,question,'answer',{choice:0},0);
source=await api.note(source.id);await api.mark(source.id,true,source.version);
const studentImage=await seedImage(source.id,'Student A personal image');
await as('teacher');
const fetched=await api.duplicateSource(source.id);assert.equal(fetched.assets.length,2);assert.ok(!fetched.assets.some(a=>a.id===studentImage.id));
const sourceBefore=await api.detail(source.id,{teacher:true});
const copy=duplicateNoteDraft(fetched.note,ids.other,sourceBefore.assets);
assert.equal(copy.assets.length,2);assert.equal(copy.note.cover_asset_id,first.id);assert.equal(copy.note.lesson_date,newNote().lesson_date);
copy.note.title='Health English for Student B';copy.note.content_json.blocks[0].englishText='I feel much better.';copy.assets[0].caption='Personalized caption for B';
const id=await api.duplicate({...copy.note,status:'published'},copy.assets);
let saved=await api.note(id);assert.notEqual(id,source.id);assert.equal(saved.student_id,ids.other);assert.equal(saved.status,'draft');assert.equal(saved.published_at,null);
assert.equal(saved.title,copy.note.title);assert.equal(saved.content_json.blocks[0].englishText,'I feel much better.');
for(const key of ['summary','focus','tags',...Object.keys(PERMISSIONS)])assert.deepEqual(saved[key],sourceBefore.note[key]);
const images=await query('select * from review_lesson_note_assets where note_id=$1 order by display_order',[id]);assert.equal(images.length,2);
for(let i=0;i<images.length;i++){
 assert.notEqual(images[i].id,copy.assets[i].id);assert.equal(images[i].uploader_role,'teacher');assert.equal(images[i].note_id,id);
 assert.ok(images[i].storage_path.startsWith(`${ids.other}/${id}/`));assert.ok(images[i].thumbnail_path.startsWith(`${ids.other}/${id}/`));
 for(const field of ['storage_path','thumbnail_path'])assert.deepEqual(await blobs.get(images[i][field]).arrayBuffer(),await blobs.get(copy.assets[i][field]).arrayBuffer());
 assert.equal(images[i].caption,copy.assets[i].caption);
}
assert.equal(saved.cover_asset_id,images[1].id);assert.equal(saved.content_json.blocks.at(-1).assetId,images[1].id);
for(const table of ['annotations','suggestions','comments','practice_attempts','review_status','notifications'])assert.equal(await count('review_lesson_note_'+table,id),0,table);
assert.equal((await query('select count(*)::int as n from review_personal_cards where source_note_id=$1',[id]))[0].n,0);
const newHistory=await query('select * from review_lesson_note_revisions where note_id=$1',[id]);assert.ok(newHistory.every(row=>row.note_id===id&&!sourceBefore.revisions.some(old=>old.id===row.id)));
assert.deepEqual(await api.detail(source.id,{teacher:true}),sourceBefore,'Copying leaves the entire source unchanged');
await as('other');await assert.rejects(api.note(id),/unavailable/);await assert.rejects(api.note(source.id),/unavailable/);
await as('teacher');saved=await api.save({...saved,status:'published'});
await as('other');assert.equal((await api.note(id)).status,'published');
assert.ok((await client.storage.from(NOTE_BUCKET).download(images[0].storage_path)).data);
assert.ok((await client.storage.from(NOTE_BUCKET).download(first.storage_path)).error);
for(const table of ['annotations','suggestions','comments','practice_attempts','activity','review_status'])assert.equal(await count('review_lesson_note_'+table,source.id),0,`B cannot read A ${table}`);
await as('student');await assert.rejects(api.note(id),/unavailable/);assert.ok((await client.storage.from(NOTE_BUCKET).download(images[0].storage_path)).error);
await as(null);await assert.rejects(api.note(id),/permission denied|unavailable/);assert.ok((await client.storage.from(NOTE_BUCKET).download(images[0].storage_path)).error);
await as('otherTeacher');await assert.rejects(api.duplicateSource(source.id),/unavailable/);
const unauthorized=duplicateNoteDraft(sourceBefore.note,ids.student).note;await assert.rejects(api.duplicate(unauthorized,[]),/allowed|permission|authoris/i);
await as('teacher');failUpload=true;let partialId;
try{await api.duplicate(duplicateNoteDraft(fetched.note,ids.other,fetched.assets).note,fetched.assets);assert.fail('Upload failure must be reported');}catch(error){assert.match(error.message,/Draft saved, but image copying did not finish/);partialId=error.copyId;assert.ok(partialId);}finally{failUpload=false;}
const partial=await api.note(partialId);assert.equal(partial.status,'draft');assert.equal(partial.published_at,null);assert.equal(partial.content_json.blocks.at(-1).assetId,'');
assert.equal((await query("select count(*)::int as n from review_lesson_note_assets where note_id=$1 and state='pending'",[partialId]))[0].n,0);
assert.deepEqual(await api.detail(source.id,{teacher:true}),sourceBefore,'Publishing/editing/failure do not mutate the original or its activity');
const noImages=duplicateNoteDraft(sourceBefore.note,ids.other).note;const plainId=await api.duplicate(noImages,[]);assert.equal((await api.note(plainId)).status,'draft');
await assert.rejects(api.duplicate(saved,[]),/new draft/);
assert.equal(JSON.stringify(notePayload(await api.note(plainId))).includes(studentImage.id),false);
console.log('Duplicate QA passed: all block/practice definitions and fresh IDs, A-to-B draft/edit/publish, unchanged source/activity, no learner-state copying, private full/thumbnail copies, order/cover remapping, cross-account/anonymous RLS, upload failure recovery and text-only copies.');
await db.close();
