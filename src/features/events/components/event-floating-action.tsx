import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventFloatingAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: label ? spacing[5] : spacing[4], paddingVertical: spacing[3] }}>
      <MaterialIcons name={icon} size={20} color="#ffffff" />
      {label ? <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 13 }}>{label}</Text> : null}
    </Pressable>
  );
}
