import { View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminRoleQuickReference() {
  const rows = [
    ['Manage Members', 'User and member administration', 'group', true],
    ['Create Events', 'Event creation and publishing', 'campaign', true],
    ['Approve Contributions', 'Contribution review and approval', 'payments', false],
    ['Content Moderation', 'Content and community control', 'gavel', false],
  ] as const;

  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight, ...shadows.sm }}>
      <View style={{ gap: spacing[3] }}>
        {rows.map(([label, description, icon, active]) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[1] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, minWidth: 0 }}>
              <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: typography.fontFamily.bold }}>
                  {label}
                </Text>
                <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2, flexShrink: 1 }}>
                  {description}
                </Text>
              </View>
            </View>
            <View style={{ width: 36, height: 20, borderRadius: 999, backgroundColor: active ? colors.primary.DEFAULT : colors.border.DEFAULT, padding: 2, justifyContent: 'center', flexShrink: 0 }}>
              <View style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: colors.background.surface, alignSelf: active ? 'flex-end' : 'flex-start' }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
