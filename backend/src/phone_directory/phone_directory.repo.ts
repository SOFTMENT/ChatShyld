import {
  BatchGetCommand,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDoc } from "@/shared/dynamodb.js";
import { cfg } from "@/shared/config.js";
import { PhoneDirectoryItem } from "./phone_types";

export const getByPhone = async (
  phone: string
): Promise<PhoneDirectoryItem | null> => {
  const r = await dynamoDoc.send(
    new GetCommand({
      TableName: cfg.phoneDirTable,
      Key: { phone },
    })
  );
  return (r.Item as PhoneDirectoryItem) ?? null;
};

// BatchGet up to 100 keys per call (with retry on UnprocessedKeys)
export const batchGetByPhones = async (
  phones: string[]
): Promise<PhoneDirectoryItem[]> => {
  const uniq = Array.from(new Set(phones)).map((p) => ({ phone: p }));
  const out: PhoneDirectoryItem[] = [];

  for (let i = 0; i < uniq.length; i += 100) {
    const chunk = uniq.slice(i, i + 100);
    let unprocessed: any = { [cfg.phoneDirTable]: { Keys: chunk } };

    do {
      const resp = await dynamoDoc.send(
        new BatchGetCommand({
          RequestItems: {
            [cfg.phoneDirTable]: { Keys: unprocessed[cfg.phoneDirTable].Keys },
          },
        })
      );
      out.push(
        ...((resp.Responses?.[cfg.phoneDirTable] as PhoneDirectoryItem[]) ?? [])
      );
      unprocessed = resp.UnprocessedKeys ?? {};
    } while (unprocessed && Object.keys(unprocessed).length);
  }
  return out;
};

// Atomic create of user + phone mapping (first login)
export const createUserAndMapping = async (userItem: any /* User item */) => {
  await dynamoDoc.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: cfg.usersTable,
            Item: userItem,
            ConditionExpression: "attribute_not_exists(userId)",
          },
        },
        {
          Put: {
            TableName: cfg.phoneDirTable,
            Item: {
              phone: userItem.phone,
              userId: userItem.userId,
              createdAt: userItem.createdAt,
            },
            ConditionExpression: "attribute_not_exists(phone)",
          },
        },
      ],
    })
  );
};
