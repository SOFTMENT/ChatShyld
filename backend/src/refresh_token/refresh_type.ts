export interface RefreshRow {
  tokenId: string; // PK
  userId: string;
  hashedSecret: string; // HMAC(secret) base64url
  ttl: number; // epoch seconds (DynamoDB TTL)
  createdAt: string;
  lastUsedAt?: string;
  revoked?: boolean;
  device?: string;
  ip?: string;
  ua?: string;
}
