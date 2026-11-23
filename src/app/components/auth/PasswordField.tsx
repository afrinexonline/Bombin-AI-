"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInput } from "./AuthShell";

/*
 * Password box with a show/hide eye (Step 3C, used on the reset page).
 * Follows the dark/light theme like the other email screens.
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "new-password",
  placeholder = "••••••••",
  invalid = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-white/50 mb-1 light:text-[#233067]/70">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          className={`${authInput} pr-12 ${invalid ? "!border-rose-400/60" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          style={{ touchAction: "manipulation" }}
          className="pointer-events-auto absolute right-1.5 top-1/2 -translate-y-1/2 z-30 touch-action-manipulation cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition-colors hover:text-[#01C4FA] light:text-[#233067]/50 light:hover:text-[#233067]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
