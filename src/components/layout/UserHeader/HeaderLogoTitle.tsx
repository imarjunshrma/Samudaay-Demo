import { View } from 'react-native';

import { Text } from '@/src/components/ui';
import { colors, layout, spacing } from '@/src/theme';

export function HeaderLogoTitle({
  title,
  logoComponent,
  rightActions,
}: {
  title: string;
  logoComponent?: React.ReactNode;
  rightActions?: React.ReactNode[];
}) {
  return (
    <View style={{ height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.screenPadding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        {logoComponent}
        <Text variant="h5" color={colors.text.primary}>
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>{rightActions}</View>
    </View>
  );
}
