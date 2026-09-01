import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { FormikProvider } from 'formik';
import { useFocusEffect } from '@react-navigation/native';

import {
  AppHeader,
  AppSafeAreaView,
  Button,
  Card,
  DateField,
  DetailPageSkeleton,
  Dialog,
  FileUpload,
  FixedActionBar,
  FormScreenLayout,
  SelectField,
  Text,
  TextField,
} from '@/src/components';
import { showConfirmationDialog } from '@/src/components/feedback/Dialog/dialog-service';
import { formSchemas } from '@/src/components/forms/validation';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useAppForm } from '@/src/hooks/useForm';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';
import type { DialogVariant } from '@/src/components/feedback/Dialog/Dialog';

import {
  promotionService,
  toPromotionFormValues,
  type PromotionFormValues,
  type PromotionRecord,
} from '../services/promotion-service';

type AdvertisementFormMode = 'create' | 'edit' | 'view';
type AdvertisementImageInputMode = 'upload' | 'url';

type AdvertisementFormContentProps = {
  mode: AdvertisementFormMode;
  promotionId?: string;
};
type PopupState = {
  visible: boolean;
  variant: Exclude<DialogVariant, 'confirm'>;
  title: string;
  description?: string;
};

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function formatPercent(value?: number | null) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatCompactNumber(value?: number | null) {
  return new Intl.NumberFormat('en-IN', {
    notation: Number(value || 0) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: Number(value || 0) >= 1000 ? 1 : 0,
  }).format(Number(value || 0));
}

function formatCurrency(value?: number | null) {
  return `Rs ${Math.round(Number(value || 0)).toLocaleString('en-IN')}`;
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={{ gap: spacing[1] }}>
      <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: typography.fontFamily.medium }}>
        {label}
      </Text>
      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
        {value === undefined || value === null || value === '' ? '—' : String(value)}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card variant="elevated" padding="md">
      <View style={{ gap: spacing[3] }}>
        <View style={{ gap: spacing[1] }}>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" style={{ color: colors.text.muted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {children}
      </View>
    </Card>
  );
}

function statusTone(status?: string | null) {
  switch (String(status || '').toUpperCase()) {
    case 'ACTIVE':
      return { bg: '#dcfce7', fg: '#166534' };
    case 'EXPIRED':
      return { bg: '#fee2e2', fg: '#b91c1c' };
    case 'INACTIVE':
      return { bg: '#e2e8f0', fg: '#475569' };
    case 'SCHEDULED':
      return { bg: '#dbeafe', fg: '#1d4ed8' };
    default:
      return { bg: '#fef3c7', fg: '#b45309' };
  }
}

function getPauseTargetStatus(status?: string | null): 'ACTIVE' | 'INACTIVE' {
  return String(status || '').toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
}

function canActivateAdvertisement(record: Pick<PromotionFormValues, 'startAt' | 'endAt'> | PromotionRecord | null | undefined) {
  return Boolean(record?.startAt && record?.endAt);
}

function toImageFile(record?: PromotionRecord | null): FileValue | null {
  if (!record?.imageUrl) {
    return null;
  }

  return {
    uri: record.imageUrl,
    name: record.imageUrl.split('/').pop() || 'advertisement-image',
  };
}

export function AdvertisementFormContent({ mode, promotionId }: AdvertisementFormContentProps) {
  const t = useTranslations('admin.advertisements');
  const navigateBack = useBackNavigation();
  const { safeReplace } = useSafeNavigation();
  const [promotion, setPromotion] = useState<PromotionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(mode !== 'create');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<FileValue | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<AdvertisementImageInputMode>('upload');
  const [popup, setPopup] = useState<PopupState | null>(null);

  function showPopup(variant: Exclude<DialogVariant, 'confirm'>, title: string, description?: string) {
    setPopup({ visible: true, variant, title, description });
  }
  const handleClose = () => navigateBack('/admin/advertisements');

  const loadPromotion = useCallback(() => {
    let active = true;

    if (mode === 'create') {
      setPromotion(null);
      setImageFile(null);
      setIsLoading(false);
      setLoadError(null);
      return () => {
        active = false;
      };
    }

    if (!promotionId) {
      setIsLoading(false);
      setLoadError(t('messages.notFound'));
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setLoadError(null);

    void promotionService.loadPromotion(promotionId)
      .then((result) => {
        if (!active) {
          return;
        }
        setPromotion(result);
        setImageFile(toImageFile(result));
        setImageInputMode(result?.imageUrl && /^https?:\/\//i.test(result.imageUrl) ? 'url' : 'upload');
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : t('messages.loadError'));
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [mode, promotionId, t]);

  useFocusEffect(loadPromotion);

  const initialValues = useMemo(() => toPromotionFormValues(promotion), [promotion]);
  const todayMinimumDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const formik = useAppForm<PromotionFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchemas.promotion,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      try {
        const saved = mode === 'edit' && promotionId
          ? await promotionService.updatePromotion(promotionId, values)
          : await promotionService.createPromotion(values);
        setPromotion(saved);
        setImageFile(toImageFile(saved));
        setImageInputMode(saved?.imageUrl && /^https?:\/\//i.test(saved.imageUrl) ? 'url' : 'upload');
        handleClose();
      } catch (error) {
        helpers.setStatus({
          error: error instanceof Error ? error.message : 'Unable to save advertisement.',
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  const endDateMinimum = useMemo(() => {
    if (!formik.values.startAt) {
      return todayMinimumDate;
    }

    const next = new Date(formik.values.startAt);
    next.setHours(0, 0, 0, 0);
    return next.getTime() > todayMinimumDate.getTime() ? next : todayMinimumDate;
  }, [formik.values.startAt, todayMinimumDate]);

  const contentTypeOptions = useMemo(
    () => [
      { label: 'Text Advertisement', value: 'TEXT' },
      { label: 'Image Advertisement', value: 'IMAGE' },
      { label: 'Video Advertisement', value: 'VIDEO' },
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { label: 'Business Promotion', value: 'BUSINESS_PROMOTION' },
      { label: 'Community Announcement', value: 'COMMUNITY_ANNOUNCEMENT' },
      { label: 'Matrimony', value: 'MATRIMONY' },
      { label: 'Education', value: 'EDUCATION' },
      { label: 'Other', value: 'OTHER' },
    ],
    [],
  );

  const pricingOptions = useMemo(
    () => [
      { label: 'Free Advertisement', value: 'FREE' },
      { label: 'Paid Advertisement', value: 'PAID' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { label: 'Draft', value: 'DRAFT' },
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Paused', value: 'INACTIVE' },
      { label: 'Scheduled', value: 'SCHEDULED' },
      { label: 'Expired', value: 'EXPIRED' },
    ],
    [],
  );

  const skipOptions = useMemo(
    () => [
      { label: 'Skip Enabled', value: 'true' },
      { label: 'No Skip', value: 'false' },
    ],
    [],
  );

  const imageInputModeOptions = useMemo(
    () => [
      { label: 'Upload Image', value: 'upload' },
      { label: 'Paste Image URL', value: 'url' },
    ],
    [],
  );

  const handleImageChange = async (nextFile: FileValue | null) => {
    setImageFile(nextFile);

    if (!nextFile) {
      await formik.setFieldValue('imageUrl', '');
      return;
    }

    setImageUploading(true);
    try {
      const uploadedPath = await promotionService.uploadPromotionImage(nextFile);
      if (!uploadedPath) {
        throw new Error('Image upload failed.');
      }
      await formik.setFieldValue('imageUrl', uploadedPath);
      setImageFile(nextFile);
    } catch (error) {
      showPopup('error', t('form.popup.uploadFailed'), error instanceof Error ? error.message : t('messages.imageUploadFailed'));
      await formik.setFieldValue('imageUrl', '');
    } finally {
      setImageUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!promotionId) {
      return;
    }

    const confirmed = await showConfirmationDialog({
      title: t('messages.deleteTitle'),
      description: t('messages.deleteBody'),
      confirmLabel: t('actions.delete'),
      cancelLabel: t('actions.cancel'),
    });

    if (!confirmed) {
      return;
    }

    try {
      await promotionService.deletePromotion(promotionId);
      handleClose();
    } catch (error) {
      showPopup('error', t('form.popup.deleteFailed'), error instanceof Error ? error.message : t('messages.deleteError'));
    }
  };

  const handlePublish = async () => {
    if (!promotionId || !promotion) {
      return;
    }

    if (!canActivateAdvertisement(promotion)) {
      showPopup('error', t('form.popup.publishFailed'), t('form.helpers.activeStatusDates'));
      return;
    }

    try {
      const published = await promotionService.updatePromotion(promotionId, {
        ...toPromotionFormValues(promotion),
        status: 'ACTIVE',
      });
      setPromotion(published);
      setImageFile(toImageFile(published));
      showPopup('success', t('form.popup.publishSuccess'), t('form.popup.publishSuccessBody'));
    } catch (error) {
      showPopup('error', t('form.popup.publishFailed'), error instanceof Error ? error.message : t('messages.saveError'));
    }
  };

  if (loadError) {
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader variant="back-inline" title={mode === 'edit' ? t('form.title.edit') : mode === 'view' ? t('form.title.view') : t('form.title.create')} onLeftPress={handleClose} />
        <View style={{ padding: spacing[4] }}>
          <Card variant="elevated">
            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {loadError}
            </Text>
          </Card>
        </View>
      </AppSafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader variant="back-inline" title={mode === 'edit' ? t('form.title.edit') : mode === 'view' ? t('form.title.view') : t('form.title.create')} onLeftPress={handleClose} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 132 }}>
          <DetailPageSkeleton heroHeight={220} sections={4} />
        </ScrollView>
      </AppSafeAreaView>
    );
  }

  if (mode === 'view' && promotion) {
    const tone = statusTone(promotion.status);
    const normalizedStatus = String(promotion.status || '').toUpperCase();
    const canPublish = normalizedStatus === 'DRAFT' || normalizedStatus === 'EXPIRED';
    const canPauseToggle = normalizedStatus === 'ACTIVE' || normalizedStatus === 'INACTIVE';
    const impressions = Number(promotion.impressionCount || 0);
    const clicks = Number(promotion.clickCount || 0);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    return (
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader variant="back-inline" title={t('form.title.view')} onLeftPress={handleClose} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 132, gap: spacing[4] }}>
          <Card variant="elevated" padding="lg">
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] }}>
                <View style={{ flex: 1, gap: spacing[1] }}>
                  <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                    {promotion.title}
                  </Text>
                  <Text variant="caption" style={{ color: colors.text.muted }}>
                    {String(promotion.category || 'OTHER').replace(/_/g, ' ')}
                  </Text>
                </View>
                <View style={{ borderRadius: radius.full, backgroundColor: tone.bg, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                  <Text variant="caption" style={{ color: tone.fg, fontFamily: typography.fontFamily.bold }}>
                    {String(promotion.status || '').toUpperCase() === 'INACTIVE'
                      ? t('form.status.paused')
                      : String(promotion.status || '').toUpperCase() === 'SCHEDULED'
                        ? t('options.status.scheduled')
                        : String(promotion.status || '').toUpperCase() === 'ACTIVE'
                          ? t('options.status.active')
                          : String(promotion.status || '').toUpperCase() === 'EXPIRED'
                            ? t('filters.expired')
                            : t('options.status.draft')}
                  </Text>
                </View>
              </View>

              {promotion.imageUrl ? (
                <Image
                  source={{ uri: promotion.imageUrl }}
                  style={{ width: '100%', height: 200, borderRadius: radius.xl, backgroundColor: colors.background.surfaceAlt }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          </Card>

          <SectionCard title={t('form.contentTitle')} subtitle={t('form.contentSubtitle')}>
            <View style={{ gap: spacing[3] }}>
              <DetailRow label={t('form.details.contentType')} value={promotion.contentType} />
              <DetailRow label={t('form.details.description')} value={promotion.description} />
              <DetailRow label={t('form.details.videoUrl')} value={promotion.videoUrl} />
              <DetailRow label={t('form.details.redirectUrl')} value={promotion.redirectUrl} />
            </View>
          </SectionCard>

          <SectionCard title={t('form.scheduleTitle')} subtitle={t('form.scheduleSubtitle')}>
            <View style={{ gap: spacing[3] }}>
              <DetailRow label={t('form.details.startDate')} value={formatDate(promotion.startAt)} />
              <DetailRow label={t('form.details.endDate')} value={formatDate(promotion.endAt)} />
              <DetailRow label={t('form.details.displayInterval')} value={t('form.details.secondsValue', { value: promotion.displayIntervalSeconds || 300 })} />
              <DetailRow label={t('form.details.displayDuration')} value={t('form.details.secondsValue', { value: promotion.displayDurationSeconds || 10 })} />
              <DetailRow label={t('form.details.skipAfter')} value={promotion.skipEnabled === false ? t('form.details.skipDisabled') : t('form.details.secondsValue', { value: promotion.skipAfterSeconds || 3 })} />
            </View>
          </SectionCard>

          <SectionCard title={t('form.pricingTitle')} subtitle={t('form.pricingSubtitle')}>
            <View style={{ gap: spacing[3] }}>
              <DetailRow label={t('form.details.pricingType')} value={promotion.pricingType} />
              <DetailRow label={t('form.details.amount')} value={promotion.amount} />
              <DetailRow label={t('form.details.paymentReference')} value={promotion.paymentReference} />
              <DetailRow label={t('form.details.priorityWeight')} value={promotion.priorityWeight} />
            </View>
          </SectionCard>

          <SectionCard title={t('form.analyticsTitle')} subtitle={t('form.analyticsSubtitle')}>
            <View style={{ gap: spacing[3] }}>
              <DetailRow label={t('form.details.impressions')} value={formatCompactNumber(impressions)} />
              <DetailRow label={t('form.details.clicks')} value={formatCompactNumber(clicks)} />
              <DetailRow label={t('form.details.ctr')} value={formatPercent(ctr)} />
              <DetailRow label={t('form.details.engagementRate')} value={formatPercent(promotion.engagementRate)} />
              <DetailRow label={t('form.details.lastImpression')} value={formatDate(promotion.lastImpressionAt)} />
              <DetailRow label={t('form.details.lastClick')} value={formatDate(promotion.lastClickAt)} />
              <DetailRow label={t('form.details.revenueValue')} value={String(promotion.pricingType || '').toUpperCase() === 'PAID' ? formatCurrency(promotion.amount) : t('listing.freeAdvertisement')} />
              <DetailRow label={t('form.details.priorityWeight')} value={promotion.priorityWeight || 1} />
              <DetailRow label={t('form.details.maxShowsPerUser')} value={promotion.maxAdsPerSession || t('form.details.unlimited')} />
            </View>
          </SectionCard>
        </ScrollView>

        <FixedActionBar
          actions={[
            ...(canPublish
              ? [{
                key: 'publish',
                label: t('form.button.publish'),
                onPress: handlePublish,
              } as const]
              : []),
            ...(canPauseToggle
              ? [{
                key: 'pause',
                label: String(promotion.status || '').toUpperCase() === 'ACTIVE' ? t('form.button.pause') : t('form.button.resume'),
                variant: 'outline',
                onPress: async () => {
                  if (getPauseTargetStatus(promotion.status) === 'ACTIVE' && !canActivateAdvertisement(promotion)) {
                    showPopup('error', t('form.popup.updateFailed'), t('form.helpers.activeStatusDates'));
                    return;
                  }
                  try {
                    const next = await promotionService.updatePromotion(String(promotionId), {
                      ...toPromotionFormValues(promotion),
                      status: getPauseTargetStatus(promotion.status),
                    });
                    setPromotion(next);
                    showPopup('success', t('form.popup.statusUpdated'), getPauseTargetStatus(promotion.status) === 'INACTIVE' ? t('form.popup.pausedBody') : t('form.popup.activeBody'));
                  } catch (error) {
                    showPopup('error', t('form.popup.updateFailed'), error instanceof Error ? error.message : t('listing.updateErrorBody'));
                  }
                },
              } as const]
              : []),
            {
              key: 'edit',
              label: t('form.button.edit'),
              variant: 'outline',
              onPress: () => safeReplace(`/admin/advertisements/edit/${encodeURIComponent(String(promotionId))}`),
            },
            {
                key: 'delete',
                label: t('actions.delete'),
                variant: 'danger',
                onPress: () => void handleDelete(),
              },
          ]}
        />
      </AppSafeAreaView>
    );
  }

  return (
    <FormScreenLayout
      header={<AppHeader variant="back-inline" title={mode === 'edit' ? t('form.title.edit') : mode === 'view' ? t('form.title.view') : t('form.title.create')} onLeftPress={handleClose} />}
      footer={
        <View style={{ borderTopWidth: 1, borderTopColor: colors.primary.borderLight, backgroundColor: colors.background.DEFAULT, padding: spacing[4] }}>
          <View style={{ flexDirection: 'row', gap: spacing[3], maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <View style={{ flex: 1 }}>
              <Button variant="outline" fullWidth disabled={formik.isSubmitting || imageUploading} onPress={handleClose}>
                {t('form.button.cancel')}
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button fullWidth loading={formik.isSubmitting || imageUploading} disabled={formik.isSubmitting || imageUploading} onPress={() => void formik.submitForm()}>
                {t('form.button.save')}
              </Button>
            </View>
          </View>
        </View>
      }>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <FormikProvider value={formik}>
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[6], gap: spacing[4] }}>
          <SectionCard title={t('form.sections.basicTitle')} subtitle={t('form.sections.basicSubtitle')}>
            <View style={{ gap: spacing[4] }}>
              <TextField name="title" label={t('form.fields.title')} labelVariant="default" placeholder={t('form.placeholders.title')} variant="registration" />
              <TextField name="description" label={t('form.fields.description')} labelVariant="default" placeholder={t('form.placeholders.description')} multiline numberOfLines={4} variant="registration" />
              <SelectField name="contentType" label={t('form.fields.contentType')} labelVariant="default" placeholder={t('form.placeholders.contentType')} options={contentTypeOptions} variant="registration" />
              <SelectField name="category" label={t('form.fields.category')} labelVariant="default" placeholder={t('form.placeholders.category')} options={categoryOptions} variant="registration" />
            </View>
          </SectionCard>

          <SectionCard title={t('form.sections.mediaTitle')} subtitle={t('form.sections.mediaSubtitle')}>
            <View style={{ gap: spacing[4] }}>
              {formik.values.contentType === 'IMAGE' ? (
                <View style={{ gap: spacing[4] }}>
                  <SelectField
                    label={t('form.fields.imageSource')}
                    value={imageInputMode}
                    onSelect={(value) => setImageInputMode(value as AdvertisementImageInputMode)}
                    options={imageInputModeOptions}
                    variant="registration"
                  />
                  {imageInputMode === 'upload' ? (
                    <FileUpload
                      label={t('form.fields.image')}
                      value={imageFile}
                      onChange={(value) => {
                        void handleImageChange(value);
                      }}
                      helperText={t('form.helpers.image')}
                      documentTypes={['image/png', 'image/jpeg']}
                      error={typeof formik.errors.imageUrl === 'string' ? formik.errors.imageUrl : undefined}
                      variant="card"
                    />
                  ) : (
                    <TextField
                      name="imageUrl"
                      label={t('form.fields.imageUrl')}
                      labelVariant="default"
                      placeholder={t('form.placeholders.imageUrl')}
                      variant="registration"
                    />
                  )}
                </View>
              ) : null}
              {formik.values.contentType === 'VIDEO' ? (
                <TextField name="videoUrl" label={t('form.fields.videoUrl')} labelVariant="default" placeholder={t('form.placeholders.videoUrl')} variant="registration" />
              ) : null}
              <TextField name="redirectUrl" label={t('form.fields.redirectUrl')} labelVariant="default" placeholder={t('form.placeholders.redirectUrl')} variant="registration" />
            </View>
          </SectionCard>

          <SectionCard title={t('form.sections.durationTitle')} subtitle={t('form.sections.durationSubtitle')}>
            <View style={{ gap: spacing[4] }}>
              <DateField
                name="startAt"
                label={t('form.fields.startDate')}
                labelVariant="default"
                placeholder={t('form.placeholders.startDate')}
                minimumDate={todayMinimumDate}
              />
              <DateField
                name="endAt"
                label={t('form.fields.endDate')}
                labelVariant="default"
                placeholder={t('form.placeholders.endDate')}
                minimumDate={endDateMinimum}
              />
              <View style={{ gap: spacing[2] }}>
                <SelectField name="status" label={t('form.fields.status')} labelVariant="default" placeholder={t('form.placeholders.status')} options={statusOptions} variant="registration" />
                <Text variant="caption" style={{ color: colors.text.muted }}>
                  {t('form.helpers.activeStatusDates')}
                </Text>
              </View>
            </View>
          </SectionCard>

          <SectionCard title={t('form.sections.pricingTitle')} subtitle={t('form.sections.pricingSubtitle')}>
            <View style={{ gap: spacing[4] }}>
              <SelectField name="pricingType" label={t('form.fields.pricing')} labelVariant="default" placeholder={t('form.placeholders.pricing')} options={pricingOptions} variant="registration" />
              {formik.values.pricingType === 'PAID' ? (
                <>
                  <TextField name="amount" label={t('form.fields.amount')} labelVariant="default" placeholder={t('form.placeholders.amount')} keyboardType="numeric" variant="registration" />
                  <TextField name="paymentReference" label={t('form.fields.paymentReference')} labelVariant="default" placeholder={t('form.placeholders.paymentReference')} variant="registration" />
                </>
              ) : null}
            </View>
          </SectionCard>

          <SectionCard title={t('form.sections.displayTitle')} subtitle={t('form.sections.displaySubtitle')}>
            <View style={{ gap: spacing[4] }}>
              <TextField name="displayIntervalSeconds" label={t('form.fields.displayInterval')} labelVariant="default" placeholder={t('form.placeholders.displayInterval')} keyboardType="numeric" variant="registration" />
              <TextField name="displayDurationSeconds" label={t('form.fields.displayDuration')} labelVariant="default" placeholder={t('form.placeholders.displayDuration')} keyboardType="numeric" variant="registration" />
              <SelectField
                label={t('form.fields.skipOption')}
                value={formik.values.skipEnabled ? 'true' : 'false'}
                onSelect={(value) => void formik.setFieldValue('skipEnabled', value === 'true')}
                options={skipOptions}
                variant="registration"
              />
              {formik.values.skipEnabled ? (
                <TextField name="skipAfterSeconds" label={t('form.fields.skipAfter')} labelVariant="default" placeholder={t('form.placeholders.skipAfter')} keyboardType="numeric" variant="registration" />
              ) : null}
              <TextField name="maxAdsPerSession" label={t('form.fields.maxShowsPerUser')} labelVariant="default" placeholder={t('form.placeholders.maxShowsPerUser')} keyboardType="numeric" variant="registration" />
              <TextField name="priorityWeight" label={t('form.fields.priorityWeight')} labelVariant="default" placeholder={t('form.placeholders.priorityWeight')} keyboardType="numeric" variant="registration" />
            </View>
          </SectionCard>

          {formik.status?.error ? (
            <Card variant="elevated">
              <Text variant="body" style={{ color: colors.status.error, fontFamily: typography.fontFamily.medium }}>
                {String(formik.status.error)}
              </Text>
            </Card>
          ) : null}
        </View>
      </FormikProvider>
      </View>
      <Dialog
        visible={Boolean(popup?.visible)}
        variant={popup?.variant || 'info'}
        title={popup?.title || ''}
        description={popup?.description}
        confirmLabel={t('actions.ok')}
        onConfirm={() => setPopup(null)}
      />
    </FormScreenLayout>
  );
}
