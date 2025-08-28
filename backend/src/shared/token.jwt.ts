import jwt from "jsonwebtoken";
import { cfg } from "./config.js";

export const signToken = (payload: { sub: string; phone: string }) =>
  jwt.sign(payload, cfg.jwtSecret, {
    algorithm: "HS256",
    expiresIn: cfg.jwtTtlSec,
  });
