import { Pressable, View } from 'react-native';

import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { Badge, Icon, Text } from '@/src/components/ui';
import { colors, layout, spacing } from '@/src/theme';

import type { UserBottomBarProps } from './UserBottomBar.types';

export function UserBottomBar({ items, activeKey, onItemPress }: UserBottomBarProps) {
  const bottomInset = useBottomSafeSpacing();

  return (
    <View
      style={{
        minHeight: layout.bottomBarHeight + bottomInset,
        paddingBottom: bottomInset,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.background.surface,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
      }}>
      {items.map((item) => {
        const active = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => onItemPress(item)}
            style={{ alignItems: 'center', justifyContent: 'center', gap: spacing[1], minWidth: 64 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={item.icon} size="bottomBar" color={active ? colors.primary.DEFAULT : '#9ca3af'} />
              {item.badge ? <Badge label={String(item.badge)} variant="warning" /> : null}
            </View>
            <Text variant="navLabel" color={active ? colors.primary.DEFAULT : '#9ca3af'}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
