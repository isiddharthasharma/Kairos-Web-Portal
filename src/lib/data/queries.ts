import "server-only";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Company, SponsorshipLikelihood } from "@/lib/types";
import {
  APPLICATION_TRACKER,
  AUDIT_LOG,
  CITIES,
  COMPANIES,
  DEMO_USERS,
  MODERATION_QUEUE,
  RELOCATION_TASKS,
  SCAM_REPORTS,
} from "./seed";

export interface CompanyFilter {
  q?: string;
  city?: string;
  industry?: string;
  size?: string;
  graduateFriendly?: boolean;
  likelihood?: SponsorshipLikelihood;
  sort?: "activity" | "graduate" | "name";
}

/**
 * Companies. Reads from Supabase when configured; otherwise serves the
 * curated intelligence dataset so the product is fully usable pre-infra.
 * Filtering/sorting runs in-app to keep behaviour identical across sources.
 */
export async function getCompanies(filter: CompanyFilter = {}): Promise<Company[]> {
  let rows: Company[] = COMPANIES;

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .is("deleted_at", null);
      if (!error && data && data.length) rows = data as unknown as Company[];
    } catch {
      // fall back to seed
    }
  }

  return applyCompanyFilter(rows, filter);
}

export function applyCompanyFilter(rows: Company[], filter: CompanyFilter): Company[] {
  let out = [...rows];
  const q = filter.q?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.roles.some((r) => r.toLowerCase().includes(q))
    );
  }
  if (filter.city && filter.city !== "all")
    out = out.filter((c) => c.city === filter.city);
  if (filter.industry && filter.industry !== "all")
    out = out.filter((c) => c.industry === filter.industry);
  if (filter.size && filter.size !== "all")
    out = out.filter((c) => c.size === filter.size);
  if (filter.graduateFriendly)
    out = out.filter((c) => c.graduate_friendliness >= 65);
  if (filter.likelihood && filter.likelihood !== "unknown")
    out = out.filter((c) => c.sponsorship_likelihood === filter.likelihood);

  switch (filter.sort) {
    case "graduate":
      out.sort((a, b) => b.graduate_friendliness - a.graduate_friendliness);
      break;
    case "name":
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      out.sort((a, b) => b.sponsorship_activity_score - a.sponsorship_activity_score);
  }
  return out;
}

export async function getCompany(slug: string): Promise<Company | undefined> {
  const all = await getCompanies();
  return all.find((c) => c.slug === slug);
}

export function getCompanyFacets() {
  return {
    cities: [...new Set(COMPANIES.map((c) => c.city))].sort(),
    industries: [...new Set(COMPANIES.map((c) => c.industry))].sort(),
    sizes: ["Startup", "SME", "Large", "Enterprise"],
  };
}

export const getCities = async () => CITIES;
export const getCity = async (slug: string) =>
  CITIES.find((c) => c.slug === slug);
export const getRelocationTasks = async () => RELOCATION_TASKS;
export const getScamReports = async () => SCAM_REPORTS;
export const getModerationQueue = async () => MODERATION_QUEUE;
export const getAuditLog = async () => AUDIT_LOG;
export const getApplicationTracker = async () => APPLICATION_TRACKER;
export const getUsers = async () => DEMO_USERS;

export async function getPlatformStats() {
  return {
    totalUsers: 4218,
    activeSubscriptions: 612,
    flaggedContent: MODERATION_QUEUE.filter((m) => m.risk === "high").length,
    reportedUsers: 7,
    sponsorRecords: COMPANIES.length,
    moderationQueue: MODERATION_QUEUE.filter((m) => m.status === "pending").length,
    mrrGrowth: 18.4,
    weeklyActive: 2840,
  };
}
