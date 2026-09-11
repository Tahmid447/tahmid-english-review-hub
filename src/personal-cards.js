import { escapeHTML as e } from './store.js?v=20260911-mobile1';
import { speakText } from './audio.js?v=20260911-mobile1';
export const PERSONAL_CATEGORIES = Object.freeze({ words:'Words · 単語', phrases:'Phrases · フレーズ', sentences:'Sentences · 文章', notes:'Notes · メモ' });
export function personalCardMarkup(card, {saved=false, controls=true}={}) {
  return `<article class="personal-card" data-card-id="${e(card.id)}"><p class="eyebrow">FOR YOU · ${e(PERSONAL_CATEGORIES[card.category] || '')}</p><h3>${e(card.text_en || card.text_ja)}</h3>${card.text_en && card.text_ja ? `<p lang="ja">${e(card.text_ja)}</p>` : ''}${card.teacher_note ? `<p class="personal-teacher-note">${e(card.teacher_note)}</p>` : ''}<div class="personal-card-actions">${card.audio_enabled && card.text_en ? `<button type="button" class="secondary-btn" data-personal-voice="us">▶ US · Ava</button><button type="button" class="secondary-btn" data-personal-voice="gb">▶ UK · Libby</button>` : ''}${controls ? `<button type="button" class="quiet-btn personal-save" aria-pressed="${saved}">${saved?'♥ Saved · 保存済み':'♡ Save · お気に入り'}</button>` : ''}</div><p class="personal-card-status" role="status"></p></article>`;
}
export function bindPersonalAudio(root, cards) {
  root.querySelectorAll('[data-personal-voice]').forEach(button => button.addEventListener('click', async () => {
    const article = button.closest('[data-card-id]');
    const card = cards.find(row => row.id === article.dataset.cardId);
    if (!card?.audio_enabled || !card.text_en) return;
    const status = article.querySelector('[role=status]');
    status.textContent = 'Preparing voice… · 音声を準備中…';
    const result = await speakText(card.text_en, { voice:button.dataset.personalVoice, language:"en",
      onStatus: event => { status.textContent = `${event.messageEn} · ${event.messageJa}`; } });
    if (result?.cancelled) status.textContent = 'Stopped. · 再生を停止しました。';
  }));
}
export function mountPersonalCardStudio(root, { client, teacherId, studentId }) {
  let editing = null;
  root.classList.add('personal-card-studio');
  root.innerHTML = `<h3>Personal practice cards · 個別の復習カード</h3><p>この生徒だけに、今日覚えたい英語とメモを届けます。音声ボタンは必要なカードだけに付けられます。</p><form class="personal-card-form"><label>Category · 種類<select name="category">${Object.entries(PERSONAL_CATEGORIES).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label>English · 英語<textarea name="text_en" maxlength="2000" rows="3" placeholder="A word, phrase or sentence…"></textarea></label><label>Japanese · 日本語<textarea name="text_ja" maxlength="2000" rows="2"></textarea></label><label>Teacher's note · 先生のメモ<textarea name="teacher_note" maxlength="2000" rows="2"></textarea></label><label class="settings-check"><input name="audio_enabled" type="checkbox"><span>Add US Ava & UK Libby playback · US Ava・UK Libbyの再生を付ける</span></label><div class="personal-card-actions"><button type="submit" class="primary-btn">Send to this learner · この生徒に届ける</button><button type="button" class="quiet-btn" data-cancel-edit hidden>Cancel edit · 編集をやめる</button></div><p role="status" data-studio-status></p></form><div class="personal-studio-list"></div>`;
  const form = root.querySelector('form'); const output = root.querySelector('[data-studio-status]'); const list = root.querySelector('.personal-studio-list');
  const cancel = root.querySelector('[data-cancel-edit]');
  const reset = () => { editing=null; form.reset(); cancel.hidden=true; form.querySelector('[type=submit]').textContent='Send to this learner · この生徒に届ける'; };
  cancel.onclick = reset;
  const reload = async () => {
    const {data,error}=await client.from('review_personal_cards').select('*').eq('student_id',studentId).eq('teacher_id',teacherId).order('created_at',{ascending:false});
    if (!root.isConnected) return;
    if(error) { output.textContent='Could not load cards. · カードを読み込めませんでした。'; return; }
    list.innerHTML=(data || []).map(card=>`<div class="personal-studio-entry">${personalCardMarkup(card,{controls:false})}<div class="personal-card-actions"><button class="quiet-btn" type="button" data-edit="${e(card.id)}">Edit · 編集</button><button class="quiet-btn" type="button" data-active="${e(card.id)}">${card.active?'Hide from learner · 生徒画面で非表示':'Show again · 再表示'}</button></div><small>${card.active?'Visible to this learner · この生徒に表示中':'Hidden · 非表示'}</small></div>`).join('') || '<p>Cards you send will appear here. · 送ったカードがここに並びます。</p>';
    bindPersonalAudio(list,data || []);
    list.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>{
      const card=data.find(row=>row.id===button.dataset.edit); editing=card.id;
      for(const key of ['category','text_en','text_ja','teacher_note']) form.elements[key].value=card[key];
      form.elements.audio_enabled.checked=card.audio_enabled; cancel.hidden=false;
      form.querySelector('[type=submit]').textContent='Save changes · 変更を保存'; form.elements.text_en.focus();
    });
    list.querySelectorAll('[data-active]').forEach(button=>button.onclick=async()=>{
      const card=data.find(row=>row.id===button.dataset.active); button.disabled=true;
      const result=await client.from('review_personal_cards').update({active:!card.active}).eq('id',card.id).eq('teacher_id',teacherId).eq('student_id',studentId).select('id').single();
      output.textContent=result.error?'Could not save. · 保存できませんでした。':'Visibility saved. · 表示設定を保存しました。';
      await reload();
    });
  };
  form.onsubmit=async event=>{
    event.preventDefault();
    const payload=Object.fromEntries(['category','text_en','text_ja','teacher_note'].map(key=>[key,form.elements[key].value.trim()])); payload.audio_enabled=form.elements.audio_enabled.checked;
    if(!payload.text_en && !payload.text_ja) { output.textContent='Enter English or Japanese. · 英語または日本語を入力してください。'; return; }
    if(payload.audio_enabled && !payload.text_en) { output.textContent='English text is needed for playback. · 再生には英語の入力が必要です。'; return; }
    const submit=form.querySelector('[type=submit]');submit.disabled=true;
    try {
      const query=editing ? client.from('review_personal_cards').update(payload).eq('id',editing).eq('teacher_id',teacherId).eq('student_id',studentId) : client.from('review_personal_cards').insert({...payload,teacher_id:teacherId,student_id:studentId});
      const {error}=await query.select('id').single(); if(error)throw error;
      reset();output.textContent='Saved to this learner’s My Page. · この生徒のマイページに保存しました。';await reload();
    } catch { output.textContent='Could not save. Your text is still here; please try again. · 保存できませんでした。入力内容は残っています。もう一度お試しください。'; }
    finally { submit.disabled=false; }
  };
  void reload();
}
