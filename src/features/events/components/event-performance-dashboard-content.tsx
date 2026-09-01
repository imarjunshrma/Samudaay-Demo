import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, Share, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AnalyticsChartCard, AppBottomBar, AppHeader, Button, Card, SelectionPopup, StatHighlightCard, Text } from '@/src/components';
import { SkeletonBlock, SkeletonCard } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '@/src/features/finance/services/analytics-report-service';
import { EventAddOnUsageCard } from './event-shared-blocks';
import { eventService, type EventAnalyticsRecord } from '../services/event-service';
import { buildEventPerformanceSharePayload } from '../services/event-share';

type EventSelectorItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  status?: string | null;
};

export function EventPerformanceDashboardContent({
  mode = 'member',
}: {
  mode?: 'member' | 'admin';
} = {}) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('events.performance-dashboard');
  const params = useLocalSearchParams<{ eventId?: string | string[]; returnTo?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const [analytics, setAnalytics] = useState<EventAnalyticsRecord | null>(null);
  const [availableEvents, setAvailableEvents] = useState<EventSelectorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const hasLoadedRef = useRef(false);
  const formatCurrency = (amount: number) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  useEffect(() => {
    let active = true;
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    async function load() {
      if (mode === 'admin' && !eventId) {
        const events = await eventService.loadManageEvents();
        if (active) {
          setAvailableEvents(events as EventSelectorItem[]);
          setAnalytics(null);
        }
        return null;
      }

      const resolvedEventId = eventId || (await eventService.loadEventOverview()).eventId;
      if (!resolvedEventId) return null;
      return eventService.loadEventAnalytics(resolvedEventId);
    }
    load().then((record) => {
      if (active && record) {
        setAnalytics(record);
      }
    }).finally(() => {
      if (active) {
        hasLoadedRef.current = true;
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [eventId, mode]);

  const metrics = useMemo(() => [
    { title: t('metrics.revenue'), value: formatCurrency(analytics?.totalIncome || 0), delta: `${analytics?.registeredUsers || 0} registrations` },
    { title: t('metrics.netProfit'), value: formatCurrency(analytics?.netProfit || 0), delta: `${analytics?.attended || 0} attended` },
  ], [analytics, t]);
  const attendanceBars = [
    { label: t('attendance.registered'), value: analytics?.registeredAttendees || 0, tone: 'muted' as const },
    { label: t('attendance.attended'), value: analytics?.attended || 0, tone: 'primary' as const },
  ] as const;
  const addOnStats = (analytics?.addOnUsage || []).map((item) => ({
    icon: 'confirmation-number' as const,
    label: item.title,
    value: String(item.count),
    progress: analytics?.registeredAttendees ? item.count / analytics.registeredAttendees : 0,
    footer: `${formatCurrency(item.amount)} each`,
  }));
  const dailyRegistrationBars = (analytics?.dailyRegistrations ?? []).slice(-7).map((item, index) => ({
    label: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    value: item.registrations,
    tone: index % 2 === 0 ? ('primary' as const) : ('muted' as const),
  }));
  const registrationDetails = analytics?.registrationDetails ?? [];
  const notAttendedCount = registrationDetails.filter((item) => item.attendedAttendees <= 0).length;
  const partiallyAttendedCount = registrationDetails.filter((item) => item.attendedAttendees > 0 && item.attendedAttendees < item.registeredAttendees).length;

  const handleShare = async () => {
    try {
      await Share.share(buildEventPerformanceSharePayload(analytics, t('title')));
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to share this event performance summary.');
    }
  };

  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      Alert.alert('Export unavailable', 'Event analytics data is not available yet.');
      return;
    }

    try {
      await downloadAnalyticsReport({
        title: analytics.event.title || t('title'),
        subtitle: [
          analytics.event.venueName || analytics.event.city,
          analytics.event.startAt
            ? new Date(analytics.event.startAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            : null,
        ].filter(Boolean).join(' • '),
        fileBaseName: `event-report-${(analytics.event.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        format: exportFormat,
        summary: [
          { label: t('metrics.revenue'), value: formatCurrency(analytics.totalIncome) },
          { label: t('metrics.netProfit'), value: formatCurrency(analytics.netProfit) },
          { label: t('attendance.registered'), value: String(analytics.registeredAttendees) },
          { label: t('attendance.attended'), value: String(analytics.attended) },
        ],
        tables: [
          {
            title: 'Daily registrations',
            columns: ['Date', 'Registrations', 'Income'],
            rows: (analytics.dailyRegistrations ?? []).map((item) => [
              new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              item.registrations,
              formatCurrency(item.income),
            ]),
          },
          {
            title: t('sections.addOnUsage'),
            columns: ['Add-on', 'Count', 'Amount'],
            rows: (analytics.addOnUsage ?? []).map((item) => [item.title, item.count, formatCurrency(item.amount)]),
          },
          {
            title: 'Registered vs attended people',
            columns: ['Name', 'Member ID', 'Phone', 'Registered', 'Attended', 'Pending', 'Status', 'Registered At', 'Attended At', 'Amount', 'Add-on'],
            rows: (analytics.registrationDetails ?? []).map((item) => [
              item.memberName,
              item.memberId || '',
              item.phone || '',
              item.registeredAttendees,
              item.attendedAttendees,
              item.pendingAttendees,
              item.attendanceStatus,
              item.registeredAt || '',
              item.attendedAt || '',
              formatCurrency(item.amountPaid),
              item.addOn || '',
            ]),
          },
        ],
      });
    } catch (downloadError) {
      Alert.alert('Export failed', downloadError instanceof Error ? downloadError.message : 'Unable to export this event report.');
    } finally {
      setShowExportPopup(false);
    }
  }, [analytics, exportFormat, t]);

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={analytics?.event?.title || (mode === 'admin' ? 'Event Analytics' : t('title'))}
          subtitle={analytics?.event?.venueName || analytics?.event?.city || (mode === 'admin' ? 'Event-specific performance overview' : t('subtitle'))}
          variant="back-inline"
          onLeftPress={navigateBack}
          actions={analytics ? [
            { key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) },
            { key: 'share', icon: 'share', onPress: () => { void handleShare(); } },
          ] : undefined}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 128 }}>
          {isLoading ? (
            <View style={{ gap: spacing[8] }}>
              <View>
                <SkeletonBlock width="46%" height={18} radiusSize={8} style={{ marginBottom: spacing[4] }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3] }}>
                  <View style={{ width: '48%' }}>
                    <SkeletonCard lines={3} />
                  </View>
                  <View style={{ width: '48%' }}>
                    <SkeletonCard lines={3} />
                  </View>
                </View>
              </View>
              <SkeletonBlock width="100%" height={280} radiusSize={20} />
              <SkeletonCard lines={4} />
            </View>
          ) : mode === 'admin' && !eventId ? (
          <View style={{ gap: spacing[4] }}>
            <View style={{ gap: spacing[1] }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                Select an event
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                Choose an event to view its specific analytics.
              </Text>
            </View>
            {availableEvents.length ? availableEvents.map((event) => (
              <Card
                key={event.id}
                variant="elevated"
                padding="lg"
                onPress={() => router.push({
                  pathname: '/admin/event-analytics',
                  params: { eventId: event.id, returnTo: returnTo || '/admin/manage-events' },
                } as never)}>
                <View style={{ gap: spacing[2] }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {event.title}
                  </Text>
                  {event.subtitle ? (
                    <Text variant="body" color={colors.text.secondary}>
                      {event.subtitle}
                    </Text>
                  ) : null}
                  {event.meta ? (
                    <Text variant="caption" color={colors.text.muted}>
                      {event.meta}
                    </Text>
                  ) : null}
                </View>
              </Card>
            )) : (
              <Card variant="elevated" padding="lg">
                <Text variant="body" color={colors.text.secondary}>
                  No events are available for analytics yet.
                </Text>
              </Card>
            )}
          </View>
          ) : (
          <View style={{ gap: spacing[8] }}>
            <View>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('sections.financialOverview')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3] }}>
                {metrics.map((metric) => (
                  <View key={metric.title} style={{ width: '48%' }}>
                    <StatHighlightCard label={metric.title} value={metric.value} helper={metric.delta} icon="trending-up" />
                  </View>
                ))}
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing[4] }}>
                <View style={{ flex: 1, paddingRight: spacing[4] }}>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('sections.attendanceRate')}
                  </Text>
                  <Text variant="caption" color={colors.text.muted} style={{ marginTop: 4 }}>
                    {t('sections.attendanceSubtitle')}
                  </Text>
                </View>
                <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                  {Math.round((analytics?.attendanceRatio || 0) * 100)}%
                </Text>
              </View>

              <AnalyticsChartCard title={t('sections.attendanceRate')} icon="groups" bars={[...attendanceBars]} />
            </View>

            <View>
              <AnalyticsChartCard
                title="Daily registrations"
                subtitle="Latest registration trend for this event."
                chartType="line"
                icon="timeline"
                bars={dailyRegistrationBars.length ? dailyRegistrationBars : [{ label: 'No data', value: 0, tone: 'primary' as const }]}
              />
            </View>

            <View>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('sections.addOnUsage')}
              </Text>
              <View style={{ gap: spacing[4] }}>
                {addOnStats.map((item) => (
                  <EventAddOnUsageCard key={item.label} {...item} />
                ))}
                {!addOnStats.length ? <Text variant="body" color="#64748b">No add-on usage yet.</Text> : null}
              </View>
            </View>

            <View>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                Registered vs attended
              </Text>
              <Card variant="elevated" padding="lg">
                <View style={{ gap: spacing[4] }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                    <View style={{ flex: 1, minWidth: 120 }}>
                      <Text variant="caption" color={colors.text.muted}>Registered people</Text>
                      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>{registrationDetails.length}</Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 120 }}>
                      <Text variant="caption" color={colors.text.muted}>Not attended</Text>
                      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>{notAttendedCount}</Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 120 }}>
                      <Text variant="caption" color={colors.text.muted}>Partial</Text>
                      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>{partiallyAttendedCount}</Text>
                    </View>
                  </View>
                  <View style={{ gap: spacing[3] }}>
                    {registrationDetails.slice(0, 12).map((item) => (
                      <View key={item.id} style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: spacing[3], gap: spacing[1] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3] }}>
                          <Text variant="body" style={{ flex: 1, fontFamily: typography.fontFamily.bold }} numberOfLines={1}>
                            {item.memberName}
                          </Text>
                          <Text variant="caption" color={item.attendedAttendees ? colors.status.success : colors.text.muted}>
                            {item.attendanceStatus}
                          </Text>
                        </View>
                        <Text variant="caption" color={colors.text.muted}>
                          {[item.memberId, item.phone, item.city].filter(Boolean).join(' • ') || 'Registered member'}
                        </Text>
                        <Text variant="caption" color={colors.text.secondary}>
                          Registered {item.registeredAttendees} • Attended {item.attendedAttendees} • Pending {item.pendingAttendees}
                        </Text>
                      </View>
                    ))}
                    {registrationDetails.length > 12 ? (
                      <Text variant="caption" color={colors.text.muted}>
                        Download the report to view all {registrationDetails.length} registrations.
                      </Text>
                    ) : null}
                    {!registrationDetails.length ? (
                      <Text variant="body" color={colors.text.muted}>No registrations found for this event.</Text>
                    ) : null}
                  </View>
                </View>
              </Card>
            </View>

            <Button
              fullWidth
              leftIcon={<MaterialIcons name="analytics" size={18} color="#ffffff" />}
              onPress={() => setShowExportPopup(true)}>
              {t('actions.viewReport')}
            </Button>
          </View>
          )}
        </ScrollView>
        <SelectionPopup
          visible={showExportPopup}
          title="Export report"
          subtitle="Choose the format for this event report."
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

        {mode !== 'admin' ? (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <AppBottomBar
              activeKey="dashboard"
              onChange={() => undefined}
              items={[
                { key: 'dashboard', icon: 'dashboard', label: t('nav.dashboard') },
                { key: 'events', icon: 'calendar-today', label: t('nav.events') },
                { key: 'community', icon: 'group', label: t('nav.community') },
                { key: 'profile', icon: 'person', label: t('nav.profile') },
              ]}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaViewNative>
  );
}
