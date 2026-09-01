import { TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function KycApprovalNote({
  value,
  onChangeText,
}: {
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  const t = useTranslations('registration.kyc-approval');
  const { language } = useAppPreferences();

  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[3] }}>
      <View style={{ maxWidth: 400 }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
          {t('note.title')}
        </Text>
        <Text variant="body" color={colors.text.muted} style={{ marginTop: spacing[2] }}>
          {t('note.description')}
        </Text>
      </View>
      <View style={{ gap: spacing[2] }}>
        <Text
          variant="caption"
          style={{
            color: colors.text.muted,
            textTransform: language === 'gu' ? 'none' : 'uppercase',
            letterSpacing: language === 'gu' ? 0 : 1.2,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('note.label')}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('note.placeholder')}
          placeholderTextColor="#9ca3af"
          multiline
          editable={Boolean(onChangeText)}
          style={{
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            padding: spacing[4],
            minHeight: 112,
            textAlignVertical: 'top',
            fontFamily: typography.fontFamily.medium,
            color: colors.text.primary,
          }}
        />
      </View>
    </View>
  );
}
