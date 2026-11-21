"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { getVerifiedUser, isEmailConfirmed } from "../lib/authEmail";

/*
 * Door check for onboarding (Step 3.6).
 * - Not signed in            -> home page
 * - Email not confirmed      -> "Check your email"
 * - Onboarding already done  -> dashboard
 */
export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Ask Supabase who this really is (a stale or deleted login counts as logged out).
        const { user } = await getVerifiedUser();
        if (!isMounted) return;

        if (!user) {
          router.replace("/");
          return;
        }
        if (!isEmailConfirmed(user)) {
          router.replace("/check-email");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("current_step")
          .eq("id", user.id)
          .maybeSingle();
        if (!isMounted) return;

        // Same rule as the dashboard guard: step 4 saved means onboarding is finished.
        if ((profile?.current_step ?? 1) >= 4) {
          router.replace("/dashboard");
          return;
        }
        setAllowed(true);
      } catch (err) {
        console.error("OnboardingGuard check failed:", err);
        if (isMounted) router.replace("/");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
