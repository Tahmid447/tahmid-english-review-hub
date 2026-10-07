import {escapeHTML as e} from './store.js';
import {fetchPracticedCurriculum} from './curriculum-api.js';
import {PRACTICE_CATEGORIES,PRACTICE_RATINGS,practicedRows,filterPractice,curriculumItemHref} from './practice-collection-model.js';
import {curriculumVisualMarkup} from './curriculum-visuals.js';
import {curriculumAudioSamples} from './curriculum-audio.js';
import {speakText} from './audio.js';

const contentOf=item=>{try{const c=typeof item.content==='string'?JSON.parse(item.content):item.content;return c&&typeof c==='object'&&!Array.isArray(c)?c:{};}catch{return {};}};
const fields={
  words:[['Kana guide · カナ目安','kanaReading'],['Pronunciation · 発音','pronunciationHint'],['Example · 例文','exampleSentence','exampleJapanese'],['Watch out · よくある間違い','commonMistake']],
  phrases:[['Situation · 場面','situation'],['Natural usage · 自然な使い方','naturalUsage'],['Mini dialogue · ミニ会話','exampleDialogue'],['Watch out · よくある間違い','commonMistake']],
  phonics:[['Target sound · 音','sound'],['Examples · 音の例','examples'],['Japanese guide · 日本語ガイド','japaneseHint'],['Mouth & voice · 口と声','mouthTip'],['Compare · 比較','contrastPairs'],['Practice words · 練習語','practiceWords'],['Practice sentence · 練習文','practiceSentence']],
};
const date=value=>value&&Number.isFinite(Date.parse(value))?new Date(value).toLocaleDateString():'';
const due=row=>row.next_review_at&&Date.parse(row.next_review_at)<=Date.now();
export function practiceCardMarkup(row) {
  const item=row.item,c=contentOf(item),samples=curriculumAudioSamples(item.category,item);
  const details=(fields[item.category]||[]).map(([label,...keys])=>{
    const values=keys.flatMap(key=>Array.isArray(c[key])?c[key].map(v=>Array.isArray(v)?v.join(' · '):v):[c[key]]).filter(v=>typeof v==='string'&&v.trim());
    return values.length?`<dt>${e(label)}</dt>${values.map(v=>`<dd>${e(v)}</dd>`).join('')}`:'';
  }).join('');
  return `<article class="practice-card" data-practice-id="${e(item.id)}" data-rating="${e(row.self_rating||'')}"><figure>${curriculumVisualMarkup(item,item.category)}</figure><div class="practice-card-content"><div class="practice-card-meta"><span>${e(PRACTICE_CATEGORIES[item.category])} · Level ${Number(item.level)}</span><span>${e(PRACTICE_RATINGS[row.self_rating]||'Practiced · 練習済み')}</span></div><h3>${e(c.word||c.phrase||c.phonicsTarget||item.title_en)}</h3><p lang="ja">${e(c.japanese||c.japaneseHint||item.title_ja||'')}</p>${details?`<details><summary>Examples & tips · 例文とヒント</summary><dl>${details}</dl></details>`:''}${samples.length?`<label class="practice-audio-select">Listen to · 再生する内容<select aria-label="Listen to · 再生する内容">${samples.map(s=>`<option value="${e(s.value)}">${e(s.labelEn)} · ${e(s.labelJa)}</option>`).join('')}</select></label><div class="personal-card-actions"><button type="button" class="secondary-btn" data-practice-voice="us">▶ US · Ava</button><button type="button" class="secondary-btn" data-practice-voice="gb">▶ UK · Libby</button></div>`:''}<p class="practice-card-date">${date(row.last_reviewed_at)?`Last practiced · 最終練習 ${e(date(row.last_reviewed_at))}`:''}${due(row)?'<strong>Due now · 復習のタイミング</strong>':''}</p><a class="secondary-btn practice-item-link" href="${e(curriculumItemHref(item))}">Open & practice · 開いて練習 →</a><p role="status" class="practice-audio-status"></p></div></article>`;
}
export function mountPracticeCollection(host,{allowedCategories=Object.keys(PRACTICE_CATEGORIES),load=fetchPracticedCurriculum}={}) {
  let rows=[],loaded=false,disposed=false,request=0,limit=24;
  const filters={category:'all',rating:'all',level:'all',search:''};
  host.innerHTML=`<div class="practice-collection-heading"><div><p class="eyebrow">MY PRACTICE · 学習コレクション</p><h2>The English you've practiced.</h2></div><button type="button" class="quiet-btn" data-refresh-practice title="Refresh collection · 更新" aria-label="Refresh collection · 更新">↻</button></div><div class="catalogue-filters"><label>Search · 検索<input type="search" data-practice-search placeholder="English or Japanese · 英語・日本語"></label><label>Category · 種類<select data-practice-category><option value="all">All · すべて</option>${allowedCategories.map(c=>`<option value="${e(c)}">${e(PRACTICE_CATEGORIES[c])}</option>`).join('')}</select></label><label>Level · レベル<select data-practice-level><option value="all">All levels · 全レベル</option></select></label><label class="practice-due-control"><input type="checkbox" data-practice-due>Due now · 復習時期</label></div><div class="practice-rating-filters" role="group" aria-label="Practice ratings · 自己評価">${Object.entries({all:'All practiced · 練習したすべて',...PRACTICE_RATINGS}).map(([key,label])=>`<button type="button" data-practice-rating="${key}" aria-pressed="${key==='all'}">${e(label)} <span data-rating-count="${key}">0</span></button>`).join('')}</div><p role="status" data-practice-status></p><div class="practice-collection-grid"></div><button type="button" class="secondary-btn" data-practice-more hidden>Show more · もっと見る</button>`;
  const find=s=>host.querySelector(s),list=find('.practice-collection-grid'),status=find('[data-practice-status]');
  const draw=()=>{
    const base=filterPractice(rows,{...filters,rating:'all'}).filter(row=>!find('[data-practice-due]').checked||due(row));
    host.querySelectorAll('[data-practice-rating]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.practiceRating===filters.rating));
      button.querySelector('span').textContent=base.filter(row=>button.dataset.practiceRating==='all'||row.self_rating===button.dataset.practiceRating).length;
    });
    const selected=base.filter(row=>filters.rating==='all'||row.self_rating===filters.rating);
    status.textContent=`${selected.length} practiced items · 練習した項目`;
    list.innerHTML=selected.slice(0,limit).map(practiceCardMarkup).join('')||`<div class="practice-collection-empty"><h3>${rows.length?'No matching practice yet. · 該当する項目はありません。':'Your practice starts here. · ここから学習を始めよう。'}</h3><a href="/learn">Open library · 教材ライブラリ →</a></div>`;
    find('[data-practice-more]').hidden=selected.length<=limit;
    list.querySelectorAll('[data-practice-voice]').forEach(button=>button.onclick=async()=>{
      const card=button.closest('[data-practice-id]'),row=selected.find(r=>r.item_id===card.dataset.practiceId),output=card.querySelector('[role=status]');
      const sample=curriculumAudioSamples(row.item.category,row.item).find(s=>s.value===card.querySelector('select').value);
      button.disabled=true;
      try{await speakText(sample.text,{voice:button.dataset.practiceVoice,onStatus:s=>{output.textContent=`${s.messageEn} · ${s.messageJa}`;}});}
      catch{output.textContent='Could not play. Please try again. · 再生できませんでした。';}
      finally{button.disabled=false;}
    });
  };
  const refresh=async()=>{
    const token=++request;status.textContent='Loading your practice… · 学習記録を読み込み中…';
    host.setAttribute('aria-busy','true');
    try{
      const result=await load();if(disposed||token!==request)return;if(result.error||result.reason)throw result.error||Error(result.reason);
      rows=practicedRows(result.data||[],allowedCategories);loaded=true;limit=24;
      const levels=[...new Set(rows.map(r=>Number(r.item.level)))].sort((a,b)=>a-b);
      find('[data-practice-level]').innerHTML='<option value="all">All levels · 全レベル</option>'+levels.map(l=>`<option value="${l}">Level ${l}</option>`).join('');
      if(filters.level!=='all'&&!levels.includes(Number(filters.level)))filters.level='all';
      find('[data-practice-level]').value=filters.level;draw();
    }catch{if(!disposed&&token===request){status.innerHTML='Could not load your practice. · 学習記録を読み込めませんでした。 <button type="button" class="quiet-btn" data-practice-retry>Retry · 再試行</button>';find('[data-practice-retry]').onclick=refresh;}}
    finally{if(token===request)host.removeAttribute('aria-busy');}
  };
  const change=()=>{limit=24;if(loaded)draw();};
  find('[data-practice-search]').oninput=event=>{filters.search=event.target.value;change();};
  find('[data-practice-category]').onchange=event=>{filters.category=event.target.value;change();};
  find('[data-practice-level]').onchange=event=>{filters.level=event.target.value;change();};
  find('[data-practice-due]').onchange=change;
  host.querySelectorAll('[data-practice-rating]').forEach(button=>button.onclick=()=>{filters.rating=button.dataset.practiceRating;change();});
  find('[data-practice-more]').onclick=()=>{limit+=24;draw();};
  find('[data-refresh-practice]').onclick=refresh;
  void refresh();return {refresh,dispose:()=>{disposed=true;request++;}};
}
