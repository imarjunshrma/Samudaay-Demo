import { View } from 'react-native';

import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function StatCardSkeleton({
  minHeight = 132,
}: {
  minHeight?: number;
}) {
  return (
    <View
      style={{
        minHeight,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <SkeletonBlock width={40} height={40} radiusSize={radius.lg} />
      <SkeletonBlock width="38%" height={12} radiusSize={radius.sm} />
      <SkeletonBlock width="64%" height={28} radiusSize={radius.sm} />
      <SkeletonBlock width="54%" height={12} radiusSize={radius.sm} />
    </View>
  );
}
