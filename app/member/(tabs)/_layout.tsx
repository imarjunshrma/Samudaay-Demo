import {
  createBottomTabNavigator,
  type BottomTabNavigationEventMap,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

import { memberTabScreenOptions } from '@/src/core/navigation/navigation-options';
import { MemberTabBar } from '@/src/core/navigation/member-tab-bar';

const BottomTabsNavigator = createBottomTabNavigator();

const Tabs = withLayoutContext<
  BottomTabNavigationOptions,
  typeof BottomTabsNavigator.Navigator,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationEventMap
>(BottomTabsNavigator.Navigator);

export default function MemberTabsLayout() {
  return (
    <Tabs
      detachInactiveScreens
      tabBar={(props) => <MemberTabBar {...props} />}
      screenOptions={memberTabScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="members" options={{ title: 'Members' }} />
      <Tabs.Screen name="matrimony" options={{ title: 'Matrimony' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
