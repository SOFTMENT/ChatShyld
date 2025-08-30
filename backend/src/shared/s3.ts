// backend/src/shared/s3.ts
import { S3Client } from "@aws-sdk/client-s3";
export const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
});
