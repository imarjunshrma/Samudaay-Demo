import { useCallback, useEffect, useRef, useState } from 'react';

import { matrimonyFeedService } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';

export type DiscoveryProfile = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  ageHeight: string;
  gender?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  maritalStatus?: string | null;
  height?: string | null;
  age?: number | null;
  education: string;
  profession: string;
  familyType?: string | null;
  caste?: string | null;
  community?: string | null;
  location: string;
  showOnlineStatus?: boolean;
  locked?: boolean;
  connection?: {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    chatId?: string | null;
    direction?: string;
  } | null;
};

export type MatrimonyDiscoveryFilters = {
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  maritalStatus?: string;
  education?: string;
  height?: string;
  occupation?: string;
  familyType?: string;
  caste?: string;
  minAge?: string;
  maxAge?: string;
  community?: string;
  createdRange?: string;
  updatedRange?: string;
  sort?: string;
};

function getDiscoveryQueryKey(search?: string, filters?: MatrimonyDiscoveryFilters) {
  const normalizedFilters = Object.entries(filters ?? {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .sort(([left], [right]) => left.localeCompare(right));

  return JSON.stringify({
    search: String(search ?? '').trim(),
    filters: normalizedFilters,
  });
}

export function useMatrimonyDiscoveryProfiles() {
  const requestIdRef = useRef(0);
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>(() => matrimonyScreenCache.discoveryProfiles as DiscoveryProfile[]);
  const [loading, setLoading] = useState(!matrimonyScreenCache.discoveryLoaded);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(matrimonyScreenCache.discoveryPage);
  const [hasNextPage, setHasNextPage] = useState(matrimonyScreenCache.discoveryHasNextPage);
  const [error, setError] = useState<string | null>(matrimonyScreenCache.discoveryError);

  const loadProfiles = useCallback((options?: { preserveVisibleState?: boolean; page?: number; append?: boolean; refresh?: boolean; search?: string; filters?: MatrimonyDiscoveryFilters }) => {
    let active = true;
    const preserveVisibleState = options?.preserveVisibleState ?? false;
    const nextPage = options?.page ?? 1;
    const append = options?.append ?? false;
    const queryKey = getDiscoveryQueryKey(options?.search, options?.filters);
    const requestId = ++requestIdRef.current;

    if (options?.refresh) {
      setRefreshing(true);
    } else if (append) {
      setLoadingMore(true);
    } else if (preserveVisibleState) {
      setSearching(true);
      setError(null);
    } else if (!preserveVisibleState) {
      setLoading(true);
      setError(null);
    }
    matrimonyFeedService
      .loadDiscoveryProfilesPage({ page: nextPage, limit: 12, search: options?.search, filters: options?.filters })
      .then((result) => {
        if (active && requestId === requestIdRef.current) {
          const nextProfiles = result.items as DiscoveryProfile[];
          matrimonyScreenCache.discoveryProfiles = append ? [...matrimonyScreenCache.discoveryProfiles as DiscoveryProfile[], ...nextProfiles] : nextProfiles;
          matrimonyScreenCache.discoveryLoaded = true;
          matrimonyScreenCache.discoveryError = null;
          matrimonyScreenCache.discoveryQueryKey = queryKey;
          matrimonyScreenCache.discoveryPage = result.pagination?.page ?? nextPage;
          matrimonyScreenCache.discoveryHasNextPage = Boolean(result.pagination?.hasNextPage);
          setProfiles(append ? [...(matrimonyScreenCache.discoveryProfiles as DiscoveryProfile[])] : nextProfiles);
          setHasNextPage(matrimonyScreenCache.discoveryHasNextPage);
          setPage(matrimonyScreenCache.discoveryPage);
          setError(null);
        }
      })
      .catch((loadError) => {
        if (active && requestId === requestIdRef.current) {
          const nextError = loadError instanceof Error ? loadError.message : 'Unable to load matrimony profiles.';
          matrimonyScreenCache.discoveryProfiles = [];
          matrimonyScreenCache.discoveryLoaded = true;
          matrimonyScreenCache.discoveryError = nextError;
          matrimonyScreenCache.discoveryQueryKey = queryKey;
          matrimonyScreenCache.discoveryPage = 1;
          matrimonyScreenCache.discoveryHasNextPage = false;
          setProfiles([]);
          setHasNextPage(false);
          setPage(1);
          setError(nextError);
        }
      })
      .finally(() => {
        if (active && requestId === requestIdRef.current) {
          setLoading(false);
          setSearching(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (matrimonyScreenCache.discoveryLoaded) {
      return undefined;
    }

    return loadProfiles({ preserveVisibleState: false });
  }, [loadProfiles]);

  const updateProfileConnection = useCallback((profileId: string, connection: DiscoveryProfile['connection']) => {
    setProfiles((current) => {
      const nextProfiles = current.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              connection,
            }
          : profile,
      );
      matrimonyScreenCache.discoveryProfiles = nextProfiles as typeof matrimonyScreenCache.discoveryProfiles;
      return nextProfiles;
    });
  }, []);

  const removeProfile = useCallback((profileId: string) => {
    setProfiles((current) => {
      const nextProfiles = current.filter((profile) => profile.id !== profileId);
      matrimonyScreenCache.discoveryProfiles = nextProfiles as typeof matrimonyScreenCache.discoveryProfiles;
      return nextProfiles;
    });
  }, []);

  return { profiles, loading, searching, loadingMore, refreshing, page, hasNextPage, error, reload: loadProfiles, updateProfileConnection, removeProfile, getQueryKey: getDiscoveryQueryKey };
}
