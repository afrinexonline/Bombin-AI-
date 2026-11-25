"use client";

import { useId, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { MARKETING_SEO_LEVELS, naira, type Card, type Choices, type Item, type Option, type ServiceId } from "../../lib/pricing";

/*
 * One numbered glass card of a price calculator (Step 4A).
 * Renders pick-one tiles, tick/quantity items, or a big stepper, straight from pricing.ts.
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

/** Price words shown on a pick-one tile. */
function optionPrice(o: Option, cardId: string): string {
  if (o.priceNote) return `${o.priceNote} / month`;
  if (o.monthly !== undefined) return o.monthly ? `${naira(o.monthly)} / month` : cardId === "package" ? "" : "No monthly fee";
  if (o.mult !== undefined) {
    const pct = Math.round((o.mult - 1) * 100);
    return pct ? `+${pct}%` : "No extra cost";
  }
  if (o.price !== undefined) return o.price ? naira(o.price) : "Included";
  return "";
}

function weeks(o: Option): string | null {
  if (!o.weeks || o.weeksFactor !== undefined) return null;
  return o.weeks[0] === o.weeks[1] ? `${o.weeks[0]} week${o.weeks[0] === 1 ? "" : "s"}` : `${o.weeks[0]}–${o.weeks[1]} weeks`;
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  big,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
  big?: boolean;
}) {
  const btn = `${TOUCH} flex items-center justify-center rounded-xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] transition-all hover:bg-[#01C4FA]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 light:border-[#233067]/20 light:bg-[#233067]/[0.05] light:text-[#233067] ${big ? "h-12 w-12" : "h-10 w-10"}`;
  return (
    <div className="flex shrink-0 items-center gap-2" role="group" aria-label={label}>
      <button type="button" className={btn} style={{ touchAction: "manipulation" }} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = Math.round(Number(e.target.value));
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className={`${big ? "h-12 w-16 text-xl" : "h-10 w-12 text-base"} rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] text-center font-bold tabular-nums text-[var(--text-primary)] outline-none focus:border-[#01C4FA]/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />
      <button type="button" className={btn} style={{ touchAction: "manipulation" }} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function Tile({
  selected,
  onClick,
  children,
  role = "radio",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      style={{ touchAction: "manipulation" }}
      className={`${TOUCH} group flex min-h-[64px] w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 active:scale-[0.99] ${
        selected
          ? "border-[#01C4FA]/70 bg-[#01C4FA]/[0.09] shadow-[0_0_0_1px_rgba(1,196,250,0.35),0_0_22px_rgba(1,196,250,0.18)] light:bg-[#01C4FA]/[0.08]"
          : "border-[var(--border-card)] bg-white/[0.02] hover:border-[#01C4FA]/35 hover:bg-[#01C4FA]/[0.04] light:bg-white/60"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${role === "radio" ? "rounded-full" : "rounded-md"} ${
          selected ? "border-[#01C4FA] bg-[#01C4FA] text-[#06122e]" : "border-[var(--text-dimmed)]"
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

export default function CalculatorCard({
  service,
  card,
  number,
  choices,
  setChoice,
  pageWord,
  includedPages,
  pageUnitPrice,
}: {
  service: ServiceId;
  card: Card;
  number: number;
  choices: Choices;
  setChoice: (cardId: string, value: Choices[string]) => void;
  pageWord?: string;
  includedPages?: number;
  pageUnitPrice?: number;
}) {
  const [help, setHelp] = useState(false);
  const helpId = useId();
  const value = choices[card.id];
  const isPackageLocked = service === "marketing" && card.id === "billing" && choices.package !== "none";

  const title = card.id === "pages" && pageWord === "screens" ? "Number of screens" : card.title;

  return (
    <section
      id={`card-${card.id}`}
      aria-labelledby={`${helpId}-title`}
      className="glass-card-static scroll-mt-24 rounded-3xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.18)] sm:p-6 light:shadow-[0_8px_30px_rgba(35,48,103,0.07)]"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#01C4FA] to-[#233067] text-sm font-bold text-white shadow-[0_0_16px_rgba(1,196,250,0.35)]" aria-hidden="true">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`${helpId}-title`} className="text-base font-bold leading-snug text-[var(--text-primary)] sm:text-lg">
            <span className="sr-only">{number}. </span>{title}
          </h3>
          <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-muted)]">{card.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => setHelp((h) => !h)}
          aria-expanded={help}
          aria-controls={`${helpId}-help`}
          aria-label={`What does "${title}" mean?`}
          style={{ touchAction: "manipulation" }}
          className={`${TOUCH} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
            help ? "border-[#01C4FA] bg-[#01C4FA]/15 text-[#01C4FA]" : "border-[var(--border-card)] text-[var(--text-muted)] hover:border-[#01C4FA]/50 hover:text-[#01C4FA]"
          }`}
        >
          ?
        </button>
      </div>

      <div
        id={`${helpId}-help`}
        hidden={!help}
        className="mb-4 rounded-2xl border border-[#01C4FA]/20 bg-[#01C4FA]/[0.06] p-3.5 text-sm leading-relaxed text-[var(--text-secondary)]"
      >
        {card.help}
      </div>

      {/* Pick one */}
      {card.kind === "single" && (
        <div role="radiogroup" aria-labelledby={`${helpId}-title`} className={`grid gap-2.5 ${(card.options?.length ?? 0) > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {card.options!.map((o) => {
            const sel = value === o.id;
            const locked = isPackageLocked && o.id === "oneTime";
            const w = weeks(o);
            const price = optionPrice(o, card.id);
            return (
              <Tile key={o.id} selected={sel} onClick={() => !locked && setChoice(card.id, o.id)}>
                <span className={`block text-[15px] font-semibold leading-snug text-[var(--text-primary)] ${locked ? "opacity-40" : ""}`}>{o.label}</span>
                {o.hint && <span className={`mt-0.5 block text-[13px] leading-snug text-[var(--text-muted)] ${locked ? "opacity-40" : ""}`}>{o.hint}</span>}
                {locked && <span className="mt-0.5 block text-[13px] leading-snug text-[#01C4FA]">Packages are monthly</span>}
                {(price || w) && (
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] font-semibold">
                    {price && <span className="text-[#01C4FA] light:text-[#0b7fae]">{price}</span>}
                    {w && <span className="font-medium text-[var(--text-muted)]">· {w}</span>}
                  </span>
                )}
              </Tile>
            );
          })}
        </div>
      )}

      {/* Big stepper (pages, workflows) */}
      {card.kind === "stepper" && (() => {
        const s = card.stepper!;
        const n = Number(value);
        const unit = card.id === "pages" ? pageWord ?? "pages" : s.unitLabel;
        const included = card.id === "pages" ? includedPages ?? 0 : 1;
        const unitPrice = card.id === "pages" ? pageUnitPrice ?? 0 : s.unitPrice ?? 0;
        const extra = Math.max(0, n - included);
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">
                  {n} <span className="text-base font-semibold text-[var(--text-muted)]">{unit}</span>
                </p>
                <p className="text-[13px] text-[var(--text-muted)]">
                  {included} included{extra > 0 ? ` · ${extra} extra × ${naira(unitPrice)}` : ""}
                </p>
              </div>
              <Stepper value={n} min={s.min} max={s.max} onChange={(v) => setChoice(card.id, v)} label={unit} big />
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={n}
              onChange={(e) => setChoice(card.id, Number(e.target.value))}
              aria-label={`Number of ${unit}`}
              style={{ touchAction: "manipulation" }}
              className="h-2 w-full cursor-pointer accent-[#01C4FA]"
            />
          </div>
        );
      })()}

      {/* Tick boxes and quantities */}
      {card.kind === "items" && (
        <div className="flex flex-col gap-2.5">
          {card.items!.map((it: Item) => {
            const sel = (value as Record<string, number>)[it.id] ?? 0;
            const set = (n: number) => setChoice(card.id, { ...(value as Record<string, number>), [it.id]: n });
            const priceText = `${naira(it.price)}${it.unit ? ` ${it.unit}` : ""}`;

            // AI SEO: three levels as chips.
            if (service === "marketing" && it.id === "seo") {
              const levels = [{ label: "None", price: 0 }, ...MARKETING_SEO_LEVELS];
              const monthly = choices.billing === "monthly" || choices.package !== "none";
              return (
                <div key={it.id} className="rounded-2xl border border-[var(--border-card)] bg-white/[0.02] p-3.5 light:bg-white/60">
                  <p className="text-[15px] font-semibold text-[var(--text-primary)]">{it.label}</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={it.label}>
                    {levels.map((l, i) => (
                      <button
                        key={l.label}
                        type="button"
                        role="radio"
                        aria-checked={sel === i}
                        onClick={() => set(i)}
                        style={{ touchAction: "manipulation" }}
                        className={`${TOUCH} rounded-xl border px-2 py-2.5 text-center transition-all ${
                          sel === i ? "border-[#01C4FA]/70 bg-[#01C4FA]/12 shadow-[0_0_16px_rgba(1,196,250,0.2)]" : "border-[var(--border-card)] hover:border-[#01C4FA]/40"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[var(--text-primary)]">{l.label}</span>
                        {l.price > 0 && <span className="block text-xs font-semibold text-[#01C4FA] light:text-[#0b7fae]">{naira(l.price)}{monthly ? "/mo" : ""}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Simple tick box.
            if (it.max === 1) {
              const price = it.id === "copywriting" ? `${naira(it.price)} per page` : priceText;
              return (
                <Tile key={it.id} role="checkbox" selected={sel > 0} onClick={() => set(sel ? 0 : 1)}>
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{it.label}</span>
                    <span className="text-[13px] font-semibold text-[#01C4FA] light:text-[#0b7fae]">{price}</span>
                  </span>
                  {it.hint && <span className="mt-0.5 block text-[13px] leading-snug text-[var(--text-muted)]">{it.hint}</span>}
                </Tile>
              );
            }

            // Quantity with a stepper.
            return (
              <div
                key={it.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                  sel > 0 ? "border-[#01C4FA]/60 bg-[#01C4FA]/[0.07] shadow-[0_0_18px_rgba(1,196,250,0.14)]" : "border-[var(--border-card)] bg-white/[0.02] light:bg-white/60"
                }`}
              >
                <div className="min-w-0 flex-1 basis-40">
                  <p className="text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{it.label}</p>
                  {it.hint && <p className="mt-0.5 text-[13px] leading-snug text-[var(--text-muted)]">{it.hint}</p>}
                  <p className="mt-1 text-[13px] font-semibold text-[#01C4FA] light:text-[#0b7fae]">{priceText}</p>
                  {it.note && <p className="mt-1 text-xs leading-snug text-[var(--text-muted)]">{it.note}</p>}
                </div>
                <Stepper value={sel} min={0} max={it.max} onChange={set} label={it.label} />
              </div>
            );
          })}
        </div>
      )}

      {card.note && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#01C4FA]/20 bg-[#01C4FA]/[0.05] px-3 py-2.5 text-[13px] leading-snug text-[var(--text-secondary)]">
          <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#01C4FA]" aria-hidden="true" />
          {card.note}
        </p>
      )}
    </section>
  );
}
