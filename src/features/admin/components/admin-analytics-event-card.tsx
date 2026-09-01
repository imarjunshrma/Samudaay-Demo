import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';
import type { TenantAnalytics } from '@/src/features/finance/services';

import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';

type AdminAnalyticsEventCardProps = {
  analytics?: TenantAnalytics | null;
  analyticsReturnPath?: string;
};

export function AdminAnalyticsEventCard({ analytics, analyticsReturnPath = '/admin/analytics' }: AdminAnalyticsEventCardProps) {
  const router = useRouter();
  const t = useTranslations('admin.analytics');
  const attendanceRate = analytics?.events.totalRegisteredUsers
    ? Math.round((analytics.events.totalAttendance / analytics.events.totalRegisteredUsers) * 100)
    : 0;

  return (
    <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
      <View style={{ minHeight: 220, gap: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] }}>
            <MaterialIcons name="event" size={24} color={colors.text.inverse} />
          </View>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: spacing[1] }}>
            {t('event.title')}
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary }}>
            {t('event.description')}
          </Text>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: colors.primary.borderLight, paddingTop: spacing[4], gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[1] }}>
            <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: typography.fontFamily.bold }}>
              {t('event.rate')}
            </Text>
            <Text variant="h4" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
              {attendanceRate}%
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: colors.border.muted, borderRadius: radius.full }}>
            <View style={{ width: `${Math.min(100, attendanceRate)}%`, height: '100%', backgroundColor: colors.primary.DEFAULT, borderRadius: radius.full }} />
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                {
                  pathname: '/admin/event-analytics',
                  params: { returnTo: analyticsReturnPath },
                } as never,
              )
            }
            style={{ marginTop: spacing[4], alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}>
              View Event Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AdminAnalyticsCardShell>
  );
}
