import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { eventService, type EventCardRecord } from '@/src/features/events/services/event-service';

export function CommunityUpcomingEvents({ returnTo = '/communication/community-hub' }: { returnTo?: string } = {}) {
  const router = useRouter();
  const [events, setEvents] = useState<EventCardRecord[]>([]);

  useEffect(() => {
    let active = true;
    eventService.loadEventCards()
      .then((records) => {
        if (active) {
          setEvents(records.filter((record) => record.active).slice(0, 5));
        }
      })
      .catch(() => {
        if (active) {
          setEvents([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={{ paddingVertical: spacing[6] }}>
      <View style={{ paddingHorizontal: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
        <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
          Upcoming Events
        </Text>
        <MaterialIcons name="calendar-month" size={24} color="#94a3b8" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[4] }}>
        {events.length === 0 ? (
          <View style={{ width: 288, borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: '#f1f5f9', padding: spacing[5] }}>
            <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
              No upcoming events
            </Text>
            <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], lineHeight: 18 }}>
              New community events will appear here when they are published.
            </Text>
          </View>
        ) : null}
        {events.map((card) => {
          const parsedDate = card.startAt ? new Date(card.startAt) : null;
          const month = parsedDate && !Number.isNaN(parsedDate.getTime()) ? new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(parsedDate) : '';
          const day = parsedDate && !Number.isNaN(parsedDate.getTime()) ? new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(parsedDate) : '';

          return (
          <View key={card.id} style={{ width: 288, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: '#f1f5f9' }}>
            <View style={{ minHeight: 160, backgroundColor: 'rgba(242,120,13,0.06)', padding: spacing[4], justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ minWidth: 45, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: spacing[2], paddingVertical: spacing[1], alignItems: 'center' }}>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
                    {month || 'TBD'}
                  </Text>
                  <Text variant="h5" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                    {day || '--'}
                  </Text>
                </View>
              </View>
              <View>
                <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                  {card.title}
                </Text>
                <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2] }}>
                  {card.date}
                </Text>
              </View>
            </View>
            <View style={{ padding: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="location-on" size={14} color="#64748b" />
                <Text variant="caption" color="#64748b">
                  {card.location}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3], marginBottom: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                  <MaterialIcons name="event-available" size={12} color={colors.primary.DEFAULT} />
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                    {card.registered ? 'Registered' : 'Open'}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push({ pathname: '/events/event-details-registration', params: { eventId: card.id, returnTo } } as never)}
                style={{ width: '100%', borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', paddingVertical: spacing[2], alignItems: 'center' }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                  Register Now
                </Text>
              </Pressable>
            </View>
          </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
