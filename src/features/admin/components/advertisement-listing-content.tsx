import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeaderSearch, AppSafeAreaView, FilterChips, FilterSheet, InfiniteScrollList, Text } from '@/src/components';
import { Dialog, type DialogVariant } from '@/src/components/feedback/Dialog/Dialog';
import { showConfirmationDialog } from '@/src/components/feedback/Dialog/dialog-service';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { SkeletonCard } from '@/src/components/ui/skeleton';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';

import { AdminQuickInsightsSection } from './admin-quick-insights-section';
import { AdminAdvertisementRow } from './admin-advertisement-row';
import { promotionService, toPromotionFormValues, type PromotionRecord } from '../services/promotion-service';

function canActivateAdvertisement(record: { startAt?: string | null; endAt?: string | null } | null | undefined) {
  return Boolean(record?.startAt && record?.endAt);
}

const PAGE_SIZE = 100;

type StatusFilter = 'all' | 'ACTIVE' | 'DRAFT' | 'EXPIRED' | 'INACTIVE' | 'SCHEDULED';
type ContentFilter = 'all' | 'TEXT' | 'IMAGE' | 'VIDEO';
type PricingFilter = 'all' | 'FREE' | 'PAID';
type PopupState = {
  visible: boolean;
  variant: Exclude<DialogVariant, 'confirm'>;
  title: string;
  description?: string;
};

function formatDate(value?: string | null) {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function humanizeEnum(value?: string | null) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Not set';
}

function formatCurrency(value?: number | null) {
  return `Rs ${Math.round(Number(value || 0)).toLocaleString('en-IN')}`;
}

function getAdvertisementRowStatus(status?: string | null): 'Active' | 'Draft' | 'Expired' | 'Paused' | 'Scheduled' {
  switch (String(status || '').toUpperCase()) {
    case 'ACTIVE':
      return 'Active';
    case 'EXPIRED':
      return 'Expired';
    case 'INACTIVE':
      return 'Paused';
    case 'SCHEDULED':
      return 'Scheduled';
    default:
      return 'Draft';
  }
}

export function AdvertisementListingContent() {
  const t = useTranslations('admin.advertisements');
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const [items, setItems] = useState<PromotionRecord[]>([]);
  const [search, setSearch] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState<StatusFilter>('all');
  const [draftContentFilter, setDraftContentFilter] = useState<ContentFilter>('all');
  const [draftPricingFilter, setDraftPricingFilter] = useState<PricingFilter>('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  function showPopup(variant: Exclude<DialogVariant, 'confirm'>, title: string, description?: string) {
    setPopup({ visible: true, variant, title, description });
  }

  const loadAdvertisementPage = useCallback(async ({
    page = 1,
    append = false,
    showLoading = true,
  }: {
    page?: number;
    append?: boolean;
    showLoading?: boolean;
  } = {}) => {
    if (append) {
      setIsLoadingMore(true);
    } else if (showLoading) {
      setIsLoading(true);
    }

    setLoadError(null);

    try {
      const result = await promotionService.loadPromotionsPage({
        page,
        limit: PAGE_SIZE,
        search,
        status: statusFilter,
        contentType: contentFilter,
        pricingType: pricingFilter,
      });
      setItems((previous) => {
        if (!append) {
          return result.items;
        }
        const existingIds = new Set(previous.map((item) => item.id));
        return [...previous, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setCurrentPage(result.pagination?.page ?? page);
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setTotalCount(getPaginationTotal(result.pagination, append ? (page - 1) * PAGE_SIZE + result.items.length : result.items.length));
    } catch (error) {
      if (!append) {
        setTotalCount(0);
      }
      setLoadError(error instanceof Error ? error.message : 'Unable to load advertisements.');
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [contentFilter, pricingFilter, search, statusFilter]);

  useFocusEffect(
    useCallback(() => {
      void loadAdvertisementPage({ page: 1, showLoading: false });
      return undefined;
    }, [loadAdvertisementPage]),
  );

  const filteredItems = items;

  const appliedFilterCount = [statusFilter, contentFilter, pricingFilter].filter((value) => value !== 'all').length;
  const statusCounts = useMemo(
    () => ({
      all: totalCount,
      ACTIVE: items.filter((item) => String(item.status || '').toUpperCase() === 'ACTIVE').length,
      DRAFT: items.filter((item) => String(item.status || '').toUpperCase() === 'DRAFT').length,
      EXPIRED: items.filter((item) => String(item.status || '').toUpperCase() === 'EXPIRED').length,
      INACTIVE: items.filter((item) => String(item.status || '').toUpperCase() === 'INACTIVE').length,
      SCHEDULED: items.filter((item) => String(item.status || '').toUpperCase() === 'SCHEDULED').length,
    }),
    [items, totalCount],
  );

  const appliedFilters = useMemo(() => {
    const next = [];

    if (statusFilter !== 'all') {
      next.push({
        key: 'status',
        label: statusFilter === 'ACTIVE' ? t('listing.status.active') : statusFilter === 'DRAFT' ? t('listing.status.draft') : statusFilter === 'EXPIRED' ? t('listing.status.expired') : statusFilter === 'SCHEDULED' ? t('listing.status.scheduled') : t('listing.status.paused'),
        onRemove: () => setStatusFilter('all'),
      });
    }

    if (contentFilter !== 'all') {
      next.push({
        key: 'content',
        label: contentFilter === 'TEXT' ? t('listing.type.text') : contentFilter === 'IMAGE' ? t('listing.type.image') : t('listing.type.video'),
        onRemove: () => setContentFilter('all'),
      });
    }

    if (pricingFilter !== 'all') {
      next.push({
        key: 'pricing',
        label: pricingFilter === 'PAID' ? t('listing.pricing.paid') : t('listing.pricing.free'),
        onRemove: () => setPricingFilter('all'),
      });
    }

    return next;
  }, [contentFilter, pricingFilter, statusFilter, t]);

  function openFilters() {
    setDraftStatusFilter(statusFilter);
    setDraftContentFilter(contentFilter);
    setDraftPricingFilter(pricingFilter);
    setFilterVisible(true);
  }

  async function handleDeleteAdvertisement(advertisementId: string) {
    const confirmed = await showConfirmationDialog({
      title: t('messages.deleteTitle'),
      description: t('messages.deleteBody'),
      confirmLabel: t('actions.delete'),
      cancelLabel: t('actions.cancel'),
    });

    if (!confirmed) {
      return;
    }

    try {
      await promotionService.deletePromotion(advertisementId);
      await loadAdvertisementPage({ page: 1, showLoading: false });
    } catch (error) {
      showPopup('error', t('listing.deleteErrorTitle'), error instanceof Error ? error.message : t('messages.deleteError'));
    }
  }

  async function handleTogglePublish(advertisementId: string, nextStatus: 'ACTIVE' | 'DRAFT' | 'INACTIVE') {
    try {
      const existingAdvertisement = await promotionService.loadPromotion(advertisementId);
      if (nextStatus === 'ACTIVE' && !canActivateAdvertisement(existingAdvertisement)) {
        showPopup('error', t('listing.updateErrorTitle'), t('form.helpers.activeStatusDates'));
        return;
      }
      await promotionService.updatePromotion(advertisementId, {
        ...toPromotionFormValues(existingAdvertisement),
        status: nextStatus,
      });
      await loadAdvertisementPage({ page: 1, showLoading: false });
    } catch (error) {
      showPopup('error', t('listing.updateErrorTitle'), error instanceof Error ? error.message : t('listing.updateErrorBody'));
    }
  }

  const quickInsightItems = useMemo(
    () => [
      {
        id: 'total',
        label: t('listing.total'),
        value: formatCompactNumber(totalCount),
        caption: t('listing.totalCaption'),
        icon: 'campaign' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle,
      },
      {
        id: 'active',
        label: t('listing.activeCount'),
        value: formatCompactNumber(items.filter((item) => String(item.status || '').toUpperCase() === 'ACTIVE').length),
        caption: t('listing.activeCaption'),
        icon: 'schedule' as const,
        iconColor: colors.status.info,
        iconBackgroundColor: colors.status.infoLight,
      },
      {
        id: 'drafts',
        label: t('listing.draftCount'),
        value: formatCompactNumber(items.filter((item) => String(item.status || '').toUpperCase() === 'DRAFT').length),
        caption: t('listing.draftCaption'),
        icon: 'edit-note' as const,
        iconColor: colors.status.warning,
        iconBackgroundColor: colors.status.warningLight,
      },
    ],
    [items, t, totalCount],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <AppHeaderSearch
          title={t('title')}
          placeholder={t('search.placeholder')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchActive}
          onSearchPress={() => setSearchActive(true)}
          onCloseSearch={() => {
            setSearch('');
            setSearchActive(false);
          }}
          onBackPress={navigateBack}
        />

        <InfiniteScrollList
          data={filteredItems}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          errorMessage={loadError}
          onRetry={() => {
            void loadAdvertisementPage();
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) {
              return;
            }
            void loadAdvertisementPage({ page: currentPage + 1, append: true, showLoading: false });
          }}
          preserveHeaderOnInitialLoad
          keyExtractor={(item) => item.id}
          renderSkeletonItem={() => (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <SkeletonCard showAvatar lines={2} footer />
            </View>
          )}
          renderItem={({ item }) => (
            <AdminAdvertisementRow
              id={item.id}
              title={item.title}
              status={getAdvertisementRowStatus(item.status)}
              statusLabel={
                String(item.status || '').toUpperCase() === 'ACTIVE'
                  ? t('listing.status.active')
                  : String(item.status || '').toUpperCase() === 'EXPIRED'
                    ? t('listing.status.expired')
                    : String(item.status || '').toUpperCase() === 'INACTIVE'
                      ? t('listing.status.paused')
                      : String(item.status || '').toUpperCase() === 'SCHEDULED'
                        ? t('listing.status.scheduled')
                        : t('listing.status.draft')
              }
              category={humanizeEnum(item.category)}
              schedule={[formatDate(item.startAt), formatDate(item.endAt)].filter(Boolean).join(' - ') || t('listing.notScheduled')}
              pricing={String(item.pricingType || '').toUpperCase() === 'PAID' ? formatCurrency(item.amount) : t('listing.freeAdvertisement')}
              contentType={(String(item.contentType || '').toUpperCase() === 'VIDEO' ? 'smart-display' : String(item.contentType || '').toUpperCase() === 'IMAGE' ? 'image' : 'article') as React.ComponentProps<typeof MaterialIcons>['name']}
              impressions={Number(item.impressionCount || 0)}
              clicks={Number(item.clickCount || 0)}
              amount={item.amount}
              onAnalyticsPress={(advertisementId) => router.push(`/admin/advertisements/${encodeURIComponent(advertisementId)}` as never)}
              onEditPress={(advertisementId) => router.push(`/admin/advertisements/edit/${encodeURIComponent(advertisementId)}` as never)}
              onDeletePress={handleDeleteAdvertisement}
              onTogglePublishPress={(advertisementId, nextStatus) => {
                void handleTogglePublish(advertisementId, nextStatus);
              }}
            />
          )}
          emptyTitle={t('listing.emptyTitle')}
          emptyDescription={t('listing.emptyDescription')}
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 104 }}
          ListHeaderComponent={
            <View style={{ gap: spacing[3], marginBottom: spacing[4], maxWidth: 672, width: '100%', alignSelf: 'center' }}>
              <AdminQuickInsightsSection
                title={t('listing.quickInsightsTitle')}
                periodLabel={t('listing.quickInsightsPeriod')}
                actionLabel={t('listing.quickInsightsAction')}
                onActionPress={() => router.push('/admin/advertisement-analytics' as never)}
                compactAction
                items={quickInsightItems}
              />

              <FilterChips
                scrollable
                showIcons
                activeKey={statusFilter}
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? t('listing.filterCount').replace('{count}', String(appliedFilterCount)) : t('filters.filters'),
                    icon: 'tune',
                  },
                  { key: 'all', label: `${t('listing.status.all')} (${statusCounts.all})`, icon: 'apps' },
                  { key: 'ACTIVE', label: `${t('listing.status.active')} (${statusCounts.ACTIVE})`, icon: 'campaign' },
                  { key: 'DRAFT', label: `${t('listing.status.draft')} (${statusCounts.DRAFT})`, icon: 'edit-note' },
                  { key: 'EXPIRED', label: `${t('listing.status.expired')} (${statusCounts.EXPIRED})`, icon: 'history' },
                  { key: 'INACTIVE', label: `${t('listing.status.paused')} (${statusCounts.INACTIVE})`, icon: 'pause-circle' },
                  { key: 'SCHEDULED', label: `${t('listing.status.scheduled')} (${statusCounts.SCHEDULED})`, icon: 'schedule-send' },
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setStatusFilter(key as StatusFilter);
                }}
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
            </View>
          }
        />

        <View pointerEvents="box-none" style={{ position: 'absolute', right: spacing[4], bottom: spacing[4] }}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.9}
            onPress={() => router.push('/admin/advertisements/create' as never)}
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: 0.25,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}>
            <MaterialIcons name="add" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>

        <FilterSheet
          visible={filterVisible}
          title={t('listing.filterDialogTitle')}
          subtitle={t('listing.filterDialogSubtitle')}
          sections={[
            {
              title: t('listing.section.status'),
              icon: 'campaign',
              activeKey: draftStatusFilter,
              items: [
                { key: 'all', label: t('listing.status.all') },
                { key: 'ACTIVE', label: `${t('listing.status.active')} (${statusCounts.ACTIVE})` },
                { key: 'DRAFT', label: `${t('listing.status.draft')} (${statusCounts.DRAFT})` },
                { key: 'EXPIRED', label: `${t('listing.status.expired')} (${statusCounts.EXPIRED})` },
                { key: 'INACTIVE', label: `${t('listing.status.paused')} (${statusCounts.INACTIVE})` },
                { key: 'SCHEDULED', label: `${t('listing.status.scheduled')} (${statusCounts.SCHEDULED})` },
              ],
              onSelect: (key) => setDraftStatusFilter(key as StatusFilter),
            },
            {
              title: t('listing.section.contentType'),
              icon: 'category',
              activeKey: draftContentFilter,
              items: [
                { key: 'all', label: t('listing.type.all') },
                { key: 'TEXT', label: t('listing.type.text') },
                { key: 'IMAGE', label: t('listing.type.image') },
                { key: 'VIDEO', label: t('listing.type.video') },
              ],
              onSelect: (key) => setDraftContentFilter(key as ContentFilter),
            },
            {
              title: t('listing.section.pricing'),
              icon: 'payments',
              activeKey: draftPricingFilter,
              items: [
                { key: 'all', label: t('listing.pricing.all') },
                { key: 'FREE', label: t('listing.pricing.free') },
                { key: 'PAID', label: t('listing.pricing.paid') },
              ],
              onSelect: (key) => setDraftPricingFilter(key as PricingFilter),
            },
          ]}
          onClose={() => {
            setDraftStatusFilter(statusFilter);
            setDraftContentFilter(contentFilter);
            setDraftPricingFilter(pricingFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setStatusFilter(draftStatusFilter);
            setContentFilter(draftContentFilter);
            setPricingFilter(draftPricingFilter);
            setFilterVisible(false);
          }}
          onReset={() => {
            setDraftStatusFilter('all');
            setDraftContentFilter('all');
            setDraftPricingFilter('all');
          }}
          applyLabel={t('listing.applyFilters')}
          resetLabel={t('listing.resetFilters')}
        />
        <Dialog
          visible={Boolean(popup?.visible)}
          variant={popup?.variant || 'info'}
          title={popup?.title || ''}
          description={popup?.description}
          confirmLabel={t('actions.ok')}
          onConfirm={() => setPopup(null)}
        />
      </View>
    </AppSafeAreaView>
  );
}
