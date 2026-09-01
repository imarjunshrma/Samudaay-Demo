import { useRouter } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

import { spacing } from '@/src/theme';

import { DashboardCommunityCard } from './dashboard-community-card';

export function DashboardFeatureGrid({
  items,
}: {
  items: readonly { title: string; subtitle: string; icon: string; route?: string }[];
}) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSingleColumn = width < 430;
  const cardWidth = isSingleColumn ? '100%' : '48%';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing[4], width: '100%' }}>
      {items.map((item, index) => (
        <DashboardCommunityCard
          key={item.title}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon as never}
          highlight={index === 1}
          width={cardWidth}
          onPress={item.route ? () => router.push(item.route as never) : undefined}
        />
      ))}
    </View>
  );
}
