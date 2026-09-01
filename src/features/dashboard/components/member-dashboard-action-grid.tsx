import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { apiConfig } from '@/src/constants';
import { getBackendSessionContext } from '@/src/features/auth/services/backend-session';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { spacing } from '@/src/theme';

import { DashboardCommunityCard } from './dashboard-community-card';

const SAINT_PDF_ROUTE = 'asset://lalabapa-gondal';

export function MemberDashboardActionGrid({
  rows,
}: {
  rows: readonly (readonly { title: string; subtitle: string; icon: string; route?: string }[])[];
}) {
  const router = useRouter();
  const openSaintPdf = async () => {
    try {
      const backendSession = await getBackendSessionContext();
      if (!backendSession) {
        throw new Error('Backend session is required.');
      }
      const params = new URLSearchParams({
        mode: 'inline',
        accessToken: backendSession.token,
        tenantId: backendSession.tenantId,
      });

      router.push({
        pathname: '/pdf-viewer',
        params: {
          title: 'Saint PDF',
          url: `${apiConfig.baseUrl}${apiEndpoints.communitySaintPdf(backendSession.tenantId)}?${params.toString()}`,
        },
      } as never);
    } catch (error) {
      Alert.alert('Saint', error instanceof Error ? error.message : 'Unable to open PDF.');
    }
  };

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
              onPress={item.route === SAINT_PDF_ROUTE ? openSaintPdf : item.route ? () => router.push(item.route as never) : undefined}
            />
          ))}
          {row.length === 1 ? <View style={{ width: '48%', flexBasis: '48%', maxWidth: '48%', flexGrow: 0, flexShrink: 0 }} /> : null}
        </View>
      ))}
    </View>
  );
}
