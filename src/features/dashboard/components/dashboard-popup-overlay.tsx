import { Image, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function DashboardPopupOverlay({
  onClosePress,
  onPrimaryPress,
  image,
  title = 'Exclusive Member Discount',
  description = 'Get up to 30% off on all premium leather tools and raw hides this festive season. Only for registered members. Limited time offer!',
  ctaLabel = 'Shop Now',
}: {
  onClosePress?: () => void;
  onPrimaryPress?: () => void;
  image: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
}) {
  const { height: windowHeight } = useWindowDimensions();
  const popupHeight = Math.min(windowHeight * 0.6, 620);

  return (
    <View style={{ position: 'absolute', inset: 0, zIndex: 100, alignItems: 'center', justifyContent: 'center', padding: spacing[4], backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <View
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 384,
          height: popupHeight,
          overflow: 'hidden',
          borderRadius: radius.xl,
          backgroundColor: colors.background.DEFAULT,
          ...shadows.lg,
        }}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={onClosePress}
          style={{
            position: 'absolute',
            top: spacing[3],
            right: spacing[3],
            zIndex: 10,
            padding: spacing[2],
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: radius.full,
          }}>
          <MaterialIcons name="close" size={18} color={colors.text.inverse} />
        </TouchableOpacity>

        <View style={{ position: 'relative', width: '100%', flex: 1.05, overflow: 'hidden', backgroundColor: colors.background.muted }}>
          <Image source={{ uri: image }} resizeMode="cover" style={StyleSheet.absoluteFillObject} />
          <View style={{ position: 'absolute', top: spacing[4], left: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], borderRadius: radius.md, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
              <MaterialIcons name="campaign" size={10} color={colors.text.inverse} />
              <Text variant="caption" color={colors.text.inverse} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                Sponsored
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, padding: spacing[6], justifyContent: 'space-between' }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, marginBottom: spacing[2] }}>
            {title}
          </Text>
          <Text variant="body" color="#64748b" style={{ lineHeight: 22, marginBottom: spacing[6] }}>
            {description}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={onPrimaryPress}
            style={{
              width: '100%',
              backgroundColor: colors.primary.DEFAULT,
              borderRadius: radius.xl,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              ...shadows.md,
          }}>
            <Text variant="body" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold }}>
              {ctaLabel}
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
