import { useCallback, useEffect, useState } from 'react';

import { publicationFeedService, type PublicationRecord } from '../services/publication-feed-service';

export function usePublicationArchiveFeed(filters?: { status?: string; year?: number | null; month?: number | null; search?: string }) {
  const [items, setItems] = useState<PublicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = filters?.status;
  const year = filters?.year;
  const month = filters?.month;
  const search = filters?.search;
  const loadPage = useCallback(async ({ nextPage = 1, append = false, refresh = false } = {}) => {
    if (append) {
      setLoadingMore(true);
    } else if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await publicationFeedService.loadArchivePage({ status, year, month, search, page: nextPage, limit: 20 });
      setItems((current) => {
        if (!append) {
          return result.items;
        }
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setPage(result.pagination?.page ?? nextPage);
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
    } catch (loadError) {
      if (!append) {
        setItems([]);
      }
      setError(loadError instanceof Error ? loadError.message : 'Unable to load publications.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [month, search, status, year]);

  const refresh = useCallback(async () => {
    await loadPage({ nextPage: 1 });
  }, [loadPage]);

  const refreshLatest = useCallback(async () => {
    await loadPage({ nextPage: 1, refresh: true });
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage) {
      return;
    }
    await loadPage({ nextPage: page + 1, append: true });
  }, [hasNextPage, loadPage, loadingMore, page]);

  useEffect(() => {
    refresh().catch(() => {
      return;
    });
  }, [refresh]);

  return {
    items,
    loading,
    loadingMore,
    refreshing,
    hasNextPage,
    error,
    refresh,
    refreshLatest,
    loadMore,
  };
}
