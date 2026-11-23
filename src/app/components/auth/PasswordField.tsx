"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInput } from "./AuthShell";

/*
 * Password box with a show/hide eye (Step 3C; used on EVERY password box since Step 3D:
 * log-in pop-up, sign-up pop-up and the reset page).
 * tone="auto" follows the dark/light theme; tone="dark" is for the landing-page
 * pop-ups, which are always dark. `labelAction` sits on the right of the label
 * (e.g. the "Forgot password?" link).
 */
const darkInput =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/25 backdrop-blur-xl transition-colors focus:border-[#01C4FA]/60 focus:outline-none";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "new-password",
  placeholder = "••••••••",
  invalid = false,
  tone = "auto",
  labelAction,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  invalid?: boolean;
  tone?: "auto" | "dark";
  labelAction?: React.ReactNode;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);
  const dark = tone === "dark";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className={`block text-xs font-semibold text-white/50 ${dark ? "" : "light:text-[#233067]/70"}`}
        >
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={`${dark ? darkInput : authInput} pr-12 ${invalid ? "!border-rose-400/60" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-controls={id}
          aria-pressed={visible}
          style={{ touchAction: "manipulation" }}
          className={`pointer-events-auto absolute right-1.5 top-1/2 -translate-y-1/2 z-30 touch-action-manipulation cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-[#01C4FA] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#01C4FA]/60 ${
            visible ? "text-[#01C4FA]" : "text-white/45"
          } ${dark ? "" : visible ? "light:text-[#233067]" : "light:text-[#233067]/50 light:hover:text-[#233067]"}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
