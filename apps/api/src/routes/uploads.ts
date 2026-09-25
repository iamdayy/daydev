import { createRoute, z } from "@hono/zod-openapi";
import { UploadConfigError } from "../lib/http-error";
import { createPresignedUpload } from "../lib/r2";
import type { App } from "../lib/types";
import { responses } from "../lib/zhelpers";

const presignBody = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
});

const presignOk = z.object({
  url: z.string(),
  key: z.string(),
  publicUrl: z.string(),
  expiresIn: z.number(),
});

export const uploadRoutes = (app: App): void => {
  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/uploads/presign",
      tags: ["uploads"],
      request: {
        body: { content: { "application/json": { schema: presignBody } } },
      },
      responses: responses(presignOk, "Presigned PUT URL untuk upload langsung ke R2."),
    }),
    async (c) => {
      const presign = c.req.valid("json");
      if (!presign.filename || !presign.contentType) {
        throw new UploadConfigError("filename dan contentType wajib diisi.");
      }
      try {
        const result = await createPresignedUpload(
          presign.filename,
          presign.contentType,
        );
        return c.json(result, 200);
      } catch (error) {
        if (error instanceof UploadConfigError) {
          throw error;
        }
        throw new UploadConfigError("Gagal membuat presigned URL.");
      }
    },
  );
};