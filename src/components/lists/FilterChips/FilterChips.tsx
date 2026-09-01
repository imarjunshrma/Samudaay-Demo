import { Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/theme';

export function FilterChips({
  items,
  activeKey,
  activeKeys,
  onPress,
  scrollable = false,
  showIcons = false,
}: {
  items: { key: string; label: string; icon?: React.ComponentProps<typeof MaterialIcons>['name'] }[];
  activeKey: string;
  activeKeys?: string[];
  onPress: (key: string) => void;
  scrollable?: boolean;
  showIcons?: boolean;
  showChevron?: boolean;
}) {
  const content = (
    <>
      {items.map((item) => {
        const active = activeKeys ? activeKeys.includes(item.key) : item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item.key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
              borderWidth: 1,
              borderRadius: radius.full,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
              borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
              backgroundColor: active ? colors.primary.muted : colors.background.surface,
            }}>
            {showIcons && item.icon ? (
              <MaterialIcons name={item.icon} size={16} color={colors.primary.DEFAULT} />
            ) : null}
            <Text variant="caption" color={active ? colors.primary.DEFAULT : colors.text.primary}>{item.label}</Text>
          </Pressable>
        );
      })}
    </>
  );

  return (
    scrollable ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing[2], paddingRight: spacing[4] }}>
        {content}
      </ScrollView>
    ) : (
      <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>{content}</View>
    )
  );
}
