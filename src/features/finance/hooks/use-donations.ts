import { useState } from 'react';
import { useSession } from '@/src/core/providers/session-provider';
import { donationService } from '@/src/features/finance/services/donation-service';
import { apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';
import type { ListItem, MetricItem } from '@/src/types/app';

export function useDonations({ mine = true }: { mine?: boolean } = {}) {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const query = useConfiguredApiQuery<{ metrics: MetricItem[]; items: ListItem[] }>({
    queryKey: [...apiQueryKeys.donations(tenantId), mine ? 'overview-mine' : 'overview-all'],
    queryFn: async () => {
      const [nextMetrics, nextItems] = await Promise.all([
        donationService.loadDonationMetricsForScope(mine),
        donationService.loadDonationsForScope(mine),
      ]);
      return { metrics: nextMetrics, items: nextItems };
    },
    enabled: Boolean(session?.accessToken && tenantId),
  });

  async function record(item: ListItem) {
    setIsSubmitting(true);
    try {
      await donationService.recordDonation(item);
      await query.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to record this contribution.';
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    metrics: query.data?.metrics ?? [],
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSubmitting,
    errorMessage: query.error instanceof Error ? query.error.message : undefined,
    reload: query.refetch,
    record,
  };
}
