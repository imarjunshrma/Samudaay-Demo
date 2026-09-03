import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';

import { Button, FilterChips, FilterSheet, InfiniteScrollList, Text } from '@/src/components';
import { ErrorState } from '@/src/components/feedback';
import { AppHeaderSearch } from '@/src/components/layout/AppHeader';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { registrationService } from '@/src/features/registration/services/registration-service';
import type { KycQueueItem } from '@/src/features/registration/types/registration';
import { AdminQuickInsightsSection } from './admin-quick-insights-section';
import { AdminKycActionMenu } from './admin-kyc-action-menu';

type KycTabKey = 'Pending' | 'Ready' | 'Rejected';
type KycPeriodFilterKey = 'all' | 'today' | 'last7Days' | 'thisMonth' | 'older';
type KycDocumentFilterKey = 'all' | 'withDocuments' | 'missingDocuments' | 'multipleDocuments';

const PAGE_SIZE = 20;
const KYC_APPROVALS_RETURN_PATH = '/admin/kyc-approvals';
const KYC_ANALYTICS_PATH = '/admin/analytics';

function getStatusTone(status: KycQueueItem['status']) {
  switch (status) {
    case 'Ready':
      return {
        pillBackground: '#ecfdf5',
        pillText: '#047857',
      };
    case 'Rejected':
      return {
        pillBackground: '#fef2f2',
        pillText: '#b91c1c',
      };
    default:
      return {
        pillBackground: '#fffbeb',
        pillText: '#b45309',
      };
  }
}

function formatReceivedLabel(value?: string | null, t?: (key: string) => string) {
  if (!value) {
    return t?.('meta.recently') ?? 'Recently';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return t?.('meta.recently') ?? 'Recently';
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    return t?.('meta.justNow') ?? 'Just now';
  }
  if (diffHours < 24) {
    return t?.('meta.hoursAgo').replace('{count}', String(diffHours)) ?? `${diffHours}h ago`;
  }

  return parsed.toLocaleDateString(t?.('meta.dateLocale') ?? 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDocumentLabel(value: string, t?: (key: string) => string) {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized.includes('aadhaar')) {
    return t?.('meta.documentTypes.aadhaar') ?? value;
  }
  if (normalized.includes('jati') || normalized.includes('dakhlo') || normalized.includes('caste')) {
    return t?.('meta.documentTypes.casteCertificate') ?? value;
  }
  if (normalized.includes('school')) {
    return t?.('meta.documentTypes.schoolCertificate') ?? value;
  }
  if (normalized.includes('photo') || normalized.includes('selfie')) {
    return t?.('meta.documentTypes.profilePhoto') ?? value;
  }

  return value || t?.('meta.documentTypes.document') || 'Document';
}

function formatDocuments(documents: readonly string[], t?: (key: string, vars?: Record<string, string | number>) => string) {
  if (!documents.length) {
    return t?.('meta.noDocs') ?? 'No documents attached';
  }

  if (documents.length === 1) {
    const documentLabel = getDocumentLabel(documents[0], t as ((key: string) => string) | undefined);
    return t?.('meta.oneDoc').replace('{name}', documentLabel) ?? documentLabel;
  }

  return t?.('meta.multipleDocs').replace('{count}', String(documents.length)) ?? `${documents.length} documents attached`;
}

function getPeriodFilterLabel(filter: KycPeriodFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'today':
      return t('filters.today');
    case 'last7Days':
      return t('filters.last7Days');
    case 'thisMonth':
      return t('filters.thisMonth');
    case 'older':
      return t('filters.older');
    default:
      return t('filters.anyTime');
  }
}

function getDocumentFilterLabel(filter: KycDocumentFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'withDocuments':
      return t('filters.withDocuments');
    case 'missingDocuments':
      return t('filters.missingDocuments');
    case 'multipleDocuments':
      return t('filters.multipleDocuments');
    default:
      return t('filters.allDocuments');
  }
}

function KycQueueHeaderSkeleton() {
  return (
    <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], marginBottom: spacing[6], gap: spacing[4] }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        {Array.from({ length: 3 }, (_, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              minWidth: 158,
              height: 104,
              borderRadius: 20,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              padding: spacing[4],
              gap: spacing[2],
            }}>
            <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
            <SkeletonBlock width="34%" height={28} radiusSize={radius.md} />
            <SkeletonBlock width="54%" height={12} radiusSize={radius.sm} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <SkeletonBlock width={108} height={36} radiusSize={radius.full} />
        <SkeletonBlock width={118} height={36} radiusSize={radius.full} />
        <SkeletonBlock width={114} height={36} radiusSize={radius.full} />
        <SkeletonBlock width={110} height={36} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function AdminKycApprovalQueueContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.kyc-approvals');
  const { language } = useAppPreferences();
  const [items, setItems] = useState<KycQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [activeTab, setActiveTab] = useState<KycTabKey>('Pending');
  const [activePeriodFilter, setActivePeriodFilter] = useState<KycPeriodFilterKey>('all');
  const [activeDocumentFilter, setActiveDocumentFilter] = useState<KycDocumentFilterKey>('all');
  const [activeLocationFilters, setActiveLocationFilters] = useState<string[]>(['all']);
  const [draftPeriodFilter, setDraftPeriodFilter] = useState<KycPeriodFilterKey>('all');
  const [draftDocumentFilter, setDraftDocumentFilter] = useState<KycDocumentFilterKey>('all');
  const [draftLocationFilters, setDraftLocationFilters] = useState<string[]>(['all']);
  const [pagination, setPagination] = useState<{
    nextOffset: number;
    hasNextPage: boolean;
    totalCount: number;
  } | null>(null);
  const [summary, setSummary] = useState<{
    counts: Record<KycTabKey, number>;
    locations: string[];
  }>({
    counts: {
      Pending: 0,
      Ready: 0,
      Rejected: 0,
    },
    locations: [],
  });
  const [menuItem, setMenuItem] = useState<KycQueueItem | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const hasFocusedRef = useRef(false);
  const paginationRef = useRef<typeof pagination>(null);

  const loadQueue = useCallback(async (mode: 'reset' | 'append' = 'reset') => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    if (mode === 'append') {
      setLoadingMore(true);
    } else if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await registrationService.loadKycQueuePage({
        limit: PAGE_SIZE,
        offset: mode === 'append' ? paginationRef.current?.nextOffset ?? 0 : 0,
        search: debouncedSearch.trim(),
        status: activeTab,
        period: activePeriodFilter,
        documents: activeDocumentFilter,
        locations: activeLocationFilters.includes('all') ? [] : activeLocationFilters,
      });

      if (requestIdRef.current !== requestId) {
        return;
      }

      setItems((current) => {
        if (mode !== 'append') {
          return result.items;
        }
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setSummary(result.summary);
      const nextPagination = result.pagination
        ? {
            nextOffset: result.pagination.nextOffset,
            hasNextPage: result.pagination.hasNextPage,
            totalCount: result.pagination.totalCount,
          }
        : {
            nextOffset: result.items.length,
            hasNextPage: false,
            totalCount: result.items.length,
          };
      paginationRef.current = nextPagination;
      setPagination(nextPagination);
    } catch (loadError) {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
      if (mode !== 'append') {
        setItems([]);
        setPagination(null);
        paginationRef.current = null;
      }
    } finally {
      if (requestIdRef.current === requestId) {
        if (mode !== 'append') {
          hasLoadedRef.current = true;
        }
        setIsLoading(false);
        setLoadingMore(false);
      }
    }
  }, [activeDocumentFilter, activeLocationFilters, activePeriodFilter, activeTab, debouncedSearch, t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedRef.current) {
        hasFocusedRef.current = true;
        return undefined;
      }

      setSearch('');
      setDebouncedSearch('');
      setSearchInHeader(false);
      setActiveTab('Pending');
      setActivePeriodFilter('all');
      setActiveDocumentFilter('all');
      setActiveLocationFilters(['all']);
      setDraftPeriodFilter('all');
      setDraftDocumentFilter('all');
      setDraftLocationFilters(['all']);
      setPagination(null);
      paginationRef.current = null;
      setMenuItem(null);
      setMenuVisible(false);
      setFilterVisible(false);
      setReloadToken((current) => current + 1);
    }, []),
  );
  useEffect(() => {
    void loadQueue('reset');
  }, [activeDocumentFilter, activeLocationFilters, activePeriodFilter, activeTab, debouncedSearch, loadQueue, reloadToken]);

  const hasNextPage = Boolean(pagination?.hasNextPage);
  const locationFilterOptions = useMemo(
    () => [{ key: 'all', label: t('filters.allLocations') }, ...summary.locations.map((location) => ({ key: location, label: translateLocationText(location, language) || location }))],
    [language, summary.locations, t],
  );
  const appliedFilterCount = useMemo(() => {
    const locationCount = activeLocationFilters.filter((value) => value !== 'all').length;
    return (activePeriodFilter !== 'all' ? 1 : 0) + (activeDocumentFilter !== 'all' ? 1 : 0) + locationCount;
  }, [activeDocumentFilter, activeLocationFilters, activePeriodFilter]);
  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activePeriodFilter !== 'all') {
      filters.push({
        key: `period-${activePeriodFilter}`,
        label: getPeriodFilterLabel(activePeriodFilter, t),
        onRemove: () => {
          setActivePeriodFilter('all');
        },
      });
    }

    if (activeDocumentFilter !== 'all') {
      filters.push({
        key: `document-${activeDocumentFilter}`,
        label: getDocumentFilterLabel(activeDocumentFilter, t),
        onRemove: () => {
          setActiveDocumentFilter('all');
        },
      });
    }

    activeLocationFilters
      .filter((value) => value !== 'all')
      .forEach((location) => {
        filters.push({
          key: `location-${location}`,
          label: translateLocationText(location, language) || location,
          onRemove: () => {
            setActiveLocationFilters((current) => {
              const next = current.filter((value) => value !== location && value !== 'all');
              return next.length ? next : ['all'];
            });
          },
        });
      });

    return filters;
  }, [activeDocumentFilter, activeLocationFilters, activePeriodFilter, language, t]);
  const quickInsightItems = useMemo(
    () => [
      {
        id: 'pending',
        label: t('insights.pending'),
        value: String(summary.counts.Pending),
        icon: 'schedule' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle || 'rgba(24,168,117,0.12)',
      },
      {
        id: 'approved',
        label: t('insights.approved'),
        value: String(summary.counts.Ready),
        icon: 'verified' as const,
        iconColor: '#047857',
        iconBackgroundColor: '#ecfdf5',
      },
      {
        id: 'rejected',
        label: t('insights.rejected'),
        value: String(summary.counts.Rejected),
        icon: 'cancel' as const,
        iconColor: '#b91c1c',
        iconBackgroundColor: '#fef2f2',
      },
    ],
    [summary.counts.Pending, summary.counts.Ready, summary.counts.Rejected, t],
  );

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActioningId(id);
    try {
      if (action === 'approve') {
        await registrationService.approveKyc(id);
      } else {
        await registrationService.rejectKyc(id);
      }
      await loadQueue();
    } finally {
      setActioningId(null);
    }
  };

  const openMenu = (item: KycQueueItem) => {
    setMenuItem(item);
    setMenuVisible(true);
  };

  const openKycApproval = (item: KycQueueItem) => {
    router.push(
      {
        pathname: '/kyc-approval',
        params: { registrationId: item.id, returnTo: KYC_APPROVALS_RETURN_PATH },
      } as never,
    );
  };

  const toggleLocationFilter = (key: string) => {
    setDraftLocationFilters((current) => {
      if (key === 'all') {
        return ['all'];
      }

      const next = current.filter((value) => value !== 'all');
      if (next.includes(key)) {
        const trimmed = next.filter((value) => value !== key);
        return trimmed.length ? trimmed : ['all'];
      }

      return [...next, key];
    });
  };

  const openFilters = () => {
    setDraftPeriodFilter(activePeriodFilter);
    setDraftDocumentFilter(activeDocumentFilter);
    setDraftLocationFilters(activeLocationFilters);
    setFilterVisible(true);
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#FDFCFB' }}>
      <View style={{ flex: 1 }}>
        <AppHeaderSearch
          title={t('title')}
          placeholder={t('search.placeholder')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchInHeader}
          onSearchPress={() => setSearchInHeader(true)}
          onCloseSearch={() => {
            setSearch('');
            setSearchInHeader(false);
          }}
          onBackPress={navigateBack}
        />

        {error ? (
          <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
            <ErrorState
              title={t('errors.loadFailed')}
              description={error}
              onRetry={() => {
                void loadQueue();
              }}
            />
          </View>
        ) : (
          <InfiniteScrollList
            data={items}
            keyExtractor={(item) => item.id}
            loadingInitial={isLoading}
            preserveHeaderOnInitialLoad
            loadingMore={loadingMore}
            hasNextPage={hasNextPage}
            hideLoadMoreText
            renderSkeletonItem={() => (
              /* Matches real KYC card: avatar(64) row + text + actions ≈ 165px */
              <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center', paddingHorizontal: spacing[4] }}>
                <View style={{ backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.light, borderRadius: radius.xl, padding: spacing[4], gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[4] }}>
                    <SkeletonBlock width={64} height={64} radiusSize={radius.lg} />
                    <View style={{ flex: 1, gap: spacing[2] }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SkeletonBlock width="44%" height={16} radiusSize={radius.sm} />
                        <SkeletonBlock width={72} height={24} radiusSize={radius.full} />
                      </View>
                      <SkeletonBlock width="64%" height={12} radiusSize={radius.sm} />
                      <SkeletonBlock width="48%" height={12} radiusSize={radius.sm} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: spacing[2], paddingTop: spacing[1] }}>
                    <SkeletonBlock width="48%" height={36} radiusSize={radius.lg} />
                    <SkeletonBlock width="48%" height={36} radiusSize={radius.lg} />
                  </View>
                </View>
              </View>
            )}
            onLoadMore={() => {
              if (!hasNextPage || loadingMore) {
                return;
              }
              void loadQueue('append');
            }}
          emptyTitle={t('empty.title')}
          emptyDescription={t('empty.description')}
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 112, flexGrow: 1 }}
            ListHeaderComponent={isLoading && !items.length ? <KycQueueHeaderSkeleton /> : (
            <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], marginBottom: spacing[6] }}>
              <AdminQuickInsightsSection
                title={t('insights.title')}
                periodLabel={t('insights.periodLabel')}
                actionLabel={t('insights.viewAnalytics')}
                onActionPress={() =>
                  router.push(
                    {
                      pathname: KYC_ANALYTICS_PATH,
                      params: { returnTo: KYC_APPROVALS_RETURN_PATH },
                    } as never,
                  )
                }
                items={quickInsightItems}
              />
              <View style={{ height: spacing[4] }} />
              <FilterChips
                scrollable
                showIcons
                activeKey={activeTab}
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('filters.filters')} (${appliedFilterCount})` : t('filters.filters'),
                    icon: 'tune',
                  },
                  { key: 'Pending', label: `${t('tabs.pending')} (${summary.counts.Pending})`, icon: 'schedule' },
                  { key: 'Ready', label: `${t('tabs.approved')} (${summary.counts.Ready})`, icon: 'verified' },
                  { key: 'Rejected', label: `${t('tabs.rejected')} (${summary.counts.Rejected})`, icon: 'cancel' },
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setActiveTab(key as KycTabKey);
                }}
              />
              {appliedFilters.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3] }}>
                  {appliedFilters.map((filter) => (
                    <TouchableOpacity
                      key={filter.key}
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={filter.onRemove}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing[1],
                        borderRadius: radius.full,
                        borderWidth: 1,
                        borderColor: colors.primary.border,
                        backgroundColor: colors.primary.subtle,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[2],
                      }}>
                      <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
                        {filter.label}
                      </Text>
                      <MaterialIcons name="close" size={14} color={colors.primary.DEFAULT} />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
              </View>
            )}
          renderItem={({ item }) => {
            const tone = getStatusTone(item.status);
            const isBusy = actioningId === item.id;
            const primaryLabel = item.status === 'Pending' ? t('actions.review') : t('actions.view');
            const statusLabel = item.status === 'Pending' ? t('status.pending') : item.status === 'Ready' ? t('status.approved') : t('status.rejected');

            return (
              <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center', paddingHorizontal: spacing[4] }}>
                <View
                  style={{
                    backgroundColor: item.status === 'Pending' ? colors.background.surface : '#F8F5F2',
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    borderRadius: radius.xl,
                    padding: spacing[4],
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 1,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      top: -32,
                      right: -32,
                      width: 96,
                      height: 96,
                      borderRadius: 999,
                      backgroundColor: 'rgba(191, 219, 254, 0.16)',
                    }}
                  />

                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[4], position: 'relative' }}>
                    <View style={{ width: 64, height: 64, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, flexShrink: 0 }}>
                      {item.photoUrl ? (
                        <Image source={{ uri: item.photoUrl }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted }}>
                          <MaterialIcons name="person" size={28} color={colors.primary.DEFAULT} />
                        </View>
                      )}
                    </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] }}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18, lineHeight: 22 }} numberOfLines={1}>
                          {item.memberName}
                        </Text>
                        <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                          {t('meta.memberId').replace('{id}', item.memberId || `#${item.id.slice(0, 5).toUpperCase()}`)}
                        </Text>
                        {item.phone ? (
                          <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                            {item.phone}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{ paddingHorizontal: spacing[2], paddingVertical: 6, backgroundColor: tone.pillBackground, borderRadius: 8, borderWidth: 1, borderColor: item.status === 'Pending' ? '#fde68a' : item.status === 'Ready' ? '#bbf7d0' : '#fecaca' }}>
                        <Text style={{ color: tone.pillText, fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: spacing[3], flexDirection: 'row', alignItems: 'center', gap: spacing[4], flexWrap: 'wrap' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="location-on" size={14} color={colors.text.muted} />
                        <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                          {translateLocationText(item.city, language) || item.city}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="calendar-today" size={14} color={colors.text.muted} />
                        <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                          {formatReceivedLabel(item.submittedAt, t)}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: spacing[2] }}>
                      {formatDocuments(item.documents, t)}
                    </Text>
                  </View>
                </View>

                  <View style={{ marginTop: spacing[4], paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: '#f5f5f4', flexDirection: 'row', gap: spacing[2] }}>
                  <View style={{ flex: 1 }}>
                    <Button
                        variant="primary"
                        fullWidth
                        loading={isBusy}
                        leftIcon={<MaterialIcons name="open-in-new" size={16} color="#ffffff" />}
                        onPress={() => openKycApproval(item)}>
                        {primaryLabel}
                      </Button>
                    </View>
                    <TouchableOpacity
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={() => openMenu(item)}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: radius.lg,
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MaterialIcons name="more-horiz" size={22} color={colors.text.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
          />
        )}
      </View>

      <AdminKycActionMenu
        visible={menuVisible}
        item={menuItem}
        onClose={() => setMenuVisible(false)}
        onReview={(item) => {
          setMenuItem(item);
          openKycApproval(item);
        }}
        onApprove={(item) => {
          void handleAction(item.id, 'approve');
        }}
        onReject={(item) => {
          void handleAction(item.id, 'reject');
        }}
      />

      <FilterSheet
        visible={filterVisible}
        title={t('filters.filtersGroup')}
        subtitle={t('filters.subtitle')}
        sections={[
          {
            title: t('filters.time'),
            icon: 'schedule',
            activeKey: draftPeriodFilter,
            items: [
              { key: 'all', label: t('filters.anyTime') },
              { key: 'today', label: t('filters.today') },
              { key: 'last7Days', label: t('filters.last7Days') },
              { key: 'thisMonth', label: t('filters.thisMonth') },
              { key: 'older', label: t('filters.older') },
            ],
            onSelect: (key) => setDraftPeriodFilter(key as KycPeriodFilterKey),
          },
          {
            title: t('filters.documents'),
            icon: 'description',
            activeKey: draftDocumentFilter,
            items: [
              { key: 'all', label: t('filters.allDocuments') },
              { key: 'withDocuments', label: t('filters.withDocuments') },
              { key: 'missingDocuments', label: t('filters.missingDocuments') },
              { key: 'multipleDocuments', label: t('filters.multipleDocuments') },
            ],
            onSelect: (key) => setDraftDocumentFilter(key as KycDocumentFilterKey),
          },
          {
            title: t('filters.location'),
            icon: 'place',
            activeKey: draftLocationFilters.includes('all') ? 'all' : '',
            activeKeys: draftLocationFilters,
            items: locationFilterOptions,
            onSelect: toggleLocationFilter,
            selectionMode: 'multiple',
          },
        ]}
        onClose={() => {
          setDraftPeriodFilter(activePeriodFilter);
          setDraftDocumentFilter(activeDocumentFilter);
          setDraftLocationFilters(activeLocationFilters);
          setFilterVisible(false);
        }}
          onApply={() => {
            setActivePeriodFilter(draftPeriodFilter);
            setActiveDocumentFilter(draftDocumentFilter);
            setActiveLocationFilters(draftLocationFilters);
            setFilterVisible(false);
          }}
        onReset={() => {
          setDraftPeriodFilter('all');
          setDraftDocumentFilter('all');
          setDraftLocationFilters(['all']);
        }}
        applyLabel={t('actions.applyFilters')}
        resetLabel={t('actions.resetFilters')}
      />
    </AppSafeAreaView>
  );
}
