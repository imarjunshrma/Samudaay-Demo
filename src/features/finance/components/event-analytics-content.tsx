import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useFocusEffect } from '@react-navigation/native';

import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppHeader, Card, CardGridSkeleton, ListRowSkeleton, SelectionPopup, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, spacing, typography } from '@/src/theme';

import { analyticsService, formatAnalyticsCurrency, formatAnalyticsNumber, type TenantAnalytics } from '../services';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '../services/analytics-report-service';
import {
  buildAnalyticsYearFilters,
  getCurrentFinancialYearLabel,
  resolveAnalyticsYearRange,
  type AnalyticsYearFilter,
} from './analytics-financial-year';

import { EventAnalyticsSummaryCard } from './finance-blocks';

export function EventAnalyticsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const t = useTranslations('finance.event-analytics');
  const defaultYear = getCurrentFinancialYearLabel();
  const returnTo = typeof params.returnTo === 'string' ? params.returnTo : undefined;
  const yearFilters = buildAnalyticsYearFilters();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Registrations' | 'Catering'>('Overview');
  const [selectedYear, setSelectedYear] = useState<AnalyticsYearFilter>(getCurrentFinancialYearLabel());
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const hasLoadedRef = useRef(false);
  const buildEventAnalyticsReturnPath = useCallback(() => {
    if (!returnTo) {
      return '/admin/event-analytics';
    }

    return `/admin/event-analytics?returnTo=${encodeURIComponent(returnTo)}`;
  }, [returnTo]);
  const tabs = useMemo(() => [
    { key: 'Overview' as const, label: t('tabs.overview') },
    { key: 'Registrations' as const, label: t('tabs.registrations') },
    { key: 'Catering' as const, label: t('tabs.catering') },
  ], [t]);
  const attendancePercent = analytics?.events.totalRegisteredUsers
    ? Math.round((analytics.events.totalAttendance / analytics.events.totalRegisteredUsers) * 100)
    : 0;

  const loadAnalytics = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await analyticsService.loadTenantAnalytics(resolveAnalyticsYearRange(selectedYear));
      setAnalytics(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load event analytics.');
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [selectedYear]);

  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      Alert.alert('Export unavailable', 'Event analytics data is not available yet.');
      return;
    }

    try {
      await downloadAnalyticsReport({
        title: t('title'),
        subtitle: `${selectedYear} • ${tabs.find((tab) => tab.key === activeTab)?.label ?? activeTab}`,
        fileBaseName: `event-analytics-${activeTab.toLowerCase()}-${selectedYear.toLowerCase().replace(/\s+/g, '-')}`,
        format: exportFormat,
        summary: [
          { label: t('metrics.registrations'), value: formatAnalyticsNumber(analytics.events.totalRegisteredUsers) },
          { label: t('metrics.attendance'), value: `${attendancePercent}%` },
          { label: 'Add-on Usage', value: formatAnalyticsNumber(analytics.events.addonUsage) },
          { label: 'Event Income', value: formatAnalyticsCurrency(analytics.events.totalIncome) },
          { label: 'Approved Expenses', value: formatAnalyticsCurrency(analytics.events.totalExpense) },
          { label: 'Net Profit', value: formatAnalyticsCurrency(analytics.events.netProfit) },
        ],
        tables: [
          {
            title: t('sections.recentEvents'),
            columns: ['Event', 'Registrations', 'Attendance', 'Income', 'Expense', 'Net'],
            rows: (analytics.events.recent ?? []).map((event) => [
              event.title,
              formatAnalyticsNumber(event.registrations),
              formatAnalyticsNumber(event.attendance),
              formatAnalyticsCurrency(event.income),
              formatAnalyticsCurrency(event.expense),
              formatAnalyticsCurrency(event.income - event.expense),
            ]),
          },
        ],
      });
    } catch (downloadError) {
      Alert.alert('Export failed', downloadError instanceof Error ? downloadError.message : 'Unable to export event analytics.');
    } finally {
      setShowExportPopup(false);
    }
  }, [activeTab, analytics, attendancePercent, exportFormat, selectedYear, t, tabs]);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('Overview');
      setShowExportPopup(false);
      setSelectedYear(defaultYear);
      return undefined;
    }, [defaultYear]),
  );

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const loadingView = (
    <View style={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ flexDirection: 'row', gap: spacing[8], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[3] }}>
        <SkeletonBlock width={90} height={18} />
        <SkeletonBlock width={110} height={18} />
        <SkeletonBlock width={80} height={18} />
      </View>
      <CardGridSkeleton columns={1} cards={4} cardMinHeight={108} />
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: 4 }, (_, index) => (
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
            <>
              <View style={{ backgroundColor: '#f8fafc' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingHorizontal: spacing[4] }}>
                  <View style={{ flexDirection: 'row', gap: spacing[8] }}>
                    {tabs.map((tab) => (
                      <TouchableOpacity
                        key={tab.key}
                        accessibilityRole="button"
                        activeOpacity={0.85}
                        onPress={() => setActiveTab(tab.key)}
                        style={{
                          paddingTop: spacing[4],
                          paddingBottom: spacing[3],
                          borderBottomWidth: 3,
                          borderBottomColor: activeTab === tab.key ? colors.primary.DEFAULT : 'transparent',
                        }}>
                        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: activeTab === tab.key ? colors.primary.DEFAULT : colors.text.muted }}>
                          {tab.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

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
                          backgroundColor: active ? colors.primary.DEFAULT : 'rgba(242,120,13,0.1)',
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

                {activeTab === 'Overview' ? (
                  <View style={{ flexDirection: 'column', gap: spacing[3] }}>
                    <EventAnalyticsSummaryCard
                      title={t('metrics.registrations')}
                      value={formatAnalyticsNumber(analytics?.events.totalRegisteredUsers ?? 0)}
                      icon="group"
                      subtitle={t('metrics.registrations.subtitle')}
                      subtitleTone="success"
                    />
                    <EventAnalyticsSummaryCard
                      title={t('metrics.attendance')}
                      value={`${attendancePercent}%`}
                      icon="how-to-reg"
                      progress={attendancePercent}
                      progressColor={colors.primary.DEFAULT}
                    />
                    <EventAnalyticsSummaryCard
                      title={t('metrics.workshops')}
                      value={formatAnalyticsNumber(analytics?.events.recent.length ?? 0)}
                      icon="handyman"
                      subtitle={t('metrics.workshopsSubtitle')}
                    />
                    <EventAnalyticsSummaryCard
                      title="Net Profit"
                      value={formatAnalyticsCurrency(analytics?.events.netProfit ?? 0)}
                      icon="analytics"
                      valueTone={analytics && analytics.events.netProfit < 0 ? colors.status.error : colors.text.primary}
                      subtitle={`Income ${formatAnalyticsCurrency(analytics?.events.totalIncome ?? 0)} • Expense ${formatAnalyticsCurrency(analytics?.events.totalExpense ?? 0)}`}
                      subtitleTone={analytics && analytics.events.netProfit >= 0 ? 'success' : 'muted'}
                    />
                    <Card variant="elevated" padding="lg">
                      <View style={{ gap: spacing[3] }}>
                        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                          Event income by recent activity
                        </Text>
                        <View style={{ gap: spacing[3] }}>
                          {(analytics?.events.recent ?? []).slice(0, 5).map((event) => {
                            const maxIncome = Math.max(...(analytics?.events.recent ?? []).map((item) => item.income), 1);
                            const width = Math.max(10, Math.round((event.income / maxIncome) * 100));
                            return (
                              <View key={event.id} style={{ gap: spacing[2] }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                                  <Text variant="body" style={{ flex: 1, fontFamily: typography.fontFamily.semibold }}>
                                    {event.title}
                                  </Text>
                                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                                    {formatAnalyticsCurrency(event.income)}
                                  </Text>
                                </View>
                                <View style={{ height: 8, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
                                  <View style={{ width: `${width}%`, height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT }} />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </Card>
                  </View>
                ) : null}

                {activeTab === 'Catering' ? (
                  <Card variant="elevated" padding="lg">
                    <View style={{ gap: spacing[4] }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                          Event Financials & Add-ons
                        </Text>
                        <TouchableOpacity
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() =>
                            router.push(
                              {
                                pathname: '/finance/profit-loss-event',
                                params: { returnTo: buildEventAnalyticsReturnPath() },
                              } as never,
                            )
                          }
                          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                            {t('actions.viewDetails')}
                          </Text>
                          <MaterialIcons name="arrow-forward" size={16} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ gap: spacing[4] }}>
                        <View style={{ gap: spacing[2] }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                              <MaterialIcons name="restaurant" size={18} color="#f97316" />
                              <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                                Add-on Usage
                              </Text>
                            </View>
                            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                              {formatAnalyticsNumber(analytics?.events.addonUsage ?? 0)}
                            </Text>
                          </View>
                          <View style={{ height: 12, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
                            <View style={{ width: `${Math.min(100, analytics?.events.addonUsage ?? 0)}%`, height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT }} />
                          </View>
                        </View>
                        <View style={{ gap: spacing[2] }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                              <MaterialIcons name="dark-mode" size={18} color="#3b82f6" />
                              <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                                Event Income
                              </Text>
                            </View>
                            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                              {formatAnalyticsCurrency(analytics?.events.totalIncome ?? 0)}
                            </Text>
                          </View>
                          <View style={{ height: 12, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
                            <View style={{ width: `${Math.min(100, attendancePercent)}%`, height: '100%', borderRadius: 999, backgroundColor: '#3b82f6' }} />
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], paddingTop: spacing[1] }}>
                          <View style={{ flex: 1, minWidth: '47%', borderRadius: 16, backgroundColor: 'rgba(242,120,13,0.06)', padding: spacing[4] }}>
                            <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                              Net Profit
                            </Text>
                            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                              {formatAnalyticsCurrency(analytics?.events.netProfit ?? 0)}
                            </Text>
                          </View>
                          <View style={{ flex: 1, minWidth: '47%', borderRadius: 16, backgroundColor: '#f8fafc', padding: spacing[4], borderWidth: 1, borderColor: 'rgba(203,213,225,0.6)' }}>
                            <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                              Approved Expenses
                            </Text>
                            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: '#475569' }}>
                              {formatAnalyticsCurrency(analytics?.events.totalExpense ?? 0)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                ) : null}

                {activeTab === 'Registrations' ? (
                  <Card variant="elevated" padding="lg">
                    <View style={{ gap: spacing[4] }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                          {t('sections.recentEvents')}
                        </Text>
                        <MaterialIcons name="filter-list" size={20} color={colors.text.muted} />
                      </View>

                      <View style={{ gap: spacing[3] }}>
                        {(analytics?.events.recent ?? []).map((event) => (
                          <View key={event.id} style={{ gap: spacing[3], paddingVertical: spacing[2] }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
                                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
                                  <MaterialIcons name="event" size={22} color={colors.primary.DEFAULT} />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                                    {event.title}
                                  </Text>
                                  <Text variant="caption" color={colors.text.muted}>
                                    Registered {formatAnalyticsNumber(event.registrations)} • Attended {formatAnalyticsNumber(event.attendance)}
                                  </Text>
                                </View>
                              </View>
                              <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                                  {formatAnalyticsCurrency(event.income)}
                                </Text>
                                <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: '#16a34a', backgroundColor: '#dcfce7', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 999 }}>
                                  {formatAnalyticsCurrency(event.income - event.expense)}
                                </Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              accessibilityRole="button"
                              activeOpacity={0.85}
                              onPress={() =>
                                router.push({
                                  pathname: '/admin/event-analytics',
                                  params: { eventId: event.id, returnTo: buildEventAnalyticsReturnPath() },
                                } as never)
                              }
                              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[1] }}>
                              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                                View This Event Analytics
                              </Text>
                              <MaterialIcons name="north-east" size={16} color={colors.primary.DEFAULT} />
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: colors.border.light }} />
                          </View>
                        ))}
                        {analytics && !analytics.events.recent.length ? (
                          <Text variant="body" color={colors.text.muted}>No event registrations found for this financial year.</Text>
                        ) : null}
                      </View>
                    </View>
                  </Card>
                ) : null}

                {activeTab === 'Overview' && analytics?.events.recent?.length ? (
                  <Card variant="elevated" padding="lg">
                    <View style={{ gap: spacing[4] }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                          Per-event analytics
                        </Text>
                        <TouchableOpacity
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => setActiveTab('Registrations')}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                            View Analytics
                          </Text>
                          <MaterialIcons name="north-east" size={14} color={colors.primary.DEFAULT} />
                        </TouchableOpacity>
                      </View>

                      <View style={{ gap: spacing[3] }}>
                        {analytics.events.recent.slice(0, 3).map((event) => (
                          <TouchableOpacity
                            key={`overview-${event.id}`}
                            accessibilityRole="button"
                            activeOpacity={0.85}
                            onPress={() =>
                              router.push({
                                pathname: '/admin/event-analytics',
                                params: { eventId: event.id, returnTo: buildEventAnalyticsReturnPath() },
                              } as never)
                            }
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: spacing[3],
                              borderRadius: 16,
                              borderWidth: 1,
                              borderColor: colors.border.light,
                              paddingHorizontal: spacing[4],
                              paddingVertical: spacing[3],
                            }}>
                            <View style={{ flex: 1 }}>
                              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                                {event.title}
                              </Text>
                              <Text variant="caption" color={colors.text.muted}>
                                {formatAnalyticsNumber(event.registrations)} registrations • {formatAnalyticsNumber(event.attendance)} attended
                              </Text>
                            </View>
                            <MaterialIcons name="analytics" size={20} color={colors.primary.DEFAULT} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </Card>
                ) : null}
              </View>
            </>
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
