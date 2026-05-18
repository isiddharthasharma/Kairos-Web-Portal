// Trim trailing slash — supabase-js builds paths and a trailing "/" yields
// double-slash request URLs.
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
  /\/+$/,
  ""
);

/**
 * Browser/anon key. Supabase's new key system calls this the
 * "publishable" key (sb_publishable_…). Legacy `anon` JWTs still work, so
 * we accept either env name.
 */
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

// Back-compat alias — existing imports keep working.
export const SUPABASE_ANON_KEY = SUPABASE_PUBLISHABLE_KEY;

/**
 * Whether Supabase is configured. When false the app runs against curated
 * seed data so the product is fully explorable before infra is wired.
 */
export function hasSupabaseEnv(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_PUBLISHABLE_KEY &&
      !SUPABASE_URL.includes("YOUR-PROJECT")
  );
}
