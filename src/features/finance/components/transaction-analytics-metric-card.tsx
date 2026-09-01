import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionAnalyticsMetricCard({
  title,
  value,
  icon,
  trend,
  trendTone = 'success',
}: {
  title: string;
  value: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  trend?: string;
  trendTone?: 'success' | 'warning' | 'muted';
}) {
  const toneMap = {
    success: '#16a34a',
    warning: '#d97706',
    muted: colors.text.muted,
  } as const;

  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: spacing[5],
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.05)',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
        gap: spacing[2],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
        <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
          {title}
        </Text>
      </View>
      <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold }}>
        {value}
      </Text>
      {trend ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <MaterialIcons name="trending-up" size={14} color={toneMap[trendTone]} />
          <Text variant="caption" style={{ color: toneMap[trendTone], fontFamily: typography.fontFamily.semibold }}>
            {trend}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
