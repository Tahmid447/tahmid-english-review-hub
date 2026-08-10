import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BILLING_OPTIONS, CONTACT_CHANNELS, PLAN_CATALOG, PLAN_ORDER, planMeetsRequirement, planPrice } from "../src/plans.js";

const root = new URL("../", import.meta.url);
const [pricingPage, pricingUi, lessonPage, lessonUi, store, teacherUi, membershipFunction, migration, build] = await Promise.all([
  readFile(new URL("pricing.html", root), "utf8"),
  readFile(new URL("src/pricing.js", root), "utf8"),
  readFile(new URL("lesson.html", root), "utf8"),
  readFile(new URL("src/lesson.js", root), "utf8"),
  readFile(new URL("src/store.js", root), "utf8"),
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

assert.doesNotMatch(`${pricingPage}\n${pricingUi}`, /YOUR_LINE_ID|YOUR_HANDLE|payment (?:complete|successful)/i);
assert.match(pricingUi, /PLAN_CATALOG/);
assert.match(pricingUi, /contactMessage/);
assert.match(pricingPage, /id="contactDialog"/);
assert.match(pricingPage, /line-qr\.jpeg/);
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
assert.match(teacherUi, /Tier & feature override/);
assert.match(teacherUi, /review_learner_plan_overrides/);
assert.match(teacherUi, /premium_plus/);
assert.match(membershipFunction, /\["standard", "premium", "premium_plus"\]/);

console.log("Plan platform tests passed.");
console.log("  ✓ fixed Free, Standard, Premium and Premium+ names and prices");
console.log("  ✓ verified LINE/Instagram contact configuration without fake checkout");
console.log("  ✓ central settings, type practice and auto-pronunciation hooks");
console.log("  ✓ Premium+ database, Teacher Studio and access-code integration");
