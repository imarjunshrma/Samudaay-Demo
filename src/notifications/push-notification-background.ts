import {
  isFirebaseMessagingAvailable,
  normalizeFirebaseRemoteNotification,
  setFirebaseBackgroundMessageHandler,
} from '@/src/services/firebase/messaging';
import { displayForegroundNativeNotification } from './native-notification-service';

let hasRegisteredBackgroundHandler = false;

export function registerPushNotificationBackgroundHandler() {
  if (hasRegisteredBackgroundHandler || !isFirebaseMessagingAvailable()) {
    return;
  }

  hasRegisteredBackgroundHandler = true;

  setFirebaseBackgroundMessageHandler(async (message) => {
    if (message.notification) {
      return;
    }

    const payload = normalizeFirebaseRemoteNotification(message);
    if (!payload || (!payload.title && !payload.body)) {
      return;
    }

    await displayForegroundNativeNotification(payload);
  });
}

registerPushNotificationBackgroundHandler();
