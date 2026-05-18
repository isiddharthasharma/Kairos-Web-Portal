import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { hasRole } from "./rbac";
import type { UserRole } from "@/lib/types";

/** Require an authenticated user; redirect to /login otherwise. */
export async function requireAuth(nextPath = "/dashboard") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Require at least `min` role; redirect to /403 if short. */
export async function requireRole(min: UserRole, nextPath = "/dashboard") {
  const user = await requireAuth(nextPath);
  if (!hasRole(user.role, min)) redirect("/403");
  return user;
}
