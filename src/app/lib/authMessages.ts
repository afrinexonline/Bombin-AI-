import { isAuthRetryableFetchError } from "@supabase/supabase-js";

/*
 * One shared set of friendly messages for every log-in / sign-up / email screen (Step 3D).
 * Rule: only mention the person's internet when the browser itself says it is offline.
 * Any other failure is treated as ours, and worded that way.
 */
export const AUTH_MSG = {
  offline: "You seem to be offline. Check your connection, then try again.",
  busy: "We couldn't finish that just now. Please try again in a moment.",
  waitBeforeResend: "Please wait a little before asking for another email.",
  wrongLogin: "Wrong email or password. Please try again.",
  loginFailed: "We couldn't log you in just now. Please try again in a moment.",
  emailFormat: "Please enter a full email address, like name@gmail.com.",
  confirmFirst:
    "Please confirm your email first. Check your inbox (and spam) for our link, or send a new one below.",
  signupFailed: "We couldn't create your account right now. Please try again.",
  passwordNotSaved: "We couldn't save your new password just now. Please try again in a moment.",
  passwordReused: "Please choose a password you haven't used here before.",
  passwordWeak: "That password is too easy to guess. Please choose a stronger one.",
  passwordsDiffer: "The two passwords don't match yet.",
  googleUnavailable: "Google log-in is not available right now. Please use your email and password.",
} as const;

/** True only when the browser itself reports no connection. */
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/**
 * When the browser is offline, wait (up to `ms`) for the connection to come back.
 * Resolves true if we are online (now or within the wait), false if still offline.
 * Used for the one quiet automatic retry: nothing has been sent yet at this point.
 */
export function waitUntilOnline(ms = 8000): Promise<boolean> {
  if (!isOffline()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (ok: boolean) => {
      window.removeEventListener("online", onOnline);
      clearTimeout(timer);
      resolve(ok);
    };
    const onOnline = () => done(true);
    const timer = setTimeout(() => done(!isOffline()), ms);
    window.addEventListener("online", onOnline);
  });
}

/** The request may have reached the server but the answer got lost (no reply, timeout, 5xx). */
export function mayHaveReachedServer(error: unknown): boolean {
  if (!error) return false;
  if (isAuthRetryableFetchError(error)) return true;
  const msg = (error as { message?: string })?.message ?? "";
  return /fetch|network|load failed|timed out|timeout/i.test(msg);
}

/** Friendly text for a failure where nothing changed (e.g. a log-in that didn't go through). */
export function networkMessage(fallback: string = AUTH_MSG.busy): string {
  return isOffline() ? AUTH_MSG.offline : fallback;
}

/** Give up waiting after `ms`; the original request may still finish on the server. */
export class RequestTimeout extends Error {
  constructor() {
    super("Request timed out");
    this.name = "RequestTimeout";
  }
}

export function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new RequestTimeout()), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/** Supabase's "you asked too often" answer. */
export function isRateLimited(error: { status?: number; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.status === 429 || /security purposes|rate limit|too many/i.test(error.message ?? "");
}
