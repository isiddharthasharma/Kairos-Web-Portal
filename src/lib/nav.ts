import type { UserRole } from "@/lib/types";

/**
 * Icon is a string key (not a component) so nav arrays stay serializable
 * across the Server → Client boundary. The key is resolved to a Lucide
 * component inside the client shell (see components/shell/icons.ts).
 */
export type IconKey =
  | "dashboard"
  | "building"
  | "route"
  | "pound"
  | "shield"
  | "users"
  | "gauge"
  | "scroll"
  | "flag"
  | "settings";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: IconKey;
  minRole?: UserRole;
}

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", short: "Overview", icon: "gauge", minRole: "admin" },
  { href: "/admin/users", label: "Users & Roles", short: "Users", icon: "users", minRole: "admin" },
  { href: "/admin/companies", label: "Companies", short: "Companies", icon: "building", minRole: "admin" },
  { href: "/admin/moderation", label: "Moderation Queue", short: "Queue", icon: "flag", minRole: "moderator" },
  { href: "/admin/audit", label: "Audit Logs", short: "Audit", icon: "scroll", minRole: "admin" },
];

export const MOD_NAV: NavItem[] = [
  { href: "/moderator", label: "Moderation Desk", short: "Desk", icon: "gauge", minRole: "moderator" },
  { href: "/moderator/queue", label: "Review Queue", short: "Queue", icon: "flag", minRole: "moderator" },
  { href: "/moderator/trust", label: "Trust Indicators", short: "Trust", icon: "shield", minRole: "moderator" },
];
