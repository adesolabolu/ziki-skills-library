import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

const reviewSubmissionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().max(1000).optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireSuperAdmin();

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reviewSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const submission = await prisma.skillSubmission.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const actor = await requireSuperAdmin();

  const updated = await prisma.skillSubmission.update({
    where: { id },
    data: {
      status: parsed.data.status,
      reviewedById: actor.id,
      reviewedAt: new Date(),
      rejectionReason:
        parsed.data.status === "rejected" ? parsed.data.rejectionReason ?? null : null,
    },
    select: {
      id: true, status: true, reviewedById: true, reviewedAt: true, rejectionReason: true,
    },
  });

  return NextResponse.json({ submission: updated });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
