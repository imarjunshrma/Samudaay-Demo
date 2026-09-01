import { View } from 'react-native';

import { SkeletonBlock, SkeletonAvatar, SkeletonText } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

function SectionSkeleton({
  titleWidth = '32%',
  rows = 3,
}: {
  titleWidth?: number | `${number}%`;
  rows?: number;
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      <SkeletonBlock width={titleWidth} height={20} radiusSize={radius.sm} />
      <View style={{ backgroundColor: colors.background.surface, padding: spacing[6], borderRadius: radius.xl, gap: spacing[5], borderWidth: 1, borderColor: colors.primary.borderLight }}>
        {Array.from({ length: rows }, (_, index) => (
          <View key={index} style={{ gap: spacing[2] }}>
            <SkeletonBlock width={index % 2 === 0 ? '28%' : '40%'} height={12} radiusSize={radius.sm} />
            <SkeletonBlock width={index === rows - 1 ? '68%' : '100%'} height={16} radiusSize={radius.sm} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProfilePageSkeleton() {
  return (
    <View style={{ gap: spacing[6] }}>
      <View style={{ alignItems: 'center', gap: spacing[4] }}>
        <View style={{ width: 128, height: 128, borderRadius: 64, overflow: 'hidden', borderWidth: 4, borderColor: colors.background.surface }}>
          <SkeletonAvatar size={128} />
        </View>
        <View style={{ alignItems: 'center', gap: spacing[2] }}>
          <SkeletonBlock width="44%" height={30} radiusSize={radius.md} />
          <SkeletonBlock width="28%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="24%" height={24} radiusSize={radius.full} />
        </View>
      </View>

      <SectionSkeleton titleWidth="34%" rows={4} />

      <View style={{ gap: spacing[4] }}>
        <SkeletonBlock width="38%" height={20} radiusSize={radius.sm} />
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="100%" height={64} radiusSize={radius.xl} />
          <SkeletonBlock width="100%" height={64} radiusSize={radius.xl} />
          <SkeletonBlock width="100%" height={80} radiusSize={radius.xl} />
        </View>
      </View>

      <View style={{ gap: spacing[4], alignItems: 'center', paddingTop: spacing[4] }}>
        <SkeletonBlock width="46%" height={48} radiusSize={radius.full} />
        <SkeletonText lines={2} widths={['56%', '38%']} />
      </View>
    </View>
  );
}
