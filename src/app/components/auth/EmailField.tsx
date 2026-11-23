"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import {
  EMAIL_PROBLEM_TEXT,
  emailDomain,
  isValidEmailFormat,
  suggestEmailFix,
  type EmailProblem,
} from "../../lib/emailChecks";
import { authInput } from "./AuthShell";

/*
 * Email box with friendly checks shown right under it (Step 3C):
 * - "Please enter a full email address" when the format is wrong
 * - "Did you mean name@gmail.com?" with a one-tap fix for common slips
 * - (sign-up only) a quick server check for throwaway emails and domains that
 *   can't receive mail. Only the part after "@" is sent. If that check fails,
 *   nothing is shown and the person is never blocked by it.
 *
 * tone="dark" for the landing-page pop-ups (always dark); "auto" follows the theme.
 */

type ServerState = "idle" | "checking" | "ok" | EmailProblem;

export default function EmailField({
  id,
  label = "Email Address",
  value,
  onChange,
  tone = "auto",
  serverCheck = false,
  showErrors = false,
  autoComplete = "email",
  onServerProblem,
}: {
  /** Called with "disposable" / "no_mail" while that message is shown under the box, else null. */
  onServerProblem?: (problem: EmailProblem | null) => void;
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  tone?: "auto" | "dark";
  serverCheck?: boolean;
  /** Set true after a submit attempt so the format message shows even before leaving the box. */
  showErrors?: boolean;
  autoComplete?: string;
}) {
  const [touched, setTouched] = useState(false);
  const [settled, setSettled] = useState(value);
  const [server, setServer] = useState<ServerState>("idle");
  const cache = useRef(new Map<string, ServerState>());

  // Wait until typing pauses before judging the address.
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), 600);
    return () => clearTimeout(t);
  }, [value]);

  const paused = settled === value && value.trim() !== "";
  const formatOk = isValidEmailFormat(value);
  const suggestion = paused || touched ? suggestEmailFix(value) : null;
  const showFormatError = !formatOk && value.trim() !== "" && (touched || showErrors);
  const showEmptyError = value.trim() === "" && showErrors;

  // Server check (sign-up only), once per domain.
  useEffect(() => {
    if (!serverCheck) return;
    if (!isValidEmailFormat(settled)) {
      setServer("idle");
      return;
    }
    const domain = emailDomain(settled);
    const known = cache.current.get(domain);
    if (known) {
      setServer(known);
      return;
    }
    let active = true;
    setServer("checking");
    (async () => {
      let result: ServerState = "ok";
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        const data = await res.json().catch(() => null);
        if (data && data.ok === false && typeof data.problem === "string") {
          result = data.problem as EmailProblem;
        }
        // Rate limited or any odd answer: treat as fine (never block on a failed check).
        if (res.ok || data?.ok === false) cache.current.set(domain, result);
      } catch {
        result = "ok";
      }
      if (active) setServer(result);
    })();
    return () => {
      active = false;
    };
  }, [settled, serverCheck]);

  const dark = tone === "dark";
  const serverProblem: EmailProblem | null =
    server === "disposable" || server === "no_mail" || server === "format" ? server : null;
  const message = showEmptyError
    ? "Please enter your email address."
    : showFormatError
      ? EMAIL_PROBLEM_TEXT.format
      : formatOk && settled === value && serverProblem && !suggestion // a typo fix is more helpful
        ? EMAIL_PROBLEM_TEXT[serverProblem]
        : null;
  const hasError = Boolean(message);

  // Tell the form about a throwaway / no-mail problem, so it can stop before sending.
  const shownServerProblem = message && serverProblem && message === EMAIL_PROBLEM_TEXT[serverProblem] ? serverProblem : null;
  useEffect(() => {
    onServerProblem?.(shownServerProblem);
  }, [shownServerProblem, onServerProblem]);
  const showOk = serverCheck && formatOk && settled === value && server === "ok" && !suggestion;

  const inputClass = dark
    ? "w-full bg-white/[0.05] border backdrop-blur-xl rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors " +
      (hasError ? "border-rose-400/60 focus:border-rose-400/80" : "border-white/10 focus:border-[#00C9FF]/50")
    : `${authInput} pr-10 ${hasError ? "!border-rose-400/60" : ""}`;

  const messageId = `${id}-help`;

  return (
    <div>
      <label
        htmlFor={id}
        className={
          dark
            ? "block text-xs font-semibold text-white/40 mb-1"
            : "block text-xs font-semibold text-white/50 mb-1 light:text-[#233067]/70"
        }
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          placeholder="name@example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={hasError}
          aria-describedby={message || suggestion ? messageId : undefined}
          className={inputClass}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-0" aria-hidden="true">
          {serverCheck && server === "checking" && settled === value && (
            <Loader2 className="h-4 w-4 animate-spin text-white/40 light:text-[#233067]/40" />
          )}
          {showOk && <CheckCircle2 className={`h-4 w-4 text-[#01C4FA] ${dark ? "" : "light:text-[#233067]"}`} />}
        </span>
      </div>

      <div id={messageId} aria-live="polite">
        {message && (
          <p className={`mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-rose-300 ${dark ? "" : "light:text-rose-600"}`}>
            <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
            <span>{message}</span>
          </p>
        )}
        {!message && suggestion && (
          <div
            className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-xl border border-[#01C4FA]/25 bg-[#01C4FA]/[0.07] px-3 py-2 text-xs text-white/75 ${
              dark ? "" : "light:border-[#233067]/15 light:bg-[#233067]/[0.05] light:text-[#233067]/80"
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 shrink-0 text-[#01C4FA] ${dark ? "" : "light:text-[#233067]"}`} />
            <span className="min-w-0 break-all">
              Did you mean{" "}
              <strong className={`font-semibold text-white ${dark ? "" : "light:text-[#233067]"}`}>{suggestion}</strong>?
            </span>
            <button
              type="button"
              onClick={() => onChange(suggestion)}
              style={{ touchAction: "manipulation" }}
              className={`pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ml-auto rounded-lg bg-[#01C4FA] px-2.5 py-1 text-[11px] font-bold text-[#233067] transition-transform hover:scale-[1.03] ${
                dark ? "" : "light:bg-[#233067] light:text-white"
              }`}
            >
              Yes, fix it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
