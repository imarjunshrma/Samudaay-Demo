import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionManagementBottomBar({
  activeKey = 'transactions',
  onChange,
}: {
  activeKey?: 'dashboard' | 'transactions' | 'members' | 'settings';
  onChange?: (key: 'dashboard' | 'transactions' | 'members' | 'settings') => void;
}) {
  const items = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { key: 'transactions', icon: 'list-alt', label: 'Transactions' },
    { key: 'members', icon: 'group', label: 'Members' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ] as const;

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, backgroundColor: colors.background.surface, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[3], ...shadows.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable key={item.key} accessibilityRole="button" onPress={() => onChange?.(item.key)} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={item.icon as never} size={20} color={active ? colors.primary.DEFAULT : colors.text.muted} />
              <Text variant="caption" style={{ color: active ? colors.primary.DEFAULT : colors.text.muted, fontFamily: typography.fontFamily.medium, fontSize: 10 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
