import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { requireRole } from "@/lib/auth/guard";
import { getUsers } from "@/lib/data/queries";
import { ROLE_LABEL } from "@/lib/auth/rbac";
import { initials, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Users & Roles" };

export default async function AdminUsers() {
  await requireRole("admin", "/admin/users");
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users & Roles"
        title="Manage members"
        description="Role-based access control. Only super_admin may assign admin or super_admin — enforced by a database trigger and RLS."
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Member</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">University</th>
                  <th className="p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>{initials(u.full_name)}</Avatar>
                        <div>
                          <p className="font-medium">{u.full_name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.role === "super_admin" || u.role === "admin"
                            ? "default"
                            : u.role === "moderator"
                              ? "warning"
                              : u.role === "premium_user"
                                ? "success"
                                : "secondary"
                        }
                      >
                        {ROLE_LABEL[u.role]}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {u.university ?? "—"}
                      {u.university_verified && (
                        <span className="ml-1 text-success">✓</span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {relativeTime(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        Role changes are audit-logged. Privilege escalation is blocked at the
        database layer (guard_role_change trigger + RLS policies).
      </p>
    </div>
  );
}
