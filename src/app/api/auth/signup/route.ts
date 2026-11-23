import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../../../lib/supabaseClient";
import { EMAIL_PROBLEM_TEXT, normalizeEmail } from "../../../lib/emailChecks";
import { PASSWORD_RULES_MESSAGE, passwordMeetsRules } from "../../../lib/passwordRules";
import { findEmailProblem, underRateLimit, visitorKey } from "../../../lib/emailServerChecks";

/*
 * POST /api/auth/signup  { email, password }
 * Sign-up goes through our server so the email checks can't be skipped in the browser (Step 3C):
 * format, disposable list and mail-server check run first, and only then do we ask Supabase
 * to create the account. Nothing personal is logged.
 *
 * Answers:
 * - { result: "check_email" }                     -> show "Check your email"
 *   (also used when the email already has an account, so nobody can find out who has one)
 * - { result: "signed_in", session: {...tokens} } -> "Confirm email" is OFF: logged in straight away
 * - { error: "..." } with status 400/429/502      -> show the message on the form
 *
 * Note: the Supabase public key is public by design, so someone could still call Supabase
 * directly. Closing that gap needs Supabase's "Before User Created" hook (a later step).
 */

export const runtime = "nodejs";

// Where the confirmation link may send people. Anything else falls back to the live site.
const LIVE_SITE = "https://www.bombinai.com";
const ALLOWED_ORIGINS = new Set([LIVE_SITE, "https://bombinai.com"]);

function confirmUrlFor(request: NextRequest): string {
  const origin = request.headers.get("origin") ?? "";
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const base = ALLOWED_ORIGINS.has(origin) || isLocal ? origin : LIVE_SITE;
  return `${base}/auth/confirm`;
}

export async function POST(request: NextRequest) {
  // A few tries a minute per visitor is enough for a real person.
  if (!underRateLimit(`signup:${visitorKey(request.headers)}`, 6, 60_000)) {
    return NextResponse.json(
      { error: "Too many tries. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    /* handled below */
  }

  const problem = await findEmailProblem(email);
  if (problem) {
    return NextResponse.json({ error: EMAIL_PROBLEM_TEXT[problem], problem }, { status: 400 });
  }
  if (!passwordMeetsRules(password)) {
    return NextResponse.json(
      { error: PASSWORD_RULES_MESSAGE },
      { status: 400 },
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: confirmUrlFor(request) },
  });

  if (error) {
    const msg = error.message ?? "";
    if (error.code === "user_already_exists" || /already registered|already exists/i.test(msg)) {
      return NextResponse.json({ result: "check_email" });
    }
    if (error.status === 429 || /rate limit|security purposes|too many/i.test(msg)) {
      return NextResponse.json(
        { error: "Too many sign-ups right now. Please wait a minute and try again." },
        { status: 429 },
      );
    }
    if (error.code === "weak_password" || /password/i.test(msg)) {
      return NextResponse.json(
        { error: "That password is too easy to guess. Please choose a stronger one." },
        { status: 400 },
      );
    }
    // Status code only: never the email or the message (it can contain the address).
    console.error(`[auth/signup] supabase_error status=${error.status ?? "none"} code=${error.code ?? "none"}`);
    return NextResponse.json(
      { error: "We couldn't create your account right now. Please try again." },
      { status: 502 },
    );
  }

  if (data.session) {
    return NextResponse.json({
      result: "signed_in",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  }
  return NextResponse.json({ result: "check_email" });
}
