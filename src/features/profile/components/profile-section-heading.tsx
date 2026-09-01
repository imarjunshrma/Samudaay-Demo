import { View } from 'react-native';

import { Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export function ProfileSectionHeading({ children }: { children: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <Text variant="h3" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
        {children}
      </Text>
      <View style={{ height: 1, flex: 1, marginLeft: spacing[4], backgroundColor: colors.primary.borderLight }} />
    </View>
  );
}
