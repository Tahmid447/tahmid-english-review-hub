import {getStudentClient,getTeacherClient} from './supabase.js?v=20260911-mobile2';
import {createNoteApi,noteError} from './lesson-note-api.js?v=20260915-practice';
import {escapeHTML as e} from './store.js?v=20260911-mobile2';
import {eventLabels,watchNoteUpdates} from './note-updates.js?v=20260915-practice';
const teacher=location.pathname.startsWith('/teacher')||new URLSearchParams(location.search).get('owner_preview')==='1';
const client=teacher?getTeacherClient():getStudentClient();
let account='',dispose=()=>{},root,dialog,items=[],generation=0,loading=false;
const api=client&&createNoteApi(client);
function clear(){generation++;dispose();dispose=()=>{};root?.remove();dialog?.close();dialog?.remove();root=dialog=null;items=[];account='';loading=false;}
function drawDialog(){
 if(!dialog?.open)return;
 const list=dialog.querySelector('[data-notice-list]');
 list.innerHTML=items.map(n=>`<article class="note-notice ${n.unread?'is-unread':''}"><span>${n.unread?'● Unread · 未読':'Read · 確認済み'}</span><h3><a data-open-notice="${e(n.note_id)}" href="${teacher?`/teacher?studio=notes&note=${encodeURIComponent(n.note_id)}&view=activity`:`/my-page/notes/${encodeURIComponent(n.note_id)}`}">${e(n.note?.title||'Lesson note · レッスンノート')}</a></h3><p>${Object.entries(n.counts).map(([key,count])=>`${e(eventLabels[key]||key)} × ${count}`).join(' · ')}</p><small>${e(new Date(n.updated_at).toLocaleString())}</small><button type="button" data-read-notice="${e(n.note_id)}" data-unread="${!n.unread}">${n.unread?'Mark read · 確認済みに':'Mark unread · 未読に戻す'}</button></article>`).join('')||'<p class="note-inbox-empty">You’re up to date. Important lesson updates will appear here.<br>今は新しい通知がありません。ノートやコメントなどの更新をお知らせします。</p>';
 list.querySelectorAll('[data-read-notice]').forEach(btn=>btn.onclick=async()=>{btn.disabled=true;try{await api.setRead(btn.dataset.readNotice,btn.dataset.unread==='true');await refresh();}catch(error){dialog.querySelector('[role=status]').textContent=noteError(error);btn.disabled=false;}});
 list.querySelectorAll('[data-open-notice]').forEach(link=>link.onclick=()=>{void api.setRead(link.dataset.openNotice,false).catch(()=>{});});
}
async function refresh(){
 if(loading||!account)return;loading=true;const token=generation;
 try{const next=await api.notifications({unreadOnly:false});if(token!==generation)return;items=next;const count=items.filter(n=>n.unread).length;
  root.querySelector('button').textContent=`🔔 Notifications · お知らせ${count?` (${count})`:''}`;
  root.querySelector('button').setAttribute('aria-label',`Notifications · お知らせ ${count} unread · 未読`);
  root.querySelector('[role=status]').textContent=count?`${count} unread lesson updates · 未読のノート更新`:'';
  window.dispatchEvent(new CustomEvent('lesson-note-inbox',{detail:{count}}));drawDialog();
 }catch(error){if(dialog?.open)dialog.querySelector('[role=status]').textContent=noteError(error);}
 finally{if(token===generation)loading=false;}
}
function show(){
 if(dialog?.open)return;
 dialog=document.createElement('dialog');dialog.className='note-inbox-dialog';dialog.innerHTML='<div class="note-inbox-heading"><h2>Notifications · お知らせ</h2><button type="button" data-close>Close × · 閉じる</button></div><p>Lesson changes, comments and progress, gathered in one place.<br>大切なノート・コメント・学習の更新をまとめています。</p><div data-notice-list></div><p role="status" aria-live="polite"></p>';
 document.body.append(dialog);dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();dialog.showModal();drawDialog();void refresh();
}
function identity(session){
 const id=session?.user?.id||'';if(id===account)return;clear();if(!id)return;account=id;
 root=document.createElement('div');root.className='note-inbox-control';root.innerHTML='<button type="button" aria-haspopup="dialog">🔔 Notifications · お知らせ</button><span class="note-inbox-live" role="status" aria-live="polite"></span>';
 const host=document.querySelector('header nav')||document.querySelector('header')||document.body;host.append(root);root.querySelector('button').onclick=show;
 dispose=watchNoteUpdates(client,id,refresh);void refresh();
}
if(client){const resume=()=>void client.auth.getSession().then(({data})=>identity(data.session));resume();client.auth.onAuthStateChange((event,session)=>setTimeout(()=>identity(session),0));window.addEventListener('pagehide',clear);window.addEventListener('pageshow',event=>{if(event.persisted)resume();});}
