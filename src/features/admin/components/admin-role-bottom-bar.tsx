import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminRoleBottomBar({
  activeKey = 'community',
  onChange,
}: {
  activeKey?: 'home' | 'community' | 'profile';
  onChange?: (key: 'home' | 'community' | 'profile') => void;
}) {
  const t = useTranslations('admin.roles');
  const items = [
    { key: 'home', icon: 'home', label: t('nav.home') },
    { key: 'community', icon: 'groups', label: t('nav.community') },
    { key: 'profile', icon: 'person-pin', label: t('nav.profile') },
  ] as const;

  return (
    <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <TouchableOpacity key={item.key} accessibilityRole="button" activeOpacity={0.85} onPress={() => onChange?.(item.key)} style={{ alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={active ? colors.primary.DEFAULT : colors.text.muted} />
              <Text style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, color: active ? colors.primary.DEFAULT : colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
