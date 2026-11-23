"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logOut } from "../../lib/authEmail";
import { useNavTransition } from "./NavTransition";

/*
 * Log Out (Step 3D).
 * 1. The brand loader covers the screen at once (no dashboard or landing flash).
 * 2. The saved login and our own saved notes are wiped from this browser.
 * 3. Straight to the landing page, replacing the dashboard in the history, so the
 *    phone's Back button can't step back into it (and if it ever tries, the
 *    dashboard guard sends the person to the landing page).
 *
 * variant="sidebar": icon in the desktop sidebar. variant="topbar": compact icon
 * button for phones and tablets (the bottom bar is already full).
 */
export default function LogOutButton({ variant }: { variant: "sidebar" | "topbar" }) {
  const router = useRouter();
  const { show } = useNavTransition();
  const busy = useRef(false);

  const onLogOut = async () => {
    if (busy.current) return;
    busy.current = true;
    show("Logging you out...");
    const clean = await logOut();
    if (clean) {
      router.replace("/");
    } else {
      // Supabase couldn't be told (e.g. offline). The login is already wiped from this
      // browser; a full page load makes sure nothing of it stays in memory either.
      window.location.replace("/");
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={onLogOut}
        aria-label="Log out"
        title="Log out"
        id="nav-logout"
        style={{ touchAction: "manipulation" }}
        className="sidebar-icon group pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        <span
          className="absolute left-full ml-3 px-2.5 py-1 rounded-lg backdrop-blur-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            color: "var(--text-primary)",
          }}
        >
          Log out
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onLogOut}
      aria-label="Log out"
      title="Log out"
      id="topbar-logout"
      style={{ touchAction: "manipulation" }}
      className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#01C4FA]/25 bg-[#01C4FA]/[0.08] text-[#01C4FA] backdrop-blur-md transition-all hover:border-[#01C4FA]/50 hover:bg-[#01C4FA]/15 hover:shadow-[0_0_14px_rgba(1,196,250,0.3)] light:border-[#233067]/20 light:bg-[#233067]/[0.06] light:text-[#233067] light:hover:bg-[#233067]/10"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
