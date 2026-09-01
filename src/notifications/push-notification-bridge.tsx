import { usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';

import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { notificationFeedService } from '@/src/features/communication/services/notification-feed-service';
import { notificationService } from '@/src/services/notification.service';
import {
  getInitialFirebaseNotification,
  isFirebaseMessagingAvailable,
  normalizeFirebaseRemoteNotification,
  onFirebaseForegroundMessage,
  onFirebaseNotificationOpenedApp,
  onFirebasePushTokenRefresh,
  type RemoteNotificationPayload,
} from '@/src/services/firebase/messaging';
import {
  consumePendingNotificationPress,
  displayForegroundNativeNotification,
  ensureNativeNotificationChannel,
  getInitialNativeNotificationPress,
  subscribeToForegroundNotificationPress,
} from './native-notification-service';
import { resolveNotificationRoute } from './push-notification-routing';

const DUPLICATE_NAVIGATION_WINDOW_MS = 1500;

function getRoutePathname(route: ReturnType<typeof resolveNotificationRoute>) {
  return typeof route === 'string' ? route : route.pathname;
}

function getRouteSignature(route: ReturnType<typeof resolveNotificationRoute>) {
  if (typeof route === 'string') {
    return route;
  }

  const params = route.params
    ? JSON.stringify(
        Object.entries(route.params)
          .sort(([left], [right]) => left.localeCompare(right)),
      )
    : '';

  return `${route.pathname}?${params}`;
}

export function PushNotificationBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, status } = useSession();
  const initialNotificationHandledRef = useRef(false);
  const pendingNotificationRef = useRef<RemoteNotificationPayload | null>(null);
  const lastNavigationRef = useRef<{ key: string; at: number } | null>(null);

  const openNotificationRoute = useCallback((payload: RemoteNotificationPayload) => {
    const notificationId = payload.id || payload.data.notificationId || `${payload.title}:${payload.body}`;
    const route = resolveNotificationRoute(payload, {
      isAdminLike: isAdminLikeSession(session),
    });
    const routeSignature = getRouteSignature(route);
    const navigationKey = `${notificationId}|${routeSignature}`;
    const lastNavigation = lastNavigationRef.current;
    if (lastNavigation && lastNavigation.key === navigationKey && Date.now() - lastNavigation.at < DUPLICATE_NAVIGATION_WINDOW_MS) {
      return;
    }

    const targetPathname = getRoutePathname(route);
    if (pathname === targetPathname && lastNavigation && lastNavigation.key === navigationKey && Date.now() - lastNavigation.at < DUPLICATE_NAVIGATION_WINDOW_MS) {
      return;
    }

    lastNavigationRef.current = {
      key: navigationKey,
      at: Date.now(),
    };
    router.push(route as never);
  }, [pathname, router, session]);

  const handleNotificationOpen = useCallback((payload: RemoteNotificationPayload) => {
    notificationFeedService.ingestIncomingNotification(payload);

    if (status !== 'signedIn' || !session) {
      pendingNotificationRef.current = payload;
      return;
    }

    openNotificationRoute(payload);
  }, [openNotificationRoute, session, status]);

  useEffect(() => {
    void ensureNativeNotificationChannel();
  }, []);

  useEffect(() => {
    if (status !== 'signedIn' || !session || !pendingNotificationRef.current) {
      return;
    }

    const queuedPayload = pendingNotificationRef.current;
    pendingNotificationRef.current = null;
    openNotificationRoute(queuedPayload);
  }, [openNotificationRoute, session, status]);

  useEffect(() => {
    if (status !== 'signedIn' || !session || !isFirebaseMessagingAvailable()) {
      return;
    }

    notificationService.requestPushNotificationsOnFirstSignedInEntry()
      .catch(() => {
        return;
      });
  }, [session, status]);

  useEffect(() => {
    const unsubscribeForegroundPress = subscribeToForegroundNotificationPress((payload) => {
      handleNotificationOpen(payload);
    });

    if (!initialNotificationHandledRef.current) {
      initialNotificationHandledRef.current = true;

      consumePendingNotificationPress()
        .then((payload) => {
          if (payload) {
            handleNotificationOpen(payload);
          }
        })
        .catch(() => {
          return;
        });

      getInitialNativeNotificationPress()
        .then((payload) => {
          if (payload) {
            handleNotificationOpen(payload);
          }
        })
        .catch(() => {
          return;
        });
    }

    return () => {
      unsubscribeForegroundPress();
    };
  }, [handleNotificationOpen]);

  useEffect(() => {
    if (!isFirebaseMessagingAvailable()) {
      return;
    }

    const unsubscribeForeground = onFirebaseForegroundMessage((message) => {
      const payload = normalizeFirebaseRemoteNotification(message);
      if (!payload || (!payload.title && !payload.body)) {
        return;
      }

      notificationFeedService.ingestIncomingNotification(payload);
      void displayForegroundNativeNotification(payload);
    });

    const unsubscribeTokenRefresh = onFirebasePushTokenRefresh(() => {
      void notificationService.syncPushTokenIfAuthorized();
    });

    const unsubscribeNotificationOpen = onFirebaseNotificationOpenedApp((message) => {
      const payload = normalizeFirebaseRemoteNotification(message);
      if (payload) {
        handleNotificationOpen(payload);
      }
    });

    if (!initialNotificationHandledRef.current) {
      initialNotificationHandledRef.current = true;
    }

    getInitialFirebaseNotification()
      .then((message) => {
        const payload = normalizeFirebaseRemoteNotification(message);
        if (payload) {
          handleNotificationOpen(payload);
        }
      })
      .catch(() => {
        return;
      });

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh();
      unsubscribeNotificationOpen();
    };
  }, [handleNotificationOpen]);

  return null;
}
