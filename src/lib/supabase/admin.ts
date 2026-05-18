import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role client — bypasses RLS. SERVER ONLY. Use exclusively for
 * trusted server tasks (Stripe webhooks, seeding). Never import client-side.
 */
export function createAdminClient() {
  // New key system: "secret" key (sb_secret_…). Legacy service_role JWT
  // still works — accept either env name.
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key)
    throw new Error("Secret key not configured (SUPABASE_SECRET_KEY).");
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
