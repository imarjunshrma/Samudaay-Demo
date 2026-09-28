import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Button, DetailPageSkeleton, Dialog, ErrorState, Text, type DialogVariant } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { matrimonyFeedService, type MatrimonyProfileRecord } from '../services/matrimony-feed-service';

function formatName(profile: MatrimonyProfileRecord, fallbackName: string) {
  return `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`.trim() || fallbackName;
}

function formatAgeLocation(profile: MatrimonyProfileRecord, communityLabel: string, language: 'en' | 'gu') {
  const age = profile.dob ? Math.max(Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)), 0) : null;
  return [age ? `${age} yrs` : null, translateLocationText([profile.area, profile.city, profile.state].filter(Boolean).join(', '), language) || communityLabel].filter(Boolean).join(' • ');
}

function formatAbsoluteDate(value?: string | null, includeTime = false) {
  if (!value) return 'Not provided';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not provided';

  return parsed.toLocaleDateString('en-IN', includeTime ? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  } : {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDisplayValue(value: unknown, fallback = 'Not provided') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed : fallback;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : fallback;
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    const items = value
      .map((item) => formatDisplayValue(item, ''))
      .filter(Boolean);
    return items.length ? items.join(', ') : fallback;
  }
  if (typeof value === 'object') {
    const serialized = JSON.stringify(value);
    return serialized && serialized !== '{}' ? serialized : fallback;
  }

  return String(value);
}

function toFieldLabel(key: string) {
  const normalized = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();

  const overrides: Record<string, string> = {
    id: 'Profile ID',
    userId: 'User ID',
    dob: 'Date of Birth',
    memberId: 'Member ID',
    aboutMe: 'About Me',
    familyType: 'Family Type',
    familyBackground: 'Family Background',
    preferredAgeMin: 'Preferred Age Min',
    preferredAgeMax: 'Preferred Age Max',
    preferredLocation: 'Preferred Location',
    photoUrls: 'Photo URLs',
    profilePhotoUrl: 'Primary Photo',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    reviewRequestType: 'Request Type',
    reviewChangeSummary: 'Change Summary',
    hasPendingReview: 'Pending Review',
  };

  if (overrides[key]) {
    return overrides[key];
  }

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRequestedImageUrls(record: MatrimonyProfileRecord | null) {
  if (!record?.pendingReviewData || typeof record.pendingReviewData !== 'object') {
    return [];
  }

  const rawPhotos = record.pendingReviewData.photoUrls;
  if (Array.isArray(rawPhotos)) {
    return rawPhotos.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()));
  }

  return [];
}

function buildDetailSections(record: MatrimonyProfileRecord, t: ReturnType<typeof useTranslations>, language: 'en' | 'gu', canShowContact: boolean, isAdminView: boolean) {
  const sections = [
    {
      title: 'Identity',
      fields: [
        ...(isAdminView
          ? [
              { label: 'Profile ID', value: record.id },
              { label: 'User ID', value: record.userId },
            ]
          : []),
        { label: 'Member ID', value: record.memberId },
        { label: 'First Name', value: record.firstName },
        { label: 'Last Name (Surname)', value: record.lastName },
        { label: 'Gender', value: record.gender },
        { label: 'Date of Birth', value: record.dob ? formatAbsoluteDate(record.dob) : t('details.fallback.notProvided') },
        { label: 'Age / Location', value: formatAgeLocation(record, t('details.fallback.community'), language) },
        { label: 'Height', value: record.height },
        { label: 'Marital Status', value: record.maritalStatus },
        ...(record.childrenCount !== null && record.childrenCount !== undefined
          ? [{ label: 'Number of Children', value: String(record.childrenCount) }]
          : []),
        ...(isAdminView ? [{ label: 'Status', value: record.status }] : []),
      ],
    },
    {
      title: 'Contact & Location',
      fields: [
        ...(canShowContact
          ? [
              { label: 'Mobile Number', value: record.contact?.phone },
              { label: 'Email Address', value: record.contact?.email },
            ]
          : []),
        { label: 'Area', value: translateLocationText(record.area || '', language) || record.area },
        { label: 'City', value: translateLocationText(record.city || '', language) || record.city },
        { label: 'State', value: translateLocationText(record.state || '', language) || record.state },
        { label: 'Country', value: record.country },
        { label: 'Community', value: record.community },
        { label: 'Caste', value: record.caste },
      ],
    },
    {
      title: 'Education & Work',
      fields: [
        { label: 'Education', value: record.education },
        { label: 'Occupation', value: record.occupation },
        { label: 'Income', value: record.income },
        { label: 'About Me', value: record.aboutMe },
      ],
    },
    {
      title: 'Family Background',
      fields: [
        { label: 'Family Type', value: record.familyType },
        { label: 'Family Background', value: record.familyBackground },
      ],
    },
    {
      title: 'Partner Preferences',
      fields: [
        {
          label: 'Preferred Age Range',
          value: record.preferredAgeMin || record.preferredAgeMax
            ? `${record.preferredAgeMin ?? '-'} to ${record.preferredAgeMax ?? '-'}`
            : t('details.fallback.notProvided'),
        },
        { label: 'Preferred Location', value: record.preferredLocation },
        { label: 'Preferences', value: record.preferences },
      ],
    },
    ...(isAdminView
      ? [
          {
            title: 'Review Metadata',
            fields: [
              { label: 'Request Type', value: record.reviewRequestType },
              { label: 'Pending Review', value: record.hasPendingReview ? 'Yes' : 'No' },
              { label: 'Change Summary', value: record.reviewChangeSummary?.length ? record.reviewChangeSummary.join(', ') : t('details.fallback.notProvided') },
              { label: 'Admin Remarks', value: record.remarks },
              { label: 'Created At', value: record.createdAt ? formatAbsoluteDate(record.createdAt, true) : t('details.fallback.notProvided') },
              { label: 'Updated At', value: record.updatedAt ? formatAbsoluteDate(record.updatedAt, true) : t('details.fallback.notProvided') },
            ],
          },
        ]
      : []),
  ];

  return sections
    .map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        value: formatDisplayValue(field.value, t('details.fallback.notProvided')),
      })),
    }))
    .filter((section) => section.fields.length);
}

export function MatrimonyProfileDetailsContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('matrimony.approve-profiles');
  const { language } = useAppPreferences();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ profileId?: string | string[] }>();
  const profileId = Array.isArray(params.profileId) ? params.profileId[0] : params.profileId;
  const isAdminModerationView = pathname.startsWith('/admin/matrimony-profiles') || pathname.startsWith('/matrimony/approve-profiles');
  const formatRelativeLabel = useCallback((value?: string | null) => {
    if (!value) return t('details.relative.recently');

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return t('details.relative.recently');

    const diffHours = Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return t('details.relative.justNow');
    if (diffHours < 24) return t('details.relative.hoursAgo').replace('{count}', String(diffHours));
    return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [t]);
  const mapStatus = useCallback((status?: string | null) => {
    if (status === 'APPROVED' || status === 'ACTIVE') return t('tabs.approved');
    if (status === 'REJECTED') return t('tabs.rejected');
    return t('tabs.newRequests');
  }, [t]);

  const [actioning, setActioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<MatrimonyProfileRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
    navigateOnConfirm: boolean;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    navigateOnConfirm: false,
  });

  useEffect(() => {
    let active = true;

    void (async () => {
      if (!profileId) {
        setRecord(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);
      try {
        const profile = await matrimonyFeedService.loadProfileById(profileId);
        if (active) {
          setRecord(profile);
        }
      } catch (error) {
        if (active) {
          setRecord(null);
          setLoadError(error instanceof Error ? error.message : t('details.errors.load'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [profileId, t]);

  const fields = useMemo(() => {
    if (!record) return [];
    const canShowContact = isAdminModerationView || record.connection?.status === 'ACCEPTED';
    return buildDetailSections(record, t, language, canShowContact, isAdminModerationView);
  }, [isAdminModerationView, language, record, t]);

  const handleApprove = useCallback(async () => {
    if (!record) return;
    setActioning(true);
    try {
      await matrimonyFeedService.reviewProfile(record.id, 'approve');
      setRecord((current) => current ? { ...current, status: 'APPROVED' } : current);
      setDialog({
        visible: true,
        variant: 'success',
        title: t('details.dialogs.approvedTitle'),
        description: formatName(record, t('details.fallback.communityMember')),
        navigateOnConfirm: true,
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('details.dialogs.approveErrorTitle'),
        description: error instanceof Error ? error.message : t('details.dialogs.tryAgain'),
        navigateOnConfirm: false,
      });
    } finally {
      setActioning(false);
    }
  }, [record, t]);

  const handleReject = useCallback(async () => {
    if (!record) return;
    setActioning(true);
    try {
      await matrimonyFeedService.reviewProfile(record.id, 'reject', 'Rejected by admin.');
      setRecord((current) => current ? { ...current, status: 'REJECTED', remarks: 'Rejected by admin.' } : current);
      setDialog({
        visible: true,
        variant: 'warning',
        title: t('details.dialogs.rejectedTitle'),
        description: formatName(record, t('details.fallback.communityMember')),
        navigateOnConfirm: true,
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('details.dialogs.rejectErrorTitle'),
        description: error instanceof Error ? error.message : t('details.dialogs.tryAgain'),
        navigateOnConfirm: false,
      });
    } finally {
      setActioning(false);
    }
  }, [record, t]);

  const displayStatus = mapStatus(record?.status);
  const name = record ? formatName(record, t('details.fallback.communityMember')) : t('details.fallback.communityMember');
  const fallbackImage = 'https://api.dicebear.com/7.x/initials/png?seed=' + encodeURIComponent(name);
  const images = useMemo(() => {
    const requestedImages = getRequestedImageUrls(record);
    return (requestedImages.length
      ? requestedImages
      : record?.photoUrls.length
        ? record.photoUrls
        : [record?.profilePhotoUrl || '']).filter(Boolean);
  }, [record]);
  const isNewRequest = isAdminModerationView && displayStatus === t('tabs.newRequests');

  return (
    <>
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flex: 1 }}>
        <AppHeader variant="back-inline" title={t('details.title')} onLeftPress={navigateBack} />
        {loading ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 32 }}>
            <DetailPageSkeleton heroHeight={320} sections={3} />
          </ScrollView>
        ) : !record ? (
          <View style={{ flex: 1, padding: spacing[4], paddingTop: spacing[6] }}>
            <ErrorState
              title={t('details.notFoundTitle')}
              description={loadError || t('details.notFoundDescription')}
              onRetry={navigateBack}
            />
          </View>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 32 }}>
          <View style={{ gap: spacing[4] }}>
            <View style={{ gap: spacing[2] }}>
              <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.8, fontFamily: typography.fontFamily.bold }}>
                {t('details.applicationLabel')}
              </Text>
              <Text variant="h1" style={{ fontSize: 38, lineHeight: 42, fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {name}
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
                {formatAgeLocation(record, t('details.fallback.community'), language)}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3] }}>
              {(images.length ? images : [fallbackImage]).map((image, index) => (
                <View key={`${image}-${index}`} style={{ width: 260, borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
                  <View style={{ aspectRatio: 4 / 5, backgroundColor: colors.background.muted }}>
                    <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[4], shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  {t('details.profileInformation')}
                </Text>
                {isAdminModerationView ? (
                  <View
                    style={{
                      paddingHorizontal: spacing[2],
                      paddingVertical: spacing[1],
                      borderRadius: radius.full,
                      backgroundColor:
                        displayStatus === t('tabs.approved')
                          ? 'rgba(0,80,75,0.1)'
                          : displayStatus === t('tabs.rejected')
                            ? colors.status.errorLight
                            : colors.primary.muted,
                    }}>
                    <Text
                      variant="caption"
                      style={{
                        color:
                          displayStatus === t('tabs.approved')
                            ? colors.status.success
                            : displayStatus === t('tabs.rejected')
                              ? colors.status.error
                              : colors.primary.DEFAULT,
                        fontFamily: typography.fontFamily.bold,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}>
                      {displayStatus}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={{ gap: spacing[4] }}>
                {fields.map((section) => (
                  <View key={section.title} style={{ gap: spacing[3] }}>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                      {section.title}
                    </Text>
                    <View style={{ gap: spacing[4] }}>
                      {section.fields.map((field) => (
                        <View key={`${section.title}-${field.label}`} style={{ borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: spacing[2], gap: 2 }}>
                          <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.6, fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                            {field.label}
                          </Text>
                          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
                            {field.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {isAdminModerationView && record.pendingReviewData && Object.keys(record.pendingReviewData).length ? (
              <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[4], shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
                <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  Requested Changes
                </Text>
                <View style={{ gap: spacing[4] }}>
                  {Object.entries(record.pendingReviewData).map(([key, value]) => (
                    <View key={key} style={{ borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: spacing[2], gap: 2 }}>
                      <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.6, fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                        {toFieldLabel(key)}
                      </Text>
                      <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
                        {formatDisplayValue(
                          key === 'photoUrls'
                            ? Array.isArray(value)
                              ? `${value.length} photo${value.length === 1 ? '' : 's'} selected`
                              : value
                            : value,
                          t('details.fallback.notProvided'),
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {isAdminModerationView ? (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[4], shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  {t('details.status')}
                </Text>
                <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radius.full, backgroundColor: colors.primary.muted, borderWidth: 1, borderColor: colors.primary.borderLight }}>
                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {displayStatus}
                  </Text>
                </View>
              </View>

              <Text variant="body" style={{ color: colors.text.muted, lineHeight: 22 }}>
                {t('details.submittedBy').replace('{time}', formatRelativeLabel(record.createdAt || record.updatedAt))}
              </Text>

              <View style={{ height: 1, backgroundColor: colors.border.light }} />

              <View style={{ gap: spacing[2] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <MaterialIcons name="location-on" size={18} color={colors.primary.DEFAULT} />
                  <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
                    {translateLocationText([record.area, record.city].filter(Boolean).join(', '), language) || t('details.fallback.community')}
                  </Text>
                </View>
                {record.aboutMe ? (
                  <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, lineHeight: 22 }}>
                    {record.aboutMe}
                  </Text>
                ) : null}
                {record.remarks ? (
                  <Text variant="body" style={{ color: colors.status.error, fontFamily: typography.fontFamily.medium, lineHeight: 22 }}>
                    {record.remarks}
                  </Text>
                ) : null}
              </View>
            </View>
            ) : null}

            {isNewRequest ? (
              <View style={{ gap: spacing[3] }}>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<MaterialIcons name="close" size={16} color={colors.primary.DEFAULT} />}
                  onPress={handleReject}
                  disabled={actioning}>
                  {t('actions.reject')}
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<MaterialIcons name="verified" size={16} color="#ffffff" />}
                  onPress={handleApprove}
                  disabled={actioning}>
                  {t('actions.approve')}
                </Button>
              </View>
            ) : (
              <Button variant="primary" fullWidth onPress={navigateBack} disabled={actioning}>
                {isAdminModerationView ? t('details.close') : 'Back'}
              </Button>
            )}
          </View>
        </ScrollView>
        )}
        </View>
      </AppSafeAreaView>
      <Dialog
        visible={dialog.visible}
        variant={dialog.variant}
        title={dialog.title}
        description={dialog.description}
        onConfirm={() => {
          const shouldNavigate = dialog.navigateOnConfirm;
          setDialog((current) => ({ ...current, visible: false }));
          if (shouldNavigate) {
            navigateBack();
          }
        }}
        onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
      />
    </>
  );
}
