import { NextResponse, type NextRequest } from "next/server";
import { isDisposableEmailDomain } from "disposable-email-domains-js";
import { isValidEmailFormat } from "../../../lib/emailChecks";
import { domainCanReceiveMail, underRateLimit, visitorKey } from "../../../lib/emailServerChecks";

/*
 * POST /api/auth/check-email  { domain: "gmail.com" }
 * Live check while someone types their email at sign-up (Step 3C).
 * Privacy: only the part after "@" is sent here, and nothing is logged.
 * Answers: { ok: true } or { ok: false, problem: "format" | "disposable" | "no_mail" }.
 * "Couldn't check" always answers ok: true, so a DNS problem never blocks anyone.
 */

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // About 20 checks a minute per visitor is plenty for typing an email.
  if (!underRateLimit(`check:${visitorKey(request.headers)}`, 20, 60_000)) {
    return NextResponse.json({ ok: true, skipped: "rate_limited" }, { status: 429 });
  }

  let domain = "";
  try {
    const body = await request.json();
    domain = typeof body?.domain === "string" ? body.domain.trim().toLowerCase() : "";
  } catch {
    /* bad body: treated as a bad domain below */
  }

  if (!domain || domain.length > 253 || !isValidEmailFormat(`check@${domain}`)) {
    return NextResponse.json({ ok: false, problem: "format" });
  }
  if (isDisposableEmailDomain(domain)) {
    return NextResponse.json({ ok: false, problem: "disposable" });
  }
  const mail = await domainCanReceiveMail(domain);
  if (mail === "no_mail") {
    return NextResponse.json({ ok: false, problem: "no_mail" });
  }
  return NextResponse.json({ ok: true });
}
