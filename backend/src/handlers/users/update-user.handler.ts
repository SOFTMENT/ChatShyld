import { assertConfig, cfg } from "@/shared/config";
import { z } from "zod";

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { json, parse } from "@/shared/http";
import { TokenError, verifyToken } from "@/shared/token.jwt";
import UsersRepo from "@/users/user.repo";
import { logger } from "@/shared/logger";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/shared/s3";

assertConfig();

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(50).optional(),
    photoKey: z.string().trim().max(512).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "empty_patch" });

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
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

    // Content-Type guard (optional but helpful)
    const ctype =
      event.headers["content-type"] || event.headers["Content-Type"];
    if (!ctype?.includes("application/json")) {
      return json(415, { error: "unsupported_media_type" });
    }

    const body = parse(event.body);
    const patch = patchSchema.parse(body);

    const current = await UsersRepo.findById(sub);
    const oldKey = current?.photoKey;

    if (patch.photoKey && !patch.photoKey.startsWith(`avatars/${sub}/`)) {
      return json(400, { error: "invalid_photo_key" });
    }

    let newKey: string | undefined;
    if (patch.photoKey) {
      newKey = patch.photoKey;
    }

    const updated = await UsersRepo.updatePartial(sub, patch);

    if (newKey && oldKey && oldKey !== newKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({ Bucket: cfg.avatarsBucket, Key: oldKey })
        );
      } catch (e) {
        logger.warn({
          message: "avatar old delete failed",
          oldKey,
          err: (e as any)?.message,
        });
      }
    }
    return json(200, { ok: true, user: updated });
  } catch (e: any) {
    logger.warn({ message: "update-user failed", error: e });
    if (e?.message === "empty_patch")
      return json(400, { error: "empty_patch" });
    if (e?.name === "ConditionalCheckFailedException")
      return json(404, { error: "user_not_found" });
    if (e?.name === "ZodError")
      return json(400, { error: "invalid_input", details: e.errors });
    return json(500, { error: "internal_error" });
  }
};
