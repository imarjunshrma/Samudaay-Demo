import {
  createBottomTabNavigator,
  type BottomTabNavigationEventMap,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

import { adminTabScreenOptions } from '@/src/core/navigation/navigation-options';
import { AdminTabBar } from '@/src/core/navigation/admin-tab-bar';

const BottomTabsNavigator = createBottomTabNavigator();

const Tabs = withLayoutContext<
  BottomTabNavigationOptions,
  typeof BottomTabsNavigator.Navigator,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationEventMap
>(BottomTabsNavigator.Navigator);

export default function AdminTabsLayout() {
  return (
    <Tabs
      detachInactiveScreens
      tabBar={(props) => <AdminTabBar {...props} />}
      screenOptions={adminTabScreenOptions}>
      <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
      <Tabs.Screen name="manage-directory" options={{ title: 'Member Directory' }} />
      <Tabs.Screen name="invoices" options={{ title: 'Invoices' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
