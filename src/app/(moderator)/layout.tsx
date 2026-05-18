import { AppShell } from "@/components/shell/app-shell";
import { MOD_NAV } from "@/lib/nav";
import { requireRole } from "@/lib/auth/guard";

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("moderator", "/moderator");
  return (
    <AppShell user={user} nav={MOD_NAV} variant="control">
      {children}
    </AppShell>
  );
}
