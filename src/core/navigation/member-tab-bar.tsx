import { useCallback, useEffect, useRef } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';

import { AppBottomBar } from '@/src/components/layout/AppBottomBar/AppBottomBar';
import { memberBottomBarItems } from './member-shell';

function routeNameToKey(name: string) {
  switch (name) {
    case 'index':
      return 'home';
    case 'community':
      return 'community';
    case 'members':
      return 'members';
    case 'matrimony':
      return 'matrimony';
    case 'profile':
      return 'profile';
    default:
      return 'home';
  }
}

function keyToRouteName(key: string) {
  switch (key) {
    case 'home':
      return 'index';
    case 'community':
      return 'community';
    case 'members':
      return 'members';
    case 'matrimony':
      return 'matrimony';
    case 'profile':
      return 'profile';
    default:
      return 'index';
  }
}

export function MemberTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];
  const activeKey = routeNameToKey(activeRoute.name);
  const navigatingRef = useRef(false);

  useEffect(() => {
    navigatingRef.current = false;
  }, [activeRoute.name]);

  // Stable reference so AppBottomBar's memo() can bail out on re-renders
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
      activeKey={activeKey}
      items={memberBottomBarItems}
      onChange={handleChange}
    />
  );
}
