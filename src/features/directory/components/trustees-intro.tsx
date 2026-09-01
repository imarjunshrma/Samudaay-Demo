import { View } from 'react-native';

import { Text } from '@/src/components';
import { spacing, typography } from '@/src/theme';

export function TrusteesIntro() {
  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6] }}>
      <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>
        Board of Trustees
      </Text>
    </View>
  );
}
