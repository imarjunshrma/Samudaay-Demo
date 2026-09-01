import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ErrorState, NotificationCard, Text } from '@/src/components';
import { SkeletonCard } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import type { CommunityNotificationFeedItem, NotificationDateGroup } from '../services/notification-feed-service';

type Props = {
  items: CommunityNotificationFeedItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  filterUnread?: boolean;
  returnTo?: string;
  detailPath?: '/member/notification-detail' | '/admin/notification-detail';
};

const GROUP_ORDER: NotificationDateGroup[] = ['today', 'yesterday', 'older'];

export function NotificationFeedSection({
  items,
  isLoading,
  error,
  onRetry,
  filterUnread = false,
  returnTo,
  detailPath = '/member/notification-detail',
}: Props) {
  const t = useTranslations('communication.notifications');
  const router = useRouter();

  function openNotification(item: CommunityNotificationFeedItem) {
    const normalizedType = String(item.type || '').toLowerCase();
    const normalizedContext = String(item.chatContext || '').toLowerCase();

    if ((normalizedType === 'matrimony_request_accepted' || normalizedType === 'chat_message_received') && item.chatId && normalizedContext === 'matrimony') {
      router.push({
        pathname: '/events/event-live-chat',
        params: {
          chatId: item.chatId,
          chatTitle: item.chatTitle || item.title,
          chatContext: 'matrimony',
          profileId: item.profileId || '',
        },
      } as never);
      return;
    }

    router.push({
      pathname: detailPath,
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
        returnTo: returnTo ?? '/member/notifications',
      },
    } as never);
  }

  if (isLoading) {
    return (
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonCard key={index} showAvatar lines={2} footer />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: spacing[4] }}>
        <ErrorState title={t('errors.loadFailed')} description={error} onRetry={onRetry} />
      </View>
    );
  }

  const visibleItems = filterUnread ? items.filter((item) => item.unread) : items;

  if (!visibleItems.length) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: spacing[12], gap: spacing[3] }}>
        <MaterialIcons name="notifications-none" size={48} color={colors.text.muted} />
        <Text variant="h5" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
          {t('errors.emptyTitle')}
        </Text>
        <Text variant="body" color={colors.text.muted} style={{ textAlign: 'center', paddingHorizontal: spacing[8] }}>
          {t('errors.emptyDescription')}
        </Text>
      </View>
    );
  }

  const grouped = GROUP_ORDER.reduce<Record<NotificationDateGroup, CommunityNotificationFeedItem[]>>(
    (acc, group) => {
      acc[group] = visibleItems.filter((item) => item.dateGroup === group);
      return acc;
    },
    { today: [], yesterday: [], older: [] },
  );

  const groupLabels: Record<NotificationDateGroup, string> = {
    today: t('feed.today'),
    yesterday: t('feed.yesterday'),
    older: t('feed.older'),
  };

  return (
    <>
      {GROUP_ORDER.map((group) => {
        const groupItems = grouped[group];
        if (!groupItems.length) return null;
        return (
          <View key={group}>
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
              {groupLabels[group]}
            </Text>
            <View style={{ paddingHorizontal: spacing[4], gap: spacing[2] }}>
              {groupItems.map((item, index) => (
                <NotificationCard
                  key={item.id ?? `${group}-${index}`}
                  title={item.title}
                  description={item.desc}
                  time={item.time}
                  image={item.image}
                  icon={item.icon as never}
                  variant={item.unread ? 'unread' : 'muted'}
                  onPress={() => openNotification(item)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
}
