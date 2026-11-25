"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import Link from "next/link";
import { Bot, Camera, ChevronDown, Globe, Megaphone, Menu, MessageCircle, Music, X, type LucideIcon } from "lucide-react";

/*
 * Services menu (Step 4A).
 * - <ServicesDropdown>: "Services" button + glass panel for computers (md and up).
 * - <ServicesMobileButton>: menu icon + glass sheet for phones (below md).
 * Both close on outside tap and Escape, and work with the keyboard (arrows, Enter, Escape).
 * tone="dark" for the always-dark landing page; "auto" follows the light/dark theme.
 */

export interface ServiceLink {
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  soon?: boolean;
}

export const SERVICE_LINKS: ServiceLink[] = [
  { label: "WhatsApp AI Assistant", description: "Your 24/7 AI salesperson on WhatsApp.", icon: MessageCircle, href: "/#whatsapp-ai" },
  { label: "Instagram DMs & Comments", description: "AI replies to DMs and comments.", icon: Camera, soon: true },
  { label: "TikTok Assistant", description: "Turn TikTok interest into sales.", icon: Music, soon: true },
  { label: "Website Development", description: "Fast, beautiful websites that sell.", icon: Globe, href: "/services/website-development" },
  { label: "AI Marketing", description: "Content, SEO and ads that bring buyers.", icon: Megaphone, href: "/services/ai-marketing" },
  { label: "AI Automation", description: "AI agents that do the busywork.", icon: Bot, href: "/services/ai-automation" },
];

type Tone = "dark" | "auto";

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

/** One row in the panel or sheet. */
function ServiceRow({ s, tone, onPick, big }: { s: ServiceLink; tone: Tone; onPick: () => void; big?: boolean }) {
  const Icon = s.icon;
  const auto = tone === "auto";
  const inner = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl border border-[#01C4FA]/25 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_16px_rgba(1,196,250,0.15)] ${big ? "h-11 w-11" : "h-10 w-10"} ${auto ? "light:border-[#233067]/15 light:bg-[#233067]/[0.06] light:text-[#233067]" : ""}`}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`flex flex-wrap items-center gap-2 font-semibold ${big ? "text-base" : "text-sm"} text-white ${auto ? "light:text-[#233067]" : ""}`}>
          {s.label}
          {s.soon && (
            <span className={`rounded-full border border-[#01C4FA]/30 bg-[#01C4FA]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01C4FA] ${auto ? "light:border-[#233067]/20 light:bg-[#233067]/[0.06] light:text-[#233067]" : ""}`}>
              Coming soon
            </span>
          )}
        </span>
        <span className={`mt-0.5 block text-xs leading-snug text-white/55 ${auto ? "light:text-[#233067]/60" : ""}`}>{s.description}</span>
      </span>
    </>
  );
  const rowClass = `flex w-full items-center gap-3 rounded-xl px-3 ${big ? "py-3" : "py-2.5"} text-left outline-none transition-colors`;
  if (s.soon || !s.href) {
    return (
      <div role="menuitem" aria-disabled="true" tabIndex={-1} className={`${rowClass} cursor-default opacity-70`}>
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={s.href}
      role="menuitem"
      onClick={onPick}
      style={{ touchAction: "manipulation" }}
      className={`${rowClass} ${TOUCH} hover:bg-[#01C4FA]/10 focus-visible:bg-[#01C4FA]/12 focus-visible:ring-2 focus-visible:ring-[#01C4FA]/60 ${auto ? "light:hover:bg-[#233067]/[0.05]" : ""}`}
    >
      {inner}
    </Link>
  );
}

/** Arrow-key movement between the clickable rows of a menu. */
function useMenuKeys(container: React.RefObject<HTMLElement | null>, close: () => void) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      const items = Array.from(container.current?.querySelectorAll<HTMLElement>('a[role="menuitem"]') ?? []);
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
      else if (e.key === "Home") { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1]?.focus(); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
    },
    [container, close],
  );
}

export function ServicesDropdown({ tone = "auto" }: { tone?: Tone }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const auto = tone === "auto";

  const close = useCallback((focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  }, []);
  const onKeys = useMenuKeys(panel, close);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // Keyboard opening: show the panel straight away, then move focus to the first service.
  const openAndFocus = () => {
    flushSync(() => setOpen(true));
    panel.current?.querySelector<HTMLElement>('a[role="menuitem"]')?.focus();
  };

  return (
    <div ref={wrap} className="relative hidden md:block" onBlur={(e) => { if (open && !wrap.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); }
          else if (e.key === "ArrowDown" || ((e.key === "Enter" || e.key === " ") && !open)) { e.preventDefault(); openAndFocus(); }
        }}
        style={{ touchAction: "manipulation" }}
        className={`${TOUCH} flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white ${open ? "bg-white/[0.06] text-white" : ""} ${auto ? "light:text-[#233067]/80 light:hover:bg-[#233067]/[0.06] light:hover:text-[#233067]" : ""}`}
      >
        Services
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180 text-[#01C4FA]" : ""}`} aria-hidden="true" />
      </button>

      <div
        ref={panel}
        id={id}
        role="menu"
        aria-label="Services"
        onKeyDown={onKeys}
        // Fade and slide smoothly, but become visible instantly on open (so keyboard focus
        // can move in at once) and hidden only after the fade-out has finished.
        style={{ transition: `opacity 200ms ease, transform 200ms ease, visibility 0s linear ${open ? "0s" : "200ms"}` }}
        className={`absolute left-1/2 top-full z-[60] mt-3 w-[380px] -translate-x-1/2 origin-top rounded-2xl border border-[#01C4FA]/20 bg-[#0b1230]/[0.97] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_32px_rgba(1,196,250,0.14)] backdrop-blur-2xl ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"} ${auto ? "light:border-[#233067]/12 light:bg-white/[0.97] light:shadow-[0_24px_60px_rgba(35,48,103,0.18),0_0_28px_rgba(1,196,250,0.12)]" : ""}`}
      >
        <div className="pointer-events-none absolute -top-10 left-1/2 z-0 h-24 w-48 -translate-x-1/2 rounded-full bg-[#01C4FA]/15 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-0.5">
          {SERVICE_LINKS.map((s) => (
            <ServiceRow key={s.label} s={s} tone={tone} onPick={() => setOpen(false)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServicesMobileButton({ tone = "auto", accountLinks = false }: { tone?: Tone; accountLinks?: boolean }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // for the slide-in animation
  const sheet = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const auto = tone === "auto";

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => { setOpen(false); button.current?.focus(); }, 220);
  }, []);
  const onKeys = useMenuKeys(sheet, close);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      setShown(true);
      sheet.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    });
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        style={{ touchAction: "manipulation" }}
        className={`${TOUCH} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] md:hidden ${auto ? "light:border-[#233067]/15 light:bg-white/70 light:text-[#233067]" : ""}`}
      >
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            className={`fixed inset-0 z-[140] flex items-end justify-center transition-colors duration-200 md:hidden ${shown ? "bg-[rgba(3,6,18,0.6)] backdrop-blur-md" : "bg-transparent"}`}
            onPointerDown={(e) => { if (e.target === e.currentTarget) close(); }}
          >
            <div
              ref={sheet}
              role="dialog"
              aria-modal="true"
              aria-label="Services"
              onKeyDown={onKeys}
              className={`relative w-full max-w-md overflow-hidden rounded-t-3xl border border-b-0 border-[#01C4FA]/20 bg-[#0b1230]/95 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_60px_rgba(0,0,0,0.5),0_0_32px_rgba(1,196,250,0.12)] backdrop-blur-2xl transition-transform duration-200 ease-out ${shown ? "translate-y-0" : "translate-y-full"} ${tone === "auto" ? "light:border-[#233067]/12 light:bg-white/95" : ""}`}
            >
              <div className="pointer-events-none absolute -top-12 left-1/2 z-0 h-28 w-56 -translate-x-1/2 rounded-full bg-[#01C4FA]/15 blur-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/15" aria-hidden="true" />
                <div className="flex items-center justify-between px-2 pb-2">
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] text-[#01C4FA] ${auto ? "light:text-[#233067]" : ""}`}>Services</p>
                  <button
                    type="button"
                    data-close
                    onClick={close}
                    aria-label="Close menu"
                    style={{ touchAction: "manipulation" }}
                    className={`${TOUCH} flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white ${auto ? "light:text-[#233067]/70 light:hover:bg-[#233067]/10" : ""}`}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div role="menu" aria-label="Services" className="flex flex-col gap-0.5">
                  {SERVICE_LINKS.map((s) => (
                    <ServiceRow key={s.label} s={s} tone={tone} onPick={() => { setShown(false); setOpen(false); }} big />
                  ))}
                </div>
                {accountLinks && (
                  <div className={`mt-3 border-t border-white/10 px-2 pt-3 ${auto ? "light:border-[#233067]/10" : ""}`}>
                    <Link
                      href="/?login=1"
                      onClick={() => setOpen(false)}
                      style={{ touchAction: "manipulation" }}
                      className={`${TOUCH} flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] py-3 text-base font-semibold text-white ${auto ? "light:border-[#233067]/15 light:bg-[#233067]/[0.04] light:text-[#233067]" : ""}`}
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
