"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/avatar";

export interface SkillApprovalItem {
  id: string;
  title: string;
  slug?: string;
  categoryLabel?: string;
  summary?: string;
  tags?: string[];
  status: "pending" | "approved" | "rejected";
  authorName: string;
  authorEmail?: string;
  authorImage?: string | null;
  reviewedByName?: string;
  rejectionReason?: string | null;
}

const INITIAL_ACTIVE: SkillApprovalItem[] = [
  {
    id: "sub-seed-1",
    title: "Next.js App Router Performance Guardian",
    slug: "nextjs-guardian",
    status: "pending",
    authorName: "Sarah Jenkins",
  },
  {
    id: "sub-seed-2",
    title: "PostgreSQL Database Migration Auditor",
    slug: "database-migration",
    status: "pending",
    authorName: "Alex Rivera",
  },
  {
    id: "sub-seed-3",
    title: "WCAG 2.1 AA Accessibility Linter",
    slug: "a11y-linter",
    status: "pending",
    authorName: "Maya Lin",
  },
  {
    id: "sub-seed-4",
    title: "Flutter Declarative State Engine",
    slug: "flutter-state",
    status: "pending",
    authorName: "David Kim",
  },
];

const INITIAL_HISTORY: SkillApprovalItem[] = [
  {
    id: "sub-seed-5",
    title: "Zero-Bloat Git Hygiene Enforcer",
    slug: "git-hygiene",
    status: "approved",
    authorName: "Bolu",
    reviewedByName: "Super Admin",
  },
  {
    id: "sub-seed-6",
    title: "Playwright E2E Integration Suite",
    slug: "playwright-suite",
    status: "approved",
    authorName: "Goodness Mbakara",
    reviewedByName: "Super Admin",
  },
  {
    id: "sub-seed-7",
    title: "Automated Memory Leak Detector",
    slug: "memory-leak",
    status: "rejected",
    authorName: "Kenji Sato",
    reviewedByName: "Super Admin",
    rejectionReason: "Requires automated unit tests before approval",
  },
  {
    id: "sub-seed-8",
    title: "Vercel Fluid Compute Optimizer",
    slug: "vercel-optimizer",
    status: "approved",
    authorName: "Debby Angel",
    reviewedByName: "Super Admin",
  },
];

interface SkillApprovalsManagerProps {
  initialSubmissions?: SkillApprovalItem[];
}

export function SkillApprovalsManager({ initialSubmissions = [] }: SkillApprovalsManagerProps) {
  const [activeItems, setActiveItems] = useState<SkillApprovalItem[]>(() => {
    const dbPending = initialSubmissions.filter((s) => s.status === "pending");
    return dbPending.length > 0 ? [...dbPending, ...INITIAL_ACTIVE] : INITIAL_ACTIVE;
  });

  const [historyItems, setHistoryItems] = useState<SkillApprovalItem[]>(() => {
    const dbHistory = initialSubmissions.filter((s) => s.status !== "pending");
    return dbHistory.length > 0 ? [...dbHistory, ...INITIAL_HISTORY] : INITIAL_HISTORY;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedHistoryNote, setSelectedHistoryNote] = useState<SkillApprovalItem | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleApprove(item: SkillApprovalItem) {
    const updated: SkillApprovalItem = {
      ...item,
      status: "approved",
      reviewedByName: "Super Admin",
    };

    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
    setHistoryItems((prev) => [updated, ...prev]);
    showToast(`Approved "${item.title}". Published to Skills Library!`);
  }

  function handleReject(item: SkillApprovalItem) {
    const reason = prompt("Enter brief reason for requesting changes:", "Requires unit test suite before sign-off.");
    if (reason === null) return;

    const updated: SkillApprovalItem = {
      ...item,
      status: "rejected",
      reviewedByName: "Super Admin",
      rejectionReason: reason || "Changes requested.",
    };

    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
    setHistoryItems((prev) => [updated, ...prev]);
    showToast(`Marked "${item.title}" for revision.`);
  }

  return (
    <div className="w-full max-w-full space-y-8 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-zk-border bg-zk-surface px-5 py-3 text-sm font-semibold text-zk-text shadow-2xl transition-all"
        >
          <span className="size-2 rounded-full bg-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zk-border pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-zk-text sm:text-2xl">Skill Approvals</h1>
            {activeItems.length > 0 && (
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-500/20">
                {activeItems.length} waiting
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zk-text2">
            Review and quality sign-off incoming agent skills submitted by contributors.
          </p>
        </div>

        {/* Single Button */}
        <div>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-xl border border-zk-border bg-zk-surface px-4 py-2 text-xs font-semibold text-zk-text hover:bg-zk-tint transition shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
            View Skills Library
          </Link>
        </div>
      </div>

      {/* SECTION 1: ACTIVE ENTRIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zk-text flex items-center gap-2">
            Active Entries
            <span className="text-xs font-normal text-zk-muted">({activeItems.length})</span>
          </h2>
        </div>

        {activeItems.length === 0 ? (
          <div className="rounded-[18px] border border-zk-border bg-zk-surface/50 p-8 text-center">
            <p className="text-sm font-medium text-zk-text">Waiting for when a user submits skills, it comes here.</p>
            <p className="mt-1 text-xs text-zk-muted">No pending skill submissions in the review queue right now.</p>
          </div>
        ) : (
          <div className="rounded-[18px] border border-zk-border bg-zk-surface shadow-sm overflow-hidden w-full">
            <table className="table-fixed w-full text-left text-sm divide-y divide-zk-border">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[20%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-zk-tint text-xs font-semibold uppercase tracking-wide text-zk-muted">
                <tr>
                  <th className="px-4 py-3">Skill Name</th>
                  <th className="px-4 py-3">Submitted By</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zk-divider">
                {activeItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zk-tint/60 transition-colors">
                    {/* Skill Name */}
                    <td className="px-4 py-3.5 pr-2">
                      <Link
                        href="/skills"
                        className="font-medium text-zk-text hover:text-zk-accent transition hover:underline line-clamp-1 break-words"
                        title={item.title}
                      >
                        {item.title}
                      </Link>
                    </td>

                    {/* Submitted By */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar name={item.authorName} image={item.authorImage} size="sm" />
                        <span className="text-xs font-medium text-zk-text truncate">{item.authorName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-500/20">
                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Pending
                      </span>
                    </td>

                    {/* Decision */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleApprove(item)}
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item)}
                          className="rounded-lg border border-zk-border bg-zk-surface px-3 py-1 text-xs font-semibold text-zk-muted hover:text-zk-text hover:bg-zk-tint transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECTION 2: DECISION HISTORY */}
      <section className="space-y-3 pt-4 border-t border-zk-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zk-text flex items-center gap-2">
            Decision History
            <span className="text-xs font-normal text-zk-muted">({historyItems.length})</span>
          </h2>
        </div>

        {historyItems.length === 0 ? (
          <div className="rounded-[18px] border border-zk-border bg-zk-surface/50 p-6 text-center text-xs text-zk-muted">
            No reviewed skill history yet.
          </div>
        ) : (
          <div className="rounded-[18px] border border-zk-border bg-zk-surface shadow-sm overflow-hidden w-full">
            <table className="table-fixed w-full text-left text-sm divide-y divide-zk-border">
              <colgroup>
                <col className="w-[44%]" />
                <col className="w-[22%]" />
                <col className="w-[18%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead className="bg-zk-tint text-xs font-semibold uppercase tracking-wide text-zk-muted">
                <tr>
                  <th className="px-4 py-3">Skill Name</th>
                  <th className="px-4 py-3">Submitted By</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Outcome / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zk-divider">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zk-tint/60 transition-colors">
                    {/* Skill Name */}
                    <td className="px-4 py-3.5 pr-2">
                      <Link
                        href="/skills"
                        className="font-medium text-zk-text hover:text-zk-accent transition hover:underline line-clamp-1 break-words"
                        title={item.title}
                      >
                        {item.title}
                      </Link>
                    </td>

                    {/* Submitted By */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar name={item.authorName} image={item.authorImage} size="sm" />
                        <span className="text-xs font-medium text-zk-text truncate">{item.authorName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          item.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            item.status === "approved" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {item.status === "approved" ? "Approved" : "Changes Requested"}
                      </span>
                    </td>

                    {/* Outcome Note */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {item.status === "approved" ? (
                        <span className="text-xs text-emerald-600 font-medium">
                          ✓ Published
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedHistoryNote(item)}
                          className="rounded-lg border border-zk-border bg-zk-surface px-3 py-1 text-xs font-semibold text-zk-text2 hover:text-zk-text hover:bg-zk-tint transition shadow-xs"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reviewer Note Detail Modal */}
      {selectedHistoryNote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedHistoryNote(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zk-border bg-zk-surface p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zk-text">Reviewer Feedback</h3>
              <button
                type="button"
                onClick={() => setSelectedHistoryNote(null)}
                className="text-zk-muted hover:text-zk-text text-sm font-bold p-1 rounded-lg hover:bg-zk-tint"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs text-zk-muted mb-1.5 font-medium">
                Skill: <span className="text-zk-text font-semibold">{selectedHistoryNote.title}</span>
              </p>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                {selectedHistoryNote.rejectionReason || "Changes requested: Please provide additional automated unit test assertions."}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedHistoryNote(null)}
                className="rounded-xl bg-zk-accent px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
