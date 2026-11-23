"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import {
  confirmRedirectUrl,
  markEmailSent,
  markLinkKind,
  savePendingEmail,
  secondsUntilResend,
  RESEND_WAIT_SECONDS,
} from "../../lib/authEmail";
import { authInput } from "./AuthShell";
import { AUTH_MSG, isOffline, isRateLimited, waitUntilOnline, withTimeout } from "../../lib/authMessages";

/*
 * "Resend email" button with a visible 60-second wait.
 * If we don't know the email address, it asks for it first.
 * The message after sending is always the same, so it never reveals
 * whether an account exists or is already confirmed.
 *
 * tone="dark" is for the landing-page pop-ups, which are always dark.
 */
export default function ResendEmailButton({
  email,
  tone = "auto",
}: {
  email?: string;
  tone?: "auto" | "dark";
}) {
  const [typedEmail, setTypedEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const knownEmail = (email ?? "").trim();
  const targetEmail = knownEmail || typedEmail.trim();

  // Start the countdown from the last time an email was sent (survives reloads).
  useEffect(() => {
    setSecondsLeft(secondsUntilResend());
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft(secondsUntilResend()), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Step 3D: one email per press, never a second one sent by ourselves.
  const sendingRef = useRef(false);

  const handleResend = async () => {
    if (!targetEmail || secondsUntilResend() > 0 || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setMessage(null);
    try {
      // Offline before sending: nothing has gone out yet, so wait quietly and try once.
      if (isOffline() && !(await waitUntilOnline())) {
        setMessage({ kind: "error", text: AUTH_MSG.offline });
        return;
      }
      let error: { status?: number; message?: string } | null = null;
      try {
        ({ error } = await withTimeout(
          supabase.auth.resend({
            type: "signup",
            email: targetEmail,
            options: { emailRedirectTo: confirmRedirectUrl() },
          }),
        ));
      } catch (err) {
        error = err as Error; // lost reply or timeout: it may have gone through
      }
      markEmailSent();
      setSecondsLeft(RESEND_WAIT_SECONDS);
      if (isRateLimited(error)) {
        setMessage({ kind: "error", text: AUTH_MSG.waitBeforeResend });
        return;
      }
      // Success, a lost reply or any other answer: same message, so we never reveal account details.
      markLinkKind("signup");
      savePendingEmail(targetEmail);
      setMessage({
        kind: "ok",
        text: "If this email still needs confirming, a new link is on its way. Check your inbox and spam. Only the newest link works.",
      });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const dark = tone === "dark";
  const disabled = !targetEmail || secondsLeft > 0 || sending;

  return (
    <div className="space-y-3">
      {!knownEmail && (
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-label="Your email address"
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          className={
            dark
              ? "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#01C4FA]/60 focus:outline-none"
              : authInput
          }
        />
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={disabled}
        style={{ touchAction: "manipulation" }}
        className={`pointer-events-auto relative z-30 touch-action-manipulation w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${
          disabled
            ? `cursor-not-allowed border-white/10 bg-white/[0.04] text-white/40 ${dark ? "" : "light:border-[#233067]/10 light:bg-[#233067]/5 light:text-[#233067]/40"}`
            : "cursor-pointer border-[#01C4FA]/50 bg-[#01C4FA]/10 text-[#01C4FA] hover:bg-[#01C4FA]/20" +
              (dark ? "" : " light:bg-[#01C4FA]/15 light:text-[#233067] light:border-[#01C4FA]/60")
        }`}
      >
        <RotateCw className={`w-4 h-4 ${sending ? "animate-spin" : ""}`} />
        {sending
          ? "Sending..."
          : secondsLeft > 0
            ? `Resend email in ${secondsLeft}s`
            : "Resend email"}
      </button>

      {message && (
        <p
          role="status"
          className={`text-xs text-center leading-relaxed ${
            message.kind === "ok"
              ? `text-[#01C4FA] ${dark ? "" : "light:text-[#233067]"}`
              : `text-red-400 ${dark ? "" : "light:text-red-600"}`
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
