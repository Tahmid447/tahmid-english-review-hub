import {watchNoteUpdates,eventLabels} from './note-updates.js?v=20260915-practice';
import {PRACTICE_TYPES,isPractice} from './note-practice-model.js?v=20260915-practice';
import {teacherPracticeMarkup} from './note-practice-view.js?v=20260915-practice';
import {richTextMarkup} from './note-rich-text.js?v=20260915-practice';
import {confirmNoteAction} from './note-dialog.js?v=20260915-practice';
import { escapeHTML as e } from './store.js?v=20260911-mobile2';
import { createNoteApi, noteError } from './lesson-note-api.js?v=20260915-practice';
import { BLOCK_TYPES, PERMISSIONS, METADATA_FIELDS, applyLessonImport, newBlock, newNote, moveItem, clone, importLessonText, dateLabel } from './lesson-note-model.js?v=20260915-practice';
import { mountNoteView, contentMarkup, cardMarkup, changeSnapshot, lazyPrivateImages, noteButton as button, noteStatus as statusMarkup, openImageViewer } from './lesson-note-view.js?v=20260915-practice';

const inputField=(key,label,value='',{rows=0,type='text',max=6000,scope='note'}={})=>`<label>${e(label)}${rows?`<textarea data-${scope}-field="${key}" rows="${rows}" maxlength="${max}">${e(value)}</textarea>`:`<input data-${scope}-field="${key}" type="${type}" value="${e(value)}" maxlength="${max}">`}</label>`;
const asLines=value=>Array.isArray(value)?value.join('\n'):value||'';
const lines=value=>value.split('\n').map(v=>v.trim()).filter(Boolean);
const selectField=(key,label,value,options,scope='block')=>`<label>${e(label)}<select data-${scope}-field="${key}">${options.map(([v,name])=>`<option value="${v}" ${v===value?'selected':''}>${e(name)}</option>`).join('')}</select></label>`;
const checkbox=(key,label,value,scope='block')=>`<label class="ln-check"><input type="checkbox" data-${scope}-field="${key}" ${value?'checked':''}><span>${e(label)}</span></label>`;
const time=value=>new Date(value).toLocaleString();
function readBlockField(block,control) {
 const key=control.dataset.blockField,value=control.type==='checkbox'?control.checked:control.value;
 if(key==='audio')block.pronunciation={...block.pronunciation,enabled:value};
 else if(['studentEditable','keyPhrase','collapsed'].includes(key))block.displayOptions={...block.displayOptions,[key]:value};
 else block[key]=['examples','correctOptions','items','tags','choices','acceptedAnswers'].includes(key)?lines(value):value;
}

function editorBlock(b,index,assets) {
 const [label,tone]=BLOCK_TYPES[b.type];
 const field=(key,name,rows=2)=>inputField(key,name,asLines(b[key]),{rows,scope:'block'});
 const noText=['divider','image'].includes(b.type);
 let fields=noText?'':field('englishText',b.type==='natural_english_upgrade'?'Natural English · 自然な表現':b.type==='collapsible_section'?'Section heading · セクション見出し':'English · 英語',b.type==='heading'||b.type==='collapsible_section'?1:3);
 if(['natural_english_upgrade','common_mistake'].includes(b.type))fields=field('originalText','Original / incorrect · 元の表現・間違い')+fields;
 if(b.type==='common_mistake')fields+=field('correctOptions','Correct options — one per line · 正しい表現（1行ずつ）',3);
 if(b.type==='comparison'||b.type==='pronunciation')fields+=field('comparisonText','Compare with · 比較する英語')+field('comparisonJapanese','Comparison support · 比較する語の日本語');
 if(b.type==='pronunciation')fields+=field('ipa','IPA / pronunciation support · 発音記号・補足',1);
 if(b.type==='bullet_list')fields+=field('items','List items — one per line · 箇条書き（1行ずつ）',4);
 if(b.type==='quick_practice')fields+=field('answer','Model answer — optional · 回答例（任意）',3);
 if(b.type==='image')fields+=selectField('assetId','Choose an uploaded image · アップロード済みの画像',b.assetId||'', [['','Select an image · 画像を選ぶ'],...assets.filter(a=>a.state==='ready'&&a.uploader_role==='teacher').map(a=>[a.id,a.title||a.alt_text])]);
 if(b.type==='image')fields+=`<div data-block-image-preview></div><label>Add an image here · このブロックに画像を追加<input type="file" accept="image/png,image/jpeg,image/webp" data-block-image-file></label><label>Image description · 画像の説明<input data-block-image-alt maxlength="500" placeholder="Describe this image · どんな画像ですか？"></label>${button('Save note & upload here · ノートを保存して画像を追加','data-block-image-upload')}<p class="ln-status">You can also select an existing image above. · アップロード済みの画像も選べます。</p>`;
 if(isPractice(b))fields+=field('hint','Optional hint · ヒント（任意）')+field('answerKey','Model / answer key · 回答例・正解（選択式は A / B …）',3)+field('acceptedAnswers','Accepted answers — one per line · 正解として認める回答（1行ずつ）',3)+selectField('difficulty','Difficulty · 難しさ',b.difficulty||'',[['','Not specified · 指定なし'],['easy','Easy · 基礎'],['medium','Medium · 標準'],['challenging','Challenging · 応用']]);
 if(b.type==='multiple_choice')fields+=field('choices','Choices — one per line, A then B · 選択肢（1行ずつ）',4);
 if(b.type==='sentence_reorder')fields+=field('items','Word / phrase tiles — one per line · 並び替える語句（1行ずつ）',4);
 if(!['heading','divider','collapsible_section','quick_practice_group','image'].includes(b.type))fields+=field('title','Optional short heading · 小見出し（任意）',1)+`<div class="ln-field-pair">${selectField('japaneseSupportMode','Japanese support · 日本語サポート',b.japaneseSupportMode,[['none','None · 表示しない'],['short','Short meaning · 短い意味'],['explanation','Expandable explanation · 開閉できる説明']])}${field('japaneseSupport','Teacher-provided Japanese · 先生が入力する日本語',3)}</div>`+field('explanation','English explanation · 英語の説明',3)+field('examples','Examples — one per line · 例文（1行ずつ）',3)+field('tags','Tags — one per line · タグ（1行ずつ）',1)+checkbox('audio','Add US Ava / UK Libby · 発音ボタンを付ける',b.pronunciation?.enabled)+checkbox('studentEditable','Permit direct editing of this block when lesson permission is ON · 直接編集ON時にこのブロックを編集可能にする',b.displayOptions?.studentEditable);
 if(b.type==='useful_phrase')fields+=checkbox('keyPhrase','Keep in Key Phrases at the top · 重要フレーズとして最初に表示',b.displayOptions?.keyPhrase!==false);
 if(['collapsible_section','quick_practice_group'].includes(b.type))fields+=field('explanation','Section introduction · セクションの説明')+checkbox('collapsed','Initially collapsed · 初期状態を閉じる',b.displayOptions?.collapsed)+'<p class="ln-status">Following blocks belong to this section until the next section starts. Key phrases stay visible above. · 次のセクションまでのブロックをまとめます。</p>';
 return `<details class="ln-editor-block ln-tone-${tone}" data-editor-block="${e(b.id)}" open><summary><strong>${index+1}. ${e(label)}</strong><small data-block-summary>${e((b.englishText||b.originalText||'Add your teaching point · 教えたいポイントを入力').slice(0,90))}</small></summary><div class="ln-block-fields">${fields}</div><div class="ln-block-tools">${button('↑ Move up · 上へ',`data-move-block="-1" ${index===0?'disabled':''}`)}${button('↓ Move down · 下へ','data-move-block="1"')}${button('Duplicate · 複製','data-duplicate-block')}${button('Remove · 外す','data-remove-block')}</div></details>`;
}

export function mountLessonNoteStudio(root,{client,teacherId,profiles=[],studentId='',noteId='',initialTab='content',createNew=false,onCount=()=>{}}) {
 const api=createNoteApi(client);let disposed=false,request=0,note=null,detail=null,dirty=false,saving=false,busy=false,view=null,imagesDispose=()=>{},activeTab=initialTab,filterStudent=studentId,filterStatus='all',filterQuery='',offset=0,rows=[],dialogs=[],undoBlock=null;const assetDrafts=new Map();
 let lastNotice='';
 const stopUpdates=watchNoteUpdates(client,teacherId,async()=>{
  try{const notices=await api.notifications({unreadOnly:false});if(disposed)return;onCount(notices.filter(n=>n.unread).length);
   if(!note?.id||!root.querySelector('[data-editor-panel]'))return;
   const latest=notices.find(n=>n.note_id===note.id)?.updated_at||'';if(!latest||latest===lastNotice)return;lastNotice=latest;
   if(activeTab==='activity'&&!dirty&&!busy&&!assetDrafts.size&&!root.querySelector('textarea:focus,input:focus')&&!root.querySelector('[data-teacher-comment] textarea')?.value){const y=window.scrollY;await reloadDetail();window.scrollTo({top:y,behavior:'instant'});}
   else if(!root.querySelector('[data-live-note-update]')){const bar=document.createElement('div');bar.className='ln-live-update';bar.dataset.liveNoteUpdate='';bar.innerHTML='New learner activity · 生徒の更新があります '+button('Refresh activity · 更新を表示','data-refresh-live');root.prepend(bar);bar.querySelector('button').onclick=event=>void run(event.target,async()=>{cleanRequired();activeTab='activity';await reloadDetail();});}
  }catch{/* Visible manual controls remain usable; the next foreground poll retries. */}
 });
 const person=id=>{const p=profiles.find(p=>p.user_id===id);return p?.display_name || [p?.first_name,p?.last_name].filter(Boolean).join(' ') || 'Learner';};
 root.classList.add('ln-workspace');
 const clearViews=()=>{view?.dispose();view=null;imagesDispose();imagesDispose=()=>{};};
 const canLeave=()=>!saving&&!busy&&((!dirty&&!assetDrafts.size)||confirm('You have unsaved changes. Leave without saving? · 未保存の変更があります。保存せずに移動しますか？'));
 const setDirty=()=>{dirty=true;const s=root.querySelector('[data-save-status]');if(s)s.textContent='Unsaved changes · 未保存の変更';};
 const rememberRoute=(id='',activity=false)=>{if(!location.pathname.startsWith('/teacher'))return;const url=new URL(location.href);url.searchParams.set('studio','notes');url.searchParams.delete('create');if(id)url.searchParams.set('note',id);else url.searchParams.delete('note');if(activity)url.searchParams.set('view','activity');else url.searchParams.delete('view');history.replaceState(null,'',url.pathname+url.search);};
 const showError=error=>{const status=root.querySelector('[data-save-status]')||root.querySelector('[data-studio-status]');if(status)status.textContent=noteError(error);};
 const lock=value=>{busy=value;root.setAttribute('aria-busy',String(value));root.querySelectorAll('button,input,textarea,select').forEach(control=>{if(value){if(!control.hasAttribute('data-note-disabled'))control.dataset.noteDisabled=String(control.disabled);control.disabled=true;}else if(control.hasAttribute('data-note-disabled')){control.disabled=control.dataset.noteDisabled==='true';delete control.dataset.noteDisabled;}});};
 const run=async(target,fn)=>{if(busy)return;lock(true);try{await fn();}catch(error){showError(error);}finally{lock(false);}};
 async function refreshInboxCount(){try{const notifications=await api.notifications();if(!disposed)onCount(notifications.length);}catch{/* Existing Studio remains available during a transient note inbox failure. */}}
 async function open(id,{skipGuard=false}={}) {
  if(!skipGuard&&!canLeave())return;const token=++request;clearViews();root.innerHTML='<p class="ln-status" role="status">Opening the private notebook… · ノートを読み込み中…</p>';
  try{const data=await api.detail(id,{teacher:true});if(disposed||token!==request)return;detail=data;note=clone(data.note);dirty=false;assetDrafts.clear();rememberRoute(id,activeTab==='activity');renderEditor();}
  catch(error){if(!disposed&&token===request)root.innerHTML=`<p class="ln-error" data-studio-status role="status">${e(noteError(error))}</p>${button('Back to notes · 一覧へ','data-back-list')}`;root.querySelector('[data-back-list]')?.addEventListener('click',()=>void library());}
 }
 async function library({append=false}={}) {
  if(!append&&!canLeave())return;const token=++request;clearViews();note=null;detail=null;dirty=false;assetDrafts.clear();rememberRoute();
  if(!append){offset=0;rows=[];root.innerHTML=`<div class="ln-studio-heading"><div><p class="ln-kicker">YOUR TEACHING, MADE PERSONAL</p><h2>Lesson Notes · 個別レッスンノート</h2><p>Turn today’s lesson into something your learner can return to.</p></div><div class="ln-actions">${button('Activity inbox · 更新通知','data-inbox')}${button('+ Create lesson note · 作成','data-create class="ln-primary"')}</div></div><div class="ln-filter-bar">${selectField('student','Learner · 生徒',filterStudent,[['','All learners · すべての生徒'],...profiles.map(p=>[p.user_id,person(p.user_id)])],'filter')}${selectField('status','Status · 状態',filterStatus,[['all','All notes · すべて'],['draft','Drafts · 下書き'],['published','Published · 公開中'],['archived','Archived · 保管中'],['trash','Trash · ゴミ箱']],'filter')}<label>Search loaded notes · 読み込んだノートを検索<input data-search-note type="search" value="${e(filterQuery)}" placeholder="Title, topic or summary · タイトル・テーマ"></label></div><p role="status" data-studio-status>Loading… · 読み込み中…</p><div class="ln-cards" data-notes-list></div>${button('Load more · さらに表示','data-load-more hidden')}`;
   root.querySelector('[data-create]').onclick=startNote;
   root.querySelector('[data-inbox]').onclick=()=>void inbox();
   root.querySelector('[data-filter-field=student]').onchange=event=>{filterStudent=event.target.value;void library();};root.querySelector('[data-filter-field=status]').onchange=event=>{filterStatus=event.target.value;void library();};
   root.querySelector('[data-search-note]').oninput=event=>{filterQuery=event.target.value;drawCards();};
   root.querySelector('[data-load-more]').onclick=event=>void run(event.target,()=>library({append:true}));
  }
  try{const next=await api.list({studentId:filterStudent,status:filterStatus,offset,limit:30});if(disposed||token!==request)return;rows.push(...next);offset+=next.length;drawCards();root.querySelector('[data-load-more]').hidden=next.length<30;root.querySelector('[data-studio-status]').textContent=`${rows.length} notes loaded · 読み込み済み`;}
  catch(error){if(!disposed&&token===request)showError(error);}
  void refreshInboxCount();
 }
 function drawCards(){
  const list=root.querySelector('[data-notes-list]');if(!list)return;imagesDispose();
  const query=filterQuery.toLowerCase(),filtered=rows.filter(n=>[n.title,n.summary,...n.tags,person(n.student_id)].join(' ').toLowerCase().includes(query));
  list.innerHTML=filtered.map(n=>cardMarkup(n,{teacher:true,name:person(n.student_id)})).join('') || '<div class="ln-empty ln-wide"><h2>A notebook for every learner.</h2><p>Create a note, add the moments that mattered, and publish when it is ready.<br>生徒を選んで、今日のレッスンをノートに残しましょう。</p></div>';
  list.querySelectorAll('[data-open-note]').forEach(btn=>btn.onclick=()=>{activeTab='content';void open(btn.dataset.openNote);});
  list.querySelectorAll('[data-note-action]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{
   const selected=rows.find(n=>n.id===btn.dataset.noteId),action=btn.dataset.noteAction;if(!selected)return;
   if(action==='preview'){activeTab='preview';await open(selected.id,{skipGuard:true});return;}
   const messages={archive:'Archive this note? It will be hidden from the learner. · このノートを保管して生徒画面から非表示にしますか？',restore:'Restore this note as a private draft? · このノートを下書きに戻しますか？',trash:'Move this archived note to Trash? It can be restored later. · ゴミ箱へ移動しますか？後から復元できます。'};
   if(!await confirmNoteAction(`${selected.title}\n\n${messages[action]}`))return;
   if(action==='trash'||selected.deleted_at)await api.trash(selected.id,action==='restore',selected.version);
   else {const latest=await api.note(selected.id);if(latest.version!==selected.version)throw new Error('NOTE_CONFLICT');await api.save({...latest,status:action==='archive'?'archived':'draft'});}
   const updated=await api.list({studentId:filterStudent,status:filterStatus,limit:offset});rows=updated;offset=updated.length;drawCards();
   root.querySelector('[data-studio-status]').textContent=action==='archive'?'Archived · 保管しました':action==='trash'?'Moved to Trash · ゴミ箱へ移動しました':'Restored as draft · 下書きに戻しました';
  }));
  list.querySelectorAll('[data-note-menu]').forEach(menu=>{menu.ontoggle=()=>{if(menu.open)list.querySelectorAll('[data-note-menu]').forEach(other=>{if(other!==menu)other.open=false;});};menu.onkeydown=event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}};});
  imagesDispose=lazyPrivateImages(list,api);
 }
 function startNote(){note=newNote(filterStudent);detail={assets:[],annotations:[],suggestions:[],comments:[],revisions:[],activity:[],review_status:[],practice_attempts:[]};activeTab='content';renderEditor();}
 function renderEditor(){
  clearViews();
  root.innerHTML=`<div class="ln-editor-heading"><div><p class="ln-kicker">PRIVATE TEACHING NOTEBOOK</p><h2>${note.id?e(note.title):'Create a lesson note · ノートを作成'}</h2></div>${button('← All notes · 一覧へ','data-back-list')}</div><div class="ln-editor-toolbar"><span class="ln-state">${e(note.deleted_at?'TRASH · ゴミ箱':note.status.toUpperCase())} · ${note.id?`v${note.version}`:'New'}</span><div class="ln-actions">${button(note.status==='published'?'Unpublish to draft · 公開を取り下げる':'Save draft · 下書き保存','data-save="draft"')}${button(note.status==='published'?'Update published note · 公開内容を更新':'Publish · 生徒に公開','data-save="published"')}${button('Student View · 生徒プレビュー','data-editor-tab="preview"')}</div><p class="ln-status" role="status" data-save-status>${dirty?'Unsaved changes · 未保存の変更':note.id?'All changes saved · 保存済み':'Only the selected learner can see a published note. · 公開後、選択した生徒だけに表示されます。'}</p></div><nav class="ln-studio-nav" aria-label="Lesson note editor sections">${[['content','Content · 教材'],['media','Images · 画像'],['preview','Preview · 表示確認'],['activity','Student activity · 生徒の更新'],['history','History · 履歴']].map(([key,name])=>button(name,`data-editor-tab="${key}" aria-pressed="${activeTab===key}"`)).join('')}</nav><div data-editor-panel></div>`;
  root.querySelector('[data-back-list]').onclick=()=>void library();
  root.querySelectorAll('[data-save]').forEach(btn=>btn.onclick=()=>void run(btn,()=>save(btn.dataset.save)));
  root.querySelectorAll('[data-editor-tab]').forEach(btn=>btn.onclick=()=>{activeTab=btn.dataset.editorTab;renderEditor();});
  if(activeTab==='content')renderContent();if(activeTab==='preview')renderPreview();if(activeTab==='media')renderMedia();if(activeTab==='activity')renderActivity();if(activeTab==='history')renderHistory();
  if(note.deleted_at){root.querySelectorAll('[data-save]').forEach(b=>b.disabled=true);root.querySelector('[data-editor-panel]').innerHTML=`<div class="ln-empty"><h2>In Trash · ゴミ箱にあります</h2><p>This note is hidden from the learner. Its content and history are retained. · 内容と履歴は保持されています。</p>${button('Restore as draft · 下書きに戻す','data-restore-trash')}</div>`;root.querySelector('[data-restore-trash]').onclick=event=>void run(event.target,async()=>{await api.trash(note.id,true,note.version);await reloadDetail();});}
  if(busy)lock(true);
 }
 async function save(status){
  if(saving)return;if(assetDrafts.size)throw new Error('Save image details in the Images tab first. · 画像タブで説明の変更を先に保存してください。');saving=true;const before=note.status;note.status=status;
  try{const saved=await api.save(note);note=clone(saved);dirty=false;detail.note=saved;rememberRoute(note.id,activeTab==='activity');root.querySelector('[data-save-status]').textContent='Saved · 保存しました';renderEditor();}
  catch(error){note.status=before;throw error;}finally{saving=false;}
 }
 function renderContent(){
  const panel=root.querySelector('[data-editor-panel]');
  panel.innerHTML=`<div class="ln-editor-meta">${selectField('student_id','Learner · 生徒',note.student_id,[['','Choose learner · 生徒を選んでください'],...profiles.map(p=>[p.user_id,person(p.user_id)])],'note')}${inputField('lesson_date','Lesson date · レッスン日',note.lesson_date,{type:'date'})}<div class="ln-wide">${inputField('title','Lesson title · タイトル',note.title,{max:180})}</div><div class="ln-wide">${inputField('summary','A short introduction · 短い概要',note.summary,{rows:2,max:1200})}</div><div class="ln-wide">${inputField('focus','Today’s Focus — always visible · 今日のポイント（常に表示）',note.focus,{rows:2,max:2000})}</div><div class="ln-wide">${inputField('tags','Topics — comma separated · テーマ（カンマ区切り）',note.tags.join(', '),{max:600})}</div></div><div class="ln-editor-layout"><div><div class="ln-studio-heading"><div><h3>Build the lesson · 教材を組み立てる</h3><p>English first. Japanese only where it helps.</p></div>${button('↳ Quick Import · 一括取り込み','data-import')}</div><div data-block-list></div><div class="ln-add-block"><label>Add a teaching block · 教材ブロック<select data-block-type>${Object.entries(BLOCK_TYPES).map(([key,[name]])=>`<option value="${key}">${e(name)}</option>`).join('')}</select></label>${button('+ Add block · 追加','data-add-block')}</div>${button('Undo last removal · 削除を戻す',`data-undo ${undoBlock?'':'hidden'}`)}</div><aside class="ln-editor-sidebar"><details open><summary><strong>Learner permissions · 生徒の権限</strong></summary><p>Each notebook has its own settings. Personal notes never replace your teaching content.</p><div class="ln-permission-grid">${Object.entries(PERMISSIONS).map(([key,[label]])=>checkbox(key,label,note[key],'note')).join('')}</div><p>Direct editing also requires permission on each individual block. Every edit keeps a previous version.<br>直接編集にはブロックごとの許可も必要です。変更前の版を残します。</p></details>${note.id?`<hr><div class="ln-actions">${button('Duplicate note · ノートを複製','data-duplicate-note')}${note.status==='archived'?button('Delete to Trash · ゴミ箱に削除','data-trash-note'):button('Archive safely · 保管する','data-archive-note')}</div>`:''}</aside></div>`;
  const student=panel.querySelector('[data-note-field=student_id]');student.disabled=Boolean(note.id);
  panel.querySelectorAll('[data-note-field]').forEach(control=>control.oninput=()=>{
   const key=control.dataset.noteField;note[key]=control.type==='checkbox'?control.checked:key==='tags'?control.value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,12):control.value;setDirty();
  });
  panel.querySelector('[data-trash-note]')?.addEventListener('click',event=>void run(event.target,async()=>{cleanRequired();if(!await confirmNoteAction('Move this archived note to Trash? You can restore it later. · ゴミ箱へ移動しますか？後から復元できます。'))return;await api.trash(note.id,false,note.version);await reloadDetail();}));
  drawBlocks();panel.querySelector('[data-add-block]').onclick=()=>{const b=newBlock(panel.querySelector('[data-block-type]').value);note.content_json.blocks.push(b);setDirty();drawBlocks();panel.querySelector(`[data-editor-block="${b.id}"]`)?.querySelector('textarea,select')?.focus();};
  panel.querySelector('[data-undo]').onclick=()=>{if(undoBlock){note.content_json.blocks.splice(undoBlock.index,0,undoBlock.block);undoBlock=null;setDirty();renderEditor();}};
  panel.querySelector('[data-import]').onclick=quickImport;
  panel.querySelector('[data-duplicate-note]')?.addEventListener('click',event=>void run(event.target,async()=>{
   if(dirty)throw new Error('Save your changes before duplicating. · 先に変更を保存してください。');
   const id=await api.duplicate(note,detail.assets,message=>root.querySelector('[data-save-status]').textContent=message);await open(id,{skipGuard:true});
  }));
  panel.querySelector('[data-archive-note]')?.addEventListener('click',event=>void run(event.target,async()=>{
   if(!await confirmNoteAction('Archive this note? It will be hidden from the learner and retained with its history. · 生徒画面から非表示にし、履歴とともに保管しますか？'))return;
   await save('archived');
  }));
 }
 function drawBlocks(){
  const list=root.querySelector('[data-block-list]');imagesDispose();list.innerHTML=note.content_json.blocks.map((b,i)=>editorBlock(b,i,detail.assets)).join('') || '<p class="ln-empty-small">Start with a teaching block or paste your lesson using Quick Import. · ブロック追加または一括取り込みから始めましょう。</p>';
  list.querySelectorAll('[data-editor-block]').forEach(element=>{
   const id=element.dataset.editorBlock,block=note.content_json.blocks.find(b=>b.id===id);
   element.querySelectorAll('[data-block-field]').forEach(control=>control.oninput=()=>{
    const key=control.dataset.blockField;readBlockField(block,control);
    if(key==='assetId')paintBlockImage(element,block);
    element.querySelector('[data-block-summary]').textContent=(block.englishText||block.originalText||'Teaching block').slice(0,90);setDirty();
   });
   if(block.type==='image'){
    paintBlockImage(element,block);
    element.querySelector('[data-block-image-upload]').onclick=event=>void run(event.target,async()=>{
     const file=element.querySelector('[data-block-image-file]').files[0],alt=element.querySelector('[data-block-image-alt]').value.trim();
     if(!file)throw new Error('Choose an image file first. · 先に画像ファイルを選んでください。');
     if(!alt)throw new Error('Add a short image description. · 画像の説明を入力してください。');
     if(!note.id||dirty)await save(note.status);
     const asset=await api.upload(note.id,file,{alt_text:alt,caption:'',title:'',asset_type:'teacher_attachment'},{onStatus:m=>root.querySelector('[data-save-status]').textContent=m});
     detail=await api.detail(note.id,{teacher:true});note=clone(detail.note);const target=note.content_json.blocks.find(b=>b.id===id);if(!target)throw new Error('Image uploaded. Select it from Images.');target.assetId=asset.id;dirty=true;await save(note.status);
    });
   }
   element.querySelectorAll('[data-move-block]').forEach(btn=>btn.onclick=()=>{note.content_json.blocks=moveItem(note.content_json.blocks,id,Number(btn.dataset.moveBlock));setDirty();drawBlocks();});
   element.querySelector('[data-duplicate-block]').onclick=()=>{const index=note.content_json.blocks.indexOf(block);note.content_json.blocks.splice(index+1,0,{...clone(block),id:crypto.randomUUID(),...(block.questionId?{questionId:crypto.randomUUID()}:{})});setDirty();drawBlocks();};
   element.querySelector('[data-remove-block]').onclick=()=>{undoBlock={block:clone(block),index:note.content_json.blocks.indexOf(block)};note.content_json.blocks=note.content_json.blocks.filter(b=>b.id!==id);setDirty();drawBlocks();root.querySelector('[data-undo]').hidden=false;};
  });imagesDispose=lazyPrivateImages(list,api);
 }
 function paintBlockImage(element,block){const host=element.querySelector('[data-block-image-preview]'),asset=detail.assets.find(a=>a.id===block.assetId&&a.state==='ready');host.innerHTML=asset?`<img data-private-thumb="${e(asset.thumbnail_path)}" alt="${e(asset.alt_text)}" loading="lazy" class="ln-block-image-preview">`:'<p class="ln-status">No image selected yet · 画像は未選択です</p>';if(asset)void api.signed(asset.thumbnail_path).then(url=>{const img=host.querySelector('img');if(img?.isConnected&&block.assetId===asset.id)img.src=url;}).catch(showError);}
 function quickImport(){
  const dialog=document.createElement('dialog');dialog.className='ln-modal';let imported=null;
  dialog.innerHTML=`<h2>Quick Import · 一括取り込み</h2><p>Paste Markdown or structured lesson text. Check the preview, then add editable blocks.<br>Markdownやレッスンメモを貼り付け、内容を確認してから追加します。</p><label>Lesson text · レッスンテキスト<textarea class="ln-import-text" maxlength="180000" placeholder="## Japanese → English&#10;English: refund&#10;Japanese: 返金&#10;Example: I'd like a full refund."></textarea></label><div class="ln-actions">${button('Preview import · 取り込みを確認','data-parse')}${button('Add these blocks · この内容を追加','data-apply disabled')}${button('Cancel · キャンセル','data-close')}</div>${statusMarkup()}<div class="ln-import-preview ln-notebook"></div>`;
  document.body.append(dialog);dialogs.push(dialog);dialog.onclose=()=>dialog.remove();dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  dialog.querySelector('.ln-import-text').oninput=()=>{imported=null;dialog.querySelector('[data-apply]').disabled=true;dialog.querySelector('.ln-import-preview').replaceChildren();};
  dialog.querySelector('[data-parse]').onclick=()=>{
   try{
    imported=importLessonText(dialog.querySelector('.ln-import-text').value);
    const preview=dialog.querySelector('.ln-import-preview'),practice=imported.blocks.filter(isPractice).length;
    dialog.querySelector('[role=status]').textContent=`${imported.blocks.length-practice} teaching blocks · 教材 / ${practice} practice questions · 練習問題\n${imported.warnings.join('\n')}`;
    preview.innerHTML=`<h3>Lesson details · レッスンの概要</h3><div class="ln-import-meta">${Object.entries(METADATA_FIELDS).map(([key,[label,max]])=>{
     const existing=Array.isArray(note[key])?note[key].join(', '):note[key]||'',value=Array.isArray(imported.metadata[key])?imported.metadata[key].join(', '):imported.metadata[key];
     return `<div>${inputField(key,label,value,{scope:'import',rows:key==='summary'||key==='focus'?2:0,max})}<small>${imported.explicitFields.includes(key)?'From pasted text · 入力テキストより':'Suggested from lesson · 教材から作成'}</small>${existing.trim()?`<p class="ln-import-current">Current · 現在：${e(existing)}</p>${checkbox(key,'Replace this field · この項目を置き換える',false,'replace')}`:''}</div>`;
    }).join('')}</div><h3>Content & practice · 教材と練習</h3><div data-import-content></div><details><summary>Edit imported blocks · 取り込むブロックを編集</summary><div data-import-edit>${imported.blocks.map((b,i)=>editorBlock(b,i,[])).join('')}</div></details>`;
    const paint=()=>{preview.querySelector('[data-import-content]').innerHTML=contentMarkup({...newNote(),...imported.metadata,content_json:{schemaVersion:1,blocks:imported.blocks}},{mode:'support',controls:false});};paint();
    preview.querySelectorAll('[data-import-field]').forEach(control=>control.oninput=()=>{const key=control.dataset.importField;imported.metadata[key]=key==='tags'?control.value.split(/[,、]/).map(t=>t.trim()).filter(Boolean):control.value;paint();});
    preview.querySelectorAll('[data-editor-block]').forEach(el=>{
     const block=imported.blocks.find(b=>b.id===el.dataset.editorBlock);el.open=false;
     el.querySelector('.ln-block-tools').remove();el.querySelectorAll('[data-block-image-file],[data-block-image-alt],[data-block-image-upload]').forEach(c=>c.closest('label')?.remove()||c.remove());
     el.querySelectorAll('[data-block-field]').forEach(control=>control.oninput=()=>{readBlockField(block,control);paint();});
    });
    dialog.querySelector('[data-apply]').disabled=!imported.blocks.length;
   }
   catch(error){dialog.querySelector('[role=status]').textContent=noteError(error);}
  };
  dialog.querySelector('[data-apply]').onclick=()=>{if(!imported)return;try{note=applyLessonImport(note,imported,[...dialog.querySelectorAll('[data-replace-field]:checked')].map(c=>c.dataset.replaceField));setDirty();dialog.close();renderEditor();}catch(error){dialog.querySelector('[role=status]').textContent=noteError(error);}};dialog.showModal();
 }
 function renderPreview(){
  const panel=root.querySelector('[data-editor-panel]');let mode='support',mobile=false;
  panel.innerHTML=`<p class="ln-status">Preview of your current edits. These display switches do not change stored content.<br>未保存の変更も確認できます。表示の切り替えは教材の保存内容を変更しません。</p><div class="ln-preview-controls">${button('EN Primary','data-preview-mode="english" aria-pressed="false"')}${button('EN + JP Support','data-preview-mode="support" aria-pressed="true"')}${button('Desktop · パソコン','data-preview-size="desktop" aria-pressed="true"')}${button('Mobile · スマホ','data-preview-size="mobile" aria-pressed="false"')}</div><div class="ln-preview-frame" data-preview-view></div>`;
  const draw=()=>{view?.dispose();const frame=panel.querySelector('[data-preview-view]');frame.classList.toggle('is-mobile',mobile);view=mountNoteView(frame,{detail:{...detail,note},api,student:false,mode,teacherName:'Your English teacher'});};
  panel.querySelectorAll('[data-preview-mode]').forEach(btn=>btn.onclick=()=>{mode=btn.dataset.previewMode;panel.querySelectorAll('[data-preview-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));draw();});
  panel.querySelectorAll('[data-preview-size]').forEach(btn=>btn.onclick=()=>{mobile=btn.dataset.previewSize==='mobile';panel.querySelectorAll('[data-preview-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));draw();});draw();
 }
 function requireSaved(panel){if(!note.id){panel.innerHTML='<div class="ln-empty"><h2>Give this lesson a home.</h2><p>Choose a learner and save a draft first. · 生徒を選び、先に下書きを保存してください。</p></div>';return false;}return true;}
 async function reloadDetail(){const data=await api.detail(note.id,{teacher:true});if(disposed)return;detail=data;note=clone(data.note);dirty=false;renderEditor();}
 function cleanRequired(assetId=''){if(dirty)throw new Error('Save the text and permission changes first. · 教材と権限の変更を先に保存してください。');if([...assetDrafts.keys()].some(id=>id!==assetId))throw new Error('Save the other image details first. · 他の画像の説明を先に保存してください。');}
 function renderMedia(){
  const panel=root.querySelector('[data-editor-panel]');if(!requireSaved(panel))return;
  const assets=detail.assets.filter(a=>a.state==='ready'&&a.uploader_role==='teacher').sort((a,b)=>a.display_order-b.display_order);
  panel.innerHTML=`<h3>Visual review materials · 画像で復習する教材</h3><p class="ln-status">Upload infographics, worksheets or reference images. Files stay private; replacing an image keeps its previous version in history.<br>画像は非公開で保存し、差し替え前の版も履歴に残します。</p><form class="ln-upload-form"><label>Choose images — multiple files supported · 複数の画像を選択<input type="file" accept="image/png,image/jpeg,image/webp" multiple required></label><label>Image description · 画像の説明<input name="alt_text" maxlength="450" placeholder="What should the learner notice? · どんな教材ですか？" required></label><label>Caption · 共通の説明<input name="caption" maxlength="2000"></label>${selectField('asset_type','Material type · 画像の種類','infographic',[['infographic','Infographic · 図解'],['worksheet','Worksheet · ワークシート'],['reference','Reference · 参考資料'],['teacher_attachment','Teacher attachment · 先生の添付']],'upload')}<button class="ln-button ln-primary" type="submit">Upload materials · 教材をアップロード</button><p class="ln-status">PNG / JPEG / WebP · up to 20MB each. Optimized full image + small preview. · 1枚20MBまで、自動最適化します。</p>${statusMarkup()}</form><div data-pending-uploads></div><div data-asset-list>${assets.map((original,i)=>{const a={...original,...assetDrafts.get(original.id)};return `<article class="ln-asset-editor" data-asset-id="${e(a.id)}"><img data-private-thumb="${e(a.thumbnail_path)}" alt="${e(a.alt_text)}" loading="lazy"><div class="ln-asset-fields">${inputField('title','Title · 画像タイトル',a.title,{scope:'asset',max:180})}${inputField('caption','Caption · 説明',a.caption,{scope:'asset',rows:2,max:2000})}${inputField('alt_text','Alt text · 画像の説明',a.alt_text,{scope:'asset',max:500})}${selectField('asset_type','Type · 種類',a.asset_type,[['infographic','Infographic'],['worksheet','Worksheet'],['reference','Reference'],['teacher_attachment','Teacher attachment']],'asset')}<div class="ln-actions">${button('Save image details · 説明を保存','data-save-asset')}${button(note.cover_asset_id===a.id?'★ Remove cover · 表紙を解除':'☆ Set cover · 表紙にする','data-set-cover')}${button('↑','data-move-asset="-1" aria-label="Move image up" '+(i===0?'disabled':''))}${button('↓','data-move-asset="1" aria-label="Move image down" '+(i===assets.length-1?'disabled':''))}${button('Open · 拡大','data-open-asset')}${button('Replace · 差し替え','data-replace-asset')}${button('Archive image · 画像を保管','data-archive-asset')}</div><input type="file" accept="image/png,image/jpeg,image/webp" data-replacement hidden><small class="ln-asset-meta">TEACHER MATERIAL · ${e(time(a.created_at))}</small></div></article>`;}).join('')}</div>`;
  const upload=panel.querySelector('form');upload.onsubmit=async event=>{event.preventDefault();const btn=upload.querySelector('[type=submit]'),status=upload.querySelector('[role=status]');if(busy)return;lock(true);
   try{cleanRequired();const files=[...upload.querySelector('[type=file]').files];if(files.length>6)throw new Error('Upload up to 6 images at a time. · 1回6枚まで追加できます。');let count=0;
    for(const file of files){await api.upload(note.id,file,{alt_text:upload.elements.alt_text.value+(files.length>1?` (${count+1})`:''),caption:upload.elements.caption.value,title:files.length>1?`Visual ${count+1}`:'',asset_type:upload.querySelector('[data-upload-field]').value},{onStatus:m=>status.textContent=`${count+1}/${files.length} · ${m}`});count++;}
    await reloadDetail();
   }catch(error){const message=noteError(error);if(!dirty){try{await reloadDetail();}catch{}}showError(message);if(status.isConnected)status.textContent=message;}finally{lock(false);}
  };
  const pending=detail.assets.filter(a=>a.state==='pending');panel.querySelector('[data-pending-uploads]').innerHTML=pending.map(a=>`<p class="ln-error">Unfinished upload · 未完了の画像：${e(a.alt_text)} ${button('Remove unfinished upload · 未完了を削除',`data-cancel-upload="${e(a.id)}"`)}</p>`).join('');
  panel.querySelectorAll('[data-cancel-upload]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{cleanRequired();await api.cancelUpload(pending.find(a=>a.id===btn.dataset.cancelUpload));await reloadDetail();}));
  panel.querySelectorAll('[data-asset-id]').forEach(el=>{
   const asset=assets.find(a=>a.id===el.dataset.assetId);
   el.querySelectorAll('[data-asset-field]').forEach(c=>c.oninput=()=>{assetDrafts.set(asset.id,Object.fromEntries([...el.querySelectorAll('[data-asset-field]')].map(f=>[f.dataset.assetField,f.value])));root.querySelector('[data-save-status]').textContent='Unsaved image details · 画像の説明を保存してください';});
   el.querySelector('[data-save-asset]').onclick=event=>void run(event.target,async()=>{cleanRequired(asset.id);const changes=Object.fromEntries([...el.querySelectorAll('[data-asset-field]')].map(c=>[c.dataset.assetField,c.value]));await api.assetChange(asset.id,changes,note.version);assetDrafts.delete(asset.id);await reloadDetail();});
   el.querySelector('[data-set-cover]').onclick=event=>void run(event.target,async()=>{cleanRequired();await api.order(note.id,assets.map(a=>a.id),note.cover_asset_id===asset.id?null:asset.id,note.version);await reloadDetail();});
   el.querySelectorAll('[data-move-asset]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{cleanRequired();const ordered=moveItem(assets,asset.id,Number(btn.dataset.moveAsset));await api.order(note.id,ordered.map(a=>a.id),note.cover_asset_id,note.version);await reloadDetail();}));
   el.querySelector('[data-open-asset]').onclick=()=>dialogs.push(openImageViewer(assets,assets.indexOf(asset),api));
   const file=el.querySelector('[data-replacement]');el.querySelector('[data-replace-asset]').onclick=()=>file.click();
   file.onchange=async()=>{if(!file.files[0]||busy)return;lock(true);try{cleanRequired();await api.upload(note.id,file.files[0],asset,{replaceId:asset.id,onStatus:m=>root.querySelector('[data-save-status]').textContent=m});await reloadDetail();}catch(error){showError(error);}finally{file.value='';lock(false);}};
   el.querySelector('[data-archive-asset]').onclick=event=>void run(event.target,async()=>{cleanRequired();await api.assetChange(asset.id,{archive:true},note.version);await reloadDetail();});
  });imagesDispose=lazyPrivateImages(panel,api);
 }
 function renderActivity(){
  const panel=root.querySelector('[data-editor-panel]');if(!requireSaved(panel))return;
  panel.innerHTML=`<div class="ln-studio-heading"><div><h3>Student activity · 生徒の更新</h3><p>${e(person(note.student_id))} · ${e(dateLabel(note.lesson_date))}</p><p>${detail.review_status?.[0]?.reviewed_version>=note.version?'✓ Learner reviewed this version · 生徒がこの版を復習済み':'Review not completed · まだ復習済みではありません'}</p></div>${button('Mark notifications read · 通知を確認済みに','data-ack')}</div><h3>Practice progress · 練習の進捗</h3>${teacherPracticeMarkup(note,detail.practice_attempts)}<h3>Suggested edits · 修正の提案</h3><div>${detail.suggestions.map(s=>`<article class="ln-suggestion" data-suggestion-id="${e(s.id)}"><span class="ln-state">${e(s.status)}</span><p class="ln-status">${e(time(s.created_at))}</p><div class="ln-before-after"><div><span class="ln-micro">BEFORE</span>${changeSnapshot(s.original_content)}</div><div><span class="ln-micro">AFTER</span>${changeSnapshot(s.proposed_content)}</div></div>${s.status==='pending'?`<div class="ln-actions">${button('Accept · 採用','data-decision="accepted"')}${button('Reject · 不採用','data-decision="rejected"')}${button('Resolve without change · 変更せず完了','data-decision="resolved"')}</div>`:''}</article>`).join('')||'<p class="ln-empty-small">No suggestions yet. · まだ提案はありません。</p>'}</div><h3>Personal annotations · 生徒のメモ</h3>${detail.annotations.map(a=>`<article class="ln-history-entry"><small>${a.block_id?e(note.content_json.blocks.find(b=>b.id===a.block_id)?.englishText?.slice(0,70)||'Block removed from current version · 過去のブロック'):'Whole lesson · レッスン全体'} · ${e(time(a.updated_at))}</small><p class="ln-rich-preview">${richTextMarkup(a.body,a.body_format)}</p></article>`).join('')||'<p class="ln-empty-small">No annotations yet. · まだメモはありません。</p>'}<h3>Student attachments · 生徒の添付</h3><div class="ln-gallery">${detail.assets.filter(a=>a.uploader_role==='student'&&a.state==='ready').map(a=>`<figure><button class="ln-image-open" data-student-image="${e(a.id)}"><img data-private-thumb="${e(a.thumbnail_path)}" alt="${e(a.alt_text)}" loading="lazy"></button><figcaption><strong>${e(person(a.uploader_id))}</strong><small>${e(time(a.created_at))}</small><p>${e(a.caption)}</p>${button('Remove attachment · 添付を外す',`data-teacher-remove-image="${e(a.id)}"`)}</figcaption></figure>`).join('')}</div><h3>Comments · コメント</h3>${detail.comments.map(c=>`<article class="ln-comment"><small>${e(c.actor_id===teacherId?'Teacher · 先生':person(c.actor_id))} · ${e(time(c.created_at))}</small><p>${e(c.body)}</p></article>`).join('')||'<p class="ln-empty-small">No comments yet. · まだコメントはありません。</p>'}<form data-teacher-comment><label>Reply to learner · 生徒にコメント<textarea maxlength="4000" required rows="3"></textarea></label><button type="submit" class="ln-button">Post comment · 送信</button>${statusMarkup()}</form><details><summary>Audit trail · 操作履歴</summary>${detail.activity.map(a=>`<p class="ln-history-entry"><strong>${e(a.action_type.replaceAll('_',' '))}</strong><br><small>${e(a.actor_role==='teacher'?'Teacher':person(a.actor_id))} · ${e(time(a.updated_at))}${a.entity_key?` · ${e(a.entity_key)}`:''}</small></p>`).join('')}</details>`;
  panel.querySelectorAll('[data-decision]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{cleanRequired();await api.reviewSuggestion(btn.closest('[data-suggestion-id]').dataset.suggestionId,btn.dataset.decision,note.version);await reloadDetail();}));
  let unread=true;const ack=panel.querySelector('[data-ack]');void api.notifications({unreadOnly:false}).then(rows=>{if(ack.isConnected){unread=rows.some(r=>r.note_id===note.id&&r.unread);ack.textContent=unread?'Mark read · 確認済みにする':'Mark unread · 未読に戻す';}}).catch(showError);ack.onclick=event=>void run(event.target,async()=>{await api.setRead(note.id,!unread);unread=!unread;ack.textContent=unread?'Mark read · 確認済みにする':'Mark unread · 未読に戻す';void refreshInboxCount();});
  panel.querySelectorAll('[data-teacher-remove-image]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{cleanRequired();if(!await confirmNoteAction('Remove this learner attachment from the page? · 生徒の添付をページから外しますか？'))return;await api.assetChange(btn.dataset.teacherRemoveImage,{archive:true},note.version);await reloadDetail();}));
  panel.querySelector('[data-teacher-comment]').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,btn=form.querySelector('button');btn.disabled=true;try{cleanRequired();await api.comment(note.id,form.querySelector('textarea').value);await reloadDetail();}catch(error){form.querySelector('[role=status]').textContent=noteError(error);btn.disabled=false;}};
  const studentImages=detail.assets.filter(a=>a.uploader_role==='student'&&a.state==='ready');panel.querySelectorAll('[data-student-image]').forEach(btn=>btn.onclick=()=>dialogs.push(openImageViewer(studentImages,studentImages.findIndex(a=>a.id===btn.dataset.studentImage),api)));imagesDispose=lazyPrivateImages(panel,api);
 }
 function renderHistory(){
  const panel=root.querySelector('[data-editor-panel]');if(!requireSaved(panel))return;
  panel.innerHTML=`<h3>Version history · 変更履歴</h3><p class="ln-status">Each entry holds the content before that change, including the teacher’s image arrangement. Restoring creates a private draft for you to review and publish.<br>変更前の本文と画像構成を保存しています。復元した内容は下書きになり、確認してから公開できます。直近100件を表示します。</p>${detail.revisions.map(r=>`<article class="ln-history-entry"><strong>${e(r.change_type.replaceAll('_',' '))}</strong><p class="ln-status">${e(time(r.created_at))} · ${e(r.changed_by===teacherId?'Teacher · 先生':person(r.changed_by))}${r.affected_blocks.length?` · ${r.affected_blocks.length} block(s)`:''}</p><div class="ln-actions">${button('Inspect version · 内容を確認',`data-inspect="${e(r.id)}"`)}${button('Restore as draft · 下書きとして復元',`data-restore="${e(r.id)}"`)}</div></article>`).join('')||'<div class="ln-empty"><h2>A safe place for every version.</h2><p>History begins when you update a saved note. · 保存済みのノートを更新すると履歴が残ります。</p></div>'}`;
  panel.querySelectorAll('[data-restore]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{cleanRequired();if(!await confirmNoteAction('Restore this version as a private draft? The current version stays in history. · この版を下書きとして復元しますか？現在の版も履歴に残ります。'))return;await api.restore(btn.dataset.restore,note.version);await reloadDetail();}));
  panel.querySelectorAll('[data-inspect]').forEach(btn=>btn.onclick=()=>void run(btn,async()=>{
   const revision=await api.revision(btn.dataset.inspect),dialog=document.createElement('dialog');dialog.className='ln-modal';dialog.innerHTML=`<h2>Previous version · 変更前の版</h2><p>${e(time(revision.created_at))}</p>${button('Close · 閉じる','data-close')}<div data-version-preview></div>`;document.body.append(dialog);dialogs.push(dialog);
   const preview=mountNoteView(dialog.querySelector('[data-version-preview]'),{detail:{note:revision.snapshot_json.note,assets:revision.snapshot_json.assets,annotations:[],suggestions:[],comments:[],review_status:[]},api,student:false});dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.onclose=()=>{preview.dispose();dialog.remove();};dialog.showModal();
  }));
 }
 async function inbox(){
  if(!canLeave())return;clearViews();dirty=false;const token=++request;
  root.innerHTML=`<div class="ln-studio-heading"><div><p class="ln-kicker">A LITTLE ATTENTION GOES A LONG WAY</p><h2>Activity inbox · 生徒の更新通知</h2><p>Changes are grouped by learner and lesson, not by keystroke. · 生徒・ノートごとにまとめて表示します。</p></div>${button('← Lesson Notes · 一覧へ','data-back-list')}</div><p role="status" data-studio-status>Loading…</p><div data-inbox-list></div>`;root.querySelector('[data-back-list]').onclick=()=>void library();
  try{const notices=await api.notifications();if(disposed||token!==request)return;onCount(notices.length);root.querySelector('[data-inbox-list]').innerHTML=notices.map(n=>`<article class="ln-inbox-entry"><span class="ln-micro">${e(person(n.actor_id))} · ${e(time(n.updated_at))}</span><h3>${e(n.note?.title||'Lesson note')}</h3><p>${Object.entries(n.counts).map(([key,count])=>`${count} ${e(eventLabels[key]||key)}`).join(' / ')}</p>${button('Review changes · 更新を確認 →',`data-review-note="${e(n.note_id)}"`)}</article>`).join('')||'<div class="ln-empty"><h2>You’re all caught up.</h2><p>Meaningful student updates will appear here. · 生徒の更新があればここに届きます。</p></div>';root.querySelector('[data-studio-status]').textContent='';root.querySelectorAll('[data-review-note]').forEach(btn=>btn.onclick=()=>{activeTab='activity';void open(btn.dataset.reviewNote);});}
  catch(error){if(!disposed)showError(error);}
 }
 const beforeUnload=event=>{if(dirty||saving||busy||assetDrafts.size){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',beforeUnload);
 if(noteId)void open(noteId,{skipGuard:true});else if(createNew)startNote();else void library();
 return {dirty:()=>dirty||saving||busy||assetDrafts.size>0,canLeave,dispose(){disposed=true;stopUpdates();request++;clearViews();dialogs.forEach(d=>{if(d.open)d.close();else d.remove();});window.removeEventListener('beforeunload',beforeUnload);}};
}
