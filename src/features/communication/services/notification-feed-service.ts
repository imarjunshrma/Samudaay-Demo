import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { apiConfig } from '@/src/constants';
import type { RemoteNotificationPayload } from '@/src/services/firebase/messaging';

export type NotificationDateGroup = 'today' | 'yesterday' | 'older';

export type CommunityNotificationFeedItem = {
  id: string;
  title: string;
  time: string;
  desc: string;
  image?: string;
  icon?: string;
  unread?: boolean;
  muted?: boolean;
  dateGroup: NotificationDateGroup;
  type?: string;
  senderName?: string;
  greetingId?: string;
  templateId?: string;
  screen?: string;
  chatId?: string;
  chatTitle?: string;
  chatContext?: string;
  profileId?: string;
};

export type NotificationFeedPageResponse = {
  items: CommunityNotificationFeedItem[];
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

function getDateGroup(iso?: string | null): NotificationDateGroup {
  if (!iso) return 'today';
  const date = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  if (date >= todayStart) return 'today';
  if (date >= yesterdayStart) return 'yesterday';
  return 'older';
}

function formatRelativeTime(iso?: string | null) {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(Math.floor(diffMs / 60000), 0);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) return undefined;
  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
    return fileUrl;
  }
  return `${apiConfig.baseUrl}${fileUrl}`;
}

type RawNotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  dataJson?: {
    icon?: string;
    image?: string;
    imageUrl?: string;
    type?: string;
    senderName?: string;
    greetingId?: string;
    templateId?: string;
    screen?: string;
    chatId?: string;
    chatTitle?: string;
    chatContext?: string;
    profileId?: string;
  } | string | null;
};

type NotificationData = {
  icon?: string;
  image?: string;
  imageUrl?: string;
  type?: string;
  senderName?: string;
  greetingId?: string;
  templateId?: string;
  screen?: string;
  chatId?: string;
  chatTitle?: string;
  chatContext?: string;
  profileId?: string;
};

type NotificationFeedSnapshot = {
  items: CommunityNotificationFeedItem[];
  unreadCount: number;
  hasHydrated: boolean;
};

type NotificationFeedListener = () => void;

const listeners = new Set<NotificationFeedListener>();
let cachedItems: CommunityNotificationFeedItem[] = [];
let cachedUnreadCount = 0;
let hasHydrated = false;
let inflightRefresh: Promise<CommunityNotificationFeedItem[]> | null = null;
let currentSnapshot: NotificationFeedSnapshot = {
  items: cachedItems,
  unreadCount: cachedUnreadCount,
  hasHydrated,
};

function sortNotificationItems(items: RawNotificationItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function normalizeNotificationData(
  value: RawNotificationItem['dataJson'],
): NotificationData {
  if (!value) {
    return {};
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as NotificationData;
      return typeof parsed === 'object' && parsed ? parsed : {};
    } catch {
      return {};
    }
  }

  return value;
}

function getUnreadCount(items: CommunityNotificationFeedItem[]) {
  return items.reduce((count, item) => count + (item.unread ? 1 : 0), 0);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateSnapshot() {
  currentSnapshot = {
    items: cachedItems,
    unreadCount: cachedUnreadCount,
    hasHydrated,
  };
}

function setCachedItems(items: CommunityNotificationFeedItem[], unreadCount = getUnreadCount(items)) {
  cachedItems = items;
  cachedUnreadCount = Math.max(0, unreadCount);
  hasHydrated = true;
  updateSnapshot();
  emitChange();
}

function buildNotificationItem(item: RawNotificationItem): CommunityNotificationFeedItem {
  const data = normalizeNotificationData(item.dataJson);
  const resolvedImage = resolveBackendMediaUrl(
    data.image || data.imageUrl || item.image || item.imageUrl,
  );

  return {
    id: item.id,
    title: item.title,
    desc: item.body,
    time: formatRelativeTime(item.createdAt),
    image: resolvedImage,
    icon: data.icon ?? 'notifications',
    unread: !item.readAt,
    muted: Boolean(item.readAt),
    dateGroup: getDateGroup(item.createdAt),
    type: data.type,
    senderName: data.senderName,
    greetingId: data.greetingId,
    templateId: data.templateId,
    screen: data.screen,
    chatId: data.chatId,
    chatTitle: data.chatTitle,
    chatContext: data.chatContext,
    profileId: data.profileId,
  };
}

async function fetchNotificationsFromServer(): Promise<CommunityNotificationFeedItem[]> {
  if (!isBackendApiConfigured()) return [];
  const backendSession = await getBackendSessionContext();
  if (!backendSession) return [];

  const response = await apiClient<{ data: { items: RawNotificationItem[] } }>(
    `${apiEndpoints.communityNotifications(backendSession.tenantId)}?limit=50`,
    { token: backendSession.token },
  );

  return sortNotificationItems(response.data.items ?? []).map(buildNotificationItem);
}

async function fetchUnreadCountFromServer(): Promise<number> {
  if (!isBackendApiConfigured()) return 0;
  const backendSession = await getBackendSessionContext();
  if (!backendSession) return 0;

  const response = await apiClient<{
    data: RawNotificationItem[];
    pagination?: NotificationFeedPageResponse['pagination'];
  }>(
    `${apiEndpoints.communityNotifications(backendSession.tenantId)}?page=1&limit=1&unreadOnly=true`,
    { token: backendSession.token },
  );

  if (response.pagination && typeof response.pagination.total === 'number') {
    return response.pagination.total;
  }

  return Array.isArray(response.data) ? response.data.length : 0;
}

async function refreshNotifications(): Promise<CommunityNotificationFeedItem[]> {
  if (inflightRefresh) {
    return inflightRefresh;
  }

  inflightRefresh = Promise.all([
    fetchNotificationsFromServer(),
    fetchUnreadCountFromServer(),
  ])
    .then(([items, unreadCount]) => {
      setCachedItems(items, unreadCount);
      return items;
    })
    .catch((error) => {
      hasHydrated = true;
      updateSnapshot();
      emitChange();
      throw error;
    })
    .finally(() => {
      inflightRefresh = null;
    });

  return inflightRefresh;
}

export const notificationFeedService = {
  subscribe(listener: NotificationFeedListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): NotificationFeedSnapshot {
    return currentSnapshot;
  },

  async refresh() {
    return refreshNotifications();
  },

  async loadNotificationSummary(): Promise<{ unreadCount: number }> {
    if (!hasHydrated) {
      try {
        await refreshNotifications();
      } catch {
        return { unreadCount: 0 };
      }
    }

    return {
      unreadCount: cachedUnreadCount,
    };
  },

  async loadNotifications(): Promise<CommunityNotificationFeedItem[]> {
    if (!hasHydrated) {
      try {
        return await refreshNotifications();
      } catch {
        return [];
      }
    }

    return cachedItems;
  },
  async loadNotificationPage(params?: {
    page?: number;
    limit?: number;
    search?: string;
    unreadOnly?: boolean;
  }): Promise<NotificationFeedPageResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.unreadOnly) query.set('unreadOnly', 'true');

    const response = await apiClient<{
      data: RawNotificationItem[];
      pagination?: NotificationFeedPageResponse['pagination'];
    }>(
      `${apiEndpoints.communityNotifications(backendSession.tenantId)}?${query.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: sortNotificationItems(response.data ?? []).map(buildNotificationItem),
      pagination: response.pagination ?? null,
    };
  },

  ingestIncomingNotification(payload: RemoteNotificationPayload) {
    const title = payload.title?.trim() || 'Notification';
    const body = payload.body?.trim() || '';
    const nextItem: CommunityNotificationFeedItem = {
      id: payload.id || payload.data.notificationId || `local-${Date.now().toString(36)}`,
      title,
      desc: body,
      time: 'Just now',
      image: resolveBackendMediaUrl(payload.data.image),
      icon: payload.data.icon || 'notifications',
      unread: true,
      muted: false,
      dateGroup: 'today',
      type: payload.data.type,
      senderName: payload.data.senderName || undefined,
      greetingId: payload.data.greetingId || undefined,
      templateId: payload.data.templateId || undefined,
    };

    const dedupedItems = cachedItems.filter((item) => {
      if ((payload.id && item.id === payload.id) || (payload.data.notificationId && item.id === payload.data.notificationId)) {
        return false;
      }

      return !(item.title === title && item.desc === body && item.time === 'Just now');
    });

    cachedItems = [nextItem, ...dedupedItems].slice(0, 50);
    cachedUnreadCount += 1;
    hasHydrated = true;
    updateSnapshot();
    emitChange();
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    if (!notificationId) {
      return;
    }

    const existingItem = cachedItems.find((item) => item.id === notificationId);
    const previousItems = cachedItems;
    const previousUnreadCount = cachedUnreadCount;
    const shouldOptimisticallyUpdate = Boolean(existingItem?.unread);

    if (shouldOptimisticallyUpdate) {
      cachedItems = cachedItems.map((item) => (
        item.id === notificationId
          ? { ...item, unread: false, muted: true }
          : item
      ));
      cachedUnreadCount = Math.max(0, cachedUnreadCount - 1);
      hasHydrated = true;
      updateSnapshot();
      emitChange();
    }

    if (!isBackendApiConfigured()) return;
    const backendSession = await getBackendSessionContext();
    if (!backendSession) return;

    try {
      await apiClient(
        apiEndpoints.communityNotificationRead(backendSession.tenantId, notificationId),
        { method: 'POST', token: backendSession.token },
      );
    } catch {
      if (shouldOptimisticallyUpdate) {
        cachedItems = previousItems;
        cachedUnreadCount = previousUnreadCount;
        updateSnapshot();
        emitChange();
      }
    }
  },

  async markAllRead(): Promise<void> {
    const previousItems = cachedItems;
    const previousUnreadCount = cachedUnreadCount;
    cachedItems = cachedItems.map((item) => ({
      ...item,
      unread: false,
      muted: true,
    }));
    cachedUnreadCount = 0;
    hasHydrated = true;
    updateSnapshot();
    emitChange();

    if (!isBackendApiConfigured()) return;
    const backendSession = await getBackendSessionContext();
    if (!backendSession) return;
    try {
      await apiClient(
        apiEndpoints.communityNotificationsReadAll(backendSession.tenantId),
        { method: 'POST', token: backendSession.token },
      );
    } catch {
      cachedItems = previousItems;
      cachedUnreadCount = previousUnreadCount;
      updateSnapshot();
      emitChange();
    }
  },
};
