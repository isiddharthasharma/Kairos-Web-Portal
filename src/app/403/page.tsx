import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
        <ShieldX className="size-7" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Kairos is a staff-only monitoring console. This account is not an
        administrator or moderator. Access attempts are logged.
      </p>
      <form action={signOutAction} className="mt-6">
        <Button type="submit">Sign out &amp; switch account</Button>
      </form>
    </div>
  );
}
