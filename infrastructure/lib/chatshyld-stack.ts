import * as dotenv from "dotenv";
dotenv.config();
import { Duration, Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path from "path";
import {
  HttpApi,
  CorsHttpMethod,
  HttpMethod,
  HttpStage,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ChatShyldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersTable = new Table(this, "UsersTable", {
      partitionKey: { name: "userId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    usersTable.addGlobalSecondaryIndex({
      indexName: "gsi_phone",
      partitionKey: { name: "phone", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    const env = {
      USERS_TABLE: usersTable.tableName,
      PHONE_GSI: "gsi_phone",
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_TTL_SEC: "7200",
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
      TWILIO_VERIFY_SID: process.env.TWILIO_VERIFY_SID || "",
      LOG_LEVEL: process.env.LOG_LEVEL || "INFO",
    };

    const sendOtpFn = new NodejsFunction(this, "SendOtpFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../../backend/src/auth/send-otp.handler.ts"),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: env,
    });

    const verifyOtpFn = new NodejsFunction(this, "VerifyOtpFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/auth/verify-otp.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: env,
    });

    usersTable.grantReadWriteData(verifyOtpFn);

    const httpApi = new HttpApi(this, "ChatShyldHttpApi", {
      apiName: "ChatShyldApi",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ["*"],
      },
    });

    new HttpStage(this, "ProdStage", {
      httpApi,
      stageName: "prod",
      autoDeploy: true,
      throttle: { rateLimit: 30, burstLimit: 50 },
    });

    httpApi.addRoutes({
      path: "/auth/send-otp",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration("SendOtpIntegration", sendOtpFn),
    });

    httpApi.addRoutes({
      path: "/auth/verify-otp",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "VerifyOtpIntegration",
        verifyOtpFn
      ),
    });
  }
}
