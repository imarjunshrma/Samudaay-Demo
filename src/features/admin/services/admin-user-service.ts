import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';

export type AdminNormalUserItem = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  mobileNumber?: string | null;
  role?: string | null;
  userType?: string | null;
  status?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  memberId?: string | null;
  profilePic?: string | null;
  lastActiveAt?: string | null;
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
  async loadNormalUsers(params?: { search?: string; cursor?: string | null; limit?: number }): Promise<AdminNormalUsersResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], nextCursor: null };
    }

    const backendSession = await getSessionContext();
    const queryParts = new URLSearchParams({
      userType: 'all',
      includeBlocked: 'true',
    });

    if (params?.search?.trim()) {
      queryParts.set('q', params.search.trim());
    }

    const response = await apiClient<{ data: (AdminNormalUserItem & { lastUpdatedAt?: string | null })[] }>(
      `${apiEndpoints.communityDirectoryMembers(backendSession.tenantId)}?${queryParts.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map((user) => ({
        id: user.id,
        name: user.name || resolveUserPhone(user) || 'User',
        email: user.email ?? null,
        phone: resolveUserPhone(user),
        role: user.role ?? 'user',
        userType: user.userType ?? user.role ?? 'user',
        status: user.status ?? null,
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
      role: user.role ?? 'user',
      userType: user.userType ?? user.role ?? 'user',
      status: user.status ?? null,
      city: user.city ?? null,
      state: user.state ?? null,
      pincode: user.pincode ?? null,
      memberId: user.memberId ?? null,
      profilePic: resolveBackendMediaUrl(user.profilePic) ?? null,
      lastActiveAt: user.lastUpdatedAt ?? user.lastActiveAt ?? null,
    };
  },

  async updateUser(userId: string, payload: { name: string; email?: string | null; phone: string; city?: string | null; state?: string | null; pincode?: string | null; status?: string | null }) {
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
