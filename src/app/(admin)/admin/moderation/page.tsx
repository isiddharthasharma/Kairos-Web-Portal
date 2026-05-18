import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { requireRole } from "@/lib/auth/guard";
import { getModerationQueue } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Admin · Moderation Queue" };

export default async function AdminModeration() {
  await requireRole("moderator", "/admin/moderation");
  const items = await getModerationQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content moderation"
        title="Moderation queue"
        description="Approve or reject submissions, reports and verification requests. Every decision is audit-logged."
      />
      <ModerationQueue items={items} />
    </div>
  );
}
