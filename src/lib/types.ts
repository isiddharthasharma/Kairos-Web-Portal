// Kairos domain model — mirrors the Supabase schema in /supabase/migrations.

export type UserRole =
  | "user"
  | "premium_user"
  | "moderator"
  | "admin"
  | "super_admin";

export const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  premium_user: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
};

export type SponsorLicenceStatus =
  | "active"
  | "pending"
  | "revoked"
  | "expired";

export type SponsorshipLikelihood = "high" | "medium" | "low" | "unknown";

export type CompanyTag =
  | "Graduate Friendly"
  | "International Hiring Active"
  | "Low Sponsorship Activity"
  | "Experienced Hires Preferred"
  | "Historically Active Sponsor"
  | "Graduate Scheme";

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  industry: string;
  city: string;
  headquarters: string;
  size: "Startup" | "SME" | "Large" | "Enterprise";
  website?: string;
  licence_status: SponsorLicenceStatus;
  route: string; // e.g. "Skilled Worker"
  graduate_scheme: boolean;
  graduate_friendliness: number; // 0-100
  sponsorship_likelihood: SponsorshipLikelihood;
  sponsorship_activity_score: number; // 0-100, derived
  roles: string[];
  tags: CompanyTag[];
  reported_outcomes: { sponsored: number; total: number };
  ai_insight?: string;
  updated_at: string;
}

export type ApplicationStage =
  | "researching"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "accepted";

export interface ApplicationTrackerItem {
  id: string;
  company_id: string;
  company_name: string;
  role: string;
  stage: ApplicationStage;
  sponsorship_confirmed: boolean | null;
  notes?: string;
  updated_at: string;
}

export type RelocationPhase =
  | "90_days"
  | "30_days"
  | "7_days"
  | "first_week"
  | "first_month";

export interface RelocationTask {
  id: string;
  phase: RelocationPhase;
  title: string;
  description: string;
  category: "visa" | "money" | "logistics" | "admin" | "settling";
  critical: boolean;
}

export interface CityIntel {
  slug: string;
  name: string;
  monthly_rent_room: number; // pcm, average student room
  monthly_rent_studio: number;
  groceries: number;
  transport: number;
  utilities: number;
  social: number;
  indian_grocery_access: "excellent" | "good" | "limited";
  affordability_score: number; // 0-100, higher = more affordable
  avg_grad_salary: number;
  sponsor_density: "high" | "medium" | "low";
}

export type TrustLevel =
  | "highly_trusted"
  | "verified"
  | "verification_pending"
  | "community_reported_risk";

export type ReportStatus = "pending" | "approved" | "rejected" | "resolved";

export interface ScamReport {
  id: string;
  subject: string; // landlord / agency / listing name
  category: "accommodation" | "agency" | "deposit" | "job_offer" | "other";
  city: string;
  trust_level: TrustLevel;
  summary: string;
  status: ReportStatus;
  reports_count: number;
  created_at: string;
}

export interface ModerationItem {
  id: string;
  type: "scam_report" | "company_submission" | "review" | "verification_request";
  title: string;
  submitted_by: string;
  city?: string;
  status: ReportStatus;
  risk: "low" | "medium" | "high";
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actor_role: UserRole;
  action: string;
  target: string;
  ip: string;
  created_at: string;
}

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  university?: string;
  university_verified: boolean;
  created_at: string;
}
