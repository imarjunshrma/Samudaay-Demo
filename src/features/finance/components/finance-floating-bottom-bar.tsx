import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function FinanceFloatingBottomBar({
  activeKey,
  onChange,
  onCenterPress,
}: {
  activeKey: 'dashboard' | 'txns' | 'members' | 'settings';
  onChange: (key: 'dashboard' | 'txns' | 'members' | 'settings') => void;
  onCenterPress?: () => void;
}) {
  const items = [
    { key: 'dashboard' as const, icon: 'dashboard', label: 'Home' },
    { key: 'txns' as const, icon: 'receipt-long', label: 'Txns' },
    { key: 'members' as const, icon: 'group', label: 'Members' },
    { key: 'settings' as const, icon: 'settings', label: 'Setup' },
  ];

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[3],
        paddingTop: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        {items.slice(0, 2).map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable key={item.key} accessibilityRole="button" onPress={() => onChange(item.key)} style={{ alignItems: 'center', gap: 4, flex: 1 }}>
              <MaterialIcons name={item.icon as never} size={20} color={active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text variant="caption" style={{ color: active ? colors.primary.DEFAULT : '#94a3b8', fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        <View style={{ position: 'relative', top: -spacing[6] }}>
          <Pressable
            accessibilityRole="button"
            onPress={onCenterPress}
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: '#f8fafc',
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}>
            <MaterialIcons name="add" size={28} color="#ffffff" />
          </Pressable>
        </View>

        {items.slice(2).map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable key={item.key} accessibilityRole="button" onPress={() => onChange(item.key)} style={{ alignItems: 'center', gap: 4, flex: 1 }}>
              <MaterialIcons name={item.icon as never} size={20} color={active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text variant="caption" style={{ color: active ? colors.primary.DEFAULT : '#94a3b8', fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
