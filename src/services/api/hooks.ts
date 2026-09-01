import { useMutation, useQuery, useQueryClient, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';

import { invalidateApiScopes, invalidateTenantApiData } from './cache-invalidation';
import { apiQueryClient } from './query-client';
import { apiQueryDefaults, resolveApiQueryEnabled } from './query-config';

export type ApiQueryFn<TData> = () => Promise<TData>;

export interface UseApiQueryOptions<TData, TError = Error>
  extends Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn' | 'enabled' | 'staleTime'> {
  queryKey: QueryKey;
  queryFn: ApiQueryFn<TData>;
  enabled?: boolean;
  staleTime?: number;
}

export interface UseApiMutationOptions<TData, TVariables, TError = Error, TContext = unknown>
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueryKeys?: QueryKey[] | ((data: TData, variables: TVariables) => QueryKey[]);
  invalidateTenantId?: string | null | ((data: TData, variables: TVariables) => string | null | undefined);
}

export function useApiQuery<TData, TError = Error>(options: UseApiQueryOptions<TData, TError>) {
  return useQuery({
    ...options,
    enabled: resolveApiQueryEnabled(options.enabled),
    staleTime: options.staleTime ?? apiQueryDefaults.staleTime,
    queryFn: options.queryFn,
  });
}

export function useConfiguredApiQuery<TData, TError = Error>(options: UseApiQueryOptions<TData, TError>) {
  return useApiQuery(options);
}

export function useApiMutation<TData, TVariables, TError = Error, TContext = unknown>(
  options: UseApiMutationOptions<TData, TVariables, TError, TContext>,
) {
  const { invalidateQueryKeys, invalidateTenantId, onSuccess, ...mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    mutationFn: options.mutationFn,
    retry: options.retry ?? apiQueryDefaults.mutationRetry,
    onSuccess: async (data, variables, context, mutationContext) => {
      await onSuccess?.(data, variables, context, mutationContext);

      const nextQueryKeys = typeof invalidateQueryKeys === 'function'
        ? invalidateQueryKeys(data, variables)
        : invalidateQueryKeys;
      if (nextQueryKeys?.length) {
        await invalidateApiScopes(nextQueryKeys);
      }

      const nextTenantId = typeof invalidateTenantId === 'function'
        ? invalidateTenantId(data, variables)
        : invalidateTenantId;
      if (nextTenantId !== undefined) {
        await invalidateTenantApiData(nextTenantId);
      }
    },
  });
}

export function useApiQueryClient() {
  return useQueryClient();
}

export function invalidateApiQueries(queryKey: QueryKey) {
  return apiQueryClient.invalidateQueries({ queryKey });
}
