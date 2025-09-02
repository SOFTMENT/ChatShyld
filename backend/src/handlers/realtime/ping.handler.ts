import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const CONN_TABLE = process.env.CONN_TABLE!;

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  const id = event.requestContext.connectionId!;
  const ttl = Math.floor(Date.now() / 1000) + 60 * 5;

  await ddb.send(
    new UpdateCommand({
      TableName: CONN_TABLE,
      Key: { connectionId: id },
      UpdateExpression: "SET lastSeen = :now, ttl = :ttl",
      ExpressionAttributeValues: {
        ":now": new Date().toISOString(),
        ":ttl": ttl,
      },
      ConditionExpression: "attribute_exists(connectionId)",
    })
  );
  return { statusCode: 200, body: "pong" };
};
