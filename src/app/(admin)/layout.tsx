import { AppShell } from "@/components/shell/app-shell";
import { ADMIN_NAV } from "@/lib/nav";
import { requireRole } from "@/lib/auth/guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimum staff gate; per-page guards tighten to admin where needed.
  const user = await requireRole("moderator", "/admin");
  return (
    <AppShell user={user} nav={ADMIN_NAV} variant="control">
      {children}
    </AppShell>
  );
}
