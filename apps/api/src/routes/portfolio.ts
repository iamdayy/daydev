import { createRoute, z } from "@hono/zod-openapi";
import type { PortfolioItem } from "@daydev/shared-types";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { portfolioItems } from "../db/schema";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

const portfolioCategory = z.enum([
  "web",
  "mobile",
  "bot-telegram",
  "undangan-digital",
]);
const portfolioSegment = z.enum(["startup", "umkm", "mahasiswa"]);

const portfolioBody = z.object({
  title: z.string().min(3).max(200),
  category: portfolioCategory,
  segment: portfolioSegment.nullable().optional(),
  description: z.string().min(10).max(2000),
  resultHighlight: z.string().max(500).nullable().optional(),
  coverImageUrl: z.string().max(1000).optional(),
  galleryImageUrls: z.array(z.string().max(1000)).nullable().optional(),
  demoUrl: z.string().max(500).nullable().optional(),
  techStack: z.array(z.string().max(100)).nullable().optional(),
  clientName: z.string().max(200).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

const portfolioQuery = z.object({
  category: z.string().max(40).optional(),
  segment: z.string().max(40).optional(),
});

const portfolioParams = z.object({
  id: z.string().min(1),
});

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof portfolioItems.$inferSelect): PortfolioItem {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as PortfolioItem;
}

const portfolioRow = z.object({
  id: z.string(),
  title: z.string(),
  category: portfolioCategory,
  segment: portfolioSegment.nullable(),
  description: z.string(),
  result_highlight: z.string().nullable(),
  cover_image_url: z.string(),
  gallery_image_urls: z.array(z.string()).nullable(),
  demo_url: z.string().nullable(),
  tech_stack: z.array(z.string()).nullable(),
  client_name: z.string().nullable(),
  display_order: z.number(),
  is_published: z.boolean(),
  created_at: z.string(),
});

export const portfolioRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/portfolio",
      tags: ["portfolio"],
      request: { query: portfolioQuery },
      responses: responses(
        z.object({ portfolio: z.array(portfolioRow) }),
        "Portfolio yang dipublikasikan.",
      ),
    }),
    async (c) => {
      const query = c.req.valid("query");
      const conditions = [eq(portfolioItems.isPublished, true)];
      if (query.category) {
        conditions.push(eq(portfolioItems.category, query.category));
      }
      if (query.segment) {
        conditions.push(eq(portfolioItems.segment, query.segment));
      }
      const rows = await db
        .select()
        .from(portfolioItems)
        .where(and(...conditions))
        .orderBy(asc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
      return c.json({ portfolio: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/portfolio",
      tags: ["portfolio"],
      responses: responses(
        z.object({ portfolio: z.array(portfolioRow) }),
        "Semua portfolio.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(portfolioItems)
        .orderBy(asc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
      return c.json({ portfolio: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/portfolio",
      tags: ["portfolio"],
      request: {
        body: { content: { "application/json": { schema: portfolioBody } } },
      },
      responses: responses(
        z.object({ item: portfolioRow }),
        "Portfolio yang dibuat.",
      ),
    }),
    async (c) => {
      const portfolio = c.req.valid("json");
      if (!portfolio.title || !portfolio.category || !portfolio.description) {
        throw new HttpError(422, "title, category, dan description wajib diisi.");
      }
      const row = await db
        .insert(portfolioItems)
        .values({
          title: portfolio.title,
          category: portfolio.category,
          segment: portfolio.segment ?? null,
          description: portfolio.description,
          resultHighlight: portfolio.resultHighlight ?? null,
          coverImageUrl: portfolio.coverImageUrl ?? "",
          galleryImageUrls: portfolio.galleryImageUrls ?? [],
          demoUrl: portfolio.demoUrl ?? null,
          techStack: portfolio.techStack ?? [],
          clientName: portfolio.clientName ?? null,
          displayOrder: portfolio.displayOrder ?? 0,
          isPublished: portfolio.isPublished ?? false,
        })
        .returning();
      return c.json({ item: serialize(row[0]) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/portfolio/{id}",
      tags: ["portfolio"],
      request: {
        params: portfolioParams,
        body: { content: { "application/json": { schema: portfolioBody } } },
      },
      responses: responses(
        z.object({ item: portfolioRow }),
        "Portfolio yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const portfolio = c.req.valid("json");
      if (!portfolio.title || !portfolio.category || !portfolio.description) {
        throw new HttpError(422, "title, category, dan description wajib diisi.");
      }
      const existing = await db.query.portfolioItems.findFirst({
        where: eq(portfolioItems.id, id),
      });
      if (!existing) throw new HttpError(404, "Item portfolio tidak ditemukan.");
      const row = await db
        .update(portfolioItems)
        .set({
          title: portfolio.title,
          category: portfolio.category,
          segment: portfolio.segment ?? null,
          description: portfolio.description,
          resultHighlight: portfolio.resultHighlight ?? null,
          coverImageUrl: portfolio.coverImageUrl ?? "",
          galleryImageUrls:
            portfolio.galleryImageUrls ?? existing.galleryImageUrls ?? [],
          demoUrl: portfolio.demoUrl ?? null,
          techStack: portfolio.techStack ?? existing.techStack ?? [],
          clientName: portfolio.clientName ?? null,
          displayOrder: portfolio.displayOrder ?? existing.displayOrder,
          isPublished: portfolio.isPublished ?? existing.isPublished,
        })
        .where(eq(portfolioItems.id, id))
        .returning();
      return c.json({ item: serialize(row[0]) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/portfolio/{id}",
      tags: ["portfolio"],
      request: { params: portfolioParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(portfolioItems)
        .where(eq(portfolioItems.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Item portfolio tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );
};