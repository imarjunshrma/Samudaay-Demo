import { useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { useSafeNavigation } from './safe-navigation';

const PARENT_ROUTE_RULES: readonly (readonly [string, string])[] = [
  ['/admin/manage-events/edit/', '/admin/manage-events'],
  ['/admin/manage-events/create', '/admin/manage-events'],
  ['/admin/manage-directory/add', '/admin/manage-directory'],
  ['/admin/manage-directory/', '/admin/manage-directory'],
  ['/admin/manage-trustees/add', '/admin/manage-trustees'],
  ['/admin/manage-trustees/', '/admin/manage-trustees'],
  ['/admin/profile-requests/', '/admin/profile-requests'],
  ['/admin/advertisements/create', '/admin/advertisements'],
  ['/admin/advertisements/edit/', '/admin/advertisements'],
  ['/admin/advertisements/', '/admin/advertisements'],
  ['/admin/matrimony-profiles/', '/admin/matrimony-profiles'],
  ['/admin/create-notification', '/admin/notifications'],
  ['/admin/send-birthday-card', '/admin/birthday-reminders'],
  ['/admin/birthday-card-editor', '/admin/birthday-reminders'],
  ['/admin/create-admin', '/admin/manage-trustees'],
  ['/admin/roles/create', '/admin/roles'],
  ['/admin/roles/', '/admin/roles'],
  ['/admin/create-expense', '/finance/expenses'],
  ['/admin/edit-donation', '/admin/manage-donations'],
  ['/admin/record-manual-donation', '/admin/manage-donations'],
  ['/admin/family-registry/', '/admin/family-registry'],
  ['/admin/transaction-analytics', '/admin/analytics'],
  ['/admin/people-analytics', '/admin/analytics'],
  ['/admin/event-analytics', '/admin/analytics'],
  ['/admin/donation-analytics', '/admin/analytics'],
  ['/admin/publication-analytics', '/admin/analytics'],
  ['/admin/advertisement-analytics', '/admin/analytics'],
  ['/admin/notification-analytics', '/admin/analytics'],
  ['/admin/role-analytics', '/admin/analytics'],
  ['/admin/chat-analytics', '/admin/analytics'],
  ['/admin/matrimony-analytics', '/admin/analytics'],
  ['/admin/profit-loss-yearly', '/admin/analytics'],
  ['/finance/profit-loss-event', '/admin/event-analytics'],
  ['/finance/expenses/create', '/finance/expenses'],
  ['/finance/record-manual-donation', '/finance/donation-management'],
  ['/finance/transaction-analytics', '/finance/transaction-management'],
  ['/finance/people-analytics', '/finance/finance-analytics'],
  ['/finance/event-analytics', '/finance/finance-analytics'],
  ['/publications/generate', '/publications/archive'],
  ['/events/event-details-registration', '/events/my-events-list'],
  ['/events/event-details-gallery', '/events/my-events-list'],
  ['/events/event-photo-gallery', '/events/event-details-gallery'],
  ['/events/event-live-chat', '/events/event-details-gallery'],
  ['/events/family-event-passes', '/events/my-events-list'],
  ['/events/qr-scanner', '/admin/manage-events'],
  ['/events/event-performance-dashboard', '/events/my-events-list'],
  ['/profile/change-details', '/profile/my-profile'],
  ['/profile/device-access', '/profile/my-profile'],
  ['/profile/security', '/profile/my-profile'],
  ['/profile/documents', '/profile/my-profile'],
  ['/profile/documents/', '/profile/my-profile'],
  ['/profile/family-management', '/profile/my-profile'],
  ['/profile/family-management/add', '/profile/family-management'],
  ['/profile/family-management/', '/profile/family-management'],
  ['/profile/privacy-policy', '/profile/my-profile'],
  ['/profile/terms-and-conditions', '/profile/my-profile'],
  ['/admin/notification-detail', '/admin/notifications'],
  ['/member/notification-detail', '/member/notifications'],
  ['/matrimony/approve-profiles/', '/matrimony/approve-profiles'],
];

function getRouteParamValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isAbsoluteAppRoute(value?: string | null) {
  return Boolean(value && value.startsWith('/'));
}

export function resolveParentRoute(pathname: string) {
  for (const [prefix, parentRoute] of PARENT_ROUTE_RULES) {
    if (pathname === prefix || pathname.startsWith(prefix)) {
      return parentRoute;
    }
  }

  return null;
}

function resolveRoleAwareParentRoute(pathname: string, isAdmin: boolean) {
  if (
    pathname.startsWith('/profile/change-details') ||
    pathname.startsWith('/profile/device-access') ||
    pathname.startsWith('/profile/security') ||
    pathname.startsWith('/profile/documents')
  ) {
    return isAdmin ? '/admin/profile' : '/member/profile';
  }

  if (pathname.startsWith('/profile/family-management/add') || pathname.startsWith('/profile/family-management/')) {
    const returnTo = isAdmin ? '/admin/profile' : '/member/profile';
    return `/profile/family-management?returnTo=${encodeURIComponent(returnTo)}`;
  }

  if (pathname.startsWith('/profile/family-management')) {
    return isAdmin ? '/admin/profile' : '/member/profile';
  }

  if (
    pathname.startsWith('/events/event-details-registration') ||
    pathname.startsWith('/events/event-details-gallery') ||
    pathname.startsWith('/events/event-photo-gallery') ||
    pathname.startsWith('/events/event-live-chat') ||
    pathname.startsWith('/events/family-event-passes')
  ) {
    return isAdmin ? '/admin/manage-events' : '/member/events';
  }

  if (pathname.startsWith('/events/event-performance-dashboard')) {
    return isAdmin ? '/admin/manage-events' : '/member/events';
  }

  if (pathname.startsWith('/finance/donation-management')) {
    return isAdmin ? '/admin/manage-donations' : '/member/donations';
  }

  if (pathname.startsWith('/finance/record-manual-donation')) {
    return isAdmin ? '/admin/manage-donations' : '/member/donations';
  }

  if (pathname.startsWith('/finance/transaction-management') || pathname.startsWith('/finance/transaction-analytics')) {
    return isAdmin ? '/admin/transaction-management' : '/member/transactions';
  }

  if (pathname.startsWith('/matrimony')) {
    return isAdmin ? '/admin/matrimony-profiles' : '/member/matrimony';
  }

  return null;
}

function resolveBackTarget(pathname: string, returnTo: string | undefined, isAdmin: boolean) {
  if (isAbsoluteAppRoute(returnTo)) {
    return returnTo;
  }

  const roleAwareParentRoute = resolveRoleAwareParentRoute(pathname, isAdmin);
  if (roleAwareParentRoute) {
    return roleAwareParentRoute;
  }

  return resolveParentRoute(pathname);
}

export function useBackNavigation(options?: { interceptNativeBack?: boolean }) {
  const pathname = usePathname();
  const navigation = useNavigation();
  const router = useRouter();
  const { safeBack, safeReplace } = useSafeNavigation();
  const { session } = useSession();
  const params = useGlobalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = getRouteParamValue(params.returnTo);
  const isAdmin = isAdminLikeSession(session);
  const backTarget = useMemo(
    () => resolveBackTarget(pathname, returnTo, isAdmin),
    [isAdmin, pathname, returnTo],
  );
  const interceptNativeBack = options?.interceptNativeBack ?? true;

  useEffect(() => {
    if (!interceptNativeBack || !backTarget) {
      return undefined;
    }

    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      const actionType = event.data.action.type;
      if (actionType !== 'GO_BACK' && actionType !== 'POP' && actionType !== 'POP_TO_TOP') {
        return;
      }

      const canGoBack = router.canGoBack();

      if (__DEV__) {
        console.info('[back-nav]', {
          pathname,
          returnTo,
          backTarget,
          canGoBack,
          actionType,
          interceptNativeBack,
          source: 'useBackNavigation.beforeRemove',
          resolution: canGoBack ? 'allow-native-pop' : backTarget ? 'replace-fallback' : 'allow-default',
        });
      }

      if (canGoBack || !backTarget) {
        return;
      }

      event.preventDefault();
      safeReplace(backTarget);
    });

    return unsubscribe;
  }, [backTarget, interceptNativeBack, navigation, pathname, returnTo, router, safeReplace]);

  return useCallback((fallbackTarget?: string) => {
    if (__DEV__) {
      console.info('[back-nav]', {
        pathname,
        returnTo,
        backTarget,
        canGoBack: router.canGoBack(),
        source: 'useBackNavigation.callback',
        resolution: router.canGoBack() ? 'safeBack-native-pop' : backTarget ? 'safeBack-fallback' : 'safeBack-default',
      });
    }

    if (fallbackTarget) {
      safeBack(fallbackTarget);
      return;
    }

    if (backTarget) {
      safeBack(backTarget);
      return;
    }

    safeBack();
  }, [backTarget, pathname, returnTo, router, safeBack]);
}
