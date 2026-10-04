import {DEFAULT_HUB_SETTINGS} from './curriculum-api.js';
import {createNoteApi,noteError} from './lesson-note-api.js';
import {mountNoteView,cardMarkup,lazyPrivateImages} from './lesson-note-view.js';
import {escapeHTML as e} from './store.js';
import {loadGlobalMusicAvailability} from './music-policy.js';

const features=[['show_dashboard','Dashboard'],['show_words','Words'],['show_phrases','Phrases'],['show_phonics','Phonics'],['show_review_lessons','Lessons'],['show_homework','Homework'],['show_progress','Progress'],['show_pricing','Plans'],['show_contact_teacher','Contact'],['show_trial_cta','Trial'],['show_payment_plan','Payment plan'],['show_announcements','Announcements'],['show_music','Study music']];
export function learnerPreviewUrl(studentId) {
 return '/teacher?studio=learners&preview_student='+encodeURIComponent(studentId);
}
export function previewFeatures(saved,global,musicAvailable) {
 const settings={...DEFAULT_HUB_SETTINGS,...saved,...(saved?.inherit_features!==false?global:{})};
 settings.show_music=settings.show_music!==false&&global?.show_music!==false&&musicAvailable;
 return settings;
}
export function openLearnerPreview({client,profile,teacherId}) {
 document.querySelector('.learner-preview-dialog')?.close();
 const dialog=document.createElement('dialog');dialog.className='learner-preview-dialog';
 const name=profile.display_name||[profile.first_name,profile.last_name].filter(Boolean).join(' ')||'Learner';
 dialog.setAttribute('aria-label',name+' · Student preview');
 dialog.innerHTML=`<div class="learner-preview-tools"><h2>${e(name)} · 生徒プレビュー</h2><button type="button" data-home>My Page</button><button type="button" data-size="desktop" aria-pressed="true">Desktop</button><button type="button" data-size="tablet" aria-pressed="false">Tablet / iPad</button><button type="button" data-size="mobile" aria-pressed="false">Mobile</button><a href="${e(learnerPreviewUrl(profile.user_id))}" target="_blank" rel="noopener">Open link · 別タブで開く</a><button type="button" data-close>Close · 閉じる</button></div><p class="ln-status">Saved settings · 保存済み設定 / Read-only · 読み取り専用</p><div class="learner-preview-frame" data-size="desktop"><div data-preview-body></div></div><p role="status" aria-live="polite"></p>`;
 const body=dialog.querySelector('[data-preview-body]'),status=dialog.querySelector('[role=status]'),api=createNoteApi(client);
 let closed=false,view=null,request=0,authSubscription,disposeImages=()=>{};
 const active=()=>!closed&&dialog.open;
 const assertActive=()=>{if(!active())throw new Error('Preview closed.');};
 const result=async query=>{const {data,error}=await query;assertActive();if(error)throw error;return data;};
 const home=async()=>{
  const token=++request;view?.dispose();view=null;disposeImages();body.innerHTML='<p class="ln-status">Loading saved learner settings... · 保存済みの設定を読み込んでいます...</p>';status.textContent='';
  try{
   const saved=await result(client.from('review_student_hub_settings').select('*').eq('student_id',profile.user_id).maybeSingle());
   const global=await result(client.from('review_site_experience').select('features').eq('id',true).maybeSingle());
   if(!global)throw new Error('Saved global settings are unavailable. · 保存済みの全体設定を読み込めません。');
   const musicAvailable=await loadGlobalMusicAvailability({refresh:true});if(!active()||token!==request)return;
   const settings=previewFeatures(saved,global?.features||{},musicAvailable);
   if(settings.account_enabled===false){body.innerHTML='<div class="learner-preview-home"><h1>Access paused · 利用停止中</h1><p>This learner’s account is disabled. · この生徒の利用は停止されています。</p></div>';return;}
   const notes=await api.list({studentId:profile.user_id,status:'published'});if(!active()||token!==request)return;
   body.innerHTML=`<div class="learner-preview-home"><p class="ln-kicker">MY PAGE · マイページ</p><h1>${e(name)}</h1><nav class="learner-preview-nav" aria-label="Visible learner features">${features.filter(([key])=>settings[key]!==false).map(([,label])=>`<span>${e(label)}</span>`).join('')}</nav><h2>Lesson Notes · レッスンノート</h2><div class="learner-preview-grid">${notes.map(n=>`<article><time>${e(n.lesson_date)}</time><h3>${e(n.title)}</h3><p>${e(n.summary||'')}</p><button type="button" data-note="${e(n.id)}">Open lesson · レッスンを開く</button></article>`).join('')||'<p>No published lesson notes. · 公開済みノートはありません。</p>'}</div><div class="learner-preview-availability"><strong>${saved?.inherit_features===false?'Individual settings · 個別設定':'Global settings · 全体設定'}</strong><p>Hidden · 非表示：${features.filter(([key])=>settings[key]===false).map(([,label])=>e(label)).join(' / ')||'None · なし'}</p><p>Levels · レベル：${e(settings.allowed_levels?.length?settings.allowed_levels.join(', '):`${settings.allowed_level_min}–${settings.allowed_level_max}`)}</p></div></div>`;
   const grid=body.querySelector('.learner-preview-grid');grid.innerHTML=notes.map(n=>cardMarkup(n)).join('')||'<p>No published lesson notes. · 公開済みノートはありません。</p>';
   grid.querySelectorAll('a.ln-button').forEach((link,index)=>link.onclick=event=>{event.preventDefault();void showNote(notes[index].id);});
   disposeImages=lazyPrivateImages(grid,api);
   if(notes.length===30)status.textContent='Latest 30 notes shown. · 最新30件を表示しています。';
  }catch(error){if(active()&&token===request){body.replaceChildren();status.textContent=noteError(error);}}
 };
 const showNote=async id=>{
  const token=++request;status.textContent='Loading lesson... · レッスンを読み込んでいます...';
  try{const detail=await api.detail(id,{teacher:true});if(!active()||token!==request)return;
   if(detail.note.student_id!==profile.user_id||detail.note.status!=='published'||detail.note.deleted_at)throw new Error('This published lesson is unavailable for this learner.');
   disposeImages();view?.dispose();view=mountNoteView(body,{detail,api,student:false});status.textContent='';
  }catch(error){if(active()&&token===request)status.textContent=noteError(error);}
 };
 dialog.querySelector('[data-home]').onclick=()=>void home();
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();
 dialog.querySelectorAll('button[data-size]').forEach(button=>button.onclick=()=>{dialog.querySelector('.learner-preview-frame').dataset.size=button.dataset.size;dialog.querySelectorAll('button[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
 dialog.onclose=()=>{closed=true;request++;disposeImages();view?.dispose();authSubscription?.unsubscribe();dialog.remove();};
 document.body.append(dialog);dialog.showModal();
 authSubscription=client.auth.onAuthStateChange((event,session)=>{if(session?.user?.id!==teacherId&&active())dialog.close();})?.data?.subscription;
 void home();
 return dialog;
}
