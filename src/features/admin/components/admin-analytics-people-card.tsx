import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';

export function AdminAnalyticsPeopleCard({ analyticsReturnPath = '/admin/analytics' }: { analyticsReturnPath?: string }) {
  const router = useRouter();
  const t = useTranslations('admin.analytics');
  return (
    <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
      <View style={{ minHeight: 220, gap: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="group" size={28} color={colors.text.inverse} />
            </View>
            <View
              style={{
                backgroundColor: colors.primary.muted,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
                borderRadius: radius.full,
              }}>
              <Text style={{ color: colors.primary.dark, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                {t('people.badge')}
              </Text>
            </View>
          </View>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginTop: spacing[3] }}>
            {t('people.title')}
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary, marginTop: spacing[1], maxWidth: 320 }}>
            {t('people.description')}
          </Text>
        </View>

        <View style={{ gap: spacing[3], paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => router.push('/admin/manage-directory' as never)}
            style={{ backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderRadius: radius.lg, alignItems: 'center' }}>
            <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {t('people.actions.review')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                {
                  pathname: '/admin/people-analytics',
                  params: { returnTo: analyticsReturnPath },
                } as never,
              )
            }
            style={{ paddingVertical: spacing[1], alignItems: 'center' }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
              {t('people.actions.growth')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AdminAnalyticsCardShell>
  );
}
