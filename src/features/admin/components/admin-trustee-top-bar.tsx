import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminTrusteeTopBar({
  onBackPress,
  onSearchPress,
}: {
  onBackPress?: () => void;
  onSearchPress?: () => void;
}) {
  const t = useTranslations('admin.manage-trustees');
  return (
    <View style={{ backgroundColor: colors.background.DEFAULT, borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4] }}>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onBackPress} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
          {t('title')}
        </Text>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onSearchPress} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="search" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
