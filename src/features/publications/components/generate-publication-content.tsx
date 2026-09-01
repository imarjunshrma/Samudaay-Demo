import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppHeader, AppSafeAreaView, Button, Checkbox, DateField, Dialog, FileUpload, FormScreenLayout, SelectField, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';
import type { DialogVariant } from '@/src/components/feedback/Dialog/Dialog';
import { publicationFeedService } from '../services/publication-feed-service';

function getEffectivePermissions(rawPermissions: string[] = [], communityPermissions: string[] = []) {
  return new Set([...(rawPermissions ?? []), ...(communityPermissions ?? [])]);
}

function hasPublicationManagePermission(permissionSet: Set<string>) {
  return permissionSet.has('publication.manage') || permissionSet.has('publications.manage');
}

type PopupState = {
  visible: boolean;
  variant: Exclude<DialogVariant, 'confirm'>;
  title: string;
  description?: string;
  onConfirm?: () => void;
};

export function GeneratePublicationContent() {
  const t = useTranslations('publications.generate');
  const navigateBack = useBackNavigation();
  const { language } = useAppPreferences();
  const { session, permissions } = useSession();
  const effectivePermissions = getEffectivePermissions(permissions, session?.user.communityPermissions ?? []);
  const canManagePublications = hasPublicationManagePermission(effectivePermissions);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publicationType, setPublicationType] = useState<'SYSTEM_GENERATED' | 'MANUAL_UPLOAD'>('SYSTEM_GENERATED');
  const [coverImage, setCoverImage] = useState<FileValue | null>(null);
  const [documentFile, setDocumentFile] = useState<FileValue | null>(null);
  const [maxProfiles, setMaxProfiles] = useState('12');
  const [includeAds, setIncludeAds] = useState(true);
  const [includeMatrimony, setIncludeMatrimony] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupState | null>(null);

  function showPopup(variant: Exclude<DialogVariant, 'confirm'>, title: string, description?: string, onConfirm?: () => void) {
    setPopup({ visible: true, variant, title, description, onConfirm });
  }

  const generatedTitle = useMemo(() => {
    try {
      return selectedMonth.toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-IN', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, [language, selectedMonth]);

  const helperSubtitle = publicationType === 'MANUAL_UPLOAD'
    ? t('helper.manual')
    : t('helper.generated');

  async function handleSubmit() {
    if (!canManagePublications) {
      return;
    }

    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();
    const finalTitle = title.trim() || t('defaults.generatedTitle', { month: generatedTitle });

    try {
      setIsSubmitting(true);
      const created = await publicationFeedService.createPublication({
        title: finalTitle,
        description,
        month,
        year,
        publicationType,
        includeAds,
        includeMatrimony,
        maxProfiles: includeMatrimony && maxProfiles.trim() ? Number(maxProfiles) : null,
        templateLayout: 'standard',
        coverImage,
        file: documentFile,
      });

      if (publicationType === 'SYSTEM_GENERATED') {
        await publicationFeedService.performAction(created.id, 'generate');
      }

      showPopup(
        'success',
        t('alerts.title'),
        publicationType === 'SYSTEM_GENERATED' ? t('alerts.generatedSuccess') : t('alerts.manualSuccess'),
        () => navigateBack('/publications/archive'),
      );
    } catch (submitError) {
      showPopup('error', t('alerts.title'), submitError instanceof Error ? submitError.message : t('alerts.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!canManagePublications) {
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <AppHeader title={t('access.header')} variant="back-inline" onLeftPress={navigateBack} />
          <View style={{ flex: 1, padding: spacing[4], justifyContent: 'center' }}>
            <View
              style={{
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: '#ffffff',
                padding: spacing[5],
                gap: spacing[3],
                alignItems: 'center',
              }}>
              <MaterialIcons name="lock-outline" size={34} color={colors.primary.DEFAULT} />
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary, textAlign: 'center' }}>
                {t('access.title')}
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                {t('access.description')}
              </Text>
            </View>
          </View>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <FormScreenLayout
      header={<AppHeader title={t('header.manage')} variant="back-inline" onLeftPress={navigateBack} />}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ gap: spacing[6], maxWidth: 672, alignSelf: 'center', width: '100%', paddingTop: spacing[4], paddingHorizontal: spacing[4], paddingBottom: spacing[6] }}>
          <View style={{ gap: spacing[2] }}>
            <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {t('section.month.title')}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary }}>
              {helperSubtitle}
            </Text>
          </View>

          <DateField
            label={t('section.month.label')}
            value={selectedMonth}
            onChange={(value) => {
              if (value) {
                setSelectedMonth(value);
              }
            }}
            mode="date"
            variant="registration"
            labelVariant="default"
            placeholder={t('section.month.placeholder')}
          />

          <TextField
            label={t('fields.title')}
            labelVariant="default"
            placeholder={t('defaults.generatedTitle', { month: generatedTitle })}
            value={title}
            onChangeText={setTitle}
            variant="registration"
          />

          <TextField
            label={t('fields.description')}
            labelVariant="default"
            placeholder={t('placeholders.description')}
            value={description}
            onChangeText={setDescription}
            variant="registration"
            multiline
            numberOfLines={4}
          />

          <SelectField
            label={t('fields.type')}
            labelVariant="default"
            placeholder={t('placeholders.type')}
            value={publicationType}
            onSelect={(value) => setPublicationType(value as 'SYSTEM_GENERATED' | 'MANUAL_UPLOAD')}
            options={[
              { label: t('options.systemGenerated'), value: 'SYSTEM_GENERATED' },
              { label: t('options.manualUpload'), value: 'MANUAL_UPLOAD' },
            ]}
            variant="registration"
          />

          <FileUpload
            label={t('fields.coverImage')}
            value={coverImage}
            onChange={setCoverImage}
            helperText={t('helpers.coverImage')}
            documentTypes="image/*"
            variant="card"
          />

          {publicationType === 'MANUAL_UPLOAD' ? (
            <FileUpload
              label={t('fields.pdf')}
              value={documentFile}
              onChange={setDocumentFile}
              helperText={t('helpers.pdf')}
              documentTypes={['application/pdf']}
              variant="card"
            />
          ) : null}

          <View style={{ gap: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: '#ffffff', padding: spacing[4] }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              {t('section.content')}
            </Text>
            <Checkbox label={t('fields.includeAds')} checked={includeAds} onChange={() => setIncludeAds((current) => !current)} />
            <Checkbox label={t('fields.includeMatrimony')} checked={includeMatrimony} onChange={() => setIncludeMatrimony((current) => !current)} />
            {includeMatrimony ? (
              <TextField
                label={t('fields.maxProfiles')}
                labelVariant="default"
                placeholder={t('placeholders.maxProfiles')}
                value={maxProfiles}
                onChangeText={setMaxProfiles}
                variant="registration"
                keyboardType="number-pad"
              />
            ) : null}
          </View>

          <Button
            fullWidth
            leftIcon={<MaterialIcons name="picture-as-pdf" size={18} color={colors.text.inverse} />}
            onPress={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting}>
            {publicationType === 'SYSTEM_GENERATED' ? t('actions.createAndGenerate') : t('actions.createManual')}
          </Button>
        </View>
      </View>
      <Dialog
        visible={Boolean(popup?.visible)}
        variant={popup?.variant || 'info'}
        title={popup?.title || ''}
        description={popup?.description}
        confirmLabel={t('actions.ok')}
        onConfirm={() => {
          const callback = popup?.onConfirm;
          setPopup(null);
          callback?.();
        }}
      />
    </FormScreenLayout>
  );
}
