"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BrandLoader from "./BrandLoader";

/*
 * Brand loader between pages (Step 3D, "no landing page flash").
 *
 * Why it lives here, above everything else: when someone logs in or out, the app
 * rebuilds its whole page tree (OnboardingProvider resets its state per user).
 * A loader inside a page would vanish during that rebuild and let the landing page
 * show for a moment. This one sits outside that rebuild, so it stays on screen
 * from the button press until the next page is actually showing.
 *
 * Usage: const { go } = useNavTransition(); go("/dashboard", "Opening your dashboard...");
 */

type NavTransition = {
  /** Show the brand loader now, then move to `href` (replacing this page in history). */
  go: (href: string, label?: string) => void;
  /** Show the brand loader without moving (e.g. while logging out). */
  show: (label?: string) => void;
  hide: () => void;
};

const Ctx = createContext<NavTransition | null>(null);

// If a move somehow never happens, don't leave the loader up forever.
const SAFETY_TIMEOUT_MS = 15_000;

export function NavTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [label, setLabel] = useState<string | null>(null);
  const startedOn = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    startedOn.current = null;
    setLabel(null);
  }, []);

  const show = useCallback(
    (text = "Loading...") => {
      startedOn.current = window.location.pathname;
      setLabel(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, SAFETY_TIMEOUT_MS);
    },
    [hide],
  );

  const go = useCallback(
    (href: string, text = "Loading...") => {
      show(text);
      router.replace(href);
    },
    [router, show],
  );

  // The new page is on screen: its own loader (if any) takes over from here.
  useEffect(() => {
    if (label !== null && startedOn.current !== null && pathname !== startedOn.current) hide();
  }, [pathname, label, hide]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <Ctx.Provider value={{ go, show, hide }}>
      {children}
      {label !== null && <BrandLoader label={label} />}
    </Ctx.Provider>
  );
}

export function useNavTransition(): NavTransition {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNavTransition must be used inside NavTransitionProvider");
  return ctx;
}
