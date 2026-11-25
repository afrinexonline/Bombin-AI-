/*
 * Order helpers shared by the review screen (browser) and /api/orders (server). Step 4A.
 * No secrets here: this file runs in both places.
 */
import { SERVICES, WHATSAPP_NUMBER, headlinePrice, naira, type Quote, type ServiceId } from "./pricing";

export const NOTES_MAX = 500;

export interface ContactInput {
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  notes: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

/** Nigerian numbers (080…, +234…, 234…) become +234…; other countries must start with +. */
export function normalizeWhatsApp(raw: string): string | null {
  const s = raw.replace(/[\s()\-.]/g, "");
  let m = s.match(/^0([789][01]\d{8})$/);
  if (m) return `+234${m[1]}`;
  m = s.match(/^(?:\+|00)?234([789][01]\d{8})$/);
  if (m) return `+234${m[1]}`;
  m = s.match(/^(?:\+|00)([1-9]\d{7,14})$/);
  if (m) return `+${m[1]}`;
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Check the form. Returns cleaned values, or the problem with each field in plain words. */
export function checkContact(input: Partial<ContactInput>): { ok: true; value: ContactInput } | { ok: false; errors: ContactErrors } {
  const str = (v: unknown) => (typeof v === "string" ? v : "").trim();
  const name = str(input.name).replace(/\s+/g, " ");
  const business = str(input.business).replace(/\s+/g, " ");
  const email = str(input.email).toLowerCase();
  const notes = str(input.notes);
  const whatsapp = normalizeWhatsApp(str(input.whatsapp));
  const errors: ContactErrors = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  else if (name.length > 80) errors.name = "Please use 80 characters or fewer.";
  if (business.length > 100) errors.business = "Please use 100 characters or fewer.";
  if (!str(input.whatsapp)) errors.whatsapp = "Please enter your WhatsApp number.";
  else if (!whatsapp) errors.whatsapp = "Please check the number, e.g. 0803 123 4567 or +44 7700 900123.";
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) errors.email = "Please check the email address.";
  if (notes.length > NOTES_MAX) errors.notes = `Please keep notes to ${NOTES_MAX} characters.`;
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, business, whatsapp: whatsapp!, email, notes } };
}

/** Letters and numbers used in references (no easily confused ones like 0/O or 1/I). */
const REFERENCE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Order reference like BMB-W-7K3Q. */
export function makeReference(service: ServiceId): string {
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < bytes.length; i++) code += REFERENCE_CHARS.charAt(bytes[i] % REFERENCE_CHARS.length);
  return `BMB-${SERVICES[service].letter}-${code}`;
}

export function whatsAppLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function interestLink(serviceName: string): string {
  return whatsAppLink(`Hello Bombin, I'm interested in ${serviceName}. Can we talk?`);
}

/** The neat pre-typed WhatsApp message for an order. */
export function orderMessage(q: Quote, contact: ContactInput, reference: string): string {
  const svc = SERVICES[q.service];
  const out: string[] = [];
  out.push("Hello Bombin! I'd like to place an order.");
  out.push("");
  out.push(`Reference: ${reference}`);
  out.push(`Service: ${svc.name}`);
  out.push("");
  out.push("My choices:");
  for (const l of q.lines) {
    if (l.part === "info") continue;
    let tag = l.tag;
    if (l.part === "multiplier" && tag?.startsWith("×")) {
      // Plain words: "×1.35" → "+35%"; adjustments with no extra cost are left out.
      const pct = Math.round((Number(tag.slice(1)) - 1) * 100);
      if (!pct) continue;
      tag = `+${pct}%`;
    }
    const price = tag ? tag : l.amount !== undefined ? naira(l.amount) + (l.part === "monthly" ? " / month" : "") : "";
    out.push(`• ${l.label}${l.detail ? `: ${l.detail}` : ""}${price ? ` (${price})` : ""}`);
  }
  out.push("");
  if (q.custom) {
    out.push("Estimated price: Custom project, please send me a quote.");
  } else {
    out.push(`Estimated price: ${headlinePrice(q)}`);
  }
  if (q.main === "oneTime" && q.monthly) out.push(`Monthly: ${naira(q.monthly)} / month`);
  if (q.main === "monthly" && q.oneTime) out.push(`One-time setup: ${naira(q.oneTime)}`);
  out.push(`Estimated delivery: ${q.deliveryText}`);
  for (const n of q.notes) out.push(`(${n})`);
  out.push("");
  out.push(`Name: ${contact.name}`);
  if (contact.business) out.push(`Business: ${contact.business}`);
  if (contact.notes) out.push(`Notes: ${contact.notes}`);
  return out.join("\n");
}
