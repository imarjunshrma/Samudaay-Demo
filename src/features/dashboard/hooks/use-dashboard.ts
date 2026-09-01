import { useSession } from '@/src/core/providers/session-provider';
import { apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';

import { dashboardService, type MemberDashboardSummary } from '../services/dashboard-service';

export function useMemberDashboard() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const userId = session?.user.id ?? null;

  const query = useConfiguredApiQuery<MemberDashboardSummary>({
    queryKey: apiQueryKeys.dashboard(tenantId || 'anonymous', userId || 'anonymous'),
    queryFn: () => dashboardService.loadMemberDashboard(),
    enabled: Boolean(tenantId && userId && session?.accessToken),
    retry: false,
  });

  return {
    dashboard: query.data,
    metrics: query.data?.metrics ?? [],
    cards: query.data?.cards ?? [],
    updates: query.data?.updates ?? [],
    sponsoredCard: query.data?.sponsoredCard ?? null,
    identityCard: query.data?.identityCard ?? null,
    summary: query.data?.summary ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    errorMessage: query.error instanceof Error ? query.error.message : undefined,
    isSubmitting: false,
    refetch: query.refetch,
  };
}
