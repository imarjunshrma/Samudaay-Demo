import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { AppHeaderSearch, Card, FilterChips, FilterSheet, InfiniteScrollList, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';
import { birthdayGreetingService, type BirthdayGreetingListResult } from '../services/birthday-greeting-service';
import { type BirthdayGreetingSortKey } from '../services/birthday-greeting-log-utils';
import type { BirthdayGreetingLog } from '../constants';

const PAGE_SIZE = 20;

type ActivityStatusFilter = 'all' | 'Delivered' | 'Scheduled';
type ActivityChannelFilter = 'all' | 'In-app' | 'Scheduled';

function ActivityLogCard({
  item,
  statusLabel,
}: {
  item: BirthdayGreetingLog;
  statusLabel: string;
}) {
  return (
    <Card variant="default" padding="md" style={{ borderColor: colors.primary.borderLight }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary.muted,
          }}>
          <MaterialIcons name="outgoing-mail" size={18} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
            <Text variant="body" style={{ flex: 1, fontFamily: typography.fontFamily.semibold }}>
              {item.sender ? `${item.sender} -> ${item.recipient}` : item.recipient}
            </Text>
            <View
              style={{
                borderRadius: radius.full,
                backgroundColor: item.status === 'Delivered' ? '#dcfce7' : '#fef3c7',
                paddingHorizontal: spacing[2],
                paddingVertical: 4,
              }}>
              <Text
                variant="caption"
                color={item.status === 'Delivered' ? '#166534' : '#92400e'}
                style={{ fontFamily: typography.fontFamily.bold }}>
                {statusLabel}
              </Text>
            </View>
          </View>
          <Text variant="caption" color={colors.text.secondary}>
            {item.template}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {[item.channel, item.sentAt].filter(Boolean).join(' • ')}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export function BirthdayGreetingActivityContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('communication.birthday-reminders');
  const [search, setSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ActivityStatusFilter>('all');
  const [channelFilter, setChannelFilter] = useState<ActivityChannelFilter>('all');
  const [sortKey, setSortKey] = useState<BirthdayGreetingSortKey>('latest');
  const [items, setItems] = useState<BirthdayGreetingLog[]>([]);
  const [pagination, setPagination] = useState<BirthdayGreetingListResult['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hasLoadedRef = useRef(false);

  const loadActivity = useCallback(
    async (mode: 'replace' | 'append' = 'replace') => {
      const nextPage = mode === 'append' ? (pagination?.page ?? 1) + 1 : 1;
      if (mode === 'append') {
        setLoadingMore(true);
      } else if (!hasLoadedRef.current) {
        setIsLoading(true);
      }

      try {
        const result = await birthdayGreetingService.listPaginated({
          page: nextPage,
          limit: PAGE_SIZE,
          search,
          status: statusFilter,
          channel: channelFilter,
          sort: sortKey,
        });

        setItems((current) => (mode === 'append' ? [...current, ...result.items] : result.items));
        setPagination(result.pagination);
        setErrorMessage('');
      } catch (error) {
        if (mode !== 'append') {
          setItems([]);
        }
        setErrorMessage(error instanceof Error ? error.message : t('error.title'));
      } finally {
        if (mode === 'append') {
          setLoadingMore(false);
        } else {
          hasLoadedRef.current = true;
          setIsLoading(false);
        }
      }
    },
    [channelFilter, pagination?.page, search, sortKey, statusFilter, t],
  );

  useFocusEffect(
    useCallback(() => {
      void loadActivity('replace');
    }, [loadActivity]),
  );

  const hasNextPage = Boolean(pagination && pagination.page < pagination.totalPages);
  const appliedFilterCount = [statusFilter !== 'all', channelFilter !== 'all', sortKey !== 'latest'].filter(Boolean).length;
  const statusCounts = useMemo(
    () => ({
      all: getPaginationTotal(pagination, items.length),
      Delivered: items.filter((item) => item.status === 'Delivered').length,
      Scheduled: items.filter((item) => item.status === 'Scheduled').length,
    }),
    [items, pagination],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeaderSearch
          title={t('admin.activityPage.title')}
          placeholder={t('admin.activityPage.searchPlaceholder')}
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

        <InfiniteScrollList
          data={items}
          keyExtractor={(item, index) => `${item.sender || 'system'}-${item.recipient}-${item.template}-${item.channel}-${item.sentAt}-${index}`}
          renderItem={({ item }) => (
            <ActivityLogCard
              item={item}
              statusLabel={t(`admin.activity.status.${item.status}`)}
            />
          )}
          loadingInitial={isLoading}
          loadingMore={loadingMore}
          hasNextPage={hasNextPage}
          hideLoadMoreText
          onLoadMore={() => {
            if (!hasNextPage || loadingMore) {
              return;
            }
            void loadActivity('append');
          }}
          errorMessage={errorMessage || null}
          errorTitle={t('error.title')}
          onRetry={() => {
            void loadActivity('replace');
          }}
          emptyTitle={search.trim() ? t('admin.activityPage.emptySearchTitle') : t('admin.activityPage.emptyTitle')}
          emptyDescription={search.trim() ? t('admin.activityPage.emptySearchDescription') : t('admin.activityPage.emptyDescription')}
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: spacing[16], flexGrow: 1 }}
          ListHeaderComponent={(
            <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], marginBottom: spacing[4], gap: spacing[4] }}>
              <Card variant="elevated" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
                <View style={{ gap: spacing[1] }}>
                  <Text
                    variant="caption"
                    color={colors.primary.DEFAULT}
                    style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('admin.activityPage.summaryLabel')}
                  </Text>
                  <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold }}>
                    {getPaginationTotal(pagination, 0).toLocaleString('en-IN')}
                  </Text>
                  <Text variant="body" color={colors.text.secondary}>
                    {getPaginationTotal(pagination, 0) === 1 ? t('admin.activityPage.singleResult') : t('admin.activityPage.multipleResults')}
                  </Text>
                </View>
              </Card>

              <FilterChips
                scrollable
                showIcons
                activeKey={statusFilter}
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('admin.activityPage.filters')} (${appliedFilterCount})` : t('admin.activityPage.filters'),
                    icon: 'tune',
                  },
                  { key: 'all', label: `${t('admin.activityPage.statusAll')} (${statusCounts.all})`, icon: 'view-list' },
                  { key: 'Delivered', label: `${t('admin.activity.status.Delivered')} (${statusCounts.Delivered})`, icon: 'check-circle' },
                  { key: 'Scheduled', label: `${t('admin.activity.status.Scheduled')} (${statusCounts.Scheduled})`, icon: 'schedule-send' },
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    setFilterVisible(true);
                    return;
                  }
                  setStatusFilter(key as ActivityStatusFilter);
                }}
              />
            </View>
          )}
        />

        <FilterSheet
          visible={filterVisible}
          title={t('admin.activityPage.filterTitle')}
          subtitle={t('admin.activityPage.filterSubtitle')}
          onClose={() => setFilterVisible(false)}
          onApply={() => {
            setFilterVisible(false);
            void loadActivity('replace');
          }}
          onReset={() => {
            setStatusFilter('all');
            setChannelFilter('all');
            setSortKey('latest');
          }}
          applyLabel={t('admin.activityPage.applyFilters')}
          resetLabel={t('admin.activityPage.resetFilters')}
          sections={[
            {
              title: t('admin.activityPage.sortSection'),
              icon: 'sort',
              activeKey: sortKey,
              items: [
                { key: 'latest', label: t('admin.activityPage.sortLatest') },
                { key: 'oldest', label: t('admin.activityPage.sortOldest') },
                { key: 'recipient', label: t('admin.activityPage.sortRecipient') },
                { key: 'template', label: t('admin.activityPage.sortTemplate') },
                { key: 'status', label: t('admin.activityPage.sortStatus') },
              ],
              onSelect: (key) => setSortKey(key as BirthdayGreetingSortKey),
            },
            {
              title: t('admin.activityPage.statusSection'),
              icon: 'task-alt',
              activeKey: statusFilter,
              items: [
                { key: 'all', label: t('admin.activityPage.statusAll') },
                { key: 'Delivered', label: `${t('admin.activity.status.Delivered')} (${statusCounts.Delivered})` },
                { key: 'Scheduled', label: `${t('admin.activity.status.Scheduled')} (${statusCounts.Scheduled})` },
              ],
              onSelect: (key) => setStatusFilter(key as ActivityStatusFilter),
            },
            {
              title: t('admin.activityPage.channelSection'),
              icon: 'campaign',
              activeKey: channelFilter,
              items: [
                { key: 'all', label: t('admin.activityPage.channelAll') },
                { key: 'In-app', label: t('admin.activityPage.channelInApp') },
                { key: 'Scheduled', label: t('admin.activityPage.channelScheduled') },
              ],
              onSelect: (key) => setChannelFilter(key as ActivityChannelFilter),
            },
          ]}
        />
      </View>
    </AppSafeAreaView>
  );
}
