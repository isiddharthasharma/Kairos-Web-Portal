import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/guard";
import { getAuditLog } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Admin · Audit Logs" };

export default async function AdminAudit() {
  await requireRole("admin", "/admin/audit");
  const log = await getAuditLog();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Security"
        title="Audit logs"
        description="Append-only record of privileged actions. Writes are constrained to a security-definer function — admins can read, no one can edit."
      />

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {log.map((a) => (
              <li key={a.id} className="flex items-start gap-3 p-4">
                <span className="mt-0.5 rounded-lg bg-secondary p-2 text-muted-foreground">
                  <ScrollText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {a.action}{" "}
                    <span className="font-normal text-muted-foreground">
                      → {a.target}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.actor} · {new Date(a.created_at).toLocaleString("en-GB")} ·{" "}
                    {a.ip}
                  </p>
                </div>
                <Badge variant="outline">{a.actor_role}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
