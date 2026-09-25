import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db/client";
import { adminUsers, sessions } from "../db/schema";
import { adminGuard, verifyPassword } from "../lib/auth";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit";
import { env } from "../lib/env";
import { HttpError } from "../lib/http-error";

const loginBody = t.Object({
  email: t.String({ format: "email", maxLength: 200 }),
  password: t.String({ minLength: 6, maxLength: 200 }),
});

// Jendela & batas untuk mencegah brute force login.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

const INVALID_CREDENTIALS = "Email atau password salah.";

export const authRoutes = new Elysia({ prefix: "/auth", tags: ["auth"] })
  .use(jwt({ name: "jwt", secret: env.jwtSecret, exp: "7d" }))
  .post(
    "/login",
    async ({ body, headers, jwt: signer }) => {
      const ip =
        headers["x-forwarded-for"]?.split(",")[0]?.trim() ??
        headers["x-real-ip"] ??
        "unknown";
      checkRateLimit(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);

      const email = body.email.toLowerCase().trim();
      const user = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.email, email),
      });

      if (!user) {
        // jalankan verifikasi terhadap hash dummy supaya timing tidak bocorkan
        // apakah email terdaftar.
        await verifyDummyPassword(body.password);
        throw new HttpError(401, INVALID_CREDENTIALS);
      }

      const valid = await verifyPassword(body.password, user.passwordHash);
      if (!valid) {
        throw new HttpError(401, INVALID_CREDENTIALS);
      }

      const token = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
      const expiresAt = new Date(Date.now() + env.sessionTtlMs);
      const session = await db
        .insert(sessions)
        .values({
          adminUserId: user.id,
          tokenHash: Bun.CryptoHasher.hash("sha256", token, "hex"),
          expiresAt,
        })
        .returning();

      const jwtToken = await signer.sign({
        sub: user.id,
        email: user.email,
        sid: session[0].id,
      });

      await db
        .update(adminUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminUsers.id, user.id));

      resetRateLimit(`login:${ip}`);

      return {
        token: jwtToken,
        expiresAt: expiresAt.toISOString(),
        user: { id: user.id, email: user.email, name: user.name },
      };
    },
    { body: loginBody },
  )
  .use(adminGuard)
  .get("/me", ({ admin }) => ({ user: admin }))
  .post("/logout", async ({ admin }) => {
    if (!admin) throw new HttpError(401, "Unauthorized");
    await db.delete(sessions).where(eq(sessions.id, admin.sid)).execute();
    return { ok: true };
  });

export const loginBodySchema = loginBody;

// bcrypt hash dari string dummy; hanya untuk equalize timing saat email
// tidak terdaftar. Tidak dipakai sebagai kredensial.
const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

async function verifyDummyPassword(_plain: string): Promise<void> {
  await verifyPassword(_plain, DUMMY_HASH);
}