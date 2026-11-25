import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./supabaseClient";

/*
 * Server-only Supabase client with full rights (Step 4A).
 *
 * - Uses SUPABASE_SERVICE_ROLE_KEY, which lives only in .env.local and Vercel
 *   (marked Sensitive). It has NO "NEXT_PUBLIC_" prefix, so Next.js never sends it
 *   to the browser, and the `import "server-only"` line above makes the build fail
 *   if any browser file ever tries to import this helper.
 * - The key is never logged or returned.
 * - Returns null when the key isn't set yet; callers must handle that.
 */

let admin: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin;
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").replace(/['"]/g, "").trim();
  admin = supabaseUrl && key
    ? createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
    : null;
  return admin;
}
