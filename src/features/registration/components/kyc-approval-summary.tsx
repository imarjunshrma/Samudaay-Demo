import { View } from 'react-native';

import { Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';

export function KycApprovalSummary({
  applicationId,
  memberName,
  subtitle,
}: {
  applicationId: string;
  memberName: string;
  subtitle?: string;
}) {
  const t = useTranslations('registration.kyc-approval');
  const { language } = useAppPreferences();

  return (
    <View style={{ gap: spacing[2] }}>
      <Text
        variant="caption"
        style={{
          color: colors.text.secondary,
          textTransform: language === 'gu' ? 'none' : 'uppercase',
          letterSpacing: language === 'gu' ? 0 : 1.8,
          fontFamily: typography.fontFamily.bold,
        }}>
        {t('summary.applicationId').replace('{id}', applicationId)}
      </Text>
      <Text variant="h1" style={{ fontSize: 40, lineHeight: 44, fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
        {memberName}
      </Text>
      {subtitle ? (
        <Text variant="body" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
