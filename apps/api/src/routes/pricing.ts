import type { PricingCategory, PricingPackage } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { pricingCategories, pricingPackages } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { HttpError } from "../lib/http-error";

function sortPackages<T extends typeof pricingPackages.$inferSelect>(pkgs: T[]) {
  return [...pkgs].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "id"),
  );
}

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof pricingPackages.$inferSelect) : PricingPackage | PricingCategory {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as PricingPackage | PricingCategory;
}

export const pricingRoutes = new Elysia({ tags: ["pricing"] })
  .get("/pricing", async () => {
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
    return { categories: result };
  })
  .use(adminGuard)
  .get("/admin/pricing", async () => {
    const categories = await db
      .select()
      .from(pricingCategories)
      .orderBy(asc(pricingCategories.displayOrder));
    const packages = await db.select().from(pricingPackages);
    return {
      categories: categories.map((category) => ({
        ...category,
        packages: sortPackages(
          packages.filter((p) => p.categoryId === category.id),
        ).map(serialize),
      })),
    };
  })
  // ---- kategori ----
  .post(
    "/admin/pricing/categories",
    async ({ body }) => {
      const row = await db
        .insert(pricingCategories)
        .values({
          segment: body.segment,
          label: body.label,
          startingPriceLabel: body.startingPriceLabel,
          displayOrder: body.displayOrder ?? 0,
        })
        .onConflictDoNothing()
        .returning();
      if (!row.length) {
        throw new HttpError(409, `Segmen "${body.segment}" sudah ada.`);
      }
      return { category: row[0] };
    },
    {
      body: t.Object({
        segment: t.Union([
          t.Literal("undangan-digital"),
          t.Literal("bot-telegram"),
          t.Literal("mahasiswa"),
          t.Literal("umkm"),
          t.Literal("startup"),
        ]),
        label: t.String({ minLength: 3, maxLength: 80 }),
        startingPriceLabel: t.String({ minLength: 3, maxLength: 120 }),
        displayOrder: t.Optional(t.Integer({ default: 0 })),
      }),
    },
  )
  .put(
    "/admin/pricing/categories/:id",
    async ({ params, body }) => {
      const row = await db
        .update(pricingCategories)
        .set({
          label: body.label,
          startingPriceLabel: body.startingPriceLabel,
          displayOrder: body.displayOrder ?? 0,
        })
        .where(eq(pricingCategories.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Kategori tidak ditemukan.");
      return { category: row[0] };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        label: t.String({ minLength: 3, maxLength: 80 }),
        startingPriceLabel: t.String({ minLength: 3, maxLength: 120 }),
        displayOrder: t.Optional(t.Integer({ default: 0 })),
      }),
    },
  )
  .delete(
    "/admin/pricing/categories/:id",
    async ({ params }) => {
      const row = await db
        .delete(pricingCategories)
        .where(eq(pricingCategories.id, params.id))
        .returning();;
      if (!row.length) throw new HttpError(404, "Kategori tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  )
  // ---- paket ----
  .post(
    "/admin/pricing/packages",
    async ({ body }) => {
      const row = await db
        .insert(pricingPackages)
        .values({
          categoryId: body.categoryId,
          name: body.name,
          price: body.price,
          features: body.features ?? [],
          isRecommended: body.isRecommended ?? false,
          demoUrl: body.demoUrl ?? null,
          displayOrder: body.displayOrder ?? 0,
        })
        .returning();
      return { package: row[0] };
    },
    {
      body: t.Object({
        categoryId: t.String(),
        name: t.String({ minLength: 2, maxLength: 120 }),
        price: t.Integer({ minimum: 0, maximum: 1_000_000_000 }),
        features: t.Optional(t.Array(t.String({ maxLength: 200 }))),
        isRecommended: t.Optional(t.Boolean({ default: false })),
        demoUrl: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
        displayOrder: t.Optional(t.Integer({ default: 0 })),
      }),
    },
  )
  .put(
    "/admin/pricing/packages/:id",
    async ({ params, body }) => {
      const row = await db
        .update(pricingPackages)
        .set({
          categoryId: body.categoryId,
          name: body.name,
          price: body.price,
          features: body.features ?? [],
          isRecommended: body.isRecommended ?? false,
          demoUrl: body.demoUrl ?? null,
          displayOrder: body.displayOrder ?? 0,
        })
        .where(eq(pricingPackages.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Paket tidak ditemukan.");
      return { package: row[0] };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        categoryId: t.String(),
        name: t.String({ minLength: 2, maxLength: 120 }),
        price: t.Integer({ minimum: 0, maximum: 1_000_000_000 }),
        features: t.Optional(t.Array(t.String({ maxLength: 200 }))),
        isRecommended: t.Optional(t.Boolean({ default: false })),
        demoUrl: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
        displayOrder: t.Optional(t.Integer({ default: 0 })),
      }),
    },
  )
  .delete(
    "/admin/pricing/packages/:id",
    async ({ params }) => {
      const row = await db
        .delete(pricingPackages)
        .where(eq(pricingPackages.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Paket tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  );