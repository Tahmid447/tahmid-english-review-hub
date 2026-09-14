import {watchNoteUpdates} from './note-updates.js?v=20260915-practice';
import { getStudentClient } from './supabase.js?v=20260911-mobile2';
import { initialiseMemberPreferences } from './member-preferences.js?v=20260911-mobile2';
import { loadStudentAccess, applyStudentFeatureVisibility, featureAllowed } from './student-visibility.js?v=20260911-mobile2';
import { createNoteApi, noteError } from './lesson-note-api.js?v=20260915-practice';
import { cardMarkup, mountNoteView, lazyPrivateImages, noteButton } from './lesson-note-view.js?v=20260915-practice';
import { escapeHTML as e } from './store.js?v=20260911-mobile2';
import { searchText } from './lesson-note-model.js?v=20260915-practice';
import './study-music.js?v=20260911-mobile2';
const root=document.querySelector('#notesWorkspace'),api=createNoteApi(getStudentClient());
let stopUpdates=()=>{},lastChange='';
let session,view,imagesDispose=()=>{},rows=[],offset=0,loading=false;
const beforeUnload=event=>{if(view?.dirty()){event.preventDefault();event.returnValue='';}};
window.addEventListener('beforeunload',beforeUnload);
const idFromPath=()=>{const path=location.pathname.split('/').filter(Boolean);return path[0]==='my-page'&&path[1]==='notes'?path[2]||'':new URLSearchParams(location.search).get('note')||'';};
function errorView(error){root.innerHTML=`<div class="ln-empty"><h2>This notebook is not available right now.</h2><p>${e(noteError(error))}</p><a class="ln-button" href="/my-page/notes">Back to my notes · 一覧に戻る</a></div>`;}
async function openNote(id){
 if(!/^[0-9a-f-]{36}$/i.test(id)){errorView(new Error('Note unavailable'));return;}
 try{const detail=await api.detail(id);root.innerHTML='<nav class="ln-breadcrumb"><a href="/my-page/notes">← My Lesson Notes · ノート一覧</a><a href="/my-page#favorites">♡ My Phrases · お気に入り</a></nav><div data-note-reader></div>';
  view=mountNoteView(root.querySelector('[data-note-reader]'),{detail,api,userId:session.user.id,onRefresh:()=>{if(view?.dirty())return;view?.dispose();void openNote(id);}});
  document.title=`${detail.note.title} · My Lesson Notes`;
  try{await api.mark(id,false,detail.note.version);}catch(error){const warning=document.createElement('p');warning.className='ln-status';warning.setAttribute('role','status');warning.textContent=noteError(error);root.prepend(warning);}
 }catch(error){errorView(error);}
}
function renderList(){
 const query=root.querySelector('[data-note-search]').value.trim().toLowerCase(),topic=root.querySelector('[data-topic]').value,month=root.querySelector('[data-month]').value;
 const filtered=rows.filter(n=>(!query||searchText(n).includes(query))&&(!topic||n.tags.includes(topic))&&(!month||n.lesson_date.startsWith(month)));
 imagesDispose();const list=root.querySelector('[data-note-list]');
 list.innerHTML=filtered.map(n=>cardMarkup(n)).join('')||`<div class="ln-empty ln-wide"><h2>${rows.length?'A different search might help.':'Your next lesson lives here.'}</h2><p>${rows.length?'Try another topic or date. · テーマや日付を変えてみてください。':'Your teacher’s personal lesson notes will appear here after publication.<br>先生が公開した個別レッスンノートがここに届きます。'}</p></div>`;
 root.querySelector('[data-note-count]').textContent=String(rows.length);root.querySelector('[data-list-status]').textContent=`${filtered.length} shown · 表示中`;
 imagesDispose=lazyPrivateImages(list,api);
}
async function more(){
 if(loading)return;loading=true;const btn=root.querySelector('[data-load-more]');btn.disabled=true;
 try{const next=await api.list({studentId:session.user.id,status:'published',offset});rows.push(...next);offset+=next.length;btn.hidden=next.length<30;
  const topic=root.querySelector('[data-topic]'),selected=topic.value;topic.innerHTML='<option value="">All topics · すべて</option>'+[...new Set(rows.flatMap(n=>n.tags))].sort().map(t=>`<option>${e(t)}</option>`).join('');topic.value=selected;renderList();
 }catch(error){root.querySelector('[data-list-status]').textContent=noteError(error);}finally{loading=false;btn.disabled=false;}
}
async function index(){
 root.innerHTML=`<header class="ln-library-hero"><div><p class="ln-kicker">YOUR PERSONAL LEARNING NOTEBOOK</p><h1>Good lessons.<br><em>Lasting English.</em></h1><p>Revisit the phrases, discoveries and small breakthroughs from your lessons.<br>レッスンで見つけた表現や気づきを、あなたの英語に。</p></div><span class="ln-count" data-note-count>0</span></header><div class="ln-filter-bar"><label>Search loaded notes · 読み込んだノートを検索<input type="search" data-note-search placeholder="A phrase, title or topic · タイトル・テーマ"></label><label>Topic · テーマ<select data-topic><option value="">All topics · すべて</option></select></label><label>Lesson month · レッスン月<input type="month" data-month></label></div><p class="ln-status" role="status" data-list-status>Loading your notes… · ノートを読み込み中…</p><div class="ln-cards" data-note-list></div><div class="ln-actions" style="margin-top:26px">${noteButton('Load more notes · さらに表示','data-load-more')}<a class="ln-button" href="/my-page">← My Page · マイページ</a></div>`;
 root.querySelector('[data-note-search]').oninput=renderList;root.querySelector('[data-topic]').onchange=renderList;root.querySelector('[data-month]').onchange=renderList;root.querySelector('[data-load-more]').onclick=()=>void more();await more();
}
try {
 session=await initialiseMemberPreferences();
 if(!session?.user)root.innerHTML=`<div class="ln-empty"><h2>A notebook just for you.</h2><p>Sign in to read your private lesson notes. · ログインして個別ノートを開きましょう。</p><a class="ln-button ln-primary" href="/?return=${encodeURIComponent(location.pathname)}#account">Sign in · ログイン</a></div>`;
 else{
  const access=await loadStudentAccess();applyStudentFeatureVisibility(access);
  if(!featureAllowed(access,'show_homework'))throw new Error('Your teacher has hidden this learning area. · この学習エリアは先生の設定で非表示になっています。');
  const id=idFromPath();if(id)await openNote(id);else await index();
  stopUpdates=watchNoteUpdates(api.client,session.user.id,async()=>{try{const notices=await api.notifications({unreadOnly:false}),stamp=notices.filter(n=>!id||n.note_id===id).map(n=>n.updated_at).sort().at(-1)||'';if(stamp===lastChange||!stamp)return;lastChange=stamp;
   if(id){if(view?.dirty()){if(!root.querySelector('[data-new-version]')){const bar=document.createElement('div');bar.dataset.newVersion='';bar.className='ln-live-update';bar.textContent='Your teacher updated this notebook. Save your work, then reopen it. · 先生から更新が届きました。回答やメモを保存してから開き直してください。';root.prepend(bar);}return;}const y=window.scrollY;view?.dispose();await openNote(id);window.scrollTo({top:y,behavior:'instant'});}
   else {rows=[];offset=0;await index();}
  }catch{}},{noteId:id});
 }
}catch(error){errorView(error);}

window.addEventListener('pagehide',()=>{stopUpdates();view?.dispose();imagesDispose();},{once:true});
