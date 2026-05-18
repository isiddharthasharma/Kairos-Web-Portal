"use client";

import * as React from "react";

/**
 * PostHog product analytics. No-ops cleanly when NEXT_PUBLIC_POSTHOG_KEY is
 * absent so local/demo runs never break and no events leak.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    let cancelled = false;
    import("posthog-js")
      .then(({ default: posthog }) => {
        if (cancelled) return;
        posthog.init(key, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
          capture_pageview: true,
          person_profiles: "identified_only",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
