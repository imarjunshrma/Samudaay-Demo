import { adminAccessPermissions } from '@/src/core/navigation/default-route';
import type { Permission, UserRole } from '@/src/types/app';

interface RouteAccessRule {
  allowAnonymous?: boolean;
  allowOnboarding?: boolean;
  roles?: UserRole[];
  permissions?: Permission[];
  anyPermissions?: Permission[];
}

const publicSegments = new Set(['login', 'welcome', 'splash']);

const routeRules: Record<string, RouteAccessRule> = {
  '(tabs)': {
    allowAnonymous: true,
    roles: [
      'member',
      'community_member',
      'admin',
      'user',
      'trustee',
    ],
  },
  login: { allowAnonymous: true },
  welcome: { allowAnonymous: true },
  splash: { allowAnonymous: true },
  routes: { allowAnonymous: true },
  registration: { allowAnonymous: true },
  'registration-kyc': { allowAnonymous: true },
  'kyc-approval': {},
  'pending-approval': {},
  profile: {},
  directory: {},
  communication: {},
  birthdays: {},
  events: {},
  advertisements: {},
  admin: {
    roles: ['admin'],
    anyPermissions: adminAccessPermissions,
  },
  dashboard: {},
  analytics: { anyPermissions: ['analytics.view'] },
  finance: {},
  expenses: {},
  forms: {},
  roles: { anyPermissions: ['roles.manage'] },
  matrimony: {},
  publications: {},
  'pdf-viewer': {},
  member: {},
  'super-admin': { roles: ['admin'] },
  'design-system': { roles: ['admin'] },
};

export function isPublicSegment(segment?: string) {
  return !segment || publicSegments.has(segment);
}

export function canAccessSegment(
  segment: string | undefined,
  role: UserRole | undefined,
  permissions: Permission[] | undefined,
) {
  if (!segment || isPublicSegment(segment)) {
    return true;
  }

  const rule = routeRules[segment];
  if (!rule) {
    return false;
  }

  if (!role) {
    return Boolean(rule.allowAnonymous);
  }

  const hasRoleAccess = Boolean(rule.roles?.includes(role));
  const hasPermissionRules = Boolean(rule.permissions?.length || rule.anyPermissions?.length);

  if (rule.roles && !hasRoleAccess && !hasPermissionRules) {
    return false;
  }

  if (hasPermissionRules) {
    const hasRequiredPermissions = rule.permissions
      ? rule.permissions.every((permission) => permissions?.includes(permission))
      : true;
    const hasAnyRequiredPermission = rule.anyPermissions
      ? rule.anyPermissions.some((permission) => permissions?.includes(permission))
      : true;

    return hasRoleAccess || (hasRequiredPermissions && hasAnyRequiredPermission);
  }

  return true;
}
