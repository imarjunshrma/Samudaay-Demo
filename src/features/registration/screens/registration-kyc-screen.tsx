import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import { AppHeader, Button, DateField, FormScreenLayout, IconButton, OTPInput, PhoneInput, ProgressStepper, SelectField, Text, TextField } from '@/src/components';
import { bloodGroupOptions } from '@/src/constants/blood-groups';
import { KycDocumentUploadSection } from '@/src/features/registration/components/kyc-document-upload-section';
import { formSchemas } from '@/src/components/forms/validation';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { getDefaultRouteForSession, isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { authService, OTP_RESEND_COOLDOWN_SECONDS } from '@/src/features/auth/services/auth-service';
import { useSession } from '@/src/core/providers/session-provider';
import { communityConfig } from '@/src/core/config/community';
import { apiClient, apiEndpoints, apiQueryKeys, useConfiguredApiQuery } from '@/src/services/api';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { registrationService } from '@/src/features/registration/services/registration-service';
import { isPhoneNumberHintAvailable, requestPhoneNumberHint } from '@/src/services/device/phone-number-hint';
import { useCroppedImagePicker } from '@/src/services/device/use-cropped-image-picker';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

type RegistrationStep = 1 | 2 | 3;
const REGISTRATION_DOB_MIN_DATE = new Date(1900, 0, 1);

type CommunityOption = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
};

type ImageSourceChoice = 'camera' | 'gallery';

function chooseImageSource() {
  return new Promise<ImageSourceChoice | null>((resolve) => {
    Alert.alert('Upload image', 'Choose how you want to add the image.', [
      { text: 'Take Photo', onPress: () => resolve('camera') },
      { text: 'Choose from Gallery', onPress: () => resolve('gallery') },
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}

async function pickSingleFile({
  onPicked,
  pickImage,
  captureImage,
}: {
  onPicked: (file: FileValue) => void;
  pickImage: ReturnType<typeof useCroppedImagePicker>['pickImage'];
  captureImage: ReturnType<typeof useCroppedImagePicker>['captureImage'];
}) {
  const source = await chooseImageSource();
  if (!source) {
    return;
  }

  const pickerOptions = {
    fileNamePrefix: 'kyc',
  };
  const nextFile = source === 'camera'
    ? await captureImage(pickerOptions)
    : await pickImage(pickerOptions);
  if (!nextFile) {
    return;
  }

  onPicked(nextFile);
}

export function RegistrationKycScreen() {
  const router = useRouter();
  const t = useTranslations('auth.registration-kyc');
  const { pickImage, captureImage, cropper } = useCroppedImagePicker();
  const { tenantName } = useLocalizedBrandText();
  const { session, status, setSession, setStatus } = useSession();
  const [step, setStep] = useState<RegistrationStep>(() => (session ? 2 : 1));
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isDetectingPhone, setIsDetectingPhone] = useState(false);
  const [savedRegistrationId, setSavedRegistrationId] = useState<string | null>(null);
  const [registrationCountry, setRegistrationCountry] = useState('India');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [stepOneFormVersion, setStepOneFormVersion] = useState(0);
  const { signIn, confirmOtp, resendOtp, clearPendingOtp, errorMessage, isSubmitting, isResending } = useAuthActions();
  const {
    countryOptions,
    stateOptions,
    cityOptions,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    selectCountry,
    selectState,
  } = useCountryStateCityOptions();
  const hadSessionRef = useRef(Boolean(session));

  useEffect(() => {
    const hadSession = hadSessionRef.current;
    const hasSession = Boolean(session);

    if (status === 'loading') {
      hadSessionRef.current = hasSession;
      return;
    }

    if (session && (session.user.onboardingComplete || isAdminLikeSession(session))) {
      hadSessionRef.current = hasSession;
      router.replace(getDefaultRouteForSession(session) as never);
      return;
    }

    if (!hadSession && hasSession && step === 1) {
      setStep(2);
    }

    hadSessionRef.current = hasSession;
  }, [router, session, status, step]);

  useEffect(() => {
    if (!otpRequested || resendCountdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCountdown((current) => {
        return Math.max(0, current - 1);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpRequested, resendCountdown]);

  const communitiesQuery = useConfiguredApiQuery({
    queryKey: apiQueryKeys.tenants(),
    queryFn: async () => {
      const response = await apiClient<{ data: CommunityOption[] }>(apiEndpoints.publicCommunities);
      return response.data;
    },
    enabled: communityConfig.allowCommunitySwitch,
  });
  const communityOptions = useMemo(
    () => [
      ...(communitiesQuery.data?.map((community) => ({
        label: community.name,
        value: community.id,
      })) ?? []),
      ...(communitiesQuery.data?.length ? [] : [{ label: tenantName, value: communityConfig.tenantId }]),
    ],
    [communitiesQuery.data, tenantName],
  );
  const handleBackToStepOne = async () => {
    await clearPendingOtp();
    setOtpRequested(false);
    setResendCountdown(0);
    setStepOneFormVersion((current) => current + 1);
    setStep(1);
  };
  const headerTitle = step === 1 ? t('title') : step === 2 ? t('step.profileDetails') : t('step.completeRegistration');
  const headerLeftSlot = step === 2
    ? <IconButton icon="arrow-back" onPress={() => { void handleBackToStepOne(); }} variant="plain" />
    : <View style={{ width: 48, height: 48 }} />;

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={headerTitle}
          variant="centered"
          transparent
          leftSlot={headerLeftSlot}
          rightSlot={<View style={{ width: 48, height: 48 }} />}
        />
      }>
      <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
          <ProgressStepper currentStep={step} totalSteps={3} inactiveColor={colors.primary.border} />

          {step === 1 ? (
            <Formik
              key={stepOneFormVersion}
              initialValues={{
                mobile: '',
                otp: '',
                tenantId: session?.user.tenantId || communityConfig.tenantId,
              }}
              validationSchema={otpRequested ? formSchemas.registrationOTP : formSchemas.registrationAccess}
              onSubmit={async (values) => {
                const verified = await confirmOtp(values.otp);
                if (verified) {
                  setStep(2);
                }
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm, validateForm }) => (
                <View style={{ paddingBottom: spacing[8] }}>
                  <View style={{ paddingHorizontal: spacing[4] }}>
                    <Text
                      variant="h2"
                      style={{
                        paddingTop: spacing[5],
                        paddingBottom: spacing[2],
                        letterSpacing: -0.5,
                      }}>
                      {t('section.phone.title')}
                    </Text>
                    <Text
                      variant="body"
                      color="#475569"
                      style={{ paddingBottom: spacing[6], lineHeight: 24 }}>
                      {t('section.phone.description')}
                    </Text>

                    <View style={{ gap: spacing[6] }}>
                      {communityConfig.allowCommunitySwitch ? (
                        <SelectField
                          label={t('field.selectCommunity')}
                          value={values.tenantId}
                          onSelect={(value) => setFieldValue('tenantId', value)}
                          options={communityOptions}
                          variant="registration"
                          labelVariant="default"
                          disabled={otpRequested || communitiesQuery.isLoading}
                          placeholder={communitiesQuery.isLoading ? t('field.loadingCommunities') : t('field.chooseCommunity')}
                        />
                      ) : null}
                      <PhoneInput
                        label={t('field.mobile')}
                        value={values.mobile}
                        onChangeText={(value) => setFieldValue('mobile', value)}
                        error={touched.mobile ? errors.mobile : undefined}
                        disabled={otpRequested}
                        rightIcon={otpRequested ? 'edit' : undefined}
                        onRightIconPress={otpRequested ? async () => {
                          await clearPendingOtp();
                          setOtpRequested(false);
                          setResendCountdown(0);
                          setFieldValue('otp', '');
                        } : undefined}
                        rightIconAccessibilityLabel={t('actions.changeNumber')}
                      />
                      {!otpRequested && isPhoneNumberHintAvailable() ? (
                        <Button
                          variant="outline"
                          fullWidth
                          rounded
                          loading={isDetectingPhone}
                          disabled={isSubmitting}
                          onPress={async () => {
                            setIsDetectingPhone(true);
                            try {
                              const phoneNumber = await requestPhoneNumberHint();
                              if (phoneNumber) {
                                setFieldValue('mobile', phoneNumber);
                                setFieldTouched('mobile', true);
                              }
                            } finally {
                              setIsDetectingPhone(false);
                            }
                          }}>
                          {t('actions.useSimNumber')}
                        </Button>
                      ) : null}
                      {otpRequested ? (
                        <View style={{ gap: spacing[3] }}>
                          <OTPInput
                            label={t('field.otp')}
                            value={values.otp}
                            onChange={(value) => setFieldValue('otp', value)}
                            error={touched.otp ? errors.otp : undefined}
                            helperText={resendCountdown > 0 ? t('field.resendCountdown').replace('{seconds}', String(resendCountdown).padStart(2, '0')) : t('field.resendOtp')}
                            helperDisabled={resendCountdown > 0 || isResending}
                            onHelperPress={async () => {
                              if (resendCountdown > 0) {
                                return;
                              }
                              const ok = await resendOtp();
                              if (ok) {
                                setFieldValue('otp', '');
                                setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
                              }
                            }}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[8], gap: spacing[4] }}>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      rounded
                      loading={isSubmitting}
                      onPress={async () => {
                        setFieldTouched('mobile', true);
                        const currentErrors = await validateForm();
                        if (Object.keys(currentErrors).length > 0) {
                          return;
                        }

                        if (!otpRequested) {
                          const requested = await signIn({
                            mobileNumber: values.mobile,
                            pin: '',
                            preferredLanguage: 'en',
                            tenantId: values.tenantId,
                          });
                          if (requested) {
                            setOtpRequested(true);
                            setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
                          }
                          return;
                        }

                        setFieldTouched('otp', true);
                        await submitForm();
                      }}>
                      {otpRequested ? t('actions.verifyContinue') : t('actions.sendOtp')}
                    </Button>
                    {errorMessage ? (
                      <Text
                        variant="caption"
                        color="#b91c1c"
                        style={{ textAlign: 'center', paddingHorizontal: spacing[8] }}>
                        {errorMessage}
                      </Text>
                    ) : null}
                      <Text
                        variant="caption"
                        color="#6b7280"
                        style={{ textAlign: 'center', paddingHorizontal: spacing[8] }}>
                        {t('footer.consent')}
                      </Text>
                  </View>
                </View>
              )}
            </Formik>
          ) : null}

          {step === 2 ? (
            <Formik
              initialValues={{
                tenantId: session?.user.tenantId || communityConfig.tenantId,
                subCommunity: session?.user.subCommunity ?? '',
                firstName: '',
                middleName: '',
                lastName: '',
                gender: '',
                dob: undefined as Date | undefined,
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                country: 'India',
                pincode: '',
                aadhaarNumber: '',
                panNumber: '',
                passportNumber: '',
                bloodGroup: '',
              }}
              validationSchema={formSchemas.registrationProfile}
              onSubmit={async (values) => {
                const nextSession = await authService.completeCommunitySelection({
                  tenantId: values.tenantId,
                  subCommunity: values.subCommunity || undefined,
                });
                setSession(nextSession);
                setStatus('signedIn');
                setRegistrationCountry(values.country || 'India');

                const savedDraft = await registrationService.saveDraft({
                  registrationId: savedRegistrationId ?? undefined,
                  mobileNumber: nextSession.user.mobileNumber ?? '',
                  firstName: values.firstName,
                  middleName: values.middleName || undefined,
                  lastName: values.lastName,
                  gender: values.gender,
                  dob: values.dob ? values.dob.toISOString() : '',
                  addressLine1: values.addressLine1,
                  addressLine2: values.addressLine2 || undefined,
                  city: values.city,
                  state: values.state,
                  country: values.country,
                  pincode: values.pincode,
                  aadhaarNumber: values.aadhaarNumber.replace(/\D/g, '') || undefined,
                  panNumber: values.panNumber.trim().toUpperCase() || undefined,
                  passportNumber: values.passportNumber.trim().toUpperCase() || undefined,
                  bloodGroup: values.bloodGroup,
                  subCommunity: nextSession.user.subCommunity ?? undefined,
                  fullNameEn: [values.firstName, values.middleName, values.lastName].filter(Boolean).join(' '),
                  fullNameGu: '',
                  documents: [],
                });
                setSavedRegistrationId(savedDraft.registrationId ?? null);
                setStep(3);
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm, isSubmitting: isFormSubmitting }) => (
                <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[8], gap: spacing[4] }}>
                  <View style={{ gap: spacing[2], paddingTop: spacing[2], paddingBottom: spacing[2] }}>
                    <Text
                      variant="h2"
                      style={{
                        letterSpacing: -0.5,
                      }}>
                      {t('section.profile.title')}
                    </Text>
                    <Text
                      variant="body"
                      color="#475569"
                      style={{ lineHeight: 24 }}>
                      {t('section.profile.description')}
                    </Text>
                  </View>
                  {communityConfig.allowCommunitySwitch && communitiesQuery.isError ? (
                    <Text variant="caption" color="#b91c1c">
                      {t('error.communitiesLoad')}
                    </Text>
                  ) : null}
                  {communityConfig.allowCommunitySwitch ? (
                    <SelectField
                      label={t('field.selectCommunity')}
                      value={values.tenantId}
                      onSelect={() => undefined}
                      options={communityOptions}
                      error={touched.tenantId ? errors.tenantId : undefined}
                      variant="registration"
                      labelVariant="default"
                      placeholder={communitiesQuery.isLoading ? t('field.loadingCommunities') : t('field.chooseCommunity')}
                      disabled
                    />
                  ) : (
                    <View style={{ gap: 8 }}>
                      <Text variant="caption" color="#6b7280">
                        {t('field.community')}
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: colors.primary.border,
                          borderRadius: 12,
                          paddingHorizontal: spacing[4],
                          paddingVertical: spacing[3],
                          backgroundColor: colors.background.surface,
                        }}>
                        <Text variant="body" style={{ fontFamily: typography.fontFamily.medium }}>
                          {tenantName}
                        </Text>
                      </View>
                    </View>
                  )}
                  <TextField
                    label={t('field.subCommunity')}
                    value={values.subCommunity}
                    onChangeText={(value) => setFieldValue('subCommunity', value)}
                    placeholder={t('field.optionalSubCommunity')}
                    error={touched.subCommunity ? errors.subCommunity : undefined}
                    variant="registration"
                    labelVariant="default"
                  />
                  <TextField
                    label={t('field.firstName')}
                    value={values.firstName}
                    onChangeText={(value) => setFieldValue('firstName', value)}
                    placeholder={t('field.firstName')}
                    error={touched.firstName ? errors.firstName : undefined}
                    variant="registration"
                    labelVariant="default"
                    required
                  />
                  <TextField
                    label={t('field.middleName')}
                    value={values.middleName}
                    onChangeText={(value) => setFieldValue('middleName', value)}
                    placeholder={t('field.middleName')}
                    error={touched.middleName ? errors.middleName : undefined}
                    variant="registration"
                    labelVariant="default"
                  />
                  <TextField
                    label={t('field.lastName')}
                    value={values.lastName}
                    onChangeText={(value) => setFieldValue('lastName', value)}
                    placeholder={t('field.lastName')}
                    error={touched.lastName ? errors.lastName : undefined}
                    variant="registration"
                    labelVariant="default"
                    required
                  />
                  <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                    <View style={{ flex: 1 }}>
                      <SelectField
                        label={t('field.gender')}
                        value={values.gender}
                        onSelect={(value) => setFieldValue('gender', value)}
                        options={[
                          { label: t('field.gender.male'), value: 'male' },
                          { label: t('field.gender.female'), value: 'female' },
                          { label: t('field.gender.other'), value: 'other' },
                        ]}
                        error={touched.gender ? errors.gender : undefined}
                        variant="registration"
                        labelVariant="default"
                        placeholder={t('field.gender.placeholder')}
                        required
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <DateField
                        label={t('field.dob')}
                        value={values.dob}
                        onChange={(value) => setFieldValue('dob', value)}
                        placeholder={t('field.dob')}
                        error={touched.dob ? (errors.dob as string | undefined) : undefined}
                        variant="registration"
                        labelVariant="default"
                        mode="date"
                        minimumDate={REGISTRATION_DOB_MIN_DATE}
                        maximumDate={new Date()}
                        required
                      />
                    </View>
                  </View>
                  <SelectField
                    label={t('field.bloodGroup')}
                    value={values.bloodGroup}
                    onSelect={(value) => setFieldValue('bloodGroup', value)}
                    options={bloodGroupOptions.map((option) => ({ label: option.label, value: option.value }))}
                    error={touched.bloodGroup ? errors.bloodGroup : undefined}
                    variant="registration"
                    labelVariant="default"
                    placeholder={t('field.bloodGroup.placeholder')}
                  />
                  <TextField
                    label={t('field.address1')}
                    value={values.addressLine1}
                    onChangeText={(value) => setFieldValue('addressLine1', value)}
                    placeholder={t('field.address1')}
                    error={touched.addressLine1 ? errors.addressLine1 : undefined}
                    multiline
                    numberOfLines={3}
                    variant="registration"
                    labelVariant="default"
                    required
                  />
                  <TextField
                    label={t('field.address2')}
                    value={values.addressLine2}
                    onChangeText={(value) => setFieldValue('addressLine2', value)}
                    placeholder={t('field.address2')}
                    error={touched.addressLine2 ? errors.addressLine2 : undefined}
                    variant="registration"
                    labelVariant="default"
                  />
                  <SelectField
                    label={t('field.country')}
                    value={values.country}
                    onSelect={(value) => {
                      setFieldValue('country', value);
                      setFieldValue('state', '');
                      setFieldValue('city', '');
                      setFieldValue('aadhaarNumber', '');
                      setFieldValue('passportNumber', '');
                      selectCountry(value);
                    }}
                    options={countryOptions}
                    error={touched.country ? errors.country : undefined}
                    variant="registration"
                    labelVariant="default"
                    placeholder={isLoadingCountries ? t('field.country.loading') : t('field.country.select')}
                    required
                  />
                  <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                    <View style={{ flex: 1 }}>
                      <SelectField
                        label={t('field.state')}
                        value={values.state}
                        onSelect={(value) => {
                          setFieldValue('state', value);
                          setFieldValue('city', '');
                          selectState(value);
                        }}
                        options={values.country ? stateOptions : []}
                        error={touched.state ? errors.state : undefined}
                        variant="registration"
                        labelVariant="default"
                        placeholder={values.country ? (isLoadingStates ? t('field.state.loading') : t('field.state.select')) : t('field.state.first')}
                        disabled={!values.country || isLoadingStates}
                        required
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <SelectField
                        label={t('field.city')}
                        value={values.city}
                        onSelect={(value) => setFieldValue('city', value)}
                        options={values.state ? cityOptions : []}
                        error={touched.city ? errors.city : undefined}
                        variant="registration"
                        labelVariant="default"
                        placeholder={values.state ? (isLoadingCities ? t('field.city.loading') : t('field.city.select')) : t('field.city.first')}
                        disabled={!values.state || isLoadingCities}
                        required
                      />
                    </View>
                  </View>
                  <TextField
                    label={t('field.pincode')}
                    value={values.pincode}
                    onChangeText={(value) => setFieldValue('pincode', value.replace(/[^\d]/g, '').slice(0, 6))}
                    placeholder={t('field.pincode')}
                    keyboardType="number-pad"
                    maxLength={6}
                    error={touched.pincode ? errors.pincode : undefined}
                    variant="registration"
                    labelVariant="default"
                    required
                  />
                  {String(values.country || '').trim().toLowerCase() === 'india' ? (
                    <TextField
                      label={t('field.aadhaarNumber')}
                      value={values.aadhaarNumber}
                      onChangeText={(value) => setFieldValue('aadhaarNumber', value.replace(/\D/g, '').slice(0, 12))}
                      placeholder={t('field.aadhaarNumber.placeholder')}
                      keyboardType="number-pad"
                      maxLength={12}
                      error={touched.aadhaarNumber ? errors.aadhaarNumber : undefined}
                      variant="registration"
                      labelVariant="default"
                      required
                    />
                  ) : (
                    <TextField
                      label={t('field.passportNumber')}
                      value={values.passportNumber}
                      onChangeText={(value) => setFieldValue('passportNumber', value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))}
                      placeholder={t('field.passportNumber.placeholder')}
                      autoCapitalize="characters"
                      maxLength={12}
                      error={touched.passportNumber ? errors.passportNumber : undefined}
                      variant="registration"
                      labelVariant="default"
                      required
                    />
                  )}
                  <TextField
                    label={t('field.panNumber')}
                    value={values.panNumber}
                    onChangeText={(value) => setFieldValue('panNumber', value.toUpperCase())}
                    placeholder={t('field.panNumber.placeholder')}
                    autoCapitalize="characters"
                    error={touched.panNumber ? errors.panNumber : undefined}
                    variant="registration"
                    labelVariant="default"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    rounded
                    loading={isFormSubmitting}
                    onPress={() => {
                      setFieldTouched('firstName', true);
                      setFieldTouched('middleName', true);
                      setFieldTouched('lastName', true);
                      setFieldTouched('tenantId', true);
                      setFieldTouched('subCommunity', true);
                      setFieldTouched('gender', true);
                      setFieldTouched('dob', true);
                      setFieldTouched('addressLine1', true);
                      setFieldTouched('addressLine2', true);
                      setFieldTouched('city', true);
                      setFieldTouched('state', true);
                      setFieldTouched('country', true);
                      setFieldTouched('pincode', true);
                      setFieldTouched('aadhaarNumber', true);
                      setFieldTouched('panNumber', true);
                      setFieldTouched('passportNumber', true);
                      setFieldTouched('bloodGroup', true);
                      void submitForm();
                    }}>
                    {t('actions.saveContinue')}
                  </Button>
                </View>
              )}
            </Formik>
          ) : null}

          {step === 3 ? (
            <Formik
              initialValues={{
                aadhaarDocument: null as FileValue | null,
                passportDocument: null as FileValue | null,
                jatiNoDakhloDocument: null as FileValue | null,
                schoolCertificateDocument: null as FileValue | null,
                profilePhoto: null as FileValue | null,
                consent: false,
              }}
              validationSchema={formSchemas.registrationKyc}
              onSubmit={async (values) => {
                setRegistrationError(null);
                try {
                  if (!savedRegistrationId) {
                    throw new Error(t('error.registrationSaveRequired'));
                  }

                  await registrationService.finalizeRegistration(savedRegistrationId, values);
                  const refreshed = await authService.bootstrapSession();
                  if (refreshed.session) {
                    setSession(refreshed.session);
                    setStatus('signedIn');
                  }
                } catch (error) {
                  setRegistrationError(error instanceof Error ? error.message : t('error.finalizeRegistration'));
                }
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm, isSubmitting: isFormSubmitting }) => (
                <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[10], gap: spacing[6] }}>
                  <KycDocumentUploadSection
                    title={t('section.documents.title')}
                    description={t('section.documents.description')}
                    documents={[
                      {
                        key: 'aadhaarDocument',
                        icon: 'badge',
                        title: t('document.aadhaar.title'),
                        subtitle: t('document.aadhaar.subtitle'),
                        value: values.aadhaarDocument,
                        onPress: async () => {
                          await pickSingleFile({
                            onPicked: (file) => {
                              setFieldValue('aadhaarDocument', file);
                              setFieldTouched('aadhaarDocument', true);
                            },
                            pickImage,
                            captureImage,
                          });
                        },
                        onDelete: () => setFieldValue('aadhaarDocument', null),
                        error: touched.aadhaarDocument ? errors.aadhaarDocument : undefined,
                      },
                      ...(String(registrationCountry || '').trim().toLowerCase() !== 'india' ? [{
                        key: 'passportDocument',
                        icon: 'badge' as const,
                        title: t('document.passport.title'),
                        subtitle: t('document.passport.subtitle'),
                        value: values.passportDocument,
                        onPress: async () => {
                          await pickSingleFile({
                            onPicked: (file) => {
                              setFieldValue('passportDocument', file);
                              setFieldTouched('passportDocument', true);
                            },
                            pickImage,
                            captureImage,
                          });
                        },
                        onDelete: () => setFieldValue('passportDocument', null),
                        error: touched.passportDocument ? errors.passportDocument : undefined,
                      }] : []),
                      {
                        key: 'jatiNoDakhloDocument',
                        icon: 'description',
                        title: t('document.jati.title'),
                        subtitle: t('document.jati.subtitle'),
                        value: values.jatiNoDakhloDocument,
                        onPress: async () => {
                          await pickSingleFile({
                            onPicked: (file) => {
                              setFieldValue('jatiNoDakhloDocument', file);
                              setFieldTouched('jatiNoDakhloDocument', true);
                            },
                            pickImage,
                            captureImage,
                          });
                        },
                        onDelete: () => setFieldValue('jatiNoDakhloDocument', null),
                        error: touched.jatiNoDakhloDocument ? errors.jatiNoDakhloDocument : undefined,
                      },
                      {
                        key: 'schoolCertificateDocument',
                        icon: 'school',
                        title: t('document.school.title'),
                        subtitle: t('document.school.subtitle'),
                        value: values.schoolCertificateDocument,
                        onPress: async () => {
                          await pickSingleFile({
                            onPicked: (file) => {
                              setFieldValue('schoolCertificateDocument', file);
                              setFieldTouched('schoolCertificateDocument', true);
                            },
                            pickImage,
                            captureImage,
                          });
                        },
                        onDelete: () => setFieldValue('schoolCertificateDocument', null),
                        error: touched.schoolCertificateDocument ? errors.schoolCertificateDocument : undefined,
                      },
                      {
                        key: 'profilePhoto',
                        icon: 'add-a-photo',
                        title: t('document.photo.title'),
                        subtitle: t('document.photo.subtitle'),
                        value: values.profilePhoto,
                        onPress: async () => {
                          const source = await chooseImageSource();
                          if (!source) {
                            return;
                          }
                          const file = source === 'camera'
                            ? await captureImage({ fileNamePrefix: 'profile-photo', aspect: [1, 1] })
                            : await pickImage({ fileNamePrefix: 'profile-photo', aspect: [1, 1] });
                          if (file) {
                            setFieldValue('profilePhoto', file);
                            setFieldTouched('profilePhoto', true);
                          }
                        },
                        onDelete: () => setFieldValue('profilePhoto', null),
                        error: touched.profilePhoto ? errors.profilePhoto : undefined,
                      },
                    ]}
                    showConsent
                    consentChecked={values.consent}
                    onConsentToggle={() => setFieldValue('consent', !values.consent)}
                    consentError={touched.consent ? errors.consent : undefined}
                    primaryActionLabel={t('actions.completeRegistration')}
                    primaryActionLoading={isFormSubmitting}
                    onPrimaryAction={() => {
                      setFieldTouched('aadhaarDocument', true);
                      setFieldTouched('passportDocument', true);
                      setFieldTouched('jatiNoDakhloDocument', true);
                      setFieldTouched('schoolCertificateDocument', true);
                      setFieldTouched('profilePhoto', true);
                      setFieldTouched('consent', true);
                      void submitForm();
                    }}
                  />
                  {registrationError ? (
                    <Text variant="caption" color={colors.status.error} style={{ textAlign: 'center', marginTop: -spacing[2] }}>
                      {registrationError}
                    </Text>
                  ) : null}
                  {cropper}
                </View>
              )}
            </Formik>
          ) : null}
      </View>
    </FormScreenLayout>
  );
}
