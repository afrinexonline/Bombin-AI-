"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing, Camera, Clock, Flame, Languages, MessageCircle, Music, ReceiptText, Sparkles, Tag, type LucideIcon } from "lucide-react";
import SiteHeader from "../site/SiteHeader";
import WhatsAppSimulator from "../site/WhatsAppSimulator";
import WaitlistDialog from "../site/WaitlistDialog";
import { interestLink } from "../../lib/orders";
import type { WaitlistChoice } from "../../lib/waitlist";

/*
 * /services/whatsapp-ai-assistant (Step 4B). No prices on this page.
 * Honest wording: Bombin is in early access, so features are described as what the
 * assistant is built to do, and unbuilt features are clearly marked "Coming soon".
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Clock, title: "Instant replies, 24/7", text: "Answers every customer within seconds, day and night, even while you sleep." },
  { icon: Languages, title: "English & Pidgin", text: "Talks the way your customers talk, in clear English or easy Pidgin." },
  { icon: Tag, title: "Handles “last price”", text: "Holds your price with friendly, confident replies when buyers start to haggle." },
  { icon: BellRing, title: "Follows up quiet buyers", text: "Gently checks back on customers who went quiet, until they're ready to pay." },
  { icon: Flame, title: "Hands hot chats to you", text: "When a buyer is ready or needs a human touch, it passes the chat straight to you." },
];

const SOON: { icon: LucideIcon; title: string; text: string; waitlist?: WaitlistChoice }[] = [
  { icon: ReceiptText, title: "Receipt checking", text: "Reads payment screenshots and receipts for you." },
  { icon: Camera, title: "Instagram assistant", text: "AI replies to Instagram DMs and comments.", waitlist: "instagram" },
  { icon: Music, title: "TikTok assistant", text: "Turns TikTok comments and DMs into sales.", waitlist: "tiktok" },
];

export default function WhatsAppAssistantPage() {
  const [waitlist, setWaitlist] = useState<WaitlistChoice | null>(null);
  const waLink = interestLink("the WhatsApp AI Assistant");

  const buttons = (
    <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <Link
        href="/?signup=1"
        style={{ touchAction: "manipulation" }}
        className={`${TOUCH} btn-gradient btn-ready flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white`}
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        Join early access
      </Link>
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
  );

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--bg-body)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#01C4FA]/[0.13] blur-[120px] light:bg-[#01C4FA]/[0.16]" />
        <div className="absolute -left-32 top-48 h-[420px] w-[420px] rounded-full bg-[#233067]/40 blur-[120px] light:bg-[#233067]/[0.12]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(1,196,250,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(1,196,250,0.045)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pb-24">
        {/* ── Intro ── */}
        <section className="mx-auto max-w-4xl px-5 pb-14 pt-14 text-center sm:pt-20">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#01C4FA]/30 bg-[#01C4FA]/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#01C4FA] backdrop-blur-xl light:text-[#0b7fae]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#01C4FA] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#01C4FA]" />
            </span>
            Early access
          </p>
          <h1 className="text-balance text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-white via-[#9BE9FF] to-[#01C4FA] bg-clip-text text-transparent light:from-[#233067] light:via-[#233067] light:to-[#01C4FA]">
              Your AI Sales Rep on WhatsApp.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Replies to every customer in seconds, in English or Pidgin, handles &lsquo;last price&rsquo; and follows up until they pay.
          </p>
          {buttons}
        </section>

        {/* ── What it does ── */}
        <section aria-labelledby="does-title" className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="does-title" className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">What your AI sales rep does</h2>
          <p className="mx-auto mt-1.5 max-w-xl text-center text-sm text-[var(--text-muted)] sm:text-base">Built to sell the way you would, on every chat, at the same time.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card group rounded-3xl p-6">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_22px_rgba(1,196,250,0.22)] transition-transform duration-300 group-hover:scale-105 light:text-[#0b7fae]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{f.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Live chat simulator (shared with the landing page) ── */}
        <section aria-labelledby="sim-title" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h2 id="sim-title" className="text-2xl font-extrabold tracking-tight sm:text-3xl">Watch it close a sale</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)] lg:mx-0">
                An example chat: a customer asks the price, pushes back on cost and delivery, and the AI answers in a mix of English and Pidgin until the customer is ready to pay.
              </p>
            </div>
            <div className="relative flex justify-center">
              <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl bg-[#01C4FA]/[0.08] blur-3xl" aria-hidden="true" />
              <WhatsAppSimulator />
            </div>
          </div>
        </section>

        {/* ── Coming soon ── */}
        <section aria-labelledby="soon-title" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 id="soon-title" className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">Coming soon</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SOON.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card-static flex flex-col rounded-3xl p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--text-muted)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-[#01C4FA]/30 bg-[#01C4FA]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#01C4FA] light:text-[#0b7fae]">
                      Coming soon
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{f.title}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.text}</p>
                  {f.waitlist && (
                    <button
                      type="button"
                      onClick={() => setWaitlist(f.waitlist!)}
                      style={{ touchAction: "manipulation" }}
                      className={`${TOUCH} mt-4 self-start rounded-xl border border-[#01C4FA]/35 px-4 py-2 text-sm font-semibold text-[#01C4FA] transition-colors hover:bg-[#01C4FA]/10 light:text-[#0b7fae]`}
                    >
                      Join the waitlist
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Final call to action ── */}
        <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6">
          <div className="glass-card-static relative overflow-hidden rounded-3xl border-[#01C4FA]/25 px-6 py-12 text-center shadow-[0_0_50px_rgba(1,196,250,0.12)]">
            <div className="pointer-events-none absolute -top-24 left-1/2 z-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#01C4FA]/15 blur-3xl" aria-hidden="true" />
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Be one of the first vendors to try it</h2>
              <p className="mx-auto mt-2 max-w-xl text-[15px] text-[var(--text-secondary)]">Join early access and help shape your AI sales rep.</p>
              {buttons}
            </div>
          </div>
        </section>
      </main>

      {waitlist && <WaitlistDialog initial={waitlist} onClose={() => setWaitlist(null)} />}
    </div>
  );
}
