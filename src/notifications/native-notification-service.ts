import { Platform } from 'react-native';

import { storageKeys } from '@/src/constants/storageKeys';
import type { RemoteNotificationPayload } from '@/src/services/firebase/messaging';
import { storageService } from '@/src/services/storage.service';

const NATIVE_NOTIFICATION_CHANNEL_ID = 'community-alerts';
const NATIVE_NOTIFICATION_PRESS_ACTION_ID = 'default';
const RECENT_NOTIFICATION_WINDOW_MS = 60_000;

type NotifeeModule = typeof import('@notifee/react-native');

let cachedModule: NotifeeModule | null | undefined;
let channelInitPromise: Promise<string | null> | null = null;
const recentlyHandledNotifications = new Map<string, number>();

function getNotifeeModule(): NotifeeModule | null {
  if (cachedModule !== undefined) {
    return cachedModule;
  }

  if (Platform.OS === 'web') {
    cachedModule = null;
    return cachedModule;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('@notifee/react-native') as NotifeeModule;
    return cachedModule;
  } catch {
    cachedModule = null;
    return cachedModule;
  }
}

function getNotificationDisplayModule() {
  const module = getNotifeeModule();
  if (!module) {
    return null;
  }

  return module.default;
}

function getPayloadId(payload: Pick<RemoteNotificationPayload, 'id' | 'data' | 'title' | 'body'>) {
  return payload.id || payload.data.notificationId || `${payload.title}:${payload.body}`;
}

function cleanupRecentNotificationCache() {
  const now = Date.now();
  recentlyHandledNotifications.forEach((timestamp, key) => {
    if (now - timestamp > RECENT_NOTIFICATION_WINDOW_MS) {
      recentlyHandledNotifications.delete(key);
    }
  });
}

function markNotificationHandled(notificationId: string) {
  cleanupRecentNotificationCache();
  recentlyHandledNotifications.set(notificationId, Date.now());
}

function shouldSkipNotification(notificationId: string) {
  cleanupRecentNotificationCache();
  const existing = recentlyHandledNotifications.get(notificationId);
  return typeof existing === 'number' && Date.now() - existing < RECENT_NOTIFICATION_WINDOW_MS;
}

function serializePayload(payload: RemoteNotificationPayload): Record<string, string> {
  return {
    ...payload.data,
    __notificationId: getPayloadId(payload),
    __notificationTitle: payload.title,
    __notificationBody: payload.body,
  };
}

function parseStoredPayload(value?: Record<string, string> | null): RemoteNotificationPayload | null {
  if (!value) {
    return null;
  }

  const title = value.__notificationTitle || '';
  const body = value.__notificationBody || '';
  const id = value.__notificationId || '';

  const { __notificationId, __notificationTitle, __notificationBody, ...data } = value;

  if (!title && !body && !id) {
    return null;
  }

  return {
    id: id || `${title}:${body}`,
    title,
    body,
    data,
  };
}

function normalizeNotificationImageUrl(value?: string | null) {
  const normalized = String(value || '').trim();
  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return undefined;
  }

  if (/^(file|content):\/\//i.test(normalized)) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getNotificationImage(payload: Pick<RemoteNotificationPayload, 'data'>) {
  return normalizeNotificationImageUrl(payload.data.image || payload.data.imageUrl);
}

async function storePendingNotificationPress(payload: RemoteNotificationPayload) {
  await storageService.setItem(storageKeys.pendingNotificationOpen, JSON.stringify(payload));
}

export async function consumePendingNotificationPress() {
  const stored = await storageService.getItem(storageKeys.pendingNotificationOpen);
  if (!stored) {
    return null;
  }

  await storageService.removeItem(storageKeys.pendingNotificationOpen);

  try {
    return JSON.parse(stored) as RemoteNotificationPayload;
  } catch {
    return null;
  }
}

export async function ensureNativeNotificationChannel() {
  if (Platform.OS !== 'android') {
    return null;
  }

  if (channelInitPromise) {
    return channelInitPromise;
  }

  const module = getNotifeeModule();
  const notifee = getNotificationDisplayModule();
  if (!module || !notifee) {
    return null;
  }

  const { AndroidImportance, AndroidVisibility } = module;
  channelInitPromise = notifee.createChannel({
    id: NATIVE_NOTIFICATION_CHANNEL_ID,
    name: 'Community alerts',
    description: 'Announcements, reminders, and community updates',
    badge: true,
    importance: AndroidImportance.HIGH,
    lights: true,
    vibration: true,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });

  return channelInitPromise;
}

export async function displayForegroundNativeNotification(payload: RemoteNotificationPayload) {
  const module = getNotifeeModule();
  const notifee = getNotificationDisplayModule();
  if (!module || !notifee || (!payload.title && !payload.body)) {
    return;
  }

  const notificationId = getPayloadId(payload);
  if (shouldSkipNotification(notificationId)) {
    return;
  }

  markNotificationHandled(notificationId);

  const { AndroidImportance, AndroidVisibility } = module;
  const channelId = await ensureNativeNotificationChannel();
  const notificationImage = getNotificationImage(payload);

  try {
    await notifee.displayNotification({
      id: notificationId,
      title: payload.title || 'Notification',
      body: payload.body || '',
      data: serializePayload(payload),
      android: channelId
        ? {
            channelId,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            pressAction: {
              id: NATIVE_NOTIFICATION_PRESS_ACTION_ID,
            },
            autoCancel: true,
            lightUpScreen: true,
            largeIcon: notificationImage,
            smallIcon: 'ic_launcher',
            sound: 'default',
            style: notificationImage
              ? {
                  type: module.AndroidStyle.BIGPICTURE,
                  picture: notificationImage,
                  largeIcon: notificationImage,
                }
              : undefined,
            showTimestamp: true,
            timestamp: Date.now(),
          }
        : undefined,
      ios: {
        attachments: notificationImage
          ? [
              {
                url: notificationImage,
              },
            ]
          : undefined,
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          list: true,
          sound: true,
        },
      },
    });
  } catch {
    await notifee.displayNotification({
      id: notificationId,
      title: payload.title || 'Notification',
      body: payload.body || '',
      data: serializePayload(payload),
      android: channelId
        ? {
            channelId,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            pressAction: {
              id: NATIVE_NOTIFICATION_PRESS_ACTION_ID,
            },
            autoCancel: true,
            lightUpScreen: true,
            smallIcon: 'ic_launcher',
            sound: 'default',
            showTimestamp: true,
            timestamp: Date.now(),
          }
        : undefined,
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          list: true,
          sound: true,
        },
      },
    });
  }
}

export function subscribeToForegroundNotificationPress(
  listener: (payload: RemoteNotificationPayload) => void,
) {
  const module = getNotifeeModule();
  const notifee = getNotificationDisplayModule();
  if (!module || !notifee) {
    return () => {
      return;
    };
  }

  const { EventType } = module;
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type !== EventType.PRESS && type !== EventType.ACTION_PRESS) {
      return;
    }

    const payload = parseStoredPayload(detail.notification?.data as Record<string, string> | undefined);
    if (!payload) {
      return;
    }

    listener(payload);
  });
}

export async function getInitialNativeNotificationPress() {
  const notifee = getNotificationDisplayModule();
  if (!notifee) {
    return null;
  }

  const initialNotification = await notifee.getInitialNotification();
  return parseStoredPayload(initialNotification?.notification?.data as Record<string, string> | undefined);
}

function registerBackgroundNotificationHandler() {
  const module = getNotifeeModule();
  const notifee = getNotificationDisplayModule();
  if (!module || !notifee) {
    return;
  }

  const { EventType } = module;
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type !== EventType.PRESS && type !== EventType.ACTION_PRESS) {
      return;
    }

    const payload = parseStoredPayload(detail.notification?.data as Record<string, string> | undefined);
    if (!payload) {
      return;
    }

    await storePendingNotificationPress(payload);
  });
}

registerBackgroundNotificationHandler();
