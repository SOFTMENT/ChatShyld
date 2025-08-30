// backend/src/handlers/profile/presign-avatar.handler.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { json, parse } from "@/shared/http.js";
import { TokenError, verifyToken } from "@/shared/token.jwt.js";
import { assertConfig, cfg } from "@/shared/config.js";
import { logger } from "@/shared/logger.js";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3 } from "@/shared/s3.js";
import { ulid } from "ulid";

assertConfig();

const bodySchema = z.object({
  contentType: z.string().regex(/^image\/(jpeg|png|webp)$/),
  // optional: client can send fileSize to precheck; S3 will still enforce size via policy
  fileSize: z.number().int().positive().optional(),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const auth = event.headers?.authorization ?? event.headers?.Authorization;

    if (!auth?.startsWith("Bearer "))
      return json(401, { error: "unauthorized" });
    const token = auth.slice(7);

    let sub: string;
    try {
      ({ sub } = verifyToken(token));
    } catch (e) {
      if (e instanceof TokenError) return json(401, { error: e.code });
      throw e;
    }

    const input = bodySchema.parse(parse(event.body));
    const max = parseInt(cfg.avatarMaxBytes ?? "2097152", 10); // 2 MB

    // Key pattern: avatars/{userId}/{ulid}.ext (lets you keep history if needed)
    const ext = input.contentType.split("/")[1].replace("jpeg", "jpg");
    const key = `avatars/${sub}/${ulid()}.${ext}`;

    // S3 will enforce size: content-length-range
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: cfg.avatarsBucket,
      Key: key,
      Conditions: [
        ["content-length-range", 1, max],
        ["starts-with", "$Content-Type", input.contentType],
      ],
      Fields: {
        "Content-Type": input.contentType,
        // If you made avatars public via bucket policy, you don't need ACL.
        // "acl": "public-read",
      },
      Expires: 60, // seconds to start the upload
    });

    return json(200, { url, fields, key, maxBytes: max });
  } catch (e: any) {
    logger.error({ message: "presign avatar failed", err: e?.message ?? e });
    if (e.name === "ZodError")
      return json(400, { error: "invalid_input", details: e.errors });
    return json(500, { error: "internal_error" });
  }
};
