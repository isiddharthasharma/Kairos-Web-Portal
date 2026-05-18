import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/guard";
import { getCompanies } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Admin · Companies" };

export default async function AdminCompanies() {
  await requireRole("admin", "/admin/companies");
  const companies = await getCompanies({ sort: "name" });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sponsorship records"
        title="Companies"
        description="Manage sponsor records, licence status and intelligence signals."
        actions={
          <Button size="sm" disabled>
            <PlusCircle className="size-4" /> Add company
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Industry</th>
                  <th className="p-4 font-medium">Licence</th>
                  <th className="p-4 font-medium">Likelihood</th>
                  <th className="p-4 font-medium">Activity</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-muted-foreground">{c.industry}</td>
                    <td className="p-4">
                      <Badge
                        variant={c.licence_status === "active" ? "success" : "warning"}
                      >
                        {c.licence_status}
                      </Badge>
                    </td>
                    <td className="p-4 capitalize text-muted-foreground">
                      {c.sponsorship_likelihood}
                    </td>
                    <td className="p-4 tabular-nums">{c.sponsorship_activity_score}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/sponsors/${c.slug}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
