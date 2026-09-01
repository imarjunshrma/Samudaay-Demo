import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingRevenueCard() {
  return (
    <View style={{ borderRadius: 28, padding: spacing[5], backgroundColor: colors.primary.DEFAULT, gap: spacing[3], ...shadows.md }}>
      <Text variant="caption" color="rgba(255,255,255,0.72)" style={{ textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
        Total Monthly Recurring Revenue
      </Text>
      <Text variant="h1" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 38, lineHeight: 42, fontStyle: 'italic' }}>
        $42,850.00
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <MaterialIcons name="trending-up" size={16} color={colors.primary.light} />
        <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.semibold }}>
          +12.4% from last month
        </Text>
      </View>
    </View>
  );
}
