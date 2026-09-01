import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ProfitLossExpenseItem({
  icon,
  title,
  subtitle,
  amount,
}: {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  amount: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(242,120,13,0.08)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={18} color="#64748b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
            {title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: '#ef4444' }}>
        {amount}
      </Text>
    </View>
  );
}
