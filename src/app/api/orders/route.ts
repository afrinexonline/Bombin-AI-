import { NextResponse, type NextRequest } from "next/server";
import { quote, cleanChoices, SERVICES, type ServiceId } from "../../lib/pricing";
import { checkContact, makeReference } from "../../lib/orders";
import { underRateLimit, visitorKey } from "../../lib/emailServerChecks";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

/*
 * POST /api/orders  { service, choices, contact: { name, business, whatsapp, email, notes } }
 * Step 4A: saves a service order from the price calculators.
 *
 * - Rate-limited per visitor, like sign-up.
 * - Everything is checked here, and the price is worked out again HERE from pricing.ts.
 *   The browser's own number is never trusted (it isn't even sent).
 * - Saves into the "service_orders" table with the server-only admin client. That table
 *   has no public access at all, so this route is the only way in.
 * - Answers { reference, quote, saved }. If saving fails, saved is false but the reference
 *   and quote still come back, so the browser can still open WhatsApp and nothing is lost.
 * - Nothing personal is ever logged.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;

export async function POST(request: NextRequest) {
  if (!underRateLimit(`orders:${visitorKey(request.headers)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a minute and try again." }, { status: 429 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) throw new Error("too large");
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  const service = body?.service;
  if (typeof service !== "string" || !(service in SERVICES)) {
    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  }
  const serviceId = service as ServiceId;

  const contact = checkContact((body.contact ?? {}) as Record<string, string>);
  if (!contact.ok) {
    return NextResponse.json({ error: "Please check the form.", errors: contact.errors }, { status: 400 });
  }

  // Recalculate from our own price list. Never trust the browser's total.
  const choices = cleanChoices(serviceId, body.choices);
  const q = quote(serviceId, choices);
  const c = contact.value;

  const admin = getSupabaseAdmin();
  let reference = makeReference(serviceId);
  if (!admin) {
    console.error("orders: not saved (server key not set)");
    return NextResponse.json({ reference, quote: q, saved: false });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await admin.from("service_orders").insert({
      reference,
      service: serviceId,
      choices,
      quote: q,
      estimated_total: q.custom ? null : q.oneTime,
      monthly_total: q.custom && q.main === "monthly" ? null : q.monthly,
      is_custom_quote: q.custom,
      delivery_estimate: q.deliveryText,
      full_name: c.name,
      business_name: c.business || null,
      whatsapp: c.whatsapp,
      email: c.email || null,
      notes: c.notes || null,
    });
    if (!error) return NextResponse.json({ reference, quote: q, saved: true });
    if (error.code === "23505") {
      reference = makeReference(serviceId); // reference already used: try a new one
      continue;
    }
    console.error("orders: insert failed", error.code ?? "unknown");
    break;
  }
  return NextResponse.json({ reference, quote: q, saved: false });
}
