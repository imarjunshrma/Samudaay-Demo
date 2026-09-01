import { View } from 'react-native';

import { StatCardSkeleton } from './StatCardSkeleton';
import { spacing } from '@/src/theme';

export function CardGridSkeleton({
  count = 4,
  cards,
  columns = 2,
  itemMinHeight = 132,
  cardMinHeight,
}: {
  count?: number;
  cards?: number;
  columns?: number;
  itemMinHeight?: number;
  cardMinHeight?: number;
}) {
  const totalCards = cards ?? count;
  const minHeight = cardMinHeight ?? itemMinHeight;
  const width = `${100 / columns}%` as const;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing[1.5] }}>
      {Array.from({ length: totalCards }, (_, index) => (
        <View key={index} style={{ width, paddingHorizontal: spacing[1.5], paddingBottom: spacing[3] }}>
          <StatCardSkeleton minHeight={minHeight} />
        </View>
      ))}
    </View>
  );
}
