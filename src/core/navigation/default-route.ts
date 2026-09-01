import { appPaths } from '@/src/core/navigation/paths';
import type { AppViewMode } from '@/src/features/auth/services/session-storage';
import type { Permission, UserRole, UserSession } from '@/src/types/app';

export const adminAccessPermissions: Permission[] = [
  'registration.manage',
  'kyc.approve',
  'profile_requests.manage',
  'directory.manage',
  'user.manage',
  'users.view',
  'users.edit',
  'users.delete',
  'users.block',
  'events.manage',
  'events.attendance',
  'donations.manage',
  'transactions.manage',
  'analytics.view',
  'roles.manage',
  'admins.manage',
  'notifications.manage',
  'matrimony.manage',
  'publications.manage',
];

function normalizeRoleKey(roleKey: string | null | undefined) {
  return String(roleKey || '').trim().toLowerCase().replace(/-/g, '_');
}

export function isAdminLikeSession(session: UserSession | null | undefined) {
  const normalizedRole = normalizeRoleKey(session?.user.role);
  const communityRoleKeys = session?.user.communityRoleKeys ?? [];
  const permissions = session?.user.permissions ?? [];

  return Boolean(
    normalizedRole === 'admin' ||
      normalizedRole === 'admin_staff' ||
      normalizedRole === 'super_admin' ||
      normalizedRole === 'superadmin' ||
      communityRoleKeys.some((roleKey) =>
        ['admin', 'admin_staff', 'super_admin', 'superadmin'].includes(normalizeRoleKey(roleKey)),
      ) ||
      permissions.some((permission) => adminAccessPermissions.includes(permission)),
  );
}

export function isPlainUserSession(session: UserSession | null | undefined) {
  const normalizedRole = normalizeRoleKey(session?.user.role);
  const communityRoleKeys = session?.user.communityRoleKeys ?? [];

  return normalizedRole === 'user' && !communityRoleKeys.some((roleKey) => normalizeRoleKey(roleKey) !== 'user');
}

export function getDefaultRouteForRole(role: UserRole) {
  switch (normalizeRoleKey(role)) {
    case 'admin':
    case 'admin_staff':
    case 'super_admin':
    case 'superadmin':
      return appPaths.admin.home;
    default:
      return appPaths.member.home;
  }
}

export function getDefaultRouteForSession(session: UserSession, appViewMode: AppViewMode = 'admin') {
  if (appViewMode === 'user' && isAdminLikeSession(session)) {
    return appPaths.member.home;
  }

  if (isAdminLikeSession(session)) {
    return appPaths.admin.home;
  }

  if (!session.user.onboardingComplete) {
    return appPaths.onboarding.registration;
  }

  if (
    session.user.communityMembershipStatus &&
    session.user.communityMembershipStatus !== 'ACTIVE'
  ) {
    return '/pending-approval';
  }

  return getDefaultRouteForRole(session.user.role);
}
