import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';

export type BirthdaySettingItem = {
  key: string;
  enabled: boolean;
  description?: string | null;
};

async function getBackendSession() {
  if (!isBackendApiConfigured()) {
    return null;
  }

  return getBackendSessionContext();
}

export const birthdaySettingsService = {
  async list(): Promise<BirthdaySettingItem[]> {
    const backendSession = await getBackendSession();
    if (!backendSession) {
      return [];
    }

    const response = await apiClient<{ data: BirthdaySettingItem[] }>(
      apiEndpoints.communityBirthdaySettings(backendSession.tenantId),
      { token: backendSession.token },
    );

    return Array.isArray(response.data) ? response.data : [];
  },

  async update(settings: BirthdaySettingItem[]): Promise<BirthdaySettingItem[]> {
    const backendSession = await getBackendSession();
    if (!backendSession) {
      return settings;
    }

    const response = await apiClient<{ data: BirthdaySettingItem[] }>(
      apiEndpoints.communityBirthdaySettings(backendSession.tenantId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({ settings }),
      },
    );

    return Array.isArray(response.data) ? response.data : settings;
  },
};
