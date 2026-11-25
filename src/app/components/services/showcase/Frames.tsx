"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Shared showcase building blocks (Step 4B): device frames, a "draw at full size then
 * shrink to fit" wrapper, and a swipe carousel with cyan pill dots. All in code, no images.
 */

/** Draws its child at a fixed design size, then scales it down to the available width. */
export function Scaled({ width, height, children, className }: { width: number; height: number; children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={box} className={`relative w-full overflow-hidden ${className ?? ""}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

/** Sleek laptop: screen with thin bezel + base. */
export function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="rounded-t-[14px] border border-white/15 bg-gradient-to-b from-[#1b2340] to-[#0b1022] p-[2.2%] pb-[2.6%] shadow-[0_20px_50px_rgba(0,0,0,0.45)] light:border-[#233067]/20 light:from-[#2b3558] light:to-[#151b33]">
        <div className="overflow-hidden rounded-[6px] bg-black ring-1 ring-black/40">{children}</div>
      </div>
      <div className="relative mx-[-4%] h-[10px] rounded-b-[10px] bg-gradient-to-b from-[#3a4466] to-[#1a2038] shadow-[0_8px_18px_rgba(0,0,0,0.4)]">
        <div className="absolute left-1/2 top-0 h-[4px] w-[14%] -translate-x-1/2 rounded-b-md bg-[#11162b]" />
      </div>
    </div>
  );
}

/** Modern phone: rounded body, thin bezel, small island. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[22%/10.5%] border border-white/20 bg-gradient-to-b from-[#202a4a] to-[#0b1022] p-[4.5%] shadow-[0_18px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(1,196,250,0.15)] light:border-[#233067]/25 ${className ?? ""}`}>
      <div className="relative overflow-hidden rounded-[18%/8.5%] bg-black">
        {children}
        <div className="absolute left-1/2 top-[1.6%] z-10 h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** Browser window frame for the full-screen view. */
export function BrowserFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0d1428] shadow-[0_16px_40px_rgba(0,0,0,0.35)] light:border-[#233067]/15">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#111a33] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="ml-2 truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-[11px] text-white/55">{label}</span>
      </div>
      {children}
    </div>
  );
}

/** Swipe carousel (phones/tablets) with cyan pill dots. Items snap into place. */
export function Carousel({ count, children, label }: { count: number; children: (i: number) => ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    items.forEach((it, i) => {
      const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    setActive(best);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const it = el?.children[i] as HTMLElement | undefined;
    if (!el || !it) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: it.offsetLeft - (el.clientWidth - it.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="w-[84%] max-w-[420px] shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`}>
            {children(i)}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={`${label}: choose a slide`}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Show ${i + 1} of ${count}`}
            onClick={() => go(i)}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 flex h-6 cursor-pointer items-center touch-action-manipulation"
          >
            <span className={`block h-2 rounded-full transition-all duration-300 ${active === i ? "w-6 bg-[#01C4FA] shadow-[0_0_10px_rgba(1,196,250,0.6)]" : "w-2 bg-[var(--text-faint)]"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Section heading used by all three showcases. */
export function ShowcaseHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-xl text-sm text-[var(--text-muted)] sm:text-base">{sub}</p>
    </div>
  );
}
