"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleCheck, Clock, Loader2, MessageCircle, X } from "lucide-react";
import { SERVICES, headlinePrice, naira, quote as makeQuote, type Choices, type Quote, type ServiceId } from "../../lib/pricing";
import { NOTES_MAX, checkContact, makeReference, orderMessage, whatsAppLink, type ContactErrors, type ContactInput } from "../../lib/orders";

/*
 * Review order → Confirm order → success (Step 4A).
 * Confirm: the server re-prices and saves the order, then WhatsApp opens with the
 * neat pre-typed message. If saving fails, WhatsApp still opens with every detail,
 * so an order is never lost.
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";
const INPUT =
  "w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-dimmed)] focus:border-[#01C4FA]/60 focus:shadow-[0_0_0_3px_rgba(1,196,250,0.12)]";

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)]">
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-[var(--text-dimmed)]">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-[#ff8a8a] light:text-[#c0392b]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ReviewOrder({ service, choices, onClose }: { service: ServiceId; choices: Choices; onClose: () => void }) {
  const svc = SERVICES[service];
  const q = makeQuote(service, choices);
  const [form, setForm] = useState<ContactInput>({ name: "", business: "", whatsapp: "", email: "", notes: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string; url: string; saved: boolean } | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const sending = useRef(false);

  // Lock the page behind, focus inside, Escape closes, Tab stays inside.
  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending.current) { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !card.current) return;
      const els = card.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea');
      if (!els.length) return;
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
  }, [onClose]);

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const confirm = async () => {
    if (sending.current) return;
    setProblem(null);
    const checked = checkContact(form);
    if (!checked.ok) {
      setErrors(checked.errors);
      const first = Object.keys(checked.errors)[0];
      document.getElementById(`order-${first}`)?.focus();
      return;
    }
    sending.current = true;
    setBusy(true);
    // Open the tab now, while the tap still counts, so phones don't block it later.
    let win: Window | null = null;
    try { win = window.open("", "_blank"); } catch { win = null; }

    let reference = "";
    let finalQuote: Quote = q;
    let saved = false;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15_000);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, choices, contact: checked.value }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => null);
      if (res.status === 400 && data?.errors) {
        win?.close();
        setErrors(data.errors);
        sending.current = false;
        setBusy(false);
        return;
      }
      if (typeof data?.reference === "string") {
        reference = data.reference;
        if (data.quote) finalQuote = data.quote as Quote; // the server's own price wins
        saved = !!data.saved;
      }
      if (!saved) console.warn("order: not saved on the server", res.status);
    } catch {
      console.warn("order: could not reach the server");
    }
    try {
      if (!reference) reference = makeReference(service); // never lose the order
      const url = whatsAppLink(orderMessage(finalQuote, checked.value, reference));
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
      setDone({ reference, url, saved });
    } catch {
      win?.close();
      setProblem("Something went wrong. Please tap Confirm order again, or use the WhatsApp us button.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  const oneTimeLines = q.lines.filter((l) => l.part === "oneTime" || l.part === "info");
  const monthlyLines = q.lines.filter((l) => l.part === "monthly");
  const mainLabel = q.main === "monthly" ? "Estimated price per month" : "Estimated one-time price";

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-stretch justify-center bg-[rgba(3,6,18,0.62)] backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !sending.current && !done) onClose(); }}
    >
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="relative flex h-full w-full flex-col overflow-hidden border-[#01C4FA]/20 bg-[#070d22]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(1,196,250,0.12)] backdrop-blur-2xl animate-fade-in sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl sm:border light:border-[#233067]/12 light:bg-[#f7f9fc]/97"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 z-0 h-48 w-80 -translate-x-1/2 rounded-full bg-[#01C4FA]/15 blur-3xl" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border-card)] px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#01C4FA]">{svc.name}</p>
            <h2 id="review-title" className="text-lg font-extrabold text-[var(--text-primary)] sm:text-xl">
              {done ? "Order received!" : "Review your order"}
            </h2>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--text-primary)] disabled:opacity-40 light:hover:bg-[#233067]/10`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_30px_rgba(1,196,250,0.3)]">
                <CircleCheck className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">Your reference</p>
              <p className="mt-1 select-all font-mono text-2xl font-extrabold tracking-wider text-[var(--text-primary)]">{done.reference}</p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">
                Finish sending the WhatsApp message so we can confirm your final price.
              </p>
              {!done.saved && (
                <p className="mt-3 max-w-md rounded-xl border border-[#01C4FA]/25 bg-[#01C4FA]/[0.06] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Please make sure you send the WhatsApp message: it carries all your order details to us.
                </p>
              )}
              <a
                href={done.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ touchAction: "manipulation" }}
                className={`${TOUCH} btn-gradient btn-ready mt-6 flex w-full max-w-sm items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white`}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Open WhatsApp again
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{ touchAction: "manipulation" }}
                className={`${TOUCH} mt-3 rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
              >
                Back to the calculator
              </button>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="rounded-2xl border border-[var(--border-card)] bg-white/[0.02] p-4 light:bg-white/70">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Your choices</h3>
                <ul className="divide-y divide-[var(--border-card)]">
                  {oneTimeLines.map((l, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 py-2.5">
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-[var(--text-primary)]">{l.label}</span>
                        {l.detail && <span className="block text-[13px] text-[var(--text-muted)]">{l.detail}</span>}
                      </span>
                      <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[var(--text-primary)]">
                        {l.tag ?? (l.amount !== undefined ? naira(l.amount) : "")}
                      </span>
                    </li>
                  ))}
                  {q.main === "monthly" &&
                    monthlyLines.map((l, i) => (
                      <li key={`m${i}`} className="flex items-start justify-between gap-3 py-2.5">
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-[var(--text-primary)]">{l.label}</span>
                          {l.detail && <span className="block text-[13px] text-[var(--text-muted)]">{l.detail}</span>}
                        </span>
                        <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[var(--text-primary)]">{naira(l.amount ?? 0)}/mo</span>
                      </li>
                    ))}
                </ul>

                {q.multipliers.length > 0 && (
                  <>
                    <h3 className="mb-2 mt-4 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Price adjustments</h3>
                    <ul className="space-y-1.5">
                      {q.multipliers.map((m) => {
                        const pct = Math.round((m.factor - 1) * 100);
                        return (
                          <li key={m.label} className="flex items-start justify-between gap-3 text-[14px]">
                            <span className="text-[var(--text-secondary)]">{m.label}</span>
                            <span className="shrink-0 text-right font-semibold text-[var(--text-primary)]">
                              {pct ? `+${pct}% on ${m.appliesTo}` : "No extra cost"}
                            </span>
                          </li>
                        );
                      })}
                      {q.service === "marketing" && q.main === "monthly" && q.lines.some((l) => l.label === "Monthly saving on extras") && (
                        <li className="flex items-start justify-between gap-3 text-[14px]">
                          <span className="text-[var(--text-secondary)]">Monthly saving</span>
                          <span className="shrink-0 text-right font-semibold text-[#01C4FA]">10% off extras</span>
                        </li>
                      )}
                    </ul>
                  </>
                )}

                {/* Totals */}
                <div className="mt-4 rounded-xl border border-[#01C4FA]/30 bg-gradient-to-br from-[#01C4FA]/[0.12] to-[#233067]/[0.18] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">{q.custom ? "Estimated price" : mainLabel}</span>
                    <span className={`font-extrabold text-[var(--text-primary)] ${q.custom ? "text-base" : "text-2xl"}`}>{headlinePrice(q)}</span>
                  </div>
                  {q.atMinimum && <p className="mt-1 text-[13px] text-[var(--text-muted)]">This is our minimum price for {svc.name}.</p>}
                  {q.main === "oneTime" && q.monthly ? (
                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-white/10 pt-2 light:border-[#233067]/10">
                      <span className="text-sm text-[var(--text-secondary)]">{monthlyLines[0]?.label ?? "Monthly"}: {monthlyLines[0]?.detail}</span>
                      <span className="font-bold text-[var(--text-primary)]">{naira(q.monthly)} / month</span>
                    </div>
                  ) : null}
                  {q.main === "monthly" && q.oneTime ? (
                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-white/10 pt-2 light:border-[#233067]/10">
                      <span className="text-sm text-[var(--text-secondary)]">One-time setup</span>
                      <span className="font-bold text-[var(--text-primary)]">{naira(q.oneTime)}</span>
                    </div>
                  ) : null}
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Clock className="h-4 w-4 text-[#01C4FA]" aria-hidden="true" />
                    Estimated delivery: <strong className="font-semibold text-[var(--text-primary)]">{q.deliveryText}</strong>
                  </p>
                </div>
                {q.notes.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {q.notes.map((n) => (
                      <li key={n} className="text-[13px] leading-snug text-[var(--text-muted)]">• {n}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Form */}
              <form
                className="mt-5 grid gap-4"
                noValidate
                onSubmit={(e) => { e.preventDefault(); confirm(); }}
              >
                <Field id="order-name" label="Full name" error={errors.name}>
                  <input id="order-name" className={INPUT} value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? "order-name-error" : undefined} required />
                </Field>
                <Field id="order-business" label="Business name" optional error={errors.business}>
                  <input id="order-business" className={INPUT} value={form.business} onChange={set("business")} autoComplete="organization" maxLength={100} />
                </Field>
                <Field id="order-whatsapp" label="WhatsApp number" error={errors.whatsapp}>
                  <input id="order-whatsapp" className={INPUT} value={form.whatsapp} onChange={set("whatsapp")} type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 0803 123 4567" maxLength={24} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "order-whatsapp-error" : undefined} required />
                </Field>
                <Field id="order-email" label="Email" optional error={errors.email}>
                  <input id="order-email" className={INPUT} value={form.email} onChange={set("email")} type="email" inputMode="email" autoComplete="email" maxLength={254} aria-invalid={!!errors.email} />
                </Field>
                <Field id="order-notes" label="Project notes" optional error={errors.notes}>
                  <textarea id="order-notes" className={`${INPUT} min-h-[96px] resize-y`} value={form.notes} onChange={set("notes")} maxLength={NOTES_MAX} rows={3} placeholder="Anything we should know?" />
                  <p className="mt-1 text-right text-xs text-[var(--text-dimmed)]">{form.notes.length}/{NOTES_MAX}</p>
                </Field>

                <p className="rounded-xl border border-[#01C4FA]/20 bg-[#01C4FA]/[0.05] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  This is an estimate. We&apos;ll confirm the final price and timeline with you on WhatsApp before any payment.
                </p>
                {problem && <p className="text-sm text-[#ff8a8a]">{problem}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  style={{ touchAction: "manipulation" }}
                  className={`${TOUCH} btn-gradient btn-ready flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white disabled:opacity-60`}
                >
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
                  {busy ? "Sending your order..." : q.custom ? "Confirm & request a custom quote" : "Confirm order"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
