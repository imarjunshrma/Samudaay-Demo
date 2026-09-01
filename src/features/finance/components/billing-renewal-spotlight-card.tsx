import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingRenewalSpotlightCard() {
  return (
    <View style={{ borderRadius: radius.xl, overflow: 'hidden', minHeight: 280, ...shadows.lg }}>
      <ImageBackground
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxn353UjBPdoul75d55CiYu3OggYqGV1x068ipoRmQqilFHjMXYnfOxE4I-9AHS8GDTupg_FrEsvh6klva1Dews3uyFp2YfAxqIw5osiMTDMWlLXyi64mC8m5icw-TrbCHxPabnpAb-DyWnwy1lmo5Je5R3SOJMJ7eogS8eZEWJly8CLHrG5TDqcbeHFDfaRBh3OD_iCNs_S8Ao4I4GziD0otrdphBnJtqQsD-jP4PVsVUtL-VSQV_KQMpjnMkSs6aRGKk7vvn9r2M',
        }}
        resizeMode="cover"
        style={{ flex: 1 }}>
        <LinearGradient
          colors={['rgba(242,120,13,0.9)', 'rgba(242,120,13,0.56)', 'rgba(242,120,13,0.08)']}
          locations={[0, 0.58, 1]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{ flex: 1, justifyContent: 'flex-end', padding: spacing[4] }}>
          <Text variant="h4" style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.semibold, fontStyle: 'italic', marginBottom: spacing[1] }}>
            Renewal Spotlight
          </Text>
          <Text variant="body" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: typography.fontFamily.regular, marginBottom: spacing[4] }}>
            Global Cobblers Guild subscription renews in 2 days ($4,500.00)
          </Text>
          <View style={{ backgroundColor: colors.text.inverse, borderRadius: radius.lg, paddingVertical: spacing[3], paddingHorizontal: spacing[4], alignItems: 'center' }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              Review Contract
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
