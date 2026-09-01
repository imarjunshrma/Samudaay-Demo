import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';
import { formatAnalyticsCurrency, type TenantAnalytics } from '@/src/features/finance/services';

import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';

type AdminAnalyticsTransactionsCardProps = {
  analytics?: TenantAnalytics | null;
  analyticsReturnPath?: string;
};

export function AdminAnalyticsTransactionsCard({ analytics, analyticsReturnPath = '/admin/analytics' }: AdminAnalyticsTransactionsCardProps) {
  const router = useRouter();
  const rows = (analytics?.transactions.recent ?? []).slice(0, 3);

  return (
    <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
      <View style={{ minHeight: 220, gap: spacing[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            All Transactions
          </Text>
          <MaterialIcons name="open-in-new" size={20} color={colors.text.muted} />
        </View>

        <View style={{ gap: spacing[4], flex: 1 }}>
          {rows.length ? rows.map((row, index) => (
            <View key={`${row.type}-${row.id}`} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: index > 0 ? 0.7 : 1 }}>
              <View style={{ flex: 1, paddingRight: spacing[4] }}>
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {row.title}
                </Text>
                <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: typography.fontFamily.medium, marginTop: 2 }}>
                  {[row.type, row.city, row.status].filter(Boolean).join(' • ')}
                </Text>
              </View>
              <Text variant="h5" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textAlign: 'right' }}>
                {formatAnalyticsCurrency(row.amount)}
              </Text>
            </View>
          )) : (
            <Text variant="body" style={{ color: colors.text.muted }}>
              No financial transactions found for the selected financial year.
            </Text>
          )}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() =>
            router.push(
              {
                pathname: '/admin/transaction-management',
                params: { returnTo: analyticsReturnPath },
              } as never,
            )
          }
          style={{ paddingTop: spacing[4], alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
          <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}>
            View Entire Ledger
          </Text>
        </TouchableOpacity>
      </View>
    </AdminAnalyticsCardShell>
  );
}
