import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingBottomBar({
  activeKey = 'billing',
  onChange,
}: {
  activeKey?: 'clients' | 'configs' | 'billing' | 'audit';
  onChange?: (key: 'clients' | 'configs' | 'billing' | 'audit') => void;
}) {
  const items = [
    { key: 'clients', icon: 'corporate-fare', label: 'Clients' },
    { key: 'configs', icon: 'settings-input-component', label: 'Configs' },
    { key: 'billing', icon: 'payments', label: 'Billing' },
    { key: 'audit', icon: 'receipt-long', label: 'Audit' },
  ] as const;

  return (
    <View style={{ backgroundColor: colors.background.surface, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[3], ...shadows.sm }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable key={item.key} accessibilityRole="button" onPress={() => onChange?.(item.key)} style={{ alignItems: 'center', paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
              <MaterialIcons name={item.icon as never} size={20} color={active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text variant="caption" style={{ color: active ? colors.primary.DEFAULT : '#94a3b8', fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing[1], fontSize: 11 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
