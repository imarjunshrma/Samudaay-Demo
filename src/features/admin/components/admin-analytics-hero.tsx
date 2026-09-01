import { View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import type { TenantAnalytics } from '@/src/features/finance/services';

import { colors, radius, spacing, typography } from '@/src/theme';

type AdminAnalyticsHeroProps = {
  analytics?: TenantAnalytics | null;
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value || 0);
}

export function AdminAnalyticsHero({ analytics }: AdminAnalyticsHeroProps) {
  const registeredProfiles = analytics?.people.totalRegisteredPeople
    ?? analytics?.people.byCity.reduce((total, item) => total + item.value, 0)
    ?? 0;
  const netBalance = analytics?.transactions.netProfit ?? 0;
  const hasPositiveBalance = netBalance >= 0;

  return (
    <View
      style={{
        gap: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
      }}>
      <View style={{ gap: spacing[2] }}>
        <Text
          variant="caption"
          color={colors.primary.DEFAULT}
          style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
          Admin Overview
        </Text>
        <Text
          variant="h3"
          style={{
            color: colors.text.primary,
            fontFamily: typography.fontFamily.bold,
          }}>
          Community analytics
        </Text>
        <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
          Review registrations, events, transactions, and matrimony activity from a single admin summary.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        <View
          style={{
            flex: 1,
            minWidth: 168,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[3],
            backgroundColor: colors.background.surfaceAlt,
            padding: spacing[3],
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
          }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="groups" size={22} color={colors.text.inverse} />
          </View>
          <View>
            <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.medium }}>
              Registered Profiles
            </Text>
            <Text variant="h4" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {formatCompactNumber(registeredProfiles)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 168,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[3],
            backgroundColor: colors.background.surfaceAlt,
            padding: spacing[3],
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
          }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: hasPositiveBalance ? colors.status.success : colors.status.error,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name={hasPositiveBalance ? 'trending-up' : 'trending-down'} size={22} color={colors.text.inverse} />
          </View>
          <View>
            <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.medium }}>
              Net Balance
            </Text>
            <Text variant="h4" style={{ color: hasPositiveBalance ? colors.status.success : colors.status.error, fontFamily: typography.fontFamily.bold }}>
              {analytics ? `₹${netBalance.toLocaleString('en-IN')}` : '₹0'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
