import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppHeader, Button, Card, Dialog, FileUpload, FormScreenLayout, SelectField, Text } from '@/src/components';
import { ImageViewer } from '@/src/components/media';
import { useTranslations } from '@/src/i18n/use-translations';
import type { FileValue } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme';
import { childrenEducationService, type ChildDirectoryItem } from '../services/children-education-service';
import { ChildPill, MarksheetPreviewCard } from './upload-marksheet-blocks';

function getCurrentAcademicStartYear() {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

const ACADEMIC_YEAR_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const startYear = getCurrentAcademicStartYear() - index;
  const endYear = startYear + 1;
  return {
    label: `${startYear} - ${endYear}`,
    value: `${startYear}-${endYear}`,
  };
});

const STANDARD_OPTIONS = [
  { label: '1st Standard', value: '1' },
  { label: '2nd Standard', value: '2' },
  { label: '3rd Standard', value: '3' },
  { label: '4th Standard', value: '4' },
  { label: '5th Standard', value: '5' },
  { label: '6th Standard', value: '6' },
  { label: '7th Standard', value: '7' },
  { label: '8th Standard', value: '8' },
  { label: '9th Standard', value: '9' },
  { label: '10th Standard', value: '10' },
  { label: '11th Standard', value: '11' },
  { label: '12th Standard', value: '12' },
];

const DEPARTMENT_OPTIONS = [
  { label: 'PrePrimary', value: 'PrePrimary' },
  { label: 'Primary', value: 'Primary' },
  { label: 'Higher Secondary', value: 'Higher Secondary' },
  { label: 'Diploma', value: 'Diploma' },
  { label: 'Graduate', value: 'Graduate' },
  { label: 'Master', value: 'Master' },
  { label: 'PhD', value: 'PhD' },
];

type UploadMarksheetContentProps = {
  selectedFamilyMemberId?: string | null;
};

export function UploadMarksheetContent({ selectedFamilyMemberId = null }: UploadMarksheetContentProps) {
  const router = useRouter();
  const t = useTranslations('forms.upload-marksheet');
  const [marksheet, setMarksheet] = useState<FileValue | null>(null);
  const [children, setChildren] = useState<ChildDirectoryItem[]>([]);
  const [records, setRecords] = useState<Awaited<ReturnType<typeof childrenEducationService.loadMarksheetRecords>>>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(selectedFamilyMemberId);
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEAR_OPTIONS[0]?.value ?? '');
  const [standardSemester, setStandardSemester] = useState('10');
  const [department, setDepartment] = useState('Primary');
  const [submitting, setSubmitting] = useState(false);
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    variant: 'success' | 'error' | 'info';
    title: string;
    description?: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    description: undefined,
  });

  const refreshRecords = useCallback(async (familyMemberId: string | null) => {
    if (!familyMemberId) {
      setRecords([]);
      return;
    }

    setRecordsLoading(true);
    try {
      const result = await childrenEducationService.loadMarksheetRecords(familyMemberId);
      setRecords(result);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    childrenEducationService.loadFamilyChildren().then((result) => {
      if (!active) return;
      setChildren(result);
      setSelectedChildId((current) => {
        if (current && result.some((child) => child.id === current)) {
          return current;
        }

        if (selectedFamilyMemberId && result.some((child) => child.id === selectedFamilyMemberId)) {
          return selectedFamilyMemberId;
        }

        return result[0]?.id ?? null;
      });
    });

    return () => {
      active = false;
    };
  }, [selectedFamilyMemberId]);

  useEffect(() => {
    void refreshRecords(selectedChildId);
  }, [selectedChildId, refreshRecords]);

  const childOptions = useMemo(
    () =>
      children.map((child) => ({
        id: child.id,
        name: child.name,
        image: child.image,
      })),
    [children],
  );

  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const selectedYearRecordCount = useMemo(
    () => records.filter((record) => record.academicYear === academicYear).length,
    [records, academicYear],
  );

  const isImageRecord = (record: { mimeType?: string | null; fileName?: string | null; fileUrl?: string | null }) => {
    const mimeType = String(record.mimeType || '').toLowerCase();
    if (mimeType.startsWith('image/')) {
      return true;
    }

    const nameOrUrl = String(record.fileName || record.fileUrl || '').toLowerCase();
    return /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(nameOrUrl);
  };

  const imageRecords = useMemo(
    () => records.filter((record) => isImageRecord(record)),
    [records],
  );

  const openRecord = (record: (typeof records)[number]) => {
    if (isImageRecord(record)) {
      const imageIndex = imageRecords.findIndex((item) => item.id === record.id);
      if (imageIndex >= 0) {
        setViewerIndex(imageIndex);
        return;
      }
    }

    if (record.fileUrl) {
      void Linking.openURL(record.fileUrl);
    }
  };

  const formatBytes = (value: number | null) => {
    if (!value) {
      return null;
    }

    if (value < 1024) {
      return `${value} B`;
    }

    if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(1)} KB`;
    }

    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  };

  function openDialog(next: {
    variant: 'success' | 'error' | 'info';
    title: string;
    description?: string;
  }) {
    setDialogState({
      visible: true,
      ...next,
    });
  }

  async function handleSubmit() {
    if (!selectedChildId || !marksheet) {
      openDialog({
        variant: 'error',
        title: t('alerts.missingTitle'),
        description: t('alerts.missingDescription'),
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = await childrenEducationService.saveMarksheet({
        familyMemberId: selectedChildId,
        academicYear,
        standardSemester,
        department,
        file: marksheet,
      });

      openDialog({
        variant: 'success',
        title: t('alerts.savedTitle'),
        description: t('alerts.savedDescription').replace('{name}', selectedChild?.name || t('alerts.selectedChildFallback')),
      });
      setMarksheet(null);
      setAcademicYear(result.academicYear || academicYear);
      setStandardSemester(result.standardSemester || standardSemester);
      await refreshRecords(selectedChildId);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('alerts.failedDescription');
      openDialog({
        variant: 'error',
        title: t('alerts.failedTitle'),
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormScreenLayout
      header={
        <AppHeader
          variant="back"
          title={t('title')}
          subtitle={t('subtitle')}
        />
      }
      footer={
        <View style={{ flex: 1, backgroundColor: colors.background.surface, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <Button fullWidth loading={submitting} disabled={!selectedChildId || !marksheet} onPress={handleSubmit} rightIcon={<MaterialIcons name="send" size={18} color="#ffffff" />}>
            {t('actions.submit')}
          </Button>
        </View>
      }>
      <View style={{ backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5] }}>
          <Card
            variant="elevated"
            padding="lg"
            style={{
              marginBottom: spacing[4],
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
              <View style={{ width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.background.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary.borderLight }}>
                <MaterialIcons name="school" size={24} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: colors.background.surface, paddingHorizontal: spacing[3], paddingVertical: 4 }}>
                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('hero.badge')}
                  </Text>
                </View>
                <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {t('hero.title')}
                </Text>
                <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
                  {t('hero.description')}
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="default" padding="lg" style={{ marginBottom: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing[4] }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('section.selectChild')}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[2] }}>
              {childOptions.map((child) => (
                <ChildPill
                  key={child.id}
                  name={child.name}
                  selected={selectedChildId === child.id}
                  image={child.image}
                  onPress={() => setSelectedChildId(child.id)}
                />
              ))}
              <ChildPill
                name={t('child.new')}
                image=""
                isNew
                onPress={() => router.push('/profile/family-management/add')}
              />
            </ScrollView>
          </Card>

          <Card variant="default" padding="lg" style={{ marginBottom: spacing[4] }}>
            <View style={{ marginBottom: spacing[4] }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                {t('section.academicYear')}
              </Text>
              <SelectField
                variant="registration"
                placeholder={t('placeholders.academicYear')}
                value={academicYear}
                onSelect={setAcademicYear}
                options={ACADEMIC_YEAR_OPTIONS}
              />
            </View>

            <View style={{ marginBottom: spacing[4] }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                {t('section.standard')}
              </Text>
              <SelectField
                variant="registration"
                placeholder={t('placeholders.standard')}
                value={standardSemester}
                onSelect={setStandardSemester}
                options={STANDARD_OPTIONS}
              />
            </View>

            <View>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                {t('section.department')}
              </Text>
              <SelectField
                variant="registration"
                placeholder={t('placeholders.department')}
                value={department}
                onSelect={setDepartment}
                options={DEPARTMENT_OPTIONS}
              />
            </View>

            <View
              style={{
                marginTop: spacing[4],
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                padding: spacing[4],
                gap: spacing[2],
              }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {t('yearSummary.badge')}
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {t('yearSummary.description')
                  .replace('{child}', selectedChild?.name || t('alerts.selectedChildFallback'))
                  .replace('{year}', academicYear)
                  .replace('{standard}', standardSemester)}
              </Text>
            </View>
          </Card>

          <Card variant="default" padding="lg" style={{ marginBottom: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <MaterialIcons name="upload-file" size={20} color={colors.primary.DEFAULT} />
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('section.upload')}
              </Text>
            </View>
            <FileUpload
              variant="marksheet"
              label={t('upload.label')}
              value={marksheet}
              onChange={setMarksheet}
              onPreview={() => undefined}
              helperText={t('upload.help')}
              emptyTitle={t('upload.title')}
              emptyDescription={t('upload.help')}
            />
          </Card>

          <Card variant="default" padding="lg" style={{ marginBottom: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], marginBottom: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <MaterialIcons name="history" size={20} color={colors.primary.DEFAULT} />
                <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {t('records.title')}
                </Text>
              </View>
              <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                {records.length}
              </Text>
            </View>

            <View
              style={{
                marginBottom: spacing[4],
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
              }}>
              <Text variant="body" color={colors.text.secondary}>
                {t('records.yearSummary')
                  .replace('{year}', academicYear)
                  .replace('{count}', String(selectedYearRecordCount))}
              </Text>
            </View>

            {recordsLoading ? (
              <Text variant="body" color={colors.text.muted}>
                {t('records.loading')}
              </Text>
            ) : records.length === 0 ? (
              <Text variant="body" color={colors.text.muted}>
                {t('records.empty')}
              </Text>
            ) : (
              <View style={{ gap: spacing[3] }}>
                {records.map((record) => (
                  <MarksheetPreviewCard
                    key={record.id}
                    fileName={record.fileName || `${selectedChild?.name || 'Marksheet'}-${record.academicYear}.pdf`}
                    fileSizeLabel={formatBytes(record.fileSizeBytes)}
                    academicYear={record.academicYear}
                    standardSemester={record.standardSemester}
                    department={record.department}
                    createdAt={record.createdAt}
                    onView={() => openRecord(record)}
                    onDelete={undefined}
                  />
                ))}
              </View>
            )}

            <View style={{ marginTop: spacing[4] }}>
              <Button
                variant="secondary"
                fullWidth
                onPress={() => router.push('/forms/marksheet-reports' as never)}
                rightIcon={<MaterialIcons name="analytics" size={18} color={colors.primary.DEFAULT} />}>
                {t('actions.viewYearWiseReports')}
              </Button>
            </View>
          </Card>
      </View>

        <ImageViewer
          images={imageRecords.map((record) => ({ uri: record.fileUrl }))}
          imageIndex={viewerIndex ?? 0}
          visible={viewerIndex !== null}
          onRequestClose={() => setViewerIndex(null)}
        />

        <Dialog
          visible={dialogState.visible}
          variant={dialogState.variant === 'success' ? 'success' : dialogState.variant === 'error' ? 'error' : 'info'}
          title={dialogState.title}
          description={dialogState.description}
          confirmLabel={t('dialog.ok')}
          onConfirm={() => setDialogState((current) => ({ ...current, visible: false }))}
        />

    </FormScreenLayout>
  );
}
