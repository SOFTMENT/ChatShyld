import { dynamoDoc } from "@/shared/dynamodb";
import { User } from "./user.types";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { cfg } from "@/shared/config";

export const findByPhone = async (phone: string): Promise<User | null> => {
  const r = await dynamoDoc.send(
    new QueryCommand({
      TableName: cfg.usersTable,
      IndexName: cfg.phoneGsi,
      KeyConditionExpression: "#p = :v",
      ExpressionAttributeNames: { "#p": "phone" },
      ExpressionAttributeValues: { ":v": phone },
      Limit: 1,
    })
  );
  return (r.Items?.[0] as User) ?? null;
};

export const findById = async (userId: string): Promise<User | null> => {
  const r = await dynamoDoc.send(
    new GetCommand({ TableName: cfg.usersTable, Key: { userId } })
  );
  return (r.Item as User) ?? null;
};

export const create = async (u: User) => {
  await dynamoDoc.send(
    new PutCommand({
      TableName: cfg.usersTable,
      Item: u,
      ConditionExpression: "attribute_not_exists(userId)",
    })
  );
  return u;
};

const UsersRepo = { findByPhone, findById, create };
export default UsersRepo;
