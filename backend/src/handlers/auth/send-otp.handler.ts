import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { z } from "zod";
import { parse, json } from "@/shared/http.js";
import { requestOtp } from "../../auth/auth.service.js";
import { logger } from "@/shared/logger.js";
import { assertConfig } from "@/shared/config.js";

assertConfig(); // validate env at cold start

const schema = z.object({ phone: z.string().min(8) });

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const data = schema.parse(parse(event.body));
    await requestOtp(data.phone);
    logger.info({ message: "OTP sent", phone: data.phone });

    return json(200, { ok: true });
  } catch (e: any) {
    logger.error({ message: "send-otp failed", err: e });
    if (e?.issues) return json(400, { error: "invalid_input" });
    return json(500, { error: "otp_send_failed" });
  }
};
