import assert from 'node:assert/strict';
process.on('uncaughtException',error=>{console.error(error.message,error.query||'');process.exit(1);});
import {readFile} from 'node:fs/promises';
import {practicedRows,filterPractice,curriculumItemHref} from '../src/practice-collection-model.js';
import {fetchAllQueryRows} from '../src/supabase.js';
const rows=Array.from({length:1003},(_,i)=>({item_id:`item-${i}`,self_rating:['hard','good','easy'][i%3],review_count:1,item:{id:`item-${i}`,category:['words','phrases','phonics'][i%3],level:i%32+1,title_en:`Word ${i}`,title_ja:'英語',active:true}}));
const pages=await fetchAllQueryRows(()=>({range:async(a,b)=>({data:rows.slice(a,b+1),error:null})}));
assert.equal(pages.data.length,1003);
const failed=await fetchAllQueryRows(()=>({range:async a=>a?{error:Error('offline')}:{data:rows.slice(0,1000),error:null}}));
assert.equal(failed.data,null,'A failed later page cannot masquerade as a complete collection');
const visible=practicedRows([...rows,{item:null,review_count:2},{item:{category:'words',active:false},review_count:1},{item:{category:'words'},review_count:0}]);
assert.equal(visible.length,1003);
assert.equal(filterPractice(visible,{rating:'hard'}).length,335);
assert(filterPractice(visible,{category:'words',rating:'hard'}).some(r=>r.item.level===2));
assert(filterPractice(visible,{level:5}).every(r=>r.item.level===5));
assert.equal(filterPractice(visible,{search:'Word 1002'}).length,1);
assert(practicedRows(rows,['phrases']).every(r=>r.item.category==='phrases'));
assert.match(curriculumItemHref(rows[0].item),/category=words&level=1&item=item-0/);
assert(!(await readFile(new URL('../src/note-review-view.js',import.meta.url),'utf8')).includes('先生にも反映されます'));

const {db,ids,as}=await import('./helpers/lesson-note-test-db.mjs');
try{
  await (await import('./helpers/seed-practice-qa.mjs')).seedPracticeQA(db,ids,as);
  const query=`select p.*,to_jsonb(i) as item from review_curriculum_progress p left join review_curriculum_items i on i.id=p.item_id where p.student_id='${ids.student}'`;
  const own=(await db.query(query)).rows;
  assert.equal(practicedRows(own).length,4);
  assert.deepEqual([...new Set(own.map(r=>r.self_rating))].sort(),['easy','good','hard']);
  await as('other');assert.equal((await db.query(query)).rows.length,0,'Another learner cannot read the collection');
  await as(null);await assert.rejects(db.query(query),/permission denied/);
  await as('teacher');await db.query('update review_student_hub_settings set allowed_level_max=1 where student_id=$1',[ids.student]);
  await as('student');const restricted=(await db.query(query)).rows;
  assert.equal(practicedRows(restricted).length,3,'Revoked levels retain progress but expose no item payload');
  await as('teacher');assert.equal((await db.query(query)).rows.length,4,'No previous rating is deleted');
  console.log('Practice collection passed: >1000 items, failed-page handling, all categories/ratings/levels/search, neutral copy and real RLS/revocation.');
}finally{await db.close();}
