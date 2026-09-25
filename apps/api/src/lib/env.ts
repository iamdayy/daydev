function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but missing.`);
  }
  return value;
}

export function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: optional("JWT_SECRET", "dev-secret-change-me"),
  r2: {
    accountId: optional("R2_ACCOUNT_ID"),
    accessKeyId: optional("R2_ACCESS_KEY_ID"),
    secretAccessKey: optional("R2_SECRET_ACCESS_KEY"),
    bucketName: optional("R2_BUCKET_NAME"),
    publicUrl: optional("R2_PUBLIC_URL"),
  },
  sessionTtlMs: Number(optional("SESSION_TTL_MS", String(7 * 24 * 60 * 60 * 1000))),
};