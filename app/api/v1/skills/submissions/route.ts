import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import { requireUser } from "@/lib/auth-helpers";

const createSubmissionSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  category: z.string().min(1, "Category is required").max(40),
  categoryLabel: z.string().min(1, "Category label is required").max(80),
  summary: z.string().min(1, "Summary is required").max(500),
  tags: z.array(z.string().min(1)).max(20),
  prompt: z.string().min(1, "Prompt is required"),
  sampleCommand: z.string().max(200).optional().nullable(),
  documentationUrl: z.string().url().optional().nullable(),
  bounty: z.number().int().min(0).max(10000).optional(),
});

export async function GET() {
  await requireSuperAdmin();

  const submissions = await prisma.skillSubmission.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      category: true,
      categoryLabel: true,
      summary: true,
      tags: true,
      prompt: true,
      sampleCommand: true,
      documentationUrl: true,
      bounty: true,
      status: true,
      submittedById: true,
      reviewedById: true,
      reviewedAt: true,
      rejectionReason: true,
      createdAt: true,
      updatedAt: true,
      submittedBy: { select: { id: true, name: true, email: true, image: true } },
      reviewedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const submission = await prisma.skillSubmission.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      categoryLabel: parsed.data.categoryLabel,
      summary: parsed.data.summary,
      tags: parsed.data.tags,
      prompt: parsed.data.prompt,
      sampleCommand: parsed.data.sampleCommand ?? null,
      documentationUrl: parsed.data.documentationUrl ?? null,
      bounty: parsed.data.bounty ?? 0,
      status: "pending",
      submittedById: user.id,
    },
    select: {
      id: true, title: true, category: true, categoryLabel: true, summary: true,
      tags: true, prompt: true, sampleCommand: true, documentationUrl: true,
      bounty: true, status: true, submittedById: true, createdAt: true,
    },
  });

  return NextResponse.json({ submission }, { status: 201 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
