import Constants from 'expo-constants';
import { Platform } from 'react-native';

const firebaseOptions = {
  apiKey: Platform.select({
    ios: 'AIzaSyBsI2fdJCZhrLh62NUgk1oF635avHYmfJQ',
    default: 'AIzaSyAgaRKtvbS44PzZaquO25SOV-GxN4OgD3Q',
  }),
  appId: Platform.select({
    ios: '1:250408406241:ios:5d93e59e58555649027ba0',
    default: '1:250408406241:android:5f7f6a7c3eb6c002027ba0',
  }),
  messagingSenderId: '250408406241',
  projectId: 'samudaay-d0639',
  storageBucket: 'samudaay-d0639.firebasestorage.app',
};

function getFirebaseModuleError() {
  return new Error(
    'Native Firebase modules are unavailable. Use an Expo development build and rebuild after installing Firebase native packages.',
  );
}

export function isNativeFirebaseAvailable() {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const appModule = require('@react-native-firebase/app') as typeof import('@react-native-firebase/app');
    appModule.getApps();
    return true;
  } catch {
    return false;
  }
}

export function getFirebaseAvailabilityMessage() {
  if (Platform.OS === 'web') {
    return 'Firebase native modules are not supported on web in this app.';
  }

  if (Constants.appOwnership === 'expo') {
    return 'Firebase native modules are unavailable in Expo Go. Use an Expo development build.';
  }

  return getFirebaseModuleError().message;
}

function getFirebaseAppModule() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/app') as typeof import('@react-native-firebase/app');
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function getFirebaseAuthModule() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/auth') as typeof import('@react-native-firebase/auth');
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function getFirebaseFirestoreModule() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/firestore') as typeof import('@react-native-firebase/firestore');
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

export function getFirebaseApp() {
  return getFirebaseAppModule().getApp();
}

export async function ensureFirebaseApp() {
  const appModule = getFirebaseAppModule();

  try {
    return appModule.getApp();
  } catch {
    return appModule.initializeApp(firebaseOptions);
  }
}

export function getFirebaseAuthInstance() {
  return getFirebaseAuthModule().getAuth();
}

export function getFirebaseFirestoreInstance() {
  return getFirebaseFirestoreModule().getFirestore();
}

export function isFirebaseConfigured() {
  try {
    const appModule = getFirebaseAppModule();
    const existingApp = appModule.getApps()[0];

    if (!existingApp) {
      return true;
    }

    const options = existingApp.options;
    return Boolean(options.appId && options.projectId);
  } catch {
    return false;
  }
}
