import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppBottomBar, AppHeader, AppHeaderSearch, Button, Card, Dialog, FilterChips, SearchInput, SelectField, Text } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { isPdfDownloadCancelledError } from '@/src/services/files/pdf-file';
import { colors, radius, spacing, typography } from '@/src/theme';
import { childrenEducationService, type MarksheetReportItem } from '../services/children-education-service';
import { AdminQuickInsightsSection } from '@/src/features/admin/components/admin-quick-insights-section';

const ALL_YEARS_VALUE = '__all__';
const ALL_UPLOAD_STATUS_VALUE = '__all__';
const ALL_DEPARTMENTS_VALUE = '__all__';

type MarksheetReportsContentProps = {
  mode?: 'forms' | 'admin';
};

type UploadStatusFilter = typeof ALL_UPLOAD_STATUS_VALUE | 'uploaded' | 'missing';

function getMarksheetFileLabel(record: MarksheetReportItem) {
  const fileName = String(record.fileName || '').trim();
  if (fileName) {
    return fileName;
  }

  const safeStudentName = String(record.studentName || 'marksheet')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ');

  return `${safeStudentName || 'marksheet'}-${record.academicYear}.pdf`;
}

function ReportInfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        minWidth: 132,
        flex: 1,
        borderRadius: radius.lg,
        backgroundColor: colors.background.surface,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[3],
        gap: 2,
      }}>
      <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.7 }}>
        {label}
      </Text>
      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
        {value}
      </Text>
    </View>
  );
}

function AdminMarksheetReportsTable({
  records,
  onDownload,
  t,
}: {
  records: MarksheetReportItem[];
  onDownload: (record: MarksheetReportItem) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const columns: Array<{ key: string; label: string; width: number; align?: 'center' | 'flex-start' }> = [
    { key: 'number', label: t('list.columns.number'), width: 56, align: 'center' as const },
    { key: 'student', label: t('list.columns.student'), width: 180 },
    { key: 'parent', label: t('list.columns.parent'), width: 180 },
    { key: 'standard', label: t('list.columns.standard'), width: 120 },
    { key: 'department', label: t('list.columns.department'), width: 130 },
    { key: 'year', label: t('list.columns.year'), width: 110 },
    { key: 'uploaded', label: t('list.columns.uploaded'), width: 110, align: 'center' as const },
    { key: 'file', label: t('list.columns.file'), width: 220 },
    { key: 'action', label: t('list.columns.action'), width: 118, align: 'center' as const },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ minWidth: '100%' }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.background.surface,
        }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.primary.subtle }}>
          {columns.map((column) => (
            <View
              key={column.key}
              style={{
                width: column.width,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[3],
                borderRightWidth: column.key === columns[columns.length - 1].key ? 0 : 1,
                borderRightColor: colors.primary.borderLight,
                alignItems: column.align === 'center' ? 'center' : 'flex-start',
                justifyContent: 'center',
              }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                {column.label}
              </Text>
            </View>
          ))}
        </View>

        {records.map((record, index) => (
          <View
            key={record.id}
            style={{
              flexDirection: 'row',
              backgroundColor: index % 2 === 0 ? colors.background.surface : colors.background.surfaceAlt,
              borderTopWidth: 1,
              borderTopColor: colors.primary.borderLight,
            }}>
            <View style={{ width: columns[0].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
                {String(record.number)}
              </Text>
            </View>
            <View style={{ width: columns[1].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {record.studentName}
              </Text>
            </View>
            <View style={{ width: columns[2].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {record.parentName}
              </Text>
            </View>
            <View style={{ width: columns[3].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {record.standardSemester}
              </Text>
            </View>
            <View style={{ width: columns[4].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {record.department}
              </Text>
            </View>
            <View style={{ width: columns[5].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {record.academicYear}
              </Text>
            </View>
            <View style={{ width: columns[6].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[2],
                  paddingVertical: 5,
                  backgroundColor: record.uploadedMarksheet ? colors.primary.subtle : colors.status.warningLight,
                }}>
                <Text variant="caption" style={{ color: record.uploadedMarksheet ? colors.primary.DEFAULT : '#b45309', fontFamily: typography.fontFamily.bold }}>
                  {record.uploadedMarksheet ? t('list.uploadedYes') : t('list.uploadedNo')}
                </Text>
              </View>
            </View>
            <View style={{ width: columns[7].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {getMarksheetFileLabel(record)}
              </Text>
            </View>
            <View style={{ width: columns[8].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.86}
                disabled={!record.fileUrl}
                onPress={() => onDownload(record)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[1],
                  borderRadius: radius.full,
                  backgroundColor: record.fileUrl ? colors.primary.subtle : colors.background.surfaceAlt,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[2],
                  opacity: record.fileUrl ? 1 : 0.55,
                }}>
                <MaterialIcons name="download" size={16} color={colors.primary.DEFAULT} />
                <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('actions.downloadFile')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function MarksheetReportsContent({ mode = 'forms' }: MarksheetReportsContentProps) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('forms.marksheet-reports');
  const isAdminMode = mode === 'admin';
  const [search, setSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(ALL_YEARS_VALUE);
  const [selectedUploadStatus, setSelectedUploadStatus] = useState<UploadStatusFilter>(ALL_UPLOAD_STATUS_VALUE);
  const [selectedDepartment, setSelectedDepartment] = useState(ALL_DEPARTMENTS_VALUE);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [records, setRecords] = useState<MarksheetReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadDialog, setDownloadDialog] = useState<{
    visible: boolean;
    variant: 'success' | 'error' | 'info' | 'confirm';
    title: string;
    description?: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    description: undefined,
  });
  const loadReport = useCallback(async (academicYear: string) => {
    setLoading(true);
    try {
      const result = await childrenEducationService.loadMarksheetReport(academicYear);
      setAcademicYears(result.academicYears);
      setRecords(result.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReport(selectedAcademicYear);
  }, [loadReport, selectedAcademicYear]);

  const academicYearOptions = useMemo(
    () => [
      { label: t('filters.allYears'), value: ALL_YEARS_VALUE },
      ...academicYears.map((year) => ({ label: year, value: year })),
    ],
    [academicYears, t],
  );
  const academicYearChips = useMemo(
    () => academicYearOptions.map((option) => ({ key: option.value, label: option.label })),
    [academicYearOptions],
  );
  const departmentOptions = useMemo(
    () => [
      { label: t('filters.allDepartments'), value: ALL_DEPARTMENTS_VALUE },
      ...Array.from(new Set(records.map((record) => String(record.department || '').trim()).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b))
        .map((department) => ({ label: department, value: department })),
    ],
    [records, t],
  );
  const uploadStatusChips = useMemo(
    () => [
      { key: ALL_UPLOAD_STATUS_VALUE, label: t('filters.statusAll') },
      { key: 'uploaded', label: t('filters.statusUploaded') },
      { key: 'missing', label: t('filters.statusMissing') },
    ],
    [t],
  );

  const filteredRecords = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !searchTerm || [
        record.studentName,
        record.parentName,
        record.standardSemester,
        record.department,
        record.academicYear,
        record.fileName,
      ].some((value) => String(value || '').toLowerCase().includes(searchTerm));

      const matchesUploadStatus =
        selectedUploadStatus === ALL_UPLOAD_STATUS_VALUE ||
        (selectedUploadStatus === 'uploaded' && record.uploadedMarksheet) ||
        (selectedUploadStatus === 'missing' && !record.uploadedMarksheet);

      const matchesDepartment =
        selectedDepartment === ALL_DEPARTMENTS_VALUE ||
        String(record.department || '').trim() === selectedDepartment;

      return matchesSearch && matchesUploadStatus && matchesDepartment;
    });
  }, [records, search, selectedDepartment, selectedUploadStatus]);

  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);
      await childrenEducationService.downloadMarksheetReportPdf(selectedAcademicYear);
    } catch (error) {
      if (isPdfDownloadCancelledError(error)) {
        return;
      }
      setDownloadDialog({
        visible: true,
        variant: 'error',
        title: t('download.failedTitle'),
        description: error instanceof Error ? error.message : t('download.failedDescription'),
      });
    } finally {
      setDownloading(false);
    }
  }, [selectedAcademicYear, t]);

  const handleDownloadDialogCancel = useCallback(() => {
    setDownloadDialog((current) => ({ ...current, visible: false }));
  }, []);

  const quickInsightItems = useMemo(
    () => [
      {
        id: 'records',
        label: t('insights.records'),
        value: String(filteredRecords.length),
        icon: 'description' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle,
      },
      {
        id: 'students',
        label: t('insights.students'),
        value: String(new Set(filteredRecords.map((record) => record.studentName)).size),
        icon: 'groups' as const,
        iconColor: colors.status.info,
        iconBackgroundColor: colors.status.infoLight,
      },
      {
        id: 'years',
        label: t('insights.years'),
        value: String(new Set(records.map((record) => record.academicYear)).size),
        icon: 'calendar-month' as const,
        iconColor: colors.status.warning,
        iconBackgroundColor: colors.status.warningLight,
      },
    ],
    [filteredRecords, records, t],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        {isAdminMode ? (
          <AppHeaderSearch
            title={t('title')}
            searchValue={search}
            onSearchValueChange={setSearch}
            searchActive={searchInHeader}
            onSearchPress={() => setSearchInHeader(true)}
            onCloseSearch={() => {
              setSearch('');
              setSearchInHeader(false);
            }}
            onBackPress={navigateBack}
            placeholder={t('filters.searchPlaceholder')}
          />
        ) : (
          <AppHeader
            variant="brand"
            leftSlot={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <MaterialIcons name="analytics" size={24} color={colors.primary.DEFAULT} />
                <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                  {t('title')}
                </Text>
              </View>
            }
            rightSlot={
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={handleDownload}
                style={{ padding: spacing[2], borderRadius: radius.full }}
              >
                <MaterialIcons name="picture-as-pdf" size={22} color={colors.primary.DEFAULT} />
              </TouchableOpacity>
            }
          />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: spacing[6],
            paddingHorizontal: spacing[4],
            paddingBottom: isAdminMode ? spacing[8] : 160,
          }}
        >
          <View style={{ gap: spacing[6], width: '100%', maxWidth: 672, alignSelf: 'center' }}>
            {isAdminMode ? (
              <AdminQuickInsightsSection
                title={t('insights.title')}
                periodLabel={t('insights.period')}
                actionLabel={t('actions.downloadPdf')}
                onActionPress={() => {
                  void handleDownload();
                }}
                items={quickInsightItems}
                compactAction
              />
            ) : (
              <Card
                variant="elevated"
                padding="lg"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[4] }}>
                  <View style={{ flex: 1, gap: spacing[2] }}>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {t('hero.badge')}
                    </Text>
                    <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      {t('hero.title')}
                    </Text>
                    <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
                      {t('hero.description')}
                    </Text>
                    <Text variant="caption" color={colors.text.muted}>
                      {t('hero.columns')}
                    </Text>
                  </View>
                  <View style={{ minWidth: 74, alignItems: 'center', borderRadius: radius.xl, backgroundColor: colors.background.surface, paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
                    <Text variant="h3" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                      {filteredRecords.length}
                    </Text>
                    <Text variant="caption" style={{ color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {t('hero.records')}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            <Card variant="default" padding="lg">
              <View style={{ gap: spacing[4] }}>
                {isAdminMode ? (
                  <View style={{ gap: spacing[3] }}>
                    <FilterChips
                      items={academicYearChips}
                      activeKey={selectedAcademicYear}
                      onPress={(value) => setSelectedAcademicYear(String(value))}
                    />
                    <FilterChips
                      items={uploadStatusChips}
                      activeKey={selectedUploadStatus}
                      onPress={(value) => setSelectedUploadStatus(String(value) as UploadStatusFilter)}
                    />
                    <Button
                      variant="primary"
                      fullWidth
                      loading={downloading}
                      onPress={handleDownload}
                      rightIcon={<MaterialIcons name="download" size={18} color="#ffffff" />}>
                      {t('actions.downloadPdf')}
                    </Button>
                    <View>
                      <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                        {t('filters.departmentLabel')}
                      </Text>
                      <SelectField
                        variant="registration"
                        value={selectedDepartment}
                        onSelect={setSelectedDepartment}
                        options={departmentOptions}
                        placeholder={t('filters.departmentPlaceholder')}
                      />
                    </View>
                  </View>
                ) : null}
                {isAdminMode ? null : (
                  <View>
                    <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                      {t('filters.searchLabel')}
                    </Text>
                    <SearchInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder={t('filters.searchPlaceholder')}
                    />
                  </View>
                )}

                {isAdminMode ? null : (
                  <View>
                    <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                      {t('filters.yearLabel')}
                    </Text>
                    <SelectField
                      variant="registration"
                      value={selectedAcademicYear}
                      onSelect={setSelectedAcademicYear}
                      options={academicYearOptions}
                      placeholder={t('filters.yearPlaceholder')}
                    />
                  </View>
                )}

                {isAdminMode ? null : (
                  <Button
                    variant="primary"
                    fullWidth
                    loading={downloading}
                    onPress={handleDownload}
                    rightIcon={<MaterialIcons name="download" size={18} color="#ffffff" />}>
                    {t('actions.downloadPdf')}
                  </Button>
                )}
              </View>
            </Card>

            <Card variant="default" padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], marginBottom: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <MaterialIcons name="description" size={20} color={colors.primary.DEFAULT} />
                  <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                    {t('list.title')}
                  </Text>
                </View>
              </View>

              {loading ? (
                <Text variant="body" color={colors.text.muted}>
                  {t('list.loading')}
                </Text>
              ) : filteredRecords.length === 0 ? (
                <Text variant="body" color={colors.text.muted}>
                  {t('list.empty')}
                </Text>
              ) : isAdminMode ? (
                <AdminMarksheetReportsTable
                  records={filteredRecords}
                  t={t}
                  onDownload={(item) => {
                    if (item.fileUrl) {
                      void Linking.openURL(item.fileUrl);
                    }
                  }}
                />
              ) : (
                <View style={{ gap: spacing[3] }}>
                  {filteredRecords.map((record) => (
                    <View
                      key={record.id}
                      style={{
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        borderColor: colors.primary.borderLight,
                        backgroundColor: colors.background.surface,
                        padding: spacing[4],
                        gap: spacing[3],
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[3] }}>
                        <View style={{ flex: 1, gap: 4 }}>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                            {t('list.rowNumber').replace('{number}', String(record.number))}
                          </Text>
                          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {record.studentName}
                          </Text>
                          <Text variant="body" color={colors.text.secondary}>
                            {t('list.parents').replace('{name}', record.parentName)}
                          </Text>
                        </View>
                        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.subtle, paddingHorizontal: spacing[3], paddingVertical: 6 }}>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                            {record.uploadedMarksheet ? t('list.uploadedYes') : t('list.uploadedNo')}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                        <ReportInfoItem label={t('list.columns.standard')} value={record.standardSemester} />
                        <ReportInfoItem label={t('list.columns.year')} value={record.academicYear} />
                        <ReportInfoItem label={t('list.columns.uploaded')} value={record.uploadedMarksheet ? t('list.uploadedYes') : t('list.uploadedNo')} />
                        <ReportInfoItem label={t('list.columns.file')} value={getMarksheetFileLabel(record)} />
                      </View>

                      <View style={{ gap: 4 }}>
                        <Text variant="body" color={colors.text.secondary}>
                          {t('list.department').replace('{value}', record.department)}
                        </Text>
                        <Text variant="caption" color={colors.text.muted}>
                          {new Date(record.createdAt).toLocaleDateString('en-IN')}
                        </Text>
                      </View>

                      <Button
                        variant="secondary"
                        fullWidth
                        onPress={() => {
                          if (record.fileUrl) {
                            void Linking.openURL(record.fileUrl);
                          }
                        }}
                        rightIcon={<MaterialIcons name="download" size={18} color={colors.primary.DEFAULT} />}>
                        {t('actions.downloadFile')}
                      </Button>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </View>
        </ScrollView>

        {isAdminMode ? null : (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <AppBottomBar
              variant="minimal"
              activeKey="reports"
              items={[
                { key: 'students', icon: 'badge', label: t('bottomNav.students') },
                { key: 'reports', icon: 'analytics', label: t('bottomNav.reports') },
                { key: 'upload', icon: 'upload-file', label: t('bottomNav.upload') },
                { key: 'profile', icon: 'account-circle', label: t('bottomNav.profile') },
              ]}
              onChange={(key) => {
                switch (key) {
                  case 'students':
                    router.push('/forms/children-education-directory' as never);
                    break;
                  case 'reports':
                    router.push('/forms/marksheet-reports' as never);
                    break;
                  case 'upload':
                    router.push('/forms/upload-marksheet' as never);
                    break;
                  case 'profile':
                    router.push('/profile/my-profile' as never);
                    break;
                }
              }}
            />
          </View>
        )}
        <Dialog
          visible={downloadDialog.visible}
          variant={downloadDialog.variant}
          title={downloadDialog.title}
          description={downloadDialog.description}
          confirmLabel="OK"
          onConfirm={handleDownloadDialogCancel}
        />
      </View>
    </AppSafeAreaView>
  );
}
