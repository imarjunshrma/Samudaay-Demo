import { View } from 'react-native';

import { SkeletonBlock, SkeletonCard } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function DetailPageSkeleton({
  heroHeight = 220,
  sections = 3,
}: {
  heroHeight?: number;
  sections?: number;
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      <SkeletonBlock width="100%" height={heroHeight} radiusSize={0} />
      <View style={{ paddingHorizontal: spacing[4], gap: spacing[3] }}>
        <SkeletonBlock width="32%" height={18} radiusSize={radius.full} />
        <SkeletonBlock width="76%" height={34} radiusSize={radius.sm} />
        <SkeletonBlock width="48%" height={14} radiusSize={radius.sm} />
      </View>
      <View style={{ paddingHorizontal: spacing[4], gap: spacing[4] }}>
        {Array.from({ length: sections }, (_, index) => (
          <View
            key={index}
            style={{
              minHeight: 132,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              backgroundColor: colors.background.surface,
              padding: spacing[4],
              gap: spacing[3],
            }}>
            <SkeletonBlock width="28%" height={18} radiusSize={radius.sm} />
            <SkeletonCard lines={3} />
          </View>
        ))}
      </View>
    </View>
  );
}
