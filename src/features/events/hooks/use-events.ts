import { useSession } from '@/src/core/providers/session-provider';
import { eventService } from '@/src/features/events/services/event-service';
import { apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';
import type { ListItem, MetricItem } from '@/src/types/app';

export function useEventOverview() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const query = useConfiguredApiQuery<{ metrics: MetricItem[]; eventId: string | null; title: string | null }>({
    queryKey: [...apiQueryKeys.events(tenantId), 'overview'],
    queryFn: () => eventService.loadEventOverview(),
    enabled: Boolean(session?.accessToken && tenantId),
  });

  return {
    metrics: query.data?.metrics ?? [],
    eventId: query.data?.eventId ?? null,
    eventTitle: query.data?.title ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSubmitting: false,
    errorMessage: query.error instanceof Error ? query.error.message : undefined,
    reload: query.refetch,
  };
}

export function useManagedEvents() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const query = useConfiguredApiQuery<ListItem[]>({
    queryKey: [...apiQueryKeys.events(tenantId), 'managed'],
    queryFn: () => eventService.loadManageEvents(),
    enabled: Boolean(session?.accessToken && tenantId),
  });

  return { items: query.data ?? [], isLoading: query.isLoading, isFetching: query.isFetching, isSubmitting: false, errorMessage: query.error instanceof Error ? query.error.message : undefined, reload: query.refetch };
}

export function useMyEvents() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const userId = session?.user.id ?? null;
  const query = useConfiguredApiQuery<ListItem[]>({
    queryKey: [...apiQueryKeys.events(tenantId), 'mine', userId ?? 'current'],
    queryFn: () => eventService.loadMyEvents(),
    enabled: Boolean(session?.accessToken && tenantId && userId),
  });

  return { items: query.data ?? [], isLoading: query.isLoading, isFetching: query.isFetching, isSubmitting: false, errorMessage: query.error instanceof Error ? query.error.message : undefined, reload: query.refetch };
}
