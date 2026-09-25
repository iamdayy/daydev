import { Elysia, t } from "elysia";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { siteStats } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { HttpError } from "../lib/http-error";

export const statsRoutes = new Elysia({ tags: ["stats"] })
  .get("/stats", async () => {
    const rows = await db
      .select({
        key: siteStats.key,
        value: siteStats.value,
        updated_at: siteStats.updatedAt,
      })
      .from(siteStats)
      .orderBy(asc(siteStats.key));
    return { stats: rows };
  })
  .use(adminGuard)
  .get("/admin/stats", async () => {
    const rows = await db.select().from(siteStats).orderBy(asc(siteStats.key));
    return { stats: rows };
  })
  .put(
    "/admin/stats/:key",
    async ({ params, body }) => {
      const value = String(body.value ?? "").trim();
      const key = params.key.trim();
      if (!key || !value) throw new HttpError(422, "key dan value wajib diisi.");
      await db
        .insert(siteStats)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteStats.key,
          set: { value, updatedAt: new Date() },
        });
      const row = await db.query.siteStats.findFirst({
        where: eq(siteStats.key, key),
      });
      return { stat: row };
    },
    {
      params: t.Object({ key: t.String({ minLength: 1, maxLength: 80 }) }),
      body: t.Object({
        value: t.String({ minLength: 1, maxLength: 80 }),
      }),
    },
  );