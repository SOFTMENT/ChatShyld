import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json, parse } from "@/shared/http.js";
import { signToken } from "@/shared/token.jwt.js";
import * as Users from "@/users/user.repo.js";
import * as Refresh from "../../refresh_token/refresh.repo.js";
import {
  parseRefresh,
  nowSec,
  hashSecret,
  timingSafeEq,
  issueRefresh,
} from "../../auth/refresh.service.js";
import { assertConfig } from "@/shared/config.js";

assertConfig();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { refreshToken } = parse<{ refreshToken?: string }>(event.body);
  const parsed = parseRefresh(refreshToken);
  if (!parsed) return json(400, { error: "malformed_refresh_token" });

  const row = await Refresh.get(parsed.tokenId);
  if (!row || row.revoked || row.ttl <= nowSec())
    return json(401, { error: "invalid_or_expired_refresh" });

  if (!timingSafeEq(row.hashedSecret, hashSecret(parsed.secret)))
    return json(401, { error: "invalid_or_expired_refresh" });

  // Rotate: revoke old token
  await Refresh.revoke(row.tokenId);

  // Load user and issue new access token
  const user = await Users.findById(row.userId);
  if (!user) return json(401, { error: "unknown_user" });

  const token = signToken({ sub: user.userId, phone: user.phone });

  // Issue a brand-new refresh token
  const { refreshToken: newRefresh, refreshExpiresAt } = await issueRefresh(
    user.userId
  );

  return json(200, {
    ok: true,
    token,
    refreshToken: newRefresh,
    refreshExpiresAt,
    user,
  });
};
