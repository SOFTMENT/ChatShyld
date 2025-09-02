import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const CONN_TABLE = process.env.CONN_TABLE!;

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  await ddb.send(
    new DeleteCommand({
      TableName: CONN_TABLE,
      Key: { connectionId: event.requestContext.connectionId! },
    })
  );
  return { statusCode: 200, body: "bye" };
};
