import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useFocusEffect } from '@react-navigation/native';

import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppHeader, CardGridSkeleton, FilterChips, FilterSheet, InfiniteScrollList, StatCardSkeleton, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { AdminQuickInsightsSection } from '@/src/features/admin/components/admin-quick-insights-section';
import { getPaginationTotal } from '@/src/utils/pagination';
import {
  analyticsService,
  emptyTenantTransactionsSummary,
  formatAnalyticsCurrency,
  type AnalyticsTransactionItem,
  type TenantAnalytics,
  type TenantTransactionsSummary,
} from '../services';

import {
  TransactionManagementSummaryCard,
  TransactionManagementRow,
} from './finance-blocks';

type TransactionTypeFilterKey = 'all' | 'donation' | 'event' | 'matrimony' | 'expense';
type TransactionStatusFilterKey = 'all' | 'completed' | 'pending' | 'failed';

function getTransactionTypeLabel(filter: TransactionTypeFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'donation':
      return t('filters.types.donation');
    case 'event':
      return t('filters.types.event');
    case 'matrimony':
      return t('filters.types.matrimony');
    case 'expense':
      return t('filters.types.expense');
    default:
      return t('filters.types.all');
  }
}

function getTransactionStatusLabel(filter: TransactionStatusFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'completed':
      return t('filters.status.completed');
    case 'pending':
      return t('filters.status.pending');
    case 'failed':
      return t('filters.status.failed');
    default:
      return t('filters.status.all');
  }
}

function transactionIcon(type: string, status: string) {
  if (status === 'FAILED') return 'error' as const;
  if (type === 'Event') return 'event' as const;
  if (type === 'Matrimony') return 'favorite' as const;
  if (type === 'Expense') return 'receipt-long' as const;
  return 'volunteer-activism' as const;
}

function transactionStatus(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === 'SUCCESS' || normalized === 'PAID' || normalized === 'APPROVED' || normalized === 'ACTIVE') return 'Completed' as const;
  if (normalized === 'FAILED' || normalized === 'CANCELLED' || normalized === 'REJECTED') return 'Failed' as const;
  return 'Pending' as const;
}

function TransactionManagementRowSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
        padding: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <SkeletonBlock width={40} height={40} radiusSize={radius.full} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="44%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="62%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: spacing[2] }}>
        <SkeletonBlock width={72} height={16} radiusSize={radius.sm} />
        <SkeletonBlock width={58} height={20} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function TransactionManagementContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.transaction-management');
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<TransactionTypeFilterKey>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<TransactionStatusFilterKey>('all');
  const [draftTypeFilter, setDraftTypeFilter] = useState<TransactionTypeFilterKey>('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState<TransactionStatusFilterKey>('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [transactionSummary, setTransactionSummary] = useState<TenantTransactionsSummary>(emptyTenantTransactionsSummary);
  const [transactions, setTransactions] = useState<AnalyticsTransactionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const loadAnalytics = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    setTransactions([]);
    setHasNextPage(false);
    setPage(1);
    setTotalCount(0);
    setTransactionSummary(emptyTenantTransactionsSummary);
    try {
      const [result, transactionPage] = await Promise.all([
        analyticsService.loadTenantAnalytics(),
        analyticsService.loadTenantTransactionsPage({
          page: 1,
          limit: 20,
          type: activeTypeFilter,
          status: activeStatusFilter,
        }),
      ]);
      if (requestId !== requestIdRef.current) {
        return;
      }
      setAnalytics(result);
      setTransactions(transactionPage.items);
      setHasNextPage(Boolean(transactionPage.pagination?.hasNextPage));
      setPage(transactionPage.pagination?.page ?? 1);
      setTotalCount(getPaginationTotal(transactionPage.pagination, transactionPage.summary.typeCounts.all || transactionPage.items.length));
      setTransactionSummary(transactionPage.summary);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(loadError instanceof Error ? loadError.message : 'Unable to load transactions.');
    } finally {
      if (requestId === requestIdRef.current) {
        hasLoadedRef.current = true;
        setIsLoading(false);
      }
    }
  }, [activeStatusFilter, activeTypeFilter]);

  useFocusEffect(
    useCallback(() => {
      void loadAnalytics();
    }, [loadAnalytics]),
  );

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }
    void loadAnalytics();
  }, [activeStatusFilter, activeTypeFilter, loadAnalytics]);

  const filteredTransactions = transactions;
  const appliedFilterCount = [activeTypeFilter, activeStatusFilter].filter((value) => value !== 'all').length;

  const quickInsightItems = useMemo(() => {
    const pendingCount = transactionSummary.statusCounts.pending;
    const failedCount = transactionSummary.statusCounts.failed;

    return [
      {
        id: 'income',
        label: t('insights.income'),
        value: formatAnalyticsCurrency(analytics?.transactions.totalIncome ?? 0),
        icon: 'trending-up' as const,
        iconColor: '#047857',
        iconBackgroundColor: '#ecfdf5',
      },
      {
        id: 'expense',
        label: t('insights.expense'),
        value: formatAnalyticsCurrency(analytics?.transactions.totalExpense ?? 0),
        icon: 'receipt-long' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle || 'rgba(24,168,117,0.08)',
      },
      {
        id: 'pending',
        label: t('insights.pending'),
        value: String(pendingCount),
        icon: 'schedule' as const,
        iconColor: '#b45309',
        iconBackgroundColor: '#fffbeb',
      },
      {
        id: 'failed',
        label: t('insights.failed'),
        value: String(failedCount),
        icon: 'cancel' as const,
        iconColor: '#b91c1c',
        iconBackgroundColor: '#fef2f2',
      },
    ];
  }, [analytics, t, transactionSummary.statusCounts.failed, transactionSummary.statusCounts.pending]);

  const transactionTypeCounts = useMemo(
    () => transactionSummary.typeCounts,
    [transactionSummary.typeCounts],
  );
  const filterItems = useMemo(() => [
    {
      key: 'filters',
      label: appliedFilterCount > 0 ? `${t('filters.title')} (${appliedFilterCount})` : t('filters.title'),
      icon: 'tune' as const,
    },
    { key: 'all', label: `${t('filters.types.all')} (${transactionTypeCounts.all})`, icon: 'list-alt' as const },
    { key: 'donation', label: `${t('filters.types.donation')} (${transactionTypeCounts.donation})`, icon: 'volunteer-activism' as const },
    { key: 'event', label: `${t('filters.types.event')} (${transactionTypeCounts.event})`, icon: 'event' as const },
    { key: 'matrimony', label: `${t('filters.types.matrimony')} (${transactionTypeCounts.matrimony})`, icon: 'favorite' as const },
    { key: 'expense', label: `${t('filters.types.expense')} (${transactionTypeCounts.expense})`, icon: 'receipt-long' as const },
  ], [appliedFilterCount, t, transactionTypeCounts]);
  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeTypeFilter !== 'all') {
      filters.push({
        key: `type-${activeTypeFilter}`,
        label: getTransactionTypeLabel(activeTypeFilter, t),
        onRemove: () => setActiveTypeFilter('all'),
      });
    }

    if (activeStatusFilter !== 'all') {
      filters.push({
        key: `status-${activeStatusFilter}`,
        label: getTransactionStatusLabel(activeStatusFilter, t),
        onRemove: () => setActiveStatusFilter('all'),
      });
    }

    return filters;
  }, [activeStatusFilter, activeTypeFilter, t]);

  const renderTransaction = ({ item }: { item: AnalyticsTransactionItem }) => (
    <TransactionManagementRow
      title={item.title}
      subtitle={item.subtitle || item.type}
      amount={formatAnalyticsCurrency(item.amount)}
      status={transactionStatus(item.status)}
      icon={transactionIcon(item.type, item.status)}
      muted={item.direction === 'expense'}
    />
  );

  const loadMoreTransactions = useCallback(async () => {
    if (isLoading || isRefreshing || isLoadingMore || !hasNextPage) {
      return;
    }
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoadingMore(true);
    try {
      const result = await analyticsService.loadTenantTransactionsPage({
        page: page + 1,
        limit: 20,
        type: activeTypeFilter,
        status: activeStatusFilter,
      });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setTransactions((current) => [...current, ...result.items]);
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setPage(result.pagination?.page ?? page + 1);
      setTotalCount(getPaginationTotal(result.pagination, result.summary.typeCounts.all || totalCount));
      setTransactionSummary(result.summary);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeStatusFilter, activeTypeFilter, hasNextPage, isLoading, isLoadingMore, isRefreshing, page, totalCount]);

  const listHeader = (
    <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
      <TransactionManagementSummaryCard
        title={analytics ? formatAnalyticsCurrency(analytics.transactions.netProfit) : t('summary.title')}
        subtitle={
          analytics
            ? t('summary.subtitle')
              .replace('{income}', formatAnalyticsCurrency(analytics.transactions.totalIncome))
              .replace('{expense}', formatAnalyticsCurrency(analytics.transactions.totalExpense))
            : t('summary.fallbackSubtitle')
        }
        badge={analytics?.filters.financialYear || 'Admin'}
      />

      <AdminQuickInsightsSection
        title={t('queue.title')}
        periodLabel={analytics?.filters.financialYear || t('queue.periodLabel')}
        items={quickInsightItems}
      />

      <View style={{ gap: spacing[3], paddingTop: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('filters.title')}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => {
              setActiveTypeFilter('all');
              setActiveStatusFilter('all');
            }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold, fontSize: 13 }}>
              {t('filters.clearAll')}
            </Text>
          </TouchableOpacity>
        </View>
        <FilterChips
          scrollable
          showIcons
          showChevron
          activeKey={activeTypeFilter}
          items={filterItems}
          onPress={(key) => {
            if (key === 'filters') {
              setDraftTypeFilter(activeTypeFilter);
              setDraftStatusFilter(activeStatusFilter);
              setFilterVisible(true);
              return;
            }
            setActiveTypeFilter(key as TransactionTypeFilterKey);
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

      <View style={{ gap: spacing[1], paddingTop: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('list.title')}
          </Text>
          <MaterialIcons name="payments" size={20} color={colors.text.muted} />
        </View>
        <Text style={{ color: colors.text.muted, fontSize: 12 }}>
          {t('list.entries').replace('{count}', String(totalCount))}
        </Text>
      </View>
    </View>
  );
  const loadingHeader = (
    <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
      <StatCardSkeleton />
      <CardGridSkeleton columns={2} cards={4} cardMinHeight={112} />
      <View style={{ gap: spacing[3], paddingTop: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('filters.title')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          {Array.from({ length: 5 }, (_, index) => (
            <View
              key={index}
              style={{
                minWidth: index === 0 ? 112 : 84,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              }}>
              <SkeletonBlock width={index === 0 ? 72 : 48} height={12} radiusSize={radius.sm} />
            </View>
          ))}
        </View>
      </View>
      <View style={{ gap: spacing[1], paddingTop: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('list.title')}
          </Text>
          <MaterialIcons name="payments" size={20} color={colors.text.muted} />
        </View>
      </View>
    </View>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          onLeftPress={navigateBack}
        />

        {error && !analytics ? (
          <View style={{ margin: spacing[4], borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.light, padding: spacing[4] }}>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{error}</Text>
          </View>
        ) : (
          <>
            <InfiniteScrollList
              data={filteredTransactions}
              loadingInitial={isLoading && !analytics}
              loadingMore={isLoadingMore}
              refreshing={isRefreshing}
              hasNextPage={hasNextPage}
              onRefresh={() => {
                const requestId = requestIdRef.current + 1;
                requestIdRef.current = requestId;
                setIsRefreshing(true);
                Promise.all([
                  analyticsService.loadTenantAnalytics(),
                  analyticsService.loadTenantTransactionsPage({
                    page: 1,
                    limit: 20,
                    type: activeTypeFilter,
                    status: activeStatusFilter,
                  }),
                ]).then(([analyticsResult, transactionPage]) => {
                  if (requestId !== requestIdRef.current) {
                    return;
                  }
                  setAnalytics(analyticsResult);
                  setTransactions(transactionPage.items);
                  setHasNextPage(Boolean(transactionPage.pagination?.hasNextPage));
                  setPage(transactionPage.pagination?.page ?? 1);
                  setTotalCount(getPaginationTotal(transactionPage.pagination, transactionPage.summary.typeCounts.all || transactionPage.items.length));
                  setTransactionSummary(transactionPage.summary);
                }).finally(() => {
                  if (requestId === requestIdRef.current) {
                    setIsRefreshing(false);
                  }
                });
              }}
              onLoadMore={() => {
                void loadMoreTransactions();
              }}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              renderItem={renderTransaction}
              renderSkeletonItem={() => <TransactionManagementRowSkeleton />}
              emptyTitle={t('empty.title')}
              emptyDescription={t('empty.description')}
              contentContainerStyle={{ paddingTop: spacing[4], paddingHorizontal: spacing[4], paddingBottom: 120 }}
              preserveHeaderOnInitialLoad
              ListHeaderComponent={isLoading && !analytics ? loadingHeader : listHeader}
            />
            <FilterSheet
              visible={filterVisible}
              title={t('sheet.title')}
              subtitle={t('sheet.subtitle')}
              sections={[
                {
                  title: t('sheet.sections.type'),
                  icon: 'payments',
                  activeKey: draftTypeFilter,
                  items: [
                    { key: 'all', label: t('filters.types.all') },
                    { key: 'donation', label: t('filters.types.donation') },
                    { key: 'event', label: t('filters.types.event') },
                    { key: 'matrimony', label: t('filters.types.matrimony') },
                    { key: 'expense', label: t('filters.types.expense') },
                  ],
                  onSelect: (key) => setDraftTypeFilter(key as TransactionTypeFilterKey),
                },
                {
                  title: t('sheet.sections.status'),
                  icon: 'verified',
                  activeKey: draftStatusFilter,
                  items: [
                    { key: 'all', label: t('filters.status.all') },
                    { key: 'completed', label: t('filters.status.completed') },
                    { key: 'pending', label: t('filters.status.pending') },
                    { key: 'failed', label: t('filters.status.failed') },
                  ],
                  onSelect: (key) => setDraftStatusFilter(key as TransactionStatusFilterKey),
                },
              ]}
              onClose={() => {
                setDraftTypeFilter(activeTypeFilter);
                setDraftStatusFilter(activeStatusFilter);
                setFilterVisible(false);
              }}
              onApply={() => {
                setActiveTypeFilter(draftTypeFilter);
                setActiveStatusFilter(draftStatusFilter);
                setFilterVisible(false);
              }}
              onReset={() => {
                setDraftTypeFilter('all');
                setDraftStatusFilter('all');
              }}
              applyLabel={t('sheet.apply')}
              resetLabel={t('sheet.reset')}
            />
          </>
        )}
      </View>
    </AppSafeAreaView>
  );
}
