import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod";
import { ulid } from "ulid";
import { verifyToken } from "@/shared/token.jwt";
import { json, parse } from "@/shared/http";

const s3 = new S3Client({});
const BUCKET = process.env.ATTACH_BUCKET!;

const schema = z.object({
  mime: z.string().min(1), // e.g., "image/jpeg"
  ext: z.string().min(1), // e.g., "jpg"
  maxMb: z.number().min(1).max(50).default(20),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const auth = event.headers?.authorization ?? event.headers?.Authorization;
  if (!auth?.startsWith("Bearer ")) return json(401, { error: "unauthorized" });

  let sub: string;
  try {
    ({ sub } = verifyToken(auth.slice(7)));
  } catch {
    return json(401, { error: "invalid_token" });
  }

  const body = schema.parse(parse(event.body));
  const key = `chat/${sub}/${ulid()}.${body.ext}`;
  const maxBytes = body.maxMb * 1024 * 1024;

  // Fields with Content-Type equals to the requested MIME
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: BUCKET,
    Key: key,
    Fields: { "Content-Type": body.mime },
    Conditions: [
      ["content-length-range", 1, maxBytes],
      ["eq", "$Content-Type", body.mime],
    ],
    Expires: 60,
  });

  return json(200, { url, fields, key });
};
