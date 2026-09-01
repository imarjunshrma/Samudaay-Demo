import { View } from 'react-native';

import { SkeletonAvatar, SkeletonBlock, SkeletonCard, SkeletonForm, SkeletonText } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function MatrimonyDiscoverySkeleton() {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        overflow: 'hidden',
      }}>
      <View style={{ position: 'relative' }}>
        <SkeletonBlock width="100%" height={320} radiusSize={0} />
        <View style={{ position: 'absolute', top: spacing[4], right: spacing[4] }}>
          <SkeletonBlock width={40} height={40} radiusSize={radius.full} />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing[4], gap: spacing[2] }}>
          <SkeletonBlock width="52%" height={30} radiusSize={radius.sm} />
          <SkeletonBlock width="34%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <SkeletonText widths={['38%', '28%']} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], justifyContent: 'space-between' }}>
          <SkeletonBlock width="48%" height={20} radiusSize={radius.sm} />
          <SkeletonBlock width="48%" height={20} radiusSize={radius.sm} />
          <SkeletonBlock width="48%" height={20} radiusSize={radius.sm} />
          <SkeletonBlock width="48%" height={20} radiusSize={radius.sm} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          <SkeletonBlock width="100%" height={48} radiusSize={radius.lg} style={{ flex: 1 }} />
          <SkeletonBlock width={48} height={48} radiusSize={radius.lg} />
        </View>
      </View>
    </View>
  );
}

export function MatrimonyMessagesSkeleton() {
  return (
    <View style={{ gap: spacing[3] }}>
      {Array.from({ length: 4 }, (_, index) => (
        <View
          key={index}
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            padding: spacing[4],
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[3],
          }}>
          <SkeletonAvatar size={48} />
          <View style={{ flex: 1 }}>
            <SkeletonText widths={['52%', '42%']} />
          </View>
          <SkeletonBlock width={22} height={22} radiusSize={radius.sm} />
        </View>
      ))}
    </View>
  );
}

export function MatrimonyProfileFormSkeleton() {
  return (
    <View style={{ gap: spacing[5] }}>
      <SkeletonCard lines={2} />
      <SkeletonBlock width="100%" height={180} radiusSize={radius.lg} />
      <SkeletonForm fields={5} />
    </View>
  );
}

export function MatrimonyProfileDetailsSkeleton() {
  return (
    <View style={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ gap: spacing[2] }}>
        <SkeletonBlock width="45%" height={12} radiusSize={radius.full} />
        <SkeletonBlock width="78%" height={42} radiusSize={radius.md} />
        <SkeletonBlock width="56%" height={18} radiusSize={radius.full} />
      </View>
      <SkeletonBlock width="100%" height={360} radiusSize={radius.xl} />
      <SkeletonCard lines={5} />
      <SkeletonCard lines={4} />
    </View>
  );
}

export function MatrimonyApprovalListSkeleton() {
  return (
    <View style={{ gap: spacing[3] }}>
      {Array.from({ length: 3 }, (_, index) => (
        <View
          key={index}
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            overflow: 'hidden',
          }}>
          <SkeletonBlock width="100%" height={260} radiusSize={0} />
          <View style={{ padding: spacing[4], gap: spacing[3] }}>
            <SkeletonText widths={['60%', '42%', '50%']} />
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <SkeletonBlock width="48%" height={42} radiusSize={radius.full} />
              <SkeletonBlock width="48%" height={42} radiusSize={radius.full} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function MatrimonyAnalyticsSkeleton() {
  return (
    <View style={{ gap: spacing[3] }}>
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonCard key={index} lines={3} />
      ))}
      <SkeletonBlock width="100%" height={260} radiusSize={radius.xl} />
      <SkeletonCard lines={4} />
    </View>
  );
}
