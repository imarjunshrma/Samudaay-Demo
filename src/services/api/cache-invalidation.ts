import type { QueryKey } from '@tanstack/react-query';

import { apiQueryClient } from './query-client';
import { apiQueryKeys } from './query-keys';

export async function invalidateApiScopes(queryKeys: QueryKey[]) {
  await Promise.all(
    queryKeys.map((queryKey) =>
      apiQueryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      }),
    ),
  );
}

export async function invalidateTenantApiData(tenantId?: string | null) {
  await apiQueryClient.invalidateQueries({
    queryKey: apiQueryKeys.tenant(tenantId),
    refetchType: 'active',
  });
}
