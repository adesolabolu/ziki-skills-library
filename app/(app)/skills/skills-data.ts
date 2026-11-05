export type SkillCategory = "testing" | "security" | "design" | "backend" | "marketing";
export type SkillBadgeColor = "blue" | "emerald" | "indigo" | "pink" | "purple" | "cyan" | "amber";

export interface SkillItem {
  id: string;
  slug: string;
  title: string;
  icon: "flutter" | "shield" | "browser" | "figma" | "database" | "a11y" | "test" | "api" | "seo";
  category: SkillCategory;
  categoryLabel: string;
  badge: string;
  badgeColor?: SkillBadgeColor;
  description: string;
  tags: string[];
  usersCount: number;
  prompt: string;
  spec: {
    overview: string;
    capabilities: string[];
    checklist: string[];
    sampleCommand: string;
    documentationUrl?: string;
  };
  author: {
    name: string;
    handle: string;
    isVerified: boolean;
  };
  createdAt: string;
}

export const VERIFIED_SKILLS: SkillItem[] = [
  {
    id: "flutter-desktop-qa",
    slug: "flutter-desktop-qa",
    title: "Flutter Desktop QA Runner",
    icon: "flutter",
    category: "testing",
    categoryLabel: "Testing & QA",
    badge: "Verified",
    description:
      "Runs headless widget regression tests, verifies single-responsibility layout constraints, and captures visual evidence.",
    tags: ["flutter", "dart", "desktop", "widgets"],
    usersCount: 142,
    prompt: `You have the Flutter Desktop QA Runner skill equipped.
Before marking any Flutter PR or fix ready:
1. Verify widget layout constraints with zero overflow warnings.
2. Ensure null safety checks on user initials, avatars, and profile states.
3. Run \`flutter test\` on modified files and confirm 100% passing tests.
4. Always provide clear, cropped visual before/after verification evidence.`,
    spec: {
      overview:
        "Comprehensive testing and verification suite tailored for Flutter desktop and web applications. Automates layout assertion and regression passes.",
      capabilities: [
        "Headless widget testing with simulated mouse interactions",
        "Single-responsibility state assertions",
        "Layout constraint validation (zero RenderFlex overflow)",
        "Automated before/after visual evidence generation"
      ],
      checklist: [
        "Run `flutter analyze` with 0 warnings or errors",
        "Run `flutter test test/...` targeting modified components",
        "Verify focus rings, keyboard navigability, and cursor hover styles"
      ],
      sampleCommand: "flutter test test/features/channels/attachment_preview_test.dart",
      documentationUrl: "https://docs.flutter.dev/testing/overview"
    },
    author: {
      name: "Ziki Core Team",
      handle: "@ziki",
      isVerified: true
    },
    createdAt: "2026-10-15T10:00:00.000Z"
  },
  {
    id: "snare-clean-gate",
    slug: "snare-clean-gate",
    title: "Snare Security & Clean Gate",
    icon: "shield",
    category: "security",
    categoryLabel: "Security",
    badge: "Official Gate",
    description:
      "Pre-flight gatekeeper that scans for disguised payloads, blocks binary screenshot bloat, and verifies clean commands.",
    tags: ["security", "git-hygiene", "zero-bloat", "sentinel"],
    usersCount: 320,
    prompt: `You are equipped with the Snare Gatekeeper skill.
1. NEVER commit binary screenshots or large assets into git history.
2. Scan all command executions, dependency pulls, and branch checkouts before running.
3. Abort immediately if any unapproved hook or untrusted script modifies root configuration.`,
    spec: {
      overview:
        "Enforces zero git bloat, pre-commit credential detection, and sanitized environment variables across all connected agent sessions.",
      capabilities: [
        "Pre-checkout SHA safety verification",
        "Binary asset interception (blocks unintended git history bloat)",
        "Zero-trust credential leaks detection",
        "Host daemon execution protection"
      ],
      checklist: [
        "Run `snare gate -- <cmd>` before every repository execution",
        "Verify 0 binary assets committed to pull request diff",
        "Confirm clean line endings (strict LF only)"
      ],
      sampleCommand: "snare gate -- npm test",
      documentationUrl: "https://ziki.dev/security/gate"
    },
    author: {
      name: "Security Workgroup",
      handle: "@security",
      isVerified: true
    },
    createdAt: "2026-10-18T14:30:00.000Z"
  },
  {
    id: "playwright-e2e-inspector",
    slug: "playwright-e2e-inspector",
    title: "Playwright E2E Browser Inspector",
    icon: "browser",
    category: "testing",
    categoryLabel: "Testing & QA",
    badge: "Popular",
    description:
      "Automates headless Chromium browser user scenarios, checks console errors, and asserts responsive component states.",
    tags: ["playwright", "e2e", "browser", "react"],
    usersCount: 215,
    prompt: `You have the Playwright E2E Browser Inspector skill equipped.
1. Run target specs under \`e2e/\` using headless browser engine.
2. Ensure all selectors rely on accessible roles and data attributes rather than fragile CSS classes.
3. Validate session cookie restoration across protected paths.`,
    spec: {
      overview:
        "End-to-end browser automation and visual regression harness testing real user journeys in Chromium and WebKit environments.",
      capabilities: [
        "Headless multi-tab session execution",
        "Network request interception & fixture mocking",
        "Visual snapshot diffing across screen breakpoints",
        "Full trace zip archive generation on test failure"
      ],
      checklist: [
        "Run `npx playwright test e2e/...`",
        "Assert proper aria-label and role accessibility on target buttons",
        "Confirm no unhandled console errors during navigation"
      ],
      sampleCommand: "npx playwright test e2e/auth-flow.spec.ts",
      documentationUrl: "https://playwright.dev"
    },
    author: {
      name: "Frontend Reliability Guild",
      handle: "@qa-guild",
      isVerified: true
    },
    createdAt: "2026-10-20T09:15:00.000Z"
  },
  {
    id: "figma-token-style-sync",
    slug: "figma-token-style-sync",
    title: "Figma Token & Style Sync",
    icon: "figma",
    category: "design",
    categoryLabel: "Design & UI",
    badge: "Design Token",
    description:
      "Extracts design tokens, typography scales, and padding variables from Figma to match the project design system.",
    tags: ["figma", "design-system", "anti-slop", "tokens"],
    usersCount: 89,
    prompt: `You are equipped with the Figma Token & Style Sync skill.
1. Strictly extract and verify design tokens against the project Figma specification.
2. Ensure semantic palette mapping to CSS variables and theme configuration.
3. Validate responsive typography and spacing scale compliance.`,
    spec: {
      overview:
        "Synchronizes Figma design system variables directly into Tailwind and CSS variable definitions, preventing arbitrary spacing and color values.",
      capabilities: [
        "Figma REST API design token extraction",
        "Design token diffing against active stylesheets",
        "Automated semantic color palette mapping",
        "Typography and spacing scale synchronization"
      ],
      checklist: [
        "Sync design tokens via `npm run tokens:sync`",
        "Verify dark and light mode variable coverage",
        "Ensure no arbitrary hex colors introduced into components"
      ],
      sampleCommand: "npm run tokens:sync",
      documentationUrl: "https://www.figma.com/developers/api"
    },
    author: {
      name: "Design Systems Team",
      handle: "@design",
      isVerified: true
    },
    createdAt: "2026-10-22T16:00:00.000Z"
  },
  {
    id: "postgres-migration-auditor",
    slug: "postgres-migration-auditor",
    title: "Postgres & Migration Auditor",
    icon: "database",
    category: "backend",
    categoryLabel: "Backend & Database",
    badge: "Database",
    description:
      "Performs dry-run SQL migrations, audits index declarations, and tests backward-compatible schema rollbacks.",
    tags: ["postgres", "prisma", "neon", "migrations"],
    usersCount: 94,
    prompt: `You are equipped with the Postgres Migration Auditor skill.
1. When modifying \`schema.prisma\`, verify all foreign keys have appropriate indexes.
2. Confirm new migrations include idempotent rollbacks or backward-compatible column additions.
3. Never drop tables or columns in production without a verified 2-step deprecation cycle.`,
    spec: {
      overview:
        "Static and runtime analyzer for Prisma schema migrations. Identifies potential table locks, missing compound indexes, and destructive schema changes.",
      capabilities: [
        "Missing index detection on relational foreign keys",
        "Lock hazard analysis for existing high-volume tables",
        "Idempotency verification across multiple shadow environments",
        "Automated schema drift diffing"
      ],
      checklist: [
        "Run `npx prisma migrate dev --create-only`",
        "Audit generated SQL in `prisma/migrations/`",
        "Verify `prisma generate` compiles with 0 TypeScript mismatches"
      ],
      sampleCommand: "npx prisma migrate status",
      documentationUrl: "https://www.prisma.io/docs/concepts/components/prisma-migrate"
    },
    author: {
      name: "Data Platform Team",
      handle: "@data-infra",
      isVerified: true
    },
    createdAt: "2026-10-25T11:20:00.000Z"
  },
  {
    id: "wcag-accessibility-auditor",
    slug: "wcag-accessibility-auditor",
    title: "WCAG Accessibility Auditor",
    icon: "a11y",
    category: "design",
    categoryLabel: "Design & UI",
    badge: "A11y AA",
    description:
      "Automates WCAG 2.1 AA audits across modified components: inspects contrast ratios, focus order, and ARIA labels.",
    tags: ["a11y", "wcag-aa", "aria", "contrast"],
    usersCount: 178,
    prompt: `You have the WCAG Accessibility Auditor skill equipped.
1. Verify all interactive elements have visible focus rings and accessible labels (\`aria-label\`).
2. Test keyboard tab ordering and ensure modals trap focus and dismiss on Escape.
3. Ensure color contrast ratios meet minimum 4.5:1 for body copy.`,
    spec: {
      overview:
        "Full accessibility auditing suite integrating Axe-Core and automated WCAG 2.1 AA evaluation across all web components.",
      capabilities: [
        "Automated axe-core DOM accessibility scanning",
        "Focus trap and tab cycle validation in modal dialogs",
        "Screen-reader announcement simulation (aria-live, atomic)",
        "Minimum touch-target size evaluation (>=44x44px)"
      ],
      checklist: [
        "Verify all icon-only buttons include descriptive `aria-label` or `Tooltip`",
        "Ensure backdrop overlays handle click-outside and Escape dismiss",
        "Confirm form inputs have associated `<label>` or `aria-labelledby`"
      ],
      sampleCommand: "npm run test:a11y",
      documentationUrl: "https://www.w3.org/WAI/standards-guidelines/wcag/"
    },
    author: {
      name: "Inclusive Web Guild",
      handle: "@a11y-lead",
      isVerified: true
    },
    createdAt: "2026-10-28T13:45:00.000Z"
  },
  {
    id: "seo-crawler-meta-optimizer",
    slug: "seo-crawler-meta-optimizer",
    title: "SEO & Crawler Meta Optimizer",
    icon: "browser",
    category: "marketing",
    categoryLabel: "SEO & Marketing",
    badge: "SEO Specialist",
    description:
      "Audits canonical tags, OpenGraph previews, JSON-LD structured schemas, and ensures zero broken indexing across crawlers.",
    tags: ["seo", "indexing", "metadata", "sitemap", "crawler"],
    usersCount: 164,
    prompt: `You are equipped with the SEO & Crawler Meta Optimizer skill.
Before finalizing any landing page, issue view, or marketing route:
1. Verify OpenGraph and Twitter card meta tags (title, description, canonical url, and 1200x630 share image).
2. Validate semantic JSON-LD structured data and ensure zero validation errors.
3. Confirm robots.txt and sitemap.xml entries correctly index public paths while keeping private auth routes disallowlisted.
4. Test response status codes and verify zero broken redirects.`,
    spec: {
      overview:
        "Comprehensive SEO and crawler verification tool. Inspects canonical URLs, social unfurling cards, search engine schemas, and indexation hygiene.",
      capabilities: [
        "Automated OpenGraph (OG) image and tag extraction",
        "JSON-LD structured data syntax validation",
        "Crawler response audit (Googlebot, Twitterbot, Bingbot)",
        "Canonical link and trailing slash consistency assertions"
      ],
      checklist: [
        "Verify generateMetadata exports valid title and description",
        "Confirm /sitemap.xml includes newly added routes",
        "Validate social preview card rendering with zero CORS issues"
      ],
      sampleCommand: "npx next-sitemap",
      documentationUrl: "https://nextjs.org/docs/app/building-your-application/optimizing/metadata"
    },
    author: {
      name: "Growth & SEO Guild",
      handle: "@growth",
      isVerified: true
    },
    createdAt: "2026-10-28T12:00:00.000Z"
  },
  {
    id: "api-contract-sentinel",
    slug: "api-contract-sentinel",
    title: "REST & GraphQL API Contract Sentinel",
    icon: "api",
    category: "backend",
    categoryLabel: "Backend & Database",
    badge: "API Security",
    description:
      "Validates OpenAPI 3.1 & GraphQL schema contracts, detects breaking schema changes, and generates type-safe mock fixtures.",
    tags: ["api", "openapi", "graphql", "contracts", "mocking"],
    usersCount: 135,
    prompt: `You have the REST & GraphQL API Contract Sentinel skill equipped.
1. Strictly validate request body and query parameter schemas against OpenAPI 3.1 specifications.
2. Flag breaking payload changes before merging backend API routes.
3. Assert uniform HTTP error response envelopes across all endpoints.`,
    spec: {
      overview:
        "Guarantees forward and backward compatibility across backend endpoints, enforcing contract-first design with automated schema linting.",
      capabilities: [
        "OpenAPI 3.1 specification schema validation",
        "Breaking change detection in REST and GraphQL schemas",
        "Deterministic mock fixture generation",
        "Automated payload type inference"
      ],
      checklist: [
        "Validate route handler input against Zod / OpenAPI contract",
        "Verify standard error response status codes (400, 401, 403, 404, 500)",
        "Confirm zero unhandled Promise rejections on missing fields"
      ],
      sampleCommand: "npm run test:api-contract",
      documentationUrl: "https://swagger.io/specification/"
    },
    author: {
      name: "API Infrastructure Team",
      handle: "@api-infra",
      isVerified: true
    },
    createdAt: "2026-10-29T14:00:00.000Z"
  },
  {
    id: "docker-microvm-runner",
    slug: "docker-microvm-runner",
    title: "Docker MicroVM Container Architect",
    icon: "database",
    category: "backend",
    categoryLabel: "Backend & Database",
    badge: "DevOps",
    description:
      "Containerizes reproducible development environments, scans image vulnerability layers, and verifies zero-root runtime isolation.",
    tags: ["docker", "containers", "devops", "isolation"],
    usersCount: 112,
    prompt: `You have the Docker MicroVM Container Architect skill equipped.
1. Enforce multi-stage Docker builds to minimize runtime image footprint.
2. Ensure container processes run under non-root unprivileged users.
3. Verify deterministic environment variables and bind-mount configurations.`,
    spec: {
      overview:
        "Automates Dockerfile auditing and container security verification, ensuring minimal image sizes and rock-solid deployment parity.",
      capabilities: [
        "Multi-stage build optimization and layer caching",
        "CVE vulnerability scanning on base alpine and debian images",
        "Zero-root security context assertions",
        "Container healthcheck probe configuration"
      ],
      checklist: [
        "Verify `USER node` or non-root runtime declaration in Dockerfile",
        "Check that production image excludes devDependencies",
        "Confirm container starts and passes healthcheck probes"
      ],
      sampleCommand: "docker build --check .",
      documentationUrl: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/"
    },
    author: {
      name: "Cloud Platform Guild",
      handle: "@cloud-ops",
      isVerified: true
    },
    createdAt: "2026-10-30T11:30:00.000Z"
  },
  {
    id: "framer-motion-smoother",
    slug: "framer-motion-smoother",
    title: "Motion & Micro-Interaction Smoother",
    icon: "figma",
    category: "design",
    categoryLabel: "Design & UI",
    badge: "UI Motion",
    description:
      "Crafts 60fps spring transitions, guarantees reduced-motion accessibility overrides, and eliminates layout shift (CLS).",
    tags: ["motion", "animation", "spring", "reduced-motion"],
    usersCount: 97,
    prompt: `You are equipped with the Motion & Micro-Interaction Smoother skill.
1. Prioritize transform and opacity properties for GPU-accelerated 60fps animations.
2. Honor prefers-reduced-motion media queries and disable spring physics for users who request it.
3. Prevent Cumulative Layout Shift (CLS) by reserving dimensions before animating entry states.`,
    spec: {
      overview:
        "High-fidelity UI animation and micro-interaction skill ensuring buttery-smooth transitions while strictly maintaining WCAG compliance.",
      capabilities: [
        "Physically accurate spring physics configuration",
        "prefers-reduced-motion accessibility overrides",
        "GPU-accelerated transform & opacity animation enforcement",
        "Layout shift (CLS) prevention during modal and drawer mounts"
      ],
      checklist: [
        "Verify all animations wrap in `motion-safe:` utility or `useReducedMotion`",
        "Assert 60fps frame rate without dropped frames during interaction",
        "Confirm layout animation uses `layoutId` without distorting aspect ratios"
      ],
      sampleCommand: "npm run test:motion",
      documentationUrl: "https://www.framer.com/motion/"
    },
    author: {
      name: "Design Engineering Team",
      handle: "@design-eng",
      isVerified: true
    },
    createdAt: "2026-11-01T09:00:00.000Z"
  },
  {
    id: "vitest-mutation-tester",
    slug: "vitest-mutation-tester",
    title: "Vitest Mutation Test Engine",
    icon: "test",
    category: "testing",
    categoryLabel: "Testing & QA",
    badge: "Code Coverage",
    description:
      "Injects synthetic mutations into application logic to expose untested edge-cases, asserting minimum 95% branch kill rate.",
    tags: ["vitest", "mutation-testing", "coverage", "assertions"],
    usersCount: 153,
    prompt: `You have the Vitest Mutation Test Engine skill equipped.
1. When authoring unit tests, verify mutants (flipped operators, changed return values) are caught.
2. Require tests to fail when core assertions are omitted or weakened.
3. Aim for minimum 95% mutant kill score on mission-critical utilities.`,
    spec: {
      overview:
        "Goes beyond simple line coverage by deliberately introducing bugs (mutations) into source files to verify that existing test suites catch them.",
      capabilities: [
        "Automated synthetic mutation injection",
        "Dead-code and survival mutant reporting",
        "Branch coverage verification on edge condition handlers",
        "Incremental mutation testing on git diff"
      ],
      checklist: [
        "Run `npx vitest run --coverage`",
        "Verify test suites catch boolean inversion and boundary condition shifts",
        "Confirm 100% passing tests with 0 false positives"
      ],
      sampleCommand: "npx vitest run test/unit/",
      documentationUrl: "https://vitest.dev/guide/"
    },
    author: {
      name: "Test Automation Guild",
      handle: "@test-guild",
      isVerified: true
    },
    createdAt: "2026-11-02T15:20:00.000Z"
  }
];

export async function getSkills(): Promise<SkillItem[]> {
  return VERIFIED_SKILLS;
}

export async function getSkillBySlug(slug: string): Promise<SkillItem | undefined> {
  const normalized = slug.trim().toLowerCase();
  return VERIFIED_SKILLS.find(
    (skill) => skill.slug.toLowerCase() === normalized || skill.id.toLowerCase() === normalized
  );
}

export async function getSkillsByCategory(category: SkillCategory): Promise<SkillItem[]> {
  return VERIFIED_SKILLS.filter((skill) => skill.category === category);
}
