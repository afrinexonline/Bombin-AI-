"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, RotateCw } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { markLinkKind, resetRedirectUrl } from "../lib/authEmail";
import { isValidEmailFormat, normalizeEmail } from "../lib/emailChecks";
import AuthShell, { authLink, authText, authTitle } from "../components/auth/AuthShell";
import EmailField from "../components/auth/EmailField";

/*
 * "Forgot password?" page (Step 3C).
 * Always shows the same message after sending, so it never reveals whether
 * an account exists for an email address.
 */

const WAIT_SECONDS = 60;
const LAST_SENT_KEY = "bombin-reset-last-sent";

function secondsLeftNow(): number {
  try {
    const last = Number(window.localStorage.getItem(LAST_SENT_KEY) ?? 0);
    const left = WAIT_SECONDS - Math.floor((Date.now() - last) / 1000);
    return Math.max(0, Math.min(WAIT_SECONDS, left));
  } catch {
    return 0;
  }
}

function markSent() {
  try {
    window.localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(secondsLeftNow());
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft(secondsLeftNow()), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const send = async (address: string) => {
    setError(null);
    if (!isValidEmailFormat(address) || secondsLeft > 0 || sending) return;
    setSending(true);
    try {
      const clean = normalizeEmail(address);
      const { error: sendError } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: resetRedirectUrl(),
      });
      const msg = sendError?.message ?? "";
      if (sendError && (sendError.status === 429 || /security purposes|rate limit|too many/i.test(msg))) {
        markSent();
        setSecondsLeft(WAIT_SECONDS);
        setError("Please wait a little before asking for another email.");
        return;
      }
      if (sendError && /fetch|network/i.test(msg)) {
        setError("Could not reach the server. Check your internet connection and try again.");
        return;
      }
      // Success, or any other answer: same screen, so we never reveal account details.
      markSent();
      markLinkKind("recovery");
      setSecondsLeft(WAIT_SECONDS);
      setSentTo(clean);
    } catch {
      setError("Could not reach the server. Check your internet connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    void send(email);
  };

  const waitLabel = sending ? "Sending..." : secondsLeft > 0 ? `Send again in ${secondsLeft}s` : null;
  const backToLogin = (
    <button type="button" onClick={() => router.push("/?login=1")} style={{ touchAction: "manipulation" }} className={authLink}>
      Back to log in
    </button>
  );

  if (sentTo) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.25)]">
            <Mail className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>Check your email</h1>
          <p className={authText}>
            If an account exists for{" "}
            <span className="font-semibold text-white break-all light:text-[#233067]">{sentTo}</span>, a link to set a
            new password is on its way. The link works once and expires after a while.
          </p>
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/55 light:border-[#233067]/10 light:bg-[#233067]/[0.04] light:text-[#233067]/70">
            Can&apos;t find it? Check your <strong className="text-white/80 light:text-[#233067]">Spam</strong> or{" "}
            <strong className="text-white/80 light:text-[#233067]">Promotions</strong> folder. It comes from Bombin AI.
          </div>
          <button
            type="button"
            onClick={() => send(sentTo)}
            disabled={secondsLeft > 0 || sending}
            style={{ touchAction: "manipulation" }}
            className={`pointer-events-auto relative z-30 touch-action-manipulation w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${
              secondsLeft > 0 || sending
                ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/40 light:border-[#233067]/10 light:bg-[#233067]/5 light:text-[#233067]/40"
                : "cursor-pointer border-[#01C4FA]/50 bg-[#01C4FA]/10 text-[#01C4FA] hover:bg-[#01C4FA]/20 light:bg-[#01C4FA]/15 light:text-[#233067] light:border-[#01C4FA]/60"
            }`}
          >
            <RotateCw className={`h-4 w-4 ${sending ? "animate-spin" : ""}`} />
            {waitLabel ?? "Send the link again"}
          </button>
          {error && <p role="status" className="text-xs text-center text-rose-300 light:text-rose-600">{error}</p>}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setSentTo(""); setError(null); }}
              style={{ touchAction: "manipulation" }}
              className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer text-xs text-white/45 hover:text-white/70 light:text-[#233067]/55 light:hover:text-[#233067]"
            >
              Use a different email
            </button>
            {backToLogin}
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit} noValidate className="flex flex-col items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.25)]">
          <KeyRound className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
        </div>
        <h1 className={authTitle}>Forgot your password?</h1>
        <p className={authText}>
          No problem. Enter the email you use for Bombin AI and we&apos;ll send you a link to set a new password.
        </p>
        <div className="w-full">
          <EmailField id="forgot-email" value={email} onChange={setEmail} showErrors={tried} />
        </div>
        {error && <p role="status" className="text-xs text-center text-rose-300 light:text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={sending || secondsLeft > 0}
          style={{ touchAction: "manipulation" }}
          className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {waitLabel ?? "Send reset link"}
        </button>
        {backToLogin}
      </form>
    </AuthShell>
  );
}
