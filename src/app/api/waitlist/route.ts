import { NextResponse, type NextRequest } from "next/server";
import { checkWaitlist, channelsFor } from "../../lib/waitlist";
import { underRateLimit, visitorKey } from "../../lib/emailServerChecks";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

/*
 * POST /api/waitlist  { name, whatsapp, email, choice: "instagram" | "tiktok" | "both" }
 * Step 4B: join the waitlist for the coming-soon Instagram / TikTok assistants.
 *
 * - Rate-limited per visitor, like orders. Everything is checked here.
 * - Saves with the server-only admin client into "waitlist" (no public access at all).
 * - "Both" is saved as one row per channel. A number already on a channel's list is
 *   not added again (the table forbids it too).
 * - Answers { result: "joined" } or { result: "already" }; errors say what to fix.
 * - Nothing personal is ever logged.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4_000;

export async function POST(request: NextRequest) {
  if (!underRateLimit(`waitlist:${visitorKey(request.headers)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a minute and try again." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) throw new Error("too large");
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  const checked = checkWaitlist(body as Record<string, string>);
  if (!checked.ok) {
    return NextResponse.json({ error: "Please check the form.", errors: checked.errors }, { status: 400 });
  }
  const v = checked.value;

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error("waitlist: not saved (server key not set)");
    return NextResponse.json({ error: "We couldn't save that right now. Please try again in a moment." }, { status: 503 });
  }

  const channels = channelsFor(v.choice);
  const { data: existing, error: readError } = await admin
    .from("waitlist")
    .select("channel")
    .eq("whatsapp", v.whatsapp)
    .in("channel", channels);
  if (readError) {
    console.error("waitlist: read failed", readError.code ?? "unknown");
    return NextResponse.json({ error: "We couldn't save that right now. Please try again in a moment." }, { status: 502 });
  }

  const already = new Set((existing ?? []).map((r: { channel: string }) => r.channel));
  const toAdd = channels.filter((c) => !already.has(c));
  if (toAdd.length === 0) return NextResponse.json({ result: "already" });

  const { error } = await admin.from("waitlist").insert(
    toAdd.map((channel) => ({ full_name: v.name, whatsapp: v.whatsapp, email: v.email || null, channel })),
  );
  if (error) {
    // Added a moment ago by another tap: treat as already on the list.
    if (error.code === "23505") return NextResponse.json({ result: "already" });
    console.error("waitlist: insert failed", error.code ?? "unknown");
    return NextResponse.json({ error: "We couldn't save that right now. Please try again in a moment." }, { status: 502 });
  }
  return NextResponse.json({ result: "joined" });
}
