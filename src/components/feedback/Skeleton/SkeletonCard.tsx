import { View } from 'react-native';

import { Card } from '@/src/components/ui';
import { spacing } from '@/src/theme';

import { SkeletonBox } from './SkeletonBox';
import { SkeletonText } from './SkeletonText';

export function SkeletonCard({
  hasImage = false,
  hasAction = false,
  lines = 3,
}: {
  hasImage?: boolean;
  hasAction?: boolean;
  lines?: number;
}) {
  return (
    <Card>
      <View style={{ gap: spacing[3] }}>
        {hasImage ? <SkeletonBox height={160} radiusSize={12} /> : null}
        <SkeletonText lines={lines} />
        {hasAction ? <SkeletonBox width="40%" height={40} radiusSize={12} /> : null}
      </View>
    </Card>
  );
}
