import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, InfiniteScrollList, Tabs, Text } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { EventListCard } from './event-shared-blocks';
import { eventService, type EventCardRecord } from '../services/event-service';

const PAGE_SIZE = 12;

function EventListCardSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ flex: 1, gap: spacing[2] }}>
        <SkeletonBlock width="56%" height={16} radiusSize={radius.sm} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <SkeletonBlock width={14} height={14} radiusSize={radius.sm} />
          <SkeletonBlock width="38%" height={12} radiusSize={radius.sm} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <SkeletonBlock width={14} height={14} radiusSize={radius.sm} />
          <SkeletonBlock width="52%" height={12} radiusSize={radius.sm} />
        </View>
        <View style={{ marginTop: spacing[3], flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
          <SkeletonBlock width={120} height={36} radiusSize={radius.lg} />
          <SkeletonBlock width={120} height={36} radiusSize={radius.lg} />
        </View>
      </View>
      <SkeletonBlock width={104} height={104} radiusSize={radius.lg} />
    </View>
  );
}

export function MyEventsListContent() {
  const router = useRouter();
  const { session } = useSession();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const t = useTranslations('events.my-events-list');
  const explicitReturnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const listReturnTo = explicitReturnTo || (isAdminLikeSession(session) ? '/admin/manage-events' : '/member/events');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<EventCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const hasFocusedOnceRef = useRef(false);

  const loadEvents = useCallback(async ({ showInitialLoading = false, refreshing = false } = {}) => {
    if (showInitialLoading) {
      setIsLoading(true);
    }
    if (refreshing) {
      setIsRefreshing(true);
    }

    try {
      const response = await eventService.loadEventCardsPage({
        page: 1,
        limit: PAGE_SIZE,
        timeframe: activeTab === 'upcoming' ? 'upcoming' : 'past',
      });
      setEvents(response.items);
      setHasNextPage(Boolean(response.pagination?.hasNextPage));
      setPage(response.pagination?.page ?? 1);
    } catch {
      setEvents([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void loadEvents({ showInitialLoading: true });
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return () => undefined;
      }

      void loadEvents({ showInitialLoading: false });
      return () => undefined;
    }, [loadEvents]),
  );

  const loadMoreEvents = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const response = await eventService.loadEventCardsPage({
        page: page + 1,
        limit: PAGE_SIZE,
        timeframe: activeTab === 'upcoming' ? 'upcoming' : 'past',
      });
      setEvents((current) => [...current, ...response.items]);
      setHasNextPage(Boolean(response.pagination?.hasNextPage));
      setPage(response.pagination?.page ?? page + 1);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeTab, hasNextPage, isLoadingMore, page]);

  const openRegistration = (eventId: string) => {
    router.push({
      pathname: '/events/event-details-registration',
      params: { eventId, returnTo: listReturnTo },
    } as never);
  };

  const openDetails = (eventId: string) => {
    router.push({
      pathname: '/events/event-details-gallery',
      params: { eventId, returnTo: listReturnTo },
    } as never);
  };

  const emptyText = activeTab === 'upcoming' ? 'No upcoming events available.' : 'No past events available.';

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader title={t('title')} variant="back" />

        <View style={{ paddingHorizontal: spacing[4], backgroundColor: colors.background.DEFAULT }}>
          <Tabs
            variant="underline"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as typeof activeTab)}
            items={[
              { key: 'upcoming', label: t('tabs.upcoming') },
              { key: 'past', label: t('tabs.past') },
            ]}
          />
        </View>

        <InfiniteScrollList
          data={events}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          preserveHeaderOnInitialLoad
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[5], paddingBottom: 110 }}
          renderSkeletonItem={() => <EventListCardSkeleton />}
          ListHeaderComponent={(
            <Text
              variant="h5"
              color={colors.text.primary}
              style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold, opacity: activeTab === 'past' ? 0.6 : 1 }}>
              {activeTab === 'upcoming' ? t('section.thisMonth') : t('section.past')}
            </Text>
          )}
          onRefresh={() => {
            void loadEvents({ refreshing: true });
          }}
          onLoadMore={() => {
            void loadMoreEvents();
          }}
          renderItem={({ item: event }) => (
            <EventListCard
              title={event.title}
              date={event.date}
              location={event.location}
              image={event.image}
              muted={activeTab === 'past'}
              status={activeTab === 'past' ? (event.hasPass ? 'registered' : 'past') : (event.registered ? 'registered' : 'unregistered')}
              hasPass={event.hasPass}
              onRegister={() => openRegistration(event.id)}
              onViewPass={() => router.push({ pathname: '/events/family-event-passes', params: { eventId: event.id, returnTo: listReturnTo } } as never)}
              onDetails={() => openDetails(event.id)}
            />
          )}
          emptyTitle={emptyText}
          emptyDescription=""
        />
      </View>
    </AppSafeAreaView>
  );
}
