"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export type ReviewSkillSubmissionResult =
  | { ok: true }
  | { ok: false; error: string };

/** Super admin approves or rejects a pending skill submission. */
export async function reviewSkillSubmissionAction(
  submissionId: string,
  status: "approved" | "rejected",
  rejectionReason?: string | null,
): Promise<ReviewSkillSubmissionResult> {
  const actor = await requireSuperAdmin();

  const submission = await prisma.skillSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, status: true },
  });

  if (!submission) {
    return { ok: false, error: "Submission not found" };
  }
  if (submission.status !== "pending") {
    return { ok: false, error: "Submission has already been reviewed" };
  }

  await prisma.skillSubmission.update({
    where: { id: submissionId },
    data: {
      status,
      reviewedById: actor.id,
      reviewedAt: new Date(),
      rejectionReason:
        status === "rejected" ? (rejectionReason ?? null) : null,
    },
  });

  revalidatePath("/superadmin/users");
  return { ok: true };
}

/** Form-action entry point for the approve/reject buttons on the approvals table. */
export async function reviewSubmissionFormAction(formData: FormData): Promise<void> {
  const submissionId = formData.get("submissionId") as string | null;
  const status = formData.get("status") as "approved" | "rejected" | null;
  const rejectionReason = formData.get("rejectionReason") as string | null;

  if (!submissionId || !status) {
    throw new Error("Invalid submission review request.");
  }

  const result = await reviewSkillSubmissionAction(submissionId, status, rejectionReason);
  if (!result.ok) {
    throw new Error(result.error);
  }
}
