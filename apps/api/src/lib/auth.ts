import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { adminUsers, sessions } from "../db/schema";
import { env } from "./env";
import { UnauthorizedError } from "./http-error";

// ---------------------------------------------------------------------------
// Password (Bun bawaan: bcrypt, tanpa dependency eksternal)
// ---------------------------------------------------------------------------

export function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return Bun.password.verify(plain, hash);
}

export async function deleteExpiredSessions(userId: string): Promise<void> {
  await db
    .delete(sessions)
    .where(eq(sessions.adminUserId, userId))
    .execute();
}

// ---------------------------------------------------------------------------
// JWT + session guard untuk route admin
// ---------------------------------------------------------------------------

export interface AdminContext {
  admin: { id: string; email: string; sid: string } | undefined;
}

function parseBearer(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return undefined;
  return token;
}

/**
 * Plugin auth: verifikasi JWT + session di DB.
 * Route yang memakai plugin ini mendapatkan `admin` di context (scoped).
 */
export const adminGuard = new Elysia({ name: "admin-guard" })
  .use(
    jwt({
      name: "jwt",
      secret: env.jwtSecret,
      exp: "7d",
    }),
  )
  .resolve({ as: "scoped" }, async ({ jwt, headers }) => {
    const token = parseBearer(headers.authorization);
    if (!token) throw new UnauthorizedError("Missing bearer token");

    const payload = await jwt.verify(token);
    if (!payload) throw new UnauthorizedError("Invalid token");
    const sid = typeof payload.sid === "string" ? payload.sid : undefined;
    const sub = typeof payload.sub === "string" ? payload.sub : undefined;
    if (!sid || !sub) throw new UnauthorizedError("Invalid token");

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, sid),
    });
    if (!session) throw new UnauthorizedError("Session tidak ditemukan");
    if (session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedError("Session sudah kedaluwarsa");
    }
    const adminUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, session.adminUserId),
    });
    if (!adminUser) throw new UnauthorizedError("Admin tidak ditemukan");

    return {
      admin: {
        id: session.adminUserId,
        email: adminUser.email,
        sid: session.id,
      },
    };
  });

/** Skema respons error konsisten. */
export const errorResponse = t.Object({
  error: t.String(),
  details: t.Optional(t.Unknown()),
});