import { View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing } from '@/src/theme';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning';

const badgeColors = {
  default: { background: colors.primary.subtle!, text: colors.primary.DEFAULT },
  success: { background: colors.status.successLight, text: colors.status.success },
  error: { background: colors.status.errorLight, text: colors.status.error },
  warning: { background: colors.primary.muted!, text: colors.primary.dark! },
} as const;

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  const scheme = badgeColors[variant];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: radius.full,
        backgroundColor: scheme.background,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
      }}>
      <Text variant="caption" color={scheme.text}>
        {label}
      </Text>
    </View>
  );
}
