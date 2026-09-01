import { View } from 'react-native';

import { ListItem } from '@/src/components';
import { spacing } from '@/src/theme';

export function SuperAdminRosterList({
  items,
}: {
  items: readonly [string, string][];
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      {items.map(([name, meta]) => (
        <ListItem key={name} title={name} subtitle={meta} meta="Open" />
      ))}
    </View>
  );
}
