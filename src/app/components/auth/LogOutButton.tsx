"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { logOut } from "../../lib/authEmail";
import { useNavTransition } from "./NavTransition";

/*
 * Log Out (Step 3E redesign, Step 3D safety kept).
 * - variant="profile": full-width glass button at the bottom of the Profile page.
 * - variant="link": small text link (onboarding, where Profile can't be reached).
 * Both open the same confirmation pop-up. Confirming:
 * 1. The brand loader covers the screen at once (no dashboard or landing flash).
 * 2. The saved login and our own saved notes are wiped from this browser.
 * 3. Straight to the landing page, replacing this page in the history, so the
 *    phone's Back button can't step back into it (and the guards send anyone who
 *    tries to the landing page).
 */
export default function LogOutButton({ variant }: { variant: "profile" | "link" }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Give focus back to the button that opened the pop-up.
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  return (
    <>
      {variant === "profile" ? (
        <button
          ref={opener}
          type="button"
          id="profile-logout"
          onClick={() => setOpen(true)}
          style={{ touchAction: "manipulation" }}
          className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/[0.07] px-5 py-4 text-base font-semibold text-[#01C4FA] backdrop-blur-xl transition-all hover:border-[#01C4FA]/60 hover:bg-[#01C4FA]/[0.12] hover:shadow-[0_0_24px_rgba(1,196,250,0.25)] active:scale-[0.99] light:border-[#233067]/25 light:bg-white/70 light:text-[#233067] light:hover:border-[#233067]/45 light:hover:bg-white light:hover:shadow-[0_6px_24px_rgba(35,48,103,0.15)]"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          Log out
        </button>
      ) : (
        <button
          ref={opener}
          type="button"
          id="onboarding-logout"
          onClick={() => setOpen(true)}
          style={{ touchAction: "manipulation" }}
          className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-white/60 transition-colors hover:text-[#01C4FA] light:text-[#233067]/70 light:hover:text-[#233067]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      )}

      {open && <LogOutDialog onClose={close} />}
    </>
  );
}

function LogOutDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { show } = useNavTransition();
  const busy = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  const stayBtn = useRef<HTMLButtonElement>(null);

  const confirm = async () => {
    if (busy.current) return;
    busy.current = true;
    show("Logging you out...");
    const clean = await logOut();
    if (clean) {
      router.replace("/");
    } else {
      // Supabase couldn't be told (e.g. offline). The login is already wiped from this
      // browser; a full page load makes sure nothing of it stays in memory either.
      window.location.replace("/");
    }
  };

  useEffect(() => {
    // Lock the page behind the pop-up (no background scrolling).
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Focus moves into the pop-up, on the safe choice.
    stayBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!busy.current) onClose();
        return;
      }
      if (e.key !== "Tab" || !card.current) return;
      // Keep Tab inside the pop-up.
      const items = card.current.querySelectorAll<HTMLElement>("button:not([disabled])");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={(e) => {
        // Tapping the dimmed area (not the card) closes the pop-up.
        if (e.target === e.currentTarget && !busy.current) onClose();
      }}
      style={{ background: "rgba(5, 8, 20, 0.65)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <div
        ref={card}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-text"
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#01C4FA]/25 bg-[#0b1230]/85 p-6 pt-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(1,196,250,0.12)] backdrop-blur-2xl light:border-[#233067]/15 light:bg-white/90 light:shadow-[0_20px_60px_rgba(35,48,103,0.25)]"
      >
        {/* Soft brand glow (decoration only) */}
        <div className="pointer-events-none absolute -top-16 left-1/2 z-0 h-32 w-56 -translate-x-1/2 rounded-full bg-[#01C4FA]/20 blur-3xl" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ touchAction: "manipulation" }}
          className="pointer-events-auto absolute right-3 top-3 z-30 touch-action-manipulation cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white light:text-[#233067]/60 light:hover:bg-[#233067]/10 light:hover:text-[#233067]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 text-[#01C4FA] shadow-[0_0_24px_rgba(1,196,250,0.25)] light:border-[#233067]/20 light:bg-[#233067]/[0.06] light:text-[#233067]">
            <LogOut className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="logout-title" className="text-lg font-bold text-white light:text-[#233067]">
            Are you sure you want to log out?
          </h2>
          <p id="logout-text" className="mt-2 text-sm text-white/60 light:text-[#233067]/70">
            You can log back in any time with your email and password.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              ref={stayBtn}
              type="button"
              onClick={onClose}
              style={{ touchAction: "manipulation" }}
              className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-white/[0.12] light:border-[#233067]/20 light:bg-[#233067]/[0.05] light:text-[#233067] light:hover:bg-[#233067]/10"
            >
              No, stay
            </button>
            <button
              type="button"
              onClick={confirm}
              style={{ touchAction: "manipulation" }}
              className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] px-4 py-3 text-base font-semibold text-white shadow-[0_0_20px_rgba(1,196,250,0.3)] transition-all hover:shadow-[0_0_28px_rgba(1,196,250,0.45)] active:scale-[0.99]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
