import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDoc } from "@/shared/dynamodb.js";
import { cfg } from "@/shared/config.js";
import { RefreshRow } from "./refresh_type";

export const put = (row: RefreshRow) =>
  dynamoDoc.send(
    new PutCommand({
      TableName: cfg.refreshTable,
      Item: row,
      ConditionExpression: "attribute_not_exists(tokenId)",
    })
  );

export const get = async (tokenId: string) => {
  const r = await dynamoDoc.send(
    new GetCommand({
      TableName: cfg.refreshTable,
      Key: { tokenId },
    })
  );
  return r.Item as RefreshRow | undefined;
};

export const revoke = (tokenId: string) =>
  dynamoDoc.send(
    new UpdateCommand({
      TableName: cfg.refreshTable,
      Key: { tokenId },
      UpdateExpression: "SET revoked = :t, lastUsedAt = :now",
      ExpressionAttributeValues: {
        ":t": true,
        ":now": new Date().toISOString(),
      },
    })
  );

export const revokeAllForUser = async (userId: string) => {
  const q = await dynamoDoc.send(
    new QueryCommand({
      TableName: cfg.refreshTable,
      IndexName: "gsi_user",
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId },
    })
  );
  await Promise.all(
    (q.Items ?? []).map((i) =>
      dynamoDoc.send(
        new UpdateCommand({
          TableName: cfg.refreshTable,
          Key: { tokenId: i.tokenId },
          UpdateExpression: "SET revoked = :t",
          ExpressionAttributeValues: { ":t": true },
        })
      )
    )
  );
};
