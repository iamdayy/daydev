import { createRoute, z } from "@hono/zod-openapi";
import type { BlogPost } from "@daydev/shared-types";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { blogPosts } from "../db/schema";
import { isValidSlug, slugify } from "../lib/format";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

const blogBody = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  slug: z.string().max(200).optional(),
  coverImageUrl: z.string().max(1000).nullable().optional(),
  author: z.string().min(1).max(120).optional(),
  readingMinutes: z.number().int().min(1).max(120).optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  isPublished: z.boolean().optional(),
});

const slugParams = z.object({
  slug: z.string().min(1),
});

const idParams = z.object({
  id: z.string().min(1),
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
function serialize(row: typeof blogPosts.$inferSelect): BlogPost {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as BlogPost;
}

const blogRow = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  cover_image_url: z.string().nullable(),
  author: z.string(),
  reading_minutes: z.number(),
  published_at: z.string(),
  is_published: z.boolean(),
});

const rawPost = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImageUrl: z.string().nullable(),
  author: z.string(),
  readingMinutes: z.number(),
  publishedAt: z.unknown(),
  isPublished: z.boolean(),
});

export const blogRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/blog",
      tags: ["blog"],
      responses: responses(
        z.object({ posts: z.array(blogRow) }),
        "Artikel yang dipublikasikan, terbaru dulu.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.publishedAt));
      return c.json({ posts: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/blog/{slug}",
      tags: ["blog"],
      request: { params: slugParams },
      responses: responses(
        z.object({ post: rawPost }),
        "Artikel berdasarkan slug.",
      ),
    }),
    async (c) => {
      const { slug } = c.req.valid("param");
      const row = await db.query.blogPosts.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.isPublished, true), eq(t.slug, slug)),
      });
      if (!row) throw new HttpError(404, "Artikel tidak ditemukan.");
      return c.json({ post: row }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/blog",
      tags: ["blog"],
      responses: responses(
        z.object({ posts: z.array(blogRow) }),
        "Semua artikel.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt));
      return c.json({ posts: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/blog",
      tags: ["blog"],
      request: {
        body: { content: { "application/json": { schema: blogBody } } },
      },
      responses: responses(
        z.object({ post: rawPost }),
        "Artikel yang dibuat.",
      ),
    }),
    async (c) => {
      const blog = c.req.valid("json");
      if (!blog.title || !blog.excerpt || !blog.content) {
        throw new HttpError(422, "title, excerpt, dan content wajib diisi.");
      }
      const slug = resolveSlug(blog.slug, blog.title);
      const exists = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
      });
      if (exists) throw new HttpError(409, `Slug "${slug}" sudah dipakai.`);
      const row = await db
        .insert(blogPosts)
        .values({
          slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImageUrl: blog.coverImageUrl ?? null,
          author: blog.author ?? "Tim Daydev",
          readingMinutes: blog.readingMinutes ?? 5,
          publishedAt: blog.publishedAt
            ? new Date(blog.publishedAt)
            : new Date(),
          isPublished: blog.isPublished ?? false,
        })
        .returning();
      return c.json({ post: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/blog/{id}",
      tags: ["blog"],
      request: {
        params: idParams,
        body: { content: { "application/json": { schema: blogBody } } },
      },
      responses: responses(
        z.object({ post: rawPost }),
        "Artikel yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const blog = c.req.valid("json");
      if (!blog.title || !blog.excerpt || !blog.content) {
        throw new HttpError(422, "title, excerpt, dan content wajib diisi.");
      }
      const existing = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, id),
      });
      if (!existing) throw new HttpError(404, "Artikel tidak ditemukan.");
      const slug = resolveSlug(blog.slug ?? existing.slug, blog.title);
      const conflict = await db.query.blogPosts.findFirst({
        where: (t, { and, ne }) =>
          and(ne(t.id, id), eq(t.slug, slug)),
      });
      if (conflict) throw new HttpError(409, `Slug "${slug}" sudah dipakai.`);
      const row = await db
        .update(blogPosts)
        .set({
          slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImageUrl: blog.coverImageUrl ?? existing.coverImageUrl,
          author: blog.author ?? existing.author,
          readingMinutes: blog.readingMinutes ?? existing.readingMinutes,
          publishedAt: blog.publishedAt
            ? new Date(blog.publishedAt)
            : existing.publishedAt,
          isPublished: blog.isPublished ?? existing.isPublished,
        })
        .where(eq(blogPosts.id, id))
        .returning();
      return c.json({ post: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/blog/{id}",
      tags: ["blog"],
      request: { params: idParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Artikel tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );
};