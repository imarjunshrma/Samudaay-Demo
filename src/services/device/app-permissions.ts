import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

import { storageKeys } from '@/src/constants/storageKeys';
import {
  getFirebasePushPermissionState,
  requestFirebasePushPermission,
  type FirebasePushPermissionState,
} from '@/src/services/firebase/messaging';
import { storageService } from '@/src/services/storage.service';

export type PermissionResultStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

export type PermissionResult = {
  granted: boolean;
  status: PermissionResultStatus;
};

type PermissionAnalyticsEvent =
  | 'notification_permission_status'
  | 'camera_permission_status'
  | 'gallery_permission_status'
  | 'location_permission_status';

type PermissionKind = 'camera' | 'mediaLibrary' | 'notifications';

type PermissionCopy = {
  title: string;
  deniedMessage: string;
  blockedMessage: string;
};

type PermissionOptions = Partial<PermissionCopy> & {
  requestIfNeeded?: boolean;
  showDeniedAlert?: boolean;
  showBlockedAlert?: boolean;
};

type ExpoPermissionLike = {
  granted: boolean;
  canAskAgain: boolean;
};

const DEFAULT_COPY: Record<PermissionKind, PermissionCopy> = {
  camera: {
    title: 'Camera Access Required',
    deniedMessage: 'Allow camera access to continue.',
    blockedMessage: 'Camera access is disabled for this app. Enable it from app settings to continue.',
  },
  mediaLibrary: {
    title: 'Photo Access Required',
    deniedMessage: 'Allow photo library access to continue.',
    blockedMessage: 'Photo library access is disabled for this app. Enable it from app settings to continue.',
  },
  notifications: {
    title: 'Notifications Permission Required',
    deniedMessage: 'Allow notifications to receive alerts on this device.',
    blockedMessage: 'Notifications are disabled for this app. Enable them from app settings to receive alerts.',
  },
};

const pendingPermissionRequests = new Map<PermissionKind, Promise<PermissionResult>>();

function getPermissionPromptStorageKey(kind: PermissionKind) {
  switch (kind) {
    case 'camera':
      return storageKeys.cameraPermissionPromptShown;
    case 'mediaLibrary':
      return storageKeys.mediaLibraryPermissionPromptShown;
    case 'notifications':
      return storageKeys.notificationPromptShown;
  }
}

async function hasPermissionPromptBeenShown(kind: PermissionKind) {
  return (await storageService.getItem(getPermissionPromptStorageKey(kind))) === 'true';
}

async function markPermissionPromptShown(kind: PermissionKind) {
  await storageService.setItem(getPermissionPromptStorageKey(kind), 'true');
}

function logPermissionStatus(event: PermissionAnalyticsEvent, status: PermissionResultStatus, context: 'current' | 'requested') {
  console.info(JSON.stringify({
    event,
    status,
    context,
    timestamp: new Date().toISOString(),
  }));
}

function showDeniedAlert(copy: PermissionCopy) {
  Alert.alert(copy.title, copy.deniedMessage, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Open Settings',
      onPress: () => {
        void Linking.openSettings();
      },
    },
  ]);
}

function showBlockedAlert(copy: PermissionCopy) {
  Alert.alert(copy.title, copy.blockedMessage, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Open Settings',
      onPress: () => {
        void Linking.openSettings();
      },
    },
  ]);
}

function resolvePermissionState(permission: ExpoPermissionLike): PermissionResult {
  if (permission.granted) {
    return { granted: true, status: 'granted' };
  }

  if (!permission.canAskAgain) {
    return { granted: false, status: 'blocked' };
  }

  return { granted: false, status: 'denied' };
}

function maybeShowPermissionAlert(
  result: PermissionResult,
  copy: PermissionCopy,
  options: Pick<Required<PermissionOptions>, 'showDeniedAlert' | 'showBlockedAlert'>,
) {
  if (result.status === 'blocked' && options.showBlockedAlert) {
    showBlockedAlert(copy);
    return;
  }

  if (result.status === 'denied' && options.showDeniedAlert) {
    showDeniedAlert(copy);
  }
}

async function resolveExpoPermission(
  kind: PermissionKind,
  getCurrentPermission: () => Promise<ExpoPermissionLike>,
  requestPermission: () => Promise<ExpoPermissionLike>,
  options?: PermissionOptions,
): Promise<PermissionResult> {
  if (Platform.OS === 'web') {
    return { granted: true, status: 'granted' };
  }

  const resolvedOptions = {
    requestIfNeeded: true,
    showDeniedAlert: true,
    showBlockedAlert: true,
    ...options,
  };
  const copy = { ...DEFAULT_COPY[kind], ...options };
  const current = resolvePermissionState(await getCurrentPermission());
  logPermissionStatus(kind === 'camera' ? 'camera_permission_status' : 'gallery_permission_status', current.status, 'current');

  if (current.granted) {
    return current;
  }

  if (!resolvedOptions.requestIfNeeded) {
    maybeShowPermissionAlert(current, copy, resolvedOptions);
    return current;
  }

  if (current.status === 'blocked') {
    maybeShowPermissionAlert(current, copy, resolvedOptions);
    return current;
  }

  const existingRequest = pendingPermissionRequests.get(kind);
  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = requestPermission()
    .then((permission) => {
      const requested = resolvePermissionState(permission);
      logPermissionStatus(kind === 'camera' ? 'camera_permission_status' : 'gallery_permission_status', requested.status, 'requested');
      maybeShowPermissionAlert(requested, copy, resolvedOptions);
      return requested;
    })
    .then(async (result) => {
      await markPermissionPromptShown(kind);
      return result;
    })
    .finally(() => {
      pendingPermissionRequests.delete(kind);
    });

  pendingPermissionRequests.set(kind, requestPromise);
  return requestPromise;
}

function resolveNotificationPermissionState(permission: FirebasePushPermissionState): PermissionResult {
  if (permission.granted) {
    return { granted: true, status: 'granted' };
  }

  if (!permission.canAskAgain) {
    return { granted: false, status: 'blocked' };
  }

  return { granted: false, status: 'denied' };
}

async function resolveNotificationPermission(options?: PermissionOptions): Promise<PermissionResult> {
  if (Platform.OS === 'web') {
    return { granted: false, status: 'unavailable' };
  }

  const resolvedOptions = {
    requestIfNeeded: true,
    showDeniedAlert: true,
    showBlockedAlert: true,
    ...options,
  };
  const copy = { ...DEFAULT_COPY.notifications, ...options };
  const current = resolveNotificationPermissionState(await getFirebasePushPermissionState());
  logPermissionStatus('notification_permission_status', current.status, 'current');

  if (current.granted) {
    return current;
  }

  if (!resolvedOptions.requestIfNeeded) {
    maybeShowPermissionAlert(current, copy, resolvedOptions);
    return current;
  }

  if (current.status === 'blocked') {
    maybeShowPermissionAlert(current, copy, resolvedOptions);
    return current;
  }

  if (await hasPermissionPromptBeenShown('notifications')) {
    maybeShowPermissionAlert(current, copy, resolvedOptions);
    return current;
  }

  const existingRequest = pendingPermissionRequests.get('notifications');
  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = requestFirebasePushPermission()
    .then((permission) => {
      const requested = resolveNotificationPermissionState(permission);
      logPermissionStatus('notification_permission_status', requested.status, 'requested');
      maybeShowPermissionAlert(requested, copy, resolvedOptions);
      return requested;
    })
    .then(async (result) => {
      await markPermissionPromptShown('notifications');
      return result;
    })
    .finally(() => {
      pendingPermissionRequests.delete('notifications');
    });

  pendingPermissionRequests.set('notifications', requestPromise);
  return requestPromise;
}

export async function getCameraPermissionStatus(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveExpoPermission(
    'camera',
    () => Camera.getCameraPermissionsAsync(),
    () => Camera.requestCameraPermissionsAsync(),
    { showDeniedAlert: false, showBlockedAlert: false, ...options, requestIfNeeded: false },
  );
}

export async function ensureCameraPermission(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveExpoPermission(
    'camera',
    () => Camera.getCameraPermissionsAsync(),
    () => Camera.requestCameraPermissionsAsync(),
    options,
  );
}

export async function getMediaLibraryPermissionStatus(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveExpoPermission(
    'mediaLibrary',
    () => ImagePicker.getMediaLibraryPermissionsAsync(),
    () => ImagePicker.requestMediaLibraryPermissionsAsync(),
    { showDeniedAlert: false, showBlockedAlert: false, ...options, requestIfNeeded: false },
  );
}

export async function ensureMediaLibraryPermission(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveExpoPermission(
    'mediaLibrary',
    () => ImagePicker.getMediaLibraryPermissionsAsync(),
    () => ImagePicker.requestMediaLibraryPermissionsAsync(),
    options,
  );
}

export async function getPushNotificationPermissionStatus(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveNotificationPermission({ showDeniedAlert: false, showBlockedAlert: false, ...options, requestIfNeeded: false });
}

export async function ensurePushNotificationPermission(options?: PermissionOptions): Promise<PermissionResult> {
  return resolveNotificationPermission(options);
}

export function logLocationPermissionStatus(status: PermissionResultStatus, context: 'current' | 'requested' = 'current') {
  logPermissionStatus('location_permission_status', status, context);
}
