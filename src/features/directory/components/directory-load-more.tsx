import { View } from 'react-native';

import { Button } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing } from '@/src/theme';

export function DirectoryLoadMore() {
  const t = useTranslations('directory.member-directory');
  return (
    <View style={{ alignItems: 'center', paddingTop: spacing[4], paddingBottom: 80 }}>
      <Button variant="soft">{t('actions.loadMore')}</Button>
    </View>
  );
}
