import { View } from 'react-native';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';

export function DirectoryHeader() {
  const t = useTranslations('directory.member-directory');
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
        {t('sections.members')}
      </Text>
      <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontSize: 12, fontFamily: typography.fontFamily.medium }}>
        1,248 {t('total.suffix')}
      </Text>
    </View>
  );
}
