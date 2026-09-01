import { QueryClient } from '@tanstack/react-query';

import { apiQueryDefaults } from './query-config';

export const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: apiQueryDefaults.staleTime,
      gcTime: apiQueryDefaults.gcTime,
      retry: apiQueryDefaults.retry,
      refetchOnWindowFocus: apiQueryDefaults.refetchOnWindowFocus,
      refetchOnReconnect: apiQueryDefaults.refetchOnReconnect,
    },
    mutations: {
      retry: apiQueryDefaults.mutationRetry,
    },
  },
});
