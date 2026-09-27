import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AmountSelector, AppHeader, Button, Dialog, ErrorState, PhoneInput, SegmentedControl, SelectField, Text, TextField } from '@/src/components';
import { SkeletonBlock, SkeletonCard } from '@/src/components/ui/skeleton';
import { countryCallingCodeOptions } from '@/src/constants/country-calling-codes';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { DonationListItem, OfflineDonationCard } from '../components/donation-management-blocks';
import { useDonationRecords } from '@/src/features/finance/hooks';
import { donationService } from '@/src/features/finance/services/donation-service';
import { isPdfDownloadCancelledError } from '@/src/services/files/pdf-file';
import { isVadodaraCity, resolveVadodaraArea, vadodaraAreaOptions } from '@/src/services/location/vadodara-area-options';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import type { MetricItem } from '@/src/types/app';

type DonationManagementScreenMode = 'user' | 'admin';
type DonationFieldKey = 'amount' | 'donorName' | 'purpose' | keyof BehalfDonationFields;
type DonationFormErrors = Partial<Record<DonationFieldKey, string>>;

type BehalfDonationFields = {
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  panNumber: string;
  phoneNumber: string;
  totalFamilyMembers: string;
};

const EMPTY_BEHALF_FIELDS: BehalfDonationFields = {
  addressLine1: '',
  addressLine2: '',
  area: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  panNumber: '',
  phoneNumber: '',
  totalFamilyMembers: '',
};

const donationPurposeOptions = [
  { value: 'Marriage', label: 'Marriage' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' },
];

function formatDonationDateTime(value?: string | null) {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return 'Today';
  }

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const SMALL_NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS_NUMBER_WORDS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

function formatTwoDigitWords(value: number) {
  if (value < 20) {
    return SMALL_NUMBER_WORDS[value];
  }

  const tens = Math.floor(value / 10);
  const units = value % 10;
  return units ? `${TENS_NUMBER_WORDS[tens]} ${SMALL_NUMBER_WORDS[units]}` : TENS_NUMBER_WORDS[tens];
}

function formatThreeDigitWords(value: number) {
  if (value < 100) {
    return formatTwoDigitWords(value);
  }

  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  const prefix = `${SMALL_NUMBER_WORDS[hundreds]} hundred`;
  return remainder ? `${prefix} ${formatTwoDigitWords(remainder)}` : prefix;
}

function formatIndianCurrencyWords(value: number) {
  const normalized = Math.floor(Math.abs(value));
  if (normalized === 0) {
    return '';
  }

  const segments: [number, string][] = [
    [10000000, 'crore'],
    [100000, 'lakh'],
    [1000, 'thousand'],
  ];
  let remainder = normalized;
  const words: string[] = [];

  segments.forEach(([divisor, label]) => {
    const segmentValue = Math.floor(remainder / divisor);
    if (!segmentValue) {
      return;
    }

    words.push(`${formatThreeDigitWords(segmentValue)} ${label}`);
    remainder %= divisor;
  });

  if (remainder) {
    words.push(formatThreeDigitWords(remainder));
  }

  return words.join(' ');
}

function capitalizeSentence(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatVisibleDonationType(value: string | null | undefined, fallbackLabel: string) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return fallbackLabel;
  }

  const normalizedKey = normalized.toLowerCase().replace(/[_\s-]+/g, '');
  if (normalizedKey === 'donation') {
    return fallbackLabel;
  }

  return normalized
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getDialCodeForCountry(countryName: string) {
  const normalizedCountryName = countryName.trim().toLocaleLowerCase('en');
  return countryCallingCodeOptions.find((option) => option.countryName.trim().toLocaleLowerCase('en') === normalizedCountryName)?.dialCode;
}

function replacePhoneDialCode(phoneNumber: string, dialCode: string) {
  const digitsOnly = phoneNumber.replace(/[^\d]/g, '');
  const currentOption = [...countryCallingCodeOptions]
    .sort((left, right) => right.dialCode.length - left.dialCode.length)
    .find((option) => phoneNumber.trim().startsWith(option.dialCode));
  const localDigits = currentOption
    ? digitsOnly.slice(currentOption.dialCode.replace(/[^\d]/g, '').length)
    : digitsOnly;

  return localDigits ? `${dialCode}${localDigits}` : dialCode;
}

function hasLocalPhoneNumber(phoneNumber: string) {
  const trimmed = phoneNumber.trim();
  if (!trimmed) return false;

  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  const currentOption = [...countryCallingCodeOptions]
    .sort((left, right) => right.dialCode.length - left.dialCode.length)
    .find((option) => trimmed.startsWith(option.dialCode));
  const localDigits = currentOption
    ? digitsOnly.slice(currentOption.dialCode.replace(/[^\d]/g, '').length)
    : digitsOnly;

  return localDigits.length > 0;
}

export function DonationManagementScreen({
  mode = 'user',
}: {
  mode?: DonationManagementScreenMode;
}) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('finance.donation-management');
  const { session } = useSession();
  const isAdminMode = mode === 'admin';
  const memberTransactionsRoute = '/member/transactions';
  const viewAllRoute = isAdminMode ? '/admin/manage-donations' : memberTransactionsRoute;
  const { items, isLoading, errorMessage, reload } = useDonationRecords({ mine: !isAdminMode });
  const [donorType, setDonorType] = useState<'self' | 'behalf'>('self');
  const [amount, setAmount] = useState<number | ''>('');
  const [donorName, setDonorName] = useState('');
  const [relation, setRelation] = useState('');
  const [purpose, setPurpose] = useState('');
  const [behalfFields, setBehalfFields] = useState<BehalfDonationFields>(EMPTY_BEHALF_FIELDS);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<DonationFormErrors>({});
  const [isPaying, setIsPaying] = useState(false);
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [minimumDonationAmount, setMinimumDonationAmount] = useState(1);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    visible: boolean;
    variant: 'info' | 'success' | 'warning' | 'error';
    title: string;
    description: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    description: '',
  });
  const [successDialog, setSuccessDialog] = useState({
    visible: false,
    title: '',
    description: '',
  });
  const selfDonorName = session?.user.fullName || t('checkout.defaults.selfDonor');
  const {
    countryOptions,
    stateOptions,
    cityOptions,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
  } = useCountryStateCityOptions({
    countryName: behalfFields.country || 'India',
    stateName: behalfFields.state || '',
  });
  const impactValue = useMemo(() => metrics[0]?.value || '₹0', [metrics]);
  const impactLabel = useMemo(() => metrics[0]?.label || t('fallback.totalDonations'), [metrics, t]);
  const customAmountHelperText = useMemo(() => {
    const amountValue = typeof amount === 'number' ? amount : Number(amount || 0);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return undefined;
    }

    const amountWords = formatIndianCurrencyWords(amountValue);
    if (!amountWords) {
      return undefined;
    }

    return t('amount.wordsValue').replace('{{amount}}', capitalizeSentence(amountWords));
  }, [amount, t]);
  const showImpactCard = isAdminMode;

  function showFeedbackDialog(
    variant: 'info' | 'success' | 'warning' | 'error',
    title: string,
    description: string,
  ) {
    setFeedbackDialog({
      visible: true,
      variant,
      title,
      description,
    });
  }

  function resetDonationForm() {
    setDonorType('self');
    setAmount('');
    setDonorName(selfDonorName);
    setRelation('');
    setPurpose('');
    setBehalfFields(EMPTY_BEHALF_FIELDS);
    setMessage('');
    setFieldErrors({});
  }

  function clearFieldError(field: DonationFieldKey) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  const updateBehalfField = (field: keyof BehalfDonationFields) => (value: string) => {
    clearFieldError(field);
    const nextValue = field === 'pincode'
      ? value.replace(/[^\d]/g, '').slice(0, 6)
      : value;
    setBehalfFields((current) => ({ ...current, [field]: nextValue }));
  };

  const requiredBehalfFields: [keyof BehalfDonationFields, string][] = [
    ['addressLine1', t('field.addressLine1')],
    ['city', t('field.city')],
    ['state', t('field.state')],
    ['country', t('field.country')],
    ['pincode', t('field.pincode')],
    ['phoneNumber', t('field.phoneNumber')],
    ['totalFamilyMembers', t('field.totalFamilyMembers')],
  ];

  function validateDonationForm() {
    const errors: DonationFormErrors = {};
    const amountValue = typeof amount === 'number' ? amount : Number(amount || 0);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      errors.amount = t('checkout.errors.invalidAmountMessage');
    } else if (amountValue < minimumDonationAmount) {
      errors.amount = `Minimum contribution amount is ₹${minimumDonationAmount.toLocaleString('en-IN')}.`;
    }

    if (!purpose.trim()) {
      errors.purpose = t('checkout.errors.missingPurposeMessage');
    }

    if (donorType === 'behalf') {
      if (!donorName.trim()) {
        errors.donorName = t('checkout.errors.missingDonorMessage');
      }

      requiredBehalfFields.forEach(([field, label]) => {
        if (!behalfFields[field].trim()) {
          errors[field] = t('checkout.errors.missingRequiredMessage').replace('{{field}}', label);
        }
      });
      if (isVadodaraCity(behalfFields.city) && !behalfFields.area.trim()) {
        errors.area = t('checkout.errors.missingRequiredMessage').replace('{{field}}', 'Area');
      }
      if (!hasLocalPhoneNumber(behalfFields.phoneNumber)) {
        errors.phoneNumber = t('checkout.errors.missingRequiredMessage').replace('{{field}}', t('field.phoneNumber'));
      }
      if (behalfFields.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(behalfFields.panNumber.trim().toUpperCase())) {
        errors.panNumber = 'Enter valid PAN number';
      }
    }

    return errors;
  }

  const handleDonatePress = async () => {
    if (isPaying) {
      return;
    }

    const amountValue = typeof amount === 'number' ? amount : Number(amount || 0);
    const resolvedPurpose = purpose.trim();
    const resolvedRelation = donorType === 'behalf' ? relation.trim() : '';
    const resolvedDonationMessage = message.trim() || null;
    const resolvedDonorName =
      donorType === 'self'
        ? (session?.user.fullName || donorName.trim() || t('checkout.defaults.selfDonor'))
        : donorName.trim();

    const validationErrors = validateDonationForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsPaying(true);
    try {
      const order = await donationService.createDonationPaymentOrder({
        amount: amountValue,
        donorType,
        donorName: resolvedDonorName,
        purpose: resolvedPurpose,
        relation: resolvedRelation,
        addressLine1: donorType === 'behalf' ? behalfFields.addressLine1.trim() : null,
        addressLine2: donorType === 'behalf' ? behalfFields.addressLine2.trim() : null,
        area: donorType === 'behalf' && isVadodaraCity(behalfFields.city) ? behalfFields.area.trim() : null,
        city: donorType === 'behalf' ? behalfFields.city.trim() : null,
        state: donorType === 'behalf' ? behalfFields.state.trim() : null,
        country: donorType === 'behalf' ? behalfFields.country.trim() : null,
        pincode: donorType === 'behalf' ? behalfFields.pincode.trim() : null,
        panNumber:
          donorType === 'behalf'
            ? behalfFields.panNumber.trim().toUpperCase() || null
            : null,
        phoneNumber: donorType === 'behalf' ? behalfFields.phoneNumber.trim() : null,
        totalFamilyMembers: donorType === 'behalf' ? behalfFields.totalFamilyMembers.trim() : null,
        message: resolvedDonationMessage,
      });
      const donation = await donationService.verifyDonationPayment({
        donorName: resolvedDonorName,
        donorType,
        purpose: resolvedPurpose,
        relation: resolvedRelation,
        addressLine1: donorType === 'behalf' ? behalfFields.addressLine1.trim() : null,
        addressLine2: donorType === 'behalf' ? behalfFields.addressLine2.trim() : null,
        area: donorType === 'behalf' && isVadodaraCity(behalfFields.city) ? behalfFields.area.trim() : null,
        city: donorType === 'behalf' ? behalfFields.city.trim() : null,
        state: donorType === 'behalf' ? behalfFields.state.trim() : null,
        country: donorType === 'behalf' ? behalfFields.country.trim() : null,
        pincode: donorType === 'behalf' ? behalfFields.pincode.trim() : null,
        panNumber:
          donorType === 'behalf'
            ? behalfFields.panNumber.trim().toUpperCase() || null
            : null,
        phoneNumber: donorType === 'behalf' ? behalfFields.phoneNumber.trim() : null,
        totalFamilyMembers: donorType === 'behalf' ? behalfFields.totalFamilyMembers.trim() : null,
        message: resolvedDonationMessage,
        razorpay: await donationService.openRazorpayCheckout(order),
      });

      setSuccessDialog({
        visible: true,
        title: t('checkout.success.title'),
        description: t('checkout.success.message').replace('{{receiptNo}}', donation.receiptNo || donation.id),
      });
      resetDonationForm();
    } catch (error) {
      showFeedbackDialog(
        'error',
        t('checkout.errors.paymentFailedTitle'),
        error instanceof Error ? error.message : t('checkout.errors.paymentFailedMessage'),
      );
    } finally {
      setIsPaying(false);
    }
  };

  function handleSuccessDialogConfirm() {
    setSuccessDialog((current) => ({ ...current, visible: false }));
    router.replace((isAdminMode ? '/admin/manage-donations' : memberTransactionsRoute) as never);
  }

  async function handleDownloadGeneratedReceipt(item: Parameters<typeof donationService.generateReceiptAndShare>[0]) {
    try {
      const result = await donationService.generateReceiptAndShare(item);
      if (result?.method === 'saf') {
        showFeedbackDialog(
          'success',
          'Receipt downloaded',
          'The receipt PDF was saved to the selected folder.',
        );
      }
    } catch (error) {
      if (isPdfDownloadCancelledError(error)) {
        return;
      }
      showFeedbackDialog(
        'error',
        'Unable to generate receipt',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }

  async function handleViewGeneratedReceipt(item: Parameters<typeof donationService.generateReceiptAndShare>[0]) {
    setViewingReceiptId(item.id);
    try {
      const receipt = await donationService.generateReceiptAndOpen(item);
      if (receipt.fileUri) {
        router.push({
          pathname: '/pdf-viewer',
          params: {
            title: receipt.title,
            fileUri: receipt.fileUri,
          },
        });
      }
    } catch (error) {
      showFeedbackDialog(
        'error',
        'Unable to open receipt',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setViewingReceiptId(null);
    }
  }

  useEffect(() => {
    let active = true;
    donationService.loadDonationMetricsForScope(!isAdminMode).then((nextMetrics) => {
      if (active) {
        setMetrics(nextMetrics);
      }
    });
    donationService.loadDonationSettings()
      .then((settings) => {
        if (active) {
          setMinimumDonationAmount(settings.minimumDonationAmount);
        }
      })
      .catch(() => {
        if (active) {
          setMinimumDonationAmount(1);
        }
      });
    return () => {
      active = false;
    };
  }, [isAdminMode]);

  useEffect(() => {
    if (donorType === 'self') {
      setDonorName(selfDonorName);
      setRelation('');
    }
  }, [donorType, selfDonorName]);
  const showInitialSkeleton = isLoading && !items.length;

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={() => navigateBack(isAdminMode ? '/admin/manage-donations' : memberTransactionsRoute)}
        />
        <KeyboardAwareScrollView
          bottomOffset={24}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing[6] }}>
          {showInitialSkeleton ? (
            <View style={{ padding: spacing[4], gap: spacing[4] }}>
              <View
                style={{
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  ...shadows.sm,
                }}>
                <SkeletonBlock width="100%" height={148} radiusSize={0} />
                <View style={{ padding: spacing[5], gap: spacing[2] }}>
                  <SkeletonBlock width="38%" height={12} radiusSize={999} />
                  <SkeletonBlock width="42%" height={38} radiusSize={radius.sm} />
                  <SkeletonBlock width="58%" height={14} radiusSize={999} />
                </View>
              </View>

              <View style={{ backgroundColor: colors.background.surface, padding: spacing[5], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, gap: spacing[4], ...shadows.sm }}>
                <SkeletonBlock width="44%" height={18} radiusSize={999} />
                <SkeletonCard lines={4} />
              </View>

              <View style={{ gap: spacing[3] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <SkeletonBlock width="34%" height={18} radiusSize={999} />
                  <SkeletonBlock width="24%" height={18} radiusSize={999} />
                </View>
                <View style={{ gap: spacing[3] }}>
                  <SkeletonCard lines={2} />
                  <SkeletonCard lines={2} />
                </View>
              </View>
            </View>
          ) : null}
          {showImpactCard ? (
            <View style={{ padding: spacing[4] }}>
              <View
                style={{
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  ...shadows.sm,
                }}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5lbvs7EK9L2PG_TNfMXqCJT9toXn0_h42qmXwtIhYkpyaYFgpkaVAHPNwNJ8lejIjsgLeK2YE74e6uLkywNnEy05qHOP6dEtg6ZcGWX1ApnEb2IlN0cof9y3ouJmtdCuinWUBEsuUjU8_Bcy9lfDhrXhhPMCUY_4WUPueGxVkrPkdjgQr_Wp1MQX2kkzL6761d8rjVl70lrvytLo9cLmcm5mp5JVAQGVC_W6okrofWD6QqRBW6EAF_HNrH4RIRtB3CoXlbwMxs0FL',
                  }}
                  resizeMode="cover"
                  style={{ width: '100%', aspectRatio: 21 / 9 }}
                />
                <View style={{ padding: spacing[5], gap: 4 }}>
                  <Text
                    variant="caption"
                    color={colors.primary.DEFAULT}
                    style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('status.communityOverview')}
                  </Text>
                  <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold }}>
                    {impactValue}
                  </Text>
                  <Text variant="body" color="#64748b">
                    {impactLabel}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {!showInitialSkeleton && isAdminMode ? (
            <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[6] }}>
              <OfflineDonationCard onAddRecord={() => router.push('/admin/record-manual-donation' as never)} />
            </View>
          ) : null}

          {!showInitialSkeleton ? (
          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[6] }}>
            <Text variant="h3" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              {mode === 'admin' ? t('form.titleAdmin') : t('form.titleUser')}
            </Text>
            <View
              style={{
                backgroundColor: colors.background.surface,
                padding: spacing[5],
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                gap: spacing[6],
                ...shadows.sm,
              }}>
              <SegmentedControl
                variant="soft"
                value={donorType}
                onChange={(value) => {
                  const nextDonorType = value as 'self' | 'behalf';
                  setDonorType(nextDonorType);
                  setFieldErrors({});
                  if (nextDonorType === 'self') {
                    setDonorName(selfDonorName);
                    setRelation('');
                  } else if (donorType === 'self') {
                    setDonorName('');
                  }
                }}
                containerRadius={radius.md}
                segmentRadius={radius.md}
                options={[
                  { label: t('mode.self'), value: 'self' },
                  { label: t('mode.behalf'), value: 'behalf' },
                ]}
              />

              <View style={{ gap: spacing[4] }}>
                <View style={{ gap: spacing[4] }}>
                  <TextField
                    label={t('field.donorName')}
                    labelVariant="default"
                    variant="registration"
                    inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                    placeholder={t('field.donorName.placeholder')}
                    value={donorType === 'self' ? selfDonorName : donorName}
                    onChangeText={(value) => {
                      clearFieldError('donorName');
                      setDonorName(value);
                    }}
                    error={fieldErrors.donorName}
                    disabled={donorType === 'self'}
                  />
                  <SelectField
                    label={t('field.purpose')}
                    labelVariant="default"
                    variant="registration"
                    placeholder={t('field.purpose.placeholder')}
                    value={purpose}
                    options={donationPurposeOptions}
                    onSelect={(value) => {
                      clearFieldError('purpose');
                      setPurpose(value);
                    }}
                    error={fieldErrors.purpose}
                    required
                  />
                  {donorType === 'behalf' ? (
                    <>
                      <TextField
                        label={t('field.addressLine1')}
                        labelVariant="default"
                        variant="registration"
                        inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                        placeholder={t('field.addressLine1.placeholder')}
                        value={behalfFields.addressLine1}
                        onChangeText={updateBehalfField('addressLine1')}
                        error={fieldErrors.addressLine1}
                        required
                      />
                      <TextField
                        label={t('field.addressLine2')}
                        labelVariant="default"
                        variant="registration"
                        inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                        placeholder={t('field.addressLine2.placeholder')}
                        value={behalfFields.addressLine2}
                        onChangeText={updateBehalfField('addressLine2')}
                        error={fieldErrors.addressLine2}
                      />
                      <SelectField
                        label={t('field.country')}
                        labelVariant="default"
                        variant="registration"
                        placeholder={isLoadingCountries ? t('field.country.loading') : t('field.country.placeholder')}
                        value={behalfFields.country}
                        options={countryOptions}
                        error={fieldErrors.country}
                        onSelect={(value) => {
                          clearFieldError('country');
                          const dialCode = getDialCodeForCountry(value);
                          setBehalfFields((current) => ({
                            ...current,
                            country: value,
                            state: '',
                            city: '',
                            area: '',
                            phoneNumber: dialCode ? replacePhoneDialCode(current.phoneNumber, dialCode) : current.phoneNumber,
                          }));
                        }}
                        required
                      />
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        <View style={{ flex: 1 }}>
                          <SelectField
                            label={t('field.state')}
                            labelVariant="default"
                            variant="registration"
                            placeholder={isLoadingStates ? t('field.state.loading') : t('field.state.placeholder')}
                            value={behalfFields.state}
                            options={stateOptions}
                            disabled={isLoadingStates}
                            error={fieldErrors.state}
                            onSelect={(value) => {
                              clearFieldError('state');
                              setBehalfFields((current) => ({ ...current, state: value, city: '', area: '' }));
                            }}
                            required
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <SelectField
                            label={t('field.city')}
                            labelVariant="default"
                            variant="registration"
                            placeholder={behalfFields.state ? (isLoadingCities ? t('field.city.loading') : t('field.city.placeholder')) : t('field.city.first')}
                            value={behalfFields.city}
                            options={behalfFields.state ? cityOptions : []}
                            disabled={!behalfFields.state || isLoadingCities}
                            error={fieldErrors.city}
                            onSelect={(value) => {
                              clearFieldError('city');
                              setBehalfFields((current) => ({
                                ...current,
                                city: value,
                                area: resolveVadodaraArea(value, current.area),
                              }));
                            }}
                            required
                          />
                        </View>
                      </View>
                      {isVadodaraCity(behalfFields.city) ? (
                        <SelectField
                          label="Area"
                          labelVariant="default"
                          variant="registration"
                          placeholder="Select area"
                          value={behalfFields.area}
                          options={vadodaraAreaOptions}
                          error={fieldErrors.area}
                          onSelect={(value) => {
                            clearFieldError('area');
                            setBehalfFields((current) => ({ ...current, area: value }));
                          }}
                          required
                        />
                      ) : null}
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        <View style={{ flex: 1 }}>
                          <TextField
                            label={t('field.pincode')}
                            labelVariant="default"
                            variant="registration"
                            inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                            placeholder={t('field.pincode.placeholder')}
                            value={behalfFields.pincode}
                            onChangeText={updateBehalfField('pincode')}
                            keyboardType="number-pad"
                            maxLength={6}
                            error={fieldErrors.pincode}
                            required
                          />
                        </View>
                      </View>
                      <TextField
                        label={t('field.panNumber')}
                        labelVariant="default"
                        variant="registration"
                        inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                        placeholder={t('field.panNumber.placeholder')}
                        value={behalfFields.panNumber}
                        onChangeText={(value) => updateBehalfField('panNumber')(value.toUpperCase())}
                        autoCapitalize="characters"
                        error={fieldErrors.panNumber}
                        required={false}
                      />
                      <PhoneInput
                        label={t('field.phoneNumber')}
                        placeholder={t('field.phoneNumber.placeholder')}
                        value={behalfFields.phoneNumber}
                        onChangeText={updateBehalfField('phoneNumber')}
                        error={fieldErrors.phoneNumber}
                      />
                      <TextField
                        label={t('field.totalFamilyMembers')}
                        labelVariant="default"
                        variant="registration"
                        inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                        placeholder={t('field.totalFamilyMembers.placeholder')}
                        value={behalfFields.totalFamilyMembers}
                        onChangeText={updateBehalfField('totalFamilyMembers')}
                        keyboardType="number-pad"
                        error={fieldErrors.totalFamilyMembers}
                        required
                      />
                      <TextField
                        label={t('field.relation')}
                        labelVariant="default"
                        variant="registration"
                        inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT }}
                        placeholder={t('field.relation.placeholder')}
                        value={relation}
                        onChangeText={setRelation}
                      />
                    </>
                  ) : null}
                </View>

                <View style={{ gap: spacing[2] }}>
                  <AmountSelector
                    variant="pill"
                    presets={[]}
                    value={amount}
                    onChange={(value) => {
                      clearFieldError('amount');
                      setAmount(value);
                    }}
                    customAmountLabel={`${t('amount.custom')} (min ₹${minimumDonationAmount.toLocaleString('en-IN')})`}
                    customHelperText={customAmountHelperText}
                    chipRadius={radius.md}
                    inputRadius={radius.md}
                    inputBackgroundColor={colors.background.DEFAULT}
                  />
                  {fieldErrors.amount ? (
                    <Text variant="caption" color={colors.status.error}>
                      {fieldErrors.amount}
                    </Text>
                  ) : null}
                </View>

                <TextField
                  label={t('field.message')}
                  labelVariant="default"
                  variant="registration"
                  inputStyle={{ borderRadius: radius.md, backgroundColor: colors.background.DEFAULT, minHeight: 96 }}
                  placeholder={t('field.message.placeholder')}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isPaying}
                  disabled={isPaying}
                  onPress={handleDonatePress}
                  leftIcon={<MaterialIcons name="volunteer-activism" size={20} color={colors.text.inverse} />}>
                  {t('actions.donate')}
                </Button>
              </View>
            </View>
          </View>
          ) : null}

          {!showInitialSkeleton ? (
          <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[4], gap: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('section.recentDonations')}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => router.push(viewAllRoute as never)}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  {t('section.viewAll')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: spacing[3] }}>
              {isLoading ? (
                <>
                  <SkeletonCard lines={2} />
                  <SkeletonCard lines={2} />
                </>
              ) : errorMessage ? (
                <ErrorState
                  title={t('error.loadFailed')}
                  description={errorMessage}
                  onRetry={() => {
                    void reload();
                  }}
                />
              ) : items.length ? (
                items.map((item) => (
                  <DonationListItem
                    key={item.id}
                    amount={`₹${Number(item.amount || 0).toLocaleString('en-IN')}`}
                    meta={`${formatDonationDateTime(item.createdAt)} • ${formatVisibleDonationType(item.donationType, t('section.donationType'))}`}
                    viewing={viewingReceiptId === item.id}
                    onViewPress={() => {
                      void handleViewGeneratedReceipt(item);
                    }}
                    onDownloadPress={() => {
                      void handleDownloadGeneratedReceipt(item);
                    }}
                  />
                ))
              ) : (
                <View style={{ padding: spacing[5], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.surface }}>
                  <Text variant="body" style={{ textAlign: 'center', fontFamily: typography.fontFamily.medium, color: colors.text.muted }}>
                    {t('section.empty')}
                  </Text>
                </View>
              )}
            </View>
          </View>
          ) : null}
        </KeyboardAwareScrollView>
      </View>
      <Dialog
        visible={feedbackDialog.visible}
        variant={feedbackDialog.variant}
        title={feedbackDialog.title}
        description={feedbackDialog.description}
        confirmLabel="OK"
        onConfirm={() => setFeedbackDialog((current) => ({ ...current, visible: false }))}
      />
      <Dialog
        visible={successDialog.visible}
        variant="success"
        title={successDialog.title}
        description={successDialog.description}
        confirmLabel={t('checkout.success.action')}
        onConfirm={handleSuccessDialogConfirm}
      />
    </AppSafeAreaView>
  );
}
