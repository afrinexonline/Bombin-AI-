"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { LaptopFrame, PhoneFrame, Scaled } from "../services/showcase/Frames";
import { DESK, MOB, WEBSITE_DESIGNS } from "../services/showcase/WebsiteDesigns";
import { MARKETING_PREVIEWS, PREVIEW_H, PREVIEW_W } from "../services/showcase/MarketingShowcase";

/*
 * Landing page hero: six slides (Step 4C). Wording is the founder's exact copy.
 * - Auto-advances every 5 s (fade + slight zoom); pauses on hover/touch; pause/play button.
 * - Swipe on phones, arrow keys on computers, cyan pill dots.
 * - "Reduce motion": no auto-advance and no animations.
 * - Same height on every slide; photos (slides 2 and 6) load only when needed.
 * - Screen readers aren't told about automatic changes, only ones the person makes.
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";
const AUTO_MS = 5000;

type Btn = { label: string; kind: "primary" | "ghost"; onClick?: () => void; href?: string; icon?: boolean };

function HeroButton({ b }: { b: Btn }) {
  const cls =
    b.kind === "primary"
      ? `${TOUCH} btn-gradient btn-ready inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white`
      : `${TOUCH} inline-flex items-center justify-center gap-2 rounded-xl border border-[#01C4FA]/40 bg-[#01C4FA]/[0.07] px-7 py-3.5 text-base font-semibold text-white backdrop-blur-xl transition-colors hover:border-[#01C4FA]/70 hover:bg-[#01C4FA]/[0.14]`;
  const inner = <>{b.label}{b.icon && <ArrowRight size={18} aria-hidden="true" />}</>;
  if (b.href) return <Link href={b.href} className={cls} style={{ touchAction: "manipulation" }}>{inner}</Link>;
  return <button type="button" onClick={b.onClick} className={cls} style={{ touchAction: "manipulation" }}>{inner}</button>;
}

/* ── Visuals ── */

/** Fits a visual of the given width/height ratio inside its box, by width AND height. */
function Fit({ ratio, children }: { ratio: number; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <div className="relative" style={{ width: `min(100cqw, calc(100cqh * ${ratio}))`, aspectRatio: String(ratio) }}>{children}</div>
    </div>
  );
}

function GlowVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="absolute h-[78%] w-[78%] rounded-full bg-[#01C4FA]/[0.14] blur-3xl" />
      {[100, 76, 52].map((s, i) => (
        <div key={s} className="hero-breathe absolute rounded-full border border-[#01C4FA]/20" style={{ width: `${s}%`, aspectRatio: "1", animationDelay: `${i * 0.6}s` }} />
      ))}
      <div className="relative flex h-[34%] w-[34%] items-center justify-center rounded-[28%] border border-[#01C4FA]/30 bg-gradient-to-br from-[#0d1a3d]/90 to-[#060b1c]/90 shadow-[0_0_60px_rgba(1,196,250,0.35)] backdrop-blur-xl">
        <Image src="/logo-mark.png" alt="" width={160} height={160} className="h-[70%] w-[70%] object-contain drop-shadow-[0_0_22px_rgba(1,196,250,0.6)]" />
      </div>
    </div>
  );
}

function PhotoVisual({ base, alt, load, priority, mobilePos = "object-top" }: { base: string; alt: string; load: boolean; priority?: boolean; mobilePos?: string }) {
  if (!load) return null;
  return (
    <>
      {/* Phones: lower part of the slide, fading up into the text */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] md:hidden" style={{ maskImage: "linear-gradient(to top, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to top, black 55%, transparent)" }}>
        <Image src={`/hero/${base}-mobile.webp`} alt={alt} fill sizes="100vw" className={`object-cover ${mobilePos}`} priority={priority} />
      </div>
      {/* Computers: right side, fading left into the text */}
      <div className="absolute inset-y-0 right-0 hidden w-[62%] md:block" style={{ maskImage: "linear-gradient(to right, transparent, black 38%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 38%)" }}>
        <Image src={`/hero/${base}-desktop.webp`} alt={alt} fill sizes="62vw" className="object-cover object-center" priority={priority} />
      </div>
      {/* Navy wash + soft cyan glow so text always reads */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#060b1c] via-[#060b1c]/70 to-[#233067]/20 md:bg-gradient-to-r md:from-[#060b1c] md:via-[#060b1c]/60 md:to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-2/3 w-2/3 rounded-full bg-[#01C4FA]/[0.12] blur-3xl" />
    </>
  );
}

function WebsiteVisual() {
  const d = WEBSITE_DESIGNS[0];
  return (
    <div className="hero-float relative mx-auto w-full pb-[7%] pr-[13%]" aria-hidden="true">
      <div className="absolute inset-[10%] rounded-full bg-[#01C4FA]/25 blur-3xl" />
      <div className="relative">
        <LaptopFrame>
          <Scaled width={DESK.w} height={DESK.h}>{d.screens[0].render()}</Scaled>
        </LaptopFrame>
      </div>
      <div className="absolute bottom-0 right-0 w-[27%]">
        <PhoneFrame>
          <Scaled width={MOB.w} height={MOB.h}>{d.mobile()}</Scaled>
        </PhoneFrame>
      </div>
    </div>
  );
}

const BUBBLES: { text: string; side: "l" | "r"; pos: string; delay: string }[] = [
  { text: "How much last?", side: "l", pos: "left-0 top-[4%]", delay: "0s" },
  { text: "₦45,000, and delivery is free today 😊", side: "r", pos: "right-0 top-[17%]", delay: "0.8s" },
  { text: "Do you deliver to Abuja?", side: "l", pos: "left-0 bottom-[17%]", delay: "1.6s" },
  { text: "Oya, I go pay now", side: "r", pos: "right-0 bottom-[3%]", delay: "2.4s" },
];

function AIVisual() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div className="absolute inset-[18%] rounded-full bg-[#01C4FA]/20 blur-3xl" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#01C4FA" stopOpacity="0" />
            <stop offset="0.6" stopColor="#01C4FA" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g className="hero-spin" style={{ transformOrigin: "200px 200px" }}>
          <ellipse cx="200" cy="200" rx="180" ry="70" fill="none" stroke="#01C4FA" strokeOpacity="0.25" />
          <ellipse cx="200" cy="200" rx="180" ry="70" fill="none" stroke="url(#trail)" strokeWidth="2.5" strokeDasharray="120 900" strokeLinecap="round" />
        </g>
        <g className="hero-spin-rev" style={{ transformOrigin: "200px 200px" }}>
          <ellipse cx="200" cy="200" rx="70" ry="175" fill="none" stroke="#01C4FA" strokeOpacity="0.18" transform="rotate(35 200 200)" />
          <ellipse cx="200" cy="200" rx="70" ry="175" fill="none" stroke="url(#trail)" strokeWidth="2" strokeDasharray="90 900" strokeLinecap="round" transform="rotate(35 200 200)" />
        </g>
        <circle cx="200" cy="200" r="120" fill="none" stroke="#233067" strokeOpacity="0.9" strokeWidth="1.5" strokeDasharray="2 8" />
      </svg>
      <div className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%] border border-[#01C4FA]/40 bg-[#081128]/90 shadow-[0_0_70px_rgba(1,196,250,0.45)]">
        <Image src="/logo-mark.png" alt="" width={120} height={120} className="h-[72%] w-[72%] object-contain" />
      </div>
      {BUBBLES.map((b) => (
        <div
          key={b.text}
          className={`hero-bob absolute max-w-[46%] rounded-2xl px-2.5 py-1.5 text-[11px] font-semibold leading-snug min-[400px]:text-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:text-[13px] ${b.pos} ${
            b.side === "l" ? "rounded-tl-sm border border-white/15 bg-white/10 text-white backdrop-blur-md" : "rounded-tr-sm bg-gradient-to-br from-[#01C4FA] to-[#1a8fd6] text-white"
          }`}
          style={{ animationDelay: b.delay }}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}

function MarketingVisual() {
  const picks = [MARKETING_PREVIEWS[0], MARKETING_PREVIEWS[1], MARKETING_PREVIEWS[2]];
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div className="absolute inset-[15%] rounded-full bg-[#01C4FA]/20 blur-3xl" />
      {picks.map((p, i) => (
        <div
          key={p.label}
          className={`hero-float absolute w-[34%] ${i === 0 ? "left-[4%] top-[14%] -rotate-6" : i === 1 ? "z-10 left-[33%] top-[2%]" : "right-[4%] top-[14%] rotate-6"}`}
          style={{ animationDelay: `${i * 0.7}s` }}
        >
          <PhoneFrame>
            <Scaled width={PREVIEW_W} height={PREVIEW_H}>{p.render()}</Scaled>
          </PhoneFrame>
        </div>
      ))}
    </div>
  );
}

/* ── The slides ── */

interface SlideDef {
  key: string;
  label: string;
  headline: ReactNode;
  sub: string;
  buttons: Btn[];
  extra?: ReactNode;
  visual: (load: boolean) => ReactNode;
  photo?: boolean;
}

export default function HeroSlider({ onSignUp }: { onSignUp: () => void }) {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [announce, setAnnounce] = useState(false); // tell screen readers only about chosen slides
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const touch = useRef<{ x: number; y: number } | null>(null);
  const region = useRef<HTMLElement>(null);

  const scrollToDemo = useCallback(() => {
    document.getElementById("live-demo")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  const slides: SlideDef[] = [
    {
      key: "dms-to-cash",
      label: "WhatsApp DMs into cash",
      headline: (
        <>
          Turn Your WhatsApp DMs into{" "}
          <span className="bg-gradient-to-r from-[#01C4FA] via-[#9BE9FF] to-[#01C4FA] bg-[size:200%] bg-clip-text text-transparent motion-safe:animate-gradient-shift">Cash</span> While You{" "}
          <span className="bg-gradient-to-r from-[#9BE9FF] via-[#01C4FA] to-[#9BE9FF] bg-[size:200%] bg-clip-text text-transparent motion-safe:animate-gradient-shift">Sleep</span>
        </>
      ),
      sub: "The only AI closer with Cultural Intelligence. Master English, Pidgin, and local context to close deals 24/7 while you sleep.",
      buttons: [{ label: "Connect WhatsApp", kind: "primary", onClick: onSignUp, icon: true }],
      extra: (
        <>
          <p className="mt-3 text-sm text-white/55">Now in early access. Launching soon.</p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-5 sm:gap-5">
            {[["2", "English & Pidgin"], ["24/7", "Replies 24/7"], ["₦", "Built for Nigerian vendors"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-extrabold text-[#01C4FA] drop-shadow-[0_0_10px_rgba(1,196,250,0.35)] sm:text-3xl">{v}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#9fb0d9]">{l}</p>
              </div>
            ))}
          </div>
        </>
      ),
      visual: () => <Fit ratio={1}><GlowVisual /></Fit>,
    },
    {
      key: "dms-everywhere",
      label: "One AI for all your DMs",
      headline: "DMs Everywhere? Let One AI Handle Them.",
      sub: "Bombin replies to your WhatsApp customers, Instagram and TikTok in seconds.",
      buttons: [{ label: "Create your AI employee", kind: "primary", onClick: onSignUp, icon: true }],
      extra: (
        <div className="mt-4 flex flex-wrap gap-2">
          {["Instagram", "TikTok"].map((n) => (
            <span key={n} className="inline-flex items-center gap-1.5 rounded-full border border-[#01C4FA]/35 bg-[#060b1c]/60 px-3 py-1 text-[12px] font-semibold text-white/85 backdrop-blur-md">
              {n} <span className="rounded-full bg-[#01C4FA]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01C4FA]">Coming soon</span>
            </span>
          ))}
        </div>
      ),
      visual: (load) => <PhotoVisual base="vendor-busy" alt="A vendor busy replying to messages on her phone" load={load} mobilePos="object-[center_80%]" />,
      photo: true,
    },
    {
      key: "websites",
      label: "Website development",
      headline: "Your Business Deserves a Website That Sells.",
      sub: "Beautiful, fast websites for every kind of business, built by Bombin and ready for your customers.",
      buttons: [{ label: "Request a quote", kind: "primary", href: "/services/website-development#calculator", icon: true }],
      visual: () => <Fit ratio={1.6}><WebsiteVisual /></Fit>,
    },
    {
      key: "ai-sales-rep",
      label: "AI sales rep",
      headline: "AI Sales Rep That Speaks Pidgin and English. Never Sleeps. Never Tires. Never Forgets.",
      sub: "Bombin AI qualifies every lead, handles 'last price' and follows up until payment received, so your WhatsApp keeps selling day and night.",
      buttons: [
        { label: "Get started", kind: "primary", onClick: onSignUp, icon: true },
        { label: "See in action", kind: "ghost", onClick: scrollToDemo },
      ],
      visual: () => <Fit ratio={1}><AIVisual /></Fit>,
    },
    {
      key: "ai-marketing",
      label: "AI marketing",
      headline: "Marketing That Thinks for You. Get millions of views and orders with the new AI marketing update.",
      sub: "AI-powered content, SEO, ads and campaigns that bring real buyers to your door, 100% strategic.",
      buttons: [
        { label: "Request a quote", kind: "primary", href: "/services/ai-marketing#calculator", icon: true },
        { label: "Learn more", kind: "ghost", href: "/services/ai-marketing" },
      ],
      visual: () => <Fit ratio={1.3}><MarketingVisual /></Fit>,
    },
    {
      key: "how-much",
      label: "Instant replies",
      headline: "Customer ask 'How much?' Bombin don already reply.",
      sub: "No more losing buyers because you were busy, having fun or sleeping. Your AI answers in seconds, in English or Pidgin, and keeps them talking till they pay.",
      buttons: [{ label: "Start selling with AI", kind: "primary", onClick: onSignUp, icon: true }],
      visual: (load) => <PhotoVisual base="vendor-happy" alt="A happy vendor smiling at her phone in her shop" load={load} />,
      photo: true,
    },
  ];
  const n = slides.length;

  const go = useCallback((i: number, byUser: boolean) => {
    const next = (i + n) % n;
    setActive(next);
    setAnnounce(byUser);
    setLoaded((prev) => (prev.has(next) && prev.has((next + 1) % n) ? prev : new Set([...prev, next, (next + 1) % n])));
  }, [n]);

  // Reduce-motion setting.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Preload the next slide's photo a moment after the page settles.
  useEffect(() => {
    const t = setTimeout(() => setLoaded((prev) => new Set([...prev, 1])), 2500);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance.
  const playing = !reduce && !userPaused && !hover;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") go(active + 1, false);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [playing, active, go]);

  // Arrow keys on computers (not while typing or while a pop-up is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest("input, textarea, select, [contenteditable], [role=tablist], [role=radiogroup]") || document.querySelector('[aria-modal="true"]')) return;
      const r = region.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      e.preventDefault();
      go(active + (e.key === "ArrowRight" ? 1 : -1), true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  return (
    <section
      ref={region}
      aria-roledescription="carousel"
      aria-label="Bombin AI highlights"
      className="relative overflow-hidden bg-[#03060f]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => { setHover(true); touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        setHover(false);
        const s = touch.current;
        touch.current = null;
        if (!s) return;
        const dx = e.changedTouches[0].clientX - s.x;
        const dy = e.changedTouches[0].clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(active + (dx < 0 ? 1 : -1), true);
      }}
      onTouchCancel={() => { setHover(false); touch.current = null; }}
      style={{ touchAction: "pan-y" }}
    >
      {/* Background glow (decoration) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -right-24 -top-32 h-[460px] w-[620px] rounded-full bg-[#01C4FA]/[0.16] blur-[110px]" />
        <div className="absolute -bottom-40 -left-24 h-[480px] w-[520px] rounded-full bg-[#233067]/60 blur-[120px]" />
      </div>

      <div className="relative z-10 h-[760px] min-[400px]:h-[740px] sm:h-[700px] md:h-[600px] lg:h-[640px]" aria-live={announce ? "polite" : "off"}>
        {slides.map((s, i) => {
          const on = i === active;
          return (
            <div
              key={s.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.label}`}
              aria-hidden={!on}
              inert={!on}
              className={`absolute inset-0 ${reduce ? "" : "transition-[opacity,transform] duration-700 ease-out"} ${on ? "z-10 scale-100 opacity-100" : "pointer-events-none z-0 scale-[1.03] opacity-0"}`}
            >
              {/* Photos fill the slide behind the words. */}
              {s.photo && s.visual(loaded.has(i))}

              {/* Words first; a drawn visual fills whatever space is left (below on phones,
                  to the right on computers), so the two can never overlap. */}
              <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-5 pb-16 pt-9 sm:px-8 sm:pt-12 md:flex-row md:items-center md:gap-8 md:pb-14 md:pt-0">
                <div className="max-w-[580px] shrink-0 md:w-[48%] md:max-w-none">
                  <h2
                    className={`text-[clamp(25px,7.5vw,30px)] font-black leading-[1.12] tracking-tight text-white [overflow-wrap:normal] sm:text-4xl lg:text-5xl ${reduce ? "" : "transition-all delay-150 duration-700"} ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                  >
                    {s.headline}
                  </h2>
                  <p className={`mt-4 text-[15px] leading-relaxed text-[#b8c4e0] sm:text-lg ${reduce ? "" : "transition-all delay-300 duration-700"} ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                    {s.sub}
                  </p>
                  <div className={`${reduce ? "" : "transition-all delay-[450ms] duration-700"} ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                    <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
                      {s.buttons.map((b) => <HeroButton key={b.label} b={b} />)}
                    </div>
                    {s.extra}
                  </div>
                </div>
                {!s.photo && <div className="relative mt-6 min-h-0 flex-1 md:mt-0 md:h-[78%] md:max-h-[480px]">{s.visual(true)}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots + pause/play */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1" role="group" aria-label="Choose a slide">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              aria-label={`Slide ${i + 1}: ${s.label}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => go(i, true)}
              style={{ touchAction: "manipulation" }}
              className={`${TOUCH} flex h-8 items-center px-1`}
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-[#01C4FA] shadow-[0_0_12px_rgba(1,196,250,0.75)]" : "w-2 bg-white/30 hover:bg-white/55"}`} />
            </button>
          ))}
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play slides" : "Pause slides"}
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 backdrop-blur-md hover:border-[#01C4FA]/50 hover:text-white`}
          >
            {userPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
