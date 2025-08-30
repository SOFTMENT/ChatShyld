import { sendOTP, verifyOtp } from "@/shared/otp.twilio";
import { signToken } from "@/shared/token.jwt";
import Users from "../users/user.repo.js";
import { User } from "@/users/user.types";
import { issueRefresh } from "./refresh.service.js";

export const requestOtp = async (phone: string) => {
  await sendOTP(phone);
};

export const verifyOtpAndLogin = async (phone: string, code: string) => {
  const ok = await verifyOtp(phone, code);
  if (!ok) throw new Error("verification failed");

  let user = await Users.findByPhone(phone);
  if (!user) {
    user = new User(phone);
    await Users.create(user);
  }
  const token = signToken({ sub: user.userId, phone: user.phone });
  const { refreshToken, refreshExpiresAt } = await issueRefresh(user.userId);

  return { user, token, refreshToken, refreshExpiresAt };
};
