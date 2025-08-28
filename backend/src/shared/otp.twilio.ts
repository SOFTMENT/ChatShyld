import Twilio from "twilio";
import { cfg } from "./config.js";

const client = Twilio(cfg.twilio.accountSid, cfg.twilio.authToken);

export const sendOTP = async (phone: string) => {
  const res = await client.verify.v2
    .services(cfg.twilio.verifySid)
    .verifications.create({ to: phone, channel: "sms" });

  if (!res.sid) throw new Error("twilio_send_failed");
};

export const verifyOtp = async (phone: string, code: string) => {
  const res = await client.verify.v2
    .services(cfg.twilio.verifySid)
    .verificationChecks.create({ to: phone, code });
  return res.status == "approved";
};
