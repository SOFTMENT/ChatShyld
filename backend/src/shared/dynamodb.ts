import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { cfg } from "./config";

export const dynamoClient = new DynamoDBClient({ region: cfg.region });
export const dynamoDoc = DynamoDBDocumentClient.from(dynamoClient);
