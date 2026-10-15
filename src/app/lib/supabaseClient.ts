import { createClient } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Supabase Client
   Centralized client for cloud persistence layer.
   
   Tables targeted:
   • profiles     — vendor identity & business info
   • bank_data    — payout routing configuration
   • onboarding   — wizard completion state
   ═══════════════════════════════════════════════════ */

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Bombin AI Warning: Supabase environment variables are missing from .env.local");
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseUrl = rawUrl.replace(/['"]/g, '').trim().replace(/\/$/, "");

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseAnonKey = rawKey.replace(/['"]/g, '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
