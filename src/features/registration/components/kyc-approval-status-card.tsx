import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

function formatRelativeTime(value: string | null | undefined, language: 'en' | 'gu', t: (key: string) => string) {
  if (!value) {
    return t('meta.recently');
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return t('meta.recently');
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    return t('meta.justNow');
  }
  if (diffHours < 24) {
    return t('meta.hoursAgo').replace('{count}', String(diffHours));
  }

  return parsed.toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function KycApprovalStatusCard({
  statusLabel,
  submittedAt,
  highlightPoints,
}: {
  statusLabel: string;
  submittedAt?: string | null;
  highlightPoints: readonly string[];
}) {
  const t = useTranslations('registration.kyc-approval');
  const { language } = useAppPreferences();

  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[4], shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text
          variant="caption"
          style={{
            color: colors.text.muted,
            textTransform: language === 'gu' ? 'none' : 'uppercase',
            letterSpacing: language === 'gu' ? 0 : 1.4,
            fontFamily: typography.fontFamily.bold,
          }}>
          {t('sections.status')}
        </Text>
        <View style={{ backgroundColor: colors.primary.muted, borderRadius: 999, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <Text
            variant="caption"
            style={{
              color: colors.primary.DEFAULT,
              fontFamily: typography.fontFamily.bold,
              textTransform: language === 'gu' ? 'none' : 'uppercase',
              letterSpacing: language === 'gu' ? 0 : 1,
            }}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <Text variant="body" style={{ color: colors.text.muted, lineHeight: 22 }}>
        {t('meta.submittedBy').replace('{time}', formatRelativeTime(submittedAt, language, t))}
      </Text>
      <View style={{ height: 1, backgroundColor: colors.border.light }} />
      <View style={{ gap: spacing[3] }}>
        {highlightPoints.map((point) => (
          <View key={point} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary.DEFAULT} />
            <Text variant="body" style={{ fontFamily: typography.fontFamily.medium, color: colors.text.primary }}>
              {point}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
