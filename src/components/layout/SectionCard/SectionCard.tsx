import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Card, Text } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export function SectionCard({ title, children }: PropsWithChildren<{ title?: string }>) {
  return (
    <Card>
      <View style={{ gap: spacing[3] }}>
        {title ? <Text variant="h5" color={colors.text.primary}>{title}</Text> : null}
        {children}
      </View>
    </Card>
  );
}
