import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, FilterChips, SearchInput, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminEventsTopBar({
  onCreatePress,
}: {
  onCreatePress?: () => void;
}) {
  const t = useTranslations('admin.manage-events');
  return (
    <View style={{ backgroundColor: colors.background.surface, borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingVertical: spacing[3], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <MaterialIcons name="event-available" size={28} color={colors.primary.DEFAULT} />
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          {t('title')}
        </Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={onCreatePress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
          backgroundColor: colors.primary.DEFAULT,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
          borderRadius: radius.lg,
        }}>
        <MaterialIcons name="add" size={18} color={colors.text.inverse} />
        <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
          {t('actions.create')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
