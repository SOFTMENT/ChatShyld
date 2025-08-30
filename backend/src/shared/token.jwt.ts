import jwt from "jsonwebtoken";
import { cfg } from "./config.js";

export type DecodedAccess = jwt.JwtPayload & { sub: string; phone: string };

export class TokenError extends Error {
  code: "invalid_token" | "token_expired";
  status = 401;
  constructor(code: "invalid_token" | "token_expired", msg?: string) {
    super(msg ?? code);
    this.name = "TokenError";
    this.code = code;
  }
}

export const signToken = (payload: { sub: string; phone: string }) =>
  jwt.sign(payload, cfg.jwtSecret, {
    algorithm: "HS256",
    expiresIn: cfg.jwtTtlSec,
  });

export const verifyToken = (token: string): DecodedAccess => {
  try {
    const payload = jwt.verify(token, cfg.jwtSecret, { algorithms: ["HS256"] });
    const p = payload as DecodedAccess;
    if (!p || typeof p.sub !== "string") {
      throw new TokenError("invalid_token", "missing sub claim");
    }
    return p;
  } catch (e: any) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new TokenError("token_expired");
    }
    if (e instanceof jwt.JsonWebTokenError) {
      throw new TokenError("invalid_token");
    }
    throw e; // unexpected
  }
};
