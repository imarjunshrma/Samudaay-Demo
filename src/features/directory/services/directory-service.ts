import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import type { ListItem } from '@/src/types/app';

export interface DirectoryMemberItem extends ListItem {
  id: string;
  memberId?: string | null;
  city: string;
  state: string;
  pincode: string;
  avatarUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  bloodGroup?: string | null;
  familyMembers?: DirectoryFamilyMemberItem[];
  status?: string;
  online?: boolean;
  userType?: 'user' | 'member' | 'community_member' | 'trustee' | 'admin' | string;
  roles?: string[];
  roleAssignments?: DirectoryRoleAssignment[];
  joinStatus?: 'INVITED' | 'REGISTERED' | string;
  registered?: boolean;
}

export interface DirectoryRoleAssignment {
  roleKey: string;
  expiresAt?: string | null;
}

export interface DirectoryFamilyMemberItem {
  id: string;
  name: string;
  relation?: string | null;
  bloodGroup?: string | null;
  phone?: string | null;
  email?: string | null;
}

type BackendDirectoryMember = {
  id: string;
  name: string;
  location?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role?: string;
  userType?: string;
  roles?: string[];
  roleAssignments?: DirectoryRoleAssignment[];
  phone?: string | null;
  phoneNumber?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  bloodGroup?: string | null;
  familyMembers?: DirectoryFamilyMemberItem[];
  memberId?: string | null;
  status?: string | null;
  joinStatus?: string | null;
  registered?: boolean | null;
  online?: boolean;
  profilePic?: string | null;
};

export interface DirectoryImportFile {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
}

export interface DirectoryImportResultRow {
  rowNumber: number;
  status: 'CREATED' | 'SKIPPED' | 'FAILED' | string;
  reason: string;
  userId?: string | null;
  memberId?: string | null;
  name?: string | null;
  phone?: string | null;
  countryCode?: string | null;
  registered?: boolean;
}

export interface DirectoryImportResult {
  summary: {
    totalRows: number;
    created: number;
    skipped: number;
    failed: number;
  };
  rows: DirectoryImportResultRow[];
}

export interface DirectoryMemberFormValues {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
}

export interface DirectoryMembersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  summary?: DirectoryMemberTypeSummary | DirectoryRegistrationSummary;
}

export interface DirectoryRegistrationSummary {
  invited: number;
  registered: number;
  total: number;
}

export interface DirectoryMembersPageResponse {
  items: DirectoryMemberItem[];
  pagination: DirectoryMembersPagination | null;
}

export interface DirectoryMemberTypeSummary {
  user: number;
  member: number;
  community_member: number;
  trustee: number;
  admin: number;
}

export interface DirectoryFilterOptionsResponse {
  states: string[];
  cities: string[];
  citiesByState: Record<string, string[]>;
  pincodes: string[];
  bloodGroups: string[];
  statuses: string[];
  roles: string[];
}

function formatDirectoryRoleLabel(userType?: string | null, role?: string | null) {
  const normalizedUserType = String(userType || '').trim().toLowerCase();
  const normalizedRole = String(role || '').trim();

  if (normalizedUserType === 'admin') return 'Admin';
  if (normalizedUserType === 'trustee') return 'Trustee';
  if (normalizedUserType === 'community_member') return 'Committee Member';
  if (normalizedUserType === 'member') return 'Member';
  if (normalizedUserType === 'user') return 'User';
  if (normalizedRole) return normalizedRole;
  return 'User';
}

function mapDirectoryMemberItem(item: BackendDirectoryMember): DirectoryMemberItem {
  const phone = item.phone ?? item.phoneNumber ?? item.mobileNumber ?? null;

  return {
    id: item.id,
    title: item.name,
    subtitle: formatDirectoryRoleLabel(item.userType, item.role),
    meta: item.location || phone || item.email || item.memberId || '',
    memberId: item.memberId ?? null,
    status: item.online ? 'Online' : 'Active',
    joinStatus: item.joinStatus || (item.registered ? 'REGISTERED' : 'INVITED'),
    registered: Boolean(item.registered || item.joinStatus === 'REGISTERED'),
    city: item.city || '',
    state: item.state || '',
    pincode: item.pincode || '',
    avatarUrl: resolveBackendMediaUrl(item.profilePic) || null,
    phone,
    email: item.email || null,
    bloodGroup: item.bloodGroup || null,
    familyMembers: item.familyMembers ?? [],
    online: item.online,
    userType: item.userType || item.role || 'user',
    roles: item.roles ?? [],
    roleAssignments: item.roleAssignments ?? [],
  } satisfies DirectoryMemberItem;
}

export const directoryService = {
  async loadMembers(query?: { q?: string; userType?: 'all' | 'member' | 'community_member' | 'trustee' | 'admin' | 'user' }): Promise<DirectoryMemberItem[]> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const params = new URLSearchParams();
          if (query?.q) {
            params.set('q', query.q);
          }
          if (query?.userType) {
            params.set('userType', query.userType);
          }
          const queryString = params.toString();
          const response = await apiClient<{ data: BackendDirectoryMember[] }>(
            `${apiEndpoints.communityDirectoryMembers(backendSession.tenantId)}${queryString ? `?${queryString}` : ''}`,
            { token: backendSession.token },
          );
          return (response.data ?? []).map(mapDirectoryMemberItem);
        } catch (error) {
          throw error instanceof Error ? error : new Error('Unable to load users.');
        }
      }
    }

    return [];
  },
  async loadMembersPage(query?: {
    q?: string;
    userType?: 'all' | 'member' | 'community_member' | 'trustee' | 'admin' | 'user';
    state?: string;
    city?: string;
    pincode?: string;
    status?: string;
    role?: string;
    permission?: string;
    bloodGroup?: string;
    page?: number;
    limit?: number;
  }): Promise<DirectoryMembersPageResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const params = new URLSearchParams();
    if (query?.q) {
      params.set('q', query.q);
    }
    if (query?.userType) {
      params.set('userType', query.userType);
    }
    if (query?.state) {
      params.set('state', query.state);
    }
    if (query?.city) {
      params.set('city', query.city);
    }
    if (query?.pincode) {
      params.set('pincode', query.pincode);
    }
    if (query?.status) {
      params.set('status', query.status);
    }
    if (query?.role) {
      params.set('role', query.role);
    }
    if (query?.permission) {
      params.set('permission', query.permission);
    }
    if (query?.bloodGroup) {
      params.set('bloodGroup', query.bloodGroup);
    }
    if (query?.page) {
      params.set('page', String(query.page));
    }
    if (query?.limit) {
      params.set('limit', String(query.limit));
    }

    const queryString = params.toString();
    const response = await apiClient<{
      data: BackendDirectoryMember[];
      pagination?: DirectoryMembersPagination | null;
    }>(
      `${apiEndpoints.communityDirectoryMembers(backendSession.tenantId)}${queryString ? `?${queryString}` : ''}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map(mapDirectoryMemberItem),
      pagination: response.pagination ?? null,
    };
  },
  async loadFilterOptions(query?: { userType?: 'all' | 'member' | 'community_member' | 'trustee' | 'admin' | 'user' }): Promise<DirectoryFilterOptionsResponse> {
    if (!isBackendApiConfigured()) {
      return { states: [], cities: [], citiesByState: {}, pincodes: [], bloodGroups: [], statuses: [], roles: [] };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { states: [], cities: [], citiesByState: {}, pincodes: [], bloodGroups: [], statuses: [], roles: [] };
    }

    const params = new URLSearchParams();
    if (query?.userType) {
      params.set('userType', query.userType);
    }

    const response = await apiClient<{ data: DirectoryFilterOptionsResponse }>(
      `${apiEndpoints.communityDirectoryFilterOptions(backendSession.tenantId)}${params.toString() ? `?${params.toString()}` : ''}`,
      { token: backendSession.token },
    );

    return response.data ?? { states: [], cities: [], citiesByState: {}, pincodes: [], bloodGroups: [], statuses: [], roles: [] };
  },
  async loadRegistrationReport(query?: {
    q?: string;
    joinStatus?: 'all' | 'invited' | 'registered';
    page?: number;
    limit?: number;
  }): Promise<DirectoryMembersPageResponse> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const params = new URLSearchParams();
    if (query?.q) {
      params.set('q', query.q);
    }
    if (query?.joinStatus && query.joinStatus !== 'all') {
      params.set('joinStatus', query.joinStatus);
    }
    if (query?.page) {
      params.set('page', String(query.page));
    }
    if (query?.limit) {
      params.set('limit', String(query.limit));
    }

    const queryString = params.toString();
    const response = await apiClient<{
      data: BackendDirectoryMember[];
      pagination?: DirectoryMembersPagination | null;
    }>(
      `${apiEndpoints.communityDirectoryRegistrationReport(backendSession.tenantId)}${queryString ? `?${queryString}` : ''}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map(mapDirectoryMemberItem),
      pagination: response.pagination ?? null,
    };
  },
  async importMembers(file: DirectoryImportFile): Promise<DirectoryImportResult | null> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'members.xlsx',
      type: file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    } as never);

    const response = await apiClient<{ data: DirectoryImportResult }>(
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
  async loadTrustees(): Promise<DirectoryMemberItem[]> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: BackendDirectoryMember[] }>(
            apiEndpoints.communityDirectoryTrustees(backendSession.tenantId),
            { token: backendSession.token },
          );
          return (response.data ?? []).map(mapDirectoryMemberItem);
        } catch (error) {
          throw error instanceof Error ? error : new Error('Unable to load trustees.');
        }
      }
    }

    return [];
  },
  async loadMember(memberId: string): Promise<DirectoryMemberItem | null> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: BackendDirectoryMember }>(
            apiEndpoints.communityDirectoryMember(backendSession.tenantId, memberId),
            { token: backendSession.token },
          );
          return mapDirectoryMemberItem(response.data);
        } catch {
          return null;
        }
      }
    }

    return null;
  },
  async createMember(values: DirectoryMemberFormValues): Promise<DirectoryMemberItem | null> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const response = await apiClient<{ data: BackendDirectoryMember }>(
      apiEndpoints.communityDirectoryMembers(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify(values),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return mapDirectoryMemberItem(response.data);
  },
  async updateMember(memberId: string, values: DirectoryMemberFormValues): Promise<DirectoryMemberItem | null> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const response = await apiClient<{ data: BackendDirectoryMember }>(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, memberId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify(values),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return mapDirectoryMemberItem(response.data);
  },
  async deleteMember(memberId: string): Promise<void> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return;
    }

    await apiClient(
      apiEndpoints.communityDirectoryMember(backendSession.tenantId, memberId),
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
  },
  async assignMemberRoles(memberId: string, payload: { userType: string; roleKeys: string[]; roleExpiresAt?: string | null }): Promise<DirectoryMemberItem | null> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const response = await apiClient<{ data: BackendDirectoryMember }>(
      apiEndpoints.communityDirectoryMemberRoles(backendSession.tenantId, memberId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify(payload),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return mapDirectoryMemberItem({
      ...response.data,
      userType: response.data.userType || response.data.role || payload.userType || 'user',
    });
  },
};
