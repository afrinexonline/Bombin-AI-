/*
 * Email checks that are safe to run in the browser AND on the server (Step 3C).
 * - Format check
 * - Typo help for the big free email providers ("gmial.com" -> "gmail.com")
 * The disposable-email and "can it receive mail" checks live on the server only
 * (see emailServerChecks.ts), so the big domain list is never sent to visitors.
 */

export const MAX_EMAIL_LENGTH = 254;

/** Trim spaces and lower-case the domain part (the part after @). */
export function normalizeEmail(raw: string): string {
  const email = raw.trim();
  const at = email.lastIndexOf("@");
  if (at < 0) return email;
  return email.slice(0, at) + "@" + email.slice(at + 1).toLowerCase();
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  return at < 0 ? "" : email.slice(at + 1).trim().toLowerCase();
}

const LOCAL_PART = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** True when the address looks like a real email address (name@domain.tld). */
export function isValidEmailFormat(raw: string): boolean {
  const email = normalizeEmail(raw);
  if (!email || email.length > MAX_EMAIL_LENGTH) return false;
  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !LOCAL_PART.test(local)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (!labels.every((l) => DOMAIN_LABEL.test(l))) return false;
  const tld = labels[labels.length - 1];
  return /^[a-z]{2,}$/.test(tld);
}

/* ── Typo help ─────────────────────────────────────── */

const POPULAR_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

// Real email domains that look close to the popular ones. Never "correct" these.
const REAL_LOOKALIKES = new Set([
  "mail.com", "email.com", "ymail.com", "googlemail.com", "gmx.com", "live.com", "msn.com",
  "me.com", "mac.com", "aol.com", "yahoo.co.uk", "yahoo.fr", "yahoo.ca", "yahoo.in",
  "hotmail.co.uk", "hotmail.fr", "outlook.fr", "outlook.co.uk", "proton.me", "protonmail.com",
  "gmail.co.uk", "zoho.com", "yandex.com",
]);

// Common slips in ".com", fixed only for the popular providers.
const COM_TYPOS = new Set(["con", "cmo", "ocm", "comm", "cpm", "vom", "xom", "coom", "cm", "om", "co", "cim", "cok"]);

/** Edit distance where swapping two neighbouring letters counts as one slip. */
function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/**
 * Suggest a corrected address when the domain looks like a slip of a popular
 * provider, e.g. "ada@gmial.con" -> "ada@gmail.com". Returns null otherwise.
 */
export function suggestEmailFix(raw: string): string | null {
  const email = raw.trim();
  const at = email.lastIndexOf("@");
  if (at <= 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || POPULAR_DOMAINS.includes(domain) || REAL_LOOKALIKES.has(domain)) return null;

  // 1) Whole-domain slips: "gmial.com", "yaho.com", "hotmal.com", "gmail.co"
  let best: { domain: string; distance: number } | null = null;
  for (const candidate of POPULAR_DOMAINS) {
    const distance = editDistance(domain, candidate);
    if (distance === 0) return null;
    if (distance <= 2 && (!best || distance < best.distance)) best = { domain: candidate, distance };
  }
  if (best) return `${local}@${best.domain}`;

  // 2) Name right but ending wrong: "gmail.cm", "outlook.comm"
  const dot = domain.lastIndexOf(".");
  if (dot > 0) {
    const name = domain.slice(0, dot);
    const tld = domain.slice(dot + 1);
    const match = POPULAR_DOMAINS.find((p) => p.startsWith(`${name}.`));
    if (match && COM_TYPOS.has(tld)) return `${local}@${match}`;
  }
  return null;
}

/* ── Messages (same wording in the browser and from the server) ── */

export type EmailProblem = "format" | "disposable" | "no_mail";

export const EMAIL_PROBLEM_TEXT: Record<EmailProblem, string> = {
  format: "Please enter a full email address, like name@gmail.com.",
  disposable: "Temporary or throwaway emails can't be used. Please use your main email address.",
  no_mail: "This email address can't receive mail. Please check it, or use another email.",
};
