import type {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { z } from "zod";
import { verifyToken } from "@/shared/token.jwt";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { sendJson } from "@/realtime/ws.util";

type WsEvent = APIGatewayProxyWebsocketEventV2 & {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
};

const ddbc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const CONN_TABLE = process.env.CONN_TABLE!;

const schema = z.object({
  action: z.literal("typing"),
  to: z.string().min(1),
  typing: z.boolean(),
});

async function userIdFromConnection(
  event: WsEvent
): Promise<string | undefined> {
  const cid = event.requestContext.connectionId!;
  const r = await ddbc.send(
    new GetCommand({
      TableName: CONN_TABLE,
      Key: { connectionId: cid },
      ProjectionExpression: "userId",
    })
  );
  return (r.Item?.userId as string | undefined) ?? undefined;
}

export const handler = async (
  event: WsEvent
): Promise<APIGatewayProxyResultV2> => {
  // who is typing?
  let from: string | undefined;

  try {
    from = await userIdFromConnection(event);
    if (!from) {
      const auth = event.headers?.authorization ?? event.headers?.Authorization;
      const qtoken = event.queryStringParameters?.token;
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : qtoken;
      if (token) ({ sub: from } = verifyToken(token));
    }
  } catch (e) {
    console.error("[WS][typing] resolve user failed:", e);
  }

  if (!from) return { statusCode: 401, body: "unauthorized" };

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(JSON.parse(event.body ?? "{}"));
  } catch (e) {
    console.error("[WS][typing] invalid payload:", e);
    return { statusCode: 400, body: "invalid_payload" };
  }

  const domain = event.requestContext.domainName!;
  const stage = event.requestContext.stage!;

  const q = await ddbc.send(
    new QueryCommand({
      TableName: CONN_TABLE,
      IndexName: "gsi_user",
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": data.to },
      ProjectionExpression: "connectionId",
    })
  );

  const payload = { type: "typing", fromUser: from, typing: data.typing };

  for (const it of q.Items ?? []) {
    const cid = (it as any).connectionId as string | undefined;
    if (!cid) continue;
    try {
      await sendJson(domain, stage, cid, payload);
    } catch (e) {
      console.warn("[WS][typing] postToConnection failed", e);
    }
  }

  return { statusCode: 200, body: "ok" };
};
