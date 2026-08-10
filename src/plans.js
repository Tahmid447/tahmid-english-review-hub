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

export const PLAN_CATALOG = Object.freeze({
  free: Object.freeze({
    key: "free",
    name: "Free",
    nameJa: "無料",
    monthlyYen: 0,
    sixMonthsYen: 0,
    badge: "",
    badgeJa: "",
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
    badgeJa: "最もお得",
    summary: "Premium plus live coaching three times each month.",
    summaryJa: "Premiumに月3回のライブ個人レッスンを追加します。",
    features: Object.freeze([
      Object.freeze({ en: "Everything in Premium", ja: "Premiumの内容すべて" }),
      Object.freeze({ en: "3 × 50-minute live 1:1 lessons each month", ja: "月3回・各50分のライブ個人レッスン" }),
      Object.freeze({ en: "15% off extra 1:1 lessons", ja: "追加の個人レッスンが15%オフ" }),
      Object.freeze({ en: "Monthly progress note from Tahmid", ja: "Tahmidから毎月の学習進捗レポート" }),
    ]),
  }),
});

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

export function contactMessage(plan, billing = BILLING_OPTIONS.monthly, language = "bilingual") {
  const selected = typeof plan === "string" ? planFor(plan) : plan;
  const price = formatYen(planPrice(selected, billing));
  const periodEn = billing === BILLING_OPTIONS.sixMonths ? "6 months" : "month";
  const periodJa = billing === BILLING_OPTIONS.sixMonths ? "6ヶ月" : "月";
  const en = `Hello Tahmid, I would like to ask about the ${selected.name} plan (${price} / ${periodEn}). My name is: `;
  const ja = `Tahmidさん、${selected.name}プラン（${price}／${periodJa}）について申し込み相談をしたいです。名前：`;
  if (language === "en") return en;
  if (language === "ja") return ja;
  return `${en}\n${ja}`;
}
