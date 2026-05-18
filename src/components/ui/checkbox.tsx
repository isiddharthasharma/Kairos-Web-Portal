"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  {
    checked?: boolean;
    onCheckedChange?: (v: boolean) => void;
    className?: string;
    id?: string;
    "aria-label"?: string;
  }
>(({ checked = false, onCheckedChange, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      checked ? "border-primary bg-primary text-primary-foreground" : "bg-background",
      className
    )}
    {...props}
  >
    {checked && <Check className="size-3" strokeWidth={3} />}
  </button>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
