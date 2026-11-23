/*
 * Reading the error that Supabase puts on a used or expired email link (Step 3D).
 * Rule for every email-link page: look at the link's error FIRST, before checking who is
 * logged in, so a rejected link can never show "Email confirmed" or the new-password form.
 *
 * The tiny script in layout.tsx also saves the error for this tab the moment the page
 * opens (key below), in case anything tidies the web address before the page reads it.
 */
export const LINK_ERROR_KEY = "bombin-link-error";
const LINK_ERROR_MAX_AGE_MS = 2 * 60 * 1000;

function fromAddress(): string | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return (
    hash.get("error_code") || query.get("error_code") || hash.get("error") || query.get("error") || null
  );
}

function fromSaved(): string | null {
  try {
    const raw = window.sessionStorage.getItem(LINK_ERROR_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { code?: string; at?: number; path?: string };
    if (!saved.at || Date.now() - saved.at > LINK_ERROR_MAX_AGE_MS) return null;
    if (saved.path && saved.path !== window.location.pathname) return null;
    return saved.code || "error";
  } catch {
    return null;
  }
}

/** The link's error code (e.g. "otp_expired"), or null when the link carried no error. */
export function readLinkError(): string | null {
  if (typeof window === "undefined") return null;
  return fromAddress() ?? fromSaved();
}

export function forgetLinkError() {
  try {
    window.sessionStorage.removeItem(LINK_ERROR_KEY);
  } catch {
    /* ignore */
  }
}

/** Remove the link details from the address bar (so a reload doesn't re-read them). */
export function tidyAddress() {
  if (window.location.hash || window.location.search) {
    window.history.replaceState(window.history.state, "", window.location.pathname);
  }
}
