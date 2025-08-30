import { assertConfig } from "@/shared/config";
import { json } from "@/shared/http";
import { logger } from "@/shared/logger";
import { TokenError, verifyToken } from "@/shared/token.jwt";
import UsersRepo from "@/users/user.repo";

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

assertConfig();

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

    const user = await UsersRepo.findById(sub);
    if (!user) return json(404, { error: "user_not_found" });

    return json(200, user);
  } catch (e: any) {
    logger.error({ message: "get-user failed", error: e });
    return json(500, { error: "internal_error" });
  }
};
