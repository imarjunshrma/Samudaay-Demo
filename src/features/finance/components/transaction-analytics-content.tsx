import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useFocusEffect } from '@react-navigation/native';

import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AnalyticsChartCard, AppHeader, Card, CardGridSkeleton, ListRowSkeleton, SelectionPopup, StatCardSkeleton, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';
import { analyticsService, formatAnalyticsCurrency, type TenantAnalytics } from '../services';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '../services/analytics-report-service';
import {
  buildAnalyticsYearFilters,
  getCurrentFinancialYearLabel,
  resolveAnalyticsYearRange,
  type AnalyticsYearFilter,
} from './analytics-financial-year';

import {
  TransactionAnalyticsMetricCard,
  TransactionAnalyticsRow,
} from './finance-blocks';

export function TransactionAnalyticsContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.transaction-analytics');
  const defaultYear = getCurrentFinancialYearLabel();
  const yearFilters = buildAnalyticsYearFilters();
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthRange, setMonthRange] = useState<3 | 6 | 12>(6);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AnalyticsYearFilter>(getCurrentFinancialYearLabel());
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadAnalytics = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const result = await analyticsService.loadTenantAnalytics(resolveAnalyticsYearRange(selectedYear));
      setAnalytics(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.load'));
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [selectedYear, t]);

  useFocusEffect(
    useCallback(() => {
      setMonthRange(6);
      setShowAllRecent(false);
      setShowAllLocations(false);
      setShowExportPopup(false);
      setSelectedYear(defaultYear);
      return undefined;
    }, [defaultYear]),
  );

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const trendData = useMemo(() => (analytics?.transactions.monthly ?? []).slice(-monthRange).map((item, index) => ({
    value: Math.max(item.income, 0),
    label: item.label,
    tone: index % 2 === 0 ? ('primary' as const) : ('muted' as const),
  })), [analytics, monthRange]);
  const topLocations = useMemo(() => {
    const source = analytics?.transactions.byLocation ?? [];
    const max = Math.max(...source.map((item) => item.value), 1);
    return source
      .slice(0, showAllLocations ? undefined : 3)
      .map(({ label, value }, index) => ({
        label: label || t('fallback.unknownLocation'),
        value,
        widthPercent: Math.max(12, Math.round((value / max) * 100)),
        color: index === 0 ? '#18a875' : index === 1 ? '#fb923c' : '#fdba74',
      }));
  }, [analytics, showAllLocations, t]);
  const reportTransactions = useMemo(
    () => analytics?.transactions.recent ?? [],
    [analytics],
  );
  const visibleTransactions = useMemo(
    () => (showAllRecent ? reportTransactions : reportTransactions.slice(0, 5)),
    [reportTransactions, showAllRecent],
  );
  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      Alert.alert('Export unavailable', 'Transaction analytics data is not available yet.');
      return;
    }

    try {
      await downloadAnalyticsReport({
        title: t('title'),
        subtitle: selectedYear,
        fileBaseName: `transaction-analytics-${selectedYear.toLowerCase().replace(/\s+/g, '-')}`,
        format: exportFormat,
        summary: [
          { label: t('metric.totalIncome'), value: formatAnalyticsCurrency(analytics.transactions.totalIncome) },
          { label: t('metric.totalExpense'), value: formatAnalyticsCurrency(analytics.transactions.totalExpense) },
          { label: t('metric.netProfit'), value: formatAnalyticsCurrency(analytics.transactions.netProfit) },
        ],
        tables: [
          {
            title: t('chart.revenueTrends'),
            columns: ['Month', 'Income', 'Expense', 'Transactions'],
            rows: (analytics.transactions.monthly ?? []).map((item) => [
              item.label,
              formatAnalyticsCurrency(item.income),
              formatAnalyticsCurrency(item.expense),
              item.count,
            ]),
          },
          {
            title: 'Location Breakdown',
            columns: ['Location', 'Amount'],
            rows: (analytics.transactions.byLocation ?? []).map((item) => [item.label, formatAnalyticsCurrency(item.value)]),
          },
          {
            title: t('section.recent'),
            columns: ['Title', 'Type', 'Status', 'Amount'],
            rows: reportTransactions.map((item) => [item.title, item.type, item.status, formatAnalyticsCurrency(item.amount)]),
          },
        ],
      });
    } catch (downloadError) {
      Alert.alert('Export failed', downloadError instanceof Error ? downloadError.message : 'Unable to export transaction analytics.');
    } finally {
      setShowExportPopup(false);
    }
  }, [analytics, exportFormat, reportTransactions, selectedYear, t]);

  const loadingView = (
    <View style={{ padding: spacing[4], gap: spacing[4] }}>
      <CardGridSkeleton columns={1} cards={3} cardMinHeight={108} />
      <View style={{ borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4] }}>
        <StatCardSkeleton />
      </View>
      <View style={{ borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          {Array.from({ length: 3 }, (_, index) => (
            <ListRowSkeleton key={index} minHeight={56} showAvatar={false} showTrailing={false} />
          ))}
        </View>
      </View>
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: 3 }, (_, index) => (
          <ListRowSkeleton key={index} minHeight={84} />
        ))}
      </View>
    </View>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          onLeftPress={navigateBack}
          actions={[
            { key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) },
          ]}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 72 }}>
          {isLoading && !analytics ? loadingView : (
            <View style={{ padding: spacing[4], gap: spacing[4] }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3] }}>
                {yearFilters.map((filter) => {
                  const active = filter === selectedYear;
                  return (
                    <TouchableOpacity
                      key={filter}
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={() => setSelectedYear(filter)}
                      style={{
                        borderRadius: 16,
                        backgroundColor: active ? colors.primary.DEFAULT : 'rgba(24,168,117,0.1)',
                        paddingHorizontal: spacing[4],
                        paddingVertical: spacing[2],
                      }}>
                      <Text variant="caption" style={{ color: active ? '#ffffff' : colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {error ? (
              <Card variant="elevated" padding="lg">
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{error}</Text>
              </Card>
              ) : null}

              {analytics ? (
                <View style={{ flexDirection: 'column', gap: spacing[3] }}>
                  <TransactionAnalyticsMetricCard title={t('metric.totalIncome')} value={formatAnalyticsCurrency(analytics.transactions.totalIncome)} icon="trending-up" trend={analytics.filters.financialYear} trendTone="muted" />
                  <TransactionAnalyticsMetricCard title={t('metric.totalExpense')} value={formatAnalyticsCurrency(analytics.transactions.totalExpense)} icon="receipt-long" trend={t('metric.approvedPaid')} trendTone="warning" />
                  <TransactionAnalyticsMetricCard title={t('metric.netProfit')} value={formatAnalyticsCurrency(analytics.transactions.netProfit)} icon="account-balance-wallet" trend={analytics.transactions.netProfit >= 0 ? t('metric.profit') : t('metric.loss')} trendTone={analytics.transactions.netProfit >= 0 ? 'success' : 'warning'} />
                </View>
              ) : null}

              <AnalyticsChartCard
                title={t('chart.revenueTrends')}
                subtitle={t('chart.revenueSubtitle')}
                bars={trendData.length ? trendData : [{ label: t('chart.fallbackLabel'), value: 0, tone: 'primary' }]}
                chartType="line"
                headerRight={
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => setMonthRange((current) => (current === 3 ? 6 : current === 6 ? 12 : 3))}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: colors.border.DEFAULT,
                      backgroundColor: colors.background.elevated,
                      paddingHorizontal: spacing[4],
                      paddingVertical: spacing[2],
                    }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
                      {monthRange === 12 ? t('filter.last12Months') : monthRange === 6 ? t('filter.last6Months') : t('filter.last3Months')}
                    </Text>
                    <MaterialIcons name="swap-horiz" size={16} color={colors.text.muted} />
                  </TouchableOpacity>
                }
              />

              <View style={{ flexDirection: 'row', gap: spacing[2], marginTop: -spacing[1] }}>
                {[3, 6, 12].map((range) => {
                  const active = monthRange === range;
                  return (
                    <TouchableOpacity
                      key={range}
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={() => setMonthRange(range as 3 | 6 | 12)}
                      style={{
                        borderRadius: radius.full,
                        borderWidth: 1,
                        borderColor: active ? colors.primary.DEFAULT : colors.border.DEFAULT,
                        backgroundColor: active ? colors.primary.subtle : colors.background.surface,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[2],
                      }}>
                      <Text variant="caption" style={{ color: active ? colors.primary.DEFAULT : colors.text.secondary, fontFamily: typography.fontFamily.bold }}>
                        {t('filter.rangeLabel').replace('{count}', String(range))}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Card variant="elevated" padding="lg">
                <View style={{ gap: spacing[4] }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    Top locations by income
                  </Text>
                  <View style={{ gap: spacing[4] }}>
                    {topLocations.length ? topLocations.map(({ label, value, widthPercent, color }) => (
                      <View key={label} style={{ gap: spacing[2] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                            {label}
                          </Text>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                            {formatAnalyticsCurrency(value)}
                          </Text>
                        </View>
                        <View style={{ height: 6, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
                          <View style={{ width: `${widthPercent}%` as const, height: '100%', borderRadius: 999, backgroundColor: color }} />
                        </View>
                      </View>
                    )) : (
                      <Text variant="body" color={colors.text.muted}>{t('empty.locations')}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => setShowAllLocations((current) => !current)}
                    style={{
                      marginTop: spacing[1],
                      width: '100%',
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(24,168,117,0.2)',
                      paddingVertical: spacing[3],
                      alignItems: 'center',
                    }}>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {showAllLocations
                        ? t('actions.showLess')
                        : `${t('actions.viewAllLocations')}${topLocations.length > 3 ? ` (${topLocations.length})` : ''}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              <View style={{ gap: spacing[3], paddingBottom: spacing[1] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('section.recent')}
                  </Text>
                  <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={() => setShowAllRecent((current) => !current)}>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {showAllRecent ? t('actions.showLess') : t('cta.viewAll')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ gap: spacing[3] }}>
                  {visibleTransactions.map((item) => (
                    <TransactionAnalyticsRow
                      key={`${item.type}-${item.id}`}
                      title={item.title}
                      subtitle={item.subtitle || item.type}
                      amount={formatAnalyticsCurrency(item.amount)}
                      status={item.status}
                      icon={item.type === 'Donation' ? 'volunteer-activism' : item.type === 'Event' ? 'event' : item.type === 'Expense' ? 'receipt-long' : 'person'}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
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
    </AppSafeAreaView>
  );
}
