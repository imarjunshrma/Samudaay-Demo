import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventAddOnCard({
  title,
  subtitle,
  quantity,
  selected = true,
  onToggle,
  onIncrement,
  onDecrement,
}: {
  title: string;
  subtitle: string;
  quantity: number;
  selected?: boolean;
  onToggle?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) {
  return (
    <Card variant="default" padding="md">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
          <Pressable onPress={onToggle} style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: selected ? colors.primary.DEFAULT : '#cbd5e1', backgroundColor: selected ? 'rgba(24,168,117,0.12)' : '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
            {selected ? <MaterialIcons name="check" size={14} color={colors.primary.DEFAULT} /> : null}
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>{title}</Text>
            <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>{subtitle}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <Pressable onPress={onDecrement} style={{ width: 32, height: 32, borderRadius: radius.full, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <Text variant="body" color="#94a3b8" style={{ fontFamily: typography.fontFamily.bold }}>-</Text>
          </Pressable>
          <Text variant="body" color={colors.text.primary} style={{ width: 16, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>{quantity}</Text>
          <Pressable onPress={onIncrement} style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(24,168,117,0.1)' }}>
            <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>+</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
