import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { isLinkPreviewBot } from "@/lib/link-preview";
import { BASE_PATH, toAppPath } from "@/lib/base-path";
import { isProjectIssuePath, isReservedProjectSlug } from "@/lib/project-slug";
import { isProjectFirstPath } from "@/lib/project-paths";
import { isPublicAgentPath } from "@/lib/public-agent-paths";

/**
 * Edge-only auth wrapper — initialized from auth.config (no Prisma/bcrypt).
 * Importing `@/auth` here balloons the Edge Function past Vercel's 1 MB limit
 * and leaves production stuck on the old getToken middleware (redirect loops).
 */
const { auth } = NextAuth(authConfig);

/** A project's agent work feed: `/<org>/<project>/work`. */
const PROJECT_WORK_PATH = /^\/[^/]+\/[^/]+\/work\/?$/;

export function isPublicPath(
  pathWithoutBase: string,
  userAgent?: string | null,
): boolean {
  const isAuthPage =
    pathWithoutBase.startsWith("/login") || pathWithoutBase.startsWith("/signup");
  const isPasswordResetPage =
    pathWithoutBase.startsWith("/forgot-password") ||
    pathWithoutBase.startsWith("/reset-password");
  const isIssuePreview =
    isProjectIssuePath(pathWithoutBase) &&
    isLinkPreviewBot(userAgent);

  return (
    pathWithoutBase === "/" ||
    pathWithoutBase === "" ||
    pathWithoutBase === "/llms.txt" ||
    // The public marketing pages beside the homepage.
    pathWithoutBase === "/how-it-works" ||
    pathWithoutBase === "/for-agents" ||
    pathWithoutBase === "/developers" ||
    pathWithoutBase === "/skills" ||
    pathWithoutBase.startsWith("/skills/") ||
    pathWithoutBase === "/earn/skills" ||
    pathWithoutBase === "/superadmin/skill-approvals" ||
    isAuthPage ||
    isPasswordResetPage ||
    isPublicAgentPath(pathWithoutBase) ||
    isIssuePreview ||
    pathWithoutBase === "/" ||
    pathWithoutBase.startsWith("/session-expired") ||
    // Shareable invite links (#444). Guests must see the organization and
    // sign in with Google before the link is used; the page itself never
    // spends a use.
    pathWithoutBase === "/join" ||
    pathWithoutBase.startsWith("/join/") ||
    pathWithoutBase.startsWith("/api/auth") ||
    pathWithoutBase.startsWith("/api/health") ||
    // The scheduler calls the platform sweeps with Bearer CRON_SECRET and no
    // session (#571); the route rejects a wrong or missing secret itself.
    pathWithoutBase === "/api/internal/cron" ||
    // The agent API (#427) authenticates every call with an agent key, not a
    // session; each route rejects a request without one.
    pathWithoutBase.startsWith("/api/v1/") ||
    pathWithoutBase.startsWith("/_next") ||
    pathWithoutBase === "/favicon.ico"
  );
}

export default auth((req) => {
  const pathWithoutBase = toAppPath(req.nextUrl.pathname);
  const isLoggedIn = !!req.auth?.user;

  if (pathWithoutBase.startsWith("/api/bugs/")) {
    const newPath = pathWithoutBase.replace(/^\/api\/bugs\//, "/api/issues/");
    const targetUrl = new URL(
      BASE_PATH ? `${BASE_PATH}${newPath}` : newPath,
      req.nextUrl.origin,
    );
    targetUrl.search = req.nextUrl.search;
    return NextResponse.redirect(targetUrl, 308);
  }

  // Demo branch auth bypass: do not block or redirect visitors to /login
  // Allow all demo routes to be accessed freely.

  // An address from before organisations were in URLs, `/<project>/ideas` or
  // `/<project>/740` (#project-urls): /projects/moved finds the project's
  // organisation and sends the person on to `/<org>/<project>/…`.
  const first = decodeSegment(pathWithoutBase.split("/")[1] ?? "");
  if (isLoggedIn && first && !isReservedProjectSlug(first) && isProjectFirstPath(pathWithoutBase)) {
    const moved = new URL(BASE_PATH ? `${BASE_PATH}/projects/moved` : "/projects/moved", req.nextUrl.origin);
    moved.searchParams.set("to", `${pathWithoutBase}${req.nextUrl.search}`);
    return NextResponse.redirect(moved);
  }

  // The app layout reads x-ziki-path to give a guest on a public agent page a
  // plain shell; project pages read x-ziki-url to come back after switching organisation.
  const forwarded = new Headers(req.headers);
  forwarded.set("x-ziki-path", pathWithoutBase);
  forwarded.set("x-ziki-url", `${pathWithoutBase}${req.nextUrl.search}`);
  return NextResponse.next({ request: { headers: forwarded } });
});

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Keeps the agent approval code across the sign-in redirect. Other queries stay off the callback. */
function callbackPath(path: string, url: URL): string {
  if (path !== "/settings/agents/pair") return path;
  const code = url.searchParams.get("code") ?? "";
  if (!/^[A-Za-z0-9-]{1,20}$/.test(code)) return path;
  return `${path}?code=${code}`;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
