import { FormikProvider } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { AppFormSkeleton, AppHeader, Button, FormScreenLayout, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { formSchemas } from '@/src/components/forms/validation';
import { useAppForm } from '@/src/hooks/useForm';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { directoryService, type DirectoryMemberFormValues, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';

type AdminTrusteeFormProps = {
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

export function AdminTrusteeFormContent({ memberId, mode }: AdminTrusteeFormProps) {
  const navigateBack = useBackNavigation();
  const { safeBack } = useSafeNavigation();
  const t = useTranslations('admin.manage-trustees');
  const [member, setMember] = useState<DirectoryMemberItem | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [loadError, setLoadError] = useState<string | null>(null);

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
        setLoadError(t('form.notFound'));
      }

      setMember(result);
      setIsLoading(false);
    }).catch((error) => {
      if (!active) {
        return;
      }

      setLoadError(error instanceof Error ? error.message : t('form.errors.load'));
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
          const created = await directoryService.createMember(values);

          if (!created) {
            throw new Error(t('form.errors.save'));
          }

          await directoryService.assignMemberRoles(created.id, {
            userType: 'trustee',
            roleKeys: [],
          });
        }

        safeBack('/admin/manage-trustees');
      } catch (error) {
        helpers.setStatus({
          error: error instanceof Error ? error.message : t('form.errors.save'),
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
          <Button variant="secondary" fullWidth onPress={navigateBack}>
            {t('form.actions.cancel')}
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button fullWidth onPress={() => formik.submitForm()} loading={formik.isSubmitting}>
            {mode === 'edit' ? t('form.actions.saveEdit') : t('form.actions.saveAdd')}
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
          title={mode === 'edit' ? t('form.title.edit') : t('form.title.add')}
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
              {t('form.notFoundDescription')}
            </Text>
          </View>
        </View>
      ) : (
        <FormikProvider value={formik}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[4] }}>
            <TextField
              name="fullName"
              label={t('form.labels.fullName')}
              placeholder={t('form.placeholders.fullName')}
              variant="registration"
              labelVariant="default"
              required
            />

            <TextField
              name="phone"
              label={t('form.labels.mobile')}
              placeholder={t('form.placeholders.mobile')}
              keyboardType="phone-pad"
              variant="registration"
              labelVariant="default"
              required
            />

            <TextField
              name="email"
              label={t('form.labels.email')}
              placeholder={t('form.placeholders.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="state"
              label={t('form.labels.state')}
              placeholder={t('form.placeholders.state')}
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="city"
              label={t('form.labels.city')}
              placeholder={t('form.placeholders.city')}
              variant="registration"
              labelVariant="default"
            />

            <TextField
              name="pincode"
              label={t('form.labels.pincode')}
              placeholder={t('form.placeholders.pincode')}
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
