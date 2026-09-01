import { View } from 'react-native';

import { Text } from '@/src/components';
import { spacing, typography } from '@/src/theme';

export function ManualDonationOrDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[2] }}>
      <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
      <Text
        variant="caption"
        color="#9ca3af"
        style={{
          paddingHorizontal: spacing[3],
          fontFamily: typography.fontFamily.bold,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
        OR
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
    </View>
  );
}
