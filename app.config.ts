import type { ExpoConfig } from "expo/config";
import { existsSync } from "fs";
import { resolve } from "path";

const DEFAULT_GOOGLE_SERVICES_JSON = "./firebase/google-services.json";
const DEFAULT_GOOGLE_SERVICES_INFO_PLIST = "./firebase/GoogleService-Info.plist";
const DEFAULT_ANDROID_PACKAGE = "com.samudaaay.demo";
const DEFAULT_IOS_BUNDLE_ID = "com.samudaaay.demo";
const APP_BACKGROUND_COLOR = "#f8f7f5";

function resolveExistingFilePath(value: string | undefined, label: string) {
  const filePath = value?.trim();

  if (!filePath) {
    return undefined;
  }

  const resolvedPath = resolve(process.cwd(), filePath);

  if (!existsSync(resolvedPath)) {
    console.warn(`[app.config] ${label} was not found at ${filePath}.`);
    return undefined;
  }

  return filePath;
}

function resolveFirebaseNativeConfigPath(
  envValue: string | undefined,
  defaultPath: string,
  label: string,
) {
  const configuredPath = envValue?.trim();
  return resolveExistingFilePath(configuredPath || defaultPath, label);
}

const googleServicesJson = resolveFirebaseNativeConfigPath(
  process.env.GOOGLE_SERVICES_JSON,
  DEFAULT_GOOGLE_SERVICES_JSON,
  "Android Firebase config",
);
const googleServicesInfoPlist = resolveFirebaseNativeConfigPath(
  process.env.GOOGLE_SERVICES_INFO_PLIST,
  DEFAULT_GOOGLE_SERVICES_INFO_PLIST,
  "iOS Firebase config",
);
const hasFirebaseNativeConfig = Boolean(
  googleServicesJson || googleServicesInfoPlist,
);
const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY?.trim() ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
  undefined;
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "";
const usesCleartextApi = apiBaseUrl.startsWith("http://");

const config: ExpoConfig = {
  name: "Samudaaay",
  slug: "samudaaay",
  owner: "bhaumik.darji",
  version: "3.0.2",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "samudaaay",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  runtimeVersion: {
    "policy": "appVersion"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      process.env.APP_IOS_BUNDLE_ID ?? DEFAULT_IOS_BUNDLE_ID,
    ...(googleMapsApiKey
      ? {
          config: {
            googleMapsApiKey,
          },
        }
      : {}),
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      ...(usesCleartextApi
        ? {
            NSAppTransportSecurity: {
              NSAllowsArbitraryLoads: true,
            },
          }
        : {}),
      LSApplicationQueriesSchemes: ["tez", "phonepe", "paytmmp", "gpay"],
      NSCameraUsageDescription:
        "Allow access to your camera to scan QR codes and capture photos for event and community features.",
      NSPhotoLibraryUsageDescription:
        "Allow access to your photos so you can upload profile images, chat images, event photos, and selected documents.",
      NSPhotoLibraryAddUsageDescription:
        "Allow saving exported files and images to your library when you choose to share or store them.",
      UIBackgroundModes: ["remote-notification"],
    },
    ...(googleServicesInfoPlist
      ? { googleServicesFile: googleServicesInfoPlist }
      : {}),
  },
  android: {
    package:
      process.env.APP_ANDROID_PACKAGE ?? DEFAULT_ANDROID_PACKAGE,
    ...(googleServicesJson ? { googleServicesFile: googleServicesJson } : {}),
    ...(googleMapsApiKey
      ? {
          config: {
            googleMaps: {
              apiKey: googleMapsApiKey,
            },
          },
        }
      : {}),
    permissions: ["android.permission.POST_NOTIFICATIONS"],
    ...(usesCleartextApi ? { usesCleartextTraffic: true } : {}),
    adaptiveIcon: {
      backgroundColor: "#ffffff",
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundImage: "./assets/images/adaptive-icon.png",
      monochromeImage: "./assets/images/adaptive-icon.png",
    },
    softwareKeyboardLayoutMode: "resize",
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-asset",
    "@config-plugins/react-native-blob-util",
    "@config-plugins/react-native-pdf",
    "./plugins/with-ios-non-modular-headers",
    ...(hasFirebaseNativeConfig
      ? ["@react-native-firebase/app", "@react-native-firebase/auth", "@react-native-firebase/messaging"]
      : []),
    [
      "expo-camera",
      {
        cameraPermission: "Allow access to your camera to scan QR codes and capture photos for event and community features.",
      },
    ],
    [
      "expo-image-picker",
      {
        cameraPermission: "Allow access to your camera to capture photos for event and community features.",
        photosPermission: "Allow access to your photos so you can upload profile images, chat images, event photos, and selected documents.",
      },
    ],
    [
      "expo-local-authentication",
      {
        faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID for biometric login.",
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          // RNFirebase pods import React headers across module boundaries. With
          // Expo 54 / RN 0.81, building them as frameworks can make Clang treat
          // RCTBridgeModule as belonging to RNFBApp, which breaks modules such
          // as RNFBFirestore. Keep each installed RNFirebase pod statically
          // linked while use_frameworks! remains enabled for Firebase's Swift
          // dependencies.
          forceStaticLinking: [
            "RNFBApp",
            "RNFBAuth",
            "RNFBFirestore",
            "RNFBMessaging",
            "RNFBStorage",
            "react-native-maps",
          ],
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: APP_BACKGROUND_COLOR,
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
    "extra": {
      "eas": {
        "projectId": "964c14ae-1212-4b7c-b8bc-2c375f0bbe8d"
      }
    }
};

export default config;
