"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { type SkillItem } from "./skills-data";

export interface AgentOption {
  id: string;
  name: string;
  avatar?: string | null;
  model?: string | null;
  level?: string;
}

interface SkillsDirectoryProps {
  skills: SkillItem[];
  agents: AgentOption[];
  userId: string;
}

/**
 * Interactive directory panel for the Skills Library.
 * Handles category filtering, real-time keyword search, agent equipping, and prompt copying.
 */
export function SkillsDirectory({ skills, agents, userId }: SkillsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultAgentId = agents.length > 0 ? agents[0].id : "default-agent";

  // Track which agent is selected for each skill card
  const [cardSelectedAgents, setCardSelectedAgents] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const skill of skills) {
      initial[skill.id] = defaultAgentId;
    }
    return initial;
  });

  // Track equipped state: Set of "${skillId}:${agentId}"
  const [equippedSet, setEquippedSet] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`ziki_equipped_skills_${userId}`);
        if (stored) {
          return new Set(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to read equipped skills from localStorage", e);
      }
    }
    return new Set([`snare-clean-gate:${defaultAgentId}`]);
  });

  // Persist equipped state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `ziki_equipped_skills_${userId}`,
          JSON.stringify(Array.from(equippedSet))
        );
      } catch (e) {
        console.error("Failed to save equipped skills to localStorage", e);
      }
    }
  }, [equippedSet, userId]);

  // Category counts matching available skills
  const categories = useMemo(() => {
    return [
      { id: "all", label: "All Skills", count: skills.length },
      {
        id: "testing",
        label: "Testing & QA",
        count: skills.filter((s) => s.category === "testing").length,
      },
      {
        id: "security",
        label: "Security",
        count: skills.filter((s) => s.category === "security").length,
      },
      {
        id: "design",
        label: "Design & UI",
        count: skills.filter((s) => s.category === "design").length,
      },
      {
        id: "backend",
        label: "Backend & Database",
        count: skills.filter((s) => s.category === "backend").length,
      },
      {
        id: "marketing",
        label: "SEO & Marketing",
        count: skills.filter((s) => s.category === "marketing").length,
      },
    ];
  }, [skills]);

  // Filter skills by category and search query
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "all" || skill.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.title.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  function handleCardAgentChange(skillId: string, agentId: string) {
    setCardSelectedAgents((prev) => ({ ...prev, [skillId]: agentId }));
  }

  function toggleEquip(skill: SkillItem) {
    const agentId = cardSelectedAgents[skill.id] || defaultAgentId;
    const key = `${skill.id}:${agentId}`;
    const agentObj = agents.find((a) => a.id === agentId);
    const agentName = agentObj?.name || "Agent";

    setEquippedSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        showToast(`Unequipped ${skill.title} from ${agentName}`);
      } else {
        next.add(key);
        showToast(`Equipped ${skill.title} onto ${agentName}!`);
      }
      return next;
    });
  }

  async function copyPrompt(skill: SkillItem) {
    try {
      await navigator.clipboard.writeText(skill.prompt);
      showToast(`Copied ${skill.title} skill prompt to clipboard!`);
    } catch {
      showToast("Unable to copy to clipboard automatically.");
    }
  }

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3500);
  }

  const totalEquippedCount = equippedSet.size;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-zk-border bg-zk-surface px-5 py-3.5 text-sm font-semibold text-zk-text shadow-2xl transition-all duration-300 motion-safe:animate-bounce"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zk-ok-bg text-zk-ok-fg">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col gap-6 border-b border-zk-border pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-zk-text sm:text-4xl">
            Tools &amp; Skills
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zk-muted">
            Equip verified test runners, linters, and security guardrails directly onto your AI agents.
          </p>
        </div>

        {/* Action Button: Link directly to the Contributor Submission Portal */}
        <Link
          href="/earn/skills"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Skill</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:pb-0">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-bold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-chip"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-white/25 text-white" : "bg-zk-chip text-zk-muted"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-zk-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools & skills..."
            className="w-full rounded-full border border-zk-border bg-zk-surface py-2 pl-9 pr-8 text-xs font-medium text-zk-text placeholder-zk-muted focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-zk-muted hover:text-zk-text"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Skill Cards */}
      {filteredSkills.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zk-border bg-zk-surface p-12 text-center">
          <p className="text-sm font-semibold text-zk-text">No skills found matching your search</p>
          <p className="mt-1 text-xs text-zk-muted">Try clearing your filters or search keywords.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full bg-zk-chip px-5 py-2 text-xs font-bold text-zk-text hover:bg-zk-border transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => {
            const currentAgentId = cardSelectedAgents[skill.id] || defaultAgentId;
            const isEquipped = equippedSet.has(`${skill.id}:${currentAgentId}`);

            return (
              <div
                key={skill.id}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-zk-surface p-5 shadow-sm transition-all hover:shadow-md ${
                  isEquipped ? "border-zk-ok-fg/50 ring-1 ring-zk-ok-fg/20" : "border-zk-border"
                }`}
              >
                {/* Clickable Header & Body: Direct navigation to the dedicated /skills/[slug] page */}
                <Link
                  href={`/skills/${skill.slug}`}
                  className="space-y-3 cursor-pointer block"
                  title={`View details for ${skill.title}`}
                >
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zk-tint text-blue-600 group-hover:scale-105 transition-transform">
                      <SkillIcon icon={skill.icon} />
                    </div>

                    <span className="rounded-full border border-zk-border bg-zk-chip px-2.5 py-0.5 text-[11px] font-bold text-zk-text2">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Category & Title */}
                  <div className="space-y-0.5">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {skill.categoryLabel || skill.category}
                    </span>
                    <h2 className="text-base font-extrabold text-zk-text group-hover:text-blue-600 transition-colors">
                      {skill.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-zk-muted">
                    {skill.description}
                  </p>

                  {/* Tags & Adoption */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zk-chip px-2.5 py-0.5 font-mono text-[10px] text-zk-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[11px] font-medium text-zk-muted">
                      {skill.usersCount} agents using
                    </span>
                  </div>
                </Link>

                {/* Card Controls */}
                <div className="mt-5 space-y-2.5 border-t border-zk-divider pt-4">
                  {/* Agent Selector and Equip Button */}
                  <div className="flex items-center gap-2">
                    <select
                      value={currentAgentId}
                      onChange={(e) => handleCardAgentChange(skill.id, e.target.value)}
                      className="flex-1 rounded-full border border-zk-border bg-zk-chip px-3 py-1.5 text-xs font-semibold text-zk-text focus:border-blue-600 focus:outline-none"
                    >
                      {agents.length === 0 ? (
                        <option value="default-agent">For: Default Agent</option>
                      ) : (
                        agents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            For: {ag.name}
                          </option>
                        ))
                      )}
                    </select>

                    <button
                      type="button"
                      onClick={() => toggleEquip(skill)}
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-sm ${
                        isEquipped
                          ? "bg-zk-ok-bg text-zk-ok-fg hover:brightness-95 border border-zk-ok-fg/30"
                          : "bg-blue-600 text-white hover:brightness-110"
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Active</span>
                        </>
                      ) : (
                        <span>+ Equip</span>
                      )}
                    </button>
                  </div>

                  {/* Clean Full-Width Copy Prompt Action */}
                  <button
                    type="button"
                    onClick={() => copyPrompt(skill)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-zk-border bg-zk-surface py-2 text-xs font-semibold text-zk-text hover:bg-zk-chip transition shadow-2xs"
                  >
                    <svg className="h-3.5 w-3.5 text-zk-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Agent Skill Prompt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkillIcon({ icon }: { icon: SkillItem["icon"] }) {
  switch (icon) {
    case "flutter":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "browser":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case "figma":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case "database":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case "a11y":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case "test":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "api":
    default:
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
  }
}
