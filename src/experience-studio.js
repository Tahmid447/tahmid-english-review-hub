import { PLAN_CATALOG, formatYen } from './plans.js?v=20260911-mobile2';
import { campaignQuote, deadlineLabel, escapeHtml as e } from './campaigns.js?v=20260911-mobile2';
import { welcomeContent } from './experience.js?v=20260911-mobile2';
const features = [['dashboard','Dashboard','ダッシュボード'],['words','Words','単語'],['phrases','Phrases','フレーズ'],['phonics','Phonics','フォニックス'],['review_lessons','Lessons','レッスン'],['homework','Homework','宿題'],['progress','Progress','学習記録'],['pricing','Pricing','料金プラン'],['contact_teacher','Contact','先生への相談'],['trial_cta','Trial','無料体験'],['payment_plan','Payment plan','支払いプラン'],['announcements','Announcements','お知らせ']];
const localDate = iso => { const d=new Date(iso); return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16); };
export async function renderExperienceStudio(container,{client,profiles=[],onDefaults=()=>{}}) {
  const {data:config,error} = await client.from('review_site_experience').select('*').eq('id',true).maybeSingle();
  if (!container.isConnected) return;
  if (error) { container.textContent='Campaign controls could not load. Reload to try again. / キャンペーン設定を読み込めません。再読み込みしてください。';return; }
  if (!config) return; // This private workspace is reserved for the verified owner.
  const {data:targets,error:targetError}=await client.from('review_campaign_targets').select('student_id');
  if(targetError){container.textContent='Could not load campaign audience. / 対象者を読み込めません。';return;}
  onDefaults(config.features);
  const selected=new Set((targets||[]).map(x=>x.student_id));
  container.className='experience-studio';
  container.innerHTML=`<details class="experience-workspace"><summary><span class="studio-mark">✦</span><span><small>YOUR CLUB, YOUR WAY</small><strong>Experience & campaigns <span lang="ja">表示・キャンペーン管理</span></strong></span><span class="studio-live">${config.campaign_enabled?'Campaign ON · 特別価格公開中':'Standard · 標準表示'}</span></summary>
  <form class="experience-form"><div class="studio-intro"><h3>A thoughtful welcome.<br>あなたらしい、お迎えを。</h3><p>Control the offer, the audience and the learning experience in one place.<br>料金の見せ方・対象者・全体の表示を、この画面でまとめて設定できます。</p></div>
  <div class="studio-step"><span>01</span><div><h4>Pricing display / 料金の表示</h4><div class="studio-mode-switch"><label><input type="radio" name="mode" value="standard" ${!config.campaign_enabled?'checked':''}><b>Standard · 標準表示</b><small>従来の料金表示</small></label><label><input type="radio" name="mode" value="campaign" ${config.campaign_enabled?'checked':''}><b>Campaign · 期間限定表示</b><small>比較価格・割引率・期限つき</small></label></div>
  <label class="studio-switch"><input type="checkbox" name="welcome" ${config.welcome_enabled?'checked':''}><span><b>Welcome offer · 新規登録特典を表示</b><small>期間内に登録した無料会員へ1回表示。同じ料金を使用します。</small></span></label></div></div>
  <div class="studio-step"><span>02</span><div><h4>Offer details / キャンペーンの内容</h4><div class="studio-fields"><label>Campaign name (English)<input name="name_en" required maxlength="120" value="${e(config.name_en)}"></label><label>キャンペーン名（日本語）<input name="name_ja" required maxlength="120" value="${e(config.name_ja)}"></label><label>Starts / 開始（この端末の時刻）<input type="datetime-local" name="starts_at" required value="${localDate(config.starts_at)}"></label><label>Ends / 終了（この端末の時刻）<input type="datetime-local" name="ends_at" required value="${localDate(config.ends_at)}"></label></div>
  <p class="studio-hint">月額プランの新規お申し込み用です。期間終了後は「終了後の価格」に自動で切り替わります。既存会員の契約は変更しません。6か月プランは従来どおりです。</p>
  <div class="studio-price-inputs">${['standard','premium','premium_plus'].map(k=>`<fieldset><legend>${PLAN_CATALOG[k].name}</legend><label>After offer / 終了後の価格（円）<input type="number" name="${k}_regular" min="1" max="1000000" step="1" required value="${config.prices[k].regular}"></label><label>Offer / 今の特別価格（円）<input type="number" name="${k}_offer" min="1" max="1000000" step="1" required value="${config.prices[k].offer}"></label><output data-quote="${k}"></output></fieldset>`).join('')}</div></div></div>
  <div class="studio-step"><span>03</span><div><h4>Who sees the offer? / 対象者</h4><label>Campaign audience / キャンペーンの対象<select name="audience"><option value="all">Everyone · 全員（未登録の訪問者を含む）</option><option value="selected">Selected learners · 選択した生徒のみ</option></select></label><div class="studio-audience">${profiles.map(p=>`<label><input type="checkbox" name="target" value="${e(p.user_id)}" ${selected.has(p.user_id)?'checked':''}><span>${e([p.first_name,p.last_name].filter(Boolean).join(' ')||p.contact_email||'Learner')}</span></label>`).join('')||'<p>No learners yet / 生徒がまだいません</p>'}</div><p class="studio-hint">「新規登録特典」は、選んだ対象のうち、キャンペーン期間内に登録した無料会員に表示します。料金プランを非表示にした生徒には表示しません。</p></div></div>
  <div class="studio-step"><span>04</span><div><h4>Global learner features / 生徒全体の表示設定</h4><p class="studio-hint">「全体設定を使う」の生徒と新規登録者に反映します。「個別設定」の生徒はその設定を優先します。個別設定は「生徒を開く → 教材ライブラリ」で変更できます。</p><div class="studio-feature-grid">${features.map(([key,en,ja])=>`<label><input type="checkbox" name="show_${key}" ${config.features['show_'+key]!==false?'checked':''}><span>${en}<small>${ja}</small></span></label>`).join('')}</div></div></div>
  <div class="studio-footer"><button type="submit" class="primary-btn">Save & publish settings · 設定を保存して反映</button><button type="button" class="secondary-btn" data-preview-offer>Preview welcome · 特典のプレビュー</button><a href="/plans" target="_blank" rel="noopener">Open plans · 料金ページ ↗</a><p role="status" class="studio-status">設定変更は保存後に反映されます。 / Changes apply after saving.</p></div></form></details>`;
  const form=container.querySelector('form'),status=form.querySelector('[role=status]');
  form.elements.audience.value=config.audience;
  const values=()=>{
    const prices=Object.fromEntries(['standard','premium','premium_plus'].map(k=>[k,{regular:Number(form.elements[k+'_regular'].value),offer:Number(form.elements[k+'_offer'].value)}]));
    return {features:Object.fromEntries(features.map(([k])=>['show_'+k,form.elements['show_'+k].checked])),campaign_enabled:form.elements.mode.value==='campaign',welcome_enabled:form.elements.welcome.checked,name_en:form.elements.name_en.value.trim(),name_ja:form.elements.name_ja.value.trim(),starts_at:new Date(form.elements.starts_at.value).toISOString(),ends_at:new Date(form.elements.ends_at.value).toISOString(),audience:form.elements.audience.value,prices};
  };
  const preview=()=>{form.querySelector('.studio-audience').hidden=form.elements.audience.value!=='selected'; try{const c=values();for(const k of Object.keys(c.prices)){const q=campaignQuote(PLAN_CATALOG[k],'monthly',{...c,active:true},Date.parse(c.starts_at));form.querySelector(`[data-quote="${k}"]`).textContent=`${formatYen(q.price)} · ${q.percent}% OFF · ${formatYen(q.saving)}お得`;}}catch{}};
  form.addEventListener('input',preview);preview();
  form.querySelector('[data-preview-offer]').onclick=()=>{
    if(!form.reportValidity())return;const c=values();
    if(Object.values(c.prices).some(p=>p.offer>p.regular)||Date.parse(c.ends_at)<=Date.parse(c.starts_at)){status.textContent='価格・期間を確認してください。 / Check prices and dates.';return;}
    const dialog=document.createElement('dialog');dialog.className='welcome-offer';dialog.setAttribute('aria-label','Welcome offer preview / 特典プレビュー');
    dialog.innerHTML=`<button type="button" class="welcome-close" aria-label="Close preview / 閉じる">×</button><p class="preview-ribbon">PREVIEW · 生徒にはまだ表示されません</p>${welcomeContent({...c,active:true}, Date.parse(c.starts_at))}<button type="button" class="welcome-claim">Close preview · プレビューを閉じる</button>`;
    dialog.querySelectorAll('button').forEach(b=>b.onclick=()=>dialog.close());dialog.onclose=()=>dialog.remove();document.body.append(dialog);dialog.showModal();
  };
  form.onsubmit=async event=>{
    event.preventDefault();const c=values();
    if(Date.parse(c.ends_at)<=Date.parse(c.starts_at)||Object.values(c.prices).some(p=>p.offer>p.regular)){status.textContent='終了日時・価格を確認してください。 / Check the deadline and prices.';return;}
    const targetIds=[...form.querySelectorAll('[name=target]:checked')].map(n=>n.value);
    if(c.audience==='selected'&&!targetIds.length){status.textContent='対象の生徒を選んでください。 / Choose a learner.';return;}
    const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Saving… / 保存中…';
    try {const {error}=await client.rpc('review_save_experience',{config:c,targets:targetIds});if(error)throw error;
      onDefaults(c.features);status.textContent='Saved ✓ Your settings are live. / 保存しました。設定を反映しました。';
      container.querySelector('.studio-live').textContent=c.campaign_enabled?'Campaign ON · 特別価格公開中':'Standard · 標準表示';
    }catch(error){status.textContent=`保存できませんでした / Could not save: ${error.message||'Please try again'}`;}finally{submit.disabled=false;}
  };
}
