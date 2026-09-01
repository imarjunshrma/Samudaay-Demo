import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';

export type TenantSummary = {
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  metrics: {
    userCount: number;
    donationCount: number;
    eventCount: number;
    expenseCount: number;
  };
};

export type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  permissions?: Record<string, boolean> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const adminService = {
  async loadTenantSummary(): Promise<TenantSummary | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: TenantSummary }>(
        apiEndpoints.communityTenantSummary(backendSession.tenantId),
        { token: backendSession.token },
      );
      return response.data;
    } catch {
      return null;
    }
  },

  async loadAdmins(): Promise<AdminUser[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [];
    }

    try {
      const response = await apiClient<{ data: AdminUser[] }>(apiEndpoints.adminAdmins, {
        token: backendSession.token,
      });
      return response.data ?? [];
    } catch {
      return [];
    }
  },
};
