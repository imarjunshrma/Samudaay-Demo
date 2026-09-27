import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { EmptyState, SkeletonList, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';
import { type BirthdayFeedItem } from '../hooks/use-communication-feeds';

export function BirthdayUpcomingList({
  items,
  loading = false,
}: {
  items?: BirthdayFeedItem[];
  loading?: boolean;
}) {
  const resolvedItems = items ?? [];
  const [alertedIds, setAlertedIds] = useState<Set<string>>(() => new Set());

  function toggleAlert(id: string) {
    setAlertedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <View
      style={{
        paddingHorizontal: spacing[4],
        paddingTop: spacing[8],
        paddingBottom: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
        <MaterialIcons name="calendar-month" size={18} color="#64748b" />
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Upcoming this week
        </Text>
      </View>
      <View style={{ gap: spacing[2] }}>
        {loading ? (
          <SkeletonList count={3} />
        ) : resolvedItems.length ? resolvedItems.map((item) => {
          const alertEnabled = alertedIds.has(item.id);

          return (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[4],
                borderBottomWidth: 1,
                borderBottomColor: colors.primary.borderLight,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[3],
              }}>
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                style={{ width: 48, height: 48, borderRadius: 999, opacity: 0.8, borderWidth: 2, borderColor: 'rgba(242,120,13,0.2)' }}
              />
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  {item.name}
                </Text>
                <Text variant="caption" color="#64748b" style={{ fontSize: 12 }}>
                  {item.date ?? ''}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${alertEnabled ? 'Remove alert for' : 'Set alert for'} ${item.name}`}
                onPress={() => toggleAlert(item.id)}
                style={({ pressed }) => ({
                  borderRadius: 8,
                  backgroundColor: alertEnabled ? colors.status.successLight : colors.primary.muted,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[2],
                  opacity: pressed ? 0.8 : 1,
                })}>
                <Text
                  variant="caption"
                  color={alertEnabled ? colors.status.success : colors.primary.DEFAULT}
                  style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                  {alertEnabled ? 'Alert Set' : 'Set Alert'}
                </Text>
              </Pressable>
            </View>
          );
        }) : (
          <EmptyState
            icon="event-available"
            title="No upcoming birthdays"
            description="Upcoming birthday reminders will appear here."
            size="sm"
          />
        )}
      </View>
    </View>
  );
}
