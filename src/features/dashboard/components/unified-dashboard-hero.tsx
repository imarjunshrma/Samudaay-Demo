import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function UnifiedDashboardHero({
  title,
  subtitle,
  statOne,
  statTwo,
}: {
  title: string;
  subtitle: string;
  statOne: { label: string; value: string; helper?: string };
  statTwo: { label: string; value: string; helper?: string };
  }) {
  return (
    <View style={{ gap: spacing[4] }}>
      <View>
        <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
          Master Artisan
        </Text>
        <Text variant="h1" style={{ marginTop: spacing[2], color: colors.text.primary, fontSize: 44, lineHeight: 48, fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="body" style={{ marginTop: spacing[2], color: colors.text.secondary, maxWidth: 320 }}>
          {subtitle}
        </Text>
      </View>
      <View style={{ gap: spacing[4] }}>
        <View style={{ borderRadius: radius.xl, padding: spacing[5], backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
            {statOne.label}
          </Text>
          <Text variant="h2" color={colors.primary.DEFAULT} style={{ marginTop: spacing[1], fontFamily: typography.fontFamily.bold }}>
            {statOne.value}
          </Text>
          {statOne.helper ? (
            <Text variant="caption" color={colors.text.secondary} style={{ marginTop: spacing[1] }}>
              {statOne.helper}
            </Text>
          ) : null}
        </View>
        <View style={{ borderRadius: radius.xl, padding: spacing[5], backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, borderLeftWidth: 4, borderLeftColor: colors.primary.DEFAULT }}>
          <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
            {statTwo.label}
          </Text>
          <Text variant="h2" color={colors.primary.DEFAULT} style={{ marginTop: spacing[1], fontFamily: typography.fontFamily.bold }}>
            {statTwo.value}
          </Text>
          {statTwo.helper ? (
            <Text variant="caption" color={colors.text.secondary} style={{ marginTop: spacing[1] }}>
              {statTwo.helper}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
