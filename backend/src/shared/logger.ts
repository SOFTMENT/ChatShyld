import { Logger, LogLevel } from "@aws-lambda-powertools/logger";

const toLogLevel = (v?: string) => {
  switch ((v ?? "").toUpperCase()) {
    case "TRACE": return LogLevel.TRACE;
    case "DEBUG": return LogLevel.DEBUG;
    case "INFO":  return LogLevel.INFO;
    case "WARN":
    case "WARNING": return LogLevel.WARN;
    case "ERROR": return LogLevel.ERROR;
    default: return LogLevel.INFO;
  }
};

export const logger = new Logger({
  serviceName: "chatshyld",
  logLevel: toLogLevel(process.env.LOG_LEVEL),
});