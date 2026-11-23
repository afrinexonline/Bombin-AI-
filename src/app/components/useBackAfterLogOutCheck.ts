"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

/*
 * Step 3D: after logging out, the phone's Back button must never show a
 * logged-in page again.
 * - Logging out (here or in another tab) sends this page to the landing page.
 * - Browsers may show a saved snapshot of a page on Back ("back-forward cache");
 *   when that happens we reload, so the door check runs again for real.
 */
export function useBackAfterLogOutCheck() {
  const router = useRouter();

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/");
    });

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      subscription.unsubscribe();
    };
  }, [router]);
}
