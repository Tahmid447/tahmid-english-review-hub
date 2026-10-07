import {escapeHTML as e} from './store.js?v=20260911-mobile2';
import {pointTitle} from './note-review-model.js';

export function mountMobileNotebook(root,{notebooks,note}) {
 const media=window.matchMedia('(max-width:700px)');let active=null,dialog=null,disposed=false;
 const dock=document.createElement('div');dock.className='ln-mobile-notes-dock';
 dock.innerHTML='<button type="button" class="ln-button" aria-label="Open my lesson notes">✎ My notes · メモ</button>';
 root.append(dock);
 const close=async()=>{
  if(!active)return;const entry=active;await entry.controller.flush();
  if(disposed||active!==entry)return;
  if(entry.controller.dirty()){dialog.querySelector('[data-sheet-status]').textContent='Your note is still here. Check the save message and retry. · メモは残っています。保存状態を確認してください。';return;}
  dialog.close();
 };
 const open=entry=>{
  if(!media.matches||active||disposed)return;active=entry;
  const block=note.content_json.blocks.find(b=>b.id===entry.id),context=block?pointTitle(block):note.title;
  const marker=document.createComment('notebook position');entry.host.before(marker);
  const source=document.activeElement;dialog=document.createElement('dialog');dialog.className='ln-modal ln-notes-sheet';
  dialog.innerHTML=`<header><div><span class="ln-micro">MY NOTEBOOK · 自分のメモ</span><h2>${block?'Keep this thought.':'Make it yours.'}</h2></div><button type="button" class="ln-button" data-done>Done · 完了</button></header><p class="ln-sheet-context">${e(context)}</p><div class="ln-sheet-shortcuts">${block?'<button type="button" class="ln-button" data-quote><span>＋ Phrase</span><small>この表現</small></button>':''}<button type="button" class="ln-button" data-example><span>＋ Example</span><small>自分の例文</small></button><button type="button" class="ln-button" data-question><span>＋ Question</span><small>質問メモ</small></button></div><div data-sheet-editor></div><p data-sheet-status role="status"></p>`;
  document.body.append(dialog);dialog.querySelector('[data-sheet-editor]').append(entry.host);
  const clearNotice=()=>{if(dialog)dialog.querySelector('[data-sheet-status]').textContent='';};
  entry.host.addEventListener('input',clearNotice);entry.host.querySelector('[data-retry-save]').addEventListener('click',clearNotice);
  const restoreTools=[];
  entry.host.querySelectorAll('[data-mark]').forEach(button=>{if(button.dataset.mark==='bold')return;restoreTools.push([button,button.innerHTML]);button.title=button.getAttribute('aria-label')||'Clear formatting · 装飾を外す';button.innerHTML=button.dataset.mark==='clear'?'×':'<span class="ln-color-swatch" aria-hidden="true"></span>';});
  const fitKeyboard=()=>{if(!dialog)return;const v=window.visualViewport;dialog.style.maxHeight=`${Math.max(180,(v?.height||window.innerHeight)-16)}px`;dialog.style.bottom=`${Math.max(0,window.innerHeight-(v?.height||window.innerHeight)-(v?.offsetTop||0))}px`;};
  window.visualViewport?.addEventListener('resize',fitKeyboard);window.visualViewport?.addEventListener('scroll',fitKeyboard);
  dialog.querySelector('[data-done]').onclick=()=>void close();
  dialog.querySelector('[data-quote]')?.addEventListener('click',()=>entry.controller.append(context));
  dialog.querySelector('[data-example]').onclick=()=>entry.controller.append('My example: ');
  dialog.querySelector('[data-question]').onclick=()=>entry.controller.append('My question: ');
  dialog.oncancel=event=>{event.preventDefault();void close();};
  dialog.onclose=()=>{window.visualViewport?.removeEventListener('resize',fitKeyboard);window.visualViewport?.removeEventListener('scroll',fitKeyboard);entry.host.removeEventListener('input',clearNotice);entry.host.querySelector('[data-retry-save]').removeEventListener('click',clearNotice);restoreTools.forEach(([button,html])=>button.innerHTML=html);marker.replaceWith(entry.host);dialog.remove();dialog=null;active=null;source?.focus({preventScroll:true});};
  dialog.showModal();fitKeyboard();dialog.querySelector('[data-done]').focus();
 };
 const listeners=[];
 for(const entry of notebooks){
  const summary=entry.host.closest('details')?.querySelector('summary');
  if(summary){const handler=event=>{if(media.matches){event.preventDefault();open(entry);}};summary.addEventListener('click',handler);listeners.push(()=>summary.removeEventListener('click',handler));}
 }
 const whole=notebooks.find(entry=>!entry.id);dock.querySelector('button').onclick=()=>whole&&open(whole);
 root.querySelectorAll('a[href="#lesson-my-notes"]').forEach(link=>{const handler=event=>{if(media.matches&&whole){event.preventDefault();event.stopImmediatePropagation();open(whole);}};link.addEventListener('click',handler,true);listeners.push(()=>link.removeEventListener('click',handler,true));});
 const onMedia=()=>{if(!media.matches&&dialog)dialog.close();};media.addEventListener('change',onMedia);
 return {dirty:()=>Boolean(active?.controller.dirty()),dispose(){disposed=true;media.removeEventListener('change',onMedia);listeners.forEach(fn=>fn());if(dialog)dialog.close();dock.remove();}};
}
