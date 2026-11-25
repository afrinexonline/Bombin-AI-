/*
 * Price tests for src/app/lib/pricing.ts (Step 4A).
 * Run with:  npm test
 * Every expected number below is worked out by hand from the price rules.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { quote, cleanChoices, roundPrice, naira, headlinePrice, DEFAULT_CHOICES } from "../src/app/lib/pricing.ts";

const web = (over: Record<string, unknown> = {}) => quote("website", { ...DEFAULT_CHOICES.website, ...over });
const mkt = (over: Record<string, unknown> = {}) => quote("marketing", { ...DEFAULT_CHOICES.marketing, ...over });
const auto = (over: Record<string, unknown> = {}) => quote("automation", { ...DEFAULT_CHOICES.automation, ...over });

/* ── Helpers ── */

test("naira() adds ₦ and commas", () => {
  assert.equal(naira(1_250_000), "₦1,250,000");
  assert.equal(naira(25_000), "₦25,000");
  assert.equal(naira(0), "₦0");
});

test("roundPrice() rounds to the nearest ₦5,000", () => {
  assert.equal(roundPrice(2_499), 0);
  assert.equal(roundPrice(2_501), 5_000);
  assert.equal(roundPrice(850_500), 850_000);
  assert.equal(roundPrice(297_000), 295_000);
  assert.equal(roundPrice(14_343_750), 14_345_000);
});

/* ── A. Website ── */

test("website: default shows a price straight away", () => {
  const q = web();
  assert.equal(q.oneTime, 450_000);
  assert.equal(q.monthly, null);
  assert.deepEqual(q.weeks, [2, 4]);
  assert.equal(headlinePrice(q), "₦450,000");
});

test("website: multipliers multiply the whole price, then round", () => {
  // 450,000 × 1.35 × 1.12 × 1.25 = 850,500 → ₦850,000
  const q = web({ design: "premium", testing: "advanced", speed: "fast" });
  assert.equal(q.oneTime, 850_000);
  // Fast = about 30% sooner: 2–4 weeks × 0.7 → 1–3 weeks
  assert.deepEqual(q.weeks, [1, 3]);
});

test("website: extra pages and copywriting per page", () => {
  // 450,000 + 5 extra pages × 35,000 + copywriting 10 × 20,000 = 825,000
  assert.equal(web({ pages: 10 }).oneTime, 625_000);
  assert.equal(web({ pages: 10, content: { copywriting: 1 } }).oneTime, 825_000);
});

test("website: web app screens cost ₦75,000 each", () => {
  assert.equal(web({ type: "webapp", pages: 12 }).oneTime, 2_150_000);
});

test("website: products only count for stores and marketplaces", () => {
  assert.equal(web({ type: "ecommerce", pages: 8, products: "upto500" }).oneTime, 1_150_000);
  assert.equal(web({ products: "over500" }).oneTime, 450_000); // business site: no products card
});

test("website: features with a quantity stepper", () => {
  // 450,000 + payments 150,000 + 3 connections × 200,000 = 1,200,000
  assert.equal(web({ features: { payments: 1, connections: 3 } }).oneTime, 1_200_000);
});

test("website: care plan is a separate monthly line", () => {
  const q = web({ care: "pro" });
  assert.equal(q.oneTime, 450_000);
  assert.equal(q.monthly, 75_000);
});

test("website: above ₦15,000,000 becomes a custom project", () => {
  const big = { type: "marketplace", pages: 15, design: "luxury", testing: "critical", speed: "express" };
  // 4,500,000 × 1.7 × 1.25 × 1.5 = 14,343,750 → ₦14,345,000 (still under the maximum)
  assert.equal(web(big).custom, false);
  assert.equal(web(big).oneTime, 14_345_000);
  // + AI chat 350,000 → 15,459,375 → custom
  const q = web({ ...big, features: { aichat: 1 } });
  assert.equal(q.custom, true);
  assert.equal(headlinePrice(q), "Custom project: let's talk on WhatsApp");
});

/* ── B. Marketing ── */

test("marketing: default package shows a monthly price", () => {
  const q = mkt();
  assert.equal(q.main, "monthly");
  assert.equal(q.monthly, 180_000);
  assert.equal(q.oneTime, null);
  assert.equal(headlinePrice(q), "₦180,000 / month");
});

test("marketing: video quality only touches videos, monthly gives 10% off extras", () => {
  // 180,000 + (4 × 25,000 × 1.3) × 0.9 = 297,000 → ₦295,000
  assert.equal(mkt({ content: { aiShort: 4 }, quality: "premium" }).monthly, 295_000);
  // graphics are not videos: 180,000 + 10 × 15,000 × 0.9 = 315,000
  assert.equal(mkt({ content: { graphics: 10 }, quality: "cinematic" }).monthly, 315_000);
});

test("marketing: ads setup is a one-time line, platforms are monthly", () => {
  const q = mkt({ services: { ads: 1 } });
  assert.equal(q.monthly, 315_000); // 180,000 + 150,000 × 0.9
  assert.equal(q.oneTime, 100_000);
  assert.ok(q.notes.some((n) => n.includes("Ad budget")));
});

test("marketing: complexity and rush apply to everything, including the package", () => {
  // 180,000 × 1.2 × 1.3 = 280,800 → ₦280,000
  assert.equal(mkt({ complexity: "growing", turnaround: "rush" }).monthly, 280_000);
});

test("marketing: one-time project, and the ₦25,000 minimum", () => {
  const q = mkt({ package: "none", billing: "oneTime", services: { strategy: 1, seo: 2 } });
  assert.equal(q.main, "oneTime");
  assert.equal(q.oneTime, 425_000); // SEO Growth 350,000 + session 75,000
  const empty = mkt({ package: "none", billing: "oneTime" });
  assert.equal(empty.oneTime, 25_000);
  assert.equal(empty.atMinimum, true);
});

test("marketing: a package is always monthly, even if the browser says otherwise", () => {
  assert.equal(cleanChoices("marketing", { package: "premium", billing: "oneTime" }).billing, "monthly");
  assert.equal(headlinePrice(mkt({ package: "premium" })), "from ₦1,000,000 / month");
});

test("marketing: above ₦4,000,000 a month becomes a custom project", () => {
  const q = mkt({ package: "premium", complexity: "advanced", turnaround: "rush", services: { seo: 3, social: 6, broadcast: 10 } });
  assert.equal(q.custom, true);
});

/* ── C. Automation ── */

test("automation: default", () => {
  const q = auto();
  assert.equal(q.oneTime, 4_900_000); // 3,500,000 × 1.4
  assert.deepEqual(q.weeks, [3, 5]);
});

test("automation: extra workflows add price and a week each", () => {
  const q = auto({ workflows: 3 });
  assert.equal(q.oneTime, 6_580_000); // (3,500,000 + 2 × 600,000) × 1.4
  assert.deepEqual(q.weeks, [5, 7]);
});

test("automation: first 2 tools included, custom systems extra", () => {
  // (3,500,000 + 2 × 250,000 + 750,000) × 1.4 = 6,650,000
  assert.equal(auto({ tools: { standard: 4, custom: 1 } }).oneTime, 6_650_000);
});

test("automation: priority delivery is sooner", () => {
  // 3–5 weeks × 0.7 → 2–4 weeks; price × 1.3
  const q = auto({ speed: "priority" });
  assert.deepEqual(q.weeks, [2, 4]);
  assert.equal(q.oneTime, 6_370_000);
});

test("automation: never below ₦2,000,000, custom above ₦50,000,000", () => {
  const small = auto({ type: "workflow", smart: "rules" });
  assert.equal(small.oneTime, 2_000_000);
  const huge = auto({ type: "custom", smart: "critical", volume: "v4", speed: "priority" });
  assert.equal(huge.custom, true); // 15,000,000 × 2.5 × 1.6 × 1.3 = 78,000,000
});

test("automation: care plan is monthly", () => {
  assert.equal(auto({ care: "growth" }).monthly, 400_000);
});

/* ── Safety: the server cleans whatever the browser sends ── */

test("cleanChoices() keeps numbers in range and ignores unknown values", () => {
  const c = cleanChoices("website", { type: "spaceship", pages: 999, features: { payments: 5, hack: 3, blog: -2 } });
  assert.equal(c.type, "business");
  assert.equal(c.pages, 60);
  assert.deepEqual(c.features, { payments: 1 });
  assert.equal(quote("website", "nonsense").oneTime, 450_000);
});
