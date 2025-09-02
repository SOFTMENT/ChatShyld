import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

/** Build a WS management client for this API Gateway domain/stage */
export const mgmtClient = (domain: string, stage: string) =>
  new ApiGatewayManagementApiClient({ endpoint: `https://${domain}/${stage}` });

/** Send a JSON payload to a connectionId */
export const sendJson = async (
  domain: string,
  stage: string,
  connectionId: string,
  payload: unknown
) => {
  const client = mgmtClient(domain, stage);
  const Data = Buffer.from(JSON.stringify(payload));
  await client.send(
    new PostToConnectionCommand({ ConnectionId: connectionId, Data })
  );
};
