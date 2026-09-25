import { createRoute, z } from "@hono/zod-openapi";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { siteStats } from "../db/schema";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

const statsBody = z.object({
  value: z.string().min(1).max(80),
});

const statsKey = z.object({
  key: z.string().min(1).max(80),
});

const publicStat = z.object({
  key: z.string(),
  value: z.string(),
  updated_at: z.string(),
});

// Row mentah dari database (camelCase), dipakai endpoint admin.
const rawRow = z.record(z.string(), z.unknown());

export const statsRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/stats",
      tags: ["stats"],
      responses: responses(
        z.object({ stats: z.array(publicStat) }),
        "Daftar statistik situs.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select({
          key: siteStats.key,
          value: siteStats.value,
          updated_at: siteStats.updatedAt,
        })
        .from(siteStats)
        .orderBy(asc(siteStats.key));
      return c.json({ stats: rows }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/stats",
      tags: ["stats"],
      responses: responses(
        z.object({ stats: z.array(rawRow) }),
        "Daftar semua statistik.",
      ),
    }),
    async (c) => {
      const rows = await db.select().from(siteStats).orderBy(asc(siteStats.key));
      return c.json({ stats: rows }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/stats/{key}",
      tags: ["stats"],
      request: {
        params: statsKey,
        body: { content: { "application/json": { schema: statsBody } } },
      },
      responses: responses(
        z.object({ stat: rawRow.nullable() }),
        "Statistik yang disimpan.",
      ),
    }),
    async (c) => {
      const { key } = c.req.valid("param");
      const stats = c.req.valid("json");
      const value = String(stats.value ?? "").trim();
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
      return c.json({ stat: row ?? null }, 200);
    },
  );
};