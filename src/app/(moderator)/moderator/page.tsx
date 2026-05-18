import type { Metadata } from "next";
import Link from "next/link";
import { Flag, ShieldCheck, Ban, Lock } from "lucide-react";
import { PageHeader, Stat } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guard";
import { getModerationQueue } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Moderation Desk" };

const RESTRICTED = [
  "Billing & payments",
  "Infrastructure",
  "Database administration",
  "Role assignment",
];

export default async function ModeratorDesk() {
  await requireRole("moderator", "/moderator");
  const queue = await getModerationQueue();
  const high = queue.filter((q) => q.risk === "high").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Moderator Control System"
        title="Moderation desk"
        description="Scoped tools for trust & safety. Billing, infrastructure and database admin are intentionally out of scope."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pending items" value={queue.length} icon={Flag} tone="warning" />
        <Stat label="High risk" value={high} icon={ShieldCheck} tone="warning" />
        <Stat label="Resolved today" value={6} icon={ShieldCheck} tone="success" />
        <Stat label="Users actioned" value={2} icon={Ban} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link
              href="/moderator/queue"
              className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50"
            >
              Review queue <span className="text-muted-foreground">→</span>
            </Link>
            <Link
              href="/moderator/trust"
              className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50"
            >
              Trust indicators <span className="text-muted-foreground">→</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="size-4 text-muted-foreground" /> Out of scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {RESTRICTED.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <Lock className="size-3.5" /> {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
