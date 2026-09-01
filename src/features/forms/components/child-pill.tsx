import { Image, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

type ChildPillProps = {
  name: string;
  image: string;
  selected?: boolean;
  isNew?: boolean;
  onPress?: () => void;
};

export function ChildPill({ name, image, selected = false, isNew = false, onPress }: ChildPillProps) {
  if (isNew) {
    return (
      <Pressable onPress={onPress} style={{ alignItems: 'center', gap: spacing[3] }}>
        <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.subtle }}>
          <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
        </View>
        <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.medium }}>
          {name}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', gap: spacing[3] }}>
      <View style={{ position: 'relative', padding: 4, borderRadius: radius.full, borderWidth: 2, borderColor: selected ? colors.primary.DEFAULT : 'transparent', backgroundColor: selected ? colors.primary.subtle : 'transparent' }}>
        {image ? (
          <Image source={{ uri: image }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: radius.full }} />
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.background.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="child-care" size={28} color={colors.primary.DEFAULT} />
          </View>
        )}
        {selected ? (
          <View style={{ position: 'absolute', right: -2, bottom: -2, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, padding: 2 }}>
            <MaterialIcons name="check-circle" size={14} color="#ffffff" />
          </View>
        ) : null}
      </View>
      <Text variant="caption" color={selected ? colors.text.primary : colors.text.muted} style={{ fontFamily: selected ? typography.fontFamily.bold : typography.fontFamily.medium }}>
        {name}
      </Text>
    </Pressable>
  );
}
