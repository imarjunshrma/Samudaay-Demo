import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, Button, SelectField, Text, TextField } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminExpenseFilterChip({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: active ? colors.primary.border : colors.primary.borderLight,
        backgroundColor: active ? colors.primary.muted : colors.background.surface,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
      }}>
      <MaterialIcons name={icon} size={16} color={colors.primary.DEFAULT} />
      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, fontSize: 13 }}>
        {label}
      </Text>
      <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );
}
