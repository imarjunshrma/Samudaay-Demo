import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { useBirthdayFeed } from '../hooks/use-communication-feeds';

export function BirthdaySummaryCard() {
  const t = useTranslations('communication.birthday-reminders');
  const { todayItems, isLoading } = useBirthdayFeed();
  const birthdayCount = todayItems.length;

  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6], backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
        <MaterialIcons name="celebration" size={20} color={colors.primary.DEFAULT} />
        <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>
          Today&apos;s Birthdays
        </Text>
      </View>
      {isLoading ? (
        <SkeletonBlock width="72%" height={14} style={{ marginTop: 2 }} />
      ) : (
        <Text variant="body" color={colors.text.secondary} style={{ fontSize: 14 }}>
          {birthdayCount ? t('summary.todayActive') : t('summary.noneToday')}
        </Text>
      )}
    </View>
  );
}
