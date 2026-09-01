import { FormikProvider } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppFormSkeleton, AppHeader, Button, FormScreenLayout, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useAppForm } from '@/src/hooks/useForm';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { formSchemas } from '@/src/components/forms/validation';
import { directoryService, type DirectoryMemberItem, type DirectoryMemberFormValues } from '@/src/features/directory/services/directory-service';

type AdminDirectoryMemberFormProps = {
  memberId?: string;
  mode: 'add' | 'edit';
};

function buildInitialValues(member?: DirectoryMemberItem | null): DirectoryMemberFormValues {
  return {
    fullName: member?.title || '',
    phone: member?.phone || '',
    email: member?.email || '',
    city: member?.city || '',
    state: member?.state || '',
    pincode: member?.pincode || '',
  };
}

export function AdminDirectoryMemberFormContent({ memberId, mode }: AdminDirectoryMemberFormProps) {
  const navigateBack = useBackNavigation();
  const { safeReplace } = useSafeNavigation();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const t = useTranslations('admin.directory-member-form');
  const [member, setMember] = useState<DirectoryMemberItem | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [loadError, setLoadError] = useState<string | null>(null);
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;

  useEffect(() => {
    let active = true;

    if (mode !== 'edit' || !memberId) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setLoadError(null);
    directoryService.loadMember(memberId).then((result) => {
      if (!active) {
        return;
      }
      if (!result) {
        setLoadError(t('notFound'));
      }
      setMember(result);
      setIsLoading(false);
    }).catch((error) => {
      if (!active) {
        return;
      }
      setLoadError(error instanceof Error ? error.message : t('errors.load'));
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [memberId, mode, t]);

  const initialValues = useMemo(() => buildInitialValues(member), [member]);

  const formik = useAppForm<DirectoryMemberFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchemas.directoryMember,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      try {
        if (mode === 'edit' && memberId) {
          await directoryService.updateMember(memberId, values);
        } else {
          await directoryService.createMember(values);
        }
        safeReplace(
          returnTo
            ? `/admin/manage-directory?returnTo=${encodeURIComponent(returnTo)}&refresh=${Date.now()}`
            : `/admin/manage-directory?refresh=${Date.now()}`,
        );
      } catch (error) {
        helpers.setStatus({
          error: error instanceof Error ? error.message : 'Unable to save member.',
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const footer = !isLoading && !loadError ? (
    <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Button variant="outline" fullWidth disabled={formik.isSubmitting} onPress={navigateBack}>
            Cancel
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <Button fullWidth loading={formik.isSubmitting} disabled={formik.isSubmitting} onPress={() => formik.submitForm()}>
            Save
          </Button>
        </View>
      </View>
    </View>
  ) : isLoading ? (
    <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        <AppFormSkeleton fields={0} />
      </View>
    </View>
  ) : null;

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={mode === 'edit' ? t('title.edit') : t('title.add')}
          variant="back-inline"
          onLeftPress={navigateBack}
        />
      }
      footer={footer}>
      {isLoading ? (
        <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[4], backgroundColor: colors.background.DEFAULT }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <AppFormSkeleton fields={6} showFooter={false} />
          </View>
        </View>
      ) : loadError ? (
        <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6], backgroundColor: colors.background.DEFAULT }}>
          <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
            <Text style={{ color: colors.text.primary, fontSize: 18, fontFamily: typography.fontFamily.bold }}>
              {loadError}
            </Text>
            <Text style={{ color: colors.text.muted }}>
              {t('notFound.description')}
            </Text>
          </View>
        </View>
      ) : (
        <FormikProvider value={formik}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[4] }}>
            <TextField
              name="fullName"
              label={t('labels.fullName')}
              placeholder={t('placeholders.fullName')}
              variant="registration"
              labelVariant="default"
              required
            />

            <TextField
              name="phone"
              label={t('labels.mobile')}
              placeholder={t('placeholders.mobile')}
              keyboardType="phone-pad"
              variant="registration"
              labelVariant="default"
              required
            />

            <TextField
              name="email"
              label={t('labels.email')}
              placeholder={t('placeholders.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="state"
              label={t('labels.state')}
              placeholder={t('placeholders.state')}
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="city"
              label={t('labels.city')}
              placeholder={t('placeholders.city')}
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="pincode"
              label={t('labels.pincode')}
              placeholder={t('placeholders.pincode')}
              keyboardType="number-pad"
              maxLength={6}
              variant="registration"
              labelVariant="default"
            />

            {formik.status?.error ? (
              <Text style={{ color: colors.status.error }}>
                {formik.status.error}
              </Text>
            ) : null}
          </View>
        </FormikProvider>
      )}
    </FormScreenLayout>
  );
}
