import { ShieldCheck, ShieldAlert, ShieldQuestion, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrustLevel } from "@/lib/types";

const MAP = {
  highly_trusted: { variant: "success", label: "Highly Trusted", icon: ShieldCheck },
  verified: { variant: "default", label: "Verified", icon: BadgeCheck },
  verification_pending: {
    variant: "warning",
    label: "Verification Pending",
    icon: ShieldQuestion,
  },
  community_reported_risk: {
    variant: "destructive",
    label: "Community Reported Risk",
    icon: ShieldAlert,
  },
} as const;

export function TrustBadge({ level }: { level: TrustLevel }) {
  const m = MAP[level];
  const Icon = m.icon;
  return (
    <Badge variant={m.variant}>
      <Icon className="size-3" />
      {m.label}
    </Badge>
  );
}
