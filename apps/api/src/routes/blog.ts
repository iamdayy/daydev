import type { BlogPost } from "@daydev/shared-types";
import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { blogPosts } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { isValidSlug, slugify } from "../lib/format";
import { HttpError } from "../lib/http-error";

const blogBody = t.Object({
  title: t.String({ minLength: 3, maxLength: 200 }),
  excerpt: t.String({ minLength: 10, maxLength: 500 }),
  content: t.String({ minLength: 20 }),
  slug: t.Optional(t.String({ maxLength: 200 })),
  coverImageUrl: t.Optional(t.Nullable(t.String({ maxLength: 1000 }))),
  author: t.Optional(t.String({ minLength: 1, maxLength: 120 })),
  readingMinutes: t.Optional(t.Integer({ minimum: 1, maximum: 120 })),
  publishedAt: t.Optional(t.String({ format: "date-time" })),
  isPublished: t.Optional(t.Boolean({ default: false })),
});

function resolveSlug(slug: string | undefined, title: string): string {
  const candidate = (slug ?? "").trim() || slugify(title);
  if (!isValidSlug(candidate)) {
    throw new HttpError(
      422,
      "Slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (contoh: panduan-seo-umkm).",
    );
  }
  return candidate;
}

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof blogPosts.$inferSelect) : BlogPost {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as BlogPost;
}

export const blogRoutes = new Elysia({ tags: ["blog"] })
  .get("/blog", async () => {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
    return { posts: rows.map(serialize) };
  })
  .get("/blog/:slug", async ({ params }) => {
    const row = await db.query.blogPosts.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.isPublished, true), eq(t.slug, params.slug)),
    });
    if (!row) throw new HttpError(404, "Artikel tidak ditemukan.");

    return { post: row };
  }, {
    params: t.Object({ slug: t.String() }),
  })
  .use(adminGuard)
  .get("/admin/blog", async () => {
    const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
    return { posts: rows.map(serialize) };
  })
  .post("/admin/blog", async ({ body }) => {
    const slug = resolveSlug(body.slug, body.title);
    const exists = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });
    if (exists) throw new HttpError(409, `Slug "${slug}" sudah dipakai.`);
    const row = await db
      .insert(blogPosts)
      .values({
        slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImageUrl: body.coverImageUrl ?? null,
        author: body.author ?? "Tim Daydev",
        readingMinutes: body.readingMinutes ?? 5,
        publishedAt: body.publishedAt
          ? new Date(body.publishedAt)
          : new Date(),
        isPublished: body.isPublished ?? false,
      })
      .returning();
    return { post: row[0] };
  }, { body: blogBody })
  .put(
    "/admin/blog/:id",
    async ({ params, body }) => {
      const existing = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, params.id),
      });
      if (!existing) throw new HttpError(404, "Artikel tidak ditemukan.");
      const slug = resolveSlug(body.slug ?? existing.slug, body.title);
      const conflict = await db.query.blogPosts.findFirst({
        where: (t, { and, ne }) =>
          and(ne(t.id, params.id), eq(t.slug, slug)),
      });
      if (conflict) throw new HttpError(409, `Slug "${slug}" sudah dipakai.`);
      const row = await db
        .update(blogPosts)
        .set({
          slug,
          title: body.title,
          excerpt: body.excerpt,
          content: body.content,
          coverImageUrl: body.coverImageUrl ?? existing.coverImageUrl,
          author: body.author ?? existing.author,
          readingMinutes: body.readingMinutes ?? existing.readingMinutes,
          publishedAt: body.publishedAt
            ? new Date(body.publishedAt)
            : existing.publishedAt,
          isPublished: body.isPublished ?? existing.isPublished,
        })
        .where(eq(blogPosts.id, params.id))
        .returning();
      return { post: row[0] };
    },
    {
      params: t.Object({ id: t.String() }),
      body: blogBody,
    },
  )
  .delete(
    "/admin/blog/:id",
    async ({ params }) => {
      const row = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Artikel tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  );