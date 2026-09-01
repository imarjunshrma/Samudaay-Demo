import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/src/components';

import { colors, shadows, spacing } from '@/src/theme';

export function AdminRoleAddButton({ onPress }: { onPress?: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onPress} style={{ position: 'absolute', right: spacing[4], bottom: 88 + insets.bottom, width: 56, height: 56, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', zIndex: 30, ...shadows.sm }}>
      <Text style={{ color: colors.text.inverse, fontSize: 28, lineHeight: 28 }}>
        +
      </Text>
    </TouchableOpacity>
  );
}
