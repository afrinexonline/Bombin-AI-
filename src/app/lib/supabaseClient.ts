import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Supabase Client
   Centralized client for cloud persistence layer.
   
   Tables targeted:
   • profiles     — vendor identity & business info
   • bank_data    — payout routing configuration
   • onboarding   — wizard completion state
   ═══════════════════════════════════════════════════ */

// NEXT_PUBLIC_* values must be read with these exact names so Next.js can
// bake them into the browser bundle at build time.
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  .replace(/['"]/g, "")
  .trim()
  .replace(/\/$/, "");
export const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")
  .replace(/['"]/g, "")
  .trim();

const missing = [
  !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
  !supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
].filter(Boolean);

const missingMessage =
  `Bombin AI: Supabase is not configured. Missing setting(s): ${missing.join(", ")}. ` +
  "Add them to .env.local (local) and to the Vercel project settings (live).";

function buildClient(): SupabaseClient {
  if (missing.length === 0) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(missingMessage);
  }
  // Development: say clearly what is wrong, and fail with the same message
  // the moment anything actually tries to use Supabase.
  console.error(missingMessage);
  return new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(missingMessage);
    },
  });
}

export const supabase = buildClient();

/* ── Type Definitions ──────────────────────────────── */

export interface UnifiedProfile {
  id?: string;
  // Step 1
  first_name?: string;
  last_name?: string;
  business_name?: string;
  business_email?: string;
  phone_number?: string;
  industry_type?: string;
  industry_explanation?: string;
  website_url?: string;
  location?: string;
  
  // Step 2
  tone_preference?: string;
  intent_survey?: string[];
  
  // Step 3
  bank_name?: string;
  account_number?: string;
  payment_methods?: string[];
  
  // Meta
  current_step?: number;
  completed?: boolean;
  completed_at?: string;
}
