import { View } from 'react-native';

import { SkeletonAvatar, SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function ProfileHeaderSkeleton() {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        minHeight: 148,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
      }}>
      <SkeletonAvatar size={88} />
      <View style={{ flex: 1, gap: spacing[3] }}>
        <SkeletonBlock width="28%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="64%" height={24} radiusSize={radius.sm} />
        <SkeletonBlock width="48%" height={14} radiusSize={radius.sm} />
        <SkeletonBlock width={92} height={28} radiusSize={radius.full} />
      </View>
    </View>
  );
}
