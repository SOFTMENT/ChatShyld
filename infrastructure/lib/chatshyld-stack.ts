import * as dotenv from "dotenv";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
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
import { S3 } from "aws-cdk-lib/aws-ses-actions";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ChatShyldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) TABLE, BUCKET

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

    const refreshTokenTable = new Table(this, "RefreshTokenTable", {
      partitionKey: { name: "tokenId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      timeToLiveAttribute: "ttl",
    });

    refreshTokenTable.addGlobalSecondaryIndex({
      indexName: "gsi_user",
      partitionKey: { name: "userId", type: AttributeType.STRING },
    });

    const phoneDirTable = new Table(this, "PhoneDirectoryTable", {
      partitionKey: { name: "phone", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const avatarBucket = new s3.Bucket(this, "AvatarBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      publicReadAccess: false,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.GET,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],
    });

    avatarBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ["s3:GetObject"],
        resources: [avatarBucket.arnForObjects("avatars/*")],
      })
    );

    // 2) Build a unified env for auth + refresh (so verifyOtp can issue refresh)

    const envCommon = {
      USERS_TABLE: usersTable.tableName,
      PHONE_GSI: "gsi_phone",
      JWT_SECRET: process.env.JWT_SECRET || "",
      JWT_TTL_SEC: "7200",
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
      TWILIO_VERIFY_SID: process.env.TWILIO_VERIFY_SID || "",
      LOG_LEVEL: process.env.LOG_LEVEL || "INFO",

      //PhoneDirectory
      PHONE_DIR_TABLE: phoneDirTable.tableName,

      // refresh-specific
      REFRESH_TABLE: refreshTokenTable.tableName,
      REFRESH_TTL_DAYS: process.env.REFRESH_TTL_DAYS || "30",
      REFRESH_PEPPER: process.env.REFRESH_PEPPER || "change-me",

      //Bucket
      AVATARS_BUCKET: avatarBucket.bucketName,
      AVATAR_MAX_BYTES: "2097152", // 2 MB
    };

    // 3) Functions

    const sendOtpFn = new NodejsFunction(this, "SendOtpFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/auth/send-otp.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: envCommon,
    });

    const verifyOtpFn = new NodejsFunction(this, "VerifyOtpFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/auth/verify-otp.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: envCommon,
    });

    const refreshTokenFn = new NodejsFunction(this, "RefreshTokenFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/auth/refresh.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(5),
      environment: envCommon,
    });

    const getUserFn = new NodejsFunction(this, "GetUserFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/users/get-user.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(5),
      environment: envCommon,
    });

    const updateUserFn = new NodejsFunction(this, "UpdateUserFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/users/update-user.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: envCommon,
    });

    const contactsLookupFn = new NodejsFunction(this, "ContactsLookupFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/contacts/lookup.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(10),
      environment: envCommon,
    });

    const presignAvatarFn = new NodejsFunction(this, "PresignAvatarFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(
        __dirname,
        "../../backend/src/handlers/users/presign-avatar.handler.ts"
      ),
      handler: "handler",
      timeout: Duration.seconds(5),
      environment: envCommon,
    });

    // 4) Permissions

    usersTable.grantReadWriteData(verifyOtpFn);
    usersTable.grantReadData(refreshTokenFn);
    usersTable.grantReadData(contactsLookupFn);
    usersTable.grantReadData(getUserFn);
    usersTable.grantReadWriteData(updateUserFn);

    refreshTokenTable.grantReadWriteData(refreshTokenFn);
    refreshTokenTable.grantWriteData(verifyOtpFn);

    avatarBucket.grantPut(presignAvatarFn);
    avatarBucket.grantDelete(updateUserFn);

    phoneDirTable.grantReadWriteData(verifyOtpFn);
    phoneDirTable.grantReadData(contactsLookupFn);

    // 5) Routes

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

    httpApi.addRoutes({
      path: "/auth/refresh",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "RefreshTokenIntegration",
        refreshTokenFn
      ),
    });

    httpApi.addRoutes({
      path: "/profile/me",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("GetUserIntegration", getUserFn),
    });

    httpApi.addRoutes({
      path: "/profile/me",
      methods: [HttpMethod.PATCH],
      integration: new HttpLambdaIntegration(
        "UpdateUserIntegration",
        updateUserFn
      ),
    });

    httpApi.addRoutes({
      path: "/contacts/lookup",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "ContactsLookupIntegration",
        contactsLookupFn
      ),
    });

    httpApi.addRoutes({
      path: "/profile/avatar/presign",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "PresignAvatarIntegration",
        presignAvatarFn
      ),
    });
  }
}
