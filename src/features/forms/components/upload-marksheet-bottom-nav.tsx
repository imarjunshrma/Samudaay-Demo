import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export function UploadMarksheetBottomNav() {
  const insets = useSafeAreaInsets();
  const items = [
    ['home', 'Home', false],
    ['school', 'Education', true],
    ['family_restroom', 'Family', false],
    ['mail', 'Inbox', false],
  ] as const;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background.surface,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[3],
        paddingBottom: spacing[6] + insets.bottom,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      {items.map(([icon, label, active]) => (
        <Pressable key={label} accessibilityRole="button" style={{ alignItems: 'center', gap: spacing[1], opacity: active ? 1 : 0.5 }}>
          <MaterialIcons name={icon as never} size={22} color={active ? colors.primary.DEFAULT : colors.text.primary} />
          <Text variant="caption" style={{ fontSize: 11, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 1 }}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
