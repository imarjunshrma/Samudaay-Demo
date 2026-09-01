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
import { AdminDrawerContent } from '@/src/core/navigation/admin-drawer-content';

const DrawerNavigator = createDrawerNavigator();

const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof DrawerNavigator.Navigator,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationEventMap
>(DrawerNavigator.Navigator);

const hiddenDrawerItemOptions = { drawerItemStyle: { display: 'none' } } as const;

export default function AdminDrawerLayout() {
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <AdminDrawerContent {...props} />,
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
        <Drawer.Screen name="community" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="people" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="community-members" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="users" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="manage-trustees" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="create-admin" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="permissions" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="my-expenses" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="manage-events" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="create-notification" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="expenses" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="donations" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="manage-donations" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="record-manual-donation" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="edit-donation" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notifications" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notification-inbox" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notification-detail" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="advertisements" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="community-chats" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="birthday-reminders" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="send-birthday-card" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="birthday-card-editor" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="kyc-approvals" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="transaction-management" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="transaction-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="people-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="event-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="event-registrations" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="donation-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="publication-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="advertisement-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="notification-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="role-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="chat-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="matrimony-profiles" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="matrimony-analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="profit-loss-yearly" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="create-expense" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="analytics" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="roles" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="roles/create" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="roles/[roleId]/edit" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="family-registry" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="family-registry/[userId]" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="marksheet-reports" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="create-event" options={hiddenDrawerItemOptions} />
        <Drawer.Screen name="profile-requests" options={hiddenDrawerItemOptions} />
      </Drawer>
    </ProtectedRouteBoundary>
  );
}
