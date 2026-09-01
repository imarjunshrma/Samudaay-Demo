import { View } from 'react-native';

import { Button, Card, Icon, Text } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  size = 'md',
}: {
  icon?: React.ComponentProps<typeof Icon>['name'];
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean };
  size?: 'sm' | 'md' | 'lg';
}) {
  const iconSize = size === 'lg' ? 72 : size === 'md' ? 56 : 40;

  return (
    <Card variant="muted">
      <View style={{ alignItems: 'center', gap: spacing[3], padding: size === 'lg' ? spacing[8] : spacing[6] }}>
        <Icon name={icon} size={iconSize} color={colors.text.disabled} />
        <Text variant={size === 'lg' ? 'h4' : 'h5'}>{title}</Text>
        {description ? (
          <Text variant="body" color={colors.text.muted} style={{ textAlign: 'center' }}>
            {description}
          </Text>
        ) : null}
        {action ? (
          <Button onPress={action.onPress} loading={action.loading} disabled={action.disabled}>
            {action.label}
          </Button>
        ) : null}
      </View>
    </Card>
  );
}
