import { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { AnalyticsChartCard, AppHeader, Button, DateField, Dialog, FormScreenLayout, SearchInput, SelectField, SelectionPopup, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { adminUserService, type AdminNormalUserItem } from '@/src/features/admin/services/admin-user-service';
import {
  MatrimonyAnalyticsMetricCard,
  MatrimonyApprovalRow,
} from './matrimony-blocks';
import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyAnalyticsRecord } from '../services/matrimony-feed-service';
import { MatrimonyAnalyticsSkeleton } from './matrimony-loading-states';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '@/src/features/finance/services/analytics-report-service';
import { resolveSecondaryLanguageText } from '@/src/features/profile/services/secondary-language-text';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTrend(value: number) {
  if (value > 0) return `+${value}%`;
  return `${value}%`;
}

function getTrendTone(value: number) {
  if (value < 0) return colors.status.error;
  return colors.status.success;
}

function mapApprovalStatus(status: string): 'Approved' | 'Pending' | 'Rejected' {
  if (status === 'REJECTED') return 'Rejected';
  if (status === 'PENDING_APPROVAL') return 'Pending';
  return 'Approved';
}

function normalizeAccessMode(value?: string | null): 'FREE' | 'PAID' {
  return String(value || '').trim().toUpperCase() === 'PAID' ? 'PAID' : 'FREE';
}

function formatSettingDate(value?: Date) {
  if (!value) {
    return 'No date set';
  }

  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(value);
  } catch {
    return 'No date set';
  }
}

export function MatrimonyAnalyticsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const t = useTranslations('matrimony.analytics');
  const returnTo = typeof params.returnTo === 'string' ? params.returnTo : undefined;
  const [analytics, setAnalytics] = useState<MatrimonyAnalyticsRecord | null>(null);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsDialog, setSettingsDialog] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    title: string;
    description: string;
  }>({
    visible: false,
    variant: 'success',
    title: '',
    description: '',
  });
  const [settingsEnabled, setSettingsEnabled] = useState(true);
  const [settingsBrowseMode, setSettingsBrowseMode] = useState<'FREE' | 'PAID'>('FREE');
  const [settingsInteractionMode, setSettingsInteractionMode] = useState<'FREE' | 'PAID'>('FREE');
  const [settingsViewerPrice, setSettingsViewerPrice] = useState('0');
  const [settingsProfilePrice, setSettingsProfilePrice] = useState('0');
  const [settingsStartsAt, setSettingsStartsAt] = useState<Date | undefined>(undefined);
  const [settingsEndsAt, setSettingsEndsAt] = useState<Date | undefined>(undefined);
  const [settingsProfileApproval, setSettingsProfileApproval] = useState(true);
  const [settingsChatEnabled, setSettingsChatEnabled] = useState(true);
  const [grantSearch, setGrantSearch] = useState('');
  const [grantUserResults, setGrantUserResults] = useState<AdminNormalUserItem[]>([]);
  const [grantUsersLoading, setGrantUsersLoading] = useState(false);
  const [grantSelectedUser, setGrantSelectedUser] = useState<AdminNormalUserItem | null>(null);
  const [grantType, setGrantType] = useState<'PROFILE_CREATION' | 'VIEWER_ONLY'>('PROFILE_CREATION');
  const [grantMode, setGrantMode] = useState<'PAID' | 'COMPLIMENTARY'>('PAID');
  const [grantStartsAt, setGrantStartsAt] = useState<Date | undefined>(new Date());
  const [grantEndsAt, setGrantEndsAt] = useState<Date | undefined>(undefined);
  const [grantAmountPaid, setGrantAmountPaid] = useState('0');
  const [grantPaymentRef, setGrantPaymentRef] = useState('');
  const [grantSaving, setGrantSaving] = useState(false);
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);
  const buildMatrimonyAnalyticsReturnPath = useCallback(() => {
    if (!returnTo) {
      return '/admin/matrimony-analytics';
    }

    return `/admin/matrimony-analytics?returnTo=${encodeURIComponent(returnTo)}`;
  }, [returnTo]);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [result, accessResult] = await Promise.all([
      matrimonyFeedService.loadAnalytics(),
      matrimonyFeedService.loadAccess(),
    ]);
    setAnalytics(result);
    setAccess(accessResult);
    if (accessResult?.settings) {
      setSettingsEnabled(accessResult.settings.enabled);
      setSettingsBrowseMode(normalizeAccessMode(accessResult.settings.browseMode ?? accessResult.settings.mode));
      setSettingsInteractionMode(normalizeAccessMode(accessResult.settings.interactionMode ?? accessResult.settings.mode));
      setSettingsViewerPrice(String(accessResult.settings.viewerPrice ?? 0));
      setSettingsProfilePrice(String(accessResult.settings.profilePrice ?? 0));
      setSettingsStartsAt(accessResult.settings.startsAt ? new Date(accessResult.settings.startsAt) : undefined);
      setSettingsEndsAt(accessResult.settings.endsAt ? new Date(accessResult.settings.endsAt) : undefined);
      setSettingsProfileApproval(accessResult.settings.profileApproval !== false);
      setSettingsChatEnabled(accessResult.settings.chatEnabled !== false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void (async () => {
        try {
          await loadAnalytics();
        } catch (loadError) {
          if (active) {
            setError(loadError instanceof Error ? loadError.message : 'Unable to load matrimony analytics.');
            setLoading(false);
          }
        }
      })();

      return () => {
        active = false;
      };
    }, [loadAnalytics]),
  );

  async function saveSettings() {
    setSavingSettings(true);
    setError(null);
    setSettingsDialog((current) => ({ ...current, visible: false }));
    try {
      const settings = await matrimonyFeedService.updateSettings({
        enabled: settingsEnabled,
        mode: settingsBrowseMode === 'PAID' || settingsInteractionMode === 'PAID' ? 'PAID' : 'FREE',
        browseMode: settingsBrowseMode,
        interactionMode: settingsInteractionMode,
        viewerPrice: settingsViewerPrice,
        profilePrice: settingsProfilePrice,
        startsAt: settingsStartsAt ?? null,
        endsAt: settingsEndsAt ?? null,
        profileApproval: settingsProfileApproval,
        chatEnabled: settingsChatEnabled,
      });
      setAccess((current) => (current ? { ...current, settings } : current));
      setSettingsDialog({
        visible: true,
        variant: 'success',
        title: 'Settings saved',
        description: 'Matrimony settings were updated successfully.',
      });
    } catch (settingsError) {
      const message = settingsError instanceof Error ? settingsError.message : 'Unable to update matrimony settings.';
      setError(message);
      setSettingsDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to save settings',
        description: message,
      });
    } finally {
      setSavingSettings(false);
    }
  }

  const bars = useMemo(() => {
    const trend = analytics?.revenueTrend ?? [];
    return trend.length ? trend : [{ label: 'NOW', value: 0, tone: 'primary' as const }];
  }, [analytics]);
  const browseModeLabel = settingsBrowseMode === 'PAID' ? t('settings.paid') : t('settings.free');
  const interactionModeLabel = settingsInteractionMode === 'PAID' ? t('settings.paid') : t('settings.free');
  const activePeriodLabel = `${formatSettingDate(settingsStartsAt)} - ${formatSettingDate(settingsEndsAt)}`;
  const configuredViewerPrice = useMemo(() => String(settingsViewerPrice || '0').trim() || '0', [settingsViewerPrice]);
  const configuredProfilePrice = useMemo(() => String(settingsProfilePrice || '0').trim() || '0', [settingsProfilePrice]);
  const configuredGrantPrice = grantType === 'VIEWER_ONLY' ? configuredViewerPrice : configuredProfilePrice;

  useEffect(() => {
    if (!access?.canManage) {
      return undefined;
    }

    if (!grantSearch.trim()) {
      setGrantUserResults([]);
      setGrantUsersLoading(false);
      return undefined;
    }

    let active = true;
    setGrantUsersLoading(true);
    const timeoutId = setTimeout(() => {
      adminUserService
        .loadNormalUsers({ search: grantSearch.trim() })
        .then((result) => {
          if (active) {
            setGrantUserResults(result.items.slice(0, 6));
          }
        })
        .catch(() => {
          if (active) {
            setGrantUserResults([]);
          }
        })
        .finally(() => {
          if (active) {
            setGrantUsersLoading(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [access?.canManage, grantSearch]);

  useEffect(() => {
    if (grantMode === 'PAID') {
      setGrantAmountPaid(configuredGrantPrice);
    } else {
      setGrantAmountPaid('0');
      setGrantPaymentRef('');
    }
  }, [configuredGrantPrice, grantMode, grantType]);

  async function grantSubscription() {
    if (!grantSelectedUser) {
      setGrantError('Select a user first.');
      setGrantSuccess(null);
      return;
    }

    setGrantSaving(true);
    setGrantError(null);
    setGrantSuccess(null);

    try {
      await matrimonyFeedService.createSubscription({
        targetUserId: grantSelectedUser.id,
        type: grantType,
        startsAt: grantStartsAt ?? new Date(),
        endsAt: grantEndsAt ?? undefined,
        amountPaid: grantMode === 'PAID' ? grantAmountPaid : 0,
        paymentRef: grantMode === 'PAID' ? grantPaymentRef : null,
        grantMode,
      });
      setGrantSuccess(`Subscription granted to ${grantSelectedUser.name}.`);
      setGrantSearch('');
      setGrantUserResults([]);
      setGrantSelectedUser(null);
      setGrantPaymentRef('');
    } catch (grantSubscriptionError) {
      setGrantError(grantSubscriptionError instanceof Error ? grantSubscriptionError.message : 'Unable to grant subscription.');
    } finally {
      setGrantSaving(false);
    }
  }

  const handleDownloadReport = useCallback(async () => {
    if (!analytics) {
      setSettingsDialog({
        visible: true,
        variant: 'error',
        title: 'Report unavailable',
        description: 'Matrimony analytics data is not available yet.',
      });
      return;
    }

    setIsDownloadingReport(true);
    try {
      const profiles = await matrimonyFeedService.loadAllProfilesForReport();
      const profileReportRows = await Promise.all(profiles.map(async (profile) => {
        const nameEnglish = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Matrimony Profile';
        return [
          nameEnglish,
          await resolveSecondaryLanguageText(nameEnglish, null),
          profile.contact?.phone || '',
          profile.memberId || '',
          profile.status || '',
          profile.gender || '',
          profile.dob || '',
          profile.age ?? '',
          profile.maritalStatus || '',
          profile.childrenCount ?? '',
          profile.education || '',
          profile.occupation || '',
          profile.city || '',
          profile.state || '',
          profile.community || '',
          profile.caste || '',
          profile.createdAt || '',
          profile.updatedAt || '',
        ];
      }));
      await downloadAnalyticsReport({
        title: 'Matrimony Report',
        subtitle: 'All matrimony profiles and analytics summary',
        fileBaseName: 'matrimony-report',
        format: exportFormat,
        summary: [
          { label: 'Active Profiles', value: formatNumber(analytics.metrics.activeProfiles) },
          { label: 'Pending Review', value: formatNumber(analytics.metrics.pendingReviewProfiles ?? 0) },
          { label: 'Active Viewer Subscriptions', value: formatNumber(analytics.metrics.activeViewerSubscriptions) },
          { label: 'New Profiles This Month', value: formatNumber(analytics.metrics.newActiveProfilesThisMonth) },
          { label: 'Revenue Generated', value: formatCurrency(analytics.metrics.revenueGenerated) },
          { label: 'Total Profiles In Report', value: formatNumber(profiles.length) },
        ],
        tables: [
          {
            title: 'All matrimony profiles',
            columns: ['Name (English)', 'Name (Second Language)', 'Phone', 'Member ID', 'Status', 'Gender', 'DOB', 'Age', 'Marital Status', 'Number of Children', 'Education', 'Occupation', 'City', 'State', 'Community', 'Caste', 'Created At', 'Updated At'],
            rows: profileReportRows,
          },
          {
            title: 'Recent approvals',
            columns: ['Name (English)', 'Name (Second Language)', 'Phone', 'Location / Age', 'Status', 'Updated At'],
            rows: analytics.recentApprovals.map((profile) => [
              profile.nameEnglish || profile.name,
              profile.nameSecondLanguage || profile.name,
              profile.phone || '',
              profile.locationAge,
              profile.status,
              profile.updatedAt || '',
            ]),
          },
        ],
      });
    } catch (downloadError) {
      setSettingsDialog({
        visible: true,
        variant: 'error',
        title: 'Export failed',
        description: downloadError instanceof Error ? downloadError.message : 'Unable to export matrimony report.',
      });
    } finally {
      setIsDownloadingReport(false);
      setShowExportPopup(false);
    }
  }, [analytics, exportFormat]);

  return (
    <FormScreenLayout
      header={<AppHeader
          variant="back-inline"
          title={t('title')}
          actions={[
            { key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) },
          ]}
          onLeftPress={() => {
            if (returnTo) {
              navigateBack(returnTo);
              return;
            }

            navigateBack();
          }}
        />}
    >
      <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: spacing[4], paddingBottom: spacing[6] }}>
            <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
              {t('title')}
            </Text>
            <Text variant="body" color={colors.text.muted} style={{ marginBottom: spacing[4] }}>
              {t('chart.subtitle')}
            </Text>

            {loading ? (
              <MatrimonyAnalyticsSkeleton />
            ) : error ? (
              <View style={{ borderRadius: radius.xl, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  Analytics unavailable
                </Text>
                <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing[1], lineHeight: 22 }}>
                  {error}
                </Text>
              </View>
            ) : analytics ? (
              <>
                {access?.canManage ? (
                  <View style={{ borderRadius: radius.xl, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4], marginBottom: spacing[4] }}>
                    <View>
                      <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {t('settings.title')}
                      </Text>
                      <Text variant="caption" style={{ color: colors.text.muted, marginTop: 4 }}>
                        {t('settings.description')}
                      </Text>
                    </View>

                    <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary.muted, padding: spacing[3], gap: spacing[1] }}>
                      <Text variant="caption" style={{ color: colors.text.secondary }}>
                        Module Status
                      </Text>
                      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {settingsEnabled ? 'Enabled' : 'Disabled'}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                      <View style={{ flex: 1 }}>
                        <Button variant={settingsEnabled ? 'primary' : 'outline'} fullWidth onPress={() => setSettingsEnabled(true)}>
                          Enabled
                        </Button>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button variant={!settingsEnabled ? 'primary' : 'outline'} fullWidth onPress={() => setSettingsEnabled(false)}>
                          Disabled
                        </Button>
                      </View>
                    </View>

                    <View style={{ gap: spacing[2] }}>
                      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {t('settings.browseLabel')}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => setSettingsBrowseMode('FREE')}
                          style={{
                            flex: 1,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: settingsBrowseMode === 'FREE' ? colors.primary.DEFAULT : colors.primary.borderLight,
                            backgroundColor: settingsBrowseMode === 'FREE' ? colors.primary.muted : '#ffffff',
                            padding: spacing[3],
                            gap: spacing[1],
                          }}>
                          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {t('settings.free')}
                          </Text>
                          <Text variant="caption" style={{ color: colors.text.secondary }}>
                            Users can browse profiles without subscription.
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => setSettingsBrowseMode('PAID')}
                          style={{
                            flex: 1,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: settingsBrowseMode === 'PAID' ? colors.primary.DEFAULT : colors.primary.borderLight,
                            backgroundColor: settingsBrowseMode === 'PAID' ? colors.primary.muted : '#ffffff',
                            padding: spacing[3],
                            gap: spacing[1],
                          }}>
                          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {t('settings.paid')}
                          </Text>
                          <Text variant="caption" style={{ color: colors.text.secondary }}>
                            Users need subscription before browsing profiles.
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ gap: spacing[2] }}>
                      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {t('settings.interactionLabel')}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => setSettingsInteractionMode('FREE')}
                          style={{
                            flex: 1,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: settingsInteractionMode === 'FREE' ? colors.primary.DEFAULT : colors.primary.borderLight,
                            backgroundColor: settingsInteractionMode === 'FREE' ? colors.primary.muted : '#ffffff',
                            padding: spacing[3],
                            gap: spacing[1],
                          }}>
                          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {t('settings.free')}
                          </Text>
                          <Text variant="caption" style={{ color: colors.text.secondary }}>
                            Create profile and send requests without subscription.
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => setSettingsInteractionMode('PAID')}
                          style={{
                            flex: 1,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: settingsInteractionMode === 'PAID' ? colors.primary.DEFAULT : colors.primary.borderLight,
                            backgroundColor: settingsInteractionMode === 'PAID' ? colors.primary.muted : '#ffffff',
                            padding: spacing[3],
                            gap: spacing[1],
                          }}>
                          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {t('settings.paid')}
                          </Text>
                          <Text variant="caption" style={{ color: colors.text.secondary }}>
                            {t('settings.paidDescription')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                      <View style={{ flex: 1 }}>
                        <DateField label={t('settings.startDate')} labelVariant="default" variant="registration" value={settingsStartsAt} onChange={setSettingsStartsAt} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <DateField label={t('settings.endDate')} labelVariant="default" variant="registration" value={settingsEndsAt} onChange={setSettingsEndsAt} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                      <View style={{ flex: 1 }}>
                        <TextField
                          label={t('settings.viewerPrice')}
                          labelVariant="default"
                          variant="registration"
                          value={settingsViewerPrice}
                          onChangeText={setSettingsViewerPrice}
                          keyboardType="decimal-pad"
                          placeholder="0"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextField
                          label={t('settings.profilePrice')}
                          labelVariant="default"
                          variant="registration"
                          value={settingsProfilePrice}
                          onChangeText={setSettingsProfilePrice}
                          keyboardType="decimal-pad"
                          placeholder="0"
                        />
                      </View>
                    </View>
                    <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[3], gap: spacing[1] }}>
                      <Text variant="caption" style={{ color: colors.text.secondary }}>
                        {t('settings.currentSetup')}
                      </Text>
                      <Text variant="body" style={{ color: colors.text.primary }}>
                        {t('settings.currentSetupModes', { browse: browseModeLabel, interaction: interactionModeLabel })}
                      </Text>
                      <Text variant="body" style={{ color: colors.text.primary }}>
                        {t('settings.currentSetupPeriod', { period: activePeriodLabel })}
                      </Text>
                      <Text variant="body" style={{ color: colors.text.primary }}>
                        {t('settings.currentSetupPrices', { viewerPrice: configuredViewerPrice, profilePrice: configuredProfilePrice })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                      <View style={{ flex: 1 }}>
                        <Button variant={settingsProfileApproval ? 'primary' : 'outline'} fullWidth onPress={() => setSettingsProfileApproval((current) => !current)}>
                          {t('settings.approval')} {settingsProfileApproval ? t('settings.on') : t('settings.off')}
                        </Button>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button variant={settingsChatEnabled ? 'primary' : 'outline'} fullWidth onPress={() => setSettingsChatEnabled((current) => !current)}>
                          {t('settings.chat')} {settingsChatEnabled ? t('settings.on') : t('settings.off')}
                        </Button>
                      </View>
                    </View>
                    <Button variant="primary" fullWidth loading={savingSettings} disabled={savingSettings} onPress={saveSettings}>
                      {t('settings.save')}
                    </Button>
                  </View>
                ) : null}

                {access?.canManage ? (
                  <View style={{ borderRadius: radius.xl, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4], marginBottom: spacing[4] }}>
                    <View>
                      <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        Grant Subscription
                      </Text>
                      <Text variant="caption" style={{ color: colors.text.muted, marginTop: 4 }}>
                        {t('grant.description')}
                      </Text>
                    </View>

                    <SearchInput
                      label={t('grant.searchUser')}
                      value={grantSearch}
                      onChangeText={(value) => {
                        setGrantSearch(value);
                        setGrantSelectedUser(null);
                        setGrantSuccess(null);
                      }}
                      placeholder={t('grant.searchUserPlaceholder')}
                    />

                    {grantUsersLoading ? (
                      <Text variant="caption" style={{ color: colors.text.secondary }}>
                        {t('grant.searchingUsers')}
                      </Text>
                    ) : null}

                    {!grantSelectedUser && grantUserResults.length ? (
                      <View style={{ gap: spacing[2] }}>
                        {grantUserResults.map((user) => (
                          <TouchableOpacity
                            key={user.id}
                            activeOpacity={0.85}
                            onPress={() => {
                              setGrantSelectedUser(user);
                              setGrantSearch(user.name);
                              setGrantUserResults([]);
                              setGrantSuccess(null);
                            }}
                            style={{
                              borderRadius: radius.lg,
                              borderWidth: 1,
                              borderColor: colors.primary.borderLight,
                              padding: spacing[3],
                              backgroundColor: colors.background.surface,
                              gap: spacing[1],
                            }}>
                            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                              {user.name}
                            </Text>
                            <Text variant="caption" style={{ color: colors.text.secondary }}>
                              {[user.memberId, user.phone, user.city].filter(Boolean).join(' | ')}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}

                    {grantSelectedUser ? (
                      <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary.muted, padding: spacing[3], gap: spacing[1] }}>
                        <Text variant="caption" style={{ color: colors.text.secondary }}>
                          {t('grant.selectedUser')}
                        </Text>
                        <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {grantSelectedUser.name}
                        </Text>
                        <Text variant="caption" style={{ color: colors.text.secondary }}>
                          {[grantSelectedUser.memberId, grantSelectedUser.phone, grantSelectedUser.city].filter(Boolean).join(' | ')}
                        </Text>
                      </View>
                    ) : null}

                    <SelectField
                      label={t('grant.subscriptionType')}
                      labelVariant="default"
                      variant="registration"
                      value={grantType}
                      onSelect={(value) => setGrantType(value === 'VIEWER_ONLY' ? 'VIEWER_ONLY' : 'PROFILE_CREATION')}
                      options={[
                        { value: 'PROFILE_CREATION', label: t('grant.option.profileCreation') },
                        { value: 'VIEWER_ONLY', label: t('grant.option.viewerOnly') },
                      ]}
                    />

                    <View style={{ gap: spacing[2] }}>
                      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {t('grant.paymentMode')}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                        <View style={{ flex: 1 }}>
                          <Button variant={grantMode === 'PAID' ? 'primary' : 'outline'} fullWidth onPress={() => setGrantMode('PAID')}>
                            {t('grant.markPaid')}
                          </Button>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Button variant={grantMode === 'COMPLIMENTARY' ? 'primary' : 'outline'} fullWidth onPress={() => setGrantMode('COMPLIMENTARY')}>
                            {t('grant.complimentary')}
                          </Button>
                        </View>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                      <View style={{ flex: 1 }}>
                        <DateField label={t('grant.subscriptionStart')} labelVariant="default" variant="registration" value={grantStartsAt} onChange={setGrantStartsAt} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <DateField label={t('grant.subscriptionEnd')} labelVariant="default" variant="registration" value={grantEndsAt} onChange={setGrantEndsAt} />
                      </View>
                    </View>

                    {grantMode === 'PAID' ? (
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        <View style={{ flex: 1 }}>
                          <TextField
                            label={t('grant.amountPaid')}
                            labelVariant="default"
                            variant="registration"
                            value={grantAmountPaid}
                            onChangeText={setGrantAmountPaid}
                            keyboardType="decimal-pad"
                            placeholder={configuredGrantPrice}
                            helperText={t('grant.configuredAmount', { amount: configuredGrantPrice })}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <TextField
                            label={t('grant.paymentReference')}
                            labelVariant="default"
                            variant="registration"
                            value={grantPaymentRef}
                            onChangeText={setGrantPaymentRef}
                            placeholder={t('grant.paymentReferencePlaceholder')}
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[3] }}>
                        <Text variant="caption" style={{ color: colors.text.secondary }}>
                          {t('grant.complimentaryDescription')}
                        </Text>
                      </View>
                    )}

                    {grantError ? (
                      <Text variant="caption" style={{ color: colors.status.error }}>
                        {grantError}
                      </Text>
                    ) : null}
                    {grantSuccess ? (
                      <Text variant="caption" style={{ color: colors.status.success }}>
                        {grantSuccess}
                      </Text>
                    ) : null}

                    <Button variant="primary" fullWidth loading={grantSaving} disabled={grantSaving} onPress={grantSubscription}>
                      Grant Subscription
                    </Button>
                  </View>
                ) : null}

                <View style={{ flexDirection: 'column', gap: spacing[3] }}>
                  <MatrimonyAnalyticsMetricCard
                    title={t('metric.activeProfiles')}
                    value={formatNumber(analytics.metrics.activeProfiles)}
                    icon="group"
                    trend={formatTrend(analytics.metrics.activeProfilesTrendPercent)}
                    trendTone={getTrendTone(analytics.metrics.activeProfilesTrendPercent)}
                    caption={t('caption.lastMonth')}
                  />
                  <MatrimonyAnalyticsMetricCard
                    title={t('metric.activeViewProfiles')}
                    value={formatNumber(analytics.metrics.activeViewerSubscriptions)}
                    icon="visibility"
                    trend="0%"
                    caption={t('caption.viewerSubscriptions')}
                  />
                  <MatrimonyAnalyticsMetricCard
                    title={t('metric.newThisMonth')}
                    value={formatNumber(analytics.metrics.newActiveProfilesThisMonth)}
                    icon="person-add"
                    trend={formatTrend(analytics.metrics.newActiveProfilesTrendPercent)}
                    trendTone={getTrendTone(analytics.metrics.newActiveProfilesTrendPercent)}
                    caption={t('caption.lastMonth')}
                  />
                  <MatrimonyAnalyticsMetricCard
                    title={t('metric.subscriptionRevenue')}
                    value={formatCurrency(analytics.metrics.revenueGenerated)}
                    icon="payments"
                    trend={formatTrend(analytics.metrics.revenueTrendPercent)}
                    trendTone={getTrendTone(analytics.metrics.revenueTrendPercent)}
                    caption={t('caption.lastMonth')}
                  />
                </View>

                <View style={{ marginTop: spacing[4] }}>
                  <AnalyticsChartCard
                    title={t('chart.title')}
                    subtitle={t('chart.subtitle')}
                    bars={bars}
                    headerRight={
                      <View style={{ borderRadius: 999, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                        <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                          Monthly
                        </Text>
                      </View>
                    }
                  />
                </View>

                <View style={{ marginTop: spacing[4], gap: spacing[3] }}>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                    Recent Profile Approvals
                  </Text>
                  <View style={{ borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
                    {analytics.recentApprovals.length ? (
                      analytics.recentApprovals.map((profile, index) => (
                        <View key={profile.id}>
                          <MatrimonyApprovalRow
                            name={profile.name}
                            locationAge={profile.locationAge}
                            status={mapApprovalStatus(profile.status)}
                            image={profile.image}
                          />
                          {index < analytics.recentApprovals.length - 1 ? <View style={{ height: 1, backgroundColor: 'rgba(242,120,13,0.06)' }} /> : null}
                        </View>
                      ))
                    ) : (
                      <View style={{ padding: spacing[4] }}>
                        <Text variant="body" color={colors.text.secondary}>
                          No matrimony profile activity yet.
                        </Text>
                      </View>
                    )}
                    <View style={{ backgroundColor: '#f8fafc', padding: spacing[4], alignItems: 'center' }}>
                      <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.85}
                        onPress={() =>
                          router.push(
                            {
                              pathname: '/admin/matrimony-profiles',
                              params: { returnTo: buildMatrimonyAnalyticsReturnPath() },
                            } as never,
                          )
                        }>
                        <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                          {t('actions.viewAllRequests')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            ) : null}
      </View>
      <Dialog
        visible={settingsDialog.visible}
        variant={settingsDialog.variant}
        title={settingsDialog.title}
        description={settingsDialog.description}
        onConfirm={() => setSettingsDialog((current) => ({ ...current, visible: false }))}
        onCancel={() => setSettingsDialog((current) => ({ ...current, visible: false }))}
      />
      <SelectionPopup
        visible={showExportPopup}
        title="Export report"
        subtitle="Download all matrimony profiles with analytics summary."
        options={[
          { key: 'pdf', label: 'PDF statement' },
          { key: 'excel', label: 'Excel XLSX' },
        ]}
        selectedKey={exportFormat}
        onSelect={(key) => setExportFormat(key === 'excel' ? 'excel' : 'pdf')}
        onClose={() => setShowExportPopup(false)}
        onConfirm={() => { void handleDownloadReport(); }}
        confirmLabel={isDownloadingReport ? 'Downloading...' : 'Download'}
      />
    </FormScreenLayout>
  );
}
