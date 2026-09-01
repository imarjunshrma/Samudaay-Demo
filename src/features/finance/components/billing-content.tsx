import { useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { ScrollView, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { AnalyticsChartCard, AppHeader, Button, Card, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, spacing, typography } from '@/src/theme';

import {
  billingInvoices,
  transactionTrendHeights,
  transactionTrendLabels,
} from '../constants';

import {
  BillingBottomBar,
  BillingClientTiersCard,
  BillingInvoiceRow,
  BillingRevenueCard,
  BillingRenewalSpotlightCard,
  BillingTopBar,
  EventAnalyticsSummaryCard,
  TransactionManagementSummaryCard,
  TransactionAnalyticsMetricCard,
  TransactionAnalyticsRow,
  TransactionManagementFilterBar,
  TransactionManagementRow,
} from './finance-blocks';

export function BillingContent() {
  const router = useRouter();
  const t = useTranslations('finance.billing');

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <BillingTopBar />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 76, paddingBottom: 120, flexGrow: 1 }}>
          <View style={{ paddingHorizontal: spacing[4], gap: spacing[8] }}>
            <View style={{ gap: spacing[3] }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2 }}>
                {t('eyebrow')}
              </Text>
              <Text variant="h1" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.regular, fontSize: 40, lineHeight: 44 }}>
                {t('title.prefix')} <Text style={{ fontStyle: 'italic' }}>{t('title.italic')}</Text>
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary, maxWidth: 320 }}>
                {t('description')}
              </Text>
            </View>

            <BillingRevenueCard />

            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <View style={{ flex: 1, borderRadius: 20, padding: spacing[4], backgroundColor: colors.background.elevated, borderBottomWidth: 2, borderBottomColor: colors.border.muted }}>
                <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  {t('stats.renewals')}
                </Text>
                <Text variant="h2" style={{ marginTop: spacing[1], color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  14
                </Text>
                <View style={{ marginTop: spacing[2], flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                  <MaterialIcons name="event-repeat" size={14} color={colors.primary.DEFAULT} />
                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                    {t('stats.renewals.window')}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, borderRadius: 20, padding: spacing[4], backgroundColor: colors.background.surfaceAlt, borderBottomWidth: 2, borderBottomColor: colors.border.muted }}>
                <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  {t('stats.outstanding')}
                </Text>
                <Text variant="h2" style={{ marginTop: spacing[1], color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  $3,210
                </Text>
                <View style={{ marginTop: spacing[2], flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                  <MaterialIcons name="error" size={14} color={colors.status.error} />
                  <Text variant="caption" style={{ color: colors.status.error, fontFamily: typography.fontFamily.bold }}>
                    {t('stats.overdue')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {t('section.recentInvoices')}
              </Text>
              <View style={{ gap: spacing[3] }}>
                {billingInvoices.map(([title, code, amount, status], index) => (
                  <BillingInvoiceRow
                    key={code}
                    title={title}
                    code={`${code} • ${index === 0 ? t('dates.one') : index === 1 ? t('dates.two') : t('dates.three')}`}
                    amount={amount}
                    status={status}
                    icon={index === 1 ? 'warning' : 'description'}
                    warning={index === 1}
                  />
                ))}
              </View>
            </View>

            <View style={{ gap: spacing[4] }}>
              <BillingClientTiersCard />
              <BillingRenewalSpotlightCard />
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50 }}>
          <BillingBottomBar
            activeKey="billing"
              onChange={(key) => {
                switch (key) {
                case 'clients':
                  router.push('/admin/manage-directory' as never);
                  break;
                case 'configs':
                  router.push('/admin/roles' as never);
                  break;
                case 'billing':
                  router.push('/finance/billing' as never);
                  break;
                case 'audit':
                  router.push('/finance/finance-analytics' as never);
                  break;
              }
            }}
          />
        </View>
      </View>
    </AppSafeAreaView>
  );
}
