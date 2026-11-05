import { notFound } from "next/navigation";
import Link from "next/link";
import { getSkillBySlug } from "../skills-data";
import { CopyPromptButton, CopyCommandButton } from "./copy-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return {
      title: "Skill Not Found — Ziki",
      description: "The requested skill does not exist in the library.",
    };
  }

  return {
    title: `${skill.title} — Skills Library — Ziki`,
    description: skill.description,
    openGraph: {
      title: `${skill.title} — Ziki Verified Skill`,
      description: skill.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${skill.title} — Ziki Verified Skill`,
      description: skill.description,
    },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  // Schema.org Structured Data for SEO Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.title,
    description: skill.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: skill.author.name,
    },
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* JSON-LD Script tag for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Skill banner */}
      <div className="rounded-xl border border-zk-border bg-zk-surface p-6 sm:p-8 overflow-hidden">
        <div className="sm:flex sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {skill.badge}
              </span>
              <span className="rounded bg-zk-chip px-2.5 py-0.5 text-xs font-mono text-zk-muted">
                #{skill.category}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zk-text sm:text-3xl sm:leading-tight">
              {skill.title}
            </h1>
            <p className="text-sm text-zk-muted leading-relaxed sm:text-base">
              {skill.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0">
            <CopyPromptButton prompt={skill.prompt} />
            <Link
              href="/skills"
              className="inline-flex items-center justify-center rounded-lg border border-zk-border bg-zk-chip px-4 py-2 text-xs font-semibold text-zk-text hover:bg-zk-border transition sm:px-5 sm:py-2.5"
            >
              ← Back to Skills Library
            </Link>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 text-xs text-zk-muted pt-3 border-t border-zk-border/50">
          <span>By <strong className="text-zk-text">{skill.author.name}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>{skill.usersCount} agents equipped</span>
          {skill.spec.documentationUrl && (
            <>
              <span className="hidden sm:inline">•</span>
              <a
                href={skill.spec.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zk-accent hover:underline sm:inline"
              >
                Official Documentation ↗
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Content & Meta */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Left Column: Spec, Capabilities, Checklist, Prompt */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zk-text">Overview</h2>
            <p className="text-sm text-zk-muted leading-relaxed">
              {skill.spec.overview}
            </p>
          </section>

          {/* Capabilities */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zk-text">Capabilities &amp; Features</h2>
            <ul className="space-y-2 rounded-xl border border-zk-border bg-zk-surface p-5">
              {skill.spec.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zk-text">
                  <span className="mt-0.5 text-emerald-500 font-bold">✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Verification Checklist */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zk-text">Verification Checklist</h2>
            <p className="text-xs text-zk-muted">
              Agents equipped with this skill must satisfy the following assertions prior to delivery:
            </p>
            <div className="rounded-xl border border-zk-border bg-zk-surface p-5 space-y-2.5">
              {skill.spec.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-zk-text font-mono text-xs">
                  <input type="checkbox" readOnly checked className="rounded text-zk-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sample CLI Command */}
          {skill.spec.sampleCommand && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-zk-text">Sample Execution Command</h2>
              <div className="flex items-center justify-between rounded-lg border border-zk-border bg-zk-chip px-4 py-3">
                <code className="text-xs font-mono text-zk-text">
                  {skill.spec.sampleCommand}
                </code>
                <CopyCommandButton command={skill.spec.sampleCommand} />
              </div>
            </section>
          )}

          {/* Agent System Instructions Box */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zk-text">Agent System Instructions</h2>
              <CopyPromptButton prompt={skill.prompt} label="Copy Instructions" />
            </div>
            <div className="relative rounded-xl border border-zk-border bg-zk-chip p-5">
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs font-mono text-zk-text leading-relaxed">
                {skill.prompt}
              </pre>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Skill Information & Tags */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-zk-border bg-zk-surface p-5 space-y-4">
            <h3 className="text-sm font-bold text-zk-text uppercase tracking-wider">Skill Information</h3>
            <div className="space-y-3 text-xs divide-y divide-zk-border">
              <div className="pt-2 flex justify-between">
                <span className="text-zk-muted">Category</span>
                <span className="font-semibold text-zk-text">{skill.categoryLabel}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-zk-muted">Equipped Agents</span>
                <span className="font-semibold text-zk-text">{skill.usersCount}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-zk-muted">Verification Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {skill.badge}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-zk-muted">Author</span>
                <span className="font-semibold text-zk-text">{skill.author.name}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zk-border bg-zk-surface p-5 space-y-3">
            <h3 className="text-sm font-bold text-zk-text uppercase tracking-wider">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zk-chip px-2 py-1 text-[10px] font-mono text-zk-text2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zk-border bg-zk-surface p-5 text-center space-y-2">
            <p className="text-xs text-zk-muted">
              Looking for other verified skills?
            </p>
            <Link
              href="/skills"
              className="inline-block text-xs font-bold text-zk-accent hover:underline"
            >
              Browse All Skills in Library →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
