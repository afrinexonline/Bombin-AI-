import { isAuthRetryableFetchError, type User } from "@supabase/supabase-js";
import { supabase, supabaseUrl } from "./supabaseClient";

/*
 * Shared helpers for email confirmation (Step 3).
 * Works whether "Confirm email" is OFF or ON in Supabase.
 */

/**
 * Ask Supabase itself who is logged in, instead of trusting the login saved in
 * this browser (which can be stale, e.g. for an account that was deleted).
 * - user: the real, current user, or null when logged out / deleted / invalid.
 * - offline: true when Supabase could not be reached (we can't tell either way).
 * A login Supabase rejects is removed from this browser.
 */
export async function getVerifiedUser(): Promise<{ user: User | null; offline: boolean }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { user: null, offline: false };

  const { data, error } = await supabase.auth.getUser();
  if (!error && data.user) return { user: data.user, offline: false };

  if (error && isAuthRetryableFetchError(error)) {
    return { user: null, offline: true };
  }
  // Supabase says this login is no good (user deleted, session ended, bad token).
  await clearLocalLogin();
  return { user: null, offline: false };
}

/** Supabase's saved-login keys in this browser (e.g. "sb-<project>-auth-token"). */
function wipeSavedLoginKeys() {
  try {
    const ref = new URL(supabaseUrl).hostname.split(".")[0];
    const base = `sb-${ref}-auth-token`;
    for (const key of [base, `${base}-code-verifier`, `${base}-user`]) {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* storage blocked or no URL: nothing saved */
  }
}

/**
 * Forget any login saved in this browser (used before sign-up, after a password
 * reset, and on log-out). Returns false if Supabase couldn't be told (e.g. offline);
 * the login is still wiped from this browser in that case.
 */
export async function clearLocalLogin(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (!error) return true;
  } catch {
    /* fall through */
  }
  // Supabase only removes the saved login when it got an answer. Remove it ourselves.
  wipeSavedLoginKeys();
  return false;
}

/** Only clear when a login is actually saved (saves a server trip when there is none). */
export async function clearLocalLoginIfAny() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) await clearLocalLogin();
}

/**
 * Log out completely in this browser: the Supabase login plus our own saved
 * onboarding draft and email-link notes. Keeps only harmless things like the theme
 * and the "wait before resending" timers.
 * Returns false if Supabase couldn't be reached (the browser copy is wiped anyway;
 * the caller should then do a full page load so nothing stays in memory).
 */
export async function logOut(): Promise<boolean> {
  const clean = await clearLocalLogin();
  try {
    for (const key of ["bombin-onboarding", "bombin-pending-email", "bombin-link-kind"]) {
      window.localStorage.removeItem(key);
    }
    for (const key of ["bombin-recovery", "bombin-reset-done", "bombin-link-error"]) {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
  return clean;
}

/** Where the link in the confirmation email sends people: the site the person is on
 * right now (https://www.bombinai.com live, or localhost), never a hard-coded address. */
export function confirmRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/confirm`;
}

/**
 * A user counts as confirmed when Supabase has set email_confirmed_at.
 * Google users are treated as confirmed: Google has already checked their email.
 */
export function isEmailConfirmed(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.email_confirmed_at) return true;
  const providers = [
    user.app_metadata?.provider,
    ...((user.app_metadata?.providers as string[] | undefined) ?? []),
    ...(user.identities ?? []).map((i) => i.provider),
  ];
  return providers.includes("google");
}

/* The address we just sent an email to, kept in this browser only (never in the URL). */
const PENDING_EMAIL_KEY = "bombin-pending-email";

export function savePendingEmail(email: string) {
  try {
    window.localStorage.setItem(PENDING_EMAIL_KEY, email.trim());
  } catch {
    /* storage blocked: the screens will ask for the email instead */
  }
}

export function readPendingEmail(): string {
  try {
    return window.localStorage.getItem(PENDING_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearPendingEmail() {
  try {
    window.localStorage.removeItem(PENDING_EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

/* Resend wait: 60 seconds, remembered across page reloads. */
export const RESEND_WAIT_SECONDS = 60;
const LAST_SENT_KEY = "bombin-email-last-sent";

export function markEmailSent() {
  try {
    window.localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function secondsUntilResend(): number {
  try {
    const last = Number(window.localStorage.getItem(LAST_SENT_KEY) ?? 0);
    const left = RESEND_WAIT_SECONDS - Math.floor((Date.now() - last) / 1000);
    return Math.max(0, Math.min(RESEND_WAIT_SECONDS, left));
  } catch {
    return 0;
  }
}

/* Which kind of email link we sent last ("signup" or "recovery"). Only used to send an
 * expired link that lands on the home page to the right screen. Never holds personal data. */
const LINK_KIND_KEY = "bombin-link-kind";

export function markLinkKind(kind: "signup" | "recovery") {
  try {
    window.localStorage.setItem(LINK_KIND_KEY, kind);
  } catch {
    /* ignore */
  }
}

/** Where the password-reset email link sends people (the site the person is on right now). */
export function resetRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/reset-password`;
}
