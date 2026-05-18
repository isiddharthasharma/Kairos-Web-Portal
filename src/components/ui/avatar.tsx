import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Avatar };
