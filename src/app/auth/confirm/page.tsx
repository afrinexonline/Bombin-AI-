"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Link2Off, ShieldCheck } from "lucide-react";
import { clearPendingEmail, getVerifiedUser, isEmailConfirmed, readPendingEmail } from "../../lib/authEmail";
import { forgetLinkError, readLinkError, tidyAddress } from "../../lib/linkErrors";
import AuthShell, { authLink, authText, authTitle } from "../../components/auth/AuthShell";
import ResendEmailButton from "../../components/auth/ResendEmailButton";
import BrandLoader from "../../components/auth/BrandLoader";

/*
 * Where the confirmation email link lands (Step 3.4, made safer in Step 3D).
 * Implicit flow: Supabase puts the login "ticket" after the # in the web address.
 *
 * Step 3D rule: read the link's ERROR first. If Supabase rejected the link
 * (used or expired), we never show "Email confirmed", even if this browser
 * happens to be logged in already.
 */
type Status = "checking" | "confirmed" | "used" | "invalid" | "leaving";

const primaryButton =
  "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01]";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;
    // 1. The link's error comes first.
    const linkError = readLinkError();

    (async () => {
      let confirmed = false;
      try {
        // Ask Supabase directly whether this browser's user really is confirmed.
        const { user } = await getVerifiedUser();
        confirmed = isEmailConfirmed(user);
      } catch {
        confirmed = false;
      }
      if (!active) return;

      if (linkError) {
        forgetLinkError();
        tidyAddress();
        if (confirmed) {
          // The link was already used, and this person is logged in and confirmed.
          clearPendingEmail();
          setStatus("used");
          return;
        }
        setExpired(linkError === "otp_expired");
        setEmail(readPendingEmail());
        setStatus("invalid");
        return;
      }

      if (confirmed) {
        clearPendingEmail();
        setStatus("confirmed");
        return;
      }

      setEmail(readPendingEmail());
      setStatus("invalid");
      tidyAddress();
    })();

    return () => {
      active = false;
    };
  }, []);

  // Show the brand loader, then go on. Onboarding sends people who already
  // finished it on to the dashboard (behind the same loader).
  const continueOn = () => {
    setStatus("leaving");
    router.replace("/onboarding");
  };

  // After a short "Email confirmed" moment, continue on automatically.
  useEffect(() => {
    if (status !== "confirmed") return;
    const t = setTimeout(continueOn, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "checking") return <BrandLoader label="Confirming your email..." />;
  if (status === "leaving") return <BrandLoader label="Getting things ready..." />;

  return (
    <AuthShell>
      {status === "confirmed" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.3)]">
            <CheckCircle2 className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>Email confirmed</h1>
          <p className={authText}>Thank you. Your account is ready. Taking you to set up your AI sales assistant...</p>
          <button type="button" onClick={continueOn} style={{ touchAction: "manipulation" }} className={primaryButton}>
            Continue
          </button>
        </div>
      )}

      {status === "used" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.25)]">
            <ShieldCheck className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>This link has already been used</h1>
          <p className={authText}>Your email is already confirmed. You can carry on where you left off.</p>
          <button type="button" onClick={continueOn} style={{ touchAction: "manipulation" }} className={primaryButton}>
            Continue
          </button>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] light:border-[#233067]/15 light:bg-[#233067]/5">
            <Link2Off className="h-7 w-7 text-white/70 light:text-[#233067]/70" />
          </div>
          <h1 className={authTitle}>{expired ? "This link has expired or was already used" : "This link didn't work"}</h1>
          <p className={authText}>
            Each link works once and only for a short time.{" "}
            {email ? "Send a fresh link to your email" : "Enter your email and we'll send a fresh link"}, then open the
            newest email. Already confirmed? Just log in.
          </p>
          <div className="w-full">
            <ResendEmailButton email={email} />
          </div>
          <button type="button" onClick={() => router.push("/?login=1")} style={{ touchAction: "manipulation" }} className={authLink}>
            Back to log in
          </button>
        </div>
      )}
    </AuthShell>
  );
}
