import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Flag,
  ShieldAlert,
  TrendingUp,
  Activity,
} from "lucide-react";
import { PageHeader, Stat } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import {
  getPlatformStats,
  getModerationQueue,
  getAuditLog,
} from "@/lib/data/queries";
import { formatNumber, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Overview" };

export default async function AdminOverview() {
  const user = await requireRole("moderator", "/admin");
  const [stats, queue, audit] = await Promise.all([
    getPlatformStats(),
    getModerationQueue(),
    getAuditLog(),
  ]);
  const canAnalytics = can(user.role, "analytics.view");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control Centre"
        title="Platform overview"
        description="Operational health, growth and moderation at a glance."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total users" value={formatNumber(stats.totalUsers)} icon={Users} />
        <Stat
          label="Active subscriptions"
          value={formatNumber(stats.activeSubscriptions)}
          icon={CreditCard}
          tone="success"
        />
        <Stat
          label="Moderation queue"
          value={stats.moderationQueue}
          icon={Flag}
          tone="warning"
        />
        <Stat
          label="Flagged content"
          value={stats.flaggedContent}
          icon={ShieldAlert}
          tone="warning"
        />
      </div>

      {canAnalytics && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="MRR growth"
            value={`+${stats.mrrGrowth}%`}
            icon={TrendingUp}
            tone="success"
          />
          <Stat
            label="Weekly active"
            value={formatNumber(stats.weeklyActive)}
            icon={Activity}
          />
          <Stat label="Reported users" value={stats.reportedUsers} />
          <Stat label="Sponsor records" value={stats.sponsorRecords} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Moderation queue</CardTitle>
            <Link
              href="/admin/moderation"
              className="text-xs font-medium text-primary hover:underline"
            >
              Open queue
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <span className="truncate">{q.title}</span>
                <Badge
                  variant={
                    q.risk === "high"
                      ? "destructive"
                      : q.risk === "medium"
                        ? "warning"
                        : "muted"
                  }
                >
                  {q.risk}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent audit activity</CardTitle>
            {can(user.role, "audit.view") && (
              <Link
                href="/admin/audit"
                className="text-xs font-medium text-primary hover:underline"
              >
                Full log
              </Link>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {audit.slice(0, 5).map((a) => (
              <div key={a.id} className="text-sm">
                <p className="font-medium">
                  {a.action}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {a.target}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.actor} ({a.actor_role}) · {relativeTime(a.created_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
