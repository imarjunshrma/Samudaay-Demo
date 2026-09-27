import { Image, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventChatBubble({
  name,
  time,
  avatar,
  message,
}: {
  name: string;
  time: string;
  avatar: string;
  message: string;
}) {
  const visibleMessage = message.trim();

  return (
    <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start' }}>
      <Image source={{ uri: avatar }} resizeMode="cover" style={{ width: 36, height: 36, borderRadius: radius.full, borderWidth: 1, borderColor: colors.primary.borderLight }} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>{name}</Text>
          <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>{time}</Text>
        </View>
        {visibleMessage ? (
          <View style={{ borderRadius: radius.xl, borderTopLeftRadius: 4, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
            <Text variant="caption" color={colors.text.primary} style={{ lineHeight: 20, fontSize: 14 }}>{visibleMessage}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
