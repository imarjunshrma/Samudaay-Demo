import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingInvoiceRow({
  title,
  code,
  amount,
  status,
  icon,
  warning = false,
}: {
  title: string;
  code: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  icon: ComponentProps<typeof MaterialIcons>['name'];
  warning?: boolean;
}) {
  const statusBg = status === 'Paid' ? colors.status.successLight : status === 'Pending' ? '#fef3c7' : colors.status.errorLight;
  const statusText = status === 'Paid' ? colors.status.success : status === 'Pending' ? '#d97706' : colors.status.error;
  const iconBg = warning ? colors.status.errorLight : colors.background.elevated;
  const iconColor = warning ? colors.status.error : colors.primary.DEFAULT;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderRadius: 20, backgroundColor: colors.background.surfaceAlt, gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
            {title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {code}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: spacing[1] }}>
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
          {amount}
        </Text>
        <Text variant="caption" style={{ backgroundColor: statusBg, color: statusText, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1, borderRadius: radius.full, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
          {status}
        </Text>
      </View>
    </View>
  );
}
