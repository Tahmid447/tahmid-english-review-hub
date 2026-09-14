import {escapeHTML as e} from './store.js?v=20260911-mobile2';
import {PRACTICE_TYPES,isPractice,questionId,sameQuestion,practiceSummary} from './note-practice-model.js?v=20260915-practice';
import {noteError} from './lesson-note-api.js?v=20260915-practice';
const button=(label,attributes='')=>`<button type="button" class="ln-button" ${attributes}>${label}</button>`;
export function practiceMarkup(b,{mode='support',controls=true}={}) {
 const label=PRACTICE_TYPES[b.type]?.[0]||'Practice · 練習';
 return `<article class="ln-block ln-tone-teal ln-practice" id="block-${e(b.id)}" data-block-id="${e(b.id)}" data-practice-block="${e(b.id)}"><div class="ln-block-label">◎ ${e(label)}</div><h3>${e(b.englishText||'Add a practice prompt · 設問を入力')}</h3>${b.difficulty?`<small class="ln-micro">${e({easy:'Easy · 基礎',medium:'Medium · 標準',challenging:'Challenging · 応用'}[b.difficulty]||'')}</small>`:''}${b.tags?.length?`<div class="ln-tags">${b.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>`:''}${mode==='support'&&b.japaneseSupport&&b.japaneseSupportMode!=='none'?(b.japaneseSupportMode==='explanation'?`<details class="ln-jp-support"><summary>日本語サポート</summary><p class="ln-japanese">${e(b.japaneseSupport)}</p></details>`:`<p class="ln-japanese">${e(b.japaneseSupport)}</p>`):''}${b.hint?`<details class="ln-hint"><summary>Hint · ヒント</summary><p>${e(b.hint)}</p></details>`:''}${controls&&b.pronunciation?.enabled?`<div class="ln-actions">${button('▶ US · Ava','data-note-voice="us"')}${button('▶ UK · Libby','data-note-voice="gb"')}</div><p class="ln-status" data-voice-status role="status"></p>`:''}<div data-practice-controls><p class="ln-status">${e(b.choices?.map((v,i)=>`${String.fromCharCode(65+i)}. ${v}`).join(' / ')||'Interactive practice · 回答できる練習問題')}</p></div></article>`;
}
export function progressMarkup(summary) {
 if(!summary.total)return '';
 return `<div class="ln-progress-head"><strong>Practice progress · 練習の進み具合</strong><span>${summary.completed} / ${summary.total} completed · 完了</span></div><progress value="${summary.completed}" max="${summary.total}" aria-label="Practice completed · 練習完了"></progress><div class="ln-progress-stats"><span>${summary.attempted}/${summary.total} attempted · 回答済み</span><span>${summary.correct}/${summary.checked} correct · 自動確認の正解</span><span>${summary.review} to review · 要復習</span></div>${summary.lastActivity?`<small>Last practice · 最終練習 ${e(new Date(summary.lastActivity).toLocaleString())}</small>`:''}`;
}
export function teacherPracticeMarkup(note,attempts=[]) {
 const questions=note.content_json.blocks.filter(isPractice),summary=practiceSummary(questions,attempts);
 if(!questions.length)return '<p class="ln-status">No interactive practice in this note yet. · このノートにはまだ練習問題がありません。</p>';
 return `<section class="ln-practice-summary">${progressMarkup(summary)}</section><details class="ln-practice-details"><summary>Responses & review needs · 回答と復習ポイント (${questions.length})</summary>${questions.map(b=>{const a=attempts.find(v=>v.question_id===questionId(b));const current=a&&sameQuestion(a.question_snapshot,b);return `<article class="ln-history-entry"><strong>${e(b.englishText)}</strong><p>${!a?'Not opened · 未開始':!current?'Question updated · 更新前の回答':a.self_check_status==='review'?'Needs review · 要復習':a.is_correct===true?'Correct · 正解':a.is_correct===false?'Check the model · 回答例と確認':a.completed?'Completed · 完了':a.answered_at?'Answered · 回答済み':'Opened · 開きました'}</p>${a?.response_json?.text?`<blockquote>${e(a.response_json.text)}</blockquote>`:''}${a?.self_check_status?`<p>Self-check · 自己確認: ${a.self_check_status==='understood'?'I understand · 理解できた':'More review · もう一度復習'}</p>`:''}${a?`<small>${e(new Date(a.updated_at).toLocaleString())}</small>`:''}</article>`;}).join('')}</details>`;
}
export function mountPractice(root,{block:b,attempt,api,noteId,preview=false,onChange=()=>{}}) {
 let a=attempt&&sameQuestion(attempt.question_snapshot,b)?attempt:{version:attempt?.version||0,response_json:{},completed:false,is_correct:null};
 let pending=false,disposed=false,order=[...(a.response_json?.order||[])],observer;
 const controls=root.querySelector('[data-practice-controls]');
 const read=()=>b.type==='multiple_choice'?{choice:controls.querySelector('input:checked')?.value}:b.type==='sentence_reorder'?{order:[...order]}:{text:controls.querySelector('textarea')?.value||''};
 const dirty=()=>!preview&&(pending||JSON.stringify(read())!==JSON.stringify(b.type==='multiple_choice'?{choice:a.response_json?.choice===undefined?undefined:String(a.response_json.choice)}:b.type==='sentence_reorder'?{order:a.response_json?.order||[]}:{text:a.response_json?.text||''}));
 function render(){
  const self=['self_check','remember_review'].includes(b.type);
  const input=self?'':b.type==='multiple_choice'?`<fieldset class="ln-choice-list"><legend>Choose an answer · 答えを選ぶ</legend>${(b.choices||[]).map((choice,i)=>`<label><input type="radio" name="choice-${e(b.id)}" value="${i}" ${Number(a.response_json?.choice)===i?'checked':''}><span><b>${String.fromCharCode(65+i)}.</b> ${e(choice)}</span></label>`).join('')}</fieldset>`:b.type==='sentence_reorder'?`<p class="ln-status">Tap the words in order. · 語句を順番にタップしてください。</p><div class="ln-word-bank">${(b.items||[]).map((word,i)=>button(e(word),`data-word="${i}" ${order.includes(i)?'disabled':''}`)).join('')}</div><output class="ln-order-answer" aria-live="polite">${e(order.map(i=>b.items[i]).join(' '))||'…'}</output>${button('Undo last word · ひとつ戻す','data-undo-word')}`:`<label>Your answer · あなたの答え<textarea maxlength="6000" rows="3">${e(a.response_json?.text||'')}</textarea></label>`;
  const outcome=a.self_check_status==='review'?'↻ More review planned · もう一度復習します':a.is_correct===true?'✓ Correct · 正解です':a.is_correct===false?'↻ This does not match the model yet. Other natural answers may be possible. · 回答例とは一致していません。別の自然な答えもあり得ます。':a.answered_at?'✓ Answer saved · 回答を保存しました':'';
  const key=[b.answerKey||b.answer||'',...(b.acceptedAnswers||[])].filter(Boolean).join('\n');
  controls.innerHTML=`${preview?'<p class="ln-status">Preview practice · プレビューの回答は保存されません。</p>':''}${input}<div class="ln-actions">${self?button('I understand · 理解できた','data-self="understood"')+button('More review · もう一度復習','data-self="review"'):button('Check & save answer · 回答を確認・保存','data-practice-action="answer"')}${button('Reveal model · 回答例を見る','data-practice-action="reveal"')}${a.answered_at||a.answer_revealed?button(a.completed?'✓ Completed · 完了':'Mark complete · 完了にする',`data-practice-action="complete" ${a.completed?'disabled':''}`)+button('Try again · やり直す','data-practice-action="retry"'):''}</div><p class="ln-practice-outcome" role="status">${outcome}</p>${a.answer_revealed?`<div class="ln-practice-model"><strong>Model & explanation · 回答例と解説</strong><p>${e(key||'Check your expression with your teacher. · 先生と表現を確認しましょう。')}</p><p>${e(b.explanation||'')}</p>${button('Hide model · 回答例を閉じる','data-hide-model')}</div>`:''}`;
  controls.querySelectorAll('[data-practice-action]').forEach(btn=>btn.onclick=()=>void send(btn.dataset.practiceAction,btn.dataset.practiceAction==='answer'?read():{}));
  controls.querySelectorAll('[data-self]').forEach(btn=>btn.onclick=()=>void send('self_check',{state:btn.dataset.self}));
  controls.querySelector('[data-hide-model]')?.addEventListener('click',()=>{controls.querySelector('.ln-practice-model')?.remove();});
  controls.querySelectorAll('[data-word]').forEach(btn=>btn.onclick=()=>{order.push(Number(btn.dataset.word));updateOrder();});
  controls.querySelector('[data-undo-word]')?.addEventListener('click',()=>{order.pop();updateOrder();});
 }
 function updateOrder(){controls.querySelector('output').textContent=order.map(i=>b.items[i]).join(' ')||'…';controls.querySelectorAll('[data-word]').forEach(btn=>btn.disabled=order.includes(Number(btn.dataset.word)));}
 async function send(action,response={}) {
  if(pending||disposed)return;const draft=read(),keepDraft=dirty()&&['reveal','complete'].includes(action);pending=true;
  controls.querySelectorAll('button,input,textarea').forEach(c=>c.disabled=true);const status=controls.querySelector('[role=status]');status.textContent='Saving… · 保存中…';
  try{
   if(preview){a={...a,opened_at:new Date().toISOString()};if(action==='answer'){a.response_json=b.type==='multiple_choice'?{choice:Number(response.choice),text:b.choices?.[response.choice]}:b.type==='sentence_reorder'?{order:response.order,text:response.order.map(i=>b.items[i]).join(' ')}:response;a.answered_at=new Date().toISOString();a.completed=true;}if(action==='reveal')a.answer_revealed=true;if(action==='complete')a.completed=true;if(action==='retry'){a={version:0,response_json:{}};order=[];}if(action==='self_check'){a.self_check_status=response.state;a.completed=response.state==='understood';a.answered_at=new Date().toISOString();}}
   else a=await api.practice(noteId,b.id,b,action,response,a.version||0);
   if(disposed)return;if(action==='retry')order=[];
   if(preview)a={...a,question_id:questionId(b),question_snapshot:b,updated_at:new Date().toISOString()};
   if(action!=='open'){render();if(keepDraft){const input=controls.querySelector('textarea');if(input)input.value=draft.text||'';if(b.type==='multiple_choice'&&draft.choice!==undefined){const choice=controls.querySelector(`input[value="${draft.choice}"]`);if(choice)choice.checked=true;}}}else status.textContent='';onChange(a);
  }catch(error){if(!disposed)status.textContent=noteError(error);}
  finally{pending=false;if(!disposed){controls.querySelectorAll('button,input,textarea').forEach(c=>c.disabled=false);if(b.type==='sentence_reorder')updateOrder();if(a.completed)controls.querySelector('[data-practice-action=complete]')?.setAttribute('disabled','');}}
 }
 render();
 if(!preview&&!a.opened_at){observer=new IntersectionObserver(entries=>{if(entries.some(v=>v.isIntersecting)){observer.disconnect();void send('open');}},{threshold:.2});observer.observe(root);}
 return {dirty,dispose(){disposed=true;observer?.disconnect();}};
}
