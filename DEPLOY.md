# ChatShyld — Deploy & Ops

## 1) Prereqs

- AWS account + CLI configured
- Node.js 18+ (CDK), npm
- Flutter SDK
- Twilio Verify service set up

## 2) CDK bootstrap (once per account+region)

```bash
cd infrastructure
npm i
npx cdk bootstrap
```

## 3) Deploy stack

```bash
npx cdk deploy
```

Creates:
- DynamoDB (Users, RefreshTokens)
- S3 Avatars bucket
- Lambda functions
- HTTP API routes
- IAM perms

## 4) Environments

Use different stacks or parameters per stage (`dev`, `staging`, `prod`).  
Keep secrets in **SSM Parameter Store** or **Secrets Manager** and pass to Lambdas via CDK.

## 5) Post‑deploy sanity (Postman)

1. `POST /auth/send-otp` → `{ ok: true }`
2. `POST /auth/verify-otp` → get `{ token, refreshToken, user }`
3. `GET /profile/me` with Bearer token → user JSON
4. `POST /profile/avatar/presign` → `{ url, fields, key }`
5. Upload to S3 (204) → `PATCH /profile/me` with `{ photoKey: key }`

## 6) Flutter build & release

### Android
```bash
flutter build appbundle --release
# upload app/build/outputs/bundle/release/app-release.aab to Play Console
```

### iOS
- Open `ios/Runner.xcworkspace` in Xcode
- Ensure **Debug Information Format (Release) = DWARF with dSYM File**
- `Product > Archive` → upload via Organizer (check “Upload Debug Symbols”)
- If you used Transporter earlier and saw a dSYM warning, re‑upload symbols from Organizer

## 7) Logs & monitoring

- **CloudWatch Logs** for each Lambda
- Enable **AWS X-Ray** / Powertools tracing if needed
- Add Powertools Metrics for key counters (OTP requests, refreshes, errors)

## 8) Cost & scaling notes

- Lambda/HTTP API/DynamoDB are pay‑per‑use
- S3 storage + egress for avatars
- Twilio per‑OTP cost
- Prefer presigned uploads to avoid Lambda bandwidth

## 9) Security checklist

- Use long, random `JWT_SECRET` and `REFRESH_PEPPER`
- Least‑privilege IAM (grant only required table/bucket access to each function)
- Validate `photoKey` prefix: `avatar/{sub}/...`
- Short presign expiries (60–600s)
- Consider WAF/rate‑limit for auth endpoints

## 10) Future work

- CloudFront in front of S3 for avatars (custom domain, caching, optional signed URLs)
- Secrets Manager / SSM for secret rotation
- Add admin role claims and RBAC if needed
- E2EE message layer (key mgmt & encrypted storage)
