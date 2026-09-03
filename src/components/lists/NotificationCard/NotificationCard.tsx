import { Image, Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type NotificationCardVariant = 'default' | 'unread' | 'media' | 'muted';

export interface NotificationCardProps {
  title: string;
  description: string;
  time: string;
  tag?: string;
  image?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  variant?: NotificationCardVariant;
  onPress?: () => void;
}

export function NotificationCard({
  title,
  description,
  time,
  tag,
  image,
  icon = 'campaign',
  variant = 'default',
  onPress,
}: NotificationCardProps) {
  if (variant === 'media' && image) {
    return (
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          gap: spacing[4],
          alignItems: 'center',
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          backgroundColor: '#ffffff',
          padding: spacing[4],
          opacity: pressed ? 0.94 : 1,
        })}>
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            backgroundColor: colors.background.elevated,
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            {tag ? (
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
                {tag}
              </Text>
            ) : <View />}
            <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>{time}</Text>
          </View>
          <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>{title}</Text>
          <Text variant="caption" color="#64748b" style={{ lineHeight: 18 }}>{description}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: variant === 'unread' ? colors.primary.border : variant === 'muted' ? 'transparent' : '#f1f5f9',
        backgroundColor: variant === 'unread' ? 'rgba(24,168,117,0.05)' : variant === 'muted' ? 'rgba(241,245,249,0.5)' : '#ffffff',
        padding: spacing[4],
        opacity: variant === 'muted' ? 0.8 : 1,
      }}>
      {image ? (
        <Image source={{ uri: image }} resizeMode="cover" style={{ width: 48, height: 48, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight }} />
      ) : (
        <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: variant === 'muted' ? '#e2e8f0' : colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={24} color={variant === 'muted' ? '#64748b' : colors.primary.DEFAULT} />
        </View>
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="caption" color={variant === 'muted' ? '#475569' : colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            {title}
          </Text>
          <Text variant="caption" color="#94a3b8" style={{ fontSize: 10, fontFamily: typography.fontFamily.medium }}>
            {time}
          </Text>
        </View>
        <Text variant="caption" color={variant === 'muted' ? '#6b7280' : '#64748b'} style={{ lineHeight: 18 }}>
          {description}
        </Text>
        {tag ? (
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
            {tag}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
