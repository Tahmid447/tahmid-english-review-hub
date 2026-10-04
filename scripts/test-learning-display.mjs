import assert from 'node:assert/strict';
import {createNoteApi} from '../src/lesson-note-api.js';
import {previewFeatures,learnerPreviewUrl} from '../src/learner-preview.js';
import {newNote,lessonQuickPrompt,importLessonText} from '../src/lesson-note-model.js';

const rows=Array.from({length:205},(_,i)=>({note_id:String(i),unread:true,updated_at:'2026-01-01T00:00:00Z'}));
rows.push({note_id:'future',unread:true,updated_at:'2099-01-01T00:00:00Z'});
let calls=0,fail='',current=true;
const client={
 from(){let cutoff;const query={select(){return query;},eq(){return query;},lte(key,value){cutoff=value;return query;},order(){return query;},limit(){return query;},then(resolve){return Promise.resolve({data:rows.filter(r=>r.unread&&r.updated_at<=cutoff).slice(0,100),error:null}).then(resolve);}};return query;},
 async rpc(name,{target_note,make_unread}){assert.equal(name,'review_note_set_read');calls++;if(target_note===fail)return {error:new Error('Temporary failure')};rows.find(r=>r.note_id===target_note).unread=make_unread;return {data:null,error:null};},
};
const api=createNoteApi(client);
assert.equal(await api.markAllRead(),205);
assert.equal(calls,205);
assert.equal(rows.find(r=>r.note_id==='future').unread,true,'New notifications remain unread');
rows[0].unread=rows[1].unread=true;fail='1';
await assert.rejects(api.markAllRead(),/Temporary failure/);
assert.equal(rows[0].unread,false,'Completed items remain read after a partial failure');
assert.equal(rows[1].unread,true);
fail='';current=false;assert.equal(await api.markAllRead({isCurrent:()=>current}),0);
assert.equal(rows[1].unread,true,'Account change cancels remaining operations');
assert.equal(await api.markAllRead(),1);
assert.equal(previewFeatures({inherit_features:false,show_music:true},{show_music:false},true).show_music,false);
assert.equal(previewFeatures({inherit_features:false,show_words:false},{show_words:true},true).show_words,false);
assert.equal(previewFeatures({inherit_features:true,show_words:true},{show_words:false},true).show_words,false);
assert.equal(previewFeatures({}, {}, false).show_music,false);
assert.ok(learnerPreviewUrl('x&y').endsWith('x%26y'));
const prompt=lessonQuickPrompt({...newNote(),lesson_date:'2026-10-04'});
const imported=importLessonText(prompt.slice(prompt.indexOf('Lesson Date:')));
assert.equal(imported.metadata.lesson_date,'2026-10-04');
assert.deepEqual(new Set(imported.blocks.filter(b=>b.questionId).map(b=>b.type)),new Set(['fill_in_blank','multiple_choice','japanese_to_english_practice','error_correction','short_answer','self_check']));
console.log('Learning display: notification paging/retry/cancellation, preview inheritance/music OFF, six-format Quick Prompt passed.');
