import { Image, View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors } from '@/src/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizeMap: Record<AvatarSize, number> = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 64,
  xl: 80,
  '2xl': 128,
};

export function Avatar({
  uri,
  name,
  size = 'md',
}: {
  uri?: string;
  name: string;
  size?: AvatarSize;
}) {
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: colors.primary.muted,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: dimension, height: dimension }} resizeMode="cover" />
      ) : (
        <Text variant={size === '2xl' ? 'h3' : 'h5'} color={colors.primary.DEFAULT}>
          {initials}
        </Text>
      )}
    </View>
  );
}
