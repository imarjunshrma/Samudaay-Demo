export const apiQueryKeys = {
  all: ['api'] as const,
  tenant: (tenantId?: string | null) => [...apiQueryKeys.all, 'tenant', tenantId ?? 'all'] as const,
  auth: () => [...apiQueryKeys.all, 'auth'] as const,
  profile: (tenantId?: string | null, userId?: string | null) =>
    [...apiQueryKeys.tenant(tenantId), 'profile', userId ?? 'current'] as const,
  tenants: () => [...apiQueryKeys.all, 'tenants'] as const,
  notifications: (tenantId?: string | null) =>
    [...apiQueryKeys.tenant(tenantId), 'notifications'] as const,
  donations: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'donations'] as const,
  expenses: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'expenses'] as const,
  events: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'events'] as const,
  dashboard: (tenantId?: string | null, userId?: string | null) =>
    [...apiQueryKeys.tenant(tenantId), 'dashboard', userId ?? 'all'] as const,
  matrimony: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'matrimony'] as const,
  advertisements: (tenantId?: string | null) =>
    [...apiQueryKeys.tenant(tenantId), 'advertisements'] as const,
  publications: (tenantId?: string | null) =>
    [...apiQueryKeys.tenant(tenantId), 'publications'] as const,
  analytics: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'analytics'] as const,
  admin: (tenantId?: string | null) => [...apiQueryKeys.tenant(tenantId), 'admin'] as const,
  roles: (tenantId?: string | null) => [...apiQueryKeys.admin(tenantId), 'roles'] as const,
  rolesPage: (tenantId?: string | null, page?: number, limit?: number, search?: string) =>
    [...apiQueryKeys.roles(tenantId), 'page', page ?? 1, limit ?? 12, search?.trim() || ''] as const,
  role: (tenantId?: string | null, roleId?: string | null) =>
    [...apiQueryKeys.roles(tenantId), 'detail', roleId ?? 'unknown'] as const,
} as const;
