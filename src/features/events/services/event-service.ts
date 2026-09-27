import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { getRazorpayPaymentErrorMessage } from '@/src/services/error-message';
import type { ListItem, MetricItem } from '@/src/types/app';
import { colors } from '@/src/theme';
import type { RazorpayCheckoutOptions, RazorpayPaymentError, RazorpayPaymentSuccess } from 'react-native-razorpay';

interface EventRegistrationPayload {
  attendees: number;
  addOn?: string | null;
  amountPaid?: number;
  remarks?: string | null;
}

export type EventAdhocRegistrationPayload = {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  attendees?: number;
  addOn?: string | null;
  amountPaid?: number;
  paymentProvider?: string | null;
  paymentReferenceId?: string | null;
  remarks?: string | null;
};

export type EventRegistrationAdminRecord = {
  id: string;
  userId: string;
  memberName: string;
  memberId?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  status: string;
  registeredAt?: string | null;
  attendedAt?: string | null;
  registeredAttendees: number;
  attendedAttendees: number;
  pendingAttendees: number;
  attendanceStatus: string;
  amountPaid: number;
  addOn?: string | null;
  paymentReferenceId?: string | null;
  passes?: {
    id: string;
    registrationId: string;
    eventId: string;
    passType: 'entry' | 'add_on' | string;
    passLabel: string;
    addOnTitle?: string | null;
    qrToken: string;
    qrImage?: string | null;
    scannedAt?: string | null;
  }[];
};

export type EventRegistrationsPageResponse = {
  event: EventRecord;
  summary: {
    registeredUsers: number;
    registeredAttendees: number;
    attended: number;
    pending: number;
  };
  items: EventRegistrationAdminRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalCount?: number;
    totalPages: number;
    hasNextPage: boolean;
  } | null;
};

export type ScannedMemberQr = {
  id: string;
  memberId?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  bloodGroup?: string | null;
};

type EventPaymentOrder = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string | null;
  name: string;
  description: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
};

type EventRegistrationResult = {
  id: string;
  eventId: string;
  title: string;
  status: string;
  alreadyRegistered?: boolean;
  qrToken?: string | null;
  qrImage?: string | null;
};

export type EventAudience = {
  allUsers?: boolean;
  roleKeys?: string[];
  cities?: string[];
  memberIds?: string[];
  audienceSegments?: string[];
};

export type EventPayload = {
  audience?: EventAudience;
  title: string;
  description?: string | null;
  eventType?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  fee?: number | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  venueName?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  googlePlaceId?: string | null;
  lat?: number | null;
  lng?: number | null;
  locationUrl?: string | null;
  youtubeUrl?: string | null;
  maxAttendees?: number | null;
  reviewEnabled?: boolean;
  chatEnabled?: boolean;
  reminderDays?: number[];
  addOns?: { title: string; amount: number; quantityLimit?: number | null }[];
};

export type EventRecord = {
  audience?: EventAudience;
  id: string;
  title: string;
  description?: string | null;
  eventType?: string | null;
  status: string;
  startAt?: string | null;
  endAt?: string | null;
  fee?: number | null;
  city?: string | null;
  venueName?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  area?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  googlePlaceId?: string | null;
  lat?: number | null;
  lng?: number | null;
  locationUrl?: string | null;
  youtubeUrl?: string | null;
  maxAttendees?: number | null;
  reviewEnabled?: boolean;
  chatEnabled?: boolean;
  reminderDays?: number[];
  addOns?: { id: string; title: string; amount: number; quantityLimit?: number | null; sortOrder?: number }[];
  reviewSummary?: { count: number; averageRating: number };
  galleryCount?: number;
};

export type EventReviewRecord = {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    memberId?: string | null;
    profilePic?: string | null;
  } | null;
};

export type EventGalleryRecord = {
  id: string;
  eventId: string;
  fileUrl: string;
  fileName?: string | null;
  mimeType?: string | null;
  caption?: string | null;
  category?: string | null;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    memberId?: string | null;
  } | null;
};

export type EventPassRecord = {
  id: string;
  registrationId: string;
  eventId: string;
  title: string;
  passType: 'entry' | 'add_on' | string;
  passLabel: string;
  addOnTitle?: string | null;
  addOns: string[];
  attendees: number;
  amountPaid: number;
  qrToken: string;
  qrImage: string;
  scannedAt?: string | null;
  attendedAt?: string | null;
  addOnConsumedAt?: string | null;
  event?: EventRecord;
};

export type EventAnalyticsRecord = {
  event: EventRecord;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  registeredUsers: number;
  registeredAttendees: number;
  attended: number;
  attendanceRatio: number;
  addOnUsage: { id: string; title: string; count: number; amount: number }[];
  dailyRegistrations: { date: string; registrations: number; income: number }[];
  registrationDetails?: {
    id: string;
    userId: string;
    memberName: string;
    memberNameEnglish?: string | null;
    memberNameSecondLanguage?: string | null;
    memberId?: string | null;
    phone?: string | null;
    city?: string | null;
    status: string;
    registeredAt?: string | null;
    attendedAt?: string | null;
    registeredAttendees: number;
    attendedAttendees: number;
    pendingAttendees: number;
    attendanceStatus: string;
    amountPaid: number;
    addOn?: string | null;
    paymentReferenceId?: string | null;
  }[];
};

export type EventCardRecord = {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string | null;
  active: boolean;
  registered: boolean;
  hasPass: boolean;
  startAt?: string | null;
  endAt?: string | null;
};

export type EventCardsPageResponse = {
  items: EventCardRecord[];
  pagination: EventPagination | null;
};

export type EventLocationSuggestion = {
  placeId: string;
  title: string;
  subtitle: string;
  description: string;
};

export type EventLocationSelection = {
  googlePlaceId: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  locationUrl: string | null;
};

export type EventSelectOption = {
  label: string;
  value: string;
};

export type EventPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type ManageEventsPageResponse = {
  items: ListItem[];
  pagination: EventPagination | null;
};

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatEventDateTime(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', options).format(parsed);
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function mapEventGalleryRecord(record: EventGalleryRecord): EventGalleryRecord {
  return {
    ...record,
    fileUrl: resolveBackendMediaUrl(record.fileUrl),
  };
}

export const eventService = {
  async loadEventOptions(): Promise<EventSelectOption[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [];
    }

    try {
      const response = await apiClient<{ data: { id: string; title: string; status?: string }[] }>(
        apiEndpoints.communityEvents(backendSession.tenantId),
        { token: backendSession.token },
      );

      return (response.data ?? [])
        .filter((event) => Boolean(event?.title))
        .sort((left, right) => {
          const leftPublished = ['PUBLISHED', 'ACTIVE', 'LIVE', 'ONGOING'].includes(String(left.status || '').toUpperCase());
          const rightPublished = ['PUBLISHED', 'ACTIVE', 'LIVE', 'ONGOING'].includes(String(right.status || '').toUpperCase());
          if (leftPublished !== rightPublished) {
            return leftPublished ? -1 : 1;
          }
          return String(left.title || '').localeCompare(String(right.title || ''));
        })
        .map((event) => ({
          label: event.title,
          value: event.title,
        }));
    } catch {
      return [];
    }
  },

  async loadEvent(eventId: string) {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: EventRecord }>(
        `${apiEndpoints.communityEvents(backendSession.tenantId)}/${encodeURIComponent(eventId)}`,
        { token: backendSession.token },
      );
      return response.data;
    } catch {
      return null;
    }
  },

  async loadEventOverview() {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; title: string; status?: string; startAt?: string | null; endAt?: string | null; fee?: number | null; addOns?: { title: string; amount: number }[] }[] }>(
            apiEndpoints.communityEvents(backendSession.tenantId),
            { token: backendSession.token },
          );
          const featured = response.data.find((event) => ['PUBLISHED', 'ACTIVE', 'LIVE', 'Ongoing'].includes(String(event.status || '').toUpperCase())) ?? response.data[0];
          if (!featured) {
            return { metrics: [] as MetricItem[], eventId: null, title: null };
          }

          return {
            eventId: featured.id,
            title: featured.title,
            metrics: [
              { label: 'Fee', value: formatCurrency(Number(featured.fee || 0)), accent: 'primary' },
              { label: 'Add-ons', value: String(featured.addOns?.length || 0), accent: 'accent' },
              { label: 'Status', value: String(featured.status || 'Draft'), accent: 'warning' },
            ] satisfies MetricItem[],
          };
        } catch {
          return { metrics: [] as MetricItem[], eventId: null, title: null };
        }
      }
    }

    return {
      metrics: [] as MetricItem[],
      eventId: null,
      title: null,
    };
  },

  async loadManageEvents() {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; title: string; startAt?: string | null; endAt?: string | null; city?: string | null; venueName?: string | null; status?: string }[] }>(
            apiEndpoints.communityEvents(backendSession.tenantId),
            { token: backendSession.token },
          );
          return response.data.map(
            (record) =>
              ({
                id: record.id,
                title: record.title,
                subtitle: record.venueName || record.city || 'Community event',
                meta:
                  [
                    formatEventDateTime(record.startAt, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }),
                    formatEventDateTime(record.startAt, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }),
                  ]
                    .filter(Boolean)
                    .join(' • ') || 'Upcoming',
                status: record.status || 'Draft',
                city: record.city || record.venueName || 'Community event',
                startAt: record.startAt || null,
                endAt: record.endAt || null,
              }) satisfies ListItem,
          );
        } catch {
          return [];
        }
      }
    }
    return [];
  },

  async loadManageEventsPage(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    city?: string;
    timeframe?: 'upcoming' | 'past' | 'this_month' | 'next_30_days' | 'all';
  }): Promise<ManageEventsPageResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const query = new URLSearchParams();
    if (params?.page) {
      query.set('page', String(params.page));
    }
    if (params?.limit) {
      query.set('limit', String(params.limit));
    }
    if (params?.search?.trim()) {
      query.set('search', params.search.trim());
    }
    if (params?.status && params.status !== 'all') {
      query.set('status', params.status);
    }
    if (params?.city && params.city !== 'all') {
      query.set('city', params.city);
    }
    if (params?.timeframe && params.timeframe !== 'all') {
      query.set('timeframe', params.timeframe);
    }

    const response = await apiClient<{
      data: { id: string; title: string; startAt?: string | null; endAt?: string | null; city?: string | null; venueName?: string | null; status?: string }[];
      pagination?: EventPagination | null;
    }>(
      `${apiEndpoints.communityEvents(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map(
        (record) =>
          ({
            id: record.id,
            title: record.title,
            subtitle: record.venueName || record.city || 'Community event',
            meta:
              [
                formatEventDateTime(record.startAt, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                formatEventDateTime(record.startAt, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }),
              ]
                .filter(Boolean)
                .join(' • ') || 'Upcoming',
            status: record.status || 'Draft',
            city: record.city || record.venueName || 'Community event',
            startAt: record.startAt || null,
            endAt: record.endAt || null,
          }) satisfies ListItem,
      ),
      pagination: response.pagination ?? null,
    };
  },

  async loadEventCards() {
    if (!isBackendApiConfigured()) {
      return [] as EventCardRecord[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [] as EventCardRecord[];
    }

    try {
      const [eventsResponse, registrationsResponse] = await Promise.all([
        apiClient<{ data: EventRecord[] }>(apiEndpoints.communityEvents(backendSession.tenantId), {
          token: backendSession.token,
        }),
        apiClient<{ data: { eventId?: string; id: string; title: string; status?: string }[] }>(
          apiEndpoints.communityMyEventRegistrations(backendSession.tenantId),
          { token: backendSession.token },
        ),
      ]);
      const registeredEventIds = new Set(
        (registrationsResponse.data ?? [])
          .filter((registration) => String(registration.status || '').toUpperCase() === 'CONFIRMED')
          .map((registration) => registration.eventId)
          .filter((eventId): eventId is string => Boolean(eventId)),
      );

      return (eventsResponse.data ?? []).map((event) => {
        const endDate = event.endAt ? new Date(event.endAt) : null;
        const startDate = event.startAt ? new Date(event.startAt) : null;
        const referenceDate = endDate && !Number.isNaN(endDate.getTime()) ? endDate : startDate;
        const isActive = !referenceDate || Number.isNaN(referenceDate.getTime()) || referenceDate.getTime() >= Date.now();
        const location = [event.venueName, event.city, event.state].filter(Boolean).join(', ') || 'Community event';

        return {
          id: event.id,
          title: event.title,
          date: formatEventDateTime(event.startAt, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) || 'Date to be announced',
          location,
          image: null,
          active: isActive,
          registered: registeredEventIds.has(event.id),
          hasPass: registeredEventIds.has(event.id),
          startAt: event.startAt || null,
          endAt: event.endAt || null,
        } satisfies EventCardRecord;
      });
    } catch {
      return [];
    }
  },
  async loadEventCardsPage(params?: {
    page?: number;
    limit?: number;
    timeframe?: 'upcoming' | 'past' | 'this_month' | 'next_30_days' | 'all';
    search?: string;
  }): Promise<EventCardsPageResponse> {
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
    if (params?.timeframe && params.timeframe !== 'all') query.set('timeframe', params.timeframe);
    if (params?.search?.trim()) query.set('search', params.search.trim());

    const [eventsResponse, registrationsResponse] = await Promise.all([
      apiClient<{ data: EventRecord[]; pagination?: EventPagination | null }>(
        `${apiEndpoints.communityEvents(backendSession.tenantId)}?${query.toString()}`,
        { token: backendSession.token },
      ),
      apiClient<{ data: { eventId?: string; id: string; title: string; status?: string }[] }>(
        apiEndpoints.communityMyEventRegistrations(backendSession.tenantId),
        { token: backendSession.token },
      ),
    ]);

    const registeredEventIds = new Set(
      (registrationsResponse.data ?? [])
        .filter((registration) => String(registration.status || '').toUpperCase() === 'CONFIRMED')
        .map((registration) => registration.eventId)
        .filter((eventId): eventId is string => Boolean(eventId)),
    );

    return {
      items: (eventsResponse.data ?? []).map((event) => {
        const endDate = event.endAt ? new Date(event.endAt) : null;
        const startDate = event.startAt ? new Date(event.startAt) : null;
        const referenceDate = endDate && !Number.isNaN(endDate.getTime()) ? endDate : startDate;
        const isActive = !referenceDate || Number.isNaN(referenceDate.getTime()) || referenceDate.getTime() >= Date.now();
        const location = [event.venueName, event.city, event.state].filter(Boolean).join(', ') || 'Community event';

        return {
          id: event.id,
          title: event.title,
          date: formatEventDateTime(event.startAt, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) || 'Date to be announced',
          location,
          image: null,
          active: isActive,
          registered: registeredEventIds.has(event.id),
          hasPass: registeredEventIds.has(event.id),
          startAt: event.startAt || null,
          endAt: event.endAt || null,
        } satisfies EventCardRecord;
      }),
      pagination: eventsResponse.pagination ?? null,
    };
  },

  async loadMyEvents() {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; eventId?: string; title: string; subtitle?: string; meta?: string; status?: string }[] }>(
            apiEndpoints.communityMyEventRegistrations(backendSession.tenantId),
            { token: backendSession.token },
          );
          return (response.data ?? []).map(
            (record) =>
              ({
                id: record.eventId || record.id,
                title: record.title,
                subtitle: record.subtitle || 'Registered event',
                meta: record.meta || '',
                status: record.status || 'Confirmed',
              }) satisfies ListItem,
          );
        } catch {
          return [];
        }
      }
    }

    return [];
  },

  async loadMyEventPasses() {
    if (!isBackendApiConfigured()) {
      return [] as EventPassRecord[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [] as EventPassRecord[];
    }

    try {
      const response = await apiClient<{ data: EventPassRecord[] }>(
        apiEndpoints.communityMyEventPasses(backendSession.tenantId),
        { token: backendSession.token },
      );

      return response.data ?? [];
    } catch {
      return [];
    }
  },

  async searchEventLocations(query: string) {
    if (!isBackendApiConfigured()) {
      return [] as EventLocationSuggestion[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession || String(query || '').trim().length < 2) {
      return [] as EventLocationSuggestion[];
    }

    const response = await apiClient<{ data: EventLocationSuggestion[] }>(
      apiEndpoints.communityEventLocationSearch(backendSession.tenantId, query),
      { token: backendSession.token },
    );
    return response.data ?? [];
  },

  async loadEventLocationSelection(placeId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: EventLocationSelection }>(
      apiEndpoints.communityEventLocationByPlaceId(backendSession.tenantId, placeId),
      { token: backendSession.token },
    );
    return response.data;
  },

  async loadEventAnalytics(eventId: string) {
    if (!isBackendApiConfigured() || !eventId) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: EventAnalyticsRecord }>(
        apiEndpoints.communityEventAnalytics(backendSession.tenantId, eventId),
        { token: backendSession.token },
      );
      return response.data;
    } catch {
      return null;
    }
  },

  async loadEventRegistrationsPage(eventId: string, query?: { page?: number; limit?: number; q?: string }): Promise<EventRegistrationsPageResponse> {
    if (!isBackendApiConfigured() || !eventId) {
      return { event: {} as EventRecord, summary: { registeredUsers: 0, registeredAttendees: 0, attended: 0, pending: 0 }, items: [], pagination: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { event: {} as EventRecord, summary: { registeredUsers: 0, registeredAttendees: 0, attended: 0, pending: 0 }, items: [], pagination: null };
    }

    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.q) params.set('q', query.q);
    const response = await apiClient<{
      data: {
        event?: EventRecord;
        summary?: EventRegistrationsPageResponse['summary'];
        items?: EventRegistrationAdminRecord[];
      };
      pagination?: EventRegistrationsPageResponse['pagination'];
    }>(
      `${apiEndpoints.communityEventRegistrations(backendSession.tenantId, eventId)}${params.toString() ? `?${params.toString()}` : ''}`,
      { token: backendSession.token },
    );

    return {
      event: response.data?.event ?? ({} as EventRecord),
      summary: response.data?.summary ?? { registeredUsers: 0, registeredAttendees: 0, attended: 0, pending: 0 },
      items: response.data?.items ?? [],
      pagination: response.pagination ?? null,
    };
  },

  async scanEventPass(token: string, mode: 'attendance' | 'addons') {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: { id: string; eventTitle: string; name: string; memberId: string; attendees: number; addOn?: string | null; passType?: string; passLabel?: string; attendedAt?: string | null; addOnConsumedAt?: string | null; alreadyProcessed?: boolean; noAddOn?: boolean; scanMode?: 'attendance' | 'addons' } }>(
      apiEndpoints.communityEventScan(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({ token, mode }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async scanMemberQr(token: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: ScannedMemberQr }>(
      apiEndpoints.communityDirectoryMemberScan(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({ token }),
      },
    );

    return response.data;
  },

  async createEvent(payload: EventPayload) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: EventRecord }>(
      apiEndpoints.communityEvents(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          ...payload,
          tenantId: backendSession.tenantId,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async updateEvent(eventId: string, payload: EventPayload) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: EventRecord }>(
      `${apiEndpoints.communityEvents(backendSession.tenantId)}/${encodeURIComponent(eventId)}`,
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({
          ...payload,
          tenantId: backendSession.tenantId,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async deleteEvent(eventId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: EventRecord }>(
      `${apiEndpoints.communityEvents(backendSession.tenantId)}/${encodeURIComponent(eventId)}`,
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async loadEventReviews(eventId: string) {
    if (!isBackendApiConfigured() || !eventId) {
      return [] as EventReviewRecord[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [] as EventReviewRecord[];
    }

    try {
      const response = await apiClient<{ data: EventReviewRecord[] }>(
        apiEndpoints.communityEventReviews(backendSession.tenantId, eventId),
        { token: backendSession.token },
      );
      return response.data ?? [];
    } catch {
      return [] as EventReviewRecord[];
    }
  },

  async saveEventReview(eventId: string, payload: { rating: number; comment?: string | null }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: EventReviewRecord }>(
      apiEndpoints.communityEventReviews(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async loadEventGallery(eventId: string) {
    if (!isBackendApiConfigured() || !eventId) {
      return [] as EventGalleryRecord[];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [] as EventGalleryRecord[];
    }

    try {
      const response = await apiClient<{ data: EventGalleryRecord[] }>(
        apiEndpoints.communityEventGallery(backendSession.tenantId, eventId),
        { token: backendSession.token },
      );
      return (response.data ?? []).map(mapEventGalleryRecord);
    } catch {
      return [] as EventGalleryRecord[];
    }
  },

  async uploadEventGalleryImages(eventId: string, files: { uri: string; name?: string; type?: string }[], payload?: { caption?: string | null; category?: string | null }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `event-${eventId}-${index + 1}.jpg`,
        type: file.type || 'image/jpeg',
      } as never);
    });
    if (payload?.caption) {
      formData.append('caption', payload.caption);
    }
    if (payload?.category) {
      formData.append('category', payload.category);
    }

    const response = await apiClient<{ data: EventGalleryRecord | EventGalleryRecord[] }>(
      apiEndpoints.communityEventGallery(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
        body: formData,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return (Array.isArray(response.data) ? response.data : [response.data]).map(mapEventGalleryRecord);
  },

  async uploadEventGalleryImage(eventId: string, file: { uri: string; name?: string; type?: string }, payload?: { caption?: string | null; category?: string | null }) {
    const records = await this.uploadEventGalleryImages(eventId, [file], payload);
    return records[0];
  },

  async registerForEvent(eventId: string, payload: EventRegistrationPayload) {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (!backendSession) {
        throw new Error('Backend session is not available.');
      }

      const response = await apiClient<{ data: EventRegistrationResult }>(
        apiEndpoints.communityEventRegister(backendSession.tenantId, eventId),
        {
          method: 'POST',
          token: backendSession.token,
          body: JSON.stringify({
            tenantId: backendSession.tenantId,
            userCommunityId: backendSession.session.user.communityMembershipId,
            attendees: payload.attendees,
            addOn: payload.addOn || null,
            amountPaid: payload.amountPaid ?? 0,
            remarks: payload.remarks ?? payload.addOn ?? null,
          }),
        },
      );
      await invalidateTenantApiData(backendSession.tenantId);
      return response.data;
    }

    throw new Error('Event registration requires a backend session.');
  },

  async createAdhocRegistration(eventId: string, payload: EventAdhocRegistrationPayload) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const response = await apiClient<{ data: EventRegistrationResult & { userId?: string; userName?: string; alreadyRegistered?: boolean } }>(
      apiEndpoints.communityEventAdhocRegistration(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );

    await invalidateTenantApiData(backendSession.tenantId);
    return response.data;
  },

  async createEventPaymentOrder(eventId: string, payload: {
    attendees: number;
    addOn?: string | null;
    remarks?: string | null;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const response = await apiClient<{ data: EventPaymentOrder }>(
      apiEndpoints.communityEventPaymentOrder(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async openRazorpayCheckout(order: EventPaymentOrder) {
    if (Platform.OS === 'web') {
      throw new Error('Razorpay checkout is available only in the mobile app.');
    }

    const key = order.keyId;
    if (!key) {
      throw new Error('Razorpay key id was not returned by the server.');
    }

    const hasRazorpayNativeModule = Boolean(
      NativeModules.RNRazorpayCheckout || TurboModuleRegistry.get?.('RNRazorpayCheckout'),
    );
    if (!hasRazorpayNativeModule) {
      throw new Error('Razorpay native module is not available in this build. Run the app with a development or production build that includes react-native-razorpay.');
    }

    let RazorpayCheckout: typeof import('react-native-razorpay').default;
    try {
      RazorpayCheckout = (await import('react-native-razorpay')).default;
    } catch {
      throw new Error('Unable to load Razorpay checkout. Rebuild the app after installing react-native-razorpay.');
    }

    const options: RazorpayCheckoutOptions = {
      key,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: {
        color: colors.primary.DEFAULT,
      },
      modal: {
        backdropclose: false,
        confirm_close: true,
      },
    };

    try {
      return await RazorpayCheckout.open(options);
    } catch (error) {
      const paymentError = error as RazorpayPaymentError;
      throw new Error(getRazorpayPaymentErrorMessage(paymentError));
    }
  },

  async verifyEventPayment(eventId: string, payload: {
    remarks?: string | null;
    razorpay: RazorpayPaymentSuccess;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const response = await apiClient<{ data: EventRegistrationResult }>(
      apiEndpoints.communityEventPaymentVerify(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          remarks: payload.remarks ?? null,
          razorpayOrderId: payload.razorpay.razorpay_order_id,
          razorpayPaymentId: payload.razorpay.razorpay_payment_id,
          razorpaySignature: payload.razorpay.razorpay_signature,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async cancelEventRegistration(eventId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: { id: string; eventId: string; title: string; status: string } }>(
      apiEndpoints.communityEventRegistrationCancel(backendSession.tenantId, eventId),
      {
        method: 'POST',
        token: backendSession.token,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async registerForFeaturedEvent(payload: EventRegistrationPayload) {
    const overview = await eventService.loadEventOverview();
    if (!overview.eventId) {
      throw new Error('There is no active event available for registration right now.');
    }

    return eventService.registerForEvent(overview.eventId, payload);
  },
};
