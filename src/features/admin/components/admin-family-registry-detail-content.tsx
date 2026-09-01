import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { AppHeader, AppSafeAreaView, AppSkeletonBlock, Card, Text } from '@/src/components';
import { ImageViewer } from '@/src/components/media';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { adminUserService, type AdminFamilyRegistryRecord } from '../services/admin-user-service';

function DetailLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: colors.text.muted, fontSize: 11, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: typography.fontFamily.medium }}>
        {value || '-'}
      </Text>
    </View>
  );
}

function formatBytes(value: number | null) {
  if (!value) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(url?: string | null, fileName?: string | null) {
  const normalizedUrl = String(url || '').toLowerCase();
  const normalizedFileName = String(fileName || '').toLowerCase();

  return /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)(?:[?#].*)?$/i.test(normalizedUrl)
    || /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(normalizedFileName);
}

async function openMarksheetUrl(url?: string | null) {
  if (!url) {
    return;
  }

  if (Platform.OS !== 'web' && /^https?:/i.test(url)) {
    await WebBrowser.openBrowserAsync(url);
    return;
  }

  await Linking.openURL(url);
}

function formatDisplayDate(value?: string | null, language: 'en' | 'gu' = 'en') {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatFamilyRelation(value?: string | null) {
  const normalized = String(value || '').trim().toUpperCase();
  switch (normalized) {
    case 'FATHER':
      return 'Father';
    case 'MOTHER':
      return 'Mother';
    case 'SPOUSE':
      return 'Spouse';
    case 'CHILD':
      return 'Child';
    case 'SON':
      return 'Son';
    case 'DAUGHTER':
      return 'Daughter';
    case 'DAUGHTER_IN_LAW':
      return 'Daughter InLaw';
    case 'GRAND_SON':
      return 'Grand Son';
    case 'GRAND_DAUGHTER':
      return 'Grand Daughter';
    case 'OTHER':
      return 'Other';
    default:
      return value || '-';
  }
}

export function AdminFamilyRegistryDetailContent() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const navigateBack = useBackNavigation();
  const { language } = useAppPreferences();
  const t = useTranslations('admin.family-registry');
  const [record, setRecord] = useState<AdminFamilyRegistryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMarksheetUrl, setPreviewMarksheetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError(t('errors.invalidRecord'));
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    adminUserService.loadFamilyRegistryRecord(userId)
      .then((result) => {
        if (active) {
          setRecord(result);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [t, userId]);

  const marksheetCount = useMemo(
    () => (record?.familyMembers ?? []).reduce((sum, member) => sum + (member.marksheetRecords?.length ?? 0), 0),
    [record],
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('detail.title')}
          subtitle={record?.name || t('detail.subtitle')}
          variant="back"
          onLeftPress={navigateBack}
          rightSlot={<View style={{ width: 40, height: 40 }} />}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[8], gap: spacing[4] }}>
          {loading ? (
            <View style={{ gap: spacing[3] }}>
              <AppSkeletonBlock height={140} />
              <AppSkeletonBlock height={220} />
              <AppSkeletonBlock height={260} />
            </View>
          ) : error ? (
            <Card variant="default" padding="lg">
              <Text variant="body" color={colors.status.error}>
                {error}
              </Text>
            </Card>
          ) : record ? (
            <>
              <Card variant="elevated" padding="lg">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: radius.full,
                      backgroundColor: colors.primary.subtle,
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                    {record.profilePic ? (
                      <Image source={{ uri: record.profilePic }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <MaterialIcons name="person" size={28} color={colors.primary.DEFAULT} />
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
                      {record.name}
                    </Text>
                    <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
                      {record.email || record.phone || t('labels.noContact')}
                    </Text>
                    <Text style={{ color: colors.primary.DEFAULT, fontSize: 13, fontFamily: typography.fontFamily.semibold }}>
                      {t('labels.memberId').replace('{value}', record.memberId || '-')}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: spacing[3], marginTop: spacing[4] }}>
                  <View style={{ flex: 1, borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4] }}>
                    <Text variant="caption" color={colors.text.muted}>{t('summary.members')}</Text>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
                      {record.familyCount}
                    </Text>
                  </View>
                  <View style={{ flex: 1, borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4] }}>
                    <Text variant="caption" color={colors.text.muted}>{t('detail.marksheets')}</Text>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
                      {marksheetCount}
                    </Text>
                  </View>
                </View>
              </Card>

              <Card variant="default" padding="lg">
                <View style={{ gap: spacing[3] }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                    {t('details.ownerInfo')}
                  </Text>
                  <DetailLine label={t('details.memberId')} value={record.memberId || null} />
                  <DetailLine label={t('details.phone')} value={record.phone || null} />
                  <DetailLine label={t('details.email')} value={record.email || null} />
                  <DetailLine label={t('details.location')} value={translateLocationText([record.city, record.state, record.pincode].filter(Boolean).join(', '), language) || null} />
                  <DetailLine label={t('details.status')} value={record.status || null} />
                </View>
              </Card>

              <View style={{ gap: spacing[3] }}>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                  {t('details.familyMembers')}
                </Text>
                {record.familyMembers.map((member) => (
                  <Card key={member.id} variant="default" padding="lg">
                    <View style={{ gap: spacing[3] }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                            {member.name}
                          </Text>
                          <Text style={{ color: colors.primary.DEFAULT, fontSize: 13, fontFamily: typography.fontFamily.semibold }}>
                            {formatFamilyRelation(member.relation)}
                          </Text>
                        </View>
                        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.subtle, paddingHorizontal: spacing[3], paddingVertical: 6 }}>
                          <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.bold }}>
                            {t('detail.marksheetCount').replace('{count}', String(member.marksheetRecords?.length ?? 0))}
                          </Text>
                        </View>
                      </View>

                      <DetailLine label={t('details.dob')} value={formatDisplayDate(member.dob, language)} />
                      <DetailLine label={t('details.bloodGroup')} value={member.bloodGroup || null} />
                      <DetailLine label={t('details.aadhaar')} value={member.aadhaarNumber || null} />
                      <DetailLine label={t('details.gender')} value={member.gender || null} />
                      <DetailLine label={t('details.phone')} value={member.phone || null} />
                      <DetailLine label={t('details.email')} value={member.email || null} />
                      <DetailLine label={t('details.education')} value={member.education || null} />
                      <DetailLine label={t('details.schoolName')} value={member.schoolName || null} />
                      <DetailLine label={t('details.currentClass')} value={member.currentClass || null} />
                      <DetailLine label={t('details.occupation')} value={member.occupation || null} />

                      {member.marksheetRecords?.length ? (
                        <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
                          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 15 }}>
                            {t('detail.childMarksheets')}
                          </Text>
                          {member.marksheetRecords.map((marksheet) => (
                            <View
                              key={marksheet.id}
                              style={{
                                borderRadius: radius.xl,
                                backgroundColor: colors.background.surface,
                                borderWidth: 1,
                                borderColor: colors.primary.borderLight,
                                padding: spacing[3],
                                gap: spacing[2],
                              }}>
                              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                                {marksheet.fileName || `${member.name}-${marksheet.academicYear}.pdf`}
                              </Text>
                              <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
                                {`${marksheet.academicYear} • ${marksheet.standardSemester} • ${marksheet.department}`}
                              </Text>
                              <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                                {formatBytes(marksheet.fileSizeBytes) || t('detail.fileAvailable')}
                              </Text>
                              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing[1] }}>
                                <TouchableOpacity
                                  accessibilityRole="button"
                                  activeOpacity={0.86}
                                  onPress={() => {
                                    if (marksheet.fileUrl) {
                                      if (isImageFile(marksheet.fileUrl, marksheet.fileName)) {
                                        setPreviewMarksheetUrl(marksheet.fileUrl);
                                        return;
                                      }

                                      void openMarksheetUrl(marksheet.fileUrl);
                                    }
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: spacing[2],
                                    borderRadius: radius.full,
                                    backgroundColor: colors.primary.subtle,
                                    paddingHorizontal: spacing[3],
                                    paddingVertical: spacing[2],
                                  }}>
                                  <MaterialIcons name="visibility" size={16} color={colors.primary.DEFAULT} />
                                  <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.bold }}>
                                    {t('actions.viewMarksheet')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </Card>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>

        <ImageViewer
          images={previewMarksheetUrl ? [{ uri: previewMarksheetUrl }] : []}
          imageIndex={0}
          visible={Boolean(previewMarksheetUrl)}
          presentationStyle="fullScreen"
          backgroundColor="rgba(15,23,42,0.96)"
          HeaderComponent={() => (
            <View style={{ paddingTop: spacing[6], paddingHorizontal: spacing[4], alignItems: 'flex-end' }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close marksheet preview"
                onPress={() => setPreviewMarksheetUrl(null)}
                hitSlop={10}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(15,23,42,0.32)',
                }}>
                <MaterialIcons name="close" size={22} color="#ffffff" />
              </Pressable>
            </View>
          )}
          onRequestClose={() => setPreviewMarksheetUrl(null)}
        />
      </View>
    </AppSafeAreaView>
  );
}
