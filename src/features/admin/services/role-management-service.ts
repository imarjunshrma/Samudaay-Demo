import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiQueryClient } from '@/src/services/api/query-client';
import { apiQueryKeys } from '@/src/services/api/query-keys';
import { getBackendSessionContext } from '@/src/features/auth/services/backend-session';

const HIDDEN_PERMISSION_MODULES = new Set(['tenant']);
const HIDDEN_PERMISSION_KEYS = new Set(['community.manage']);

export type RolePermissionItem = {
  id: string;
  key: string;
  name: string;
  module: string;
};

export type RoleCatalogItem = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissions: RolePermissionItem[];
};

export type RoleCatalogResponse = {
  roles: RoleCatalogItem[];
  permissions: RolePermissionItem[];
};

export type RoleCatalogPageResponse = RoleCatalogResponse & {
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type RoleFormValues = {
  name: string;
  description: string;
  permissions: Record<string, boolean>;
};

function toFormValues(role?: RoleCatalogItem | null): RoleFormValues {
  const permissions = Object.fromEntries(
    (role?.permissions ?? [])
      .filter((permission) => !HIDDEN_PERMISSION_MODULES.has(permission.module) && !HIDDEN_PERMISSION_KEYS.has(permission.key))
      .map((permission) => [permission.key, true]),
  );
  return {
    name: role?.name || '',
    description: role?.description || '',
    permissions,
  };
}

async function getSessionContext() {
  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    throw new Error('Session not available.');
  }
  return backendSession;
}

function mapRoleItem(role: RoleCatalogItem): RoleCatalogItem {
  return {
    ...role,
    permissions: (role.permissions ?? []).filter((permission) => !HIDDEN_PERMISSION_MODULES.has(permission.module) && !HIDDEN_PERMISSION_KEYS.has(permission.key)),
  };
}

function mapCatalogResponse(catalog: RoleCatalogResponse): RoleCatalogResponse {
  return {
    roles: (catalog.roles ?? []).map(mapRoleItem),
    permissions: (catalog.permissions ?? []).filter((permission) => !HIDDEN_PERMISSION_MODULES.has(permission.module) && !HIDDEN_PERMISSION_KEYS.has(permission.key)),
  };
}

async function invalidateRoleQueries(tenantId: string) {
  await Promise.all([
    apiQueryClient.invalidateQueries({ queryKey: apiQueryKeys.roles(tenantId), exact: false, refetchType: 'all' }),
    invalidateTenantApiData(tenantId),
  ]);
}

export const roleManagementService = {
  toFormValues,
  async loadCatalog(): Promise<RoleCatalogResponse> {
    const backendSession = await getSessionContext();
    return apiQueryClient.fetchQuery({
      queryKey: apiQueryKeys.roles(backendSession.tenantId),
      staleTime: 0,
      queryFn: async () => {
        const response = await apiClient<{ data: RoleCatalogResponse }>(apiEndpoints.communityRoles(backendSession.tenantId), {
          token: backendSession.token,
        });
        return mapCatalogResponse(response.data);
      },
    });
  },
  async loadRolesPage(params?: { page?: number; limit?: number; search?: string; force?: boolean }): Promise<RoleCatalogPageResponse> {
    const backendSession = await getSessionContext();
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    const queryKey = apiQueryKeys.rolesPage(backendSession.tenantId, params?.page, params?.limit, params?.search);
    if (params?.force) {
      await apiQueryClient.invalidateQueries({ queryKey, exact: true, refetchType: 'none' });
    }
    return apiQueryClient.fetchQuery({
      queryKey,
      staleTime: 0,
      queryFn: async () => {
        const response = await apiClient<{ data: RoleCatalogResponse; pagination?: RoleCatalogPageResponse['pagination'] }>(
          `${apiEndpoints.communityRoles(backendSession.tenantId)}${query.toString() ? `?${query.toString()}` : ''}`,
          { token: backendSession.token },
        );
        const catalog = mapCatalogResponse(response.data);
        return {
          ...catalog,
          pagination: response.pagination ?? null,
        };
      },
    });
  },
  async loadRole(roleId: string): Promise<RoleCatalogItem> {
    const backendSession = await getSessionContext();
    return apiQueryClient.fetchQuery({
      queryKey: apiQueryKeys.role(backendSession.tenantId, roleId),
      staleTime: 0,
      queryFn: async () => {
        const response = await apiClient<{ data: RoleCatalogItem }>(apiEndpoints.communityRole(backendSession.tenantId, roleId), {
          token: backendSession.token,
        });
        return mapRoleItem(response.data);
      },
    });
  },
  async createRole(values: RoleFormValues): Promise<RoleCatalogItem> {
    const backendSession = await getSessionContext();
    const permissions = Object.entries(values.permissions)
      .filter(([, selected]) => selected)
      .map(([key]) => key);
    const response = await apiClient<{ data: RoleCatalogItem }>(apiEndpoints.communityRoles(backendSession.tenantId), {
      method: 'POST',
      token: backendSession.token,
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        permissions,
      }),
    });
    const role = mapRoleItem(response.data);
    await invalidateRoleQueries(backendSession.tenantId);
    return role;
  },
  async updateRole(roleId: string, values: RoleFormValues): Promise<RoleCatalogItem> {
    const backendSession = await getSessionContext();
    const permissions = Object.entries(values.permissions)
      .filter(([, selected]) => selected)
      .map(([key]) => key);
    const response = await apiClient<{ data: RoleCatalogItem }>(apiEndpoints.communityRole(backendSession.tenantId, roleId), {
      method: 'PATCH',
      token: backendSession.token,
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        permissions,
      }),
    });
    const role = mapRoleItem(response.data);
    await invalidateRoleQueries(backendSession.tenantId);
    return role;
  },
  async deleteRole(roleId: string): Promise<void> {
    const backendSession = await getSessionContext();
    await apiClient(apiEndpoints.communityRole(backendSession.tenantId, roleId), {
      method: 'DELETE',
      token: backendSession.token,
    });
    await invalidateRoleQueries(backendSession.tenantId);
  },
};
