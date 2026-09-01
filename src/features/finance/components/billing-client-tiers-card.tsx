import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingClientTiersCard() {
  const tiers = [
    { label: 'Master Artisan', value: '12 Clients', progress: '80%', color: colors.primary.DEFAULT },
    { label: 'Journeyman', value: '28 Clients', progress: '45%', color: colors.primary.dark },
    { label: 'Apprentice', value: '64 Clients', progress: '60%', color: colors.status.success },
  ] as const;

  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.elevated, padding: spacing[4], gap: spacing[4] }}>
      <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontStyle: 'italic' }}>
        Client Tiers
      </Text>
      <View style={{ gap: spacing[4] }}>
        {tiers.map((tier) => (
          <View key={tier.label} style={{ gap: spacing[2] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.semibold }}>
                {tier.label}
              </Text>
              <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                {tier.value}
              </Text>
            </View>
            <View style={{ height: 6, borderRadius: 999, backgroundColor: 'rgba(212,195,190,0.28)', overflow: 'hidden' }}>
              <View style={{ width: tier.progress, height: '100%', borderRadius: 999, backgroundColor: tier.color }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
