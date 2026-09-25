import type { Hook } from "@hono/zod-openapi";
import type { Context } from "hono";
import { z } from "zod";
import type { Env } from "./types";

/** Bentuk respons error konsisten di seluruh API. */
export const errorBody = z.object({
  error: z.string(),
  issues: z.unknown().optional(),
});

/** Bangun blok `responses` OpenAPI untuk satu status 200. */
export function jsonResponse(
  schema: z.ZodTypeAny,
  description: string,
): {
  content: { "application/json": { schema: z.ZodTypeAny } };
  description: string;
} {
  return { content: { "application/json": { schema } }, description };
}

/** Status error standar yang dipakai semua route. */
export const errorResponses = {
  400: jsonResponse(errorBody, "Request tidak valid."),
  401: jsonResponse(errorBody, "Tidak terautentikasi."),
  404: jsonResponse(errorBody, "Tidak ditemukan."),
  409: jsonResponse(errorBody, "Konflik."),
  422: jsonResponse(errorBody, "Validasi gagal."),
  429: jsonResponse(errorBody, "Terlalu banyak percobaan."),
  500: jsonResponse(errorBody, "Kesalahan internal."),
};

/** Helper respons route: 200 + semua error standar. */
export function responses(schema: z.ZodTypeAny, description: string) {
  return { 200: jsonResponse(schema, description), ...errorResponses };
}

/**
 * Hook default validasi: pola error sama seperti sebelumnya
 * (HTTP 422 + `{ error, issues }`).
 */
export const defaultHook: Hook<any, Env, any, any> = (
  result,
  c: Context<Env>,
) => {
  if (!result.success) {
    return c.json(
      { error: "Validasi gagal.", issues: result.error.issues },
      422,
    );
  }
};