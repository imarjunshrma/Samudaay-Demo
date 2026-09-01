import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';

import { getVisibleAdminBottomBarItems } from '@/src/core/navigation/admin-shell';
import { useSession } from '@/src/core/providers/session-provider';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminDirectoryBottomBar({
  activeKey = 'clients',
  onChange,
}: {
  activeKey?: 'home' | 'clients' | 'invoices' | 'profile';
  onChange?: (key: 'home' | 'clients' | 'invoices' | 'profile') => void;
}) {
  const { session } = useSession();
  const items = getVisibleAdminBottomBarItems(session);

  return (
    <View style={{ backgroundColor: colors.background.surface, borderTopWidth: 1, borderTopColor: colors.border.light }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: spacing[3], paddingVertical: spacing[3] }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
              <TouchableOpacity key={item.key} accessibilityRole="button" activeOpacity={0.85} onPress={() => onChange?.(item.key as 'home' | 'clients' | 'invoices' | 'profile')} style={{ alignItems: 'center', gap: 4, minWidth: 60 }}>
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
