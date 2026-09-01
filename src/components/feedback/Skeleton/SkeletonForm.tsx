import { View } from 'react-native';

import { spacing } from '@/src/theme';

import { SkeletonBox } from './SkeletonBox';

export function SkeletonForm({ fields = 3 }: { fields?: number }) {
  return (
    <View style={{ gap: spacing[4] }}>
      {Array.from({ length: fields }, (_, index) => (
        <View key={index} style={{ gap: spacing[2] }}>
          <SkeletonBox width="26%" height={12} radiusSize={8} />
          <SkeletonBox height={48} radiusSize={12} />
        </View>
      ))}
      <SkeletonBox height={48} radiusSize={12} />
    </View>
  );
}
