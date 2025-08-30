import crypto from "node:crypto";
import * as Refresh from "../refresh_token/refresh.repo.js";
import { cfg } from "@/shared/config.js";

const b64url = (b: Buffer) => b.toString("base64url");
const hmac = (secret: string) =>
  crypto
    .createHmac("sha256", cfg.refreshPepper)
    .update(secret)
    .digest("base64url");

export const issueRefresh = async (
  userId: string,
  meta?: { device?: string; ip?: string; ua?: string }
) => {
  const tokenId = crypto.randomUUID();
  const secret = b64url(crypto.randomBytes(32)); // never stored raw
  const token = `${tokenId}.${secret}`;
  const ttl = Math.floor(Date.now() / 1000) + cfg.refreshTtlDays * 86400;

  await Refresh.put({
    tokenId,
    userId,
    hashedSecret: hmac(secret),
    ttl,
    createdAt: new Date().toISOString(),
    device: meta?.device,
    ip: meta?.ip,
    ua: meta?.ua,
  });

  return { refreshToken: token, refreshExpiresAt: ttl };
};

export const parseRefresh = (raw?: string) => {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { tokenId: parts[0], secret: parts[1] };
};

export const timingSafeEq = (a: string, b: string) => {
  const A = Buffer.from(a),
    B = Buffer.from(b);
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

export const nowSec = () => Math.floor(Date.now() / 1000);
export const hashSecret = (s: string) => hmac(s);
