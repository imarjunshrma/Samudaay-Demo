import { useSession } from '@/src/core/providers/session-provider';
import { donationService, type DonationRecordItem } from '@/src/features/finance/services/donation-service';
import { apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';

export function useDonationRecords({ mine = true }: { mine?: boolean } = {}) {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const query = useConfiguredApiQuery<DonationRecordItem[]>({
    queryKey: [...apiQueryKeys.donations(tenantId), mine ? 'mine' : 'all'],
    queryFn: () => donationService.loadDonationRecordsForScope(mine),
    enabled: Boolean(session?.accessToken && tenantId),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof Error ? query.error.message : undefined,
    reload: query.refetch,
  };
}
