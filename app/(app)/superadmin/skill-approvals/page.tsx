import { requireSuperAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SkillApprovalsManager, type SkillApprovalItem } from "@/components/superadmin-skill-approvals";

export const metadata = { title: "Skill Approvals" };

export default async function SkillApprovalsPage() {
  await requireSuperAdmin();

  let dbSubmissions: SkillApprovalItem[] = [];
  try {
    const raw = await prisma.skillSubmission.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        category: true,
        categoryLabel: true,
        summary: true,
        tags: true,
        status: true,
        rejectionReason: true,
        reviewedAt: true,
        createdAt: true,
        submittedBy: { select: { name: true, email: true, image: true } },
        reviewedBy: { select: { name: true } },
      },
    });

    dbSubmissions = raw.map((sub) => ({
      id: sub.id,
      title: sub.title,
      category: sub.category,
      categoryLabel: sub.categoryLabel,
      summary: sub.summary,
      tags: Array.isArray(sub.tags) ? (sub.tags as string[]) : [],
      status: sub.status as "pending" | "approved" | "rejected",
      authorName: sub.submittedBy?.name ?? "Contributor",
      authorEmail: sub.submittedBy?.email ?? "",
      authorImage: sub.submittedBy?.image,
      reviewedByName: sub.reviewedBy?.name ?? undefined,
      rejectionReason: sub.rejectionReason,
      submittedAt: new Date(sub.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      reviewedAt: sub.reviewedAt
        ? new Date(sub.reviewedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : undefined,
    }));
  } catch {
    // Graceful fallback for offline or demo seeds
  }

  return <SkillApprovalsManager initialSubmissions={dbSubmissions} />;
}
