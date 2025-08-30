# ChatShyld — Frontend (Flutter)

Flutter app using **Dio**, **go_router**, **Provider**, and **Secure Storage**.

## Packages (key)

- `dio` – HTTP + interceptors + progress
- `go_router` – navigation + redirect guard
- `provider` – app state (`AuthState`)
- `flutter_secure_storage` – tokens
- `image_picker`, `flutter_image_compress` – avatar selection & compression
- `logger` – structured logs

## App flow

1. On start, `AuthState.bootstrap()`:
   - Load tokens; refresh if expired
   - GET `/profile/me` → set `me` + `status=authed`
2. `go_router.redirect` decides:
   - anon → Entry/Login
   - authed + `name` empty → SetupProfile
   - authed + complete → Home
3. After login (verify‑otp), call `auth.bootstrap()` and let router redirect.
4. After profile update, call `auth.setUser(updatedUser)`.

## Network layer

- A single `DioClient` with:
  - Base URL
  - **Auth interceptor** adds `Authorization` and retries once on 401 using `/auth/refresh-token`
  - `TokenStorage` (secure storage for `access`/`refresh`)

### Upload to S3 (presigned POST)

```dart
Future<void> uploadToS3PresignedPost(
  String url,
  Map<String, dynamic> fields,
  File file,
  void Function(int sent, int total) onProgress,
) async {
  final form = FormData();
  fields.forEach((k, v) => form.fields.add(MapEntry(k, v.toString())));
  form.files.add(MapEntry('file', await MultipartFile.fromFile(file.path, filename: 'avatar.jpg')));

  final resp = await Dio().post(url, data: form, onSendProgress: onProgress);
  if (resp.statusCode != 204) {
    throw Exception('Upload failed: ${resp.statusCode}');
  }
}
```

### Profile API

```dart
class ProfileApi {
  final Dio _dio;
  ProfileApi(this._dio);

  Future<User> getMe() async { /* GET /profile/me, parse User */ }
  Future<User> updateMe({String? name, String? photoKey}) async { /* PATCH /profile/me */ }
}
```

## Auth state

```dart
enum AuthStatus { unknown, authed, anon }

class AuthState extends ChangeNotifier {
  final AuthRepository authRepo;
  final TokenStorage storage;
  final ProfileApi profileApi;
  AuthStatus status = AuthStatus.unknown;
  User? me;

  bool get needsProfile => status == AuthStatus.authed && ((me?.name ?? '').trim().isEmpty);

  Future<void> bootstrap() async { /* load/refresh tokens; fetch me; notify; */ }
  Future<void> logout() async { /* clear tokens; notify; */ }
  void setUser(User u) { me = u; notifyListeners(); }
}
```

## Routing (go_router)

- `refreshListenable: auth`
- `redirect` rules:
  - `unknown` → allow Splash/Welcome
  - `!authed` → Entry/Login/Verify only
  - `authed && needsProfile` → `/setup-profile`
  - else → `/home`

## Avatar upload UX

1. Pick → compress (target < 2 MB)
2. `POST /profile/avatar/presign` with `contentType`
3. `uploadToS3PresignedPost(url, fields, file, onProgress)`
4. `PATCH /profile/me` `{ name?, photoKey }`
5. `auth.setUser(updatedUser)`

## Error handling

- Dio throws for non‑2xx → map to `ApiError(status, code, message)`
- Show snackbars/toasts for `code` messages (`invalid_token`, `empty_patch`, etc.)
- Interceptor auto‑refreshes once on 401; if refresh fails, logout and route to login.

## Theming & Icons

- Global font family via `ThemeData.textTheme.apply(fontFamily: 'Poppins')`
- Override per‑widget using `TextStyle(fontFamily: 'Inter')`
- Icons: Material, Phosphor/FontAwesome/etc. as needed
