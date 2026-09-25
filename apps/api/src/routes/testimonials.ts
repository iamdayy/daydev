import { createRoute, z } from "@hono/zod-openapi";
import type { Testimonial } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { testimonials } from "../db/schema";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof testimonials.$inferSelect): Testimonial {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as Testimonial;
}

const testimonialSegment = z.enum([
  "startup",
  "umkm",
  "mahasiswa",
  "undangan-digital",
  "bot-telegram",
]);

const testimonialBody = z.object({
  clientName: z.string().min(2).max(120),
  clientRole: z.string().max(200).nullable().optional(),
  segment: testimonialSegment.nullable().optional(),
  quote: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  avatarUrl: z.string().max(1000).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

const testimonialParams = z.object({
  id: z.string().min(1),
});

const testimonialRow = z.object({
  id: z.string(),
  client_name: z.string(),
  client_role: z.string().nullable(),
  segment: testimonialSegment.nullable(),
  quote: z.string(),
  rating: z.number(),
  avatar_url: z.string().nullable(),
  display_order: z.number(),
  is_published: z.boolean(),
});

const rawRow = z.record(z.string(), z.unknown());

export const testimonialRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/testimonials",
      tags: ["testimonials"],
      responses: responses(
        z.object({ testimonials: z.array(testimonialRow) }),
        "Testimoni yang dipublikasikan.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isPublished, true))
        .orderBy(asc(testimonials.displayOrder));
      return c.json({ testimonials: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/testimonials",
      tags: ["testimonials"],
      responses: responses(
        z.object({ testimonials: z.array(testimonialRow) }),
        "Semua testimoni.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(testimonials)
        .orderBy(asc(testimonials.displayOrder));
      return c.json({ testimonials: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/testimonials",
      tags: ["testimonials"],
      request: {
        body: { content: { "application/json": { schema: testimonialBody } } },
      },
      responses: responses(
        z.object({ testimonial: rawRow }),
        "Testimoni yang dibuat.",
      ),
    }),
    async (c) => {
      const testimonial = c.req.valid("json");
      if (!testimonial.clientName || !testimonial.quote) {
        throw new HttpError(422, "Nama klien dan kutipan testimoni harus diisi.");
      }
      const row = await db
        .insert(testimonials)
        .values({
          clientName: testimonial.clientName,
          clientRole: testimonial.clientRole ?? null,
          segment: testimonial.segment ?? null,
          quote: testimonial.quote,
          rating: testimonial.rating ?? 5,
          avatarUrl: testimonial.avatarUrl ?? null,
          displayOrder: testimonial.displayOrder ?? 0,
          isPublished: testimonial.isPublished ?? false,
        })
        .returning();
      return c.json({ testimonial: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/testimonials/{id}",
      tags: ["testimonials"],
      request: {
        params: testimonialParams,
        body: { content: { "application/json": { schema: testimonialBody } } },
      },
      responses: responses(
        z.object({ testimonial: rawRow }),
        "Testimoni yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const testimonial = c.req.valid("json");
      if (!testimonial.clientName || !testimonial.quote) {
        throw new HttpError(422, "Nama klien dan kutipan testimoni harus diisi.");
      }
      const existing = await db.query.testimonials.findFirst({
        where: eq(testimonials.id, id),
      });
      if (!existing) throw new HttpError(404, "Testimoni tidak ditemukan.");
      const row = await db
        .update(testimonials)
        .set({
          clientName: testimonial.clientName,
          clientRole: testimonial.clientRole ?? null,
          segment: testimonial.segment ?? null,
          quote: testimonial.quote,
          rating: testimonial.rating ?? existing.rating,
          avatarUrl: testimonial.avatarUrl ?? null,
          displayOrder: testimonial.displayOrder ?? existing.displayOrder,
          isPublished: testimonial.isPublished ?? existing.isPublished,
        })
        .where(eq(testimonials.id, id))
        .returning();
      return c.json({ testimonial: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/testimonials/{id}",
      tags: ["testimonials"],
      request: { params: testimonialParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(testimonials)
        .where(eq(testimonials.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Testimoni tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );
};