import { Elysia, t } from "elysia";
import { adminGuard } from "../lib/auth";
import { UploadConfigError } from "../lib/http-error";
import { createPresignedUpload } from "../lib/r2";

const presignBody = t.Object({
        filename: t.String({ minLength: 1, maxLength: 200 }),
        contentType: t.String({ minLength: 1, maxLength: 100 }),
      })

export const uploadRoutes = new Elysia({ tags: ["uploads"] })
  .use(adminGuard)
  .post(
    "/admin/uploads/presign",
    async ({ body }) => {
      const presign = body as typeof presignBody.static;
      if (!presign.filename || !presign.contentType) {
        throw new UploadConfigError("filename dan contentType wajib diisi.");
      }
      try {
        const result = await createPresignedUpload(
          presign.filename,
          presign.contentType,
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
      body: presignBody,
    },
  );