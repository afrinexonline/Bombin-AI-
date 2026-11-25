"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BellRing, CircleCheck, Loader2, X } from "lucide-react";
import { WAITLIST_CHOICES, checkWaitlist, type WaitlistChoice, type WaitlistErrors } from "../../lib/waitlist";

/*
 * "Be the first to know" pop-up for the coming-soon Instagram / TikTok assistants (Step 4B).
 * tone="dark" on the always-dark landing page; "auto" follows the light/dark theme.
 */

const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

export default function WaitlistDialog({ initial, tone = "auto", onClose }: { initial: WaitlistChoice; tone?: "dark" | "auto"; onClose: () => void }) {
  const auto = tone === "auto";
  const [choice, setChoice] = useState<WaitlistChoice>(initial);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"joined" | "already" | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const sending = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Lock the page, focus the first field, Escape closes, Tab stays inside.
  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending.current) { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== "Tab" || !card.current) return;
      const els = card.current.querySelectorAll<HTMLElement>("button:not([disabled]), input");
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
  }, []);

  const submit = async () => {
    if (sending.current) return;
    setProblem(null);
    const checked = checkWaitlist({ name, whatsapp, email, choice });
    if (!checked.ok) {
      setErrors(checked.errors);
      const first = (["name", "whatsapp", "email"] as const).find((k) => checked.errors[k]);
      if (first) document.getElementById(`wl-${first}`)?.focus();
      return;
    }
    sending.current = true;
    setBusy(true);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15_000);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.value),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => null);
      if (res.ok && (data?.result === "joined" || data?.result === "already")) setDone(data.result);
      else if (data?.errors) setErrors(data.errors);
      else setProblem(data?.error ?? "We couldn't save that right now. Please try again in a moment.");
    } catch {
      setProblem("We couldn't reach our server. Please check your internet and try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  const input = `w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#01C4FA]/60 focus:shadow-[0_0_0_3px_rgba(1,196,250,0.12)] ${auto ? "light:border-[#233067]/15 light:bg-white light:text-[#233067] light:placeholder:text-[#233067]/35" : ""}`;
  const label = `mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75 ${auto ? "light:text-[#233067]/80" : ""}`;
  const err = `mt-1.5 text-[13px] font-medium text-[#ff9b9b] ${auto ? "light:text-[#c0392b]" : ""}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-[rgba(3,6,18,0.62)] p-4 backdrop-blur-md"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !sending.current) onClose(); }}
    >
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wl-title"
        className={`relative max-h-[92vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-[#01C4FA]/25 bg-[#0b1230]/[0.96] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_40px_rgba(1,196,250,0.14)] backdrop-blur-2xl animate-fade-in ${auto ? "light:border-[#233067]/12 light:bg-[#f7f9fc]/[0.98] light:shadow-[0_24px_60px_rgba(35,48,103,0.2)]" : ""}`}
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 z-0 h-40 w-64 -translate-x-1/2 rounded-full bg-[#01C4FA]/20 blur-3xl" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          style={{ touchAction: "manipulation" }}
          className={`pointer-events-auto absolute right-3 top-3 z-30 flex h-10 w-10 cursor-pointer touch-action-manipulation items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-40 ${auto ? "light:text-[#233067]/60 light:hover:bg-[#233067]/10" : ""}`}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative z-10">
          {done ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_28px_rgba(1,196,250,0.3)]">
                <CircleCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 id="wl-title" className={`text-xl font-extrabold text-white ${auto ? "light:text-[#233067]" : ""}`}>
                {done === "joined" ? "You're on the list!" : "You're already on the list"}
              </h2>
              <p className={`mt-2 text-[15px] leading-relaxed text-white/70 ${auto ? "light:text-[#233067]/75" : ""}`}>
                {done === "joined" ? "We'll message you on WhatsApp when it's ready." : "No need to sign up again. We'll message you on WhatsApp when it's ready."}
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{ touchAction: "manipulation" }}
                className={`${TOUCH} btn-gradient mt-6 w-full max-w-xs px-6 py-3 text-base font-bold text-white`}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3 pr-10">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_20px_rgba(1,196,250,0.25)]">
                  <BellRing className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="wl-title" className={`text-xl font-extrabold text-white ${auto ? "light:text-[#233067]" : ""}`}>Be the first to know</h2>
                  <p className={`text-sm text-white/60 ${auto ? "light:text-[#233067]/65" : ""}`}>Our Instagram and TikTok assistants are coming soon.</p>
                </div>
              </div>

              <form className="grid gap-4" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <fieldset>
                  <legend className={label}>Which one?</legend>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Which one?">
                    {WAITLIST_CHOICES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={choice === c.id}
                        onClick={() => setChoice(c.id)}
                        style={{ touchAction: "manipulation" }}
                        className={`${TOUCH} rounded-xl border px-2 py-2.5 text-[15px] font-semibold transition-all ${
                          choice === c.id
                            ? "border-[#01C4FA]/70 bg-[#01C4FA]/12 text-white shadow-[0_0_16px_rgba(1,196,250,0.22)]"
                            : "border-white/12 text-white/70 hover:border-[#01C4FA]/40"
                        } ${auto ? (choice === c.id ? "light:text-[#233067]" : "light:border-[#233067]/15 light:text-[#233067]/70") : ""}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="wl-name" className={label}>Full name</label>
                  <input ref={firstField} id="wl-name" className={input} value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} autoComplete="name" maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? "wl-name-error" : undefined} />
                  {errors.name && <p id="wl-name-error" className={err}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="wl-whatsapp" className={label}>WhatsApp number</label>
                  <input id="wl-whatsapp" className={input} value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); setErrors((x) => ({ ...x, whatsapp: undefined })); }} type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 0803 123 4567" maxLength={24} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "wl-whatsapp-error" : undefined} />
                  {errors.whatsapp && <p id="wl-whatsapp-error" className={err}>{errors.whatsapp}</p>}
                </div>
                <div>
                  <label htmlFor="wl-email" className={label}>
                    <span>Email</span>
                    <span className={`text-xs font-medium text-white/35 ${auto ? "light:text-[#233067]/40" : ""}`}>Optional</span>
                  </label>
                  <input id="wl-email" className={input} value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} type="email" inputMode="email" autoComplete="email" maxLength={254} aria-invalid={!!errors.email} />
                  {errors.email && <p className={err}>{errors.email}</p>}
                </div>
                {problem && <p className={err} role="alert">{problem}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  style={{ touchAction: "manipulation" }}
                  className={`${TOUCH} btn-gradient btn-ready flex w-full items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white disabled:opacity-60`}
                >
                  {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                  {busy ? "Joining..." : "Join the waitlist"}
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
