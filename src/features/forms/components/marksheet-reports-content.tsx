import { memo, useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
const REPORT_PAGE_SIZE = 20;

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

function formatMarksValue(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }

  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatPercentageValue(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }

  return `${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}%`;
}

const AdminMarksheetReportsTable = memo(function AdminMarksheetReportsTable({
  records,
  onDownload,
  onEditMarks,
  t,
}: {
  records: MarksheetReportItem[];
  onDownload: (record: MarksheetReportItem) => void;
  onEditMarks: (record: MarksheetReportItem) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const columns: { key: string; label: string; width: number; align?: 'center' | 'flex-start' }[] = [
    { key: 'number', label: t('list.columns.number'), width: 56, align: 'center' as const },
    { key: 'student', label: t('list.columns.student'), width: 180 },
    { key: 'parent', label: t('list.columns.parent'), width: 180 },
    { key: 'standard', label: t('list.columns.standard'), width: 120 },
    { key: 'department', label: t('list.columns.department'), width: 130 },
    { key: 'year', label: t('list.columns.year'), width: 110 },
    { key: 'totalMarks', label: 'Total Marks', width: 120, align: 'center' as const },
    { key: 'gainedMarks', label: 'Gain Marks', width: 120, align: 'center' as const },
    { key: 'percentage', label: 'Percentage', width: 120, align: 'center' as const },
    { key: 'uploaded', label: t('list.columns.uploaded'), width: 110, align: 'center' as const },
    { key: 'file', label: t('list.columns.file'), width: 220 },
    { key: 'action', label: t('list.columns.action'), width: 210, align: 'center' as const },
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
              <Text variant="body" color={colors.text.secondary}>
                {formatMarksValue(record.totalMarks)}
              </Text>
            </View>
            <View style={{ width: columns[7].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {formatMarksValue(record.gainedMarks)}
              </Text>
            </View>
            <View style={{ width: columns[8].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {formatPercentageValue(record.percentage)}
              </Text>
            </View>
            <View style={{ width: columns[9].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
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
            <View style={{ width: columns[10].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderRightWidth: 1, borderRightColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <Text variant="body" color={colors.text.secondary}>
                {getMarksheetFileLabel(record)}
              </Text>
            </View>
            <View style={{ width: columns[11].width, paddingHorizontal: spacing[3], paddingVertical: spacing[3], alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.86}
                  onPress={() => onEditMarks(record)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[1],
                    borderRadius: radius.full,
                    backgroundColor: colors.status.infoLight,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[2],
                  }}>
                  <MaterialIcons name="edit" size={16} color={colors.status.info} />
                  <Text variant="caption" style={{ color: colors.status.info, fontFamily: typography.fontFamily.bold }}>
                    Edit
                  </Text>
                </TouchableOpacity>
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

const MarksheetMarksEditorModal = memo(function MarksheetMarksEditorModal({
  record,
  visible,
  onCancel,
  onSave,
}: {
  record: MarksheetReportItem | null;
  visible: boolean;
  onCancel: () => void;
  onSave: (record: MarksheetReportItem, payload: { totalMarks: number | null; gainedMarks: number | null; percentage: number | null }) => Promise<void>;
}) {
  const [marksForm, setMarksForm] = useState({ totalMarks: '', gainedMarks: '', percentage: '' });
  const [savingMarks, setSavingMarks] = useState(false);
  const [marksError, setMarksError] = useState<string | null>(null);

  useEffect(() => {
    if (!record) {
      return;
    }

    setMarksForm({
      totalMarks: record.totalMarks === null || record.totalMarks === undefined ? '' : String(record.totalMarks),
      gainedMarks: record.gainedMarks === null || record.gainedMarks === undefined ? '' : String(record.gainedMarks),
      percentage: record.percentage === null || record.percentage === undefined ? '' : String(record.percentage),
    });
    setMarksError(null);
  }, [record]);

  const updateMarksField = useCallback((field: keyof typeof marksForm, value: string) => {
    setMarksForm((current) => ({ ...current, [field]: value.replace(/[^\d.]/g, '') }));
    setMarksError(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (!savingMarks) {
      onCancel();
    }
  }, [onCancel, savingMarks]);

  const handleSave = useCallback(async () => {
    if (!record) {
      return;
    }

    const totalMarks = marksForm.totalMarks.trim() ? Number(marksForm.totalMarks) : null;
    const gainedMarks = marksForm.gainedMarks.trim() ? Number(marksForm.gainedMarks) : null;
    const percentage = marksForm.percentage.trim() ? Number(marksForm.percentage) : null;

    if ([totalMarks, gainedMarks, percentage].some((value) => value !== null && (!Number.isFinite(value) || value < 0))) {
      setMarksError('Enter valid non-negative numbers.');
      return;
    }
    if (totalMarks !== null && gainedMarks !== null && gainedMarks > totalMarks) {
      setMarksError('Gain marks cannot be greater than total marks.');
      return;
    }
    if (percentage !== null && percentage > 100) {
      setMarksError('Percentage cannot be greater than 100.');
      return;
    }

    setSavingMarks(true);
    try {
      await onSave(record, { totalMarks, gainedMarks, percentage });
    } catch (error) {
      setMarksError(error instanceof Error ? error.message : 'Unable to update marks.');
    } finally {
      setSavingMarks(false);
    }
  }, [marksForm, onSave, record]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={handleCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(17,24,39,0.48)', justifyContent: 'center', padding: spacing[4] }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            maxHeight: '92%',
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            overflow: 'hidden',
          }}>
          <View style={{ padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, backgroundColor: colors.primary.subtle }}>
            <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {record ? `Edit marks for ${record.studentName}` : 'Edit marks'}
            </Text>
          </View>
          <KeyboardAwareScrollView
            bottomOffset={96}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ padding: spacing[4], gap: spacing[3] }}>
            {[
              ['totalMarks', 'Total Marks'],
              ['gainedMarks', 'Gain Marks'],
              ['percentage', 'Percentage'],
            ].map(([field, label]) => (
              <View key={field} style={{ gap: spacing[1] }}>
                <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.bold }}>
                  {label}
                </Text>
                <TextInput
                  accessibilityLabel={label}
                  value={marksForm[field as keyof typeof marksForm]}
                  onChangeText={(value) => updateMarksField(field as keyof typeof marksForm, value)}
                  keyboardType="numeric"
                  style={{
                    minHeight: 44,
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    backgroundColor: colors.background.surface,
                    paddingHorizontal: spacing[3],
                    color: colors.text.primary,
                    fontFamily: typography.fontFamily.medium,
                  }}
                />
              </View>
            ))}
            {marksError ? (
              <Text variant="caption" color={colors.status.error}>
                {marksError}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', gap: spacing[3], paddingTop: spacing[2] }}>
              <View style={{ flex: 1 }}>
                <Button variant="outline" fullWidth rounded disabled={savingMarks} onPress={handleCancel}>
                  Cancel
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button fullWidth rounded loading={savingMarks} onPress={() => void handleSave()}>
                  Save
                </Button>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Pressable>
      </View>
    </Modal>
  );
});

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
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [records, setRecords] = useState<MarksheetReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [editingRecord, setEditingRecord] = useState<MarksheetReportItem | null>(null);
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
  const requestIdRef = useRef(0);

  const loadReport = useCallback(async ({ page, append = false }: { page: number; append?: boolean }) => {
    const requestId = ++requestIdRef.current;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setRecords([]);
      setCurrentPage(1);
      setHasNextPage(false);
      setTotalCount(0);
    }

    try {
      const result = await childrenEducationService.loadMarksheetReport({
        academicYear: selectedAcademicYear,
        page,
        limit: REPORT_PAGE_SIZE,
        search,
        department: selectedDepartment,
        uploadStatus: selectedUploadStatus,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setAcademicYears(result.academicYears);
      setAvailableDepartments(result.availableDepartments);
      setRecords((current) => {
        if (!append) {
          return result.items;
        }
        const existingIds = new Set(current.map((record) => record.id));
        return [...current, ...result.items.filter((record) => !existingIds.has(record.id))];
      });
      setCurrentPage(result.pagination?.page ?? page);
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setTotalCount(result.pagination?.total ?? result.pagination?.totalCount ?? result.items.length);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [search, selectedAcademicYear, selectedDepartment, selectedUploadStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadReport({ page: 1 });
    }, search.trim() ? 250 : 0);
    return () => clearTimeout(timer);
  }, [loadReport, search]);

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
      ...Array.from(new Set(availableDepartments.map((department) => String(department || '').trim()).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b))
        .map((department) => ({ label: department, value: department })),
    ],
    [availableDepartments, t],
  );
  const uploadStatusChips = useMemo(
    () => [
      { key: ALL_UPLOAD_STATUS_VALUE, label: t('filters.statusAll') },
      { key: 'uploaded', label: t('filters.statusUploaded') },
      { key: 'missing', label: t('filters.statusMissing') },
    ],
    [t],
  );

  const filteredRecords = records;

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    void loadReport({ page: currentPage + 1, append: true });
  }, [currentPage, hasNextPage, loadReport, loading, loadingMore]);

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

  const openMarksEditor = useCallback((record: MarksheetReportItem) => {
    setEditingRecord(record);
  }, []);

  const closeMarksEditor = useCallback(() => {
    setEditingRecord(null);
  }, []);

  const handleDownloadFile = useCallback((record: MarksheetReportItem) => {
    if (record.fileUrl) {
      void Linking.openURL(record.fileUrl);
    }
  }, []);

  const handleSaveMarks = useCallback(async (
    recordToUpdate: MarksheetReportItem,
    payload: { totalMarks: number | null; gainedMarks: number | null; percentage: number | null },
  ) => {
    const optimisticPercentage =
      payload.percentage ??
      (payload.totalMarks && payload.gainedMarks !== null
        ? Math.round((payload.gainedMarks / payload.totalMarks) * 10000) / 100
        : null);

    setEditingRecord(null);
    setRecords((current) => current.map((record) => (
      record.id === recordToUpdate.id
        ? {
            ...record,
            totalMarks: payload.totalMarks,
            gainedMarks: payload.gainedMarks,
            percentage: optimisticPercentage,
          }
        : record
    )));

    try {
      const updated = await childrenEducationService.updateMarksheetMarks(recordToUpdate.id, payload);
      setRecords((current) => current.map((record) => (
        record.id === recordToUpdate.id
          ? {
              ...record,
              totalMarks: updated.totalMarks ?? null,
              gainedMarks: updated.gainedMarks ?? null,
              percentage: updated.percentage ?? null,
            }
          : record
      )));
    } catch (error) {
      setRecords((current) => current.map((record) => (
        record.id === recordToUpdate.id ? recordToUpdate : record
      )));
      setDownloadDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to update marks',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, []);

  const quickInsightItems = useMemo(
    () => [
      {
        id: 'records',
        label: t('insights.records'),
        value: String(totalCount || filteredRecords.length),
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
    [filteredRecords, records, t, totalCount],
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
          scrollEventThrottle={250}
          onScroll={({ nativeEvent }) => {
            const distanceFromBottom = nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height - nativeEvent.contentOffset.y;
            if (distanceFromBottom < 240) {
              handleLoadMore();
            }
          }}
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
                  onEditMarks={openMarksEditor}
                  onDownload={handleDownloadFile}
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
                        <ReportInfoItem label="Total Marks" value={formatMarksValue(record.totalMarks)} />
                        <ReportInfoItem label="Gain Marks" value={formatMarksValue(record.gainedMarks)} />
                        <ReportInfoItem label="Percentage" value={formatPercentageValue(record.percentage)} />
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
            {loadingMore ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing[2] }}>
                <Text variant="caption" color={colors.text.muted}>
                  Loading more records...
                </Text>
              </View>
            ) : hasNextPage ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing[2] }}>
                <Text variant="caption" color={colors.text.muted}>
                  Scroll to load more
                </Text>
              </View>
            ) : null}
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
        <MarksheetMarksEditorModal
          visible={Boolean(editingRecord)}
          record={editingRecord}
          onCancel={closeMarksEditor}
          onSave={handleSaveMarks}
        />
      </View>
    </AppSafeAreaView>
  );
}
