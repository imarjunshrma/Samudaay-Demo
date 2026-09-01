import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeaderSearch, Button, FilterChips, FilterSheet, InfiniteScrollList, Text } from '@/src/components';
import { ErrorState } from '@/src/components/feedback';
import { SkeletonAvatar, SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { profileService } from '@/src/features/profile/services/profile-service';
import type { ProfileUpdateRequestItem } from '@/src/features/profile/types/profile';
import { AdminQuickInsightsSection } from './admin-quick-insights-section';

const PAGE_SIZE = 6;

type ProfileRequestTimeFilterKey = 'all' | 'today' | 'last7Days' | 'thisMonth' | 'older';
type ProfileRequestChangeFilterKey = 'all' | 'photo' | 'contact' | 'address' | 'personal' | 'multiple';

function getRequestedProfilePic(item: ProfileUpdateRequestItem) {
  const requestedPic = item.requestedData?.profilePic;
  return typeof requestedPic === 'string' && requestedPic.trim() ? requestedPic.trim() : item.requester.profilePic;
}

function getChangedKeys(requestedData: Record<string, unknown>) {
  return Object.keys(requestedData).filter(
    (key) => requestedData[key] !== null && requestedData[key] !== undefined && requestedData[key] !== '',
  );
}

function summarizeChanges(requestedData: Record<string, unknown>, t: ReturnType<typeof useTranslations>) {
  const keys = getChangedKeys(requestedData);
  if (!keys.length) return t('summary.none');
  const labels = keys.map((key) => t(`fields.${key}`));
  if (labels.length <= 3) return labels.join(', ');
  return `${labels.slice(0, 3).join(', ')} ${t('summary.more').replace('{count}', String(labels.length - 3))}`;
}

function formatDate(value: string | Date | null | undefined, t: ReturnType<typeof useTranslations>) {
  if (!value) return t('relative.recently');
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return t('relative.recently');
  const diffMs = Date.now() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return t('relative.justNow');
  if (diffHours < 24) return t('relative.hoursAgo').replace('{count}', String(diffHours));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTimeFilterLabel(filter: ProfileRequestTimeFilterKey, t: ReturnType<typeof useTranslations>) {
  switch (filter) {
    case 'today':
      return t('filters.time.today');
    case 'last7Days':
      return t('filters.time.last7Days');
    case 'thisMonth':
      return t('filters.time.thisMonth');
    case 'older':
      return t('filters.time.older');
    default:
      return t('filters.time.all');
  }
}

function getChangeFilterLabel(filter: ProfileRequestChangeFilterKey, t: ReturnType<typeof useTranslations>) {
  switch (filter) {
    case 'photo':
      return t('filters.change.photo');
    case 'contact':
      return t('filters.change.contact');
    case 'address':
      return t('filters.change.address');
    case 'personal':
      return t('filters.change.personal');
    case 'multiple':
      return t('filters.change.multiple');
    default:
      return t('filters.change.all');
  }
}

function RequestCard({ item, onReview }: { item: ProfileUpdateRequestItem; onReview: () => void }) {
  const t = useTranslations('admin.profile-requests');
  const changeCount = getChangedKeys(item.requestedData).length;
  const avatarUri = getRequestedProfilePic(item);

  return (
    <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center', marginBottom: spacing[3] }}>
      <View
        style={{
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.border.light,
          borderRadius: radius.xl,
          padding: spacing[4],
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: 1,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border.light,
              backgroundColor: colors.background.muted,
              flexShrink: 0,
            }}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted }}>
                <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
              </View>
            )}
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16, lineHeight: 20 }}
              numberOfLines={1}>
              {item.requester.name}
            </Text>
            {item.requester.memberId ? (
              <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                {t('requester.memberId').replace('{id}', item.requester.memberId)}
              </Text>
            ) : null}
            {item.requester.phone ? (
              <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                {item.requester.phone}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing[1] }}>
              <MaterialIcons name="calendar-today" size={12} color={colors.text.muted} />
              <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                {formatDate(item.createdAt, t)}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: spacing[2],
              paddingVertical: 4,
              backgroundColor: '#fffbeb',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#fde68a',
            }}>
            <Text
              style={{
                color: '#b45309',
                fontSize: 10,
                fontFamily: typography.fontFamily.bold,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
              {t('status.pending')}
            </Text>
          </View>
        </View>

        {changeCount > 0 ? (
          <View
            style={{
              marginTop: spacing[3],
              padding: spacing[3],
              backgroundColor: colors.primary.subtle,
              borderRadius: radius.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
            }}>
            <MaterialIcons name="edit" size={14} color={colors.primary.DEFAULT} />
            <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.medium, flex: 1 }}>
              {summarizeChanges(item.requestedData, t)}
            </Text>
          </View>
        ) : null}

        <View style={{ marginTop: spacing[3], paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: '#f5f5f4' }}>
          <Button
            variant="primary"
            fullWidth
            leftIcon={<MaterialIcons name="open-in-new" size={16} color="#ffffff" />}
            onPress={onReview}>
            {t('actions.review')}
          </Button>
        </View>
      </View>
    </View>
  );
}

function RequestCardSkeleton({ showButton = false }: { showButton?: boolean }) {
  return (
    <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center' }}>
      <View
        style={{
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.border.light,
          borderRadius: radius.xl,
          padding: spacing[4],
          minHeight: 156,
          gap: spacing[3],
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
          <SkeletonAvatar size={56} />
          <View style={{ flex: 1, gap: spacing[2] }}>
            <SkeletonBlock width="52%" height={16} radiusSize={radius.sm} />
            <SkeletonBlock width="32%" height={12} radiusSize={radius.sm} />
            <SkeletonBlock width="44%" height={12} radiusSize={radius.sm} />
            <SkeletonBlock width="38%" height={12} radiusSize={radius.sm} />
          </View>
          <SkeletonBlock width={64} height={24} radiusSize={8} />
        </View>
        <SkeletonBlock width="100%" height={44} radiusSize={radius.lg} />
        {showButton ? <SkeletonBlock width="100%" height={42} radiusSize={radius.full} /> : null}
      </View>
    </View>
  );
}

function RequestsHeaderSkeleton() {
  return (
    <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center', gap: spacing[4], marginBottom: spacing[4] }}>
      <View style={{ gap: spacing[3] }}>
        <SkeletonBlock width="28%" height={18} radiusSize={999} />
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} width={142} height={120} radiusSize={radius.xl} />
          ))}
        </View>
      </View>
      <View style={{ gap: spacing[3] }}>
        <SkeletonBlock width="38%" height={36} radiusSize={999} />
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <SkeletonBlock width={110} height={36} radiusSize={999} />
          <SkeletonBlock width={108} height={36} radiusSize={999} />
          <SkeletonBlock width={126} height={36} radiusSize={999} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonBlock width="32%" height={22} radiusSize={radius.sm} />
        <SkeletonBlock width={44} height={28} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function AdminProfileRequestsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.profile-requests');
  const [items, setItems] = useState<ProfileUpdateRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState<ProfileRequestTimeFilterKey>('all');
  const [activeChangeFilter, setActiveChangeFilter] = useState<ProfileRequestChangeFilterKey>('all');
  const [draftTimeFilter, setDraftTimeFilter] = useState<ProfileRequestTimeFilterKey>('all');
  const [draftChangeFilter, setDraftChangeFilter] = useState<ProfileRequestChangeFilterKey>('all');
  const [pagination, setPagination] = useState<{
    nextOffset: number;
    hasNextPage: boolean;
    totalCount: number;
  } | null>(null);
  const [summary, setSummary] = useState({
    pending: 0,
    last7Days: 0,
    photo: 0,
    multiple: 0,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const hasFocusedRef = useRef(false);
  const paginationRef = useRef<typeof pagination>(null);

  const loadRequests = useCallback(async (mode: 'reset' | 'append' = 'reset') => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    if (mode === 'append') {
      setIsLoadingMore(true);
    } else if (!hasLoadedRef.current) {
      setIsLoading(true);
    } else {
      setIsSearchLoading(true);
    }
    setError(null);
    try {
      const result = await profileService.loadActionableProfileUpdateRequestsPage({
        limit: PAGE_SIZE,
        offset: mode === 'append' ? paginationRef.current?.nextOffset ?? 0 : 0,
        search: debouncedSearch.trim(),
        period: activeTimeFilter,
        changeFilter: activeChangeFilter,
        status: 'PENDING',
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
      setError(loadError instanceof Error ? loadError.message : t('errors.loadTitle'));
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
      setIsSearchLoading(false);
      setIsLoadingMore(false);
      }
    }
  }, [activeChangeFilter, activeTimeFilter, debouncedSearch, t]);

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
      setActiveTimeFilter('all');
      setActiveChangeFilter('all');
      setDraftTimeFilter('all');
      setDraftChangeFilter('all');
      setFilterVisible(false);
      setPagination(null);
      paginationRef.current = null;
      setReloadToken((current) => current + 1);
    }, []),
  );

  useEffect(() => {
    void loadRequests('reset');
  }, [activeChangeFilter, activeTimeFilter, debouncedSearch, loadRequests, reloadToken]);

  const hasNextPage = Boolean(pagination?.hasNextPage);
  const appliedFilterCount = [activeTimeFilter, activeChangeFilter].filter((value) => value !== 'all').length;
  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeTimeFilter !== 'all') {
      filters.push({
        key: `time-${activeTimeFilter}`,
        label: getTimeFilterLabel(activeTimeFilter, t),
        onRemove: () => setActiveTimeFilter('all'),
      });
    }

    if (activeChangeFilter !== 'all') {
      filters.push({
        key: `change-${activeChangeFilter}`,
        label: getChangeFilterLabel(activeChangeFilter, t),
        onRemove: () => setActiveChangeFilter('all'),
      });
    }

    return filters;
  }, [activeChangeFilter, activeTimeFilter, t]);

  const openFilters = useCallback(() => {
    setDraftTimeFilter(activeTimeFilter);
    setDraftChangeFilter(activeChangeFilter);
    setFilterVisible(true);
  }, [activeChangeFilter, activeTimeFilter]);

  if (error && !isLoading && !items.length) {
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flex: 1 }}>
          <AppHeaderSearch
            title={t('title')}
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
          <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
            <ErrorState
              title={t('errors.loadTitle')}
              description={error}
              onRetry={() => {
                void loadRequests();
              }}
            />
          </View>
        </View>
      </AppSafeAreaView>
    );
  }

  const showInitialSkeleton = isLoading && !items.length;

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeaderSearch
          title={t('title')}
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
          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <ErrorState
              title={t('errors.loadTitle')}
              description={error}
              onRetry={() => {
                void loadRequests();
              }}
            />
          </View>
        ) : null}

        <InfiniteScrollList
          data={items}
          keyExtractor={(item) => item.id}
          loadingInitial={showInitialSkeleton}
          loadingSearch={isSearchLoading}
          loadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          hideLoadMoreText
          preserveHeaderOnInitialLoad
          skeletonCount={4}
          renderSkeletonItem={(index) => <RequestCardSkeleton key={index} showButton />}
          onLoadMore={() => {
            if (!hasNextPage || isLoadingMore) {
              return;
            }
            void loadRequests('append');
          }}
          emptyTitle={t('empty.pendingTitle')}
          emptyDescription={
            search.trim() || activeTimeFilter !== 'all' || activeChangeFilter !== 'all'
              ? t('empty.filteredDescription')
              : t('empty.defaultDescription')
          }
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 112, paddingHorizontal: spacing[4], flexGrow: 1 }}
          ListHeaderComponent={showInitialSkeleton ? (
            <RequestsHeaderSkeleton />
          ) : (
            <View style={{ width: '100%', maxWidth: 672, alignSelf: 'center', gap: spacing[4], marginBottom: spacing[4] }}>
              <AdminQuickInsightsSection
                title={t('insights.title')}
                periodLabel={t('insights.period')}
                items={[
                  {
                    id: 'pending',
                    label: t('insights.pending'),
                    value: String(summary.pending),
                    icon: 'manage-accounts',
                    iconColor: colors.primary.DEFAULT,
                    iconBackgroundColor: '#fef3c7',
                  },
                  {
                    id: 'recent',
                    label: t('insights.last7Days'),
                    value: String(summary.last7Days),
                    icon: 'schedule',
                    iconColor: colors.status.warning,
                    iconBackgroundColor: colors.status.warningLight,
                  },
                  {
                    id: 'photo',
                    label: t('insights.photo'),
                    value: String(summary.photo),
                    icon: 'photo-camera',
                    iconColor: colors.status.success,
                    iconBackgroundColor: colors.status.successLight,
                  },
                  {
                    id: 'multi',
                    label: t('insights.multiField'),
                    value: String(summary.multiple),
                    icon: 'edit-note',
                    iconColor: colors.text.primary,
                    iconBackgroundColor: '#f3f4f6',
                  },
                ]}
              />

              <FilterChips
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('filters.title')} (${appliedFilterCount})` : t('filters.title'),
                    icon: 'tune' as const,
                  },
                  { key: 'all', label: t('filters.all'), icon: 'view-list' as const },
                  { key: 'photo', label: t('filters.photo'), icon: 'photo-camera' as const },
                  { key: 'contact', label: t('filters.contact'), icon: 'call' as const },
                  { key: 'address', label: t('filters.address'), icon: 'place' as const },
                ]}
                activeKey={activeChangeFilter}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setActiveChangeFilter(key as ProfileRequestChangeFilterKey);
                }}
                scrollable
                showIcons
              />

              {appliedFilters.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
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

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                  {t('queue.title')}
                </Text>
                <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                  <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {String(pagination?.totalCount ?? items.length)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <RequestCard
              item={item}
              onReview={() =>
                router.push({
                  pathname: '/admin/profile-requests/[requestId]',
                  params: { requestId: item.id },
                } as never)
              }
            />
          )}
        />

        <FilterSheet
          visible={filterVisible}
          title={t('filters.title')}
          subtitle={t('filters.subtitle')}
          sections={[
            {
              title: t('filters.time.title'),
              icon: 'schedule',
              activeKey: draftTimeFilter,
              items: [
                { key: 'all', label: t('filters.time.all') },
                { key: 'today', label: t('filters.time.today') },
                { key: 'last7Days', label: t('filters.time.last7Days') },
                { key: 'thisMonth', label: t('filters.time.thisMonth') },
                { key: 'older', label: t('filters.time.older') },
              ],
              onSelect: (key) => setDraftTimeFilter(key as ProfileRequestTimeFilterKey),
            },
            {
              title: t('filters.change.title'),
              icon: 'edit-note',
              activeKey: draftChangeFilter,
              items: [
                { key: 'all', label: t('filters.change.all') },
                { key: 'photo', label: t('filters.change.photo') },
                { key: 'contact', label: t('filters.change.contact') },
                { key: 'address', label: t('filters.change.address') },
                { key: 'personal', label: t('filters.change.personal') },
                { key: 'multiple', label: t('filters.change.multiple') },
              ],
              onSelect: (key) => setDraftChangeFilter(key as ProfileRequestChangeFilterKey),
            },
          ]}
          onClose={() => {
            setDraftTimeFilter(activeTimeFilter);
            setDraftChangeFilter(activeChangeFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveTimeFilter(draftTimeFilter);
            setActiveChangeFilter(draftChangeFilter);
            setFilterVisible(false);
          }}
          onReset={() => {
            setDraftTimeFilter('all');
            setDraftChangeFilter('all');
          }}
          applyLabel={t('filters.apply')}
          resetLabel={t('filters.reset')}
        />
      </View>
    </AppSafeAreaView>
  );
}
