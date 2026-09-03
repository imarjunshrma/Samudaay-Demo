import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Dialog, InfiniteScrollList, StatCardSkeleton, Tabs, Text, TransactionItem } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { donationService, type MemberTransactionItem } from '../services/donation-service';
import { matrimonyFeedService } from '@/src/features/matrimony/services/matrimony-feed-service';
import { isPdfDownloadCancelledError } from '@/src/services/files/pdf-file';
import { colors, radius, spacing, typography } from '@/src/theme';

type TransactionFeedItem = {
  id: string;
  receiptNo?: string | null;
  donationId?: string;
  subscriptionId?: string;
  subscriptionType?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null;
  subscriptionStartsAt?: string | null;
  subscriptionEndsAt?: string | null;
  paymentRef?: string | null;
  title: string;
  meta: string;
  amount: string;
  amountValue: number;
  status: string;
  createdAt: string;
  date?: string;
  transactionType?: string;
  icon: string;
  tone: string;
  bg: string;
};

const PAGE_SIZE = 12;
const SUMMARY_UPDATED_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
};

function formatSummaryUpdatedDate(value: string | null | undefined, locale: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString(locale, SUMMARY_UPDATED_DATE_FORMAT);
}

function MyTransactionRowSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: 'rgba(24,168,117,0.08)',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <SkeletonBlock width={44} height={44} radiusSize={radius.full} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="46%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="58%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: spacing[2], marginLeft: spacing[2] }}>
        <SkeletonBlock width={70} height={16} radiusSize={radius.sm} />
        <SkeletonBlock width={34} height={34} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function MyTransactionsContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.my-transactions');
  const { language } = useAppPreferences();
  const [activeTab, setActiveTab] = useState<'all' | 'donations' | 'events' | 'subscriptions'>('all');
  const [transactions, setTransactions] = useState<TransactionFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
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

  function mapTransaction(record: MemberTransactionItem): TransactionFeedItem {
    const typeLabel = record.type === 'event'
      ? 'Event'
      : record.type === 'subscription'
        ? 'Subscription'
        : 'Donation';
    const icon = record.type === 'event'
      ? 'event'
      : record.type === 'subscription'
        ? 'favorite'
        : 'volunteer-activism';
    const bg = record.type === 'event' ? '#dbeafe' : record.type === 'subscription' ? '#fae8ff' : '#dcfce7';
    const tone = record.type === 'event' ? '#2563eb' : record.type === 'subscription' ? '#a21caf' : '#16a34a';

    return {
      id: record.id,
      receiptNo: record.receiptNo,
      title: record.title,
      meta: `${record.createdAt ? new Date(record.createdAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }) : 'Today'} • ${typeLabel}`,
      amount: `₹${Number(record.amount || 0).toLocaleString('en-IN')}`,
      amountValue: Number(record.amount || 0),
      status: record.status,
      createdAt: record.createdAt,
      date: record.createdAt ? new Date(record.createdAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }) : 'Today',
      transactionType: typeLabel,
      icon,
      tone,
      bg,
    };
  }

  const loadPage = useCallback(async ({ nextPage, append = false, refresh = false, type = activeTab }: { nextPage: number; append?: boolean; refresh?: boolean; type?: typeof activeTab }) => {
      if (refresh) {
        setIsRefreshing(true);
      } else if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await donationService.loadMyTransactionsPage({
          page: nextPage,
          limit: PAGE_SIZE,
          type: type === 'donations' ? 'donation' : type === 'events' ? 'event' : type === 'subscriptions' ? 'subscription' : 'all',
        });
        const mapped = response.items.map((record) => ({
          ...mapTransaction(record),
          donationId: record.donationId,
          subscriptionId: record.subscriptionId,
          subscriptionType: record.subscriptionType,
          subscriptionStartsAt: record.subscriptionStartsAt,
          subscriptionEndsAt: record.subscriptionEndsAt,
          paymentRef: record.paymentRef,
        }));

        setTransactions((current) => (append ? [...current, ...mapped] : mapped));
        setHasNextPage(Boolean(response.pagination?.hasNextPage));
        setPage(response.pagination?.page ?? nextPage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    }, [activeTab]);

  useEffect(() => {
    void loadPage({ nextPage: 1, type: activeTab });
  }, [activeTab, loadPage]);

  const totalContribution = useMemo(
    () =>
      transactions.reduce((sum, item) => {
        const match = item.amount.replace(/[^\d.-]/g, '');
        const amount = Number(match || 0);
        return sum + Math.abs(Number.isFinite(amount) ? amount : 0);
      }, 0),
    [transactions],
  );
  const latestTransactionDate = useMemo(() => {
    const latestTimestamp = transactions.reduce((latest, item) => {
      const timestamp = new Date(item.createdAt).getTime();
      return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
    }, 0);

    return latestTimestamp ? new Date(latestTimestamp).toISOString() : null;
  }, [transactions]);
  const summaryUpdatedDate = formatSummaryUpdatedDate(latestTransactionDate, language === 'gu' ? 'gu-IN' : 'en-IN');
  const summaryUpdatedLabel = summaryUpdatedDate
    ? t('summary.updated').replace('{date}', summaryUpdatedDate)
    : t('summary.notUpdated');
  const showInitialSkeleton = isLoading && !transactions.length;

  async function handleDownloadReceipt(item: TransactionFeedItem) {
    if (!item.donationId && !item.subscriptionId) {
      return;
    }

    try {
      if (item.subscriptionId) {
        await matrimonyFeedService.downloadSubscriptionInvoice({
          transactionId: item.subscriptionId,
          title: item.title,
          amount: item.amountValue,
          status: item.status,
          createdAt: item.createdAt,
          subscriptionType: item.subscriptionType,
          subscriptionStartsAt: item.subscriptionStartsAt,
          subscriptionEndsAt: item.subscriptionEndsAt,
          paymentRef: item.paymentRef,
        });
        return;
      }

      const donationId = item.donationId;
      if (!donationId) {
        return;
      }

      const result = await donationService.generateReceiptForDonationId(donationId);
      if (result?.method === 'saf') {
        setReceiptDialog({
          visible: true,
          variant: 'success',
          title: 'Receipt ready',
          description: 'The receipt PDF was saved to the selected folder.',
        });
      }
    } catch (error) {
      if (isPdfDownloadCancelledError(error)) {
        return;
      }
      setReceiptDialog({
        visible: true,
        variant: 'error',
        title: item.subscriptionId ? 'Unable to generate invoice' : 'Unable to generate receipt',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
        />
        <InfiniteScrollList
          data={transactions}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          onRefresh={() => {
            void loadPage({ nextPage: 1, refresh: true, type: activeTab });
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            void loadPage({ nextPage: page + 1, append: true, type: activeTab });
          }}
          preserveHeaderOnInitialLoad
          contentContainerStyle={{ paddingBottom: spacing[6] }}
          renderSkeletonItem={() => <MyTransactionRowSkeleton />}
          ListHeaderComponent={(
            <>
              <View style={{ padding: spacing[4] }}>
                {showInitialSkeleton ? (
                  <StatCardSkeleton />
                ) : (
                  <View style={{ gap: spacing[2], borderRadius: radius.xl, padding: spacing[6], backgroundColor: 'rgba(24,168,117,0.1)', borderWidth: 1, borderColor: 'rgba(24,168,117,0.2)', minHeight: 144 }}>
                    <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {t('summary.title')}
                    </Text>
                    <Text variant="h1" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                      ₹{totalContribution.toLocaleString('en-IN')}
                    </Text>
                    <View style={{ marginTop: spacing[2], flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                      <MaterialIcons name="verified" size={16} color="#6b7280" />
                      <Text variant="caption" color="#6b7280">
                        {summaryUpdatedLabel}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[3] }}>
                <Tabs
                  variant="underline"
                  scrollable
                  activeKey={activeTab}
                  onChange={(key) => setActiveTab(key as typeof activeTab)}
                  items={[
                    { key: 'all', label: t('tabs.all') },
                    { key: 'donations', label: t('tabs.donations') },
                    { key: 'events', label: t('tabs.events') },
                    { key: 'subscriptions', label: t('tabs.subscriptions') },
                  ]}
                />
              </View>
              <View style={{ gap: spacing[3], paddingHorizontal: spacing[4], paddingBottom: spacing[2] }}>
                <Text variant="caption" color="#6b7280" style={{ paddingBottom: spacing[3], fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  {t('section.recent')}
                </Text>
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: spacing[4] }}>
              <TransactionItem
                variant="history"
                title={item.title}
                subtitle={item.meta}
                amount={item.amount}
                date={item.date}
                transactionType={item.transactionType}
                icon={item.icon}
                tone={item.tone}
                bg={item.bg}
                ctaLabel={t('cta.receipt')}
                onCtaPress={item.donationId || item.subscriptionId ? () => void handleDownloadReceipt(item) : undefined}
              />
            </View>
          )}
          emptyTitle="No transactions found"
          emptyDescription="Your donation receipts and paid activity will appear here once available."
        />

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
