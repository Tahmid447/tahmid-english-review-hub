import { planFor } from './plans.js?v=20260911-mobile2';
import { getStudentClient, getStudentProfile, getStudentMembership, saveUserSettings } from './supabase.js?v=20260911-mobile2';
import { initialiseMemberPreferences } from './member-preferences.js?v=20260911-mobile2';
import { getSettings, updateSettings, onSettingsChange, escapeHTML as e } from './store.js?v=20260911-mobile2';
import { loadStudentAccess, applyStudentFeatureVisibility, featureAllowed } from './student-visibility.js?v=20260911-mobile2';
import { fetchStudentAnnouncements, toggleCurriculumFavorite } from './curriculum-api.js?v=20260911-mobile2';
import { AVATAR_BUCKET, avatarPath, avatarReference, compactAvatar, displayProfileAvatar } from './profile-api.js?v=20260911-mobile2';
import { personalCardMarkup, bindPersonalAudio } from './personal-cards.js?v=20260911-mobile2';
import { buildPhraseCatalog } from './data.js?v=20260911-mobile2';
import './study-music.js?v=20260911-mobile2';
const $ = selector => document.querySelector(selector);
const client = getStudentClient();
let session, profile, access;
let favoriteCategory = 'words';
let favoriteRows = [], personalCards = [], personalSaved = new Set();
let favoriteLoad, phraseLoad, favoriteGeneration = 0;
const categoryLabels = {words:'Words · 単語',phrases:'Phrases · フレーズ',phonics:'Phonics · フォニックス',lessons:'Lessons · レッスン',questions:'Questions · 問題',phrasebook:'Lesson phrasebook · レッスン単語帳',sentences:'Sentences · 文章',notes:'Notes · メモ'};
const toText = value => typeof value === 'string' ? value : value?.en || value?.jp || value?.ja || '';
const empty = '<div class="member-empty"><h3>Your next discovery belongs here.<br>気になる英語を見つけたら、♡を押してみましょう。</h3><p>保存した教材がここに並びます。</p><a href="/learn">Explore learning library · 教材を探す →</a></div>';
function renderPreferences() {
  const settings=getSettings();
  document.querySelectorAll('[data-preference]').forEach(control=>{
    if(control.type==='checkbox') control.checked=settings[control.dataset.preference]===true;
    else control.value=String(settings[control.dataset.preference]);
  });
}
document.querySelectorAll('[data-preference]').forEach(control=>control.onchange=async()=>{
  const settings=updateSettings({[control.dataset.preference]:control.type==='checkbox'?control.checked:control.value});
  $('#preferenceStatus').textContent='Saving… · 保存中…';
  const result=await saveUserSettings(settings,{expectedUserId:session?.user?.id});
  $('#preferenceStatus').textContent=result.saved?'Saved to your account. · アカウントに保存しました。':'Saved on this browser. Online sync will need another try. · このブラウザに保存しました。オンライン保存はもう一度お試しください。';
});
onSettingsChange(renderPreferences);renderPreferences();
function showPanel(key) {
  if (!document.querySelector(`[data-panel="${key}"]`) || document.querySelector(`[data-panel="${key}"]`).hidden) key='profile';
  document.querySelectorAll('[data-panel]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.panel===key)));
  document.querySelectorAll('.member-panel').forEach(panel=>panel.hidden=panel.id!==`panel-${key}`);
  history.replaceState(null,'',`#${key}`);
  if(key==='favorites') void renderFavorites();
}
document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>showPanel(button.dataset.panel));
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{
  favoriteCategory=button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  void renderFavorites();
});
async function loadFavorites() {
  const results=await Promise.all([
    client.from('review_curriculum_favorites').select('item_id,created_at,item:review_curriculum_items(id,category,level,title_en,title_ja)').eq('student_id',session.user.id).order('created_at',{ascending:false}),
    client.from('review_saved_learning').select('lesson_id,question_key,created_at,lesson:review_lessons(id,slug,title_en,title_ja)').eq('user_id',session.user.id).order('created_at',{ascending:false}),
  ]);
  if(results.some(result=>result.error))throw new Error('Favorites could not be loaded. Please try again. · お気に入りを読み込めませんでした。もう一度お試しください。');
  favoriteRows=results[0].data.map(row=>({source:'curriculum',key:row.item_id,category:row.item?.category || 'words',title:row.item?.title_en || 'Unavailable item · 現在利用できない教材',subtitle:row.item?.title_ja || '',href:row.item?`/learn?category=${row.item.category}&level=${row.item.level}&item=${encodeURIComponent(row.item_id)}`:'',...row}));
  const savedLessons=results[1].data;
  const questionKeys=savedLessons.filter(row=>row.question_key).map(row=>row.question_key);
  let questions=[];
  if(questionKeys.length) {
    for(let i=0;i<questionKeys.length;i+=100) {
      const result=await client.from('review_questions').select('id,stable_key,lesson_id,payload').in('stable_key',questionKeys.slice(i,i+100));
      if(result.error)throw result.error; questions.push(...result.data);
    }
  }
  favoriteRows.push(...savedLessons.map(row=>{
    const question=questions.find(q=>q.lesson_id===row.lesson_id && (q.stable_key===row.question_key || q.id===row.question_key));
    const available=row.lesson && (!row.question_key || question);
    return {source:'lesson',key:`${row.lesson_id}:${row.question_key}`,category:row.question_key?'questions':'lessons',title:row.question_key ? toText(question?.payload?.prompt) || toText(question?.payload?.question) || (question?'Saved question · 保存した問題':'Unavailable question · 現在利用できない問題') : row.lesson?.title_en || 'Unavailable lesson · 現在利用できないレッスン',subtitle:row.lesson?.title_ja || row.lesson?.title_en || '',href:available?`/lesson/${encodeURIComponent(row.lesson.slug)}?practice=full&return=%2Fmy-page%23favorites${row.question_key?`&question=${encodeURIComponent(row.question_key)}`:''}`:'',...row};
  }));
}
async function loadPhraseFavorites() {
  const result=await client.from('review_phrase_activity').select('phrase_id,lesson_id,is_favorite').eq('user_id',session.user.id).eq('is_favorite',true);
  if(result.error)throw result.error;
  if(!result.data?.length)return [];
  // Only material requested in the phrasebook tab needs its phrase payload.
  const catalog=await buildPhraseCatalog({audience:'all'});
  return result.data.map(row=>{
    const phrase=catalog.find(item=>item.id===row.phrase_id);
    return {source:'phrasebook',key:row.phrase_id,category:'phrasebook',title:phrase?.en || 'Saved expression · 保存した表現',subtitle:phrase?.jp || '',href:phrase?`/phrases?search=${encodeURIComponent(phrase.en)}&kind=${encodeURIComponent(phrase.libraryKind)}&return=%2Fmy-page%23favorites`:'/phrases',...row};
  });
}
async function renderFavorites() {
  const generation=++favoriteGeneration;const status=$('#favoriteStatus');status.textContent='Loading your collection… · お気に入りを読み込み中…';
  try {
    favoriteLoad ||= loadFavorites().catch(error=>{favoriteLoad=null;throw error;});await favoriteLoad;
    const rows=favoriteCategory==='phrasebook'?await (phraseLoad ||= loadPhraseFavorites().catch(error=>{phraseLoad=null;throw error;})):favoriteRows.filter(row=>row.category===favoriteCategory);
    if(generation!==favoriteGeneration)return;
    const query=$('#favoriteSearch')?.value.trim().toLowerCase() || '';
    const filtered=rows.filter(row=>`${row.title} ${row.subtitle}`.toLowerCase().includes(query));
    const cards=personalCards.filter(card=>card.category===favoriteCategory && personalSaved.has(card.id) && `${card.text_en} ${card.text_ja} ${card.teacher_note}`.toLowerCase().includes(query));
    const list=$('#favoriteList');list.innerHTML=filtered.map(row=>`<article class="favorite-card"><p class="eyebrow">${e(categoryLabels[row.category])}</p><h3>${e(row.title)}</h3><p>${e(row.subtitle)}</p><div class="personal-card-actions">${row.href?`<a class="secondary-btn" href="${e(row.href)}">Review · 復習する →</a>`:''}<button type="button" class="quiet-btn" data-remove-key="${e(row.key)}" data-source="${row.source}">♥ Remove · 保存を解除</button></div></article>`).join('')+cards.map(card=>personalCardMarkup(card,{saved:true})).join('') || empty;
    list.querySelectorAll('[data-remove-key]').forEach(button=>button.onclick=async()=>{
      const row=filtered.find(item=>item.key===button.dataset.removeKey && item.source===button.dataset.source);button.disabled=true;
      try {
        let result;
        if(row.source==='curriculum') result=await toggleCurriculumFavorite(row.key,false);
        else if(row.source==='phrasebook') result=await client.from('review_phrase_activity').update({is_favorite:false}).eq('user_id',session.user.id).eq('phrase_id',row.key).select('id').single();
        else result=await client.from('review_saved_learning').delete().eq('user_id',session.user.id).eq('lesson_id',row.lesson_id).eq('question_key',row.question_key);
        if(result.error || result.reason)throw new Error('Save failed');
        if(row.source==='phrasebook')phraseLoad=null;else favoriteLoad=null;
        await renderFavorites();
      }catch {status.textContent='Could not update. Please try again. · 更新できませんでした。もう一度お試しください。';button.disabled=false;}
    });
    bindStudentPersonalCards(list,cards);status.textContent=`${filtered.length+cards.length} saved · 保存済み`;
  }catch(error){status.textContent=error.message || 'Please try again. · もう一度お試しください。';}
}
function bindStudentPersonalCards(root,cards) {
  bindPersonalAudio(root,cards);
  root.querySelectorAll('.personal-save').forEach(button=>button.onclick=async()=>{
    const id=button.closest('[data-card-id]').dataset.cardId; const favorite=!personalSaved.has(id);button.disabled=true;
    const result=await client.rpc('review_save_personal_card',{target_card:id,favorite});
    if(result.error){button.disabled=false;button.closest('article').querySelector('[role=status]').textContent='Could not save. · 保存できませんでした。';return;}
    if(favorite)personalSaved.add(id);else personalSaved.delete(id);
    renderPersonal();if(!$('#panel-favorites').hidden)void renderFavorites();
  });
}
function renderPersonal() {
  const query=$('#personalSearch').value.trim().toLowerCase();const category=$('#personalCategory').value;
  const cards=personalCards.filter(card=>(category==='all'||card.category===category) && `${card.text_en} ${card.text_ja} ${card.teacher_note}`.toLowerCase().includes(query));
  $('#personalList').innerHTML=cards.map(card=>personalCardMarkup(card,{saved:personalSaved.has(card.id)})).join('') || '<p class="member-empty">Cards from your teacher will appear here. · 先生から届いた復習カードがここに表示されます。</p>';
  bindStudentPersonalCards($('#personalList'),cards);
}
function renderProfile() {
  const name=profile.display_name || [profile.first_name,profile.last_name].filter(Boolean).join(' ') || 'Learner';
  $('#profileGreeting').textContent=name;
  const form=$('#profileForm');for(const key of ['first_name','last_name','learning_goal'])form.elements[key].value=profile[key] || '';
  $('#profileEmail').value=session.user.email || '';
  void displayProfileAvatar($('#profileAvatar'),profile,client);
}
$('#profileForm').onsubmit=async event=>{
  event.preventDefault();const form=event.currentTarget;const button=form.querySelector('[type=submit]');button.disabled=true;
  const values=Object.fromEntries(['first_name','last_name','learning_goal'].map(key=>[key,form.elements[key].value.trim()]));values.display_name=[values.first_name,values.last_name].filter(Boolean).join(' ');
  try {
    const {data,error}=await client.from('review_profiles').update(values).eq('user_id',session.user.id).select('*').single();if(error)throw error;
    profile=data;renderProfile();$('#profileSaveStatus').textContent='Profile saved. Your teacher can see the update. · 保存しました。担当の先生にも反映されます。';
  }catch{$('#profileSaveStatus').textContent='Could not save. Your changes are still here. · 保存できませんでした。入力内容は残っています。';}finally{button.disabled=false;}
};
async function saveAvatar(reference) {
  const {data,error}=await client.from('review_profiles').update({avatar_url:reference}).eq('user_id',session.user.id).select('*').single();if(error)throw error;profile=data;void displayProfileAvatar($('#profileAvatar'),profile,client);
}
$('#profilePhoto').onchange=async event=>{
  const file=event.target.files?.[0];if(!file)return;event.target.disabled=true;$('#removePhoto').disabled=true;$('#photoStatus').textContent='Preparing your photo… · 写真を準備しています…';
  try{
    const blob=await compactAvatar(file);const {error}=await client.storage.from(AVATAR_BUCKET).upload(avatarPath(session.user.id),blob,{upsert:true,contentType:blob.type,cacheControl:'0'});if(error)throw error;
    await saveAvatar(avatarReference(session.user.id));$('#photoStatus').textContent='Photo saved. · 写真を保存しました。';
    await client.storage.from(AVATAR_BUCKET).remove([`${session.user.id}/avatar.webp`]);
  }catch(error){$('#photoStatus').textContent=error.message || 'Could not save photo. · 写真を保存できませんでした。';}finally{event.target.disabled=false;$('#removePhoto').disabled=false;event.target.value='';}
};
$('#removePhoto').onclick=async()=>{
  $('#removePhoto').disabled=true;
  try{await saveAvatar(null);const {error}=await client.storage.from(AVATAR_BUCKET).remove([avatarPath(session.user.id),`${session.user.id}/avatar.webp`]);if(error)throw error;$('#photoStatus').textContent='Photo removed. · 写真を削除しました。';}
  catch{$('#photoStatus').textContent='Could not finish removing the photo. Please try again. · 写真の削除を完了できませんでした。もう一度お試しください。';}finally{$('#removePhoto').disabled=false;}
};
function renderAnnouncements(notices) {
  $('#noticeCount').textContent=notices.length || '';
  $('#announcementList').innerHTML=notices.map(notice=>`<button class="notice-preview" type="button" data-notice="${e(notice.id)}"><span class="eyebrow">${notice.audience==='targeted'?'JUST FOR YOU · あなた宛て':'CLUB NEWS · 全体のお知らせ'}</span><strong>${e(notice.title_ja || notice.title_en)}</strong><span>${e((notice.body_ja || notice.body_en || '').slice(0,95))}</span><small>${new Date(notice.starts_at).toLocaleDateString('ja-JP')} <b>Read more · 詳しく見る →</b></small></button>`).join('') || '<p class="member-empty">No new announcements. · 現在、新しいお知らせはありません。</p>';
  document.querySelectorAll('[data-notice]').forEach(button=>button.onclick=()=>{
    const notice=notices.find(item=>item.id===button.dataset.notice);const root=$('#noticeDetail');root.replaceChildren();
    for(const [tag,text] of [['h2',notice.title_ja],['h3',notice.title_en],['p',notice.body_ja],['p',notice.body_en]]){if(!text)continue;const node=document.createElement(tag);node.textContent=text;root.append(node);}
    $('#noticeDialog').showModal();
  });
}
$('#closeNotice').onclick=()=>$('#noticeDialog').close();
$('#favoriteSearch').oninput=()=>void renderFavorites();$('#personalSearch').oninput=renderPersonal;$('#personalCategory').onchange=renderPersonal;
try {
  session=await initialiseMemberPreferences();
  if(!session?.user){$('#signedOut').hidden=false;$('#memberStatus').textContent='';}
  else{
    const results=await Promise.all([getStudentProfile(),getStudentMembership(),loadStudentAccess()]);
    if(results[0].error || !results[0].profile)throw new Error('Please complete your profile on Home. · ホームでプロフィールを入力してください。');
    profile=results[0].profile;access=results[2];applyStudentFeatureVisibility(access);
    $('#memberPlan').textContent=`${planFor(results[1].membership?.plan_tier || 'free').name} · Your learning space · あなたの学習スペース`;
    renderProfile();$('#memberWorkspace').hidden=false;$('#memberStatus').textContent='';renderPreferences();
    showPanel(['profile','announcements','favorites','settings','personal'].includes(location.hash.slice(1))?location.hash.slice(1):'profile');
    const [notices,cards,saved]=await Promise.all([featureAllowed(access,'show_announcements')?fetchStudentAnnouncements():Promise.resolve({data:[]}),client.from('review_personal_cards').select('*').eq('student_id',session.user.id).eq('active',true).order('created_at',{ascending:false}),client.from('review_personal_card_favorites').select('card_id').eq('student_id',session.user.id)]);
    if(notices.error)$('#announcementList').textContent='Please reload to view announcements. · お知らせは再読み込みしてご確認ください。';else renderAnnouncements(notices.data || []);
    if(cards.error || saved.error)$('#personalList').textContent='Please reload to view your practice cards. · 復習カードは再読み込みしてご確認ください。';
    else{personalCards=cards.data || [];personalSaved=new Set((saved.data || []).map(row=>row.card_id));renderPersonal();if(!$('#panel-favorites').hidden)void renderFavorites();}
  }
}catch(error){$('#memberStatus').textContent=error.message || 'Could not load My Page. Please reload. · マイページを読み込めませんでした。再読み込みしてください。';}
