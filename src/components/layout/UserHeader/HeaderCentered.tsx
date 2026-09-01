import { View } from 'react-native';

import { IconButton, Text } from '@/src/components/ui';
import { colors, layout } from '@/src/theme';

export function HeaderCentered({
  title,
  onBackPress,
  showBack = true,
}: {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
}) {
  return (
    <View style={{ height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadding }}>
      <View style={{ width: 40 }}>
        {showBack ? <IconButton icon="arrow-back" onPress={onBackPress} color={colors.text.primary} /> : null}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text variant="h5">{title}</Text>
      </View>
      <View style={{ width: 40 }} />
    </View>
  );
}
