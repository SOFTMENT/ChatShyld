import type {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { verifyToken } from "@/shared/token.jwt";

type WsEvent = APIGatewayProxyWebsocketEventV2 & {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
};

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const CONN_TABLE = process.env.CONN_TABLE!;

export const handler = async (
  event: WsEvent
): Promise<APIGatewayProxyResultV2> => {
  const auth = event.headers?.authorization ?? event.headers?.Authorization;
  const qtoken = event.queryStringParameters?.token;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : qtoken;
  if (!token) return { statusCode: 401, body: "unauthorized" };

  let userId: string;
  try {
    ({ sub: userId } = verifyToken(token));
  } catch {
    return { statusCode: 401, body: "invalid_token" };
  }

  const ttl = Math.floor(Date.now() / 1000) + 60 * 5;
  console.log(
    "[WS][$connect] qs:",
    event.queryStringParameters,
    "hdr:",
    event.headers
  );
  console.log(
    "[WS][$connect] user:",
    userId,
    "cid:",
    event.requestContext.connectionId
  );
  await ddb.send(
    new PutCommand({
      TableName: CONN_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId!,
        userId,
        lastSeen: new Date().toISOString(),
        ttl,
      },
    })
  );

  return { statusCode: 200, body: "ok" };
};
