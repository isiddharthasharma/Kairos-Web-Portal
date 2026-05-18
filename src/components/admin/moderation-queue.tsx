"use client";

import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import { ShieldCheck } from "lucide-react";
import { decideModeration } from "@/lib/data/mod-actions";
import { relativeTime } from "@/lib/utils";
import type { ModerationItem } from "@/lib/types";

export function ModerationQueue({ items }: { items: ModerationItem[] }) {
  const [resolved, setResolved] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState<string | null>(null);

  async function decide(id: string, decision: "approved" | "rejected") {
    setBusy(id);
    const res = await decideModeration(id, decision);
    setBusy(null);
    if (res.ok) setResolved((r) => ({ ...r, [id]: decision }));
  }

  const pending = items.filter((i) => !resolved[i.id]);
  if (pending.length === 0)
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Queue clear"
        description="No items awaiting review. Nicely done."
      />
    );

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const decision = resolved[item.id];
        return (
          <Card
            key={item.id}
            className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
              decision ? "opacity-60" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge
                  variant={
                    item.risk === "high"
                      ? "destructive"
                      : item.risk === "medium"
                        ? "warning"
                        : "muted"
                  }
                >
                  {item.risk} risk
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {item.type.replace("_", " ")}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.submitted_by}
                {item.city ? ` · ${item.city}` : ""} · {relativeTime(item.created_at)}
              </p>
            </div>
            {decision ? (
              <Badge variant={decision === "approved" ? "success" : "destructive"}>
                {decision}
              </Badge>
            ) : (
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === item.id}
                  onClick={() => decide(item.id, "rejected")}
                >
                  {busy === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                  Reject
                </Button>
                <Button
                  size="sm"
                  disabled={busy === item.id}
                  onClick={() => decide(item.id, "approved")}
                >
                  <Check className="size-4" /> Approve
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
