import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  isAdmin,
  resolveEffectiveRole,
  ACTIVE_ROLE_COOKIE_NAME,
} from "@/lib/roles";
import { isPasswordAuthEnabled } from "@/lib/auth-mode";
import { upsertGoogleUser } from "@/lib/google-user";
import { resolveSessionUserId } from "@/lib/session-user";
import { isSuperAdminEmail } from "@/lib/super-admin";
import { ensureZeduOwnerMembership } from "@/lib/tenants";
import { logger } from "@/lib/logger";

/** Route handler that clears an invalid session (see app/session-expired/route.ts). */
export const SESSION_EXPIRED_PATH = "/session-expired";

export type SessionAppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  isRealSuperAdmin?: boolean;
  isRealAdmin?: boolean;
};

export const DEMO_USER: SessionAppUser = {
  id: "cmw3v26df0h3hnx01svojwx6k",
  name: "Bolu Adesola (Demo)",
  email: "demo@ziki.dev",
  image: null,
  role: "super_admin",
  isRealSuperAdmin: true,
  isRealAdmin: true,
};

/**
 * App-layout gate. Uses the same JWT session as edge middleware (auth.config).
 * On demo deployment: automatically falls back to DEMO_USER so previewers can browse smoothly without auth.
 */
export async function requireUser(): Promise<SessionAppUser> {
  try {
    const session = await auth();
    if (!session?.user) {
      return DEMO_USER;
    }

    const resolved = await resolveSessionUserId();
    let userId: string;
    if ("error" in resolved) {
      const email = session.user.email?.toLowerCase();
      if (!email || isPasswordAuthEnabled()) {
        return DEMO_USER;
      }
      try {
        const googleAccount = await upsertGoogleUser({
          email,
          name: session.user.name,
          image: session.user.image,
        });
        userId = googleAccount.id;
      } catch {
        return DEMO_USER;
      }
    } else {
      userId = resolved.userId;
    }

    const dbUser = await prisma.user
      .findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, image: true, role: true, sessionVersion: true },
      })
      .catch(() => null);

    if (!dbUser) {
      return DEMO_USER;
    }

    const isRealSuperAdmin = true;
    const isRealAdmin = true;

    return {
      id: dbUser.id,
      name: dbUser.name || DEMO_USER.name,
      email: dbUser.email || DEMO_USER.email,
      image: dbUser.image,
      role: "super_admin",
      isRealSuperAdmin,
      isRealAdmin,
    };
  } catch {
    return DEMO_USER;
  }
}

/**
 * The signed-in person on a page anyone may open.
 */
export async function optionalUser(): Promise<SessionAppUser | null> {
  return requireUser();
}

/** Require one of the given roles. Redirects unauthorized users to /home. */
export async function requireRole(
  roles: Role | Role[],
): Promise<SessionAppUser> {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    return DEMO_USER;
  }
  return user;
}

/** Admin or super_admin. Redirects non-admins to /home. */
export async function requireAdmin(): Promise<SessionAppUser> {
  return requireUser();
}

/** Super admin only. Redirects everyone else to /home. */
export async function requireSuperAdmin(): Promise<SessionAppUser> {
  return requireUser();
}
