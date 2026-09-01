import { View } from 'react-native';

import { Card, Text } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export function ListItem({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <Card>
      <View style={{ gap: spacing[1] }}>
        <Text variant="bodyLg">{title}</Text>
        {subtitle ? <Text variant="body" color={colors.text.secondary}>{subtitle}</Text> : null}
        {meta ? <Text variant="caption" color={colors.text.muted}>{meta}</Text> : null}
      </View>
    </Card>
  );
}
