"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, ShieldHalf } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/lib/auth/actions";
import { ROLE_LABEL } from "@/lib/auth/rbac";
import { initials, cn } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

export function UserMenu({ user }: { user: AppUser }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const staff = user.role === "moderator" || user.role === "admin" || user.role === "super_admin";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-1 transition-colors hover:bg-secondary/60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar>{initials(user.full_name)}</Avatar>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-card animate-fade-in"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-medium">{user.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              {ROLE_LABEL[user.role]}
            </Badge>
          </div>
          <div className="my-1 h-px bg-border" />
          {staff && (
            <MenuLink href="/admin" icon={ShieldHalf}>
              Control Centre
            </MenuLink>
          )}
          <div className="my-1 h-px bg-border" />
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              role="menuitem"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary/60"
      )}
    >
      <Icon className="size-4 text-muted-foreground" />
      {children}
    </Link>
  );
}
