import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function UnifiedDashboardManagementGrid({
  items,
}: {
  items: readonly { icon: string; title: string; subtitle: string; onPress?: () => void }[];
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.title}
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={item.onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing[4],
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            gap: spacing[4],
            ...shadows.sm,
          }}>
          <View
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.lg,
              backgroundColor: colors.primary.muted,
              ...shadows.sm,
            }}>
            <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={colors.primary.DEFAULT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="label" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: colors.text.primary }}>
              {item.title}
            </Text>
            <Text variant="caption" color={colors.text.secondary} style={{ marginTop: 2 }}>
              {item.subtitle}
            </Text>
          </View>
          {item.title === 'KYC Approvals' ? (
            <View style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: colors.primary.DEFAULT }} />
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}
