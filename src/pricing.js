import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js";
import {
  applyThemePreference,
  getSettings,
  onSettingsChange,
  updateSettings,
  watchSystemTheme,
} from "./store.js";
import "./pwa.js";
import {
  BILLING_OPTIONS,
  CONTACT_CHANNELS,
  PLAN_CATALOG,
  PLAN_COMPARISON,
  PLAN_ORDER,
  PREMIUM_PROMOTION,
  contactMessage,
  formatYen,
  planPrice,
  planSavings,
  promotionApplies,
} from "./plans.js";

const elements = {
  language: document.querySelector("#languageToggle"),
  theme: document.querySelector("#themeToggle"),
  mobileSettingsToggle: document.querySelector("#mobileSettingsToggle"),
  settingsControls: document.querySelector("#siteSettingsControls"),
  quickNav: document.querySelector("#planQuickNav"),
  grid: document.querySelector("#planGrid"),
  monthly: document.querySelector("#billingMonthly"),
  sixMonths: document.querySelector("#billingSixMonths"),
  billingSummary: document.querySelector("#billingSummary"),
  comparisonTable: document.querySelector("#comparisonTable"),
  comparisonCards: document.querySelector("#comparisonCards"),
  dialog: document.querySelector("#contactDialog"),
  dialogName: document.querySelector("#contactPlanName"),
  dialogPrice: document.querySelector("#contactPlanPrice"),
  name: document.querySelector("#contactName"),
  message: document.querySelector("#contactMessage"),
  reset: document.querySelector("#resetContactMessage"),
  copy: document.querySelector("#copyContactMessage"),
  line: document.querySelector("#lineContact"),
  instagram: document.querySelector("#instagramContact"),
  status: document.querySelector("#contactStatus"),
  returnLinks: [...document.querySelectorAll(".pricing-return")],
};

let billing = BILLING_OPTIONS.monthly;
let selectedPlan = PLAN_CATALOG.standard;
let messageDirty = false;

const language = () => languageModeFromSettings(getSettings());
const t = (en, ja) => uiText(en, ja, language());
const billingLabel = () => billing === BILLING_OPTIONS.sixMonths
  ? t("for 6 months", "6か月分")
  : t("per month", "月額");

function localizedHeading(en, ja) {
  const current = language();
  if (current === "en") return `<span class="localized-title-line" lang="en">${en}</span>`;
  if (current === "ja") return `<span class="localized-title-line localized-title-ja" lang="ja">${ja || en}</span>`;
  if (!ja || ja === en) return `<span class="localized-title-line" lang="en">${en}</span>`;
  return `<span class="localized-title-line" lang="en">${en}</span><span class="localized-title-line localized-title-ja" lang="ja">${ja || en}</span>`;
}

function safeReturnPath() {
  const raw = new URLSearchParams(window.location.search).get("returnTo");
  if (!raw) return "/";
  try {
    const parsed = new URL(raw, window.location.origin);
    const allowed = parsed.origin === window.location.origin
      && ["/", "/lesson", "/lesson.html", "/phrases", "/phrases.html"].includes(parsed.pathname);
    return allowed ? `${parsed.pathname}${parsed.search}${parsed.hash}` : "/";
  } catch {
    return "/";
  }
}

function comparisonValue(row, planKey) {
  const mode = language();
  const localizedValues = mode === "ja" ? row.valuesJa : null;
  const value = localizedValues?.[planKey] ?? row.values[planKey];
  if (value === true) return `<span class="comparison-yes" aria-label="${t("Included", "含まれます")}">✓</span>`;
  if (value === false || value == null) return `<span class="comparison-no" aria-label="${t("Not included", "含まれません")}">—</span>`;
  return `<span>${value}</span>`;
}

function planVisual(key) {
  if (key === "premium") {
    return `<div class="plan-visual plan-visual-premium">
      <span class="plan-visual-kicker">${t("PERSONAL FEEDBACK", "個別フィードバック")}</span>
      <div class="premium-review-flow">
        <span><b aria-hidden="true">●</b><strong>${t("Speaking review", "スピーキング添削")}</strong><small>${t("1 personal review in every lesson", "各レッスン1件を個別添削")}</small></span>
        <span><b aria-hidden="true">✦</b><strong>${t("Writing review", "英作文添削")}</strong><small>${t("1 personal review in every lesson", "各レッスン1件を個別添削")}</small></span>
      </div>
    </div>`;
  }
  if (key === "premium_plus") {
    return `<div class="plan-visual plan-visual-coaching">
      <span class="plan-visual-kicker">${t("LIVE 1:1 COACHING", "ライブ個人指導")}</span>
      <div class="coaching-value"><strong>3</strong><span>${t("sessions every month", "毎月3回")}</span><b>${t("50 minutes each", "各50分")}</b></div>
      <div class="coaching-sessions" aria-hidden="true"><i>01</i><span></span><i>02</i><span></span><i>03</i></div>
    </div>`;
  }
  const visual = key === "free"
    ? { mark: "02", label: t("complete lessons free", "完成版2レッスン無料") }
    : { mark: "14", label: t("ways to practise", "選べる14種類の練習") };
  return `<div class="plan-visual" aria-hidden="true"><span class="plan-visual-mark">${visual.mark}</span><span class="plan-visual-caption">${visual.label}</span></div>`;
}

function renderPlanQuickNav() {
  if (!elements.quickNav) return;
  const shortBenefits = {
    free: ["Two complete lessons", "完成版2レッスン"],
    standard: ["All 17 lesson reviews", "全17レッスン復習"],
    premium: ["Personal speaking & writing feedback", "発話・英作文の個別添削"],
    premium_plus: ["Three live coaching sessions", "月3回のライブ個人指導"],
  };
  elements.quickNav.innerHTML = PLAN_ORDER.map((key) => {
    const plan = PLAN_CATALOG[key];
    const [benefitEn, benefitJa] = shortBenefits[key];
    const currentPrice = formatYen(planPrice(plan, billing));
    return `<a class="plan-quick-link plan-quick-${key}" href="#plan-card-${key}">
      <span class="plan-quick-name">${key === "premium_plus" ? t("Premium+ Coaching", "Premium+ コーチング") : plan.name}</span>
      <strong>${currentPrice}</strong>
      <small>${billingLabel()} · ${t(benefitEn, benefitJa)}</small>
    </a>`;
  }).join("");
}

function renderPlans() {
  renderPlanQuickNav();
  elements.grid.innerHTML = PLAN_ORDER.map((key) => {
    const plan = PLAN_CATALOG[key];
    const featured = key === "premium" ? " featured" : key === "premium_plus" ? " premium-plus" : "";
    const displayName = key === "premium_plus"
      ? localizedHeading("Premium+ Coaching", "Premium+ コーチング")
      : localizedHeading(plan.name, plan.name);
    const savings = planSavings(plan);
    const sixMonthDetails = billing === BILLING_OPTIONS.sixMonths && plan.monthlyYen
      ? `<div class="plan-saving"><strong>${t(`Save exactly ${formatYen(savings.savedYen)} (${savings.percent}%)`, `${formatYen(savings.savedYen)}お得（${savings.percent}%割引）`)}</strong><span>${t(`${formatYen(plan.sixMonthsYen)} total · normally ${formatYen(savings.monthlyTotal)} · ${formatYen(savings.monthlyEquivalentYen)}/month equivalent`, `6か月合計${formatYen(plan.sixMonthsYen)}・通常${formatYen(savings.monthlyTotal)}・月額換算${formatYen(savings.monthlyEquivalentYen)}`)}</span></div>`
      : billing === BILLING_OPTIONS.sixMonths
        ? `<div class="plan-saving"><strong>${t("Always free", "ずっと無料")}</strong><span>${t("No payment required", "支払い不要")}</span></div>`
        : "";
    return `
      <article class="plan-card${featured}" id="plan-card-${plan.key}" data-plan="${plan.key}">
        ${plan.badge ? `<span class="plan-badge">${t(plan.badge, plan.badgeJa)}</span>` : ""}
        ${planVisual(key)}
        <div class="plan-card-heading">
          <span class="plan-name">${displayName}</span>
          <p>${t(plan.summary, plan.summaryJa)}</p>
        </div>
        <div class="plan-best-for"><small>${t("BEST FOR", "こんな方に")}</small><strong>${t(plan.bestFor, plan.bestForJa)}</strong></div>
        <p class="plan-price"><strong>${formatYen(planPrice(plan, billing))}</strong><span>${billingLabel()}</span></p>
        ${sixMonthDetails}
        ${promotionApplies(plan, billing) ? `<aside class="premium-promotion" aria-label="${t("New Premium applicant offer", "Premium新規申込キャンペーン")}">
          <span><b class="premium-promotion-gift" aria-hidden="true">🎁</b>${t("NEW PREMIUM APPLICANTS", "PREMIUM 新規申込限定")}</span>
          <div class="premium-promotion-steps">
            <span><small>${t("FIRST 30 DAYS", "最初の30日")}</small><strong>¥0</strong><b>${t("Free", "無料")}</b></span>
            <i aria-hidden="true">→</i>
            <span><small>${t("SECOND MONTH", "2か月目")}</small><strong>${formatYen(PREMIUM_PROMOTION.secondMonthYen)}</strong><b>${t("50% off", "50%オフ")}</b></span>
          </div>
          <small>${t("Monthly Premium only. Tahmid personally confirms eligibility and activation; no payment is taken on this page.", "Premium月額プランへの新規申込のみ。対象条件と利用開始はTahmidが個別に確認します。このページでは決済されません。")}</small>
        </aside>` : ""}
        <details class="plan-feature-details">
          <summary><span>${t("What's included", "含まれる内容")}</span><small>${t(`${plan.features.length} benefits`, `${plan.features.length}項目`)}</small></summary>
          <ul>${plan.features.map((feature) => `<li><span aria-hidden="true">✓</span>${t(feature.en, feature.ja)}</li>`).join("")}</ul>
        </details>
        ${key === "free"
          ? `<a class="plan-cta secondary-btn" href="/">${t("Try two lessons free", "2レッスンを無料体験")}</a>`
          : `<button class="plan-cta primary-btn" type="button" data-contact-plan="${plan.key}">${t(`Ask about ${plan.name}`, `${plan.name}について相談`)}</button>`}
      </article>
    `;
  }).join("");
  elements.grid.querySelectorAll("[data-contact-plan]").forEach((button) => {
    button.addEventListener("click", () => openContact(button.dataset.contactPlan));
  });
}

function renderComparison() {
  const headings = PLAN_ORDER.map((key) => `<th scope="col" class="comparison-${key}">${PLAN_CATALOG[key].name}${key === "premium" ? `<small>${t("Recommended", "おすすめ")}</small>` : ""}</th>`).join("");
  const rows = PLAN_COMPARISON.map((row) => `
    <tr>
      <th scope="row">${t(row.label, row.labelJa)}</th>
      ${PLAN_ORDER.map((key) => `<td class="comparison-${key}">${comparisonValue(row, key)}</td>`).join("")}
    </tr>
  `).join("");
  elements.comparisonTable.innerHTML = `
    <table class="comparison-table">
      <caption class="sr-only">${t("Membership plan feature comparison", "会員プラン機能比較")}</caption>
      <thead><tr><th scope="col">${t("Included support", "含まれる内容")}</th>${headings}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  elements.comparisonCards.innerHTML = PLAN_ORDER.map((key) => `
    <article class="comparison-mobile-card comparison-${key}">
      <header><h3>${PLAN_CATALOG[key].name}</h3>${key === "premium" ? `<span>${t("Recommended", "おすすめ")}</span>` : ""}</header>
      <dl>${PLAN_COMPARISON.map((row) => `<div><dt>${t(row.label, row.labelJa)}</dt><dd>${comparisonValue(row, key)}</dd></div>`).join("")}</dl>
      ${key === "free"
        ? `<a class="secondary-btn" href="/">${t("Start free", "無料で始める")}</a>`
        : `<button class="primary-btn" type="button" data-contact-plan="${key}">${t(`Ask about ${PLAN_CATALOG[key].name}`, `${PLAN_CATALOG[key].name}を相談`)}</button>`}
    </article>
  `).join("");
  elements.comparisonCards.querySelectorAll("[data-contact-plan]").forEach((button) => {
    button.addEventListener("click", () => openContact(button.dataset.contactPlan));
  });
}

function renderBillingSummary() {
  elements.billingSummary.textContent = billing === BILLING_OPTIONS.sixMonths
    ? t("Six-month prices are totals. Exact yen savings and monthly equivalents are shown on each plan.", "6か月価格は合計額です。各プランに、正確な割引額と月額換算を表示しています。")
    : t("New Premium monthly applicants can ask about 30 days free and 50% off the second month. Tahmid confirms eligibility personally.", "Premium月額プランへ新規でお申し込みの方は、30日間無料・2か月目50%オフについてご相談いただけます。対象条件はTahmidが個別に確認します。");
}

function generatedMessage() {
  return contactMessage(selectedPlan, billing, language(), elements.name.value);
}

function refreshDialog({ forceMessage = false } = {}) {
  const price = formatYen(planPrice(selectedPlan, billing));
  elements.dialogName.textContent = selectedPlan.name;
  elements.dialogPrice.textContent = `${price} · ${billingLabel()}`;
  if (forceMessage || !messageDirty) elements.message.value = generatedMessage();
  elements.message.dataset.dirty = String(messageDirty);
  elements.status.textContent = "";
}

function openContact(key) {
  selectedPlan = PLAN_CATALOG[key] || PLAN_CATALOG.standard;
  messageDirty = false;
  refreshDialog({ forceMessage: true });
  if (typeof elements.dialog.showModal === "function") elements.dialog.showModal();
  else elements.dialog.setAttribute("open", "");
  window.setTimeout(() => elements.name.focus(), 0);
}

function setBilling(next) {
  billing = next === BILLING_OPTIONS.sixMonths
    ? BILLING_OPTIONS.sixMonths
    : BILLING_OPTIONS.monthly;
  elements.monthly.classList.toggle("active", billing === BILLING_OPTIONS.monthly);
  elements.sixMonths.classList.toggle("active", billing === BILLING_OPTIONS.sixMonths);
  elements.monthly.setAttribute("aria-pressed", String(billing === BILLING_OPTIONS.monthly));
  elements.sixMonths.setAttribute("aria-pressed", String(billing === BILLING_OPTIONS.sixMonths));
  renderPlans();
  renderBillingSummary();
  if (elements.dialog.open) refreshDialog();
}

async function copyCurrentMessage() {
  try {
    await navigator.clipboard.writeText(elements.message.value);
    elements.status.textContent = t("Your current message was copied. Open your preferred contact app next.", "現在の文面をコピーしました。次に連絡アプリを開いてください。");
  } catch {
    elements.message.focus();
    elements.message.select();
    elements.status.textContent = t("Select and copy the message above.", "上のメッセージを選択してコピーしてください。");
  }
}

function applySettings(settings = getSettings()) {
  applyLanguageMode(languageModeFromSettings(settings));
  elements.language.value = languageModeFromSettings(settings);
  if (elements.theme) elements.theme.value = settings.theme || "light";
  applyThemePreference(settings.theme);
  renderPlans();
  renderComparison();
  renderBillingSummary();
  if (elements.dialog.open) refreshDialog();
}

elements.returnLinks.forEach((link) => { link.href = safeReturnPath(); });
elements.line.href = CONTACT_CHANNELS.line.url;
elements.instagram.href = CONTACT_CHANNELS.instagram.url;
elements.language.addEventListener("change", () => {
  const languageMode = ["en", "bilingual", "ja"].includes(elements.language.value)
    ? elements.language.value
    : "bilingual";
  updateSettings({ languageMode, showJapanese: languageMode !== "en" });
});
elements.theme?.addEventListener("change", () => {
  updateSettings({ theme: elements.theme.value });
});
elements.mobileSettingsToggle?.addEventListener("click", () => {
  const expanded = elements.mobileSettingsToggle.getAttribute("aria-expanded") === "true";
  elements.mobileSettingsToggle.setAttribute("aria-expanded", String(!expanded));
  elements.settingsControls?.classList.toggle("mobile-open", !expanded);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || elements.mobileSettingsToggle?.getAttribute("aria-expanded") !== "true") return;
  elements.mobileSettingsToggle.setAttribute("aria-expanded", "false");
  elements.settingsControls?.classList.remove("mobile-open");
  elements.mobileSettingsToggle.focus();
});
document.addEventListener("pointerdown", (event) => {
  if (elements.mobileSettingsToggle?.getAttribute("aria-expanded") !== "true") return;
  if (event.target.closest(".pricing-header")) return;
  elements.mobileSettingsToggle.setAttribute("aria-expanded", "false");
  elements.settingsControls?.classList.remove("mobile-open");
});
elements.monthly.addEventListener("click", () => setBilling(BILLING_OPTIONS.monthly));
elements.sixMonths.addEventListener("click", () => setBilling(BILLING_OPTIONS.sixMonths));
elements.name.addEventListener("input", () => {
  if (!messageDirty) elements.message.value = generatedMessage();
});
elements.message.addEventListener("input", () => {
  messageDirty = true;
  elements.message.dataset.dirty = "true";
  elements.status.textContent = t("Your edits will be kept until you reset or choose another plan.", "編集内容は、リセットまたは別のプランを選ぶまで保持されます。");
});
elements.reset.addEventListener("click", () => {
  messageDirty = false;
  refreshDialog({ forceMessage: true });
  elements.status.textContent = t("The message template was reset.", "問い合わせ文を初期状態に戻しました。");
});
elements.copy.addEventListener("click", copyCurrentMessage);
onSettingsChange(applySettings);
setBilling(BILLING_OPTIONS.monthly);
applySettings();
watchSystemTheme(() => applyThemePreference(getSettings().theme));
