# ChatShyld

A modern, mobile‑first chat stack.

**Frontend**: Flutter + Dio + go_router + Provider  
**Backend**: AWS Lambda (Node.js 22 + TypeScript, ESM) + API Gateway (HTTP API) + DynamoDB + S3  
**Infra**: AWS CDK (TypeScript)  
**Auth**: Twilio Verify → short‑lived JWT (HS256) + rotating refresh tokens (HMAC)  
**Media**: Direct‑to‑S3 uploads via presigned **POST** (with on‑device progress)

## Docs

- [BACKEND.md](BACKEND.md)
- [FRONTEND.md](FRONTEND.md)
- [DEPLOY.md](DEPLOY.md)

## Repo layout

```
chatshyld/
├─ frontend/                     # Flutter app
├─ backend/                      # Lambda source (Node 22 + TS/ESM)
└─ infrastructure/               # AWS CDK app (TypeScript)
```
