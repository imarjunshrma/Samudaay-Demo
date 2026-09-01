import { View } from 'react-native';

import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function FormSkeleton({
  fields = 6,
  showFooter = true,
}: {
  fields?: number;
  showFooter?: boolean;
}) {
  return (
    <View style={{ gap: spacing[5] }}>
      <View style={{ gap: spacing[4] }}>
        {Array.from({ length: fields }, (_, index) => (
          <View key={index} style={{ gap: spacing[2] }}>
            <SkeletonBlock width="26%" height={12} radiusSize={radius.sm} />
            <SkeletonBlock width="100%" height={52} radiusSize={radius.lg} />
          </View>
        ))}
      </View>
      {showFooter ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.primary.borderLight,
            paddingTop: spacing[4],
            flexDirection: 'row',
            gap: spacing[3],
          }}>
          <SkeletonBlock width="34%" height={48} radiusSize={radius.lg} />
          <SkeletonBlock width="62%" height={48} radiusSize={radius.lg} />
        </View>
      ) : null}
    </View>
  );
}
