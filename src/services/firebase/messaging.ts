import Constants from 'expo-constants';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

import { getFirebaseAvailabilityMessage, isNativeFirebaseAvailable } from '@/src/services/firebase/app';

type FirebaseMessagingModule = typeof import('@react-native-firebase/messaging');

export type RemoteNotificationPayload = {
  id: string;
  title: string;
  body: string;
  data: Record<string, string>;
};

export type FirebasePushPermissionState = {
  granted: boolean;
  canAskAgain: boolean;
  status: 'authorized' | 'provisional' | 'denied' | 'not_determined' | 'granted' | 'unavailable';
};

function getMessagingModule(): FirebaseMessagingModule {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/messaging') as FirebaseMessagingModule;
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function getMessagingInstance() {
  return getMessagingModule().getMessaging();
}

export function isFirebaseMessagingAvailable() {
  try {
    getMessagingModule();
    return true;
  } catch {
    return false;
  }
}

export function getNotificationAppVersion() {
  return (
    Constants.expoConfig?.version ||
    Constants.nativeAppVersion ||
    '1.0.0'
  );
}

export async function getFirebasePushPermissionState(): Promise<FirebasePushPermissionState> {
  if (Platform.OS === 'web') {
    return {
      granted: false,
      canAskAgain: false,
      status: 'unavailable',
    };
  }

  if (Platform.OS === 'android') {
    if (Platform.Version < 33) {
      return {
        granted: true,
        canAskAgain: false,
        status: 'granted',
      };
    }

    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return {
      granted,
      canAskAgain: true,
      status: granted ? 'granted' : 'denied',
    };
  }

  const messagingModule = getMessagingModule();
  const messaging = getMessagingInstance();
  const status = await messagingModule.hasPermission(messaging);

  if (status === messagingModule.AuthorizationStatus.AUTHORIZED) {
    return {
      granted: true,
      canAskAgain: false,
      status: 'authorized',
    };
  }

  if (status === messagingModule.AuthorizationStatus.PROVISIONAL) {
    return {
      granted: true,
      canAskAgain: false,
      status: 'provisional',
    };
  }

  if (status === messagingModule.AuthorizationStatus.DENIED) {
    return {
      granted: false,
      canAskAgain: false,
      status: 'denied',
    };
  }

  return {
    granted: false,
    canAskAgain: true,
    status: 'not_determined',
  };
}

export async function requestFirebasePushPermission(): Promise<FirebasePushPermissionState> {
  if (Platform.OS === 'web') {
    return {
      granted: false,
      canAskAgain: false,
      status: 'unavailable',
    };
  }

  const messagingModule = getMessagingModule();
  const messaging = getMessagingInstance();

  await messagingModule.registerDeviceForRemoteMessages(messaging);

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return {
      granted: granted === PermissionsAndroid.RESULTS.GRANTED,
      canAskAgain: granted !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      status: granted === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied',
    };
  }

  if (Platform.OS === 'ios') {
    const status = await messagingModule.requestPermission(messaging, {
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    });
    if (status === messagingModule.AuthorizationStatus.AUTHORIZED) {
      return {
        granted: true,
        canAskAgain: false,
        status: 'authorized',
      };
    }

    if (status === messagingModule.AuthorizationStatus.PROVISIONAL) {
      return {
        granted: true,
        canAskAgain: false,
        status: 'provisional',
      };
    }

    if (status === messagingModule.AuthorizationStatus.DENIED) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }

    return {
      granted: false,
      canAskAgain: true,
      status: 'not_determined',
    };
  }

  return {
    granted: true,
    canAskAgain: false,
    status: 'granted',
  };
}

export async function getFirebasePushToken() {
  const messaging = getMessagingInstance();
  return getMessagingModule().getToken(messaging);
}

export function onFirebasePushTokenRefresh(listener: (token: string) => void) {
  return getMessagingModule().onTokenRefresh(getMessagingInstance(), listener);
}

export function onFirebaseForegroundMessage(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return getMessagingModule().onMessage(getMessagingInstance(), listener);
}

export function onFirebaseNotificationOpenedApp(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return getMessagingModule().onNotificationOpenedApp(getMessagingInstance(), listener);
}

export function getInitialFirebaseNotification() {
  return getMessagingModule().getInitialNotification(getMessagingInstance());
}

export function setFirebaseBackgroundMessageHandler(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<void>,
) {
  return getMessagingModule().setBackgroundMessageHandler(getMessagingInstance(), listener);
}

export function normalizeFirebaseRemoteNotification(
  message: FirebaseMessagingTypes.RemoteMessage | null | undefined,
): RemoteNotificationPayload | null {
  if (!message) {
    return null;
  }

  const notificationImage =
    message.notification?.android?.imageUrl ||
    String(message.data?.imageUrl || '') ||
    '';

  const rawData = Object.fromEntries(
    Object.entries(message.data || {}).map(([key, value]) => [key, String(value ?? '')]),
  );

  return {
    id: message.messageId || String(message.data?.notificationId || ''),
    title: message.notification?.title || String(message.data?.title || ''),
    body: message.notification?.body || String(message.data?.body || ''),
    data: notificationImage && !rawData.image && !rawData.imageUrl
      ? {
          ...rawData,
          image: notificationImage,
          imageUrl: notificationImage,
        }
      : rawData,
  };
}
