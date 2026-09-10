import { getStudentClient, getStudentSession } from './supabase.js?v=20260910-member1';
import { campaignQuote, deadlineLabel, remainingTime, escapeHtml as e } from './campaigns.js?v=20260910-member1';
import { PLAN_CATALOG, formatYen } from './plans.js?v=20260910-member1';
let popupIdentity = '';
export async function loadExperience() {
  const client = getStudentClient();
  if (!client) return {campaign:null, welcome:false, features:{}, unavailable:true};
  const {data,error} = await Promise.resolve(client.rpc('review_my_experience')).catch(error=>({data:null,error}));
  if (error) return {campaign:null, welcome:false, features:{}, unavailable:true};
  return data;
}
export function welcomeContent(campaign, quoteNow = Date.now()) {
  const quotes = ['standard','premium','premium_plus'].map(k=>[PLAN_CATALOG[k], campaignQuote(PLAN_CATALOG[k],'monthly',campaign,quoteNow)]);
  const percent = Math.max(...quotes.map(([,q])=>q.percent));
  return `<div class="welcome-emblem" aria-hidden="true">✦</div><p class="campaign-eyebrow">A LITTLE WELCOME GIFT · ご登録特典</p>
  <h2 id="welcomeOfferHeading">Your English story<br>starts here.</h2><p class="welcome-japanese">あなたの「話せた！」を、ここから。</p>
  <div class="welcome-value"><span>UP TO · 最大</span><strong>${percent}<small>% OFF</small></strong></div>
  <p>Welcome to Tahmid English Club.<br><span lang="ja">ご登録ありがとうございます。今から始める方へ、特別価格をご用意しました。</span></p>
  <div class="welcome-prices">${quotes.map(([p,q])=>`<div><span>${e(p.name)}</span><del>${formatYen(q.regular)}</del><strong>${formatYen(q.price)}<small> / 月</small></strong></div>`).join('')}</div>
  <p class="campaign-terms">Monthly plans · New applications · No additional discount is stacked.<br>月額プランの新規お申し込みが対象。他の割引との併用はありません。<br>終了後の適用価格との比較 / Compared with prices after the offer.<br>${e(deadlineLabel(campaign.ends_at))} まで</p>`;
}
export async function maybeShowWelcomeOffer() {
  const session = await getStudentSession();
  if (!session?.user || document.querySelector('dialog[open]')) return;
  const experience = await loadExperience();
  const c = experience?.campaign;
  if (!experience.welcome || !c?.active || Date.now()>=Date.parse(c.ends_at)) return;
  const identity = `${session.user.id}:${c.key}`;
  if (popupIdentity===identity) return;
  try { if (localStorage.getItem(`te-offer-dismissed:${identity}`)) return; } catch {}
  popupIdentity=identity;
  const dialog=document.createElement('dialog');
  dialog.className='welcome-offer'; dialog.setAttribute('aria-labelledby','welcomeOfferHeading');
  dialog.innerHTML=`<button type="button" class="welcome-close" aria-label="Close offer / 特典を閉じる">×</button>${welcomeContent(c)}<div class="welcome-countdown" aria-label="Time remaining / 残り時間"></div><a class="welcome-claim" href="/plans">Explore my plans · プランを見る →</a><button type="button" class="welcome-later">Keep exploring · あとで見る</button>`;
  const dismiss = () => { try { localStorage.setItem(`te-offer-dismissed:${identity}`,'1'); } catch {} void Promise.resolve(getStudentClient()?.rpc('review_dismiss_offer')).catch(()=>{}); };
  dialog.querySelector('.welcome-close').onclick=()=>dialog.close();
  dialog.querySelector('.welcome-later').onclick=()=>dialog.close();
  dialog.querySelector('.welcome-claim').onclick=dismiss;
  const tick=()=>{ const r=remainingTime(c.ends_at); if(r.expired) {dialog.close();return;} dialog.querySelector('.welcome-countdown').textContent=`${r.days} days · ${[r.hours,r.minutes,r.seconds].map(x=>String(x).padStart(2,'0')).join(' : ')} remaining / 残り`; };
  document.body.append(dialog); dialog.showModal(); tick();
  const interval=setInterval(tick,1000);
  dialog.addEventListener('close',()=>{ clearInterval(interval);dismiss();dialog.remove(); },{once:true});
}
