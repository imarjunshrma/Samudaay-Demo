import { View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

function RoleOption({
  title,
  description,
  selected,
  icon,
}: {
  title: string;
  description: string;
  selected?: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        borderRadius: 20,
        borderWidth: 2,
        borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
        backgroundColor: selected ? colors.primary.subtle : '#ffffff',
        padding: spacing[5],
      }}>
      <View style={{ width: 24, height: 24, borderRadius: 999, borderWidth: 2, borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: selected ? colors.primary.DEFAULT : 'transparent' }} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
          <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
        </View>
        <Text variant="caption" color={colors.text.muted}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export { RoleOption };
