import { useSession } from '@/src/core/providers/session-provider';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';

export function useMemberDirectory() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const query = useConfiguredApiQuery<DirectoryMemberItem[]>({
    queryKey: [...apiQueryKeys.tenant(tenantId), 'directory', 'members'],
    queryFn: () => directoryService.loadMembers(),
    enabled: Boolean(session?.accessToken && tenantId),
  });

  return {
    items: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSubmitting: false,
    reload: query.refetch,
  };
}

export function useTrusteeDirectory() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const query = useConfiguredApiQuery<DirectoryMemberItem[]>({
    queryKey: [...apiQueryKeys.tenant(tenantId), 'directory', 'trustees'],
    queryFn: () => directoryService.loadTrustees(),
    enabled: Boolean(session?.accessToken && tenantId),
  });

  return {
    items: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSubmitting: false,
    reload: query.refetch,
  };
}
