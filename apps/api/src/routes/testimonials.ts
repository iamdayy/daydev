import type { Testimonial } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { testimonials } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { HttpError } from "../lib/http-error";

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof testimonials.$inferSelect) : Testimonial {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as Testimonial;
}


const testimonialBody = t.Object({
  clientName: t.String({ minLength: 2, maxLength: 120 }),
  clientRole: t.Optional(t.Nullable(t.String({ maxLength: 200 }))),
  segment: t.Optional(
    t.Nullable(
      t.Union([
        t.Literal("startup"),
        t.Literal("umkm"),
        t.Literal("mahasiswa"),
        t.Literal("undangan-digital"),
        t.Literal("bot-telegram"),
      ]),
    ),
  ),
  quote: t.String({ minLength: 10, maxLength: 2000 }),
  rating: t.Optional(t.Integer({ minimum: 1, maximum: 5, default: 5 })),
  avatarUrl: t.Optional(t.Nullable(t.String({ maxLength: 1000 }))),
  displayOrder: t.Optional(t.Integer({ default: 0 })),
  isPublished: t.Optional(t.Boolean({ default: false })),
});

export const testimonialRoutes = new Elysia({ tags: ["testimonials"] })
  .get("/testimonials", async () => {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.displayOrder));
    return { testimonials: rows.map(serialize) };
  })
  .use(adminGuard)
  .get("/admin/testimonials", async () => {
    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.displayOrder));
    return { testimonials: rows.map(serialize) };
  })
  .post("/admin/testimonials", async ({ body }) => {
    const row = await db
      .insert(testimonials)
      .values({
        clientName: body.clientName,
        clientRole: body.clientRole ?? null,
        segment: body.segment ?? null,
        quote: body.quote,
        rating: body.rating ?? 5,
        avatarUrl: body.avatarUrl ?? null,
        displayOrder: body.displayOrder ?? 0,
        isPublished: body.isPublished ?? false,
      })
      .returning();
    return { testimonial: row[0] };
  }, { body: testimonialBody })
  .put(
    "/admin/testimonials/:id",
    async ({ params, body }) => {
      const existing = await db.query.testimonials.findFirst({
        where: eq(testimonials.id, params.id),
      });
      if (!existing) throw new HttpError(404, "Testimoni tidak ditemukan.");
      const row = await db
        .update(testimonials)
        .set({
          clientName: body.clientName,
          clientRole: body.clientRole ?? null,
          segment: body.segment ?? null,
          quote: body.quote,
          rating: body.rating ?? existing.rating,
          avatarUrl: body.avatarUrl ?? null,
          displayOrder: body.displayOrder ?? existing.displayOrder,
          isPublished: body.isPublished ?? existing.isPublished,
        })
        .where(eq(testimonials.id, params.id))
        .returning();
      return { testimonial: row[0] };
    },
    {
      params: t.Object({ id: t.String() }),
      body: testimonialBody,
    },
  )
  .delete(
    "/admin/testimonials/:id",
    async ({ params }) => {
      const row = await db
        .delete(testimonials)
        .where(eq(testimonials.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Testimoni tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  );