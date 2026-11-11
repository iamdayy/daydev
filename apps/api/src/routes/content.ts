import { createRoute, z } from "@hono/zod-openapi";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { guestbookEntries, siteContent } from "../db/schema";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

const raw = z.record(z.string(), z.unknown());
const idParam = z.object({ id: z.string().uuid() });
const contentBody = z.object({
  kind: z.string().min(1).max(40), key: z.string().min(1).max(120),
  title: z.string().min(1).max(160), value: z.string().max(4000),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  displayOrder: z.number().int().min(0).optional(), isPublished: z.boolean().optional(),
});
const guestbookBody = z.object({
  name: z.string().min(2).max(120), role: z.string().max(160).nullable().optional(),
  message: z.string().min(10).max(2000), rating: z.number().int().min(1).max(5),
});

const serializeContent = (row: typeof siteContent.$inferSelect) => ({
  id: row.id,
  kind: row.kind,
  key: row.key,
  title: row.title,
  value: row.value,
  metadata: row.metadata,
  display_order: row.displayOrder,
  is_published: row.isPublished,
  updated_at: row.updatedAt.toISOString(),
});

const serializeGuestbook = (row: typeof guestbookEntries.$inferSelect) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  message: row.message,
  rating: row.rating,
  submitted_at: row.submittedAt.toISOString(),
  is_published: row.isPublished,
});

export const contentRoutes = (app: App): void => {
  app.openapi(createRoute({
    method: "get", path: "/content/{kind}", tags: ["content"],
    request: { params: z.object({ kind: z.string().min(1).max(40) }) },
    responses: responses(z.object({ content: z.array(raw) }), "Konten faktual publik."),
  }), async (c) => {
    const { kind } = c.req.valid("param");
    const rows = await db.select().from(siteContent)
      .where(and(kind === "all" ? eq(siteContent.isPublished, true) : eq(siteContent.kind, kind), eq(siteContent.isPublished, true)))
      .orderBy(asc(siteContent.displayOrder), asc(siteContent.title));
    return c.json({ content: rows.map(serializeContent) }, 200);
  });
  app.openapi(createRoute({
    method: "get", path: "/admin/content", tags: ["content"],
    responses: responses(z.object({ content: z.array(raw) }), "Semua konten faktual."),
  }), async (c) => {
    const rows = await db.select().from(siteContent).orderBy(asc(siteContent.kind), asc(siteContent.displayOrder));
    return c.json({ content: rows.map(serializeContent) }, 200);
  });
  app.openapi(createRoute({
    method: "post", path: "/admin/content", tags: ["content"],
    request: { body: { content: { "application/json": { schema: contentBody } } } },
    responses: responses(z.object({ content: raw }), "Konten dibuat."),
  }), async (c) => {
    const [row] = await db.insert(siteContent).values(c.req.valid("json")).returning();
    return c.json({ content: serializeContent(row) }, 200);
  });
  app.openapi(createRoute({
    method: "put", path: "/admin/content/{id}", tags: ["content"],
    request: { params: idParam, body: { content: { "application/json": { schema: contentBody.partial() } } } },
    responses: responses(z.object({ content: raw }), "Konten diperbarui."),
  }), async (c) => {
    const [row] = await db.update(siteContent).set({ ...c.req.valid("json"), updatedAt: new Date() }).where(eq(siteContent.id, c.req.valid("param").id)).returning();
    if (!row) return c.json({ error: "Konten tidak ditemukan." }, 404);
    return c.json({ content: serializeContent(row) }, 200);
  });
  app.openapi(createRoute({
    method: "delete", path: "/admin/content/{id}", tags: ["content"],
    request: { params: idParam },
    responses: responses(z.object({ deleted: z.boolean() }), "Konten dihapus."),
  }), async (c) => {
    const result = await db.delete(siteContent).where(eq(siteContent.id, c.req.valid("param").id));
    return c.json({ deleted: result.rowCount > 0 }, 200);
  });

  app.openapi(createRoute({
    method: "get", path: "/guestbook", tags: ["guestbook"],
    responses: responses(z.object({ entries: z.array(raw) }), "Pesan buku tamu yang disetujui."),
  }), async (c) => {
    const rows = await db.select().from(guestbookEntries)
      .where(eq(guestbookEntries.isPublished, true))
      .orderBy(asc(guestbookEntries.submittedAt));
    return c.json({
      entries: rows.map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        message: row.message,
        rating: row.rating,
        submitted_at: row.submittedAt.toISOString(),
        is_published: row.isPublished,
      })),
    }, 200);
  });
  app.openapi(createRoute({
    method: "post", path: "/guestbook", tags: ["guestbook"],
    request: { body: { content: { "application/json": { schema: guestbookBody } } } },
    responses: responses(z.object({ entry: raw }), "Pesan dikirim untuk moderasi."),
  }), async (c) => {
    const [row] = await db.insert(guestbookEntries).values(c.req.valid("json")).returning();
    return c.json({ entry: serializeGuestbook(row) }, 200);
  });
  app.openapi(createRoute({
    method: "get", path: "/admin/guestbook", tags: ["guestbook"],
    responses: responses(z.object({ entries: z.array(raw) }), "Semua pesan buku tamu."),
  }), async (c) => {
    const rows = await db.select().from(guestbookEntries).orderBy(asc(guestbookEntries.submittedAt));
    return c.json({ entries: rows.map(serializeGuestbook) }, 200);
  });
  app.openapi(createRoute({
    method: "put", path: "/admin/guestbook/{id}", tags: ["guestbook"],
    request: { params: idParam, body: { content: { "application/json": { schema: guestbookBody.partial().extend({ isPublished: z.boolean().optional() }) } } } },
    responses: responses(z.object({ entry: raw }), "Pesan diperbarui."),
  }), async (c) => {
    const [row] = await db.update(guestbookEntries).set(c.req.valid("json")).where(eq(guestbookEntries.id, c.req.valid("param").id)).returning();
    if (!row) return c.json({ error: "Pesan tidak ditemukan." }, 404);
    return c.json({ entry: serializeGuestbook(row) }, 200);
  });
  app.openapi(createRoute({
    method: "delete", path: "/admin/guestbook/{id}", tags: ["guestbook"],
    request: { params: idParam },
    responses: responses(z.object({ deleted: z.boolean() }), "Pesan dihapus."),
  }), async (c) => {
    const result = await db.delete(guestbookEntries).where(eq(guestbookEntries.id, c.req.valid("param").id));
    return c.json({ deleted: result.rowCount > 0 }, 200);
  });
};
