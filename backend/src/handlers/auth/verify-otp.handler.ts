import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { z } from "zod";
import { parse, json } from "@/shared/http.js";
import { verifyOtpAndLogin } from "../../auth/auth.service.js";
import { logger } from "@/shared/logger.js";
import { assertConfig } from "@/shared/config.js";

assertConfig();

const schema = z.object({
  countryCode: z.string(),
  phone: z.string().min(8),
  code: z.string().min(4).max(8),
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const data = schema.parse(parse(event.body));
    const result = await verifyOtpAndLogin(
      data.countryCode,
      data.phone,
      data.code
    );
    logger.info({
      message: "OTP verified",
      phone: data.phone,
      userId: result.user.userId,
    });
    return json(200, { ok: true, ...result });
  } catch (e: any) {
    logger.error({ err: e, message: "verify-otp failed" });
    const code = e?.message === "verification_failed" ? 401 : 400;
    return json(code, { error: e?.message || "verification_failed" });
  }
};
