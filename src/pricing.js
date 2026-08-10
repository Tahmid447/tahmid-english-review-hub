import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js";
import { getSettings, onSettingsChange, updateSettings } from "./store.js";
import {
  BILLING_OPTIONS,
  CONTACT_CHANNELS,
  PLAN_CATALOG,
  PLAN_ORDER,
  contactMessage,
  formatYen,
  planPrice,
} from "./plans.js";

const elements = {
  language: document.querySelector("#languageToggle"),
  grid: document.querySelector("#planGrid"),
  monthly: document.querySelector("#billingMonthly"),
  sixMonths: document.querySelector("#billingSixMonths"),
  dialog: document.querySelector("#contactDialog"),
  dialogName: document.querySelector("#contactPlanName"),
  dialogPrice: document.querySelector("#contactPlanPrice"),
  message: document.querySelector("#contactMessage"),
  copy: document.querySelector("#copyContactMessage"),
  line: document.querySelector("#lineContact"),
  instagram: document.querySelector("#instagramContact"),
  status: document.querySelector("#contactStatus"),
};

let billing = BILLING_OPTIONS.monthly;
let selectedPlan = PLAN_CATALOG.standard;

const language = () => languageModeFromSettings(getSettings());
const t = (en, ja) => uiText(en, ja, language());

const billingLabel = () => billing === BILLING_OPTIONS.sixMonths
  ? t("/ 6 months", "/ 6ヶ月")
  : t("/ month", "/ 月");

function renderPlans() {
  elements.grid.innerHTML = PLAN_ORDER.map((key) => {
    const plan = PLAN_CATALOG[key];
    const featured = key === "premium" ? " featured" : key === "premium_plus" ? " premium-plus" : "";
    const current = key === "free";
    return `
      <article class="plan-card${featured}" data-plan="${plan.key}">
        ${plan.badge ? `<span class="plan-badge">${t(plan.badge, plan.badgeJa)}</span>` : ""}
        <div class="plan-card-heading">
          <span class="plan-name">${plan.name}</span>
          <p>${t(plan.summary, plan.summaryJa)}</p>
        </div>
        <p class="plan-price"><strong>${formatYen(planPrice(plan, billing))}</strong>${plan.monthlyYen ? `<span>${billingLabel()}</span>` : ""}</p>
        ${billing === BILLING_OPTIONS.sixMonths && plan.monthlyYen ? `<small class="plan-saving">${t("About 15% less than six monthly payments", "月払い6回分より約15%お得")}</small>` : ""}
        <ul>${plan.features.map((feature) => `<li><span aria-hidden="true">✓</span>${t(feature.en, feature.ja)}</li>`).join("")}</ul>
        ${current
          ? `<a class="plan-cta secondary-btn" href="/">${t("Start with Free", "無料で始める")}</a>`
          : `<button class="plan-cta primary-btn" type="button" data-contact-plan="${plan.key}">${t(`Ask about ${plan.name}`, `${plan.name}を相談する`)}</button>`}
      </article>
    `;
  }).join("");
  elements.grid.querySelectorAll("[data-contact-plan]").forEach((button) => {
    button.addEventListener("click", () => openContact(button.dataset.contactPlan));
  });
}

function refreshDialog() {
  const price = formatYen(planPrice(selectedPlan, billing));
  elements.dialogName.textContent = selectedPlan.name;
  elements.dialogPrice.textContent = `${price} ${billingLabel()}`;
  elements.message.value = contactMessage(selectedPlan, billing, language());
  elements.status.textContent = "";
}

function openContact(key) {
  selectedPlan = PLAN_CATALOG[key] || PLAN_CATALOG.standard;
  refreshDialog();
  if (typeof elements.dialog.showModal === "function") elements.dialog.showModal();
  else elements.dialog.setAttribute("open", "");
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
  if (elements.dialog.open) refreshDialog();
}

async function copyPreparedMessage() {
  try {
    await navigator.clipboard.writeText(elements.message.value);
    elements.status.textContent = t("Message copied. Open your preferred contact app next.", "メッセージをコピーしました。次に連絡アプリを開いてください。");
  } catch {
    elements.message.focus();
    elements.message.select();
    elements.status.textContent = t("Select and copy the message above.", "上のメッセージを選択してコピーしてください。");
  }
}

function applySettings(settings = getSettings()) {
  applyLanguageMode(languageModeFromSettings(settings));
  elements.language.value = languageModeFromSettings(settings);
  renderPlans();
  if (elements.dialog.open) refreshDialog();
}

elements.line.href = CONTACT_CHANNELS.line.url;
elements.instagram.href = CONTACT_CHANNELS.instagram.url;
elements.language.addEventListener("change", () => {
  const languageMode = ["en", "bilingual", "ja"].includes(elements.language.value)
    ? elements.language.value
    : "bilingual";
  updateSettings({ languageMode, showJapanese: languageMode !== "en" });
});
elements.monthly.addEventListener("click", () => setBilling(BILLING_OPTIONS.monthly));
elements.sixMonths.addEventListener("click", () => setBilling(BILLING_OPTIONS.sixMonths));
elements.copy.addEventListener("click", copyPreparedMessage);
onSettingsChange(applySettings);
setBilling(BILLING_OPTIONS.monthly);
applySettings();
