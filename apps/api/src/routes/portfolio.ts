import {
  type PortfolioItem
} from "@daydev/shared-types";
import { and, asc, desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { portfolioItems } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { HttpError } from "../lib/http-error";

const portfolioBody = t.Object({
  title: t.String({ minLength: 3, maxLength: 200 }),
  category: t.Union([
    t.Literal("web"),
    t.Literal("mobile"),
    t.Literal("bot-telegram"),
    t.Literal("undangan-digital"),
  ]),
  segment: t.Optional(
    t.Nullable(t.Union([t.Literal("startup"), t.Literal("umkm"), t.Literal("mahasiswa")])),
  ),
  description: t.String({ minLength: 10, maxLength: 2000 }),
  resultHighlight: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
  coverImageUrl: t.Optional(t.String({ maxLength: 1000 })),
  galleryImageUrls: t.Optional(
    t.Nullable(t.Array(t.String({ maxLength: 1000 }))),
  ),
  demoUrl: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
  techStack: t.Optional(t.Nullable(t.Array(t.String({ maxLength: 100 })))),
  clientName: t.Optional(t.Nullable(t.String({ maxLength: 200 }))),
  displayOrder: t.Optional(t.Integer({ default: 0 })),
  isPublished: t.Optional(t.Boolean({ default: false })),
});

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof portfolioItems.$inferSelect) : PortfolioItem {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as PortfolioItem;
}

export const portfolioRoutes = new Elysia({ tags: ["portfolio"] })
  .get("/portfolio", async ({ query }) => {
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
    return { portfolio: rows.map(serialize) };
  }, {
    query: t.Object({
      category: t.Optional(t.String({ maxLength: 40 })),
      segment: t.Optional(t.String({ maxLength: 40 })),
    }),
  })
  .use(adminGuard)
  .get("/admin/portfolio", async () => {
    const rows = await db
      .select()
      .from(portfolioItems)
      .orderBy(asc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
    return { portfolio: rows.map(serialize) };
  })
  .post("/admin/portfolio", async ({ body }) => {
    const row = await db
      .insert(portfolioItems)
      .values({
        title: body.title,
        category: body.category,
        segment: body.segment ?? null,
        description: body.description,
        resultHighlight: body.resultHighlight ?? null,
        coverImageUrl: body.coverImageUrl ?? "",
        galleryImageUrls: body.galleryImageUrls ?? [],
        demoUrl: body.demoUrl ?? null,
        techStack: body.techStack ?? [],
        clientName: body.clientName ?? null,
        displayOrder: body.displayOrder ?? 0,
        isPublished: body.isPublished ?? false,
      })
      .returning();
    return { item: serialize(row[0]) };
  }, { body: portfolioBody })
  .put(
    "/admin/portfolio/:id",
    async ({ params, body }) => {
      const existing = await db.query.portfolioItems.findFirst({
        where: eq(portfolioItems.id, params.id),
      });
      if (!existing) throw new HttpError(404, "Item portfolio tidak ditemukan.");
      const row = await db
        .update(portfolioItems)
        .set({
          title: body.title,
          category: body.category,
          segment: body.segment ?? null,
          description: body.description,
          resultHighlight: body.resultHighlight ?? null,
          coverImageUrl: body.coverImageUrl ?? "",
          galleryImageUrls: body.galleryImageUrls ?? existing.galleryImageUrls ?? [],
          demoUrl: body.demoUrl ?? null,
          techStack: body.techStack ?? existing.techStack ?? [],
          clientName: body.clientName ?? null,
          displayOrder: body.displayOrder ?? existing.displayOrder,
          isPublished: body.isPublished ?? existing.isPublished,
        })
        .where(eq(portfolioItems.id, params.id))
        .returning();
      return { item: serialize(row[0]) };
    },
    {
      params: t.Object({ id: t.String() }),
      body: portfolioBody,
    },
  )
  .delete(
    "/admin/portfolio/:id",
    async ({ params }) => {
      const row = await db
        .delete(portfolioItems)
        .where(eq(portfolioItems.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Item portfolio tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  );