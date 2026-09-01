import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, type barDataItem } from 'react-native-gifted-charts';
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeader, CardGridSkeleton, ListRowSkeleton, SelectionPopup, StatCardSkeleton } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { Text } from '@/src/components/ui/Text/Text';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { BreakdownRow, ProfitLossExpenseItem, ProfitLossSummaryCard, ProfitLossYearlyIncomeCard } from './finance-blocks';
import { analyticsService, formatAnalyticsCurrency, type TenantAnalytics } from '../services';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '../services/analytics-report-service';

type YearlyFilter = `FY ${number}-${string}` | 'All Time';

function getCurrentFinancialYearLabel(now = new Date()) {
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `FY ${year}-${String(year + 1).slice(-2)}`;
}

function buildYearlyFilters(now = new Date()): YearlyFilter[] {
  const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return [
    `FY ${currentYear}-${String(currentYear + 1).slice(-2)}`,
    `FY ${currentYear - 1}-${String(currentYear).slice(-2)}`,
    `FY ${currentYear - 2}-${String(currentYear - 1).slice(-2)}`,
    'All Time',
  ];
}

function resolveYearFilterRange(selectedYear: YearlyFilter) {
  if (selectedYear === 'All Time') {
    return {
      startDate: '2000-01-01',
      endDate: new Date().toISOString().slice(0, 10),
    };
  }

  const match = /^FY (\d{4})-(\d{2})$/.exec(selectedYear);
  if (!match) {
    return {};
  }

  const startYear = Number(match[1]);
  const endYear = Number(`20${match[2]}`);

  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
  };
}

export function ProfitLossScreenContent({
  variant = 'yearly',
}: {
  variant?: 'yearly' | 'event';
}) {
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.profit-loss');
  const defaultYear = getCurrentFinancialYearLabel() as YearlyFilter;
  const yearlyFilters = buildYearlyFilters();
  const [selectedYear, setSelectedYear] = useState<YearlyFilter>(getCurrentFinancialYearLabel() as YearlyFilter);
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadAnalytics = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const result = await analyticsService.loadTenantAnalytics(variant === 'yearly' ? resolveYearFilterRange(selectedYear) : undefined);
      setAnalytics(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.load'));
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [selectedYear, t, variant]);

  useFocusEffect(
    useCallback(() => {
      setShowExportPopup(false);
      if (variant === 'yearly') {
        setSelectedYear(defaultYear);
      }
      return undefined;
    }, [defaultYear, variant]),
  );

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const handleYearlyShare = useCallback(async () => {
    const message = [
      t('yearly.title'),
      analytics?.filters.financialYear ? `Financial year: ${analytics.filters.financialYear}` : null,
      `Income: ${formatAnalyticsCurrency(analytics?.profitLoss.totalIncome ?? 0)}`,
      `Expenses: ${formatAnalyticsCurrency(analytics?.profitLoss.totalExpenses ?? 0)}`,
      `Net profit: ${formatAnalyticsCurrency(analytics?.profitLoss.netProfit ?? 0)}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.share({
        title: t('yearly.title'),
        message,
      });
    } catch (shareError) {
      Alert.alert(t('errors.shareTitle'), shareError instanceof Error ? shareError.message : t('errors.shareYearlyDescription'));
    }
  }, [analytics, t]);

  const handleEventShare = useCallback(async () => {
    const message = [
      t('event.title'),
      `Income: ${formatAnalyticsCurrency(analytics?.events.totalIncome ?? 0)}`,
      `Expenses: ${formatAnalyticsCurrency(analytics?.events.totalExpense ?? 0)}`,
      `Net profit: ${formatAnalyticsCurrency(analytics?.events.netProfit ?? 0)}`,
    ].join('\n');

    try {
      await Share.share({
        title: t('event.title'),
        message,
      });
    } catch (shareError) {
      Alert.alert(t('errors.shareTitle'), shareError instanceof Error ? shareError.message : t('errors.shareEventDescription'));
    }
  }, [analytics, t]);

  const eventIncomeBreakdown = (analytics?.events.recent ?? [])
    .filter((item) => item.income > 0)
    .sort((left, right) => right.income - left.income)
    .slice(0, 4);
  const eventExpenseBreakdown = (analytics?.events.recent ?? [])
    .filter((item) => item.expense > 0)
    .sort((left, right) => right.expense - left.expense)
    .slice(0, 4);

  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      Alert.alert('Export unavailable', 'Analytics data is not available yet.');
      return;
    }

    try {
      if (variant === 'event') {
        await downloadAnalyticsReport({
          title: t('event.title'),
          subtitle: t('event.subtitle'),
          fileBaseName: 'event-profit-loss-statement',
          format: exportFormat,
          summary: [
            { label: t('event.summary.income'), value: formatAnalyticsCurrency(analytics.events.totalIncome) },
            { label: t('event.summary.expenses'), value: formatAnalyticsCurrency(analytics.events.totalExpense) },
            { label: t('event.summary.netProfit'), value: formatAnalyticsCurrency(analytics.events.netProfit) },
          ],
          tables: [
            {
              title: 'Recent Event Income',
              columns: ['Event', 'Registrations', 'Attendance', 'Income'],
              rows: eventIncomeBreakdown.map((item) => [item.title, item.registrations, item.attendance, formatAnalyticsCurrency(item.income)]),
            },
            {
              title: 'Recent Event Expenses',
              columns: ['Event', 'Registrations', 'Add-ons', 'Expense'],
              rows: eventExpenseBreakdown.map((item) => [item.title, item.registrations, item.addonUsage, formatAnalyticsCurrency(item.expense)]),
            },
          ],
        });
      } else {
        await downloadAnalyticsReport({
          title: t('yearly.title'),
          subtitle: analytics.filters.financialYear,
          fileBaseName: `yearly-profit-loss-${selectedYear.toLowerCase().replace(/\s+/g, '-')}`,
          format: exportFormat,
          summary: [
            { label: t('yearly.summary.income'), value: formatAnalyticsCurrency(analytics.profitLoss.totalIncome) },
            { label: t('yearly.summary.expenses'), value: formatAnalyticsCurrency(analytics.profitLoss.totalExpenses) },
            { label: 'Net Profit / Loss', value: formatAnalyticsCurrency(analytics.profitLoss.netProfit) },
          ],
          sections: [
            {
              title: t('yearly.incomeSection'),
              items: (analytics.profitLoss.categories ?? [])
                .filter((item) => item.label !== 'Expenses')
                .map((item) => ({
                  label: item.label,
                  value: formatAnalyticsCurrency(item.value),
                })),
            },
            {
              title: t('yearly.expenseSection'),
              items: [
                { label: 'Approved Expenses', value: formatAnalyticsCurrency(analytics.profitLoss.totalExpenses) },
                { label: 'Net Position', value: formatAnalyticsCurrency(analytics.profitLoss.netProfit) },
              ],
            },
          ],
          tables: [
            {
              title: t('yearly.monthlyTrend'),
              columns: ['Month', 'Income', 'Expense', 'Net'],
              rows: (analytics.profitLoss.monthly ?? []).map((item) => [
                item.label,
                formatAnalyticsCurrency(item.income),
                formatAnalyticsCurrency(item.expense),
                formatAnalyticsCurrency(item.income - item.expense),
              ]),
            },
          ],
        });
      }
    } catch (downloadError) {
      Alert.alert('Export failed', downloadError instanceof Error ? downloadError.message : 'Unable to export this report.');
    } finally {
      setShowExportPopup(false);
    }
  }, [analytics, eventExpenseBreakdown, eventIncomeBreakdown, exportFormat, selectedYear, t, variant]);

  if (variant === 'event') {
    return (
      <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
          <AppHeader
            title={t('event.title')}
            subtitle={t('event.subtitle')}
            variant="back-inline"
            onLeftPress={navigateBack}
            rightIcon="share"
            onRightPress={() => {
              void handleEventShare();
            }}
            actions={[
              { key: 'share', icon: 'share', onPress: () => { void handleEventShare(); } },
              { key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) },
            ]}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[8] }}>
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3] }}>
                <ProfitLossSummaryCard
                  title={t('event.summary.income')}
                  value={formatAnalyticsCurrency(analytics?.events.totalIncome ?? 0)}
                  helper={t('event.summary.incomeHelper')}
                  icon="account-balance-wallet"
                />
                <ProfitLossSummaryCard
                  title={t('event.summary.expenses')}
                  value={formatAnalyticsCurrency(analytics?.events.totalExpense ?? 0)}
                  helper={t('event.summary.expensesHelper')}
                  icon="payments"
                />
                <ProfitLossSummaryCard
                  title={t('event.summary.netProfit')}
                  value={formatAnalyticsCurrency(analytics?.events.netProfit ?? 0)}
                  helper={t('event.summary.netProfitHelper')}
                  icon="analytics"
                  tone="accent"
                />
              </View>

              <View style={{ gap: spacing[3], marginTop: spacing[1] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                    {t('event.sections.incomeBreakdown')}
                  </Text>
                  <Text
                    variant="caption"
                    style={{
                      color: '#16a34a',
                      fontFamily: typography.fontFamily.bold,
                      backgroundColor: '#dcfce7',
                      paddingHorizontal: spacing[2],
                      paddingVertical: 4,
                      borderRadius: 8,
                      textTransform: 'uppercase',
                  }}>
                    {t('event.sections.credit')}
                  </Text>
                </View>
                <View style={{ gap: spacing[3] }}>
                  {eventIncomeBreakdown.length ? eventIncomeBreakdown.map((item) => (
                    <BreakdownRow
                      key={item.id}
                      icon="confirmation-number"
                      label={item.title}
                      subtitle={`${item.registrations} registrations • ${item.attendance} attended`}
                      amount={formatAnalyticsCurrency(item.income)}
                      status={t('event.status.completed')}
                      statusTone="success"
                      tint={colors.background.surface}
                    />
                  )) : (
                    <BreakdownRow
                      icon="account-balance-wallet"
                      label={t('event.summary.income')}
                      subtitle={t('event.summary.incomeHelper')}
                      amount={formatAnalyticsCurrency(analytics?.events.totalIncome ?? 0)}
                      status={t('event.status.completed')}
                      statusTone="success"
                      tint={colors.background.surface}
                    />
                  )}
                </View>
              </View>

              <View style={{ gap: spacing[3], marginTop: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                    {t('event.sections.expenseBreakdown')}
                  </Text>
                  <Text
                    variant="caption"
                    style={{
                      color: '#dc2626',
                      fontFamily: typography.fontFamily.bold,
                      backgroundColor: '#fee2e2',
                      paddingHorizontal: spacing[2],
                      paddingVertical: 4,
                      borderRadius: 8,
                      textTransform: 'uppercase',
                    }}>
                    {t('event.sections.debit')}
                  </Text>
                </View>
                <View style={{ gap: spacing[3] }}>
                  {eventExpenseBreakdown.length ? eventExpenseBreakdown.map((item) => (
                    <BreakdownRow
                      key={item.id}
                      icon="receipt-long"
                      label={item.title}
                      subtitle={`${item.registrations} registrations • ${item.addonUsage} add-ons used`}
                      amount={`-${formatAnalyticsCurrency(item.expense)}`}
                      status={t('event.status.paidInFull')}
                      statusTone="muted"
                      tint={colors.background.surface}
                    />
                  )) : (
                    <BreakdownRow
                      icon="payments"
                      label={t('event.summary.expenses')}
                      subtitle={t('event.summary.expensesHelper')}
                      amount={`-${formatAnalyticsCurrency(analytics?.events.totalExpense ?? 0)}`}
                      status={t('event.status.paidInFull')}
                      statusTone="muted"
                      tint={colors.background.surface}
                    />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaViewNative>
    );
  }

  const monthlyNetValues = (analytics?.profitLoss.monthly ?? []).map((item) => item.income - item.expense);
  const maxMonthlyValue = Math.max(...monthlyNetValues.map((value) => Math.abs(value)), 1);
  const yearlyTrendData: barDataItem[] = (analytics?.profitLoss.monthly ?? []).map((item, index) => ({
    value: Math.abs(item.income - item.expense),
    label: item.label,
    frontColor: item.income >= item.expense
      ? (index % 2 === 0 ? colors.primary.DEFAULT : 'rgba(242,120,13,0.72)')
      : '#f97316',
  }));

  const yearlyLoadingView = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3] }}>
          {yearlyFilters.map((filter) => (
            <SkeletonBlock key={filter} width={96} height={36} radiusSize={16} />
          ))}
        </ScrollView>
      </View>
      <View style={{ paddingHorizontal: spacing[4], gap: spacing[4], paddingBottom: spacing[6] }}>
        <StatCardSkeleton />
        <CardGridSkeleton columns={2} cards={2} cardMinHeight={128} />
        <View style={{ borderRadius: 20, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
          {Array.from({ length: 4 }, (_, index) => (
            <ListRowSkeleton key={index} minHeight={76} />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={t('yearly.title')}
          onLeftPress={navigateBack}
            actions={[
              { key: 'share', icon: 'share', onPress: () => { void handleYearlyShare(); } },
              { key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) },
            ]}
          onRightPress={() => {
            void handleYearlyShare();
          }}
        />
        {isLoading && !analytics ? yearlyLoadingView : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3] }}>
              {yearlyFilters.map((filter) => {
                const active = filter === selectedYear;
                return (
                  <TouchableOpacity
                    key={filter}
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => setSelectedYear(filter)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                      borderRadius: 16,
                      backgroundColor: active ? colors.primary.DEFAULT : 'rgba(242,120,13,0.1)',
                      paddingHorizontal: spacing[4],
                      paddingVertical: spacing[2],
                    }}>
                    <Text variant="body" style={{ color: active ? '#ffffff' : colors.primary.DEFAULT, fontFamily: active ? typography.fontFamily.semibold : typography.fontFamily.medium }}>
                      {filter}
                    </Text>
                    {active ? <MaterialIcons name="keyboard-arrow-down" size={18} color="#ffffff" /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={{ paddingHorizontal: spacing[4] }}>
            {error ? (
              <View style={{ marginBottom: spacing[4], borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(239,68,68,0.18)', padding: spacing[4] }}>
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {error}
                </Text>
              </View>
            ) : null}
            <View style={{ borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 }}>
              <LinearGradient colors={[colors.primary.DEFAULT, '#ea580c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: spacing[6], gap: spacing[3] }}>
                <Text variant="caption" color="#fff1e6" style={{ textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: typography.fontFamily.bold }}>
                  {t('yearly.heroLabel')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h1" color="#ffffff" style={{ fontSize: 40, lineHeight: 44, fontFamily: typography.fontFamily.extrabold }}>
                    {formatAnalyticsCurrency(analytics?.profitLoss.netProfit ?? 0)}
                  </Text>
                  <Text variant="caption" color="#ffffff" style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 8, fontFamily: typography.fontFamily.medium }}>
                    {t('yearly.heroDelta')}
                  </Text>
                </View>
              </LinearGradient>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(255,247,237,0.95)', padding: spacing[4], borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.08)' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="caption" color={colors.text.muted}>
                    {t('yearly.summary.income')}
                  </Text>
                  <Text variant="body" style={{ color: '#16a34a', fontFamily: typography.fontFamily.bold }}>
                    {formatAnalyticsCurrency(analytics?.profitLoss.totalIncome ?? 0)}
                  </Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(242,120,13,0.1)' }} />
                <View style={{ alignItems: 'center' }}>
                  <Text variant="caption" color={colors.text.muted}>
                    {t('yearly.summary.expenses')}
                  </Text>
                  <Text variant="body" style={{ color: '#ef4444', fontFamily: typography.fontFamily.bold }}>
                    {formatAnalyticsCurrency(analytics?.profitLoss.totalExpenses ?? 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              <MaterialIcons name="trending-up" size={18} color={colors.primary.DEFAULT} /> {t('yearly.incomeSection')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              {(analytics?.profitLoss.categories ?? []).filter((item) => item.label !== 'Expenses').map((item) => (
                <ProfitLossYearlyIncomeCard
                  key={item.label}
                  label={item.label}
                  amount={formatAnalyticsCurrency(item.value)}
                  icon={item.label === 'Donations' ? 'volunteer-activism' : item.label === 'Events' ? 'event-available' : item.label === 'Matrimony' ? 'favorite' : 'ad-units'}
                />
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <View style={{ borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(242,120,13,0.08)', padding: spacing[4], shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('yearly.monthlyTrend')}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {t('yearly.monthRange')}
                </Text>
              </View>
              <View style={{ minHeight: 272, paddingTop: spacing[2], paddingBottom: spacing[6], overflow: 'visible' }}>
                <BarChart
                  data={yearlyTrendData.length ? yearlyTrendData : [{ label: 'FY', value: 0, frontColor: colors.primary.DEFAULT }]}
                  height={230}
                  maxValue={maxMonthlyValue}
                  adjustToWidth
                  xAxisLabelsHeight={32}
                  xAxisLabelsVerticalShift={8}
                  disablePress
                  hideAxesAndRules
                  hideYAxisText
                  hideRules
                  hideOrigin
                  barWidth={18}
                  spacing={12}
                  initialSpacing={12}
                  endSpacing={12}
                  roundedTop
                  roundedBottom={false}
                  isAnimated={false}
                  xAxisLabelTextStyle={{
                    color: '#94a3b8',
                    fontFamily: typography.fontFamily.bold,
                    fontSize: 10,
                    marginTop: spacing[3],
                  }}
                  xAxisTextNumberOfLines={1}
                />
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4], marginBottom: 20 }}>
            <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              <MaterialIcons name="trending-down" size={18} color="#ef4444" /> {t('yearly.expenseSection')}
            </Text>
            <View style={{ gap: spacing[3] }}>
              <ProfitLossExpenseItem icon="receipt-long" title="Approved Expenses" subtitle="Approved and paid community expense requests" amount={formatAnalyticsCurrency(analytics?.profitLoss.totalExpenses ?? 0)} />
              <ProfitLossExpenseItem icon="account-balance-wallet" title="Net Position" subtitle="Income minus approved expenses" amount={formatAnalyticsCurrency(analytics?.profitLoss.netProfit ?? 0)} />
            </View>
          </View>
        </ScrollView>
        )}
        <SelectionPopup
          visible={showExportPopup}
          title="Export report"
          subtitle="Choose the format for this analytics report."
          options={[
            { key: 'pdf', label: 'PDF statement' },
            { key: 'excel', label: 'Excel XLSX' },
          ]}
          selectedKey={exportFormat}
          onSelect={(key) => setExportFormat(key === 'excel' ? 'excel' : 'pdf')}
          onClose={() => setShowExportPopup(false)}
          onConfirm={() => { void handleDownloadReport(); }}
          confirmLabel="Download"
        />
      </View>
    </SafeAreaViewNative>
  );
}
