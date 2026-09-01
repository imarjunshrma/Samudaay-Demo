import { Image, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { EmptyState, SkeletonList, Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { useTranslations } from '@/src/i18n/use-translations';
import { type BirthdayFeedItem, useBirthdayFeed } from '../hooks/use-communication-feeds';

export function BirthdayTodayList({
  onWishPress,
  compact = false,
  items,
  loading = false,
  wishedRecipientIds = [],
  scheduledRecipientIds = [],
  currentUserId,
}: {
  onWishPress?: (item: BirthdayFeedItem) => void;
  compact?: boolean;
  items?: ReturnType<typeof useBirthdayFeed>['todayItems'];
  loading?: boolean;
  wishedRecipientIds?: string[];
  scheduledRecipientIds?: string[];
  currentUserId?: string | null;
}) {
  const t = useTranslations('communication.birthday-reminders');
  const fallbackFeed = useBirthdayFeed();
  const resolvedItems = items ?? fallbackFeed.todayItems;
  const wishedRecipientIdSet = new Set(wishedRecipientIds);
  const scheduledRecipientIdSet = new Set(scheduledRecipientIds);

  return (
    <View
      style={{
        gap: spacing[3],
        marginTop: spacing[4],
        paddingHorizontal: compact ? 0 : spacing[4],
      }}>
      {loading ? (
        <SkeletonList count={2} />
      ) : resolvedItems.length ? resolvedItems.map((item) => {
        const isSelf = Boolean(currentUserId) && item.id === currentUserId;
        const wished = wishedRecipientIdSet.has(item.id);
        const scheduled = scheduledRecipientIdSet.has(item.id);
        const actionLocked = wished || scheduled;
        const ageLabel = t('list.turningToday').replace('{age}', item.meta?.match(/\d+/)?.[0] ?? '').trim();

        return (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[4],
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: 'rgba(242,120,13,0.05)',
              backgroundColor: '#ffffff',
              padding: spacing[4],
              shadowColor: '#000',
              shadowOpacity: 0.03,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.full,
                  borderWidth: 2,
                  borderColor: 'rgba(242,120,13,0.2)',
                }}
              />
            ) : (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.full,
                  borderWidth: 2,
                  borderColor: 'rgba(242,120,13,0.2)',
                  backgroundColor: colors.primary.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons name="person" size={28} color={colors.primary.DEFAULT} />
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                {item.name}
              </Text>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                {ageLabel}
              </Text>
            </View>
            {isSelf ? null : (
              <TouchableOpacity
                accessibilityRole="button"
                disabled={actionLocked}
                onPress={actionLocked ? undefined : () => onWishPress?.(item)}
                activeOpacity={0.88}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  borderRadius: radius.lg,
                  backgroundColor: '#f2780d',
                  minWidth: 92,
                  height: 36,
                  marginLeft: 'auto',
                  paddingHorizontal: spacing[4],
                  flexShrink: 0,
                  opacity: actionLocked ? 0.96 : 1,
                }}>
                <MaterialIcons
                  name={wished ? 'check-circle' : scheduled ? 'schedule-send' : 'send'}
                  size={14}
                  color="#ffffff"
                />
                <Text
                  variant="caption"
                  color="#ffffff"
                  style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                  {wished ? t('actions.wished') : scheduled ? t('admin.activity.status.Scheduled') : t('actions.wish')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }) : (
        <EmptyState
          icon="cake"
          title={t('empty.today.title')}
          description={t('empty.today.description')}
          size="sm"
        />
      )}
    </View>
  );
}
