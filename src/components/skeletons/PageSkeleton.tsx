import { ScrollView, View } from 'react-native';

import { CardGridSkeleton } from './CardGridSkeleton';
import { ListRowSkeleton } from './ListRowSkeleton';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { spacing } from '@/src/theme';

export function PageSkeleton({
  scroll = true,
  showHero = true,
  showGrid = false,
  listRows = 3,
}: {
  scroll?: boolean;
  showHero?: boolean;
  showGrid?: boolean;
  listRows?: number;
}) {
  const content = (
    <View style={{ padding: spacing[4], gap: spacing[4] }}>
      {showHero ? (
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="34%" height={14} />
          <SkeletonBlock width="68%" height={32} />
          <SkeletonBlock width="92%" height={14} />
        </View>
      ) : null}
      {showGrid ? <CardGridSkeleton /> : null}
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: listRows }, (_, index) => (
          <ListRowSkeleton key={index} />
        ))}
      </View>
    </View>
  );

  if (!scroll) {
    return content;
  }

  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[8] }}>{content}</ScrollView>;
}
