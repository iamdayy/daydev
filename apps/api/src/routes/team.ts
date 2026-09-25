import { createRoute, z } from "@hono/zod-openapi";
import type { TeamMember } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { teamMembers } from "../db/schema";
import { HttpError } from "../lib/http-error";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof teamMembers.$inferSelect): TeamMember {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as TeamMember;
}

const teamBody = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  photoUrl: z.string().max(500).nullable().optional(),
  linkedinUrl: z.string().max(500).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

const teamParams = z.object({
  id: z.string().min(1),
});

const teamRow = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  photo_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  display_order: z.number(),
  is_published: z.boolean(),
});

const rawRow = z.record(z.string(), z.unknown());

export const teamRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "get",
      path: "/team",
      tags: ["team"],
      responses: responses(
        z.object({ team: z.array(teamRow) }),
        "Anggota tim yang dipublikasikan.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.isPublished, true))
        .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));
      return c.json({ team: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/team",
      tags: ["team"],
      responses: responses(
        z.object({ team: z.array(teamRow) }),
        "Semua anggota tim.",
      ),
    }),
    async (c) => {
      const rows = await db
        .select()
        .from(teamMembers)
        .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));
      return c.json({ team: rows.map(serialize) }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/team",
      tags: ["team"],
      request: {
        body: { content: { "application/json": { schema: teamBody } } },
      },
      responses: responses(
        z.object({ member: rawRow }),
        "Anggota tim yang dibuat.",
      ),
    }),
    async (c) => {
      const team = c.req.valid("json");
      if (!team.name || !team.role) {
        throw new HttpError(422, "Nama dan peran anggota tim harus diisi.");
      }
      const row = await db
        .insert(teamMembers)
        .values({
          name: team.name,
          role: team.role,
          photoUrl: team.photoUrl ?? null,
          linkedinUrl: team.linkedinUrl ?? null,
          displayOrder: team.displayOrder ?? 0,
          isPublished: team.isPublished ?? false,
        })
        .returning();
      return c.json({ member: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/team/{id}",
      tags: ["team"],
      request: {
        params: teamParams,
        body: { content: { "application/json": { schema: teamBody } } },
      },
      responses: responses(
        z.object({ member: rawRow }),
        "Anggota tim yang diperbarui.",
      ),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const team = c.req.valid("json");
      if (!team.name || !team.role) {
        throw new HttpError(422, "Nama dan peran anggota tim harus diisi.");
      }
      const existing = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.id, id),
      });
      if (!existing) throw new HttpError(404, "Anggota tim tidak ditemukan.");
      const row = await db
        .update(teamMembers)
        .set({
          name: team.name,
          role: team.role,
          photoUrl: team.photoUrl ?? null,
          linkedinUrl: team.linkedinUrl ?? null,
          displayOrder: team.displayOrder ?? existing.displayOrder,
          isPublished: team.isPublished ?? existing.isPublished,
        })
        .where(eq(teamMembers.id, id))
        .returning();
      return c.json({ member: row[0] }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/team/{id}",
      tags: ["team"],
      request: { params: teamParams },
      responses: responses(z.object({ ok: z.boolean() }), "Berhasil dihapus."),
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const row = await db
        .delete(teamMembers)
        .where(eq(teamMembers.id, id))
        .returning();
      if (!row.length) throw new HttpError(404, "Anggota tim tidak ditemukan.");
      return c.json({ ok: true }, 200);
    },
  );
};