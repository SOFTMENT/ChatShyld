import {
  Duration,
  Stack,
  StackProps,
  RemovalPolicy,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Table,
  AttributeType,
  BillingMode,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Bucket, BlockPublicAccess, HttpMethods } from "aws-cdk-lib/aws-s3";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import {
  WebSocketApi,
  WebSocketStage,
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import {
  WebSocketLambdaIntegration,
  HttpLambdaIntegration,
} from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class ChatRealtimeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1) S3 bucket for attachments
    const attachments = new Bucket(this, "ChatAttachments", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // DEV ONLY
      autoDeleteObjects: true, // DEV ONLY
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [
            HttpMethods.POST,
            HttpMethods.PUT,
            HttpMethods.GET,
            HttpMethods.HEAD,
          ],
          allowedHeaders: ["*"],
          maxAge: 3600,
        },
      ],
    });

    // 2) DynamoDB tables
    const connections = new Table(this, "ConnectionsTable", {
      partitionKey: { name: "connectionId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.DESTROY, // DEV ONLY
    });
    connections.addGlobalSecondaryIndex({
      indexName: "gsi_user",
      partitionKey: { name: "userId", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    const conversations = new Table(this, "ConversationsTable", {
      partitionKey: { name: "convoId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // DEV ONLY
    });

    const messages = new Table(this, "MessagesTable", {
      partitionKey: { name: "convoId", type: AttributeType.STRING },
      sortKey: { name: "messageId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // DEV ONLY
    });
    messages.addGlobalSecondaryIndex({
      indexName: "gsi_user_time",
      partitionKey: { name: "toUser", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
    });

    // 3) Lambda env
    const env = {
      USERS_TABLE: process.env.USERS_TABLE ?? "",
      JWT_SECRET: process.env.JWT_SECRET ?? "",
      ATTACH_BUCKET: attachments.bucketName,
      CONN_TABLE: connections.tableName,
      MSG_TABLE: messages.tableName,
      CONVO_TABLE: conversations.tableName,
    };

    const nodeDefaults = {
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(10),
      bundling: { minify: true, sourcesContent: false },
      environment: env,
    };

    // 4) Lambdas
    const connectFn = new NodejsFunction(this, "WsConnectFn", {
      ...nodeDefaults,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/connect.handler.ts"
      ),
      handler: "handler",
    });

    const disconnectFn = new NodejsFunction(this, "WsDisconnectFn", {
      ...nodeDefaults,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/disconnect.handler.ts"
      ),
      handler: "handler",
    });

    const messageFn = new NodejsFunction(this, "WsSendMessageFn", {
      ...nodeDefaults,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/send-message.handler.ts"
      ),
      handler: "handler",
    });

    const typingFn = new NodejsFunction(this, "WsTypingFn", {
      ...nodeDefaults,
      timeout: Duration.seconds(5),
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/typing.handler.ts"
      ),
      handler: "handler",
    });

    const pingFn = new NodejsFunction(this, "WsPingFn", {
      ...nodeDefaults,
      timeout: Duration.seconds(5),
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/ping.handler.ts"
      ),
      handler: "handler",
    });

    const initUploadFn = new NodejsFunction(this, "InitUploadFn", {
      ...nodeDefaults,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/attachments/init-upload.handler.ts"
      ),
      handler: "handler",
    });

    const defaultFn = new NodejsFunction(this, "WsDefaultFn", {
      ...nodeDefaults,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/realtime/default.handler.ts"
      ),
      handler: "handler",
    });

    // 5) Permissions
    // For presigned POST, the signer must be allowed to PutObject on the bucket/key
    attachments.grantPut(initUploadFn);
    // messageFn might read objects (optional)
    attachments.grantRead(messageFn);

    connections.grantReadWriteData(connectFn);
    connections.grantReadWriteData(disconnectFn);
    connections.grantReadWriteData(pingFn);
    connections.grantReadData(messageFn);
    connections.grantReadData(typingFn);

    conversations.grantReadWriteData(messageFn);
    messages.grantReadWriteData(messageFn);

    // 6) WebSocket API
    const ws = new WebSocketApi(this, "ChatWsApi", {
      routeSelectionExpression: "$request.body.action",
    });
    const stage = new WebSocketStage(this, "ProdWsStage", {
      webSocketApi: ws,
      stageName: "prod",
      autoDeploy: true,
    });

    // Allow ManageConnections from this stage
    const manageConn = new iam.PolicyStatement({
      actions: ["execute-api:ManageConnections"],
      resources: [
        `arn:aws:execute-api:${this.region}:${this.account}:${ws.apiId}/${stage.stageName}/POST/@connections/*`,
      ],
    });
    messageFn.addToRolePolicy(manageConn);
    typingFn.addToRolePolicy(manageConn);
    pingFn.addToRolePolicy(manageConn);

    ws.addRoute("$connect", {
      integration: new WebSocketLambdaIntegration("ConnectInt", connectFn),
    });
    ws.addRoute("$disconnect", {
      integration: new WebSocketLambdaIntegration(
        "DisconnectInt",
        disconnectFn
      ),
    });

    ws.addRoute("sendMessage", {
      integration: new WebSocketLambdaIntegration("MsgInt", messageFn),
    });
    ws.addRoute("typing", {
      integration: new WebSocketLambdaIntegration("TypingInt", typingFn),
    });
    ws.addRoute("ping", {
      integration: new WebSocketLambdaIntegration("PingInt", pingFn),
    });

    ws.addRoute("$default", {
      integration: new WebSocketLambdaIntegration("DefaultInt", defaultFn),
    });
    // 7) REST for presign
    const httpApi = new HttpApi(this, "ChatHttp", {
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
        allowHeaders: ["*"],
      },
    });
    httpApi.addRoutes({
      path: "/attachments/init-upload",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration("InitUploadInt", initUploadFn),
    });

    // 8) Outputs
    new CfnOutput(this, "WsUrl", {
      value: `${ws.apiEndpoint}/${stage.stageName}`,
    });
    new CfnOutput(this, "HttpUrl", { value: httpApi.apiEndpoint });
    new CfnOutput(this, "AttachmentsBucket", { value: attachments.bucketName });
  }
}
