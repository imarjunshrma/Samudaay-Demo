import { apiConfig } from '@/src/constants';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext } from '@/src/features/auth/services/backend-session';
import type { FileValue } from '@/src/types';

export type PublicationRecord = {
  id: string;
  title: string;
  description: string;
  issueNo: string | null;
  edition: string;
  month: number | null;
  year: number | null;
  coverImageUrl: string | null;
  status: 'DRAFT' | 'GENERATED' | 'PUBLISHED' | 'ARCHIVED';
  publicationType: 'SYSTEM_GENERATED' | 'MANUAL_UPLOAD';
  fileUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  includeAds: boolean;
  includeMatrimony: boolean;
  maxProfiles: number | null;
  templateLayout: string | null;
  generatedAt: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdByUserId: string | null;
  summary: {
    advertisementCount: number;
    matrimonyCount: number;
  };
  canManage: boolean;
};

export type PublicationCreateInput = {
  title: string;
  description?: string;
  month: number;
  year: number;
  publicationType: 'SYSTEM_GENERATED' | 'MANUAL_UPLOAD';
  includeAds: boolean;
  includeMatrimony: boolean;
  maxProfiles?: number | null;
  templateLayout?: string;
  coverImage?: FileValue | null;
  file?: FileValue | null;
};

export type PublicationArchivePageResponse = {
  items: PublicationRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  } | null;
};

function resolveBackendMediaUrl(fileUrl?: string | null) {
  const normalized = String(fileUrl || '').trim();
  if (!normalized) {
    return null;
  }
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }
  return `${apiConfig.baseUrl}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}

function mapPublicationRecord(item: PublicationRecord): PublicationRecord {
  return {
    ...item,
    coverImageUrl: resolveBackendMediaUrl(item.coverImageUrl) || null,
    fileUrl: resolveBackendMediaUrl(item.fileUrl) || null,
  };
}

async function buildFormData(input: PublicationCreateInput) {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description ?? '');
  formData.append('month', String(input.month));
  formData.append('year', String(input.year));
  formData.append('publicationType', input.publicationType);
  formData.append('includeAds', String(input.includeAds));
  formData.append('includeMatrimony', String(input.includeMatrimony));
  if (input.maxProfiles) {
    formData.append('maxProfiles', String(input.maxProfiles));
  }
  if (input.templateLayout?.trim()) {
    formData.append('templateLayout', input.templateLayout.trim());
  }

  if (input.coverImage?.uri) {
    formData.append('coverImage', {
      uri: input.coverImage.uri,
      name: input.coverImage.name || 'cover-image',
      type: input.coverImage.mimeType || 'image/jpeg',
    } as never);
  }

  if (input.file?.uri) {
    formData.append('file', {
      uri: input.file.uri,
      name: input.file.name || 'publication.pdf',
      type: input.file.mimeType || 'application/pdf',
    } as never);
  }

  return formData;
}

async function getBackendPublicationContext() {
  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    throw new Error('Backend session is required.');
  }
  return backendSession;
}

async function buildPublicationPdfSource(publicationId: string) {
  const backendSession = await getBackendPublicationContext();
  const params = new URLSearchParams({
    mode: 'inline',
    accessToken: backendSession.token,
    tenantId: backendSession.tenantId,
  });

  return {
    url: `${apiConfig.baseUrl}${apiEndpoints.communityPublications(backendSession.tenantId)}/${encodeURIComponent(publicationId)}/download?${params.toString()}`,
    headers: undefined,
  };
}

export const publicationFeedService = {
  async loadArchive(params?: { status?: string; year?: number | null; month?: number | null; search?: string }) {
    const result = await this.loadArchivePage(params);
    return result.items;
  },

  async loadArchivePage(params?: { status?: string; year?: number | null; month?: number | null; search?: string; page?: number; limit?: number }): Promise<PublicationArchivePageResponse> {
    const backendSession = await getBackendPublicationContext();
    const query = new URLSearchParams();
    if (params?.status?.trim()) query.set('status', params.status.trim());
    if (params?.year) query.set('year', String(params.year));
    if (params?.month) query.set('month', String(params.month));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const url = `${apiEndpoints.communityPublications(backendSession.tenantId)}${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await apiClient<{ data: PublicationRecord[]; pagination?: PublicationArchivePageResponse['pagination'] }>(url, {
      token: backendSession.token,
    });
    return {
      items: (response.data ?? []).map(mapPublicationRecord),
      pagination: response.pagination ?? null,
    };
  },

  async createPublication(input: PublicationCreateInput) {
    const backendSession = await getBackendPublicationContext();
    const response = await apiClient<{ data: PublicationRecord }>(apiEndpoints.communityPublications(backendSession.tenantId), {
      method: 'POST',
      token: backendSession.token,
      body: await buildFormData(input),
    });
    return mapPublicationRecord(response.data);
  },

  async performAction(publicationId: string, action: 'generate' | 'publish' | 'archive') {
    const backendSession = await getBackendPublicationContext();
    const response = await apiClient<{ data: PublicationRecord }>(
      `${apiEndpoints.communityPublications(backendSession.tenantId)}/${encodeURIComponent(publicationId)}/${action}`,
      {
        method: 'POST',
        token: backendSession.token,
      },
    );
    return mapPublicationRecord(response.data);
  },

  async deletePublication(publicationId: string) {
    const backendSession = await getBackendPublicationContext();
    const response = await apiClient<{ data: PublicationRecord }>(
      `${apiEndpoints.communityPublications(backendSession.tenantId)}/${encodeURIComponent(publicationId)}`,
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
    return mapPublicationRecord(response.data);
  },

  async getPublicationReadConfig(publication: Pick<PublicationRecord, 'id' | 'title' | 'issueNo'>) {
    const source = await buildPublicationPdfSource(publication.id);
    return {
      title: publication.title || publication.issueNo || 'Publication',
      url: source.url,
      headers: source.headers,
    };
  },
};
