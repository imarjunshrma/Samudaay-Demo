import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, DocumentUploadCard, Text } from '@/src/components';
import type { DocumentUploadCardProps } from '@/src/components/forms/DocumentUploadCard/DocumentUploadCard';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

export type KycDocumentUploadItem = {
  key: string;
  icon: DocumentUploadCardProps['icon'];
  title: string;
  subtitle: string;
  value: FileValue | null;
  onPress?: () => Promise<void> | void;
  onDelete?: () => void;
  error?: string;
};

export interface KycDocumentUploadSectionProps {
  title: string;
  description: string;
  documents: KycDocumentUploadItem[];
  primaryActionLabel: string;
  onPrimaryAction: () => Promise<void> | void;
  primaryActionLoading?: boolean;
  primaryActionDisabled?: boolean;
  showConsent?: boolean;
  consentChecked?: boolean;
  consentLabel?: string;
  onConsentToggle?: () => void;
  consentError?: string;
  footerNote?: string;
}

export function KycDocumentUploadSection({
  title,
  description,
  documents,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionLoading = false,
  primaryActionDisabled = false,
  showConsent = false,
  consentChecked = false,
  consentLabel,
  onConsentToggle,
  consentError,
  footerNote,
}: KycDocumentUploadSectionProps) {
  const t = useTranslations('registration.kyc-documents');

  return (
    <View style={{ gap: spacing[6] }}>
      <View>
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#6b7280" style={{ marginTop: 4, fontSize: 14, lineHeight: 20 }}>
          {description}
        </Text>
      </View>

      <View style={{ gap: spacing[4] }}>
        {documents.map((document) => (
          <DocumentUploadCard
            key={document.key}
            icon={document.icon}
            title={document.title}
            subtitle={document.subtitle}
            ctaLabel={t('cta.selectFile')}
            value={document.value}
            onPress={document.onPress}
            onDelete={document.onDelete}
            error={document.error}
          />
        ))}
      </View>

      {showConsent ? (
        <View style={{ paddingTop: spacing[1] }}>
          <Pressable
            onPress={onConsentToggle}
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[2] }}>
            <View
              style={{
                marginTop: 4,
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: consentChecked ? colors.primary.DEFAULT : colors.border.DEFAULT,
                backgroundColor: consentChecked ? colors.primary.DEFAULT : colors.background.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {consentChecked ? <MaterialIcons name="check" size={14} color={colors.text.inverse} /> : null}
            </View>
          <Text variant="caption" color="#475569" style={{ flex: 1, fontSize: 12, lineHeight: 18 }}>
              {consentLabel || t('consent.default')}
            </Text>
          </Pressable>
          {consentError ? (
            <Text variant="caption" color={colors.status.error} style={{ marginBottom: spacing[3] }}>
              {consentError}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={{ gap: spacing[3] }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rounded
          disabled={primaryActionDisabled}
          loading={primaryActionLoading}
          onPress={() => void onPrimaryAction()}>
          {primaryActionLabel}
        </Button>
        {footerNote ? (
          <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'center', fontFamily: typography.fontFamily.medium }}>
            {footerNote}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
