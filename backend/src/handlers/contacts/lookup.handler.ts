// backend/src/handlers/contacts/lookup.handler.ts
import { json, parse } from "@/shared/http.js";
import { logger } from "@/shared/logger.js";
import * as PhoneDir from "@/phone_directory/phone_directory.repo.js";
import * as UsersRepo from "@/users/user.repo.js";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const isE164 = (s: unknown): s is string =>
  typeof s === "string" && /^\+[1-9]\d{6,15}$/.test(s);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    logger.info({ message: "lookup:start" });

    const raw = event.body ?? "";
    const ctype =
      event.headers?.["content-type"] ?? event.headers?.["Content-Type"];
    logger.info({ message: "lookup:req", len: raw.length, ctype });

    const body = parse(raw);
    const incoming = Array.isArray(body?.phones)
      ? (body.phones as unknown[])
      : [];
    const phones = incoming.filter(isE164);

    if (phones.length === 0) {
      logger.warn({
        message: "lookup:empty_or_invalid",
        incomingCount: incoming.length,
      });
      return json(200, { users: [], count: 0 }); // be tolerant
    }
    logger.info({
      message: "lookup:validated",
      count: phones.length,
      sample: phones.slice(0, 5),
    });

    // phone -> userId
    const mappings = await PhoneDir.batchGetByPhones(phones);
    const ids = Array.from(new Set(mappings.map((m) => m.userId)));
    if (ids.length === 0) return json(200, { users: [], count: 0 });

    // userId -> users
    const users = await UsersRepo.batchGetByIds(ids);
    return json(200, {
      users: users.map((u) => ({
        userId: u.userId,
        phone: u.phone,
        name: u.name ?? null,
        photoKey: u.photoKey ?? null,
        createdAt: u.createdAt,
      })),
      count: users.length,
    });
  } catch (e: any) {
    logger.error({ message: "contacts/lookup failed", err: e?.message });
    return json(500, { error: "internal_error" });
  }
};
