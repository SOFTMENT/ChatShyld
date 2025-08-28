import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export const json = (
  statusCode: number,
  body: unknown
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const parse = <T = any>(s?: string | null): T => {
  if (!s) return {} as T;
  try {
    return JSON.parse(s) as T;
  } catch {
    return {} as T;
  }
};
