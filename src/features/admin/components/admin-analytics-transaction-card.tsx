import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';
import { formatAnalyticsCurrency, type TenantAnalytics } from '@/src/features/finance/services';

import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';

type AdminAnalyticsTransactionCardProps = {
  analytics?: TenantAnalytics | null;
  analyticsReturnPath?: string;
};

export function AdminAnalyticsTransactionCard({
  analytics,
  analyticsReturnPath = '/admin/analytics',
}: AdminAnalyticsTransactionCardProps) {
  const router = useRouter();
  const totalIncome = analytics?.transactions.totalIncome ?? 0;
  const totalExpense = analytics?.transactions.totalExpense ?? 0;
  const netProfit = analytics?.transactions.netProfit ?? 0;

  return (
    <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
      <View style={{ minHeight: 220, gap: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] }}>
            <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="payments" size={24} color={colors.text.inverse} />
            </View>
            <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              Transaction Analytics
            </Text>
          </View>
          <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
            Income, approved expenses, and net movement across donations, events, matrimony, and community expenses.
          </Text>
        </View>

        <View style={{ gap: spacing[2], paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
          <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {formatAnalyticsCurrency(totalIncome)}
          </Text>
          <Text variant="caption" style={{ color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: typography.fontFamily.bold, marginTop: spacing[1] }}>
            Expense {formatAnalyticsCurrency(totalExpense)} / Net {formatAnalyticsCurrency(netProfit)}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                {
                  pathname: '/admin/transaction-analytics',
                  params: { returnTo: analyticsReturnPath },
                } as never,
              )
            }
            style={{ marginTop: spacing[4], alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}>
              View Transaction Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AdminAnalyticsCardShell>
  );
}
