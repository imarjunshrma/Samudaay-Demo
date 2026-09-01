import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, Button, SelectField, Text, TextField } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminExpenseStatCard({
  icon,
  title,
  value,
  helper,
  helperTone = 'default',
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  value: string;
  helper: string;
  helperTone?: 'default' | 'success' | 'warning';
}) {
  const helperColor =
    helperTone === 'success' ? '#16a34a' : helperTone === 'warning' ? colors.primary.DEFAULT : colors.text.muted;

  return (
    <View style={{ flex: 1, minWidth: 158, borderRadius: radius.xl, padding: spacing[5], backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, ...shadows.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], minHeight: 24 }}>
        <MaterialIcons name={icon} size={20} color={colors.primary.DEFAULT} />
        <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 16, fontFamily: typography.fontFamily.medium, flexShrink: 1 }}>
          {title}
        </Text>
      </View>
      <Text style={{ color: colors.text.primary, fontSize: 26, lineHeight: 30, fontFamily: typography.fontFamily.bold, marginTop: spacing[3] }}>
        {value}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing[2], minHeight: 18 }}>
        <MaterialIcons name={helperTone === 'success' ? 'trending-up' : 'priority-high'} size={14} color={helperColor} />
        <Text style={{ color: helperColor, fontSize: 11, lineHeight: 14, fontFamily: typography.fontFamily.semibold, flexShrink: 1 }}>
          {helper}
        </Text>
      </View>
    </View>
  );
}
