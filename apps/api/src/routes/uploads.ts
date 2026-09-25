import { Elysia, t } from "elysia";
import { adminGuard } from "../lib/auth";
import { createPresignedUpload } from "../lib/r2";
import { UploadConfigError } from "../lib/http-error";

export const uploadRoutes = new Elysia({ tags: ["uploads"] })
  .use(adminGuard)
  .post(
    "/admin/uploads/presign",
    async ({ body }) => {
      try {
        const result = await createPresignedUpload(
          body.filename,
          body.contentType,
        );
        return result;
      } catch (error) {
        if (error instanceof UploadConfigError) {
          // di-propagate sebagai HttpError 400 oleh onError global
          throw error;
        }
        throw new UploadConfigError("Gagal membuat presigned URL.");
      }
    },
    {
      body: t.Object({
        filename: t.String({ minLength: 1, maxLength: 200 }),
        contentType: t.String({ minLength: 1, maxLength: 100 }),
      }),
    },
  );