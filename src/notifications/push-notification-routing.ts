import { apiConfig } from '@/src/constants';
import type { RemoteNotificationPayload } from '@/src/services/firebase/messaging';

type NotificationRouteContext = {
  isAdminLike?: boolean;
};

const ALLOWED_NOTIFICATION_ROUTE_PREFIXES = [
  '/admin',
  '/communication',
  '/dashboard',
  '/events',
  '/finance',
  '/matrimony',
  '/member',
  '/profile',
] as const;

function resolveBackendMediaUrl(fileUrl?: string) {
  if (!fileUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function isAllowedNotificationRoute(route: string) {
  return ALLOWED_NOTIFICATION_ROUTE_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}

function getFallbackNotificationRoute(screen?: string) {
  return screen?.startsWith('/admin') ? '/admin/notifications' : '/member/notifications';
}

export function resolveNotificationRoute(payload: RemoteNotificationPayload, context?: NotificationRouteContext) {
  const { data, title, body } = payload;
  const type = String(data.type || '').toLowerCase();
  const chatContext = String(data.chatContext || '').toLowerCase();

  if (type === 'community_new_donation' || type === 'donation_recorded') {
    return context?.isAdminLike ? '/admin/manage-donations' : '/member/notifications';
  }

  if ((type === 'matrimony_request_accepted' || type === 'chat_message_received') && data.chatId && chatContext === 'matrimony') {
    return {
      pathname: '/events/event-live-chat',
      params: {
        chatId: data.chatId,
        chatTitle: data.chatTitle || title || 'Matrimony chat',
        chatContext: 'matrimony',
        profileId: data.profileId || '',
      },
    };
  }

  if (data.screen?.startsWith('/') && isAllowedNotificationRoute(data.screen)) {
    return data.screen;
  }

  if (type === 'birthday_daily_reminder') {
    return context?.isAdminLike ? '/admin/birthday-reminders' : '/member/birthday-reminders';
  }
  if (type === 'birthday_greeting') {
    return {
      pathname: '/member/notification-detail',
      params: {
        notificationId: payload.id || data.notificationId || '',
        title,
        message: body,
        image: resolveBackendMediaUrl(data.image),
        senderName: data.senderName || '',
        greetingId: data.greetingId || '',
        templateId: data.templateId || '',
        tag: 'Birthday',
        returnTo: getFallbackNotificationRoute(data.screen),
      },
    };
  }

  return getFallbackNotificationRoute(data.screen);
}
