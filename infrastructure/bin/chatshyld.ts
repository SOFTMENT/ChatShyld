#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
dotenv.config(); // loads JWT_SECRET etc from .env

import { ChatShyldStack } from "../lib/chatshyld-stack";
import { ChatRealtimeStack } from "../lib/chat-realtime-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Core REST/auth stack
const core = new ChatShyldStack(app, "ChatshyldStack", { env });

// Realtime (WebSocket + attachments) stack
const realtime = new ChatRealtimeStack(app, "ChatRealtimeStack", { env });

// (Optional) If you ever need cross-stack refs, you can pass outputs/props here.
