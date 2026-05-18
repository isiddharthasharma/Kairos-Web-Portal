import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-10 lg:flex">
        <div className="grid-noise pointer-events-none absolute inset-0 opacity-60" />
        <Link href="/" className="relative">
          <Logo />
        </Link>
        <div className="relative max-w-md space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            The right move, at the right moment
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-balance">
            Sponsorship and career intelligence for international students in
            the UK.
          </h2>
          <p className="text-sm text-muted-foreground">
            Search licensed sponsors, plan your relocation, model your cost of
            living and avoid scams — in one calm, operational workspace.
          </p>
        </div>
        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kairos. Data-informed, not legal advice.
        </p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
