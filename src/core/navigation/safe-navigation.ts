import { usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';

function toRouteString(route: unknown) {
  if (typeof route === 'string') {
    return route;
  }
  if (route && typeof route === 'object' && 'pathname' in route) {
    const pathname = (route as { pathname?: unknown }).pathname;
    return typeof pathname === 'string' ? pathname : '/';
  }
  return '/';
}

function stripQueryAndHash(route: unknown) {
  const routeString = toRouteString(route);
  return routeString.split('#')[0]?.split('?')[0] || routeString;
}

export function normalizeAppRoute(route: unknown) {
  const withoutQuery = stripQueryAndHash(route);
  const withoutGroups = withoutQuery.replace(/\/\([^/]+\)/g, '');
  const withoutIndex = withoutGroups.replace(/\/index$/, '');
  const normalized = withoutIndex.replace(/\/{2,}/g, '/');

  return normalized || '/';
}

export function isSameAppRoute(currentPathname: unknown, targetRoute: unknown) {
  return normalizeAppRoute(currentPathname) === normalizeAppRoute(targetRoute);
}

function logNavigation(action: string, currentPathname: unknown, targetRoute?: unknown) {
  if (!__DEV__) {
    return;
  }

  // Temporary navigation audit log for stack-duplication debugging.
  console.info('[nav]', {
    action,
    currentPathname: normalizeAppRoute(currentPathname),
    targetRoute: targetRoute ? normalizeAppRoute(targetRoute) : undefined,
  });
}

export function useSafeNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const safePush = useCallback((targetRoute: string) => {
    if (isSameAppRoute(pathname, targetRoute)) {
      logNavigation('push-skip-same', pathname, targetRoute);
      return;
    }

    logNavigation('push', pathname, targetRoute);
    router.push(targetRoute as never);
  }, [pathname, router]);

  const safeReplace = useCallback((targetRoute: string) => {
    if (isSameAppRoute(pathname, targetRoute)) {
      logNavigation('replace-skip-same', pathname, targetRoute);
      return;
    }

    logNavigation('replace', pathname, targetRoute);
    router.replace(targetRoute as never);
  }, [pathname, router]);

  const safeNavigateRoot = useCallback((targetRoute: string) => {
    if (isSameAppRoute(pathname, targetRoute)) {
      logNavigation('root-skip-same', pathname, targetRoute);
      return;
    }

    logNavigation('root-replace', pathname, targetRoute);
    router.replace(targetRoute as never);
  }, [pathname, router]);

  const safeBack = useCallback((fallbackRoute?: string | null) => {
    if (router.canGoBack()) {
      logNavigation('back', pathname, fallbackRoute);
      router.back();
      return;
    }

    if (fallbackRoute) {
      safeReplace(fallbackRoute);
      return;
    }

    logNavigation('back-noop', pathname);
  }, [pathname, router, safeReplace]);

  return {
    safeBack,
    safeNavigateRoot,
    safePush,
    safeReplace,
  };
}
