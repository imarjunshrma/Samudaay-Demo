import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppHeader, Button, SelectField, SelectionPopup, Text, TextField } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '@/src/features/finance/services/analytics-report-service';
import { colors, radius, spacing, typography } from '@/src/theme';
import { adminUserService, type AdminAppMembershipReportItem, type AdminAppSettings, type AdminUserRegistrationSummary } from '../services/admin-user-service';

type KycSkipMode = AdminAppSettings['kycSkipMode'];

function formatCurrency(value: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function kycSkipLabel(value: KycSkipMode) {
  if (value === 'ALL') return 'All users';
  if (value === 'INVITED_ONLY') return 'Invited users only';
  return 'Do not skip KYC';
}

export function AdminRegistrationAnalyticsContent() {
  const navigateBack = useBackNavigation();
  const [summary, setSummary] = useState<AdminUserRegistrationSummary | null>(null);
  const [settings, setSettings] = useState<AdminAppSettings | null>(null);
  const [kycSkipMode, setKycSkipMode] = useState<KycSkipMode>('NONE');
  const [yearlyPaymentEnabled, setYearlyPaymentEnabled] = useState(false);
  const [yearlyPaymentAmount, setYearlyPaymentAmount] = useState('0');
  const [membershipDurationDays, setMembershipDurationDays] = useState('365');
  const [yearlyGraceDays, setYearlyGraceDays] = useState('30');
  const [renewalReminderEnabled, setRenewalReminderEnabled] = useState(true);
  const [renewalReminderDays, setRenewalReminderDays] = useState('30,15,7,1');
  const [restrictAfterGrace, setRestrictAfterGrace] = useState(true);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [reportSummary, setReportSummary] = useState<{
    total: number;
    invited: number;
    registered: number;
    paid: number;
    unpaid: number;
    renewalDue: number;
    gracePeriod: number;
    expired: number;
    locked: number;
  } | null>(null);
  const [reportItems, setReportItems] = useState<AdminAppMembershipReportItem[]>([]);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextSummary, nextSettings, nextReport] = await Promise.all([
        adminUserService.loadUserRegistrationSummary(),
        adminUserService.loadAppSettings(),
        adminUserService.loadAppMembershipReport({ limit: 250 }),
      ]);
      setSummary(nextSummary);
      setSettings(nextSettings);
      setKycSkipMode(nextSettings.kycSkipMode);
      setYearlyPaymentEnabled(nextSettings.yearlyAppPaymentEnabled);
      setYearlyPaymentAmount(String(nextSettings.yearlyAppPaymentAmount || 0));
      setMembershipDurationDays(String(nextSettings.membershipDurationDays ?? 365));
      setYearlyGraceDays(String(nextSettings.yearlyPaymentGraceDays ?? 30));
      setRenewalReminderEnabled(nextSettings.renewalReminderEnabled !== false);
      setRenewalReminderDays((nextSettings.renewalReminderDays || [30, 15, 7, 1]).join(','));
      setRestrictAfterGrace(nextSettings.restrictAppAfterGracePeriod !== false);
      setReportItems(nextReport.items);
      setReportSummary(nextReport.summary);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load registration analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const amount = useMemo(() => Number(yearlyPaymentAmount || 0), [yearlyPaymentAmount]);
  const currency = settings?.yearlyAppPaymentCurrency || 'INR';

  const saveSettings = useCallback(async () => {
    const graceDays = Number.parseInt(yearlyGraceDays || '0', 10);
    const durationDays = Number.parseInt(membershipDurationDays || '365', 10);
    const reminderDays = renewalReminderDays
      .split(',')
      .map((entry) => Number.parseInt(entry.trim(), 10))
      .filter((entry) => Number.isInteger(entry) && entry > 0);
    if (!Number.isFinite(amount) || amount < 0 || (yearlyPaymentEnabled && amount <= 0)) {
      setError('Enter a valid yearly amount greater than 0 when payment is enabled.');
      return;
    }
    if (!Number.isInteger(graceDays) || graceDays < 0) {
      setError('Enter valid grace days.');
      return;
    }
    if (!Number.isInteger(durationDays) || durationDays <= 0) {
      setError('Enter valid membership duration days.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await adminUserService.updateAppSettings({
        kycSkipMode,
        yearlyAppPaymentEnabled: yearlyPaymentEnabled,
        yearlyAppPaymentAmount: Math.round(amount * 100) / 100,
        yearlyAppPaymentCurrency: currency,
        membershipDurationDays: durationDays,
        yearlyPaymentGraceDays: graceDays,
        renewalReminderEnabled,
        renewalReminderDays: reminderDays,
        restrictAppAfterGracePeriod: restrictAfterGrace,
      });
      setSettings(updated);
      setKycSkipMode(updated.kycSkipMode);
      setYearlyPaymentEnabled(updated.yearlyAppPaymentEnabled);
      setYearlyPaymentAmount(String(updated.yearlyAppPaymentAmount || 0));
      setMembershipDurationDays(String(updated.membershipDurationDays ?? 365));
      setYearlyGraceDays(String(updated.yearlyPaymentGraceDays ?? 30));
      setRenewalReminderEnabled(updated.renewalReminderEnabled !== false);
      setRenewalReminderDays((updated.renewalReminderDays || [30, 15, 7, 1]).join(','));
      setRestrictAfterGrace(updated.restrictAppAfterGracePeriod !== false);
      Alert.alert('Settings saved', 'Registration settings have been updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save registration settings.');
    } finally {
      setSaving(false);
    }
  }, [amount, currency, kycSkipMode, membershipDurationDays, renewalReminderDays, renewalReminderEnabled, restrictAfterGrace, yearlyGraceDays, yearlyPaymentEnabled]);

  const downloadReport = useCallback(async () => {
    setDownloadingReport(true);
    try {
      await downloadAnalyticsReport({
        title: 'Registration Membership Report',
        subtitle: 'Invited users with app login, registration, KYC, and yearly payment status',
        fileBaseName: 'registration-membership-report',
        format: exportFormat,
        summary: [
          { label: 'Invited', value: String(reportSummary?.invited ?? summary?.invited ?? 0) },
          { label: 'Registered', value: String(reportSummary?.registered ?? summary?.registered ?? 0) },
          { label: 'Paid', value: String(reportSummary?.paid ?? summary?.paid ?? 0) },
          { label: 'Unpaid', value: String(reportSummary?.unpaid ?? summary?.unpaid ?? 0) },
          { label: 'Locked', value: String(reportSummary?.locked ?? summary?.locked ?? 0) },
        ],
        tables: [
          {
            title: 'Invited users',
            columns: ['Name (English)', 'Name (Second Language)', 'Phone', 'Email', 'Invited At', 'App Login', 'Registered', 'Registration Date', 'KYC Status', 'Payment Required', 'Payment Status', 'Membership Status', 'Renewal Status', 'App Access Status', 'Locked', 'Amount Due', 'Amount Paid', 'Paid At', 'Membership Starts At', 'Expires At', 'Grace Ends At'],
            rows: reportItems.map((item) => [
          item.nameEnglish || item.name,
          item.nameSecondLanguage || item.name,
          item.phone,
          item.email,
          item.invitedAt,
          item.appLoginStatus,
          item.registered ? 'Yes' : 'No',
          item.registrationDate,
          item.kycStatus,
          item.paymentRequired ? 'Yes' : 'No',
          item.paymentStatus,
          item.membershipStatus,
          item.renewalStatus,
          item.appAccessStatus,
          item.locked ? 'Yes' : 'No',
          item.amountDue,
          item.amountPaid,
          item.paidAt,
          item.membershipStartsAt,
          item.expiresAt,
          item.graceEndsAt,
            ]),
          },
        ],
      });
    } catch (downloadError) {
      Alert.alert('Download failed', downloadError instanceof Error ? downloadError.message : 'Unable to download report.');
    } finally {
      setShowExportPopup(false);
      setDownloadingReport(false);
    }
  }, [exportFormat, reportItems, reportSummary, summary]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title="Registration Analytics"
          subtitle="KYC and yearly access settings"
          onLeftPress={navigateBack}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 80 }}>
          <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center', gap: spacing[4] }}>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              {[
                { label: 'Invited', value: reportSummary?.invited ?? summary?.invited ?? 0, icon: 'schedule', color: colors.status.warning },
                { label: 'Registered', value: reportSummary?.registered ?? summary?.registered ?? 0, icon: 'verified-user', color: colors.status.success },
              ].map((item) => (
                <View
                  key={item.label}
                  style={{
                    flex: 1,
                    borderRadius: radius.xl,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.primary.borderLight,
                    padding: spacing[4],
                    gap: spacing[2],
                  }}>
                  <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={item.color} />
                  <Text style={{ color: colors.text.primary, fontSize: 22, fontFamily: typography.fontFamily.bold }}>
                    {loading ? '-' : item.value}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              {[
                { label: 'Unpaid', value: reportSummary?.unpaid ?? 0, icon: 'payments', color: colors.status.error },
                { label: 'Locked', value: reportSummary?.locked ?? 0, icon: 'lock', color: colors.status.error },
              ].map((item) => (
                <View key={item.label} style={{ flex: 1, borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[2] }}>
                  <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={item.color} />
                  <Text style={{ color: colors.text.primary, fontSize: 22, fontFamily: typography.fontFamily.bold }}>
                    {loading ? '-' : item.value}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4] }}>
              <View>
                <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  Registration Settings
                </Text>
                <Text variant="caption" style={{ color: colors.text.muted, marginTop: 4 }}>
                  Configure KYC approval and yearly app payment for normal users.
                </Text>
              </View>

              <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary.muted, padding: spacing[3], gap: spacing[1] }}>
                <Text variant="caption" style={{ color: colors.text.secondary }}>
                  Current Setup
                </Text>
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  KYC: {kycSkipLabel(kycSkipMode)}
                </Text>
                <Text variant="body" style={{ color: colors.text.primary }}>
                  Yearly payment: {yearlyPaymentEnabled ? formatCurrency(amount, currency) : 'Disabled'}
                </Text>
              </View>

              <SelectField
                variant="dropdown"
                label="Skip KYC"
                labelVariant="default"
                value={kycSkipMode}
                onSelect={(value) => {
                  setKycSkipMode(value as KycSkipMode);
                  setError(null);
                }}
                options={[
                  { label: 'Do not skip KYC', value: 'NONE' },
                  { label: 'Invited users only', value: 'INVITED_ONLY' },
                  { label: 'All users', value: 'ALL' },
                ]}
              />

              <View style={{ gap: spacing[2] }}>
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  Yearly app payment
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setYearlyPaymentEnabled(false)}
                    style={{
                      flex: 1,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: !yearlyPaymentEnabled ? colors.primary.DEFAULT : colors.primary.borderLight,
                      backgroundColor: !yearlyPaymentEnabled ? colors.primary.muted : colors.background.surface,
                      padding: spacing[3],
                    }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      Disabled
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setYearlyPaymentEnabled(true)}
                    style={{
                      flex: 1,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: yearlyPaymentEnabled ? colors.primary.DEFAULT : colors.primary.borderLight,
                      backgroundColor: yearlyPaymentEnabled ? colors.primary.muted : colors.background.surface,
                      padding: spacing[3],
                    }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      Enabled
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {yearlyPaymentEnabled ? (
                <View style={{ gap: spacing[3] }}>
                  <TextField
                    label={`Yearly amount (${currency})`}
                    labelVariant="default"
                    variant="registration"
                    value={yearlyPaymentAmount}
                    onChangeText={(value) => {
                      setYearlyPaymentAmount(value);
                      setError(null);
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                  <TextField
                    label="Membership duration days"
                    labelVariant="default"
                    variant="registration"
                    value={membershipDurationDays}
                    onChangeText={(value) => {
                      setMembershipDurationDays(value);
                      setError(null);
                    }}
                    keyboardType="number-pad"
                    placeholder="365"
                  />
                  <TextField
                    label="Grace days after registration/expiry"
                    labelVariant="default"
                    variant="registration"
                    value={yearlyGraceDays}
                    onChangeText={(value) => {
                      setYearlyGraceDays(value);
                      setError(null);
                    }}
                    keyboardType="number-pad"
                    placeholder="30"
                  />
                  <SelectField
                    variant="dropdown"
                    label="Renewal reminders"
                    labelVariant="default"
                    value={renewalReminderEnabled ? 'enabled' : 'disabled'}
                    onSelect={(value) => {
                      setRenewalReminderEnabled(value === 'enabled');
                      setError(null);
                    }}
                    options={[
                      { label: 'Enabled', value: 'enabled' },
                      { label: 'Disabled', value: 'disabled' },
                    ]}
                  />
                  <TextField
                    label="Renewal reminder days"
                    labelVariant="default"
                    variant="registration"
                    value={renewalReminderDays}
                    onChangeText={(value) => {
                      setRenewalReminderDays(value);
                      setError(null);
                    }}
                    placeholder="30,15,7,1"
                    helperText="Comma separated days before expiry."
                  />
                  <SelectField
                    variant="dropdown"
                    label="Restrict after grace period"
                    labelVariant="default"
                    value={restrictAfterGrace ? 'yes' : 'no'}
                    onSelect={(value) => {
                      setRestrictAfterGrace(value === 'yes');
                      setError(null);
                    }}
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                  />
                </View>
              ) : null}

              {error ? (
                <Text variant="caption" style={{ color: colors.status.error }}>
                  {error}
                </Text>
              ) : null}

              <Button variant="primary" fullWidth loading={saving} disabled={saving || loading} onPress={saveSettings}>
                Save Settings
              </Button>
            </View>

            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[4] }}>
              <View>
                <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  Invited User Report
                </Text>
                <Text variant="caption" style={{ color: colors.text.muted, marginTop: 4 }}>
                  Download invited users with app login, registration, KYC, and yearly payment status.
                </Text>
              </View>
              <Button variant="outline" fullWidth loading={downloadingReport} disabled={downloadingReport || loading} onPress={() => setShowExportPopup(true)}>
                Download Report
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
      <SelectionPopup
        visible={showExportPopup}
        title="Export report"
        subtitle="Download invited users with registration and yearly payment status."
        options={[
          { key: 'pdf', label: 'PDF statement' },
          { key: 'excel', label: 'Excel XLSX' },
        ]}
        selectedKey={exportFormat}
        onSelect={(key) => setExportFormat(key === 'excel' ? 'excel' : 'pdf')}
        onClose={() => setShowExportPopup(false)}
        onConfirm={() => { void downloadReport(); }}
        confirmLabel={downloadingReport ? 'Downloading...' : 'Download'}
      />
    </AppSafeAreaView>
  );
}
