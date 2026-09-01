import { View } from 'react-native';

import { Card, Icon, Text } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export function NotificationItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
        <Icon name="notifications-none" color={colors.primary.DEFAULT} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyLg">{title}</Text>
          <Text variant="caption" color={colors.text.muted}>{subtitle}</Text>
        </View>
      </View>
    </Card>
  );
}
