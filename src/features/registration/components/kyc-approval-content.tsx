import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, DetailPageSkeleton, SkeletonBlock } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { ErrorState } from '@/src/components/feedback';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, spacing } from '@/src/theme';
import { registrationService, type KycApprovalRecord } from '../services/registration-service';
import { KycApprovalActions, KycApprovalDocumentsCard, KycApprovalNote, KycApprovalProfileCard, KycApprovalStatusCard, KycApprovalSummary } from './kyc-approval-blocks';

function getRouteParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getDateLocale(language: 'en' | 'gu') {
  return language === 'gu' ? 'gu-IN' : 'en-GB';
}

function buildAddress(record: KycApprovalRecord, language: 'en' | 'gu') {
  return [
    record.addressLine1,
    record.addressLine2,
    translateLocationText([record.city, record.state].filter(Boolean).join(', '), language) || undefined,
    translateLocationText([record.pincode, record.country].filter(Boolean).join(' '), language) || undefined,
  ]
    .filter(Boolean)
    .join(', ');
}

function buildHighlightPoints(
  record: KycApprovalRecord,
  language: 'en' | 'gu',
  t: (key: string, vars?: Record<string, string | number>) => string,
) {
  const points: string[] = [];

  if (record.documents.length > 0) {
    points.push(t('points.documents').replace('{count}', String(record.documents.length)));
  }
  if (record.city) {
    points.push(t('points.location').replace('{city}', translateLocationText(record.city, language) || record.city));
  }
  if (record.photoUrl) {
    points.push(t('points.photo'));
  }

  return points.length ? points : [t('points.ready')];
}

export function KycApprovalContent() {
  const fallbackBack = useBackNavigation();
  const t = useTranslations('registration.kyc-approval');
  const { language } = useAppPreferences();
  const params = useLocalSearchParams<{ registrationId?: string; returnTo?: string }>();
  const registrationId = getRouteParamValue(params.registrationId);
  const returnTo = getRouteParamValue(params.returnTo);

  const [record, setRecord] = useState<KycApprovalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actioningType, setActioningType] = useState<'approve' | 'reject' | null>(null);
  const isPendingRecord = record?.status === 'Pending';
  const isApprovedRecord = record?.status === 'Ready';
  const isRejectedRecord = record?.status === 'Rejected';
  const canApproveRecord = Boolean(record && !isApprovedRecord);
  const canRejectRecord = Boolean(record && !isRejectedRecord);
  const approveActionLabel = isPendingRecord
    ? t('actions.approveMember')
    : isRejectedRecord
      ? t('actions.approveMember')
      : t('actions.approved');

  const navigateBack = useCallback(() => {
    if (returnTo) {
      fallbackBack(returnTo);
      return;
    }

    fallbackBack();
  }, [fallbackBack, returnTo]);

  const loadRecord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!registrationId) {
        throw new Error(t('error.missingRegistration'));
      }

      const result = await registrationService.loadKycApprovalRecord(registrationId);
      setRecord(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('error.load'));
    } finally {
      setIsLoading(false);
    }
  }, [registrationId, t]);

  useEffect(() => {
    void loadRecord();
  }, [loadRecord]);

  const fields = useMemo(() => {
    if (!record) {
      return [];
    }

    return [
      { label: t('field.fullName'), value: record.memberName },
      { label: t('field.gender'), value: record.gender ? t(`gender.${String(record.gender).trim().toLowerCase()}`) : t('fallback.notProvided') },
      {
        label: t('field.dob'),
        value: record.dob
          ? new Date(record.dob).toLocaleDateString(getDateLocale(language), { day: 'numeric', month: 'long', year: 'numeric' })
          : t('fallback.notProvided'),
      },
      { label: t('field.address'), value: buildAddress(record, language) || t('fallback.notProvided') },
      { label: t('field.city'), value: translateLocationText(record.city || '', language) || t('fallback.notProvided') },
      { label: t('field.pincode'), value: record.pincode || t('fallback.notProvided') },
    ];
  }, [language, record, t]);

  const handleApprove = useCallback(async () => {
    if (!record || !canApproveRecord) {
      return;
    }

    setActioningType('approve');
    try {
      await registrationService.approveKyc(record.id);
      navigateBack();
    } finally {
      setActioningType(null);
    }
  }, [canApproveRecord, navigateBack, record]);

  const handleReject = useCallback(async () => {
    if (!record || !canRejectRecord) {
      return;
    }

    setActioningType('reject');
    try {
      await registrationService.rejectKyc(record.id, rejectionReason.trim() || undefined);
      navigateBack();
    } finally {
      setActioningType(null);
    }
  }, [canRejectRecord, navigateBack, record, rejectionReason]);

  const loadingContent = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 32 }}>
      <View style={{ gap: spacing[6] }}>
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="30%" height={16} />
          <SkeletonBlock width="62%" height={32} />
          <SkeletonBlock width="48%" height={14} />
        </View>
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="24%" height={18} />
          {Array.from({ length: 6 }, (_, index) => (
            <View key={index} style={{ gap: spacing[2] }}>
              <SkeletonBlock width="28%" height={12} />
              <SkeletonBlock width="100%" height={48} />
            </View>
          ))}
        </View>
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="22%" height={18} />
          <DetailPageSkeleton heroHeight={0} sections={2} />
        </View>
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="26%" height={18} />
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} width="100%" height={84} />
          ))}
        </View>
        <View style={{ gap: spacing[3] }}>
          <SkeletonBlock width="100%" height={120} />
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <SkeletonBlock width="48%" height={48} />
            <SkeletonBlock width="48%" height={48} />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
        />

        {error ? (
          <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
            <ErrorState
              title={t('error.load')}
              description={error}
              onRetry={() => {
                void loadRecord();
              }}
            />
          </View>
        ) : isLoading || !record ? (
          loadingContent
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 32 }}>
            <View style={{ gap: spacing[6] }}>
              <KycApprovalSummary
                applicationId={record.memberId || record.id.slice(0, 5).toUpperCase()}
                memberName={record.memberName}
                subtitle={translateLocationText([record.city, record.state].filter(Boolean).join(', '), language) || undefined}
              />

              <KycApprovalProfileCard fields={fields} />

                <KycApprovalStatusCard
                statusLabel={record.status === 'Ready' ? t('status.approved') : record.status === 'Rejected' ? t('status.rejected') : t('status.pending')}
                submittedAt={record.submittedAt}
                highlightPoints={buildHighlightPoints(record, language, t)}
              />

              <KycApprovalDocumentsCard documents={record.documents} />

              {canRejectRecord ? <KycApprovalNote value={rejectionReason} onChangeText={setRejectionReason} /> : null}

              <KycApprovalActions
                onReject={() => {
                  void handleReject();
                }}
                onApprove={() => {
                  void handleApprove();
                }}
                loadingApprove={actioningType === 'approve'}
                loadingReject={actioningType === 'reject'}
                disableApprove={!canApproveRecord}
                disableReject={!canRejectRecord}
                approveLabel={approveActionLabel}
                rejectLabel={canRejectRecord ? t('actions.rejectWithReason') : t('actions.reviewComplete')}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </AppSafeAreaView>
  );
}
