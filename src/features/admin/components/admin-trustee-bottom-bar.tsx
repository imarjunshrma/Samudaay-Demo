import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminTrusteeBottomBar({
  activeKey = 'community',
  onChange,
}: {
  activeKey?: 'home' | 'community' | 'profile';
  onChange?: (key: 'home' | 'community' | 'profile') => void;
}) {
  const t = useTranslations('admin.manage-trustees');
  const items = [
    { key: 'home', icon: 'home', label: t('nav.home') },
    { key: 'community', icon: 'groups', label: t('nav.community') },
    { key: 'profile', icon: 'person-pin', label: t('nav.profile') },
  ] as const;

  return (
    <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: colors.border.light }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <TouchableOpacity key={item.key} accessibilityRole="button" activeOpacity={0.85} onPress={() => onChange?.(item.key)} style={{ alignItems: 'center', gap: 4, minWidth: 60 }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={active ? colors.primary.DEFAULT : colors.text.muted} />
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
