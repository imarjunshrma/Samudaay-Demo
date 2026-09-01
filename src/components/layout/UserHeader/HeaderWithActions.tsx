import { View } from 'react-native';

import { IconButton, Text } from '@/src/components/ui';
import { colors, layout, spacing } from '@/src/theme';

export function HeaderWithActions({
  title,
  onBackPress,
  rightActions,
}: {
  title: string;
  onBackPress?: () => void;
  rightActions?: React.ReactNode[];
}) {
  return (
    <View style={{ height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2], paddingHorizontal: layout.screenPadding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <IconButton icon="arrow-back" onPress={onBackPress} color={colors.text.primary} />
        <Text variant="h5">{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>{rightActions}</View>
    </View>
  );
}
