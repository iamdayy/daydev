import { createRoute, z } from "@hono/zod-openapi";
import type { PricingCategory, PricingPackage } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { pricingCategories, pricingPackages } from "../db/schema";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

function sortPackages<T extends typeof pricingPackages.$inferSelect>(
  pkgs: T[],
) {
  return [...pkgs].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "id"),
  );
}

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(
  row: typeof pricingPackages.$inferSelect,
): PricingPackage | PricingCategory {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as PricingPackage | PricingCategory;
}

const pricingSegment = z.enum([
  "undangan-digital",
  "bot-telegram",
  "mahasiswa",
  "umkm",
  "startup",
]);

const pricingCategoryBody = z.object({
  segment: pricingSegment,
  label: z.string().min(3).max(80),
  startingPriceLabel: z.string().min(3).max(120),
  displayOrder: z.number().int().optional(),
});

const pricingCategoryLabelBody = z.object({
  label: z.string().min(3).max(80),
  startingPriceLabel: z.string().min(3).max(120),
  displayOrder: z.number().int().optional(),
});

const pricingPackageBody = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(120),
  price: z.number().int().min(0).max(1_000_000_000),
  features: z.array(z.string().max(200)).optional(),
  isRecommended: z.boolean().optional(),
  demoUrl: z.string().max(500).nullable().optional(),
  displayOrder: z.number().int().optional(),
});

const idParams = z.object({
  id: z.string().min(1),
});

const packageRow = z.object({
  id: z.string(),
  category_id: z.string(),
  name: z.string(),
  price: z.number(),
  features: z.array(z.string()).nullable(),
  is_recommended: z.boolean(),
  demo_url: z.string().nullable(),
  display_order: z.number(),
});

const categoryRow = z.object({
  id: z.string(),
  segment: pricingSegment,
  label: z.string(),
  startingPriceLabel: z.string(),
  displayOrder: z.number(),
  packages: z.array(packageRow),
});

const rawRow = z.record(z.string(), z.unknown());

export const pricingRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/pricing",
      tags: ["pricing"],
      responses: responses(
        z.object({ categories: z.array(categoryRow) }),
        "Kategori harga beserta paketnya.",
      ),
    }),
    async (c) => {
      const categories = await db
        .select()
        .from(pricingCategories)
        .orderBy(asc(pricingCategories.displayOrder));
      const packages = await db.select().from(pricingPackages);
      const result = categories.map((category) => ({
        ...category,
        packages: sortPackages(
          packages.filter((p) => p.categoryId === category.id),
        ).map(serialize),
      }));
      return c.json({ categories: result }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/pricing",
      tags: ["pricing"],
      responses: responses(
        z.object({ categories: z.array(categoryRow) }),
        "Semua kategori harga.",
      ),
    }),
    async (c) => {
      const categories = await db
        .select()
        .from(pricingCategories)
        .orderBy(asc(pricingCategories.displayOrder));
      const packages = await db.select().from(pricingPackages);
      return c.json(
        {
          categories: categories.map((category) => ({
            ...category,
            packages: sortPackages(
              packages.filter((p) => p.categoryId === category.id),
            ).map(serialize),
          })),
        },
        200,
      );
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/pricing/categories",
      tags: ["pricing"],
      request: {
        body: {
          content: { "application/json": { schema: pricingCategoryBody } },
        },
      },
      responses: responses(
        z.object({ category: rawRow }),
        "Kategori yang dibuat.",
      ),
    }),
    async (c) => {
      const category = c.req.valid("json");
      if (!category.segment || !category.label || !category.startingPriceLabel) {
        throw new HttpError(422, "segment, label, dan startingPriceLabel wajib diisi.");
      }
      const row = await db
        .insert(pricingCategories)
        .values({
          segment: category.segment,
          label: category.label,
          startingPriceLabel: category.startingPriceLabel,
          displayOrder: category.displayOrder ?? 0,
        })
        .onConflictDoNothing()
        .returning();
      if (!row.length) {
        throw new HttpError(409, `Segmen "${category.segment}" sudah ada.`);
      }
      return c.json({ category: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/pricing/categories/{id}",
      tags: ["pricing"],
      request: {
        params: idParams,
        body: {
          content: { "application/json": { schema: pricingCategoryLabelBody } },
        },
      },
      responses: responses(
        z.object({ category: rawRow }),
        "Kategori yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const category = c.req.valid("json");
      if (!category.label || !category.startingPriceLabel) {
        throw new HttpError(422, "label dan startingPriceLabel wajib diisi.");
      }
      const row = await db
        .update(pricingCategories)
        .set({
          label: category.label,
          startingPriceLabel: category.startingPriceLabel,
          displayOrder: category.displayOrder ?? 0,
        })
        .where(eq(pricingCategories.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Kategori tidak ditemukan.");
      return c.json({ category: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/pricing/categories/{id}",
      tags: ["pricing"],
      request: { params: idParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(pricingCategories)
        .where(eq(pricingCategories.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Kategori tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/pricing/packages",
      tags: ["pricing"],
      request: {
        body: {
          content: { "application/json": { schema: pricingPackageBody } },
        },
      },
      responses: responses(
        z.object({ package: rawRow }),
        "Paket yang dibuat.",
      ),
    }),
    async (c) => {
      const pkg = c.req.valid("json");
      if (!pkg.categoryId || !pkg.name || pkg.price === undefined) {
        throw new HttpError(422, "categoryId, name, dan price wajib diisi.");
      }
      const row = await db
        .insert(pricingPackages)
        .values({
          categoryId: pkg.categoryId,
          name: pkg.name,
          price: pkg.price,
          features: pkg.features ?? [],
          isRecommended: pkg.isRecommended ?? false,
          demoUrl: pkg.demoUrl ?? null,
          displayOrder: pkg.displayOrder ?? 0,
        })
        .returning();
      return c.json({ package: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/pricing/packages/{id}",
      tags: ["pricing"],
      request: {
        params: idParams,
        body: {
          content: { "application/json": { schema: pricingPackageBody } },
        },
      },
      responses: responses(
        z.object({ package: rawRow }),
        "Paket yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const pkg = c.req.valid("json");
      if (!pkg.categoryId || !pkg.name || pkg.price === undefined) {
        throw new HttpError(422, "categoryId, name, dan price wajib diisi.");
      }
      const row = await db
        .update(pricingPackages)
        .set({
          categoryId: pkg.categoryId,
          name: pkg.name,
          price: pkg.price,
          features: pkg.features ?? [],
          isRecommended: pkg.isRecommended ?? false,
          demoUrl: pkg.demoUrl ?? null,
          displayOrder: pkg.displayOrder ?? 0,
        })
        .where(eq(pricingPackages.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Paket tidak ditemukan.");
      return c.json({ package: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/pricing/packages/{id}",
      tags: ["pricing"],
      request: { params: idParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(pricingPackages)
        .where(eq(pricingPackages.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Paket tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );
};