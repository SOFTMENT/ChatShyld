#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ChatShyldStack } from "../lib/chatshyld-stack";
import { env } from "process";

const app = new cdk.App();
new ChatShyldStack(app, "ChatshyldStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAIT_REGION,
  },
});
