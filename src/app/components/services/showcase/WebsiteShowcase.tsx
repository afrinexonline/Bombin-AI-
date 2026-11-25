"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, Expand, X } from "lucide-react";
import { BrowserFrame, Carousel, LaptopFrame, PhoneFrame, Scaled, ShowcaseHeading } from "./Frames";
import { DESK, MOB, WEBSITE_DESIGNS, type WebsiteDesign } from "./WebsiteDesigns";

/*
 * Website Development showcase (Step 4B): "What we can build for you".
 * Phones: swipe carousel with cyan dots. Computers: 3 × 2 grid.
 * Tapping a design opens a full-screen glass view with 3 screens and "Get your price".
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

function DeviceCard({ d, onOpen }: { d: WebsiteDesign; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${d.title}: open the full view`}
      style={{ touchAction: "manipulation" }}
      className={`${TOUCH} group block w-full rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 pb-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#01C4FA]/40 hover:shadow-[0_18px_50px_rgba(1,196,250,0.14)] sm:p-5`}
    >
      <div className="relative pb-[6%] pr-[14%]">
        <div className="pointer-events-none absolute inset-6 z-0 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-60" style={{ background: d.glow }} aria-hidden="true" />
        <div className="relative z-10">
          <LaptopFrame>
            <Scaled width={DESK.w} height={DESK.h}>{d.screens[0].render()}</Scaled>
          </LaptopFrame>
        </div>
        <div className="absolute bottom-0 right-0 z-20 w-[27%]">
          <PhoneFrame>
            <Scaled width={MOB.w} height={MOB.h}>{d.mobile()}</Scaled>
          </PhoneFrame>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-snug text-[var(--text-primary)]">{d.title}</p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{d.brand}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] transition-colors group-hover:bg-[#01C4FA]/20 light:text-[#0b7fae]" aria-hidden="true">
          <Expand className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

function FullView({ d, onClose, onPrice }: { d: WebsiteDesign; onClose: () => void; onPrice: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== "Tab" || !card.current) return;
      const els = card.current.querySelectorAll<HTMLElement>("button");
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-stretch justify-center bg-[rgba(3,6,18,0.7)] backdrop-blur-md sm:items-center sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wd-title"
        className="relative flex h-full w-full flex-col overflow-hidden border-[#01C4FA]/20 bg-[#070d22]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(1,196,250,0.12)] backdrop-blur-2xl animate-fade-in sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-3xl sm:border light:border-[#233067]/12 light:bg-[#f2f5fb]/97"
      >
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border-card)] px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#01C4FA]">{d.brand}</p>
            <h3 id="wd-title" className="text-lg font-extrabold text-[var(--text-primary)] sm:text-xl">{d.title}</h3>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] light:hover:bg-[#233067]/10`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          <p className="rounded-2xl border border-[#01C4FA]/20 bg-[#01C4FA]/[0.06] px-4 py-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">Includes: </span>
            {d.includes}
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {d.screens.map((s, i) => (
              <div key={s.label} className={i === 0 ? "lg:col-span-2" : ""}>
                <BrowserFrame label={s.label}>
                  <Scaled width={DESK.w} height={DESK.h}>{s.render()}</Scaled>
                </BrowserFrame>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--border-card)] px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onPrice}
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} btn-gradient btn-ready flex w-full items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white sm:ml-auto sm:w-auto`}
          >
            Get your price
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function WebsiteShowcase({ onPickType }: { onPickType: (typeId: string) => void }) {
  const [open, setOpen] = useState<WebsiteDesign | null>(null);
  const list = WEBSITE_DESIGNS;

  return (
    <section aria-labelledby="wsc-title" className="mx-auto mb-16 max-w-6xl px-4 sm:px-6">
      <div id="wsc-title">
        <ShowcaseHeading title="What we can build for you" sub="Tap a design to see more screens." />
      </div>

      <div className="lg:hidden">
        <Carousel count={list.length} label="Website designs">
          {(i) => <DeviceCard d={list[i]} onOpen={() => setOpen(list[i])} />}
        </Carousel>
      </div>
      <div className="hidden gap-6 lg:grid lg:grid-cols-3">
        {list.map((d) => <DeviceCard key={d.id} d={d} onOpen={() => setOpen(d)} />)}
      </div>

      {open && (
        <FullView
          d={open}
          onClose={() => setOpen(null)}
          onPrice={() => {
            const typeId = open.typeId;
            setOpen(null);
            onPickType(typeId);
          }}
        />
      )}
    </section>
  );
}
