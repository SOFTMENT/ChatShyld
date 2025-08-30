import { dynamoDoc } from "@/shared/dynamodb";
import { User } from "./user.types";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
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

export const updatePartial = async (
  userId: string,
  patch: Partial<User>
): Promise<User> => {
  const allowed: (keyof User)[] = ["name", "photoKey"];
  const data: Record<string, any> = {};
  for (const k of allowed) {
    if (patch[k] !== undefined) data[k] = patch[k];
  }

  const sets: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = { ":now": new Date().toISOString() };

  Object.entries(data).forEach(([k, v]) => {
    const nk = `#${k}`;
    const vk = `:${k}`;
    names[nk] = k;
    values[vk] = v;
    sets.push(`${nk} = ${vk}`);
  });

  if (sets.length === 0) {
    const current = await findById(userId);
    if (!current) throw new Error("ConditionalCheckFailedException");
    return current;
  }

  sets.push("#updatedAt = :now"); // single place to set updatedAt

  const r = await dynamoDoc.send(
    new UpdateCommand({
      TableName: cfg.usersTable,
      Key: { userId },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ExpressionAttributeNames: { ...names, "#updatedAt": "updatedAt" },
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "ALL_NEW",
    })
  );

  return r.Attributes as User;
};

const UsersRepo = { findByPhone, findById, create, updatePartial };
export default UsersRepo;
