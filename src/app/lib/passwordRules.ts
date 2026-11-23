/*
 * Password rules (Step 3C). These match the Supabase project settings exactly:
 * at least 8 characters, with an uppercase letter, a lowercase letter and a number.
 * Used by the sign-up form, the reset-password page and the sign-up server route.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_RULES = [
  { id: "length", label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
  { id: "upper", label: "An uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "A lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "A number (0–9)", test: (p: string) => /[0-9]/.test(p) },
] as const;

export function passwordMeetsRules(p: string): boolean {
  return p.length <= PASSWORD_MAX_LENGTH && PASSWORD_RULES.every((r) => r.test(p));
}

export const PASSWORD_RULES_MESSAGE =
  `Your password needs at least ${PASSWORD_MIN_LENGTH} characters, with an uppercase letter, a lowercase letter and a number.`;
