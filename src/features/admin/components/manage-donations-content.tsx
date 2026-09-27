import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';

import { AppHeaderSearch, Dialog, ErrorState, FilterChips, FilterSheet, InfiniteScrollList, MotionView, Text } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { donationService } from '@/src/features/finance/services/donation-service';
import { isPdfDownloadCancelledError } from '@/src/services/files/pdf-file';
import { getPaginationTotal } from '@/src/utils/pagination';
import { AdminDonationCard } from './admin-donation-card';

type DonationStatusFilterKey = 'all' | 'paid' | 'pending' | 'cancelled';
type DonationPaymentFilterKey = 'all' | 'cash' | 'transfer' | 'cheque';
const PAGE_SIZE = 12;
const emptyDonationSummary = {
  statusCounts: {
    all: 0,
    paid: 0,
    pending: 0,
    cancelled: 0,
  },
  totalAmount: 0,
};

function DonationCardSkeleton() {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start' }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.lg,
            backgroundColor: colors.primary.muted,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
          }}
        />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
            <SkeletonBlock width="34%" height={18} radiusSize={radius.sm} />
            <SkeletonBlock width={62} height={22} radiusSize={radius.full} />
          </View>
          <SkeletonBlock width="72%" height={13} radiusSize={radius.sm} />
          <SkeletonBlock width="58%" height={12} radiusSize={radius.sm} />
        </View>
        <SkeletonBlock width={38} height={38} radiusSize={radius.full} />
      </View>
      <View style={{ gap: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <SkeletonBlock width={14} height={14} radiusSize={radius.sm} />
          <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <SkeletonBlock width={14} height={14} radiusSize={radius.sm} />
          <SkeletonBlock width="28%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
    </View>
  );
}

function getDonationStatusLabel(filter: DonationStatusFilterKey, t: ReturnType<typeof useTranslations>) {
  switch (filter) {
    case 'paid':
      return t('filters.paid');
    case 'pending':
      return t('filters.pending');
    case 'cancelled':
      return t('filters.cancelled');
    default:
      return t('filters.allStatuses');
  }
}

function getDonationPaymentLabel(filter: DonationPaymentFilterKey, t: ReturnType<typeof useTranslations>) {
  switch (filter) {
    case 'cash':
      return t('filters.cash');
    case 'transfer':
      return t('filters.transfer');
    case 'cheque':
      return t('filters.cheque');
    default:
      return t('filters.allPayments');
  }
}

export function ManageDonationsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.manage-donations');
  const [items, setItems] = useState<Awaited<ReturnType<typeof donationService.loadDonationRecordsForScope>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState(emptyDonationSummary);
  const [search, setSearch] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<DonationStatusFilterKey>('all');
  const [activePaymentFilter, setActivePaymentFilter] = useState<DonationPaymentFilterKey>('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState<DonationStatusFilterKey>('all');
  const [draftPaymentFilter, setDraftPaymentFilter] = useState<DonationPaymentFilterKey>('all');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [receiptDialog, setReceiptDialog] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    title: string;
    description: string;
  }>({
    visible: false,
    variant: 'success',
    title: '',
    description: '',
  });
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [minimumDonationAmount, setMinimumDonationAmount] = useState('1');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const hasFocusedOnceRef = useRef(false);
  const requestIdRef = useRef(0);
  const showHeaderSkeleton = isLoading && !items.length;

  const loadDonationPage = useCallback(async ({
    page,
    append = false,
    refresh = false,
  }: {
    page: number;
    append?: boolean;
    refresh?: boolean;
  }) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    const requestId = ++requestIdRef.current;
    if (!append) {
      setItems([]);
      setHasNextPage(false);
      setCurrentPage(1);
      setTotalCount(0);
      setSummary(emptyDonationSummary);
    }

    try {
      const response = await donationService.loadDonationRecordsPage({
        mine: false,
        page,
        limit: PAGE_SIZE,
        search,
        status: activeStatusFilter === 'all' ? undefined : activeStatusFilter.toUpperCase(),
        paymentMode: activePaymentFilter,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setItems((previous) => (append ? [...previous, ...response.items] : response.items));
      setHasNextPage(Boolean(response.pagination?.hasNextPage));
      setCurrentPage(response.pagination?.page ?? page);
      setTotalCount(getPaginationTotal(response.pagination, append ? (page - 1) * PAGE_SIZE + response.items.length : response.items.length));
      setSummary(response.summary);
      setErrorMessage(undefined);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (!append) {
        setItems([]);
        setTotalCount(0);
        setSummary(emptyDonationSummary);
      }
      setErrorMessage(error instanceof Error ? error.message : t('error.loadFailed'));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    }
  }, [activePaymentFilter, activeStatusFilter, search, t]);

  useFocusEffect(
    useCallback(() => {
      setSearchInHeader(false);
      setFabMenuOpen(false);
      setFilterVisible(false);
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return undefined;
      }
      if (donationService.consumeDonationRecordsChanged()) {
        void loadDonationPage({ page: 1, refresh: true });
      }
      return undefined;
    }, [loadDonationPage]),
  );

  useEffect(() => {
    let active = true;
    donationService.loadDonationSettings()
      .then((settings) => {
        if (active) {
          setMinimumDonationAmount(String(settings.minimumDonationAmount));
        }
      })
      .catch(() => {
        if (active) {
          setSettingsMessage('Unable to load contribution settings.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSaveDonationSettings() {
    const amount = Number(minimumDonationAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setSettingsMessage('Minimum contribution must be greater than 0.');
      return;
    }

    setIsSavingSettings(true);
    setSettingsMessage(null);
    try {
      const settings = await donationService.updateDonationSettings({ minimumDonationAmount: amount });
      setMinimumDonationAmount(String(settings.minimumDonationAmount));
      setSettingsMessage('Contribution settings saved.');
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : 'Unable to save contribution settings.');
    } finally {
      setIsSavingSettings(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDonationPage({ page: 1 });
    }, search.trim() ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadDonationPage, search]);

  const filteredRecords = items;
  const statusCounts = summary.statusCounts;
  const donationFilters = [
    { key: 'all' as const, label: `${t('filters.all')} (${statusCounts.all})`, icon: 'view-list' as const },
    { key: 'paid' as const, label: `${t('filters.paid')} (${statusCounts.paid})`, icon: 'verified' as const },
    { key: 'pending' as const, label: `${t('filters.pending')} (${statusCounts.pending})`, icon: 'schedule' as const },
    { key: 'cancelled' as const, label: `${t('filters.cancelled')} (${statusCounts.cancelled})`, icon: 'cancel' as const },
  ] as const;

  const totalAmount = summary.totalAmount;
  const appliedFilterCount = [activeStatusFilter, activePaymentFilter].filter((value) => value !== 'all').length;
  const emptyTitle =
    activeStatusFilter === 'all' && activePaymentFilter === 'all'
      ? t('empty.all.title')
      : t('empty.filtered.title');
  const emptyDescription =
    search.trim() || activeStatusFilter !== 'all' || activePaymentFilter !== 'all'
      ? t('empty.filtered.description')
      : t('empty.all.description');
  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeStatusFilter !== 'all') {
      filters.push({
        key: `status-${activeStatusFilter}`,
        label: getDonationStatusLabel(activeStatusFilter, t),
        onRemove: () => setActiveStatusFilter('all'),
      });
    }

    if (activePaymentFilter !== 'all') {
      filters.push({
        key: `payment-${activePaymentFilter}`,
        label: getDonationPaymentLabel(activePaymentFilter, t),
        onRemove: () => setActivePaymentFilter('all'),
      });
    }

    return filters;
  }, [activePaymentFilter, activeStatusFilter, t]);

  const openFilters = useCallback(() => {
    setDraftStatusFilter(activeStatusFilter);
    setDraftPaymentFilter(activePaymentFilter);
    setFilterVisible(true);
  }, [activePaymentFilter, activeStatusFilter]);

  const handleDownloadSlip = useCallback(async (record: (typeof items)[number]) => {
    setDownloadingId(record.id);
    try {
      const result = await donationService.generateReceiptAndShare(record);
      if (result?.method === 'saf') {
        setReceiptDialog({
          visible: true,
          variant: 'success',
          title: t('receipt.successTitle'),
          description: t('receipt.successDescription'),
        });
      }
    } catch (error) {
      if (isPdfDownloadCancelledError(error)) {
        return;
      }
      const message = error instanceof Error ? error.message : t('receipt.errorDescription');
      setReceiptDialog({
        visible: true,
        variant: 'error',
        title: t('receipt.errorTitle'),
        description: message,
      });
    } finally {
      setDownloadingId(null);
    }
  }, [t]);

  const handleViewSlip = useCallback(async (record: (typeof items)[number]) => {
    setViewingId(record.id);
    try {
      const receipt = await donationService.generateReceiptAndOpen(record);
      if (receipt.fileUri) {
        router.push({
          pathname: '/pdf-viewer',
          params: {
            title: receipt.title,
            fileUri: receipt.fileUri,
          },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('receipt.errorDescription');
      setReceiptDialog({
        visible: true,
        variant: 'error',
        title: t('receipt.errorTitle'),
        description: message,
      });
    } finally {
      setViewingId(null);
    }
  }, [router, t]);

  if (errorMessage && !isLoading && !items.length) {
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
          <View style={{ flex: 1, padding: spacing[4], justifyContent: 'center' }}>
            <ErrorState
              title={t('error.loadFailed')}
              description={errorMessage}
              onRetry={() => {
                void loadDonationPage({ page: 1 });
              }}
            />
          </View>
        </View>
      </AppSafeAreaView>
    );
  }

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

        {errorMessage ? (
          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <ErrorState
              title={t('error.loadFailed')}
              description={errorMessage}
              onRetry={() => {
                void loadDonationPage({ page: 1 });
              }}
            />
          </View>
        ) : null}

        <InfiniteScrollList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading && !items.length}
          loadingSearch={isLoading && items.length > 0 && !isRefreshing && !isLoadingMore}
          loadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onLoadMore={() => {
            if (isLoading || isRefreshing || isLoadingMore || !hasNextPage) {
              return;
            }
            void loadDonationPage({ page: currentPage + 1, append: true });
          }}
          refreshing={isRefreshing}
          onRefresh={() => {
            void loadDonationPage({ page: 1, refresh: true });
          }}
          preserveHeaderOnInitialLoad
          renderSkeletonItem={() => <DonationCardSkeleton />}
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 132, paddingHorizontal: spacing[4] }}
          ListHeaderComponent={(
            <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
              {/* Offline and online quick-entry blocks moved to the FAB speed dial. */}

              <View
                style={{
                  borderRadius: radius.xl,
                  padding: spacing[5],
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                }}>
                <Text
                  variant="caption"
                  color={colors.primary.DEFAULT}
                  style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {t('title')}
                </Text>
                {showHeaderSkeleton ? (
                  <View style={{ gap: spacing[2] }}>
                    <SkeletonBlock width="36%" height={34} radiusSize={radius.md} />
                    <SkeletonBlock width="58%" height={14} radiusSize={radius.sm} />
                  </View>
                ) : (
                  <>
                    <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </Text>
                    <Text variant="body" color="#64748b">
                      {totalCount === 1
                        ? t('summary.singleRecord').replace('{count}', String(totalCount))
                        : t('summary.multipleRecords').replace('{count}', String(totalCount))}
                    </Text>
                  </>
                )}
              </View>

              <View
                style={{
                  borderRadius: radius.xl,
                  padding: spacing[4],
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  gap: spacing[3],
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <MaterialIcons name="settings" size={20} color={colors.primary.DEFAULT} />
                  <Text style={{ fontFamily: typography.fontFamily.semibold }}>
                    Minimum contribution
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <TextInput
                    accessibilityLabel="Minimum contribution amount"
                    value={minimumDonationAmount}
                    onChangeText={(value) => {
                      setMinimumDonationAmount(value.replace(/[^\d.]/g, ''));
                      setSettingsMessage(null);
                    }}
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      minHeight: 44,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      backgroundColor: '#ffffff',
                      paddingHorizontal: spacing[3],
                      color: colors.text.primary,
                      fontFamily: typography.fontFamily.medium,
                    }}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Save minimum contribution"
                    activeOpacity={0.85}
                    disabled={isSavingSettings}
                    onPress={handleSaveDonationSettings}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.full,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSavingSettings ? colors.primary.muted : colors.primary.DEFAULT,
                    }}>
                    <MaterialIcons name="save" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
                {settingsMessage ? (
                  <Text variant="caption" color={settingsMessage.includes('saved') ? colors.status.success : colors.status.error}>
                    {settingsMessage}
                  </Text>
                ) : null}
              </View>

              <FilterChips
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('filters.filters')} (${appliedFilterCount})` : t('filters.filters'),
                    icon: 'tune' as const,
                  },
                  ...donationFilters.map((filter) => ({ key: filter.key, label: filter.label, icon: filter.icon })),
                ]}
                activeKey={activeStatusFilter}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setActiveStatusFilter(key as DonationStatusFilterKey);
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
                  {t('title')}
                </Text>
                <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                  {showHeaderSkeleton ? (
                    <SkeletonBlock width={28} height={16} radiusSize={radius.full} />
                  ) : (
                    <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {String(totalCount)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <AdminDonationCard
              record={item}
              viewing={viewingId === item.id}
              downloading={downloadingId === item.id}
              onViewPress={() => {
                void handleViewSlip(item);
              }}
              onDownloadPress={() => {
                void handleDownloadSlip(item);
              }}
              onEditPress={() => router.push(`/admin/edit-donation?donationId=${encodeURIComponent(item.id)}` as never)}
            />
          )}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />

        <FilterSheet
          visible={filterVisible}
          title={t('filters.filtersGroup')}
          subtitle={t('filters.subtitle')}
          sections={[
            {
              title: t('filters.status'),
              icon: 'verified',
              activeKey: draftStatusFilter,
              items: [
                { key: 'all', label: t('filters.allStatuses') },
                { key: 'paid', label: `${t('filters.paid')} (${statusCounts.paid})` },
                { key: 'pending', label: `${t('filters.pending')} (${statusCounts.pending})` },
                { key: 'cancelled', label: `${t('filters.cancelled')} (${statusCounts.cancelled})` },
              ],
              onSelect: (key) => setDraftStatusFilter(key as DonationStatusFilterKey),
            },
            {
              title: t('filters.paymentMode'),
              icon: 'payments',
              activeKey: draftPaymentFilter,
              items: [
                { key: 'all', label: t('filters.allPayments') },
                { key: 'cash', label: t('filters.cash') },
                { key: 'transfer', label: t('filters.transfer') },
                { key: 'cheque', label: t('filters.cheque') },
              ],
              onSelect: (key) => setDraftPaymentFilter(key as DonationPaymentFilterKey),
            },
          ]}
          onClose={() => {
            setDraftStatusFilter(activeStatusFilter);
            setDraftPaymentFilter(activePaymentFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveStatusFilter(draftStatusFilter);
            setActivePaymentFilter(draftPaymentFilter);
            setFilterVisible(false);
          }}
          onReset={() => {
            setDraftStatusFilter('all');
            setDraftPaymentFilter('all');
          }}
          applyLabel={t('actions.applyFilters')}
          resetLabel={t('actions.resetFilters')}
        />

        {fabMenuOpen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close contribution actions"
            onPress={() => setFabMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 35,
            }}
          />
        ) : null}

        <View style={{ position: 'absolute', right: spacing[4], bottom: 88, zIndex: 40, alignItems: 'flex-end', gap: spacing[2] }}>
          {fabMenuOpen ? (
            <MotionView
              from={{ opacity: 0, translateY: 10, scale: 0.96 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'timing', duration: 180 }}
              style={{ alignItems: 'flex-end', gap: spacing[2] }}>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.9}
                onPress={() => {
                  setFabMenuOpen(false);
                  router.push('/admin/record-manual-donation' as never);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[2],
                  paddingVertical: spacing[2],
                  paddingHorizontal: spacing[3],
                  borderRadius: 999,
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}>
                <View style={{ width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted }}>
                  <MaterialIcons name="post-add" size={18} color={colors.primary.DEFAULT} />
                </View>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  {t('actions.offlineDonation')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.9}
                onPress={() => {
                  setFabMenuOpen(false);
                  router.push('/admin/donations' as never);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[2],
                  paddingVertical: spacing[2],
                  paddingHorizontal: spacing[3],
                  borderRadius: 999,
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}>
                <View style={{ width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted }}>
                  <MaterialIcons name="volunteer-activism" size={18} color={colors.primary.DEFAULT} />
                </View>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  {t('actions.onlineDonation')}
                </Text>
              </TouchableOpacity>
            </MotionView>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => setFabMenuOpen((current) => !current)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}>
            <MotionView
              key={fabMenuOpen ? 'close' : 'add'}
              from={{ opacity: 0, rotate: fabMenuOpen ? '180deg' : '-180deg', scale: 0.75 }}
              animate={{ opacity: 1, rotate: '0deg', scale: 1 }}
              transition={{ type: 'timing', duration: 180 }}>
              <Text style={{ color: colors.text.inverse, fontSize: 28, lineHeight: 28 }}>
                {fabMenuOpen ? '×' : '+'}
              </Text>
            </MotionView>
          </TouchableOpacity>
        </View>
      </View>
      <Dialog
        visible={receiptDialog.visible}
        variant={receiptDialog.variant}
        title={receiptDialog.title}
        description={receiptDialog.description}
        onConfirm={() => setReceiptDialog((current) => ({ ...current, visible: false }))}
      />
    </AppSafeAreaView>
  );
}
