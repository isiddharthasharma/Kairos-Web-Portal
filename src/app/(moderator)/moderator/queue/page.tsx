import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { requireRole } from "@/lib/auth/guard";
import { getModerationQueue } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Review Queue" };

export default async function ModeratorQueue() {
  await requireRole("moderator", "/moderator/queue");
  const items = await getModerationQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Review"
        title="Review queue"
        description="Approve or reject reports, submissions and reviews. Decisions are audit-logged with your identity."
      />
      <ModerationQueue items={items} />
    </div>
  );
}
