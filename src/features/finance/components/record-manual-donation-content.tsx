import { FormikProvider } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  AppHeader,
  Button,
  DateField,
  FileUpload,
  FormScreenLayout,
  IconButton,
  SelectField,
  Text,
  TextField,
} from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { formSchemas } from '@/src/components/forms/validation';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { useTranslations } from '@/src/i18n/use-translations';
import { useAppForm } from '@/src/hooks/useForm';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { donationService, type DonationStatus } from '@/src/features/finance/services/donation-service';
import type { FileValue } from '@/src/types';
import {
  FormikPaymentModeSelector,
  ManualDonationOrDivider,
  ManualDonationSectionCard,
} from './record-manual-donation-blocks';

type ManualDonationFormValues = {
  registeredMemberSearch: string;
  manualDonorName: string;
  amount: string;
  donationDate: Date;
  paymentMode: 'cash' | 'transfer' | 'cheque';
  status: DonationStatus;
  panNumber: string;
  referenceNumber: string;
  message: string;
  proof: FileValue | null;
};

function buildInitialValues(): ManualDonationFormValues {
  return {
    registeredMemberSearch: '',
    manualDonorName: '',
    amount: '',
    donationDate: new Date(),
    paymentMode: 'cash',
    status: 'PAID',
    panNumber: '',
    referenceNumber: '',
    message: '',
    proof: null,
  };
}

function buildInitialValuesFromDonation(
  record: NonNullable<Awaited<ReturnType<typeof donationService.loadDonationRecordById>>>,
): ManualDonationFormValues {
  const parsedDate = record.createdAt ? new Date(record.createdAt) : new Date();

  return {
    registeredMemberSearch: record.memberSearch || '',
    manualDonorName: record.donorName || '',
    amount: String(record.amount || ''),
    donationDate: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    paymentMode: record.paymentMode || 'cash',
    status: record.status,
    panNumber: record.panNumber || '',
    referenceNumber: record.referenceNumber || '',
    message: record.message || '',
    proof: null,
  };
}

function formatSelectedMemberLabel(member: DirectoryMemberItem) {
  return member.memberId ? `${member.title} (${member.memberId})` : member.title;
}

type RecordManualDonationContentProps = {
  donationId?: string;
  editMode?: boolean;
  title?: string;
  submitLabel?: string;
};

export function RecordManualDonationContent({
  donationId,
  editMode = false,
  title,
  submitLabel,
}: RecordManualDonationContentProps = {}) {
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.donation-management');
  const { language } = useAppPreferences();
  const [memberResults, setMemberResults] = useState<DirectoryMemberItem[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [memberSearchError, setMemberSearchError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<DirectoryMemberItem | null>(null);
  const [isLoadingDonation, setIsLoadingDonation] = useState(false);
  const [existingProofLabel, setExistingProofLabel] = useState<string | null>(null);
  const isEditMode = editMode && Boolean(donationId);

  const initialValues = useMemo(() => buildInitialValues(), []);

  const formik = useAppForm<ManualDonationFormValues>({
    initialValues,
    validationSchema: formSchemas.manualDonationRecord,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      try {
        const normalizedRegisteredMember = selectedMember
          ? formatSelectedMemberLabel(selectedMember)
          : values.registeredMemberSearch.trim() || null;
        const payload = {
          donorName: values.manualDonorName.trim() || selectedMember?.title || values.registeredMemberSearch.trim(),
          amount: values.amount.trim(),
          paymentMode: values.paymentMode,
          status: values.status,
          donationDate: values.donationDate.toISOString(),
          referenceNumber: values.referenceNumber.trim() || null,
          panNumber: values.panNumber.trim().toUpperCase() || null,
          message: values.message.trim() || null,
          proofFile: values.proof,
          proofLabel: existingProofLabel,
          registeredMemberSearch: normalizedRegisteredMember,
          onBehalfUserId: selectedMember?.id ?? null,
        };

        if (isEditMode && donationId) {
          await donationService.updateDonationRecord(donationId, payload);
        } else {
          await donationService.createDonationRecord(payload);
        }

        navigateBack();
      } catch (error) {
        helpers.setStatus({
          error: error instanceof Error ? error.message : t('manual.errors.save'),
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const formikRef = useRef(formik);

  useEffect(() => {
    formikRef.current = formik;
  }, [formik]);

  const resetManualDonationState = useCallback(() => {
    if (isEditMode) {
      return;
    }

    formikRef.current.resetForm({ values: buildInitialValues() });
    setSelectedMember(null);
    setMemberResults([]);
    setMemberSearchError(null);
    setIsSearchingMembers(false);
    setExistingProofLabel(null);
  }, [isEditMode]);

  useFocusEffect(
    useCallback(() => {
      resetManualDonationState();
    }, [resetManualDonationState]),
  );

  useEffect(() => {
    if (!isEditMode || !donationId) {
      return;
    }

    let active = true;
    setIsLoadingDonation(true);
    donationService.loadDonationRecordById(donationId, false)
      .then((record) => {
        if (!active) {
          return;
        }
        if (!record) {
          formikRef.current.setStatus({
            error: t('manual.errors.save'),
          });
          return;
        }
        formikRef.current.resetForm({ values: buildInitialValuesFromDonation(record) });
        setExistingProofLabel(record.proofLabel || null);
        setSelectedMember(null);
        setMemberResults([]);
        setMemberSearchError(null);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        formikRef.current.setStatus({
          error: error instanceof Error ? error.message : t('manual.errors.save'),
        });
      })
      .finally(() => {
        if (active) {
          setIsLoadingDonation(false);
        }
      });

    return () => {
      active = false;
    };
  }, [donationId, isEditMode, t]);

  useEffect(() => {
    const query = formik.values.registeredMemberSearch.trim();
    const selectedLabel = selectedMember ? formatSelectedMemberLabel(selectedMember) : '';

    if (selectedMember && query === selectedLabel) {
      setMemberResults([]);
      setMemberSearchError(null);
      setIsSearchingMembers(false);
      return;
    }

    if (query.length < 2) {
      setMemberResults([]);
      setMemberSearchError(null);
      setIsSearchingMembers(false);
      return;
    }

    let active = true;
    setIsSearchingMembers(true);
    setMemberSearchError(null);
    const timer = setTimeout(() => {
      directoryService
        .loadMembersPage({ q: query, userType: 'all', page: 1, limit: 6 })
        .then((result) => {
          if (!active) {
            return;
          }

          setMemberResults(result.items);
        })
        .catch((error) => {
          if (!active) {
            return;
          }

          setMemberResults([]);
          setMemberSearchError(error instanceof Error ? error.message : t('manual.search.error'));
        })
        .finally(() => {
          if (active) {
            setIsSearchingMembers(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formik.values.registeredMemberSearch, selectedMember, t]);

  const memberSearchValue = formik.values.registeredMemberSearch.trim();
  const showMemberResults = !selectedMember && memberSearchValue.length >= 2;
  const selectedMemberLocation = translateLocationText([selectedMember?.city, selectedMember?.state].filter(Boolean).join(', '), language);

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={title || t('manual.title')}
          variant="back"
          onLeftPress={navigateBack}
          rightSlot={
            <IconButton
              icon="help-outline"
              variant="plain"
              color={colors.primary.DEFAULT}
            />
          }
        />
      }
      footer={
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={formik.isSubmitting}
              disabled={isLoadingDonation}
              onPress={() => void formik.handleSubmit()}>
              {isEditMode ? submitLabel || 'Update Donation' : t('manual.actions.save')}
            </Button>
          </View>
        </View>
      }>
      <FormikProvider value={formik}>
        <View style={{ padding: spacing[5], paddingBottom: spacing[5], gap: spacing[5], backgroundColor: '#f8fafc' }}>
              <ManualDonationSectionCard
                title={t('manual.sections.donor')}
                icon="person-outline">
                <TextField
                  label={t('manual.fields.searchMember')}
                  labelVariant="default"
                  variant="filled"
                  placeholder={t('manual.placeholders.searchMember')}
                  value={formik.values.registeredMemberSearch}
                  onChangeText={(value) => {
                    formik.setFieldValue('registeredMemberSearch', value);
                    void formik.setFieldTouched('registeredMemberSearch', true, false);
                    if (selectedMember && value !== formatSelectedMemberLabel(selectedMember)) {
                      setSelectedMember(null);
                    }
                  }}
                  error={formik.touched.registeredMemberSearch ? formik.errors.registeredMemberSearch : undefined}
                  leftIcon={
                    <IconButton
                      icon="search"
                      variant="plain"
                      color="#9ca3af"
                      size="sm"
                    />
                  }
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: 'transparent',
                    backgroundColor: '#f5f5f5',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                  }}
                />
                {selectedMember ? (
                  <View
                    style={{
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                      backgroundColor: colors.background.surface,
                      padding: spacing[3],
                      gap: spacing[1],
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                      <View style={{ flex: 1, gap: spacing[1] }}>
                        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {selectedMember.title}
                        </Text>
                        <Text variant="caption" color={colors.text.muted}>
                          {selectedMember.memberId ? `${t('manual.search.memberId')}: ${selectedMember.memberId}` : t('manual.search.selected')}
                        </Text>
                        {selectedMemberLocation ? (
                          <Text variant="caption" color={colors.text.muted}>
                            {selectedMemberLocation}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedMember(null);
                          setMemberResults([]);
                          formik.setFieldValue('registeredMemberSearch', '');
                        }}>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                          {t('manual.search.clear')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {showMemberResults ? (
                  <View
                    style={{
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                      backgroundColor: colors.background.surface,
                      overflow: 'hidden',
                    }}>
                    {isSearchingMembers ? (
                      <Text variant="caption" color={colors.text.muted} style={{ padding: spacing[3] }}>
                        {t('manual.search.loading')}
                      </Text>
                    ) : memberSearchError ? (
                      <Text variant="caption" color={colors.status.error} style={{ padding: spacing[3] }}>
                        {memberSearchError}
                      </Text>
                    ) : memberResults.length ? (
                      memberResults.map((member, index) => (
                        <TouchableOpacity
                          key={member.id}
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => {
                            setSelectedMember(member);
                            setMemberResults([]);
                            formik.setFieldValue('registeredMemberSearch', formatSelectedMemberLabel(member));
                            formik.setFieldTouched('registeredMemberSearch', true, false);
                          }}
                          style={{
                            paddingHorizontal: spacing[3],
                            paddingVertical: spacing[3],
                            borderTopWidth: index === 0 ? 0 : 1,
                            borderTopColor: colors.border.light,
                            gap: spacing[1],
                          }}>
                          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
                            {member.title}
                          </Text>
                          <Text variant="caption" color={colors.text.muted}>
                            {[member.memberId, member.phone, translateLocationText([member.city, member.state].filter(Boolean).join(', '), language)].filter(Boolean).join(' • ')}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text variant="caption" color={colors.text.muted} style={{ padding: spacing[3] }}>
                        {t('manual.search.noResults')}
                      </Text>
                    )}
                  </View>
                ) : null}
                <ManualDonationOrDivider />
                <TextField
                  name="manualDonorName"
                  label={t('manual.fields.manualDonorName')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('manual.placeholders.manualDonorName')}
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                  }}
                />
              </ManualDonationSectionCard>

              <ManualDonationSectionCard
                title={t('manual.sections.transaction')}
                icon="payments">
                <TextField
                  name="amount"
                  label={t('manual.fields.amount')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('manual.placeholders.amount')}
                  keyboardType="numeric"
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                  }}
                />
                <DateField
                  name="donationDate"
                  label={t('manual.fields.donationDate')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('manual.placeholders.donationDate')}
                />
                <View style={{ gap: spacing[3] }}>
                  <FormikPaymentModeSelector name="paymentMode" />
                </View>
                <SelectField
                  name="status"
                  label={t('manual.fields.status')}
                  labelVariant="default"
                  variant="registration"
                  options={[
                    { value: 'PAID', label: t('manual.status.paid') },
                    { value: 'PENDING', label: t('manual.status.pending') },
                    { value: 'CANCELLED', label: t('manual.status.cancelled') },
                  ]}
                />
                <TextField
                  label={t('field.panNumber')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('field.panNumber.placeholder')}
                  value={formik.values.panNumber}
                  onChangeText={(value) => {
                    formik.setFieldValue('panNumber', value.toUpperCase());
                  }}
                  error={formik.touched.panNumber ? formik.errors.panNumber : undefined}
                  autoCapitalize="characters"
                  maxLength={10}
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                  }}
                />
                <TextField
                  name="referenceNumber"
                  label={t('manual.fields.referenceNumber')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('manual.placeholders.referenceNumber')}
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                  }}
                />
              </ManualDonationSectionCard>

              <ManualDonationSectionCard
                title={t('manual.sections.proof')}
                icon="cloud-upload">
                <FileUpload
                  name="proof"
                  label=""
                  variant="manualDonation"
                  helperText={t('manual.helper.fileTypes')}
                  emptyTitle={t('manual.upload.title')}
                  emptyDescription={t('manual.upload.description')}
                  existingPreviewName={existingProofLabel || undefined}
                />
              </ManualDonationSectionCard>

              <ManualDonationSectionCard
                title={t('manual.sections.note')}
                icon="notes">
                <TextField
                  name="message"
                  label={t('manual.fields.message')}
                  labelVariant="default"
                  variant="default"
                  placeholder={t('manual.placeholders.message')}
                  inputStyle={{
                    borderRadius: radius.lg,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    minHeight: 96,
                  }}
                  multiline
                  numberOfLines={3}
                />
              </ManualDonationSectionCard>

              {formik.status?.error ? (
                <Text variant="caption" color={colors.status.error} style={{ textAlign: 'center' }}>
                  {formik.status.error}
                </Text>
              ) : null}

        </View>
      </FormikProvider>
    </FormScreenLayout>
  );
}
