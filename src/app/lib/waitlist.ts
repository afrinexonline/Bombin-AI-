/*
 * Waitlist helpers shared by the pop-up (browser) and /api/waitlist (server). Step 4B.
 * No secrets here: this file runs in both places.
 */
import { checkContact, type ContactErrors } from "./orders";

export type WaitlistChoice = "instagram" | "tiktok" | "both";
export type WaitlistChannel = "instagram" | "tiktok";

export const WAITLIST_CHOICES: { id: WaitlistChoice; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "both", label: "Both" },
];

export interface WaitlistInput {
  name: string;
  whatsapp: string;
  email: string;
  choice: WaitlistChoice;
}

export type WaitlistErrors = Pick<ContactErrors, "name" | "whatsapp" | "email"> & { choice?: string };

/** The rows a choice becomes ("both" = one row per channel). */
export function channelsFor(choice: WaitlistChoice): WaitlistChannel[] {
  return choice === "both" ? ["instagram", "tiktok"] : [choice];
}

/** Same checks as the order form: name, WhatsApp number (Nigerian or international), optional email. */
export function checkWaitlist(input: Partial<WaitlistInput>):
  | { ok: true; value: WaitlistInput }
  | { ok: false; errors: WaitlistErrors } {
  const contact = checkContact({ name: input.name, whatsapp: input.whatsapp, email: input.email, business: "", notes: "" });
  const choice = input.choice;
  const choiceOk = choice === "instagram" || choice === "tiktok" || choice === "both";
  if (!contact.ok || !choiceOk) {
    const errors: WaitlistErrors = contact.ok ? {} : { name: contact.errors.name, whatsapp: contact.errors.whatsapp, email: contact.errors.email };
    if (!choiceOk) errors.choice = "Please choose Instagram, TikTok or both.";
    return { ok: false, errors };
  }
  return { ok: true, value: { name: contact.value.name, whatsapp: contact.value.whatsapp, email: contact.value.email, choice: choice! } };
}
