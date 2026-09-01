import { View } from 'react-native';

import { spacing } from '@/src/theme';

import { SkeletonBox } from './SkeletonBox';

export function SkeletonText({
  lines = 2,
  lastLineWidth = '72%' as `${number}%`,
}: {
  lines?: number;
  lastLineWidth?: `${number}%`;
}) {
  return (
    <View style={{ gap: spacing[2] }}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonBox key={index} width={index === lines - 1 ? lastLineWidth : '100%'} height={12} radiusSize={8} />
      ))}
    </View>
  );
}
