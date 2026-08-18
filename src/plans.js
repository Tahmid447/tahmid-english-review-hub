export const PLAN_ORDER = Object.freeze(["free", "standard", "premium", "premium_plus"]);

export const BILLING_OPTIONS = Object.freeze({
  monthly: "monthly",
  sixMonths: "six_months",
});

export const CONTACT_CHANNELS = Object.freeze({
  line: Object.freeze({
    label: "LINE",
    url: "https://line.me/ti/p/v6YfxZ1gSI",
    qrAsset: "/assets/contact/line-qr.jpeg",
  }),
  instagram: Object.freeze({
    label: "Instagram",
    url: "https://www.instagram.com/tahmidahmedo?utm_source=qr",
  }),
});

export const PREMIUM_PROMOTION = Object.freeze({
  enabled: true,
  plan: "premium",
  billing: BILLING_OPTIONS.monthly,
  trialDays: 30,
  secondMonthDiscountPercent: 50,
  secondMonthYen: 3490,
  eligibility: "New Premium monthly applicants",
  eligibilityJa: "Premium月額プランへ新規でお申し込みの方",
  manualConfirmation: true,
});

export const PLAN_CATALOG = Object.freeze({
  free: Object.freeze({
    key: "free",
    name: "Free",
    nameJa: "無料",
    monthlyYen: 0,
    sixMonthsYen: 0,
    badge: "",
    badgeJa: "",
    bestFor: "Trying the teaching style before joining",
    bestForJa: "入会前に、学び方や教材を試したい方",
    summary: "Try complete sample lessons before choosing a membership.",
    summaryJa: "入会前に、完成版のサンプルレッスンを体験できます。",
    features: Object.freeze([
      Object.freeze({ en: "2 complete sample lessons", ja: "完成版サンプルレッスン2つ" }),
      Object.freeze({ en: "Selected listening, speaking and visual practice", ja: "厳選されたリスニング・発話・イラスト問題" }),
      Object.freeze({ en: "Progress saved on this device or your account", ja: "端末またはアカウントに学習記録を保存" }),
      Object.freeze({ en: "Safe previews of plan-only activities", ja: "プラン限定問題の安全なプレビュー" }),
    ]),
  }),
  standard: Object.freeze({
    key: "standard",
    name: "Standard",
    nameJa: "スタンダード",
    monthlyYen: 3980,
    sixMonthsYen: 20300,
    badge: "",
    badgeJa: "",
    bestFor: "Independent learners who want the complete library",
    bestForJa: "全教材を自分のペースで学びたい方",
    summary: "The complete self-study Review Hub.",
    summaryJa: "Review Hubをすべて使える自習プランです。",
    features: Object.freeze([
      Object.freeze({ en: "Full lesson library and all 14 activity formats", ja: "全レッスン・全14形式の問題" }),
      Object.freeze({ en: "Full phrase and vocabulary library", ja: "フレーズ・単語ライブラリをすべて利用" }),
      Object.freeze({ en: "Listening, speaking, writing and visual practice", ja: "聞く・話す・書く・イラスト練習" }),
      Object.freeze({ en: "Progress history across signed-in devices", ja: "ログイン端末間で学習履歴を保存" }),
    ]),
  }),
  premium: Object.freeze({
    key: "premium",
    name: "Premium",
    nameJa: "プレミアム",
    monthlyYen: 6980,
    sixMonthsYen: 35600,
    badge: "Most popular",
    badgeJa: "一番人気",
    bestFor: "Learners who improve faster with personal corrections",
    bestForJa: "個別添削を受けながら効率よく伸ばしたい方",
    summary: "Standard plus teacher-reviewed speaking and writing.",
    summaryJa: "Standardに先生のスピーキング・英作文添削を追加します。",
    features: Object.freeze([
      Object.freeze({ en: "Everything in Standard", ja: "Standardの内容すべて" }),
      Object.freeze({ en: "1 teacher-reviewed speaking task per lesson", ja: "レッスンごとにスピーキング課題1件を添削" }),
      Object.freeze({ en: "1 teacher-reviewed essay per lesson", ja: "レッスンごとに英作文課題1件を添削" }),
      Object.freeze({ en: "Feedback within 3 business days", ja: "3営業日以内にフィードバック" }),
      Object.freeze({ en: "10% off additional 1:1 lessons", ja: "追加の個人レッスンが10%オフ" }),
    ]),
  }),
  premium_plus: Object.freeze({
    key: "premium_plus",
    name: "Premium+",
    nameJa: "プレミアムプラス",
    monthlyYen: 16800,
    sixMonthsYen: 85700,
    badge: "Best value",
    badgeJa: "充実サポート",
    bestFor: "Learners who want structured self-study and live coaching",
    bestForJa: "自習とライブ個人指導を組み合わせたい方",
    summary: "Premium plus Tahmid's signature live coaching three times each month.",
    summaryJa: "Premiumに、Tahmidのライブ個人指導を月3回追加します。",
    features: Object.freeze([
      Object.freeze({ en: "Everything in Premium", ja: "Premiumの内容すべて" }),
      Object.freeze({ en: "3 × 50-minute live 1:1 lessons each month", ja: "月3回・各50分のライブ個人レッスン" }),
      Object.freeze({ en: "15% off extra 1:1 lessons", ja: "追加の個人レッスンが15%オフ" }),
      Object.freeze({ en: "Monthly progress note from Tahmid", ja: "Tahmidから毎月の学習進捗レポート" }),
    ]),
  }),
});

export const PLAN_COMPARISON = Object.freeze([
  Object.freeze({
    label: "Complete sample lessons",
    labelJa: "完成版サンプルレッスン",
    values: Object.freeze({ free: "2", standard: "2", premium: "2", premium_plus: "2" }),
  }),
  Object.freeze({
    label: "Full lesson library",
    labelJa: "全レッスンライブラリ",
    values: Object.freeze({ free: false, standard: true, premium: true, premium_plus: true }),
  }),
  Object.freeze({
    label: "All 14 activity formats",
    labelJa: "全14種類の問題形式",
    values: Object.freeze({ free: "Selected", standard: true, premium: true, premium_plus: true }),
    valuesJa: Object.freeze({ free: "一部", standard: true, premium: true, premium_plus: true }),
  }),
  Object.freeze({
    label: "Phrase Library",
    labelJa: "フレーズライブラリ",
    values: Object.freeze({ free: "Selected", standard: "Full", premium: "Full", premium_plus: "Full" }),
    valuesJa: Object.freeze({ free: "一部", standard: "すべて", premium: "すべて", premium_plus: "すべて" }),
  }),
  Object.freeze({
    label: "Vocabulary Library",
    labelJa: "単語ライブラリ",
    values: Object.freeze({ free: "Selected", standard: "Full", premium: "Full", premium_plus: "Full" }),
    valuesJa: Object.freeze({ free: "一部", standard: "すべて", premium: "すべて", premium_plus: "すべて" }),
  }),
  Object.freeze({
    label: "Cross-device progress",
    labelJa: "端末間の学習記録同期",
    values: Object.freeze({ free: "With account", standard: true, premium: true, premium_plus: true }),
    valuesJa: Object.freeze({ free: "登録時", standard: true, premium: true, premium_plus: true }),
  }),
  Object.freeze({
    label: "Teacher-reviewed speaking task",
    labelJa: "先生添削付きスピーキング課題",
    values: Object.freeze({ free: false, standard: false, premium: "1 / lesson", premium_plus: "1 / lesson" }),
    valuesJa: Object.freeze({ free: false, standard: false, premium: "各レッスン1件", premium_plus: "各レッスン1件" }),
  }),
  Object.freeze({
    label: "Teacher-reviewed essay task",
    labelJa: "先生添削付き英作文課題",
    values: Object.freeze({ free: false, standard: false, premium: "1 / lesson", premium_plus: "1 / lesson" }),
    valuesJa: Object.freeze({ free: false, standard: false, premium: "各レッスン1件", premium_plus: "各レッスン1件" }),
  }),
  Object.freeze({
    label: "Teacher feedback turnaround",
    labelJa: "先生からの返却目安",
    values: Object.freeze({ free: false, standard: false, premium: "Within 3 business days", premium_plus: "Within 3 business days" }),
    valuesJa: Object.freeze({ free: false, standard: false, premium: "3営業日以内", premium_plus: "3営業日以内" }),
  }),
  Object.freeze({
    label: "Included live 1:1 lessons",
    labelJa: "含まれるライブ個人レッスン",
    values: Object.freeze({ free: false, standard: false, premium: false, premium_plus: "3 / month" }),
    valuesJa: Object.freeze({ free: false, standard: false, premium: false, premium_plus: "月3回" }),
  }),
  Object.freeze({
    label: "Live lesson duration",
    labelJa: "ライブレッスン時間",
    values: Object.freeze({ free: false, standard: false, premium: false, premium_plus: "50 minutes" }),
    valuesJa: Object.freeze({ free: false, standard: false, premium: false, premium_plus: "各50分" }),
  }),
  Object.freeze({
    label: "Discount on extra 1:1 lessons",
    labelJa: "追加個人レッスン割引",
    values: Object.freeze({ free: false, standard: false, premium: "10%", premium_plus: "15%" }),
  }),
  Object.freeze({
    label: "Monthly personal progress note",
    labelJa: "毎月の個別進捗ノート",
    values: Object.freeze({ free: false, standard: false, premium: false, premium_plus: true }),
  }),
]);

export function normalizePlanKey(value, fallback = "free") {
  const raw = String(value || "").trim().toLowerCase();
  if (["premium+", "premium plus", "premium-plus"].includes(raw)) return "premium_plus";
  const key = raw.replace(/[\s-]+/g, "_");
  if (PLAN_ORDER.includes(key)) return key;
  return PLAN_ORDER.includes(fallback) ? fallback : "free";
}

export function planFor(value) {
  return PLAN_CATALOG[normalizePlanKey(value)] || PLAN_CATALOG.free;
}

export function planMeetsRequirement(actualPlan, requiredPlan) {
  return PLAN_ORDER.indexOf(normalizePlanKey(actualPlan)) >= PLAN_ORDER.indexOf(normalizePlanKey(requiredPlan));
}

export function planPrice(plan, billing = BILLING_OPTIONS.monthly) {
  const selected = typeof plan === "string" ? planFor(plan) : plan;
  return billing === BILLING_OPTIONS.sixMonths
    ? selected.sixMonthsYen
    : selected.monthlyYen;
}

export function formatYen(value) {
  return `¥${Number(value || 0).toLocaleString("ja-JP")}`;
}

export function planSavings(plan) {
  const selected = typeof plan === "string" ? planFor(plan) : plan;
  const monthlyTotal = selected.monthlyYen * 6;
  const savedYen = Math.max(0, monthlyTotal - selected.sixMonthsYen);
  const percent = monthlyTotal ? Math.round((savedYen / monthlyTotal) * 100) : 0;
  const monthlyEquivalentYen = selected.sixMonthsYen ? Math.round(selected.sixMonthsYen / 6) : 0;
  return Object.freeze({ monthlyTotal, savedYen, percent, monthlyEquivalentYen });
}

export function promotionApplies(plan, billing = BILLING_OPTIONS.monthly) {
  const selected = typeof plan === "string" ? planFor(plan) : plan;
  return Boolean(
    PREMIUM_PROMOTION.enabled
    && selected?.key === PREMIUM_PROMOTION.plan
    && billing === PREMIUM_PROMOTION.billing
  );
}

export function contactMessage(plan, billing = BILLING_OPTIONS.monthly, language = "bilingual", name = "") {
  const selected = typeof plan === "string" ? planFor(plan) : plan;
  const price = formatYen(planPrice(selected, billing));
  const periodEn = billing === BILLING_OPTIONS.sixMonths ? "6 months" : "month";
  const periodJa = billing === BILLING_OPTIONS.sixMonths ? "6ヶ月" : "月";
  const cleanName = String(name || "").trim();
  const nameEn = cleanName ? ` My name is ${cleanName}.` : "";
  const nameJa = cleanName ? ` ${cleanName}と申します。` : "";
  const promoEn = promotionApplies(selected, billing)
    ? ` I would also like to ask whether I am eligible for the new-applicant offer: the first 30 days free and the second month 50% off (${formatYen(PREMIUM_PROMOTION.secondMonthYen)}). I understand that Tahmid will confirm eligibility and access personally.`
    : "";
  const promoJa = promotionApplies(selected, billing)
    ? ` 新規申込キャンペーン（最初の30日間無料・2か月目50%オフの${formatYen(PREMIUM_PROMOTION.secondMonthYen)}）の対象になるかも確認したいです。対象条件と利用開始はTahmidさんから個別に確認されることを理解しています。`
    : "";
  const en = `Hi Tahmid, I'm interested in the ${selected.name} plan (${price} / ${periodEn}).${nameEn}${promoEn} Could you tell me the next steps?`;
  const ja = `Tahmidさん、${selected.name}プラン（${price}／${periodJa}）に興味があります。${nameJa}${promoJa} 次の手続きについて教えていただけますか？`;
  if (language === "en") return en;
  if (language === "ja") return ja;
  return `${en}\n\n${ja}`;
}
