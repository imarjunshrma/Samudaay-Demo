import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { resolveSecondaryLanguageText } from '@/src/features/profile/services/secondary-language-text';

export type AdminNormalUserItem = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  mobileNumber?: string | null;
  countryCode?: string | null;
  role?: string | null;
  userType?: string | null;
  status?: string | null;
  joinStatus?: string | null;
  registered?: boolean | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  memberId?: string | null;
  profilePic?: string | null;
  lastActiveAt?: string | null;
};

export type AdminUserImportFile = {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
};

export type AdminUserImportResult = {
  summary: {
    totalRows: number;
    created: number;
    skipped: number;
    failed: number;
  };
  rows: {
    rowNumber: number;
    status: string;
    reason: string;
    userId?: string | null;
    memberId?: string | null;
    name?: string | null;
    phone?: string | null;
    countryCode?: string | null;
    registered?: boolean;
  }[];
};

export type AdminUserRegistrationSummary = {
  invited: number;
  registered: number;
  total: number;
  paid?: number;
  unpaid?: number;
  locked?: number;
};

export type AdminAppSettings = {
  kycSkipMode: 'NONE' | 'INVITED_ONLY' | 'ALL';
  yearlyAppPaymentEnabled: boolean;
  yearlyAppPaymentAmount: number;
  yearlyAppPaymentCurrency: string;
  membershipDurationDays: number;
  yearlyPaymentGraceDays: number;
  renewalReminderEnabled: boolean;
  renewalReminderDays: number[];
  restrictAppAfterGracePeriod: boolean;
};

export type AdminAppMembershipReportItem = {
  id: string;
  memberId?: string | null;
  name: string;
  nameEnglish?: string | null;
  nameSecondLanguage?: string | null;
  phone?: string | null;
  email?: string | null;
  invitedAt?: string | null;
  appLoginStatus: string;
  registered: boolean;
  registrationStatus: string;
  registrationDate?: string | null;
  kycStatus: string;
  paymentRequired: boolean;
  paymentStatus: string;
  membershipStatus: string;
  renewalStatus: string;
  appAccessStatus: string;
  locked: boolean;
  amountDue: number;
  amountPaid: number;
  paidAt?: string | null;
  membershipStartsAt?: string | null;
  expiresAt?: string | null;
  graceEndsAt?: string | null;
};

export type AdminAuditLogItem = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  remarks?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | null;
  actor?: {
    id: string;
    name?: string | null;
    nameEnglish?: string | null;
    nameSecondLanguage?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

export type AdminNormalUsersResponse = {
  items: AdminNormalUserItem[];
  nextCursor: string | null;
};

export type AdminFamilyRegistryMember = {
  id: string;
  name: string;
  relation: string;
  dob?: string | null;
  bloodGroup?: string | null;
  aadhaarNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  education?: string | null;
  schoolName?: string | null;
  currentClass?: string | null;
  occupation?: string | null;
  marksheetRecords?: {
    id: string;
    department: string;
    standardSemester: string;
    academicYear: string;
    fileUrl: string;
    fileName: string | null;
    mimeType: string | null;
    fileSizeBytes: number | null;
    createdAt: string;
  }[];
};

export type AdminFamilyRegistryItem = {
  id: string;
  number: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  memberId?: string | null;
  city?: string | null;
  state?: string | null;
  status?: string | null;
  profilePic?: string | null;
  familyCount: number;
  familyMembers: AdminFamilyRegistryMember[];
};

export type AdminFamilyRegistryRecord = AdminFamilyRegistryItem & {
  pincode?: string | null;
};

export type AdminFamilyRegistryPageResponse = {
  items: AdminFamilyRegistryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

async function getSessionContext() {
  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    throw new Error('Session not available.');
  }
  return backendSession;
}

function resolveUserPhone(user: AdminNormalUserItem) {
  return user.phone ?? user.phoneNumber ?? user.mobileNumber ?? null;
}

export const adminUserService = {
  async loadNormalUsers(params?: { search?: string; cursor?: string | null; limit?: number; joinStatus?: 'all' | 'invited' | 'registered' }): Promise<AdminNormalUsersResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], nextCursor: null };
    }

    const backendSession = await getSessionContext();
    const queryParts = new URLSearchParams({
      userType: 'user',
      includeBlocked: 'true',
    });

    if (params?.search?.trim()) {
      queryParts.set('q', params.search.trim());
    }
    if (params?.joinStatus && params.joinStatus !== 'all') {
      queryParts.set('joinStatus', params.joinStatus);
    }

    const response = await apiClient<{ data: (AdminNormalUserItem & { lastUpdatedAt?: string | null })[] }>(
      `${params?.joinStatus && params.joinStatus !== 'all' ? apiEndpoints.communityDirectoryRegistrationReport(backendSession.tenantId) : apiEndpoints.communityDirectoryMembers(backendSession.tenantId)}?${queryParts.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map((user) => ({
        id: user.id,
        name: user.name || resolveUserPhone(user) || 'User',
        email: user.email ?? null,
        phone: resolveUserPhone(user),
        countryCode: user.countryCode ?? null,
        role: user.role ?? 'user',
        userType: user.userType ?? user.role ?? 'user',
        status: user.status ?? null,
        joinStatus: user.joinStatus ?? (user.registered ? 'REGISTERED' : 'INVITED'),
        registered: Boolean(user.registered || user.joinStatus === 'REGISTERED'),
        city: user.city ?? null,
        state: user.state ?? null,
        pincode: user.pincode ?? null,
        memberId: user.memberId ?? null,
        profilePic: resolveBackendMediaUrl(user.profilePic) ?? null,
        lastActiveAt: user.lastUpdatedAt ?? null,
      })),
      nextCursor: null,
    };
  },

  async loadUser(userId: string): Promise<AdminNormalUserItem> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminNormalUserItem & { lastUpdatedAt?: string | null } }>(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, userId),
      { token: backendSession.token },
    );
    const user = response.data;

    return {
      id: user.id,
      name: user.name || resolveUserPhone(user) || 'User',
      email: user.email ?? null,
      phone: resolveUserPhone(user),
      countryCode: user.countryCode ?? null,
      role: user.role ?? 'user',
      userType: user.userType ?? user.role ?? 'user',
      status: user.status ?? null,
      joinStatus: user.joinStatus ?? (user.registered ? 'REGISTERED' : 'INVITED'),
      registered: Boolean(user.registered || user.joinStatus === 'REGISTERED'),
      city: user.city ?? null,
      state: user.state ?? null,
      pincode: user.pincode ?? null,
      memberId: user.memberId ?? null,
      profilePic: resolveBackendMediaUrl(user.profilePic) ?? null,
      lastActiveAt: user.lastUpdatedAt ?? user.lastActiveAt ?? null,
    };
  },

  async createUser(payload: { name: string; email?: string | null; phone: string; countryCode?: string | null; city?: string | null; state?: string | null; pincode?: string | null }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminNormalUserItem }>(
      apiEndpoints.communityDirectoryMembers(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          fullName: payload.name,
          phone: payload.phone,
          countryCode: payload.countryCode,
          email: payload.email,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          userType: 'user',
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return response.data;
  },

  async loadUserRegistrationSummary(): Promise<AdminUserRegistrationSummary> {
    const backendSession = await getSessionContext();
    const response = await apiClient<{ pagination?: { summary?: AdminUserRegistrationSummary } }>(
      `${apiEndpoints.communityDirectoryRegistrationReport(backendSession.tenantId)}?page=1&limit=1`,
      { token: backendSession.token },
    );
    return response.pagination?.summary ?? { invited: 0, registered: 0, total: 0 };
  },

  async loadAppSettings(): Promise<AdminAppSettings> {
    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminAppSettings }>(
      apiEndpoints.communityAppSettings(backendSession.tenantId),
      { token: backendSession.token },
    );
    return response.data;
  },

  async updateAppSettings(payload: AdminAppSettings): Promise<AdminAppSettings> {
    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminAppSettings }>(
      apiEndpoints.communityAppSettings(backendSession.tenantId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return response.data;
  },

  async loadAppMembershipReport(params?: { paymentStatus?: string; limit?: number }): Promise<{
    items: AdminAppMembershipReportItem[];
    summary: {
      total: number;
      invited: number;
      registered: number;
      paid: number;
      unpaid: number;
      renewalDue: number;
      gracePeriod: number;
      expired: number;
      locked: number;
    };
  }> {
    const backendSession = await getSessionContext();
    const query = new URLSearchParams();
    query.set('limit', String(params?.limit ?? 250));
    if (params?.paymentStatus && params.paymentStatus !== 'all') {
      query.set('paymentStatus', params.paymentStatus);
    }
    const response = await apiClient<{
      data: AdminAppMembershipReportItem[];
      pagination?: {
        summary?: {
          total: number;
          invited: number;
          registered: number;
          paid: number;
          unpaid: number;
          renewalDue: number;
          gracePeriod: number;
          expired: number;
          locked: number;
        };
      };
    }>(
      apiEndpoints.communityAppMembershipReport(backendSession.tenantId, query.toString()),
      { token: backendSession.token },
    );
    const items = await Promise.all((response.data ?? []).map(async (item) => {
      const nameEnglish = item.nameEnglish || item.name;
      return {
        ...item,
        nameEnglish,
        nameSecondLanguage: await resolveSecondaryLanguageText(nameEnglish, null),
      };
    }));

    return {
      items,
      summary: response.pagination?.summary ?? { total: 0, invited: 0, registered: 0, paid: 0, unpaid: 0, renewalDue: 0, gracePeriod: 0, expired: 0, locked: 0 },
    };
  },

  async loadAdminAuditLogs(params?: {
    entityType?: string;
    action?: string;
    actorUserId?: string;
    entityId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: AdminAuditLogItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
  }> {
    const backendSession = await getSessionContext();
    const query = new URLSearchParams();
    query.set('page', String(params?.page ?? 1));
    query.set('limit', String(params?.limit ?? 50));
    if (params?.entityType) query.set('entityType', params.entityType);
    if (params?.action) query.set('action', params.action);
    if (params?.actorUserId) query.set('actorUserId', params.actorUserId);
    if (params?.entityId) query.set('entityId', params.entityId);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);

    const response = await apiClient<{
      data: AdminAuditLogItem[];
      pagination?: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
    }>(
      apiEndpoints.communityAdminAuditLogs(backendSession.tenantId, query.toString()),
      { token: backendSession.token },
    );
    return {
      items: response.data ?? [],
      pagination: response.pagination ?? { page: 1, limit: params?.limit ?? 50, total: 0, totalPages: 1, hasNextPage: false },
    };
  },

  async importUsers(file: AdminUserImportFile): Promise<AdminUserImportResult> {
    const backendSession = await getSessionContext();
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'users.xlsx',
      type: file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    } as never);

    const response = await apiClient<{ data: AdminUserImportResult }>(
      apiEndpoints.communityDirectoryMembersImport(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: formData,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return response.data;
  },

  async updateUser(userId: string, payload: { name: string; email?: string | null; phone: string; countryCode?: string | null; city?: string | null; state?: string | null; pincode?: string | null; status?: string | null }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminNormalUserItem }>(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, userId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'BLOCKED') {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminNormalUserItem }>(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, userId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({ status }),
      },
    );

    return response.data;
  },

  async deleteUser(userId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    await apiClient<{ data: { success: boolean } }>(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, userId),
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
  },

  async loadFamilyRegistry(params?: { search?: string; page?: number; limit?: number }): Promise<AdminFamilyRegistryPageResponse> {
    if (!isBackendApiConfigured()) {
      return {
        items: [],
        pagination: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminFamilyRegistryPageResponse | AdminFamilyRegistryItem[] }>(
      apiEndpoints.communityAdminFamilyRegistry(backendSession.tenantId, params),
      { token: backendSession.token },
    );

    const payload = response.data;
    const items = Array.isArray(payload) ? payload : (payload?.items ?? []);

    return {
      items: (items ?? []).map((item) => ({
        ...item,
        profilePic: resolveBackendMediaUrl(item.profilePic) ?? null,
      })),
      pagination: Array.isArray(payload)
        ? {
            page: params?.page ?? 1,
            limit: params?.limit ?? items.length,
            total: items.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }
        : payload?.pagination ?? {
            page: params?.page ?? 1,
            limit: params?.limit ?? items.length,
            total: items.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
    };
  },

  async loadFamilyRegistryRecord(userId: string): Promise<AdminFamilyRegistryRecord> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getSessionContext();
    const response = await apiClient<{ data: AdminFamilyRegistryRecord }>(
      apiEndpoints.communityAdminFamilyRegistryRecord(backendSession.tenantId, userId),
      { token: backendSession.token },
    );

    return {
      ...response.data,
      profilePic: resolveBackendMediaUrl(response.data.profilePic) ?? null,
      familyMembers: (response.data.familyMembers ?? []).map((member) => ({
        ...member,
        marksheetRecords: (member.marksheetRecords ?? []).map((record) => ({
          ...record,
          fileUrl: resolveBackendMediaUrl(record.fileUrl) || record.fileUrl,
        })),
      })),
    };
  },
};
