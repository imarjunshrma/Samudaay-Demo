import { Image, View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors, spacing, typography } from '@/src/theme';

export interface StoryAvatarProps {
  label: string;
  image: string;
  active?: boolean;
}

export function StoryAvatar({ label, image, active = false }: StoryAvatarProps) {
  return (
    <View style={{ alignItems: 'center', gap: spacing[2], minWidth: 72 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          padding: 4,
          backgroundColor: active ? 'rgba(242,120,13,0.2)' : 'rgba(242,120,13,0.05)',
          borderWidth: active ? 2 : 1,
          borderColor: active ? colors.primary.DEFAULT : colors.primary.border,
        }}>
        <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: 28 }} />
      </View>
      <Text
        variant="caption"
        color={active ? colors.text.primary : '#64748b'}
        style={{ fontSize: 12, fontFamily: active ? typography.fontFamily.semibold : typography.fontFamily.medium }}>
        {label}
      </Text>
    </View>
  );
}
