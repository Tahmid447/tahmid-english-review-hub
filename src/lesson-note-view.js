import {confirmNoteAction} from './note-dialog.js?v=20260915-practice';
import {isPractice,practiceSummary,questionId,sameQuestion} from './note-practice-model.js?v=20260915-practice';
import {practiceMarkup,mountPractice,progressMarkup} from './note-practice-view.js?v=20260915-practice';
import {richTextMarkup,cleanMarks,moveMarks,applyMark} from './note-rich-text.js?v=20260915-practice';
import { escapeHTML as e } from './store.js?v=20260911-mobile2';
import { speakText } from './audio.js?v=20260911-mobile2';
import { BLOCK_TYPES, PHRASE_TYPES, dateLabel, noteState, noteListActions, editableTextFields } from './lesson-note-model.js?v=20260915-practice';
import { noteError } from './lesson-note-api.js?v=20260915-practice';
export const noteButton=(label,attrs='')=>{const extra=attrs.match(/class="([^"]*)"/)?.[1]||'';return `<button type="button" class="ln-button ${extra}" ${attrs.replace(/class="[^"]*"/,'')}>${label}</button>`;};
export const noteStatus=()=>'<p class="ln-status" role="status" aria-live="polite"></p>';
const text=(value,cls='')=>value?`<p class="${cls}">${e(value)}</p>`:'';
const list=items=>items?.length?`<ul>${items.map(item=>`<li>${e(item)}</li>`).join('')}</ul>`:'';
export function blockMarkup(block,{mode='support',student=false,permissions={},controls=true,assets=[]}={}) {
 if(isPractice(block))return practiceMarkup(block,{mode,controls}).replace('</article>',`<div class="ln-actions">${student&&permissions.allow_student_suggestions?noteButton('Suggest an edit · 修正を提案','data-suggest-edit'):''}${student&&permissions.allow_direct_student_edit&&block.displayOptions?.studentEditable?noteButton('Edit this block · この部分を編集','data-direct-edit'):''}</div>${student&&permissions.allow_student_annotations?'<details class="ln-block-annotation"><summary>✎ My note · 自分のメモ</summary><div data-annotation-host></div></details>':''}</article>`);
 const [label,tone,icon]=BLOCK_TYPES[block.type] || BLOCK_TYPES.paragraph;
 if(block.type==='divider')return `<hr class="ln-divider" data-block-id="${e(block.id)}">`;
 if(block.type==='heading')return `<h3 class="ln-section-heading" id="block-${e(block.id)}">${e(block.englishText)}</h3>`;
 let body='';
 const primary=text(block.englishText,'ln-english');
 if(block.type==='natural_english_upgrade')body=`<div class="ln-correction"><div><span class="ln-micro">Original · 元の表現</span>${text(block.originalText,'ln-original')}</div><span class="ln-upgrade-arrow" aria-hidden="true">↗</span><div><span class="ln-micro">More natural · 自然な表現</span>${primary}</div></div>`;
 else if(block.type==='common_mistake')body=`<div class="ln-wrong"><span class="ln-micro">Watch out · 間違いやすい表現</span>${text(block.originalText,'ln-original')}</div><div class="ln-correct"><span class="ln-micro">Say it this way · こう言ってみよう</span>${list(block.correctOptions)}${primary}</div>`;
 else if(block.type==='comparison' || (block.type==='pronunciation' && block.comparisonText))body=`<div class="ln-comparison"><div>${primary}${text(block.ipa,'ln-ipa')}</div><div>${text(block.comparisonText,'ln-english')}${mode==='support'?text(block.comparisonJapanese,'ln-japanese'):''}</div></div>`;
 else if(block.type==='bullet_list')body=list(block.items?.length?block.items:(block.englishText||'').split('\n').filter(Boolean));
 else if(block.type==='image'){const asset=assets.find(a=>a.id===block.assetId&&a.state==='ready');body=asset?`<figure>${noteButton(`<img data-private-thumb="${e(asset.thumbnail_path)}" alt="${e(asset.alt_text)}" loading="lazy"><span>⤢ Open & zoom · 拡大する</span>`,`class="ln-image-open" data-inline-image="${e(asset.id)}"`)}<figcaption>${e(asset.caption)}</figcaption></figure>`:'<p class="ln-status">An image can be added to this block. · この画像ブロックにはまだ画像が追加されていません。</p>';}
 else body=primary+text(block.ipa,'ln-ipa');
 let japanese='';
 if(mode==='support' && block.japaneseSupport && block.japaneseSupportMode!=='none') {
  japanese=`<details class="ln-jp-support" data-reading-detail><summary>日本語サポート</summary><p lang="ja">${e(block.japaneseSupport)}</p></details>`;
 }
 const voice=controls&&block.pronunciation?.enabled&&block.englishText?noteButton('▶ US · Ava','data-note-voice="us"')+noteButton('▶ UK · Libby','data-note-voice="gb"'):'';
 const save=student&&PHRASE_TYPES.has(block.type)&&block.englishText?noteButton('♡ Save to My Phrases · 表現を保存','data-save-phrase aria-pressed="false"'):'';
 const annotate=student&&permissions.allow_student_annotations?'<details class="ln-block-annotation"><summary>✎ My note · 自分のメモ</summary><div data-annotation-host></div></details>':'';
 const change=student&&permissions.allow_student_suggestions?noteButton('Suggest an edit · 修正を提案','data-suggest-edit'):'';
 const direct=student&&permissions.allow_direct_student_edit&&block.displayOptions?.studentEditable?noteButton('Edit this block · この部分を編集','data-direct-edit'):'';
 return `<article class="ln-block ln-tone-${tone}" id="block-${e(block.id)}" data-block-id="${e(block.id)}"><div class="ln-block-label"><span class="ln-block-icon" aria-hidden="true">${icon}</span><span>${e(label)}</span></div>${block.title?`<h3>${e(block.title)}</h3>`:''}${body}${japanese}${text(block.explanation,'ln-explanation')}${block.examples?.length?`<details class="ln-examples" data-reading-detail><summary>In context · 例文</summary>${list(block.examples)}</details>`:''}${block.type==='quick_practice'?`<label class="ln-practice-label">Try it in your own words · 自分の言葉で<textarea rows="3" aria-label="Practice response · 練習の回答" placeholder="Your practice stays on this page."></textarea></label>${block.answer?`<details class="ln-answer"><summary>See a model answer · 回答例</summary>${text(block.answer)}</details>`:''}`:''}${block.tags?.length?`<div class="ln-tags">${block.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>`:''}<div class="ln-actions">${voice}${save}${change}${direct}</div>${voice||save?noteStatus():''}${annotate}</article>`;
}
export function readingBlockMarkup(block,options={}) {
 const markup=blockMarkup(block,options);
 if(isPractice(block)&&options.practiceSection&&!block.displayOptions?.collapsed)return markup;
 if(!isPractice(block)&&!['teacher_tip','example','comparison','nuance','collapsible_section'].includes(block.type)&&!block.displayOptions?.collapsed)return markup;
 const label=BLOCK_TYPES[block.type]?.[0]||'More · 補足',preview=block.title||block.englishText||block.originalText||'';
 return `<details class="ln-reading-block" data-reading-detail><summary><span>${e(label)}</span><strong>${e(preview.slice(0,180))}</strong></summary>${markup}</details>`;
}
export function contentMarkup(note,options={}) {
 const blocks=note.content_json.blocks,keyBlocks=blocks.filter(b=>b.type==='useful_phrase'&&b.displayOptions?.keyPhrase!==false);
 let main='',openSection=false,practiceSection=false,implicitPractice=false;
 for(const block of blocks) {
  if(keyBlocks.includes(block))continue;
  const practiceHeading=block.type==='heading'&&/^(?:quick\s*practice|practice(?:\s*section)?|練習(?:問題|セクション)?)(?:\s|$)/i.test(block.englishText.trim());
  if(implicitPractice&&!isPractice(block)){main+='</div></details>';implicitPractice=false;}
  if(['collapsible_section','quick_practice_group'].includes(block.type)||practiceHeading) {
   if(openSection)main+='</div></details>';
   practiceSection=block.type==='quick_practice_group'||practiceHeading;
   main+=`<details class="ln-section" id="block-${e(block.id)}" data-reading-detail data-section-id="${e(block.id)}" ${practiceSection?'data-practice-section':''} ${block.displayOptions?.collapsed||practiceSection?'':'open'}><summary><h2>${e(block.englishText||block.title||'Lesson section')}</h2></summary><div>${text(block.explanation,'ln-explanation')}`;openSection=true;
  } else {
   if(isPractice(block)&&!practiceSection&&!implicitPractice){main+='<details class="ln-section" data-reading-detail data-practice-section><summary><h2>Quick Practice · 練習</h2></summary><div>';implicitPractice=true;}
   main+=readingBlockMarkup(block,{...options,permissions:note,practiceSection:practiceSection||implicitPractice});
  }
 }
 if(implicitPractice)main+='</div></details>';
 if(openSection)main+='</div></details>';
 return `<section class="ln-focus"><span class="ln-micro">TODAY’S FOCUS · 今日のポイント</span><p>${e(note.focus||'A clear next step for your English.')}</p></section>${keyBlocks.length?`<section class="ln-key-phrases"><h2>Words to take with you.<small>今日から使いたい表現</small></h2>${keyBlocks.map(b=>blockMarkup(b,{...options,permissions:note})).join('')}</section>`:''}<section class="ln-teaching"><h2 class="ln-main-heading">Your lesson, in detail.<small>レッスンを振り返ろう</small></h2>${main || '<p>Teaching material will appear here.</p>'}</section>`;
}
export function cardMarkup(note,{teacher=false,name='',overview}={}) {
 const state=teacher?(note.deleted_at?'trash':note.status):noteState(note,note.seen?.[0]);
 const labels={new:'NEW · 新着',updated:'UPDATED · 更新あり',reviewed:'✓ REVIEWED · 復習済み',opened:'IN YOUR NOTEBOOK',draft:'DRAFT · 下書き',published:'PUBLISHED · 公開中',archived:'ARCHIVED · 保管中',trash:'TRASH · ゴミ箱'};
 const assets=(note.assets||[]).filter(a=>a.state==='ready'&&a.uploader_role==='teacher');
 const cover=assets.find(a=>a.id===note.cover_asset_id);
 const progress=teacher&&overview?`<div class="ln-card-progress">${overview.practice_total?`<span>${e(overview.practice_completed)} / ${e(overview.practice_total)} completed · 練習完了</span>`:''}${overview.practice_review?`<strong>${e(overview.practice_review)} to review · 要復習</strong>`:''}${overview.unread_activity?'<strong>New activity · 生徒の更新あり</strong>':''}${overview.pending_suggestions?`<strong>${e(overview.pending_suggestions)} suggestions · 提案</strong>`:''}</div>`:'';
 const menu=teacher?`<details class="ln-card-menu" data-note-menu><summary aria-label="Actions for ${e(note.title)} · ノートの操作" title="Note actions · ノートの操作">⋯</summary><div>${noteButton('Open / Edit · 開く・編集',`data-open-note="${e(note.id)}"`)}${noteListActions(note).map(([action,label])=>noteButton(label,`data-note-action="${action}" data-note-id="${e(note.id)}"`)).join('')}</div></details>`:'';
 return `<article class="ln-note-card">${cover?`<div class="ln-card-image"><img data-private-thumb="${e(cover.thumbnail_path)}" alt="" loading="lazy" width="400" height="180"></div>`:''}<div class="ln-card-body"><div class="ln-card-top"><time datetime="${e(note.lesson_date)}">${e(dateLabel(note.lesson_date))}</time><span class="ln-state ln-state-${e(state)}">${labels[state]||e(state)}</span>${menu}</div>${name?`<p class="ln-micro">${e(name)}</p>`:''}<h2>${e(note.title)}</h2>${text(note.summary,'ln-summary')}<div class="ln-tags">${note.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>${progress}<div class="ln-card-bottom"><span>${assets.length} visual${assets.length===1?'':'s'} · 画像</span>${teacher?noteButton('Open editor · 編集する →',`data-open-note="${e(note.id)}"`):`<a class="ln-button" href="/my-page/notes/${e(note.id)}">Open Lesson Note · ノートを開く →</a>`}</div></div></article>`;
}
export function lazyPrivateImages(root,api) {
 let disposed=false;
 const load=async img=>{
  const path=img.dataset.privateThumb;delete img.dataset.privateThumb;
  try{const url=await api.signed(path);if(!disposed&&img.isConnected)img.src=url;}catch{if(img.isConnected){img.alt='Image unavailable. Reopen this page to retry. · 画像を再読み込みしてください。';img.classList.add('ln-image-error');}}
 };
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.filter(entry=>entry.isIntersecting).forEach(entry=>{observer.unobserve(entry.target);void load(entry.target);} ),{rootMargin:'160px'}):null;
 root.querySelectorAll('[data-private-thumb]').forEach(img=>observer?observer.observe(img):void load(img));
 return ()=>{disposed=true;observer?.disconnect();};
}

export function mountAnnotation(root,{value,save,label='My notes · 自分のメモ',onDirty=()=>{}}) {
 let version=value?.version||0,lastSaved=value?.body||'',format=cleanMarks(lastSaved,value?.body_format),lastFormat=JSON.stringify(format),previous=lastSaved,timer,pending=false,disposed=false,blocked=false;
 root.innerHTML=`<label>${e(label)}<textarea rows="5" maxlength="6000" placeholder="What would you like to remember? · 覚えておきたいことは？">${e(lastSaved)}</textarea></label><div class="ln-format-tools" role="toolbar" aria-label="Note formatting · メモの装飾">${noteButton('<b>B</b>','data-mark="bold" aria-label="Bold selected text · 選択した文字を太字に"')}${['yellow','green','blue','pink'].map((color,i)=>noteButton(['黄','緑','青','桃'][i],`data-mark="${color}" class="ln-mark-${color}" aria-label="Highlight ${color}"`)).join('')}${noteButton('Clear · 装飾を外す','data-mark="clear"')}</div><p class="ln-status">Select words above, then choose bold or a highlight. · 文字を選び、太字や色を選んでください。</p><div class="ln-rich-preview" aria-label="Formatted note preview · メモの表示"></div>${noteStatus()}${noteButton('Save now · 今すぐ保存','data-retry-save')}`;
 const input=root.querySelector('textarea'),status=root.querySelector('[role=status]'),preview=root.querySelector('.ln-rich-preview');
 const updatePreview=()=>{preview.innerHTML=richTextMarkup(input.value,format);preview.hidden=!input.value;};
 const dirty=()=>input.value!==lastSaved||JSON.stringify(format)!==lastFormat;
 const flush=async()=>{
  clearTimeout(timer);if(pending||disposed||!dirty()||blocked)return;
  const body=input.value,marks=cleanMarks(body,format);pending=true;status.textContent='Saving… · 保存中…';onDirty(true);
  try {const saved=await save(body,version,marks);version=saved.version;lastSaved=body;lastFormat=JSON.stringify(marks);status.textContent='Saved just now · 保存しました';}
  catch(error){blocked=true;status.textContent=noteError(error);}
  finally{pending=false;onDirty(dirty());if(dirty()&&!blocked&&!disposed)timer=setTimeout(flush,400);}
 };
 const changed=()=>{clearTimeout(timer);blocked=false;status.textContent='Unsaved changes · 未保存の変更';onDirty(true);updatePreview();timer=setTimeout(flush,1000);};
 input.oninput=()=>{format=moveMarks(previous,input.value,format);previous=input.value;changed();};
 input.onblur=()=>void flush();
 root.querySelectorAll('[data-mark]').forEach(btn=>{btn.onpointerdown=event=>event.preventDefault();btn.onclick=()=>{const start=input.selectionStart,end=input.selectionEnd;if(start===end){status.textContent='Select the words to format first. · 先に文字を選択してください。';return;}format=applyMark(format,start,end,btn.dataset.mark==='clear'?null:btn.dataset.mark==='bold'?{bold:true}:{color:btn.dataset.mark});changed();input.focus();input.setSelectionRange(start,end);};});
 root.querySelector('[data-retry-save]').onclick=()=>{blocked=false;void flush();};updatePreview();
 return {dirty:()=>dirty()||pending,flush,dispose(){disposed=true;clearTimeout(timer);}};
}

export function openImageViewer(assets,index,api) {
 const dialog=document.createElement('dialog');dialog.className='ln-lightbox';
 dialog.innerHTML=`<div class="ln-lightbox-bar"><strong>Visual review · 画像で復習</strong><div class="ln-actions">${noteButton('−','data-zoom-out aria-label="Zoom out · 縮小"')}<output data-zoom>100%</output>${noteButton('+','data-zoom-in aria-label="Zoom in · 拡大"')}${noteButton('Fit · 全体表示','data-fit')}${noteButton('Close × · 閉じる','data-close')}</div></div><div class="ln-image-pan" tabindex="0" aria-label="Image; drag or scroll to pan when zoomed"><img alt="" draggable="false"></div><div class="ln-lightbox-bottom">${noteButton('← Previous · 前へ','data-prev')}<p data-caption></p>${noteButton('Next · 次へ →','data-next')}</div>${noteStatus()}`;
 document.body.append(dialog);const pan=dialog.querySelector('.ln-image-pan'),img=pan.querySelector('img'),status=dialog.querySelector('[role=status]');
 let zoom=1,generation=0,baseWidth=0,baseHeight=0,drag=null;
 const resize=()=>{img.style.width=`${baseWidth*zoom}px`;img.style.height=`${baseHeight*zoom}px`;dialog.querySelector('[data-zoom]').textContent=`${Math.round(zoom*100)}%`;pan.classList.toggle('is-zoomed',zoom>1);};
 const fit=()=>{zoom=1;const scale=Math.min(1,(pan.clientWidth-16)/img.naturalWidth,(pan.clientHeight-16)/img.naturalHeight);baseWidth=img.naturalWidth*scale;baseHeight=img.naturalHeight*scale;resize();pan.scrollTop=pan.scrollLeft=0;};
 const show=async()=>{
  const asset=assets[index],token=++generation;status.textContent='Loading private image… · 非公開画像を読み込み中…';img.removeAttribute('src');img.alt=asset.alt_text;
  dialog.querySelector('[data-caption]').textContent=`${index+1} / ${assets.length} · ${asset.title||''}${asset.caption?' — '+asset.caption:''}`;
  dialog.querySelector('[data-prev]').disabled=index===0;dialog.querySelector('[data-next]').disabled=index===assets.length-1;
  try{const url=await api.signed(asset.storage_path);if(token!==generation||!dialog.open)return;img.onload=()=>{fit();status.textContent='Use + to zoom, then drag or scroll. · ＋で拡大し、ドラッグして移動できます。';};img.onerror=()=>{status.textContent='Image could not load. Close and open it again to renew access. · 閉じてもう一度開いてください。';};img.src=url;}
  catch(error){status.textContent=noteError(error);}
 };
 const change=delta=>{const next=index+delta;if(next>=0&&next<assets.length){index=next;void show();}};
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.onclose=()=>{generation++;dialog.remove();};
 dialog.querySelector('[data-prev]').onclick=()=>change(-1);dialog.querySelector('[data-next]').onclick=()=>change(1);
 dialog.querySelector('[data-fit]').onclick=fit;dialog.querySelector('[data-zoom-in]').onclick=()=>{zoom=Math.min(5,zoom+.5);resize();};dialog.querySelector('[data-zoom-out]').onclick=()=>{zoom=Math.max(1,zoom-.5);resize();};
 dialog.onkeydown=event=>{if(event.key==='ArrowRight'&&zoom===1)change(1);if(event.key==='ArrowLeft'&&zoom===1)change(-1);};
 pan.onpointerdown=event=>{drag={x:event.clientX,y:event.clientY,left:pan.scrollLeft,top:pan.scrollTop};if(zoom>1)pan.setPointerCapture(event.pointerId);};
 pan.onpointermove=event=>{if(drag&&zoom>1){pan.scrollLeft=drag.left+drag.x-event.clientX;pan.scrollTop=drag.top+drag.y-event.clientY;}};
 pan.onpointerup=event=>{if(drag&&zoom===1&&Math.abs(event.clientX-drag.x)>70&&Math.abs(event.clientY-drag.y)<60)change(event.clientX<drag.x?1:-1);drag=null;};pan.onpointercancel=()=>{drag=null;};
 dialog.showModal();void show();return dialog;
}

export function changeSnapshot(block) {
 return '<dl class="ln-change-snapshot">'+editableTextFields(block).filter(([key])=>Array.isArray(block[key])?block[key].length:block[key]).map(([key,label])=>`<dt>${e(label)}</dt><dd>${e(Array.isArray(block[key])?block[key].join('\n'):block[key])}</dd>`).join('')+'</dl>';
}

function editDialog(block,{direct=false,onSave}) {
 const dialog=document.createElement('dialog');dialog.className='ln-modal';
 dialog.innerHTML=`<form><h2>${direct?'Edit permitted content · 許可された部分を編集':'Suggest an edit · 修正を提案'}</h2><p>${direct?'A revision of the teacher’s content will be saved first. · 変更前の版を保存してから更新します。':'Your teacher reviews this before the lesson changes. · 先生が確認するまで教材本文は変わりません。'}</p><div class="ln-before"><span class="ln-micro">BEFORE · 現在の内容</span>${changeSnapshot(block)}</div>${editableTextFields(block).map(([key,label])=>`<label>${e(label)}<textarea name="${key}" maxlength="6000" rows="${key==='englishText'?3:2}">${e(Array.isArray(block[key])?block[key].join('\n'):block[key]||'')}</textarea></label>`).join('')}<div class="ln-actions"><button class="ln-button ln-primary" type="submit">${direct?'Save changes · 変更を保存':'Send suggestion · 提案を送る'}</button>${noteButton('Cancel · キャンセル','data-cancel')}</div>${noteStatus()}</form>`;
 document.body.append(dialog);dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
 dialog.querySelector('form').onsubmit=async event=>{event.preventDefault();const button=dialog.querySelector('[type=submit]');button.disabled=true;try{const form=event.currentTarget;const changes=Object.fromEntries(editableTextFields(block).map(([key])=>[key,['examples','items','correctOptions'].includes(key)?form.elements[key].value.split('\n').map(s=>s.trim()).filter(Boolean):form.elements[key].value]));changes.japaneseSupportMode=changes.japaneseSupport?(block.japaneseSupportMode==='none'?'short':block.japaneseSupportMode||'short'):'none';await onSave(changes);dialog.close();}catch(error){dialog.querySelector('[role=status]').textContent=noteError(error);button.disabled=false;}};
 dialog.showModal();return dialog;
}

export function focusNoteTarget(root,hash=location.hash) {
 let id;try{id=decodeURIComponent(hash.replace(/^#/,''));}catch{return;}
 const target=[...root.querySelectorAll('[id]')].find(el=>el.id===id);if(!target)return;
 if(target.tagName==='DETAILS')target.open=true;
 for(let parent=target.parentElement;parent&&parent!==root;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
 target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'start'});
}
export function mountNoteView(root,{detail,api,student=true,userId='',mode='support',onRefresh=()=>{},teacherName='Your English teacher'}) {
 const n=detail.note,controllers=[],dialogs=[];let disposed=false;
 root.classList.add('ln-notebook');
 root.innerHTML=`<header class="ln-lesson-header"><p class="ln-kicker">PERSONAL LESSON NOTES · あなたのレッスンノート</p><time datetime="${e(n.lesson_date)}">${e(dateLabel(n.lesson_date))}</time><h1>${e(n.title||'Your lesson notebook')}</h1>${text(n.summary,'ln-lede')}<div class="ln-header-meta">${student?`<a class="ln-my-notes-jump" href="#lesson-my-notes">✎ My notes · 自分のメモ</a>`:""}<span>Prepared by ${e(teacherName)}</span><div class="ln-tags">${n.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div></div></header><div class="ln-reader-layout"><div class="ln-reader-main">${contentMarkup(n,{mode,student,assets:detail.assets})}<section class="ln-practice-summary" data-practice-summary></section><section class="ln-gallery-section"><h2>A different way to remember.<small>画像でレッスンを振り返ろう</small></h2><p class="ln-micro">TEACHER MATERIAL · 先生の教材</p><div class="ln-gallery" data-teacher-gallery></div></section><section class="ln-student-attachments" data-student-attachments><h2>From your notebook.<small>生徒の添付画像</small></h2><div class="ln-gallery" data-student-gallery></div>${student&&n.allow_student_images?`<form class="ln-upload-form"><label>Add an image · 画像を追加<input type="file" accept="image/png,image/jpeg,image/webp" required></label><label>Caption · メモ<input name="caption" maxlength="2000"></label><label>Image description · 画像の説明<input name="alt_text" maxlength="500" required></label><button type="submit" class="ln-button">Upload privately · 非公開で追加</button>${noteStatus()}</form>`:''}</section><section class="ln-comments" data-comments></section>${student?`<section class="ln-review-finish"><span aria-hidden="true">✧</span><h2>A little review. A lasting difference.</h2><p>Make these expressions part of your English.<br>今日の表現を、あなたの英語に。</p>${noteButton(detail.review_status?.[0]?.reviewed_version>=n.version?'✓ Reviewed — undo · 復習済みを取り消す':'Mark as reviewed · 復習済みにする','data-mark-reviewed class="ln-primary"')}${noteStatus()}</section>`:''}</div><aside class="ln-my-notes" id="lesson-my-notes"><div class="ln-note-pad"><p class="ln-kicker">MAKE IT YOURS · 自分の言葉で</p><h2>My notes.</h2><p>Personal reminders, separate from your teacher’s lesson.<br>先生の教材とは別に、自分のメモを残せます。</p><div data-lesson-annotation></div></div><a href="/my-page#favorites" class="ln-saved-link">♡ My Phrases · 保存した表現 →</a></aside></div>`;
 const focus=root.querySelector('.ln-focus');focus.id='lesson-focus';
 const firstPractice=n.content_json.blocks.find(isPractice),jumps=document.createElement('nav');jumps.className='ln-reader-jumps';jumps.setAttribute('aria-label','Lesson sections · レッスン内の移動');
 const phrases=root.querySelector('.ln-key-phrases'),grammar=n.content_json.blocks.find(b=>b.type==='grammar_point'),correction=n.content_json.blocks.find(b=>['natural_english_upgrade','common_mistake'].includes(b.type)),hasImages=detail.assets.some(a=>a.state==='ready'&&a.uploader_role==='teacher');
 if(phrases)phrases.id='lesson-phrases';root.querySelector('.ln-gallery-section').id='lesson-images';root.querySelector('.ln-gallery-section').hidden=!hasImages;
 root.querySelector('.ln-lesson-header').id='lesson-top';
 jumps.innerHTML=`<a href="#lesson-focus">Focus · 今日のポイント</a>${phrases?'<a href="#lesson-phrases">Phrases · 表現</a>':''}${correction?`<a href="#block-${e(correction.id)}">Corrections · 修正</a>`:''}${grammar?`<a href="#block-${e(grammar.id)}">Grammar · 文法</a>`:''}${firstPractice?`<a href="#block-${e(firstPractice.id)}">Practice · 練習</a>`:''}${hasImages?'<a href="#lesson-images">Images · 画像</a>':''}${student?'<a href="#lesson-my-notes">My notes · 自分のメモ</a>':''}<div class="ln-reading-controls">${noteButton('Open all · すべて開く','data-reading-open')}${noteButton('Close all · 閉じる','data-reading-close')}</div>`;
 root.querySelector('.ln-lesson-header').after(jumps);
 if(!student)root.querySelector('.ln-my-notes').hidden=true;
 const attempts=[...(detail.practice_attempts||[])],summary=root.querySelector('[data-practice-summary]');root.querySelector('.ln-focus').after(summary);
 const reviewBlock=()=>n.content_json.blocks.find(b=>isPractice(b)&&attempts.some(a=>a.question_id===questionId(b)&&sameQuestion(a.question_snapshot,b)&&(a.is_correct===false||a.self_check_status==='review')));
 const updateProgress=()=>{summary.innerHTML=progressMarkup(practiceSummary(n.content_json.blocks,attempts));summary.hidden=!n.content_json.blocks.some(isPractice);const review=reviewBlock();if(review)summary.insertAdjacentHTML('beforeend',`<a class="ln-button" data-practice-review href="#block-${e(review.id)}">Review weak points · 復習が必要な問題へ →</a>`);summary.querySelector('[data-practice-review]')?.addEventListener('click',event=>{event.preventDefault();focusNoteTarget(root,event.currentTarget.hash);});};updateProgress();
 root.querySelectorAll('[data-practice-block]').forEach(el=>{const block=n.content_json.blocks.find(b=>b.id===el.dataset.practiceBlock);controllers.push(mountPractice(el,{block,attempt:attempts.find(a=>a.question_id===questionId(block)),api,noteId:n.id,preview:!student,onChange:a=>{const index=attempts.findIndex(v=>v.question_id===a.question_id);if(index<0)attempts.push(a);else attempts[index]=a;updateProgress();}}));});
 const galleryAssets=detail.assets.filter(a=>a.state==='ready').sort((a,b)=>a.display_order-b.display_order);
 for(const role of ['teacher','student']) {
  const gallery=root.querySelector(`[data-${role}-gallery]`),assets=galleryAssets.filter(a=>a.uploader_role===role);
  gallery.innerHTML=assets.map(a=>`<figure><button type="button" class="ln-image-open" data-image-id="${e(a.id)}" aria-label="Open ${e(a.title||a.alt_text)}"><img data-private-thumb="${e(a.thumbnail_path)}" alt="${e(a.alt_text)}" loading="lazy" width="480" height="320"><span>⤢ Open & zoom · 拡大する</span></button><figcaption><strong>${e(a.title||'')}</strong>${text(a.caption)}${role==='student'?`<small>Student attachment · ${e(new Date(a.created_at).toLocaleString())}</small>${student&&n.allow_student_images&&a.uploader_id===userId?noteButton('Edit caption · 説明を編集',`data-caption-image="${e(a.id)}"`)+noteButton('Remove my image · 自分の画像を外す',`data-remove-image="${e(a.id)}"`):''}`:''}</figcaption></figure>`).join('') || `<p class="ln-empty-small">${role==='teacher'?'Visual material can be added by your teacher. · 先生からの画像教材がここに届きます。':'No student attachments yet. · まだ添付画像はありません。'}</p>`;
 }
 if(!galleryAssets.some(a=>a.uploader_role==='student')&&!(student&&n.allow_student_images))root.querySelector('[data-student-attachments]').hidden=true;
 const disposeImages=lazyPrivateImages(root,api);
 root.querySelectorAll('[data-image-id],[data-inline-image]').forEach(button=>button.onclick=()=>{
  const id=button.dataset.imageId||button.dataset.inlineImage,index=galleryAssets.findIndex(a=>a.id===id);
  if(index>=0)dialogs.push(openImageViewer(galleryAssets,index,api));else{button.textContent='Image is not available yet · 画像は準備中です';}
 });
 root.querySelectorAll('[data-note-voice]').forEach(button=>button.onclick=async()=>{
  const block=n.content_json.blocks.find(b=>b.id===button.closest('[data-block-id]').dataset.blockId);const status=button.closest('article').querySelector('[data-voice-status]')||button.closest('article').querySelector('[role=status]');
  try{await speakText(block.englishText,{voice:button.dataset.noteVoice,language:'en',onStatus:event=>{if(!disposed)status.textContent=`${event.messageEn} · ${event.messageJa}`;}});}catch{status.textContent='Voice is unavailable. Please try again. · 音声を再試行してください。';}
 });
 root.querySelectorAll('[data-save-phrase]').forEach(button=>{const blockId=button.closest('[data-block-id]').dataset.blockId;if(detail.saved_phrases?.some(p=>p.source_block_id===blockId)){button.textContent='♥ Saved to My Phrases · 保存済み';button.setAttribute('aria-pressed','true');button.disabled=true;}});
 root.querySelectorAll('[data-save-phrase]').forEach(button=>button.onclick=async()=>{
  button.disabled=true;const article=button.closest('article');try{await api.savePhrase(n.id,article.dataset.blockId);button.textContent='♥ Saved to My Phrases · 保存済み';button.setAttribute('aria-pressed','true');article.querySelector('[role=status]').textContent='Find it in My Page → Favorites → Words or Phrases. · マイページのお気に入りから復習できます。';}catch(error){article.querySelector('[role=status]').textContent=noteError(error);}finally{button.disabled=button.getAttribute('aria-pressed')==='true';}
 });
 if(student&&n.allow_student_annotations) {
  const add=(host,id)=>controllers.push(mountAnnotation(host,{value:detail.annotations.find(a=>a.block_id===id),save:(body,version,format)=>api.annotateRich(n.id,id,body,format,version)}));
  add(root.querySelector('[data-lesson-annotation]'),'');root.querySelectorAll('[data-annotation-host]').forEach(host=>add(host,host.closest('[data-block-id]').dataset.blockId));
 }else if(student)root.querySelector('[data-lesson-annotation]').textContent='Your teacher has turned off annotations for this lesson. · このレッスンのメモは無効になっています。';
 root.querySelectorAll('[data-suggest-edit],[data-direct-edit]').forEach(button=>button.onclick=()=>{
  const block=n.content_json.blocks.find(b=>b.id===button.closest('[data-block-id]').dataset.blockId),direct=button.hasAttribute('data-direct-edit');
  dialogs.push(editDialog(block,{direct,onSave:async changes=>{
   if(direct){if(controllers.some(c=>c.dirty())||commentDraft())throw new Error('Save your personal notes first. · 自分のメモを先に保存してください。');await api.directEdit(n.id,n.version,{[block.id]:changes});onRefresh();}
   else{await api.suggest(n.id,block.id,changes);button.textContent='✓ Suggestion sent · 提案を送りました';}
  }}));
 });
 root.querySelectorAll('[data-section-id]').forEach(section=>{
  if(section.hasAttribute('data-practice-section'))return;
  const key=`te-note-sections:${userId}:${n.id}:${section.dataset.sectionId}`;
  try{const value=localStorage.getItem(key);if(value!==null)section.open=value==='open';}catch{}
  section.ontoggle=()=>{try{localStorage.setItem(key,section.open?'open':'closed');}catch{}};
 });
 const commentDraft=()=>Boolean(root.querySelector('[data-comments] textarea')?.value.trim());
 const uploadDraft=()=>Boolean(root.querySelector('.ln-upload-form input[type=file]')?.files.length||[...root.querySelectorAll('.ln-upload-form textarea,.ln-upload-form input[name]')].some(v=>v.value.trim()));
 const upload=root.querySelector('.ln-upload-form');if(upload)upload.onsubmit=async event=>{
  event.preventDefault();const button=upload.querySelector('[type=submit]'),status=upload.querySelector('[role=status]');button.disabled=true;
  try{if(controllers.some(c=>c.dirty())||commentDraft())throw new Error('Save your personal notes first. · メモを先に保存してください。');await api.upload(n.id,upload.querySelector('[type=file]').files[0],{caption:upload.elements.caption.value,alt_text:upload.elements.alt_text.value},{onStatus:message=>status.textContent=message});upload.reset();onRefresh();}catch(error){status.textContent=noteError(error);button.disabled=false;}
 };
 root.querySelectorAll('[data-caption-image]').forEach(button=>button.onclick=()=>{
  const asset=galleryAssets.find(a=>a.id===button.dataset.captionImage),dialog=document.createElement('dialog');dialog.className='ln-modal';
  dialog.innerHTML=`<form><h2>Edit image caption · 画像の説明を編集</h2><label>Caption · 説明<textarea rows="4" name="caption" maxlength="2000">${e(asset.caption)}</textarea></label><div class="ln-actions"><button type="submit" class="ln-button">Save caption · 説明を保存</button>${noteButton('Cancel · キャンセル','data-cancel')}</div>${noteStatus()}</form>`;
  document.body.append(dialog);dialogs.push(dialog);dialog.onclose=()=>dialog.remove();dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();
  dialog.querySelector('form').onsubmit=async event=>{event.preventDefault();const submit=event.currentTarget.querySelector('[type=submit]');submit.disabled=true;try{if(controllers.some(c=>c.dirty())||commentDraft())throw new Error('Save your personal notes first. · メモを先に保存してください。');await api.assetChange(asset.id,{caption:event.currentTarget.elements.caption.value},n.version);dialog.close();onRefresh();}catch(error){dialog.querySelector('[role=status]').textContent=noteError(error);submit.disabled=false;}};dialog.showModal();
 });
 root.querySelectorAll('[data-remove-image]').forEach(button=>button.onclick=async()=>{
  if(!await confirmNoteAction('Remove your attachment from this lesson? · この添付画像を外しますか？'))return;
  button.disabled=true;try{if(controllers.some(c=>c.dirty())||commentDraft())throw new Error('Save your notes first.');await api.assetChange(button.dataset.removeImage,{archive:true},n.version);onRefresh();}catch(error){button.disabled=false;button.parentElement.append(document.createTextNode(noteError(error)));}
 });
 const comments=root.querySelector('[data-comments]');
 if(student&&(n.allow_student_comments||detail.comments.length)) {
  comments.innerHTML=`<h2>Lesson conversation.<small>レッスンについてのコメント</small></h2><div>${detail.comments.map(c=>`<article class="ln-comment"><small>${c.actor_id===userId?'You · あなた':'Teacher · 先生'} · ${e(new Date(c.created_at).toLocaleString())}</small>${text(c.body)}</article>`).join('')}</div><form><label>Add a comment · コメント<textarea maxlength="4000" required rows="3"></textarea></label><button type="submit" class="ln-button">Post comment · コメントを送る</button>${noteStatus()}</form>`;
  if(!n.allow_student_comments)comments.querySelector('form').hidden=true;
  comments.querySelector('form').onsubmit=async event=>{event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;try{if(controllers.some(c=>c.dirty())||uploadDraft())throw new Error('Save your other work first. · 回答・メモ・画像を先に保存してください。');await api.comment(n.id,event.currentTarget.querySelector('textarea').value);comments.querySelector('textarea').value='';onRefresh();}catch(error){comments.querySelector('[role=status]').textContent=noteError(error);button.disabled=false;}};
 }
 let reviewed=detail.review_status?.[0]?.reviewed_version>=n.version;const mark=root.querySelector('[data-mark-reviewed]');if(mark)mark.onclick=async()=>{mark.disabled=true;try{await api.setReviewed(n.id,!reviewed,n.version);reviewed=!reviewed;mark.textContent=reviewed?'✓ Reviewed — undo · 復習済みを取り消す':'Mark as reviewed · 復習済みにする';mark.setAttribute('aria-pressed',String(reviewed));}catch(error){mark.parentElement.querySelector('[role=status]').textContent=noteError(error);}finally{mark.disabled=false;}};
 const followHash=()=>focusNoteTarget(root,location.hash==='#lesson-review'?`#block-${reviewBlock()?.id||firstPractice?.id}`:location.hash);window.addEventListener('hashchange',followHash);
 jumps.querySelectorAll('a').forEach(link=>link.onclick=event=>{event.preventDefault();history.replaceState(null,'',link.hash);followHash();});
 jumps.querySelector('[data-reading-open]').onclick=()=>root.querySelectorAll('[data-reading-detail]').forEach(el=>el.open=true);
 jumps.querySelector('[data-reading-close]').onclick=()=>root.querySelectorAll('[data-reading-detail]').forEach(el=>el.open=false);
 const top=document.createElement('button');top.type='button';top.className='ln-back-top';top.title='Back to top · 先頭へ';top.setAttribute('aria-label',top.title);top.textContent='↑';top.hidden=true;root.append(top);
 const scrollState=()=>{const bounds=root.getBoundingClientRect();top.hidden=!(bounds.top < -600&&bounds.bottom>0);};
 top.onclick=()=>focusNoteTarget(root,'#lesson-top');window.addEventListener('scroll',scrollState,{passive:true});scrollState();
 if(student)followHash();
 return {dirty:()=>controllers.some(c=>c.dirty())||commentDraft()||uploadDraft(),dispose(){disposed=true;window.removeEventListener('hashchange',followHash);window.removeEventListener('scroll',scrollState);controllers.forEach(c=>c.dispose());disposeImages();dialogs.forEach(d=>{if(d.open)d.close();else d.remove();});}};
}
