import { Image, Pressable, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventGalleryTile({
  uri,
  label,
  badge,
}: {
  uri: string;
  label?: string;
  badge?: string;
}) {
  return (
    <Pressable style={{ width: '48%', aspectRatio: 1, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.primary.subtle }}>
      <Image source={{ uri }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      {label ? (
        <View style={{ position: 'absolute', left: spacing[3], right: spacing[3], bottom: spacing[3] }}>
          <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.medium }}>{label}</Text>
        </View>
      ) : null}
      {badge ? (
        <View style={{ position: 'absolute', top: spacing[2], right: spacing[2], borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[2], paddingVertical: 4 }}>
          <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase' }}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
