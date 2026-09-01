import { View } from 'react-native';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminDashboardHero({
  title,
}: {
  title: string;
}) {
  return (
    <View style={{ gap: spacing[2] }}>
      <Text variant="h1" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, lineHeight: 40 }}>
        {title}
      </Text>
    </View>
  );
}
