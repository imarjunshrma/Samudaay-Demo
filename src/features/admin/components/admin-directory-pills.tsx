import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminDirectoryPills({
  activeKey,
  onChange,
}: {
  activeKey: string;
  onChange: (key: string) => void;
}) {
  const items = [
    { key: 'state', label: 'State' },
    { key: 'city', label: 'City' },
    { key: 'role', label: 'Role' },
  ] as const;

  return (
    <View style={{ flexDirection: 'row', gap: spacing[3], paddingHorizontal: spacing[4], paddingBottom: spacing[4], overflow: 'scroll' as never }}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <TouchableOpacity
            key={item.key}
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => onChange(item.key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2],
              borderRadius: radius.lg,
              backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
              borderWidth: 1,
              borderColor: active ? colors.primary.DEFAULT : colors.primary.border,
            }}>
            <Text style={{ color: active ? colors.text.inverse : colors.text.primary, fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
