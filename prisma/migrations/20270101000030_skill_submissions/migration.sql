-- Skill submissions to the verified skills library (#skill-submissions).
-- Contributors submit skills (test runners, linters, security guardrails)
-- with a bounty; a super admin reviews and approves or rejects each one.
-- An approved submission can be equipped by agents from /skills.
--
-- Additive only: a new table and enum, no existing data is touched.

-- CreateEnum
CREATE TYPE "SkillSubmissionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "SkillSubmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryLabel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "tags" TEXT[],
    "prompt" TEXT NOT NULL,
    "sampleCommand" TEXT,
    "documentationUrl" TEXT,
    "bounty" INTEGER NOT NULL DEFAULT 0,
    "status" "SkillSubmissionStatus" NOT NULL DEFAULT 'pending',
    "submittedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillSubmission_status_idx" ON "SkillSubmission"("status");

-- CreateIndex
CREATE INDEX "SkillSubmission_submittedById_idx" ON "SkillSubmission"("submittedById");

-- CreateIndex
CREATE INDEX "SkillSubmission_createdAt_idx" ON "SkillSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "SkillSubmission" ADD CONSTRAINT "SkillSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillSubmission" ADD CONSTRAINT "SkillSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
