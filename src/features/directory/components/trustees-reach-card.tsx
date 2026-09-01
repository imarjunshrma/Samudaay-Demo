import { View } from 'react-native';

import { StatHighlightCard } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing } from '@/src/theme';

export function TrusteesReachCard() {
  const t = useTranslations('admin.manage-trustees');
  return (
    <View style={{ marginHorizontal: spacing[4], marginTop: spacing[8], marginBottom: spacing[8] }}>
      <StatHighlightCard
        label={t('reach.label')}
        value="12,500+"
        helper={t('reach.helper')}
        variant="accent"
      />
    </View>
  );
}
