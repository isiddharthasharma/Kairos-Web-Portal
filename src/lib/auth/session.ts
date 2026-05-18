import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { AppUser, UserRole } from "@/lib/types";

/**
 * Demo identity used when Supabase is not yet configured, so role-gated
 * surfaces (admin, moderator, premium) are explorable. Swap by changing
 * NEXT_PUBLIC_DEMO_ROLE in .env.local. Real auth always wins when wired.
 */
function demoUser(): AppUser {
  const role = (process.env.NEXT_PUBLIC_DEMO_ROLE as UserRole) || "admin";
  return {
    id: "demo-user",
    email: "demo@kairos.app",
    full_name: "Demo Operator",
    role,
    university: "University of Manchester",
    university_verified: true,
    created_at: new Date().toISOString(),
  };
}

/** Current authenticated user with role resolved from the profiles table. */
export async function getCurrentUser(): Promise<AppUser | null> {
  if (!hasSupabaseEnv()) return demoUser();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Resolve the profile (incl. role) with the trusted service-role client.
  // RLS-scoped reads from Server Components can return empty depending on
  // cookie/token propagation; role gating must not silently fall back to
  // 'user'. Service role is server-only and safe here.
  type ProfileRow = {
    full_name: string | null;
    role: UserRole | null;
    university: string | null;
    university_verified: boolean | null;
    created_at: string | null;
  };
  const COLS = "full_name, role, university, university_verified, created_at";
  let profile: ProfileRow | null = null;
  try {
    const admin = createAdminClient();
    const res = await admin
      .from("profiles")
      .select(COLS)
      .eq("id", user.id)
      .maybeSingle();
    profile = (res.data as ProfileRow | null) ?? null;
  } catch {
    // Service role not configured → fall back to RLS-scoped read.
    const res = await supabase
      .from("profiles")
      .select(COLS)
      .eq("id", user.id)
      .maybeSingle();
    profile = (res.data as ProfileRow | null) ?? null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: profile?.full_name ?? user.email?.split("@")[0] ?? "Member",
    role: (profile?.role as UserRole) ?? "user",
    university: profile?.university ?? undefined,
    university_verified: profile?.university_verified ?? false,
    created_at: profile?.created_at ?? user.created_at,
  };
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
