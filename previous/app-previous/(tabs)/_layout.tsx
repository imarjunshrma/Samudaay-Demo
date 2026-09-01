import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { palette } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function TabLayout() {
  const { language, resolvedTheme } = useAppPreferences();
  const { role } = useSession();
  const colors = palette[resolvedTheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tab,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: selectLanguage(language, 'Home', 'હોમ'),
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="registration"
        options={{
          title: selectLanguage(language, 'Register', 'નોંધણી'),
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-plus-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: selectLanguage(language, 'Community', 'સમુદાય'),
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: selectLanguage(language, 'Events', 'ઇવેન્ટ્સ'),
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-star" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: selectLanguage(language, 'Admin', 'એડમિન'),
          href: role === 'admin' || role === 'superAdmin' ? '/admin' : null,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="shield-crown-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="all-pages"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
