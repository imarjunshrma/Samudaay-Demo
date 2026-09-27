import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import {
  AppHeader,
  AppHeaderSearch,
  ErrorState,
  InfiniteScrollList,
  NotificationCard,
  Tabs,
  Text,
} from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { notificationCampaignService, type AdminNotificationCampaignItem } from '../services/notification-campaign-service';
import { notificationFeedService, type CommunityNotificationFeedItem, type NotificationDateGroup } from '../services/notification-feed-service';
import { useTranslations } from '@/src/i18n/use-translations';

type NotificationsContentMode = 'user' | 'admin' | 'admin-inbox';
type NotificationListRow =
  | { id: string; kind: 'header'; label: string }
  | { id: string; kind: 'item'; item: CommunityNotificationFeedItem };

const GROUP_ORDER: NotificationDateGroup[] = ['today', 'yesterday', 'older'];

function NotificationCardSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
      }}>
      <SkeletonBlock width={48} height={48} radiusSize={radius.full} />
      <View style={{ flex: 1, gap: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
          <SkeletonBlock width="46%" height={14} radiusSize={radius.sm} />
          <SkeletonBlock width={44} height={10} radiusSize={radius.sm} />
        </View>
        <SkeletonBlock width="88%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="70%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width={54} height={10} radiusSize={radius.sm} />
      </View>
    </View>
  );
}

function getNotificationCardVariant(item: AdminNotificationCampaignItem) {
  const status = item.tag.toLowerCase();
  if (item.muted || status.includes('draft') || status.includes('failed') || status.includes('canceled')) {
    return 'muted';
  }
  if (status.includes('sending') || status.includes('scheduled')) {
    return 'unread';
  }
  return 'default';
}

function buildNotificationRows(items: CommunityNotificationFeedItem[], t: (key: string) => string): NotificationListRow[] {
  const labels: Record<NotificationDateGroup, string> = {
    today: t('feed.today'),
    yesterday: t('feed.yesterday'),
    older: t('feed.older'),
  };

  return GROUP_ORDER.flatMap((group) => {
    const groupItems = items.filter((item) => item.dateGroup === group);
    if (!groupItems.length) {
      return [];
    }

    return [
      { id: `header-${group}`, kind: 'header', label: labels[group] } as const,
      ...groupItems.map((item) => ({ id: item.id, kind: 'item', item }) as const),
    ];
  });
}

function buildNotificationRoute(item: CommunityNotificationFeedItem) {
  const normalizedType = String(item.type || '').toLowerCase();
  const normalizedContext = String(item.chatContext || '').toLowerCase();

  if ((normalizedType === 'matrimony_request_accepted' || normalizedType === 'chat_message_received') && item.chatId && normalizedContext === 'matrimony') {
    return {
      pathname: '/events/event-live-chat',
      params: {
        chatId: item.chatId,
        chatTitle: item.chatTitle || item.title,
        chatContext: 'matrimony',
        profileId: item.profileId || '',
      },
    } as const;
  }

  return {
    pathname: '/member/notification-detail',
    params: {
      notificationId: item.id,
      title: item.title,
      message: item.desc,
      image: item.image ?? '',
      senderName: item.senderName ?? '',
      greetingId: item.greetingId ?? '',
      templateId: item.templateId ?? '',
      time: item.time,
      tag: item.type === 'birthday_greeting' ? 'Birthday' : 'Update',
      returnTo: '/member/notifications',
    },
  } as const;
}

function AdminNotificationsView() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('communication.notifications');
  const [search, setSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [items, setItems] = useState<AdminNotificationCampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>();

  const reload = useCallback(async (nextPage = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const result = await notificationCampaignService.loadAdminCampaignsPage({ page: nextPage, limit: 20, search });
      setItems((current) => {
        if (!append) return result.items;
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setPage(result.pagination?.page ?? nextPage);
      setErrorMessage(undefined);
    } catch (error) {
      if (!append) {
        setItems([]);
      }
      setErrorMessage(error instanceof Error ? error.message : t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [search, t]);

  useFocusEffect(
    useCallback(() => {
      void reload(1);
    }, [reload]),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void reload(1);
    }, search.trim() ? 250 : 0);
    return () => clearTimeout(timer);
  }, [reload, search]);

  const filteredItems = items;
  const showHeaderSkeleton = isLoading && !items.length;

  if (errorMessage && !isLoading && !items.length) {
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flex: 1 }}>
          <AppHeaderSearch
            title={t('header.title')}
            searchValue={search}
            onSearchValueChange={setSearch}
            searchActive={searchInHeader}
            onSearchPress={() => setSearchInHeader(true)}
            onCloseSearch={() => { setSearch(''); setSearchInHeader(false); }}
            onBackPress={navigateBack}
          />
          <View style={{ flex: 1, padding: spacing[4], justifyContent: 'center' }}>
            <ErrorState
              title={t('errors.loadFailed')}
              description={errorMessage}
              onRetry={() => { void reload(); }}
            />
          </View>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeaderSearch
          title={t('header.title')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchInHeader}
          onSearchPress={() => setSearchInHeader(true)}
          onCloseSearch={() => { setSearch(''); setSearchInHeader(false); }}
          onBackPress={navigateBack}
        />

        {errorMessage ? (
          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <ErrorState
              title={t('errors.loadFailed')}
              description={errorMessage}
              onRetry={() => { void reload(); }}
            />
          </View>
        ) : null}

        <InfiniteScrollList
          data={filteredItems}
      keyExtractor={(item) => item.id}
          loadingInitial={isLoading && !items.length}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          onRefresh={() => {
            setIsRefreshing(true);
            void reload(1);
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            void reload(page + 1, true);
          }}
          preserveHeaderOnInitialLoad
          hideLoadMoreText
          renderSkeletonItem={() => <NotificationCardSkeleton />}
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 132 }}
          ListHeaderComponent={(
            <View style={{ gap: spacing[3], marginBottom: spacing[4] }}>
              <View
                style={{
                  borderRadius: radius.xl,
                  padding: spacing[5],
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  gap: spacing[1],
                }}>
                <Text
                  variant="caption"
                  color={colors.primary.DEFAULT}
                  style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {t('header.subtitle')}
                </Text>
                {showHeaderSkeleton ? (
                  <View style={{ gap: spacing[2] }}>
                    <SkeletonBlock width="30%" height={34} radiusSize={radius.md} />
                    <SkeletonBlock width="48%" height={14} radiusSize={radius.sm} />
                  </View>
                ) : (
                  <>
                    <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold }}>
                      {filteredItems.length.toLocaleString('en-IN')}
                    </Text>
                    <Text variant="body" color="#64748b">
                      {filteredItems.length === 1 ? t('stats.campaignAvailable') : t('stats.campaignsAvailable')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <NotificationCard
              title={item.title}
              description={item.description}
              time={item.time}
              tag={item.tag}
              icon={item.icon as never}
              variant={getNotificationCardVariant(item)}
            />
          )}
          emptyTitle={search.trim() ? t('errors.noMatchTitle') : t('errors.emptyTitle')}
          emptyDescription={search.trim() ? t('errors.noMatchDescription') : t('errors.emptyDescription')}
        />

        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', right: spacing[4], bottom: spacing[4], zIndex: 40 }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('actions.create')}
            activeOpacity={0.9}
            onPress={() => router.push('/admin/create-notification' as never)}
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
            <MaterialIcons name="add" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeAreaView>
  );
}

function AdminNotificationInboxView() {
  const { unread } = useLocalSearchParams<{ unread?: string }>();
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('communication.notifications');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>(() => unread === 'true' ? 'unread' : 'all');
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [items, setItems] = useState<CommunityNotificationFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const hasTabInitializedRef = useRef(false);

  const reload = useCallback(async (nextPage = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else if (!isRefreshing) {
      setIsLoading(true);
    }
    try {
      const result = await notificationFeedService.loadNotificationPage({
        page: nextPage,
        limit: 20,
        unreadOnly: activeTab === 'unread',
      });
      setItems((current) => {
        if (!append) return result.items;
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setPage(result.pagination?.page ?? nextPage);
      setError(null);
    } catch (loadError) {
      if (!append) {
        setItems([]);
      }
      setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab, isRefreshing, t]);

  useFocusEffect(
    useCallback(() => {
      void reload(1);
    }, [reload]),
  );

  useEffect(() => {
    if (!hasTabInitializedRef.current) {
      hasTabInitializedRef.current = true;
      return;
    }
    void reload(1);
  }, [activeTab, reload]);

  async function handleMarkAllRead() {
    setIsMarkingRead(true);
    try {
      await notificationFeedService.markAllRead();
      await reload(1);
    } finally {
      setIsMarkingRead(false);
    }
  }

  const rows = useMemo(
    () => buildNotificationRows(items, t),
    [items, t],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
          rightSlot={
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isMarkingRead || isLoading}
              onPress={() => { void handleMarkAllRead(); }}>
              <Text
                variant="caption"
                color={isMarkingRead ? colors.text.muted : colors.primary.DEFAULT}
                style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                {t('actions.markAllRead')}
              </Text>
            </TouchableOpacity>
          }
        />
        <View style={{ paddingHorizontal: spacing[4] }}>
          <Tabs
            variant="underline"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'all' | 'unread')}
            items={[
              { key: 'all', label: t('filters.all') },
              { key: 'unread', label: t('filters.unread') },
            ]}
          />
        </View>
        <InfiniteScrollList
          data={rows}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          onRefresh={() => {
            setIsRefreshing(true);
            void reload(1);
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            void reload(page + 1, true);
          }}
          renderSkeletonItem={() => <NotificationCardSkeleton />}
          contentContainerStyle={{ paddingBottom: 96 }}
          ListHeaderComponent={error ? (
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
              <ErrorState
                title={t('errors.loadFailed')}
                description={error}
                onRetry={() => { void reload(1); }}
              />
            </View>
          ) : null}
          renderItem={({ item }) => item.kind === 'header' ? (
            <Text
              variant="caption"
              color="#6b7280"
              style={{
                paddingHorizontal: spacing[4],
                paddingBottom: spacing[2],
                paddingTop: spacing[6],
                fontFamily: typography.fontFamily.bold,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}>
              {item.label}
            </Text>
          ) : (
            <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[2] }}>
              <NotificationCard
                title={item.item.title}
                description={item.item.desc}
                time={item.item.time}
                image={item.item.image}
                icon={item.item.icon as never}
                variant={item.item.unread ? 'unread' : 'muted'}
                onPress={() => {
                  void notificationFeedService.markNotificationRead(item.item.id);
                  router.push({
                    pathname: '/admin/notification-detail',
                    params: {
                      notificationId: item.item.id,
                      title: item.item.title,
                      message: item.item.desc,
                      image: item.item.image ?? '',
                      senderName: item.item.senderName ?? '',
                      greetingId: item.item.greetingId ?? '',
                      templateId: item.item.templateId ?? '',
                      time: item.item.time,
                      tag: item.item.type === 'birthday_greeting' ? 'Birthday' : 'Update',
                      returnTo: '/admin/notifications',
                    },
                  } as never);
                }}
              />
            </View>
          )}
          emptyTitle={t('errors.emptyTitle')}
          emptyDescription={t('errors.emptyDescription')}
        />
      </View>
    </AppSafeAreaView>
  );
}

function UserNotificationsView() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('communication.notifications');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [items, setItems] = useState<CommunityNotificationFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const hasTabInitializedRef = useRef(false);

  const reload = useCallback(async (nextPage = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else if (!isRefreshing) {
      setIsLoading(true);
    }
    try {
      const result = await notificationFeedService.loadNotificationPage({
        page: nextPage,
        limit: 20,
        unreadOnly: activeTab === 'unread',
      });
      setItems((current) => {
        if (!append) return result.items;
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setPage(result.pagination?.page ?? nextPage);
      setError(null);
    } catch (loadError) {
      if (!append) {
        setItems([]);
      }
      setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab, isRefreshing, t]);

  useFocusEffect(
    useCallback(() => {
      void reload(1);
    }, [reload]),
  );

  useEffect(() => {
    if (!hasTabInitializedRef.current) {
      hasTabInitializedRef.current = true;
      return;
    }
    void reload(1);
  }, [activeTab, reload]);

  async function handleMarkAllRead() {
    setIsMarkingRead(true);
    try {
      await notificationFeedService.markAllRead();
      await reload(1);
    } finally {
      setIsMarkingRead(false);
    }
  }

  const rows = useMemo(
    () => buildNotificationRows(items, t),
    [items, t],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
          rightSlot={
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isMarkingRead || isLoading}
              onPress={() => { void handleMarkAllRead(); }}>
              <Text
                variant="caption"
                color={isMarkingRead ? colors.text.muted : colors.primary.DEFAULT}
                style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                {t('actions.markAllRead')}
              </Text>
            </TouchableOpacity>
          }
        />
        <View style={{ paddingHorizontal: spacing[4] }}>
          <Tabs
            variant="underline"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'all' | 'unread')}
            items={[
              { key: 'all', label: t('filters.all') },
              { key: 'unread', label: t('filters.unread') },
            ]}
          />
        </View>
        <InfiniteScrollList
          data={rows}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          onRefresh={() => {
            setIsRefreshing(true);
            void reload(1);
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            void reload(page + 1, true);
          }}
          renderSkeletonItem={() => <NotificationCardSkeleton />}
          contentContainerStyle={{ paddingBottom: spacing[4] }}
          ListHeaderComponent={error ? (
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
              <ErrorState
                title={t('errors.loadFailed')}
                description={error}
                onRetry={() => { void reload(1); }}
              />
            </View>
          ) : null}
          renderItem={({ item }) => item.kind === 'header' ? (
            <Text
              variant="caption"
              color="#6b7280"
              style={{
                paddingHorizontal: spacing[4],
                paddingBottom: spacing[2],
                paddingTop: spacing[6],
                fontFamily: typography.fontFamily.bold,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}>
              {item.label}
            </Text>
          ) : (
            <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[2] }}>
              <NotificationCard
                title={item.item.title}
                description={item.item.desc}
                time={item.item.time}
                image={item.item.image}
                icon={item.item.icon as never}
                variant={item.item.unread ? 'unread' : 'muted'}
                onPress={() => {
                  void notificationFeedService.markNotificationRead(item.item.id);
                  router.push(buildNotificationRoute(item.item) as never);
                }}
              />
            </View>
          )}
          emptyTitle={t('errors.emptyTitle')}
          emptyDescription={t('errors.emptyDescription')}
        />
      </View>
    </AppSafeAreaView>
  );
}

export function NotificationsContent({
  mode = 'user',
}: {
  mode?: NotificationsContentMode;
}) {
  if (mode === 'admin') {
    return <AdminNotificationsView />;
  }
  if (mode === 'admin-inbox') {
    return <AdminNotificationInboxView />;
  }
  return <UserNotificationsView />;
}
