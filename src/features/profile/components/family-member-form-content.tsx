import { useCallback, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { FormikProvider } from 'formik';

import { AppHeader, Button, FormScreenLayout, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useAppForm } from '@/src/hooks/useForm';
import { colors, spacing, typography } from '@/src/theme';
import { formSchemas } from '@/src/components/forms/validation/schemas';
import { profileService } from '@/src/features/profile/services/profile-service';
import { useTranslations } from '@/src/i18n/use-translations';
import { FamilyMemberFormCard, type FamilyMemberFormValues } from './family-management-blocks';
import type { FamilyListMember } from '../data/family';

type FamilyMemberFormMode = 'add' | 'edit';

export interface FamilyMemberFormContentProps {
  mode: FamilyMemberFormMode;
  member?: FamilyListMember | null;
}

function createDefaultValues(member?: FamilyListMember | null): FamilyMemberFormValues {
  const normalizeRelation = (value: string) => {
    const relation = value.trim().toLowerCase();
    if (['father', 'dad', 'papa', 'baba'].includes(relation)) return 'father';
    if (['mother', 'mom', 'mama'].includes(relation)) return 'mother';
    if (['spouse', 'husband', 'wife', 'partner'].includes(relation)) return 'spouse';
    if (relation === 'son') return 'son';
    if (relation === 'daughter') return 'daughter';
    if (['daughter inlaw', 'daughter-in-law', 'daughter in law', 'daughter_in_law'].includes(relation)) return 'daughter_in_law';
    if (['grand son', 'grand-son', 'grandson', 'grand_son'].includes(relation)) return 'grand_son';
    if (['grand daughter', 'grand-daughter', 'granddaughter', 'grand_daughter'].includes(relation)) return 'grand_daughter';
    if (['child', 'children', 'kid'].includes(relation)) return 'child';
    if (relation === 'other') return 'other';
    return 'other';
  };

  return {
    fullName: member?.title ?? '',
    relation: normalizeRelation(member?.subtitle.split('•')[0]?.trim() ?? ''),
    gender: (member?.gender as FamilyMemberFormValues['gender']) ?? '',
    dateOfBirth: member?.dob ? new Date(member.dob) : undefined,
    bloodGroup: member?.bloodGroup ?? '',
    aadhaarNumber: member?.aadhaarNumber ?? '',
    phone: member?.phone ?? '',
    email: member?.email ?? '',
    education: member?.education ?? '',
    schoolName: member?.schoolName ?? '',
    currentClass: member?.currentClass ?? '',
    occupation: member?.occupation ?? '',
  };
}

function createEmptyFormState() {
  return {
    values: createDefaultValues(),
    errors: {},
    touched: {},
    submitCount: 0,
  };
}

function getFamilyAadhaarFieldError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /aadhaar/i.test(message) ? message : fallback;
}

export function FamilyMemberFormContent({ mode, member }: FamilyMemberFormContentProps) {
  const navigateBack = useBackNavigation();
  const { safeBack, safeReplace } = useSafeNavigation();
  const t = useTranslations('profile.family-member-form');
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const defaultValues = useMemo(() => createDefaultValues(member), [member]);
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const formik = useAppForm<FamilyMemberFormValues>({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: formSchemas.familyMember,
    onSubmit: async (values, helpers) => {
      const { resetForm, setFieldError, setFieldTouched } = helpers;
      try {
        if (mode === 'edit' && member) {
          await profileService.updateFamilyMember(member.id, values);
        } else {
          await profileService.createFamilyMember(values);
        }
      } catch (error) {
        const aadhaarError = getFamilyAadhaarFieldError(error, t('errors.aadhaarSaveFailed'));
        setFieldTouched('aadhaarNumber', true, false);
        setFieldError('aadhaarNumber', aadhaarError);
        return;
      }
      resetForm(createEmptyFormState());
      safeReplace(
        returnTo
          ? `/profile/family-management?returnTo=${encodeURIComponent(returnTo)}&refresh=${Date.now()}`
          : `/profile/family-management?refresh=${Date.now()}`,
      );
    },
  });

  return (
    <FormScreenLayout
      header={
        <AppHeader
          variant="back-inline"
          title={mode === 'edit' ? t('title.edit') : t('title.add')}
          titleVariant="h5"
          contentMaxWidth={448}
          onLeftPress={navigateBack}
          rightSlot={
            <View style={{ width: 40, height: 40 }} />
          }
        />
      }
      footer={
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <Button variant="outline" fullWidth disabled={formik.isSubmitting} onPress={() => safeBack('/profile/family-management')}>
                {t('actions.cancel')}
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button fullWidth loading={formik.isSubmitting} disabled={formik.isSubmitting} onPress={() => formik.submitForm()}>
                {mode === 'edit' ? t('actions.update') : t('actions.save')}
              </Button>
            </View>
          </View>
        </View>
      }>
      <View style={{ backgroundColor: colors.background.DEFAULT }}>
        <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[5] }}>
          <View style={{ paddingTop: spacing[3], paddingBottom: spacing[5], gap: spacing[2] }}>
            <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {mode === 'edit' ? t('subtitle.edit') : t('subtitle.add')}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary }}>
              {t('subtitle.description')}
            </Text>
          </View>

          <FormikProvider value={formik}>
            <FamilyMemberFormCard />
          </FormikProvider>
        </View>
      </View>
    </FormScreenLayout>
  );
}
