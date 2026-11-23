"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { PASSWORD_RULES } from "../../lib/passwordRules";

/*
 * Live password checklist (Step 3C). Each rule ticks off as the person types.
 * Same look on the sign-up pop-up (tone="dark") and the reset page (tone="auto").
 * `extra` adds page-specific rules, e.g. "Both passwords match".
 */
export default function PasswordRules({
  password,
  tone = "auto",
  extra = [],
  showBase = true,
  id,
}: {
  password: string;
  tone?: "auto" | "dark";
  extra?: { label: string; ok: boolean }[];
  /** false = show only the extra rules (e.g. under a "confirm password" box). */
  showBase?: boolean;
  id?: string;
}) {
  const dark = tone === "dark";
  const base = showBase ? PASSWORD_RULES.map((r) => ({ label: r.label, ok: r.test(password) })) : [];
  const items = [...base, ...extra];

  return (
    <ul id={id} aria-label="Password rules" className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.label}
          className={`flex items-center gap-2 transition-colors ${
            item.ok
              ? `text-[#01C4FA] ${dark ? "" : "light:text-[#233067]"}`
              : `text-white/45 ${dark ? "" : "light:text-[#233067]/50"}`
          }`}
        >
          {item.ok ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 drop-shadow-[0_0_6px_rgba(1,196,250,0.5)]" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{item.label}</span>
          <span className="sr-only">{item.ok ? "(done)" : "(not yet)"}</span>
        </li>
      ))}
    </ul>
  );
}
