import { getStudentClient } from './supabase.js?v=20260910-member1';
const saves = new Map();
let current;
export function renderLessonSaveControls({ lesson, question, userId, showMessage }) {
  const lessonButton=document.querySelector('#saveLesson');const questionButton=document.querySelector('#saveQuestion');
  if(!lessonButton || !questionButton)return;
  current={lesson,question,userId,showMessage};
  const scope=`${userId || ''}:${lesson?.databaseLessonId || lesson?.id || ''}`;
  const render=(saved=new Set())=>{
    if(current.lesson!==lesson || current.question!==question || current.userId!==userId)return;
    for(const [button,key,label] of [[lessonButton,'','lesson · レッスン'],[questionButton,question?.id,'question · この問題']]){
      button.disabled=!lesson || (button===questionButton&&!question);
      const selected=saved.has(key);button.setAttribute('aria-pressed',String(selected));
      button.textContent=`${selected?'♥ Saved':'♡ Save'} ${label}`;
      button.onclick=async()=>{
        if(!userId){location.href=`/?return=${encodeURIComponent(location.pathname+location.search)}#account`;return;}
        button.disabled=true;
        try{
          const result=await getStudentClient().rpc('review_save_learning',{target_slug:lesson.id,target_question:key,favorite:!saved.has(key)});
          if(result.error)throw result.error;
          if(result.data)saved.add(key);else saved.delete(key);
          render(saved);showMessage?.(result.data?'Saved to My Page. · マイページのお気に入りに保存しました。':'Removed from favorites. · お気に入りを解除しました。');
        }catch{button.disabled=false;showMessage?.('Could not save. Please try again. · 保存できませんでした。もう一度お試しください。');}
      };
    }
  };
  if(!userId || !lesson?.databaseLessonId){render();return;}
  if(!saves.has(scope)){
    const entry={values:null,promise:null};saves.set(scope,entry);
    entry.promise=getStudentClient().from('review_saved_learning').select('question_key').eq('user_id',userId).eq('lesson_id',lesson.databaseLessonId).then(result=>{
      if(result.error){saves.delete(scope);throw result.error;}
      entry.values=new Set(result.data.map(row=>row.question_key));return entry.values;
    });
  }
  const entry=saves.get(scope);
  if(entry.values)render(entry.values);
  else{
    lessonButton.disabled=true;questionButton.disabled=true;
    entry.promise.then(render).catch(()=>showMessage?.('Favorites unavailable. Reload to try again. · お気に入りは再読み込みしてお試しください。'));
  }
}
