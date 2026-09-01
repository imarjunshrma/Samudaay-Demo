import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ProfitLossSummaryCard({
  title,
  value,
  helper,
  icon,
  tone = 'light',
}: {
  title: string;
  value: string;
  helper: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  tone?: 'light' | 'accent';
}) {
  const accent = tone === 'accent';

  return (
    <View
      style={{
        flex: 1,
        minWidth: '48%',
        gap: spacing[1],
        borderRadius: 16,
        padding: spacing[5],
        backgroundColor: accent ? 'rgba(242,120,13,0.1)' : '#ffffff',
        borderWidth: 1,
        borderColor: accent ? 'rgba(242,120,13,0.2)' : 'rgba(226,232,240,0.8)',
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
        <MaterialIcons name={icon} size={16} color={accent ? colors.primary.DEFAULT : colors.text.muted} />
        <Text variant="body" style={{ color: accent ? colors.primary.DEFAULT : colors.text.muted, fontFamily: typography.fontFamily.medium }}>
          {title}
        </Text>
      </View>
      <Text variant="h3" style={{ color: accent ? colors.primary.DEFAULT : colors.text.primary, fontFamily: typography.fontFamily.bold }}>
        {value}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], marginTop: spacing[1] }}>
        <MaterialIcons
          name={accent ? 'verified' : title === 'Total Expenses' ? 'warning' : 'trending-up'}
          size={12}
          color={accent ? '#16a34a' : title === 'Total Expenses' ? '#d97706' : '#16a34a'}
        />
        <Text
          variant="caption"
          style={{
            color: accent ? '#16a34a' : title === 'Total Expenses' ? '#d97706' : '#16a34a',
            fontFamily: typography.fontFamily.semibold,
          }}>
          {helper}
        </Text>
      </View>
    </View>
  );
}
