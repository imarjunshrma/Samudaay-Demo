import { View } from 'react-native';

import { Card, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export function SuperAdminConfigurationList({
  items,
}: {
  items: readonly [string, string][];
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      {items.map(([name, value]) => (
        <Card key={name} variant="elevated" padding="lg">
          <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {name}
          </Text>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {value}
          </Text>
        </Card>
      ))}
    </View>
  );
}
