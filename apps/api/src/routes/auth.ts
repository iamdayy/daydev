import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db/client";
import { adminUsers, sessions } from "../db/schema";
import { adminAuth, requireAdmin, signAuthToken, verifyPassword } from "../lib/auth";
import { env } from "../lib/env";
import { HttpError } from "../lib/http-error";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit";
import type { App } from "../lib/types";
import { errorResponses, jsonResponse, responses } from "../lib/zhelpers";

const loginBody = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
});

const loginOk = z.object({
  token: z.string(),
  expiresAt: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  }),
});

// Jendela & batas untuk mencegah brute force login.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

const INVALID_CREDENTIALS = "Email atau password salah.";

export const authRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "post",
      path: "/auth/login",
      tags: ["auth"],
      request: {
        body: {
          content: { "application/json": { schema: loginBody } },
        },
      },
      responses: {
        200: jsonResponse(loginOk, "Token + sesi admin."),
        401: errorResponses[401],
        429: errorResponses[429],
      },
    }),
    async (c) => {
      const login = c.req.valid("json");
      const ip =
        c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
        c.req.header("x-real-ip") ??
        "unknown";
      checkRateLimit(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);

      const email = login.email.toLowerCase().trim();
      const user = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.email, email),
      });

      if (!user) {
        // jalankan verifikasi terhadap hash dummy supaya timing tidak bocorkan
        // apakah email terdaftar.
        await verifyDummyPassword(login.password);
        throw new HttpError(401, INVALID_CREDENTIALS);
      }

      const valid = await verifyPassword(login.password, user.passwordHash);
      if (!valid) {
        throw new HttpError(401, INVALID_CREDENTIALS);
      }

      const token =
        randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
      const expiresAt = new Date(Date.now() + env.sessionTtlMs);
      const session = await db
        .insert(sessions)
        .values({
          adminUserId: user.id,
          tokenHash: Bun.CryptoHasher.hash("sha256", token, "hex"),
          expiresAt,
        })
        .returning();

      const jwtToken = await signAuthToken({
        sub: user.id,
        email: user.email,
        sid: session[0].id,
      });

      await db
        .update(adminUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminUsers.id, user.id));

      resetRateLimit(`login:${ip}`);

      return c.json(
        {
          token: jwtToken,
          expiresAt: expiresAt.toISOString(),
          user: { id: user.id, email: user.email, name: user.name },
        },
        200,
      );
    },
  );

  app.use("/auth/me", adminAuth);
  app.use("/auth/logout", adminAuth);

  app.openapi(
    createRoute({
      method: "get",
      path: "/auth/me",
      tags: ["auth"],
      responses: responses(
        z.object({
          user: z.object({
            id: z.string(),
            email: z.string(),
            sid: z.string(),
          }),
        }),
        "Data admin yang sedang login.",
      ),
    }),
    async (c) => c.json({ user: requireAdmin(c) }, 200),
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/auth/logout",
      tags: ["auth"],
      responses: responses(z.object({ ok: z.boolean() }), "Sesi ditutup."),
    }),
    async (c) => {
      const admin = requireAdmin(c);
      await db.delete(sessions).where(eq(sessions.id, admin.sid)).execute();
      return c.json({ ok: true }, 200);
    },
  );
};

// bcrypt hash dari string dummy; hanya untuk equalize timing saat email
// tidak terdaftar. Tidak dipakai sebagai kredensial.
const DUMMY_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

async function verifyDummyPassword(_plain: string): Promise<void> {
  await verifyPassword(_plain, DUMMY_HASH);
}