import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Text } from '@/src/components';
import { ImageViewer } from '@/src/components/media';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { registrationService } from '@/src/features/registration/services/registration-service';
import type { KycDocument } from '@/src/features/registration/types/registration';
import { pickImageFromMediaLibrary } from '@/src/services/device/media-picker';
import { ApprovedDocumentCard, ActionDocumentCard, DocumentManagementPageSkeleton } from '../components';
import { DOCUMENT_SLOTS, getDocumentStatusMeta, getDocumentSummary, inferDocumentType } from '../utils';
import type { DocumentSlot } from '../utils';

function getDocumentUri(document?: KycDocument) {
  return document?.downloadUrl || document?.localUri;
}

function isImageDocument(document?: KycDocument) {
  const uri = getDocumentUri(document);
  const contentType = document?.contentType?.toLowerCase() || '';
  const name = document?.name || '';

  return Boolean(
    uri &&
      (
        contentType.startsWith('image/')
        || /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(uri)
        || /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(name)
      ),
  );
}

async function openDocumentUrl(document?: KycDocument) {
  const url = getDocumentUri(document);
  if (!url) {
    return;
  }

  if (Platform.OS !== 'web' && /^https?:/i.test(url)) {
    await WebBrowser.openBrowserAsync(url);
    return;
  }

  await Linking.openURL(url);
}

function renderDocumentCard(
  slot: DocumentSlot,
  document: KycDocument | undefined,
  onUpload: () => Promise<void>,
  onPreviewImage: (document: KycDocument) => void,
  t: (key: string) => string,
  hasRequiredDocumentCount: boolean,
) {
  const meta = getDocumentStatusMeta(document);
  const canView = meta.action === 'View' && Boolean(document?.downloadUrl || document?.localUri);
  const canPreview = Boolean(document?.downloadUrl || document?.localUri);
  const previewOnPress = canPreview
    ? () => {
      if (document && isImageDocument(document)) {
        onPreviewImage(document);
        return;
      }

      void openDocumentUrl(document);
    }
    : undefined;
  const onPress = canView ? previewOnPress : () => void onUpload();
  const rejectionReason = document?.rejectionReason || document?.errorMessage || null;
  const helperText =
    meta.action === 'Reupload'
      ? t('helper.reupload')
      : meta.action === 'Upload'
        ? hasRequiredDocumentCount
          ? t('helper.optional')
          : t('helper.upload')
        : t('helper.pending');
  const statusLabel = meta.action === 'Upload' ? t('badge.missing') : meta.action === 'Reupload' ? t('badge.rejected') : t('badge.pending');
  const actionLabel = meta.action === 'Upload' ? t('action.upload') : meta.action === 'Reupload' ? t('action.reupload') : t('action.view');

  if (meta.label === 'Approved') {
    return <ApprovedDocumentCard slot={slot} document={document} onPress={onPress} />;
  }

  return (
    <ActionDocumentCard
      slot={slot}
      document={document}
      label={actionLabel}
      statusLabel={statusLabel}
      statusColor={meta.dot}
      helperText={helperText}
      rejectionReason={rejectionReason}
      previewOnPress={previewOnPress}
      onPress={onPress}
    />
  );
}

export function DocumentManagementScreen() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('profile.document-management');
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDocument, setPreviewDocument] = useState<KycDocument | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const draft = await registrationService.loadDraft();
      setRegistrationId(draft.registrationId ?? null);
      setDocuments(draft.documents ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const documentsByType = useMemo(() => {
    const result = new Map<string, KycDocument>();
    for (const document of documents) {
      result.set(inferDocumentType(document), document);
    }
    return result;
  }, [documents]);

  const summary = useMemo(() => getDocumentSummary(documentsByType), [documentsByType]);

  async function pickAndUpload(slot: DocumentSlot) {
    if (!registrationId) {
      return;
    }

    const nextFile = await pickImageFromMediaLibrary({
      fileNamePrefix: slot.type.toLowerCase(),
    });
    if (!nextFile) {
      return;
    }

    await registrationService.uploadKycDocument(registrationId, slot.type, nextFile);
    await load();
  }

  if (!isLoading && !registrationId) {
    return (
      <AppSafeAreaView style={styles.container}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          titleVariant="h5"
          contentMaxWidth={448}
          onLeftPress={navigateBack}
          rightSlot={<View style={{ width: 40, height: 40 }} />}
        />
        <View style={styles.pageContent}>
          <View style={styles.emptyCard}>
            <MaterialIcons name="folder-off" size={48} color={colors.text.muted} />
            <Text style={styles.emptyTitle}>
              No Registration Found
            </Text>
            <Text style={styles.emptyDescription}>
              Document management is only available for members with an active registration.
            </Text>
          </View>
        </View>
      </AppSafeAreaView>
    );
  }

  const statusTitle = summary.needsAction ? t('status.actionRequired') : summary.pending > 0 ? t('status.pending') : t('status.approved');
  const statusText =
    summary.rejected > 0
      ? t('statusText.actionRequired')
      : summary.submitted < summary.required
        ? t('statusText.missing').replace('{required}', String(summary.required))
        : summary.pending > 0
          ? t('statusText.pending')
          : t('statusText.approved');
  const statusIconName = summary.needsAction ? 'pending-actions' : summary.pending > 0 ? 'schedule' : 'verified';
  const statusIconColor = summary.needsAction || summary.pending > 0 ? colors.status.warning : colors.status.success;
  const statusFooterBg = summary.needsAction || summary.pending > 0 ? styles.cardFooterWarning : styles.cardFooterSuccess;

  return (
    <AppSafeAreaView style={styles.container}>
      <AppHeader
        variant="back-inline"
        title={t('title')}
        titleVariant="h5"
        contentMaxWidth={448}
        onLeftPress={navigateBack}
        rightSlot={<View style={{ width: 40, height: 40 }} />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageContent}>
          {isLoading ? (
            <DocumentManagementPageSkeleton />
          ) : (
            <>
              <View style={styles.introBlock}>
                <Text variant="body" style={styles.introEyebrow}>
                  {t('status.membership')}
                </Text>
                <Text variant="body" style={styles.introDescription}>
                  {t('header.required').replace('{required}', String(summary.required))}
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name={statusIconName} size={32} color={statusIconColor} />
                  </View>

                  <View style={styles.statusTextContainer}>
                    <Text style={styles.smallLabel}>{t('status.membership')}</Text>
                    <Text style={styles.bigTitle}>{statusTitle}</Text>
                    <Text style={styles.subText}>{statusText}</Text>
                  </View>
                </View>

                <View style={[styles.cardFooter, statusFooterBg]}>
                  <Text style={[styles.footerText, { color: statusIconColor }]}>
                    {t('footer.summary')
                      .replace('{verified}', String(summary.verified))
                      .replace('{rejected}', String(summary.rejected))
                      .replace('{pending}', String(summary.pending))
                      .replace('{missing}', String(summary.missing))}
                  </Text>
                </View>
              </View>

              {DOCUMENT_SLOTS.map((slot) => (
                <View key={slot.type} style={styles.itemSpacing}>
                  {renderDocumentCard(slot, documentsByType.get(slot.type), async () => {
                    await pickAndUpload(slot);
                  }, setPreviewDocument, t, summary.submitted >= summary.required)}
                </View>
              ))}

              <Text style={styles.helpText}>{t('helpText')}</Text>
            </>
          )}
        </View>
      </ScrollView>

      <ImageViewer
        images={previewDocument ? [{ uri: getDocumentUri(previewDocument) || '' }] : []}
        imageIndex={0}
        visible={Boolean(previewDocument)}
        presentationStyle="fullScreen"
        backgroundColor="rgba(15,23,42,0.96)"
        HeaderComponent={() => (
          <View style={styles.viewerHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close document preview"
              onPress={() => setPreviewDocument(null)}
              hitSlop={10}
              style={styles.viewerCloseButton}>
              <MaterialIcons name="close" size={22} color="#ffffff" />
            </Pressable>
          </View>
        )}
        onRequestClose={() => setPreviewDocument(null)}
      />
    </AppSafeAreaView>
  );
}

export default DocumentManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scrollContent: {
    paddingBottom: spacing[6],
  },
  pageContent: {
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[5],
  },
  introBlock: {
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    gap: spacing[2],
  },
  introEyebrow: {
    color: colors.primary.DEFAULT,
    fontFamily: typography.fontFamily.bold,
  },
  introDescription: {
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.status.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.muted,
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  bigTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    marginTop: 2,
  },
  subText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
    marginTop: 4,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  cardFooterWarning: {
    backgroundColor: colors.status.warningLight,
  },
  cardFooterSuccess: {
    backgroundColor: colors.status.successLight,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: typography.fontFamily.bold,
  },
  itemSpacing: {
    marginBottom: 12,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.muted,
    fontFamily: typography.fontFamily.regular,
    marginTop: 12,
  },
  emptyCard: {
    marginTop: spacing[6],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    backgroundColor: colors.background.surface,
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  emptyTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyDescription: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  viewerHeader: {
    width: '100%',
    paddingTop: spacing[6],
    paddingHorizontal: spacing[4],
    alignItems: 'flex-end',
  },
  viewerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.56)',
  },
});
