"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Link2Off, LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { clearLocalLogin, getVerifiedUser } from "../lib/authEmail";
import AuthShell, { authLink, authText, authTitle } from "../components/auth/AuthShell";
import BrandLoader from "../components/auth/BrandLoader";
import PasswordField from "../components/auth/PasswordField";
import PasswordRules from "../components/auth/PasswordRules";
import { PASSWORD_RULES_MESSAGE, passwordMeetsRules } from "../lib/passwordRules";

/*
 * "Set a new password" page (Step 3C). The reset email link lands here.
 * Implicit flow: Supabase reads the one-time login from the web address.
 * A tiny script in layout.tsx notes (for this tab only) that a real reset link
 * was opened, so this form never appears for someone who simply typed the address.
 */
type Status = "checking" | "form" | "done" | "invalid";

const RECOVERY_KEY = "bombin-recovery";
const RECOVERY_MAX_AGE_MS = 60 * 60 * 1000;

function readLinkError(): string | null {
  if (typeof window === "undefined") return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return hash.get("error_code") || query.get("error_code") || hash.get("error") || query.get("error") || null;
}

function recoveryLinkOpened(): boolean {
  try {
    const at = Number(window.sessionStorage.getItem(RECOVERY_KEY) ?? 0);
    return at > 0 && Date.now() - at < RECOVERY_MAX_AGE_MS;
  } catch {
    return false;
  }
}

// Logging out after the change remounts this page (the app resets its state on log-out),
// so remember "just finished" for a few minutes to keep showing the success message.
const DONE_KEY = "bombin-reset-done";
const DONE_MAX_AGE_MS = 5 * 60 * 1000;

function justFinished(): boolean {
  try {
    const at = Number(window.sessionStorage.getItem(DONE_KEY) ?? 0);
    return at > 0 && Date.now() - at < DONE_MAX_AGE_MS;
  } catch {
    return false;
  }
}

function setJustFinished(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(DONE_KEY, String(Date.now()));
    else window.sessionStorage.removeItem(DONE_KEY);
  } catch {
    /* ignore */
  }
}

function forgetRecovery() {
  try {
    window.sessionStorage.removeItem(RECOVERY_KEY);
  } catch {
    /* ignore */
  }
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const linkError = readLinkError();

    if (justFinished()) {
      setStatus("done");
      return;
    }

    (async () => {
      let ok = false;
      if (!linkError && recoveryLinkOpened()) {
        try {
          const { user } = await getVerifiedUser();
          ok = Boolean(user);
        } catch {
          ok = false;
        }
      }
      if (!active) return;
      if (ok) {
        setStatus("form");
        return;
      }
      setExpired(linkError === "otp_expired");
      setStatus("invalid");
      // Tidy any leftover link details out of the web address.
      if (window.location.hash || linkError) window.history.replaceState(window.history.state, "", window.location.pathname);
    })();

    return () => {
      active = false;
    };
  }, []);

  const rulesOk = passwordMeetsRules(password);
  const matches = password.length > 0 && password === confirm;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    setError(null);
    if (!rulesOk) {
      setError(PASSWORD_RULES_MESSAGE);
      return;
    }
    if (!matches) {
      setError("The two passwords don't match yet.");
      return;
    }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        const msg = updateError.message ?? "";
        if (updateError.code === "same_password" || /different from the old/i.test(msg)) {
          setError("Please choose a password you haven't used here before.");
        } else if (updateError.code === "weak_password" || /weak|should be at least/i.test(msg)) {
          setError("That password is too easy to guess. Please choose a stronger one.");
        } else if (/fetch|network/i.test(msg)) {
          setError("Could not reach the server. Check your internet connection and try again.");
        } else if (updateError.status === 401 || /session|jwt|expired/i.test(msg)) {
          forgetRecovery();
          setStatus("invalid");
        } else {
          setError("We couldn't update your password. Please try again.");
        }
        return;
      }
      // Done: sign out of this one-time login so the person logs in fresh.
      forgetRecovery();
      setJustFinished(true);
      setStatus("done");
      await clearLocalLogin();
    } catch {
      setError("Could not reach the server. Check your internet connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "checking") return <BrandLoader label="Opening your reset link..." />;

  return (
    <AuthShell>
      {status === "form" && (
        <form onSubmit={onSubmit} noValidate className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.25)]">
            <LockKeyhole className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>Set a new password</h1>
          <p className={authText}>Choose a new password for your Bombin AI account.</p>

          <div className="w-full space-y-4">
            <PasswordField
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              placeholder="Create a new password"
              invalid={tried && !rulesOk}
            />
            <PasswordRules password={password} />
            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Type it again"
              invalid={tried && !matches}
            />
            <PasswordRules password={password} showBase={false} extra={[{ label: "Both passwords match", ok: matches }]} />
          </div>

          {error && <p role="status" className="text-xs text-center text-rose-300 light:text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? "Saving..." : "Save new password"}
          </button>
        </form>
      )}

      {status === "done" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.3)]">
            <CheckCircle2 className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>Password updated</h1>
          <p className={authText}>Your new password is saved. Log in with it to continue.</p>
          <button
            type="button"
            onClick={() => {
              setJustFinished(false);
              router.replace("/?login=1");
            }}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01]"
          >
            Log In
          </button>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] light:border-[#233067]/15 light:bg-[#233067]/5">
            <Link2Off className="h-7 w-7 text-white/70 light:text-[#233067]/70" />
          </div>
          <h1 className={authTitle}>{expired ? "This reset link has expired" : "This reset link didn't work"}</h1>
          <p className={authText}>
            Reset links work once and only for a short time. Ask for a new one, then open the newest email.
          </p>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01]"
          >
            Send me a new link
          </button>
          <button type="button" onClick={() => router.push("/?login=1")} style={{ touchAction: "manipulation" }} className={authLink}>
            Back to log in
          </button>
        </div>
      )}
    </AuthShell>
  );
}
