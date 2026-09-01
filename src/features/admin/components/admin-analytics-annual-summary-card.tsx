import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import { formatAnalyticsCurrency, type TenantAnalytics } from '@/src/features/finance/services';

type AdminAnalyticsAnnualSummaryCardProps = {
  analytics?: TenantAnalytics | null;
  analyticsReturnPath?: string;
};

export function AdminAnalyticsAnnualSummaryCard({ analytics, analyticsReturnPath = '/admin/analytics' }: AdminAnalyticsAnnualSummaryCardProps) {
  const router = useRouter();
  const totalIncome = analytics?.profitLoss.totalIncome ?? 0;
  const totalExpenses = analytics?.profitLoss.totalExpenses ?? 0;

  return (
    <View
      style={{
        borderRadius: radius.xl,
        padding: spacing[4],
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        ...shadows.sm,
        minHeight: 240,
        gap: spacing[4],
      }}>
      <View style={{ gap: spacing[3] }}>
        <Text
          variant="caption"
          style={{ color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: typography.fontFamily.bold }}>
          Annual Summary
        </Text>
        <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, lineHeight: 30, marginTop: spacing[2] }}>
          Yearly P&amp;L Statement
        </Text>
        <View style={{ gap: spacing[3], marginTop: spacing[5] }}>
          <View style={{ backgroundColor: colors.background.surfaceAlt, padding: spacing[3], borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight }}>
            <Text style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 10, marginBottom: 4 }}>
              Revenue
            </Text>
            <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {formatAnalyticsCurrency(totalIncome)}
            </Text>
          </View>
          <View style={{ backgroundColor: colors.background.surfaceAlt, padding: spacing[3], borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight }}>
            <Text style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 10, marginBottom: 4 }}>
              Costs
            </Text>
            <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {formatAnalyticsCurrency(totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 'auto', paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() =>
            router.push(
              {
                pathname: '/admin/profit-loss-yearly',
                params: { returnTo: analyticsReturnPath },
              } as never,
            )
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            width: '100%',
            backgroundColor: colors.primary.subtle,
            paddingVertical: spacing[3],
            borderRadius: radius.lg,
          }}>
          <MaterialIcons name="download" size={18} color={colors.primary.DEFAULT} />
          <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            Export PDF Statement
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
