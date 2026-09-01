import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, FilterChips, SearchInput, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminEventFilterBar({
  activeKey,
  onChange,
}: {
  activeKey: string;
  onChange: (key: string) => void;
}) {
  const t = useTranslations('admin.manage-events');
  return (
      <FilterChips
      items={[
        { key: 'all', label: t('filters.all') },
        { key: 'upcoming', label: t('filters.upcoming') },
        { key: 'past', label: t('filters.past') },
        { key: 'drafts', label: t('filters.drafts') },
      ]}
      activeKey={activeKey}
      onPress={onChange}
      scrollable
    />
  );
}
