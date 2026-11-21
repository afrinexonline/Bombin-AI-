import { isAuthRetryableFetchError, type User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

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

/** Forget any login saved in this browser (used before sign-up / sign-in). */
export async function clearLocalLogin() {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    /* nothing saved, or offline: nothing more to do */
  }
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
