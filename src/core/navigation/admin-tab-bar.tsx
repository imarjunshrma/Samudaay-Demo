import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useCallback, useEffect, useRef } from 'react';
import { TabActions } from '@react-navigation/native';

import { AppBottomBar } from '@/src/components/layout/AppBottomBar/AppBottomBar';
import { useSession } from '@/src/core/providers/session-provider';
import { getVisibleAdminBottomBarItems } from './admin-shell';

function routeNameToKey(name: string): string {
  switch (name) {
    case 'dashboard':
      return 'home';
    case 'manage-directory':
      return 'clients';
    case 'invoices':
      return 'invoices';
    case 'profile':
      return 'profile';
    default:
      return 'home';
  }
}

function keyToRouteName(key: string): string {
  switch (key) {
    case 'home':
      return 'dashboard';
    case 'clients':
      return 'manage-directory';
    case 'invoices':
      return 'invoices';
    case 'profile':
      return 'profile';
    default:
      return 'dashboard';
  }
}

export function AdminTabBar({ state, navigation }: BottomTabBarProps) {
  const { session } = useSession();
  const activeRoute = state.routes[state.index];
  const activeKey = routeNameToKey(activeRoute.name);
  const items = getVisibleAdminBottomBarItems(session);
  const navigatingRef = useRef(false);

  useEffect(() => {
    navigatingRef.current = false;
  }, [activeRoute.name]);

  const handleChange = useCallback(
    (key: string) => {
      const routeName = keyToRouteName(key);
      const route = state.routes.find((item) => item.name === routeName);
      if (!route || routeName === activeRoute.name || navigatingRef.current) {
        return;
      }

      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }

      navigatingRef.current = true;
      navigation.dispatch({
        ...TabActions.jumpTo(route.name),
        target: state.key,
      });
    },
    [activeRoute.name, navigation, state.key, state.routes],
  );

  return (
    <AppBottomBar
      forceVisible
      variant="admin"
      activeKey={activeKey}
      items={items}
      onChange={handleChange}
    />
  );
}
