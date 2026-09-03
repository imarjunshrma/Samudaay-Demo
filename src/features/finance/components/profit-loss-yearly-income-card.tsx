import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ProfitLossYearlyIncomeCard({
  label,
  amount,
  icon,
}: {
  label: string;
  amount: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}) {
  return (
    <View style={{ flex: 1, minWidth: '47%', borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(24,168,117,0.08)', padding: spacing[4], shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}>
      <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
      <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[2], textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.medium }}>
        {label}
      </Text>
      <Text variant="h4" style={{ marginTop: 2, fontFamily: typography.fontFamily.bold }}>
        {amount}
      </Text>
    </View>
  );
}
