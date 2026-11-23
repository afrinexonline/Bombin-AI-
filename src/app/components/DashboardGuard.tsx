"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { getVerifiedUser, isEmailConfirmed } from "../lib/authEmail";
import BrandLoader from "./auth/BrandLoader";
import { useBackAfterLogOutCheck } from "./useBackAfterLogOutCheck";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  useBackAfterLogOutCheck();

  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndOnboarding() {
      try {
        // Ask Supabase who this really is (a stale or deleted login counts as logged out).
        const { user } = await getVerifiedUser();

        if (!isMounted) return;

        if (!user) {
          router.replace("/");
          return;
        }

        // Only confirmed emails (or Google accounts) may use the dashboard.
        if (!isEmailConfirmed(user)) {
          router.replace("/check-email");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("current_step")
          .eq("id", user.id)
          .single();

        if (!isMounted) return;

        const currentStep = profile?.current_step || 1;

        if (currentStep < 4) {
          router.replace("/onboarding");
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error("DashboardGuard verification failed:", err);
        if (isMounted) {
          router.replace("/");
        }
      }
    }

    checkAuthAndOnboarding();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Brand loader while checking (Step 3D): never the landing page, never the dashboard.
  if (!isAuthorized) {
    return <BrandLoader label="Opening your dashboard..." />;
  }

  return <>{children}</>;
}
