import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { colors } from '@/src/theme';

export const appStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === 'ios' ? 'slide_from_right' : 'default',
  fullScreenGestureEnabled: false,
  gestureEnabled: true,
  contentStyle: {
    backgroundColor: colors.background.DEFAULT,
  },
};

export const appDrawerScreenOptions: DrawerNavigationOptions = {
  headerShown: false,
  drawerType: 'front',
  overlayColor: 'rgba(26, 26, 26, 0.35)',
  drawerStyle: {
    width: 320,
    backgroundColor: colors.background.surfaceAlt,
  },
  sceneStyle: {
    backgroundColor: colors.background.DEFAULT,
  },
  swipeEdgeWidth: Platform.OS === 'ios' ? 56 : 32,
};

export const memberTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true,
  freezeOnBlur: false,
  tabBarHideOnKeyboard: true,
  sceneStyle: {
    backgroundColor: colors.background.DEFAULT,
  },
};

export const adminTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true,
  freezeOnBlur: false,
  tabBarHideOnKeyboard: true,
  sceneStyle: {
    backgroundColor: colors.background.DEFAULT,
  },
};
