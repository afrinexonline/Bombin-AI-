"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { clearLocalLogin, clearPendingEmail, getVerifiedUser, isEmailConfirmed, readPendingEmail } from "../lib/authEmail";
import AuthShell, { authLink, authText, authTitle } from "../components/auth/AuthShell";
import ResendEmailButton from "../components/auth/ResendEmailButton";

/*
 * "Check your email" screen (Step 3.3).
 * Shown after sign-up when Supabase needs the email confirmed first,
 * and by the guards when someone signed in has not confirmed yet.
 * The email address is kept in this browser only, never in the web address.
 */
export default function CheckEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      let address = readPendingEmail();
      try {
        // Ask Supabase, never the saved login: a stale login from a deleted
        // account must not skip this screen.
        const { user } = await getVerifiedUser();
        if (user) {
          if (isEmailConfirmed(user)) {
            // Really confirmed: nothing to do here.
            router.replace("/onboarding");
            return;
          }
          address = user.email ?? address;
        }
      } catch {
        /* no session: just show the screen */
      }
      if (!active) return;
      setEmail(address);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const useDifferentEmail = async () => {
    clearPendingEmail();
    await clearLocalLogin();
    router.push("/?signup=1");
  };

  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.25)]">
          <Mail className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
        </div>

        <h1 className={authTitle}>Check your email</h1>

        <p className={authText}>
          We sent a confirmation link to{" "}
          {email ? (
            <span className="font-semibold text-white break-all light:text-[#233067]">{email}</span>
          ) : (
            "your email address"
          )}
          . Open it and tap the button to finish setting up your account.
        </p>

        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/55 light:border-[#233067]/10 light:bg-[#233067]/[0.04] light:text-[#233067]/70">
          Can&apos;t find it? Check your <strong className="text-white/80 light:text-[#233067]">Spam</strong> or{" "}
          <strong className="text-white/80 light:text-[#233067]">Promotions</strong> folder. It comes from Bombin AI.
        </div>

        <div className="w-full">{ready && <ResendEmailButton email={email} />}</div>

        <div className="flex flex-col items-center gap-2 pt-1">
          <button type="button" onClick={useDifferentEmail} style={{ touchAction: "manipulation" }} className={authLink}>
            Use a different email
          </button>
          <button
            type="button"
            onClick={() => router.push("/?signin=1")}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer text-xs text-white/45 hover:text-white/70 light:text-[#233067]/55 light:hover:text-[#233067]"
          >
            Already confirmed? Sign in
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
