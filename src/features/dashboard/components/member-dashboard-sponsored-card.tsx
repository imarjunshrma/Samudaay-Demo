import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function MemberDashboardSponsoredCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <MaterialIcons name="info" size={12} color="#94a3b8" />
          <Text
            variant="caption"
            color="#94a3b8"
            style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Sponsored
          </Text>
        </View>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
        <View style={{ width: 64, height: 64, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.background.muted, flexShrink: 0 }}>
          <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, lineHeight: 20 }}>
            {title}
          </Text>
          <Text variant="caption" color="#64748b" style={{ marginTop: spacing[1], fontSize: 12, lineHeight: 18 }}>
            {description}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.primary.DEFAULT,
            borderRadius: radius.lg,
            padding: spacing[2],
          }}>
          <MaterialIcons name="open-in-new" size={16} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
