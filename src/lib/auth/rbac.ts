import { ROLE_RANK, type UserRole } from "@/lib/types";

/** True when `role` is at least as privileged as `min`. */
export function hasRole(role: UserRole | undefined | null, min: UserRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export function isStaff(role: UserRole | undefined | null): boolean {
  return hasRole(role, "moderator");
}

export function isAdmin(role: UserRole | undefined | null): boolean {
  return hasRole(role, "admin");
}

export function isPremium(role: UserRole | undefined | null): boolean {
  return hasRole(role, "premium_user");
}

/**
 * Capability matrix. Moderators are deliberately walled off from billing,
 * infrastructure and database administration (see brief §7).
 */
export const CAPABILITIES = {
  "moderation.review": ["moderator", "admin", "super_admin"],
  "moderation.suspend_user": ["moderator", "admin", "super_admin"],
  "trust.manage_indicators": ["moderator", "admin", "super_admin"],
  "content.approve": ["moderator", "admin", "super_admin"],
  "users.manage": ["admin", "super_admin"],
  "companies.manage": ["admin", "super_admin"],
  "analytics.view": ["admin", "super_admin"],
  "billing.manage": ["admin", "super_admin"],
  "moderators.manage": ["admin", "super_admin"],
  "audit.view": ["admin", "super_admin"],
  "infrastructure.manage": ["super_admin"],
  "rbac.assign_admin": ["super_admin"],
} as const;

export type Capability = keyof typeof CAPABILITIES;

export function can(role: UserRole | undefined | null, capability: Capability): boolean {
  if (!role) return false;
  return (CAPABILITIES[capability] as readonly UserRole[]).includes(role);
}

export const ROLE_LABEL: Record<UserRole, string> = {
  user: "Member",
  premium_user: "Premium",
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super Admin",
};
