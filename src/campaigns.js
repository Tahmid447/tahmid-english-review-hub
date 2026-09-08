// Price arithmetic is shared by cards, welcome offers, the studio preview and
// inquiry text. All dates are absolute; eligibility comes from the database.
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function campaignQuote(plan, billing, campaign, now = Date.now()) {
  const base = billing === 'six_months' ? plan.sixMonthsYen : plan.monthlyYen;
  const p = campaign?.prices?.[plan.key];
  if (billing !== 'monthly' || !p || !Number.isInteger(p.regular) || !Number.isInteger(p.offer) || p.offer < 1 || p.offer > p.regular) return { price: base, regular: base, saving: 0, percent: 0, active: false };
  const active = campaign.active !== false && now >= Date.parse(campaign.starts_at) && now < Date.parse(campaign.ends_at);
  const price = active ? p.offer : p.regular;
  return { price, regular: p.regular, saving: p.regular - price, percent: Math.floor(100 * (p.regular-price) / p.regular), active };
}
export function deadlineLabel(iso) {
  return new Intl.DateTimeFormat('ja-JP', {timeZone:'Asia/Tokyo',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(Date.parse(iso)-1000)) + ' JST';
}
export function remainingTime(iso, now=Date.now()) {
  const total = Math.max(0, Math.floor((Date.parse(iso)-now)/1000));
  return { days: Math.floor(total/86400), hours: Math.floor(total/3600)%24, minutes: Math.floor(total/60)%60, seconds: total%60, expired: total===0 };
}
