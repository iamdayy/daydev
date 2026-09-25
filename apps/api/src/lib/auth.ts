import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { adminUsers, sessions } from "../db/schema";
import { env } from "./env";
import { UnauthorizedError } from "./http-error";
import type { Admin, Env } from "./types";

export async function deleteExpiredSessions(userId: string): Promise<void> {
  await db
    .delete(sessions)
    .where(eq(sessions.adminUserId, userId))
    .execute();
}

// ---------------------------------------------------------------------------
// JWT (HS256) + session guard untuk route admin
// ---------------------------------------------------------------------------

const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const AUTH_EXP_SECONDS = Math.floor(AUTH_TTL_MS / 1000);

/** Sign token login: claim `exp` 7 hari, diverifikasi otomatis saat verify. */
export async function signAuthToken(payload: {
  sub: string;
  email: string;
  sid: string;
}): Promise<string> {
  return sign(
    {
      sub: payload.sub,
      email: payload.email,
      sid: payload.sid,
      exp: Math.floor(Date.now() / 1000) + AUTH_EXP_SECONDS,
    },
    env.jwtSecret,
  );
}

/** Verify token; return claim yang valid atau null (token invalid/kedaluwarsa). */
export async function verifyAuthToken(
  token: string,
): Promise<{ sub: string; email: string; sid: string } | null> {
  try {
    const payload = await verify(token, env.jwtSecret, "HS256");
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const sid = typeof payload.sid === "string" ? payload.sid : "";
    if (!sub || !email || !sid) return null;
    return { sub, email, sid };
  } catch {
    return null;
  }
}

function parseBearer(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return undefined;
  return token;
}

/** Verifikasi JWT + session aktif di DB; lempar UnauthorizedError kalau gagal. */
export async function authenticateAdmin(
  authorization: string | undefined,
): Promise<Admin> {
  const token = parseBearer(authorization);
  if (!token) throw new UnauthorizedError("Missing bearer token");

  const payload = await verifyAuthToken(token);
  if (!payload) throw new UnauthorizedError("Invalid token");

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, payload.sid),
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
    id: session.adminUserId,
    email: adminUser.email,
    sid: session.id,
  };
}

/**
 * Middleware untuk semua route `/admin/*`: memastikan bearer JWT valid
 * dan session masih aktif, lalu mengisi `admin` di konteks.
 */
export const adminAuth = createMiddleware<Env>(async (c, next) => {
  c.set("admin", await authenticateAdmin(c.req.header("authorization")));
  await next();
});

/** Guard di dalam handler: ambil admin yang sudah diverifikasi middleware. */
export function requireAdmin(c: Context<Env>): Admin {
  const admin = c.get("admin");
  if (!admin) throw new UnauthorizedError();
  return admin;
}