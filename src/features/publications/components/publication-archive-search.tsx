import { TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function PublicationArchiveSearch() {
  const t = useTranslations('publications.archive');
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.full, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.border.DEFAULT, paddingHorizontal: spacing[4] }}>
      <MaterialIcons name="search" size={20} color="#94a3b8" />
      <TextInput
        placeholder={t('search.placeholder')}
        placeholderTextColor="#94a3b8"
        style={{
          flex: 1,
          paddingVertical: spacing[4],
          fontSize: 15,
          color: colors.text.primary,
          fontFamily: typography.fontFamily.medium,
        }}
      />
    </View>
  );
}
