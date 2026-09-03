import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useFocusEffect } from '@react-navigation/native';

import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppHeader, Button, Card, CardGridSkeleton, ListRowSkeleton, SelectionPopup, StatCardSkeleton, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, spacing, typography } from '@/src/theme';

import { analyticsService, formatAnalyticsNumber, type TenantAnalytics } from '../services';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '../services/analytics-report-service';
import {
  buildAnalyticsYearFilters,
  getCurrentFinancialYearLabel,
  resolveAnalyticsYearRange,
  type AnalyticsYearFilter,
} from './analytics-financial-year';

export function PeopleAnalyticsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.people-analytics');
  const defaultYear = getCurrentFinancialYearLabel();
  const yearFilters = buildAnalyticsYearFilters();
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
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
      setShowAllCities(false);
      setShowExportPopup(false);
      setSelectedYear(defaultYear);
      return undefined;
    }, [defaultYear]),
  );

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const totalProfiles = useMemo(() => {
    const registeredPeople = analytics?.people.totalRegisteredPeople;
    if (typeof registeredPeople === 'number') {
      return registeredPeople;
    }

    return (analytics?.people.byCity ?? []).reduce((sum, item) => sum + item.value, 0);
  }, [analytics]);
  const maxCityCount = Math.max(...(analytics?.people.byCity ?? []).map((item) => item.value), 1);
  const chartCities = useMemo(
    () => (showAllCities ? (analytics?.people.byCity ?? []) : (analytics?.people.byCity ?? []).slice(0, 5)),
    [analytics, showAllCities],
  );
  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      Alert.alert('Export unavailable', 'People analytics data is not available yet.');
      return;
    }

    try {
      await downloadAnalyticsReport({
        title: t('title'),
        subtitle: selectedYear,
        fileBaseName: `people-analytics-${selectedYear.toLowerCase().replace(/\s+/g, '-')}`,
        format: exportFormat,
        summary: [
          { label: t('cards.registeredProfiles'), value: formatAnalyticsNumber(totalProfiles) },
          { label: t('cards.newThisMonth'), value: formatAnalyticsNumber(analytics.people.newRegistrationsCurrentMonth) },
          { label: 'Previous month registrations', value: formatAnalyticsNumber(analytics.people.previousMonthRegistrations) },
          { label: 'Active matrimony users', value: formatAnalyticsNumber(analytics.people.activeMatrimonyPeople) },
          { label: 'Children profiles', value: formatAnalyticsNumber(analytics.children.totalChildrenProfiles) },
        ],
        tables: [
          {
            title: t('section.byCity'),
            columns: ['City', 'Members'],
            rows: (analytics.people.byCity ?? []).map((item) => [item.label, formatAnalyticsNumber(item.value)]),
          },
          {
            title: 'Children by department',
            columns: ['Department', 'Children'],
            rows: (analytics.children.byDepartment ?? []).map((item) => [item.label, formatAnalyticsNumber(item.value)]),
          },
        ],
      });
    } catch (downloadError) {
      Alert.alert('Export failed', downloadError instanceof Error ? downloadError.message : 'Unable to export people analytics.');
    } finally {
      setShowExportPopup(false);
    }
  }, [analytics, exportFormat, selectedYear, t, totalProfiles]);

  const loadingView = (
    <View style={{ padding: spacing[4], gap: spacing[4] }}>
      <StatCardSkeleton />
      <CardGridSkeleton columns={2} cards={2} cardMinHeight={124} />
      <Card variant="elevated" padding="lg">
        <View style={{ gap: spacing[3] }}>
          {Array.from({ length: 5 }, (_, index) => (
            <ListRowSkeleton key={index} minHeight={60} showAvatar={false} showTrailing={false} />
          ))}
        </View>
      </Card>
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: 3 }, (_, index) => (
          <ListRowSkeleton key={index} minHeight={84} />
        ))}
      </View>
    </View>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#f6f1ec' }}>
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
            <View
              style={{
                borderRadius: 20,
                padding: spacing[5],
                backgroundColor: colors.primary.DEFAULT,
                gap: spacing[2],
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 3,
              }}>
              <Text variant="caption" style={{ color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: 1.4 }}>
                {t('hero.label')}
              </Text>
              <Text variant="h1" style={{ color: '#ffffff', fontFamily: typography.fontFamily.extrabold, lineHeight: 42 }}>
                {analytics ? formatAnalyticsNumber(totalProfiles) : t('hero.value')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[2],
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                  borderRadius: 999,
                }}>
                  <MaterialIcons name="trending-up" size={16} color="#ffffff" />
                <Text variant="caption" style={{ color: '#ffffff', fontFamily: typography.fontFamily.semibold }}>
                  {analytics ? t('hero.growth').replace('{percent}', String(analytics.people.registrationGrowthPercent)) : t('hero.subtitle')}
                </Text>
              </View>
            </View>

          {isLoading ? (
            <View style={{ gap: spacing[3] }}>
              <ListRowSkeleton minHeight={84} />
              <ListRowSkeleton minHeight={84} />
            </View>
          ) : error ? (
            <Card variant="default" padding="md">
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{error}</Text>
            </Card>
          ) : null}

          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#ffffff', padding: spacing[4], borderWidth: 1, borderColor: 'rgba(24,168,117,0.08)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <MaterialIcons name="person-add" size={20} color={colors.primary.DEFAULT} />
                <Text variant="caption" style={{ color: '#16a34a', fontFamily: typography.fontFamily.bold }}>
                  {analytics ? `${analytics.people.registrationGrowthPercent}%` : '+0%'}
                </Text>
              </View>
              <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[2], textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('cards.registeredProfiles')}
              </Text>
              <Text variant="h4" style={{ marginTop: 2, fontFamily: typography.fontFamily.extrabold }}>
                {formatAnalyticsNumber(totalProfiles)}
              </Text>
            </View>
            <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#ffffff', padding: spacing[4], borderWidth: 1, borderColor: 'rgba(24,168,117,0.08)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <MaterialIcons name="location-city" size={20} color={colors.primary.DEFAULT} />
                <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('cards.cities')}
                </Text>
              </View>
              <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[2], textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('cards.newThisMonth')}
              </Text>
              <Text variant="h4" style={{ marginTop: 2, fontFamily: typography.fontFamily.extrabold }}>
                {formatAnalyticsNumber(analytics?.people.newRegistrationsCurrentMonth ?? 0)}
              </Text>
            </View>
          </View>

          <Card variant="elevated" padding="lg">
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('section.byCity')}
                  </Text>
                <Button variant="ghost" size="sm" onPress={() => setShowAllCities((current) => !current)}>
                  {showAllCities ? t('actions.showLess') : t('actions.viewAllCities')}
                </Button>
              </View>
              <View style={{ gap: spacing[3] }}>
                {chartCities.map(({ label, value }) => (
                  <View key={label as string} style={{ gap: spacing[2] }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                      <Text variant="body" style={{ flex: 1, fontFamily: typography.fontFamily.semibold }}>
                        {label as string}
                      </Text>
                      <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                        {formatAnalyticsNumber(value)}
                      </Text>
                    </View>
                    <View style={{ height: 10, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
                      <View style={{ width: `${Math.max(10, Math.round((value / maxCityCount) * 100))}%`, height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT }} />
                    </View>
                  </View>
                ))}
                {analytics && !analytics.people.byCity.length ? (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text variant="body" color={colors.text.muted}>{t('empty.byCity')}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Card>

          <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[1] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('section.regionalList')}
              </Text>
            </View>
            {(analytics?.people.byCity ?? []).slice(0, 6).map(({ label, value }) => (
              <Card key={label} variant="default" padding="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
                      <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                        {label.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                        {label}
                      </Text>
                      <Text variant="caption" color={colors.text.muted}>
                        {t('section.memberDistribution')}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                      {formatAnalyticsNumber(value)}
                    </Text>
                    <Text variant="caption" style={{ color: '#16a34a', fontFamily: typography.fontFamily.medium }}>
                      {Math.round((value / Math.max(totalProfiles, 1)) * 100)}%
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
            {analytics && !analytics.people.byCity.length ? (
              <Card variant="default" padding="md">
                <Text variant="body" color={colors.text.muted}>{t('empty.regional')}</Text>
              </Card>
            ) : null}
          </View>
          <Card variant="elevated" padding="lg">
            <View style={{ gap: spacing[4] }}>
              <View>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('children.title')}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {t('children.tracked').replace('{count}', formatAnalyticsNumber(analytics?.children.totalChildrenProfiles ?? 0))}
                </Text>
              </View>
              <View style={{ gap: spacing[3] }}>
                {(analytics?.children.byDepartment ?? []).slice(0, 6).map(({ label, value }) => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                      {label}
                    </Text>
                    <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                      {formatAnalyticsNumber(value)}
                    </Text>
                  </View>
                ))}
                {analytics && !analytics.children.byDepartment.length ? (
                  <Text variant="body" color={colors.text.muted}>{t('empty.children')}</Text>
                ) : null}
              </View>
            </View>
          </Card>

          <Card variant="elevated" padding="lg">
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    Recent marksheets
                  </Text>
                  <Text variant="caption" color={colors.text.muted}>
                    Latest uploaded children education records for the selected financial period.
                  </Text>
                </View>
                <Button variant="ghost" size="sm" onPress={() => router.push('/admin/marksheet-reports' as never)}>
                  Open reports
                </Button>
              </View>
              <View style={{ gap: spacing[3] }}>
                {(analytics?.children.recentMarksheets ?? []).slice(0, 4).map((item) => (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                        {item.childName}
                      </Text>
                      <Text variant="caption" color={colors.text.muted}>
                        {[item.department, item.standardSemester, item.academicYear].filter(Boolean).join(' • ')}
                      </Text>
                    </View>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                      {item.city || 'No city'}
                    </Text>
                  </View>
                ))}
                {analytics && !analytics.children.recentMarksheets.length ? (
                  <Text variant="body" color={colors.text.muted}>No recent marksheets found for this period.</Text>
                ) : null}
              </View>
            </View>
          </Card>
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
