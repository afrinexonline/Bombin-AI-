import { promises as dns } from "node:dns";
import { isDisposableEmailDomain } from "disposable-email-domains-js";
import { emailDomain, isValidEmailFormat, type EmailProblem } from "./emailChecks";

/*
 * Server-only email checks (Step 3C). Imported only by API routes.
 * - Disposable list: "disposable-email-domains-js" (CC0 public domain, ~10,400 domains,
 *   copied from the community list github.com/disposable-email-domains).
 * - Mail check: asks DNS whether the domain has a mail server (MX record).
 * Nothing here ever logs an email address or domain.
 * If the mail check itself fails (timeout, DNS trouble), we let the person through.
 */

const MX_TIMEOUT_MS = 3000;
const CACHE_MS = 10 * 60 * 1000;

type MailResult = "ok" | "no_mail" | "unknown";
const mxCache = new Map<string, { result: MailResult; at: number }>();

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

const codeOf = (err: unknown) => (err as { code?: string })?.code ?? "";

// Clear DNS answers ("no such domain" / "no record"). Anything else means the lookup itself failed.
const DEFINITE = new Set(["ENOTFOUND", "ENODATA"]);

// Backup public DNS (Cloudflare, Google), used only if the server's own DNS can't answer.
const backup = new dns.Resolver({ timeout: 2000, tries: 1 });
backup.setServers(["1.1.1.1", "8.8.8.8"]);

async function lookup<T>(ask: (r: Pick<dns.Resolver, "resolveMx" | "resolve4">) => Promise<T>): Promise<T> {
  try {
    return await withTimeout(ask(dns), MX_TIMEOUT_MS);
  } catch (err) {
    if (DEFINITE.has(codeOf(err))) throw err;
    return await withTimeout(ask(backup), MX_TIMEOUT_MS);
  }
}

/** Can this domain receive email? "unknown" means we couldn't tell (never block on that). */
export async function domainCanReceiveMail(domain: string): Promise<MailResult> {
  const cached = mxCache.get(domain);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.result;

  let result: MailResult = "unknown";
  try {
    const records = await lookup((r) => r.resolveMx(domain));
    // A single empty record ("null MX") means the domain says it never takes mail.
    const real = records.filter((r) => r.exchange && r.exchange !== ".");
    result = real.length > 0 ? "ok" : "no_mail";
  } catch (err) {
    const code = codeOf(err);
    if (code === "ENOTFOUND") {
      result = "no_mail"; // the domain doesn't exist at all
    } else if (code === "ENODATA") {
      // No MX record: mail can still go to the domain's own address (A/AAAA record).
      try {
        await lookup((r) => r.resolve4(domain));
        result = "ok";
      } catch (err4) {
        result = codeOf(err4) === "ENODATA" || codeOf(err4) === "ENOTFOUND" ? "no_mail" : "unknown";
      }
    } else {
      result = "unknown"; // timeout or DNS trouble: don't block anyone
    }
  }

  if (mxCache.size > 5000) mxCache.clear();
  mxCache.set(domain, { result, at: Date.now() });
  return result;
}

/** Full server check. Returns the problem, or null when the email may be used. */
export async function findEmailProblem(email: string): Promise<EmailProblem | null> {
  if (!isValidEmailFormat(email)) return "format";
  const domain = emailDomain(email);
  if (isDisposableEmailDomain(domain)) return "disposable";
  const mail = await domainCanReceiveMail(domain);
  return mail === "no_mail" ? "no_mail" : null;
}

/* ── Light rate limit (per server instance, in memory) ─────────────── */

const hits = new Map<string, { count: number; start: number }>();

/** True when this visitor is still under `limit` requests per `windowMs`. */
export function underRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (hits.size > 10000) hits.clear();
  const entry = hits.get(key);
  if (!entry || now - entry.start > windowMs) {
    hits.set(key, { count: 1, start: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/** The visitor's IP address as seen by Vercel (used only as a rate-limit key, never logged). */
export function visitorKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}
