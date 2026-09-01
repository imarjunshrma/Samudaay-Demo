import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, FilterChips, SearchInput, Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminEventsBottomBar({
  onChange,
  onCreatePress,
  activeKey = 'events',
}: {
  onChange?: (key: 'admin' | 'events' | 'users' | 'settings') => void;
  onCreatePress?: () => void;
  activeKey?: 'admin' | 'events' | 'users' | 'settings';
}) {
  const items = [
    { key: 'admin', icon: 'dashboard', label: 'Admin' },
    { key: 'events', icon: 'event', label: 'Events' },
    { key: 'users', icon: 'group', label: 'Users' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ] as const;

  return (
    <View style={{ position: 'relative', backgroundColor: colors.background.surface, borderTopWidth: 1, borderTopColor: colors.border.light, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[3], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <TouchableOpacity key={item.key} accessibilityRole="button" activeOpacity={0.85} onPress={() => onChange?.(item.key)} style={{ alignItems: 'center', gap: 4, paddingVertical: spacing[1], paddingHorizontal: spacing[2] }}>
            <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={active ? colors.primary.DEFAULT : colors.text.muted} />
            <Text style={{ fontSize: 10, fontFamily: typography.fontFamily.medium, color: active ? colors.primary.DEFAULT : colors.text.muted }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={{ position: 'absolute', top: -24, alignSelf: 'center' }}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={onCreatePress}
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}>
          <MaterialIcons name="add" size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
