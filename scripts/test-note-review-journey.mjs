import assert from 'node:assert/strict';
import {db,ids,as,scalar} from './helpers/lesson-note-test-db.mjs';
import {newNote,newBlock,notePayload} from '../src/lesson-note-model.js';
import {reviewSummary,pointReview,learningSnapshot} from '../src/note-review-model.js';
import {journeyMarkup,teacherPointMarkup} from '../src/note-review-view.js';

const call=async(name,args={})=>(await db.query(`select to_jsonb(public.review_note_${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')})) as data`,Object.values(args))).rows[0].data;
const phrase={...newBlock('useful_phrase'),englishText:'I am proud of myself.'},grammar={...newBlock('grammar_point'),englishText:'Use proud of.'};
const question={...newBlock('multiple_choice'),englishText:'Choose the preposition.',choices:['of','to'],answerKey:'A'};
let note={...newNote(ids.student),title:'A little progress',focus:'Describe an achievement.',content_json:{schemaVersion:1,blocks:[phrase,grammar,question]}};
const save=async()=>note=await call('save',{target_note:note.id,target_student:ids.student,expected_version:note.version,payload:notePayload({...note,content_json:{schemaVersion:1,blocks:[phrase,grammar,question]}})});
const review=(block,state='understood',version=0)=>call('review_point',{target_note:note.id,target_block:block.id,expected_block:block,review_state:state,expected_version:version});
try{
 await as('teacher');await save();await as('student');await assert.rejects(()=>review(phrase),/unavailable/i);
 await as('teacher');note.status='published';await save();await as('student');
 await call('mark',{target_note:note.id,reviewed:false,expected_version:note.version});
 let journey=await call('journey');assert.equal(journey.totals.opened,1);assert.equal(journey.totals.understood,0);assert.equal(journey.totals.reviewed,0);
 let a=await review(phrase);assert.equal(a.state,'understood');assert.deepEqual(a.block_snapshot,learningSnapshot(phrase));
 assert.equal(pointReview({...phrase,title:'A different teaching point'},[a]),undefined,'Teaching titles are content, not presentation');
 assert.equal((await review(phrase,'understood',a.version)).version,a.version,'Repeated identical state is idempotent');
 await assert.rejects(()=>review(phrase,'revisit',0),/NOTE_CONFLICT/);
 a=await review(phrase,'revisit',a.version);assert.equal(reviewSummary([phrase,grammar],[a]).revisit,1);
 a=await review(phrase,'understood',a.version);await review(grammar,'revisit');
 await assert.rejects(()=>review(question),/unavailable/i);
 await assert.rejects(()=>review({...phrase,englishText:'forged'},'understood',a.version),/NOTE_CONFLICT/);
 await assert.rejects(()=>review(phrase,'invalid',a.version),/Invalid/);
 await assert.rejects(()=>db.exec("update review_lesson_note_block_reviews set state='understood'"),/permission/);
 const beforeAnnotation=await call('annotate_rich',{target_note:note.id,target_block:phrase.id,body_text:'My memory',format_json:{version:1,spans:[{start:0,end:2,bold:true}]},expected_version:0});
 journey=await call('journey');assert.equal(journey.totals.understood,1);assert.equal(journey.totals.revisit,1);assert.equal(journey.totals.practice_completed,0);
 assert.equal(journey.days.length,7);assert.equal(journey.days.reduce((s,d)=>s+Number(d.points),0),2,'Toggling a point does not inflate daily counts');
 assert.equal((await call('journey',{for_teacher:true})).totals.lessons,0);
 await assert.rejects(()=>call('journey',{local_timezone:'not/a/timezone'}),/Invalid/);
 await call('practice',{target_note:note.id,target_block:question.id,expected_question:question,action:'answer',response:{choice:0},expected_version:0});
 journey=await call('journey');assert.equal(journey.totals.practice_correct,1);assert.equal(journey.totals.practice_completed,1);assert.equal(journey.days.reduce((s,d)=>s+Number(d.practice),0),1);
 assert.equal((await call('journey',{target_student:ids.other})).totals.lessons,0);
 await as('teacher');assert.equal((await call('journey',{for_teacher:true,target_student:ids.student})).totals.understood,1);
 assert.equal(await scalar('select count(*)::int from review_lesson_note_block_reviews'),2);await assert.rejects(()=>review(phrase,'revisit',a.version),/unavailable/i);
 for(const role of ['other','otherTeacher']){await as(role);assert.equal(await scalar('select count(*)::int from review_lesson_note_block_reviews'),0);assert.equal((await call('journey',{for_teacher:role==='otherTeacher',target_student:ids.student})).totals.lessons,0);await assert.rejects(()=>review(phrase,'understood',a.version),/unavailable/i);}
 await as(null);await assert.rejects(()=>db.exec('select * from review_lesson_note_block_reviews'),/permission/);await assert.rejects(()=>call('journey'),/permission/);await assert.rejects(()=>review(phrase),/permission/);
 await as('teacher');phrase.displayOptions={collapsed:true};phrase.tags=['new label'];await save();await as('student');assert.equal((await call('journey')).totals.understood,1,'Presentation-only edits keep understanding');assert.equal(pointReview(phrase,[a]).state,'understood');
 await as('teacher');const old=structuredClone(phrase);phrase.englishText='I am proud of my progress.';await save();await as('student');assert.equal((await call('journey')).totals.understood,0,'Changed teaching text needs a fresh check-in');assert.equal(pointReview(phrase,[a]),undefined);await assert.rejects(()=>review(old,'understood',a.version),/NOTE_CONFLICT/);
 a=await review(phrase,'understood',a.version);a=await review(phrase,'unmarked',a.version);assert.equal((await call('journey')).totals.understood,0);
 assert.deepEqual(await scalar('select body_format from review_lesson_note_annotations'),beforeAnnotation.body_format,'Personal annotation formatting remains intact');
 await as('teacher');note.status='archived';await save();await as('student');await assert.rejects(()=>review(phrase,'understood',a.version),/unavailable/i);assert.equal((await call('journey')).totals.lessons,0);
 await as('teacher');note.status='published';await save();
 // A bounded next-action list must not cap the overall statistics.
 await db.exec('reset role');await db.query(`insert into review_lesson_notes(student_id,teacher_id,title,focus,status,content_json)
 select student_id,teacher_id,title,focus,status,content_json from review_lesson_notes cross join generate_series(1,101) where id=$1`,[note.id]);
 await as('student');journey=await call('journey');assert.equal(journey.totals.lessons,102);assert.equal(journey.notes.length,100);assert.equal(journey.totals.learning_total,204);
 assert(journeyMarkup(journey).includes('Opening a note does not mark it understood'));
 assert(teacherPointMarkup({...note,content_json:{blocks:[{...phrase,englishText:'<script>bad</script>'}]}},[a]).includes('&lt;script&gt;'));
 console.log('PASS: review persistence/undo, concurrency, content changes, daily deduplication, complete aggregates, teacher/student/anonymous boundaries, and annotation preservation.');
}finally{await db.close();}
