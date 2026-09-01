import { View } from 'react-native';
import { FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

import { AppHeader, Button, DateField, Dialog, FileUpload, FormScreenLayout, SelectField, Text, TextField } from '@/src/components';
import { fieldSchemas } from '@/src/components/forms/validation';
import { bloodGroupOptions } from '@/src/constants/blood-groups';
import type { DialogVariant } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { useAppForm } from '@/src/hooks/useForm';
import { useProfile } from '@/src/features/profile/hooks';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

type ProfileEditValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  fullNameEn: string;
  email: string;
  subCommunity: string;
  gender: string;
  dob: Date | undefined;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  panNumber: string;
  bloodGroup: string;
  profilePhoto: FileValue | null;
};

type FeedbackDialogState = {
  visible: boolean;
  variant: DialogVariant;
  title: string;
  description: string;
  navigateOnConfirm: boolean;
};

const DOB_MIN_DATE = new Date(1900, 0, 1);

function parseDate(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getToday() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

export function ChangeProfileDetailsContent() {
  const navigateBack = useBackNavigation();
  const { safeBack } = useSafeNavigation();
  const { session } = useSession();
  const { profile, isSubmitting, saveProfile } = useProfile();
  const t = useTranslations('profile.my-profile');
  const isAdmin = isAdminLikeSession(session);
  const hasPendingProfileRequest = !isAdmin && profile?.profileUpdateRequest?.status === 'PENDING';
  const profileRoute = isAdmin ? '/admin/profile' : '/profile/my-profile';
  const today = getToday();
  const [feedbackDialog, setFeedbackDialog] = useState<FeedbackDialogState>({
    visible: false,
    variant: 'info',
    title: '',
    description: '',
    navigateOnConfirm: false,
  });
  const formik = useAppForm<ProfileEditValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.firstName || '',
      middleName: profile?.middleName || '',
      lastName: profile?.lastName || '',
      fullNameEn: profile?.fullNameEn || '',
      email: profile?.email || '',
      subCommunity: profile?.subCommunity || '',
      gender: profile?.gender || '',
      dob: parseDate(profile?.dob),
      addressLine1: profile?.addressLine1 || '',
      addressLine2: profile?.addressLine2 || '',
      city: profile?.city || '',
      state: profile?.state || '',
      country: 'India',
      pincode: profile?.pincode || '',
      panNumber: profile?.panNumber || '',
      bloodGroup: profile?.bloodGroup || '',
      profilePhoto: null,
    },
    validationSchema: Yup.object({
      firstName: fieldSchemas.name,
      lastName: fieldSchemas.name,
      gender: fieldSchemas.requiredSelect,
      dob: fieldSchemas.date.max(today, t('edit.validation.dobFuture')),
      addressLine1: fieldSchemas.address,
      city: Yup.string().required(t('edit.validation.cityRequired')),
      state: Yup.string().required(t('edit.validation.stateRequired')),
      country: Yup.string().required(t('edit.validation.countryRequired')),
      pincode: fieldSchemas.pincode,
      panNumber: fieldSchemas.panOptional,
      bloodGroup: Yup.string().oneOf(bloodGroupOptions.map((option) => option.value), t('edit.validation.bloodGroupInvalid')).optional(),
      email: fieldSchemas.emailOptional,
    }),
    onSubmit: async (values, helpers) => {
      const fullName = [values.firstName, values.middleName, values.lastName].map((part) => part.trim()).filter(Boolean).join(' ');
      try {
        const saved = await saveProfile({
          ...(profile || {
            memberId: null,
            fullNameGu: '',
            addressEn: '',
            addressGu: '',
            mobileNumber: session?.user.mobileNumber || '',
            status: null,
            profilePhotoUrl: null,
          }),
          firstName: values.firstName.trim(),
          middleName: values.middleName.trim(),
          lastName: values.lastName.trim(),
          fullNameEn: fullName || values.fullNameEn.trim(),
          email: values.email.trim(),
          subCommunity: values.subCommunity.trim(),
          gender: values.gender,
          dob: values.dob ? values.dob.toISOString() : null,
          addressLine1: values.addressLine1.trim(),
          addressLine2: values.addressLine2.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          country: values.country.trim(),
          pincode: values.pincode.trim(),
          panNumber: values.panNumber.trim().toUpperCase() || null,
          bloodGroup: values.bloodGroup.trim() || null,
          addressEn: [
            values.addressLine1,
            values.addressLine2,
            values.city,
            values.state,
            values.country,
            values.pincode,
          ].map((part) => part.trim()).filter(Boolean).join(', '),
          profilePhoto: values.profilePhoto,
        });

        helpers.resetForm({
          values: {
            firstName: saved.firstName || values.firstName,
            middleName: saved.middleName || values.middleName,
            lastName: saved.lastName || values.lastName,
            fullNameEn: saved.fullNameEn,
            email: saved.email,
            subCommunity: saved.subCommunity || values.subCommunity,
            gender: saved.gender || values.gender,
            dob: parseDate(saved.dob) || values.dob,
            addressLine1: saved.addressLine1 || values.addressLine1,
            addressLine2: saved.addressLine2 || values.addressLine2,
            city: saved.city || values.city,
            state: saved.state || values.state,
            country: saved.country || values.country,
            pincode: saved.pincode || values.pincode,
            panNumber: saved.panNumber ?? '',
            bloodGroup: saved.bloodGroup ?? '',
            profilePhoto: null,
          },
        });
        setFeedbackDialog({
          visible: true,
          variant: 'success',
          title: saved.profileUpdateRequest ? t('edit.feedback.requestTitle') : t('edit.feedback.updatedTitle'),
          description: saved.profileUpdateRequest
            ? t('edit.feedback.requestDescription')
            : t('edit.feedback.updatedDescription'),
          navigateOnConfirm: true,
        });
      } catch (error) {
        setFeedbackDialog({
          visible: true,
          variant: 'error',
          title: t('edit.feedback.errorTitle'),
          description: error instanceof Error ? error.message : t('edit.feedback.tryAgain'),
          navigateOnConfirm: false,
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const {
    countryOptions,
    stateOptions,
    cityOptions,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
  } = useCountryStateCityOptions({
    countryName: formik.values.country || 'India',
    stateName: formik.values.state || '',
  });

  return (
    <>
    <FormScreenLayout
      header={
        <AppHeader
          variant="back-inline"
          title={t('edit.title')}
          titleVariant="h5"
          contentMaxWidth={448}
          rightSlot={<View style={{ width: 40, height: 40 }} />}
        />
      }
      footer={
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <Button variant="outline" fullWidth onPress={() => safeBack(profileRoute)}>
                {t('edit.actions.cancel')}
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button
                fullWidth
                loading={isSubmitting || formik.isSubmitting}
                disabled={isSubmitting || formik.isSubmitting || hasPendingProfileRequest}
                onPress={() => {
                  formik.setTouched({ ...formik.touched, country: true, state: true, city: true }, true);
                  void formik.submitForm();
                }}>
                {hasPendingProfileRequest ? t('edit.actions.requestPending') : isAdmin ? t('edit.actions.saveProfile') : t('edit.actions.sendRequest')}
              </Button>
            </View>
          </View>
        </View>
      }>
      <View style={{ backgroundColor: colors.background.DEFAULT }}>
        <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[5] }}>
          <View style={{ paddingTop: spacing[3], paddingBottom: spacing[5], gap: spacing[2] }}>
            <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {isAdmin ? t('edit.headingAdmin') : t('edit.headingMember')}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary }}>
              {isAdmin ? t('edit.subtitleAdmin') : hasPendingProfileRequest ? t('edit.subtitlePendingMember') : t('edit.subtitleMember')}
            </Text>
          </View>

          <FormikProvider value={formik}>
            <View style={{ gap: spacing[5] }}>
              <TextField
                name="firstName"
                label={t('edit.fields.firstName')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.firstName')}
                required
              />
              <TextField
                name="middleName"
                label={t('edit.fields.middleName')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.middleName')}
              />
              <TextField
                name="lastName"
                label={t('edit.fields.lastName')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.lastName')}
                required
              />
              <TextField
                label={t('fields.fullNameEn')}
                labelVariant="default"
                variant="registration"
                placeholder={t('fields.fullNameEn')}
                value={[formik.values.firstName, formik.values.middleName, formik.values.lastName].map((part) => part.trim()).filter(Boolean).join(' ')}
                onChangeText={() => undefined}
                disabled
              />
              <TextField
                name="email"
                label={t('fields.email')}
                labelVariant="default"
                variant="registration"
                placeholder={t('fields.email')}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <TextField
                name="subCommunity"
                label={t('edit.fields.subCommunity')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.subCommunity')}
              />
              <SelectField
                name="gender"
                label={t('edit.fields.gender')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.selectGender')}
                options={[
                  { label: t('edit.gender.male'), value: 'male' },
                  { label: t('edit.gender.female'), value: 'female' },
                  { label: t('edit.gender.other'), value: 'other' },
                ]}
                required
              />
              <DateField
                name="dob"
                label={t('edit.fields.dob')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.dob')}
                mode="date"
                minimumDate={DOB_MIN_DATE}
                maximumDate={today}
                required
              />
              <TextField
                name="addressLine1"
                label={t('edit.fields.addressLine1')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.addressLine1')}
                multiline
                numberOfLines={3}
                required
              />
              <TextField
                name="addressLine2"
                label={t('edit.fields.addressLine2')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.addressLine2')}
              />
              <SelectField
                label={t('edit.fields.country')}
                labelVariant="default"
                variant="registration"
                placeholder={isLoadingCountries ? t('edit.loading.countries') : t('edit.fields.selectCountry')}
                value={formik.values.country}
                onSelect={(value) => {
                  formik.setFieldValue('country', value);
                  formik.setFieldValue('state', '');
                  formik.setFieldValue('city', '');
                }}
                options={countryOptions}
                required
              />
              <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label={t('edit.fields.state')}
                    labelVariant="default"
                    variant="registration"
                    placeholder={formik.values.country ? (isLoadingStates ? t('edit.loading.states') : t('edit.fields.selectState')) : t('edit.fields.selectCountryFirst')}
                    value={formik.values.state}
                    onSelect={(value) => {
                      formik.setFieldValue('state', value);
                      formik.setFieldTouched('state', true, false);
                      formik.setFieldValue('city', '');
                      formik.setFieldTouched('city', false, false);
                    }}
                    options={formik.values.country ? stateOptions : []}
                    disabled={!formik.values.country || isLoadingStates}
                    error={formik.touched.state ? formik.errors.state : undefined}
                    required
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label={t('edit.fields.city')}
                    labelVariant="default"
                    variant="registration"
                    placeholder={formik.values.state ? (isLoadingCities ? t('edit.loading.cities') : t('edit.fields.selectCity')) : t('edit.fields.selectStateFirst')}
                    value={formik.values.city}
                    onSelect={(value) => {
                      formik.setFieldValue('city', value);
                      formik.setFieldTouched('city', true, false);
                    }}
                    options={formik.values.state ? cityOptions : []}
                    disabled={!formik.values.state || isLoadingCities}
                    error={formik.touched.city ? formik.errors.city : undefined}
                    required
                  />
                </View>
              </View>
              <TextField
                name="pincode"
                label={t('fields.pincode')}
                labelVariant="default"
                variant="registration"
                placeholder={t('fields.pincode')}
                keyboardType="number-pad"
                maxLength={6}
                required
              />
              <TextField
                label={t('edit.fields.pan')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.panPlaceholder')}
                value={formik.values.panNumber}
                onChangeText={(value) => {
                  formik.setFieldValue('panNumber', value.toUpperCase());
                }}
                error={formik.touched.panNumber ? formik.errors.panNumber : undefined}
                autoCapitalize="characters"
                maxLength={10}
              />
              <SelectField
                name="bloodGroup"
                label={t('edit.fields.bloodGroup')}
                labelVariant="default"
                variant="registration"
                placeholder={t('edit.fields.selectBloodGroup')}
                options={bloodGroupOptions.map((option) => ({ label: option.label, value: option.value }))}
              />
              <FileUpload
                name="profilePhoto"
                label={t('fields.profilePhoto')}
                emptyTitle={t('edit.photo.emptyTitle')}
                emptyDescription={t('edit.photo.emptyDescription')}
                existingPreviewUri={profile?.profilePhotoUrl || null}
                existingPreviewName={profile?.profilePhotoUrl ? t('fields.uploaded') : undefined}
                imagePickerOptions={{ enabled: true, aspect: [1, 1] }}
              />
            </View>
          </FormikProvider>
        </View>
      </View>
    </FormScreenLayout>
    <Dialog
      visible={feedbackDialog.visible}
      variant={feedbackDialog.variant}
      title={feedbackDialog.title}
      description={feedbackDialog.description}
      onConfirm={() => {
        const shouldNavigate = feedbackDialog.navigateOnConfirm;
        setFeedbackDialog((current) => ({ ...current, visible: false }));
        if (shouldNavigate) {
          safeBack(profileRoute);
        }
      }}
      onCancel={() => setFeedbackDialog((current) => ({ ...current, visible: false }))}
    />
    </>
  );
}
