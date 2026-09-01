import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BreakdownRow({
  label,
  subtitle,
  amount,
  tint,
  icon,
  status,
  statusTone = 'muted',
}: {
  label: string;
  subtitle?: string;
  amount: string;
  tint: string;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  status?: string;
  statusTone?: 'success' | 'warning' | 'muted';
}) {
  const toneMap = {
    success: '#16a34a',
    warning: '#d97706',
    muted: colors.text.muted,
  } as const;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: tint,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        {icon ? (
          <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.background.elevated, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
            {label}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.text.muted}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {amount}
        </Text>
        {status ? (
          <Text
            variant="caption"
            style={{
              marginTop: spacing[1],
              color: toneMap[statusTone],
              fontFamily: typography.fontFamily.semibold,
            }}>
            {status}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
