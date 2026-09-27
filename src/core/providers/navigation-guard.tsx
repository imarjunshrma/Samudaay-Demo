// @ts-nocheck
import type { ReactNode } from 'react';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { UI_PREVIEW_AUTH_BYPASS } from '@/src/core/config/ui-preview';
import { canAccessAdminNavKey, getAdminNavKeyForPath } from '@/src/core/navigation/admin-shell';
import { getDefaultRouteForRole, getDefaultRouteForSession, isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { appPaths } from '@/src/core/navigation/paths';
import { canAccessSegment } from '@/src/core/navigation/route-access';
import { palette } from '@/src/theme/tokens';
import { useAppPreferences } from '@/src/core/providers/app-provider';

export function NavigationGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments<string[]>();
  const pendingRedirectRef = useRef<string | null>(null);
  const { resolvedTheme } = useAppPreferences();
  const { appViewMode, status, session, role, permissions } = useSession();
  const colors = palette[resolvedTheme];
  const topLevelSegment = segments[0];

  useEffect(() => {
    pendingRedirectRef.current = null;
  }, [pathname]);

  const replaceOnce = useCallback(
    (target: string) => {
      if (pathname === target || pendingRedirectRef.current === target) {
        return;
      }

      if (__DEV__) {
        console.info('[nav-guard]', {
          pathname,
          target,
          status,
          role,
          source: 'NavigationGuard.replaceOnce',
        });
      }

      pendingRedirectRef.current = target;
      router.replace(target as never);
    },
    [pathname, role, router, status],
  );

  const redirectTarget = useMemo(() => {
    if (UI_PREVIEW_AUTH_BYPASS || status === 'loading') {
      return null;
    }

    if (!topLevelSegment) {
      return null;
    }

    if (status === 'signedOut') {
      const isAllowedAuthLeaf = topLevelSegment === 'login';
      const isPublicRoot = !topLevelSegment;
      const isPublicOnboardingWelcome = topLevelSegment === 'welcome' || topLevelSegment === 'splash';
      const isAnonymousRoute = canAccessSegment(topLevelSegment, undefined, undefined);

      return !isAllowedAuthLeaf && !isPublicRoot && !isPublicOnboardingWelcome && !isAnonymousRoute
        ? appPaths.auth.login
        : null;
    }

    if (!session) {
      return appPaths.auth.login;
    }

    if (topLevelSegment === 'login') {
      return getDefaultRouteForSession(session, appViewMode);
    }

    const isAdminLikeRole = isAdminLikeSession(session);
    const isViewingAsUser = isAdminLikeRole && appViewMode === 'user';

    if (
      isAdminLikeRole &&
      (topLevelSegment === 'welcome' ||
        topLevelSegment === 'registration-kyc' ||
        topLevelSegment === 'pending-approval')
    ) {
      return getDefaultRouteForSession(session, appViewMode);
    }

    if (isViewingAsUser && topLevelSegment === 'admin') {
      return appPaths.member.home;
    }

    if (
      session.user.onboardingComplete &&
      !isAdminLikeRole &&
      session.user.communityMembershipStatus === 'APP_PAYMENT_REQUIRED' &&
      topLevelSegment !== 'app-membership-renewal'
    ) {
      return '/app-membership-renewal';
    }

    if (topLevelSegment === 'app-membership-renewal' && session.user.communityMembershipStatus !== 'APP_PAYMENT_REQUIRED') {
      return getDefaultRouteForSession(session, appViewMode);
    }

    if (
      session.user.onboardingComplete &&
      !isAdminLikeRole &&
      session.user.communityMembershipStatus &&
      session.user.communityMembershipStatus !== 'ACTIVE' &&
      session.user.communityMembershipStatus !== 'APP_PAYMENT_REQUIRED' &&
      topLevelSegment !== 'pending-approval'
    ) {
      return '/pending-approval';
    }

    if (topLevelSegment === 'pending-approval' && session.user.communityMembershipStatus === 'ACTIVE') {
      return getDefaultRouteForSession(session, appViewMode);
    }

    if (session.user.onboardingComplete && (topLevelSegment === 'welcome' || topLevelSegment === 'registration-kyc')) {
      return getDefaultRouteForSession(session, appViewMode);
    }

    if (!isAdminLikeRole && !session.user.onboardingComplete && topLevelSegment !== 'registration-kyc') {
      return appPaths.onboarding.registration;
    }

    const effectivePermissions = Array.from(new Set([...(permissions ?? []), ...(session.user.communityPermissions ?? [])]));

    if (!isViewingAsUser && isAdminLikeRole && topLevelSegment === 'admin' && canAccessSegment(topLevelSegment, role ?? undefined, effectivePermissions)) {
      const adminNavKey = getAdminNavKeyForPath(pathname);
      if (!canAccessAdminNavKey(adminNavKey, session)) {
        return appPaths.admin.home;
      }
      return null;
    }

    if (!canAccessSegment(topLevelSegment, role ?? undefined, effectivePermissions)) {
      return getDefaultRouteForRole(role ?? 'member');
    }

    return null;
  }, [appViewMode, pathname, permissions, role, session, status, topLevelSegment]);

  useEffect(() => {
    if (redirectTarget) {
      replaceOnce(redirectTarget);
    }
  }, [redirectTarget, replaceOnce]);

  const showOverlay = !UI_PREVIEW_AUTH_BYPASS && (status === 'loading' || (redirectTarget && redirectTarget !== pathname));

  return (
    <>
      {children}
      {showOverlay ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </>
  );
}
