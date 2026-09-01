import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { birthdayFeedService } from '../services/birthday-feed-service';
import { notificationFeedService, type CommunityNotificationFeedItem } from '../services/notification-feed-service';

export type BirthdayFeedItem = {
  id: string;
  name: string;
  meta?: string;
  date?: string;
  image: string;
  city?: string;
};

export type NotificationFeedState = {
  items: CommunityNotificationFeedItem[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

export function useNotificationFeed(): NotificationFeedState {
  const snapshot = useSyncExternalStore(
    notificationFeedService.subscribe,
    notificationFeedService.getSnapshot,
    notificationFeedService.getSnapshot,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const reload = useCallback(() => {
    if (!hasLoadedRef.current && !snapshot.hasHydrated) {
      setIsLoading(true);
    }
    setError(null);
    notificationFeedService
      .refresh()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unable to load notifications');
      })
      .finally(() => {
        hasLoadedRef.current = true;
        setIsLoading(false);
      });
  }, [snapshot.hasHydrated]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { items: snapshot.items, isLoading: isLoading && !snapshot.hasHydrated, error, reload };
}

export function useNotificationSummary(enabled = true) {
  const snapshot = useSyncExternalStore(
    notificationFeedService.subscribe,
    notificationFeedService.getSnapshot,
    notificationFeedService.getSnapshot,
  );
  const refreshSummary = useCallback(() => {
    if (!enabled) {
      return;
    }

    notificationFeedService.refresh().catch(() => {
      return;
    });
  }, [enabled]);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  useFocusEffect(
    useCallback(() => {
      refreshSummary();
      return undefined;
    }, [refreshSummary]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshSummary();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshSummary]);

  return enabled ? snapshot.unreadCount : 0;
}

export function useBirthdayFeed() {
  const [todayItems, setTodayItems] = useState<BirthdayFeedItem[]>([]);
  const [upcomingItems, setUpcomingItems] = useState<BirthdayFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      }
      setErrorMessage(null);

      birthdayFeedService
        .loadBirthdays()
        .then((result) => {
          if (!active) return;
          setTodayItems(result.today);
          setUpcomingItems(result.upcoming);
        })
        .catch((e: unknown) => {
          if (!active) return;
          setTodayItems([]);
          setUpcomingItems([]);
          setErrorMessage(e instanceof Error ? e.message : 'Unable to load birthday reminders.');
        })
        .finally(() => {
          if (active) {
            hasLoadedRef.current = true;
            setIsLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return { todayItems, upcomingItems, isLoading, errorMessage };
}
