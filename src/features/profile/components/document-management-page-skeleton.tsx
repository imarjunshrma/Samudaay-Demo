import { View } from 'react-native';

import { SkeletonBlock, SkeletonAvatar, SkeletonText } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';
import { DOCUMENT_SLOTS } from '../utils/document-management';

function DocumentRowSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], flex: 1 }}>
        <SkeletonAvatar size={48} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="52%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="34%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="68%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <SkeletonBlock width={72} height={36} radiusSize={radius.lg} />
    </View>
  );
}

export function DocumentManagementPageSkeleton() {
  return (
    <View style={{ gap: spacing[5] }}>
      <View
        style={{
          backgroundColor: colors.background.surface,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          padding: spacing[6],
          gap: spacing[4],
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
          <SkeletonAvatar size={64} />
          <View style={{ flex: 1, gap: spacing[2] }}>
            <SkeletonBlock width="42%" height={14} radiusSize={radius.sm} />
            <SkeletonBlock width="68%" height={28} radiusSize={radius.sm} />
            <SkeletonText lines={2} widths={['78%', '62%']} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <SkeletonBlock width={88} height={28} radiusSize={radius.full} />
          <SkeletonBlock width={86} height={28} radiusSize={radius.full} />
          <SkeletonBlock width={84} height={28} radiusSize={radius.full} />
          <SkeletonBlock width={82} height={28} radiusSize={radius.full} />
        </View>
      </View>

      <View style={{ gap: spacing[3] }}>
        {DOCUMENT_SLOTS.map((slot) => (
          <DocumentRowSkeleton key={slot.type} />
        ))}
      </View>

      <View style={{ alignItems: 'center', gap: spacing[2], paddingTop: spacing[2] }}>
        <SkeletonBlock width="74%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="52%" height={12} radiusSize={radius.sm} />
      </View>
    </View>
  );
}
