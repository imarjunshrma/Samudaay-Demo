import { View } from 'react-native';

import { Button, Card, Icon, Text } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  retryLabel = 'Retry',
  retryLoading = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retryLoading?: boolean;
}) {
  return (
    <Card variant="outlined">
      <View style={{ alignItems: 'center', gap: spacing[3], padding: spacing[6] }}>
        <Icon name="error-outline" size="xl" color={colors.status.error} />
        <Text variant="h5">{title}</Text>
        <Text variant="body" color={colors.text.muted} style={{ textAlign: 'center' }}>
          {description}
        </Text>
        {onRetry ? (
          <Button variant="danger" onPress={onRetry} loading={retryLoading} disabled={retryLoading}>
            {retryLabel}
          </Button>
        ) : null}
      </View>
    </Card>
  );
}
