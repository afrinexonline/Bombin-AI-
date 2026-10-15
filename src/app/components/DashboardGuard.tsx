"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndOnboarding() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (!session) {
          router.replace("/");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("current_step")
          .eq("id", session.user.id)
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

  // Render a subtle loading state while verifying to prevent content flash
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
