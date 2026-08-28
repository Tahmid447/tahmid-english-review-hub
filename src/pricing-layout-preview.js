import { applyLanguageMode, languageModeFromSettings, uiText } from "./i18n.js?v=20260828-release3";
import { applyThemePreference, getSettings, onSettingsChange, updateSettings, watchSystemTheme } from "./store.js?v=20260828-release3";
import { formatYen, PLAN_CATALOG, PLAN_ORDER, PREMIUM_PROMOTION } from "./plans.js?v=20260828-release3";
import { installPlayfulInteractions } from "./effects.js?v=20260828-release3";

const elements = {
  language: document.querySelector("#languageToggle"),
  theme: document.querySelector("#themeToggle"),
  four: document.querySelector("#layoutFour"),
  two: document.querySelector("#layoutTwo"),
  grid: document.querySelector("#layoutPreviewGrid"),
  status: document.querySelector("#layoutChoiceStatus"),
};

let layout = new URLSearchParams(window.location.search).get("layout") === "four" ? "four" : "two";
const mode = () => languageModeFromSettings(getSettings());
const t = (en, ja) => uiText(en, ja, mode());

const visualFor = (key) => {
  if (key === "premium") return `<div class="preview-value-strip preview-feedback"><span aria-hidden="true">🎁</span><strong>${t("Speaking + writing feedback", "スピーキング＋英作文添削")}</strong><small>${t("2 personal reviews in every lesson", "各レッスン合計2件を個別添削")}</small></div>`;
  if (key === "premium_plus") return `<div class="preview-value-strip preview-live"><span aria-hidden="true">LIVE</span><strong>${t("3 × 50-minute 1:1 sessions", "月3回・各50分の個人レッスン")}</strong><small><i>01</i><i>02</i><i>03</i></small></div>`;
  if (key === "standard") return `<div class="preview-value-strip"><span aria-hidden="true">14</span><strong>${t("ways to practise", "選べる14種類の練習")}</strong><small>${t("Full lesson library", "全レッスンを利用")}</small></div>`;
  return `<div class="preview-value-strip"><span aria-hidden="true">02</span><strong>${t("complete lessons free", "完成版2レッスン無料")}</strong><small>${t("No payment needed", "支払い不要")}</small></div>`;
};

const render = () => {
  elements.grid.className = `layout-preview-grid layout-${layout}`;
  elements.grid.innerHTML = PLAN_ORDER.map((key) => {
    const plan = PLAN_CATALOG[key];
    const name = key === "premium_plus" ? t("Premium+ Coaching", "Premium+ コーチング") : plan.name;
    return `<article class="layout-plan-card layout-${key}">
      ${plan.badge ? `<span class="layout-plan-badge">${t(plan.badge, plan.badgeJa)}</span>` : ""}
      ${visualFor(key)}
      <div class="layout-plan-heading"><p>${name}</p><span>${t(plan.summary, plan.summaryJa)}</span></div>
      <p class="layout-plan-price"><strong>${formatYen(plan.monthlyYen || 0)}</strong><small>${t("per month", "月額")}</small></p>
      ${key === "premium" ? `<div class="layout-offer"><b aria-hidden="true">🎁</b><span><strong>${t("First 30 days free", "最初の30日間無料")}</strong><small>${t(`Second month 50% off · ${formatYen(PREMIUM_PROMOTION.secondMonthYen)}`, `2か月目50%オフ・${formatYen(PREMIUM_PROMOTION.secondMonthYen)}`)}</small></span></div>` : ""}
      <ul>${plan.features.slice(0, layout === "four" ? 4 : 6).map((feature) => `<li><span aria-hidden="true">✓</span>${t(feature.en, feature.ja)}</li>`).join("")}</ul>
      <button class="primary-btn" type="button" disabled>${key === "free" ? t("Try free", "無料で試す") : t(`Ask about ${plan.name}`, `${plan.name}を相談`)}</button>
    </article>`;
  }).join("");
  const fourActive = layout === "four";
  elements.four.classList.toggle("active", fourActive);
  elements.two.classList.toggle("active", !fourActive);
  elements.four.setAttribute("aria-pressed", String(fourActive));
  elements.two.setAttribute("aria-pressed", String(!fourActive));
  elements.status.textContent = fourActive
    ? t("Showing A: all four plans in one horizontal story.", "A案：4プランを横に並べ、全体を一度に比較できます。")
    : t("Showing B: a calmer two-by-two reading layout.", "B案：上2つ・下2つで、各プランをゆったり読めます。")
};

const applySettings = (settings = getSettings()) => {
  applyLanguageMode(languageModeFromSettings(settings));
  applyThemePreference(settings.theme);
  elements.language.value = languageModeFromSettings(settings);
  elements.theme.value = settings.theme;
  render();
};

elements.four.addEventListener("click", () => { layout = "four"; history.replaceState(null, "", "?layout=four"); render(); });
elements.two.addEventListener("click", () => { layout = "two"; history.replaceState(null, "", "?layout=two"); render(); });
elements.language.addEventListener("change", () => updateSettings({ languageMode: elements.language.value, showJapanese: elements.language.value !== "en" }));
elements.theme.addEventListener("change", () => updateSettings({ theme: elements.theme.value }));
onSettingsChange(applySettings);
watchSystemTheme(() => applyThemePreference(getSettings().theme));
applySettings();
installPlayfulInteractions();
