import { Logger } from "@aws-lambda-powertools/logger";

const logLevel = (process.env.LOG_LEVEL ?? "INFO").toUpperCase() as LogLevel;

export const logger = new Logger({
  serviceName: "chatshyld",
  logLevel,
});
