import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionAnalyticsRow({
  title,
  subtitle,
  amount,
  status,
  icon,
}: {
  title: string;
  subtitle: string;
  amount: string;
  status: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}) {
  const statusTone = status === 'SUCCESS' ? '#16a34a' : status === 'PENDING' ? '#d97706' : '#2563eb';
  const statusBg = status === 'SUCCESS' ? '#dcfce7' : status === 'PENDING' ? '#fef3c7' : '#dbeafe';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
        padding: spacing[3],
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.05)',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: icon === 'person' ? 'rgba(251,146,60,0.15)' : 'rgba(37,99,235,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={18} color={icon === 'person' ? colors.primary.DEFAULT : '#2563eb'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {amount}
        </Text>
        <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: statusTone, backgroundColor: statusBg, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: radius.full }}>
          {status}
        </Text>
      </View>
    </View>
  );
}
