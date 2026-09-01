import { apiConfig } from '@/src/constants/apiConfig';

export const apiQueryDefaults = {
  enabled: apiConfig.isConfigured,
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  mutationRetry: 0,
} as const;

export function resolveApiQueryEnabled(enabled?: boolean) {
  return enabled ?? apiConfig.isConfigured;
}
