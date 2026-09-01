import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';

import { DONATION_RECEIPT_LOGO_URI, DONATION_RECEIPT_QR_URI } from './donation-receipt-assets';
import { generateDonationReceiptHtml } from '../utils/donation-receipt-template';
import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiConfig } from '@/src/constants';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { getRazorpayPaymentErrorMessage } from '@/src/services/error-message';
import type { FileValue } from '@/src/types';
import type { ListItem, MetricItem } from '@/src/types/app';
import { getActiveTenantRequestHeaders } from '@/src/core/config/community';
import { colors } from '@/src/theme';
import { createAndDeliverPdf } from '@/src/services/files/pdf-file';
import type { RazorpayCheckoutOptions, RazorpayPaymentError, RazorpayPaymentSuccess } from 'react-native-razorpay';

export type DonationStatus = 'PAID' | 'PENDING' | 'CANCELLED';

export type DonationRecordItem = {
  id: string;
  createdAt: string | null;
  amount: number;
  purpose: string | null;
  donationPurpose: string | null;
  status: DonationStatus;
  donationType: string | null;
  receiptNo: string | null;
  donorName: string;
  receivedBy: string | null;
  paymentMode: 'cash' | 'transfer' | 'cheque' | null;
  memberSearch: string | null;
  proofLabel: string | null;
  referenceNumber: string | null;
  message: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  panNumber: string | null;
  phoneNumber: string | null;
  totalFamilyMembers: string | null;
  searchText: string;
};

export type DonationRecordsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type DonationRecordsSummary = {
  statusCounts: {
    all: number;
    paid: number;
    pending: number;
    cancelled: number;
  };
  totalAmount: number;
};

export type DonationRecordsPageResponse = {
  items: DonationRecordItem[];
  pagination: DonationRecordsPagination | null;
  summary: DonationRecordsSummary;
};

const emptyDonationRecordsSummary: DonationRecordsSummary = {
  statusCounts: {
    all: 0,
    paid: 0,
    pending: 0,
    cancelled: 0,
  },
  totalAmount: 0,
};

let donationRecordsChanged = false;

function markDonationRecordsChanged() {
  donationRecordsChanged = true;
}

export type MemberTransactionItem = {
  id: string;
  type: 'donation' | 'event' | 'subscription';
  title: string;
  subtitle: string;
  amount: number;
  status: string;
  createdAt: string;
  receiptNo?: string | null;
  donationId?: string;
  eventId?: string;
  subscriptionId?: string;
  subscriptionType?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null;
  subscriptionStartsAt?: string | null;
  subscriptionEndsAt?: string | null;
  paymentRef?: string | null;
};

export type MemberTransactionsPageResponse = {
  items: MemberTransactionItem[];
  pagination: DonationRecordsPagination | null;
};

type DonationPaymentOrder = {
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

export type ManualDonationRecordPayload = {
  donorName: string;
  amount: string | number;
  paymentMode: 'cash' | 'transfer' | 'cheque';
  status: DonationStatus;
  donationDate?: string | null;
  panNumber?: string | null;
  referenceNumber?: string | null;
  message?: string | null;
  proofFile?: FileValue | null;
  proofLabel?: string | null;
  registeredMemberSearch?: string | null;
  onBehalfUserId?: string | null;
};

type ParsedDonationPurpose = {
  donorName: string;
  donationPurpose: string | null;
  paymentMode: DonationRecordItem['paymentMode'];
  memberSearch: string | null;
  receivedBy: string | null;
  proofLabel: string | null;
  referenceNumber: string | null;
  message: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  panNumber: string | null;
  phoneNumber: string | null;
  totalFamilyMembers: string | null;
};

function normalizeOptionalText(value?: string | null) {
  const normalized = String(value || '').trim();
  return normalized || null;
}

function normalizeDonationPaymentMode(value: string | null | undefined): DonationRecordItem['paymentMode'] {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized === 'cash') {
    return 'cash';
  }

  if (normalized === 'cheque' || normalized === 'check') {
    return 'cheque';
  }

  if (
    normalized === 'transfer' ||
    normalized === 'online' ||
    normalized === 'razorpay' ||
    normalized === 'upi' ||
    normalized === 'card' ||
    normalized === 'netbanking' ||
    normalized === 'bank transfer' ||
    normalized === 'bank_transfer'
  ) {
    return 'transfer';
  }

  return null;
}

function formatDonationDateTime(value?: string | null, fallback = 'Today') {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function normalizeDonationStatus(value: string | null | undefined): DonationStatus {
  const normalized = String(value || '').trim().toUpperCase();

  if (['PAID', 'APPROVED', 'SUCCESS', 'COMPLETED', 'ACTIVE'].includes(normalized)) {
    return 'PAID';
  }

  if (['CANCELLED', 'CANCELED', 'REJECTED', 'FAILED'].includes(normalized)) {
    return 'CANCELLED';
  }

  return 'PENDING';
}

export function formatDonationStatusLabel(status: DonationStatus): string {
  if (status === 'PAID') {
    return 'Paid';
  }

  if (status === 'CANCELLED') {
    return 'Cancelled';
  }

  return 'Pending';
}

function parseDonationPurpose(purpose?: string | null) {
  const addressParts = String(purpose || '')
    .split('•')
    .map((part) => part.trim())
    .find((part) => part.startsWith('Address:'))
    ?.replace(/^Address:\s*/i, '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean) ?? [];

  const parts = String(purpose || '')
    .split('•')
    .map((part) => part.trim())
    .filter(Boolean);

  const parsed: ParsedDonationPurpose = {
    donorName: '',
    donationPurpose: null as string | null,
    paymentMode: null as DonationRecordItem['paymentMode'],
    memberSearch: null as string | null,
    receivedBy: null as string | null,
    proofLabel: null as string | null,
    referenceNumber: null as string | null,
    message: null as string | null,
    addressLine1: addressParts[0] ?? null,
    addressLine2: addressParts[1] ?? null,
    city: addressParts[2] ?? null,
    state: addressParts[3] ?? null,
    country: addressParts[4] ?? null,
    pincode: addressParts[5] ?? null,
    panNumber: null as string | null,
    phoneNumber: null as string | null,
    totalFamilyMembers: null as string | null,
  };

  const messageParts: string[] = [];

  for (const part of parts) {
    if (part.startsWith('Member:')) {
      parsed.memberSearch = part.replace(/^Member:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Donor:')) {
      parsed.donorName = part.replace(/^Donor:\s*/i, '').trim();
      continue;
    }

    if (part.startsWith('Purpose:')) {
      parsed.donationPurpose = part.replace(/^Purpose:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Mode:')) {
      const value = part.replace(/^Mode:\s*/i, '').trim().toLowerCase();
      parsed.paymentMode = normalizeDonationPaymentMode(value);
      continue;
    }

    if (part.startsWith('Address Line 1:')) {
      parsed.addressLine1 = part.replace(/^Address Line 1:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Address Line 2:')) {
      parsed.addressLine2 = part.replace(/^Address Line 2:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Area:')) {
      parsed.addressLine2 = part.replace(/^Area:\s*/i, '').trim() || parsed.addressLine2;
      continue;
    }

    if (part.startsWith('City:')) {
      parsed.city = part.replace(/^City:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('State:')) {
      parsed.state = part.replace(/^State:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Country:')) {
      parsed.country = part.replace(/^Country:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Pincode:')) {
      parsed.pincode = part.replace(/^Pincode:\s*/i, '').trim() || null;
      continue;
    }

    if (part.startsWith('Pin Code:')) {
      parsed.pincode = part.replace(/^Pin Code:\s*/i, '').trim() || parsed.pincode;
      continue;
    }

    if (part.startsWith('PAN:')) {
      parsed.panNumber = normalizeOptionalText(part.replace(/^PAN:\s*/i, '').toUpperCase());
      continue;
    }

    if (part.startsWith('Phone:')) {
      parsed.phoneNumber = normalizeOptionalText(part.replace(/^Phone:\s*/i, ''));
      continue;
    }

    if (part.startsWith('Family Members:')) {
      parsed.totalFamilyMembers = normalizeOptionalText(part.replace(/^Family Members:\s*/i, ''));
      continue;
    }

    if (part.startsWith('Ref:')) {
      parsed.referenceNumber = normalizeOptionalText(part.replace(/^Ref:\s*/i, ''));
      continue;
    }

    if (part.startsWith('Proof:')) {
      parsed.proofLabel = normalizeOptionalText(part.replace(/^Proof:\s*/i, ''));
      continue;
    }

    if (part.startsWith('Received By:')) {
      parsed.receivedBy = normalizeOptionalText(part.replace(/^Received By:\s*/i, ''));
      continue;
    }

    messageParts.push(part);
  }

  parsed.message = messageParts.length ? messageParts.join(' • ') : null;

  return parsed;
}

function mapDonationRecord(record: {
  id: string;
  createdAt?: string | null;
  amount?: number | null;
  purpose?: string | null;
  status?: string | null;
  donationStatus?: string | null;
  paymentStatus?: string | null;
  donationType?: string | null;
  receiptNo?: string | null;
  donorName?: string | null;
  donationPurpose?: string | null;
  paymentMode?: DonationRecordItem['paymentMode'] | string | null;
  memberSearch?: string | null;
  receivedBy?: string | null;
  proofLabel?: string | null;
  referenceNumber?: string | null;
  message?: string | null;
  donorUser?: { name?: string | null } | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  phoneNumber?: string | null;
  totalFamilyMembers?: string | number | null;
}) {
  const parsedPurpose = parseDonationPurpose(record.purpose);
  const directPaymentMode = normalizeDonationPaymentMode(record.paymentMode);
  const donorName = parsedPurpose.donorName || record.donorName || record.donorUser?.name || 'Donation';
  const amount = Number(record.amount || 0);
  const addressLine1 = normalizeOptionalText(parsedPurpose.addressLine1 || record.addressLine1);
  const addressLine2 = normalizeOptionalText(parsedPurpose.addressLine2 || record.addressLine2);
  const city = normalizeOptionalText(parsedPurpose.city || record.city);
  const state = normalizeOptionalText(parsedPurpose.state || record.state);
  const country = normalizeOptionalText(parsedPurpose.country || record.country);
  const pincode = normalizeOptionalText(parsedPurpose.pincode || record.pincode);
  const panNumber = normalizeOptionalText(parsedPurpose.panNumber || record.panNumber)?.toUpperCase() || null;
  const phoneNumber = normalizeOptionalText(parsedPurpose.phoneNumber || record.phoneNumber);
  const totalFamilyMembers = normalizeOptionalText(parsedPurpose.totalFamilyMembers || (record.totalFamilyMembers != null ? String(record.totalFamilyMembers) : null));
  const normalizedStatus = normalizeDonationStatus(record.status || record.donationStatus || record.paymentStatus);
  const searchText = [
    donorName,
    record.receiptNo,
    normalizedStatus,
    formatDonationStatusLabel(normalizedStatus),
    record.donationType,
    record.memberSearch || parsedPurpose.memberSearch,
    record.donationPurpose || parsedPurpose.donationPurpose,
    directPaymentMode || parsedPurpose.paymentMode,
    record.referenceNumber || parsedPurpose.referenceNumber,
    record.proofLabel || parsedPurpose.proofLabel,
    record.receivedBy || parsedPurpose.receivedBy,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,
    panNumber,
    phoneNumber,
    totalFamilyMembers,
    record.message || parsedPurpose.message,
    String(amount),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    id: record.id,
    createdAt: record.createdAt || null,
    amount,
    purpose: record.purpose || null,
    donationPurpose: parsedPurpose.donationPurpose || record.donationPurpose || null,
    status: normalizedStatus,
    donationType: record.donationType || null,
    receiptNo: record.receiptNo || null,
    donorName,
    receivedBy: parsedPurpose.receivedBy || record.receivedBy || null,
    paymentMode: parsedPurpose.paymentMode || directPaymentMode,
    memberSearch: parsedPurpose.memberSearch || record.memberSearch || null,
    proofLabel: parsedPurpose.proofLabel || record.proofLabel || null,
    referenceNumber: parsedPurpose.referenceNumber || record.referenceNumber || null,
    message: parsedPurpose.message || record.message || null,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,
    panNumber,
    phoneNumber,
    totalFamilyMembers,
    searchText,
  } satisfies DonationRecordItem;
}

async function loadDonationRecords(mine = true) {
  if (isBackendApiConfigured()) {
    const backendSession = await getBackendSessionContext();
    if (backendSession) {
      try {
        const response = await apiClient<{ data: Parameters<typeof mapDonationRecord>[0][] }>(
          `${apiEndpoints.communityDonations(backendSession.tenantId)}?mine=${mine ? 'true' : 'false'}`,
          { token: backendSession.token },
        );

        return (response.data ?? []).map((record) => mapDonationRecord(record));
      } catch {
        return [];
      }
    }
  }

  return [];
}

async function loadDonationRecordById(recordId: string, mine = true) {
  const records = await loadDonationRecords(mine);
  return records.find((record) => record.id === recordId) ?? null;
}

async function loadDonationRecordsPage(params?: {
  mine?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMode?: 'cash' | 'transfer' | 'cheque' | 'all' | null;
  startDate?: string | null;
  endDate?: string | null;
}): Promise<DonationRecordsPageResponse> {
  if (!isBackendApiConfigured()) {
    return { items: [], pagination: null, summary: emptyDonationRecordsSummary };
  }

  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    return { items: [], pagination: null, summary: emptyDonationRecordsSummary };
  }

  const query = new URLSearchParams();
  query.set('mine', params?.mine === false ? 'false' : 'true');

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
  if (params?.paymentMode && params.paymentMode !== 'all') {
    query.set('paymentMode', params.paymentMode);
  }
  if (params?.startDate) {
    query.set('dateFrom', params.startDate);
  }
  if (params?.endDate) {
    query.set('dateTo', params.endDate);
  }

  const response = await apiClient<{
    data: Parameters<typeof mapDonationRecord>[0][] | {
      items?: Parameters<typeof mapDonationRecord>[0][];
      summary?: Partial<DonationRecordsSummary> | null;
    };
    pagination?: DonationRecordsPagination | null;
  }>(
    `${apiEndpoints.communityDonations(backendSession.tenantId)}?${query.toString()}`,
    { token: backendSession.token },
  );
  const responseItems = Array.isArray(response.data) ? response.data : response.data?.items ?? [];
  const responseSummary = Array.isArray(response.data) ? null : response.data?.summary ?? null;

  return {
    items: responseItems.map((record) => mapDonationRecord(record)),
    pagination: response.pagination ?? null,
    summary: {
      statusCounts: {
        all: Number(responseSummary?.statusCounts?.all || response.pagination?.total || responseItems.length || 0),
        paid: Number(responseSummary?.statusCounts?.paid || 0),
        pending: Number(responseSummary?.statusCounts?.pending || 0),
        cancelled: Number(responseSummary?.statusCounts?.cancelled || 0),
      },
      totalAmount: Number(
        responseSummary?.totalAmount
        ?? responseItems.reduce((sum, record) => sum + Number(record.amount || 0), 0),
      ),
    },
  };
}

async function loadMyTransactionsPage(params?: {
  page?: number;
  limit?: number;
  type?: 'all' | 'donation' | 'event' | 'subscription';
  status?: 'all' | 'completed' | 'pending' | 'failed';
  search?: string;
}): Promise<MemberTransactionsPageResponse> {
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
  if (params?.type && params.type !== 'all') query.set('type', params.type);
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.search?.trim()) query.set('search', params.search.trim());

  const response = await apiClient<{
    data: MemberTransactionItem[];
    pagination?: DonationRecordsPagination | null;
  }>(
    `${apiEndpoints.communityTransactions(backendSession.tenantId)}?${query.toString()}`,
    { token: backendSession.token },
  );

  return {
    items: response.data ?? [],
    pagination: response.pagination ?? null,
  };
}

function formatCompactCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

async function downloadPdfFromBackend(url: string, fileName: string, token: string) {
  const headers: Record<string, string> = {
    ...getActiveTenantRequestHeaders(),
    Authorization: `Bearer ${token}`,
    Accept: 'application/pdf',
  };

  return createAndDeliverPdf({
    source: {
      type: 'url',
      url: `${apiConfig.baseUrl}${url}`,
      headers,
    },
    fileName,
    delivery: 'auto',
  });
}

export const donationService = {
  async loadDonationRecordsPage(params?: {
    mine?: boolean;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentMode?: 'cash' | 'transfer' | 'cheque' | 'all' | null;
    startDate?: string | null;
    endDate?: string | null;
  }) {
    return loadDonationRecordsPage(params);
  },
  async loadMyTransactionsPage(params?: {
    page?: number;
    limit?: number;
    type?: 'all' | 'donation' | 'event' | 'subscription';
    status?: 'all' | 'completed' | 'pending' | 'failed';
    search?: string;
  }) {
    return loadMyTransactionsPage(params);
  },

  async loadDonationRecordsForScope(mine = true) {
    return loadDonationRecords(mine);
  },

  async loadDonationRecordById(recordId: string, mine = true) {
    return loadDonationRecordById(recordId, mine);
  },

  async loadMyTransactions(mine = true) {
    const records = await loadDonationRecords(mine);

    return records.map((record) => ({
      receiptRecord: record,
      id: record.id,
      receiptNo: record.receiptNo,
      title: record.donorName || 'Donation',
      meta: `${formatDonationDateTime(record.createdAt)} • ${record.donationType || 'Donation'}`,
      amount: `-₹${Number(record.amount || 0).toLocaleString('en-IN')}`,
      date: formatDonationDateTime(record.createdAt),
      transactionType: record.donationType || 'Donation',
      icon: 'volunteer-activism',
      tone: '#16a34a',
      bg: '#dcfce7',
    }) as const);
  },

  async loadDonationMetrics() {
    return this.loadDonationMetricsForScope(true);
  },

  async loadDonationMetricsForScope(mine = true) {
    const records = await loadDonationRecords(mine);
    const total = records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
    const recurringDonors = new Set(records.map((record) => String(record.donorName || '').trim().toLowerCase()).filter(Boolean));

    return [
      { label: 'Collected this month', value: formatCompactCurrency(total), accent: 'accent' },
      { label: 'Offline receipts', value: String(records.length), accent: 'warning' },
      { label: 'Recurring donors', value: String(recurringDonors.size), accent: 'primary' },
    ] satisfies MetricItem[];
  },

  async loadDonations() {
    return this.loadDonationsForScope(true);
  },

  async loadDonationsForScope(mine = true) {
    const records = await loadDonationRecords(mine);

    return records.map(
      (record) =>
        ({
          title: `₹${Number(record.amount || 0).toLocaleString('en-IN')}`,
          subtitle: record.receiptNo || record.purpose || record.donorName || 'Donation',
          meta: record.createdAt ? new Date(record.createdAt).toLocaleDateString('en-IN') : '',
          status: formatDonationStatusLabel(record.status),
        }) satisfies ListItem,
    );
  },

  async createDonationRecord(payload: ManualDonationRecordPayload) {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        const response = await apiClient<{ data: Parameters<typeof mapDonationRecord>[0] }>(
          apiEndpoints.communityDonations(backendSession.tenantId),
          {
            method: 'POST',
            token: backendSession.token,
            body: JSON.stringify({
              donorName: payload.donorName,
              amount: payload.amount,
              donationDate: payload.donationDate ?? undefined,
              paymentMode: payload.paymentMode,
              status: payload.status,
              donationStatus: payload.status,
              paymentStatus: payload.status,
              panNumber: payload.panNumber ?? null,
              referenceNumber: payload.referenceNumber ?? null,
              message: payload.message ?? null,
              proofLabel: payload.proofFile?.name ?? payload.proofLabel ?? null,
              memberSearch: payload.registeredMemberSearch ?? null,
              onBehalfUserId: payload.onBehalfUserId ?? null,
            }),
          },
        );
        await invalidateTenantApiData(backendSession.tenantId);
        markDonationRecordsChanged();

        return mapDonationRecord(response.data);
      }
    }

    return mapDonationRecord({
      id: `offline-${Date.now()}`,
      createdAt: new Date().toISOString(),
      amount: Number(payload.amount || 0),
      purpose: [
        payload.registeredMemberSearch ? `Member: ${payload.registeredMemberSearch}` : null,
        payload.donorName ? `Donor: ${payload.donorName}` : null,
        payload.paymentMode ? `Mode: ${payload.paymentMode}` : null,
        payload.panNumber ? `PAN: ${payload.panNumber}` : null,
        payload.referenceNumber ? `Ref: ${payload.referenceNumber}` : null,
        payload.proofFile?.name ? `Proof: ${payload.proofFile.name}` : null,
        payload.message || null,
      ].filter(Boolean).join(' • '),
      status: payload.status,
      receiptNo: null,
      donorUser: {
        name: payload.donorName,
      },
    });
  },

  async updateDonationRecord(recordId: string, payload: ManualDonationRecordPayload) {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        const response = await apiClient<{ data: Parameters<typeof mapDonationRecord>[0] }>(
          apiEndpoints.communityDonationById(backendSession.tenantId, recordId),
          {
            method: 'PATCH',
            token: backendSession.token,
            body: JSON.stringify({
              donorName: payload.donorName,
              amount: payload.amount,
              donationDate: payload.donationDate ?? undefined,
              paymentMode: payload.paymentMode,
              status: payload.status,
              donationStatus: payload.status,
              paymentStatus: payload.status,
              panNumber: payload.panNumber ?? null,
              referenceNumber: payload.referenceNumber ?? null,
              message: payload.message ?? null,
              proofLabel: payload.proofFile?.name ?? payload.proofLabel ?? null,
              memberSearch: payload.registeredMemberSearch ?? null,
              onBehalfUserId: payload.onBehalfUserId ?? null,
            }),
          },
        );
        await invalidateTenantApiData(backendSession.tenantId);
        markDonationRecordsChanged();

        return mapDonationRecord(response.data);
      }
    }

    throw new Error('Unable to update donation while offline.');
  },

  consumeDonationRecordsChanged() {
    const changed = donationRecordsChanged;
    donationRecordsChanged = false;
    return changed;
  },

  async createDonationPaymentOrder(payload: {
    amount: number;
    donorType: string;
    donorName: string;
    purpose: string;
    relation?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    panNumber?: string | null;
    phoneNumber?: string | null;
    totalFamilyMembers?: string | number | null;
    message?: string | null;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const response = await apiClient<{ data: DonationPaymentOrder }>(
      apiEndpoints.communityDonationPaymentOrder(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async openRazorpayCheckout(order: DonationPaymentOrder) {
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

  async verifyDonationPayment(payload: {
    donorName: string;
    message?: string | null;
    razorpay: RazorpayPaymentSuccess;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const response = await apiClient<{ data: Parameters<typeof mapDonationRecord>[0] }>(
      apiEndpoints.communityDonationPaymentVerify(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          donorName: payload.donorName,
          message: payload.message ?? null,
          razorpayOrderId: payload.razorpay.razorpay_order_id,
          razorpayPaymentId: payload.razorpay.razorpay_payment_id,
          razorpaySignature: payload.razorpay.razorpay_signature,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return mapDonationRecord(response.data);
  },

  async downloadDonationSlip(recordId: string, receiptNo?: string | null) {
    if (!isBackendApiConfigured()) {
      return;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const fileName = `donation-slip-${receiptNo || recordId}.pdf`;
    const url = apiEndpoints.communityDonationSlip(backendSession.tenantId, recordId);
    return downloadPdfFromBackend(url, fileName, backendSession.token);
  },

  async generateReceiptAndShare(record: DonationRecordItem) {
    const html = generateDonationReceiptHtml(record, DONATION_RECEIPT_LOGO_URI, DONATION_RECEIPT_QR_URI);
    const fileName = `receipt-${record.receiptNo || record.id}.pdf`;

    return createAndDeliverPdf({
      source: {
        type: 'html',
        html,
        width: 842,
        height: 595,
      },
      fileName,
      delivery: 'share',
    });
  },

  async generateReceiptForDonationId(recordId: string) {
    const record = await loadDonationRecordById(recordId, true);
    if (!record) {
      throw new Error('Donation receipt details were not found.');
    }

    return this.generateReceiptAndShare(record);
  },

  async recordDonation(item: ListItem) {
    return item;
  },
};
