import { View } from 'react-native';

import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing } from '@/src/theme';

export function TableSkeleton({
  rows = 5,
  columns = 4,
  rowHeight = 56,
}: {
  rows?: number;
  columns?: number;
  rowHeight?: number;
}) {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        overflow: 'hidden',
      }}>
      <View style={{ flexDirection: 'row', gap: spacing[3], padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
        {Array.from({ length: columns }, (_, index) => (
          <View key={`header-${index}`} style={{ flex: 1 }}>
            <SkeletonBlock width="70%" height={12} radiusSize={radius.sm} />
          </View>
        ))}
      </View>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={{
            minHeight: rowHeight,
            flexDirection: 'row',
            gap: spacing[3],
            alignItems: 'center',
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            borderBottomWidth: rowIndex === rows - 1 ? 0 : 1,
            borderBottomColor: colors.primary.borderLight,
          }}>
          {Array.from({ length: columns }, (_, colIndex) => (
            <View key={`cell-${rowIndex}-${colIndex}`} style={{ flex: 1 }}>
              <SkeletonBlock width={colIndex === columns - 1 ? '54%' : '78%'} height={12} radiusSize={radius.sm} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
