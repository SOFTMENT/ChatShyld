# ChatShyld — Backend

Node.js 22 + TypeScript (ESM) handlers for OTP auth, user profile, and S3 avatar uploads.

## Stack

- **API Gateway (HTTP API)** → **Lambda** handlers
- **DynamoDB**
  - `UsersTable` (PK: `userId`, GSI `gsi_phone` on `phone`)
  - `RefreshTokenTable` (PK: `tokenId`, GSI `gsi_user` on `userId`, TTL `ttl`)
- **S3** `AvatarsBucket` (keys under `avatar/{userId}/…`)

## Environment variables

Provided by CDK via function `environment`:

```bash
AWS_REGION=ap-south-1
JWT_SECRET=<random-long-secret>
JWT_TTL_SEC=7200

REFRESH_TTL_DAYS=30
REFRESH_PEPPER=<openssl rand -base64 64>

USERS_TABLE=<from stack>
PHONE_GSI=gsi_phone

REFRESH_TABLE=<from stack>

AVATARS_BUCKET=<from stack>
AVATAR_MAX_BYTES=2097152

TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_VERIFY_SID=VAXxxxxxxx
LOG_LEVEL=INFO
```

## Directory structure

```
backend/src/
├─ handlers/
│  ├─ auth/
│  │  ├─ send-otp.handler.ts
│  │  ├─ verify-otp.handler.ts
│  │  └─ refresh.handler.ts
│  ├─ users/
│  │  ├─ get-user.handler.ts
│  │  └─ update-user.handler.ts     # PATCH /profile/me
│  └─ profile/
│     └─ presign-avatar.handler.ts  # POST /profile/avatar/presign
├─ users/
│  ├─ user.repo.ts
│  ├─ user.types.ts
│  └─ user.public.ts
├─ refresh_token/
│  └─ refresh.repo.ts
└─ shared/
   ├─ config.ts
   ├─ http.ts
   ├─ logger.ts
   ├─ dynamodb.ts
   ├─ token.jwt.ts
   ├─ otp.twilio.ts
   └─ s3.ts
```

## API contracts

### Auth

**POST** `/auth/send-otp`  
Body: `{ "phone": "+9178..." }` → `{ "ok": true }`

**POST** `/auth/verify-otp`  
Body: `{ "phone": "+9178...", "code": "123456" }` →
```json
{
  "user": { "userId": "01H...", "phone": "+91...", "createdAt": "..." },
  "token": "<JWT access (HS256)>",
  "refreshToken": "<tokenId.secret>",
  "refreshExpiresAt": 1759999999
}
```

**POST** `/auth/refresh-token`  
Body: `{ "refreshToken": "<id.secret>" }` →
```json
{ "token": "<new access>", "refreshToken": "<new id.secret>", "refreshExpiresAt": 1759999999 }
```

### Users & Profiles

**GET** `/profile/me` → full private user; requires `Authorization: Bearer <token>`

**PATCH** `/profile/me` → body contains any subset:
```json
{ "name": "Vijay", "photoKey": "avatar/01H.../XYZ.jpg" }
```
Response: `{ "ok": true, "user": { ...updated } }`  
If `photoKey` changed, backend best‑effort deletes the previous S3 object.

**GET** `/profiles/{id}` → public shape (`userId`, `name`, `photoUrl`, `createdAt`)  
**GET** `/users/{id}` → full only if `sub === id` (or admin), else public subset / 403.

### Avatars

**POST** `/profile/avatar/presign`  
Body: `{ "contentType": "image/jpeg" }`  
Response:
```json
{
  "url": "https://<bucket>.s3.amazonaws.com/",
  "fields": { "...": "..." },
  "key": "avatar/<userId>/<ulid>.jpg",
  "publicUrl": "https://<bucket>.s3.amazonaws.com/avatar/<userId>/<ulid>.jpg",
  "maxBytes": 2097152
}
```

Upload by multipart/form-data to `url` with all `fields` + `file` field; expect **204**.

## Important server modules

### `shared/token.jwt.ts`
- `signToken(claims, ttlSec)` – HS256
- `verifyToken(token)` – throws `TokenError("invalid_token" | "token_expired")`
- `bearerFromHeaders(headers)`

### `refresh_token/refresh.repo.ts`
- Stores **HMAC(secret, REFRESH_PEPPER)** only (never raw secret)
- TTL on item for expiration
- Rotation on refresh

### `users/user.repo.ts`
- `findById`, `findByPhone`
- `create` (with conditional put)
- `updatePartial` (whitelist fields; sets `updatedAt` once; conditional exists)

### `handlers/profile/presign-avatar.handler.ts`
- Validates content type
- Builds key: `avatar/{sub}/{ulid()}.jpg`
- `createPresignedPost` with policy: `content-length-range` ≤ 2 MB, exact `Content-Type`

## Error model

- 400: `invalid_input`, `empty_patch`
- 401: `unauthorized`, `invalid_token`, `token_expired`
- 403: `forbidden`
- 404: `user_not_found`
- 500: `internal_error` (with structured log)

