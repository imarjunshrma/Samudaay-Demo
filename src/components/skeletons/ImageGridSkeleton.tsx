import { View } from 'react-native';

import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { radius, spacing } from '@/src/theme';

export function ImageGridSkeleton({
  count = 6,
  columns = 3,
  itemAspectRatio = 1,
}: {
  count?: number;
  columns?: number;
  itemAspectRatio?: number;
}) {
  const width = `${100 / columns}%` as const;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing[1] }}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={{ width, paddingHorizontal: spacing[1], paddingBottom: spacing[2] }}>
          <View style={{ aspectRatio: itemAspectRatio }}>
            <SkeletonBlock width="100%" height={0} radiusSize={radius.lg} style={{ flex: 1 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
