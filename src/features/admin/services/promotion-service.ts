import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { apiConfig } from '@/src/constants';
import type { FileValue } from '@/src/types';

export type AdvertisementStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'SCHEDULED';
export type AdvertisementContentType = 'TEXT' | 'IMAGE' | 'VIDEO';
export type AdvertisementCategory =
  | 'BUSINESS_PROMOTION'
  | 'COMMUNITY_ANNOUNCEMENT'
  | 'MATRIMONY'
  | 'EDUCATION'
  | 'OTHER';
export type AdvertisementPricingType = 'FREE' | 'PAID';

export type PromotionRecord = {
  id: string;
  title: string;
  description?: string | null;
  contentType: AdvertisementContentType | string;
  category: AdvertisementCategory | string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  redirectUrl?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  pricingType: AdvertisementPricingType | string;
  amount?: number | null;
  paymentReference?: string | null;
  status?: AdvertisementStatus | string | null;
  displayIntervalSeconds?: number | null;
  displayDurationSeconds?: number | null;
  skipEnabled?: boolean | null;
  skipAfterSeconds?: number | null;
  maxAdsPerSession?: number | null;
  priorityWeight?: number | null;
  impressionCount?: number | null;
  clickCount?: number | null;
  engagementRate?: number | null;
  lastImpressionAt?: string | null;
  lastClickAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PromotionPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type PromotionPageResult = {
  items: PromotionRecord[];
  pagination: PromotionPagination | null;
};

export type PromotionFormValues = {
  title: string;
  description: string;
  contentType: AdvertisementContentType | '';
  category: AdvertisementCategory | '';
  imageUrl: string;
  videoUrl: string;
  redirectUrl: string;
  startAt: Date | undefined;
  endAt: Date | undefined;
  pricingType: AdvertisementPricingType | '';
  amount: string;
  paymentReference: string;
  status: AdvertisementStatus | '';
  displayIntervalSeconds: string;
  displayDurationSeconds: string;
  skipEnabled: boolean;
  skipAfterSeconds: string;
  maxAdsPerSession: string;
  priorityWeight: string;
};

function toDate(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toNumber(value?: string | number | null) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toPromotionFormValues(promotion?: PromotionRecord | null): PromotionFormValues {
  return {
    title: promotion?.title ?? '',
    description: promotion?.description ?? '',
    contentType: (promotion?.contentType as AdvertisementContentType | undefined) ?? 'TEXT',
    category: (promotion?.category as AdvertisementCategory | undefined) ?? 'OTHER',
    imageUrl: promotion?.imageUrl ?? '',
    videoUrl: promotion?.videoUrl ?? '',
    redirectUrl: promotion?.redirectUrl ?? '',
    startAt: toDate(promotion?.startAt),
    endAt: toDate(promotion?.endAt),
    pricingType: (promotion?.pricingType as AdvertisementPricingType | undefined) ?? 'FREE',
    amount: promotion?.amount !== undefined && promotion?.amount !== null ? String(promotion.amount) : '',
    paymentReference: promotion?.paymentReference ?? '',
    status: (promotion?.status as AdvertisementStatus | undefined) ?? 'DRAFT',
    displayIntervalSeconds: promotion?.displayIntervalSeconds ? String(promotion.displayIntervalSeconds) : '300',
    displayDurationSeconds: promotion?.displayDurationSeconds ? String(promotion.displayDurationSeconds) : '10',
    skipEnabled: promotion?.skipEnabled !== false,
    skipAfterSeconds: promotion?.skipAfterSeconds ? String(promotion.skipAfterSeconds) : '3',
    maxAdsPerSession: promotion?.maxAdsPerSession !== undefined && promotion?.maxAdsPerSession !== null ? String(promotion.maxAdsPerSession) : '',
    priorityWeight: promotion?.priorityWeight ? String(promotion.priorityWeight) : '',
  };
}

export function toPromotionPayload(values: PromotionFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    contentType: values.contentType,
    category: values.category,
    imageUrl: values.imageUrl.trim() || null,
    videoUrl: values.videoUrl.trim() || null,
    redirectUrl: values.redirectUrl.trim() || null,
    startAt: values.startAt ? values.startAt.toISOString() : null,
    endAt: values.endAt ? values.endAt.toISOString() : null,
    pricingType: values.pricingType,
    amount: toNumber(values.amount),
    paymentReference: values.paymentReference.trim() || null,
    status: values.status,
    displayIntervalSeconds: toNumber(values.displayIntervalSeconds) ?? 300,
    displayDurationSeconds: toNumber(values.displayDurationSeconds) ?? 10,
    skipEnabled: values.skipEnabled,
    skipAfterSeconds: toNumber(values.skipAfterSeconds) ?? 3,
    maxAdsPerSession: toNumber(values.maxAdsPerSession),
    priorityWeight: toNumber(values.priorityWeight),
  };
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  const normalized = String(fileUrl || '').trim();
  if (!normalized) {
    return null;
  }

  if (/^(file:|data:|blob:)/i.test(normalized)) {
    return normalized;
  }

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const parsed = new URL(normalized);
      if (apiConfig.isConfigured && parsed.pathname.startsWith('/public/')) {
        const apiBase = new URL(apiConfig.baseUrl);
        return `${apiBase.origin}${parsed.pathname}${parsed.search || ''}${parsed.hash || ''}`;
      }
    } catch {
      return normalized;
    }
    return normalized;
  }

  return `${apiConfig.baseUrl}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}

function mapPromotionRecord(record: PromotionRecord): PromotionRecord {
  return {
    ...record,
    imageUrl: resolveBackendMediaUrl(record.imageUrl) || null,
  };
}

async function getSessionContext() {
  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    throw new Error('Session not available.');
  }
  return backendSession;
}

async function uploadImageFile(file: FileValue) {
  const backendSession = await getSessionContext();
  const fallbackName = String(file.name || '').trim() || `advertisement-${Date.now()}.jpg`;
  const fallbackMimeType = String(file.mimeType || '').trim() || (
    fallbackName.toLowerCase().endsWith('.png')
      ? 'image/png'
      : fallbackName.toLowerCase().endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg'
  );
  const formData = new FormData();
  formData.append(
    'image',
    {
      uri: file.uri,
      name: fallbackName,
      type: fallbackMimeType,
    } as never,
  );

  const response = await apiClient<{ data: { path?: string | null } }>(
    apiEndpoints.communityAdvertisementImageUpload(backendSession.tenantId),
    {
      method: 'POST',
      token: backendSession.token,
      body: formData,
    },
  );

  return response.data?.path ?? null;
}

export const promotionService = {
  async loadPromotions(): Promise<PromotionRecord[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: PromotionRecord[] }>(
      `${apiEndpoints.communityAdvertisements(backendSession.tenantId)}?page=1&limit=100`,
      {
        token: backendSession.token,
      },
    );
    return (response.data ?? []).map(mapPromotionRecord);
  },

  async loadPromotionsPage(params?: { page?: number; limit?: number; search?: string; status?: string; contentType?: string; pricingType?: string }): Promise<PromotionPageResult> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }

    const backendSession = await getSessionContext();
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(params?.page ?? 1));
    searchParams.set('limit', String(params?.limit ?? 20));
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());
    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.contentType && params.contentType !== 'all') searchParams.set('contentType', params.contentType);
    if (params?.pricingType && params.pricingType !== 'all') searchParams.set('pricingType', params.pricingType);

    const response = await apiClient<{ data: PromotionRecord[]; pagination?: PromotionPagination | null }>(
      `${apiEndpoints.communityAdvertisements(backendSession.tenantId)}?${searchParams.toString()}`,
      {
        token: backendSession.token,
      },
    );

    return {
      items: (response.data ?? []).map(mapPromotionRecord),
      pagination: response.pagination ?? null,
    };
  },

  async loadActivePromotions(): Promise<PromotionRecord[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: PromotionRecord[] }>(
      apiEndpoints.communityActiveAdvertisements(backendSession.tenantId),
      {
        token: backendSession.token,
      },
    );
    return (response.data ?? []).map(mapPromotionRecord);
  },

  async loadPromotion(id: string): Promise<PromotionRecord> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: PromotionRecord }>(
      apiEndpoints.communityAdvertisement(backendSession.tenantId, id),
      {
        token: backendSession.token,
      },
    );
    return mapPromotionRecord(response.data);
  },

  async createPromotion(values: PromotionFormValues): Promise<PromotionRecord> {
    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: PromotionRecord }>(
      apiEndpoints.communityAdvertisements(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(toPromotionPayload(values)),
      },
    );
    return mapPromotionRecord(response.data);
  },

  async updatePromotion(id: string, values: PromotionFormValues): Promise<PromotionRecord> {
    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: PromotionRecord }>(
      apiEndpoints.communityAdvertisement(backendSession.tenantId, id),
      {
        method: 'PUT',
        token: backendSession.token,
        body: JSON.stringify(toPromotionPayload(values)),
      },
    );
    return mapPromotionRecord(response.data);
  },

  async deletePromotion(id: string): Promise<void> {
    const backendSession = await getSessionContext();
    await apiClient(
      apiEndpoints.communityAdvertisement(backendSession.tenantId, id),
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
  },

  async recordImpression(id: string): Promise<void> {
    const backendSession = await getSessionContext();
    await apiClient(
      apiEndpoints.communityAdvertisementImpression(backendSession.tenantId, id),
      {
        method: 'POST',
        token: backendSession.token,
      },
    );
  },

  async recordClick(id: string): Promise<void> {
    const backendSession = await getSessionContext();
    await apiClient(
      apiEndpoints.communityAdvertisementClick(backendSession.tenantId, id),
      {
        method: 'POST',
        token: backendSession.token,
      },
    );
  },

  async uploadPromotionImage(file: FileValue): Promise<string | null> {
    return uploadImageFile(file);
  },
};
