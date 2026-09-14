import assert from 'node:assert/strict';
import {db,ids,as,scalar} from './helpers/lesson-note-test-db.mjs';
import {newNote,newBlock,notePayload,importLessonText} from '../src/lesson-note-model.js';
import {practiceSummary} from '../src/note-practice-model.js';
import {richTextMarkup,applyMark,moveMarks} from '../src/note-rich-text.js';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
const call=async(name,args)=>(await db.query(`select to_jsonb(public.review_note_${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')})) as data`,Object.values(args))).rows[0].data;
const rejects=async(fn,pattern=/unavailable|not allowed|authorisation|permission|NOTE_CONFLICT|Invalid|Choose|Archive|Restore|Add|Duplicate/i)=>{await assert.rejects(fn,pattern);count++;};
const source=`# Everyday English
## Quick Practice
### Multiple Choice
Question: Choose the natural sentence.
A: I have an update.
B: It has update.
Answer: A
Japanese: 自然な文を選びましょう。
Hint: Who has the update?
Explanation: Use I have to share your news.
### Fill in the Blank
Question: I ___ home at six.
Answer: got
Accepted answers: arrived
### Error Correction
Question: It has update.
Answer: I have an update.
### Sentence Reorder
Question: Put the words in order.
Items:
- home
- I
- went
Answer: I went home.
### Japanese to English Practice
Question: Say this in English: 私は家に帰りました。
Answer: I went home.
Accepted answers: I returned home.
### Short Answer
Question: Tell me about your day.
Answer: Today I worked at home.
### Self Check
Question: Can you explain your news?
### Remember & Review
Question: Review the phrase: I have an update.
## Images
Add a worksheet here later.
`;
const imported=importLessonText(source);
eq(imported.blocks.map(b=>b.type),['quick_practice_group','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review','image']);
const questions=imported.blocks.slice(1,-1);
eq(questions[0].choices,['I have an update.','It has update.']);eq(questions[1].acceptedAnswers,['arrived']);
eq(new Set(questions.map(b=>b.questionId)).size,8);
let note={...newNote(ids.student),title:imported.title,focus:'Express yourself naturally.',content_json:{schemaVersion:1,blocks:imported.blocks},allow_student_comments:true};
const save=async()=>note=await call('save',{target_note:note.id,target_student:ids.student,expected_version:note.version,payload:notePayload(note)});
await as('teacher');await save();
await as('student');await rejects(()=>call('practice',{target_note:note.id,target_block:questions[0].id,expected_question:questions[0],action:'answer',response:{choice:0},expected_version:0}));
await as('teacher');note.status='published';await save();
await as('student');eq(await scalar('select count(*)::int from review_lesson_note_notifications'),1,'Student receives published note notice');
const attempts=new Map();
async function practice(b,action,response={}) {const a=await call('practice',{target_note:note.id,target_block:b.id,expected_question:b,action,response,expected_version:attempts.get(b.questionId)?.version||0});attempts.set(b.questionId,a);return a;}
let a=await practice(questions[0],'open');eq(a.answered_at,null);eq(a.completed,false);
a=await practice(questions[0],'answer',{choice:1});eq(a.is_correct,false);eq(a.completed,false);
a=await practice(questions[0],'reveal');eq(a.answer_revealed,true);
a=await practice(questions[0],'retry');eq(a.response_json,{});eq(a.previous_answers.length,1);
a=await practice(questions[0],'answer',{choice:0});eq(a.is_correct,true);eq(a.completed,true);eq(a.response_json.text,'I have an update.');
await rejects(()=>call('practice',{target_note:note.id,target_block:questions[0].id,expected_question:questions[0],action:'answer',response:{choice:0},expected_version:a.version-1}));
await rejects(()=>practice(questions[0],'answer',{choice:99}));
eq((await practice(questions[1],'answer',{text:'  GOT.  '})).is_correct,true);
eq((await practice(questions[1],'answer',{text:'arrived'})).is_correct,true);
eq((await practice(questions[2],'answer',{text:'I   have an update!'})).is_correct,true);
await rejects(()=>practice(questions[3],'answer',{order:[0,0,2]}));
eq((await practice(questions[3],'answer',{order:[1,2,0]})).is_correct,true);
eq((await practice(questions[4],'answer',{text:'I returned home.'})).is_correct,true);
a=await practice(questions[5],'answer',{text:'I played with my dog.'});eq(a.is_correct,null,'Free answers are never fake AI graded');eq(a.completed,true);
eq((await practice(questions[6],'self_check',{state:'review'})).self_check_status,'review');
eq((await practice(questions[7],'self_check',{state:'understood'})).completed,true);
let summary=practiceSummary(questions,[...attempts.values()]);eq(summary.total,8);eq(summary.attempted,8);eq(summary.completed,7);eq(summary.correct,5);eq(summary.review,1);
// All rows are restricted to the assigned learner/teacher, and RPC never accepts a forged student.
await as('other');eq(await scalar('select count(*)::int from review_lesson_note_practice_attempts'),0);
await rejects(()=>practice(questions[0],'answer',{choice:0}));
await as('otherTeacher');eq(await scalar('select count(*)::int from review_lesson_note_practice_attempts'),0);
await as(null);await rejects(()=>db.exec('select * from review_lesson_note_practice_attempts'));
await as('teacher');eq(await scalar('select count(*)::int from review_lesson_note_practice_attempts'),8);
await rejects(()=>practice(questions[0],'answer',{choice:0}));
eq(await scalar("select counts->>'practice' from review_lesson_note_notifications where recipient_id=auth.uid()"),'8','Answers aggregate per question');
await call('set_read',{target_note:note.id,make_unread:false});eq(await scalar('select unread from review_lesson_note_notifications'),false);
await call('set_read',{target_note:note.id,make_unread:true});eq(await scalar('select unread from review_lesson_note_notifications'),true);
await as('student');await rejects(()=>db.exec('update review_lesson_note_practice_attempts set is_correct=true'));
const marks={version:1,spans:[{start:0,end:5,bold:true,color:'yellow'}]};
let annotation=await call('annotate_rich',{target_note:note.id,target_block:'',body_text:'Hello 日本語',format_json:marks,expected_version:0});eq(annotation.body_format,marks);
await rejects(()=>call('annotate_rich',{target_note:note.id,target_block:'',body_text:'Hello',format_json:{version:1,spans:[{start:0,end:5,color:'url(evil)'}]},expected_version:annotation.version}),/Invalid note mark/);
await as('teacher');eq(await scalar('select body_format from review_lesson_note_annotations'),marks,'Teacher sees same formatting');
await as('student');annotation=await call('annotate',{target_note:note.id,target_block:'',body_text:'Legacy edit',expected_version:annotation.version});eq(annotation.body_format,{version:1,spans:[]});
await call('set_reviewed',{target_note:note.id,reviewed:true,expected_version:note.version});eq(await scalar('select reviewed_version from review_lesson_note_review_status'),note.version);
await call('set_reviewed',{target_note:note.id,reviewed:false,expected_version:note.version});eq(await scalar('select reviewed_version from review_lesson_note_review_status'),0);
await as('teacher');eq(await scalar("select counts ? 'review_undone' from review_lesson_note_notifications"),true);
// Editing a question retains its history but prevents old grades counting toward new content.
const oldQuestion=structuredClone(questions[0]);questions[0].englishText='Choose the most natural sentence.';note.content_json.blocks[1]=questions[0];await save();
eq(practiceSummary(questions,[...attempts.values()]).completed,6);
await as('student');await rejects(()=>practice(oldQuestion,'answer',{choice:0}));
a=await practice(questions[0],'answer',{choice:0});eq(a.previous_answers.length,2);eq(a.question_snapshot.englishText,questions[0].englishText);
for(let i=0;i<8;i++){await practice(questions[0],'retry');await practice(questions[0],'answer',{choice:0});}eq(attempts.get(questions[0].questionId).previous_answers.length,5,'Retry history is bounded');
await as('teacher');await rejects(()=>call('trash',{target_note:note.id,restore_note:false,expected_version:note.version}));
note.status='archived';await save();await as('student');await rejects(()=>call('trash',{target_note:note.id,restore_note:false,expected_version:note.version}));await rejects(()=>practice(questions[0],'answer',{choice:0}));
await as('teacher');await call('trash',{target_note:note.id,restore_note:false,expected_version:note.version});note.version++;eq(await scalar('select deleted_at is not null from review_lesson_notes'),true);
note.status='published';await rejects(save);await call('trash',{target_note:note.id,restore_note:true,expected_version:note.version});note.version++;eq(await scalar('select status from review_lesson_notes'),'draft');eq(await scalar('select deleted_at from review_lesson_notes'),null);
// Publication rejects incomplete new questions while drafts remain editable.
note.content_json.blocks=[{...newBlock('multiple_choice'),englishText:'Choose.'}];await rejects(save,/two answer choices/);note.status='draft';await save();
note.status='published';note.content_json.blocks[0].choices=['A','B'];note.content_json.blocks[0].englishText='';await rejects(save,/practice prompt/);
await db.close();
// Formatting never renders HTML or arbitrary styles; changing text moves selection marks.
eq(richTextMarkup('<script>x</script>',{spans:[{start:0,end:8,bold:true,color:'red'}]}),'<strong>&lt;script&gt;</strong>x&lt;/script&gt;');
eq(moveMarks('Hello world','Hi Hello world',{spans:[{start:6,end:11,bold:true}]}).spans,[{start:9,end:14,bold:true}]);
eq(applyMark(marks,1,3,null).spans,[{start:0,end:1,bold:true,color:'yellow'},{start:3,end:5,bold:true,color:'yellow'}]);
eq(richTextMarkup('日本語',{spans:[{start:1,end:2,color:'blue'}]}),'日<mark class="ln-mark-blue">本</mark>語');
console.log(`PASS: ${count} practice, rich text, notifications, Trash and RLS checks.`);
