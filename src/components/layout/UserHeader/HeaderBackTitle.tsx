import { View } from 'react-native';

import { IconButton, Text } from '@/src/components/ui';
import { colors, layout, spacing } from '@/src/theme';

export function HeaderBackTitle({
  title,
  onBackPress,
}: {
  title: string;
  onBackPress?: () => void;
}) {
  return (
    <View style={{ height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingHorizontal: layout.screenPadding }}>
      <IconButton icon="arrow-back" onPress={onBackPress} color={colors.text.primary} />
      <Text variant="h5">{title}</Text>
    </View>
  );
}
