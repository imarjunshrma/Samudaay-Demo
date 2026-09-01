import * as DocumentPicker from 'expo-document-picker';
import { Formik } from 'formik';
import { useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { formSchemas } from '@/src/components/forms/validation';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

type RegistrationStep = 1 | 2 | 3;

type UploadCardProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  ctaLabel: string;
  value: FileValue | null;
  onPress: () => Promise<void> | void;
};

function Header({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
      <View style={{ width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' }}>
        <MaterialIcons name="arrow-back" size={30} color={colors.text.primary} />
      </View>
      <Text
        variant="h5"
        style={{
          flex: 1,
          textAlign: 'center',
          paddingRight: 48,
          letterSpacing: -0.2,
        }}>
        {title}
      </Text>
    </View>
  );
}

function StepIndicator({ currentStep }: { currentStep: RegistrationStep }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[4], paddingVertical: spacing[5] }}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={{
            width: 48,
            height: 8,
            borderRadius: radius.full,
            backgroundColor: step <= currentStep ? colors.primary.DEFAULT : colors.primary.border,
          }}
        />
      ))}
    </View>
  );
}

function SectionLabel({ children, uppercase = false }: { children: string; uppercase?: boolean }) {
  return (
    <Text
      variant="caption"
      color={colors.text.primary}
      style={{
        fontFamily: typography.fontFamily.semibold,
        fontSize: 14,
        letterSpacing: uppercase ? 0.8 : 0,
        textTransform: uppercase ? 'uppercase' : 'none',
      }}>
      {children}
    </Text>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        width: '100%',
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: radius.xl,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
      }}>
      <Text
        variant="bodyLg"
        color={colors.text.inverse}
        style={{ fontFamily: typography.fontFamily.bold }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function OutlineButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderWidth: 1,
        borderColor: colors.primary.DEFAULT,
        borderRadius: radius.lg,
      }}>
      <Text
        variant="caption"
        color={colors.primary.DEFAULT}
        style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PhoneField({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}) {
  return (
    <View style={{ gap: spacing[2] }}>
      <SectionLabel uppercase>Mobile Number</SectionLabel>
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <Text
          variant="body"
          color="#64748b"
          style={{
            position: 'absolute',
            left: 16,
            zIndex: 1,
            paddingRight: 12,
            borderRightWidth: 1,
            borderRightColor: colors.primary.border,
            fontFamily: typography.fontFamily.medium,
          }}>
          +91
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="00000 00000"
          placeholderTextColor="#94a3b8"
          style={{
            width: '100%',
            height: 56,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: error ? colors.status.error : colors.primary.border,
            backgroundColor: colors.background.surface,
            paddingLeft: 64,
            paddingRight: 16,
            color: colors.text.primary,
            fontSize: 18,
            fontFamily: typography.fontFamily.medium,
          }}
        />
      </View>
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function OtpField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? '');

  return (
    <View style={{ gap: spacing[2] }}>
      <SectionLabel uppercase>OTP Code</SectionLabel>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[2] }}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              refs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(nextDigit) => {
              const clean = nextDigit.replace(/[^\d]/g, '').slice(-1);
              const next = digits.slice();
              next[index] = clean;
              onChange(next.join('').trimEnd());
              if (clean && index < 5) {
                refs.current[index + 1]?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                refs.current[index - 1]?.focus();
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
            placeholder="-"
            placeholderTextColor="#94a3b8"
            textAlign="center"
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: error ? colors.status.error : colors.primary.border,
              backgroundColor: colors.background.surface,
              color: colors.text.primary,
              fontSize: 20,
              fontFamily: typography.fontFamily.bold,
            }}
          />
        ))}
      </View>
      <Text
        variant="caption"
        color={colors.primary.DEFAULT}
        style={{ marginTop: spacing[2], textAlign: 'right', fontFamily: typography.fontFamily.medium }}>
        Resend OTP in 0:45
      </Text>
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
  numberOfLines,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <SectionLabel>{label}</SectionLabel>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        style={{
          width: '100%',
          minHeight: multiline ? 88 : 48,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: error ? colors.status.error : colors.primary.borderLight,
          backgroundColor: colors.background.surface,
          padding: 12,
          color: colors.text.primary,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function UploadCard({ icon, title, subtitle, ctaLabel, value, onPress }: UploadCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(242, 120, 13, 0.3)',
        padding: spacing[6],
        alignItems: 'center',
        gap: spacing[3],
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.full,
          backgroundColor: colors.primary.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
      </View>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#64748b" style={{ textAlign: 'center' }}>
          {value?.name ?? subtitle}
        </Text>
      </View>
      <OutlineButton label={ctaLabel} onPress={() => void onPress()} />
    </View>
  );
}

async function pickSingleFile(onPicked: (file: FileValue) => void) {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) {
    return;
  }

  const asset = result.assets[0];
  onPicked({
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
  });
}

export function RegistrationKycScreen() {
  const [step, setStep] = useState<RegistrationStep>(1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 448, alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
          <Header title={step === 1 ? 'Registration' : step === 2 ? 'Profile Details' : 'KYC Verification'} />
          <StepIndicator currentStep={step} />

          {step === 1 ? (
            <Formik
              initialValues={{ mobile: '', otp: '' }}
              validationSchema={formSchemas.registrationOTP}
              onSubmit={async () => {
                setStep(2);
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
                <>
                  <View style={{ paddingHorizontal: spacing[4] }}>
                    <Text
                      variant="h2"
                      style={{
                        paddingTop: spacing[5],
                        paddingBottom: spacing[2],
                        letterSpacing: -0.5,
                      }}>
                      Welcome
                    </Text>
                    <Text
                      variant="body"
                      color="#475569"
                      style={{ paddingBottom: spacing[6], lineHeight: 24 }}>
                      Join the Cobbler Community. Please enter your mobile number to get started.
                    </Text>

                    <View style={{ gap: spacing[6] }}>
                      <PhoneField
                        value={values.mobile}
                        onChangeText={(value) => setFieldValue('mobile', value)}
                        error={touched.mobile ? errors.mobile : undefined}
                      />
                      <OtpField
                        value={values.otp}
                        onChange={(value) => setFieldValue('otp', value)}
                        error={touched.otp ? errors.otp : undefined}
                      />
                    </View>
                  </View>

                  <View style={{ marginTop: 'auto', padding: spacing[4], gap: spacing[4] }}>
                    <PrimaryButton
                      label="Verify & Continue"
                      onPress={() => {
                        setFieldTouched('mobile', true);
                        setFieldTouched('otp', true);
                        void submitForm();
                      }}
                    />
                    <Text
                      variant="caption"
                      color="#6b7280"
                      style={{ textAlign: 'center', paddingHorizontal: spacing[8] }}>
                      By continuing, you agree to the community terms and privacy policy.
                    </Text>
                  </View>

                  <View style={{ height: 32 }} />
                </>
              )}
            </Formik>
          ) : null}

          {step === 2 ? (
            <Formik
              initialValues={{
                fullName: '',
                fatherName: '',
                gender: '',
                dob: '',
                address: '',
                city: '',
                pincode: '',
                occupation: '',
              }}
              validationSchema={formSchemas.profile}
              onSubmit={async () => {
                setStep(3);
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
                <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[8], gap: spacing[4] }}>
                  <Field
                    label="Full Name"
                    value={values.fullName}
                    onChangeText={(value) => setFieldValue('fullName', value)}
                    placeholder="Enter full name"
                    error={touched.fullName ? errors.fullName : undefined}
                  />
                  <Field
                    label="Father's / Guardian's Name"
                    value={values.fatherName}
                    onChangeText={(value) => setFieldValue('fatherName', value)}
                    placeholder="Enter father's name"
                    error={touched.fatherName ? errors.fatherName : undefined}
                  />
                  <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                    <Field
                      label="Gender"
                      value={values.gender}
                      onChangeText={(value) => setFieldValue('gender', value)}
                      placeholder="Male"
                      error={touched.gender ? errors.gender : undefined}
                    />
                    <Field
                      label="Date of Birth"
                      value={values.dob}
                      onChangeText={(value) => setFieldValue('dob', value)}
                      placeholder="DD/MM/YYYY"
                      error={touched.dob ? errors.dob : undefined}
                    />
                  </View>
                  <Field
                    label="Full Address"
                    value={values.address}
                    onChangeText={(value) => setFieldValue('address', value)}
                    placeholder="Shop/House No, Street, Landmark"
                    error={touched.address ? errors.address : undefined}
                    multiline
                    numberOfLines={3}
                  />
                  <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                    <Field
                      label="City"
                      value={values.city}
                      onChangeText={(value) => setFieldValue('city', value)}
                      placeholder="City name"
                      error={touched.city ? errors.city : undefined}
                    />
                    <Field
                      label="Pincode"
                      value={values.pincode}
                      onChangeText={(value) => setFieldValue('pincode', value)}
                      placeholder="6 digits"
                      keyboardType="number-pad"
                      error={touched.pincode ? errors.pincode : undefined}
                    />
                  </View>
                  <Field
                    label="Occupation Type"
                    value={values.occupation}
                    onChangeText={(value) => setFieldValue('occupation', value)}
                    placeholder="Traditional Repairer"
                    error={touched.occupation ? errors.occupation : undefined}
                  />
                  <PrimaryButton
                    label="Save & Continue"
                    onPress={() => {
                      setFieldTouched('fullName', true);
                      setFieldTouched('fatherName', true);
                      setFieldTouched('gender', true);
                      setFieldTouched('dob', true);
                      setFieldTouched('address', true);
                      setFieldTouched('city', true);
                      setFieldTouched('pincode', true);
                      setFieldTouched('occupation', true);
                      void submitForm();
                    }}
                  />
                </View>
              )}
            </Formik>
          ) : null}

          {step === 3 ? (
            <Formik
              initialValues={{
                aadhaarDocument: null as FileValue | null,
                casteCertificate: null as FileValue | null,
                profilePhoto: null as FileValue | null,
                consent: false,
              }}
              validationSchema={formSchemas.kyc}
              onSubmit={async () => undefined}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
                <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[10], gap: spacing[6] }}>
                  <View>
                    <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                      Document Upload
                    </Text>
                    <Text variant="caption" color="#6b7280" style={{ marginTop: 4, fontSize: 14 }}>
                      Please upload clear photos of your documents for verification.
                    </Text>
                  </View>

                  <UploadCard
                    icon="badge"
                    title="Aadhaar Card"
                    subtitle="Upload Front & Back (PDF/JPG)"
                    ctaLabel="Select File"
                    value={values.aadhaarDocument}
                    onPress={async () => {
                      await pickSingleFile((file) => setFieldValue('aadhaarDocument', file));
                    }}
                  />
                  {touched.aadhaarDocument && errors.aadhaarDocument ? (
                    <Text variant="caption" color={colors.status.error}>
                      {String(errors.aadhaarDocument)}
                    </Text>
                  ) : null}

                  <UploadCard
                    icon="description"
                    title="Caste Certificate"
                    subtitle="Mandatory for community benefits"
                    ctaLabel="Select File"
                    value={values.casteCertificate}
                    onPress={async () => {
                      await pickSingleFile((file) => setFieldValue('casteCertificate', file));
                    }}
                  />

                  <UploadCard
                    icon="add-a-photo"
                    title="Selfie / Profile Photo"
                    subtitle="Ensure your face is clearly visible"
                    ctaLabel="Take Photo"
                    value={values.profilePhoto}
                    onPress={async () => {
                      await pickSingleFile((file) => setFieldValue('profilePhoto', file));
                    }}
                  />
                  {touched.profilePhoto && errors.profilePhoto ? (
                    <Text variant="caption" color={colors.status.error}>
                      {String(errors.profilePhoto)}
                    </Text>
                  ) : null}

                  <View style={{ paddingTop: spacing[4] }}>
                    <Pressable
                      onPress={() => setFieldValue('consent', !values.consent)}
                      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[6] }}>
                      <View
                        style={{
                          marginTop: 4,
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: values.consent ? colors.primary.DEFAULT : colors.border.DEFAULT,
                          backgroundColor: values.consent ? colors.primary.DEFAULT : colors.background.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {values.consent ? <MaterialIcons name="check" size={14} color={colors.text.inverse} /> : null}
                      </View>
                      <Text variant="caption" color="#475569" style={{ flex: 1, fontSize: 12, lineHeight: 18 }}>
                        I hereby declare that all information and documents provided are true and correct to the best of my knowledge.
                      </Text>
                    </Pressable>
                    {touched.consent && errors.consent ? (
                      <Text variant="caption" color={colors.status.error} style={{ marginBottom: spacing[3] }}>
                        {String(errors.consent)}
                      </Text>
                    ) : null}

                    <PrimaryButton
                      label="Complete Registration"
                      onPress={() => {
                        setFieldTouched('aadhaarDocument', true);
                        setFieldTouched('profilePhoto', true);
                        setFieldTouched('consent', true);
                        void submitForm();
                      }}
                    />
                  </View>
                </View>
              )}
            </Formik>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
