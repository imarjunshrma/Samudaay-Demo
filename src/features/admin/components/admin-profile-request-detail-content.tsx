import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader, AppSkeletonAvatar, AppSkeletonBlock, Button, FormScreenLayout, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { ErrorState } from '@/src/components/feedback';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { profileService } from '@/src/features/profile/services/profile-service';
import type { ProfileUpdateRequestItem } from '@/src/features/profile/types/profile';

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getRequestedProfilePic(record: ProfileUpdateRequestItem) {
  return getStringValue(record.requestedData?.profilePic) || getStringValue(record.requestedData?.profilePhoto);
}

function ProfileRequestImage({
  uri,
  size,
  rounded = 'full',
}: {
  uri: string | null;
  size: number;
  rounded?: 'full' | 'large';
}) {
  const [isLoading, setIsLoading] = useState(Boolean(uri));
  const [hasError, setHasError] = useState(false);
  const borderRadiusValue = rounded === 'full' ? 999 : radius.lg;

  useEffect(() => {
    setIsLoading(Boolean(uri));
    setHasError(false);
  }, [uri]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: borderRadiusValue,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.light,
        backgroundColor: colors.background.muted,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {uri && !hasError ? (
        <>
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
          {isLoading ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}>
              <ActivityIndicator color={colors.primary.DEFAULT} size="small" />
            </View>
          ) : null}
        </>
      ) : (
        <MaterialIcons name="person" size={Math.max(22, Math.floor(size * 0.38))} color={colors.primary.DEFAULT} />
      )}
    </View>
  );
}

function formatFieldValue(key: string, value: unknown, t: ReturnType<typeof useTranslations>): string {
  if (key === 'profilePic' || key === 'profilePhoto') return t('values.photoUpdated');
  if (value === null || value === undefined || value === '') return t('values.empty');
  if (typeof value === 'string') {
    if (key === 'dob') {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    }
    return value;
  }
  return String(value);
}

function formatDate(value: string | Date | null | undefined, t: ReturnType<typeof useTranslations>) {
  if (!value) return t('relative.recently');
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return t('relative.recently');
  const diffMs = Date.now() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return t('relative.justNow');
  if (diffHours < 24) return t('relative.hoursAgo').replace('{count}', String(diffHours));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function RequesterCard({ record }: { record: ProfileUpdateRequestItem }) {
  const t = useTranslations('admin.profile-requests');
  const requestedProfilePic = getRequestedProfilePic(record);
  const currentProfilePic = record.requester.currentProfilePic || (requestedProfilePic ? null : record.requester.profilePic) || null;
  const avatarUri = requestedProfilePic || currentProfilePic;

  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[5],
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}>
      <Text
        variant="caption"
        style={{
          color: colors.text.secondary,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontFamily: typography.fontFamily.bold,
          marginBottom: spacing[4],
        }}>
        {t('requester.title')}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
        <View
          style={{
            width: 56,
            height: 56,
          }}>
          <ProfileRequestImage uri={avatarUri} size={56} />
        </View>
        <View style={{ flex: 1 }}>
          {record.requester.memberId ? (
            <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, marginTop: 2, fontFamily: typography.fontFamily.semibold }}>
              {t('requester.memberId').replace('{id}', record.requester.memberId)}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ marginTop: spacing[4], gap: spacing[3] }}>
        {requestedProfilePic ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View
              style={{
                width: 72,
                height: 72,
              }}>
              <ProfileRequestImage uri={requestedProfilePic} size={72} rounded="large" />
            </View>
            {currentProfilePic ? (
              <View
                style={{
                  width: 72,
                  height: 72,
                  opacity: 0.7,
                }}>
                <ProfileRequestImage uri={currentProfilePic} size={72} rounded="large" />
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 13 }}>
                {t('requester.requestedPhoto')}
              </Text>
              <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                {t('requester.requestedPhotoHint')}
              </Text>
            </View>
          </View>
        ) : null}
        {record.requester.phone ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="phone" size={14} color={colors.text.muted} />
            <Text style={{ color: colors.text.muted, fontSize: 13 }}>{record.requester.phone}</Text>
          </View>
        ) : null}
        {record.requester.email ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="email" size={14} color={colors.text.muted} />
            <Text style={{ color: colors.text.muted, fontSize: 13 }}>{record.requester.email}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function RequestedChangesCard({ requestedData }: { requestedData: Record<string, unknown> }) {
  const t = useTranslations('admin.profile-requests');
  const fields = useMemo(() => {
    return Object.entries(requestedData)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({
        label: t(`fields.${key}`),
        value: formatFieldValue(key, value, t),
      }));
  }, [requestedData, t]);

  if (!fields.length) {
    return (
      <View
        style={{
          borderRadius: radius.xl,
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          padding: spacing[5],
        }}>
        <Text style={{ color: colors.text.muted }}>{t('changes.none')}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[5],
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
        <MaterialIcons name="edit-note" size={18} color={colors.primary.DEFAULT} />
        <Text
          variant="caption"
          style={{
            color: colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('changes.title')}
        </Text>
      </View>
      <View style={{ gap: spacing[4] }}>
        {fields.map(({ label, value }) => (
          <View
            key={label}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.border.light,
              paddingBottom: spacing[2],
              gap: 2,
            }}>
            <Text
              variant="caption"
              style={{
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: 1.6,
                fontFamily: typography.fontFamily.bold,
                fontSize: 10,
              }}>
              {label}
            </Text>
            <Text
              variant="body"
              style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ChangeValueCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'current' | 'requested';
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: radius.lg,
        padding: spacing[3],
        borderWidth: 1,
        borderColor: tone === 'requested' ? colors.primary.borderLight : colors.border.light,
        backgroundColor: tone === 'requested' ? colors.primary.muted : colors.background.muted,
        gap: spacing[2],
      }}>
      <Text
        variant="caption"
        style={{
          color: tone === 'requested' ? colors.primary.DEFAULT : colors.text.muted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontFamily: typography.fontFamily.bold,
          fontSize: 10,
        }}>
        {title}
      </Text>
      <Text
        variant="body"
        style={{
          color: colors.text.primary,
          fontFamily: typography.fontFamily.medium,
          lineHeight: 22,
        }}>
        {value}
      </Text>
    </View>
  );
}

function PhotoDiffRow({
  label,
  currentUri,
  requestedUri,
}: {
  label: string;
  currentUri: string | null;
  requestedUri: string | null;
}) {
  const t = useTranslations('admin.profile-requests');

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        paddingBottom: spacing[3],
        gap: spacing[3],
      }}>
      <Text
        variant="caption"
        style={{
          color: colors.text.muted,
          textTransform: 'uppercase',
          letterSpacing: 1.6,
          fontFamily: typography.fontFamily.bold,
          fontSize: 10,
        }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[2] }}>
          <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.bold }}>
            {t('changes.currentValue')}
          </Text>
          <View
            style={{
              height: 120,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              overflow: 'hidden',
              backgroundColor: colors.background.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {currentUri ? (
              <ProfileRequestImage uri={currentUri} size={120} rounded="large" />
            ) : (
              <Text style={{ color: colors.text.muted }}>{t('values.empty')}</Text>
            )}
          </View>
        </View>
        <View style={{ flex: 1, gap: spacing[2] }}>
          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
            {t('changes.requestedValue')}
          </Text>
          <View
            style={{
              height: 120,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              overflow: 'hidden',
              backgroundColor: colors.background.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {requestedUri ? (
              <ProfileRequestImage uri={requestedUri} size={120} rounded="large" />
            ) : (
              <Text style={{ color: colors.text.muted }}>{t('values.empty')}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

function RequestedChangesDiffCard({
  requestedData,
  currentData,
}: {
  requestedData: Record<string, unknown>;
  currentData?: Record<string, unknown>;
}) {
  const t = useTranslations('admin.profile-requests');
  const fields = useMemo(() => {
    return Object.entries(requestedData)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({
        key,
        label: t(`fields.${key}`),
        currentValue: currentData?.[key],
        requestedValue: value,
      }));
  }, [currentData, requestedData, t]);

  if (!fields.length) {
    return <RequestedChangesCard requestedData={requestedData} />;
  }

  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[5],
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
        <MaterialIcons name="edit-note" size={18} color={colors.primary.DEFAULT} />
        <Text
          variant="caption"
          style={{
            color: colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('changes.title')}
        </Text>
      </View>
      <Text variant="body" style={{ color: colors.text.muted, marginBottom: spacing[4], lineHeight: 22 }}>
        {t('changes.subtitle')}
      </Text>
      <View style={{ gap: spacing[4] }}>
        {fields.map(({ key, label, currentValue, requestedValue }) =>
          key === 'profilePic' || key === 'profilePhoto' ? (
            <PhotoDiffRow
              key={key}
              label={label}
              currentUri={typeof currentValue === 'string' ? currentValue : null}
              requestedUri={typeof requestedValue === 'string' ? requestedValue : null}
            />
          ) : (
            <View
              key={key}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
                paddingBottom: spacing[3],
                gap: spacing[3],
              }}>
              <Text
                variant="caption"
                style={{
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 1.6,
                  fontFamily: typography.fontFamily.bold,
                  fontSize: 10,
                }}>
                {label}
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <ChangeValueCard title={t('changes.currentValue')} value={formatFieldValue(key, currentValue, t)} tone="current" />
                <ChangeValueCard title={t('changes.requestedValue')} value={formatFieldValue(key, requestedValue, t)} tone="requested" />
              </View>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

function StatusCard({ record }: { record: ProfileUpdateRequestItem }) {
  const t = useTranslations('admin.profile-requests');
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[5],
        gap: spacing[4],
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text
          variant="caption"
          style={{
            color: colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: 1.4,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('status.title')}
        </Text>
        <View
          style={{
            backgroundColor: colors.primary.muted,
            borderRadius: 999,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
          }}>
          <Text
            variant="caption"
            style={{
              color: colors.primary.DEFAULT,
              fontFamily: typography.fontFamily.bold,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
            {record.status === 'PENDING' ? t('status.pending') : record.status}
          </Text>
        </View>
      </View>
      <Text variant="body" style={{ color: colors.text.muted, lineHeight: 22 }}>
        {t('status.submittedBy').replace('{time}', formatDate(record.createdAt, t))}
      </Text>
    </View>
  );
}

function RejectionNoteCard({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  const t = useTranslations('admin.profile-requests');
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[5],
        gap: spacing[3],
      }}>
      <View style={{ maxWidth: 400 }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
          {t('rejection.title')}
        </Text>
        <Text variant="body" style={{ color: colors.text.muted, marginTop: spacing[2] }}>
          {t('rejection.description')}
        </Text>
      </View>
      <Text
        variant="caption"
        style={{
          color: colors.text.muted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontFamily: typography.fontFamily.bold,
        }}>
        {t('rejection.remarks')}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('rejection.placeholder')}
        placeholderTextColor="#9ca3af"
        multiline
        style={{
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          borderRadius: 12,
          padding: spacing[4],
          minHeight: 112,
          textAlignVertical: 'top',
          fontFamily: typography.fontFamily.medium,
          color: colors.text.primary,
        }}
      />
    </View>
  );
}

function ProfileRequestDetailSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: spacing[4], paddingBottom: 32 }}>
      <View style={{ gap: spacing[6] }}>
        <View style={{ gap: spacing[2] }}>
          <AppSkeletonBlock width="28%" height={12} radiusSize={radius.full} />
          <AppSkeletonBlock width="58%" height={40} radiusSize={radius.md} />
          <AppSkeletonBlock width="36%" height={18} radiusSize={radius.sm} />
        </View>

        <View
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[5],
            gap: spacing[4],
          }}>
          <AppSkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <AppSkeletonAvatar size={56} />
            <AppSkeletonBlock width="34%" height={12} radiusSize={radius.sm} />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
            <AppSkeletonBlock width={72} height={72} radiusSize={radius.lg} />
            <AppSkeletonBlock width={72} height={72} radiusSize={radius.lg} />
            <View style={{ flex: 1, gap: spacing[2] }}>
              <AppSkeletonBlock width="52%" height={14} radiusSize={radius.sm} />
              <AppSkeletonBlock width="88%" height={12} radiusSize={radius.sm} />
            </View>
          </View>
          <AppSkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
          <AppSkeletonBlock width="48%" height={12} radiusSize={radius.sm} />
        </View>

        <View
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[5],
            gap: spacing[4],
          }}>
          <AppSkeletonBlock width="30%" height={14} radiusSize={radius.sm} />
          {Array.from({ length: 4 }, (_, index) => (
            <View key={index} style={{ gap: spacing[2], paddingBottom: spacing[2] }}>
              <AppSkeletonBlock width={index % 2 === 0 ? '26%' : '34%'} height={10} radiusSize={radius.sm} />
              <AppSkeletonBlock width={index === 3 ? '62%' : '100%'} height={18} radiusSize={radius.sm} />
            </View>
          ))}
        </View>

        <View
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[5],
            gap: spacing[4],
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <AppSkeletonBlock width="20%" height={12} radiusSize={radius.sm} />
            <AppSkeletonBlock width={84} height={24} radiusSize={radius.full} />
          </View>
          <AppSkeletonBlock width="46%" height={14} radiusSize={radius.sm} />
        </View>

        <View
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[5],
            gap: spacing[3],
          }}>
          <AppSkeletonBlock width="36%" height={24} radiusSize={radius.md} />
          <AppSkeletonBlock width="72%" height={14} radiusSize={radius.sm} />
          <AppSkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
          <AppSkeletonBlock width="100%" height={112} radiusSize={12} />
        </View>

        <View style={{ gap: spacing[3] }}>
          <AppSkeletonBlock width="100%" height={48} radiusSize={radius.full} />
          <AppSkeletonBlock width="100%" height={48} radiusSize={radius.full} />
        </View>
      </View>
    </ScrollView>
  );
}

export function AdminProfileRequestDetailContent() {
  const windowDimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.profile-requests');
  const params = useLocalSearchParams<{ requestId?: string }>();
  const requestId = typeof params.requestId === 'string' ? params.requestId : undefined;

  const [record, setRecord] = useState<ProfileUpdateRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actioningType, setActioningType] = useState<'approve' | 'reject' | null>(null);

  const loadRecord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!requestId) {
        throw new Error(t('errors.requestIdMissing'));
      }
      const found = await profileService.loadActionableProfileUpdateRequestById(requestId, 'PENDING');
      if (!found) {
        throw new Error(t('errors.requestUnavailable'));
      }
      setRecord(found);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.loadRequestFallback'));
    } finally {
      setIsLoading(false);
    }
  }, [requestId, t]);

  useEffect(() => {
    void loadRecord();
  }, [loadRecord]);

  const handleApprove = useCallback(async () => {
    if (!record) return;
    setActioningType('approve');
    try {
      await profileService.reviewProfileUpdateRequest(record.id, 'approve', null);
      navigateBack();
    } finally {
      setActioningType(null);
    }
  }, [navigateBack, record]);

  const handleReject = useCallback(async () => {
    if (!record) return;
    setActioningType('reject');
    try {
      await profileService.reviewProfileUpdateRequest(record.id, 'reject', remarks.trim() || null);
      navigateBack();
    } finally {
      setActioningType(null);
    }
  }, [navigateBack, record, remarks]);

  const isActioning = Boolean(actioningType);
  const screenHeight = Dimensions.get('screen').height;
  const reservedBottomInset = Platform.OS === 'android' ? Math.max(0, screenHeight - windowDimensions.height - insets.top) : insets.bottom;
  const contentSafeAreaBottom = Platform.OS === 'android' ? Math.max(0, insets.bottom - reservedBottomInset) : 0;

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={t('header.reviewRequest')}
          variant="back-inline"
          onLeftPress={navigateBack}
        />
      }>
      <View style={{ flex: 1, backgroundColor: '#f8f7f5' }}>
        {error ? (
          <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
            <ErrorState
              title={t('errors.loadRequestTitle')}
              description={error}
              onRetry={() => {
                void loadRecord();
              }}
            />
          </View>
        ) : isLoading || !record ? (
          <ProfileRequestDetailSkeleton />
        ) : (
          <View style={{ padding: spacing[4], paddingBottom: spacing[6] + contentSafeAreaBottom, gap: spacing[6] }}>
            <View style={{ gap: spacing[2] }}>
              <Text
                variant="caption"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 1.8,
                  fontFamily: typography.fontFamily.bold,
                }}>
                {t('header.requestNumber').replace('{id}', record.id.slice(0, 5).toUpperCase())}
              </Text>
              <Text
                variant="h1"
                style={{
                  fontSize: 36,
                  lineHeight: 40,
                  fontFamily: typography.fontFamily.bold,
                  color: colors.text.primary,
                }}>
                {record.requester.name}
              </Text>
              {record.requester.memberId ? (
                <Text variant="body" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
                  {t('requester.memberId').replace('{id}', record.requester.memberId)}
                </Text>
              ) : null}
            </View>

            <RequesterCard record={record} />

            <RequestedChangesDiffCard requestedData={record.requestedData} currentData={record.currentData} />

            <StatusCard record={record} />

            <RejectionNoteCard value={remarks} onChangeText={setRemarks} />

            <View style={{ gap: spacing[3] }}>
              <Button
                variant="outline"
                fullWidth
                loading={actioningType === 'reject'}
                disabled={isActioning}
                leftIcon={<MaterialIcons name="close" size={16} color={colors.primary.DEFAULT} />}
                onPress={() => {
                  void handleReject();
                }}>
                {t('actions.rejectWithReason')}
              </Button>
              <Button
                variant="primary"
                fullWidth
                loading={actioningType === 'approve'}
                disabled={isActioning}
                leftIcon={<MaterialIcons name="verified" size={16} color="#ffffff" />}
                onPress={() => {
                  void handleApprove();
                }}>
                {t('actions.approveChanges')}
              </Button>
            </View>
          </View>
        )}
      </View>
    </FormScreenLayout>
  );
}
