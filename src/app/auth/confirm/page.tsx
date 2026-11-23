"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Link2Off } from "lucide-react";
import { clearPendingEmail, getVerifiedUser, isEmailConfirmed, readPendingEmail } from "../../lib/authEmail";
import AuthShell, { authLink, authText, authTitle } from "../../components/auth/AuthShell";
import ResendEmailButton from "../../components/auth/ResendEmailButton";
import BrandLoader from "../../components/auth/BrandLoader";

/*
 * Where the confirmation email link lands (Step 3.4).
 * Implicit flow: Supabase puts the login "ticket" after the # in the web address.
 * The Supabase client reads it automatically; we wait for that, then continue.
 * If the link is expired or broken, the address carries an error instead.
 */
type Status = "checking" | "confirmed" | "invalid";

function readLinkError(): string | null {
  if (typeof window === "undefined") return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return (
    hash.get("error_code") || query.get("error_code") ||
    hash.get("error") || query.get("error") || null
  );
}

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;
    const linkError = readLinkError();

    (async () => {
      let confirmed = false;
      try {
        // Waits until the client has finished reading the link, then asks
        // Supabase directly whether this user really is confirmed.
        const { user } = await getVerifiedUser();
        confirmed = isEmailConfirmed(user);
      } catch {
        confirmed = false;
      }
      if (!active) return;

      if (confirmed) {
        clearPendingEmail();
        setStatus("confirmed");
        return;
      }

      setExpired(linkError === "otp_expired");
      setEmail(readPendingEmail());
      setStatus("invalid");
      // Tidy the error out of the web address.
      if (linkError) window.history.replaceState(window.history.state, "", window.location.pathname);
    })();

    return () => {
      active = false;
    };
  }, []);

  // After a short "Email confirmed" moment, continue to onboarding.
  // (Onboarding sends people who already finished it on to the dashboard.)
  useEffect(() => {
    if (status !== "confirmed") return;
    const t = setTimeout(() => router.replace("/onboarding"), 2500);
    return () => clearTimeout(t);
  }, [status, router]);

  // While the link is being checked: only the branded loader, nothing else.
  if (status === "checking") return <BrandLoader label="Confirming your email..." />;

  return (
    <AuthShell>

      {status === "confirmed" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#01C4FA]/30 bg-[#01C4FA]/10 shadow-[0_0_24px_rgba(1,196,250,0.3)]">
            <CheckCircle2 className="h-7 w-7 text-[#01C4FA] light:text-[#233067]" />
          </div>
          <h1 className={authTitle}>Email confirmed</h1>
          <p className={authText}>Thank you. Your account is ready. Taking you to set up your AI sales assistant...</p>
          <button
            type="button"
            onClick={() => router.replace("/onboarding")}
            style={{ touchAction: "manipulation" }}
            className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-full rounded-xl bg-gradient-to-r from-[#01C4FA] to-[#233067] py-3 text-sm font-bold text-white shadow-[0_0_18px_rgba(1,196,250,0.35)] transition-transform hover:scale-[1.01]"
          >
            Continue
          </button>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] light:border-[#233067]/15 light:bg-[#233067]/5">
            <Link2Off className="h-7 w-7 text-white/70 light:text-[#233067]/70" />
          </div>
          <h1 className={authTitle}>{expired ? "This link has expired" : "This link didn't work"}</h1>
          <p className={authText}>
            No problem. {email ? "Send a fresh link to your email" : "Enter your email and we'll send a fresh link"}, then
            open the newest email.
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
