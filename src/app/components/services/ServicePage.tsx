"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowDown, Clock, MessageCircle, Sparkles } from "lucide-react";
import SiteHeader from "../site/SiteHeader";
import CalculatorCard from "./CalculatorCard";
import AnimatedPrice from "./AnimatedPrice";
import ReviewOrder from "./ReviewOrder";
import WebsiteShowcase from "./showcase/WebsiteShowcase";
import MarketingShowcase from "./showcase/MarketingShowcase";
import AutomationShowcase from "./showcase/AutomationShowcase";
import { DEFAULT_CHOICES, SERVICES, WEBSITE, cleanChoices, naira, quote, visibleCards, type Choices, type ServiceId } from "../../lib/pricing";
import { interestLink } from "../../lib/orders";

/*
 * A public service page (Step 4A): short premium intro, then the price calculator with a
 * sticky price bar (phones) / sticky side panel (computers), then Review order.
 * All prices come from src/app/lib/pricing.ts.
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

const reduceMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function ServicePage({ service, headline, subheadline }: { service: ServiceId; headline: string; subheadline: string }) {
  const svc = SERVICES[service];
  const [choices, setChoices] = useState<Choices>(() => cleanChoices(service, DEFAULT_CHOICES[service]));
  const [reviewing, setReviewing] = useState(false);

  const setChoice = useCallback(
    (cardId: string, value: Choices[string]) => {
      setChoices((prev) => {
        const next: Choices = { ...prev, [cardId]: value };
        // Website: a new type starts with the pages it already includes.
        // If the person had added extra pages, keep that number (never below what's included).
        if (service === "website" && cardId === "type") {
          const types = WEBSITE.cards[0].options!;
          const oldIncluded = types.find((o) => o.id === prev.type)?.includedPages ?? 1;
          const newIncluded = types.find((o) => o.id === value)?.includedPages ?? 1;
          const hadExtra = Number(prev.pages) > oldIncluded;
          next.pages = hadExtra ? Math.max(newIncluded, Number(prev.pages)) : newIncluded;
        }
        // Marketing: picking a package means monthly.
        if (service === "marketing" && cardId === "package" && value !== "none") next.billing = "monthly";
        return cleanChoices(service, next);
      });
    },
    [service],
  );

  const q = useMemo(() => quote(service, choices), [service, choices]);
  const cards = visibleCards(svc, choices);
  const webType = service === "website" ? WEBSITE.cards[0].options!.find((o) => o.id === choices.type) : undefined;
  const mainValue = (q.main === "monthly" ? q.monthly : q.oneTime) ?? 0;
  const priceLabel = q.main === "monthly" ? "Estimated price per month" : "Estimated price";
  const waLink = interestLink(svc.name);

  // A plain function (not a component), so the animated number keeps running between changes.
  const renderPrice = (big?: boolean) =>
    q.custom ? (
      <span className={`block font-extrabold leading-tight text-[var(--text-primary)] ${big ? "text-xl" : "text-[15px]"}`}>
        Custom project: <span className="text-[#01C4FA]">let&apos;s talk on WhatsApp</span>
      </span>
    ) : (
      <span className={`block font-extrabold leading-tight text-[var(--text-primary)] ${big ? "text-3xl" : "text-2xl"}`}>
        {q.fromPrice && <span className="mr-1 text-base font-semibold text-[var(--text-muted)]">from</span>}
        <AnimatedPrice value={mainValue} />
        {q.main === "monthly" && <span className="ml-1 text-sm font-semibold text-[var(--text-muted)]">/ month</span>}
      </span>
    );

  const secondLine =
    q.main === "oneTime" && q.monthly
      ? `+ ${naira(q.monthly)} / month`
      : q.main === "monthly" && q.oneTime
        ? `+ ${naira(q.oneTime)} one-time setup`
        : null;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-body)] text-[var(--text-primary)]">
      {/* Background glows (decoration only) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[720px] overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#01C4FA]/[0.13] blur-[120px] light:bg-[#01C4FA]/[0.16]" />
        <div className="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-[#233067]/40 blur-[120px] light:bg-[#233067]/[0.12]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(1,196,250,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(1,196,250,0.045)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pb-40 lg:pb-20">
        {/* ── Intro ── */}
        <section className="mx-auto max-w-4xl px-5 pb-14 pt-14 text-center sm:pt-20">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#01C4FA]/25 bg-[#01C4FA]/[0.07] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#01C4FA] backdrop-blur-xl light:text-[#0b7fae]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {svc.name}
          </p>
          <h1 className="text-balance text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-white via-[#9BE9FF] to-[#01C4FA] bg-clip-text text-transparent light:from-[#233067] light:via-[#233067] light:to-[#01C4FA]">
              {headline}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">{subheadline}</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="#calculator"
              style={{ touchAction: "manipulation" }}
              className={`${TOUCH} btn-gradient btn-ready flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white`}
            >
              Get your price
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ touchAction: "manipulation" }}
              className={`${TOUCH} flex items-center justify-center gap-2 rounded-xl border border-[#01C4FA]/35 bg-[#01C4FA]/[0.06] px-7 py-3.5 text-base font-semibold text-[var(--text-primary)] backdrop-blur-xl transition-all hover:border-[#01C4FA]/60 hover:bg-[#01C4FA]/[0.12] light:border-[#233067]/20 light:bg-white/70`}
            >
              <MessageCircle className="h-5 w-5 text-[#01C4FA]" aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </section>

        {/* ── Showcase (Step 4B) ── */}
        <div id="showcase">
          {service === "website" && (
            <WebsiteShowcase
              onPickType={(typeId) => {
                setChoice("type", typeId);
                requestAnimationFrame(() => document.getElementById("card-type")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }));
              }}
            />
          )}
          {service === "marketing" && <MarketingShowcase />}
          {service === "automation" && <AutomationShowcase />}
        </div>

        {/* ── Calculator ── */}
        <section id="calculator" aria-labelledby="calc-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
          <div className="mb-6 text-center sm:mb-8">
            <h2 id="calc-title" className="text-2xl font-extrabold tracking-tight sm:text-3xl">Build your price</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)] sm:text-base">Pick what you need. Your estimate updates as you go.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="flex min-w-0 flex-col gap-4">
              {cards.map((c, i) => (
                <CalculatorCard
                  key={c.id}
                  service={service}
                  card={c}
                  number={i + 1}
                  choices={choices}
                  setChoice={setChoice}
                  pageWord={webType?.pageWord ?? "pages"}
                  includedPages={webType?.includedPages}
                  pageUnitPrice={webType?.extraPagePrice}
                />
              ))}
            </div>

            {/* Side panel (computers) */}
            <aside className="sticky top-24 hidden lg:block" aria-label="Your estimate">
              <div className="glass-card-static relative overflow-hidden rounded-3xl border-[#01C4FA]/25 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_40px_rgba(1,196,250,0.1)] light:shadow-[0_20px_50px_rgba(35,48,103,0.12)]">
                <div className="pointer-events-none absolute -right-16 -top-16 z-0 h-48 w-48 rounded-full bg-[#01C4FA]/15 blur-3xl" aria-hidden="true" />
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">{q.custom ? "Estimated price" : priceLabel}</p>
                  <div className="mt-1">
                    {renderPrice(true)}
                  </div>
                  {secondLine && <p className="mt-1.5 text-sm font-semibold text-[#01C4FA] light:text-[#0b7fae]">{secondLine}</p>}
                  {q.atMinimum && <p className="mt-1 text-xs text-[var(--text-muted)]">Our minimum for {svc.name}</p>}
                  <p className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--border-card)] px-3 py-2.5 text-sm text-[var(--text-secondary)]">
                    <Clock className="h-4 w-4 shrink-0 text-[#01C4FA]" aria-hidden="true" />
                    <span>
                      Estimated delivery: <strong className="font-semibold text-[var(--text-primary)]">{q.deliveryText}</strong>
                    </span>
                  </p>
                  <ul className="mt-4 max-h-[38vh] space-y-1.5 overflow-y-auto pr-1 text-[13px]">
                    {q.lines
                      .filter((l) => l.part === "oneTime" || l.part === "monthly")
                      .map((l, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span className="min-w-0 truncate text-[var(--text-muted)]">{l.label}</span>
                          <span className="shrink-0 tabular-nums text-[var(--text-secondary)]">
                            {l.tag ?? (l.amount !== undefined ? naira(l.amount) : "")}
                            {l.part === "monthly" && l.amount ? "/mo" : ""}
                          </span>
                        </li>
                      ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setReviewing(true)}
                    style={{ touchAction: "manipulation" }}
                    className={`${TOUCH} btn-gradient btn-ready mt-5 w-full px-6 py-3.5 text-base font-bold text-white`}
                  >
                    Review order
                  </button>
                  <p className="mt-3 text-center text-xs leading-relaxed text-[var(--text-dimmed)]">Estimate only. We confirm the final price on WhatsApp before any payment.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Sticky price bar (phones and tablets) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#01C4FA]/20 bg-[#070d22]/85 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden light:border-[#233067]/12 light:bg-white/85 light:shadow-[0_-12px_40px_rgba(35,48,103,0.12)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--text-muted)]">{q.custom ? "Estimated price" : priceLabel}</p>
            {renderPrice()}
            <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
              {secondLine ? <span className="font-semibold text-[#01C4FA] light:text-[#0b7fae]">{secondLine} · </span> : null}
              {q.deliveryText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReviewing(true)}
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} btn-gradient btn-ready shrink-0 px-5 py-3 text-[15px] font-bold text-white`}
          >
            Review order
          </button>
        </div>
      </div>

      {reviewing && <ReviewOrder service={service} choices={choices} onClose={() => setReviewing(false)} />}
    </div>
  );
}
