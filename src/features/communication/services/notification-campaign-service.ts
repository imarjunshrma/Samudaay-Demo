import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { apiConfig } from '@/src/constants';
import type { FileValue } from '@/src/types';

export type AdminNotificationCampaignItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tag: string;
  icon: string;
  muted?: boolean;
  searchText: string;
};

export type NotificationCampaignsPageResponse = {
  items: AdminNotificationCampaignItem[];
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

function formatRelativeTime(value?: string | null) {
  if (!value) return 'Just now';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Just now';

  const diffMs = Date.now() - parsed.getTime();
  const diffMins = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatAudienceSummary(audienceJson: unknown) {
  if (!audienceJson || typeof audienceJson !== 'object') {
    return 'All users';
  }

  const audience = audienceJson as {
    allUsers?: boolean;
    roles?: string[];
    cities?: string[];
    userIds?: string[];
    audienceSegments?: string[];
    platforms?: string[];
    activeOnly?: boolean;
  };

  if (audience.allUsers === true) return 'All users';

  const parts: string[] = [];

  if (Array.isArray(audience.roles) && audience.roles.length > 0) {
    parts.push(`Roles: ${audience.roles.slice(0, 2).join(', ')}${audience.roles.length > 2 ? ' +' : ''}`);
  }

  if (Array.isArray(audience.cities) && audience.cities.length > 0) {
    parts.push(`Cities: ${audience.cities.slice(0, 2).join(', ')}${audience.cities.length > 2 ? ' +' : ''}`);
  }

  if (Array.isArray(audience.userIds) && audience.userIds.length > 0) {
    parts.push(`Users: ${audience.userIds.length}`);
  }

  if (Array.isArray(audience.audienceSegments) && audience.audienceSegments.length > 0) {
    const segmentLabels: Record<string, string> = {
      paid_donors: 'Paid donation people',
      matrimony_profiles: 'Matrimony profiles',
      family_profiles: 'People with family',
    };
    parts.push(audience.audienceSegments.map((segment) => segmentLabels[segment] || segment).join(', '));
  }

  if (Array.isArray(audience.platforms) && audience.platforms.length > 0) {
    parts.push(`Platforms: ${audience.platforms.join(', ')}`);
  }

  if (audience.activeOnly === true) {
    parts.push('Active only');
  }

  return parts.length ? parts.join(' • ') : 'Targeted audience';
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function resolveCampaignIcon(status?: string | null) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('send')) return 'send';
  if (normalized.includes('schedule')) return 'schedule';
  if (normalized.includes('complete')) return 'check-circle';
  if (normalized.includes('fail')) return 'error-outline';
  if (normalized.includes('draft')) return 'edit-note';
  return 'campaign';
}

type CreateCampaignPayload = {
  title: string;
  body: string;
  titleOverride?: string;
  bodyOverride?: string;
  audienceJson: {
    allUsers?: boolean;
    roles?: string[];
    userIds?: string[];
    audienceSegments?: string[];
  };
  dataJson?: {
    image?: string;
  };
  dataOverrideJson?: {
    image?: string;
  };
};

export const notificationCampaignService = {
  async createCampaign(payload: CreateCampaignPayload): Promise<void> {
    if (!isBackendApiConfigured()) throw new Error('Service not configured');
    const backendSession = await getBackendSessionContext();
    if (!backendSession) throw new Error('Not authenticated');

    await apiClient(
      apiEndpoints.communityNotificationCampaigns(backendSession.tenantId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
        token: backendSession.token,
      },
    );
  },

  async uploadCampaignImage(file: FileValue): Promise<string> {
    if (!isBackendApiConfigured()) throw new Error('Service not configured');
    const backendSession = await getBackendSessionContext();
    if (!backendSession) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'image/jpeg',
    } as never);

    const response = await apiClient<{ data: { path?: string | null } }>(
      apiEndpoints.communityNotificationCampaignImageUpload(backendSession.tenantId),
      {
        method: 'POST',
        body: formData,
        token: backendSession.token,
      },
    );

    const path = response.data?.path;
    if (!path) {
      throw new Error('Image upload failed.');
    }

    return resolveBackendMediaUrl(path) || path;
  },

  async loadAdminCampaigns(limit = 50) {
    if (!isBackendApiConfigured()) {
      return [] as AdminNotificationCampaignItem[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [] as AdminNotificationCampaignItem[];
    }

    const response = await apiClient<{
      data: {
        items: {
          id: string;
          titleOverride?: string | null;
          bodyOverride?: string | null;
          status?: string | null;
          createdAt?: string | null;
          scheduledAt?: string | null;
          audienceJson?: unknown;
          template?: { name?: string | null; key?: string | null } | null;
        }[];
      };
    }>(
      `${apiEndpoints.communityNotificationCampaigns(backendSession.tenantId)}?limit=${limit}`,
      { token: backendSession.token },
    );

    return (response.data.items ?? []).map((item) => {
      const title = item.titleOverride || item.template?.name || item.template?.key || 'Notification campaign';
      const description = item.bodyOverride || formatAudienceSummary(item.audienceJson);
      const time = formatRelativeTime(item.scheduledAt || item.createdAt);
      const tag = String(item.status || 'Draft');
      const searchText = `${title} ${description} ${tag} ${item.template?.name || ''} ${item.template?.key || ''}`.toLowerCase();

      return {
        id: item.id,
        title,
        description,
        time,
        tag,
        icon: resolveCampaignIcon(item.status),
        muted: ['draft', 'failed', 'canceled'].some((part) => String(item.status || '').toLowerCase().includes(part)),
        searchText,
      } satisfies AdminNotificationCampaignItem;
    });
  },
  async loadAdminCampaignsPage(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<NotificationCampaignsPageResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.status?.trim()) query.set('status', params.status.trim());

    const response = await apiClient<{
      data: {
        id: string;
        titleOverride?: string | null;
        bodyOverride?: string | null;
        status?: string | null;
        createdAt?: string | null;
        scheduledAt?: string | null;
        audienceJson?: unknown;
        template?: { name?: string | null; key?: string | null } | null;
      }[];
      pagination?: NotificationCampaignsPageResponse['pagination'];
    }>(
      `${apiEndpoints.communityNotificationCampaigns(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map((item) => {
        const title = item.titleOverride || item.template?.name || item.template?.key || 'Notification campaign';
        const description = item.bodyOverride || formatAudienceSummary(item.audienceJson);
        const time = formatRelativeTime(item.scheduledAt || item.createdAt);
        const tag = String(item.status || 'Draft');
        const searchText = `${title} ${description} ${tag} ${item.template?.name || ''} ${item.template?.key || ''}`.toLowerCase();

        return {
          id: item.id,
          title,
          description,
          time,
          tag,
          icon: resolveCampaignIcon(item.status),
          muted: ['draft', 'failed', 'canceled'].some((part) => String(item.status || '').toLowerCase().includes(part)),
          searchText,
        } satisfies AdminNotificationCampaignItem;
      }),
      pagination: response.pagination ?? null,
    };
  },
};
