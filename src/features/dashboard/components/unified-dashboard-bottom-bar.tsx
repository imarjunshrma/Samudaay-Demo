import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function UnifiedDashboardBottomBar({
  activeKey = 'home',
  onChange,
}: {
  activeKey?: 'home' | 'directory' | 'analytics' | 'settings';
  onChange?: (key: 'home' | 'directory' | 'analytics' | 'settings') => void;
}) {
  const items = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'directory', icon: 'import-contacts', label: 'Members' },
    { key: 'analytics', icon: 'analytics', label: 'Analytics' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ] as const;

  return (
    <View style={{ backgroundColor: colors.background.surface, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: spacing[6], borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadows.sm }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
        {items.map((item) => {
          const active = item.key === activeKey;

          return (
            <TouchableOpacity key={item.key} accessibilityRole="button" activeOpacity={0.85} onPress={() => onChange?.(item.key)} style={{ alignItems: 'center', paddingHorizontal: spacing[4], paddingVertical: spacing[1] }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text
                variant="caption"
                color={active ? colors.primary.DEFAULT : '#94a3b8'}
                style={{ fontSize: 11, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing[1] }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
