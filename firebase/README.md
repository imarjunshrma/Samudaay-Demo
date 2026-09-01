# Firebase native config

Place the client Firebase native app files here before creating a development or production build:

- `google-services.json` for Android
- `GoogleService-Info.plist` for iOS

These files are intentionally ignored by Git because they are client-specific. If the client keeps them somewhere else, set these env vars instead:

```bash
GOOGLE_SERVICES_JSON=./path/to/google-services.json
GOOGLE_SERVICES_INFO_PLIST=./path/to/GoogleService-Info.plist
```

The Firebase Android package name and iOS bundle ID must match:

```bash
APP_ANDROID_PACKAGE=com.client.app
APP_IOS_BUNDLE_ID=com.client.app
```
