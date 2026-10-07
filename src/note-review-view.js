import {escapeHTML as e} from './store.js?v=20260911-mobile2';
import {isLearningPoint,pointReview,reviewSummary,pointTitle} from './note-review-model.js';
import {noteError} from './lesson-note-api.js?v=20260915-practice';
import {noteHref} from './learning-overview.js';

const stamp=value=>value?new Date(value).toLocaleString():'';
const stateLabel=state=>state==='understood'?'Got it · 分かった':state==='revisit'?'Review again · もう一度':'Not checked yet · 未確認';
export function teacherPointMarkup(note,reviews=[]) {
 const points=note.content_json.blocks.filter(isLearningPoint),summary=reviewSummary(points,reviews);
 return `<section class="ln-point-report"><h3>Learning point check-ins · ポイント別の確認</h3><p>${summary.understood} / ${summary.total} Got it · ${summary.revisit} Review again</p><p class="ln-status">Student confidence, separate from practice results. · 生徒の自己申告です。練習の結果とは別です。</p><ul>${points.map(b=>{const r=pointReview(b,reviews),old=reviews.find(v=>v.block_id===b.id);return `<li><div><strong>${e(pointTitle(b))}</strong><small>${r?e(stamp(r.updated_at)):old?'Updated content · 教材が更新されています':''}</small></div><span class="ln-point-state ${e(r?.state||'')}">${stateLabel(r?.state)}</span></li>`;}).join('')||'<li>No learning points yet. · まだ学習ポイントはありません。</li>'}</ul></section>`;
}

export function mountPointReviews(root,{note,reviews=[],api,student,focus,onChange=()=>{}}) {
 const points=[...root.querySelectorAll('article[data-block-id]')].map(el=>note.content_json.blocks.find(b=>b.id===el.dataset.blockId)).filter(b=>b&&isLearningPoint(b));
 if(!points.length)return {dirty:()=>false,dispose(){}};
 let disposed=false,pending=0;
 const rows=[...reviews],panel=document.createElement('section');panel.className='ln-review-steps';panel.setAttribute('aria-label','Learning point progress · ポイント別の進捗');
 root.querySelector('.ln-focus').after(panel);
 const drawSummary=()=>{
  const s=reviewSummary(points,rows);
  panel.innerHTML=`<div><span class="ln-micro">ONE POINT AT A TIME · ひとつずつ</span><h2>${s.understood===s.total?'Look how far you’ve come.':'A little progress, right here.'}</h2><p><strong>${s.understood} / ${s.total}</strong> Got it · 分かった <span>${s.revisit} Review again · 要復習</span></p></div><progress max="${s.total}" value="${s.understood}" aria-label="Learning points marked Got it"></progress>${s.next?`<button type="button" class="ln-button" data-next-point>${s.next&&pointReview(s.next,rows)?.state==='revisit'?'Revisit a point · もう一度確認':'Continue · 次のポイント'} →</button>`:'<a class="ln-button" href="#lesson-practice-start">Try Quick Practice · 練習してみる →</a>'}`;
  panel.querySelector('[data-next-point]')?.addEventListener('click',()=>focus(`#block-${s.next.id}`));
  const practiceLink=panel.querySelector('a');if(practiceLink){const first=note.content_json.blocks.find(b=>['quick_practice','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review'].includes(b.type));practiceLink.hidden=!first;practiceLink.onclick=event=>{event.preventDefault();if(first)focus(`#block-${first.id}`);};}
  onChange(s);
 };
 for(const b of points){
  const article=[...root.querySelectorAll('article[data-block-id]')].find(el=>el.dataset.blockId===b.id),host=document.createElement('div');host.className='ln-point-review';
  host.innerHTML=`<span class="ln-micro">YOUR CHECK-IN · 理解の確認</span><div class="ln-point-choices" role="group" aria-label="Your understanding of ${e(pointTitle(b).slice(0,100))}"><button type="button" class="ln-button" data-point-state="understood">✓ Got it <small>分かった</small></button><button type="button" class="ln-button" data-point-state="revisit">↻ Review again <small>もう一度</small></button></div><div class="ln-point-meta"><button type="button" class="ln-point-reset" data-point-reset>Undo · 取り消す</button><button type="button" class="ln-point-next" data-point-next>Next point · 次へ →</button></div><p class="ln-status" role="status" aria-live="polite"></p>`;
  article.append(host);
  const buttons=[...host.querySelectorAll('[data-point-state]')],status=host.querySelector('[role=status]');
  const draw=()=>{const current=pointReview(b,rows);article.dataset.understanding=current?.state||'unmarked';for(const button of buttons){button.setAttribute('aria-pressed',String(current?.state===button.dataset.pointState));button.disabled=!student;}host.querySelector('[data-point-reset]').hidden=!student||!current||current.state==='unmarked';if(!student)status.textContent='Student check-in preview · 生徒の確認状態';};
  const save=async state=>{
   if(!student||disposed||host.dataset.saving)return;host.dataset.saving='true';pending++;buttons.forEach(b=>b.disabled=true);host.querySelector('[data-point-reset]').disabled=true;status.textContent='Saving… · 保存中…';
   try{const previous=rows.find(r=>r.block_id===b.id);const saved=await api.reviewPoint(note.id,b,state,previous?.version||0);if(disposed)return;const index=rows.findIndex(r=>r.block_id===b.id);if(index<0)rows.push(saved);else rows[index]=saved;draw();drawSummary();status.textContent=state==='unmarked'?'Check-in cleared · 取り消しました':'Saved · 保存しました';}
   catch(error){if(!disposed)status.textContent=noteError(error);}
   finally{pending--;if(!disposed){delete host.dataset.saving;host.querySelector('[data-point-reset]').disabled=false;draw();}}
  };
  buttons.forEach(button=>button.onclick=()=>void save(button.dataset.pointState));host.querySelector('[data-point-reset]').onclick=()=>void save('unmarked');
  const next=points[points.indexOf(b)+1];host.querySelector('[data-point-next]').hidden=!next;host.querySelector('[data-point-next]').onclick=()=>next&&focus(`#block-${next.id}`);draw();
 }
 drawSummary();return {dirty:()=>pending>0,dispose(){disposed=true;}};
}

export function journeyMarkup(data,{teacher=false,name=id=>id}={}) {
 const t=data.totals,days=data.days||[],max=Math.max(1,...days.map(d=>Number(d.points)+Number(d.practice)));
 const activeDays=days.filter(d=>Number(d.points)+Number(d.practice)>0).length;
 const note=data.notes?.find(n=>n.next_revisit)||data.notes?.find(n=>n.next_point)||data.notes?.find(n=>n.next_practice);
 const metrics=[['Opened · 開いたノート',t.opened,t.lessons],['Got it · 分かったポイント',t.understood,t.learning_total],['Practice done · 練習完了',t.practice_completed,t.practice_total],['Review again · 要復習',t.revisit,null]];
 return `<div class="ln-journey-heading"><div><span class="ln-micro">LESSON NOTE JOURNEY · ノートの学習記録</span><h2>${teacher?'Small steps, made visible.':'Your English is taking shape.'}</h2></div><span>${activeDays} / 7 active days · 学習した日</span></div><dl class="ln-journey-metrics">${metrics.map(([label,value,total])=>`<div><dt>${label}</dt><dd>${e(value)}${total!==null?`<small> / ${e(total)}</small>`:''}</dd></div>`).join('')}</dl><div class="ln-journey-detail"><figure class="ln-week-chart"><figcaption>Last 7 days · 最近7日間 <small>${e(data.timezone)}</small></figcaption><div class="ln-week-bars">${days.map(d=>`<div><div class="ln-day-bar" role="img" aria-label="${e(d.day)}: ${d.points} learning points, ${d.practice} practice questions"><span class="ln-day-points" style="height:${100*Number(d.points)/max}%"></span><span class="ln-day-practice" style="height:${100*Number(d.practice)/max}%"></span></div><strong>${Number(d.points)+Number(d.practice)}</strong><time datetime="${e(d.day)}">${e(d.day.slice(5).replace('-','/'))}</time></div>`).join('')}</div><p class="ln-chart-key"><span>Learning points · ポイント</span><span>Practice interactions · 練習</span></p></figure><div class="ln-journey-next">${!teacher&&note?`<span class="ln-micro">YOUR NEXT SMALL STEP · 次の一歩</span><h3>${e(note.title)}</h3><p>${note.next_revisit?'A point you wanted to revisit. · もう一度確認したいポイント':note.next_point?'One learning point is a good start. · ひとつのポイントから始めよう':'Put it into practice. · 練習で使ってみよう'}</p><a class="ln-button" href="${e(noteHref(note.id,note.next_revisit||note.next_point||note.next_practice))}">${note.next_revisit?'Review again · 復習する':'Continue · 続きから'} →</a>`:`<h3>${teacher?'A clearer picture of learning.':'Every small step counts.'}</h3><p>${t.lessons?'Got it records confidence. Practice results show how it went. · 「分かった」は自己申告、練習結果は別に記録します。':'Your published Lesson Notes will appear here. · 公開されたノートの学習記録がここに届きます。'}</p>`}<p class="ln-journey-caption">${t.practice_checked?`${t.practice_correct} / ${t.practice_checked} latest checked answers correct · 最新の採点結果`:'No checked answers yet · 採点済みの回答はまだありません'}</p></div></div><p class="ln-journey-caption">Opening a note does not mark it understood. The chart counts each point or practice question once per day; retries also count as practice. · 開いただけでは理解済みになりません。同じ項目は1日1回で集計します。</p>${teacher?`<div class="ln-learner-journeys">${(data.learners||[]).map(l=>`<article><div><h3>${e(name(l.student_id))}</h3><p>${l.understood} / ${l.learning_total} Got it · ${l.revisit} Review again</p><progress max="${Math.max(1,l.learning_total)}" value="${l.understood}" aria-label="Learning points understood"></progress><small>${l.practice_completed} / ${l.practice_total} practice done · ${l.last_active_at?e(stamp(l.last_active_at)):'No recorded review yet · まだ確認の記録はありません'}</small></div><a class="ln-button" href="/teacher?studio=notes&student=${e(l.student_id)}">Lesson Notes →</a></article>`).join('')}</div>`:''}`;
}

export function mountJourney(host,{api,teacher=false,profiles=[],name=id=>id}={}) {
 let disposed=false,request=0;
 host.classList.add('ln-journey');host.innerHTML=`<div class="ln-journey-toolbar">${teacher?`<label class="ln-journey-filter">Learner · 生徒<select><option value="">All learners · 全員</option>${profiles.map(p=>`<option value="${e(p.user_id)}">${e(name(p.user_id))}</option>`).join('')}</select></label>`:''}<button type="button" class="ln-button" data-refresh-journey title="Refresh learning progress · 学習記録を更新" aria-label="Refresh learning progress · 学習記録を更新">↻</button></div><div data-journey-content></div>`;
 const content=host.querySelector('[data-journey-content]');
 const load=async()=>{const token=++request;content.innerHTML='<p role="status">Loading learning journey… · 学習記録を読み込み中…</p>';
  try{const data=await api.journey({teacher,studentId:host.querySelector('select')?.value||null});if(!disposed&&token===request)content.innerHTML=journeyMarkup(data,{teacher,name});}
  catch(error){if(disposed||token!==request)return;content.innerHTML=`<p role="status">${e(noteError(error))}</p><button type="button" class="ln-button">Retry · 再試行</button>`;content.querySelector('button').onclick=()=>void load();}
 };
 host.querySelector('select')?.addEventListener('change',()=>void load());host.querySelector('[data-refresh-journey]').onclick=()=>void load();void load();return {refresh:load,dispose(){disposed=true;request++;}};
}
