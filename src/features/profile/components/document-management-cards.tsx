import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { KycDocument } from '@/src/features/registration/types/registration';
import type { DocumentSlot } from '../utils';

function DocumentAction({
  label,
  onPress,
  variant = 'compact',
}: {
  label: string;
  onPress?: () => void;
  variant?: 'compact' | 'emphasis';
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.85}
      style={variant === 'emphasis' ? styles.emphasisActionBtn : styles.actionBtn}
    >
      <Text style={variant === 'emphasis' ? styles.emphasisActionText : styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function getStatusTone(statusColor: string) {
  if (statusColor === colors.status.success) {
    return {
      backgroundColor: colors.status.successLight,
      textColor: colors.status.success,
    };
  }

  if (statusColor === colors.status.error) {
    return {
      backgroundColor: colors.status.errorLight,
      textColor: colors.status.error,
    };
  }

  return {
    backgroundColor: colors.status.warningLight,
    textColor: statusColor,
  };
}

type ApprovedDocumentCardProps = {
  slot: DocumentSlot;
  document?: KycDocument;
  onPress?: () => void;
};

type ActionDocumentCardProps = {
  slot: DocumentSlot;
  document?: KycDocument;
  label: string;
  statusLabel: string;
  statusColor: string;
  helperText: string;
  rejectionReason?: string | null;
  previewOnPress?: () => void;
  onPress?: () => void;
};

function getDocumentUri(document?: KycDocument) {
  return document?.downloadUrl || document?.localUri;
}

function isImageDocument(document?: KycDocument) {
  const uri = getDocumentUri(document);
  const contentType = document?.contentType?.toLowerCase() || '';
  return Boolean(
    uri &&
      (contentType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(uri)),
  );
}

function DocumentPreview({
  document,
  onPress,
  emptyTitle,
  emptyDescription,
}: {
  document?: KycDocument;
  onPress?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const uri = getDocumentUri(document);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={[styles.preview, !uri ? styles.previewDisabled : undefined]}
    >
      {document && uri && isImageDocument(document) ? (
        <Image source={{ uri }} resizeMode="cover" style={styles.previewImage} />
      ) : document && uri ? (
        <View style={styles.filePreview}>
          <MaterialIcons name="insert-drive-file" size={30} color={colors.text.muted} />
          <Text style={styles.fileName} numberOfLines={1}>
            {document.name}
          </Text>
        </View>
      ) : (
        <View style={styles.emptyPreview}>
          <MaterialIcons name="insert-drive-file" size={32} color={colors.text.muted} />
          <Text style={styles.emptyPreviewTitle}>
            {emptyTitle ?? 'No valid document uploaded'}
          </Text>
          <Text style={styles.emptyPreviewDescription}>
            {emptyDescription ?? 'Upload a clear, viewable file for this document requirement.'}
          </Text>
        </View>
      )}

      {uri ? (
        <View style={styles.previewAction}>
          <MaterialIcons name="open-in-full" size={16} color={colors.text.inverse} />
        </View>
      ) : null}
    </Pressable>
  );
}

function DocumentHeader({
  icon,
  title,
  statusLabel,
  statusColor,
  onPreview,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  statusLabel: string;
  statusColor: string;
  onPreview?: () => void;
}) {
  const statusTone = getStatusTone(statusColor);

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerContent}>
        <View style={styles.headerIconBox}>
          <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
        </View>
        <Text variant="body" style={styles.headerTitle}>
          {title}
        </Text>
      </View>

      <View style={styles.headerActions}>
        <View style={[styles.statusPill, { backgroundColor: statusTone.backgroundColor }]}>
          <Text variant="caption" style={[styles.statusPillText, { color: statusTone.textColor }]}>
            {statusLabel}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Enlarge ${title}`}
          disabled={!onPreview}
          onPress={onPreview}
          hitSlop={10}
          style={{ padding: 2, opacity: onPreview ? 1 : 0.45 }}>
          <MaterialIcons name="open-in-full" size={18} color={colors.primary.DEFAULT} />
        </Pressable>
      </View>
    </View>
  );
}

export function ApprovedDocumentCard({ slot, document, onPress }: ApprovedDocumentCardProps) {
  const t = useTranslations('profile.document-management');

  return (
    <View style={styles.card}>
      <DocumentHeader
        icon={slot.icon}
        title={slot.title}
        statusLabel={t('badge.approved')}
        statusColor={colors.status.success}
        onPreview={onPress}
      />
      <DocumentPreview document={document} onPress={onPress} />
      <DocumentAction label={t('action.view')} onPress={onPress} />
    </View>
  );
}

export function ActionDocumentCard({
  slot,
  document,
  label,
  statusLabel,
  statusColor,
  helperText,
  rejectionReason,
  previewOnPress,
  onPress,
}: ActionDocumentCardProps) {
  const statusTone = getStatusTone(statusColor);

  return (
    <View style={styles.card}>
      <DocumentHeader
        icon={slot.icon}
        title={slot.title}
        statusLabel={statusLabel}
        statusColor={statusColor}
        onPreview={previewOnPress}
      />

      <View style={styles.detailBlock}>
        <Text style={styles.helper}>{helperText}</Text>

        {rejectionReason ? (
          <View style={styles.reasonBox}>
            <MaterialIcons name="error-outline" size={16} color={colors.status.error} />
            <Text style={styles.reasonText}>{rejectionReason}</Text>
          </View>
        ) : (
          <View style={[styles.helperBadge, { backgroundColor: statusTone.backgroundColor }]}>
            <Text style={[styles.helperBadgeText, { color: statusTone.textColor }]}>
              {statusLabel}
            </Text>
          </View>
        )}
      </View>

      <DocumentPreview
        document={document}
        onPress={previewOnPress}
        emptyDescription={helperText}
      />

      <DocumentAction label={label} onPress={onPress} variant="emphasis" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    backgroundColor: colors.background.surface,
    gap: spacing[3],
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
    minWidth: 0,
  },

  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.muted,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
  },

  headerTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    flex: 1,
    minWidth: 0,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  statusPill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  statusPillText: {
    fontFamily: typography.fontFamily.bold,
  },

  detailBlock: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },

  helper: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },

  reasonBox: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors.status.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  reasonText: {
    flex: 1,
    color: colors.status.error,
    fontFamily: typography.fontFamily.semibold,
    fontSize: 12,
    lineHeight: 17,
  },

  preview: {
    aspectRatio: 1.6,
    backgroundColor: colors.background.surfaceAlt,
  },

  previewDisabled: {
    opacity: 0.95,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  filePreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },

  emptyPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },

  emptyPreviewTitle: {
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
  },

  emptyPreviewDescription: {
    textAlign: 'center',
    color: colors.text.muted,
    lineHeight: 18,
    fontSize: 12,
  },

  fileName: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.semibold,
    fontSize: 12,
    lineHeight: 16,
  },

  previewAction: {
    position: 'absolute',
    right: spacing[3],
    top: spacing[3],
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBtn: {
    margin: spacing[4],
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.primary.muted,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: colors.primary.DEFAULT,
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
  },

  emphasisActionBtn: {
    margin: spacing[4],
    marginTop: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.primary.DEFAULT,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.DEFAULT,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  emphasisActionText: {
    color: colors.text.inverse,
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  helperBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
  },
  helperBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
  },
});
