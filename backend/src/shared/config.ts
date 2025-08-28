export const cfg = {
  region: process.env.AWS_REGION ?? "ap-southeast-2",
  usersTable: process.env.USERS_TABLE!,
  phoneGsi: process.env.PHONE_GSI ?? "gsi_phone",
  jwtSecret: process.env.JWT_SECRET!,
  jwtTtlSec: parseInt(process.env.JWT_TTL_SEC || "7200", 10),
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    verifySid: process.env.TWILIO_VERIFY_SID!,
  },
};

export function assertConfig() {
  const missing = Object.entries({
    USERS_TABLE: cfg.usersTable,
    JWT_SECRET: cfg.jwtSecret,
    TWILIO_ACCOUNT_SID: cfg.twilio.accountSid,
    TWILIO_AUTH_TOKEN: cfg.twilio.authToken,
    TWILIO_VERIFY_SID: cfg.twilio.verifySid,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}
