// backend/src/handlers/realtime/default.handler.ts
import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";

type WsEvent = APIGatewayProxyWebsocketEventV2 & {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
};

export const handler = async (event: WsEvent) => {
  console.log("[WS][$default] body:", event.body);
  console.log(
    "[WS][$default] headers:",
    JSON.stringify(event.headers ?? {}, null, 2)
  );
  console.log(
    "[WS][$default] ctx:",
    JSON.stringify(event.requestContext, null, 2)
  );
  // If you want to see everything:
  // console.log("[WS][$default] full event:", JSON.stringify(event, null, 2));
  return { statusCode: 200, body: "ok" };
};
