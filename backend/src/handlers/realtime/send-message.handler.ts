import type {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { z } from "zod";
import { ulid } from "ulid";
import { verifyToken } from "@/shared/token.jwt";
import { convoIdFor } from "@/realtime/convo.util";
import { sendJson } from "@/realtime/ws.util";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

type WsEvent = APIGatewayProxyWebsocketEventV2 & {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
};

const ddbc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const MSG_TABLE = process.env.MSG_TABLE!;
const CONVO_TABLE = process.env.CONVO_TABLE!;
const CONN_TABLE = process.env.CONN_TABLE!;

const schema = z
  .object({
    action: z.literal("sendMessage"),
    to: z.string().min(1),
    body: z.string().max(8000).optional(),
    media: z
      .object({
        key: z.string(),
        mime: z.string(),
        size: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        durationMs: z.number().optional(),
        filename: z.string().optional(),
      })
      .partial()
      .optional(),
  })
  .refine((p) => !!p.body || !!p.media, { message: "empty_message" });

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
  console.log("[WS][sendMessage] raw body:", event.body);
  console.log("[WS][sendMessage] env:", {
    MSG_TABLE,
    CONVO_TABLE,
    CONN_TABLE,
    AWS_REGION: process.env.AWS_REGION,
  });

  // ---- who is the sender? Prefer connection lookup; (optional) fallback to token if supplied
  let from: string | undefined;

  try {
    from = await userIdFromConnection(event);
    if (!from) {
      // optional fallback if you want to allow token in MESSAGE too:
      const auth = event.headers?.authorization ?? event.headers?.Authorization;
      const qtoken = event.queryStringParameters?.token;
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : qtoken;
      if (token) {
        ({ sub: from } = verifyToken(token));
      }
    }
  } catch (e) {
    console.error(
      "[WS][sendMessage] failed to resolve user from connection/token:",
      e
    );
  }

  if (!from) {
    console.warn(
      "[WS][sendMessage] unauthorized: no connection record / no token"
    );
    return { statusCode: 401, body: "unauthorized" };
  }

  // ---- parse payload
  let data: z.infer<typeof schema>;
  try {
    data =
      typeof event.body === "string"
        ? schema.parse(JSON.parse(event.body))
        : schema.parse(event.body);
  } catch (e) {
    console.error("[WS][sendMessage] invalid payload:", e);
    return { statusCode: 400, body: "invalid_payload" };
  }

  const to = data.to;
  const convoId = convoIdFor(from, to);
  const messageId = ulid();
  const now = new Date().toISOString();

  // ---- write message
  try {
    await ddbc.send(
      new PutCommand({
        TableName: MSG_TABLE,
        Item: {
          convoId,
          messageId,
          fromUser: from,
          toUser: to,
          kind: data.media ? "media" : "text",
          body: data.body ?? null,
          media: data.media ?? null,
          createdAt: now,
          status: "sent",
        },
      })
    );
    console.log("[WS][sendMessage] Put message OK");
  } catch (e) {
    console.error("[WS][sendMessage] Put message FAILED:", e);
    return { statusCode: 500, body: "put_message_failed" };
  }

  // ---- upsert conversation summary
  try {
    const preview = data.media
      ? data.media.mime?.startsWith("image")
        ? "📷 Photo"
        : data.media.mime?.startsWith("video")
        ? "🎬 Video"
        : data.media.filename ?? "📎 Attachment"
      : (data.body ?? "").slice(0, 120);

    await ddbc.send(
      new PutCommand({
        TableName: CONVO_TABLE,
        Item: {
          convoId,
          p1: from,
          p2: to,
          lastMessageAt: now,
          lastPreview: preview,
        },
      })
    );
    console.log("[WS][sendMessage] Upsert convo OK");
  } catch (e) {
    console.error("[WS][sendMessage] Upsert convo FAILED:", e);
  }

  // ---- fanout
  const domain = event.requestContext.domainName!;
  const stage = event.requestContext.stage!;
  const payload = {
    type: "message.new",
    convoId,
    message: {
      messageId,
      fromUser: from,
      toUser: to,
      body: data.body ?? null,
      media: data.media ?? null,
      createdAt: now,
    },
  };

  try {
    const toQ = await ddbc.send(
      new QueryCommand({
        TableName: CONN_TABLE,
        IndexName: "gsi_user",
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": to },
        ProjectionExpression: "connectionId",
      })
    );
    console.log("[WS][sendMessage] recipients:", toQ.Count);

    for (const it of toQ.Items ?? []) {
      const cid = (it as any).connectionId as string | undefined;
      if (!cid) continue;
      try {
        await sendJson(domain, stage, cid, payload);
      } catch (e) {
        console.warn("[WS][sendMessage] postToConnection(to) failed", e);
      }
    }

    const meQ = await ddbc.send(
      new QueryCommand({
        TableName: CONN_TABLE,
        IndexName: "gsi_user",
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": from },
        ProjectionExpression: "connectionId",
      })
    );
    for (const it of meQ.Items ?? []) {
      const cid = (it as any).connectionId as string | undefined;
      if (!cid) continue;
      try {
        await sendJson(domain, stage, cid, payload);
      } catch (e) {
        console.warn("[WS][sendMessage] postToConnection(me) failed", e);
      }
    }
  } catch (e) {
    console.error("[WS][sendMessage] fanout query failed:", e);
  }

  return { statusCode: 200, body: "ok" };
};
