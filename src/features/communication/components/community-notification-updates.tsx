import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { NotificationCard, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';
import { notificationFeedService, type CommunityNotificationFeedItem } from '../services/notification-feed-service';

const MAX_ITEMS = 4;

export function CommunityNotificationUpdates() {
  const router = useRouter();
  const [items, setItems] = useState<CommunityNotificationFeedItem[]>([]);

  useEffect(() => {
    let active = true;

    void notificationFeedService.loadNotifications()
      .then((records) => {
        if (active) {
          setItems(records.slice(0, MAX_ITEMS));
        }
      })
      .catch(() => {
        if (active) {
          setItems([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[6] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
        <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
          Community Updates
        </Text>
        <Pressable onPress={() => router.push('/member/notifications' as never)} accessibilityRole="button" hitSlop={8}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
            View All
          </Text>
        </Pressable>
      </View>
      <View style={{ gap: spacing[3] }}>
        {items.map((item) => (
          <NotificationCard
            key={item.id}
            title={item.title}
            description={item.desc}
            time={item.time}
            image={item.image}
            icon={item.icon as never}
            tag={item.type === 'birthday_greeting' ? 'Birthday' : 'Update'}
            variant={item.unread ? 'unread' : 'muted'}
            onPress={() => {
              void notificationFeedService.markNotificationRead(item.id);
              router.push({
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
                  returnTo: '/member/community',
                },
              } as never);
            }}
          />
        ))}
      </View>
    </View>
  );
}
