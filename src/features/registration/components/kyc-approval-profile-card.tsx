import { View } from 'react-native';

import { Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function KycApprovalProfileCard({
  fields,
}: {
  fields: readonly { label: string; value: string }[];
}) {
  const t = useTranslations('registration.kyc-approval');
  const { language } = useAppPreferences();

  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
        <Text
          variant="caption"
          style={{
            color: colors.text.secondary,
            textTransform: language === 'gu' ? 'none' : 'uppercase',
            letterSpacing: language === 'gu' ? 0 : 1.2,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('sections.profileInformation')}
        </Text>
      </View>
      <View style={{ gap: spacing[4] }}>
        {fields.map(({ label, value }) => (
          <View key={label} style={{ borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: spacing[2], gap: 2 }}>
            <Text
              variant="caption"
              style={{
                color: colors.text.muted,
                textTransform: language === 'gu' ? 'none' : 'uppercase',
                letterSpacing: language === 'gu' ? 0 : 1.6,
                fontFamily: typography.fontFamily.bold,
                fontSize: 10,
              }}>
              {label}
            </Text>
            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
