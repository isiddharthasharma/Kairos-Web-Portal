import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustBadge } from "@/components/trust/trust-badge";
import { requireRole } from "@/lib/auth/guard";
import { getScamReports } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Trust Indicators" };

export default async function ModeratorTrust() {
  await requireRole("moderator", "/moderator/trust");
  const reports = await getScamReports();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trust & Safety"
        title="Trust indicators"
        description="Set and review trust levels for providers and reported listings. Wording stays neutral and non-defamatory."
      />

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{r.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.category} · {r.city ?? "—"} · {r.reports_count} reports
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {r.status}
                  </Badge>
                  <TrustBadge level={r.trust_level} />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
