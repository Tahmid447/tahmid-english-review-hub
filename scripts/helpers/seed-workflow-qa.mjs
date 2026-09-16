import {importLessonText,newNote,newBlock,notePayload,applyLessonImport} from '../../src/lesson-note-model.js';
export async function seedWorkflowQA(db,ids,as,images) {
 const call=async(name,args)=>(await db.query(`select to_jsonb(public.review_note_${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')})) as data`,Object.values(args))).rows[0].data;
 await db.query('insert into review_teacher_students(teacher_id,student_id) values($1,$2) on conflict do nothing',[ids.teacher,ids.other]);
 await as('teacher');
 for(const title of ['Health English & Grammar','Sleep and past choices']){
  const note=applyLessonImport(newNote(ids.student),importLessonText(`Lesson Title: ${title}\nShort Introduction: Review health expressions and past choices.\nToday's Focus: Talk about your condition and use should have.\nTopics: Health English, Grammar\n\n## Useful Phrases\nEnglish: I got enough sleep.\n## Grammar\nEnglish: I should have gone to bed earlier.\n## Quick Practice\n### Multiple Choice\nQuestion: Choose the past participle.\nA: slept\nB: sleep\nAnswer: A\n### Short Answer\nQuestion: Write about a past choice.`));
  note.status='published';note.allow_student_suggestions=true;
  const saved=await call('save',{target_note:null,target_student:ids.student,expected_version:0,payload:notePayload(note)});
  if(images&&title.startsWith('Health')){
   const {default:sharp}=await import('sharp');
   const asset=await call('asset_reserve',{target_note:saved.id,asset_metadata:{mime_type:'image/jpeg',alt_text:'Local teaching image fixture',title:'Teaching visual',caption:'Teacher caption',asset_type:'infographic'}});
   for(const [path,width] of [[asset.storage_path,1200],[asset.thumbnail_path,400]]){
    const bytes=await sharp(new URL('../../assets/questions/july-26-wish.png',import.meta.url).pathname).resize({width,withoutEnlargement:true}).jpeg().toBuffer();
    await db.query("insert into storage.objects(bucket_id,name,metadata) values('review-lesson-note-assets',$1,$2)",[path,{mimetype:'image/jpeg',size:bytes.length}]);images.set(path,{bytes,type:'image/jpeg'});
   }
   await call('asset_finish',{target_asset:asset.id});
   saved.content_json.blocks.push({...newBlock('image'),assetId:asset.id});
   const updated=await call('save',{target_note:saved.id,target_student:ids.student,expected_version:saved.version+1,payload:notePayload(saved)});
   await call('assets_order',{target_note:saved.id,asset_ids:[asset.id],cover_id:asset.id,expected_version:updated.version});
  }
  if(title.startsWith('Sleep')){
   await as('student');await call('mark',{target_note:saved.id,reviewed:false,expected_version:saved.version});
   const block=saved.content_json.blocks.find(b=>b.type==='multiple_choice');
   await call('practice',{target_note:saved.id,target_block:block.id,expected_question:block,action:'answer',response:{choice:0},expected_version:0});await as('teacher');
  }
 }
 const draft={...newNote(ids.student),title:'Next lesson preparation'};
 await call('save',{target_note:null,target_student:ids.student,expected_version:0,payload:notePayload(draft)});
 await db.query("insert into review_personal_cards(teacher_id,student_id,category,text_en,text_ja,teacher_note) values($1,$2,'phrases','I am feeling better today.','今日は体調がよくなりました。','Use better to describe improvement.')",[ids.teacher,ids.student]);
 await db.query("insert into review_announcements(teacher_id,title_en,title_ja,body_en,body_ja) values($1,'Bring one question to our next lesson','次のレッスンに質問を一つ','Choose an expression you would like to practise.','練習したい表現を一つ選んでください。')",[ids.teacher]);
}
