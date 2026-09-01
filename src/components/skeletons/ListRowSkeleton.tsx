import { View } from 'react-native';

import { SkeletonAvatar, SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function ListRowSkeleton({
  minHeight = 84,
  showAvatar = true,
  showTrailing = true,
}: {
  minHeight?: number;
  showAvatar?: boolean;
  showTrailing?: boolean;
}) {
  return (
    <View
      style={{
        minHeight,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
      }}>
      {showAvatar ? <SkeletonAvatar size={48} /> : null}
      <View style={{ flex: 1, gap: spacing[2] }}>
        <SkeletonBlock width="42%" height={14} radiusSize={radius.sm} />
        <SkeletonBlock width="72%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="58%" height={12} radiusSize={radius.sm} />
      </View>
      {showTrailing ? (
        <View style={{ alignItems: 'flex-end', gap: spacing[2] }}>
          <SkeletonBlock width={68} height={12} radiusSize={radius.sm} />
          <SkeletonBlock width={76} height={28} radiusSize={radius.full} />
        </View>
      ) : null}
    </View>
  );
}
