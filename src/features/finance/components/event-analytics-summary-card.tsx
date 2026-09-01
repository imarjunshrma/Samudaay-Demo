import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function EventAnalyticsSummaryCard({
  title,
  value,
  icon,
  valueTone = colors.text.primary,
  subtitle,
  subtitleTone = 'muted',
  progress,
  progressColor = colors.primary.DEFAULT,
}: {
  title: string;
  value: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  valueTone?: string;
  subtitle?: string;
  subtitleTone?: 'success' | 'muted';
  progress?: number;
  progressColor?: string;
}) {
  return (
    <View
      style={{
        borderRadius: 16,
        padding: spacing[5],
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.05)',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
        gap: spacing[2],
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text variant="body" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.medium }}>
          {title}
        </Text>
        <MaterialIcons name={icon} size={20} color={colors.primary.DEFAULT} />
      </View>
      <Text variant="h2" style={{ color: valueTone, fontFamily: typography.fontFamily.bold, lineHeight: 34 }}>
        {value}
      </Text>
      {progress != null ? (
        <View style={{ height: 8, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden', marginTop: spacing[1] }}>
          <View style={{ width: `${progress}%`, height: '100%', borderRadius: 999, backgroundColor: progressColor }} />
        </View>
      ) : null}
      {subtitle ? (
        subtitleTone === 'success' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
            <MaterialIcons name="trending-up" size={16} color="#16a34a" />
            <Text variant="body" style={{ color: '#16a34a', fontFamily: typography.fontFamily.semibold }}>
              {subtitle}
            </Text>
          </View>
        ) : (
          <Text variant="body" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.medium }}>
            {subtitle}
          </Text>
        )
      ) : null}
    </View>
  );
}
