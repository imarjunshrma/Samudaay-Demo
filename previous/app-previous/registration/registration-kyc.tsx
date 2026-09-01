import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import { authService } from '@/src/features/auth/services/auth-service';
import { useRegistrationDraft } from '@/src/features/registration/hooks/use-registration';
import type { KycDocument } from '@/src/features/registration/types/registration';
import { useSession } from '@/src/core/providers/session-provider';
import { storageService } from '@/src/services/firebase/storage';

const PRIMARY = '#f2780d';
const BG = '#f8f7f5';
const CARD = '#ffffff';
const BORDER = 'rgba(242, 120, 13, 0.2)';
const TEXT = '#0f172a';
const MUTED = '#64748b';

const registrationSchema = z.object({
  mobileNumber: z.string().regex(/^\+?\d{10,14}$/, 'Enter a valid mobile number'),
  fullNameEn: z.string().min(2, 'Enter a valid full name'),
  fullNameGu: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type RegistrationStep = 1 | 2 | 3;

interface ProfileDetailsState {
  guardianName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  pincode: string;
  occupation: string;
}

const initialProfileDetails: ProfileDetailsState = {
  guardianName: '',
  gender: 'Male',
  dateOfBirth: '',
  address: '',
  city: '',
  pincode: '',
  occupation: 'Traditional Repairer',
};

const kycCards = [
  {
    id: 'aadhaar',
    title: 'Aadhaar Card',
    subtitle: 'Upload Front & Back (PDF/JPG)',
    icon: 'badge-account-horizontal-outline' as const,
    buttonLabel: 'Select File',
    acceptedTypes: ['application/pdf', 'image/*'],
  },
  {
    id: 'caste',
    title: 'Caste Certificate',
    subtitle: 'Mandatory for community benefits',
    icon: 'file-document-outline' as const,
    buttonLabel: 'Select File',
    acceptedTypes: ['application/pdf', 'image/*'],
  },
  {
    id: 'selfie',
    title: 'Selfie / Profile Photo',
    subtitle: 'Ensure your face is clearly visible',
    icon: 'camera-plus-outline' as const,
    buttonLabel: 'Take Photo',
    acceptedTypes: ['image/*'],
  },
] as const;

function buildFileSizeLabel(size?: number) {
  if (!size) {
    return undefined;
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function ProgressBars({ step }: { step: RegistrationStep }) {
  return (
    <View style={styles.progressRow}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={[styles.progressBar, item <= step ? styles.progressBarActive : styles.progressBarIdle]} />
      ))}
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backWrap}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backWrap} />
    </View>
  );
}

function UploadCard({
  title,
  subtitle,
  buttonLabel,
  icon,
  onPress,
  disabled,
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.uploadCard}>
      <View style={styles.uploadIconWrap}>
        <MaterialCommunityIcons name={icon} size={24} color={PRIMARY} />
      </View>
      <View>
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RegistrationKycScreen() {
  const { session, updateSession } = useSession();
  const { draft, saveDraft, isLoading, isSubmitting, errorMessage, reload } = useRegistrationDraft();
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [otp, setOtp] = useState(['4', '2', '0', '', '', '']);
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [profileDetails, setProfileDetails] = useState<ProfileDetailsState>(initialProfileDetails);
  const [uploadError, setUploadError] = useState<string>();
  const [uploadMessage, setUploadMessage] = useState<string>();
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      mobileNumber: draft?.mobileNumber ?? session?.user.mobileNumber ?? '',
      fullNameEn: draft?.fullNameEn ?? '',
      fullNameGu: draft?.fullNameGu ?? '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!draft) {
      return;
    }

    setDocuments(draft.documents);
    form.reset({
      mobileNumber: draft.mobileNumber,
      fullNameEn: draft.fullNameEn,
      fullNameGu: draft.fullNameGu,
    });
  }, [draft, form]);

  const uploadedDocumentCount = useMemo(
    () => documents.filter((document) => document.status === 'uploaded').length,
    [documents],
  );

  async function persistDocuments(nextDocuments: KycDocument[]) {
    const values = form.getValues();
    await saveDraft({
      mobileNumber: values.mobileNumber,
      fullNameEn: values.fullNameEn,
      fullNameGu: values.fullNameGu || values.fullNameEn,
      documents: nextDocuments,
    });
  }

  async function uploadAsset(asset: DocumentPicker.DocumentPickerAsset) {
    if (!session) {
      throw new Error('Sign in again before uploading documents.');
    }

    const documentId = `${Date.now()}-${asset.name}`;
    const pendingDocument: KycDocument = {
      id: documentId,
      name: asset.name,
      status: 'uploading',
      localUri: asset.uri,
      contentType: asset.mimeType ?? undefined,
      fileSizeLabel: buildFileSizeLabel(asset.size),
      progress: 0,
    };

    setDocuments((current) => [...current, pendingDocument]);
    setUploadError(undefined);
    setUploadMessage(undefined);

    try {
      const uploaded = await storageService.uploadKycDocument({
        userId: session.user.id,
        localFilePath: asset.uri,
        fileName: asset.name,
        contentType: asset.mimeType ?? undefined,
        onProgress: (progress) => {
          setDocuments((current) =>
            current.map((document) => (document.id === documentId ? { ...document, progress } : document)),
          );
        },
      });

      let nextDocuments: KycDocument[] = [];
      setDocuments((current) => {
        nextDocuments = current.map((document) =>
          document.id === documentId
            ? {
                ...document,
                status: 'uploaded',
                progress: 1,
                storagePath: uploaded.path,
                downloadUrl: uploaded.downloadUrl,
                errorMessage: undefined,
              }
            : document,
        );
        return nextDocuments;
      });

      await persistDocuments(nextDocuments);
      setUploadMessage('Document uploaded successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to upload this document.';
      setDocuments((current) =>
        current.map((document) =>
          document.id === documentId ? { ...document, status: 'failed', progress: 0, errorMessage: message } : document,
        ),
      );
      setUploadError(message);
    }
  }

  async function handlePickDocument(type: readonly string[]) {
    if (!session) {
      setUploadError('A live session is required before uploading KYC documents.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: [...type],
      });

      if (result.canceled) {
        return;
      }

      await uploadAsset(result.assets[0]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to open the document picker.');
    }
  }

  async function handleRetryUpload(document: KycDocument) {
    if (!document.localUri || !session) {
      setUploadError('This file must be selected again before retrying.');
      return;
    }

    const replacementId = `${Date.now()}-${document.name}`;
    setDocuments((current) =>
      current.map((item) =>
        item.id === document.id
          ? { ...item, id: replacementId, status: 'uploading', progress: 0, errorMessage: undefined }
          : item,
      ),
    );

    try {
      const uploaded = await storageService.uploadKycDocument({
        userId: session.user.id,
        localFilePath: document.localUri,
        fileName: document.name,
        contentType: document.contentType,
        onProgress: (progress) => {
          setDocuments((current) =>
            current.map((item) => (item.id === replacementId ? { ...item, progress } : item)),
          );
        },
      });

      let nextDocuments: KycDocument[] = [];
      setDocuments((current) => {
        nextDocuments = current.map((item) =>
          item.id === replacementId
            ? {
                ...item,
                status: 'uploaded',
                progress: 1,
                storagePath: uploaded.path,
                downloadUrl: uploaded.downloadUrl,
                errorMessage: undefined,
              }
            : item,
        );
        return nextDocuments;
      });
      await persistDocuments(nextDocuments);
      setUploadMessage('Document uploaded successfully.');
      setUploadError(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to upload this document.';
      setDocuments((current) =>
        current.map((item) =>
          item.id === replacementId ? { ...item, status: 'failed', progress: 0, errorMessage: message } : item,
        ),
      );
      setUploadError(message);
    }
  }

  async function handleRemoveDocument(document: KycDocument) {
    try {
      if (document.storagePath) {
        await storageService.removeFile(document.storagePath);
      }

      const nextDocuments = documents.filter((item) => item.id !== document.id);
      setDocuments(nextDocuments);
      await persistDocuments(nextDocuments);
      setUploadMessage('Document removed.');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Unable to remove the document.');
    }
  }

  function handleOtpChange(index: number, value: string) {
    setOtp((current) => current.map((item, itemIndex) => (itemIndex === index ? value.replace(/[^\d]/g, '') : item)));
  }

  async function handleMobileContinue() {
    const valid = await form.trigger('mobileNumber');
    if (!valid) {
      return;
    }
    setStep(2);
  }

  async function handleProfileContinue() {
    const valid = await form.trigger('fullNameEn');
    if (!valid) {
      return;
    }
    form.setValue('fullNameGu', form.getValues('fullNameEn'), { shouldValidate: false });
    setStep(3);
  }

  async function handleCompleteRegistration(values: RegistrationFormValues) {
    form.clearErrors('root');
    setUploadError(undefined);

    try {
      if (!session) {
        form.setError('root', { message: 'A signed-in session is required to continue onboarding.' });
        return;
      }

      if (uploadedDocumentCount < 2) {
        form.setError('root', { message: 'Upload at least two KYC documents before continuing.' });
        return;
      }

      const fullNameGu = values.fullNameGu || values.fullNameEn;

      await saveDraft({
        mobileNumber: values.mobileNumber,
        fullNameEn: values.fullNameEn,
        fullNameGu,
        documents,
      });

      const nextSession = await authService.completeOnboarding(session, {
        fullNameEn: values.fullNameEn,
        fullNameGu,
        mobileNumber: values.mobileNumber,
      });

      await updateSession(() => ({
        ...nextSession,
        user: {
          ...nextSession.user,
          pinVerified: true,
        },
      }));

      router.replace('/profile/dashboard-id-card');
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Unable to complete registration.',
      });
    }
  }

  const stepOneView = (
    <View style={styles.frame}>
      <Header title="Registration" />
      <ProgressBars step={1} />
      <View style={styles.panelContent}>
        <Text style={styles.heroTitle}>Welcome</Text>
        <Text style={styles.heroText}>
          Join the Cobbler Community. Please enter your mobile number to get started.
        </Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
          <View style={styles.phoneInputWrap}>
            <Text style={styles.phonePrefix}>+91</Text>
            <Controller
              control={form.control}
              name="mobileNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="00000 00000"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94a3b8"
                  style={styles.phoneInput}
                />
              )}
            />
          </View>
          {form.formState.errors.mobileNumber?.message ? (
            <Text style={styles.errorText}>{form.formState.errors.mobileNumber.message}</Text>
          ) : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>OTP CODE</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                maxLength={1}
                keyboardType="number-pad"
                placeholder="-"
                placeholderTextColor="#94a3b8"
                style={styles.otpBox}
              />
            ))}
          </View>
          <Text style={styles.resendText}>Resend OTP in 0:45</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity disabled={isSubmitting} onPress={() => void handleMobileContinue()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Verify &amp; Continue</Text>
        </TouchableOpacity>
        <Text style={styles.bottomNote}>
          By continuing, you agree to the community terms and privacy policy.
        </Text>
      </View>
    </View>
  );

  const stepTwoView = (
    <View style={styles.frame}>
      <Header title="Profile Details" onBack={() => setStep(1)} />
      <ProgressBars step={2} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepForm}>
          <View style={styles.formGroup}>
            <Text style={styles.profileLabel}>Full Name</Text>
            <Controller
              control={form.control}
              name="fullNameEn"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                  style={styles.profileInput}
                />
              )}
            />
            {form.formState.errors.fullNameEn?.message ? (
              <Text style={styles.errorText}>{form.formState.errors.fullNameEn.message}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.profileLabel}>Father&apos;s / Guardian&apos;s Name</Text>
            <TextInput
              value={profileDetails.guardianName}
              onChangeText={(value) => setProfileDetails((current) => ({ ...current, guardianName: value }))}
              placeholder="Enter father's name"
              placeholderTextColor="#94a3b8"
              style={styles.profileInput}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.profileLabel}>Gender</Text>
              <TextInput
                value={profileDetails.gender}
                onChangeText={(value) => setProfileDetails((current) => ({ ...current, gender: value }))}
                placeholder="Male"
                placeholderTextColor="#94a3b8"
                style={styles.profileInput}
              />
            </View>
            <View style={styles.formHalf}>
              <Text style={styles.profileLabel}>Date of Birth</Text>
              <TextInput
                value={profileDetails.dateOfBirth}
                onChangeText={(value) => setProfileDetails((current) => ({ ...current, dateOfBirth: value }))}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#94a3b8"
                style={styles.profileInput}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.profileLabel}>Full Address</Text>
            <TextInput
              value={profileDetails.address}
              onChangeText={(value) => setProfileDetails((current) => ({ ...current, address: value }))}
              placeholder="Shop/House No, Street, Landmark"
              placeholderTextColor="#94a3b8"
              multiline
              style={[styles.profileInput, styles.textarea]}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.profileLabel}>City</Text>
              <TextInput
                value={profileDetails.city}
                onChangeText={(value) => setProfileDetails((current) => ({ ...current, city: value }))}
                placeholder="City name"
                placeholderTextColor="#94a3b8"
                style={styles.profileInput}
              />
            </View>
            <View style={styles.formHalf}>
              <Text style={styles.profileLabel}>Pincode</Text>
              <TextInput
                value={profileDetails.pincode}
                onChangeText={(value) => setProfileDetails((current) => ({ ...current, pincode: value }))}
                placeholder="6 digits"
                keyboardType="number-pad"
                placeholderTextColor="#94a3b8"
                style={styles.profileInput}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.profileLabel}>Occupation Type</Text>
            <TextInput
              value={profileDetails.occupation}
              onChangeText={(value) => setProfileDetails((current) => ({ ...current, occupation: value }))}
              placeholder="Traditional Repairer"
              placeholderTextColor="#94a3b8"
              style={styles.profileInput}
            />
          </View>

          <TouchableOpacity disabled={isSubmitting} onPress={() => void handleProfileContinue()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save &amp; Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const stepThreeView = (
    <View style={styles.frame}>
      <Header title="KYC Verification" onBack={() => setStep(2)} />
      <ProgressBars step={3} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepForm}>
          <View>
            <Text style={styles.kycTitle}>Document Upload</Text>
            <Text style={styles.kycCopy}>
              Please upload clear photos of your documents for verification.
            </Text>
          </View>

          {kycCards.map((item) => (
            <UploadCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              buttonLabel={item.buttonLabel}
              icon={item.icon}
              onPress={() => {
                void handlePickDocument(item.acceptedTypes);
              }}
              disabled={isSubmitting}
            />
          ))}

          {documents.length ? (
            <View style={styles.documentStack}>
              {documents.map((document) => (
                <View key={document.id} style={styles.documentCard}>
                  <View style={styles.documentTopRow}>
                    <Text numberOfLines={1} style={styles.documentName}>
                      {document.name}
                    </Text>
                    <Text
                      style={[
                        styles.documentStatus,
                        document.status === 'failed'
                          ? styles.documentError
                          : document.status === 'uploading'
                            ? styles.documentUploading
                            : styles.documentUploaded,
                      ]}>
                      {document.status}
                    </Text>
                  </View>
                  {document.fileSizeLabel ? <Text style={styles.documentMeta}>{document.fileSizeLabel}</Text> : null}
                  {document.errorMessage ? <Text style={styles.errorText}>{document.errorMessage}</Text> : null}
                  <View style={styles.documentActions}>
                    <TouchableOpacity
                      disabled={document.status !== 'failed'}
                      onPress={() => {
                        void handleRetryUpload(document);
                      }}
                      style={[styles.outlineButton, document.status !== 'failed' && styles.disabledAction]}>
                      <Text style={styles.outlineButtonText}>Retry Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={document.status === 'uploading'}
                      onPress={() => {
                        void handleRemoveDocument(document);
                      }}
                      style={[styles.outlineButton, document.status === 'uploading' && styles.disabledAction]}>
                      <Text style={styles.outlineButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.checkboxRow}>
            <Pressable onPress={() => setAcceptedDeclaration((current) => !current)} style={[styles.checkbox, acceptedDeclaration && styles.checkboxActive]}>
              {acceptedDeclaration ? <Text style={styles.checkboxTick}>✓</Text> : null}
            </Pressable>
            <Text style={styles.checkboxCopy}>
              I hereby declare that all information and documents provided are true and correct to the best of my knowledge.
            </Text>
          </View>

          <TouchableOpacity
            disabled={!session || isSubmitting}
            onPress={form.handleSubmit(async (values) => {
              await handleCompleteRegistration(values);
            })}
            style={[styles.primaryButton, (!session || isSubmitting) && styles.primaryButtonDisabled]}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Completing...' : 'Complete Registration'}</Text>
          </TouchableOpacity>

          <Text style={styles.uploadInfo}>Uploaded documents: {uploadedDocumentCount}/2 minimum</Text>
          {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
          {uploadMessage ? <Text style={styles.successText}>{uploadMessage}</Text> : null}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {form.formState.errors.root?.message ? <Text style={styles.errorText}>{form.formState.errors.root.message}</Text> : null}
          {errorMessage ? (
            <TouchableOpacity onPress={() => void reload()} style={styles.retryDraftButton}>
              <Text style={styles.retryDraftText}>{isLoading ? 'Loading...' : 'Retry Draft Load'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );

  return <View style={styles.screen}>{step === 1 ? stepOneView : step === 2 ? stepTwoView : stepThreeView}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  frame: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  backWrap: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 30,
    color: TEXT,
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginRight: 48,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 20,
  },
  progressBar: {
    width: 48,
    height: 8,
    borderRadius: 999,
  },
  progressBarActive: {
    backgroundColor: PRIMARY,
  },
  progressBarIdle: {
    backgroundColor: 'rgba(242, 120, 13, 0.2)',
  },
  panelContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: TEXT,
    paddingTop: 20,
    paddingBottom: 8,
  },
  heroText: {
    fontSize: 16,
    lineHeight: 28,
    color: MUTED,
    paddingBottom: 24,
  },
  fieldBlock: {
    marginBottom: 26,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#1e293b',
    marginBottom: 10,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    paddingHorizontal: 16,
  },
  phonePrefix: {
    color: MUTED,
    fontSize: 16,
    fontWeight: '500',
    borderRightWidth: 1,
    borderRightColor: BORDER,
    paddingRight: 12,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: TEXT,
    fontWeight: '500',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  resendText: {
    fontSize: 12,
    lineHeight: 18,
    color: PRIMARY,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 14,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNote: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#94a3b8',
    paddingHorizontal: 42,
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  stepForm: {
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formHalf: {
    flex: 1,
    gap: 6,
  },
  profileLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: '#475569',
    fontWeight: '500',
  },
  profileInput: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.1)',
    backgroundColor: CARD,
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: TEXT,
  },
  textarea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  kycTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: TEXT,
  },
  kycCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
    marginTop: 4,
  },
  uploadCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(242, 120, 13, 0.3)',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  uploadIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  uploadButtonText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  documentStack: {
    gap: 12,
  },
  documentCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.1)',
  },
  documentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
  },
  documentStatus: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  documentError: {
    color: '#dc2626',
  },
  documentUploading: {
    color: '#d97706',
  },
  documentUploaded: {
    color: '#16a34a',
  },
  documentMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  disabledAction: {
    opacity: 0.4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.4)',
    borderRadius: 4,
    marginTop: 2,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxCopy: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  uploadInfo: {
    fontSize: 12,
    lineHeight: 16,
    color: '#64748b',
  },
  retryDraftButton: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryDraftText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    lineHeight: 16,
  },
  successText: {
    color: PRIMARY,
    fontSize: 12,
    lineHeight: 16,
  },
});
