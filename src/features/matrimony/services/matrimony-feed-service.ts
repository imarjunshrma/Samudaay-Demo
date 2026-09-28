import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants/apiConfig';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { getRazorpayPaymentErrorMessage } from '@/src/services/error-message';
import type { FileValue } from '@/src/types';
import { colors } from '@/src/theme';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { createAndDeliverPdf } from '@/src/services/files/pdf-file';
import type { RazorpayCheckoutOptions, RazorpayPaymentError, RazorpayPaymentSuccess } from 'react-native-razorpay';
import { DONATION_RECEIPT_LOGO_URI } from '@/src/features/finance/services/donation-receipt-assets';
import { resolveSecondaryLanguageText } from '@/src/features/profile/services/secondary-language-text';

type MatrimonyDiscoveryItem = {
  id: string;
  userId: string;
  name: string;
  subtitle: string;
  image: string;
  ageHeight: string;
  gender?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  maritalStatus?: string | null;
  height?: string | null;
  age?: number | null;
  education: string;
  profession: string;
  familyType?: string | null;
  caste?: string | null;
  community?: string | null;
  location: string;
  locked?: boolean;
  showOnlineStatus?: boolean;
  connection?: {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    chatId?: string | null;
    direction?: string;
  } | null;
};

export type MatrimonyDiscoveryPageResponse = {
  items: MatrimonyDiscoveryItem[];
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type MatrimonyAccessRecord = {
  settings: {
    enabled: boolean;
    mode: 'FREE' | 'PAID' | string;
    browseMode?: 'FREE' | 'PAID' | string;
    interactionMode?: 'FREE' | 'PAID' | string;
    viewerPrice?: number | string;
    profilePrice?: number | string;
    startsAt?: string | null;
    endsAt?: string | null;
    profileApproval?: boolean;
    chatEnabled?: boolean;
    active?: boolean;
    inactiveReason?: string | null;
  };
  subscription: {
    id: string;
    type: 'PROFILE_CREATION' | 'VIEWER_ONLY';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    startsAt: string;
    endsAt: string;
  } | null;
  canManage?: boolean;
  canView?: boolean;
  canCreateProfile?: boolean;
  canSendRequest?: boolean;
  reason?: string | null;
};

export type MatrimonyAnalyticsRecord = {
  metrics: {
    activeProfiles: number;
    activeViewerSubscriptions: number;
    pendingReviewProfiles?: number;
    newActiveProfilesThisMonth: number;
    revenueGenerated: number;
    activeProfilesTrendPercent: number;
    newActiveProfilesTrendPercent: number;
    revenueTrendPercent: number;
  };
  revenueTrend: {
    label: string;
    value: number;
    tone?: 'primary' | 'muted';
  }[];
  recentApprovals: {
    id: string;
    name: string;
    nameEnglish?: string | null;
    nameSecondLanguage?: string | null;
    locationAge: string;
    status: 'APPROVED' | 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED' | string;
    image?: string | null;
    updatedAt?: string | null;
  }[];
};

export type MatrimonySettingsInput = {
  enabled?: boolean;
  mode?: 'FREE' | 'PAID';
  browseMode?: 'FREE' | 'PAID';
  interactionMode?: 'FREE' | 'PAID';
  viewerPrice?: number | string;
  profilePrice?: number | string;
  startsAt?: string | Date | null;
  endsAt?: string | Date | null;
  profileApproval?: boolean;
  chatEnabled?: boolean;
};

export type MatrimonySubscriptionInput = {
  userId?: string;
  targetUserId?: string;
  type: 'PROFILE_CREATION' | 'VIEWER_ONLY';
  startsAt?: string | Date | null;
  endsAt?: string | Date | null;
  durationDays?: number;
  amountPaid?: number | string;
  paymentRef?: string | null;
  grantMode?: 'PAID' | 'COMPLIMENTARY';
};

export type MatrimonyPaymentOrder = {
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
  subscriptionType: 'PROFILE_CREATION' | 'VIEWER_ONLY';
  durationDays: number;
};

export type MatrimonyTransactionInvoiceInput = {
  transactionId: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  subscriptionType?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null;
  subscriptionStartsAt?: string | null;
  subscriptionEndsAt?: string | null;
  paymentRef?: string | null;
};

export type MatrimonyProfileRecord = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob?: string | null;
  height?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  childrenCount?: number | null;
  education?: string | null;
  occupation?: string | null;
  income?: string | null;
  aboutMe?: string | null;
  familyType?: string | null;
  familyBackground?: string | null;
  caste?: string | null;
  community?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  preferredAgeMin?: number | null;
  preferredAgeMax?: number | null;
  preferredLocation?: string | null;
  preferences?: string | null;
  photoUrls: string[];
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'EXPIRED';
  remarks?: string | null;
  hasPendingReview?: boolean;
  pendingReviewData?: Record<string, unknown> | null;
  reviewRequestType?: 'NEW_PROFILE' | 'PROFILE_UPDATE' | string | null;
  reviewChangeSummary?: string[];
  memberId?: string | null;
  profilePhotoUrl?: string | null;
  contact?: {
    phone?: string | null;
    email?: string | null;
  } | null;
  connection?: {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    chatId?: string | null;
    direction?: string;
  } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type MatrimonyProfileInput = {
  firstName: string;
  lastName?: string;
  dob?: string | Date | null;
  height?: string | null;
  education?: string | null;
  occupation?: string | null;
  remarks?: string | null;
  photos?: FileValue[];
  gender?: string | null;
  maritalStatus?: string | null;
  childrenCount?: number | null;
  income?: string | null;
  aboutMe?: string | null;
  familyType?: string | null;
  familyBackground?: string | null;
  caste?: string | null;
  community?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  preferredAgeMin?: number | null;
  preferredAgeMax?: number | null;
  preferredLocation?: string | null;
  preferences?: string | null;
};

export type MatrimonyRequestRecord = {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  senderUserId: string;
  receiverUserId: string;
  sender: string;
  receiver: string;
  senderImage?: string | null;
  receiverImage?: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  remarks?: string | null;
  chatId?: string | null;
  direction: 'sent' | 'received' | 'admin' | string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function pickFirstImage(photoUrls: unknown) {
  if (typeof photoUrls === 'string') {
    const normalized = normalizeProfileText(photoUrls);
    if (normalized) {
      return normalized;
    }
  }
  if (Array.isArray(photoUrls)) {
    const first = photoUrls.find((item) => typeof item === 'string' && normalizeProfileText(item));
    if (typeof first === 'string') {
      return normalizeProfileText(first);
    }
  }
  return '';
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  const normalized = normalizeProfileText(fileUrl);
  if (!normalized) {
    return '';
  }

  if (
    /^https?:\/\//i.test(normalized) ||
    normalized.startsWith('file:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:')
  ) {
    return normalized;
  }

  return `${apiConfig.baseUrl}${normalized}`;
}

function normalizePendingReviewData(data?: Record<string, unknown> | null) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const normalized: Record<string, unknown> = { ...data };

  if (Array.isArray(data.photoUrls)) {
    normalized.photoUrls = data.photoUrls
      .filter((value): value is string => typeof value === 'string')
      .map((value) => resolveBackendMediaUrl(value))
      .filter(Boolean);
  }

  if (typeof data.profilePhotoUrl === 'string') {
    normalized.profilePhotoUrl = resolveBackendMediaUrl(data.profilePhotoUrl);
  }

  if (typeof data.profilePic === 'string') {
    normalized.profilePic = resolveBackendMediaUrl(data.profilePic);
  }

  return normalized;
}

function normalizeMatrimonyRequestRecord(record: MatrimonyRequestRecord): MatrimonyRequestRecord {
  return {
    ...record,
    senderImage: resolveBackendMediaUrl(record.senderImage || null) || null,
    receiverImage: resolveBackendMediaUrl(record.receiverImage || null) || null,
  };
}

function isRemotePhotoUri(uri?: string | null) {
  return /^https?:\/\//i.test(String(uri || '').trim());
}

function normalizeProfileText(value?: string | null) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'undefined' || trimmed.toLowerCase() === 'null') {
    return '';
  }
  return trimmed;
}

function toAgeHeight(dob?: string | null, height?: string | null) {
  const age = dob ? Math.max(Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)), 0) : null;
  return [age ? `${age} yrs` : null, height || null].filter(Boolean).join(', ');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString('en-IN', options ?? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatSubscriptionTypeLabel(type?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null) {
  if (type === 'VIEWER_ONLY') {
    return 'Viewer Only';
  }

  if (type === 'PROFILE_CREATION') {
    return 'Profile Creation';
  }

  return 'Matrimony Subscription';
}

function getSubscriptionPlanDescription(type?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null) {
  if (type === 'VIEWER_ONLY') {
    return 'Access to browse matrimony profiles.';
  }

  if (type === 'PROFILE_CREATION') {
    return 'Access to browse profiles, create a matrimony profile, and send requests.';
  }

  return 'Paid matrimony access plan.';
}

function buildMatrimonyInvoiceHtml(invoice: MatrimonyTransactionInvoiceInput) {
  const planName = formatSubscriptionTypeLabel(invoice.subscriptionType);
  const purchasedOn = formatDate(invoice.createdAt);
  const startsOn = formatDate(invoice.subscriptionStartsAt, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const endsOn = formatDate(invoice.subscriptionEndsAt, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const invoiceNo = invoice.paymentRef || invoice.transactionId;
  const durationText =
    invoice.subscriptionStartsAt && invoice.subscriptionEndsAt
      ? `${startsOn} to ${endsOn}`
      : 'As per active plan';

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Matrimony Invoice ${escapeHtml(invoiceNo)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #172554;
            background: #fff7ed;
          }
          .page {
            width: 794px;
            min-height: 1123px;
            margin: 0 auto;
            background: linear-gradient(180deg, #fff7ed 0%, #ffffff 26%);
            padding: 40px;
          }
          .card {
            background: #ffffff;
            border: 1px solid #fed7aa;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
          }
          .hero {
            padding: 28px 30px 22px;
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border-bottom: 1px solid #fed7aa;
          }
          .hero-top {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .brand img {
            width: 64px;
            height: 64px;
            object-fit: contain;
            border-radius: 18px;
            background: #ffffff;
            border: 1px solid rgba(242, 120, 13, 0.18);
            padding: 8px;
          }
          .eyebrow {
            margin: 0 0 6px;
            font-size: 12px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #c2410c;
            font-weight: 700;
          }
          h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1.1;
            color: #111827;
          }
          .subtext {
            margin: 8px 0 0;
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            max-width: 420px;
          }
          .invoice-badge {
            min-width: 180px;
            padding: 16px 18px;
            border-radius: 18px;
            background: #ffffff;
            border: 1px solid #fdba74;
          }
          .invoice-badge .label {
            font-size: 12px;
            color: #9a3412;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 700;
          }
          .invoice-badge .value {
            margin-top: 8px;
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            word-break: break-word;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            padding: 24px 30px 0;
          }
          .summary-card {
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 16px;
            background: #ffffff;
          }
          .summary-card .label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .summary-card .value {
            margin-top: 8px;
            font-size: 18px;
            line-height: 1.35;
            color: #0f172a;
            font-weight: 700;
          }
          .content {
            padding: 24px 30px 30px;
            display: grid;
            gap: 18px;
          }
          .section {
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            overflow: hidden;
          }
          .section-header {
            padding: 14px 18px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 700;
            color: #334155;
          }
          .section-body {
            padding: 18px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px 18px;
          }
          .detail-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 700;
          }
          .detail-value {
            margin-top: 6px;
            font-size: 15px;
            line-height: 1.5;
            color: #0f172a;
            font-weight: 600;
            word-break: break-word;
          }
          .plan-copy {
            font-size: 15px;
            line-height: 1.8;
            color: #334155;
          }
          .footer {
            padding: 0 30px 30px;
            font-size: 12px;
            line-height: 1.7;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="card">
            <div class="hero">
              <div class="hero-top">
                <div class="brand">
                  <img src="${DONATION_RECEIPT_LOGO_URI}" alt="Community logo" />
                  <div>
                    <p class="eyebrow">Transaction Invoice</p>
                    <h1>Matrimony Subscription PDF</h1>
                    <p class="subtext">${escapeHtml(getSubscriptionPlanDescription(invoice.subscriptionType))}</p>
                  </div>
                </div>
                <div class="invoice-badge">
                  <div class="label">Invoice Ref</div>
                  <div class="value">${escapeHtml(invoiceNo)}</div>
                </div>
              </div>
            </div>

            <div class="summary">
              <div class="summary-card">
                <div class="label">Plan</div>
                <div class="value">${escapeHtml(planName)}</div>
              </div>
              <div class="summary-card">
                <div class="label">Amount Paid</div>
                <div class="value">${escapeHtml(formatCurrency(invoice.amount))}</div>
              </div>
              <div class="summary-card">
                <div class="label">Status</div>
                <div class="value">${escapeHtml(String(invoice.status || 'ACTIVE'))}</div>
              </div>
              <div class="summary-card">
                <div class="label">Purchased On</div>
                <div class="value">${escapeHtml(purchasedOn)}</div>
              </div>
            </div>

            <div class="content">
              <div class="section">
                <div class="section-header">Plan Details</div>
                <div class="section-body">
                  <div class="details-grid">
                    <div>
                      <div class="detail-label">Subscription Type</div>
                      <div class="detail-value">${escapeHtml(planName)}</div>
                    </div>
                    <div>
                      <div class="detail-label">Plan Duration</div>
                      <div class="detail-value">${escapeHtml(durationText)}</div>
                    </div>
                    <div>
                      <div class="detail-label">Starts On</div>
                      <div class="detail-value">${escapeHtml(startsOn)}</div>
                    </div>
                    <div>
                      <div class="detail-label">Ends On</div>
                      <div class="detail-value">${escapeHtml(endsOn)}</div>
                    </div>
                    <div>
                      <div class="detail-label">Payment Reference</div>
                      <div class="detail-value">${escapeHtml(invoice.paymentRef || '-')}</div>
                    </div>
                    <div>
                      <div class="detail-label">Transaction ID</div>
                      <div class="detail-value">${escapeHtml(invoice.transactionId)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-header">Included Access</div>
                <div class="section-body">
                  <div class="plan-copy">${escapeHtml(getSubscriptionPlanDescription(invoice.subscriptionType))}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              This invoice was generated from your matrimony transaction history. Keep this PDF for your payment and subscription reference.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function mapProfileRecord(profile: {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string | null;
  dob?: string | null;
  height?: string | null;
  education?: string | null;
  occupation?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  childrenCount?: number | null;
  income?: string | null;
  aboutMe?: string | null;
  familyType?: string | null;
  familyBackground?: string | null;
  caste?: string | null;
  community?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  preferredAgeMin?: number | null;
  preferredAgeMax?: number | null;
  preferredLocation?: string | null;
  preferences?: string | null;
  photoUrls?: unknown;
  status?: string | null;
  remarks?: string | null;
  hasPendingReview?: boolean;
  pendingReviewData?: Record<string, unknown> | null;
  reviewRequestType?: string | null;
  reviewChangeSummary?: unknown[];
  memberId?: string | null;
  profilePhotoUrl?: string | null;
  contact?: {
    phone?: string | null;
    email?: string | null;
  } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}): MatrimonyProfileRecord {
  return {
    id: profile.id,
    userId: profile.userId,
    firstName: normalizeProfileText(profile.firstName),
    lastName: normalizeProfileText(profile.lastName),
    dob: profile.dob || null,
    height: profile.height || null,
    gender: normalizeProfileText(profile.gender) || null,
    maritalStatus: normalizeProfileText(profile.maritalStatus) || null,
    childrenCount: typeof profile.childrenCount === 'number' ? profile.childrenCount : null,
    education: normalizeProfileText(profile.education) || null,
    occupation: normalizeProfileText(profile.occupation) || null,
    income: normalizeProfileText(profile.income) || null,
    aboutMe: normalizeProfileText(profile.aboutMe) || null,
    familyType: normalizeProfileText(profile.familyType) || null,
    familyBackground: normalizeProfileText(profile.familyBackground) || null,
    caste: normalizeProfileText(profile.caste) || null,
    community: normalizeProfileText(profile.community) || null,
    area: normalizeProfileText(profile.area) || null,
    city: normalizeProfileText(profile.city) || null,
    state: normalizeProfileText(profile.state) || null,
    country: normalizeProfileText(profile.country) || null,
    preferredAgeMin: profile.preferredAgeMin ?? null,
    preferredAgeMax: profile.preferredAgeMax ?? null,
    preferredLocation: normalizeProfileText(profile.preferredLocation) || null,
    preferences: normalizeProfileText(profile.preferences) || null,
    photoUrls: Array.isArray(profile.photoUrls)
      ? profile.photoUrls
          .filter((value): value is string => typeof value === 'string')
          .map((value) => resolveBackendMediaUrl(value))
          .filter(Boolean)
      : [],
    status: (profile.status as MatrimonyProfileRecord['status']) || 'DRAFT',
    remarks: normalizeProfileText(profile.remarks) || null,
    hasPendingReview: Boolean(profile.hasPendingReview),
    pendingReviewData: normalizePendingReviewData(profile.pendingReviewData),
    reviewRequestType: normalizeProfileText(profile.reviewRequestType) || null,
    reviewChangeSummary: Array.isArray(profile.reviewChangeSummary)
      ? profile.reviewChangeSummary.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
      : [],
    memberId: normalizeProfileText(profile.memberId) || null,
    profilePhotoUrl: resolveBackendMediaUrl(profile.profilePhotoUrl) || null,
    contact: profile.contact
      ? {
          phone: normalizeProfileText(profile.contact.phone) || null,
          email: normalizeProfileText(profile.contact.email) || null,
        }
      : null,
    connection: profile.connection || null,
    createdAt: profile.createdAt || null,
    updatedAt: profile.updatedAt || null,
  };
}

export const matrimonyFeedService = {
  async loadAccess(): Promise<MatrimonyAccessRecord | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const response = await apiClient<{ data: MatrimonyAccessRecord }>(
      apiEndpoints.communityMatrimonyAccess(backendSession.tenantId),
      { token: backendSession.token },
    );

    return response.data;
  },

  async loadAnalytics(): Promise<MatrimonyAnalyticsRecord> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const response = await apiClient<{ data: MatrimonyAnalyticsRecord }>(
      apiEndpoints.communityMatrimonyAnalytics(backendSession.tenantId),
      { token: backendSession.token },
    );

    return {
      ...response.data,
      recentApprovals: await Promise.all((response.data.recentApprovals ?? []).map(async (profile) => {
        const nameEnglish = profile.nameEnglish || profile.name;
        return {
          ...profile,
          nameEnglish,
          nameSecondLanguage: await resolveSecondaryLanguageText(nameEnglish, null),
        };
      })),
    };
  },

  async updateSettings(payload: MatrimonySettingsInput): Promise<MatrimonyAccessRecord['settings']> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const serializeDate = (value: string | Date | null | undefined) => {
      if (value === null || value === undefined || value === '') return null;
      return value instanceof Date ? value.toISOString() : value;
    };

    const response = await apiClient<{ data: MatrimonyAccessRecord['settings'] }>(
      apiEndpoints.communityMatrimonySettings(backendSession.tenantId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({
          ...payload,
          startsAt: payload.startsAt !== undefined ? serializeDate(payload.startsAt) : undefined,
          endsAt: payload.endsAt !== undefined ? serializeDate(payload.endsAt) : undefined,
        }),
      },
    );

    return response.data;
  },

  async createSubscription(payload: MatrimonySubscriptionInput) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const serializeDate = (value: string | Date | null | undefined) => {
      if (value === null || value === undefined || value === '') return undefined;
      return value instanceof Date ? value.toISOString() : value;
    };

    const response = await apiClient<{ data: { id: string } }>(
      apiEndpoints.communityMatrimonySubscriptions(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          ...payload,
          startsAt: serializeDate(payload.startsAt),
          endsAt: serializeDate(payload.endsAt),
        }),
      },
    );

    return response.data;
  },

  async createPaymentOrder(payload: { type: 'PROFILE_CREATION' | 'VIEWER_ONLY'; durationDays?: number }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const response = await apiClient<{ data: MatrimonyPaymentOrder }>(
      apiEndpoints.communityMatrimonyPaymentOrder(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async openRazorpayCheckout(order: MatrimonyPaymentOrder) {
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

  async verifyPayment(payload: { razorpay: RazorpayPaymentSuccess }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const response = await apiClient<{ data: MatrimonyAccessRecord['subscription'] }>(
      apiEndpoints.communityMatrimonyPaymentVerify(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          razorpayOrderId: payload.razorpay.razorpay_order_id,
          razorpayPaymentId: payload.razorpay.razorpay_payment_id,
          razorpaySignature: payload.razorpay.razorpay_signature,
        }),
      },
    );

    await invalidateTenantApiData(backendSession.tenantId);
    return response.data;
  },

  async downloadSubscriptionInvoice(invoice: MatrimonyTransactionInvoiceInput) {
    const planLabel = invoice.subscriptionType === 'VIEWER_ONLY' ? 'viewer' : 'profile';
    return createAndDeliverPdf({
      source: {
        type: 'html',
        html: buildMatrimonyInvoiceHtml(invoice),
        width: 794,
        height: 1123,
      },
      fileName: `matrimony-${planLabel}-invoice-${invoice.paymentRef || invoice.transactionId}.pdf`,
      delivery: 'share',
    });
  },

  async loadMyProfile(): Promise<MatrimonyProfileRecord | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: MatrimonyProfileRecord | null }>(
        apiEndpoints.communityMatrimonyMe(backendSession.tenantId),
        { token: backendSession.token },
      );

      return response.data ? mapProfileRecord(response.data) : null;
    } catch {
      return null;
    }
  },

  async saveMyProfile(payload: MatrimonyProfileInput): Promise<MatrimonyProfileRecord> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const formData = new FormData();
    formData.append('firstName', payload.firstName);
    formData.append('lastName', payload.lastName || '');
    if (payload.dob) {
      formData.append('dob', payload.dob instanceof Date ? payload.dob.toISOString() : payload.dob);
    }
    formData.append('height', payload.height || '');
    formData.append('gender', payload.gender || '');
    formData.append('maritalStatus', payload.maritalStatus || '');
    formData.append('childrenCount', payload.childrenCount !== null && payload.childrenCount !== undefined ? String(payload.childrenCount) : '');
    formData.append('education', payload.education || '');
    formData.append('occupation', payload.occupation || '');
    formData.append('remarks', payload.remarks || '');
    formData.append('income', payload.income || '');
    formData.append('aboutMe', payload.aboutMe || '');
    formData.append('familyType', payload.familyType || '');
    formData.append('familyBackground', payload.familyBackground || '');
    formData.append('caste', payload.caste || '');
    formData.append('community', payload.community || '');
    formData.append('area', payload.area || '');
    formData.append('city', payload.city || '');
    formData.append('state', payload.state || '');
    formData.append('country', payload.country || '');
    formData.append('preferredAgeMin', payload.preferredAgeMin ? String(payload.preferredAgeMin) : '');
    formData.append('preferredAgeMax', payload.preferredAgeMax ? String(payload.preferredAgeMax) : '');
    formData.append('preferredLocation', payload.preferredLocation || '');
    formData.append('preferences', payload.preferences || '');

    const retainedPhotoUrls = (payload.photos ?? [])
      .map((photo) => String(photo?.uri || '').trim())
      .filter((uri) => isRemotePhotoUri(uri));

    retainedPhotoUrls.forEach((uri) => {
      formData.append('retainedPhotoUrls', uri);
    });

    (payload.photos ?? [])
      .filter((photo) => !isRemotePhotoUri(photo?.uri))
      .forEach((photo, index) => {
      formData.append('files', {
        uri: photo.uri,
        name: photo.name || `photo-${index + 1}.jpg`,
        type: photo.mimeType || 'image/jpeg',
      } as never);
      });

    const response = await apiClient<{ data: MatrimonyProfileRecord }>(
      apiEndpoints.communityMatrimonyMe(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: formData,
      },
    );

    return mapProfileRecord(response.data);
  },

  async loadDiscoveryProfiles(): Promise<MatrimonyDiscoveryItem[]> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; userId: string; firstName: string; lastName?: string | null; dob?: string | null; age?: number | null; gender?: string | null; maritalStatus?: string | null; height?: string | null; education?: string | null; occupation?: string | null; familyType?: string | null; caste?: string | null; community?: string | null; city?: string | null; state?: string | null; country?: string | null; photoUrls?: unknown; userCommunity?: { user?: { memberId?: string | null } | null } | null; memberId?: string | null; tenantId: string; connection?: MatrimonyDiscoveryItem['connection'] }[] }>(
            apiEndpoints.communityMatrimonyProfiles(backendSession.tenantId),
            { token: backendSession.token },
          );
          return (response.data ?? [])
            .filter((profile) => profile.userId !== backendSession.userId)
            .map((profile) => ({
            id: profile.id,
            userId: profile.userId,
            name: [normalizeProfileText(profile.firstName), normalizeProfileText(profile.lastName)].filter(Boolean).join(' ') || 'Matrimony Profile',
            subtitle: profile.memberId || profile.userCommunity?.user?.memberId ? `Profile ID: ${profile.memberId || profile.userCommunity?.user?.memberId}` : `Profile ID: ${profile.id.slice(0, 6).toUpperCase()}`,
            image: resolveBackendMediaUrl(pickFirstImage(profile.photoUrls)),
            ageHeight: toAgeHeight(profile.dob, profile.height),
            gender: normalizeProfileText(profile.gender),
            country: normalizeProfileText(profile.country),
            state: normalizeProfileText(profile.state),
            city: normalizeProfileText(profile.city),
            maritalStatus: normalizeProfileText(profile.maritalStatus),
            height: normalizeProfileText(profile.height),
            age: profile.age ?? null,
            education: profile.education || 'Community member',
            profession: profile.occupation || 'Member',
            familyType: normalizeProfileText(profile.familyType),
            caste: normalizeProfileText(profile.caste),
            community: normalizeProfileText(profile.community),
            location: [profile.city, profile.state].filter(Boolean).join(', ') || 'Community member',
            showOnlineStatus: false,
            connection: profile.connection || null,
          }));
        } catch (error) {
          throw error instanceof Error ? error : new Error('Unable to load matrimony profiles.');
        }
      }
    }

    return [];
  },

  async loadProfilesForReviewPage(params?: {
    status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
    page?: number;
    limit?: number;
    search?: string;
    filters?: {
      gender?: string;
      country?: string;
      state?: string;
      city?: string;
      maritalStatus?: string;
      education?: string;
      height?: string;
      occupation?: string;
      familyType?: string;
      caste?: string;
      minAge?: string;
      maxAge?: string;
      community?: string;
    };
  }): Promise<{ items: MatrimonyProfileRecord[]; pagination: MatrimonyDiscoveryPageResponse['pagination'] }> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    Object.entries(params?.filters ?? {}).forEach(([key, value]) => {
      const normalized = String(value ?? '').trim();
      if (normalized && normalized !== 'all') {
        query.set(key, normalized);
      }
    });

    const response = await apiClient<{ data: MatrimonyProfileRecord[]; pagination?: MatrimonyDiscoveryPageResponse['pagination'] }>(
      `${apiEndpoints.communityMatrimonyProfiles(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );
    return {
      items: (response.data ?? []).map(mapProfileRecord),
      pagination: response.pagination ?? null,
    };
  },

  async loadProfilesForReview(status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED') {
    const allItems: MatrimonyProfileRecord[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const result = await this.loadProfilesForReviewPage({ status, page, limit: 100 });
      allItems.push(...result.items);
      hasNextPage = Boolean(result.pagination?.hasNextPage);
      page = (result.pagination?.page ?? page) + 1;
    }

    return allItems;
  },
  async loadAllProfilesForReport() {
    const allItems: MatrimonyProfileRecord[] = [];
    const statuses = ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const;

    for (const status of statuses) {
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const result = await this.loadProfilesForReviewPage({ status, page, limit: 100 });
        allItems.push(...result.items);
        hasNextPage = Boolean(result.pagination?.hasNextPage);
        page = (result.pagination?.page ?? page) + 1;
      }
    }

    const seen = new Set<string>();
    return allItems.filter((item) => {
      const key = `${item.id}:${item.status}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },
  async loadDiscoveryProfilesPage(params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: {
      gender?: string;
      country?: string;
      state?: string;
      city?: string;
      maritalStatus?: string;
      education?: string;
      height?: string;
      occupation?: string;
      familyType?: string;
      caste?: string;
      minAge?: string;
      maxAge?: string;
      community?: string;
    };
  }): Promise<MatrimonyDiscoveryPageResponse> {
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
    Object.entries(params?.filters ?? {}).forEach(([key, value]) => {
      const normalized = String(value ?? '').trim();
      if (normalized && normalized !== 'all') {
        query.set(key, normalized);
      }
    });

    const response = await apiClient<{
      data: { id: string; userId: string; firstName: string; lastName?: string | null; dob?: string | null; age?: number | null; gender?: string | null; maritalStatus?: string | null; height?: string | null; education?: string | null; occupation?: string | null; familyType?: string | null; caste?: string | null; community?: string | null; city?: string | null; state?: string | null; country?: string | null; photoUrls?: unknown; userCommunity?: { user?: { memberId?: string | null } | null } | null; memberId?: string | null; tenantId: string; connection?: MatrimonyDiscoveryItem['connection'] }[];
      pagination?: MatrimonyDiscoveryPageResponse['pagination'];
    }>(
      `${apiEndpoints.communityMatrimonyProfiles(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );

    const mappedItems = (response.data ?? [])
      .filter((profile) => profile.userId !== backendSession.userId)
      .map((profile) => ({
        id: profile.id,
        userId: profile.userId,
        name: [normalizeProfileText(profile.firstName), normalizeProfileText(profile.lastName)].filter(Boolean).join(' ') || 'Matrimony Profile',
        subtitle: profile.memberId || profile.userCommunity?.user?.memberId ? `Profile ID: ${profile.memberId || profile.userCommunity?.user?.memberId}` : `Profile ID: ${profile.id.slice(0, 6).toUpperCase()}`,
        image: resolveBackendMediaUrl(pickFirstImage(profile.photoUrls)),
        ageHeight: toAgeHeight(profile.dob, profile.height),
        gender: normalizeProfileText(profile.gender),
        country: normalizeProfileText(profile.country),
        state: normalizeProfileText(profile.state),
        city: normalizeProfileText(profile.city),
        maritalStatus: normalizeProfileText(profile.maritalStatus),
        height: normalizeProfileText(profile.height),
        age: profile.age ?? null,
        education: profile.education || 'Community member',
        profession: profile.occupation || 'Member',
        familyType: normalizeProfileText(profile.familyType),
        caste: normalizeProfileText(profile.caste),
        community: normalizeProfileText(profile.community),
        location: [profile.city, profile.state].filter(Boolean).join(', ') || 'Community member',
        showOnlineStatus: false,
        connection: profile.connection || null,
      }));

    const searchTerm = params?.search?.trim().toLowerCase();
    const items = searchTerm
      ? mappedItems.filter((profile) =>
          [
            profile.name,
            profile.subtitle,
            profile.gender,
            profile.maritalStatus,
            profile.education,
            profile.profession,
            profile.height,
            profile.caste,
            profile.location,
            profile.city,
            profile.state,
            profile.country,
            profile.community,
            profile.familyType,
            profile.ageHeight,
          ]
            .some((value) => String(value || '').toLowerCase().includes(searchTerm)),
        )
      : mappedItems;

    return {
      items,
      pagination: response.pagination ?? null,
    };
  },

  async loadProfileById(profileId: string): Promise<MatrimonyProfileRecord | null> {
    if (!profileId || !isBackendApiConfigured()) {
      return null;
    }
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const response = await apiClient<{ data: MatrimonyProfileRecord }>(
      apiEndpoints.communityMatrimonyProfileById(backendSession.tenantId, profileId),
      { token: backendSession.token },
    );

    return response.data ? mapProfileRecord(response.data) : null;
  },

  async loadConnectionRequests(): Promise<MatrimonyRequestRecord[]> {
    const result = await this.loadConnectionRequestsPage({ page: 1, limit: 50 });
    return result.items;
  },

  async loadConnectionRequestsPage(params?: { page?: number; limit?: number }): Promise<{ items: MatrimonyRequestRecord[]; pagination: MatrimonyDiscoveryPageResponse['pagination'] }> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }
    const query = new URLSearchParams();
    query.set('page', String(params?.page ?? 1));
    query.set('limit', String(params?.limit ?? 20));

    const response = await apiClient<{ data: MatrimonyRequestRecord[]; pagination?: MatrimonyDiscoveryPageResponse['pagination'] }>(
      `${apiEndpoints.communityMatrimonyRequests(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map(normalizeMatrimonyRequestRecord),
      pagination: response.pagination ?? null,
    };
  },

  async sendConnectionRequest(profileId: string, remarks?: string | null): Promise<MatrimonyRequestRecord> {
    const backendSession = await getBackendSessionContext();
    if (!isBackendApiConfigured() || !backendSession) {
      throw new Error('Backend session not found.');
    }

    const response = await apiClient<{ data: MatrimonyRequestRecord }>(apiEndpoints.communityMatrimonyRequests(backendSession.tenantId), {
      method: 'POST',
      token: backendSession.token,
      body: JSON.stringify({ receiverProfileId: profileId, remarks }),
    });

    return normalizeMatrimonyRequestRecord(response.data);
  },

  async reviewConnectionRequest(requestId: string, action: 'accept' | 'reject' | 'cancel', remarks?: string | null): Promise<MatrimonyRequestRecord> {
    const backendSession = await getBackendSessionContext();
    if (!isBackendApiConfigured() || !backendSession) {
      throw new Error('Backend session not found.');
    }

    const response = await apiClient<{ data: MatrimonyRequestRecord }>(apiEndpoints.communityMatrimonyRequestReview(backendSession.tenantId, requestId, action), {
      method: 'PATCH',
      token: backendSession.token,
      body: JSON.stringify({ remarks }),
    });

    return normalizeMatrimonyRequestRecord(response.data);
  },

  async reviewProfile(profileId: string, action: 'approve' | 'reject', remarks?: string | null) {
    const backendSession = await getBackendSessionContext();
    if (!isBackendApiConfigured() || !backendSession) {
      throw new Error('Backend session not found.');
    }

    return apiClient<{ data: MatrimonyProfileRecord }>(
      apiEndpoints.communityMatrimonyProfileReview(backendSession.tenantId, profileId, action),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({ remarks }),
      },
    );
  },
};
