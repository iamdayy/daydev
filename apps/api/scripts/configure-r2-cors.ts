import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { env } from "../src/lib/env";
import { getR2Client, getR2CorsOrigins } from "../src/lib/r2";

if (!env.r2.bucketName) {
  throw new Error("R2_BUCKET_NAME belum di-set.");
}

await getR2Client().send(
  new PutBucketCorsCommand({
    Bucket: env.r2.bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: getR2CorsOrigins(),
          AllowedMethods: ["PUT", "GET", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
);

console.log(`R2 CORS configured for: ${getR2CorsOrigins().join(", ")}`);
