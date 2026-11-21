"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { isEmailConfirmed } from "../lib/authEmail";

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
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session) {
          router.replace("/");
          return;
        }
        if (!isEmailConfirmed(session.user)) {
          router.replace("/check-email");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("current_step")
          .eq("id", session.user.id)
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
