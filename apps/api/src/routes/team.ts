import type { TeamMember } from "@daydev/shared-types";
import { asc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { teamMembers } from "../db/schema";
import { adminGuard } from "../lib/auth";
import { HttpError } from "../lib/http-error";

// Serialize row dari database (camelCase) ke bentuk yang dikirim ke API (snake_case)
function serialize(row: typeof teamMembers.$inferSelect) : TeamMember {
  let newRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newRow[snakeKey] = value;
  }
  return newRow as unknown as TeamMember;
}

const teamBody = t.Object({
  name: t.String({ minLength: 2, maxLength: 120 }),
  role: t.String({ minLength: 2, maxLength: 120 }),
  photoUrl: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
  linkedinUrl: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
  displayOrder: t.Optional(t.Integer({ default: 0 })),
  isPublished: t.Optional(t.Boolean({ default: false })),
});

export const teamRoutes = new Elysia({ tags: ["team"] })
  .get("/team", async () => {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isPublished, true))
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));
    return { team: rows.map(serialize) };
  })
  .use(adminGuard)
  .get("/admin/team", async () => {
    const rows = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));
    return { team: rows.map(serialize) };
  })
  .post("/admin/team", async ({ body }) => {
    const team = body as typeof teamBody.static;
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
    return { member: row[0] };
  }, { body: teamBody })
  .put(
    "/admin/team/:id",
    async ({ params, body }) => {
      const team = body as typeof teamBody.static;
      if (!team.name || !team.role) {
        throw new HttpError(422, "Nama dan peran anggota tim harus diisi.");
      }
      const existing = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.id, params.id),
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
        .where(eq(teamMembers.id, params.id))
        .returning();
      return { member: row[0] };
    },
    {
      params: t.Object({ id: t.String() }),
      body: teamBody,
    },
  )
  .delete(
    "/admin/team/:id",
    async ({ params }) => {
      const row = await db
        .delete(teamMembers)
        .where(eq(teamMembers.id, params.id))
        .returning();
      if (!row.length) throw new HttpError(404, "Anggota tim tidak ditemukan.");
      return { ok: true };
    },
    { params: t.Object({ id: t.String() }) },
  );