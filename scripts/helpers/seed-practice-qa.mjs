export async function seedPracticeQA(db,ids,as) {
  await as('teacher');
  await db.query('update review_student_hub_settings set inherit_features=false,allowed_level_max=2,show_progress=true,updated_by=$2 where student_id=$1',[ids.student,ids.teacher]);
  await as('student');
  for(const [category,level,rating,status] of [['words',1,'hard','learning'],['words',2,'hard','learning'],['phrases',1,'good','reviewed'],['phonics',1,'easy','mastered']]){
    const item=(await db.query('select id from review_curriculum_items where category=$1 and level=$2 and active order by id limit 1',[category,level])).rows[0];
    if(!item)throw Error('Missing practice fixture '+category+' '+level);
    await db.query('select review_save_curriculum_progress($1,$2,$3)',[item.id,status,rating]);
  }
  const notes=(await db.query("select id,content_json from review_lesson_notes where status='published' order by title")).rows;
  for(const n of notes){const b=n.content_json.blocks.find(b=>b.type==='useful_phrase');if(b)await db.query('select review_note_save_phrase($1,$2)',[n.id,b.id]);}
}
