import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { spacing } from '@/src/theme';

import { DashboardCommunityCard } from './dashboard-community-card';

export function MemberDashboardActionGrid({
  rows,
}: {
  rows: readonly (readonly { title: string; subtitle: string; icon: string; route?: string }[])[];
}) {
  const router = useRouter();

  return (
    <View style={{ gap: spacing[4], width: '100%' }}>
      {rows.map((row, rowIndex) => (
        <View key={`member-dashboard-row-${rowIndex}`} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          {row.map((item) => (
            <DashboardCommunityCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as never}
              width="48%"
              onPress={item.route ? () => router.push(item.route as never) : undefined}
            />
          ))}
          {row.length === 1 ? <View style={{ width: '48%', flexBasis: '48%', maxWidth: '48%', flexGrow: 0, flexShrink: 0 }} /> : null}
        </View>
      ))}
    </View>
  );
}
