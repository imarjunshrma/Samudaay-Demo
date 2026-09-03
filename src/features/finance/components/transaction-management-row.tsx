import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionManagementRow({
  title,
  subtitle,
  amount,
  status,
  icon,
  muted = false,
}: {
  title: string;
  subtitle: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  icon: ComponentProps<typeof MaterialIcons>['name'];
  muted?: boolean;
}) {
  const tone = status === 'Completed' ? colors.status.success : status === 'Pending' ? colors.status.warning : colors.status.error;
  const toneBg = status === 'Completed' ? colors.status.successLight : status === 'Pending' ? colors.status.warningLight : colors.status.errorLight;
  const iconBg =
    icon === 'event' ? 'rgba(59,130,246,0.12)' : icon === 'error' ? colors.status.errorLight : icon === 'card-membership' ? 'rgba(168,85,247,0.12)' : 'rgba(24,168,117,0.12)';
  const iconColor =
    icon === 'event' ? '#2563eb' : icon === 'error' ? colors.status.error : icon === 'card-membership' ? '#7c3aed' : colors.primary.DEFAULT;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
        padding: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
        opacity: muted ? 0.6 : 1,
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" style={{ color: colors.text.secondary }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
          {amount}
        </Text>
        <Text
          variant="caption"
          style={{
            marginTop: spacing[1],
            paddingHorizontal: spacing[2],
            paddingVertical: 2,
            borderRadius: radius.full,
            backgroundColor: toneBg,
            color: tone,
            fontFamily: typography.fontFamily.bold,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: 10,
          }}>
          {status}
        </Text>
      </View>
    </View>
  );
}
