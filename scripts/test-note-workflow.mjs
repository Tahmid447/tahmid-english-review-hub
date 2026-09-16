import assert from 'node:assert/strict';
import {db,ids,as} from './helpers/lesson-note-test-db.mjs';
import {importLessonText,applyLessonImport,newNote,notePayload,noteListActions} from '../src/lesson-note-model.js';
import {createSectionAwareness,learnerNextActions,teacherNoteActions,noteHref,nextActionsMarkup} from '../src/learning-overview.js';
const call=async(name,args={})=>(await db.query(`select to_jsonb(public.review_note_${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')})) as data`,Object.values(args))).rows[0].data;
const content=`## Natural English
English: I feel dizzy.
Original: I am dizziness.
Japanese: めまいがします。
## Grammar
English: I should have slept earlier.
Explanation: Use should have + past participle for a past choice.
### Multiple Choice
Question: Choose the past participle.
A: slept
B: sleep
Answer: A
### Short Answer
Question: Write about a past choice.`;
const explicit=`**Lesson Title:** Sep 13 - Health English & Grammar
Short Introduction:
Review the natural English and grammar from today's lesson.
Today's Focus:
Talk about your condition and past choices.
Topics:
- Health English
- Natural English
- Grammar

${content}`;
const imported=importLessonText(explicit);
assert.equal(imported.metadata.title,'Sep 13 - Health English & Grammar');
assert.equal(imported.metadata.summary,"Review the natural English and grammar from today's lesson.");
assert.equal(imported.metadata.focus,'Talk about your condition and past choices.');
assert.deepEqual(imported.metadata.tags,['Health English','Natural English','Grammar']);
assert.deepEqual(imported.blocks.map(b=>b.type),['natural_english_upgrade','grammar_point','multiple_choice','short_answer']);
assert.deepEqual(imported.blocks[2].choices,['slept','sleep']);assert.equal(imported.blocks[2].answerKey,'A');
assert.equal(imported.blocks[0].japaneseSupport,'めまいがします。');
const automatic=importLessonText(content);
assert.deepEqual(automatic.metadata.tags,['Natural English','Grammar']);assert.match(automatic.metadata.focus,/I feel dizzy/);
assert.doesNotMatch(automatic.metadata.summary,/vocabulary|health|pronunciation|journey/i);
const heading=importLessonText('# Sleep and past choices\n'+content);assert.equal(heading.metadata.title,'Sleep and past choices');
assert.equal(importLessonText('Lesson Title: Explicit\n# Heading\n'+content).metadata.title,'Explicit');
assert.equal(importLessonText("Today’s Focus: Use should have.\n"+content).metadata.focus,'Use should have.');
const plainBody=importLessonText('Lesson Title: A past choice\n\nI should have slept earlier.');
assert.equal(plainBody.metadata.title,'A past choice');assert.equal(plainBody.blocks[0].englishText,'I should have slept earlier.');
const original={...newNote(ids.student),title:'My title',summary:'My introduction',focus:'k',tags:['My topic']};
const originalJson=JSON.stringify(original),protectedNote=applyLessonImport(original,imported);
for(const key of ['title','summary','focus','tags'])assert.deepEqual(protectedNote[key],original[key]);
assert.equal(JSON.stringify(original),originalJson);assert.equal(protectedNote.content_json.blocks.length,4);
const replaced=applyLessonImport(original,imported,['summary','focus']);assert.equal(replaced.focus,imported.metadata.focus);assert.equal(replaced.title,original.title);
assert.equal(applyLessonImport(newNote(ids.student),imported).title,imported.metadata.title);
assert.throws(()=>applyLessonImport(newNote(ids.student),{...imported,metadata:{...imported.metadata,tags:Array(13).fill('x')}}),/12 topics/);
assert.throws(()=>applyLessonImport({...original,content_json:{schemaVersion:1,blocks:Array(149).fill(imported.blocks[0])}},imported),/150/);
assert.doesNotMatch(JSON.stringify(importLessonText('Lesson Title: <script>alert(1)</script>Safe\n'+content)),/<script>/);
assert.deepEqual(noteListActions({status:'published'}).map(a=>a[0]),['preview','activity','media','duplicate','archive']);
assert.deepEqual(noteListActions({status:'archived'}).map(a=>a[0]),['preview','activity','media','duplicate','restore','trash']);
assert.deepEqual(noteListActions({status:'archived',deleted_at:'now'}).map(a=>a[0]),['restore']);
assert.doesNotMatch(JSON.stringify(noteListActions({deleted_at:'now'})),/permanent|purge/i);
const storage=new Map(),adapter={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
const seenA=createSectionAwareness(ids.student,adapter),seenB=createSectionAwareness(ids.other,adapter),notice={id:'notice',updated_at:'2026-09-15T10:00:00Z'};
assert.equal(seenA.unread('announcements',notice),true);seenA.mark('announcements',[notice]);assert.equal(seenA.unread('announcements',notice),false);
assert.equal(seenB.unread('announcements',notice),true);assert.equal(seenA.unread('announcements',{...notice,updated_at:'2026-09-16T10:00:00Z'}),true);
assert.equal(createSectionAwareness(ids.student,adapter).unread('announcements',notice),false);
assert.deepEqual(learnerNextActions(),[]);
assert.match(noteHref('lesson','phrase'),/#block-phrase$/);assert.doesNotMatch(nextActionsMarkup([{title:'<script>',detail:'x',href:'#personal',label:'Review'}]),/<script>/);

let note=applyLessonImport(newNote(ids.student),imported);
const save=async()=>note=await call('save',{target_note:note.id,target_student:ids.student,expected_version:note.version,payload:notePayload(note)});
await as('teacher');await save();
let overview=await call('overview',{for_teacher:true});assert.equal(overview.notes.length,1);assert.equal(teacherNoteActions(overview.notes)[0].priority,2);
assert.equal((await call('overview')).notes.length,0,'Owner My Page must not display teaching notes assigned to learners');
await as('student');assert.equal((await call('overview')).notes.length,0,'Private drafts remain hidden');
await as('teacher');note.status='published';await save();
await as('student');overview=await call('overview');assert.equal(overview.new_notes,1);assert.equal(overview.notes[0].practice_total,2);assert.equal(overview.notes[0].practice_completed,0);
assert.equal(learnerNextActions({notes:overview.notes})[0].kind,'note');assert.equal((await call('overview',{for_teacher:true})).notes.length,0,'Teacher flag grants no authority');
assert.ok(!('content_json' in overview.notes[0]));assert.ok(!('response_json' in overview.notes[0]));
await call('mark',{target_note:note.id,reviewed:false,expected_version:note.version});
const choice=note.content_json.blocks[2];
await call('practice',{target_note:note.id,target_block:choice.id,expected_question:choice,action:'answer',response:{choice:0},expected_version:0});
overview=await call('overview');assert.equal(overview.new_notes,0);assert.equal(overview.notes[0].practice_completed,1);assert.equal(overview.notes[0].next_block,note.content_json.blocks[3].id);
const actions=learnerNextActions({notes:overview.notes,announcements:[{...notice,title_en:'Your next lesson'}],cards:[{id:'card',text_en:'Sleep well.'}]});
assert.equal(actions.length,3);assert.equal(actions[0].kind,'practice');assert.match(actions[0].href,/#block-/);
await as('other');assert.equal((await call('overview')).notes.length,0);
await as('otherTeacher');assert.equal((await call('overview',{for_teacher:true})).notes.length,0);
await as(null);await assert.rejects(call('overview'),/permission denied/);
await as('teacher');overview=await call('overview',{for_teacher:true});assert.equal(overview.notes[0].unread_activity,1);assert.match(teacherNoteActions(overview.notes)[0].href,/view=activity/);
note.content_json.blocks[2].hint='Think about sleep.';await save();
await as('student');overview=await call('overview');assert.equal(overview.updated_notes,1);assert.equal(overview.notes[0].practice_completed,0,'Changed question invalidates old progress');
await as('teacher');note.status='archived';await save();assert.equal((await call('overview',{for_teacher:true})).notes.length,0);
await as('student');assert.equal((await call('overview')).notes.length,0);
await as('teacher');await call('trash',{target_note:note.id,restore_note:false,expected_version:note.version});
let saved=(await db.query('select * from review_lesson_notes where id=$1',[note.id])).rows[0];
await assert.rejects(call('trash',{target_note:note.id,restore_note:true,expected_version:note.version}),/NOTE_CONFLICT/);
await call('trash',{target_note:note.id,restore_note:true,expected_version:saved.version});
overview=await call('overview',{for_teacher:true});assert.equal(overview.notes[0].status,'draft');
await as('student');assert.equal((await call('overview')).notes.length,0);
console.log('Workflow QA passed: explicit/generated/protected metadata, semantic practice, scoped read markers, priorities, read-only overview, stale questions, archive/trash restore and cross-account RLS.');
await db.close();
