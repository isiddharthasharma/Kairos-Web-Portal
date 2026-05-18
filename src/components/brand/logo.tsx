import { cn } from "@/lib/utils";

/**
 * Kairos mark — an opportune-moment glyph: a rising arc crossing a vertical
 * "now" line. Restrained, geometric, premium.
 */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 text-primary"
        fill="none"
        aria-hidden
      >
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8"
          className="fill-primary/10"
        />
        <path
          d="M9 22C13 22 17 16 23 10"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M16 7V25"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="23" cy="10" r="2.4" className="fill-primary" />
      </svg>
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight">Kairos</span>
      )}
    </span>
  );
}
