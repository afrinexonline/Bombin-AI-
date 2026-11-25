"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { ServicesDropdown, ServicesMobileButton } from "./ServicesMenu";

/*
 * Top bar for the public service pages (Step 4A). Follows the light/dark theme.
 * "Log In" and "Start Selling" open those pop-ups on the landing page.
 */
const TOUCH = "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer";

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-card)] bg-[var(--bg-body)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-8">
        <Link href="/" style={{ touchAction: "manipulation" }} className={`${TOUCH} flex min-w-0 items-center gap-2`} aria-label="Bombin AI home">
          <Image src="/logo-mark.png" alt="" width={48} height={48} className="-mx-1 h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(1,196,250,0.35)] sm:h-12 sm:w-12" priority />
          <span className="truncate text-base font-extrabold tracking-tight text-white sm:text-lg light:text-[#233067]">
            Bombin <span className="text-[#01C4FA]">AI</span>
          </span>
        </Link>

        <ServicesDropdown tone="auto" />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#01C4FA] backdrop-blur-md transition-colors hover:bg-white/[0.08] light:border-[#233067]/15 light:bg-white/70 light:text-[#233067]`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link
            href="/?login=1"
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] sm:block light:border-[#233067]/15 light:bg-white/70 light:text-[#233067]`}
          >
            Log In
          </Link>
          <Link
            href="/?signup=1"
            style={{ touchAction: "manipulation" }}
            className={`${TOUCH} btn-gradient whitespace-nowrap px-3.5 py-2 text-sm font-bold text-white`}
          >
            Start Selling
          </Link>
          <ServicesMobileButton tone="auto" accountLinks />
        </div>
      </div>
    </header>
  );
}
