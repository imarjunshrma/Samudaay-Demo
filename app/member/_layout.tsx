import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
  type DrawerNavigationEventMap,
  type DrawerNavigationOptions,
} from '@react-navigation/drawer';
import type { ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationState } from '@react-navigation/routers';
import { withLayoutContext } from 'expo-router';
import { useCallback } from 'react';

import { appDrawerScreenOptions } from '@/src/core/navigation/navigation-options';
import { ProtectedRouteBoundary } from '@/src/core/navigation/ProtectedRouteBoundary';
import { MemberDrawerContent } from '@/src/core/navigation/member-drawer-content';

const DrawerNavigator = createDrawerNavigator();

const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof DrawerNavigator.Navigator,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationEventMap
>(DrawerNavigator.Navigator);

const hiddenDrawerItemOptions = { drawerItemStyle: { display: 'none' } } as const;

export default function MemberDrawerLayout() {
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <MemberDrawerContent {...props} />,
    [],
  );

  return (
    <ProtectedRouteBoundary>
      <Drawer
        backBehavior="history"
        detachInactiveScreens
        drawerContent={renderDrawerContent}
        screenOptions={appDrawerScreenOptions}>
        <Drawer.Screen name="(tabs)" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="community-directory" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="community-members" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="donations" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="transactions" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="family" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="trustees" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notifications" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="user-manual" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="birthday-reminders" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="send-birthday-card" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="birthday-greeting" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notification-detail" options={hiddenDrawerItemOptions} />
      </Drawer>
    </ProtectedRouteBoundary>
  );
}
