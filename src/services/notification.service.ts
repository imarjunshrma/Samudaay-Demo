import { Alert, Platform } from 'react-native';

import { storageKeys } from '@/src/constants/storageKeys';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { ensurePushNotificationPermission, getPushNotificationPermissionStatus, type PermissionResult } from '@/src/services/device/app-permissions';
import { getFirebasePushToken, getNotificationAppVersion } from '@/src/services/firebase/messaging';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { storageService } from '@/src/services/storage.service';

let lastRegisteredPushTokenSignature: string | null = null;
const inFlightPushTokenRegistrations = new Map<string, Promise<unknown>>();

async function getOrCreateNotificationDeviceId() {
  const existing = await storageService.getItem(storageKeys.notificationDeviceId);
  if (existing) {
    return existing;
  }

  const created = `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  await storageService.setItem(storageKeys.notificationDeviceId, created);
  return created;
}

function buildPushTokenRegistrationSignature({
  tenantId,
  userId,
  token,
  platform,
  deviceId,
  appVersion,
}: {
  tenantId: string;
  userId: string;
  token: string;
  platform: string;
  deviceId: string;
  appVersion?: string;
}) {
  return [tenantId, userId, token, platform, deviceId, appVersion || ''].join('::');
}

export const notificationService = {
  async registerPushToken(token: string, appVersion?: string) {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const deviceId = await getOrCreateNotificationDeviceId();
    const signature = buildPushTokenRegistrationSignature({
      tenantId: backendSession.tenantId,
      userId: backendSession.userId,
      token,
      platform: Platform.OS,
      deviceId,
      appVersion,
    });

    if (signature === lastRegisteredPushTokenSignature) {
      return null;
    }

    const existingRegistration = inFlightPushTokenRegistrations.get(signature);
    if (existingRegistration) {
      return existingRegistration;
    }

    const registrationRequest = apiClient(
      apiEndpoints.communityNotificationPushToken(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          deviceId,
          appVersion,
        }),
      },
    )
      .then((result) => {
        lastRegisteredPushTokenSignature = signature;
        return result;
      })
      .finally(() => {
        inFlightPushTokenRegistrations.delete(signature);
      });

    inFlightPushTokenRegistrations.set(signature, registrationRequest);
    return registrationRequest;
  },

  async deactivatePushToken(token?: string) {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const deviceId = await getOrCreateNotificationDeviceId();
    lastRegisteredPushTokenSignature = null;

    return apiClient(
      apiEndpoints.communityNotificationPushToken(backendSession.tenantId),
      {
        method: 'DELETE',
        token: backendSession.token,
        body: JSON.stringify({
          token,
          deviceId,
        }),
      },
    );
  },

  async syncPushTokenIfAuthorized(): Promise<PermissionResult> {
    const permission = await getPushNotificationPermissionStatus({
      requestIfNeeded: false,
      showDeniedAlert: false,
      showBlockedAlert: false,
    });

    if (!permission.granted) {
      return permission;
    }

    const token = await getFirebasePushToken();
    if (token) {
      await this.registerPushToken(token, getNotificationAppVersion());
    }

    return permission;
  },

  async requestPushNotificationsOnFirstSignedInEntry(): Promise<PermissionResult> {
    const promptShown = await storageService.getItem(storageKeys.notificationPromptShown);
    const currentPermission = await getPushNotificationPermissionStatus({
      requestIfNeeded: false,
      showDeniedAlert: false,
      showBlockedAlert: false,
    });

    if (currentPermission.granted) {
      if (promptShown !== 'true') {
        await storageService.setItem(storageKeys.notificationPromptShown, 'true');
      }
      await this.syncPushTokenIfAuthorized();
      return currentPermission;
    }

    if (promptShown === 'true' || currentPermission.status === 'blocked') {
      return currentPermission;
    }

    const requestedPermission = await ensurePushNotificationPermission({
      requestIfNeeded: true,
      showDeniedAlert: false,
      showBlockedAlert: false,
    });

    await storageService.setItem(storageKeys.notificationPromptShown, 'true');

    if (requestedPermission.granted) {
      await this.syncPushTokenIfAuthorized();
    }

    return requestedPermission;
  },

  async enablePushNotifications(): Promise<PermissionResult> {
    const permission = await ensurePushNotificationPermission({
      requestIfNeeded: true,
      showDeniedAlert: true,
      showBlockedAlert: true,
    });

    if (!permission.granted) {
      return permission;
    }

    const token = await getFirebasePushToken();
    if (token) {
      await this.registerPushToken(token, getNotificationAppVersion());
    }

    Alert.alert('Notifications enabled', 'You will now receive community alerts on this device.');
    return permission;
  },
};
