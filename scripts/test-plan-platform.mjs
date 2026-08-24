import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  BILLING_OPTIONS,
  CONTACT_CHANNELS,
  PLAN_CATALOG,
  PLAN_COMPARISON,
  PLAN_ORDER,
  PREMIUM_PROMOTION,
  contactMessage,
  planMeetsRequirement,
  planPrice,
  planSavings,
  promotionApplies,
} from "../src/plans.js";

const root = new URL("../", import.meta.url);
const [pricingPage, pricingUi, lessonPage, lessonUi, store, styles, teacherUi, membershipFunction, migration, build] = await Promise.all([
  readFile(new URL("pricing.html", root), "utf8"),
  readFile(new URL("src/pricing.js", root), "utf8"),
  readFile(new URL("lesson.html", root), "utf8"),
  readFile(new URL("src/lesson.js", root), "utf8"),
  readFile(new URL("src/store.js", root), "utf8"),
  readFile(new URL("src/styles.css", root), "utf8"),
  readFile(new URL("src/teacher.js", root), "utf8"),
  readFile(new URL("supabase/functions/membership-access/index.ts", root), "utf8"),
  readFile(new URL("supabase/migrations/202608110014_premium_plus_and_entitlements.sql", root), "utf8"),
  readFile(new URL("scripts/build.mjs", root), "utf8"),
]);

assert.deepEqual(PLAN_ORDER, ["free", "standard", "premium", "premium_plus"]);
assert.equal(PLAN_CATALOG.free.name, "Free");
assert.equal(PLAN_CATALOG.standard.name, "Standard");
assert.equal(PLAN_CATALOG.premium.name, "Premium");
assert.equal(PLAN_CATALOG.premium_plus.name, "Premium+");
assert.equal(planPrice("free"), 0);
assert.equal(planPrice("standard"), 3980);
assert.equal(planPrice("premium"), 6980);
assert.equal(planPrice("premium_plus"), 16800);
assert.equal(planPrice("standard", BILLING_OPTIONS.sixMonths), 20300);
assert.equal(planPrice("premium", BILLING_OPTIONS.sixMonths), 35600);
assert.equal(planPrice("premium_plus", BILLING_OPTIONS.sixMonths), 85700);
assert.equal(planMeetsRequirement("premium_plus", "premium"), true);
assert.equal(planMeetsRequirement("standard", "premium"), false);
assert.equal(CONTACT_CHANNELS.line.url, "https://line.me/ti/p/v6YfxZ1gSI");
assert.equal(CONTACT_CHANNELS.instagram.url, "https://www.instagram.com/tahmidahmedo?utm_source=qr");
assert.deepEqual(planSavings("standard"), {
  monthlyTotal: 23880,
  savedYen: 3580,
  percent: 15,
  monthlyEquivalentYen: 3383,
});
assert.deepEqual(planSavings("premium"), {
  monthlyTotal: 41880,
  savedYen: 6280,
  percent: 15,
  monthlyEquivalentYen: 5933,
});
assert.deepEqual(planSavings("premium_plus"), {
  monthlyTotal: 100800,
  savedYen: 15100,
  percent: 15,
  monthlyEquivalentYen: 14283,
});
assert.equal(PREMIUM_PROMOTION.trialDays, 30);
assert.equal(PREMIUM_PROMOTION.secondMonthDiscountPercent, 50);
assert.equal(PREMIUM_PROMOTION.secondMonthYen, 3490);
assert.equal(PREMIUM_PROMOTION.manualConfirmation, true);
assert.equal(promotionApplies("premium", BILLING_OPTIONS.monthly), true);
assert.equal(promotionApplies("premium", BILLING_OPTIONS.sixMonths), false);
assert.equal(promotionApplies("premium_plus", BILLING_OPTIONS.monthly), false);
assert.equal(PLAN_COMPARISON.length, 13);
assert.equal(PLAN_COMPARISON.find((row) => row.label === "Live lesson duration")?.values.premium_plus, "50 minutes");
assert.match(contactMessage("premium", BILLING_OPTIONS.sixMonths, "en", "Aya"), /Aya/);
assert.match(contactMessage("premium", BILLING_OPTIONS.sixMonths, "en", "Aya"), /¥35,600/);
assert.match(contactMessage("premium", BILLING_OPTIONS.sixMonths, "ja", "彩"), /彩/);
assert.match(contactMessage("premium", BILLING_OPTIONS.monthly, "en"), /30 days free/);
assert.match(contactMessage("premium", BILLING_OPTIONS.monthly, "en"), /¥3,490/);
assert.match(contactMessage("premium", BILLING_OPTIONS.monthly, "ja"), /30日間無料/);
assert.doesNotMatch(contactMessage("standard", BILLING_OPTIONS.monthly, "en"), /30 days free/);

assert.doesNotMatch(`${pricingPage}\n${pricingUi}`, /YOUR_LINE_ID|YOUR_HANDLE|payment (?:complete|successful)/i);
assert.match(pricingUi, /PLAN_CATALOG/);
assert.match(pricingUi, /contactMessage/);
assert.match(pricingPage, /id="contactDialog"/);
assert.match(pricingPage, /line-qr\.jpeg/);
assert.match(pricingPage, /line-qr\.jpeg[^>]*loading="lazy"[^>]*decoding="async"/);
assert.match(pricingPage, /id="themeToggle"/);
assert.match(pricingPage, /id="mobileSettingsToggle"/);
assert.match(pricingPage, /te-review-hub:theme:v1/);
assert.match(pricingUi, /applyThemePreference/);
assert.match(pricingUi, /watchSystemTheme/);
assert.match(pricingUi, /import "\.\/pwa\.js"/);
assert.match(pricingPage, /id="contactName"/);
assert.match(pricingPage, /id="resetContactMessage"/);
assert.doesNotMatch(pricingPage.match(/<textarea id="contactMessage"[^>]*>/)?.[0] || "", /readonly/);
assert.match(pricingUi, /messageDirty/);
assert.match(pricingUi, /navigator\.clipboard\.writeText\(elements\.message\.value\)/);
assert.match(pricingUi, /PLAN_COMPARISON/);
assert.match(pricingUi, /planSavings/);
assert.match(pricingUi, /premium-promotion/);
assert.match(pricingUi, /premium-promotion-gift/);
assert.match(pricingUi, />🎁</);
assert.match(pricingUi, /normally.*monthlyTotal/);
assert.match(store, /theme: "light"/);
assert.match(styles, /2026-08-20 · unified premium clarity layer/);
assert.match(styles, /Pricing polish:[\s\S]*\.plan-badge[\s\S]*right: 18px;[\s\S]*border-radius: 999px/);
assert.match(styles, /max-width: 1399px[\s\S]*\.plan-grid \{ grid-template-columns: repeat\(2,minmax\(0,1fr\)\); \}/);
assert.match(pricingUi, /Premium\+ Coaching/);
assert.doesNotMatch(pricingUi, /coaching-orbit/);
assert.doesNotMatch(styles, /coaching-orbit|review-pulse/);
assert.match(pricingUi, /coaching-calendar[\s\S]*LIVE[\s\S]*01[\s\S]*02[\s\S]*03/);
assert.match(styles, /@property --premium-coaching-angle/);
assert.match(styles, /premium-coaching-border 12s linear infinite/);
assert.match(styles, /coaching-session-glow 3\.6s ease-in-out infinite/);
assert.match(styles, /\.lesson-card-locked::after[\s\S]*height: 150px[\s\S]*background: linear-gradient\(to top,var\(--learner-surface\)/);
assert.match(styles, /\.plan-card\.premium-plus::before[\s\S]*premium-signature-border/);
assert.match(styles, /prefers-reduced-motion[\s\S]*premium-plus::before[\s\S]*animation: none/);
assert.match(styles, /\.lesson-card-locked \.en,[\s\S]*filter: none/);
assert.match(styles, /\.billing-switch button:not\(\.active\) small \{ color: #76520e; \}/);
assert.match(styles, /html\[data-theme="dark"\] \.billing-switch button:not\(\.active\) small \{ color: #f0cc76; \}/);
assert.match(build, /"pricing\.html"/);
assert.match(build, /"plans\.js"/);
assert.match(build, /"pricing\.js"/);

assert.match(lessonPage, /id="lessonSettingsDialog"/);
assert.match(lessonPage, /id="questionTypeFilter"/);
assert.match(lessonPage, /id="autoPronounceChoices"/);
assert.match(store, /playbackRate: 1/);
assert.match(store, /autoPronounceChoices: true/);
assert.match(lessonUi, /setQuestionTypeFilter/);
assert.match(lessonUi, /state\.settings\.autoPronounceChoices !== false/);
assert.match(lessonUi, /speakText\(pronunciation/);
assert.match(lessonUi, /bindRovingRadioGroup/);
assert.match(lessonUi, /event\.stopPropagation\(\)/);
assert.match(lessonUi, /\[document\.body, document\.documentElement\]\.includes\(document\.activeElement\)/);

for (const fragment of [
  "premium_plus",
  "review_plan_rank",
  "review_effective_plan()",
  "review_plan_meets_requirement",
  "review_can_read_question",
  "review_question_teasers",
  "review_approve_membership_tiered",
  "review_create_access_code_tiered",
]) {
  assert.ok(migration.includes(fragment), `Premium+ migration is missing ${fragment}.`);
}
assert.match(teacherUi, /Plan & feature exceptions/);
assert.match(teacherUi, /review_learner_plan_overrides/);
assert.match(teacherUi, /premium_plus/);
assert.match(membershipFunction, /\["standard", "premium", "premium_plus"\]/);

console.log("Plan platform tests passed.");
console.log("  ✓ fixed Free, Standard, Premium and Premium+ names and prices");
console.log("  ✓ verified LINE/Instagram contact configuration without fake checkout");
console.log("  ✓ central settings, type practice and auto-pronunciation hooks");
console.log("  ✓ Premium+ database, Teacher Studio and access-code integration");
