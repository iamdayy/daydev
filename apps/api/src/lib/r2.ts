import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { env } from "./env";
import { UploadConfigError } from "./http-error";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/** S3 client yang di-point ke endpoint R2. */
export function getR2Client(): S3Client {
  const { accountId, accessKeyId, secretAccessKey } = env.r2;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new UploadConfigError(
      "Konfigurasi R2 belum lengkap (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).",
    );
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function assertAllowedUpload(filename: string, contentType: string): void {
  if (!filename || filename.includes("/") || filename.includes("..")) {
    throw new UploadConfigError("Nama file tidak valid.");
  }
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new UploadConfigError("Tipe konten tidak diizinkan.");
  }
}

/** Sanitasi nama file & buat object key unik di R2. */
export function buildObjectKey(filename: string): string {
  const safeName = filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "")
    .slice(0, 80);
  const date = new Date();
  const prefix = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `uploads/${prefix}/${randomUUID()}-${safeName}`;
}

export function buildPublicUrl(key: string): string {
  const base = env.r2.publicUrl.replace(/\/$/, "");
  return `${base}/${key}`;
}

export interface PresignResult {
  url: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

export interface PresignOptions {
  maxBytes?: number;
  expiresIn?: number;
}

/**
 * Generate presigned PUT URL supaya browser upload langsung ke R2,
 * melewati backend sebagai proxy.
 */
export async function createPresignedUpload(
  filename: string,
  contentType: string,
  options: PresignOptions = {},
  client: S3Client = getR2Client(),
): Promise<PresignResult> {
  assertAllowedUpload(filename, contentType);

  const bucketName = env.r2.bucketName;
  if (!bucketName) {
    throw new UploadConfigError("R2_BUCKET_NAME belum di-set.");
  }

  const key = buildObjectKey(filename);
  const expiresIn = options.expiresIn ?? 15 * 60; // 15 menit
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    ContentLength: options.maxBytes ?? MAX_UPLOAD_BYTES,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  return { url, key, publicUrl: buildPublicUrl(key), expiresIn };
}